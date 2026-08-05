import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, Loader2, Sparkles, Download, ShieldCheck, Lock, Award, TrendingUp, DollarSign, Building } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PhotonPlacePicker } from "@/components/tools/PhotonPlacePicker";
import { SanatanLoader } from "@/components/ui-kit/SanatanLoader";
import { PremiumToolShell, toolSchema } from "@/components/tools/PremiumToolShell";
import { generateKundli } from "@/lib/kundli";
import type { KundliResult } from "@/lib/kundli/types";
import { DEFAULT_LOCATION, type LatLon } from "@/lib/panchang";
import { useTranslation } from "@/i18n/I18nProvider";
import { useToolAccess } from "@/lib/monetization/tool-access";
import { downloadCareerPdf } from "@/lib/pdf/report-generators";

const FAQS = [
  {
    q: "How is the career report generated?",
    a: "We analyse your 10th house (karma bhava), its lord, Sun, Saturn, D10 Dasamsa chart, and Jupiter — the classical Vedic career indicators.",
  },
  {
    q: "What professions match my chart?",
    a: "The dominant planet in the 10th house, the 10th lord's sign, D10 chart, and Atmakaraka indicate suitable fields — full reports detail exact business and job suitability.",
  },
  {
    q: "Is exact birth time needed?",
    a: "Yes — the 10th house cusp changes every ~2 hours, so an accurate birth time is essential for career and business analysis.",
  },
];

export const Route = createFileRoute("/tools/career-report")({
  head: () => ({
    meta: [
      { title: "Career & Business Report — Pro Vedic Astrology Analysis" },
      {
        name: "description",
        content:
          "Vedic career & business report — 10th house analysis, D10 Dasamsa chart, career planets, business suitability, and downloadable PDF.",
      },
      { property: "og:title", content: "Career & Business Report — Vedic Astrology" },
      {
        property: "og:description",
        content: "Discover your ideal career and business path using your Vedic birth chart.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: toolSchema({
          name: "Career & Business Report",
          description: "Vedic career and business analysis based on birth chart's 10th house, D10 chart, and Saturn.",
          url: "https://sanatantools.com/tools/career-report",
          faqs: FAQS,
        }),
      },
    ],
  }),
  component: Page,
});

function Page() {
  const { t, raw } = useTranslation();
  return (
    <PremiumToolShell
      title={t("premium_tools.career.title")}
      tagline={t("premium_tools.career.tagline")}
      breadcrumb={t("premium_tools.career.breadcrumb")}
      howToUse={raw<string[]>("premium_tools.career.how_to_use") ?? []}
      benefits={raw<string[]>("premium_tools.career.benefits") ?? []}
      faqs={raw<{ q: string; a: string }[]>("premium_tools.career.faqs") ?? FAQS}
      related={[
        {
          title: t("premium_tools.career.related.kundli.title"),
          href: "/kundli",
          description: t("premium_tools.career.related.kundli.description"),
        },
        {
          title: t("premium_tools.career.related.numerology.title"),
          href: "/tools/numerology-report",
          description: t("premium_tools.career.related.numerology.description"),
        },
        {
          title: t("premium_tools.career.related.muhurat.title"),
          href: "/tools/muhurat-finder",
          description: t("premium_tools.career.related.muhurat.description"),
        },
      ]}
      premiumNote={t("premium_tools.career.premium_note")}
    >
      <CareerTool />
    </PremiumToolShell>
  );
}

