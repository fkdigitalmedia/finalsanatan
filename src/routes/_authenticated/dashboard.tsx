import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
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
  Briefcase,
  Heart,
  Calendar,
  Globe,
  Compass,
  Search,
  CheckCircle2,
} from "lucide-react";
import { DashboardShell } from "@/components/user/DashboardShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useKundlis, useWorkspaceAnalytics } from "@/lib/workspace/hooks";
import { getMyEntitlements } from "@/lib/payments.functions";
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

type ToolCategory = "All" | "Kundli & Horoscope" | "Relationships" | "Life & Career" | "Reports & PDF";

interface PremiumToolItem {
  id: string;
  title: string;
  description: string;
  category: ToolCategory;
  href: string;
  icon: any;
  badge: string;
  features: string[];
  gradient: string;
}

const TOOL_CATEGORIES: ToolCategory[] = [
  "All",
  "Kundli & Horoscope",
  "Relationships",
  "Life & Career",
  "Reports & PDF",
];

const PREMIUM_TOOLS: PremiumToolItem[] = [
  {
    id: "kundli-pro",
    title: "Janam Kundli Pro",
    description: "Vedic birth chart, Lagna, Navamsa D9, planetary strengths, Vimshottari dasha, and 22+ page print-ready PDF.",
    category: "Kundli & Horoscope",
    href: "/kundli",
    icon: Star,
    badge: "22+ Page PDF",
    features: ["North/South/East Charts", "Full Dasha Analysis", "Instant PDF"],
    gradient: "from-amber-500/10 via-primary/5 to-amber-500/5",
  },
  {
    id: "career-report",
    title: "Career & Business Analysis",
    description: "10th House Karma Bhava deep dive, D10 Dasamsa chart analysis, job vs business suitability, and income timing PDF.",
    category: "Life & Career",
    href: "/tools/career-report",
    icon: Briefcase,
    badge: "Pro PDF",
    features: ["D10 Dasamsa Analysis", "Business vs Job", "Income Vectors"],
    gradient: "from-blue-500/10 via-primary/5 to-cyan-500/5",
  },
  {
    id: "varshphal",
    title: "Varshphal (Annual Return)",
    description: "Solar return annual horoscope, Muntha analysis, 15 Tajika Sahams, Mudda Dasha timeline, and 12-month predictions.",
    category: "Kundli & Horoscope",
    href: "/tools/varshphal",
    icon: Calendar,
    badge: "Annual Report",
    features: ["Muntha Analysis", "15 Tajika Sahams", "Mudda Dasha"],
    gradient: "from-purple-500/10 via-primary/5 to-pink-500/5",
  },
  {
    id: "kundli-matching",
    title: "Kundli Matching (Gun Milan)",
    description: "Traditional 36 Gun Milan, Manglik Dosha, Nadi Dosha, Bhakoot compatibility analysis, and downloadable match report.",
    category: "Relationships",
    href: "/tools/kundli-matching",
    icon: Heart,
    badge: "36 Gunas",
    features: ["36 Gun Milan", "Dosha Cancellations", "Full Match PDF"],
    gradient: "from-rose-500/10 via-primary/5 to-orange-500/5",
  },
  {
    id: "love-compatibility",
    title: "Love & Marriage Compatibility",
    description: "Emotional harmony, psychological dynamics, love language alignment, and comprehensive compatibility PDF.",
    category: "Relationships",
    href: "/tools/love-compatibility",
    icon: Sparkles,
    badge: "Relationship Guide",
    features: ["Romantic Dynamics", "Emotional Sync", "Shareable PDF"],
    gradient: "from-pink-500/10 via-primary/5 to-rose-500/5",
  },
  {
    id: "numerology-report",
    title: "Numerology Pro Report",
    description: "Life Path, Destiny, Soul Urge, 12-Month Personal Year timeline, Pinnacle cycles, and 30-40 page commercial PDF.",
    category: "Life & Career",
    href: "/tools/numerology-report",
    icon: FileText,
    badge: "30-Section PDF",
    features: ["Life Path & Destiny", "12-Month Timeline", "Pinnacle Cycles"],
    gradient: "from-emerald-500/10 via-primary/5 to-teal-500/5",
  },
  {
    id: "marriage-analysis",
    title: "Marriage & Spouse Analysis",
    description: "Navamsa D9 chart breakdown, spouse nature and direction, marriage timing Dasha, and relationship longevity.",
    category: "Relationships",
    href: "/tools/marriage-analysis",
    icon: Users,
    badge: "Navamsa D9",
    features: ["Spouse Characteristics", "Marriage Timing", "Remedies"],
    gradient: "from-violet-500/10 via-primary/5 to-purple-500/5",
  },
  {
    id: "health-analysis",
    title: "Vedic Health & Medical Astrology",
    description: "D6 & D8 astrological vulnerability indicators, planetary balance, wellness scorecards, and Ayurvedic recommendations.",
    category: "Reports & PDF",
    href: "/tools/health-analysis",
    icon: Activity,
    badge: "Medical Astrology",
    features: ["Organ System Trends", "Vulnerability Score", "Ayurvedic Remedies"],
    gradient: "from-emerald-500/10 via-primary/5 to-green-500/5",
  },
  {
    id: "foreign-settlement",
    title: "Foreign Settlement & Travel",
    description: "9th and 12th house relocation potentials, overseas higher education, visa approval timing, and permanent residence.",
    category: "Life & Career",
    href: "/tools/foreign-settlement-analysis",
    icon: Globe,
    badge: "Travel & PR",
    features: ["Visa Timing", "Relocation Prospects", "Overseas Career"],
    gradient: "from-sky-500/10 via-primary/5 to-indigo-500/5",
  },
  {
    id: "master-life-blueprint",
    title: "Master Life Blueprint (VIP)",
    description: "The ultimate 96-page VIP astrological blueprint covering career, wealth, marriage, spirituality, and lifelong milestones.",
    category: "Reports & PDF",
    href: "/tools/master-life-blueprint",
    icon: Crown,
    badge: "96-Page VIP",
    features: ["Comprehensive 96 Pages", "Lifelong Timelines", "VIP Publication Grade"],
    gradient: "from-amber-500/15 via-yellow-500/10 to-amber-600/10",
  },
  {
    id: "muhurat-finder",
    title: "Auspicious Muhurat Finder",
    description: "Calculate optimal shubh muhurats for marriage, property purchase, vehicle registration, and Griha Pravesh.",
    category: "Reports & PDF",
    href: "/tools/muhurat-finder",
    icon: Clock3,
    badge: "Panchang Timing",
    features: ["Marriage Muhurat", "Griha Pravesh", "Vehicle & Business"],
    gradient: "from-amber-500/10 via-orange-500/5 to-primary/5",
  },
  {
    id: "vastu-report",
    title: "Vastu Energy Report",
    description: "Evaluate directional energies of your home, office, or plot using classical Vastu Shastra principles and remedial guides.",
    category: "Reports & PDF",
    href: "/tools/vastu-report",
    icon: Compass,
    badge: "Vastu Shastra",
    features: ["Directional Alignment", "Energy Scorecard", "Remedial Tips"],
    gradient: "from-teal-500/10 via-emerald-500/5 to-primary/5",
  },
];

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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const payment = params.get("payment");
    if (!payment) return;

    window.history.replaceState({}, "", window.location.pathname);

    if (payment === "success") {
      toast.success("Payment successful! Aapka subscription activate ho gaya hai. 🎉");
    } else if (payment === "pending") {
      toast.info("Payment pending hai. Jaise hi confirm hoga aapka plan activate ho jayega.");
    }
  }, []);

  const loc = useMemo(() => (primary ? locationFromKundli(primary) : DEFAULT_LOCATION), [primary]);

  const fetchEntitlements = useServerFn(getMyEntitlements);
  const { data: entData } = useQuery({
    queryKey: ["my-entitlements", uid ?? "anon"],
    queryFn: () => fetchEntitlements(),
    enabled: !!uid,
    staleTime: 60_000,
  });

  const entitlements = entData?.entitlements ?? [];
  const isLifetime = entitlements.some((e) =>
    ["lifetime", "lifetime_vip", "lifetime_access", "admin"].includes(e),
  );
  const isPro =
    isLifetime ||
    entitlements.some((e) =>
      ["pro", "premium_access", "premium", "pro-monthly", "pro-yearly"].includes(e),
    );

  const [toolSearch, setToolSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>("All");

  const filteredTools = useMemo(() => {
    return PREMIUM_TOOLS.filter((tool) => {
      const matchesCat = selectedCategory === "All" || tool.category === selectedCategory;
      const q = toolSearch.toLowerCase().trim();
      const matchesQuery =
        !q ||
        tool.title.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.features.some((f) => f.toLowerCase().includes(q));
      return matchesCat && matchesQuery;
    });
  }, [toolSearch, selectedCategory]);

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
      description="Your personal astrology workspace — panchang, dasha, gochar, premium tools and reports in one place."
      actions={
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <a href="#premium-tools" className="flex-1 sm:flex-initial">
            <Button variant="outline" className="w-full border-amber-500/40 hover:bg-amber-500/10 text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-4">
              <Crown className="size-3.5 sm:size-4 text-amber-500 mr-1.5 shrink-0" /> Premium Tools
            </Button>
          </a>
          <Link to="/my-kundlis" className="flex-1 sm:flex-initial">
            <Button className="w-full text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-4">
              <Star className="size-3.5 sm:size-4 mr-1.5 shrink-0" /> My Kundlis
            </Button>
          </Link>
        </div>
      }
    >
      {/* Plan Status Banner */}
      {isLifetime ? (
        <div className="mb-6 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 shadow-sm">
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <div className="flex shrink-0 items-center justify-center size-10 rounded-xl bg-amber-500/20 text-amber-600 border border-amber-500/30 shadow-sm">
              <Crown className="size-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-sm text-foreground">Lifetime VIP Pass Active</span>
                <Badge className="bg-amber-500 text-white text-[10px] px-2 py-0 border-0">VIP Access</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Aapke paas sabhi 12+ Premium Tools aur publication-grade PDF report downloads ka unrestricted lifetime access hai.
              </p>
            </div>
          </div>
          <a
            href="#premium-tools"
            className="inline-flex shrink-0 items-center justify-center gap-1 text-xs font-semibold text-primary hover:underline bg-background/80 border px-3 py-2 rounded-xl shadow-2xs w-full sm:w-auto"
          >
            Aapke Premium Tools <ArrowRight className="size-3.5" />
          </a>
        </div>
      ) : isPro ? (
        <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/15 via-primary/5 to-emerald-500/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 shadow-sm">
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <div className="flex shrink-0 items-center justify-center size-10 rounded-xl bg-emerald-500/20 text-emerald-600 border border-emerald-500/30">
              <Sparkles className="size-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-sm text-foreground">Pro Subscription Active</span>
                <Badge className="bg-emerald-600 text-white text-[10px] px-2 py-0 border-0">Pro Unlocked</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                All Pro astrology calculators, deep compatibility tools, and PDF downloads are unlocked.
              </p>
            </div>
          </div>
          <a
            href="#premium-tools"
            className="inline-flex shrink-0 items-center justify-center gap-1 text-xs font-semibold text-primary hover:underline bg-background/80 border px-3 py-2 rounded-xl shadow-2xs w-full sm:w-auto"
          >
            Aapke Premium Tools <ArrowRight className="size-3.5" />
          </a>
        </div>
      ) : null}

      {/* Today */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-4 sm:p-6 lg:col-span-2">
          <div className="flex items-center gap-2 text-accent">
            <Sun className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-widest">
              Today’s Panchang · {loc.label}
            </span>
          </div>
          {today ? (
            <dl className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 text-sm">
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

        <Card className="p-4 sm:p-6">
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
      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4 sm:p-6">
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
        <Card className="p-4 sm:p-6">
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
        <Card className="p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
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

      {/* Premium Tools Suite */}
      <section id="premium-tools" className="mt-8 sm:mt-10 scroll-mt-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-semibold mb-2 border border-amber-500/20">
              <Crown className="size-3.5 shrink-0" />
              <span>Premium Vedic Astrological Tools</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
              Aapke Premium Vedic Tools
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
              Kundli, Career D10, Varshphal, Gun Milan, Numerology aur sabhi high-precision calculators — direct access ke sath.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search tools (e.g. Career, Match)..."
              value={toolSearch}
              onChange={(e) => setToolSearch(e.target.value)}
              className="pl-9 pr-14 h-10 rounded-xl bg-card border-border/80 text-sm focus-visible:ring-amber-500 w-full"
            />
            {toolSearch && (
              <button
                type="button"
                onClick={() => setToolSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground hover:text-foreground px-1.5 py-0.5"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-4 sm:mb-6">
          {TOOL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow-2xs font-semibold"
                  : "bg-card hover:bg-muted text-muted-foreground border border-border/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        {filteredTools.length === 0 ? (
          <div className="text-center py-10 px-4 rounded-2xl border border-dashed border-border bg-card/50">
            <Search className="size-8 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-base font-medium">Koi tool nahi mila</p>
            <p className="text-xs text-muted-foreground mt-1">
              &ldquo;{toolSearch}&rdquo; se milta julta koi tool nahi mila. Dusra search try karein.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setToolSearch("");
                setSelectedCategory("All");
              }}
              className="mt-4 text-xs"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
            {filteredTools.map((tool) => {
              const IconComp = tool.icon;
              return (
                <Card
                  key={tool.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card p-4 sm:p-5 transition-all duration-200 hover:border-amber-500/40 hover:shadow-md hover:-translate-y-0.5"
                >
                  {/* Gradient background accent */}
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-40 transition-opacity group-hover:opacity-100`}
                  />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-2.5 mb-2.5 sm:mb-3">
                      <div className="flex shrink-0 size-10 sm:size-11 items-center justify-center rounded-xl bg-background/90 shadow-2xs border border-border/60 text-primary group-hover:border-amber-500/40 group-hover:text-amber-500 transition-colors">
                        <IconComp className="size-5" />
                      </div>
                      <div className="flex flex-wrap items-center justify-end gap-1.5">
                        <Badge
                          variant="outline"
                          className="text-[10px] sm:text-[11px] font-medium bg-background/80 border-border/70 shrink-0"
                        >
                          {tool.badge}
                        </Badge>
                        {isLifetime ? (
                          <Badge className="bg-amber-500 text-white text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0 border-0 shadow-2xs shrink-0">
                            ✨ Unlocked
                          </Badge>
                        ) : isPro ? (
                          <Badge className="bg-emerald-600 text-white text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0 border-0 shadow-2xs shrink-0">
                            ✨ Pro
                          </Badge>
                        ) : null}
                      </div>
                    </div>

                    <Link to={tool.href} className="block group-hover:underline">
                      <h3 className="font-display text-base sm:text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                        {tool.title}
                      </h3>
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {tool.description}
                    </p>

                    {/* Features pills */}
                    <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5">
                      {tool.features.map((feat, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-foreground/80 bg-background/90 border border-border/50 px-2 py-0.5 rounded-md"
                        >
                          <CheckCircle2 className="size-2.5 sm:size-3 text-emerald-500 shrink-0" />
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="relative z-10 mt-4 sm:mt-5 pt-3 border-t border-border/40 flex items-center justify-between gap-2">
                    <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground uppercase tracking-wider truncate">
                      {tool.category}
                    </span>
                    <Link
                      to={tool.href}
                      className="inline-flex shrink-0 items-center justify-center gap-1.5 text-xs font-semibold text-primary group-hover:text-amber-600 transition-colors bg-primary/5 hover:bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-lg active:scale-95"
                    >
                      <span>Launch Tool</span>
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Analytics */}
      <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
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
      <div className="mt-6 sm:mt-8 grid lg:grid-cols-3 gap-4">
        <Card className="p-4 sm:p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg sm:text-xl font-semibold">Recent reports</h2>
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

          <h3 className="mt-6 sm:mt-8 font-display text-base sm:text-lg font-semibold">Recent downloads</h3>
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
          <Card className="p-4 sm:p-6">
            <div className="flex items-center gap-2 text-accent">
              <Crown className="size-4" />
              <span className="text-xs font-semibold uppercase tracking-widest">
                Premium status
              </span>
            </div>
            <p className="mt-3 font-display text-lg sm:text-xl font-semibold capitalize">
              {isLifetime
                ? "Lifetime VIP Pass ✨"
                : isPro
                ? "Pro Subscription Active ✨"
                : side?.entitlement
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

          <Card className="p-4 sm:p-6">
            <div className="flex items-center gap-2 text-accent">
              <Bell className="size-4" />
              <span className="text-xs font-semibold uppercase tracking-widest">Notifications</span>
            </div>
            <p className="mt-3 font-display text-2xl sm:text-3xl font-semibold">{side?.unread ?? 0}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">unread updates</p>
            <Link
              to="/notifications"
              className="mt-3 inline-flex items-center gap-1 text-sm text-accent hover:underline"
            >
              View all <ArrowRight className="size-4" />
            </Link>
          </Card>

          <Card className="p-4 sm:p-6">
            <h3 className="font-display text-base sm:text-lg font-semibold">Saved birth charts</h3>
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
    <Card className="p-3 sm:p-4 hover:border-accent/40 transition-colors">
      <div className="inline-flex size-7 sm:size-8 items-center justify-center rounded-lg bg-primary-soft text-accent">
        {icon}
      </div>
      <p className="mt-1.5 sm:mt-2 text-[10px] sm:text-[11px] uppercase tracking-widest text-muted-foreground truncate">{label}</p>
      <p className="font-display text-lg sm:text-xl font-semibold">{value}</p>
    </Card>
  );
  return to ? <Link to={to}>{body}</Link> : body;
}
