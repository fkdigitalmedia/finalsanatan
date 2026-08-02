import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import {
  Activity,
  BarChart3,
  Bot,
  Coins,
  Eye,
  Flame,
  Globe,
  MousePointerClick,
  Radio,
  Sparkles,
  Timer,
  TrendingUp,
  Users,
  UserPlus,
  UserCheck,
  Mail,
  Crown,
  Zap,
} from "lucide-react";

import {
  getAnalyticsKpis,
  getAnalyticsTimeseries,
  getAnalyticsBreakdown,
  getAnalyticsLive,
} from "@/lib/analytics.functions";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KpiCard } from "@/components/admin/analytics/KpiCard";
import { DateRangePicker } from "@/components/admin/analytics/DateRangePicker";
import { TrendChart } from "@/components/admin/analytics/TrendChart";
import { BreakdownList } from "@/components/admin/analytics/BreakdownList";
import { Button } from "@/components/ui/button";
import { IntegrationsTab } from "@/components/admin/analytics/IntegrationsTab";
import { SeoTab } from "@/components/admin/analytics/SeoTab";
import { PerformanceTab } from "@/components/admin/analytics/PerformanceTab";
import { AiTab } from "@/components/admin/analytics/AiTab";
import {
  AlertsTab,
  CohortsTab,
  FunnelTab,
  ReportsTab,
  RetentionTab,
  RevenueTab,
} from "@/components/admin/analytics/BiTabs";

export const Route = createFileRoute("/_authenticated/_admin/admin/analytics")({
  component: AnalyticsPage,
  head: () => ({
    meta: [{ title: "Admin — Analytics & BI" }, { name: "robots", content: "noindex" }],
  }),
});

