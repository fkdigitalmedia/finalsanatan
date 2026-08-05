import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Calendar, Loader2, Sparkles, Download, ShieldCheck, Lock, Award, Compass, TrendingUp, Heart, Activity } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PhotonPlacePicker } from "@/components/tools/PhotonPlacePicker";
import { SanatanLoader } from "@/components/ui-kit/SanatanLoader";
import { PremiumToolShell, toolSchema } from "@/components/tools/PremiumToolShell";

import { useAuth } from "@/hooks/useAuth";
import { useToolAccess } from "@/lib/monetization/tool-access";
import { getMyEntitlements } from "@/lib/payments.functions";
import { generateKundli } from "@/lib/kundli";
import type { KundliResult } from "@/lib/kundli/types";
import { calculateVarshphal, type VarshphalResult } from "@/lib/kundli/varshphal";
import { downloadVarshphalPdf } from "@/lib/kundli/varshphal-pdf";
import { DEFAULT_LOCATION, type LatLon } from "@/lib/panchang";
import { useTranslation } from "@/i18n/I18nProvider";
import { trackReportGenerated } from "@/lib/workspace/tracker";

const FAQS = [
  {
    q: "What is Varshphal?",
    a: "Varshphal (or Tajika) is the annual horoscope cast for your solar return each year. It predicts the coming year's key themes, Muntha position, and month-by-month timeline.",
  },
  {
    q: "How is Varshphal different from a birth chart?",
    a: "The birth chart shows your lifetime blueprint; Varshphal zooms into one specific year using the Sun's return to its exact natal position.",
  },
  {
    q: "What benefits do Pro users get in Varshphal?",
    a: "Pro users get the complete annual report including Muntha analysis, Varshapati year lord strength, Tajika Sahams (Punya, Vidya, Karma, Dhana), 12-month timeline, and PDF report downloads.",
  },
];

