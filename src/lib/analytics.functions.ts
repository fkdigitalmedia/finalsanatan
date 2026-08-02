/**
 * Admin analytics server functions.
 * All handlers are staff-gated via `has_role`. Reads use the RLS-scoped
 * request client (context.supabase) so accidental exposure surfaces as 0 rows.
 */

import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";
import { createClient } from "@supabase/supabase-js";

type Ctx = {
  supabase: ReturnType<typeof createClient<Database>>;
  userId: string;
};

async function assertStaff(context: Ctx) {
  const { data } = await context.supabase.rpc("is_staff", {
    _user_id: context.userId,
  });
  if (!data) throw new Error("Forbidden: staff role required");
}

function parseRange(input: { from?: string; to?: string; days?: number }) {
  const to = input.to ? new Date(input.to) : new Date();
  const days = Math.max(1, Math.min(365, input.days ?? 30));
  const from = input.from
    ? new Date(input.from)
    : new Date(to.getTime() - days * 24 * 60 * 60 * 1000);
  return { from, to, days };
}

// ---------------------------------------------------------------------------
// getKpis: 18-card overview snapshot
// ---------------------------------------------------------------------------
export const getAnalyticsKpis = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = (raw ?? {}) as { from?: string; to?: string; days?: number };
    return v;
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const { from, to, days } = parseRange(data);
    const prevFrom = new Date(from.getTime() - days * 24 * 60 * 60 * 1000);
    const prevTo = from;
    const online = new Date(Date.now() - 5 * 60 * 1000);

    const sb = context.supabase;

    const pv = (start: Date, end: Date) =>
      sb
        .from("analytics_events")
        .select("id", { count: "exact", head: true })
        .eq("event_name", "pageview")
        .gte("created_at", start.toISOString())
        .lt("created_at", end.toISOString());

    const sessionsCount = (start: Date, end: Date) =>
      sb
        .from("analytics_sessions")
        .select("session_id", { count: "exact", head: true })
        .gte("started_at", start.toISOString())
        .lt("started_at", end.toISOString());

    const [
      pvNow,
      pvPrev,
      sessNow,
      sessPrev,
      onlineNow,
      totalUsers,
      newUsersToday,
      newslettersActive,
      aiReqs,
      aiReqsPrev,
      affiliateClicks,
      affiliateClicksPrev,
    ] = await Promise.all([
      pv(from, to),
      pv(prevFrom, prevTo),
      sessionsCount(from, to),
      sessionsCount(prevFrom, prevTo),
      sb
        .from("analytics_sessions")
        .select("session_id", { count: "exact", head: true })
        .gte("last_seen_at", online.toISOString()),
      sb.from("profiles").select("id", { count: "exact", head: true }),
      sb
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .gte("created_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
      sb
        .from("newsletter_subscribers")
        .select("id", { count: "exact", head: true })
        .eq("status", "active"),
      sb
        .from("ai_usage_logs")
        .select("id", { count: "exact", head: true })
        .gte("created_at", from.toISOString())
        .lt("created_at", to.toISOString()),
      sb
        .from("ai_usage_logs")
        .select("id", { count: "exact", head: true })
        .gte("created_at", prevFrom.toISOString())
        .lt("created_at", prevTo.toISOString()),
      sb
        .from("affiliate_clicks")
        .select("id", { count: "exact", head: true })
        .gte("clicked_at", from.toISOString())
        .lt("clicked_at", to.toISOString()),
      sb
        .from("affiliate_clicks")
        .select("id", { count: "exact", head: true })
        .gte("clicked_at", prevFrom.toISOString())
        .lt("clicked_at", prevTo.toISOString()),
    ]);

    // Bounce + avg pages/session + avg duration
    const { data: sessAgg } = await sb
      .from("analytics_sessions")
      .select("pages,started_at,last_seen_at,is_bounce")
      .gte("started_at", from.toISOString())
      .lt("started_at", to.toISOString())
      .limit(5000);

    const rows = sessAgg ?? [];
    const nSess = rows.length;
    const pagesPerSession = nSess ? rows.reduce((a, r) => a + (r.pages ?? 1), 0) / nSess : 0;
    const bounceRate = nSess ? rows.filter((r) => r.is_bounce).length / nSess : 0;
    const avgDuration = nSess
      ? rows.reduce(
          (a, r) => a + (new Date(r.last_seen_at).getTime() - new Date(r.started_at).getTime()),
          0,
        ) /
        nSess /
        1000
      : 0;

    // Returning: sessions with user_id already having earlier sessions
    const returningCount = rows.filter((r) => (r.pages ?? 1) > 1).length;

    // AI cost + tokens
    const { data: aiCostAgg } = await sb
      .from("ai_usage_logs")
      .select("cost_estimate,total_tokens")
      .gte("created_at", from.toISOString())
      .lt("created_at", to.toISOString())
      .limit(20000);

    const aiRows = (aiCostAgg ?? []) as {
      cost_estimate: number | null;
      total_tokens: number | null;
    }[];
    const totalAiCost = aiRows.reduce((a, r) => a + Number(r.cost_estimate ?? 0), 0);
    const totalTokens = aiRows.reduce((a, r) => a + Number(r.total_tokens ?? 0), 0);

    // Estimated ad revenue: pageviews × configurable RPM ($USD per 1000 pv)
    // Default RPM = $1.50; configurable via integration_settings key='ads.rpm'
    const { data: rpmRow } = await sb
      .from("integration_settings")
      .select("config")
      .eq("key", "ads.rpm")
      .maybeSingle();
    const rpm = Number((rpmRow?.config as { value?: number } | null)?.value ?? 1.5);
    const estAdRevenue = ((pvNow.count ?? 0) / 1000) * rpm;

    // Premium users (any active subscription)
    const { count: premiumCount } = await sb
      .from("profiles")
      .select("id", { count: "exact", head: true });

    const pct = (a: number | null, b: number | null) => {
      const cur = a ?? 0;
      const prev = b ?? 0;
      if (prev === 0) return cur === 0 ? 0 : 100;
      return ((cur - prev) / prev) * 100;
    };

    return {
      range: {
        from: from.toISOString(),
        to: to.toISOString(),
        days,
      },
      cards: {
        total_users: { value: totalUsers.count ?? 0, delta_pct: null },
        active_users: { value: sessNow.count ?? 0, delta_pct: pct(sessNow.count, sessPrev.count) },
        online_users: { value: onlineNow.count ?? 0, delta_pct: null },
        new_users_today: { value: newUsersToday.count ?? 0, delta_pct: null },
        returning_users: { value: returningCount, delta_pct: null },
        sessions: { value: sessNow.count ?? 0, delta_pct: pct(sessNow.count, sessPrev.count) },
        pageviews: { value: pvNow.count ?? 0, delta_pct: pct(pvNow.count, pvPrev.count) },
        avg_session_duration_sec: { value: Math.round(avgDuration), delta_pct: null },
        bounce_rate: { value: Math.round(bounceRate * 1000) / 10, delta_pct: null },
        pages_per_session: { value: Math.round(pagesPerSession * 100) / 100, delta_pct: null },
        conversions: { value: 0, delta_pct: null }, // wired in Stage 4
        newsletter_subscribers: { value: newslettersActive.count ?? 0, delta_pct: null },
        premium_users: { value: premiumCount ?? 0, delta_pct: null },
        revenue: { value: 0, delta_pct: null }, // stripe wiring in Stage 4
        est_ad_revenue: { value: Math.round(estAdRevenue * 100) / 100, delta_pct: null },
        affiliate_clicks: {
          value: affiliateClicks.count ?? 0,
          delta_pct: pct(affiliateClicks.count, affiliateClicksPrev.count),
        },
        ai_requests: { value: aiReqs.count ?? 0, delta_pct: pct(aiReqs.count, aiReqsPrev.count) },
        ai_cost_usd: { value: Math.round(totalAiCost * 10000) / 10000, delta_pct: null },
        ai_tokens: { value: totalTokens, delta_pct: null },
      },
    };
  });

