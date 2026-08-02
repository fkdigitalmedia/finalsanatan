/**
 * SEO analytics — organic traffic, landing pages, queries, devices, countries.
 * First-party only (no Search Console dependency); GSC data, when connected,
 * is merged in by the admin SEO tab.
 */

import { EVENTS } from "./constants";
import { breakdownFrom, bucketOf, bucketsFor, fetchEvents } from "./engine";
import { fillSeries, pctOf, round } from "./metrics";
import { autoGranularity } from "./validators";
import type { AnalyticsFilters, BreakdownRow, DateRange, Granularity, Point, Sb } from "./types";

const SEARCH_ENGINES = [
  "google",
  "bing",
  "duckduckgo",
  "yahoo",
  "yandex",
  "baidu",
  "ecosia",
  "brave",
];

function isOrganic(referrer: string | null): boolean {
  if (!referrer) return false;
  const r = referrer.toLowerCase();
  return SEARCH_ENGINES.some((e) => r.includes(e));
}

export interface SeoAnalyticsResult {
  totals: {
    organic_visits: number;
    organic_share: number;
    indexed_pages: number;
    total_pageviews: number;
    internal_searches: number;
    zero_result_searches: number;
  };
  organicSeries: Point[];
  topPages: BreakdownRow[];
  topLandingPages: BreakdownRow[];
  topCountries: BreakdownRow[];
  topDevices: BreakdownRow[];
  topReferrers: BreakdownRow[];
  internalSearchTerms: { term: string; count: number; avgResults: number }[];
}

export async function getSeoAnalytics(
  sb: Sb,
  range: DateRange,
  filters: AnalyticsFilters = {},
  granularity?: Granularity,
): Promise<SeoAnalyticsResult> {
  const gran = autoGranularity(range, granularity);

  const [events, sessionsRes, searchRes] = await Promise.all([
    fetchEvents(sb, range, filters, { events: [EVENTS.PAGEVIEW] }),
    sb
      .from("analytics_sessions")
      .select("entry_path,referrer,country,device,started_at")
      .gte("started_at", range.from.toISOString())
      .lt("started_at", range.to.toISOString())
      .limit(20_000),
    sb
      .from("search_queries")
      .select("query,results_count,created_at")
      .gte("created_at", range.from.toISOString())
      .lt("created_at", range.to.toISOString())
      .limit(20_000),
  ]);

  const sessions = sessionsRes.data ?? [];
  const organicSessions = sessions.filter((s) => isOrganic(s.referrer));
  const organicEvents = events.filter((e) => isOrganic(e.referrer));

  const buckets = new Map<string, number>();
  for (const s of organicSessions) {
    const b = bucketOf(s.started_at, gran);
    buckets.set(b, (buckets.get(b) ?? 0) + 1);
  }

  const searches = searchRes.data ?? [];
  const termMap = new Map<string, { count: number; results: number[] }>();
  for (const s of searches) {
    const term = (s.query ?? "").trim().toLowerCase();
    if (!term) continue;
    const cur = termMap.get(term) ?? { count: 0, results: [] };
    cur.count += 1;
    cur.results.push(Number(s.results_count ?? 0));
    termMap.set(term, cur);
  }

  return {
    totals: {
      organic_visits: organicSessions.length,
      organic_share: pctOf(organicSessions.length, sessions.length),
      indexed_pages: new Set(events.map((e) => e.path).filter(Boolean)).size,
      total_pageviews: events.length,
      internal_searches: searches.length,
      zero_result_searches: searches.filter((s) => Number(s.results_count ?? 0) === 0).length,
    },
    organicSeries: fillSeries(
      [...buckets.entries()].map(([t, value]) => ({ t, value })),
      bucketsFor(range, gran),
    ),
    topPages: breakdownFrom(events, "path", 20),
    topLandingPages: breakdownFrom(organicSessions, "entry_path", 20),
    topCountries: breakdownFrom(organicEvents.length ? organicEvents : events, "country", 15),
    topDevices: breakdownFrom(organicEvents.length ? organicEvents : events, "device", 6),
    topReferrers: breakdownFrom(
      sessions.filter((s) => s.referrer).map((s) => ({ host: hostOf(s.referrer) })),
      "host",
      15,
    ),
    internalSearchTerms: [...termMap.entries()]
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 25)
      .map(([term, v]) => ({
        term,
        count: v.count,
        avgResults: round(v.results.reduce((a, b) => a + b, 0) / v.results.length, 1),
      })),
  };
}

function hostOf(ref: string | null): string {
  if (!ref) return "Direct";
  try {
    return new URL(ref).hostname.replace(/^www\./, "");
  } catch {
    return "Direct";
  }
}
