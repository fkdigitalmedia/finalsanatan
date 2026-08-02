/**
 * User & audience analytics — acquisition, activity, geography, technology.
 */

import { EVENTS } from "./constants";
import {
  breakdownFrom,
  bucketOf,
  countEvents,
  distinctActors,
  fetchEvents,
  timeseriesFrom,
} from "./engine";
import { deltaPct, mean, pctOf, round } from "./metrics";
import { autoGranularity, previousRange } from "./validators";
import type { AnalyticsFilters, BreakdownRow, DateRange, Granularity, Point, Sb } from "./types";

export interface UserAnalytics {
  totals: {
    total_users: number;
    new_users: number;
    returning_users: number;
    dau: number;
    wau: number;
    mau: number;
    sessions: number;
    avg_session_duration: number;
    bounce_rate: number;
    pageviews: number;
    pageviews_delta: number | null;
  };
  activeSeries: Point[];
  sessionSeries: Point[];
  breakdowns: {
    countries: BreakdownRow[];
    cities: BreakdownRow[];
    devices: BreakdownRow[];
    browsers: BreakdownRow[];
    os: BreakdownRow[];
    languages: BreakdownRow[];
    referrers: BreakdownRow[];
    utmSources: BreakdownRow[];
  };
}

function referrerHost(ref: string | null): string {
  if (!ref) return "Direct";
  try {
    return new URL(ref).hostname.replace(/^www\./, "");
  } catch {
    return "Direct";
  }
}

export async function getUserAnalytics(
  sb: Sb,
  range: DateRange,
  filters: AnalyticsFilters = {},
  granularity?: Granularity,
): Promise<UserAnalytics> {
  const gran = autoGranularity(range, granularity);
  const prev = previousRange(range);
  const now = Date.now();

  const [events, sessions, totalUsers, newUsers, pageviews, pageviewsPrev, dayEvents, weekEvents] =
    await Promise.all([
      fetchEvents(sb, range, filters),
      sb
        .from("analytics_sessions")
        .select(
          "session_id,user_id,started_at,last_seen_at,pages,is_bounce,country,device,browser,os,lang,referrer",
        )
        .gte("started_at", range.from.toISOString())
        .lt("started_at", range.to.toISOString())
        .limit(20_000),
      sb.from("profiles").select("id", { count: "exact", head: true }),
      sb
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .gte("created_at", range.from.toISOString())
        .lt("created_at", range.to.toISOString()),
      countEvents(sb, range, [EVENTS.PAGEVIEW], filters),
      countEvents(sb, prev, [EVENTS.PAGEVIEW], filters),
      fetchEvents(sb, { from: new Date(now - 86_400_000), to: new Date(now), days: 1 }, filters, {
        limit: 20_000,
      }),
      fetchEvents(
        sb,
        { from: new Date(now - 7 * 86_400_000), to: new Date(now), days: 7 },
        filters,
        { limit: 40_000 },
      ),
    ]);

  const sessionRows = sessions.data ?? [];
  const durations = sessionRows.map(
    (s) => (new Date(s.last_seen_at).getTime() - new Date(s.started_at).getTime()) / 1000,
  );

  // Returning = actors seen in more than one distinct day bucket.
  const perActor = new Map<string, Set<string>>();
  for (const e of events) {
    const actor = e.user_id ?? `s:${e.session_id}`;
    const set = perActor.get(actor) ?? new Set<string>();
    set.add(bucketOf(e.created_at, "day"));
    perActor.set(actor, set);
  }
  const returning = [...perActor.values()].filter((s) => s.size > 1).length;

  return {
    totals: {
      total_users: totalUsers.count ?? 0,
      new_users: newUsers.count ?? 0,
      returning_users: returning,
      dau: distinctActors(dayEvents),
      wau: distinctActors(weekEvents),
      mau: distinctActors(events),
      sessions: sessionRows.length,
      avg_session_duration: round(mean(durations), 1),
      bounce_rate: pctOf(sessionRows.filter((s) => s.is_bounce).length, sessionRows.length),
      pageviews,
      pageviews_delta: deltaPct(pageviews, pageviewsPrev),
    },
    activeSeries: timeseriesFrom(events, range, gran, "session_id"),
    sessionSeries: timeseriesFrom(
      sessionRows.map((s) => ({ ...s, created_at: s.started_at })),
      range,
      gran,
    ),
    breakdowns: {
      countries: breakdownFrom(events, "country"),
      cities: breakdownFrom(events, "city"),
      devices: breakdownFrom(events, "device"),
      browsers: breakdownFrom(events, "browser"),
      os: breakdownFrom(events, "os"),
      languages: breakdownFrom(events, "lang"),
      referrers: breakdownFrom(
        events.map((e) => ({ referrer: referrerHost(e.referrer) })),
        "referrer",
      ),
      utmSources: breakdownFrom(events, "utm_source", 10, "None"),
    },
  };
}

/** Tool-level analytics: views, generations, failures, timing, conversions. */
export async function getToolAnalytics(sb: Sb, range: DateRange, filters: AnalyticsFilters = {}) {
  const events = await fetchEvents(sb, range, filters);
  const map = new Map<
    string,
    {
      views: number;
      generations: number;
      failures: number;
      ms: number[];
      downloads: number;
      premium: number;
    }
  >();

  const ensure = (tool: string) => {
    const existing = map.get(tool);
    if (existing) return existing;
    const fresh = {
      views: 0,
      generations: 0,
      failures: 0,
      ms: [] as number[],
      downloads: 0,
      premium: 0,
    };
    map.set(tool, fresh);
    return fresh;
  };

  for (const e of events) {
    const tool = e.tool_slug ?? (typeof e.meta?.tool === "string" ? (e.meta.tool as string) : null);
    if (!tool) continue;
    const row = ensure(tool);
    const ms = typeof e.meta?.ms === "number" ? (e.meta.ms as number) : null;
    switch (e.event_name) {
      case EVENTS.TOOL_VIEW:
      case EVENTS.PAGEVIEW:
        row.views += 1;
        break;
      case EVENTS.TOOL_FAILED:
        row.failures += 1;
        break;
      case EVENTS.DOWNLOAD:
        row.downloads += 1;
        break;
      case EVENTS.SUBSCRIPTION_PURCHASE:
      case EVENTS.PAYMENT_SUCCESS:
        row.premium += 1;
        break;
      default:
        row.generations += 1;
        if (ms !== null) row.ms.push(ms);
    }
  }

  return [...map.entries()]
    .map(([tool, r]) => ({
      tool,
      views: r.views,
      generations: r.generations,
      failures: r.failures,
      avgExecutionMs: Math.round(mean(r.ms)),
      downloads: r.downloads,
      premiumConversions: r.premium,
      successRate: pctOf(r.generations, r.generations + r.failures),
    }))
    .sort((a, b) => b.generations + b.views - (a.generations + a.views))
    .slice(0, 50);
}
