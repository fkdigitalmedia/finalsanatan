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
import { LocationPicker, DateInput } from "@/components/tools/LocationPicker";
import { useLocation } from "@/lib/location";
import {
  calculateMalavyaYogaFromBirth,
  evaluateMalavyaYoga,
  type MalavyaYogaResult,
  RASHIS,
  type RashiId,
} from "./malavya-engine";

export function MalavyaYogaCalculator() {
  const [loc, setLoc] = useLocation();

  // Mode 1: Quick manual inputs
  const [quickLagna, setQuickLagna] = useState<RashiId>("Taurus");
  const [quickVenusRashi, setQuickVenusRashi] = useState<RashiId>("Pisces");
  const [quickVenusHouse, setQuickVenusHouse] = useState<number>(1);
  const [quickIsCombust, setQuickIsCombust] = useState<boolean>(false);
  const [quickIsRetrograde, setQuickIsRetrograde] = useState<boolean>(false);

  // Mode 2: Full Birth inputs
  const [birthDate, setBirthDate] = useState<string>("1995-04-14");
  const [birthTime, setBirthTime] = useState<string>("10:30");
  const [birthCalculatedResult, setBirthCalculatedResult] = useState<MalavyaYogaResult | null>(null);

  const [activeTab, setActiveTab] = useState<"quick" | "birth">("quick");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Quick evaluation result
  const quickResult = useMemo(() => {
    return evaluateMalavyaYoga({
      lagnaRashi: quickLagna,
      venusRashi: quickVenusRashi,
      venusHouse: quickVenusHouse,
      isVenusCombust: quickIsCombust,
      isVenusRetrograde: quickIsRetrograde,
    });
  }, [quickLagna, quickVenusRashi, quickVenusHouse, quickIsCombust, quickIsRetrograde]);

  // Current active result
  const activeResult: MalavyaYogaResult =
    activeTab === "birth" && birthCalculatedResult ? birthCalculatedResult : quickResult;

  const handleCalculateFromBirth = () => {
    try {
      const res = calculateMalavyaYogaFromBirth({
        date: birthDate,
        time: birthTime,
        latitude: loc.lat,
        longitude: loc.lon,
        timezone: loc.tz,
      });
      setBirthCalculatedResult(res.result);
      toast.success("कुण्डली से मालव्य योग की गणना पूर्ण हुई!");
    } catch (e: any) {
      toast.error(e.message || "कुण्डली गणना में त्रुटि हुई।");
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

  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <div className="space-y-8 print:p-0">
      {/* HEADER CARD */}
      <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-accent/5 p-6 md:p-8 shadow-elegant print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-border/60">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Crown className="size-3.5" /> पञ्च महापुरुष योग (शुक्र देव)
            </div>
            <h2 className="mt-2 font-display text-2xl md:text-3xl font-semibold">
              Malavya Yoga Calculator & Analysis (मालव्य योग गणक)
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Evaluate Malavya Mahapurusha Yoga in your Kundli with astronomical precision,
              strength percentage, house-specific manifestations, and classical BPHS remedies.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="rounded-full gap-1.5 text-xs"
            >
              <Printer className="size-3.5" /> रिपोर्ट प्रिंट / PDF
            </Button>
          </div>
        </div>

        {/* INPUT MODE TABS */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "quick" | "birth")}
          className="w-full"
        >
          <TabsList className="bg-muted/60 p-1 rounded-2xl h-auto flex flex-wrap gap-1 mb-6">
            <TabsTrigger value="quick" className="rounded-xl py-2 px-4 text-xs font-medium">
              ⚡ त्वरित परीक्षण (Quick Check Mode)
            </TabsTrigger>
            <TabsTrigger value="birth" className="rounded-xl py-2 px-4 text-xs font-medium">
              🔮 जन्म विवरण से कुण्डली गणना (Birth Chart Mode)
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: QUICK CHECK MODE */}
          <TabsContent value="quick" className="space-y-4 m-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">
                  लग्न राशि (Ascendant / Lagna):
                </Label>
                <select
                  value={quickLagna}
                  onChange={(e) => setQuickLagna(e.target.value as RashiId)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold"
                >
                  {RASHIS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.nameHindi}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">
                  शुक्र की राशि (Venus Sign):
                </Label>
                <select
                  value={quickVenusRashi}
                  onChange={(e) => setQuickVenusRashi(e.target.value as RashiId)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold"
                >
                  {RASHIS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.nameHindi}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">
                  शुक्र किस भाव में स्थित हैं (Venus House):
                </Label>
                <select
                  value={quickVenusHouse}
                  onChange={(e) => setQuickVenusHouse(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((h) => (
                    <option key={h} value={h}>
                      भाव {h} {h === 1 || h === 4 || h === 7 || h === 10 ? "(केन्द्र भाव)" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={quickIsCombust}
                  onChange={(e) => setQuickIsCombust(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary size-4"
                />
                <span>क्या शुक्र सूर्य के साथ अस्त (Combust) हैं?</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={quickIsRetrograde}
                  onChange={(e) => setQuickIsRetrograde(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary size-4"
                />
                <span>क्या शुक्र वक्री (Retrograde) हैं? (+चेष्टा बल)</span>
              </label>
            </div>
          </TabsContent>

          {/* TAB 2: FULL BIRTH DATA MODE */}
          <TabsContent value="birth" className="space-y-4 m-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
              onClick={handleCalculateFromBirth}
              className="rounded-xl gap-2 text-xs font-semibold shadow-sm"
            >
              <Sparkles className="size-3.5" /> कुण्डली से मालव्य योग निकालें
            </Button>
          </TabsContent>
        </Tabs>
      </div>

      {/* RESULTS DISPLAY SECTION */}
      <div className="space-y-6">
        {/* VERDICT HERO CARD */}
        <Card
          className={`rounded-3xl border-2 p-6 md:p-8 shadow-card space-y-6 ${
            activeResult.isPresent
              ? activeResult.isCombust
                ? "border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-card to-background"
                : "border-primary/40 bg-gradient-to-br from-primary/10 via-card to-background"
              : "border-border bg-card"
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                {activeResult.isPresent ? (
                  activeResult.isCombust ? (
                    <AlertCircle className="size-5 text-amber-500" />
                  ) : (
                    <CheckCircle2 className="size-5 text-success" />
                  )
                ) : (
                  <XCircle className="size-5 text-muted-foreground" />
                )}
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  मालव्य योग परीक्षण परिणाम (Analysis Status)
                </span>
              </div>
              <h3 className="mt-2 font-display text-2xl md:text-3xl font-bold text-foreground">
                {activeResult.statusTextHindi}
              </h3>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                {activeResult.statusTextEnglish}
              </p>
            </div>

            {/* STRENGTH GAUGE */}
            <div className="rounded-2xl border border-border bg-background/80 p-4 text-center min-w-44 shadow-sm">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center justify-center gap-1">
                <Zap className="size-3 text-primary" /> योग प्रभाव व सामर्थ्य
              </div>
              <div className="font-display font-extrabold text-3xl text-primary mt-1">
                {activeResult.strengthPercentage}%
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-500"
                  style={{ width: `${activeResult.strengthPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* KEY ASTROLOGICAL METRICS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border/70 text-xs">
            <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
              <div className="text-[10px] text-muted-foreground uppercase font-semibold">
                लग्न राशि
              </div>
              <div className="font-bold text-foreground mt-0.5">{activeResult.lagnaRashi}</div>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
              <div className="text-[10px] text-muted-foreground uppercase font-semibold">
                शुक्र की स्थिति
              </div>
              <div className="font-bold text-foreground mt-0.5">
                {activeResult.venusRashi} (भाव {activeResult.venusHouse})
              </div>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
              <div className="text-[10px] text-muted-foreground uppercase font-semibold">
                गरिमा (Dignity)
              </div>
              <div className="font-bold text-primary mt-0.5">{activeResult.dignity}</div>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
              <div className="text-[10px] text-muted-foreground uppercase font-semibold">
                केन्द्र व अस्त स्थिति
              </div>
              <div className="font-bold text-foreground mt-0.5">
                {activeResult.isKendra ? "केन्द्र में स्थित" : "केन्द्र बाहर"} ·{" "}
                {activeResult.isCombust ? "अस्त (Combust)" : "उदित (Active)"}
              </div>
            </div>
          </div>

          {/* CRITERIA CHECKLIST */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              पाणिनीय व पाराशरीय नियम सत्यापन (Rule Validation):
            </div>
            <div className="grid md:grid-cols-3 gap-2">
              {activeResult.factors.map((f, fIdx) => (
                <div
                  key={fIdx}
                  className={`rounded-xl border p-3 text-xs space-y-1 ${
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
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    {f.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* HOUSE PREDICTION & EFFECTS */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* HOUSE SPECIFIC BLESSING */}
          <Card className="rounded-3xl border border-border bg-card p-6 md:p-8 space-y-4 shadow-card">
            <div className="flex items-center gap-2">
              <Crown className="size-5 text-primary" />
              <h4 className="font-display text-xl font-bold text-foreground">
                {activeResult.housePrediction.titleHindi}
              </h4>
            </div>
            <p className="text-xs font-mono text-muted-foreground">
              {activeResult.housePrediction.titleEnglish}
            </p>
            <p className="text-sm font-devanagari text-foreground leading-relaxed">
              {activeResult.housePrediction.effectsHindi}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border/50">
              {activeResult.housePrediction.effectsEnglish}
            </p>
          </Card>

          {/* CAREER & MATERIAL DOMAINS */}
          <Card className="rounded-3xl border border-border bg-card p-6 md:p-8 space-y-4 shadow-card">
            <div className="flex items-center gap-2">
              <Award className="size-5 text-accent" />
              <h4 className="font-display text-xl font-bold text-foreground">
                सर्वोत्कृष्ट कार्यक्षेत्र व आजीविका (Career Impact)
              </h4>
            </div>
            <p className="text-xs text-muted-foreground">
              मालव्य योग से प्रभावित जातकों को निम्नलिखित क्षेत्रों में असाधारण ख्याति और समृद्धि प्राप्त होती है:
            </p>
            <ul className="space-y-1.5 text-xs text-foreground font-devanagari">
              {activeResult.careerIndications.map((c, cIdx) => (
                <li key={cIdx} className="flex items-start gap-2">
                  <span className="text-primary font-bold">✦</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* CLASSICAL SHASTRA CITATION CARD */}
        <Card className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-background p-6 md:p-8 space-y-4 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border/60">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <BookOpen className="size-4" /> शास्त्र प्रमाण (Classical Shastra Authority)
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                स्रोत: {activeResult.classicalVerse.source}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSpeech(activeResult.classicalVerse.shloka)}
              className="rounded-xl text-xs gap-1.5"
            >
              <Volume2 className="size-3.5 text-primary" /> श्लोक पाठ सुनें
            </Button>
          </div>

          <div className="p-4 rounded-2xl border border-primary/20 bg-background/80 font-devanagari text-base md:text-lg font-bold text-primary leading-relaxed whitespace-pre-wrap text-center">
            {activeResult.classicalVerse.shloka}
          </div>

          <div className="text-xs text-foreground font-devanagari leading-relaxed">
            <strong>हिन्दी भावार्थ:</strong> {activeResult.classicalVerse.translationHindi}
          </div>
          <div className="text-[11px] text-muted-foreground leading-relaxed">
            <strong>English Translation:</strong> {activeResult.classicalVerse.translationEnglish}
          </div>
        </Card>

        {/* VEDIC REMEDIES & GEMSTONES */}
        <Card className="rounded-3xl border border-border bg-card p-6 md:p-8 space-y-6 shadow-card">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div className="flex items-center gap-2">
              <Gem className="size-5 text-primary" />
              <h4 className="font-display text-xl font-bold text-foreground">
                शुक्र ग्रह एवं मालव्य योग सक्रियण उपाय (Vedic Remedies)
              </h4>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                handleCopy(
                  `॥ मालव्य योग फल एवं उपाय ॥\n` +
                    `स्थिति: ${activeResult.statusTextHindi} (${activeResult.strengthPercentage}%)\n` +
                    `मन्त्र: ${activeResult.remedies.mantraHindi}\n` +
                    `रत्न: ${activeResult.remedies.gemstone}\n` +
                    `रुद्राक्ष: ${activeResult.remedies.rudraksha}\n` +
                    `उपासना: ${activeResult.remedies.worship}\n` +
                    `दान: ${activeResult.remedies.charity}`,
                  "उपाय विवरण",
                )
              }
              className="text-xs gap-1 rounded-xl"
            >
              <Copy className="size-3" /> कॉपी
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-1.5">
              <div className="text-primary font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Sparkles className="size-3.5" /> शुक्र वैदिक व बीज मन्त्र
              </div>
              <p className="font-devanagari font-semibold text-foreground text-sm">
                {activeResult.remedies.mantraHindi}
              </p>
              <p className="text-[11px] text-muted-foreground">
                शुक्रवार को १०८ बार जप करने से योग का शुभ फल तीव्र होता है।
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-1.5">
              <div className="text-accent font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Gem className="size-3.5" /> शुभ रत्न व रुद्राक्ष
              </div>
              <p className="text-foreground leading-relaxed">
                {activeResult.remedies.gemstone}
              </p>
              <p className="text-primary font-semibold pt-1">
                रुद्राक्ष: {activeResult.remedies.rudraksha}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-1.5">
              <div className="text-success font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Flame className="size-3.5" /> उपासना एवं दान विधान
              </div>
              <p className="text-foreground leading-relaxed">
                {activeResult.remedies.worship}
              </p>
              <p className="text-muted-foreground pt-1">
                <strong>दान:</strong> {activeResult.remedies.charity}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