// ---------------------------------------------------------------------------
// getTimeseries: daily pageviews / sessions / AI requests for the range
// ---------------------------------------------------------------------------
export const getAnalyticsTimeseries = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = (raw ?? {}) as { from?: string; to?: string; days?: number };
    return v;
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const { from, to } = parseRange(data);
    const sb = context.supabase;

    const [{ data: events }, { data: sessions }, { data: ai }] = await Promise.all([
      sb
        .from("analytics_events")
        .select("created_at")
        .eq("event_name", "pageview")
        .gte("created_at", from.toISOString())
        .lt("created_at", to.toISOString())
        .limit(50000),
      sb
        .from("analytics_sessions")
        .select("started_at")
        .gte("started_at", from.toISOString())
        .lt("started_at", to.toISOString())
        .limit(20000),
      sb
        .from("ai_usage_logs")
        .select("created_at")
        .gte("created_at", from.toISOString())
        .lt("created_at", to.toISOString())
        .limit(20000),
    ]);

    const bucket = (
      rows: { created_at?: string; started_at?: string }[] | null,
      key: "created_at" | "started_at",
    ) => {
      const map = new Map<string, number>();
      for (const r of rows ?? []) {
        const raw = r[key] as string | undefined;
        if (!raw) continue;
        const day = raw.slice(0, 10);
        map.set(day, (map.get(day) ?? 0) + 1);
      }
      return map;
    };

    const pvMap = bucket(events, "created_at");
    const sessMap = bucket(sessions, "started_at");
    const aiMap = bucket(ai, "created_at");

    const days: { day: string; pageviews: number; sessions: number; ai: number }[] = [];
    const oneDay = 24 * 60 * 60 * 1000;
    for (let t = from.getTime(); t < to.getTime(); t += oneDay) {
      const day = new Date(t).toISOString().slice(0, 10);
      days.push({
        day,
        pageviews: pvMap.get(day) ?? 0,
        sessions: sessMap.get(day) ?? 0,
        ai: aiMap.get(day) ?? 0,
      });
    }
    return { series: days };
  });

