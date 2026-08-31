import { useMemo, useState } from "react";
import {
  BookOpen,
  Check,
  ChevronRight,
  Compass,
  Copy,
  Download,
  Flame,
  HelpCircle,
  Info,
  Layers,
  Music,
  Printer,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  analyzeShloka,
  GANA_DEFINITIONS,
  SHLOKA_PRESETS,
  type ShlokaPreset,
} from "./shloka-engine";

export function ShlokaAnalyzerView() {
  const [shlokaText, setShlokaText] = useState<string>(
    `कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।
मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥`,
  );
  const [fontSize, setFontSize] = useState<number>(20);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const result = useMemo(() => analyzeShloka(shlokaText), [shlokaText]);

  const handleCopy = (str: string, label = "विश्लेषण") => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(str);
      toast.success(`${label} क्लिपबोर्ड पर कॉपी हो गया!`);
    }
  };

  const handleSpeech = (textToRead: string) => {
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
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = "hi-IN";
    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  const loadPreset = (preset: ShlokaPreset) => {
    setShlokaText(preset.shloka);
    toast.success(`'${preset.title}' लोड किया गया!`);
  };

  return (
    <div className="space-y-8 print:p-0">
      {/* HEADER BANNER */}
      <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-accent/5 p-6 md:p-8 shadow-elegant print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-border/60">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Music className="size-3.5" /> पिङ्गल छन्दःशास्त्र एवं श्लोक विश्लेषण
            </div>
            <h2 className="mt-2 font-display text-2xl md:text-3xl font-semibold">
              Advanced Sanskrit Shloka & Chhandas Analyzer
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Pingala 8-Gana scansion (य-मा-ता-रा-ज-भा-न-स), Laghu-Guru weights (। / ऽ), Matra counts,
              and meter identification for Vedic and Classical Sanskrit verses.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSpeech(shlokaText)}
              className="rounded-full gap-1.5 text-xs"
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="size-3.5 text-destructive" /> रोके (Stop)
                </>
              ) : (
                <>
                  <Volume2 className="size-3.5 text-primary" /> श्लोक पाठ सुनें
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="rounded-full gap-1.5 text-xs"
            >
              <Printer className="size-3.5" /> प्रिंट / PDF
            </Button>
          </div>
        </div>

        {/* QUICK PRESET PILLS */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            प्रसिद्ध श्लोक उदाहरण (Quick Presets):
          </Label>
          <div className="flex flex-wrap gap-2">
            {SHLOKA_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => loadPreset(preset)}
                className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs hover:border-primary/50 hover:bg-primary/5 transition font-devanagari flex items-center gap-1.5 shadow-sm"
              >
                <Sparkles className="size-3 text-primary" />
                <span className="font-medium">{preset.title}</span>
                <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-normal">
                  {preset.meterName}
                </Badge>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SHLOKA INPUT EDITOR */}
      <Card className="rounded-3xl border border-border shadow-elegant overflow-hidden bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5 border-b border-border/70 bg-muted/30 print:hidden">
          <div className="flex items-center gap-2">
            <BookOpen className="size-4 text-primary" />
            <span className="font-display font-semibold text-sm">संस्कृत श्लोक प्रविष्ट करें</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 border border-border rounded-xl px-2 py-1 bg-background text-xs">
              <span className="text-muted-foreground">आकार:</span>
              <button
                onClick={() => setFontSize((s) => Math.max(16, s - 2))}
                className="px-1 font-bold"
              >
                A-
              </button>
              <span className="font-mono text-xs">{fontSize}</span>
              <button
                onClick={() => setFontSize((s) => Math.min(32, s + 2))}
                className="px-1 font-bold"
              >
                A+
              </button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(shlokaText, "श्लोक")}
              className="gap-1 text-xs rounded-xl"
            >
              <Copy className="size-3" /> कॉपी
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShlokaText("")}
              className="gap-1 text-xs rounded-xl text-muted-foreground"
            >
              <RotateCcw className="size-3" /> साफ़ करें
            </Button>
          </div>
        </div>

        <div className="p-6 md:p-8 bg-background/50">
          <Textarea
            rows={4}
            value={shlokaText}
            onChange={(e) => setShlokaText(e.target.value)}
            style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
            className="font-devanagari border-border/80 focus-visible:ring-primary shadow-inner rounded-2xl resize-y"
            placeholder="यहाँ कोई भी संस्कृत श्लोक, मन्त्र अथवा स्तोत्र पेस्ट करें..."
          />
        </div>
      </Card>

      {/* METRIC CHOP & VERDICT BANNER */}
      {result.detectedMeter && (
        <div className="rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-card to-background p-6 md:p-8 shadow-card space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex size-3 rounded-full bg-success animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                  पहचाना गया छन्द (Detected Meter)
                </span>
                <Badge variant="outline" className="text-xs font-mono">
                  {result.detectedMeter.category === "vedic" ? "वैदिक छन्द" : "समवृत्त शास्त्रीय छन्द"}
                </Badge>
              </div>
              <h3 className="mt-2 font-display text-2xl md:text-3xl font-bold text-foreground">
                {result.detectedMeter.nameSanskrit}{" "}
                <span className="text-base font-normal text-muted-foreground font-sans">
                  ({result.detectedMeter.nameEnglish})
                </span>
              </h3>
              <p className="mt-1 text-xs md:text-sm text-muted-foreground max-w-2xl">
                {result.detectedMeter.description}
              </p>
            </div>

            <div className="rounded-2xl border border-primary/20 bg-background/80 p-4 text-center min-w-36">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                सटीकता (Confidence)
              </div>
              <div className="font-display font-bold text-2xl text-primary mt-1">
                {result.confidence}%
              </div>
              <div className="text-[10px] text-success font-medium mt-0.5">Shastriya Match</div>
            </div>
          </div>

          {/* LAKSHANA VERSE & YATI */}
          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-border/70">
            {result.detectedMeter.lakshanaSanskrit && (
              <div className="rounded-2xl border border-border bg-card/60 p-4 space-y-1.5">
                <div className="text-xs font-semibold text-accent uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="size-3.5" /> छन्दः लक्षण श्लोक (Classical Definition)
                </div>
                <div className="font-devanagari text-sm leading-relaxed text-foreground font-medium">
                  {result.detectedMeter.lakshanaSanskrit}
                </div>
                <div className="text-xs text-muted-foreground leading-relaxed">
                  {result.detectedMeter.lakshanaHindi}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-border bg-card/60 p-4 space-y-2">
              <div className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="size-3.5" /> यति एवं गति (Caesura & Rhythm)
              </div>
              <div className="text-xs text-muted-foreground leading-relaxed">
                <strong>यति विश्राम (Pause Points):</strong>{" "}
                <span className="text-foreground">{result.detectedMeter.yati || "पादान्ते"}</span>
              </div>
              {result.detectedMeter.ganaPattern && (
                <div className="text-xs text-muted-foreground leading-relaxed">
                  <strong>गण विन्यास (Gana Sequence):</strong>{" "}
                  <span className="font-mono text-primary font-bold">
                    {result.detectedMeter.ganaPattern.join(" - ")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* OVERALL METRICS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground">चरण (Padas)</div>
          <div className="font-display font-semibold text-xl mt-1">
            {result.overallMetrics.padaCount}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground">कुल वर्ण (Syllables)</div>
          <div className="font-display font-semibold text-xl mt-1 text-primary">
            {result.overallMetrics.totalSyllables}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground">कुल मात्राएं (Matras)</div>
          <div className="font-display font-semibold text-xl mt-1 text-accent">
            {result.overallMetrics.totalMatras}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground">लघु वर्ण (। = 1)</div>
          <div className="font-display font-semibold text-xl mt-1 text-success">
            {result.overallMetrics.laghuCount}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground">गुरु वर्ण (ऽ = 2)</div>
          <div className="font-display font-semibold text-xl mt-1 text-orange-500">
            {result.overallMetrics.guruCount}
          </div>
        </div>
      </div>

      {/* TABS CONTAINER */}
      <Card className="rounded-3xl border border-border shadow-elegant overflow-hidden bg-card">
        <Tabs defaultValue="scansion" className="w-full">
          <div className="px-6 pt-4 border-b border-border/50 bg-background/50 print:hidden">
            <TabsList className="bg-muted/60 p-1 rounded-2xl h-auto flex flex-wrap gap-1">
              <TabsTrigger value="scansion" className="rounded-xl py-2 px-4 text-xs font-medium">
                🔍 पाद-वार प्रस्तार व मात्रा चक्र (Scansion Matrix)
              </TabsTrigger>
              <TabsTrigger value="ganas" className="rounded-xl py-2 px-4 text-xs font-medium">
                📊 अष्ट-गण विन्यास (8-Gana Breakdown)
              </TabsTrigger>
              <TabsTrigger value="padacheda" className="rounded-xl py-2 px-4 text-xs font-medium">
                📖 पदच्छेद व शब्द विश्लेषण (Word Breakdown)
              </TabsTrigger>
              <TabsTrigger value="reference" className="rounded-xl py-2 px-4 text-xs font-medium">
                📚 पिङ्गल छन्दःशास्त्र नियम कोश
              </TabsTrigger>
            </TabsList>
          </div>

          {/* TAB 1: SCANSION MATRIX */}
          <TabsContent value="scansion" className="p-6 md:p-8 space-y-6 m-0">
            <div className="flex items-center justify-between text-xs text-muted-foreground pb-2 border-b border-border/50">
              <span>
                💡 <strong>संकेत:</strong> <span className="text-success font-bold">। (लघु = १ मात्रा)</span> एवं{" "}
                <span className="text-orange-500 font-bold">ऽ (गुरु = २ मात्राएं)</span>
              </span>
              <span className="font-mono text-[11px]">Pingala Syllabic Weight Map</span>
            </div>

            {result.padas.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground italic">
                कृपया विश्लेषण के लिए ऊपर श्लोक प्रविष्ट करें...
              </div>
            ) : (
              <div className="space-y-6">
                {result.padas.map((pada) => (
                  <div
                    key={pada.padaIndex}
                    className="rounded-2xl border border-border bg-card/60 p-5 shadow-sm space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {pada.padaIndex}
                        </span>
                        <span className="font-devanagari font-semibold text-base text-foreground">
                          {pada.originalText}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                        <span>अक्षर: <strong>{pada.totalSyllables}</strong></span>
                        <span>·</span>
                        <span>मात्रा: <strong className="text-accent">{pada.totalMatras}</strong></span>
                      </div>
                    </div>

                    {/* SYLLABLE CARDS STRIP */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {pada.syllables.map((syl, sIdx) => (
                        <div
                          key={sIdx}
                          className={`flex flex-col items-center justify-center min-w-10 rounded-xl border p-1.5 transition ${
                            syl.weight === "G"
                              ? "border-orange-500/30 bg-orange-500/10 text-orange-950 dark:text-orange-200"
                              : "border-success/30 bg-success/10 text-emerald-950 dark:text-emerald-200"
                          }`}
                          title={`अक्षर: ${syl.text} | मात्रा: ${syl.matras} (${syl.rule})`}
                        >
                          <span className="font-devanagari font-bold text-base">{syl.text}</span>
                          <span className="font-mono font-black text-sm">
                            {syl.weight === "G" ? "ऽ" : "।"}
                          </span>
                          <span className="text-[10px] opacity-75">{syl.matras}M</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* TAB 2: GANAS BREAKDOWN */}
          <TabsContent value="ganas" className="p-6 md:p-8 space-y-6 m-0">
            <div className="text-xs text-muted-foreground pb-2 border-b border-border/50">
              त्रिक वर्ण समूह (3 Syllables = 1 Gana) के आधार पर प्रत्येक पाद का गण विन्यास:
            </div>

            <div className="space-y-4">
              {result.padas.map((pada) => (
                <div key={pada.padaIndex} className="rounded-2xl border border-border bg-card p-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <span>पाद {pada.padaIndex}:</span>
                    <span className="font-devanagari text-foreground font-medium">
                      {pada.originalText}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {pada.ganas.map((g, gIdx) => (
                      <div
                        key={gIdx}
                        className="rounded-xl border border-primary/20 bg-primary/5 p-2.5 text-center min-w-24"
                      >
                        <div className="font-display font-bold text-base text-primary">
                          {g.gana}
                        </div>
                        <div className="text-xs font-mono font-bold text-muted-foreground">
                          {g.pattern}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-devanagari mt-0.5">
                          {g.syllables.map((s) => s.text).join("")}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* TAB 3: PADACHEDA */}
          <TabsContent value="padacheda" className="p-6 md:p-8 space-y-6 m-0">
            <div className="text-xs text-muted-foreground pb-2 border-b border-border/50">
              श्लोक के पृथक्-पृथक् पदों का विभाजन (Tokenized Words):
            </div>

            <div className="flex flex-wrap gap-2">
              {result.padachedaTokens.map((tok, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-border bg-muted/20 px-3.5 py-2 font-devanagari text-base font-medium hover:border-primary/40 transition"
                >
                  {tok}
                </div>
              ))}
            </div>
          </TabsContent>

          {/* TAB 4: REFERENCE RULES */}
          <TabsContent value="reference" className="p-6 md:p-8 space-y-6 m-0">
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-accent">
                  पिङ्गल अष्ट-गण मूल सूत्र (Pingala Gana Sutra)
                </div>
                <div className="font-devanagari text-xl font-bold text-foreground">
                  ॥ यमाता राजभानसलगाम् ॥
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  इस सूत्र के माध्यम से 8 गणों के लघु-गुरु रूप की गणना होती है।
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(GANA_DEFINITIONS).map(([code, g]) => (
                  <div key={code} className="rounded-xl border border-border bg-muted/20 p-3.5 space-y-1">
                    <div className="font-display font-bold text-sm text-primary">{g.name}</div>
                    <div className="font-mono font-bold text-xs text-foreground tracking-widest">
                      {g.pattern} ({code})
                    </div>
                    <div className="text-[11px] text-muted-foreground">{g.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
