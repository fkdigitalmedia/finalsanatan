/**
 * AI analytics — provider/model usage, tokens, cost, latency, failures.
 * Sources `ai_usage_logs` (written by the AI router) plus AI events.
 */

import { bucketOf, bucketsFor } from "./engine";
import { fillSeries, mean, pctOf, percentile, round, sum } from "./metrics";
import { autoGranularity } from "./validators";
import type { AnalyticsFilters, BreakdownRow, DateRange, Granularity, Point, Sb } from "./types";

interface UsageRow {
  provider_name: string | null;
  model_name: string | null;
  feature_key: string | null;
  input_tokens: number | null;
  output_tokens: number | null;
  total_tokens: number | null;
  latency_ms: number | null;
  cost_estimate: number | null;
  success: boolean;
  error_message: string | null;
  created_at: string;
}

export interface AiAnalyticsResult {
  totals: {
    requests: number;
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
    avg_tokens: number;
    cost: number;
    cost_today: number;
    cost_month: number;
    avg_latency: number;
    p95_latency: number;
    failure_rate: number;
    fallback_rate: number;
  };
  costSeries: Point[];
  requestSeries: Point[];
  byProvider: BreakdownRow[];
  byModel: BreakdownRow[];
  byFeature: BreakdownRow[];
  topErrors: { message: string; count: number }[];
}

export async function getAiAnalytics(
  sb: Sb,
  range: DateRange,
  filters: AnalyticsFilters = {},
  granularity?: Granularity,
): Promise<AiAnalyticsResult> {
  const gran = autoGranularity(range, granularity);
  let q = sb
    .from("ai_usage_logs")
    .select(
      "provider_name,model_name,feature_key,input_tokens,output_tokens,total_tokens,latency_ms,cost_estimate,success,error_message,created_at",
    )
    .gte("created_at", range.from.toISOString())
    .lt("created_at", range.to.toISOString())
    .limit(50_000);
  if (filters.aiProvider) q = q.eq("provider_name", filters.aiProvider);

  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  const [{ data }, monthRes, todayRes] = await Promise.all([
    q,
    sb
      .from("ai_usage_logs")
      .select("cost_estimate")
      .gte("created_at", monthStart.toISOString())
      .limit(50_000),
    sb
      .from("ai_usage_logs")
      .select("cost_estimate")
      .gte("created_at", todayStart.toISOString())
      .limit(50_000),
  ]);

  const rows = (data ?? []) as UsageRow[];
  const cost = (r: { cost_estimate: number | null }) => Number(r.cost_estimate ?? 0);
  const failures = rows.filter((r) => !r.success);
  const fallbacks = rows.filter(
    (r) => (r.feature_key ?? "").includes("fallback") || (Boolean(r.error_message) && r.success),
  );
  const latencies = rows.map((r) => Number(r.latency_ms ?? 0)).filter((n) => n > 0);

  const costBuckets = new Map<string, number>();
  const reqBuckets = new Map<string, number>();
  for (const r of rows) {
    const b = bucketOf(r.created_at, gran);
    costBuckets.set(b, (costBuckets.get(b) ?? 0) + cost(r));
    reqBuckets.set(b, (reqBuckets.get(b) ?? 0) + 1);
  }
  const buckets = bucketsFor(range, gran);

  const group = (keyOf: (r: UsageRow) => string) => {
    const map = new Map<string, { requests: number; cost: number; tokens: number }>();
    for (const r of rows) {
      const k = keyOf(r) || "unknown";
      const cur = map.get(k) ?? { requests: 0, cost: 0, tokens: 0 };
      cur.requests += 1;
      cur.cost += cost(r);
      cur.tokens += Number(r.total_tokens ?? 0);
      map.set(k, cur);
    }
    return [...map.entries()]
      .sort((a, b) => b[1].requests - a[1].requests)
      .slice(0, 15)
      .map<BreakdownRow>(([key, v]) => ({
        key,
        label: `${key} · ${round(v.cost, 4)} · ${v.tokens} tok`,
        value: v.requests,
        pct: pctOf(v.requests, rows.length),
      }));
  };

  const errorCounts = new Map<string, number>();
  for (const f of failures) {
    const msg = (f.error_message ?? "Unknown error").slice(0, 160);
    errorCounts.set(msg, (errorCounts.get(msg) ?? 0) + 1);
  }

  const totalTokens = sum(rows.map((r) => Number(r.total_tokens ?? 0)));

  return {
    totals: {
      requests: rows.length,
      input_tokens: sum(rows.map((r) => Number(r.input_tokens ?? 0))),
      output_tokens: sum(rows.map((r) => Number(r.output_tokens ?? 0))),
      total_tokens: totalTokens,
      avg_tokens: Math.round(rows.length ? totalTokens / rows.length : 0),
      cost: round(sum(rows.map(cost)), 4),
      cost_today: round(sum((todayRes.data ?? []).map(cost)), 4),
      cost_month: round(sum((monthRes.data ?? []).map(cost)), 4),
      avg_latency: Math.round(mean(latencies)),
      p95_latency: Math.round(percentile(latencies, 95)),
      failure_rate: pctOf(failures.length, rows.length),
      fallback_rate: pctOf(fallbacks.length, rows.length),
    },
    costSeries: fillSeries(
      [...costBuckets.entries()].map(([t, v]) => ({ t, value: round(v, 4) })),
      buckets,
    ),
    requestSeries: fillSeries(
      [...reqBuckets.entries()].map(([t, value]) => ({ t, value })),
      buckets,
    ),
    byProvider: group((r) => r.provider_name ?? "unknown"),
    byModel: group((r) => r.model_name ?? "unknown"),
    byFeature: group((r) => r.feature_key ?? "unknown"),
    topErrors: [...errorCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([message, count]) => ({ message, count })),
  };
}
