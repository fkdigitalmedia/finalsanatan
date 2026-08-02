/**
 * Query engine — low-level primitives every analytics module builds on.
 * Pure functions that receive a Supabase client (RLS-scoped, staff-gated by
 * the calling server function), so this file is safe to import anywhere.
 */

import { MAX_SCAN_ROWS } from "./constants";
import { fillSeries, round } from "./metrics";
import type { AnalyticsFilters, BreakdownRow, DateRange, Granularity, Point, Sb } from "./types";

type EventRow = {
  event_name: string;
  user_id: string | null;
  session_id: string;
  tool_slug: string | null;
  path: string | null;
  referrer: string | null;
  lang: string | null;
  country: string | null;
  device: string | null;
  browser: string | null;
  os: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  meta: Record<string, unknown> | null;
  created_at: string;
};

const EVENT_COLUMNS =
  "event_name,user_id,session_id,tool_slug,path,referrer,lang,country,device,browser,os,utm_source,utm_medium,utm_campaign,meta,created_at";

export interface FetchEventsOptions {
  events?: string[];
  tools?: string[];
  limit?: number;
}

/** Apply dashboard filters that map directly onto event columns. */
function applyFilters<T>(q: T, filters: AnalyticsFilters = {}): T {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = q as any;
  if (filters.country) query = query.eq("country", filters.country);
  if (filters.lang) query = query.eq("lang", filters.lang);
  if (filters.device) query = query.eq("device", filters.device);
  if (filters.tool) query = query.eq("tool_slug", filters.tool);
  if (filters.userType === "registered" || filters.userType === "premium")
    query = query.not("user_id", "is", null);
  if (filters.userType === "guest") query = query.is("user_id", null);
  return query as T;
}

/** Raw event scan for the range, bounded by MAX_SCAN_ROWS. */
export async function fetchEvents(
  sb: Sb,
  range: DateRange,
  filters: AnalyticsFilters = {},
  opts: FetchEventsOptions = {},
): Promise<EventRow[]> {
  let q = sb
    .from("analytics_events")
    .select(EVENT_COLUMNS)
    .gte("created_at", range.from.toISOString())
    .lt("created_at", range.to.toISOString())
    .order("created_at", { ascending: true })
    .limit(Math.min(opts.limit ?? MAX_SCAN_ROWS, MAX_SCAN_ROWS));

  if (opts.events?.length) q = q.in("event_name", opts.events);
  if (opts.tools?.length) q = q.in("tool_slug", opts.tools);
  q = applyFilters(q, filters);

  const { data, error } = await q;
  if (error) throw new Error(`analytics: ${error.message}`);
  return (data ?? []) as unknown as EventRow[];
}

/** Exact count without pulling rows. */
export async function countEvents(
  sb: Sb,
  range: DateRange,
  events: string[],
  filters: AnalyticsFilters = {},
): Promise<number> {
  let q = sb
    .from("analytics_events")
    .select("id", { count: "exact", head: true })
    .gte("created_at", range.from.toISOString())
    .lt("created_at", range.to.toISOString());
  if (events.length === 1) q = q.eq("event_name", events[0]);
  else if (events.length > 1) q = q.in("event_name", events);
  q = applyFilters(q, filters);
  const { count, error } = await q;
  if (error) throw new Error(`analytics: ${error.message}`);
  return count ?? 0;
}

// --- bucketing ---------------------------------------------------------------

export function bucketOf(iso: string, granularity: Granularity): string {
  const d = new Date(iso);
  switch (granularity) {
    case "hour":
      return d.toISOString().slice(0, 13) + ":00";
    case "week": {
      const day = (d.getUTCDay() + 6) % 7; // Monday-based
      const monday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - day));
      return monday.toISOString().slice(0, 10);
    }
    case "month":
      return d.toISOString().slice(0, 7);
    case "day":
    default:
      return d.toISOString().slice(0, 10);
  }
}

export function bucketsFor(range: DateRange, granularity: Granularity): string[] {
  const out: string[] = [];
  const step = granularity === "hour" ? 3_600_000 : 86_400_000;
  const cursor = new Date(range.from.getTime());
  const seen = new Set<string>();
  while (cursor.getTime() <= range.to.getTime()) {
    const b = bucketOf(cursor.toISOString(), granularity);
    if (!seen.has(b)) {
      seen.add(b);
      out.push(b);
    }
    cursor.setTime(cursor.getTime() + step);
  }
  return out;
}

// --- aggregation -------------------------------------------------------------

type Rowish = { created_at: string } & Record<string, unknown>;

/** Count rows per time bucket. `distinctBy` counts unique values instead. */
export function timeseriesFrom(
  rows: Rowish[],
  range: DateRange,
  granularity: Granularity,
  distinctBy?: string,
): Point[] {
  const buckets = new Map<string, Set<string> | number>();
  for (const r of rows) {
    const b = bucketOf(String(r.created_at), granularity);
    if (distinctBy) {
      const set = (buckets.get(b) as Set<string>) ?? new Set<string>();
      const v = r[distinctBy];
      if (v) set.add(String(v));
      buckets.set(b, set);
    } else {
      buckets.set(b, ((buckets.get(b) as number) ?? 0) + 1);
    }
  }
  const points: Point[] = [...buckets.entries()].map(([t, v]) => ({
    t,
    value: typeof v === "number" ? v : v.size,
  }));
  return fillSeries(points, bucketsFor(range, granularity));
}

/** Top-N breakdown for a dimension, with an "Other"/"Unknown" bucket. */
export function breakdownFrom(
  rows: Record<string, unknown>[],
  dimension: string,
  limit = 12,
  unknownLabel = "Unknown",
): BreakdownRow[] {
  const counts = new Map<string, number>();
  for (const r of rows) {
    const raw = r[dimension];
    const key = raw === null || raw === undefined || raw === "" ? unknownLabel : String(raw);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const total = [...counts.values()].reduce((a, b) => a + b, 0);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, value]) => ({
      key,
      label: key,
      value,
      pct: total ? round((value / total) * 100, 1) : 0,
    }));
}

/** Distinct users (falls back to sessions for anonymous traffic). */
export function distinctActors(rows: { user_id: string | null; session_id: string }[]): number {
  const set = new Set<string>();
  for (const r of rows) set.add(r.user_id ?? `s:${r.session_id}`);
  return set.size;
}

export function metaNumber(meta: Record<string, unknown> | null, key: string): number | null {
  const v = meta?.[key];
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) ? n : null;
}

export function metaString(meta: Record<string, unknown> | null, key: string): string | null {
  const v = meta?.[key];
  return typeof v === "string" ? v : v == null ? null : String(v);
}

export type { EventRow };
