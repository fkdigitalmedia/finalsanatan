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
  Languages,
  Layers,
  MessageSquare,
  Printer,
  RotateCcw,
  Search,
  Share2,
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
  AMARAKOSHA_CLUSTERS,
  DICTIONARY_DATABASE,
  type DictWord,
  searchDictionary,
  type WordCategory,
} from "./dictionary-engine";

const VARNAMALA_LETTERS = [
  "all",
  "अ",
  "आ",
  "इ",
  "ई",
  "उ",
  "ऋ",
  "ए",
  "क",
  "ग",
  "च",
  "त",
  "द",
  "ध",
  "न",
  "प",
  "प्र",
  "ब",
  "भ",
  "म",
  "य",
  "र",
  "ल",
  "व",
  "श",
  "स",
  "ह",
];

const CATEGORIES: { id: string; label: string }[] = [
  { id: "all", label: "सभी वर्ग (All)" },
  { id: "वेदान्त व दर्शन", label: "वेदान्त व दर्शन" },
  { id: "नीति, धर्म व आचरण", label: "नीति व धर्म" },
  { id: "योग, आयुर्वेद व साधना", label: "योग व आयुर्वेद" },
  { id: "वैदिक यज्ञ व अनुष्ठान", label: "वैदिक यज्ञ" },
  { id: "दैनिक व व्यावहारिक संस्कृत", label: "दैनिक सम्भाषण" },
];

