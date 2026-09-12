import { useMemo, useState } from "react";
import {
  AlertCircle,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Copy,
  Crown,
  Flame,
  Gem,
  HelpCircle,
  Info,
  Layers,
  MapPin,
  Printer,
  RotateCcw,
  Share2,
  Sparkles,
  Volume2,
  VolumeX,
  XCircle,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LocationPicker } from "@/components/tools/LocationPicker";
import { useLocation } from "@/lib/location";
import {
  evaluateYogaBySlug,
  scanAllYogasFromBirth,
  YOGA_DEFINITIONS,
  type YogaEvaluationResult,
} from "./universal-yoga-engine";
import { MalavyaYogaCalculator } from "./MalavyaYogaCalculator";

interface Props {
  slug: string;
}

export function YogaCalculatorWidget({ slug }: Props) {
  // If specifically malavya yoga, return the rich specialized Malavya calculator
  if (slug === "malavya-yoga") {
    return <MalavyaYogaCalculator />;
  }

  const def = YOGA_DEFINITIONS[slug] || YOGA_DEFINITIONS["gaja-kesari-yoga"];
  const [loc, setLoc] = useLocation();

  const [birthDate, setBirthDate] = useState<string>("1995-04-14");
  const [birthTime, setBirthTime] = useState<string>("10:30");
  const [evalResult, setEvalResult] = useState<YogaEvaluationResult | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Compute on mount / default
  useMemo(() => {
    try {
      const scanned = scanAllYogasFromBirth({
        date: birthDate,
        time: birthTime,
        latitude: loc.lat,
        longitude: loc.lon,
        timezone: loc.tz,
        place: loc.label,
      });
      const single = scanned.results.find((r) => r.slug === slug);
      if (single) setEvalResult(single);
    } catch {
      // ignore
    }
  }, [slug]);

  const handleCalculate = () => {
    try {
      const scanned = scanAllYogasFromBirth({
        date: birthDate,
        time: birthTime,
        latitude: loc.lat,
        longitude: loc.lon,
        timezone: loc.tz,
        place: loc.label,
      });
      const single = scanned.results.find((r) => r.slug === slug);
      if (single) {
        setEvalResult(single);
        toast.success(`${def.nameHindi} की कुण्डली गणना पूर्ण हुई!`);
      }
    } catch (e: any) {
      toast.error(e.message || "गणना में त्रुटि हुई।");
    }
  };

  const handleCopy = (str: string, label = "विवरण") => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(str);
      toast.success(`${label} क्लिपबोर्ड पर कॉपी हो गया!`);
    }
  };

  const handleSpeech = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      toast.error("आपके ब्राउज़र में वॉइस स्पीच उपलब्ध नहीं है।");
      return;
    }
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN";
    utterance.rate = 0.85;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const active =
    evalResult ||
    evaluateYogaBySlug(slug, {
      lagnaRashiIndex: 0,
      planets: [],
    });

  return (
    <div className="space-y-6">
      {/* CALCULATOR FORM CARD */}
      <Card className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-accent/5 p-6 md:p-8 shadow-elegant space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border/60">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Crown className="size-3.5" /> {def.category}
            </div>
            <h3 className="mt-2 font-display text-2xl md:text-3xl font-bold text-foreground">
              {def.nameHindi} गणक व विश्लेषक ({def.nameEnglish})
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              नियम सूत्र: <strong className="text-foreground">{def.ruleFormula}</strong>
            </p>
          </div>
        </div>

        {/* INPUT FORM */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">जन्म तिथि (Date):</Label>
            <Input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="rounded-xl h-9 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">जन्म समय (Time):</Label>
            <Input
              type="time"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              className="rounded-xl h-9 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">जन्म स्थान (Place):</Label>
            <LocationPicker value={loc} onChange={setLoc} />
          </div>
        </div>

        <Button
          onClick={handleCalculate}
          className="rounded-xl gap-2 text-xs font-semibold shadow-sm"
        >
          <Sparkles className="size-3.5" /> कुण्डली में {def.nameHindi} की स्थिति जाँचें
        </Button>
      </Card>

      {/* VERDICT HERO CARD */}
      <Card
        className={`rounded-3xl border-2 p-6 md:p-8 shadow-card space-y-6 ${
          active.isPresent
            ? "border-primary/40 bg-gradient-to-br from-primary/10 via-card to-background"
            : "border-border bg-card"
        }`}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              {active.isPresent ? (
                <CheckCircle2 className="size-5 text-success" />
              ) : (
                <XCircle className="size-5 text-muted-foreground" />
              )}
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                योग स्थिति (Verification Result)
              </span>
            </div>
            <h4 className="mt-2 font-display text-2xl font-bold text-foreground">
              {active.statusTextHindi}
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">{active.detailsHindi}</p>
          </div>

          <div className="rounded-2xl border border-border bg-background/80 p-4 text-center min-w-40 shadow-sm">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center justify-center gap-1">
              <Zap className="size-3 text-primary" /> योग सामर्थ्य
            </div>
            <div className="font-display font-extrabold text-3xl text-primary mt-1">
              {active.strengthPercentage}%
            </div>
          </div>
        </div>

        {/* FACTORS */}
        {active.factors.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-border/60">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              ग्रह स्थिति व नियम सत्यापन (Rule Validation):
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              {active.factors.map((f, fIdx) => (
                <div
                  key={fIdx}
                  className={`rounded-xl border p-3 text-xs space-y-0.5 ${
                    f.passed
                      ? "border-success/30 bg-success/5 text-foreground"
                      : "border-border/60 bg-muted/20 text-muted-foreground"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-semibold text-xs">
                    {f.passed ? (
                      <CheckCircle2 className="size-3.5 text-success shrink-0" />
                    ) : (
                      <XCircle className="size-3.5 text-muted-foreground shrink-0" />
                    )}
                    <span>{f.label}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* SHASTRA CITATION CARD */}
      <Card className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-background p-6 md:p-8 space-y-4 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border/60">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
              <BookOpen className="size-4" /> शास्त्रीय प्रमाण (Classical Authority)
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              स्रोत: {def.classicalVerse.source}
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSpeech(def.classicalVerse.shloka)}
            className="rounded-xl text-xs gap-1.5"
          >
            <Volume2 className="size-3.5 text-primary" /> श्लोक सुनें
          </Button>
        </div>

        <div className="p-4 rounded-2xl border border-primary/20 bg-background/80 font-devanagari text-base md:text-lg font-bold text-primary leading-relaxed whitespace-pre-wrap text-center">
          {def.classicalVerse.shloka}
        </div>

        <div className="text-xs text-foreground font-devanagari leading-relaxed">
          <strong>हिन्दी भावार्थ:</strong> {def.classicalVerse.translationHindi}
        </div>
      </Card>

      {/* BLESSINGS & REMEDIES */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="rounded-3xl border border-border bg-card p-6 md:p-8 space-y-3 shadow-card">
          <div className="flex items-center gap-2">
            <Award className="size-5 text-accent" />
            <h4 className="font-display text-lg font-bold text-foreground">
              {def.nameHindi} के शुभ फल व प्रभाव
            </h4>
          </div>
          <ul className="space-y-1.5 text-xs text-foreground font-devanagari">
            {def.blessings.map((b, bIdx) => (
              <li key={bIdx} className="flex items-start gap-2">
                <span className="text-primary font-bold">✦</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="rounded-3xl border border-border bg-card p-6 md:p-8 space-y-3 shadow-card">
          <div className="flex items-center gap-2">
            <Gem className="size-5 text-primary" />
            <h4 className="font-display text-lg font-bold text-foreground">
              वैदिक मन्त्र एवं सक्रियण उपाय
            </h4>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-muted/20">
              <strong className="text-primary">मन्त्र:</strong>{" "}
              <span className="font-devanagari">{def.remedies.mantra}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-muted/20">
              <strong>शुभ रत्न व रुद्राक्ष:</strong> {def.remedies.gemstone} · {def.remedies.rudraksha}
            </div>
            <div className="p-2.5 rounded-xl bg-muted/20">
              <strong>उपासना:</strong> {def.remedies.worship}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