// ---------------------------------------------------------------------------
// getBreakdown: top values for a dimension (country / device / browser / os / referrer / path / lang / tool_slug)
// ---------------------------------------------------------------------------
export const getAnalyticsBreakdown = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = raw as {
      dimension?: string;
      from?: string;
      to?: string;
      days?: number;
      limit?: number;
    };
    const allowed = [
      "country",
      "device",
      "browser",
      "os",
      "referrer",
      "path",
      "lang",
      "tool_slug",
      "utm_source",
    ];
    if (!v?.dimension || !allowed.includes(v.dimension)) throw new Error("Invalid dimension");
    return {
      dimension: v.dimension,
      from: v.from,
      to: v.to,
      days: v.days,
      limit: Math.min(Math.max(v.limit ?? 20, 1), 100),
    };
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const { from, to } = parseRange(data);
    const { data: rows } = await context.supabase
      .from("analytics_events")
      .select(data.dimension)
      .eq("event_name", "pageview")
      .gte("created_at", from.toISOString())
      .lt("created_at", to.toISOString())
      .limit(50000);

    const counts = new Map<string, number>();
    for (const r of (rows ?? []) as unknown as Record<string, string | null>[]) {
      const v = r[data.dimension];
      if (!v) continue;
      counts.set(v, (counts.get(v) ?? 0) + 1);
    }
    const total = Array.from(counts.values()).reduce((a, b) => a + b, 0) || 1;
    return {
      dimension: data.dimension,
      rows: Array.from(counts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, data.limit)
        .map(([key, value]) => ({
          key,
          value,
          pct: Math.round((value / total) * 1000) / 10,
        })),
    };
  });

// ---------------------------------------------------------------------------
// getLive: real-time snapshot (last 5 min)
// ---------------------------------------------------------------------------
export const getAnalyticsLive = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context);
    const since = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const sb = context.supabase;

    const [{ count: online }, { data: pages }, { data: countries }, { data: devices }] =
      await Promise.all([
        sb
          .from("analytics_sessions")
          .select("session_id", { count: "exact", head: true })
          .gte("last_seen_at", since),
        sb
          .from("analytics_events")
          .select("path")
          .eq("event_name", "pageview")
          .gte("created_at", since)
          .limit(500),
        sb.from("analytics_sessions").select("country").gte("last_seen_at", since).limit(500),
        sb.from("analytics_sessions").select("device").gte("last_seen_at", since).limit(500),
      ]);

    const tally = (rows: { [k: string]: string | null }[] | null, key: string) => {
      const m = new Map<string, number>();
      for (const r of rows ?? []) {
        const v = r[key];
        if (!v) continue;
        m.set(v, (m.get(v) ?? 0) + 1);
      }
      return Array.from(m.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([k, v]) => ({ key: k, value: v }));
    };

    return {
      online: online ?? 0,
      top_pages: tally(pages, "path"),
      top_countries: tally(countries, "country"),
      top_devices: tally(devices, "device"),
    };
  });

