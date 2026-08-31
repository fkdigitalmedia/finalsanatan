import { useMemo, useState } from "react";
import {
  BookOpen,
  Calendar,
  Check,
  Compass,
  Copy,
  Download,
  Flame,
  HelpCircle,
  Image as ImageIcon,
  Info,
  Layers,
  Printer,
  RotateCcw,
  Share2,
  Shuffle,
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
import {
  getRandomWord,
  getWordForDate,
  SANSKRIT_WORDS_DATABASE,
  type SanskritWordEntry,
} from "./word-engine";

export function SanskritWordOfDayView() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [activeWord, setActiveWord] = useState<SanskritWordEntry>(() =>
    getWordForDate(new Date()),
  );
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleDateChange = (dStr: string) => {
    setSelectedDate(dStr);
    const d = new Date(dStr);
    if (!isNaN(d.getTime())) {
      setActiveWord(getWordForDate(d));
    }
  };

  const handleRandom = () => {
    const w = getRandomWord();
    setActiveWord(w);
    toast.success(`नया शब्द: '${w.devanagari}' खोजा गया!`);
  };

  const handleCopy = (str: string, label = "शब्द विवरण") => {
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

  const handleDownloadCard = () => {
    if (typeof document === "undefined") return;
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 700;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background Gradient (Saffron / Vedic Gold)
    const grad = ctx.createLinearGradient(0, 0, 1200, 700);
    grad.addColorStop(0, "#fff7ed");
    grad.addColorStop(0.5, "#ffedd5");
    grad.addColorStop(1, "#fed7aa");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 700);

    // Decorative Borders
    ctx.strokeStyle = "#ea580c";
    ctx.lineWidth = 8;
    ctx.strokeRect(30, 30, 1140, 640);
    ctx.strokeStyle = "#c2410c";
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, 1120, 620);

    // Header
    ctx.textAlign = "center";
    ctx.font = "bold 24px 'Noto Sans Devanagari', sans-serif";
    ctx.fillStyle = "#9a3412";
    ctx.fillText("॥ सनातन संस्कृत दैनिक शब्द ज्ञान ॥", 600, 95);

    // Word Calligraphy
    ctx.font = "bold 84px 'Noto Sans Devanagari', serif";
    ctx.fillStyle = "#7c2d12";
    ctx.fillText(activeWord.devanagari, 600, 200);

    // Transliteration & Gender
    ctx.font = "italic 26px sans-serif";
    ctx.fillStyle = "#c2410c";
    ctx.fillText(
      `${activeWord.transliteration} • ${activeWord.gender} • ${activeWord.category}`,
      600,
      250,
    );

    // Hindi & English Meaning
    ctx.font = "bold 28px 'Noto Sans Devanagari', sans-serif";
    ctx.fillStyle = "#1c1917";
    ctx.fillText(`अर्थ: ${activeWord.meaningHindi}`, 600, 320);

    ctx.font = "22px sans-serif";
    ctx.fillStyle = "#44403c";
    ctx.fillText(`(${activeWord.meaningEnglish})`, 600, 360);

    // Shloka Box
    ctx.fillStyle = "#fffbeb";
    ctx.fillRect(100, 400, 1000, 150);
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(100, 400, 1000, 150);

    ctx.font = "bold 22px 'Noto Sans Devanagari', serif";
    ctx.fillStyle = "#78350f";
    ctx.fillText(`"${activeWord.shloka.sanskrit}"`, 600, 455);

    ctx.font = "18px 'Noto Sans Devanagari', sans-serif";
    ctx.fillStyle = "#b45309";
    ctx.fillText(`— ${activeWord.shloka.source}`, 600, 505);

    // Footer
    ctx.font = "16px sans-serif";
    ctx.fillStyle = "#78716c";
    ctx.fillText("सनातन टूल्स • sanatantools.com/tools/sanskrit-word-of-day", 600, 630);

    const dataUrl = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `sanskrit-word-${activeWord.id}.png`;
    a.click();
    toast.success("दैनिक ज्ञान कार्ड डाउनलोड हो गया!");
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
              <Sparkles className="size-3.5" /> दैनिक संस्कृत शब्द एवं ज्ञान साधना
            </div>
            <h2 className="mt-2 font-display text-2xl md:text-3xl font-semibold">
              Daily Sanskrit Word of the Day (दैनिक संस्कृत पद)
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Deep etymological derivation (व्युत्पत्ति), Dhatu roots, scriptural context
              (Upanishad/Gita quotes), synonyms, and spiritual reflections.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRandom}
              className="rounded-full gap-1.5 text-xs"
            >
              <Shuffle className="size-3.5 text-primary" /> यादृच्छिक शब्द (Random)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadCard}
              className="rounded-full gap-1.5 text-xs"
            >
              <ImageIcon className="size-3.5 text-accent" /> कार्ड डाउनलोड
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="rounded-full gap-1.5 text-xs"
            >
              <Printer className="size-3.5" /> प्रिंट
            </Button>
          </div>
        </div>

        {/* DATE PICKER & WORD DIRECTORY PILLS */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              दिनांक चुनें:
            </span>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-40 h-8 text-xs bg-background rounded-full"
            />
          </div>

          {/* QUICK WORD PILLS */}
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {SANSKRIT_WORDS_DATABASE.map((w) => (
              <button
                key={w.id}
                onClick={() => setActiveWord(w)}
                className={`rounded-full border px-3 py-1 text-xs font-devanagari transition ${
                  activeWord.id === w.id
                    ? "border-primary bg-primary text-primary-foreground font-bold shadow-sm"
                    : "border-border bg-card hover:border-primary/40 text-foreground"
                }`}
              >
                {w.devanagari}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* HERO WORD CARD */}
      <div className="rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-card to-background p-6 md:p-10 shadow-card space-y-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex size-3 rounded-full bg-success animate-pulse" />
              <Badge variant="outline" className="text-xs font-mono">
                {activeWord.category}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {activeWord.gender}
              </Badge>
            </div>

            <div className="flex flex-wrap items-baseline gap-4">
              <h1 className="font-devanagari text-5xl md:text-7xl font-extrabold text-foreground tracking-wide">
                {activeWord.devanagari}
              </h1>
              <span className="font-mono text-xl md:text-2xl text-primary/90 font-semibold italic">
                [{activeWord.transliteration}]
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-xl md:text-2xl font-devanagari font-bold text-foreground">
                {activeWord.meaningHindi}
              </p>
              <p className="text-base text-muted-foreground font-medium">
                {activeWord.meaningEnglish}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 min-w-36">
            <Button
              variant="outline"
              onClick={() => handleSpeech(`${activeWord.devanagari}. ${activeWord.meaningHindi}`)}
              className="rounded-2xl gap-2 h-11"
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="size-4 text-destructive" /> रोके
                </>
              ) : (
                <>
                  <Volume2 className="size-4 text-primary" /> शुद्ध उच्चारण
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                handleCopy(
                  `॥ सनातन दैनिक संस्कृत शब्द ॥\n` +
                    `शब्द: ${activeWord.devanagari} [${activeWord.transliteration}]\n` +
                    `अर्थ: ${activeWord.meaningHindi} (${activeWord.meaningEnglish})\n` +
                    `व्युत्पत्ति: ${activeWord.etymology}\n` +
                    `श्लोक: "${activeWord.shloka.sanskrit}" — ${activeWord.shloka.source}\n` +
                    `विचार: ${activeWord.spiritualWisdom}\n\n` +
                    `विस्तार से देखें: https://www.sanatantools.com/tools/sanskrit-word-of-day`,
                  "सम्पूर्ण शब्द विवरण",
                )
              }
              className="rounded-2xl gap-2 h-11"
            >
              <Share2 className="size-4 text-accent" /> शेयर / कॉपी
            </Button>
          </div>
        </div>

        {/* ETYMOLOGY & DHATU ROOTS */}
        <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-border/70">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-1.5">
            <div className="text-xs font-semibold text-accent uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="size-3.5" /> धातु मूल एवं व्युत्पत्ति (Etymology)
            </div>
            <div className="font-devanagari text-base font-bold text-foreground">
              धातु: <span className="text-primary">{activeWord.rootDhatu}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {activeWord.etymology}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-1.5">
            <div className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="size-3.5" /> पर्यायवाची व विलोम शब्द (Synonyms & Antonyms)
            </div>
            <div className="text-xs space-y-1 pt-1">
              <div>
                <strong className="text-foreground">समानार्थी:</strong>{" "}
                <span className="text-muted-foreground font-devanagari">
                  {activeWord.synonyms.join(", ")}
                </span>
              </div>
              <div>
                <strong className="text-foreground">विलोम:</strong>{" "}
                <span className="text-muted-foreground font-devanagari">
                  {activeWord.antonyms.join(", ")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SCRIPTURAL CONTEXT (SHLOKA CITATION) */}
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <BookOpen className="size-4" /> शास्त्र प्रमाण एवं श्लोक सन्दर्भ (Scriptural Citation)
            </div>
            <Badge variant="outline" className="text-xs border-amber-500/40 text-amber-800 dark:text-amber-300">
              {activeWord.shloka.source}
            </Badge>
          </div>

          <div className="font-devanagari text-lg md:text-xl font-bold text-foreground leading-relaxed">
            "{activeWord.shloka.sanskrit}"
          </div>

          <div className="space-y-1 text-xs text-muted-foreground leading-relaxed pt-2 border-t border-amber-500/20">
            <p>
              <strong className="text-foreground">हिन्दी भावार्थ:</strong>{" "}
              {activeWord.shloka.meaningHindi}
            </p>
            <p>
              <strong className="text-foreground">English:</strong>{" "}
              {activeWord.shloka.meaningEnglish}
            </p>
          </div>
        </div>

        {/* SPIRITUAL WISDOM REFLECTION */}
        <div className="rounded-2xl border border-border bg-background p-6 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
            <Sparkles className="size-3.5" /> दैनिक चिन्तन व साधना महत्त्व (Spiritual Reflection)
          </div>
          <p className="text-sm font-devanagari text-foreground leading-relaxed font-medium">
            {activeWord.spiritualWisdom}
          </p>
        </div>
      </div>
    </div>
  );
}
