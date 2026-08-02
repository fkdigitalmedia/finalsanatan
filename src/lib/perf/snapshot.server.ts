// ============================================================
// Performance snapshot — server-only aggregation
// ------------------------------------------------------------
// Collects everything the admin performance dashboard renders:
// health rollup, cache hit rates, latency percentiles, database
// load signals and budget grades. Read-only; no side effects.
// ============================================================

import { fullStatus, type HealthReport } from "@/lib/health/checks.server";
import { cacheOverview, type CacheOverview } from "@/lib/cache";
import {
  ALL_GROUPS,
  BUDGETS,
  gradeBudget,
  groupSummary,
  metricsUptimeSeconds,
  type BudgetVerdict,
  type GroupSummary,
} from "@/lib/perf";

export interface BudgetStatus {
  key: string;
  label: string;
  targetMs: number;
  actualMs: number | null;
  verdict: BudgetVerdict;
}

export interface DatabaseLoad {
  pendingNotifications: number | null;
  queuedTranslations: number | null;
  aiCallsLast24h: number | null;
  aiCostLast24h: number | null;
  reportsLast24h: number | null;
}

export interface PerformanceSnapshot {
  generatedAt: string;
  uptimeSeconds: number;
  health: HealthReport;
  cache: CacheOverview[];
  cacheHitRate: number;
  metrics: GroupSummary[];
  budgets: BudgetStatus[];
  database: DatabaseLoad;
}

/** Map a metric group onto the budget it should be graded against. */
function actualForBudget(key: string): number | null {
  const api = groupSummary("api");
  switch (key) {
    case "api":
      return api.count > 0 ? api.avgMs : null;
    case "api-cached": {
      const cached = api.operations.find((o) => o.name.endsWith(":cached"));
      return cached ? cached.avgMs : null;
    }
    case "pdf": {
      const pdf = groupSummary("pdf");
      return pdf.count > 0 ? pdf.avgMs : null;
    }
    case "ai": {
      const ai = groupSummary("ai");
      return ai.count > 0 ? ai.avgMs : null;
    }
    case "homepage":
    case "tool-page": {
      const ssr = groupSummary("ssr");
      const op = ssr.operations.find((o) => (key === "homepage" ? o.name === "/" : o.name !== "/"));
      return op ? op.avgMs : null;
    }
    default:
      return null;
  }
}

function budgetStatuses(): BudgetStatus[] {
  return BUDGETS.map((budget) => {
    const actualMs = actualForBudget(budget.key);
    return {
      key: budget.key,
      label: budget.label,
      targetMs: budget.targetMs,
      actualMs,
      verdict: gradeBudget(budget, actualMs),
    };
  });
}

async function databaseLoad(supabase: { from: (t: string) => any }): Promise<DatabaseLoad> {
  const since = new Date(Date.now() - 24 * 60 * 60_000).toISOString();

  const [pending, translations, aiLogs, reports] = await Promise.all([
    supabase
      .from("notification_queue")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("translation_queue")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("ai_usage_logs")
      .select("cost_usd, latency_ms, created_at")
      .gte("created_at", since)
      .limit(1000),
    supabase
      .from("pdf_reports")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since),
  ]);

  const logs = (aiLogs?.data ?? []) as Array<{ cost_usd: number | null }>;
  const cost = logs.reduce((sum, row) => sum + (Number(row.cost_usd) || 0), 0);

  return {
    pendingNotifications: pending?.count ?? null,
    queuedTranslations: translations?.count ?? null,
    aiCallsLast24h: logs.length || null,
    aiCostLast24h: logs.length ? Math.round(cost * 10000) / 10000 : null,
    reportsLast24h: reports?.count ?? null,
  };
}

export async function buildPerformanceSnapshot(supabase: {
  from: (t: string) => any;
}): Promise<PerformanceSnapshot> {
  const [health, database] = await Promise.all([
    fullStatus(),
    databaseLoad(supabase).catch(() => ({
      pendingNotifications: null,
      queuedTranslations: null,
      aiCallsLast24h: null,
      aiCostLast24h: null,
      reportsLast24h: null,
    })),
  ]);

  const cache = cacheOverview();
  const totals = cache.reduce(
    (acc, c) => {
      acc.hits += c.stats.hits;
      acc.misses += c.stats.misses;
      return acc;
    },
    { hits: 0, misses: 0 },
  );
  const totalLookups = totals.hits + totals.misses;

  return {
    generatedAt: new Date().toISOString(),
    uptimeSeconds: metricsUptimeSeconds(),
    health,
    cache,
    cacheHitRate: totalLookups === 0 ? 0 : totals.hits / totalLookups,
    metrics: ALL_GROUPS.map(groupSummary).filter((g) => g.count > 0),
    budgets: budgetStatuses(),
    database,
  };
}
