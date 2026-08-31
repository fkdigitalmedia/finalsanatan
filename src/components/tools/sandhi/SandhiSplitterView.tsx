import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  Compass,
  Copy,
  Flame,
  HelpCircle,
  Info,
  Layers,
  Merge,
  RotateCcw,
  Scissors,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  joinSandhiWords,
  SANDHI_PRESETS,
  SANDHI_RULES,
  type SandhiPreset,
  splitCompoundWord,
} from "./sandhi-engine";

export function SandhiSplitterView() {
  const [activeTab, setActiveTab] = useState<"split" | "join">("split");

  // Split tab state
  const [splitInput, setSplitInput] = useState<string>("धर्मक्षेत्रे");

  // Join tab state
  const [joinWord1, setJoinWord1] = useState<string>("सत्");
  const [joinWord2, setJoinWord2] = useState<string>("जनः");

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const splitResult = useMemo(() => splitCompoundWord(splitInput), [splitInput]);
  const joinResult = useMemo(() => joinSandhiWords(joinWord1, joinWord2), [joinWord1, joinWord2]);

  const handleCopy = (str: string, label = "टेक्स्ट") => {
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

  const loadPreset = (p: SandhiPreset) => {
    if (activeTab === "split") {
      setSplitInput(p.compound);
    } else {
      setJoinWord1(p.part1);
      setJoinWord2(p.part2);
    }
    toast.success(`'${p.compound}' लोड किया गया!`);
  };

  return (
    <div className="space-y-8 print:p-0">
      {/* HEADER BANNER */}
      <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-accent/5 p-6 md:p-8 shadow-elegant print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-border/60">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Scissors className="size-3.5" /> पाणिनीय संस्कृत सन्धि स्टूडियो
            </div>
            <h2 className="mt-2 font-display text-2xl md:text-3xl font-semibold">
              Advanced Sanskrit Sandhi Splitter & Combiner
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Rule-based Paninian Sandhi splitting (विच्छेद) & joining (संयोजन) for Svara (अच्),
              Vyanjana (हल्), and Visarga Sandhis with classical Sutras.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant={activeTab === "split" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("split")}
              className="rounded-full gap-1.5"
            >
              <Scissors className="size-3.5" /> सन्धि विच्छेद (Splitter)
            </Button>
            <Button
              variant={activeTab === "join" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("join")}
              className="rounded-full gap-1.5"
            >
              <Merge className="size-3.5" /> सन्धि संयोजन (Joiner)
            </Button>
          </div>
        </div>

        {/* QUICK PRESETS PILLS */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            प्रसिद्ध सन्धि उदाहरण (Classical Presets):
          </Label>
          <div className="flex flex-wrap gap-2">
            {SANDHI_PRESETS.slice(0, 10).map((p) => (
              <button
                key={p.id}
                onClick={() => loadPreset(p)}
                className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs hover:border-primary/50 hover:bg-primary/5 transition font-devanagari flex items-center gap-1.5 shadow-sm"
              >
                <span className="font-semibold text-foreground">{p.compound}</span>
                <span className="text-muted-foreground text-[10px]">({p.part1} + {p.part2})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MODE 1: SANDHI SPLITTER */}
      {activeTab === "split" && (
        <div className="space-y-6">
          <Card className="rounded-3xl border border-border p-6 shadow-elegant space-y-4 bg-card">
            <Label className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="size-3.5" /> समस्त पद / सामासिक पद लिखें (Compound Word)
            </Label>
            <div className="flex gap-3">
              <Input
                value={splitInput}
                onChange={(e) => setSplitInput(e.target.value)}
                placeholder="उदा. धर्मक्षेत्रे, महर्षिः, सदैव, इत्यादि, सज्जनः, मनोबलम्"
                className="bg-background text-lg font-devanagari h-12"
              />
              <Button
                variant="outline"
                onClick={() => setSplitInput("")}
                className="h-12 px-4 rounded-xl"
              >
                <RotateCcw className="size-4 text-muted-foreground" />
              </Button>
            </div>
          </Card>

          {/* SPLIT RESULTS DISPLAY */}
          {splitResult.candidates.length > 0 && (
            <div className="space-y-4">
              {splitResult.candidates.map((cand, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-card via-background to-muted/20 p-6 md:p-8 shadow-card space-y-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border/60">
                    <div className="flex items-center gap-2">
                      <span className="flex size-3 rounded-full bg-success animate-pulse" />
                      <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                        विच्छेद परिणाम (Split Result #{idx + 1})
                      </span>
                      <Badge variant="outline" className="text-xs font-mono">
                        {cand.sandhiType}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSpeech(`${cand.word1} जमा ${cand.word2}`)}
                        className="text-xs gap-1"
                      >
                        <Volume2 className="size-3.5 text-primary" /> सुनें
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleCopy(`${cand.word1} + ${cand.word2}`, "सन्धि विच्छेद")
                        }
                        className="text-xs gap-1"
                      >
                        <Copy className="size-3.5" /> कॉपी
                      </Button>
                    </div>
                  </div>

                  {/* EQUATION CARD */}
                  <div className="rounded-2xl border border-primary/20 bg-background/80 p-6 text-center space-y-2">
                    <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                      सन्धियुक्त पद = पूर्वपद + उत्तरपद
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3 font-devanagari text-2xl md:text-4xl font-bold py-2">
                      <span className="text-foreground">{splitResult.originalInput}</span>
                      <span className="text-muted-foreground font-sans text-xl">=</span>
                      <span className="text-primary bg-primary/10 px-3 py-1 rounded-xl">
                        {cand.word1}
                      </span>
                      <span className="text-accent font-sans text-xl">+</span>
                      <span className="text-accent bg-accent/10 px-3 py-1 rounded-xl">
                        {cand.word2}
                      </span>
                    </div>
                  </div>

                  {/* SUTRA & GRAMMAR DETAILS */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-border bg-card p-4 space-y-1.5">
                      <div className="text-xs font-semibold text-accent uppercase tracking-wider flex items-center gap-1.5">
                        <Flame className="size-3.5" /> पाणिनीय सूत्र (Paninian Sutra)
                      </div>
                      <div className="font-devanagari text-base font-bold text-foreground">
                        {cand.sutra}
                      </div>
                      <div className="text-xs text-muted-foreground leading-relaxed">
                        {cand.explanation}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-4 space-y-1.5">
                      <div className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
                        <Compass className="size-3.5" /> सन्धि वर्ग एवं नियम
                      </div>
                      <div className="text-xs text-muted-foreground leading-relaxed">
                        <strong>सन्धि भेद:</strong>{" "}
                        <span className="text-foreground font-semibold">
                          {cand.category === "svara"
                            ? "स्वर सन्धि (अच्)"
                            : cand.category === "vyanjana"
                              ? "व्यञ्जन सन्धि (हल्)"
                              : "विसर्ग सन्धि"}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground leading-relaxed">
                        <strong>सटीकता:</strong>{" "}
                        <span className="text-success font-semibold">{cand.confidence}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODE 2: SANDHI JOINER */}
      {activeTab === "join" && (
        <div className="space-y-6">
          <Card className="rounded-3xl border border-border p-6 shadow-elegant space-y-4 bg-card">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-primary">१. पूर्वपद (First Word)</Label>
                <Input
                  value={joinWord1}
                  onChange={(e) => setJoinWord1(e.target.value)}
                  placeholder="उदा. सत्, देव, हिम, इति"
                  className="bg-background text-base font-devanagari"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-accent">२. उत्तरपद (Second Word)</Label>
                <Input
                  value={joinWord2}
                  onChange={(e) => setJoinWord2(e.target.value)}
                  placeholder="उदा. जनः, इन्द्रः, आलयः, आदि"
                  className="bg-background text-base font-devanagari"
                />
              </div>
            </div>
          </Card>

          {/* JOIN RESULT */}
          <div className="rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-card via-background to-muted/20 p-6 md:p-8 shadow-card space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border/60">
              <div className="flex items-center gap-2">
                <span className="flex size-3 rounded-full bg-success animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                  संयोजन परिणाम (Combined Result)
                </span>
                <Badge variant="outline" className="text-xs font-mono">
                  {joinResult.sandhiType}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSpeech(joinResult.joinedWord)}
                  className="text-xs gap-1"
                >
                  <Volume2 className="size-3.5 text-primary" /> सुनें
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(joinResult.joinedWord, "संयुक्त पद")}
                  className="text-xs gap-1"
                >
                  <Copy className="size-3.5" /> कॉपी
                </Button>
              </div>
            </div>

            {/* JOIN EQUATION */}
            <div className="rounded-2xl border border-primary/20 bg-background/80 p-6 text-center space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                पूर्वपद + उत्तरपद ➔ सन्धियुक्त पद
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 font-devanagari text-2xl md:text-4xl font-bold py-2">
                <span className="text-primary bg-primary/10 px-3 py-1 rounded-xl">{joinResult.word1}</span>
                <span className="text-muted-foreground font-sans text-xl">+</span>
                <span className="text-accent bg-accent/10 px-3 py-1 rounded-xl">{joinResult.word2}</span>
                <span className="text-foreground font-sans text-xl">➔</span>
                <span className="text-foreground bg-primary/20 px-4 py-1 rounded-xl border border-primary/40">
                  {joinResult.joinedWord}
                </span>
              </div>
            </div>

            {/* SUTRA & EXPLANATION */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-border bg-card p-4 space-y-1.5">
                <div className="text-xs font-semibold text-accent uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="size-3.5" /> पाणिनीय सूत्र (Sutra)
                </div>
                <div className="font-devanagari text-base font-bold text-foreground">
                  {joinResult.sutra}
                </div>
                <div className="text-xs text-muted-foreground leading-relaxed">
                  {joinResult.explanation}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4 space-y-1.5">
                <div className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="size-3.5" /> सन्धि प्रकार
                </div>
                <div className="text-xs text-muted-foreground leading-relaxed">
                  <strong>वर्ग:</strong>{" "}
                  <span className="text-foreground font-semibold">
                    {joinResult.category === "svara"
                      ? "स्वर सन्धि (अच् सन्धि)"
                      : joinResult.category === "vyanjana"
                        ? "व्यञ्जन सन्धि (हल् सन्धि)"
                        : "विसर्ग सन्धि"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REFERENCE SUTRA DICTIONARY */}
      <Card className="rounded-3xl border border-border p-6 shadow-elegant space-y-4 bg-card">
        <div className="flex items-center gap-2 pb-3 border-b border-border">
          <BookOpen className="size-4 text-primary" />
          <span className="font-display font-semibold text-base">
            प्रमुख पाणिनीय सन्धि सूत्र कोश (Paninian Rules Matrix)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {Object.values(SANDHI_RULES).map((rule) => (
            <div key={rule.id} className="rounded-2xl border border-border bg-muted/20 p-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-sm text-primary">
                  {rule.nameSanskrit}
                </span>
                <Badge variant="outline" className="text-[10px]">
                  {rule.category}
                </Badge>
              </div>
              <div className="font-devanagari text-xs font-bold text-foreground">
                {rule.sutra}
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {rule.ruleExplanation}
              </p>
              <div className="font-mono text-[10px] text-accent font-semibold pt-1 border-t border-border/40">
                {rule.patternFormula}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
