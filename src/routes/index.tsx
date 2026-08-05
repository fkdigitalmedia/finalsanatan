import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  Search,
  Heart,
  Bell,
  Star,
  Zap,
  Shield,
  Globe2,
  Calendar,
  Calculator,
  Heart as HeartIcon,
  Moon,
  Sun,
  Baby,
  Gem,
  FileText,
  Users,
} from "lucide-react";

import { SiteLayout } from "@/components/layout/SiteLayout";
import { SectionHeading } from "@/components/ui-kit/SectionHeading";
import { CategoryCard } from "@/components/ui-kit/CategoryCard";
import { FestivalCard } from "@/components/ui-kit/FestivalCard";
import { AdSlot } from "@/components/ui-kit/AdSlot";
import { FAQList } from "@/components/ui-kit/FAQList";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CATEGORIES } from "@/config/categories";
import { useTranslation } from "@/i18n/I18nProvider";
import { useCategoryLabel } from "@/i18n/useCategoryLabel";
import { LocalizedHead } from "@/components/i18n/LocalizedHead";

// Static English defaults used for SSR head() — client-side LocalizedHead
// takes over the moment the language dictionary loads.
const EN_HOME_TITLE = "SanatanTools — Panchang, Mantras, Festivals & AI Utilities";
const EN_HOME_DESC =
  "100+ Sanatan Dharma tools — Panchang, mantras, festivals, temples, calculators, Sanskrit learning and AI utilities. Free, fast and beautifully crafted.";

