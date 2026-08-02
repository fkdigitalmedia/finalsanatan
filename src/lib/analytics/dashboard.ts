/**
 * Dashboard composition — assembles the KPI snapshot, realtime feed and the
 * per-dashboard payloads consumed by the admin console.
 */

import { CACHE_TTL, DASHBOARDS, EVENTS, GENERATION_EVENTS, REVENUE_EVENTS } from "./constants";
import { breakdownFrom, countEvents, distinctActors, fetchEvents, timeseriesFrom } from "./engine";
import { deltaPct, pctOf, round } from "./metrics";
import { getAiAnalytics } from "./ai";
import { getRevenueAnalytics } from "./revenue";
import { getUserAnalytics, getToolAnalytics } from "./users";
import { getFunnel } from "./funnels";
import { getSeoAnalytics } from "./seo";
import { getPerformanceAnalytics } from "./performance";
import { getRetention } from "./retention";
import { autoGranularity, previousRange } from "./validators";
import { withCache, cacheKey } from "./cache";
import type { AnalyticsFilters, DateRange, Granularity, Kpi, Sb } from "./types";

export const dashboards = DASHBOARDS;

export interface OverviewResult {
  range: { from: string; to: string; days: number };
  cards: Record<string, Kpi>;
  series: {
    pageviews: ReturnType<typeof timeseriesFrom>;
    users: ReturnType<typeof timeseriesFrom>;
  };
  topTools: { key: string; label?: string; value: number; pct?: number }[];
  topPages: { key: string; label?: string; value: number; pct?: number }[];
}

export async function getOverview(
  sb: Sb,
  range: DateRange,
  filters: AnalyticsFilters = {},
  granularity?: Granularity,
): Promise<OverviewResult> {
  const gran = autoGranularity(range, granularity);
  const prev = previousRange(range);

  const [events, prevEvents, users, revenue, ai] = await Promise.all([
    fetchEvents(sb, range, filters),
    fetchEvents(sb, prev, filters, { limit: 20_000 }),
    getUserAnalytics(sb, range, filters, gran),
    getRevenueAnalytics(sb, range, gran),
    getAiAnalytics(sb, range, filters, gran),
  ]);

  const countOf = (list: typeof events, names: string[]) =>
    list.filter((e) => names.includes(e.event_name)).length;

  const generations = countOf(events, GENERATION_EVENTS);
  const generationsPrev = countOf(prevEvents, GENERATION_EVENTS);
  const conversions = countOf(events, REVENUE_EVENTS);
  const errors = countOf(events, [EVENTS.JS_ERROR]);
  const pageviews = countOf(events, [EVENTS.PAGEVIEW]);
  const pageviewsPrev = countOf(prevEvents, [EVENTS.PAGEVIEW]);

  const card = (value: number, previous?: number, unit?: Kpi["unit"]): Kpi => ({
    value: round(value, 2),
    delta_pct: previous === undefined ? null : deltaPct(value, previous),
    unit,
  });

  return {
    range: { from: range.from.toISOString(), to: range.to.toISOString(), days: range.days },
    cards: {
      pageviews: card(pageviews, pageviewsPrev),
      sessions: card(users.totals.sessions),
      total_users: card(users.totals.total_users),
      new_users: card(users.totals.new_users),
      returning_users: card(users.totals.returning_users),
      dau: card(users.totals.dau),
      wau: card(users.totals.wau),
      mau: card(users.totals.mau),
      avg_session_duration: card(users.totals.avg_session_duration, undefined, "seconds"),
      bounce_rate: card(users.totals.bounce_rate, undefined, "percent"),
      tool_generations: card(generations, generationsPrev),
      conversions: card(conversions),
      revenue: card(revenue.gross, undefined, "currency"),
      mrr: card(revenue.mrr, undefined, "currency"),
      arr: card(revenue.arr, undefined, "currency"),
      aov: card(revenue.aov, undefined, "currency"),
      ai_requests: card(ai.totals.requests),
      ai_cost: card(ai.totals.cost, undefined, "currency"),
      ai_failure_rate: card(ai.totals.failure_rate, undefined, "percent"),
      js_errors: card(errors),
      conversion_rate: card(pctOf(conversions, users.totals.sessions), undefined, "percent"),
    },
    series: {
      pageviews: timeseriesFrom(
        events.filter((e) => e.event_name === EVENTS.PAGEVIEW),
        range,
        gran,
      ),
      users: timeseriesFrom(events, range, gran, "session_id"),
    },
    topTools: breakdownFrom(
      events.filter((e) => e.tool_slug),
      "tool_slug",
      12,
    ),
    topPages: breakdownFrom(
      events.filter((e) => e.event_name === EVENTS.PAGEVIEW),
      "path",
      12,
    ),
  };
}

