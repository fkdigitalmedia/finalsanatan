/**
 * Enterprise BI server functions (Phase 14.9).
 * Thin wrappers — all logic lives in `@/lib/analytics/bi.server`.
 */

import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  assertStaff,
  runAlerts,
  runCohorts,
  runDashboard,
  runExport,
  runReport,
  serializable,
  writeAudit,
  type BiQuery,
} from "@/lib/analytics/bi.server";
import type { ReportType } from "@/lib/analytics/reports";
import type { CohortMetric, CohortPeriod } from "@/lib/analytics/cohorts";

export const getBiDashboard = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => (raw ?? {}) as BiQuery)
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);
    return serializable(await runDashboard(context.supabase, data));
  });

export const getBiCohorts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (raw: unknown) =>
      (raw ?? {}) as BiQuery & { metric?: CohortMetric; period?: CohortPeriod; periods?: number },
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);
    return serializable(await runCohorts(context.supabase, data));
  });

export const getBiReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => (raw ?? {}) as BiQuery & { type?: ReportType })
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);
    return serializable(await runReport(context.supabase, data));
  });

export const exportBiReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (raw: unknown) =>
      (raw ?? {}) as BiQuery & { type?: ReportType; format?: "csv" | "json" | "xlsx" | "pdf" },
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);
    const rendered = await runExport(context.supabase, data);
    await writeAudit(context.supabase, context.userId, "analytics.export", {
      type: data.type ?? "overview",
      format: data.format ?? "csv",
    });
    return {
      filename: rendered.filename,
      contentType: rendered.contentType,
      content: rendered.content,
    };
  });

export const evaluateBiAlerts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => (raw ?? {}) as { persist?: boolean })
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);
    return serializable(await runAlerts(context.supabase, data.persist === true));
  });