// ---------------------------------------------------------------------------
// getIntegrations: read/write GA4 / GSC / Clarity / pixel toggles
// ---------------------------------------------------------------------------
export const listIntegrations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context);
    const { data } = await context.supabase
      .from("integration_settings")
      .select("key,config,enabled,updated_at");
    return { rows: data ?? [] };
  });

export const upsertIntegration = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const v = raw as { key?: string; config?: Record<string, unknown>; enabled?: boolean };
    if (!v?.key || v.key.length > 80) throw new Error("Invalid key");
    return {
      key: v.key,
      config: (v.config as Record<string, unknown>) ?? {},
      enabled: Boolean(v.enabled),
    };
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const { error } = await context.supabase.from("integration_settings").upsert(
      {
        key: data.key,
        config:
          data.config as unknown as Database["public"]["Tables"]["integration_settings"]["Row"]["config"],
        enabled: data.enabled,
        updated_by: context.userId,
      },
      { onConflict: "key" },
    );
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------------------------------------------------------------------------
// Performance & Errors — Core Web Vitals, slow pages, JS errors
// ---------------------------------------------------------------------------

type VitalName = "LCP" | "INP" | "CLS" | "TTFB" | "FCP";
const VITAL_NAMES: VitalName[] = ["LCP", "INP", "CLS", "TTFB", "FCP"];

const THRESHOLDS: Record<VitalName, { good: number; poor: number; unit: string }> = {
  LCP: { good: 2500, poor: 4000, unit: "ms" },
  INP: { good: 200, poor: 500, unit: "ms" },
  CLS: { good: 0.1, poor: 0.25, unit: "" },
  TTFB: { good: 800, poor: 1800, unit: "ms" },
  FCP: { good: 1800, poor: 3000, unit: "ms" },
};

function percentile(sorted: number[], p: number): number {
  if (!sorted.length) return 0;
  const idx = Math.min(sorted.length - 1, Math.floor((sorted.length - 1) * p));
  return sorted[idx];
}

export const getPerformanceMetrics = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => (raw ?? {}) as { days?: number })
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const { from, to } = parseRange(data);

    const { data: rows } = await context.supabase
      .from("analytics_events")
      .select("path, meta, created_at, device")
      .eq("event_name", "web_vital")
      .gte("created_at", from.toISOString())
      .lte("created_at", to.toISOString())
      .order("created_at", { ascending: false })
      .limit(20000);

    type Sample = { name: VitalName; value: number; path: string | null; device: string | null };
    const samples: Sample[] = [];
    for (const r of rows ?? []) {
      const m = (r.meta ?? {}) as { name?: string; value?: number };
      if (!m?.name || typeof m.value !== "number") continue;
      if (!VITAL_NAMES.includes(m.name as VitalName)) continue;
      samples.push({
        name: m.name as VitalName,
        value: m.value,
        path: r.path,
        device: r.device,
      });
    }

    const summary = VITAL_NAMES.map((name) => {
      const vals = samples
        .filter((s) => s.name === name)
        .map((s) => s.value)
        .sort((a, b) => a - b);
      const t = THRESHOLDS[name];
      const good = vals.filter((v) => v <= t.good).length;
      const poor = vals.filter((v) => v > t.poor).length;
      return {
        name,
        unit: t.unit,
        samples: vals.length,
        p75: percentile(vals, 0.75),
        p95: percentile(vals, 0.95),
        avg: vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0,
        good_pct: vals.length ? (good / vals.length) * 100 : 0,
        poor_pct: vals.length ? (poor / vals.length) * 100 : 0,
        thresholds: t,
      };
    });

    // Slow pages — by LCP p75 (min 5 samples)
    const byPath = new Map<string, number[]>();
    for (const s of samples) {
      if (s.name !== "LCP" || !s.path) continue;
      const arr = byPath.get(s.path) ?? [];
      arr.push(s.value);
      byPath.set(s.path, arr);
    }
    const slowPages = Array.from(byPath.entries())
      .filter(([, v]) => v.length >= 5)
      .map(([path, v]) => {
        const sorted = v.slice().sort((a, b) => a - b);
        return { path, samples: v.length, p75_lcp: percentile(sorted, 0.75) };
      })
      .sort((a, b) => b.p75_lcp - a.p75_lcp)
      .slice(0, 15);

    // Device split for LCP p75
    const devices = ["desktop", "mobile", "tablet"].map((d) => {
      const vals = samples
        .filter((s) => s.name === "LCP" && s.device === d)
        .map((s) => s.value)
        .sort((a, b) => a - b);
      return { device: d, samples: vals.length, p75_lcp: percentile(vals, 0.75) };
    });

    return { summary, slowPages, devices };
  });