export interface RealtimeResult {
  activeUsers: number;
  activeSessions: number;
  pageviewsLastHour: number;
  toolRunsLastHour: number;
  aiRequestsLastHour: number;
  revenueLastHour: number;
  currency: string;
  perMinute: { t: string; value: number }[];
  topPaths: { key: string; value: number; pct?: number }[];
  recent: {
    event: string;
    path: string | null;
    tool: string | null;
    country: string | null;
    at: string;
  }[];
}

export async function getRealtime(sb: Sb): Promise<RealtimeResult> {
  const now = Date.now();
  const hour: DateRange = { from: new Date(now - 3_600_000), to: new Date(now + 1000), days: 1 };
  const fiveMin = new Date(now - 5 * 60_000);

  const [events, sessionsRes, aiRes, ordersRes] = await Promise.all([
    fetchEvents(sb, hour, {}, { limit: 5000 }),
    sb
      .from("analytics_sessions")
      .select("session_id,user_id", { count: "exact" })
      .gte("last_seen_at", fiveMin.toISOString())
      .limit(2000),
    sb
      .from("ai_usage_logs")
      .select("id", { count: "exact", head: true })
      .gte("created_at", hour.from.toISOString()),
    sb
      .from("orders")
      .select("amount_cents,currency,status,created_at")
      .gte("created_at", hour.from.toISOString())
      .limit(500),
  ]);

  const paid = (ordersRes.data ?? []).filter((o) =>
    ["paid", "captured", "completed", "succeeded"].includes(o.status),
  );

  const perMinute = new Map<string, number>();
  for (const e of events) {
    const t = new Date(e.created_at).toISOString().slice(0, 16);
    perMinute.set(t, (perMinute.get(t) ?? 0) + 1);
  }
  const minutes: { t: string; value: number }[] = [];
  for (let i = 59; i >= 0; i -= 1) {
    const t = new Date(now - i * 60_000).toISOString().slice(0, 16);
    minutes.push({ t, value: perMinute.get(t) ?? 0 });
  }

  return {
    activeUsers: distinctActors(
      (sessionsRes.data ?? []).map((s) => ({ user_id: s.user_id, session_id: s.session_id })),
    ),
    activeSessions: sessionsRes.count ?? (sessionsRes.data ?? []).length,
    pageviewsLastHour: events.filter((e) => e.event_name === EVENTS.PAGEVIEW).length,
    toolRunsLastHour: events.filter((e) => GENERATION_EVENTS.includes(e.event_name)).length,
    aiRequestsLastHour: aiRes.count ?? 0,
    revenueLastHour: round(
      paid.reduce((a, o) => a + Number(o.amount_cents ?? 0) / 100, 0),
      2,
    ),
    currency: paid[0]?.currency ?? "INR",
    perMinute: minutes,
    topPaths: breakdownFrom(
      events.filter((e) => e.event_name === EVENTS.PAGEVIEW),
      "path",
      8,
    ),
    recent: events
      .slice(-40)
      .reverse()
      .map((e) => ({
        event: e.event_name,
        path: e.path,
        tool: e.tool_slug,
        country: e.country,
        at: e.created_at,
      })),
  };
}

/** Single entry point used by the admin console; caches per dashboard + filters. */
export async function loadDashboard(
  sb: Sb,
  dashboard: string,
  range: DateRange,
  filters: AnalyticsFilters = {},
  granularity?: Granularity,
): Promise<unknown> {
  const key = cacheKey({
    dashboard,
    from: range.from.toISOString(),
    to: range.to.toISOString(),
    filters,
    granularity: granularity ?? "auto",
  });

  const ttl =
    dashboard === "realtime"
      ? CACHE_TTL.live
      : dashboard === "revenue"
        ? CACHE_TTL.revenue
        : CACHE_TTL.overview;

  return withCache(
    key,
    ttl,
    async () => {
      switch (dashboard) {
        case "realtime":
          return getRealtime(sb);
        case "users":
          return getUserAnalytics(sb, range, filters, granularity);
        case "tools":
          return { tools: await getToolAnalytics(sb, range, filters) };
        case "ai":
          return getAiAnalytics(sb, range, filters, granularity);
        case "seo":
          return getSeoAnalytics(sb, range, filters, granularity);
        case "revenue":
          return getRevenueAnalytics(sb, range, granularity);
        case "funnels":
          return getFunnel(sb, range, filters);
        case "retention":
          return getRetention(sb, range, filters);
        case "performance":
          return getPerformanceAnalytics(sb, range, filters, granularity);
        case "overview":
        default:
          return getOverview(sb, range, filters, granularity);
      }
    },
    ["analytics", dashboard],
  );
}
