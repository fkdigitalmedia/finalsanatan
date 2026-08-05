import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Hash, Sparkles, RotateCcw, Download, Lock, Award, ShieldCheck, Calendar, Activity, Heart, Compass, Loader2, Phone, Car, Home, Briefcase } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PremiumToolShell, toolSchema } from "@/components/tools/PremiumToolShell";
import { useTranslation } from "@/i18n/I18nProvider";
import { useToolAccess } from "@/lib/monetization/tool-access";
import { calculateNumerology, type NumerologyReportResultV2 } from "@/lib/numerology/engine";
import { downloadNumerologyPdf } from "@/lib/numerology/pdf";

const FAQS = [
  {
    q: "What is a Life Path number?",
    a: "Your Life Path number is derived from your full date of birth. It reveals your core life purpose and natural strengths.",
  },
  {
    q: "What is a Destiny (Expression) number?",
    a: "It comes from the letters in your full birth name — showing your outward talents, career trajectory, and life calling.",
  },
  {
    q: "Why do Life Path and Destiny differ?",
    a: "Life Path is what you're born with; Destiny is what you express through your name. Together they complete your blueprint.",
  },
];

export const Route = createFileRoute("/tools/numerology-report")({
  head: () => ({
    meta: [
      { title: "Enterprise Numerology Pro Report V2 — 30-40 Pages Commercial Report" },
      {
        name: "description",
        content:
          "Enterprise commercial numerology report — calculate Life Path, Destiny, Soul Urge, Pinnacles, Personal Year, 12-Month Timeline, Practical Assets, and download 30-40 page PDF.",
      },
      { property: "og:title", content: "Enterprise Numerology Pro Report V2" },
      {
        property: "og:description",
        content: "Commercial Vedic & Pythagorean numerology with 30 detailed sections and downloadable PDF.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: toolSchema({
          name: "Enterprise Numerology Report",
          description: "Life Path, Destiny & 30 detailed commercial numerology chapters.",
          url: "https://sanatantools.com/tools/numerology-report",
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
      title={t("premium_tools.numerology.title")}
      tagline={t("premium_tools.numerology.tagline")}
      breadcrumb={t("premium_tools.numerology.breadcrumb")}
      howToUse={raw<string[]>("premium_tools.numerology.how_to_use") ?? []}
      benefits={raw<string[]>("premium_tools.numerology.benefits") ?? []}
      faqs={raw<{ q: string; a: string }[]>("premium_tools.numerology.faqs") ?? FAQS}
      related={[
        {
          title: t("premium_tools.numerology.related.baby_names.title"),
          href: "/tools/baby-name-generator",
          description: t("premium_tools.numerology.related.baby_names.description"),
        },
        {
          title: t("premium_tools.numerology.related.kundli_matching.title"),
          href: "/tools/kundli-matching",
          description: t("premium_tools.numerology.related.kundli_matching.description"),
        },
        {
          title: t("premium_tools.numerology.related.kundli.title"),
          href: "/kundli",
          description: t("premium_tools.numerology.related.kundli.description"),
        },
      ]}
    >
      <NumTool />
    </PremiumToolShell>
  );
}

function NumTool() {
  const { t } = useTranslation();
  const toolAccess = useToolAccess("numerology");
  const isPremium = toolAccess.isAccessible;

  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [mobile, setMobile] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [house, setHouse] = useState("");
  const [businessName, setBusinessName] = useState("");

  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [report, setReport] = useState<NumerologyReportResultV2 | null>(null);

  const generate = () => {
    if (!name.trim()) {
      toast.error(t("premium_tools.numerology.error_name"));
      return;
    }
    if (!dob) {
      toast.error(t("premium_tools.numerology.error_dob"));
      return;
    }
    const res = calculateNumerology(name, dob, { mobile, vehicle, house, businessName });
    setReport(res);
    setTimeout(
      () =>
        document
          .getElementById("num-report")
          ?.scrollIntoView({ behavior: "smooth", block: "start" }),
      80,
    );
  };

  const handleDownloadPdf = async () => {
    if (!report) return;
    setDownloadingPdf(true);
    try {
      await downloadNumerologyPdf(report, `Enterprise_Numerology_${name.trim().replace(/\s+/g, "_")}_V2.pdf`);
      toast.success("Enterprise Numerology Pro PDF generated & downloaded!");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to download Numerology PDF");
    } finally {
      setDownloadingPdf(false);
    }
  };

  const reset = () => {
    setName("");
    setDob("");
    setMobile("");
    setVehicle("");
    setHouse("");
    setBusinessName("");
    setReport(null);
  };

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <Hash className="size-5 text-primary" /> {t("premium_tools.numerology.enter_details")}
          </div>
          {isPremium && (
            <Badge className="bg-amber-500 text-white flex items-center gap-1">
              <ShieldCheck className="size-3.5" /> PRO ACTIVE
            </Badge>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>{t("premium_tools.numerology.full_birth_name")}</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("premium_tools.numerology.name_placeholder")}
            />
          </div>
          <div>
            <Label>{t("premium_tools.shared.date_of_birth")}</Label>
            <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
          </div>
        </div>

        {/* Practical Asset Optional Inputs */}
        <div className="mt-4 pt-4 border-t space-y-3">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Practical Asset Inputs (Optional for Detailed Asset Numerology)
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <Label className="text-xs flex items-center gap-1"><Phone className="size-3 text-amber-500" /> Mobile Number</Label>
              <Input className="h-9 text-xs" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="e.g. 9876543210" />
            </div>
            <div>
              <Label className="text-xs flex items-center gap-1"><Car className="size-3 text-amber-500" /> Vehicle Number</Label>
              <Input className="h-9 text-xs" value={vehicle} onChange={(e) => setVehicle(e.target.value)} placeholder="e.g. DL01AB1234" />
            </div>
            <div>
              <Label className="text-xs flex items-center gap-1"><Home className="size-3 text-amber-500" /> House Number</Label>
              <Input className="h-9 text-xs" value={house} onChange={(e) => setHouse(e.target.value)} placeholder="e.g. 108" />
            </div>
            <div>
              <Label className="text-xs flex items-center gap-1"><Briefcase className="size-3 text-amber-500" /> Business Name</Label>
              <Input className="h-9 text-xs" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="e.g. Sanatan Tools" />
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Button onClick={generate} size="lg" className="gap-2 font-semibold">
            <Sparkles className="size-4" /> Generate Enterprise Numerology Report V2
          </Button>
          {report && (
            <Button onClick={reset} variant="outline" size="lg" className="gap-2">
              <RotateCcw className="size-4" /> {t("premium_tools.numerology.reset_button")}
            </Button>
          )}
        </div>
      </Card>

      {report && (
        <div id="num-report" className="mt-8 space-y-8">
          {/* Header Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-primary/5 to-amber-500/10 border">
            <div>
              <h2 className="text-xl font-bold font-serif flex items-center gap-2">
                <Award className="size-5 text-amber-500" /> Numerology Commercial Profile V2: {report.name}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Date of Birth: {report.dob} | Overall Score: {report.overallScore}/100 | Expression: {report.nameAnalysis.expression}
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
                    <Download className="size-4 mr-2" /> Download Commercial Pro PDF (30-40 Pages)
                  </>
                )}
              </Button>
            )}
          </div>

          {/* FREE VERSION: Life Path & Destiny Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            <NumberCard
              label="Life Path Number (Core Path)"
              number={report.coreNumbers.lifePath.number}
              accent="from-primary/10 to-orange-500/5"
              rulingPlanet={report.coreNumbers.lifePath.rulingPlanet}
              meaning={report.coreNumbers.lifePath.meaning}
            />
            <NumberCard
              label="Destiny Number (Expression)"
              number={report.coreNumbers.destiny.number}
              accent="from-rose-500/10 to-amber-500/5"
              rulingPlanet={report.coreNumbers.destiny.rulingPlanet}
              meaning={report.coreNumbers.destiny.meaning}
            />
          </div>

          {/* FREE VERSION SHORT EXPLANATION */}
          <Card className="p-6 bg-gradient-to-br from-amber-500/5 to-primary/5 border">
            <Badge variant="secondary" className="mb-3">
              Free Numerology Summary
            </Badge>
            <p className="text-sm leading-relaxed text-foreground font-medium">
              Your Life Path Number is <strong>{report.coreNumbers.lifePath.number}</strong> ({report.coreNumbers.lifePath.rulingPlanet}) and your Destiny Number is <strong>{report.coreNumbers.destiny.number}</strong> ({report.coreNumbers.destiny.rulingPlanet}). {report.coreNumbers.lifePath.meaning}
            </p>
          </Card>

          {/* PREMIUM PRO VERSION: 30 DETAILED SECTIONS */}
          {isPremium ? (
            <div className="space-y-8 border-t pt-8">
              {/* Multi-Number AI Reasoning Engine */}
              <Card className="p-6 border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-card to-primary/5">
                <h3 className="text-xl font-bold font-serif text-primary mb-4 flex items-center gap-2">
                  <Sparkles className="size-5 text-amber-500" /> Multi-Number AI Reasoning Engine (WHY This Score?)
                </h3>
                <div className="space-y-4">
                  {report.multiNumberReasoning.map((item) => (
                    <div key={item.domain} className="p-4 rounded-lg border bg-card space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-sm text-primary">{item.domain}</div>
                        <Badge className="bg-amber-500 text-white font-bold">{item.score}/100 ({item.confidence})</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.whyScore}</p>
                      <div className="text-xs text-amber-700 bg-amber-500/10 p-2.5 rounded font-medium">
                        💡 Verdict: {item.conclusion}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Name Optimization & Spelling Comparison */}
              <Card className="p-6 border-amber-500/30 bg-card">
                <h3 className="text-xl font-bold font-serif text-primary mb-4 flex items-center gap-2">
                  <Award className="size-5 text-amber-500" /> Name Optimization & Spelling Comparison Engine
                </h3>
                <div className="p-3 bg-muted/30 rounded mb-4 text-xs font-semibold text-foreground">
                  Current Name: <span className="text-amber-600">{report.nameOptimization.currentName}</span> ({report.nameOptimization.currentExpression})
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  {report.nameOptimization.alternatives.map((alt) => (
                    <div key={alt.spellingVariant} className="p-3.5 rounded-lg border bg-card space-y-1.5">
                      <div className="font-bold text-sm text-primary">"{alt.spellingVariant}"</div>
                      <div className="text-[11px] text-amber-600 font-semibold">{alt.rulingPlanet} (Vibration {alt.expressionNumber})</div>
                      <div className="text-[11px] text-emerald-600 font-bold">Money Score: {alt.moneyScore}% | Status: {alt.statusScore}%</div>
                      <p className="text-[11px] text-muted-foreground line-clamp-2">{alt.overallSuitability}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Core Numbers Matrix */}
              <div>
                <h3 className="text-lg font-bold font-serif mb-4 flex items-center gap-2">
                  <Sparkles className="size-4 text-amber-500" /> 10 Core Numbers Deep Dives
                </h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <MiniNumberCard label="Soul Urge" number={report.coreNumbers.soulUrge.number} planet={report.coreNumbers.soulUrge.rulingPlanet} />
                  <MiniNumberCard label="Personality" number={report.coreNumbers.personality.number} planet={report.coreNumbers.personality.rulingPlanet} />
                  <MiniNumberCard label="Birthday" number={report.coreNumbers.birthday.number} planet={report.coreNumbers.birthday.rulingPlanet} />
                  <MiniNumberCard label="Maturity" number={report.coreNumbers.maturity.number} planet={report.coreNumbers.maturity.rulingPlanet} />
                  <MiniNumberCard label="Attitude" number={report.coreNumbers.attitude.number} planet={report.coreNumbers.attitude.rulingPlanet} />
                  <MiniNumberCard label="Balance" number={report.coreNumbers.balance.number} planet={report.coreNumbers.balance.rulingPlanet} />
                  <MiniNumberCard label="Hidden Passion" number={report.coreNumbers.hiddenPassion.number} planet={report.coreNumbers.hiddenPassion.rulingPlanet} />
                  <MiniNumberCard label="Karmic Lessons" number={report.coreNumbers.karmicLessons.missingNumbers.length} planet={`${report.coreNumbers.karmicLessons.missingNumbers.join(", ")} missing`} />
                </div>
              </div>

              {/* 4 Pinnacle Cycles */}
              <div>
                <h3 className="text-lg font-bold font-serif mb-4 flex items-center gap-2">
                  <Calendar className="size-4 text-primary" /> 4 Pinnacle Cycles (Life Phases)
                </h3>
                <div className="grid md:grid-cols-4 gap-4">
                  {report.pinnacles.map((p) => (
                    <Card key={p.cycleName} className="p-4 border">
                      <Badge variant="outline" className="text-[10px] mb-2">{p.ageRange}</Badge>
                      <div className="font-bold text-sm text-primary">{p.cycleName}</div>
                      <div className="text-2xl font-black text-amber-600 mt-1">Number {p.number}</div>
                      <p className="text-xs text-muted-foreground mt-2">{p.meaning}</p>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Practical Asset Numerology */}
              <div>
                <h3 className="text-lg font-bold font-serif mb-4 flex items-center gap-2">
                  <Briefcase className="size-4 text-amber-500" /> Practical Asset Numerology (Name, Mobile, Vehicle, House, Biz)
                </h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {report.practicalAssets.map((pa) => (
                    <Card key={pa.assetType} className="p-3.5 border bg-card">
                      <div className="text-xs font-bold text-amber-600">{pa.assetType}</div>
                      <div className="font-mono text-xs text-foreground font-semibold mt-1">{pa.vibration}</div>
                      <p className="text-[11px] text-muted-foreground mt-1.5 leading-snug">{pa.suggestion}</p>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Lucky Elements Matrix */}
              <Card className="p-6">
                <h3 className="text-lg font-bold font-serif mb-4 flex items-center gap-2">
                  <Sparkles className="size-4 text-amber-500" /> Lucky Elements & Gemstones
                </h3>
                <div className="grid sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground">Lucky Numbers</div>
                    <div className="font-bold text-primary mt-1">{report.luckyElements.numbers.join(", ")}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Lucky Colours</div>
                    <div className="font-bold text-amber-600 mt-1">{report.luckyElements.colors.join(", ")}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Lucky Gemstones</div>
                    <div className="font-bold text-emerald-600 mt-1">{report.luckyElements.gemstones.join(", ")}</div>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <Card className="p-8 text-center border-dashed border-amber-500/40 bg-amber-500/5 space-y-3">
              <Lock className="size-10 text-amber-500 mx-auto" />
              <h3 className="font-bold text-xl">Unlock 30-Section Enterprise Numerology Pro Report</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Upgrade to Pro to view Soul Urge, Personality, Pinnacle & Challenge Cycles, 12-Month Timeline, Domain Analysis, Practical Asset Numerology, and download the complete 30–40 page PDF.
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

function NumberCard({
  label,
  number,
  accent,
  rulingPlanet,
  meaning,
}: {
  label: string;
  number: number;
  accent: string;
  rulingPlanet: string;
  meaning: string;
}) {
  return (
    <Card className={`p-6 text-center bg-gradient-to-br ${accent}`}>
      <div className="text-xs uppercase font-semibold text-muted-foreground">{label}</div>
      <div className="mt-2 text-6xl font-black text-primary">{number}</div>
      <div className="mt-2 text-xs font-semibold text-primary/80">{rulingPlanet}</div>
      <p className="mt-3 text-sm text-muted-foreground">{meaning}</p>
    </Card>
  );
}

function MiniNumberCard({ label, number, planet }: { label: string; number: number; planet: string }) {
  return (
    <Card className="p-4 text-center bg-card border">
      <div className="text-xs text-muted-foreground font-medium">{label}</div>
      <div className="text-2xl font-black text-primary mt-1">{number}</div>
      <div className="text-[10px] text-amber-600 font-semibold mt-0.5">{planet}</div>
    </Card>
  );
}