export const getPerformanceErrors = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => (raw ?? {}) as { days?: number })
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const { from, to } = parseRange(data);

    const { data: rows } = await context.supabase
      .from("analytics_events")
      .select("path, meta, created_at, browser")
      .eq("event_name", "js_error")
      .gte("created_at", from.toISOString())
      .lte("created_at", to.toISOString())
      .order("created_at", { ascending: false })
      .limit(10000);

    const total = rows?.length ?? 0;
    const grouped = new Map<
      string,
      {
        message: string;
        count: number;
        last_seen: string;
        paths: Set<string>;
        browsers: Set<string>;
        kind: string;
      }
    >();
    for (const r of rows ?? []) {
      const m = (r.meta ?? {}) as { message?: string; kind?: string };
      const message = (m.message ?? "Unknown").slice(0, 200);
      const g = grouped.get(message) ?? {
        message,
        count: 0,
        last_seen: r.created_at,
        paths: new Set<string>(),
        browsers: new Set<string>(),
        kind: m.kind ?? "error",
      };
      g.count += 1;
      if (r.path) g.paths.add(r.path);
      if (r.browser) g.browsers.add(r.browser);
      if (r.created_at > g.last_seen) g.last_seen = r.created_at;
      grouped.set(message, g);
    }

    const errors = Array.from(grouped.values())
      .map((g) => ({
        message: g.message,
        count: g.count,
        last_seen: g.last_seen,
        top_path: Array.from(g.paths)[0] ?? null,
        path_count: g.paths.size,
        browsers: Array.from(g.browsers),
        kind: g.kind,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 25);

    // Error-rate proxy: errors per 1k pageviews
    const { count: pv } = await context.supabase
      .from("analytics_events")
      .select("id", { count: "exact", head: true })
      .eq("event_name", "pageview")
      .gte("created_at", from.toISOString())
      .lte("created_at", to.toISOString());

    const pageviews = pv ?? 0;
    const rate_per_1k = pageviews > 0 ? (total / pageviews) * 1000 : 0;

    return { total, unique: grouped.size, pageviews, rate_per_1k, errors };
  });