function AnalyticsPage() {
  const [days, setDays] = useState(30);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold">Analytics & BI Command Center</h1>
          <p className="text-sm text-muted-foreground">
            First-party analytics + GA4, Search Console, Clarity, monetization &amp; AI insights.
          </p>
        </div>
        <DateRangePicker days={days} onChange={setDays} />
      </header>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="flex w-full flex-wrap justify-start gap-1 bg-transparent p-0">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="realtime">Realtime</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="ai">AI</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="funnels">Funnels</TabsTrigger>
          <TabsTrigger value="retention">Retention</TabsTrigger>
          <TabsTrigger value="cohorts">Cohorts</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <OverviewTab days={days} />
        </TabsContent>
        <TabsContent value="realtime" className="mt-6">
          <RealtimeTab />
        </TabsContent>
        <TabsContent value="traffic" className="mt-6">
          <TrafficTab days={days} />
        </TabsContent>
        <TabsContent value="users" className="mt-6">
          <UsersTab days={days} />
        </TabsContent>
        <TabsContent value="tools" className="mt-6">
          <ToolsTab days={days} />
        </TabsContent>
        <TabsContent value="ai" className="mt-6">
          <AiTab days={days} />
        </TabsContent>
        <TabsContent value="seo" className="mt-6">
          <SeoTab days={days} />
        </TabsContent>
        <TabsContent value="revenue" className="mt-6">
          <RevenueTab days={days} />
        </TabsContent>
        <TabsContent value="funnels" className="mt-6">
          <FunnelTab days={days} />
        </TabsContent>
        <TabsContent value="retention" className="mt-6">
          <RetentionTab days={days} />
        </TabsContent>
        <TabsContent value="cohorts" className="mt-6">
          <CohortsTab days={days} />
        </TabsContent>
        <TabsContent value="reports" className="mt-6">
          <ReportsTab days={days} />
        </TabsContent>
        <TabsContent value="alerts" className="mt-6">
          <AlertsTab />
        </TabsContent>
        <TabsContent value="performance" className="mt-6">
          <PerformanceTab days={days} />
        </TabsContent>

        <TabsContent value="integrations" className="mt-6">
          <IntegrationsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ---------- Overview ----------------------------------------------------------
function OverviewTab({ days }: { days: number }) {
  const fn = useServerFn(getAnalyticsKpis);
  const tsFn = useServerFn(getAnalyticsTimeseries);
  const brFn = useServerFn(getAnalyticsBreakdown);

  const kpis = useQuery({
    queryKey: ["admin", "analytics", "kpis", days],
    queryFn: () => fn({ data: { days } }),
    staleTime: 60_000,
  });

  const ts = useQuery({
    queryKey: ["admin", "analytics", "ts", days],
    queryFn: () => tsFn({ data: { days } }),
    staleTime: 60_000,
  });

  const countryQ = useQuery({
    queryKey: ["admin", "analytics", "br", "country", days],
    queryFn: () => brFn({ data: { dimension: "country", days, limit: 10 } }),
    staleTime: 60_000,
  });
  const deviceQ = useQuery({
    queryKey: ["admin", "analytics", "br", "device", days],
    queryFn: () => brFn({ data: { dimension: "device", days, limit: 5 } }),
    staleTime: 60_000,
  });
  const browserQ = useQuery({
    queryKey: ["admin", "analytics", "br", "browser", days],
    queryFn: () => brFn({ data: { dimension: "browser", days, limit: 8 } }),
    staleTime: 60_000,
  });
  const referrerQ = useQuery({
    queryKey: ["admin", "analytics", "br", "referrer", days],
    queryFn: () => brFn({ data: { dimension: "referrer", days, limit: 10 } }),
    staleTime: 60_000,
  });

  const c = kpis.data?.cards;

  if (kpis.isLoading) return <SkeletonGrid n={18} />;
  if (kpis.error) return <ErrorBox err={kpis.error} />;
  if (!c) return null;

  return (
    <div className="space-y-6">
      {/* KPI grid */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        <KpiCard
          label="Total Users"
          value={c.total_users.value}
          icon={Users}
          deltaPct={c.total_users.delta_pct}
        />
        <KpiCard
          label="Active Users"
          value={c.active_users.value}
          icon={Activity}
          deltaPct={c.active_users.delta_pct}
        />
        <KpiCard
          label="Online Now"
          value={c.online_users.value}
          icon={Radio}
          deltaPct={c.online_users.delta_pct}
          hint="last 5m"
        />
        <KpiCard label="New Today" value={c.new_users_today.value} icon={UserPlus} />
        <KpiCard label="Returning" value={c.returning_users.value} icon={UserCheck} />
        <KpiCard
          label="Sessions"
          value={c.sessions.value}
          icon={BarChart3}
          deltaPct={c.sessions.delta_pct}
        />
        <KpiCard
          label="Pageviews"
          value={c.pageviews.value}
          icon={Eye}
          deltaPct={c.pageviews.delta_pct}
        />
        <KpiCard
          label="Avg Session"
          value={c.avg_session_duration_sec.value}
          format="duration"
          icon={Timer}
        />
        <KpiCard
          label="Bounce Rate"
          value={c.bounce_rate.value}
          format="percent"
          icon={TrendingUp}
        />
        <KpiCard label="Pages / Session" value={c.pages_per_session.value} icon={BarChart3} />
        <KpiCard label="Conversions" value={c.conversions.value} icon={Flame} hint="stage 4" />
        <KpiCard label="Newsletter" value={c.newsletter_subscribers.value} icon={Mail} />
        <KpiCard label="Premium" value={c.premium_users.value} icon={Crown} />
        <KpiCard
          label="Revenue"
          value={c.revenue.value}
          format="currency"
          icon={Coins}
          hint="stage 4"
        />
        <KpiCard
          label="Est. Ad Rev"
          value={c.est_ad_revenue.value}
          format="currency"
          icon={Coins}
          hint="pv × RPM"
        />
        <KpiCard
          label="Affiliate Clicks"
          value={c.affiliate_clicks.value}
          icon={MousePointerClick}
          deltaPct={c.affiliate_clicks.delta_pct}
        />
        <KpiCard
          label="AI Requests"
          value={c.ai_requests.value}
          icon={Bot}
          deltaPct={c.ai_requests.delta_pct}
        />
        <KpiCard label="AI Cost" value={c.ai_cost_usd.value} format="currency" icon={Sparkles} />
      </section>

      {/* Trend chart */}
      <section className="rounded-xl border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Traffic trend</h2>
          <span className="text-xs text-muted-foreground">{days} days • pageviews vs sessions</span>
        </div>
        {ts.isLoading ? (
          <div className="h-64 animate-pulse rounded-lg bg-muted" />
        ) : (
          <TrendChart data={ts.data?.series ?? []} />
        )}
      </section>

      {/* Breakdowns */}
      <section className="grid gap-3 lg:grid-cols-2 xl:grid-cols-4">
        <BreakdownList
          title="Top Countries"
          rows={countryQ.data?.rows}
          formatKey={(k) => k.toUpperCase()}
        />
        <BreakdownList title="Devices" rows={deviceQ.data?.rows} />
        <BreakdownList title="Browsers" rows={browserQ.data?.rows} />
        <BreakdownList
          title="Top Referrers"
          rows={referrerQ.data?.rows}
          formatKey={(k) => {
            try {
              return new URL(k).hostname;
            } catch {
              return k;
            }
          }}
          empty="Direct traffic only."
        />
      </section>
    </div>
  );
}

// ---------- Realtime ---------------------------------------------------------
function RealtimeTab() {
  const fn = useServerFn(getAnalyticsLive);
  const q = useQuery({
    queryKey: ["admin", "analytics", "live"],
    queryFn: () => fn(),
    refetchInterval: 5000,
    staleTime: 0,
  });

  if (q.error) return <ErrorBox err={q.error} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="relative h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
        </div>
        <div className="font-serif text-4xl font-semibold">{q.data?.online ?? 0}</div>
        <div className="text-sm text-muted-foreground">visitors online right now</div>
      </div>

      <section className="grid gap-3 lg:grid-cols-3">
        <BreakdownList title="Live pages" rows={q.data?.top_pages} />
        <BreakdownList
          title="Live countries"
          rows={q.data?.top_countries}
          formatKey={(k) => k.toUpperCase()}
        />
        <BreakdownList title="Live devices" rows={q.data?.top_devices} />
      </section>
    </div>
  );
}

// ---------- Traffic (breakdowns) --------------------------------------------
function TrafficTab({ days }: { days: number }) {
  const brFn = useServerFn(getAnalyticsBreakdown);
  const dims: { dimension: string; title: string; limit: number }[] = [
    { dimension: "path", title: "Top Pages", limit: 15 },
    { dimension: "referrer", title: "Top Referrers", limit: 15 },
    { dimension: "utm_source", title: "UTM Sources", limit: 10 },
    { dimension: "lang", title: "Languages", limit: 12 },
    { dimension: "os", title: "Operating Systems", limit: 8 },
    { dimension: "country", title: "Countries", limit: 15 },
  ];
  return (
    <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
      {dims.map((d) => (
        <TrafficBlock key={d.dimension} d={d} days={days} brFn={brFn} />
      ))}
    </div>
  );
}

function TrafficBlock({
  d,
  days,
  brFn,
}: {
  d: { dimension: string; title: string; limit: number };
  days: number;
  brFn: (args: {
    data: { dimension: string; days: number; limit: number };
  }) => Promise<Awaited<ReturnType<typeof getAnalyticsBreakdown>>>;
}) {
  const q = useQuery({
    queryKey: ["admin", "analytics", "br", d.dimension, days, "traffic"],
    queryFn: () => brFn({ data: { dimension: d.dimension, days, limit: d.limit } }),
    staleTime: 60_000,
  });
  return <BreakdownList title={d.title} rows={q.data?.rows} />;
}

// ---------- Users tab -------------------------------------------------------
function UsersTab({ days }: { days: number }) {
  const brFn = useServerFn(getAnalyticsBreakdown);
  const dims: { dimension: string; title: string; limit: number }[] = [
    { dimension: "country", title: "Countries", limit: 20 },
    { dimension: "lang", title: "Languages", limit: 12 },
    { dimension: "device", title: "Devices", limit: 5 },
    { dimension: "os", title: "Operating Systems", limit: 8 },
    { dimension: "browser", title: "Browsers", limit: 10 },
  ];
  return (
    <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
      {dims.map((d) => (
        <TrafficBlock key={d.dimension} d={d} days={days} brFn={brFn} />
      ))}
    </div>
  );
}

// ---------- Tools tab -------------------------------------------------------
function ToolsTab({ days }: { days: number }) {
  const brFn = useServerFn(getAnalyticsBreakdown);
  const q = useQuery({
    queryKey: ["admin", "analytics", "br", "tool_slug", days, "tools"],
    queryFn: () => brFn({ data: { dimension: "tool_slug", days, limit: 50 } }),
    staleTime: 60_000,
  });
  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Most-viewed tools</h2>
          <span className="text-xs text-muted-foreground">last {days} days</span>
        </div>
        <BreakdownList
          title=""
          rows={q.data?.rows}
          empty="No tool_view events yet — usage tracks automatically as visitors open tool pages."
        />
      </div>
    </div>
  );
}

// ---------- Helpers ----------------------------------------------------------
function SkeletonGrid({ n }: { n: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
      ))}
    </div>
  );
}

function ErrorBox({ err }: { err: unknown }) {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
      Failed to load analytics: {msg}
    </div>
  );
}

function ComingSoon({ label, note }: { label: string; note: string }) {
  return (
    <div className="rounded-xl border border-dashed bg-muted/20 p-8 text-center">
      <Zap className="mx-auto h-8 w-8 text-primary" />
      <h3 className="mt-3 font-serif text-lg font-semibold">{label}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{note}</p>
      <Button variant="outline" className="mt-4" disabled>
        <Globe className="mr-2 h-4 w-4" /> Coming in the next stage
      </Button>
    </div>
  );
}
