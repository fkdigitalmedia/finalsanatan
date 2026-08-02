/**
 * Server-only helpers backing the analytics BI server functions.
 * Keeps `analytics-bi.functions.ts` a thin wrapper.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { loadDashboard } from "./dashboard";
import { buildReport, type ReportType } from "./reports";
import { renderExport } from "./export";
import { evaluateAllRules, type AlertEvaluation } from "./alerts";
import { getCohorts, type CohortMetric, type CohortPeriod } from "./cohorts";
import { resolveRange, sanitizeFilters } from "./validators";
import type { AlertRule, AnalyticsFilters, Granularity, RangeInput } from "./types";

export type Sbc = SupabaseClient<Database>;

export type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

/** Server functions must return plainly serializable data. */
export function serializable<T>(value: T): Json {
  return JSON.parse(JSON.stringify(value ?? null)) as Json;
}

export async function assertStaff(sb: Sbc, userId: string): Promise<void> {
  const { data } = await sb.rpc("is_staff", { _user_id: userId });
  if (!data) throw new Error("Forbidden: staff role required");
}

export interface BiQuery extends RangeInput {
  dashboard?: string;
  granularity?: Granularity;
  filters?: AnalyticsFilters;
}

export async function runDashboard(sb: Sbc, input: BiQuery) {
  const range = resolveRange(input);
  return loadDashboard(
    sb,
    input.dashboard ?? "overview",
    range,
    sanitizeFilters(input.filters),
    input.granularity,
  );
}

export async function runCohorts(
  sb: Sbc,
  input: BiQuery & { metric?: CohortMetric; period?: CohortPeriod; periods?: number },
) {
  const range = resolveRange(input);
  return getCohorts(sb, range, {
    metric: input.metric,
    period: input.period,
    periods: input.periods,
    filters: sanitizeFilters(input.filters),
  });
}

export async function runReport(sb: Sbc, input: BiQuery & { type?: ReportType }) {
  const range = resolveRange(input);
  return buildReport(sb, input.type ?? "overview", range, sanitizeFilters(input.filters));
}

export async function runExport(
  sb: Sbc,
  input: BiQuery & { type?: ReportType; format?: "csv" | "json" | "xlsx" | "pdf" },
) {
  const table = await runReport(sb, input);
  return renderExport({
    format: input.format ?? "csv",
    filename: `sanatantools-${table.key}-${new Date().toISOString().slice(0, 10)}`,
    title: table.title,
    columns: table.columns,
    rows: table.rows,
  });
}

export async function runAlerts(sb: Sbc, persist: boolean): Promise<AlertEvaluation[]> {
  const { data } = await sb.from("analytics_alerts").select("*").limit(100);
  const rules = (data ?? []) as unknown as AlertRule[];
  const results = await evaluateAllRules(sb, rules);

  if (persist) {
    const fired = results.filter((r) => r.triggered);
    if (fired.length) {
      await sb.from("alert_events").insert(
        fired.map((r) => ({
          alert_id: r.ruleId,
          value: r.value,
          payload: { message: r.message, kind: r.kind, threshold: r.threshold },
        })) as never,
      );
    }
  }
  return results;
}

export async function writeAudit(
  sb: Sbc,
  userId: string,
  action: string,
  meta: Record<string, unknown>,
): Promise<void> {
  try {
    await sb.from("audit_logs").insert({
      actor_user_id: userId,
      action,
      resource_type: "analytics",
      meta,
    } as never);
  } catch {
    /* auditing must never break a read */
  }
}
