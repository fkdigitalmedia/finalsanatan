/**
 * Performance analytics — Core Web Vitals, API latency and error tracking.
 */

import { EVENTS } from "./constants";
import { bucketOf, bucketsFor, fetchEvents, metaNumber, metaString } from "./engine";
import { fillSeries, mean, pctOf, percentile, round } from "./metrics";
import { autoGranularity } from "./validators";
import type { AnalyticsFilters, DateRange, Granularity, Point, Sb } from "./types";

export interface VitalStat {
  name: string;
  samples: number;
  p50: number;
  p75: number;
  p95: number;
  goodPct: number;
}

export interface PerformanceResult {
  vitals: VitalStat[];
  errorCount: number;
  errorRate: number;
  topErrors: { message: string; count: number; kind: string }[];
  errorSeries: Point[];
  api: {
    calls: number;
    avgMs: number;
    p95Ms: number;
    errorRate: number;
    topEndpoints: { endpoint: string; calls: number; avgMs: number }[];
  };
}

export async function getPerformanceAnalytics(
  sb: Sb,
  range: DateRange,
  filters: AnalyticsFilters = {},
  granularity?: Granularity,
): Promise<PerformanceResult> {
  const gran = autoGranularity(range, granularity);
  const events = await fetchEvents(sb, range, filters, {
    events: [EVENTS.WEB_VITAL, EVENTS.JS_ERROR, EVENTS.API_CALL, EVENTS.PAGEVIEW],
  });

  const vitalRows = events.filter((e) => e.event_name === EVENTS.WEB_VITAL);
  const errorRows = events.filter((e) => e.event_name === EVENTS.JS_ERROR);
  const apiRows = events.filter((e) => e.event_name === EVENTS.API_CALL);
  const pageviews = events.filter((e) => e.event_name === EVENTS.PAGEVIEW).length;

  const byVital = new Map<string, { values: number[]; good: number }>();
  for (const r of vitalRows) {
    const name = metaString(r.meta, "name") ?? "UNKNOWN";
    const value = metaNumber(r.meta, "value");
    if (value === null) continue;
    const cur = byVital.get(name) ?? { values: [], good: 0 };
    cur.values.push(value);
    if (metaString(r.meta, "rating") === "good") cur.good += 1;
    byVital.set(name, cur);
  }

  const errorCounts = new Map<string, { count: number; kind: string }>();
  for (const r of errorRows) {
    const msg = (metaString(r.meta, "message") ?? "Unknown").slice(0, 160);
    const cur = errorCounts.get(msg) ?? { count: 0, kind: metaString(r.meta, "kind") ?? "error" };
    cur.count += 1;
    errorCounts.set(msg, cur);
  }

  const errBuckets = new Map<string, number>();
  for (const r of errorRows) {
    const b = bucketOf(r.created_at, gran);
    errBuckets.set(b, (errBuckets.get(b) ?? 0) + 1);
  }

  const apiLatencies = apiRows.map((r) => metaNumber(r.meta, "ms") ?? 0).filter((n) => n > 0);
  const apiErrors = apiRows.filter((r) => (metaNumber(r.meta, "status") ?? 200) >= 400).length;
  const endpointMap = new Map<string, number[]>();
  for (const r of apiRows) {
    const ep = metaString(r.meta, "endpoint") ?? "unknown";
    const list = endpointMap.get(ep) ?? [];
    list.push(metaNumber(r.meta, "ms") ?? 0);
    endpointMap.set(ep, list);
  }

  return {
    vitals: [...byVital.entries()].map(([name, v]) => ({
      name,
      samples: v.values.length,
      p50: round(percentile(v.values, 50), 2),
      p75: round(percentile(v.values, 75), 2),
      p95: round(percentile(v.values, 95), 2),
      goodPct: pctOf(v.good, v.values.length),
    })),
    errorCount: errorRows.length,
    errorRate: pctOf(errorRows.length, pageviews),
    topErrors: [...errorCounts.entries()]
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 15)
      .map(([message, v]) => ({ message, count: v.count, kind: v.kind })),
    errorSeries: fillSeries(
      [...errBuckets.entries()].map(([t, value]) => ({ t, value })),
      bucketsFor(range, gran),
    ),
    api: {
      calls: apiRows.length,
      avgMs: Math.round(mean(apiLatencies)),
      p95Ms: Math.round(percentile(apiLatencies, 95)),
      errorRate: pctOf(apiErrors, apiRows.length),
      topEndpoints: [...endpointMap.entries()]
        .sort((a, b) => b[1].length - a[1].length)
        .slice(0, 15)
        .map(([endpoint, list]) => ({
          endpoint,
          calls: list.length,
          avgMs: Math.round(mean(list)),
        })),
    },
  };
}
