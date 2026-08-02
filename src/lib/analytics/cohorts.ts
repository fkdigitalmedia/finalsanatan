/**
 * Cohort analytics — signup cohorts tracked across activity, revenue and tools.
 */

import { fetchEvents } from "./engine";
import { pctOf, round } from "./metrics";
import type { AnalyticsFilters, CohortRow, DateRange, Sb } from "./types";

export type CohortMetric = "retention" | "engagement" | "revenue" | "tool_usage" | "subscription";
export type CohortPeriod = "day" | "week" | "month";

const PERIOD_MS: Record<CohortPeriod, number> = {
  day: 86_400_000,
  week: 7 * 86_400_000,
  month: 30 * 86_400_000,
};

function cohortLabel(d: Date, period: CohortPeriod): string {
  if (period === "month") return d.toISOString().slice(0, 7);
  if (period === "week") {
    const day = (d.getUTCDay() + 6) % 7;
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - day))
      .toISOString()
      .slice(0, 10);
  }
  return d.toISOString().slice(0, 10);
}

export interface CohortResult {
  metric: CohortMetric;
  period: CohortPeriod;
  periods: number;
  rows: CohortRow[];
}

export async function getCohorts(
  sb: Sb,
  range: DateRange,
  opts: {
    metric?: CohortMetric;
    period?: CohortPeriod;
    periods?: number;
    filters?: AnalyticsFilters;
  } = {},
): Promise<CohortResult> {
  const metric = opts.metric ?? "retention";
  const period = opts.period ?? "week";
  const periods = Math.max(2, Math.min(12, opts.periods ?? 8));
  const filters = opts.filters ?? {};

  const { data: profiles } = await sb
    .from("profiles")
    .select("id,created_at")
    .gte("created_at", range.from.toISOString())
    .lt("created_at", range.to.toISOString())
    .limit(20_000);

  const signups = profiles ?? [];
  if (!signups.length) return { metric, period, periods, rows: [] };

  // Activity window extends `periods` beyond the cohort range.
  const activityRange: DateRange = {
    from: range.from,
    to: new Date(Math.min(Date.now(), range.to.getTime() + periods * PERIOD_MS[period])),
    days: range.days,
  };

  const events = await fetchEvents(sb, activityRange, filters);
  const orders =
    metric === "revenue" || metric === "subscription"
      ? ((
          await sb
            .from("orders")
            .select("user_id,amount_cents,status,created_at")
            .in("status", ["paid", "captured", "completed", "succeeded"])
            .gte("created_at", activityRange.from.toISOString())
            .limit(20_000)
        ).data ?? [])
      : [];

  const cohortOf = new Map<string, string>();
  const startOf = new Map<string, number>();
  const buckets = new Map<string, string[]>();
  for (const p of signups) {
    const label = cohortLabel(new Date(p.created_at), period);
    cohortOf.set(p.id, label);
    startOf.set(p.id, new Date(p.created_at).getTime());
    const list = buckets.get(label) ?? [];
    list.push(p.id);
    buckets.set(label, list);
  }

  // matrix[cohort][offset] = accumulated value
  const matrix = new Map<string, number[]>();
  const seen = new Map<string, Set<string>>(); // dedupe users per cohort/offset

  const add = (userId: string, at: string, value: number, dedupe: boolean) => {
    const cohort = cohortOf.get(userId);
    const start = startOf.get(userId);
    if (!cohort || start === undefined) return;
    const offset = Math.floor((new Date(at).getTime() - start) / PERIOD_MS[period]);
    if (offset < 0 || offset >= periods) return;
    const key = `${cohort}:${offset}:${userId}`;
    if (dedupe) {
      const set = seen.get(cohort) ?? new Set<string>();
      if (set.has(key)) return;
      set.add(key);
      seen.set(cohort, set);
    }
    const row = matrix.get(cohort) ?? new Array<number>(periods).fill(0);
    row[offset] += value;
    matrix.set(cohort, row);
  };

  if (metric === "revenue") {
    for (const o of orders) {
      if (o.user_id) add(o.user_id, o.created_at, Number(o.amount_cents ?? 0) / 100, false);
    }
  } else if (metric === "subscription") {
    for (const o of orders) {
      if (o.user_id) add(o.user_id, o.created_at, 1, true);
    }
  } else {
    for (const e of events) {
      if (!e.user_id) continue;
      if (metric === "tool_usage" && !e.tool_slug) continue;
      add(e.user_id, e.created_at, 1, metric !== "engagement");
    }
  }

  const rows: CohortRow[] = [...buckets.entries()]
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .slice(0, 20)
    .map(([cohort, users]) => {
      const values = matrix.get(cohort) ?? new Array<number>(periods).fill(0);
      return {
        cohort,
        size: users.length,
        values: values.map((v) => round(v, 2)),
        pct: values.map((v) => pctOf(v, users.length)),
      };
    });

  return { metric, period, periods, rows };
}