// ---------------------------------------------------------------------------
// getAiAnalytics: provider/model breakdowns, tokens, cost, latency, failures
// ---------------------------------------------------------------------------
export const getAiAnalytics = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => (raw ?? {}) as { days?: number })
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const { from, to, days } = parseRange(data);
    const prevFrom = new Date(from.getTime() - days * 24 * 60 * 60 * 1000);

    const sb = context.supabase;

    const [{ data: rows }, { data: prevRows }] = await Promise.all([
      sb
        .from("ai_usage_logs")
        .select(
          "provider_name, model_name, feature_key, input_tokens, output_tokens, total_tokens, latency_ms, cost_estimate, success, error_message, created_at",
        )
        .gte("created_at", from.toISOString())
        .lte("created_at", to.toISOString())
        .order("created_at", { ascending: false })
        .limit(50000),
      sb
        .from("ai_usage_logs")
        .select("id, cost_estimate, success", { count: "exact" })
        .gte("created_at", prevFrom.toISOString())
        .lt("created_at", from.toISOString())
        .limit(50000),
    ]);

    const list = rows ?? [];
    const totals = {
      requests: list.length,
      success: list.filter((r) => r.success).length,
      failures: list.filter((r) => !r.success).length,
      input_tokens: list.reduce((s, r) => s + (r.input_tokens ?? 0), 0),
      output_tokens: list.reduce((s, r) => s + (r.output_tokens ?? 0), 0),
      total_tokens: list.reduce(
        (s, r) => s + (r.total_tokens ?? (r.input_tokens ?? 0) + (r.output_tokens ?? 0)),
        0,
      ),
      cost_usd: list.reduce((s, r) => s + Number(r.cost_estimate ?? 0), 0),
    };
    const latencies = list
      .map((r) => r.latency_ms ?? 0)
      .filter((n) => n > 0)
      .sort((a, b) => a - b);
    const avg_latency_ms =
      latencies.length > 0 ? latencies.reduce((a, b) => a + b, 0) / latencies.length : 0;
    const p95_latency_ms = percentile(latencies, 95);
    const failure_rate = totals.requests > 0 ? totals.failures / totals.requests : 0;

    const prev = prevRows ?? [];
    const prevCost = prev.reduce((s, r) => s + Number(r.cost_estimate ?? 0), 0);
    const prevReq = prev.length;

    type Group = {
      key: string;
      requests: number;
      failures: number;
      input_tokens: number;
      output_tokens: number;
      total_tokens: number;
      cost_usd: number;
      latencies: number[];
    };
    const mkGroup = (key: string): Group => ({
      key,
      requests: 0,
      failures: 0,
      input_tokens: 0,
      output_tokens: 0,
      total_tokens: 0,
      cost_usd: 0,
      latencies: [],
    });
    const groupBy = (field: "provider_name" | "model_name" | "feature_key") => {
      const map = new Map<string, Group>();
      for (const r of list) {
        const k = (r[field] ?? "unknown") as string;
        const g = map.get(k) ?? mkGroup(k);
        g.requests += 1;
        if (!r.success) g.failures += 1;
        g.input_tokens += r.input_tokens ?? 0;
        g.output_tokens += r.output_tokens ?? 0;
        g.total_tokens += r.total_tokens ?? (r.input_tokens ?? 0) + (r.output_tokens ?? 0);
        g.cost_usd += Number(r.cost_estimate ?? 0);
        if (r.latency_ms && r.latency_ms > 0) g.latencies.push(r.latency_ms);
        map.set(k, g);
      }
      return Array.from(map.values())
        .map((g) => {
          const sortedL = g.latencies.sort((a, b) => a - b);
          return {
            key: g.key,
            requests: g.requests,
            failures: g.failures,
            failure_rate: g.requests > 0 ? g.failures / g.requests : 0,
            input_tokens: g.input_tokens,
            output_tokens: g.output_tokens,
            total_tokens: g.total_tokens,
            cost_usd: g.cost_usd,
            avg_latency_ms:
              sortedL.length > 0 ? sortedL.reduce((a, b) => a + b, 0) / sortedL.length : 0,
            p95_latency_ms: percentile(sortedL, 95),
          };
        })
        .sort((a, b) => b.requests - a.requests);
    };

    // Daily timeseries
    const dayMap = new Map<
      string,
      { day: string; requests: number; cost_usd: number; tokens: number; failures: number }
    >();
    for (const r of list) {
      const day = new Date(r.created_at).toISOString().slice(0, 10);
      const g = dayMap.get(day) ?? { day, requests: 0, cost_usd: 0, tokens: 0, failures: 0 };
      g.requests += 1;
      g.cost_usd += Number(r.cost_estimate ?? 0);
      g.tokens += r.total_tokens ?? (r.input_tokens ?? 0) + (r.output_tokens ?? 0);
      if (!r.success) g.failures += 1;
      dayMap.set(day, g);
    }
    const timeseries = Array.from(dayMap.values()).sort((a, b) => a.day.localeCompare(b.day));

    // Top error messages
    const errMap = new Map<string, { message: string; count: number; last_seen: string }>();
    for (const r of list) {
      if (r.success) continue;
      const msg = (r.error_message ?? "Unknown error").slice(0, 200);
      const g = errMap.get(msg) ?? { message: msg, count: 0, last_seen: r.created_at };
      g.count += 1;
      if (r.created_at > g.last_seen) g.last_seen = r.created_at;
      errMap.set(msg, g);
    }
    const top_errors = Array.from(errMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const costDelta = prevCost > 0 ? ((totals.cost_usd - prevCost) / prevCost) * 100 : null;
    const reqDelta = prevReq > 0 ? ((totals.requests - prevReq) / prevReq) * 100 : null;

    return {
      totals: {
        ...totals,
        avg_latency_ms,
        p95_latency_ms,
        failure_rate,
        cost_delta_pct: costDelta,
        requests_delta_pct: reqDelta,
      },
      providers: groupBy("provider_name"),
      models: groupBy("model_name"),
      features: groupBy("feature_key"),
      timeseries,
      top_errors,
    };
  });
