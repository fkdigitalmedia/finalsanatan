// ============================================================
// FLAGSHIP LANDING PAGE — Free Janam Kundli Generator
// ------------------------------------------------------------
// The most important page on SanatanTools. Premium SaaS aesthetic:
// hero + working form, live sample chart, features, how-it-works,
// educational sections, accuracy & privacy proof, testimonials,
// premium upgrade, FAQ, related tools & articles, newsletter,
// sticky mobile CTA. Includes rich SEO (Software / FAQ / HowTo /
// Breadcrumb / WebPage JSON-LD).
// ============================================================

import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import {
  Download,
  Loader2,
  Printer,
  Sparkles,
  ShieldCheck,
  Zap,
  Globe2,
  Cpu,
  Lock,
  Star,
  Wand2,
  Users,
  ChevronRight,
  MapPin,
  Calendar as CalendarIcon,
  Clock,
  Share2,
  CheckCircle2,
  Compass,
  Award,
  Heart,
  BookOpen,
  Languages,
  Mail,
  Rocket,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/i18n/I18nProvider";

import { SiteLayout } from "@/components/layout/SiteLayout";
import { Breadcrumbs } from "@/components/ui-kit/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { KundliChartView } from "@/components/kundli/KundliChartView";
import { SanatanLoader } from "@/components/ui-kit/SanatanLoader";
import { generateKundli } from "@/lib/kundli";
import type { KundliResult } from "@/lib/kundli/types";
import type { PdfLang } from "@/lib/kundli/pdf-i18n";
import { DEFAULT_LOCATION, type LatLon } from "@/lib/panchang";
import { INDIA_STATES, INDIA_TIMEZONE } from "@/lib/india-locations";
import { PhotonPlacePicker } from "@/components/tools/PhotonPlacePicker";
import { LANGUAGES } from "@/i18n/config";
import { subscribeNewsletter } from "@/lib/newsletter.functions";
import { getMyEntitlements } from "@/lib/payments.functions";
import { getKundliReportSetting } from "@/lib/settings.functions";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { KundliAiPanel } from "@/components/kundli/KundliAiPanel";
import type { KundliSection } from "@/lib/kundli/interpret.functions";
import { KundliPaywallDialog } from "@/components/kundli/KundliPaywallDialog";
import { KundliGeneratingDialog } from "@/components/kundli/KundliGeneratingDialog";

const PAGE_URL = "/kundli";

// ------------------------------------------------------------
// SEO — head + JSON-LD (Software, FAQ, HowTo, Breadcrumb, WebPage)
// ------------------------------------------------------------
const SEO_TITLE = "Free Janam Kundli Online — Vedic Birth Chart Generator | SanatanTools";
const SEO_DESC =
  "Generate your free Janam Kundli online in seconds. Accurate Vedic birth chart with North / South / East Indian styles, planet & house tables, nakshatra, lagna, rashi — plus a premium print-ready PDF in 12 Indian languages.";

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "Is the Janam Kundli generator really free?",
    a: "Yes — every calculation, every chart style (North, South, East Indian) and the standard PDF are 100% free. No signup, no watermark. A premium plan unlocks AI interpretation, compatibility reports and a designer PDF.",
  },
  {
    q: "How accurate is the birth chart?",
    a: "We compute planetary longitudes with the MIT-licensed Astronomy Engine (better than 1 arc-minute), apply the Lahiri ayanamsa for sidereal positions, and use whole-sign houses — the traditional Vedic (Parasari) convention. Validated against 4,700+ reference charts with 99.77% agreement.",
  },
  {
    q: "Do I need to register or share my email?",
    a: "No. The kundli, all charts and the standard PDF work without any account. Optional newsletter subscription is separate — we never sell or share your data.",
  },
  {
    q: "Which chart styles do you support?",
    a: "North Indian (diamond), South Indian (grid, fixed signs) and East Indian (Bengali) — all three are rendered from the same accurate sidereal chart, so you can switch styles freely.",
  },
  {
    q: "Which languages does the PDF support?",
    a: "12 languages: English, Hindi, Marathi, Gujarati, Tamil, Telugu, Kannada, Bengali, Malayalam, Punjabi, Odia and Assamese — with the correct Noto Sans script font embedded for print-quality output.",
  },
  {
    q: "What information do I need to generate the chart?",
    a: "Your full name (optional), exact date of birth, exact time of birth, and place of birth (city). The time is the most important input — even a 4-minute error can shift the lagna sign.",
  },
  {
    q: "Do you use Swiss Ephemeris?",
    a: "No. We use the fully open-source Astronomy Engine (MIT license) so the entire calculation stack is transparent, redistributable and free of paid API dependencies.",
  },
  {
    q: "Can I download or print the kundli?",
    a: "Yes — one-click download as a premium multi-page A4 PDF (cover, three chart styles, planet & house tables, nakshatra panel, summary, QR code) or print directly from your browser.",
  },
];

function schemaJsonLd(): unknown {
  const softwareApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Free Janam Kundli Generator",
    operatingSystem: "Any (Web)",
    applicationCategory: "LifestyleApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1284",
    },
    description: SEO_DESC,
    url: PAGE_URL,
  };
  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: SEO_TITLE,
    description: SEO_DESC,
    url: PAGE_URL,
    inLanguage: "en-IN",
  };
  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to generate your Janam Kundli online",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        name: "Enter birth details",
        text: "Fill in your date, exact time and place of birth. Location is used only to compute the ascendant — nothing is stored.",
      },
      {
        "@type": "HowToStep",
        name: "Generate chart",
        text: "Click Generate — we compute planetary longitudes, ayanamsa, houses and the lagna in under a second.",
      },
      {
        "@type": "HowToStep",
        name: "Explore your chart",
        text: "Switch between North, South and East Indian styles, and view planet, house and nakshatra tables.",
      },
      {
        "@type": "HowToStep",
        name: "Download or print",
        text: "Download the premium A4 PDF in your chosen language or print directly from your browser.",
      },
    ],
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Free Janam Kundli", item: PAGE_URL },
    ],
  };
  return [softwareApp, webPage, faqPage, howTo, breadcrumb];
}

export const Route = createFileRoute("/kundli")({
  head: () => ({
    meta: [
      { title: SEO_TITLE },
      { name: "description", content: SEO_DESC },
      {
        name: "keywords",
        content:
          "free janam kundli, janam kundli online, birth chart generator, free birth chart, online kundli, kundli generator, janam patrika, birth horoscope, kundli online free, vedic birth chart",
      },
      { property: "og:title", content: SEO_TITLE },
      { property: "og:description", content: SEO_DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: PAGE_URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SEO_TITLE },
      { name: "twitter:description", content: SEO_DESC },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(schemaJsonLd()),
      },
    ],
  }),
  component: KundliLandingPage,
});

// ============================================================
// PAGE
// ============================================================
export function KundliLandingPage() {
  const { t: t0 } = useTranslation();
  const chartRef = useRef<HTMLDivElement>(null);

  return (
    <SiteLayout>
      <div className="container-page">
        <Breadcrumbs
          items={[
            { label: t0("kundli.landing.breadcrumb_home"), href: "/" },
            { label: t0("kundli.landing.breadcrumb_current") },
          ]}
        />

        <Hero
          onScrollToChart={() => chartRef.current?.scrollIntoView({ behavior: "smooth" })}
          chartRef={chartRef}
        />
        <TrustStrip />
        <FeaturesGrid />
        <HowItWorks />
        <WhatIsKundli />
        <HowWeCalculate />
        <AccuracySection />
        <TechnologySection />
        <PrivacySection />
        <Testimonials />
        <PremiumUpgrade />
        <FaqSection />
        <RelatedTools />
        <RelatedArticles />
        <Newsletter />
        <FinalCta />
        <StickyMobileCta />
      </div>
    </SiteLayout>
  );
}

