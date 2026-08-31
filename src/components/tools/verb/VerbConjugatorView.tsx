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
  Printer,
  RotateCcw,
  Search,
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
  DHATU_REPOSITORY,
  getDhatuById,
  LAKARA_DATABASE,
  type LakaraId,
} from "./verb-engine";

export function VerbConjugatorView() {
  const [selectedDhatuId, setSelectedDhatuId] = useState<string>("gam");
  const [activeLakara, setActiveLakara] = useState<LakaraId>("lat");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const dhatu = useMemo(() => getDhatuById(selectedDhatuId), [selectedDhatuId]);
  const lakaraInfo = LAKARA_DATABASE[activeLakara];
  const grid = dhatu.conjugations[activeLakara];

  const filteredDhatus = useMemo(() => {
    if (!searchQuery.trim()) return DHATU_REPOSITORY;
    const q = searchQuery.toLowerCase().trim();
    return DHATU_REPOSITORY.filter(
      (d) =>
        d.root.toLowerCase().includes(q) ||
        d.transliteration.toLowerCase().includes(q) ||
        d.meaningHindi.toLowerCase().includes(q) ||
        d.meaningEnglish.toLowerCase().includes(q) ||
        d.gana.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const handleCopy = (str: string, label = "धातु रूप") => {
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
      {/* HEADER BANNER */}
      <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-accent/5 p-6 md:p-8 shadow-elegant print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-border/60">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <BookOpen className="size-3.5" /> पाणिनीय धातु रूप एवं क्रिया रूपान्तरण
            </div>
            <h2 className="mt-2 font-display text-2xl md:text-3xl font-semibold">
              Advanced Sanskrit Verb Conjugator (धातु रूप साधन)
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Complete 5-Lakara conjugation matrix (लट्, लङ्, लृट्, लोट्, विधिलिङ्) with 3 Purushas,
              3 Vachanas, Gana classification, and usage examples.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="rounded-full gap-1.5 text-xs"
            >
              <Printer className="size-3.5" /> तालिका प्रिंट / PDF
            </Button>
          </div>
        </div>

        {/* DHATU SEARCH & QUICK SELECTOR */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              संस्कृत धातु चुनें (Select Verbal Root):
            </Label>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="धातु या अर्थ खोजें..."
                className="pl-8 h-8 text-xs bg-background rounded-full"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1 border border-border/50 rounded-2xl bg-background/50">
            {filteredDhatus.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDhatuId(d.id)}
                className={`rounded-xl border px-3 py-1.5 text-xs transition font-devanagari flex items-center gap-1.5 shadow-sm ${
                  selectedDhatuId === d.id
                    ? "border-primary bg-primary text-primary-foreground font-bold shadow-md"
                    : "border-border bg-card hover:border-primary/40 hover:bg-muted/40 text-foreground"
                }`}
              >
                <span>{d.root}</span>
                <span className="opacity-80 text-[10px]">({d.meaningHindi})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ACTIVE DHATU OVERVIEW CARD */}
      <div className="rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-card to-background p-6 md:p-8 shadow-card space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-3 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                चयनित धातु (Active Dhatu)
              </span>
              <Badge variant="outline" className="text-xs font-mono">
                {dhatu.gana}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {dhatu.pada}
              </Badge>
            </div>
            <h3 className="mt-2 font-devanagari text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
              <span>{dhatu.root}</span>
              <span className="text-base font-normal text-muted-foreground font-mono">
                [{dhatu.transliteration}]
              </span>
            </h3>
            <p className="mt-1 text-sm text-foreground font-medium">
              अर्थ: <span className="text-primary">{dhatu.meaningHindi}</span> ({dhatu.meaningEnglish})
            </p>
          </div>

          <div className="rounded-2xl border border-primary/20 bg-background/80 p-4 min-w-48 text-center space-y-1">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
              वाक्य प्रयोग (Example)
            </div>
            <div className="font-devanagari font-bold text-base text-foreground">
              {dhatu.exampleSentence.sanskrit}
            </div>
            <div className="text-xs text-muted-foreground">
              {dhatu.exampleSentence.hindi}
            </div>
          </div>
        </div>
      </div>

      {/* 5-LAKARA TABS & 3x3 CONJUGATION GRID */}
      <Card className="rounded-3xl border border-border shadow-elegant overflow-hidden bg-card">
        <Tabs
          value={activeLakara}
          onValueChange={(val) => setActiveLakara(val as LakaraId)}
          className="w-full"
        >
          <div className="px-6 pt-4 border-b border-border/50 bg-background/50 print:hidden">
            <TabsList className="bg-muted/60 p-1 rounded-2xl h-auto flex flex-wrap gap-1">
              {Object.values(LAKARA_DATABASE).map((lak) => (
                <TabsTrigger
                  key={lak.id}
                  value={lak.id}
                  className="rounded-xl py-2 px-3 sm:px-4 text-xs font-medium"
                >
                  {lak.nameSanskrit} ({lak.tense.split(" ")[0]})
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            {/* LAKARA DESCRIPTION & SUFFIX FORMULA */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border border-border bg-muted/20">
              <div>
                <div className="font-display font-bold text-base text-foreground">
                  {lakaraInfo.nameSanskrit} —{" "}
                  <span className="text-primary">{lakaraInfo.tense}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{lakaraInfo.description}</p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleCopy(
                    `${dhatu.root} - ${lakaraInfo.nameSanskrit}\n` +
                      `प्रथम पुरुष: ${grid.prathama.join(", ")}\n` +
                      `मध्यम पुरुष: ${grid.madhyama.join(", ")}\n` +
                      `उत्तम पुरुष: ${grid.uttama.join(", ")}`,
                    "सम्पूर्ण तालिका",
                  )
                }
                className="gap-1 text-xs rounded-xl"
              >
                <Copy className="size-3" /> तालिका कॉपी
              </Button>
            </div>

            {/* 3x3 CONJUGATION TABLE */}
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="bg-muted/40 border-b border-border">
                    <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-left">
                      पुरुष (Person)
                    </th>
                    <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-primary">
                      एकवचनम् (Singular)
                    </th>
                    <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-accent">
                      द्विवचनम् (Dual)
                    </th>
                    <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-success">
                      बहुवचनम् (Plural)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {/* ROW 1: PRATHAMA PURUSHA */}
                  <tr className="hover:bg-muted/10 transition">
                    <td className="py-4 px-4 text-left">
                      <div className="font-semibold text-sm text-foreground">प्रथम पुरुषः</div>
                      <div className="text-[11px] text-muted-foreground font-mono">
                        (Third Person - सह / तौ / ते)
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="inline-flex items-center gap-2">
                        <span className="font-devanagari text-xl font-bold text-foreground">
                          {grid.prathama[0]}
                        </span>
                        <button
                          onClick={() => handleSpeech(grid.prathama[0])}
                          className="text-muted-foreground hover:text-primary transition"
                        >
                          <Volume2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="inline-flex items-center gap-2">
                        <span className="font-devanagari text-xl font-bold text-foreground">
                          {grid.prathama[1]}
                        </span>
                        <button
                          onClick={() => handleSpeech(grid.prathama[1])}
                          className="text-muted-foreground hover:text-primary transition"
                        >
                          <Volume2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="inline-flex items-center gap-2">
                        <span className="font-devanagari text-xl font-bold text-foreground">
                          {grid.prathama[2]}
                        </span>
                        <button
                          onClick={() => handleSpeech(grid.prathama[2])}
                          className="text-muted-foreground hover:text-primary transition"
                        >
                          <Volume2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* ROW 2: MADHYAMA PURUSHA */}
                  <tr className="hover:bg-muted/10 transition">
                    <td className="py-4 px-4 text-left">
                      <div className="font-semibold text-sm text-foreground">मध्यम पुरुषः</div>
                      <div className="text-[11px] text-muted-foreground font-mono">
                        (Second Person - त्वम् / युवाम् / यूयम्)
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="inline-flex items-center gap-2">
                        <span className="font-devanagari text-xl font-bold text-foreground">
                          {grid.madhyama[0]}
                        </span>
                        <button
                          onClick={() => handleSpeech(grid.madhyama[0])}
                          className="text-muted-foreground hover:text-primary transition"
                        >
                          <Volume2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="inline-flex items-center gap-2">
                        <span className="font-devanagari text-xl font-bold text-foreground">
                          {grid.madhyama[1]}
                        </span>
                        <button
                          onClick={() => handleSpeech(grid.madhyama[1])}
                          className="text-muted-foreground hover:text-primary transition"
                        >
                          <Volume2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="inline-flex items-center gap-2">
                        <span className="font-devanagari text-xl font-bold text-foreground">
                          {grid.madhyama[2]}
                        </span>
                        <button
                          onClick={() => handleSpeech(grid.madhyama[2])}
                          className="text-muted-foreground hover:text-primary transition"
                        >
                          <Volume2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* ROW 3: UTTAMA PURUSHA */}
                  <tr className="hover:bg-muted/10 transition">
                    <td className="py-4 px-4 text-left">
                      <div className="font-semibold text-sm text-foreground">उत्तम पुरुषः</div>
                      <div className="text-[11px] text-muted-foreground font-mono">
                        (First Person - अहम् / आवाम् / वयम्)
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="inline-flex items-center gap-2">
                        <span className="font-devanagari text-xl font-bold text-foreground">
                          {grid.uttama[0]}
                        </span>
                        <button
                          onClick={() => handleSpeech(grid.uttama[0])}
                          className="text-muted-foreground hover:text-primary transition"
                        >
                          <Volume2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="inline-flex items-center gap-2">
                        <span className="font-devanagari text-xl font-bold text-foreground">
                          {grid.uttama[1]}
                        </span>
                        <button
                          onClick={() => handleSpeech(grid.uttama[1])}
                          className="text-muted-foreground hover:text-primary transition"
                        >
                          <Volume2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="inline-flex items-center gap-2">
                        <span className="font-devanagari text-xl font-bold text-foreground">
                          {grid.uttama[2]}
                        </span>
                        <button
                          onClick={() => handleSpeech(grid.uttama[2])}
                          className="text-muted-foreground hover:text-primary transition"
                        >
                          <Volume2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Tabs>
      </Card>
    </div>
  );
}