export function SanskritDictionaryView() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLetter, setSelectedLetter] = useState<string>("all");
  const [activeWordModal, setActiveWordModal] = useState<DictWord | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const filteredWords = useMemo(
    () => searchDictionary(searchQuery, selectedCategory, selectedLetter),
    [searchQuery, selectedCategory, selectedLetter],
  );

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
      {/* HEADER BANNER */}
      <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-accent/5 p-6 md:p-8 shadow-elegant print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-border/60">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <BookOpen className="size-3.5" /> पाणिनीय संस्कृत महा-शब्दकोश एवं अमरकोश
            </div>
            <h2 className="mt-2 font-display text-2xl md:text-3xl font-semibold">
              Advanced Sanskrit & Vedic Lexicon (संस्कृत शब्दकोश)
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Searchable Sanskrit-Hindi-English lexicon with Paninian etymology (व्युत्पत्ति),
              Dhatu roots, scriptural quotes, Amarakosha synonyms, and voice pronunciation.
            </p>
          </div>

          <div className="flex items-center gap-2">
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

        {/* SEARCH BAR & CATEGORY FILTER */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 size-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="खोजें: देवनागरी (धर्म, सत्य), IAST (dharma, moksha), या English (liberation, truth)..."
                className="pl-11 h-12 text-base bg-background font-devanagari rounded-2xl shadow-inner border-border/80"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-3 text-muted-foreground hover:text-foreground text-xs bg-muted/60 rounded-full px-2 py-0.5"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 sm:max-w-md">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-xl border px-3 py-1.5 text-xs font-medium transition ${
                    selectedCategory === cat.id
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border bg-background hover:border-primary/40 text-muted-foreground"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* VARNAMALA ALPHABET PICKER */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-muted-foreground font-semibold text-[11px] uppercase tracking-wider pr-1">
              वर्ण:
            </span>
            {VARNAMALA_LETTERS.map((letter) => (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                className={`flex size-7 items-center justify-center rounded-lg border font-devanagari transition text-xs shrink-0 ${
                  selectedLetter === letter
                    ? "border-primary bg-primary text-primary-foreground font-bold"
                    : "border-border bg-background/80 hover:border-primary/40 text-foreground"
                }`}
              >
                {letter === "all" ? "सब" : letter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT TABS */}
      <Tabs defaultValue="dictionary" className="w-full">
        <div className="border-b border-border/70 pb-2 print:hidden">
          <TabsList className="bg-muted/60 p-1 rounded-2xl h-auto flex flex-wrap gap-1">
            <TabsTrigger value="dictionary" className="rounded-xl py-2 px-4 text-xs font-medium">
              📚 संस्कृत शब्दकोश सूची ({filteredWords.length})
            </TabsTrigger>
            <TabsTrigger value="amarakosha" className="rounded-xl py-2 px-4 text-xs font-medium">
              🪔 अमरकोश पर्याय-चक्र (Synonym Clusters)
            </TabsTrigger>
            <TabsTrigger value="conversation" className="rounded-xl py-2 px-4 text-xs font-medium">
              🗣️ दैनिक व्यावहारिक सम्भाषण (Daily Phrases)
            </TabsTrigger>
          </TabsList>
        </div>

        {/* TAB 1: SEARCHABLE DICTIONARY GRID */}
        <TabsContent value="dictionary" className="space-y-6 pt-4 m-0">
          {filteredWords.length === 0 ? (
            <Card className="rounded-3xl border border-dashed border-border p-12 text-center space-y-3">
              <BookOpen className="size-8 mx-auto text-muted-foreground" />
              <div className="font-display font-semibold text-lg">कोई शब्द नहीं मिला</div>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                आपके खोज शब्द '{searchQuery}' के लिए कोई प्रविष्टि नहीं मिली। कृपया कोई अन्य शब्द खोजें
                या फिल्टर बदलें।
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedLetter("all");
                }}
                className="rounded-full text-xs"
              >
                फ़िल्टर रीसेट करें
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredWords.map((word) => (
                <div
                  key={word.id}
                  className="group relative rounded-3xl border border-border/80 bg-card hover:border-primary/50 transition-all p-6 shadow-sm hover:shadow-elegant flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-devanagari text-2xl md:text-3xl font-bold text-foreground group-hover:text-primary transition">
                            {word.devanagari}
                          </h3>
                          <button
                            onClick={() => handleSpeech(word.devanagari)}
                            className="text-muted-foreground hover:text-primary transition p-1"
                            title="उच्चारण सुनें"
                          >
                            <Volume2 className="size-4" />
                          </button>
                        </div>
                        <div className="font-mono text-xs text-primary/80 italic font-semibold">
                          [{word.transliteration}]
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="outline" className="text-[10px]">
                          {word.category}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px]">
                          {word.gender}
                        </Badge>
                      </div>
                    </div>

                    {/* MEANING */}
                    <div className="space-y-1">
                      <p className="text-sm font-devanagari font-semibold text-foreground leading-relaxed">
                        {word.meaningHindi}
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {word.meaningEnglish}
                      </p>
                    </div>

                    {/* ETYMOLOGY & ROOTS */}
                    {word.rootDhatu && (
                      <div className="rounded-xl border border-border/60 bg-muted/20 p-2.5 text-xs text-muted-foreground space-y-0.5">
                        <div>
                          <strong className="text-foreground">धातु मूल:</strong>{" "}
                          <span className="text-primary font-devanagari">{word.rootDhatu}</span>
                        </div>
                        {word.etymology && (
                          <div className="text-[11px] font-devanagari text-muted-foreground/90">
                            {word.etymology}
                          </div>
                        )}
                      </div>
                    )}

                    {/* SCRIPTURE CITATION PREVIEW */}
                    {word.scriptureCitation && (
                      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-2.5 text-xs space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider">
                          <span>शास्त्र प्रमाण</span>
                          <span>{word.scriptureCitation.source}</span>
                        </div>
                        <div className="font-devanagari text-xs font-semibold text-foreground line-clamp-2">
                          "{word.scriptureCitation.shloka}"
                        </div>
                      </div>
                    )}

                    {/* SYNONYMS TAGS */}
                    {word.synonyms.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        <span className="text-[11px] text-muted-foreground font-semibold">पर्याय:</span>
                        {word.synonyms.slice(0, 4).map((syn, sIdx) => (
                          <span
                            key={sIdx}
                            className="rounded-md border border-border/50 bg-background px-1.5 py-0.5 text-[10px] font-devanagari text-muted-foreground"
                          >
                            {syn}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ACTION BAR */}
                  <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleCopy(
                          `शब्द: ${word.devanagari} [${word.transliteration}]\n` +
                            `अर्थ: ${word.meaningHindi} (${word.meaningEnglish})\n` +
                            `धातु: ${word.rootDhatu || "N/A"}\n` +
                            `पर्याय: ${word.synonyms.join(", ")}`,
                          "शब्द विवरण",
                        )
                      }
                      className="text-xs gap-1 h-8 rounded-xl"
                    >
                      <Copy className="size-3" /> कॉपी
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSpeech(`${word.devanagari}. ${word.meaningHindi}`)}
                      className="text-xs gap-1 h-8 rounded-xl text-primary"
                    >
                      <Volume2 className="size-3" /> सुनें
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* TAB 2: AMARAKOSHA SYNONYMS EXPLORER */}
        <TabsContent value="amarakosha" className="space-y-6 pt-4 m-0">
          <div className="text-xs text-muted-foreground pb-2 border-b border-border/50">
            प्राचीन शास्त्रीय <strong>अमरकोश (Amarakosha)</strong> के आधार पर प्रमुख वैदिक व प्राकृतिक तत्वों के
            समानार्थी शब्द-समूह:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {AMARAKOSHA_CLUSTERS.map((cluster, cIdx) => (
              <Card
                key={cIdx}
                className="rounded-3xl border border-primary/20 bg-gradient-to-br from-card to-background p-6 shadow-card space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-devanagari text-xl font-bold text-foreground">
                      {cluster.devanagari}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {cluster.meaningHindi} ({cluster.meaningEnglish})
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(cluster.synonyms.join(", "), cluster.concept)}
                    className="text-xs gap-1 h-8 rounded-xl"
                  >
                    <Copy className="size-3" /> सभी कॉपी
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {cluster.synonyms.map((syn, sIdx) => (
                    <div
                      key={sIdx}
                      className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-1.5 font-devanagari text-sm font-semibold text-foreground hover:border-primary/50 transition flex items-center gap-1.5"
                    >
                      <Sparkles className="size-3 text-primary" />
                      <span>{syn}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* TAB 3: DAILY CONVERSATIONAL SANSKRIT */}
        <TabsContent value="conversation" className="space-y-6 pt-4 m-0">
          <div className="text-xs text-muted-foreground pb-2 border-b border-border/50">
            दैनिक जीवन में प्रयुक्त होने वाले शिष्टाचार व सम्भाषण के व्यावहारिक संस्कृत वाक्य:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {DICTIONARY_DATABASE.filter(
              (w) => w.category === "दैनिक व व्यावहारिक संस्कृत",
            ).map((phrase) => (
              <div
                key={phrase.id}
                className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-sm hover:border-primary/40 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-devanagari text-xl font-bold text-foreground">
                      {phrase.devanagari}
                    </div>
                    <div className="font-mono text-xs text-primary font-semibold">
                      [{phrase.transliteration}]
                    </div>
                  </div>
                  <button
                    onClick={() => handleSpeech(phrase.devanagari)}
                    className="text-muted-foreground hover:text-primary transition p-1.5 rounded-full bg-muted/40"
                  >
                    <Volume2 className="size-3.5" />
                  </button>
                </div>

                <div className="text-xs text-foreground font-semibold font-devanagari">
                  अर्थ: {phrase.meaningHindi}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  ({phrase.meaningEnglish})
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