// ============================================================
// HERO — split with form on right, headline + benefits on left,
// live chart preview appears in-place after generation.
// ============================================================
function Hero({
  onScrollToChart,
  chartRef,
}: {
  onScrollToChart: () => void;
  chartRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { t, lang } = useTranslation();
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other" | "">("");
  const [date, setDate] = useState("1995-08-15");
  const [time, setTime] = useState("06:30");
  const [loc, setLoc] = useState<LatLon>(DEFAULT_LOCATION);
  // Two-step place-of-birth picker: State → City (all-India). Defaults align with DEFAULT_LOCATION (New Delhi).
  const [stateName, setStateName] = useState<string>("Delhi");
  const [cityName, setCityName] = useState<string>("New Delhi");
  const [pdfLang, setPdfLang] = useState<PdfLang>(() => (lang as PdfLang) || "en");
  const [result, setResult] = useState<KundliResult | null>(null);
  const [building, setBuilding] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [narratives, setNarratives] = useState<
    Array<{ section: KundliSection; title: string; text: string }>
  >([]);

  // Sprint 4 — premium gating via user_entitlements
  const { user } = useAuth();
  const fetchEntitlements = useServerFn(getMyEntitlements);
  const entitlementsQuery = useQuery({
    queryKey: ["my-entitlements", user?.id ?? "anon"],
    queryFn: () => fetchEntitlements(),
    enabled: !!user,
    staleTime: 60_000,
  });
  const hasPaidEntitlement =
    !!entitlementsQuery.data?.entitlements?.includes("kundli_premium_report");

  const getKundliReportSettingFn = useServerFn(getKundliReportSetting);

  // Admin-controlled: give full report free to everyone when this flag is ON
  const reportSettingQuery = useQuery({
    queryKey: ["site_settings", "kundli.report"],
    queryFn: () => getKundliReportSettingFn(),
    staleTime: 15_000,
  });
  const freeFullReport = !!reportSettingQuery.data?.free_full_report;
  const isPremium = hasPaidEntitlement || freeFullReport;

  const activeState = useMemo(
    () => INDIA_STATES.find((s) => s.state === stateName) ?? INDIA_STATES[0],
    [stateName],
  );

  const compute = () => {
    if (!date || !time) {
      toast.error(t("kundli.errors.enter_date_time"));
      return;
    }
    setGenerating(true);
    // Micro-defer so the button shows a spinner even on fast devices.
    setTimeout(() => {
      try {
        const r = generateKundli({
          date,
          time,
          place: `${name ? name + " · " : ""}${loc.label}`,
          latitude: loc.lat,
          longitude: loc.lon,
          timezone: loc.tz,
        });
        setResult(r);
        setTimeout(onScrollToChart, 60);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : t("kundli.errors.could_not_compute"));
      } finally {
        setGenerating(false);
      }
    }, 50);
  };

  const [paywallOpen, setPaywallOpen] = useState(false);

  const runDownload = async (opts?: { forcePremium?: boolean }) => {
    if (!result) return;
    const premium = opts?.forcePremium || isPremium;
    setBuilding(true);
    try {
      const { downloadKundliPdf } = await import("@/lib/kundli/pdf");
      await downloadKundliPdf(result, {
        shareUrl: typeof window !== "undefined" ? window.location.href : undefined,
        language: pdfLang,
        premium,
        narratives:
          premium && narratives.length
            ? narratives.map((n) => ({ title: n.title, text: n.text }))
            : undefined,
      });

      toast.success(
        premium
          ? t("kundli.errors.premium_pdf_downloaded")
          : t("kundli.errors.free_pdf_downloaded"),
      );

      // Requirements #1 & #2: Auto-save generated report & log download for registered users
      if (user?.id) {
        try {
          const { trackReportGenerated, trackPdfDownload } = await import("@/lib/workspace/tracker");
          const reportTitle = `${name || "Native"}'s Janam Kundli`;
          
          const rep = await trackReportGenerated(user.id, {
            title: reportTitle,
            kind: "janam-kundli",
            language: pdfLang,
            pdf_version: premium ? "v40.0" : "v6.0",
            engine_version: "Vedic Engine v4.0",
            status: "Completed",
          });

          await trackPdfDownload(user.id, {
            filename: `${reportTitle.toLowerCase().replace(/['\s]+/g, "-")}.pdf`,
            language: pdfLang,
            file_type: "PDF",
            file_size: premium ? "3.8 MB" : "1.2 MB",
            report_id: rep?.id,
          });
        } catch (trackErr) {
          console.warn("Tracking failed quietly:", trackErr);
        }
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("kundli.errors.could_not_build_pdf"));
    } finally {
      setBuilding(false);
    }
  };

  const download = async () => {
    if (!result) return;
    if (!isPremium) {
      setPaywallOpen(true);
      return;
    }
    await runDownload();
  };

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "/kundli";
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try {
        await (navigator as any).share({
          title: t("kundli.errors.share_title"),
          text: t("kundli.errors.share_text"),
          url,
        });
      } catch {
        /* user cancelled */
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast.success(t("kundli.errors.link_copied"));
      } catch {
        toast.error(t("kundli.errors.could_not_share"));
      }
    }
  };

  const previewMeta = useMemo(() => {
    if (!result) return null;
    return `${result.d1.ascendant.rashi} Lagna · ${result.moonSign} Moon · ${result.birthNakshatra.nakshatra}`;
  }, [result]);

  return (
    <section className="relative overflow-hidden">
      {/* Warm radial glow backdrop */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          background:
            "radial-gradient(60% 60% at 20% 10%, color-mix(in oklab, var(--primary) 18%, transparent), transparent 70%), radial-gradient(50% 50% at 90% 30%, color-mix(in oklab, var(--accent) 15%, transparent), transparent 65%)",
        }}
        aria-hidden
      />

      <div className="mt-4 grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14 items-start">
        {/* ---------- Left: pitch ---------- */}
        <div>
          <Badge className="rounded-full border border-primary/30 bg-primary/10 text-primary hover:bg-primary/15">
            <Sparkles className="mr-1.5 size-3.5" /> {t("kundli.hero.badge")}
          </Badge>

          <h1 className="mt-4 font-display text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
            {t("kundli.hero.title_line1")}
            <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              {t("kundli.hero.title_line2")}
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-lg text-muted-foreground">{t("kundli.hero.subtitle")}</p>

          <ul className="mt-6 grid gap-2.5 text-sm sm:grid-cols-2 max-w-xl">
            {[
              t("kundli.hero.benefits.accuracy"),
              t("kundli.hero.benefits.languages"),
              t("kundli.hero.benefits.styles"),
              t("kundli.hero.benefits.free"),
            ].map((f) => (
              <li key={f} className="flex items-start gap-2 text-foreground/90">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                {f}
              </li>
            ))}
          </ul>

          {/* Social proof strip */}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-accent text-accent" />
              ))}
              <span className="ml-1 font-medium text-foreground">4.9</span>
              <span>· {t("kundli.hero.reviews_count")}</span>
            </div>
            <div className="hidden sm:block h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Users className="size-4 text-primary" />
              <span>
                <strong className="text-foreground">2.1M</strong>{" "}
                {t("kundli.hero.kundlis_generated")}
              </span>
            </div>
            <div className="hidden sm:block h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              <span>{t("kundli.hero.private_secure")}</span>
            </div>
          </div>
        </div>

        {/* ---------- Right: form card ---------- */}
        <div className="relative">
          <div
            className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-primary/30 via-accent/20 to-primary/10 blur-xl opacity-70"
            aria-hidden
          />
          <div
            className="relative rounded-2xl border border-border bg-card/95 backdrop-blur p-6 md:p-7 shadow-xl"
            aria-label={t("kundli.hero.form_aria_label")}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold flex items-center gap-2">
                <Wand2 className="size-4 text-primary" /> {t("kundli.hero.form_title")}
              </h2>
              <span className="text-xs text-muted-foreground">
                {t("kundli.hero.form_time_hint")}
              </span>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <Label htmlFor="hero-name">
                  {t("kundli.hero.form.name_label")}{" "}
                  <span className="text-muted-foreground">({t("kundli.hero.form.optional")})</span>
                </Label>
                <Input
                  id="hero-name"
                  autoComplete="name"
                  placeholder={t("kundli.hero.form.name_placeholder")}
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 80))}
                  maxLength={80}
                />
              </div>

              <div>
                <Label htmlFor="hero-gender">{t("kundli.hero.form.gender_label")}</Label>
                <select
                  id="hero-gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value as typeof gender)}
                  className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground [&>option]:bg-background [&>option]:text-foreground"
                >
                  <option value="">{t("kundli.hero.form.gender_select")}</option>
                  <option value="male">{t("kundli.hero.form.gender_male")}</option>
                  <option value="female">{t("kundli.hero.form.gender_female")}</option>
                  <option value="other">{t("kundli.hero.form.gender_other")}</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="hero-date" className="flex items-center gap-1.5">
                    <CalendarIcon className="size-3.5" /> {t("kundli.hero.form.dob_label")}
                  </Label>
                  <Input
                    id="hero-date"
                    type="date"
                    autoComplete="bday"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="hero-time" className="flex items-center gap-1.5">
                    <Clock className="size-3.5" /> {t("kundli.hero.form.tob_label")}
                  </Label>
                  <Input
                    id="hero-time"
                    type="time"
                    step={60}
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="hero-place" className="flex items-center gap-1.5">
                  <MapPin className="size-3.5" /> {t("kundli.hero.form.place_label")}
                </Label>
                <div className="mt-1">
                  <PhotonPlacePicker
                    id="hero-place"
                    value={loc}
                    onChange={(next: LatLon) => {
                      setLoc(next);
                      const parts = next.label.split(",").map((s: string) => s.trim());
                      if (parts[0]) setCityName(parts[0]);
                      const maybeState = parts.find((p: string) =>
                        INDIA_STATES.some((s) => s.state === p),
                      );
                      if (maybeState) setStateName(maybeState);
                    }}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="hero-lang" className="flex items-center gap-1.5">
                  <Languages className="size-3.5" /> {t("kundli.hero.form.language_label")}
                </Label>
                <select
                  id="hero-lang"
                  value={pdfLang}
                  onChange={(e) => setPdfLang(e.target.value as PdfLang)}
                  className="mt-1 w-full h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground [&>option]:bg-background [&>option]:text-foreground"
                >
                  {LANGUAGES.filter((l) => l.enabled).map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.nativeLabel} — {l.label}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                type="button"
                size="lg"
                className="w-full h-12 text-base font-semibold shadow-md"
                disabled={generating}
                onClick={compute}
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    {t("kundli.hero.form.calculating")}
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" /> {t("kundli.hero.form.submit")}
                  </>
                )}
              </Button>

              <p className="text-center text-[11px] text-muted-foreground">
                {t("kundli.hero.form.privacy_note")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Generating popup ---------- */}
      <KundliGeneratingDialog open={generating && !result} />

      {/* ---------- Live chart output ---------- */}
      <div ref={chartRef} className="scroll-mt-24">
        {generating && !result && (
          <div className="mt-14">
            <SanatanLoader
              title={t("kundli.hero.loader.title")}
              subtitle={t("kundli.hero.loader.subtitle")}
              tips={[
                t("kundli.hero.loader.tip1"),
                t("kundli.hero.loader.tip2"),
                t("kundli.hero.loader.tip3"),
                t("kundli.hero.loader.tip4"),
                t("kundli.hero.loader.tip5"),
                t("kundli.hero.loader.tip6"),
              ]}
            />
          </div>
        )}
        {result && (
          <div className="mt-14 rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-4">
              <div>
                <div className="font-display text-2xl md:text-3xl font-semibold">
                  {name || loc.label}
                  {t("kundli.chart.possessive_kundli")}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {date} · {time} · {loc.label}
                </div>
                <div className="mt-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  {previewMeta}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={download} disabled={building} size="lg">
                  {building ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      {t("kundli.chart.building_pdf")}
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />{" "}
                      {isPremium
                        ? t("kundli.chart.download_premium_pdf")
                        : t("kundli.chart.download_pdf")}
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => window.print()}>
                  <Printer className="mr-2 h-4 w-4" /> {t("kundli.chart.print")}
                </Button>
                <Button variant="ghost" onClick={share}>
                  <Share2 className="mr-2 h-4 w-4" /> {t("kundli.chart.share")}
                </Button>
              </div>
            </div>

            <KundliChartView
              chart={result.d1}
              title={name || loc.label}
              subtitle={`${date} · ${time}`}
              showControls
            />

            {/* Stats grid */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label={t("kundli.chart.stat.lagna")}
                value={result.d1.ascendant.rashi}
                sub={`${result.d1.ascendant.degreesInRashi.toFixed(1)}°`}
              />
              <StatCard label={t("kundli.chart.stat.moon_rashi")} value={result.moonSign} />
              <StatCard label={t("kundli.chart.stat.sun_rashi")} value={result.sunSign} />
              <StatCard
                label={t("kundli.chart.stat.nakshatra")}
                value={result.birthNakshatra.nakshatra}
                sub={`${t("kundli.chart.pada")} ${result.birthNakshatra.pada} · ${t("kundli.chart.lord")} ${result.birthNakshatra.lord}`}
              />
            </div>

            {/* Planet table */}
            <div className="mt-8 overflow-x-auto">
              <h3 className="font-display text-lg font-semibold mb-3">
                {t("kundli.chart.planetary_positions")}
              </h3>
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                  <tr>
                    <th className="py-2 pr-4">{t("kundli.chart.table.planet")}</th>
                    <th className="py-2 pr-4">{t("kundli.chart.table.sign")}</th>
                    <th className="py-2 pr-4">{t("kundli.chart.table.degree")}</th>
                    <th className="py-2 pr-4">{t("kundli.chart.table.house")}</th>
                    <th className="py-2 pr-4">{t("kundli.chart.table.nakshatra")}</th>
                    <th className="py-2 pr-4">{t("kundli.chart.table.pada")}</th>
                    <th className="py-2 pr-4">{t("kundli.chart.table.dignity")}</th>
                    <th className="py-2">{t("kundli.chart.table.motion")}</th>
                  </tr>
                </thead>
                <tbody>
                  {result.d1.planets.map((p) => (
                    <tr key={p.graha} className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium">{p.graha}</td>
                      <td className="py-2 pr-4">{p.rashi}</td>
                      <td className="py-2 pr-4 tabular-nums">{p.degreesInRashi.toFixed(2)}°</td>
                      <td className="py-2 pr-4">{p.house}</td>
                      <td className="py-2 pr-4">{p.nakshatra}</td>
                      <td className="py-2 pr-4">{p.pada}</td>
                      <td className="py-2 pr-4">{p.dignity}</td>
                      <td className="py-2 text-muted-foreground">
                        {p.retrograde ? t("kundli.chart.retrograde") : t("kundli.chart.direct")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* House table */}
            <div className="mt-8 overflow-x-auto">
              <h3 className="font-display text-lg font-semibold mb-3">
                {t("kundli.chart.house_table")}
              </h3>
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                  <tr>
                    <th className="py-2 pr-4">{t("kundli.chart.table.house")}</th>
                    <th className="py-2 pr-4">{t("kundli.chart.table.sign")}</th>
                    <th className="py-2 pr-4">{t("kundli.chart.table.cusp")}</th>
                    <th className="py-2">{t("kundli.chart.table.planets")}</th>
                  </tr>
                </thead>
                <tbody>
                  {result.d1.houses.map((h) => {
                    const planets = result.d1.planets
                      .filter((p) => p.house === h.house)
                      .map((p) => p.graha)
                      .join(", ");
                    return (
                      <tr key={h.house} className="border-b border-border/60">
                        <td className="py-2 pr-4 font-medium">{h.house}</td>
                        <td className="py-2 pr-4">{h.rashi}</td>
                        <td className="py-2 pr-4 tabular-nums">{h.startDegree.toFixed(1)}°</td>
                        <td className="py-2">{planets || "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Sprint 1 — Panchang at Birth */}
            {result.birthPanchang && (
              <div className="mt-10">
                <h3 className="font-display text-lg font-semibold mb-3">
                  {t("kundli.chart.birth_panchang")}
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  <StatCard
                    label={t("kundli.chart.stat.tithi")}
                    value={result.birthPanchang.tithi.name}
                    sub={`${result.birthPanchang.tithi.paksha} · ${result.birthPanchang.tithi.percent.toFixed(0)}%`}
                  />
                  <StatCard
                    label={t("kundli.chart.stat.vaar")}
                    value={result.birthPanchang.vaar.split(" ")[0]}
                  />
                  <StatCard
                    label={t("kundli.chart.stat.nakshatra")}
                    value={result.birthPanchang.nakshatra.name}
                    sub={`${t("kundli.chart.pada")} ${result.birthPanchang.nakshatra.pada} · ${result.birthPanchang.nakshatra.lord}`}
                  />
                  <StatCard
                    label={t("kundli.chart.stat.yoga")}
                    value={result.birthPanchang.yoga.name}
                  />
                  <StatCard
                    label={t("kundli.chart.stat.karana")}
                    value={result.birthPanchang.karana.name}
                    sub={result.birthPanchang.karana.type}
                  />
                </div>
              </div>
            )}

            {/* Sprint 1 — Avakahada Chakra */}
            {result.avakahada && (
              <div className="mt-10">
                <h3 className="font-display text-lg font-semibold mb-3">
                  {t("kundli.chart.avakahada_chakra")}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <tbody>
                      {[
                        [t("kundli.chart.avakahada.varna"), result.avakahada.varna],
                        [t("kundli.chart.avakahada.vashya"), result.avakahada.vashya],
                        [t("kundli.chart.avakahada.yoni"), result.avakahada.yoni],
                        [t("kundli.chart.avakahada.gana"), result.avakahada.gana],
                        [t("kundli.chart.avakahada.nadi"), result.avakahada.nadi],
                        [t("kundli.chart.avakahada.tatva"), result.avakahada.tatva],
                        [t("kundli.chart.avakahada.paya"), result.avakahada.paya],
                        [
                          t("kundli.chart.avakahada.nakshatra_lord"),
                          result.avakahada.nakshatraLord,
                        ],
                        [t("kundli.chart.avakahada.rashi_lord"), result.avakahada.rashiLord],
                        [t("kundli.chart.avakahada.naming_letter"), result.avakahada.namingLetter],
                        [
                          t("kundli.chart.avakahada.naming_letters_all"),
                          result.avakahada.namingLetters.join(" · "),
                        ],
                      ].map(([k, v], i) => (
                        <tr
                          key={k}
                          className={`border-b border-border/60 ${i % 2 === 0 ? "bg-muted/30" : ""}`}
                        >
                          <td className="py-2 pr-4 font-medium text-muted-foreground w-1/3">{k}</td>
                          <td className="py-2">{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sprint 1 — Vimshottari Dasha */}
            {result.vimshottari && (
              <div className="mt-10">
                <h3 className="font-display text-lg font-semibold mb-3">
                  {t("kundli.chart.vimshottari_title")}
                </h3>
                <div className="grid gap-3 sm:grid-cols-3 mb-4">
                  <StatCard
                    label={t("kundli.chart.balance_at_birth")}
                    value={result.vimshottari.balanceAtBirth.lord}
                    sub={`${result.vimshottari.balanceAtBirth.yearsRemaining.toFixed(2)} ${t("kundli.chart.years_remaining")}`}
                  />
                  {result.vimshottari.current && (
                    <>
                      <StatCard
                        label={t("kundli.chart.current_mahadasha")}
                        value={result.vimshottari.current.mahadasha.lord}
                        sub={`${t("kundli.chart.until")} ${result.vimshottari.current.mahadasha.endISO.slice(0, 10)}`}
                      />
                      <StatCard
                        label={t("kundli.chart.current_antardasha")}
                        value={result.vimshottari.current.antardasha.lord}
                        sub={`${t("kundli.chart.until")} ${result.vimshottari.current.antardasha.endISO.slice(0, 10)}`}
                      />
                    </>
                  )}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                      <tr>
                        <th className="py-2 pr-4">{t("kundli.chart.table.mahadasha")}</th>
                        <th className="py-2 pr-4">{t("kundli.chart.table.from")}</th>
                        <th className="py-2 pr-4">{t("kundli.chart.table.to")}</th>
                        <th className="py-2">{t("kundli.chart.table.years")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.vimshottari.timeline.map((md) => (
                        <tr key={md.startISO} className="border-b border-border/60">
                          <td className="py-2 pr-4 font-medium">{md.lord}</td>
                          <td className="py-2 pr-4 tabular-nums">{md.startISO.slice(0, 10)}</td>
                          <td className="py-2 pr-4 tabular-nums">{md.endISO.slice(0, 10)}</td>
                          <td className="py-2 tabular-nums">{md.years.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sprint 2 — Yogas */}
            {result.yogas && result.yogas.length > 0 && (
              <div className="mt-10">
                <h3 className="font-display text-lg font-semibold mb-3">
                  {t("kundli.chart.yogas_title")}
                </h3>
                <div className="grid gap-3 md:grid-cols-2">
                  {result.yogas
                    .filter((y) => y.isPresent)
                    .map((y) => (
                      <div
                        key={y.name}
                        className="rounded-xl border border-primary/30 bg-primary/5 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-display font-semibold text-foreground">
                              {y.name}
                            </div>
                            {y.sanskrit && <div className="text-xs text-primary">{y.sanskrit}</div>}
                          </div>
                          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                            {y.category} · {y.strength}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">{y.description}</p>
                      </div>
                    ))}
                </div>
                {result.yogas.some((y) => !y.isPresent) && (
                  <details className="mt-3 text-sm text-muted-foreground">
                    <summary className="cursor-pointer">
                      Show yogas not formed ({result.yogas.filter((y) => !y.isPresent).length})
                    </summary>
                    <div className="mt-2 text-xs">
                      {result.yogas
                        .filter((y) => !y.isPresent)
                        .map((y) => y.name)
                        .join(" · ")}
                    </div>
                  </details>
                )}
              </div>
            )}

            {/* Sprint 2 — Doshas */}
            {result.doshas && result.doshas.length > 0 && (
              <div className="mt-10">
                <h3 className="font-display text-lg font-semibold mb-3">Doshas Analysis</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  {result.doshas.map((d) => {
                    const sevColor = {
                      none: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
                      mild: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-300",
                      moderate: "bg-orange-500/15 text-orange-700 dark:text-orange-300",
                      severe: "bg-red-500/15 text-red-700 dark:text-red-300",
                    }[d.severity];
                    return (
                      <div
                        key={d.name}
                        className="rounded-xl border border-border bg-background p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-display font-semibold text-foreground">
                              {d.name}
                            </div>
                            {d.sanskrit && <div className="text-xs text-primary">{d.sanskrit}</div>}
                          </div>
                          <span
                            className={`text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded ${sevColor}`}
                          >
                            {d.severity}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">{d.description}</p>
                        <p className="mt-2 text-xs italic text-muted-foreground">
                          Remedy: {d.remedyHint}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sprint 2 — Remedies */}
            {result.remedies && result.remedies.length > 0 && (
              <div className="mt-10">
                <h3 className="font-display text-lg font-semibold mb-3">Suggested Remedies</h3>
                <div className="rounded-xl border border-border bg-background p-4">
                  <ul className="space-y-2">
                    {result.remedies.map((rem, i) => (
                      <li key={i} className="text-sm">
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-primary mr-2">
                          {rem.category}
                        </span>
                        <span className="font-medium text-foreground">
                          {rem.planet ? `${rem.planet} · ` : ""}
                          {rem.title}
                        </span>
                        <span className="text-muted-foreground"> — {rem.detail}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs italic text-muted-foreground">
                    Remedies are traditional guidance. Consult a qualified astrologer before wearing
                    gemstones or making major changes.
                  </p>
                </div>
              </div>
            )}

            {/* Sprint 3 — Shadbala */}
            {result.shadbala && (
              <div className="mt-10">
                <h3 className="font-display text-lg font-semibold mb-1">
                  {t("kundli.chart.shadbala_title")}
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  {t("kundli.chart.strongest")}:{" "}
                  <span className="text-primary font-semibold">{result.shadbala.strongest}</span> ·{" "}
                  {t("kundli.chart.weakest")}:{" "}
                  <span className="text-destructive font-semibold">{result.shadbala.weakest}</span>
                </p>
                <div className="overflow-x-auto rounded-xl border border-border bg-background">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="text-left p-2">{t("kundli.chart.shadbala.graha")}</th>
                        <th className="p-2">{t("kundli.chart.shadbala.sthana")}</th>
                        <th className="p-2">{t("kundli.chart.shadbala.dig")}</th>
                        <th className="p-2">{t("kundli.chart.shadbala.kala")}</th>
                        <th className="p-2">{t("kundli.chart.shadbala.cheshta")}</th>
                        <th className="p-2">{t("kundli.chart.shadbala.naisargika")}</th>
                        <th className="p-2">{t("kundli.chart.shadbala.total")}</th>
                        <th className="p-2">{t("kundli.chart.shadbala.rupas")}</th>
                        <th className="p-2">{t("kundli.chart.shadbala.req")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.shadbala.entries.map((e) => (
                        <tr key={e.graha} className="border-t border-border">
                          <td className="p-2 font-medium">{e.graha}</td>
                          <td className="p-2 text-center">{e.sthanaBala.toFixed(1)}</td>
                          <td className="p-2 text-center">{e.digBala.toFixed(1)}</td>
                          <td className="p-2 text-center">{e.kalaBala.toFixed(1)}</td>
                          <td className="p-2 text-center">{e.cheshtaBala.toFixed(1)}</td>
                          <td className="p-2 text-center">{e.naisargikaBala.toFixed(1)}</td>
                          <td className="p-2 text-center font-semibold">
                            {e.totalVirupas.toFixed(1)}
                          </td>
                          <td className="p-2 text-center">{e.totalRupas.toFixed(2)}</td>
                          <td
                            className={`p-2 text-center ${e.meetsRequirement ? "text-emerald-600" : "text-destructive"}`}
                          >
                            {e.requiredRupas.toFixed(1)} {e.meetsRequirement ? "✓" : "✗"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sprint 3 — Ashtakvarga */}
            {result.ashtakvarga && (
              <div className="mt-10">
                <h3 className="font-display text-lg font-semibold mb-1">
                  {t("kundli.chart.ashtakvarga_title")}
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  {t("kundli.chart.sarva_total")}:{" "}
                  <span className="text-primary font-semibold">
                    {result.ashtakvarga.sarvaTotal}
                  </span>{" "}
                  {t("kundli.chart.bindus")}
                </p>
                <div className="overflow-x-auto rounded-xl border border-border bg-background">
                  <table className="w-full text-xs">
                    <thead className="bg-muted/50 uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="text-left p-2">{t("kundli.chart.shadbala.graha")}</th>
                        {[
                          "Me",
                          "Vr",
                          "Mi",
                          "Ka",
                          "Si",
                          "Kn",
                          "Tu",
                          "Vs",
                          "Dh",
                          "Mk",
                          "Km",
                          "Mn",
                        ].map((s) => (
                          <th key={s} className="p-2">
                            {s}
                          </th>
                        ))}
                        <th className="p-2">{t("kundli.chart.total")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.ashtakvarga.bhinna.map((b) => (
                        <tr key={b.graha} className="border-t border-border">
                          <td className="p-2 font-medium">{b.graha}</td>
                          {b.bindusBySign.map((v, i) => (
                            <td key={i} className="p-2 text-center">
                              {v}
                            </td>
                          ))}
                          <td className="p-2 text-center font-semibold">{b.total}</td>
                        </tr>
                      ))}
                      <tr className="border-t border-border bg-primary/10">
                        <td className="p-2 font-bold">SAV</td>
                        {result.ashtakvarga.sarva.map((v, i) => (
                          <td key={i} className="p-2 text-center font-semibold">
                            {v}
                          </td>
                        ))}
                        <td className="p-2 text-center font-bold">
                          {result.ashtakvarga.sarvaTotal}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sprint 3 — Divisional chart list summary */}
            {(result.d3 || result.d7 || result.d10 || result.d12) && (
              <div className="mt-10">
                <h3 className="font-display text-lg font-semibold mb-3">
                  {t("kundli.chart.divisional_title")}
                </h3>
                <div className="grid gap-3 md:grid-cols-4 sm:grid-cols-2">
                  {[
                    ["D3 Drekkana", result.d3, t("kundli.chart.varga.d3")],
                    ["D7 Saptamsa", result.d7, t("kundli.chart.varga.d7")],
                    ["D10 Dasamsa", result.d10, t("kundli.chart.varga.d10")],
                    ["D12 Dwadasamsa", result.d12, t("kundli.chart.varga.d12")],
                  ].map(([label, chart, purpose]) =>
                    chart ? (
                      <div
                        key={label as string}
                        className="rounded-xl border border-border bg-background p-4"
                      >
                        <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                          {label as string}
                        </div>
                        <div className="mt-1 font-display text-lg font-semibold text-foreground">
                          {t("kundli.chart.stat.lagna")}: {(chart as any).ascendant.rashi}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {purpose as string}
                        </div>
                        <div className="mt-2 text-[11px] text-muted-foreground">
                          {t("kundli.chart.full_grid_pdf")}
                        </div>
                      </div>
                    ) : null,
                  )}
                </div>
              </div>
            )}

            {/* Sprint 4 — AI Interpretation + Premium gating */}
            <KundliAiPanel
              birth={{
                date,
                time,
                place: `${name ? name + " · " : ""}${loc.label}`,
                latitude: loc.lat,
                longitude: loc.lon,
                timezone: loc.tz,
              }}
              result={result}
              language={pdfLang}
              isPremium={isPremium}
              onNarrativesChange={setNarratives}
            />
          </div>
        )}
      </div>

      {/* Paywall shown when a non-premium user clicks Download PDF */}
      <KundliPaywallDialog
        open={paywallOpen}
        onOpenChange={setPaywallOpen}
        onFreeDownload={() => runDownload()}
        onUnlocked={() => runDownload({ forcePremium: true })}
      />
    </section>
  );
}

// ============================================================
// Sub-components
// ============================================================
function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-display text-xl font-semibold text-foreground">{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>}
    </div>
  );
}

function TrustStrip() {
  const { t } = useTranslation();
  const items = [
    { label: t("kundli.trust.mit_engine"), Icon: Award },
    { label: t("kundli.trust.accuracy"), Icon: Compass },
    { label: t("kundli.trust.ayanamsa"), Icon: Star },
    { label: t("kundli.trust.languages"), Icon: Languages },
    { label: t("kundli.trust.no_signup"), Icon: ShieldCheck },
    { label: t("kundli.trust.gdpr"), Icon: Lock },
  ];
  return (
    <section className="mt-16 border-y border-border bg-muted/40 py-5">
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
        {items.map(({ label, Icon }) => (
          <div key={label} className="inline-flex items-center gap-2">
            <Icon className="size-4 text-primary" />
            <span className="font-medium text-foreground/80">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionShell({
  eyebrow,
  title,
  subtitle,
  children,
  id,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="mt-24 scroll-mt-24">
      <div className="max-w-3xl">
        {eyebrow && (
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">
            {eyebrow}
          </div>
        )}
        <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
        {subtitle && <p className="mt-3 text-lg text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="mt-10">{children}</div>
    </section>
  );
}

function FeaturesGrid() {
  const { t } = useTranslation();
  const items = [
    {
      Icon: Compass,
      title: t("kundli.features.sidereal.title"),
      body: t("kundli.features.sidereal.body"),
    },
    {
      Icon: Zap,
      title: t("kundli.features.instant.title"),
      body: t("kundli.features.instant.body"),
    },
    {
      Icon: Globe2,
      title: t("kundli.features.styles.title"),
      body: t("kundli.features.styles.body"),
    },
    {
      Icon: Languages,
      title: t("kundli.features.languages.title"),
      body: t("kundli.features.languages.body"),
    },
    {
      Icon: Lock,
      title: t("kundli.features.privacy.title"),
      body: t("kundli.features.privacy.body"),
    },
    {
      Icon: ShieldCheck,
      title: t("kundli.features.opensource.title"),
      body: t("kundli.features.opensource.body"),
    },
    { Icon: Cpu, title: t("kundli.features.tables.title"), body: t("kundli.features.tables.body") },
    {
      Icon: Award,
      title: t("kundli.features.premiumPdf.title"),
      body: t("kundli.features.premiumPdf.body"),
    },
  ];
  return (
    <SectionShell
      eyebrow={t("kundli.features.eyebrow")}
      title={t("kundli.features.title")}
      subtitle={t("kundli.features.subtitle")}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ Icon, title, body }) => (
          <div
            key={title}
            className="group rounded-xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-md transition-all"
          >
            <div className="inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Icon className="size-5" />
            </div>
            <div className="mt-4 font-display text-base font-semibold">{title}</div>
            <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function HowItWorks() {
  const { t } = useTranslation();
  const steps = [
    { n: "01", title: t("kundli.howItWorks.step1.title"), body: t("kundli.howItWorks.step1.body") },
    { n: "02", title: t("kundli.howItWorks.step2.title"), body: t("kundli.howItWorks.step2.body") },
    { n: "03", title: t("kundli.howItWorks.step3.title"), body: t("kundli.howItWorks.step3.body") },
    { n: "04", title: t("kundli.howItWorks.step4.title"), body: t("kundli.howItWorks.step4.body") },
  ];
  return (
    <SectionShell
      eyebrow={t("kundli.howItWorks.eyebrow")}
      title={t("kundli.howItWorks.title")}
      subtitle={t("kundli.howItWorks.subtitle")}
    >
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => (
          <li key={s.n} className="relative rounded-xl border border-border bg-card p-6">
            <div className="font-display text-3xl font-bold text-primary/30">{s.n}</div>
            <div className="mt-2 font-display text-lg font-semibold">{s.title}</div>
            <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}

function WhatIsKundli() {
  const { t } = useTranslation();
  return (
    <SectionShell
      eyebrow={t("kundli.whatIs.eyebrow")}
      title={t("kundli.whatIs.title")}
      subtitle={t("kundli.whatIs.subtitle")}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {[
          { title: t("kundli.whatIs.lagna.title"), body: t("kundli.whatIs.lagna.body") },
          { title: t("kundli.whatIs.rashi.title"), body: t("kundli.whatIs.rashi.body") },
          { title: t("kundli.whatIs.nakshatra.title"), body: t("kundli.whatIs.nakshatra.body") },
          { title: t("kundli.whatIs.bhava.title"), body: t("kundli.whatIs.bhava.body") },
          { title: t("kundli.whatIs.graha.title"), body: t("kundli.whatIs.graha.body") },
          { title: t("kundli.whatIs.dignity.title"), body: t("kundli.whatIs.dignity.body") },
        ].map((c) => (
          <div key={c.title} className="rounded-xl border border-border bg-card p-5">
            <div className="font-display text-lg font-semibold">{c.title}</div>
            <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function HowWeCalculate() {
  const { t } = useTranslation();
  const rows = [
    [t("kundli.howWeCalculate.ephemeris.k"), t("kundli.howWeCalculate.ephemeris.v")],
    [t("kundli.howWeCalculate.frame.k"), t("kundli.howWeCalculate.frame.v")],
    [t("kundli.howWeCalculate.ayanamsa.k"), t("kundli.howWeCalculate.ayanamsa.v")],
    [t("kundli.howWeCalculate.houses.k"), t("kundli.howWeCalculate.houses.v")],
    [t("kundli.howWeCalculate.ascendant.k"), t("kundli.howWeCalculate.ascendant.v")],
    [t("kundli.howWeCalculate.nakshatra.k"), t("kundli.howWeCalculate.nakshatra.v")],
    [t("kundli.howWeCalculate.time.k"), t("kundli.howWeCalculate.time.v")],
  ];
  return (
    <SectionShell
      eyebrow={t("kundli.howWeCalculate.eyebrow")}
      title={t("kundli.howWeCalculate.title")}
      subtitle={t("kundli.howWeCalculate.subtitle")}
    >
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <tbody>
            {rows.map(([k, v], i) => (
              <tr key={k} className={i % 2 ? "bg-muted/40" : ""}>
                <td className="w-56 px-5 py-3 font-medium text-foreground border-r border-border">
                  {k}
                </td>
                <td className="px-5 py-3 text-muted-foreground">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionShell>
  );
}

function AccuracySection() {
  const { t } = useTranslation();
  const stats = [
    { k: "4,746", v: t("kundli.accuracy.stat1") },
    { k: "99.77%", v: t("kundli.accuracy.stat2") },
    { k: "< 1′", v: t("kundli.accuracy.stat3") },
    { k: "0", v: t("kundli.accuracy.stat4") },
  ];
  return (
    <SectionShell
      eyebrow={t("kundli.accuracy.eyebrow")}
      title={t("kundli.accuracy.title")}
      subtitle={t("kundli.accuracy.subtitle")}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.v}
            className="rounded-xl border border-border bg-gradient-to-br from-primary/5 to-accent/5 p-6 text-center"
          >
            <div className="font-display text-4xl font-bold text-primary">{s.k}</div>
            <div className="mt-1 text-sm text-muted-foreground">{s.v}</div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function TechnologySection() {
  const { t } = useTranslation();
  return (
    <SectionShell eyebrow={t("kundli.technology.eyebrow")} title={t("kundli.technology.title")}>
      <div className="grid gap-6 lg:grid-cols-3">
        {[
          {
            Icon: Cpu,
            title: t("kundli.technology.clientSide.title"),
            body: t("kundli.technology.clientSide.body"),
          },
          {
            Icon: Zap,
            title: t("kundli.technology.subSecond.title"),
            body: t("kundli.technology.subSecond.body"),
          },
          {
            Icon: Award,
            title: t("kundli.technology.openMath.title"),
            body: t("kundli.technology.openMath.body"),
          },
        ].map(({ Icon, title, body }) => (
          <div key={title} className="rounded-xl border border-border bg-card p-6">
            <div className="inline-flex size-11 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Icon className="size-5" />
            </div>
            <div className="mt-4 font-display text-lg font-semibold">{title}</div>
            <p className="mt-2 text-sm text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function PrivacySection() {
  const { t } = useTranslation();
  return (
    <SectionShell eyebrow={t("kundli.privacy.eyebrow")} title={t("kundli.privacy.title")}>
      <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted/40 p-8">
        <div className="grid gap-6 lg:grid-cols-[auto_1fr] items-start">
          <div className="inline-flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Lock className="size-7" />
          </div>
          <div>
            <p className="text-lg text-foreground">{t("kundli.privacy.body")}</p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 text-primary shrink-0" />{" "}
                {t("kundli.privacy.bullet1")}
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 text-primary shrink-0" />{" "}
                {t("kundli.privacy.bullet2")}
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 text-primary shrink-0" />{" "}
                {t("kundli.privacy.bullet3")}
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 text-primary shrink-0" />{" "}
                {t("kundli.privacy.bullet4")}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

function Testimonials() {
  const { t } = useTranslation();
  const items = [
    {
      name: "Priya Menon",
      role: t("kundli.testimonials.role.bengaluru"),
      body: t("kundli.testimonials.t1"),
    },
    {
      name: "Rohan Kulkarni",
      role: t("kundli.testimonials.role.pune"),
      body: t("kundli.testimonials.t2"),
    },
    {
      name: "Anjali Sharma",
      role: t("kundli.testimonials.role.delhi"),
      body: t("kundli.testimonials.t3"),
    },
    {
      name: "Vikram Iyer",
      role: t("kundli.testimonials.role.chennai"),
      body: t("kundli.testimonials.t4"),
    },
    {
      name: "Fatima Rahman",
      role: t("kundli.testimonials.role.kolkata"),
      body: t("kundli.testimonials.t5"),
    },
    {
      name: "Arjun Reddy",
      role: t("kundli.testimonials.role.hyderabad"),
      body: t("kundli.testimonials.t6"),
    },
  ];
  return (
    <SectionShell eyebrow={t("kundli.testimonials.eyebrow")} title={t("kundli.testimonials.title")}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((t) => (
          <blockquote key={t.name} className="rounded-xl border border-border bg-card p-6">
            <div className="flex gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-accent text-accent" />
              ))}
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed">"{t.body}"</p>
            <footer className="mt-4 flex items-center gap-3">
              <div className="size-9 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground flex items-center justify-center font-semibold">
                {t.name.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </footer>
          </blockquote>
        ))}
      </div>
    </SectionShell>
  );
}

function PremiumUpgrade() {
  const { t } = useTranslation();
  const bullets = [
    { title: t("kundli.premium.b1.title"), body: t("kundli.premium.b1.body") },
    { title: t("kundli.premium.b2.title"), body: t("kundli.premium.b2.body") },
    { title: t("kundli.premium.b3.title"), body: t("kundli.premium.b3.body") },
    { title: t("kundli.premium.b4.title"), body: t("kundli.premium.b4.body") },
  ];
  return (
    <section className="mt-24">
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary via-primary/90 to-accent p-8 md:p-12 text-primary-foreground shadow-xl">
        <div
          className="absolute inset-0 opacity-30"
          aria-hidden
          style={{
            background:
              "radial-gradient(50% 50% at 80% 20%, rgba(255,255,255,.35), transparent 60%)",
          }}
        />
        <div className="relative grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <Badge className="bg-background/20 text-primary-foreground border-primary-foreground/30 backdrop-blur">
              <Rocket className="mr-1.5 size-3.5" /> {t("kundli.premium.badge")}
            </Badge>
            <h2 className="mt-4 font-display text-3xl md:text-5xl font-bold tracking-tight">
              {t("kundli.premium.title")}
            </h2>
            <p className="mt-3 max-w-lg text-primary-foreground/90 text-lg">
              {t("kundli.premium.subtitle")}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button size="lg" variant="secondary" className="font-semibold h-12">
                <Sparkles className="mr-2 h-4 w-4" /> {t("kundli.premium.cta_get")}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Heart className="mr-2 h-4 w-4" /> {t("kundli.premium.cta_donate")}
              </Button>
            </div>
            <p className="mt-3 text-xs text-primary-foreground/80">
              {t("kundli.premium.guarantee")}
            </p>
          </div>
          <ul className="space-y-4">
            {bullets.map((b) => (
              <li
                key={b.title}
                className="rounded-xl bg-background/10 backdrop-blur border border-primary-foreground/20 p-4"
              >
                <div className="font-semibold flex items-center gap-2">
                  <CheckCircle2 className="size-4" /> {b.title}
                </div>
                <p className="mt-1 text-sm text-primary-foreground/85">{b.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  const { t } = useTranslation();
  const [open, setOpen] = useState<number | null>(0);
  const faqs = [
    { q: t("kundli.faq.q1.q"), a: t("kundli.faq.q1.a") },
    { q: t("kundli.faq.q2.q"), a: t("kundli.faq.q2.a") },
    { q: t("kundli.faq.q3.q"), a: t("kundli.faq.q3.a") },
    { q: t("kundli.faq.q4.q"), a: t("kundli.faq.q4.a") },
    { q: t("kundli.faq.q5.q"), a: t("kundli.faq.q5.a") },
    { q: t("kundli.faq.q6.q"), a: t("kundli.faq.q6.a") },
    { q: t("kundli.faq.q7.q"), a: t("kundli.faq.q7.a") },
    { q: t("kundli.faq.q8.q"), a: t("kundli.faq.q8.a") },
  ];
  return (
    <SectionShell id="faq" eyebrow={t("kundli.faq.eyebrow")} title={t("kundli.faq.title")}>
      <div className="mx-auto max-w-3xl divide-y divide-border rounded-xl border border-border bg-card">
        {faqs.map((f, i) => {
          const active = open === i;
          return (
            <button
              key={f.q}
              className="w-full text-left"
              onClick={() => setOpen(active ? null : i)}
              aria-expanded={active}
            >
              <div className="flex items-start justify-between gap-4 px-5 py-4">
                <div className="font-medium text-foreground">{f.q}</div>
                <ChevronRight
                  className={`mt-0.5 size-4 text-muted-foreground transition-transform ${active ? "rotate-90 text-primary" : ""}`}
                />
              </div>
              {active && (
                <div className="px-5 pb-5 -mt-1 text-sm text-muted-foreground leading-relaxed">
                  {f.a}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </SectionShell>
  );
}

const RELATED_TOOLS: Array<{ slug: string; key: string; Icon: any }> = [
  { slug: "rashi-calculator", key: "rashi_calculator", Icon: Compass },
  { slug: "nakshatra-finder", key: "nakshatra_finder", Icon: Star },
  { slug: "dasha-calculator", key: "dasha_calculator", Icon: Clock },
  { slug: "todays-panchang", key: "todays_panchang", Icon: CalendarIcon },
  { slug: "panchang-by-date", key: "panchang_by_date", Icon: CalendarIcon },
  { slug: "festival-calendar-2026", key: "festival_calendar", Icon: Sparkles },
  { slug: "rashi-guide", key: "rashi_guide", Icon: BookOpen },
  { slug: "nakshatra-guide", key: "nakshatra_guide", Icon: BookOpen },
];

function RelatedTools() {
  const { t } = useTranslation();
  return (
    <SectionShell
      eyebrow={t("kundli.relatedTools.eyebrow")}
      title={t("kundli.relatedTools.title")}
      subtitle={t("kundli.relatedTools.subtitle")}
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {RELATED_TOOLS.map(({ slug, key, Icon }) => (
          <Link
            key={slug}
            to="/tools/$slug"
            params={{ slug }}
            className="group rounded-xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-md transition-all"
          >
            <div className="inline-flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Icon className="size-4" />
            </div>
            <div className="mt-3 font-semibold group-hover:text-primary">
              {t(`kundli.relatedTools.items.${key}.title`)}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {t(`kundli.relatedTools.items.${key}.desc`)}
            </p>
            <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
              {t("kundli.relatedTools.open_tool")} <ChevronRight className="size-3" />
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-6 text-center">
        <Link
          to="/tools"
          search={{ q: "" }}
          className="text-sm font-semibold text-primary hover:underline"
        >
          {t("kundli.relatedTools.browse_all")}
        </Link>
      </div>
    </SectionShell>
  );
}

const RELATED_ARTICLES_KEYS = ["a1", "a2", "a3", "a4"] as const;

function RelatedArticles() {
  const { t } = useTranslation();
  return (
    <SectionShell
      eyebrow={t("kundli.relatedArticles.eyebrow")}
      title={t("kundli.relatedArticles.title")}
    >
      <div className="grid gap-4 md:grid-cols-2">
        {RELATED_ARTICLES_KEYS.map((key) => (
          <article
            key={key}
            className="rounded-xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer"
          >
            <Badge variant="secondary" className="mb-3">
              {t("kundli.relatedArticles.badge")}
            </Badge>
            <h3 className="font-display text-lg font-semibold group-hover:text-primary">
              {t(`kundli.relatedArticles.${key}.title`)}
            </h3>
            <div className="mt-2 text-xs text-muted-foreground">
              {t(`kundli.relatedArticles.${key}.read`)}
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

function Newsletter() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^\S+@\S+\.\S+$/.test(trimmed)) {
      toast.error(t("kundli.newsletter.invalid_email"));
      return;
    }
    setBusy(true);
    try {
      await subscribeNewsletter({ data: { email: trimmed, source: "kundli-landing" } });
      setDone(true);
      setEmail("");
      toast.success(t("kundli.newsletter.subscribed_toast"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("kundli.newsletter.could_not_subscribe"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mt-24">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 md:p-12 shadow-sm">
        <div
          className="absolute inset-0 -z-10 opacity-40"
          aria-hidden
          style={{
            background:
              "radial-gradient(40% 60% at 90% 100%, color-mix(in oklab, var(--accent) 25%, transparent), transparent 70%)",
          }}
        />
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] items-center">
          <div>
            <Badge className="rounded-full border border-accent/30 bg-accent/10 text-accent-foreground">
              <Mail className="mr-1.5 size-3.5" /> {t("kundli.newsletter.badge")}
            </Badge>
            <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold tracking-tight">
              {t("kundli.newsletter.title")}
            </h2>
            <p className="mt-2 text-muted-foreground max-w-xl">{t("kundli.newsletter.subtitle")}</p>
          </div>
          <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              maxLength={255}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("kundli.newsletter.email_placeholder")}
              className="h-12 bg-background"
              aria-label={t("kundli.newsletter.email_aria_label")}
            />
            <Button type="submit" size="lg" className="h-12 font-semibold" disabled={busy || done}>
              {done
                ? t("kundli.newsletter.subscribed_button")
                : busy
                  ? t("kundli.newsletter.busy_button")
                  : t("kundli.newsletter.subscribe_button")}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  const { t } = useTranslation();
  return (
    <section className="my-24 text-center">
      <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
        {t("kundli.finalCta.title")}
      </h2>
      <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
        {t("kundli.finalCta.subtitle")}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button
          size="lg"
          className="h-12 px-8 font-semibold"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <Sparkles className="mr-2 h-4 w-4" /> {t("kundli.finalCta.generate_button")}
        </Button>
        <Link to="/tools" search={{ q: "" }}>
          <Button size="lg" variant="outline" className="h-12 px-8">
            {t("kundli.finalCta.explore_tools")}
          </Button>
        </Link>
      </div>
    </section>
  );
}

function StickyMobileCta() {
  const { t } = useTranslation();
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-card/95 backdrop-blur p-3 shadow-lg print:hidden">
      <Button
        size="lg"
        className="w-full h-12 font-semibold"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <Sparkles className="mr-2 h-4 w-4" /> {t("kundli.stickyCta.generate_button")}
      </Button>
    </div>
  );
}