const EN_FAQ = [
  {
    q: "What is SanatanTools.com?",
    a: "SanatanTools is the largest collection of Sanatan Dharma tools on the internet — Panchang, mantras, festivals, temples, calculators, Sanskrit learning, baby names and AI utilities. Every tool is designed to be beautiful, fast and free.",
  },
  {
    q: "When will the tools be available?",
    a: "We are rolling out categories one by one. Subscribe on any category page to be notified the moment its tools go live.",
  },
  {
    q: "Are the tools free?",
    a: "Yes. Every core tool is free forever. A premium plan will unlock unlimited AI, saved history, personalised Panchang and an ad-free experience.",
  },
  {
    q: "Which languages are supported?",
    a: "English and Hindi at launch. Sanskrit, Marathi, Gujarati, Tamil, Telugu, Kannada and Bengali are on the roadmap.",
  },
  {
    q: "Is my personal data safe?",
    a: "Absolutely. Data is encrypted, never sold, and can be deleted from your dashboard at any time.",
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: EN_HOME_TITLE },
      { name: "description", content: EN_HOME_DESC },
      {
        property: "og:title",
        content: "SanatanTools — The largest Sanatan Dharma utility platform",
      },
      {
        property: "og:description",
        content:
          "Panchang, mantras, festivals, temples, calculators, Sanskrit, baby names, AI and more — 100+ tools in one place.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "SanatanTools",
          url: "/",
          potentialAction: {
            "@type": "SearchAction",
            target: "/tools?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: EN_FAQ.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: HomePage,
});

const upcomingFestivals = [
  {
    name: "Makar Sankranti",
    devanagari: "मकर संक्रांति",
    date: "14 Jan 2026",
    daysAway: 12,
    region: "All India",
  },
  { name: "Vasant Panchami", devanagari: "वसंत पंचमी", date: "23 Jan 2026", daysAway: 21 },
  { name: "Maha Shivaratri", devanagari: "महाशिवरात्रि", date: "17 Feb 2026", daysAway: 46 },
  { name: "Holi", devanagari: "होली", date: "3 Mar 2026", daysAway: 60, region: "North" },
];

export function HomePage() {
  const { t, raw, lang } = useTranslation();
  const catLabel = useCategoryLabel();
  const navigate = useNavigate();
  const [heroQuery, setHeroQuery] = useState("");
  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = heroQuery.trim();
    navigate({ to: "/tools", search: q ? { q } : { q: "" } });
  };

  const faqs = raw<{ q: string; a: string }[]>("home.faq.items") ?? EN_FAQ;
  const popular = t("home.hero.popular_items")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const features = [
    {
      icon: Zap,
      title: t("home.features.items.fast_title"),
      body: t("home.features.items.fast_body"),
    },
    {
      icon: Shield,
      title: t("home.features.items.private_title"),
      body: t("home.features.items.private_body"),
    },
    {
      icon: Globe2,
      title: t("home.features.items.multilingual_title"),
      body: t("home.features.items.multilingual_body"),
    },
    {
      icon: Sparkles,
      title: t("home.features.items.ai_title"),
      body: t("home.features.items.ai_body"),
    },
  ];

  return (
    <SiteLayout>
      <LocalizedHead
        titleKey="home.meta.title"
        descriptionKey="home.meta.description"
        ogTitleKey="home.meta.og_title"
        ogDescriptionKey="home.meta.og_description"
        structuredData={{
          id: "home-faq",
          data: {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            inLanguage: lang,
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        }}
      />

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-glow" aria-hidden />
        <div
          className="absolute inset-x-0 top-0 h-[520px] bg-gradient-to-b from-primary-soft/60 to-transparent"
          aria-hidden
        />

        <div className="container-page relative pt-14 pb-16 md:pt-24 md:pb-24">
          <div className="flex flex-col items-center text-center">
            <Badge
              variant="outline"
              className="mb-5 gap-1.5 rounded-full border-primary/40 bg-background/70 backdrop-blur px-3 py-1 text-xs font-medium"
            >
              <Sparkles className="size-3 text-primary" />
              {t("home.hero.badge")}
            </Badge>

            <h1 className="font-display text-5xl md:text-7xl font-semibold tracking-tight max-w-4xl leading-[1.05]">
              {t("home.hero.title_a")}{" "}
              <span className="text-gradient-brand">{t("home.hero.title_b")}</span>
              {t("home.hero.title_c")}
            </h1>
            <p className="mt-5 max-w-2xl text-base md:text-lg text-muted-foreground">
              {t("home.hero.subtitle")}
            </p>
            <p className="mt-3 font-devanagari text-lg text-accent">{t("home.hero.shloka")}</p>

            {/* Big search */}
            <form className="mt-8 w-full max-w-xl" onSubmit={submitSearch}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                <Input
                  className="h-14 pl-12 pr-32 rounded-2xl bg-background/90 backdrop-blur shadow-elegant border-border text-base"
                  placeholder={t("home.hero.search_placeholder")}
                  aria-label={t("search.title")}
                  value={heroQuery}
                  onChange={(e) => setHeroQuery(e.target.value)}
                />
                <Button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-10 rounded-xl shadow-glow"
                >
                  {t("common.search")}
                </Button>
              </div>
              <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                <span>{t("home.hero.popular")}</span>
                {popular.map((p) => (
                  <span
                    key={p}
                    className="rounded-full border border-border bg-background/70 px-2.5 py-0.5"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </form>

            <div className="mt-10 flex items-center gap-6 text-xs uppercase tracking-wider text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Heart className="size-3.5 text-accent" /> {t("home.hero.badge_free")}
              </span>
              <span className="hidden sm:flex items-center gap-1.5">
                <Bell className="size-3.5 text-primary" /> {t("home.hero.badge_no_ads")}
              </span>
              <span className="hidden md:flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-gold" /> {t("home.hero.badge_ai")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES GRID ─────────────────────────────────── */}
      <section id="categories" className="container-page py-16 md:py-20">
        <SectionHeading
          eyebrow={t("home.categories.eyebrow")}
          title={t("home.categories.title")}
          description={t("home.categories.description")}
        />
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {CATEGORIES.map((c) => (
            <a key={c.slug} href={`/${c.slug}`} className="contents">
              <CategoryCard
                icon={<c.icon className="size-5" />}
                title={catLabel(c.slug, "title", c.title)}
                count={c.plannedTools.length}
                hue={c.hue}
              />
            </a>
          ))}
        </div>
      </section>

      <div className="container-page">
        <AdSlot size="leaderboard" />
      </div>

      {/* ── KUNDLI TOOLS SECTION ────────────────────────────── */}
      <section id="kundli-tools" className="relative py-16 md:py-20">
        <div
          className="absolute inset-0 bg-gradient-to-b from-primary-soft/30 via-transparent to-transparent"
          aria-hidden
        />
        <div className="container-page relative">
          <div className="flex items-end justify-between gap-4 flex-wrap mb-8">
            <SectionHeading
              eyebrow={t("home.kundli_section.eyebrow")}
              title={t("home.kundli_section.title")}
              description={t("home.kundli_section.description")}
            />
            <a href="/astrology">
              <Button variant="outline" className="gap-2">
                {t("home.kundli_section.explore_all")} <ArrowRight className="size-4" />
              </Button>
            </a>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[
              {
                href: "/kundli",
                icon: FileText,
                title: t("home.kundli_tools.free_kundli.title"),
                desc: t("home.kundli_tools.free_kundli.desc"),
                badge: t("badges.popular"),
                hue: "from-amber-500/20 to-orange-500/10",
              },
              {
                href: "/tools/kundli-matching",
                icon: HeartIcon,
                title: t("home.kundli_tools.kundli_matching.title"),
                desc: t("home.kundli_tools.kundli_matching.desc"),
                badge: t("badges.new"),
                hue: "from-rose-500/20 to-pink-500/10",
              },
              {
                href: "/tools/love-compatibility",
                icon: HeartIcon,
                title: t("home.kundli_tools.love_compatibility.title"),
                desc: t("home.kundli_tools.love_compatibility.desc"),
                badge: t("badges.new"),
                hue: "from-pink-500/20 to-fuchsia-500/10",
              },
              {
                href: "/tools/muhurat-finder",
                icon: Calendar,
                title: t("home.kundli_tools.muhurat_finder.title"),
                desc: t("home.kundli_tools.muhurat_finder.desc"),
                badge: t("badges.new"),
                hue: "from-sky-500/20 to-cyan-500/10",
              },
              {
                href: "/tools/career-report",
                icon: Users,
                title: t("home.kundli_tools.career_report.title"),
                desc: t("home.kundli_tools.career_report.desc"),
                badge: t("badges.new"),
                hue: "from-blue-500/20 to-indigo-500/10",
              },
              {
                href: "/tools/varshphal",
                icon: Calendar,
                title: t("home.kundli_tools.varshphal.title"),
                desc: t("home.kundli_tools.varshphal.desc"),
                badge: t("badges.new"),
                hue: "from-orange-500/20 to-red-500/10",
              },
              {
                href: "/tools/numerology-report",
                icon: Calculator,
                title: t("home.kundli_tools.numerology.title"),
                desc: t("home.kundli_tools.numerology.desc"),
                badge: t("badges.new"),
                hue: "from-violet-500/20 to-purple-500/10",
              },
              {
                href: "/tools/vastu-report",
                icon: Sparkles,
                title: t("home.kundli_tools.vastu.title"),
                desc: t("home.kundli_tools.vastu.desc"),
                badge: t("badges.new"),
                hue: "from-emerald-500/20 to-teal-500/10",
              },
              {
                href: "/tools/baby-name-generator",
                icon: Baby,
                title: t("home.kundli_tools.baby_name.title"),
                desc: t("home.kundli_tools.baby_name.desc"),
                hue: "from-cyan-500/20 to-teal-500/10",
              },
              {
                href: "/tools/rashi-calculator",
                icon: Moon,
                title: t("home.kundli_tools.rashi_calc.title"),
                desc: t("home.kundli_tools.rashi_calc.desc"),
                hue: "from-indigo-500/20 to-blue-500/10",
              },
              {
                href: "/tools/nakshatra-finder",
                icon: Star,
                title: t("home.kundli_tools.nakshatra_finder.title"),
                desc: t("home.kundli_tools.nakshatra_finder.desc"),
                hue: "from-violet-500/20 to-purple-500/10",
              },
              {
                href: "/tools/gemstone-recommender",
                icon: Gem,
                title: t("home.kundli_tools.gemstone.title"),
                desc: t("home.kundli_tools.gemstone.desc"),
                hue: "from-fuchsia-500/20 to-pink-500/10",
              },
            ].map((tool) => (
              <a
                key={tool.href}
                href={tool.href}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card hover:shadow-elegant hover:-translate-y-0.5 transition-all"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${tool.hue} opacity-60 group-hover:opacity-100 transition-opacity`}
                  aria-hidden
                />
                <div className="relative">
                  <div className="flex items-start justify-between">
                    <div className="grid place-items-center size-11 rounded-xl bg-background/80 backdrop-blur text-accent">
                      <tool.icon className="size-5" />
                    </div>
                    {tool.badge && (
                      <Badge variant="secondary" className="text-[10px] font-semibold">
                        {tool.badge}
                      </Badge>
                    )}
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold tracking-tight">
                    {tool.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{tool.desc}</p>
                  <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                    {t("home.kundli_section.open")} <ArrowRight className="size-3.5" />
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Users className="size-3.5 text-primary" /> {t("home.kundli_section.trusted")}
            </span>
            <span>•</span>
            <span>{t("home.kundli_section.lahiri")}</span>
            <span>•</span>
            <span>{t("home.kundli_section.free_core")}</span>
            <span>•</span>
            <a href="/astrology" className="text-primary hover:underline">
              {t("home.kundli_section.see_all")}
            </a>
          </div>
        </div>
      </section>

      {/* ── FESTIVALS STRIP ─────────────────────────────────── */}
      <section className="container-page py-16 md:py-20">
        <div className="flex items-end justify-between gap-4 flex-wrap mb-8">
          <SectionHeading
            eyebrow={t("home.festivals.eyebrow")}
            title={t("home.festivals.title")}
            description={t("home.festivals.description")}
          />
          <a href="/festivals">
            <Button variant="outline" className="gap-2">
              {t("home.festivals.view_all")} <ArrowRight className="size-4" />
            </Button>
          </a>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {upcomingFestivals.map((f) => (
            <FestivalCard key={f.name} {...f} />
          ))}
        </div>
      </section>

      {/* ── FEATURED SPOTLIGHT ──────────────────────────────── */}
      <section className="container-page py-16 md:py-20">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-accent to-accent/70 text-accent-foreground p-8 md:p-14 shadow-elegant">
          <div
            className="absolute -right-24 -top-24 size-80 rounded-full bg-primary/40 blur-3xl"
            aria-hidden
          />
          <div
            className="absolute -left-24 -bottom-24 size-80 rounded-full bg-gold/30 blur-3xl"
            aria-hidden
          />
          <div className="relative grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center">
            <div>
              <Badge className="bg-background/20 text-accent-foreground border-accent-foreground/30 backdrop-blur">
                <Star className="size-3 mr-1" /> {t("home.spotlight.badge")}
              </Badge>
              <h2 className="mt-4 font-display text-3xl md:text-5xl font-semibold tracking-tight">
                {t("home.spotlight.title")}
              </h2>
              <p className="mt-3 text-accent-foreground/90 max-w-xl">{t("home.spotlight.body")}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="/panchang">
                  <Button size="lg" variant="secondary" className="font-semibold">
                    {t("home.spotlight.cta")} <ArrowRight className="size-4" />
                  </Button>
                </a>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-accent-foreground/40 text-accent-foreground hover:bg-background/10"
                >
                  {t("common.notify_me")}
                </Button>
              </div>
            </div>
            <div className="hidden lg:grid grid-cols-2 gap-3">
              {[
                { k: "Tithi", v: "Shukla Ashtami" },
                { k: "Nakshatra", v: "Rohini" },
                { k: "Yoga", v: "Shubha" },
                { k: "Rahu Kaal", v: "10:30 – 12:00" },
              ].map((s) => (
                <div
                  key={s.k}
                  className="rounded-2xl bg-background/15 backdrop-blur border border-accent-foreground/20 p-4"
                >
                  <p className="text-[11px] uppercase tracking-wider opacity-80">{s.k}</p>
                  <p className="mt-1 font-display text-lg font-semibold">{s.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY US ──────────────────────────────────────────── */}
      <section className="container-page py-16 md:py-20">
        <SectionHeading
          eyebrow={t("home.features.eyebrow")}
          title={t("home.features.title")}
          align="center"
        />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="grid place-items-center size-11 rounded-xl bg-primary-soft text-accent">
                <f.icon className="size-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────── */}
      <section className="container-page py-16 md:py-20">
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-10">
          <SectionHeading
            eyebrow={t("home.faq.eyebrow")}
            title={t("home.faq.title")}
            description={t("home.faq.description")}
          />
          <FAQList items={faqs} />
        </div>
      </section>

      {/* ── AI VEDIC GUIDANCE & QUICK ASTROLOGY HUB ────────── */}
      <section className="container-page pb-16">
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-amber-500/15 via-card to-background p-8 md:p-12 shadow-elegant">
          <div
            className="absolute -right-20 -top-20 size-72 rounded-full bg-primary/20 blur-3xl pointer-events-none"
            aria-hidden
          />
          <div
            className="absolute -left-20 -bottom-20 size-72 rounded-full bg-amber-500/15 blur-3xl pointer-events-none"
            aria-hidden
          />

          <div className="relative grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                <Sparkles className="size-3.5 text-amber-500" />
                <span>AI Vedic Astrologer & Shastra Intelligence</span>
              </div>

              <h2 className="mt-4 font-display text-3xl md:text-5xl font-semibold tracking-tight leading-tight">
                Instant Vedic Horoscope & AI Astrological Insights
              </h2>

              <p className="mt-3 text-base text-muted-foreground max-w-xl">
                Get accurate Lahiri Ayanamsa Kundli, daily horoscope predictions, Gun Milan match-making, and AI-powered answers grounded in authentic Vedic scriptures.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a href="/kundli">
                  <Button size="lg" className="h-12 px-6 shadow-glow font-semibold gap-2">
                    <FileText className="size-4" />
                    Generate Free Kundli
                  </Button>
                </a>
                <a href="/daily-horoscope">
                  <Button size="lg" variant="outline" className="h-12 px-6 font-semibold gap-2 border-primary/30 hover:bg-primary/5">
                    <Sun className="size-4 text-amber-500" />
                    Check Daily Horoscope
                  </Button>
                </a>
                <a href="/tools">
                  <Button size="lg" variant="ghost" className="h-12 px-5 font-medium gap-1 text-muted-foreground hover:text-foreground">
                    All 100+ Tools <ArrowRight className="size-4" />
                  </Button>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  href: "/kundli",
                  icon: Star,
                  title: "Free Janam Kundli",
                  desc: "Vimshottari Dasha, planetary chart & Dosha analysis.",
                  color: "text-amber-500",
                },
                {
                  href: "/tools/kundli-matching",
                  icon: Heart,
                  title: "Kundli Matching",
                  desc: "36 Gunas Ashta Koota marriage compatibility test.",
                  color: "text-rose-500",
                },
                {
                  href: "/panchang",
                  icon: Calendar,
                  title: "Today's Panchang",
                  desc: "Tithi, Nakshatra, Yoga, Rahu Kaal & Abhijit Muhurat.",
                  color: "text-emerald-500",
                },
                {
                  href: "/tools/gemstone-recommender",
                  icon: Gem,
                  title: "Gemstone Guide",
                  desc: "AI gemstone & mantra recommendations for your Rashi.",
                  color: "text-cyan-500",
                },
              ].map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  className="group rounded-2xl border border-border/80 bg-background/80 p-4 shadow-card hover:border-primary/50 hover:shadow-elegant transition-all"
                >
                  <div className={`grid place-items-center size-9 rounded-xl bg-muted/60 ${item.color} group-hover:scale-110 transition-transform`}>
                    <item.icon className="size-4.5" />
                  </div>
                  <h3 className="mt-3 font-display text-sm font-semibold flex items-center justify-between">
                    {item.title}
                    <ArrowRight className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
