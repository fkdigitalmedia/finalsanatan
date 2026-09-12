import { useMemo, useState } from "react";
import {
  AlertCircle,
  Award,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Compass,
  Copy,
  Crown,
  Flame,
  Gem,
  Heart,
  HelpCircle,
  Info,
  Layers,
  MapPin,
  Moon,
  Printer,
  RotateCcw,
  Search,
  Share2,
  Shield,
  Sparkles,
  Sun,
  Volume2,
  VolumeX,
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
  calculateRashiFromBirth,
  findRashiByName,
  RASHI_DATABASE,
  type RashiCalculationResult,
  type RashiProfile,
} from "./rashi-engine";

export function RashiCalculatorView() {
  const [loc, setLoc] = useLocation();

  // Mode 1: Birth inputs
  const [birthName, setBirthName] = useState<string>("जातक");
  const [birthDate, setBirthDate] = useState<string>("1995-04-14");
  const [birthTime, setBirthTime] = useState<string>("10:30");
  const [calculatedResult, setCalculatedResult] = useState<RashiCalculationResult | null>(null);

  // Mode 2: Name / Syllable lookup
  const [searchName, setSearchName] = useState<string>("Rahul");
  const [selectedSyllableRashi, setSelectedSyllableRashi] = useState<RashiProfile>(RASHI_DATABASE[0]);

  const [activeTab, setActiveTab] = useState<"birth" | "name">("birth");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Run calculation on mount / default
  useMemo(() => {
    try {
      const res = calculateRashiFromBirth({
        date: birthDate,
        time: birthTime,
        latitude: loc.lat,
        longitude: loc.lon,
        timezone: loc.tz,
        place: loc.label,
      });
      setCalculatedResult(res);
    } catch {
      // fallback
    }
  }, []);

  const handleCalculateFromBirth = () => {
    try {
      const res = calculateRashiFromBirth({
        date: birthDate,
        time: birthTime,
        latitude: loc.lat,
        longitude: loc.lon,
        timezone: loc.tz,
        place: loc.label,
      });
      setCalculatedResult(res);
      toast.success("कुण्डली से सटीक राशि व अवकहड़ा चक्र की गणना पूर्ण हुई!");
    } catch (e: any) {
      toast.error(e.message || "गणना में त्रुटि हुई।");
    }
  };

  const handleNameSearch = (name: string) => {
    setSearchName(name);
    const matched = findRashiByName(name);
    if (matched) {
      setSelectedSyllableRashi(matched);
    }
  };

  // Active Rashi Profile to display in detail views
  const activeProfile: RashiProfile =
    activeTab === "birth" && calculatedResult ? calculatedResult.moonRashi : selectedSyllableRashi;

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
      {/* HERO BANNER */}
      <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-accent/5 p-6 md:p-8 shadow-elegant print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-border/60">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Moon className="size-3.5" /> वैदिक राशि गणक एवं चन्द्र कुण्डली साधन
            </div>
            <h2 className="mt-2 font-display text-2xl md:text-3xl font-semibold">
              Vedic Rashi & Moon Sign Studio (राशि गणक)
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Calculate exact Moon Sign (चन्द्र राशि), Sun Sign (सूर्य राशि), Ascendant (लग्न), Janma
              Nakshatra, Avakahada Chakra, Lucky Factors, and Shani Sade Sati status with high
              astronomical precision.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="rounded-full gap-1.5 text-xs"
            >
              <Printer className="size-3.5" /> राशि पत्रिका प्रिंट / PDF
            </Button>
          </div>
        </div>

        {/* CALCULATION MODE TABS */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "birth" | "name")}
          className="w-full"
        >
          <TabsList className="bg-muted/60 p-1 rounded-2xl h-auto flex flex-wrap gap-1 mb-6">
            <TabsTrigger value="birth" className="rounded-xl py-2 px-4 text-xs font-medium">
              🔮 जन्म विवरण से कुण्डली गणना (Birth Details Mode)
            </TabsTrigger>
            <TabsTrigger value="name" className="rounded-xl py-2 px-4 text-xs font-medium">
              🔤 नाम के प्रथम अक्षर से खोजें (Name / Syllable Mode)
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: BIRTH DETAILS MODE */}
          <TabsContent value="birth" className="space-y-4 m-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">जातक का नाम:</Label>
                <Input
                  value={birthName}
                  onChange={(e) => setBirthName(e.target.value)}
                  placeholder="अपना नाम दर्ज करें"
                  className="rounded-xl h-9 text-xs"
                />
              </div>

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
              <Sparkles className="size-3.5" /> राशि व कुण्डली की गणना करें
            </Button>
          </TabsContent>

          {/* TAB 2: NAME / SYLLABLE LOOKUP MODE */}
          <TabsContent value="name" className="space-y-4 m-0">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-2.5 size-4 text-muted-foreground" />
                <Input
                  value={searchName}
                  onChange={(e) => handleNameSearch(e.target.value)}
                  placeholder="नाम दर्ज करें (जैसे: Rahul, Aarav, Pooja, Vikas, Neha, Rohit)..."
                  className="pl-10 h-10 text-xs rounded-xl"
                />
              </div>

              <div className="flex flex-wrap gap-1.5">
                {RASHI_DATABASE.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedSyllableRashi(r)}
                    className={`rounded-xl border px-3 py-1.5 text-xs font-medium transition ${
                      selectedSyllableRashi.id === r.id
                        ? "border-primary bg-primary text-primary-foreground font-bold shadow-sm"
                        : "border-border bg-card hover:border-primary/40 text-foreground"
                    }`}
                  >
                    {r.nameHindi.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* SYLLABLES QUICK PICKER */}
            <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {selectedSyllableRashi.nameHindi} के नाम अक्षर (Namakshara Syllables):
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedSyllableRashi.syllablesHindi.map((syl, sIdx) => (
                  <span
                    key={sIdx}
                    className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-bold font-devanagari text-primary"
                  >
                    {syl} ({selectedSyllableRashi.syllables[sIdx]})
                  </span>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* RESULTS DISPLAY SECTION */}
      <div className="space-y-6">
        {/* HERO RASHI VERDICT CARD */}
        <Card className="rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-card via-background to-primary/5 p-6 md:p-8 shadow-card space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                <Crown className="size-3.5" /> जन्म चन्द्र राशि (Moon Sign)
              </div>
              <h3 className="mt-2 font-display text-3xl md:text-4xl font-bold text-foreground">
                {activeProfile.nameHindi}{" "}
                <span className="text-xl font-normal font-mono text-muted-foreground">
                  ({activeProfile.nameEnglish})
                </span>
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                राशि स्वामी: <strong className="text-foreground">{activeProfile.lordHindi}</strong> · प्रतीक:{" "}
                <strong className="text-foreground">{activeProfile.symbol}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleCopy(
                    `॥ ${birthName} की राशि विवरण ॥\n` +
                      `चन्द्र राशि: ${activeProfile.nameHindi} (${activeProfile.nameEnglish})\n` +
                      `राशि स्वामी: ${activeProfile.lordHindi}\n` +
                      `तत्व: ${activeProfile.element}\n` +
                      `इष्ट देव: ${activeProfile.ishtaDevata}\n` +
                      `शुभ रंग: ${activeProfile.luckyColors.join(", ")}\n` +
                      `शुभ अंक: ${activeProfile.luckyNumbers.join(", ")}\n` +
                      `भाग्य रत्न: ${activeProfile.luckyGemstone}\n` +
                      `बीज मन्त्र: ${activeProfile.beejMantra}`,
                    "राशि विवरण",
                  )
                }
                className="text-xs h-8 rounded-xl gap-1"
              >
                <Share2 className="size-3" /> शेयर
              </Button>
            </div>
          </div>

          {/* TRI-SIGN SUMMARY (MOON, SUN, LAGNA) IF BIRTH MODE */}
          {activeTab === "birth" && calculatedResult && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-border/70">
              <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 space-y-1">
                <div className="text-[10px] uppercase font-bold text-primary flex items-center gap-1">
                  <Moon className="size-3" /> चन्द्र राशि (Moon Sign)
                </div>
                <div className="font-display font-bold text-lg text-foreground">
                  {calculatedResult.moonRashi.nameHindi}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  भोगांश: {calculatedResult.moonDegreesInSign.toFixed(2)}° ({calculatedResult.nakshatra.name} - पद {calculatedResult.nakshatra.pada})
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4 space-y-1">
                <div className="text-[10px] uppercase font-bold text-amber-500 flex items-center gap-1">
                  <Sun className="size-3" /> सूर्य राशि (Sun Sign)
                </div>
                <div className="font-display font-bold text-lg text-foreground">
                  {calculatedResult.sunRashi.nameHindi}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  आत्मकारक व आत्मिक तेज
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4 space-y-1">
                <div className="text-[10px] uppercase font-bold text-accent flex items-center gap-1">
                  <Compass className="size-3" /> लग्न राशि (Ascendant)
                </div>
                <div className="font-display font-bold text-lg text-foreground">
                  {calculatedResult.lagnaRashi.nameHindi}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  शारीरिक स्वरूप व व्यक्तित्व
                </div>
              </div>
            </div>
          )}

          {/* AVAKAHADA CHAKRA 6-GRID MATRIX */}
          {activeTab === "birth" && calculatedResult && (
            <div className="space-y-2 pt-2 border-t border-border/60">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                अवकहड़ा चक्र एवं जन्म गुण (Avakahada Chakra):
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
                <div className="rounded-xl border border-border/60 bg-muted/20 p-2.5 text-center">
                  <div className="text-[10px] text-muted-foreground font-semibold">वर्ण (Varna)</div>
                  <div className="font-bold text-foreground mt-0.5">
                    {calculatedResult.avakahada.varna}
                  </div>
                </div>
                <div className="rounded-xl border border-border/60 bg-muted/20 p-2.5 text-center">
                  <div className="text-[10px] text-muted-foreground font-semibold">वश्य (Vashya)</div>
                  <div className="font-bold text-foreground mt-0.5">
                    {calculatedResult.avakahada.vashya}
                  </div>
                </div>
                <div className="rounded-xl border border-border/60 bg-muted/20 p-2.5 text-center">
                  <div className="text-[10px] text-muted-foreground font-semibold">योनि (Yoni)</div>
                  <div className="font-bold text-foreground mt-0.5">
                    {calculatedResult.avakahada.yoni}
                  </div>
                </div>
                <div className="rounded-xl border border-border/60 bg-muted/20 p-2.5 text-center">
                  <div className="text-[10px] text-muted-foreground font-semibold">गण (Gana)</div>
                  <div className="font-bold text-foreground mt-0.5">
                    {calculatedResult.avakahada.gana}
                  </div>
                </div>
                <div className="rounded-xl border border-border/60 bg-muted/20 p-2.5 text-center">
                  <div className="text-[10px] text-muted-foreground font-semibold">नाड़ी (Nadi)</div>
                  <div className="font-bold text-foreground mt-0.5">
                    {calculatedResult.avakahada.nadi}
                  </div>
                </div>
                <div className="rounded-xl border border-border/60 bg-muted/20 p-2.5 text-center">
                  <div className="text-[10px] text-muted-foreground font-semibold">तत्व (Element)</div>
                  <div className="font-bold text-foreground mt-0.5">
                    {activeProfile.element.split(" ")[0]}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* DETAILED INSIGHTS TABS */}
        <Tabs defaultValue="lucky" className="w-full">
          <div className="border-b border-border/70 pb-2 print:hidden">
            <TabsList className="bg-muted/60 p-1 rounded-2xl h-auto flex flex-wrap gap-1">
              <TabsTrigger value="lucky" className="rounded-xl py-2 px-4 text-xs font-medium">
                🌟 शुभ तत्व एवं अनुकूलता (Lucky Factors)
              </TabsTrigger>
              <TabsTrigger value="nature" className="rounded-xl py-2 px-4 text-xs font-medium">
                🧠 स्वभाव व विशेषताएँ (Personality)
              </TabsTrigger>
              <TabsTrigger value="sadesati" className="rounded-xl py-2 px-4 text-xs font-medium">
                🪐 साढ़ेसाती व गोचर प्रभाव (Sade Sati Status)
              </TabsTrigger>
              <TabsTrigger value="mantras" className="rounded-xl py-2 px-4 text-xs font-medium">
                🕉️ वैदिक मन्त्र एवं साधना (Remedies)
              </TabsTrigger>
            </TabsList>
          </div>

          {/* SUB-TAB 1: LUCKY FACTORS */}
          <TabsContent value="lucky" className="space-y-6 pt-4 m-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* LUCKY NUMBERS, COLORS, GEMSTONES */}
              <Card className="rounded-3xl border border-border bg-card p-6 md:p-8 space-y-4 shadow-card">
                <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                  <Sparkles className="size-5 text-primary" />
                  <h4 className="font-display text-xl font-bold text-foreground">
                    {activeProfile.nameHindi} के शुभ तत्व (Auspicious Factors)
                  </h4>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center p-2.5 rounded-xl bg-muted/20">
                    <span className="text-muted-foreground font-semibold">शुभ अंक (Lucky Numbers):</span>
                    <span className="font-bold text-foreground font-mono">
                      {activeProfile.luckyNumbers.join(", ")}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 rounded-xl bg-muted/20">
                    <span className="text-muted-foreground font-semibold">शुभ रंग (Lucky Colors):</span>
                    <span className="font-bold text-foreground">
                      {activeProfile.luckyColors.join(", ")}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 rounded-xl bg-muted/20">
                    <span className="text-muted-foreground font-semibold">शुभ वार (Lucky Days):</span>
                    <span className="font-bold text-foreground">
                      {activeProfile.luckyDays.join(", ")}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 rounded-xl bg-muted/20">
                    <span className="text-muted-foreground font-semibold">शुभ दिशा (Lucky Direction):</span>
                    <span className="font-bold text-foreground">
                      {activeProfile.luckyDirection}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 rounded-xl border border-primary/20 bg-primary/5">
                    <span className="text-primary font-bold">भाग्य रत्न (Lucky Gemstone):</span>
                    <span className="font-bold text-foreground">
                      {activeProfile.luckyGemstone}
                    </span>
                  </div>
                </div>
              </Card>

              {/* COMPATIBILITY MATRIX */}
              <Card className="rounded-3xl border border-border bg-card p-6 md:p-8 space-y-4 shadow-card">
                <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                  <Heart className="size-5 text-accent" />
                  <h4 className="font-display text-xl font-bold text-foreground">
                    मैत्री एवं अनुकूल राशियाँ (Compatibility)
                  </h4>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="space-y-2">
                    <span className="text-success font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="size-3.5" /> परम अनुकूल व मित्र राशियाँ (Best Match):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeProfile.compatibleRashis.map((comp, cIdx) => (
                        <span
                          key={cIdx}
                          className="rounded-xl border border-success/30 bg-success/5 px-3 py-1 font-semibold text-foreground"
                        >
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-border/50">
                    <span className="text-muted-foreground font-bold flex items-center gap-1.5">
                      <AlertCircle className="size-3.5" /> शत्रु व प्रतिकूल राशियाँ (Challenging):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeProfile.incompatibleRashis.map((incomp, iIdx) => (
                        <span
                          key={iIdx}
                          className="rounded-xl border border-border/60 bg-muted/20 px-3 py-1 text-muted-foreground"
                        >
                          {incomp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* SUB-TAB 2: PERSONALITY & NATURE */}
          <TabsContent value="nature" className="space-y-6 pt-4 m-0">
            <Card className="rounded-3xl border border-border bg-card p-6 md:p-8 space-y-6 shadow-card">
              <div>
                <h4 className="font-display text-xl font-bold text-foreground">
                  {activeProfile.nameHindi} का मूल स्वभाव व मानसिक प्रवृत्तियाँ
                </h4>
                <p className="text-sm font-devanagari text-foreground leading-relaxed mt-2">
                  {activeProfile.personalityTraits.coreNatureHindi}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                  {activeProfile.personalityTraits.coreNatureEnglish}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-border/60">
                {/* STRENGTHS */}
                <div className="rounded-2xl border border-success/30 bg-success/5 p-5 space-y-2">
                  <div className="text-xs font-bold text-success uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5" /> सकारात्मक गुण एवं सामर्थ्य (Strengths)
                  </div>
                  <ul className="space-y-1.5 text-xs text-foreground font-devanagari">
                    {activeProfile.personalityTraits.strengths.map((str, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-1.5">
                        <span className="text-success font-bold">✓</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* WEAKNESSES */}
                <div className="rounded-2xl border border-border bg-muted/20 p-5 space-y-2">
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="size-3.5" /> सावधानियाँ एवं कमजोरियाँ (Weaknesses)
                  </div>
                  <ul className="space-y-1.5 text-xs text-muted-foreground font-devanagari">
                    {activeProfile.personalityTraits.weaknesses.map((w, wIdx) => (
                      <li key={wIdx} className="flex items-start gap-1.5">
                        <span className="font-bold">⚠</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* SUB-TAB 3: SADE SATI & TRANSITS */}
          <TabsContent value="sadesati" className="space-y-6 pt-4 m-0">
            <Card className="rounded-3xl border border-border bg-card p-6 md:p-8 space-y-4 shadow-card">
              <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                <Shield className="size-5 text-primary" />
                <h4 className="font-display text-xl font-bold text-foreground">
                  शनि साढ़ेसाती एवं ढैया स्थिति विश्लेषण
                </h4>
              </div>

              {calculatedResult ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl border border-primary/20 bg-primary/5 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-muted-foreground font-semibold uppercase">
                        वर्तमान साढ़ेसाती स्थिति
                      </div>
                      <div className="font-display font-bold text-lg text-primary mt-0.5">
                        {calculatedResult.sadeSatiStatus.phase}
                      </div>
                    </div>
                    <Badge
                      variant={calculatedResult.sadeSatiStatus.isActive ? "destructive" : "secondary"}
                    >
                      {calculatedResult.sadeSatiStatus.isActive ? "प्रभावी (Active)" : "मुक्त (Free)"}
                    </Badge>
                  </div>

                  <p className="text-xs text-foreground font-devanagari leading-relaxed">
                    {calculatedResult.sadeSatiStatus.descriptionHindi}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  सटीक साढ़ेसाती विश्लेषण हेतु कृपया 'जन्म विवरण' टैब में अपना जन्म विवरण दर्ज करें।
                </p>
              )}
            </Card>
          </TabsContent>

          {/* SUB-TAB 4: MANTRAS & REMEDIES */}
          <TabsContent value="mantras" className="space-y-6 pt-4 m-0">
            <Card className="rounded-3xl border border-border bg-card p-6 md:p-8 space-y-6 shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <Flame className="size-5 text-primary" />
                  <h4 className="font-display text-xl font-bold text-foreground">
                    {activeProfile.nameHindi} के इष्टदेव एवं वैदिक साधना
                  </h4>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSpeech(activeProfile.beejMantra)}
                  className="rounded-xl text-xs gap-1.5"
                >
                  <Volume2 className="size-3.5 text-primary" /> मन्त्र जप सुनें
                </Button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-2">
                  <div className="text-primary font-bold uppercase tracking-wider text-[11px]">
                    राशि स्वामी बीज मन्त्र
                  </div>
                  <div className="font-devanagari text-base font-bold text-foreground">
                    {activeProfile.beejMantra}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    प्रतिदिन १०८ बार जप करने से ग्रहदोषों का शमन एवं मनोकामना सिद्धि होती है।
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-muted/20 p-5 space-y-2">
                  <div className="text-accent font-bold uppercase tracking-wider text-[11px]">
                    इष्टदेव व उपासना मन्त्र
                  </div>
                  <div className="font-bold text-foreground">
                    इष्टदेव: {activeProfile.ishtaDevata}
                  </div>
                  <div className="font-devanagari font-semibold text-primary">
                    {activeProfile.ishtaDevataMantra}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-border/70 bg-card space-y-1.5 text-xs">
                <div className="font-bold text-foreground">✨ वैदिक उपाय व दान विधान:</div>
                <p className="text-muted-foreground leading-relaxed">
                  {activeProfile.vedicRemedy}
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
