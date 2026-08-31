import { useMemo, useState } from "react";
import {
  ArrowLeftRight,
  BookOpen,
  Check,
  Compass,
  Copy,
  Download,
  Flame,
  Grid,
  HelpCircle,
  Info,
  Languages,
  Layers,
  Printer,
  RotateCcw,
  Share2,
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
  PRESET_TRANSLITERATION_TEXTS,
  SCRIPT_REGISTRY,
  type ScriptId,
  transliterate,
  transliterateToAll,
  type TransliterationPreset,
} from "./transliteration-engine";

export function TransliterationStudioView() {
  const [inputText, setInputText] = useState<string>(
    "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥",
  );
  const [sourceScript, setSourceScript] = useState<ScriptId>("devanagari");
  const [targetScript, setTargetScript] = useState<ScriptId>("iast");
  const [fontSize, setFontSize] = useState<number>(20);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // 1-to-1 Output
  const convertedText = useMemo(
    () => transliterate(inputText, sourceScript, targetScript),
    [inputText, sourceScript, targetScript],
  );

  // All scripts matrix
  const allScriptsOutput = useMemo(
    () => transliterateToAll(inputText, sourceScript),
    [inputText, sourceScript],
  );

  const handleSwapScripts = () => {
    setSourceScript(targetScript);
    setTargetScript(sourceScript);
    setInputText(convertedText);
    toast.success("लिपियाँ परस्पर बदल दी गईं!");
  };

  const handleCopy = (str: string, label = "लिप्यन्तरित पाठ") => {
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

  const loadPreset = (preset: TransliterationPreset) => {
    setSourceScript("devanagari");
    setInputText(preset.text);
    toast.success(`'${preset.title}' लोड किया गया!`);
  };

  const handleDownloadAll = () => {
    if (typeof document === "undefined") return;
    let exportData = "=== SANATAN MULTI-SCRIPT TRANSLITERATION EXPORT ===\n\n";
    for (const [sId, sInfo] of Object.entries(SCRIPT_REGISTRY)) {
      exportData += `[${sInfo.nameEnglish} (${sInfo.nativeName})]\n${allScriptsOutput[sId as ScriptId]}\n\n`;
    }
    const blob = new Blob([exportData], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transliteration-export-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("सर्व-लिपि पाठ फ़ाइल डाउनलोड हो गई!");
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <div className="space-y-8 print:p-0">
      {/* HEADER BANNER */}
      <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-accent/5 p-6 md:p-8 shadow-elegant print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-border/60">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Languages className="size-3.5" /> सर्व-लिपि वैदिक लिप्यन्तरण केन्द्र
            </div>
            <h2 className="mt-2 font-display text-2xl md:text-3xl font-semibold">
              Universal Indic & Sanskrit Transliteration Studio
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Bidirectional multi-script conversion across 13 Indian scripts and Romanization
              schemes (Devanagari, IAST, ITRANS, Harvard-Kyoto, Bengali, Tamil, Telugu, Kannada,
              Malayalam, Gujarati, Gurmukhi, Odia).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadAll}
              className="rounded-full gap-1.5 text-xs"
            >
              <Download className="size-3.5 text-accent" /> सर्व-लिपि डाउनलोड
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

        {/* QUICK PRESETS */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            प्रसिद्ध मन्त्र व श्लोक उदाहरण (Quick Presets):
          </Label>
          <div className="flex flex-wrap gap-2">
            {PRESET_TRANSLITERATION_TEXTS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => loadPreset(preset)}
                className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs hover:border-primary/50 hover:bg-primary/5 transition font-devanagari flex items-center gap-1.5 shadow-sm"
              >
                <Sparkles className="size-3 text-primary" />
                <span className="font-medium text-foreground">{preset.title}</span>
                <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-normal">
                  {preset.category}
                </Badge>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* VIEW TABS */}
      <Tabs defaultValue="direct" className="w-full">
        <div className="border-b border-border/70 pb-2 print:hidden">
          <TabsList className="bg-muted/60 p-1 rounded-2xl h-auto flex flex-wrap gap-1">
            <TabsTrigger value="direct" className="rounded-xl py-2 px-4 text-xs font-medium">
              🎯 प्रत्यक्ष लिपि रूपान्तरण (Direct 1-to-1)
            </TabsTrigger>
            <TabsTrigger value="matrix" className="rounded-xl py-2 px-4 text-xs font-medium">
              🌐 सर्व-लिपि तुलना चक्र (Multi-Script Matrix - 13 Scripts)
            </TabsTrigger>
          </TabsList>
        </div>

        {/* TAB 1: DIRECT 1-TO-1 CONVERTER */}
        <TabsContent value="direct" className="space-y-6 pt-4 m-0">
          <div className="grid md:grid-cols-2 gap-6">
            {/* SOURCE INPUT CARD */}
            <Card className="rounded-3xl border border-border p-6 shadow-elegant space-y-4 bg-card flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs font-semibold text-primary uppercase tracking-wider">
                      स्रोत लिपि (Source Script):
                    </Label>
                    <select
                      value={sourceScript}
                      onChange={(e) => setSourceScript(e.target.value as ScriptId)}
                      className="rounded-xl border border-border bg-background px-3 py-1 text-xs font-medium"
                    >
                      {Object.values(SCRIPT_REGISTRY).map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.nameEnglish} ({s.nativeName})
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setInputText("")}
                    className="text-xs h-7 text-muted-foreground"
                  >
                    साफ़ करें
                  </Button>
                </div>

                <Textarea
                  rows={6}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
                  className="font-devanagari bg-background resize-y rounded-2xl border-border/80"
                  placeholder="यहाँ मूल पाठ लिखें या पेस्ट करें..."
                />
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                <span>अक्षर: {inputText.length}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(inputText, "मूल पाठ")}
                  className="gap-1 text-xs rounded-xl h-8"
                >
                  <Copy className="size-3" /> कॉपी
                </Button>
              </div>
            </Card>

            {/* TARGET OUTPUT CARD */}
            <Card className="rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-card via-background to-primary/5 p-6 shadow-card space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs font-semibold text-accent uppercase tracking-wider">
                      लक्ष्य लिपि (Target Script):
                    </Label>
                    <select
                      value={targetScript}
                      onChange={(e) => setTargetScript(e.target.value as ScriptId)}
                      className="rounded-xl border border-border bg-background px-3 py-1 text-xs font-medium font-devanagari"
                    >
                      {Object.values(SCRIPT_REGISTRY).map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.nameEnglish} ({s.nativeName})
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSwapScripts}
                    className="text-xs h-7 rounded-xl gap-1"
                    title="लिपियाँ परस्पर बदलें"
                  >
                    <ArrowLeftRight className="size-3" /> Swap
                  </Button>
                </div>

                <div
                  style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
                  className="min-h-36 p-4 rounded-2xl border border-primary/20 bg-background/80 font-devanagari text-foreground font-medium select-all overflow-x-auto whitespace-pre-wrap"
                >
                  {convertedText || (
                    <span className="text-muted-foreground italic text-sm">
                      लिप्यन्तरित पाठ यहाँ दिखाई देगा...
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSpeech(convertedText)}
                    className="gap-1 text-xs rounded-xl h-8 text-primary"
                  >
                    <Volume2 className="size-3" /> उच्चारण सुनें
                  </Button>
                </div>

                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleCopy(convertedText, "लिप्यन्तरित पाठ")}
                  className="gap-1 text-xs rounded-xl h-8 shadow-sm"
                >
                  <Copy className="size-3" /> प्रतिलिपि (Copy)
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 2: MULTI-SCRIPT COMPARISON MATRIX */}
        <TabsContent value="matrix" className="space-y-6 pt-4 m-0">
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border border-border bg-card">
            <div className="text-xs text-muted-foreground">
              प्रविष्ट पाठ का <strong>13 विभिन्न लिपियों व रोमन स्कीमों</strong> में एक साथ सम्पूर्ण रूपान्तरण:
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadAll}
              className="text-xs gap-1 rounded-xl h-8"
            >
              <Download className="size-3 text-accent" /> समस्त लिपियाँ डाउनलोड
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.values(SCRIPT_REGISTRY).map((script) => (
              <div
                key={script.id}
                className="rounded-3xl border border-border/80 bg-card p-5 space-y-3 shadow-sm hover:border-primary/50 transition flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-border/50">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-sm text-foreground">
                        {script.nameEnglish}
                      </span>
                      <span className="font-devanagari text-xs text-muted-foreground">
                        ({script.nativeName})
                      </span>
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      {script.type === "indic" ? "भारतीय लिपि" : "रोमन पद्धति"}
                    </Badge>
                  </div>

                  <div className="font-devanagari text-lg leading-relaxed text-foreground font-medium p-2 rounded-xl bg-background/60 min-h-16 select-all whitespace-pre-wrap">
                    {allScriptsOutput[script.id]}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/40">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSpeech(allScriptsOutput[script.id])}
                    className="text-xs gap-1 h-7 text-muted-foreground"
                  >
                    <Volume2 className="size-3" /> सुनें
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(allScriptsOutput[script.id], script.nameEnglish)}
                    className="text-xs gap-1 h-7 rounded-xl"
                  >
                    <Copy className="size-3" /> कॉपी
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