function CareerTool() {
  const { t } = useTranslation();
  const toolAccess = useToolAccess("career-report");
  const isPremium = toolAccess.isAccessible;

  const [date, setDate] = useState("");
  const [time, setTime] = useState("12:00");
  const [loc, setLoc] = useState<LatLon>({ ...DEFAULT_LOCATION });
  const [loading, setLoading] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [result, setResult] = useState<KundliResult | null>(null);

  const compute = () => {
    if (!date || !time) return toast.error(t("premium_tools.shared.enter_date_time_error"));
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      try {
        const k = generateKundli({
          date,
          time,
          place: loc.label,
          latitude: loc.lat,
          longitude: loc.lon,
          timezone: loc.tz,
        });
        setResult(k);
      } catch (e) {
        console.error(e);
        toast.error(t("premium_tools.shared.generic_error"));
      } finally {
        setLoading(false);
      }
    }, 200);
  };

  const handleDownloadPdf = async () => {
    if (!result) return;
    setDownloadingPdf(true);
    try {
      await downloadCareerPdf(result as unknown as Record<string, unknown>, `Career_Business_Report_${date}.pdf`);
      toast.success("Career & Business PDF generated & downloaded!");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to download Career PDF");
    } finally {
      setDownloadingPdf(false);
    }
  };

  const tenthPlanets = result?.d1.planets.filter((p) => p.house === 10) ?? [];
  const sun = result?.d1.planets.find((p) => p.graha === "Sun");
  const saturn = result?.d1.planets.find((p) => p.graha === "Saturn");
  const jupiter = result?.d1.planets.find((p) => p.graha === "Jupiter");
  const mercury = result?.d1.planets.find((p) => p.graha === "Mercury");

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <Briefcase className="size-5 text-primary" /> {t("premium_tools.shared.enter_birth_details")}
          </div>
          {isPremium && (
            <Badge className="bg-amber-500 text-white flex items-center gap-1">
              <ShieldCheck className="size-3.5" /> PRO ACTIVE — FULL REPORT UNLOCKED
            </Badge>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>{t("premium_tools.shared.date_of_birth")}</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <Label>{t("premium_tools.shared.time_of_birth")}</Label>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>
        <div className="mt-3">
          <PhotonPlacePicker value={loc} onChange={setLoc} />
        </div>
        <div className="mt-5 text-center">
          <Button size="lg" onClick={compute} disabled={loading} className="min-w-[220px] font-semibold">
            {loading ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />{" "}
                {t("premium_tools.career.analysing")}
              </>
            ) : (
              <>
                <Sparkles className="size-4 mr-2" /> {t("premium_tools.career.analyse_button")}
              </>
            )}
          </Button>
        </div>
      </Card>

      {loading && (
        <div className="mt-8">
          <SanatanLoader
            title={t("premium_tools.career.loader_title")}
            subtitle={t("premium_tools.career.loader_subtitle")}
          />
        </div>
      )}

      {result && (
        <div className="mt-8 space-y-6">
          {/* Header Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-primary/5 to-amber-500/10 border">
            <div>
              <h2 className="text-xl font-bold font-serif flex items-center gap-2">
                <Award className="size-5 text-amber-500" /> Career & Business Vedic Analysis
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Birth Date: {date} | Time: {time} | Place: {loc.label}
              </p>
            </div>
            {isPremium ? (
              <Button
                onClick={handleDownloadPdf}
                disabled={downloadingPdf}
                className="bg-amber-500 hover:bg-amber-600 text-white font-medium"
              >
                {downloadingPdf ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" /> Generating PDF…
                  </>
                ) : (
                  <>
                    <Download className="size-4 mr-2" /> Download Pro Career PDF
                  </>
                )}
              </Button>
            ) : (
              <Button asChild className="bg-amber-500 hover:bg-amber-600 text-white">
                <Link to="/pricing">Upgrade for Pro PDF →</Link>
              </Button>
            )}
          </div>

          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Briefcase className="size-5 text-amber-500" /> {t("premium_tools.career.tenth_house_heading")}
            </h3>
            {tenthPlanets.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {t("premium_tools.career.no_tenth_house_planets")}
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {tenthPlanets.map((p) => (
                  <div key={p.graha} className="rounded-lg border p-3 bg-muted/20">
                    <div className="font-semibold text-primary">
                      {p.graha}{" "}
                      <Badge variant="secondary" className="ml-1">
                        {p.dignity}
                      </Badge>
                      {p.retrograde && (
                        <Badge variant="outline" className="ml-1">
                          {t("premium_tools.shared.retro")}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {p.rashi} · {p.nakshatra} · {t("premium_tools.shared.pada")} {p.pada}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="size-5 text-primary" /> {t("premium_tools.career.career_planets_heading")}
            </h3>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { label: t("premium_tools.career.planet_sun"), p: sun },
                { label: t("premium_tools.career.planet_saturn"), p: saturn },
                { label: t("premium_tools.career.planet_jupiter"), p: jupiter },
              ].map(
                ({ label, p }) =>
                  p && (
                    <div key={label} className="rounded-lg border p-3 bg-card">
                      <div className="text-xs uppercase font-medium text-amber-600">{label}</div>
                      <div className="font-bold text-primary mt-1">
                        {p.graha} · {t("premium_tools.shared.house")} {p.house}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {p.rashi} · {p.dignity}
                      </div>
                    </div>
                  ),
              )}
            </div>
          </Card>

          {/* PREMIUM EXTENSION: BUSINESS & ENTREPRENEURSHIP INDICATORS */}
          {isPremium ? (
            <div className="space-y-6">
              <Card className="p-6 border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-primary/5">
                <h3 className="text-xl font-bold font-serif mb-3 flex items-center gap-2 text-primary">
                  <Building className="size-5 text-amber-500" /> Business vs. Employment Aptitude
                </h3>
                <p className="text-sm text-foreground leading-relaxed">
                  Your 10th house is ruled by <strong>{result.d1.ascendant.rashi}</strong> ascendant dynamics. 
                  {mercury && mercury.house === 10 ? " Strong Mercury placement in the 10th house indicates stellar aptitude for independent business, trading, and technology ventures." : " High Saturn and Sun dignity favours corporate leadership, executive administration, and government-backed sectors."}
                </p>
                <div className="grid sm:grid-cols-2 gap-4 mt-4 text-xs font-semibold">
                  <div className="p-3 bg-card rounded border">
                    <span className="text-amber-600 font-bold block mb-1">Corporate Leadership Fit</span>
                    High strategic aptitude for executive roles and organizational management.
                  </div>
                  <div className="p-3 bg-card rounded border">
                    <span className="text-emerald-600 font-bold block mb-1">Entrepreneurial Venture Fit</span>
                    Lucrative commercial trade expansion under active Dasha periods.
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold font-serif mb-3 flex items-center gap-2 text-primary">
                  <DollarSign className="size-5 text-emerald-600" /> Wealth & Income Accumulation Vectors
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  2nd House (Dhana Bhava) and 11th House (Labha Bhava) configurations suggest steady financial returns. 
                  Download the full Pro PDF report for year-by-year income timing and D10 Dasamsa charts.
                </p>
              </Card>
            </div>
          ) : (
            <Card className="p-8 text-center border-dashed border-amber-500/40 bg-amber-500/5 space-y-3">
              <Lock className="size-10 text-amber-500 mx-auto" />
              <h3 className="font-bold text-xl">Unlock Full Career & Business Pro Report</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Upgrade to Pro to access D10 Dasamsa chart analysis, Business vs. Job suitability, income timelines, and download the print-ready PDF.
              </p>
              <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-600 text-white font-semibold">
                <Link to="/pricing">Upgrade to Premium Pro →</Link>
              </Button>
            </Card>
          )}
        </div>
      )}
    </>
  );
}