export const Route = createFileRoute("/tools/varshphal")({
  head: () => ({
    meta: [
      { title: "Varshphal — Annual Horoscope & Solar Return Predictions" },
      {
        name: "description",
        content:
          "Calculate your Vedic Varshphal annual horoscope — Muntha analysis, Varshapati, Tajika Sahams, 12-month predictions, and downloadable PDF report.",
      },
      { property: "og:title", content: "Varshphal — Annual Horoscope Report" },
      {
        property: "og:description",
        content: "Vedic annual solar return prediction with Muntha & monthly timeline.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: toolSchema({
          name: "Varshphal — Annual Prediction",
          description: "Vedic annual horoscope with Muntha analysis and monthly predictions.",
          url: "https://sanatantools.com/tools/varshphal",
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
      title={t("premium_tools.varshphal.title")}
      tagline={t("premium_tools.varshphal.tagline")}
      breadcrumb={t("premium_tools.varshphal.breadcrumb")}
      howToUse={raw<string[]>("premium_tools.varshphal.how_to_use") ?? []}
      benefits={raw<string[]>("premium_tools.varshphal.benefits") ?? []}
      faqs={raw<{ q: string; a: string }[]>("premium_tools.varshphal.faqs") ?? FAQS}
      related={[
        {
          title: t("premium_tools.varshphal.related.kundli.title"),
          href: "/kundli",
          description: t("premium_tools.varshphal.related.kundli.description"),
        },
        {
          title: t("premium_tools.varshphal.related.muhurat.title"),
          href: "/tools/muhurat-finder",
          description: t("premium_tools.varshphal.related.muhurat.description"),
        },
        {
          title: t("premium_tools.varshphal.related.career.title"),
          href: "/tools/career-report",
          description: t("premium_tools.varshphal.related.career.description"),
        },
      ]}
      premiumNote={t("premium_tools.varshphal.premium_note")}
    >
      <VarshTool />
    </PremiumToolShell>
  );
}

function VarshTool() {
  const { t, raw, lang } = useTranslation();
  const { user } = useAuth();
  const toolAccess = useToolAccess("varshphal");
  const isPremium = toolAccess.isAccessible;

  const [date, setDate] = useState("1995-08-15");
  const [time, setTime] = useState("12:00");
  const [targetYear, setTargetYear] = useState<number>(new Date().getFullYear());
  const [loc, setLoc] = useState<LatLon>({ ...DEFAULT_LOCATION });
  const [loading, setLoading] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [result, setResult] = useState<KundliResult | null>(null);
  const [varshResult, setVarshResult] = useState<VarshphalResult | null>(null);

  const compute = () => {
    if (!date || !time) return toast.error(t("premium_tools.shared.enter_date_time_error"));
    setLoading(true);
    setResult(null);
    setVarshResult(null);

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
        const v = calculateVarshphal(k, targetYear);
        setResult(k);
        setVarshResult(v);

        if (user) {
          trackReportGenerated({
            kind: "varshphal",
            title: `Varshphal ${targetYear} Report`,
            data: { birth: { date, time, place: loc.label }, targetYear, muntha: v.muntha },
          }).catch(console.error);
        }
      } catch (e) {
        console.error(e);
        toast.error(t("premium_tools.shared.generic_error"));
      } finally {
        setLoading(false);
      }
    }, 200);
  };

  const handleDownloadPdf = async () => {
    if (!result || !varshResult) return;
    setDownloadingPdf(true);
    try {
      await downloadVarshphalPdf(result, varshResult, {
        premium: true,
        language: (lang as any) || "en",
        filename: `Varshphal_Report_${targetYear}.pdf`,
      });
      toast.success("Varshphal PDF generated & downloaded successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to download Varshphal PDF");
    } finally {
      setDownloadingPdf(false);
    }
  };

  const currentMD = result?.vimshottari?.current?.mahadasha ?? null;
  const dashaThemes =
    raw<Record<string, string>>("premium_tools.varshphal.dasha_themes") ?? DASHA_THEMES;

  const yearOptions = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i - 1);

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <Calendar className="size-5 text-primary" /> {t("premium_tools.shared.enter_birth_details")}
          </div>
          {isPremium && (
            <Badge className="bg-amber-500 text-white flex items-center gap-1">
              <ShieldCheck className="size-3.5" /> PRO ACTIVE
            </Badge>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label>{t("premium_tools.shared.date_of_birth")}</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <Label>{t("premium_tools.shared.time_of_birth")}</Label>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
          <div>
            <Label>Target Year (Varshphal Year)</Label>
            <Select value={String(targetYear)} onValueChange={(val) => setTargetYear(Number(val))}>
              <SelectTrigger>
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y} – {y + 1} Annual Return
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4">
          <PhotonPlacePicker value={loc} onChange={setLoc} />
        </div>

        <div className="mt-6 text-center">
          <Button size="lg" onClick={compute} disabled={loading} className="min-w-[240px] font-semibold">
            {loading ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />{" "}
                {t("premium_tools.varshphal.computing")}
              </>
            ) : (
              <>
                <Sparkles className="size-4 mr-2" />{" "}
                Calculate Varshphal Report ({targetYear})
              </>
            )}
          </Button>
        </div>
      </Card>

      {loading && (
        <div className="mt-8">
          <SanatanLoader
            title={t("premium_tools.varshphal.loader_title")}
            subtitle={t("premium_tools.varshphal.loader_subtitle")}
          />
        </div>
      )}

      {result && varshResult && (
        <div className="mt-8 space-y-8">
          {/* Header Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-primary/5 to-amber-500/10 border">
            <div>
              <h2 className="text-xl font-bold font-serif flex items-center gap-2">
                <Award className="size-5 text-amber-500" /> Varshphal Annual Report ({varshResult.targetYear})
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Age: {varshResult.age} years | Solar Return Year Analysis
              </p>
            </div>
            {isPremium && (
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
                    <Download className="size-4 mr-2" /> Download Pro Varshphal PDF
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Executive Scorecard (0-100) */}
          <Card className="p-6 border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-card to-primary/5">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b">
              <div>
                <h3 className="text-xl font-bold font-serif text-primary flex items-center gap-2">
                  <Award className="size-6 text-amber-500" /> Executive Annual Scorecard ({varshResult.overallScore} / 100)
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Weighted commercial score across key annual life domains.
                </p>
              </div>
              <Badge className="bg-amber-500 text-white text-sm px-3 py-1 font-bold">
                SCORE: {varshResult.overallScore} / 100
              </Badge>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {varshResult.scorecard.map((sc) => (
                <div key={sc.domain} className="p-3.5 rounded-lg border bg-card/60 space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-foreground">{sc.domain}</span>
                    <span className="text-amber-600 font-bold">{sc.score}/100</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${sc.score}%` }} />
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2">{sc.summary}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Muntha & Varshapati Key Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Muntha Card */}
            <Card className="p-6 border-amber-500/20 bg-card">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
                  <Compass className="size-4" /> Muntha Analysis
                </div>
                <Badge variant={varshResult.muntha.favourability === "Excellent" || varshResult.muntha.favourability === "Good" ? "default" : "secondary"}>
                  {varshResult.muntha.favourability}
                </Badge>
              </div>
              <div className="text-2xl font-bold font-serif text-primary">{varshResult.muntha.title}</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Muntha Sign: <span className="font-semibold text-foreground">{varshResult.muntha.sign}</span> | Ruling Lord: <span className="font-semibold text-foreground">{varshResult.muntha.lord}</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed border-t pt-3">
                {varshResult.muntha.description}
              </p>
              <div className="mt-3 text-xs space-y-1 bg-muted/40 p-3 rounded">
                <div className="text-emerald-600 font-medium">✔ Positive: {varshResult.muntha.positiveEffects}</div>
                <div className="text-rose-600 font-medium">⚠ Caution: {varshResult.muntha.negativeEffects}</div>
              </div>
            </Card>

            {/* Varshapati Card */}
            <Card className="p-6 border-amber-500/20 bg-card">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
                  <Award className="size-4" /> Varshapati (Year Lord)
                </div>
                <Badge variant="outline" className="text-amber-600 border-amber-500/30">
                  {varshResult.varshapati.strength}
                </Badge>
              </div>
              <div className="text-2xl font-bold font-serif text-primary">{varshResult.varshapati.title}</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Year Lord: <span className="font-semibold text-foreground">{varshResult.varshapati.lord}</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed border-t pt-3">
                {varshResult.varshapati.description}
              </p>
              <div className="mt-3 text-xs space-y-1 bg-muted/40 p-3 rounded">
                <div className="font-medium text-foreground">Career: {varshResult.varshapati.careerImpact}</div>
                <div className="font-medium text-foreground">Finance: {varshResult.varshapati.financeImpact}</div>
              </div>
            </Card>
          </div>

          {/* Tajika Yogas Section */}
          <div>
            <h3 className="text-lg font-semibold font-serif mb-4 flex items-center gap-2">
              <Sparkles className="size-4 text-amber-500" /> Tajika Yogas (Annual Planetary Formations)
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {varshResult.tajikaYogas.map((yoga) => (
                <Card key={yoga.name} className={`p-4 border ${yoga.isFormed ? "border-amber-500/40 bg-amber-500/5" : "opacity-60"}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-primary">{yoga.name}</span>
                    <Badge variant={yoga.isFormed ? "default" : "outline"} className="text-[10px]">
                      {yoga.isFormed ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="text-[11px] text-muted-foreground font-mono mt-0.5">{yoga.sanskritName}</div>
                  <p className="text-xs text-muted-foreground mt-2">{yoga.meaning}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Tajika Sahams (15 Sahams) */}
          {isPremium ? (
            <div>
              <h3 className="text-lg font-semibold font-serif mb-4 flex items-center gap-2">
                <Sparkles className="size-4 text-amber-500" /> 15 Tajika Sahams (Special Points of Destiny)
              </h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {varshResult.sahams.map((saham) => (
                  <Card key={saham.name} className="p-3.5 bg-muted/30 border hover:border-amber-500/40 transition-colors">
                    <div className="text-[10px] text-muted-foreground font-mono">{saham.sanskritName}</div>
                    <div className="font-bold text-xs mt-1 text-primary">{saham.name}</div>
                    <div className="text-[11px] font-medium text-amber-600 mt-0.5">
                      {saham.sign} (H{saham.house})
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1.5 leading-snug line-clamp-2">
                      {saham.meaning}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <Card className="p-6 text-center border-dashed border-amber-500/40 bg-amber-500/5">
              <Lock className="size-8 text-amber-500 mx-auto mb-2" />
              <h4 className="font-bold text-lg">Unlock 15 Tajika Sahams & Enterprise PDF</h4>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1">
                Upgrade to Pro to view Punya, Vidya, Karma, Dhana Sahams, Mudda Dasha timeline, 10 Life Domain Deep Dives, and download the 25–40 page Pro PDF.
              </p>
              <Button asChild size="sm" className="mt-4 bg-amber-500 hover:bg-amber-600 text-white font-medium">
                <Link to="/pricing">Upgrade to Premium Pro →</Link>
              </Button>
            </Card>
          )}

          {/* Mudda Dasha Timeline */}
          {isPremium && (
            <div>
              <h3 className="text-lg font-semibold font-serif mb-4 flex items-center gap-2">
                <Calendar className="size-4 text-primary" /> Mudda Dasha Timeline (Annual Vimshottari)
              </h3>
              <div className="grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {varshResult.muddaDasha.map((md) => (
                  <Card key={md.planet} className="p-3.5 border bg-card">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-primary">{md.planet}</span>
                      <Badge variant="outline" className="text-[10px]">{md.durationDays} Days</Badge>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1">{md.startDate} – {md.endDate}</div>
                    <p className="text-[11px] text-muted-foreground mt-2 line-clamp-3">{md.prediction}</p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Quarterly Strategy Breakdown (Q1 - Q4) */}
          <div>
            <h3 className="text-lg font-semibold font-serif mb-4 flex items-center gap-2">
              <TrendingUp className="size-4 text-primary" /> Quarterly Strategy Breakdown ({varshResult.targetYear})
            </h3>
            <div className="grid md:grid-cols-4 gap-4">
              {varshResult.quarterlyForecast.map((q) => (
                <Card key={q.quarter} className="p-4 border bg-card">
                  <Badge variant="secondary" className="mb-2 text-xs">{q.periodName}</Badge>
                  <div className="font-bold text-sm text-primary">{q.focus}</div>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{q.summary}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* 12-Month Timeline (Structured Cards V2) */}
          {isPremium && (
            <div>
              <h3 className="text-lg font-semibold font-serif mb-4 flex items-center gap-2">
                <Calendar className="size-4 text-primary" /> Redesigned 12-Month Structured Timeline Cards ({varshResult.targetYear})
              </h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {varshResult.monthlyTimeline.map((month) => (
                  <Card key={month.monthNumber} className="p-4 hover:border-amber-500/50 transition-colors border space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[10px] font-mono">
                        Month {month.monthNumber}
                      </Badge>
                      <span className="text-xs font-semibold text-primary">{month.rulingPlanet}</span>
                    </div>
                    <div className="font-bold text-sm">{month.monthName}</div>
                    <div className="text-[11px] text-amber-600 font-medium">{month.startDate} – {month.endDate}</div>

                    <div className="text-xs space-y-1 pt-1 border-t">
                      <div className="font-semibold text-foreground">Career Bullets:</div>
                      {month.careerBullets.map((b, i) => (
                        <div key={i} className="text-[11px] text-muted-foreground">• {b}</div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1 font-semibold border-t">
                      <span className="text-emerald-600">Opp Score: {month.opportunityScore}%</span>
                      <span className="text-rose-600">Risk Score: {month.riskScore}%</span>
                    </div>

                    <div className="text-[11px] text-amber-700 bg-amber-500/10 p-2 rounded">
                      💡 Remedy: {month.suggestedRemedy}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* 11-Category Important Dates Matrix */}
          <div>
            <h3 className="text-lg font-semibold font-serif mb-4 flex items-center gap-2">
              <Calendar className="size-4 text-amber-500" /> 11-Category Important Annual Dates Matrix
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {varshResult.importantDateMatrix.map((dt) => (
                <Card key={dt.category} className="p-3.5 border bg-card/60">
                  <div className="text-xs font-bold text-amber-600">{dt.category}</div>
                  <div className="font-mono text-xs text-foreground font-semibold mt-1">{dt.dates.join(", ")}</div>
                  <p className="text-[11px] text-muted-foreground mt-1.5 leading-snug">{dt.recommendation}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Vimshottari Maha Dasha Reference */}
          <Card className="p-6 text-center bg-gradient-to-br from-primary/5 to-amber-500/5">
            <div className="text-xs uppercase text-muted-foreground">
              {t("premium_tools.varshphal.current_maha_dasha")}
            </div>
            {currentMD ? (
              <>
                <div className="mt-2 text-3xl font-black text-primary">{currentMD.lord}</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {new Date(currentMD.startISO).getFullYear()} –{" "}
                  {new Date(currentMD.endISO).getFullYear()}
                </div>
                <p className="mt-3 text-sm max-w-xl mx-auto">
                  {dashaThemes[currentMD.lord] ?? t("premium_tools.varshphal.dasha_theme_fallback")}
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                {t("premium_tools.varshphal.unable_to_determine")}
              </p>
            )}
          </Card>
        </div>
      )}
    </>
  );
}

const DASHA_THEMES: Record<string, string> = {
  Ketu: "Introspection, spiritual seeking and karmic completion. Focus on inner growth and letting go.",
  Venus: "Love, luxury, art and relationships flourish. A period of pleasure and material comfort.",
  Sun: "Authority, recognition, career visibility and self-realisation take centre stage.",
  Moon: "Emotional depth, home, mother and public reputation dominate the year.",
  Mars: "Action, courage, competition and property matters intensify. Guard against conflict.",
  Rahu: "Sudden gains, foreign influences, ambitions surge — but expect turbulence.",
  Jupiter: "Wisdom, children, teaching, wealth and dharma bring expansion and blessings.",
  Saturn: "Discipline, hard work, karmic tests and long-term structure. Patience rewarded.",
  Mercury: "Communication, learning, trade, writing and networks bring opportunities.",
};
