import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Sun,
  Sparkles,
  Clock3,
  TrendingUp,
  FileText,
  Download,
  Star,
  Crown,
  Users,
  Bell,
  ArrowRight,
  Activity,
} from "lucide-react";
import { DashboardShell } from "@/components/user/DashboardShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useKundlis, useWorkspaceAnalytics } from "@/lib/workspace/hooks";
import * as api from "@/lib/workspace/api";
import {
  birthInputFromKundli,
  formatDate,
  locationFromKundli,
  summarizeDasha,
  summarizeGochar,
  summarizePanchang,
  upcomingMuhurats,
} from "@/lib/workspace/insights";
import { DEFAULT_LOCATION } from "@/lib/panchang";

export const Route = createFileRoute("/_authenticated/dashboard")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Dashboard — SanatanTools" }, { name: "robots", content: "noindex" }],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();
  const uid = user?.id;
  const { data: analytics } = useWorkspaceAnalytics();
  const { data: charts } = useKundlis({ pageSize: 4 });
  const primary = charts?.rows?.[0];

  useEffect(() => {
    if (!uid) return;
    void api.registerDevice(uid, navigator.userAgent);
  }, [uid]);

  const loc = useMemo(() => (primary ? locationFromKundli(primary) : DEFAULT_LOCATION), [primary]);

  const { data: today } = useQuery({
    queryKey: ["ws", "today", loc.lat, loc.lon, new Date().toDateString()],
    staleTime: 15 * 60 * 1000,
    queryFn: async () => {
      const now = new Date();
      return {
        panchang: summarizePanchang(now, loc, loc.tz),
        muhurats: upcomingMuhurats(now, loc, loc.tz),
      };
    },
  });

  const { data: personal } = useQuery({
    queryKey: ["ws", "personal", primary?.id],
    enabled: !!primary,
    staleTime: 60 * 60 * 1000,
    queryFn: async () => {
      const birth = birthInputFromKundli(primary!);
      return { dasha: summarizeDasha(birth), gochar: summarizeGochar(birth) };
    },
  });

  const { data: side } = useQuery({
    queryKey: ["ws", "side", uid],
    enabled: !!uid,
    queryFn: async () => {
      const [reports, downloads, unread, entitlement, profile] = await Promise.all([
        supabase
          .from("user_reports")
          .select("id,title,kind,created_at")
          .eq("user_id", uid!)
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("report_downloads")
          .select("id,filename,created_at")
          .eq("user_id", uid!)
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("notifications")
          .select("id", { count: "exact", head: true })
          .eq("user_id", uid!)
          .eq("read", false),
        supabase
          .from("user_entitlements")
          .select("entitlement_key,expires_at")
          .eq("user_id", uid!)
          .eq("active", true)
          .limit(1)
          .maybeSingle(),
        supabase.from("profiles").select("display_name").eq("id", uid!).maybeSingle(),
      ]);
      return {
        reports: reports.data ?? [],
        downloads: downloads.data ?? [],
        unread: unread.count ?? 0,
        entitlement: entitlement.data,
        name: profile.data?.display_name ?? user?.email?.split("@")[0] ?? "friend",
      };
    },
  });

  return (
    <DashboardShell
      title={`Namaste, ${side?.name ?? "friend"}`}
      description="Your personal astrology workspace — panchang, dasha, gochar, reports and downloads in one place."
      actions={
        <Link to="/my-kundlis">
          <Button>
            <Star className="size-4" /> My Kundlis
          </Button>
        </Link>
      }
    >
      {/* Today */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center gap-2 text-accent">
            <Sun className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-widest">
              Today’s Panchang · {loc.label}
            </span>
          </div>
          {today ? (
            <dl className="mt-4 grid sm:grid-cols-3 gap-4 text-sm">
              <Fact label="Tithi" value={today.panchang.tithi} />
              <Fact label="Nakshatra" value={today.panchang.nakshatra} />
              <Fact label="Yoga" value={today.panchang.yoga} />
              <Fact label="Moon sign" value={today.panchang.moonSign} />
              <Fact label="Sunrise" value={today.panchang.sunrise} />
              <Fact label="Sunset" value={today.panchang.sunset} />
            </dl>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">Calculating today’s panchang…</p>
          )}
          <Link
            to="/panchang"
            className="mt-5 inline-flex items-center gap-1 text-sm text-accent hover:underline"
          >
            Full panchang <ArrowRight className="size-4" />
          </Link>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 text-accent">
            <Clock3 className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-widest">
              Upcoming Muhurat
            </span>
          </div>
          {today?.muhurats.length ? (
            <ul className="mt-4 space-y-3 text-sm">
              {today.muhurats.map((m) => (
                <li key={m.name} className="flex items-center justify-between gap-3">
                  <span className="truncate">{m.name}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {m.start}–{m.end}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">No auspicious window left today.</p>
          )}
        </Card>
      </div>

      {/* Personalised */}
      <div className="mt-4 grid lg:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-2 text-accent">
            <Sparkles className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-widest">Mahadasha</span>
          </div>
          <p className="mt-3 font-display text-2xl font-semibold">
            {personal?.dasha.mahadasha ?? "—"}
          </p>
          <p className="text-sm text-muted-foreground">
            until {formatDate(personal?.dasha.mahadashaEnds)}
          </p>
          <div className="mt-3 h-2 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-gradient-brand"
              style={{ width: `${personal?.dasha.progress ?? 0}%` }}
            />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-2 text-accent">
            <Sparkles className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-widest">Antardasha</span>
          </div>
          <p className="mt-3 font-display text-2xl font-semibold">
            {personal?.dasha.antardasha ?? "—"}
          </p>
          <p className="text-sm text-muted-foreground">
            {primary ? `Based on ${primary.name}’s chart` : "Save a chart to personalise"}
          </p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-2 text-accent">
            <TrendingUp className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-widest">Gochar today</span>
          </div>
          <p className="mt-3 font-display text-2xl font-semibold capitalize">
            {personal?.gochar.verdict ?? "—"}
          </p>
          <p className="text-sm text-muted-foreground">
            Score {personal?.gochar.score ?? 0}/100
            {personal?.gochar.favourable.length
              ? ` · favourable: ${personal.gochar.favourable.slice(0, 3).join(", ")}`
              : ""}
          </p>
        </Card>
      </div>

      {/* Analytics */}
      <div className="mt-8 grid sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Metric
          icon={<FileText className="size-4" />}
          label="Reports"
          value={analytics?.reports ?? 0}
          to="/reports"
        />
        <Metric
          icon={<Download className="size-4" />}
          label="Downloads"
          value={analytics?.downloads ?? 0}
          to="/downloads"
        />
        <Metric
          icon={<Sparkles className="size-4" />}
          label="Horoscopes"
          value={analytics?.horoscopeViews ?? 0}
          to="/horoscope-history"
        />
        <Metric
          icon={<Star className="size-4" />}
          label="Saved charts"
          value={analytics?.savedCharts ?? 0}
          to="/my-kundlis"
        />
        <Metric
          icon={<Users className="size-4" />}
          label="Family"
          value={analytics?.familyMembers ?? 0}
          to="/family"
        />
        <Metric
          icon={<Activity className="size-4" />}
          label="AI usage"
          value={analytics?.aiUsage ?? 0}
        />
      </div>

      {/* Lists */}
      <div className="mt-8 grid lg:grid-cols-3 gap-4">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Recent reports</h2>
            <Link to="/reports" className="text-sm text-accent hover:underline">
              Library
            </Link>
          </div>
          {side?.reports.length ? (
            <ul className="mt-4 divide-y divide-border">
              {side.reports.map((r) => (
                <li key={r.id} className="py-3 flex items-center justify-between gap-3">
                  <span className="truncate text-sm font-medium">{r.title}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              No reports yet —{" "}
              <Link to="/kundli" className="text-accent hover:underline">
                generate a Kundli
              </Link>
              .
            </p>
          )}

          <h3 className="mt-8 font-display text-lg font-semibold">Recent downloads</h3>
          {side?.downloads.length ? (
            <ul className="mt-3 divide-y divide-border">
              {side.downloads.map((d) => (
                <li key={d.id} className="py-2.5 flex items-center justify-between gap-3 text-sm">
                  <span className="truncate">{d.filename}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {new Date(d.created_at).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">Nothing downloaded yet.</p>
          )}
        </Card>

        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center gap-2 text-accent">
              <Crown className="size-4" />
              <span className="text-xs font-semibold uppercase tracking-widest">
                Premium status
              </span>
            </div>
            <p className="mt-3 font-display text-xl font-semibold capitalize">
              {side?.entitlement
                ? side.entitlement.entitlement_key.replace(/[-_]/g, " ")
                : "Free plan"}
            </p>
            <Link
              to="/billing"
              className="mt-3 inline-flex items-center gap-1 text-sm text-accent hover:underline"
            >
              Billing <ArrowRight className="size-4" />
            </Link>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 text-accent">
              <Bell className="size-4" />
              <span className="text-xs font-semibold uppercase tracking-widest">Notifications</span>
            </div>
            <p className="mt-3 font-display text-3xl font-semibold">{side?.unread ?? 0}</p>
            <p className="text-sm text-muted-foreground">unread updates</p>
            <Link
              to="/notifications"
              className="mt-3 inline-flex items-center gap-1 text-sm text-accent hover:underline"
            >
              View all <ArrowRight className="size-4" />
            </Link>
          </Card>

          <Card className="p-6">
            <h3 className="font-display text-lg font-semibold">Saved birth charts</h3>
            {charts?.rows.length ? (
              <ul className="mt-3 space-y-2 text-sm">
                {charts.rows.map((c) => (
                  <li key={c.id} className="flex items-center justify-between gap-3">
                    <span className="truncate">{c.name}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">{c.birth_date}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                No charts saved yet — add one from{" "}
                <Link to="/my-kundlis" className="text-accent hover:underline">
                  My Kundlis
                </Link>
                .
              </p>
            )}
            <Link
              to="/my-kundlis"
              className="mt-4 inline-flex items-center gap-1 text-sm text-accent hover:underline"
            >
              Manage charts <ArrowRight className="size-4" />
            </Link>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-widest text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
  to,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  to?: "/reports" | "/downloads" | "/horoscope-history" | "/my-kundlis" | "/family";
}) {
  const body = (
    <Card className="p-4">
      <div className="inline-flex size-8 items-center justify-center rounded-lg bg-primary-soft text-accent">
        {icon}
      </div>
      <p className="mt-2 text-[11px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="font-display text-xl font-semibold">{value}</p>
    </Card>
  );
  return to ? <Link to={to}>{body}</Link> : body;
}
