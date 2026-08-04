// Dedicated hub for all Kundli & Jyotish (astrology) tools in one place.
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  FileText,
  Heart as HeartIcon,
  Moon,
  Star,
  Calculator,
  Sun,
  Baby,
  Gem,
  Briefcase,
  Calendar,
  Hash,
  Compass,
  Sparkles,
  Users,
  Clock,
  Flame,
} from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Breadcrumbs } from "@/components/ui-kit/Breadcrumbs";
import { SectionHeading } from "@/components/ui-kit/SectionHeading";
import { Badge } from "@/components/ui/badge";
import { NewsletterCTA } from "@/components/tools/NewsletterCTA";
import { useTranslation } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/astrology")({
  head: () => ({
    meta: [
      { title: "Vedic Astrology & Kundli Tools — All in One Place" },
      {
        name: "description",
        content:
          "Complete Vedic astrology suite — Free Kundli, Kundli Matching, Rashi & Nakshatra Finder, Dasha, Muhurat, Numerology, Vastu, Baby Names, Career, Varshphal and more.",
      },
      { property: "og:title", content: "Kundli & Jyotish Tools — SanatanTools" },
      {
        property: "og:description",
        content:
          "All Vedic astrology tools — Kundli, Matching, Dasha, Muhurat, Numerology, Vastu, Career and Varshphal in one place.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/astrology" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/astrology" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Vedic Astrology & Kundli Tools",
          description: "Complete suite of Vedic astrology tools on SanatanTools.",
          url: "/astrology",
        }),
      },
    ],
  }),
  component: AstrologyHub,
});

interface JT {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  badge?: string;
  hue: string;
  group: "core" | "premium" | "calculators" | "life";
}

const TOOLS: JT[] = [
  // Core charts
  {
    group: "core",
    href: "/kundli",
    icon: FileText,
    title: "Free Janam Kundli",
    desc: "Full Vedic birth chart with D1/D9, planets, houses, dashas & AI reading.",
    badge: "Popular",
    hue: "from-amber-500/20 to-orange-500/10",
  },
  {
    group: "core",
    href: "/tools/kundli-matching",
    icon: HeartIcon,
    title: "Kundli Matching (Guna Milan)",
    desc: "Ashtakoot 36 guna, Mangal, Nadi & Bhakoot dosha analysis.",
    badge: "New",
    hue: "from-rose-500/20 to-pink-500/10",
  },
  {
    group: "core",
    href: "/tools/love-compatibility",
    icon: HeartIcon,
    title: "Love Compatibility",
    desc: "Modern Vedic relationship & emotional compatibility test.",
    badge: "New",
    hue: "from-pink-500/20 to-fuchsia-500/10",
  },
  {
    group: "core",
    href: "/panchang",
    icon: Sun,
    title: "Daily Panchang",
    desc: "Tithi, Nakshatra, Yoga, Karana, Rahu Kaal for any city.",
    hue: "from-yellow-500/20 to-amber-500/10",
  },

  // Calculators
  {
    group: "calculators",
    href: "/tools/rashi-calculator",
    icon: Moon,
    title: "Rashi Calculator",
    desc: "Find your Moon sign (Chandra Rashi) from birth details.",
    hue: "from-indigo-500/20 to-blue-500/10",
  },
  {
    group: "calculators",
    href: "/tools/nakshatra-finder",
    icon: Star,
    title: "Nakshatra Finder",
    desc: "Discover your birth Nakshatra, pada & ruling deity.",
    hue: "from-violet-500/20 to-purple-500/10",
  },
  {
    group: "calculators",
    href: "/tools/dasha-calculator",
    icon: Calculator,
    title: "Vimshottari Dasha",
    desc: "Complete 120-year Mahadasha & Antardasha timeline.",
    hue: "from-emerald-500/20 to-teal-500/10",
  },
  {
    group: "calculators",
    href: "/tools/kundli-generator",
    icon: Sun,
    title: "Quick Kundli Snapshot",
    desc: "Instant Rashi, Nakshatra, Tithi, Yoga & naming letters.",
    hue: "from-yellow-500/20 to-amber-500/10",
  },
  {
    group: "calculators",
    href: "/tools/muhurat-finder",
    icon: Clock,
    title: "Muhurat Finder",
    desc: "Choghadiya, Rahu Kaal & auspicious timings for any date.",
    badge: "New",
    hue: "from-sky-500/20 to-cyan-500/10",
  },

  // Premium / Life reports
  {
    group: "premium",
    href: "/tools/career-report",
    icon: Briefcase,
    title: "Career & Business Report",
    desc: "10th house analysis, career planets & industry guidance.",
    badge: "Premium",
    hue: "from-blue-500/20 to-indigo-500/10",
  },
  {
    group: "premium",
    href: "/tools/varshphal",
    icon: Calendar,
    title: "Varshphal — Annual Prediction",
    desc: "Yearly horoscope from Maha Dasha & solar return.",
    badge: "Premium",
    hue: "from-orange-500/20 to-red-500/10",
  },
  {
    group: "premium",
    href: "/tools/numerology-report",
    icon: Hash,
    title: "Numerology Report",
    desc: "Life Path & Destiny number with Vedic planetary vibration.",
    hue: "from-violet-500/20 to-fuchsia-500/10",
  },
  {
    group: "premium",
    href: "/tools/vastu-report",
    icon: Compass,
    title: "Vastu Shastra Guide",
    desc: "8 directions, room placement & practical remedies.",
    hue: "from-emerald-500/20 to-green-500/10",
  },

  // Life / lifestyle
  {
    group: "life",
    href: "/tools/baby-name-generator",
    icon: Baby,
    title: "Baby Name Generator",
    desc: "Sanskrit names by nakshatra, deity, gender & meaning.",
    hue: "from-sky-500/20 to-cyan-500/10",
  },
  {
    group: "life",
    href: "/tools/names-by-nakshatra",
    icon: Baby,
    title: "Names by Nakshatra",
    desc: "Auspicious naming syllables based on Nakshatra pada.",
    hue: "from-cyan-500/20 to-teal-500/10",
  },
  {
    group: "life",
    href: "/tools/gemstone-recommender",
    icon: Gem,
    title: "Gemstone Recommender",
    desc: "Your lucky gemstone based on Lagna & planets.",
    hue: "from-fuchsia-500/20 to-pink-500/10",
  },
];

