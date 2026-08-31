import { useMemo, useRef, useState } from "react";
import {
  AlignLeft,
  BookOpen,
  Check,
  ChevronDown,
  Copy,
  Download,
  FileText,
  Flame,
  Image as ImageIcon,
  Keyboard,
  Languages,
  Printer,
  RotateCcw,
  Sparkles,
  Type,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  analyzeDevanagariText,
  devanagariToHarvardKyoto,
  devanagariToIast,
  INSCRIPT_KEYS_NORMAL,
  INSCRIPT_KEYS_SHIFT,
  phoneticToDevanagari,
  PRESET_SHLOKAS,
  type PresetSnippet,
  VARNAMALA_LAYOUT,
} from "./devanagari-engine";

export function DevanagariTypingStudio() {
  const [text, setText] = useState<string>(
    "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥",
  );
  const [phoneticInput, setPhoneticInput] = useState<string>("");
  const [inputMode, setInputMode] = useState<"phonetic" | "virtual">("phonetic");
  const [keyboardLayout, setKeyboardLayout] = useState<"varnamala" | "inscript">("varnamala");
  const [inscriptShift, setInscriptShift] = useState<boolean>(false);
  const [varnamalaTab, setVarnamalaTab] = useState<
    "swar" | "vyanjan" | "matras" | "conjuncts" | "vedic" | "numerals"
  >("vyanjan");

  const [fontSize, setFontSize] = useState<number>(22);
  const [cardTheme, setCardTheme] = useState<"saffron" | "gold" | "dark" | "parchment">("saffron");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const metrics = useMemo(() => analyzeDevanagariText(text), [text]);
  const iastText = useMemo(() => devanagariToIast(text), [text]);
  const hkText = useMemo(() => devanagariToHarvardKyoto(text), [text]);

  const handlePhoneticChange = (val: string) => {
    setPhoneticInput(val);
    const converted = phoneticToDevanagari(val);
    setText(converted);
  };

  const insertChar = (char: string) => {
    if (!textareaRef.current) {
      setText((t) => t + char);
      return;
    }
    const el = textareaRef.current;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const current = el.value;
    const updated = current.substring(0, start) + char + current.substring(end);
    setText(updated);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + char.length, start + char.length);
    }, 10);
  };

  const handleBackspace = () => {
    if (!textareaRef.current) {
      setText((t) => t.slice(0, -1));
      return;
    }
    const el = textareaRef.current;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const current = el.value;
    if (start === end && start > 0) {
      const updated = current.substring(0, start - 1) + current.substring(end);
      setText(updated);
      setTimeout(() => {
        el.focus();
        el.setSelectionRange(start - 1, start - 1);
      }, 10);
    } else if (start !== end) {
      const updated = current.substring(0, start) + current.substring(end);
      setText(updated);
      setTimeout(() => {
        el.focus();
        el.setSelectionRange(start, start);
      }, 10);
    }
  };

  const handleClear = () => {
    setText("");
    setPhoneticInput("");
    toast.success("टेक्स्ट साफ़ कर दिया गया");
  };

  const handleCopy = (str: string, label = "टेक्स्ट") => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(str);
      toast.success(`${label} क्लिपबोर्ड पर कॉपी हो गया!`);
    }
  };

  const handleDownloadTxt = () => {
    if (typeof document === "undefined") return;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `devanagari-text-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("फाइल डाउनलोड हो गई!");
  };

  const handleDownloadImage = () => {
    if (typeof document === "undefined") return;
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 700;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Theme backgrounds
    if (cardTheme === "saffron") {
      const grad = ctx.createLinearGradient(0, 0, 1200, 700);
      grad.addColorStop(0, "#fff7ed");
      grad.addColorStop(0.5, "#ffedd5");
      grad.addColorStop(1, "#fed7aa");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1200, 700);
      ctx.strokeStyle = "#c2410c";
    } else if (cardTheme === "dark") {
      ctx.fillStyle = "#09090b";
      ctx.fillRect(0, 0, 1200, 700);
      ctx.strokeStyle = "#ea580c";
    } else if (cardTheme === "gold") {
      const grad = ctx.createLinearGradient(0, 0, 1200, 700);
      grad.addColorStop(0, "#fefce8");
      grad.addColorStop(1, "#fef08a");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1200, 700);
      ctx.strokeStyle = "#ca8a04";
    } else {
      ctx.fillStyle = "#fbfaf8";
      ctx.fillRect(0, 0, 1200, 700);
      ctx.strokeStyle = "#78350f";
    }

    // Border
    ctx.lineWidth = 8;
    ctx.strokeRect(30, 30, 1140, 640);
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, 1120, 620);

    // Header motif
    ctx.font = "bold 32px serif";
    ctx.fillStyle = cardTheme === "dark" ? "#f97316" : "#9a3412";
    ctx.textAlign = "center";
    ctx.fillText("॥ ॐ ॥", 600, 100);

    // Main Text
    ctx.fillStyle = cardTheme === "dark" ? "#fafafa" : "#1c1917";
    ctx.font = "32px 'Noto Sans Devanagari', 'Sanskrit Text', 'Arial Unicode MS', serif";

    // Text wrapping
    const maxW = 1000;
    const words = text.split(" ");
    let line = "";
    let y = 180;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metricsW = ctx.measureText(testLine);
      if (metricsW.width > maxW && n > 0) {
        ctx.fillText(line, 600, y);
        line = words[n] + " ";
        y += 54;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 600, y);

    // Footer
    ctx.font = "16px sans-serif";
    ctx.fillStyle = cardTheme === "dark" ? "#a1a1aa" : "#78716c";
    ctx.fillText("सनातन टूल्स • sanatantools.com/tools/devanagari-typing", 600, 620);

    const dataUrl = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `devanagari-card-${Date.now()}.png`;
    a.click();
    toast.success("सुन्दर इमेज कार्ड डाउनलोड हो गया!");
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <div className="space-y-8 print:p-0">
      {/* CONTROLS HEADER */}
      <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-accent/5 p-6 md:p-8 shadow-elegant print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-border/60">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Type className="size-3.5" /> देवनागरी एवं संस्कृत टाइपिंग स्टूडियो
            </div>
            <h2 className="mt-2 font-display text-2xl md:text-3xl font-semibold">
              Advanced Devanagari & Vedic Typing Studio
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Smart Phonetic typing (English to Devanagari), Vedic accents (॒ ॑ ॐ), Inscript layout,
              and IAST script converter.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={inputMode === "phonetic" ? "default" : "outline"}
              size="sm"
              onClick={() => setInputMode("phonetic")}
              className="rounded-full gap-1.5"
            >
              <Wand2 className="size-3.5" /> स्मार्ट फोनेटिक (Phonetic)
            </Button>
            <Button
              variant={inputMode === "virtual" ? "default" : "outline"}
              size="sm"
              onClick={() => setInputMode("virtual")}
              className="rounded-full gap-1.5"
            >
              <Keyboard className="size-3.5" /> वर्चुअल कीबोर्ड (On-Screen)
            </Button>
          </div>
        </div>

        {/* PHONETIC INPUT HELPER */}
        {inputMode === "phonetic" && (
          <div className="space-y-3 rounded-2xl border border-primary/20 bg-card/60 p-4">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="size-3.5" /> Type in English / Hinglish (Physical Keyboard)
              </Label>
              <span className="text-[11px] text-muted-foreground">
                Try: <code>om namah shivaya</code> ➔ <code>ॐ नमः शिवाय</code>
              </span>
            </div>
            <Input
              value={phoneticInput}
              onChange={(e) => handlePhoneticChange(e.target.value)}
              placeholder="Type English phonetically here... (e.g. shri ram jaya ram, gayatri, dharmakshetre)"
              className="bg-background text-base font-mono"
              autoFocus
            />
          </div>
        )}

        {/* QUICK SHLOKA PRESET PILLS */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-semibold text-muted-foreground shrink-0">
            Quick Insert:
          </span>
          {PRESET_SHLOKAS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setText(item.devanagari);
                toast.success(`${item.title} डाला गया!`);
              }}
              className="shrink-0 rounded-full border border-border bg-background px-3 py-1 text-xs hover:border-primary/50 hover:bg-primary/5 transition font-devanagari"
            >
              {item.title}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN EDITOR & WORKSPACE */}
      <Card className="rounded-3xl border border-border shadow-elegant overflow-hidden bg-card">
        {/* TOP TOOLBAR */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5 border-b border-border/70 bg-muted/30 print:hidden">
          <div className="flex flex-wrap items-center gap-2">
            {/* Quick punctuation buttons */}
            <span className="text-xs font-medium text-muted-foreground mr-1">चिह्न:</span>
            {["।", "॥", "ॐ", "ऽ", "॑", "॒", "卐", "ः", "ं", "ँ"].map((symbol) => (
              <button
                key={symbol}
                onClick={() => insertChar(symbol)}
                className="size-7 rounded-lg border border-border bg-background hover:bg-primary hover:text-primary-foreground font-devanagari text-sm font-bold transition grid place-items-center"
                title={`Insert ${symbol}`}
              >
                {symbol}
              </button>
            ))}
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
                onClick={() => setFontSize((s) => Math.min(36, s + 2))}
                className="px-1 font-bold"
              >
                A+
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(text, "देवनागरी")}
              className="gap-1 text-xs rounded-xl"
            >
              <Copy className="size-3" /> कॉपी
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="gap-1 text-xs rounded-xl text-muted-foreground"
            >
              <RotateCcw className="size-3" /> रीसेट
            </Button>
          </div>
        </div>

        {/* TEXTAREA WRITING AREA */}
        <div className="p-6 md:p-8 bg-background/50">
          <Textarea
            ref={textareaRef}
            rows={7}
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
            className="font-devanagari border-border/80 focus-visible:ring-primary shadow-inner rounded-2xl resize-y"
            placeholder="यहाँ देवनागरी में लिखें या नीचे वर्चुअल कीबोर्ड की कुंजियाँ दबाएँ..."
          />

          {/* METRICS STRIP */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground pt-3 border-t border-border/50">
            <div className="flex flex-wrap items-center gap-4">
              <span>
                अक्षर (Characters): <strong className="text-foreground">{metrics.charactersNoSpaces}</strong>
              </span>
              <span>
                शब्द (Words): <strong className="text-foreground">{metrics.words}</strong>
              </span>
              <span>
                वर्ण / अक्षर (Syllables):{" "}
                <strong className="text-primary">{metrics.aksharaCount}</strong>
              </span>
              <span>
                मात्राएं: <strong className="text-accent">{metrics.matraCount}</strong>
              </span>
              <span>
                स्वर: <strong className="text-foreground">{metrics.swarCount}</strong>
              </span>
              <span>
                व्यंजन: <strong className="text-foreground">{metrics.vyanjanCount}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownloadTxt}
                className="h-7 text-xs text-primary gap-1"
              >
                <Download className="size-3" /> .TXT
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrint}
                className="h-7 text-xs gap-1"
              >
                <Printer className="size-3" /> प्रिंट
              </Button>
            </div>
          </div>
        </div>

        {/* VIRTUAL KEYBOARDS SECTION */}
        {inputMode === "virtual" && (
          <div className="p-6 border-t border-border/70 bg-muted/20 space-y-4 print:hidden">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Keyboard className="size-4 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  वर्चुअल कीबोर्ड लेआउट
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={keyboardLayout === "varnamala" ? "default" : "outline"}
                  onClick={() => setKeyboardLayout("varnamala")}
                  className="h-8 text-xs rounded-lg"
                >
                  वर्णमाला ग्रिड
                </Button>
                <Button
                  size="sm"
                  variant={keyboardLayout === "inscript" ? "default" : "outline"}
                  onClick={() => setKeyboardLayout("inscript")}
                  className="h-8 text-xs rounded-lg"
                >
                  मानक इनस्क्रिप्ट (Inscript)
                </Button>
              </div>
            </div>

            {/* LAYOUT 1: VARNAMALA CATEGORIZED */}
            {keyboardLayout === "varnamala" && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-1.5 border-b border-border/50 pb-2">
                  {[
                    { id: "vyanjan", label: "व्यंजन (Consonants)" },
                    { id: "swar", label: "स्वर (Vowels)" },
                    { id: "matras", label: "मात्राएं (Matras)" },
                    { id: "conjuncts", label: "संयुक्ताक्षर" },
                    { id: "vedic", label: "वैदिक स्वर व ॐ" },
                    { id: "numerals", label: "अंक (०-९)" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setVarnamalaTab(tab.id as any)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                        varnamalaTab === tab.id
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-background text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="p-2 bg-background/80 rounded-2xl border border-border/80">
                  {varnamalaTab === "vyanjan" && (
                    <div className="space-y-2">
                      {VARNAMALA_LAYOUT.vyanjanRows.map((row, ri) => (
                        <div key={ri} className="flex flex-wrap gap-1.5 justify-center">
                          {row.map((k) => (
                            <button
                              key={k}
                              onClick={() => insertChar(k)}
                              className="size-10 sm:w-12 rounded-xl border border-border bg-card hover:bg-primary hover:text-primary-foreground font-devanagari text-lg font-bold transition shadow-sm"
                            >
                              {k}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}

                  {varnamalaTab === "swar" && (
                    <div className="flex flex-wrap gap-2 justify-center py-2">
                      {VARNAMALA_LAYOUT.swar.map((k) => (
                        <button
                          key={k}
                          onClick={() => insertChar(k)}
                          className="size-11 sm:w-14 rounded-xl border border-border bg-card hover:bg-primary hover:text-primary-foreground font-devanagari text-xl font-bold transition shadow-sm"
                        >
                          {k}
                        </button>
                      ))}
                    </div>
                  )}

                  {varnamalaTab === "matras" && (
                    <div className="flex flex-wrap gap-2 justify-center py-2">
                      {VARNAMALA_LAYOUT.matras.map((k) => (
                        <button
                          key={k}
                          onClick={() => insertChar(k)}
                          className="size-11 sm:w-14 rounded-xl border border-border bg-card hover:bg-primary hover:text-primary-foreground font-devanagari text-2xl font-bold transition shadow-sm"
                        >
                          {k}
                        </button>
                      ))}
                    </div>
                  )}

                  {varnamalaTab === "conjuncts" && (
                    <div className="flex flex-wrap gap-2 justify-center py-2">
                      {VARNAMALA_LAYOUT.sanyuktakshar.map((k) => (
                        <button
                          key={k}
                          onClick={() => insertChar(k)}
                          className="h-11 px-4 rounded-xl border border-border bg-card hover:bg-primary hover:text-primary-foreground font-devanagari text-lg font-bold transition shadow-sm"
                        >
                          {k}
                        </button>
                      ))}
                    </div>
                  )}

                  {varnamalaTab === "vedic" && (
                    <div className="flex flex-wrap gap-2 justify-center py-2">
                      {VARNAMALA_LAYOUT.vedicAccents.map((k) => (
                        <button
                          key={k}
                          onClick={() => insertChar(k)}
                          className="size-12 rounded-xl border border-border bg-card hover:bg-primary hover:text-primary-foreground font-devanagari text-2xl font-bold transition shadow-sm"
                        >
                          {k}
                        </button>
                      ))}
                    </div>
                  )}

                  {varnamalaTab === "numerals" && (
                    <div className="flex flex-wrap gap-2 justify-center py-2">
                      {VARNAMALA_LAYOUT.numerals.map((k) => (
                        <button
                          key={k}
                          onClick={() => insertChar(k)}
                          className="size-11 sm:w-14 rounded-xl border border-border bg-card hover:bg-primary hover:text-primary-foreground font-devanagari text-xl font-bold transition shadow-sm"
                        >
                          {k}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleBackspace} className="gap-1">
                    ⌫ Backspace
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => insertChar(" ")}
                    className="w-48"
                  >
                    Spacebar (रिक्त स्थान)
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => insertChar("\n")}>
                    ↵ Enter (नई पंक्ति)
                  </Button>
                </div>
              </div>
            )}

            {/* LAYOUT 2: INSCRIPT */}
            {keyboardLayout === "inscript" && (
              <div className="space-y-3">
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    variant={inscriptShift ? "default" : "outline"}
                    onClick={() => setInscriptShift((s) => !s)}
                    className="h-8 text-xs gap-1"
                  >
                    Shift Mode {inscriptShift ? "(ON)" : "(OFF)"}
                  </Button>
                </div>

                <div className="space-y-1.5 bg-background p-3 rounded-2xl border border-border">
                  {(inscriptShift ? INSCRIPT_KEYS_SHIFT : INSCRIPT_KEYS_NORMAL).map((row, ri) => (
                    <div key={ri} className="flex gap-1 justify-center">
                      {row.map((k) => (
                        <button
                          key={k}
                          onClick={() => insertChar(k)}
                          className="size-9 sm:size-11 rounded-lg border border-border bg-card hover:bg-primary hover:text-primary-foreground font-devanagari text-base font-bold transition"
                        >
                          {k}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="flex justify-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleBackspace}>
                    ⌫ Backspace
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => insertChar(" ")}
                    className="w-48"
                  >
                    Space
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TRANSLITERATION & SCRIPT CONVERTER TABS */}
        <div className="p-6 md:p-8 border-t border-border/70 bg-card">
          <Tabs defaultValue="iast" className="w-full">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Languages className="size-4 text-accent" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  लिपि रूपान्तरण (Script Transliteration)
                </span>
              </div>
              <TabsList className="bg-muted p-1 rounded-xl h-auto">
                <TabsTrigger value="iast" className="text-xs rounded-lg py-1.5 px-3">
                  IAST (Diacritics)
                </TabsTrigger>
                <TabsTrigger value="hk" className="text-xs rounded-lg py-1.5 px-3">
                  Harvard-Kyoto
                </TabsTrigger>
                <TabsTrigger value="imageCard" className="text-xs rounded-lg py-1.5 px-3">
                  🎨 सुलेख PNG कार्ड
                </TabsTrigger>
              </TabsList>
            </div>

            {/* IAST TAB */}
            <TabsContent value="iast" className="space-y-3 m-0">
              <div className="rounded-2xl border border-border bg-muted/20 p-4 font-mono text-sm leading-relaxed overflow-x-auto">
                {iastText || <span className="text-muted-foreground italic">No text yet...</span>}
              </div>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(iastText, "IAST")}
                  className="gap-1 text-xs"
                >
                  <Copy className="size-3" /> Copy IAST
                </Button>
              </div>
            </TabsContent>

            {/* HARVARD-KYOTO TAB */}
            <TabsContent value="hk" className="space-y-3 m-0">
              <div className="rounded-2xl border border-border bg-muted/20 p-4 font-mono text-sm leading-relaxed overflow-x-auto">
                {hkText || <span className="text-muted-foreground italic">No text yet...</span>}
              </div>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(hkText, "Harvard-Kyoto")}
                  className="gap-1 text-xs"
                >
                  <Copy className="size-3" /> Copy HK
                </Button>
              </div>
            </TabsContent>

            {/* IMAGE CARD GENERATOR TAB */}
            <TabsContent value="imageCard" className="space-y-4 m-0">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/30 p-3.5 rounded-2xl border border-border">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground">थीम चयन:</span>
                  {(
                    [
                      { id: "saffron", label: "भगवा (Saffron)" },
                      { id: "gold", label: "स्वर्ण (Gold)" },
                      { id: "dark", label: "डार्क (Night)" },
                      { id: "parchment", label: "पाण्डुलिपि (Parchment)" },
                    ] as const
                  ).map((th) => (
                    <button
                      key={th.id}
                      onClick={() => setCardTheme(th.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                        cardTheme === th.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-background border border-border hover:bg-muted"
                      }`}
                    >
                      {th.label}
                    </button>
                  ))}
                </div>

                <Button
                  onClick={handleDownloadImage}
                  size="sm"
                  className="gap-1.5 text-xs rounded-xl shadow-glow"
                >
                  <ImageIcon className="size-3.5" /> PNG इमेज डाउनलोड करें
                </Button>
              </div>

              {/* CARD PREVIEW */}
              <div
                className={`p-8 rounded-3xl border-4 text-center transition ${
                  cardTheme === "saffron"
                    ? "bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 border-orange-300 text-orange-950"
                    : cardTheme === "gold"
                      ? "bg-gradient-to-br from-yellow-50 to-amber-100 border-amber-400 text-amber-950"
                      : cardTheme === "dark"
                        ? "bg-zinc-950 border-orange-500/40 text-zinc-100"
                        : "bg-[#fbfaf8] border-amber-900/30 text-amber-950"
                }`}
              >
                <div className="text-3xl font-serif mb-3 opacity-90">॥ ॐ ॥</div>
                <div className="font-devanagari text-xl md:text-2xl leading-loose font-medium max-w-2xl mx-auto whitespace-pre-wrap">
                  {text || "यहाँ आपका श्लोक अथवा मन्त्र प्रदर्शित होगा..."}
                </div>
                <div className="mt-6 pt-4 border-t border-current/10 text-xs opacity-70">
                  सनातन टूल्स • sanatantools.com
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
}