const GROUPS: {
  key: JT["group"];
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    key: "core",
    title: "Core Charts & Compatibility",
    desc: "Start here — full birth chart and relationship compatibility.",
    icon: FileText,
  },
  {
    key: "calculators",
    title: "Quick Calculators",
    desc: "Instant Rashi, Nakshatra, Dasha and daily Muhurat lookups.",
    icon: Calculator,
  },
  {
    key: "premium",
    title: "Premium Life Reports",
    desc: "Career, annual, numerology and Vastu — deeper personalised guidance.",
    icon: Sparkles,
  },
  {
    key: "life",
    title: "Life & Lifestyle",
    desc: "Baby names, gemstones and everyday Vedic guidance.",
    icon: Baby,
  },
];

function AstrologyHub() {
  const { t } = useTranslation();
  return (
    <SiteLayout>
      <div className="container-page py-8">
        <Breadcrumbs
          items={[{ label: t("common.go_home"), href: "/" }, { label: t("nav.panchang") }]}
        />

        {/* Hero */}
        <section className="mt-6 relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary-soft/50 via-amber-500/10 to-rose-500/10 p-8 md:p-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/15 text-primary px-3 py-1 text-xs font-semibold mb-4">
            <Sparkles className="size-3.5" /> {t("astrology.hero.badge")}
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-semibold tracking-tight">
            {t("home.kundli_section.title")}
          </h1>
          <p className="mt-3 text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            {t("home.kundli_section.description")}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Users className="size-3.5 text-primary" /> {t("home.kundli_section.trusted")}
            </span>
            <span>•</span>
            <span>{t("home.kundli_section.lahiri")}</span>
            <span>•</span>
            <span>
              {TOOLS.length}+ {t("nav.all_tools")}
            </span>
            <span>•</span>
            <span>{t("home.kundli_section.free_core")}</span>
          </div>
        </section>

        {/* Grouped tools */}
        {GROUPS.map((g) => {
          const items = TOOLS.filter((t) => t.group === g.key);
          const Icon = g.icon;
          return (
            <section key={g.key} className="mt-14">
              <SectionHeading
                eyebrow={g.title}
                title={
                  <>
                    <Icon className="inline size-6 text-primary -mt-1 mr-2" />
                    {g.title}
                  </>
                }
                description={g.desc}
              />
              <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {items.map((tool) => (
                  <Link
                    key={tool.href}
                    to={tool.href}
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
                        Open <ArrowRight className="size-3.5" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        {/* CTA */}
        <section className="mt-16 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-rose-500/5 p-8 text-center">
          <Flame className="size-6 text-primary mx-auto mb-2" />
          <h2 className="text-2xl font-bold">Want the complete 40+ page Premium Kundli?</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
            Divisional charts, Shadbala, Ashtakvarga, Yogas, Doshas, remedies and AI-guided life
            analysis in a single PDF.
          </p>
          <Link
            to="/pricing"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:opacity-90"
          >
            View Premium Plans <ArrowRight className="size-4" />
          </Link>
        </section>

        <section className="mt-12">
          <NewsletterCTA />
        </section>
      </div>
    </SiteLayout>
  );
}
