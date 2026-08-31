import { useMemo, useState } from "react";
import {
  Bell,
  BookOpen,
  Calendar as CalendarIcon,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Compass,
  Copy,
  Download,
  Flame,
  HelpCircle,
  Info,
  Layers,
  MapPin,
  Moon,
  Printer,
  RotateCcw,
  Share2,
  Sparkles,
  Sun,
  Volume2,
  VolumeX,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LocationPicker } from "@/components/tools/LocationPicker";
import { useLocation } from "@/lib/location";
import {
  calculatePradoshDatesForYear,
  type DayType,
  getNextUpcomingPradosh,
  PRADOSH_PUJA_STEPS,
  PRADOSHA_DAY_METADATA,
  type PradoshDateEntry,
  SHIVA_STOTRAS,
} from "./pradosh-engine";

export function PradoshVratView() {
  const [loc, setLoc] = useLocation();
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>("all");
  const [selectedPakshaFilter, setSelectedPakshaFilter] = useState<string>("all");
  const [activeKathaDay, setActiveKathaDay] = useState<DayType>("soma");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Compute all Pradosh dates for the year
  const allPradoshDates = useMemo(
    () => calculatePradoshDatesForYear(selectedYear, loc),
    [selectedYear, loc],
  );

  // Next upcoming Pradosh
  const nextPradosh = useMemo(() => getNextUpcomingPradosh(loc), [loc]);

  // Filtered list
  const filteredList = useMemo(() => {
    return allPradoshDates.filter((p) => {
      if (selectedDayFilter !== "all" && p.dayType !== selectedDayFilter) return false;
      if (selectedPakshaFilter !== "all" && p.paksha !== selectedPakshaFilter) return false;
      return true;
    });
  }, [allPradoshDates, selectedDayFilter, selectedPakshaFilter]);

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

  const handleDownloadICS = (entry: PradoshDateEntry) => {
    if (typeof document === "undefined") return;

    const startISO = entry.pradoshKaalStart
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
    const endISO = entry.pradoshKaalEnd
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SanatanTools//Pradosh Vrat Calendar//EN
BEGIN:VEVENT
UID:pradosh-${entry.dateString}@sanatantools.com
DTSTAMP:${startISO}
DTSTART:${startISO}
DTEND:${endISO}
SUMMARY:${entry.dayTypeNameHindi} - ${entry.tithiName}
DESCRIPTION:प्रदोष काल मुहूर्त: ${entry.muhurtaFormatted}.\\nस्थान: ${loc.label}.\\nविशेष फल: ${entry.metadata.specialBenefitsHindi}\\nपारण: ${entry.paranaTimeFormatted}
LOCATION:${loc.label}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pradosh-${entry.dateString}.ics`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("कैलेंडर इवेंट (.ics) डाउनलोड हो गया!");
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <div className="space-y-8 print:p-0">
      {/* HERO BANNER & NEXT UPCOMING PRADOSHAM */}
      <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-accent/5 p-6 md:p-8 shadow-elegant print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-border/60">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Moon className="size-3.5" /> त्रयोदशी तिथि एवं साम्बसदाशिव प्रदोष साधना
            </div>
            <h2 className="mt-2 font-display text-2xl md:text-3xl font-semibold">
              Vedic Pradosh Vrat & Shiva Mahatmya Studio
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Astronomical Pradosha Kaal twilight windows, weekday-specific vrat benefits (Som,
              Bhauma, Shani, etc.), 8-step Shiva Puja Vidhi, and Vrat Kathas for your exact location.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="rounded-full gap-1.5 text-xs"
            >
              <Printer className="size-3.5" /> व्रत पंचांग प्रिंट / PDF
            </Button>
          </div>
        </div>

        {/* LOCATION SELECTOR BAR */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border/60">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="size-4 text-primary shrink-0" />
            <span>
              गणना स्थान: <strong className="text-foreground">{loc.label}</strong> (अक्षांश:{" "}
              {loc.lat.toFixed(2)}°, रेखांश: {loc.lon.toFixed(2)}°)
            </span>
          </div>

          <div className="w-full sm:w-auto">
            <LocationPicker value={loc} onChange={setLoc} />
          </div>
        </div>

        {/* NEXT UPCOMING PRADOSHAM HERO CARD */}
        {nextPradosh && (
          <div className="mt-6 rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-card via-background to-primary/5 p-6 shadow-card space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex size-3 rounded-full bg-success animate-pulse" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                    आगामी प्रदोष व्रत (Upcoming Pradosham)
                  </span>
                  <Badge variant="outline" className="text-xs font-mono">
                    {nextPradosh.pakshaHindi}
                  </Badge>
                </div>
                <h3 className="mt-1.5 font-display text-2xl md:text-3xl font-bold text-foreground">
                  {nextPradosh.dayTypeNameHindi}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                  दिनांक: <strong className="text-foreground">{nextPradosh.formattedDate}</strong> (
                  {nextPradosh.lunarMonthHindi} मास)
                </p>
              </div>

              <div className="rounded-xl border border-primary/20 bg-background/80 p-3 text-center min-w-44">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center justify-center gap-1">
                  <Clock className="size-3 text-primary" /> प्रदोष काल मुहूर्त
                </div>
                <div className="font-display font-bold text-lg text-primary mt-1">
                  {nextPradosh.muhurtaFormatted}
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  अवधि: {nextPradosh.durationMinutes} मिनट
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3 pt-3 border-t border-border/70 text-xs">
              <div className="space-y-1">
                <strong className="text-primary">✨ व्रत का विशेष फल:</strong>
                <p className="text-muted-foreground leading-relaxed">
                  {nextPradosh.metadata.specialBenefitsHindi}
                </p>
              </div>
              <div className="space-y-1">
                <strong className="text-accent">🪔 विशेष शिव पूजा उपाय:</strong>
                <p className="text-muted-foreground leading-relaxed">
                  {nextPradosh.metadata.remedyHint}
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-border/50">
              <div className="text-[11px] text-muted-foreground">
                <strong>पारण समय:</strong> {nextPradosh.paranaTimeFormatted}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadICS(nextPradosh)}
                  className="text-xs h-8 rounded-xl gap-1"
                >
                  <CalendarIcon className="size-3 text-primary" /> कैलेंडर में जोड़ें (.ics)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleCopy(
                      `॥ ${nextPradosh.dayTypeNameHindi} ॥\n` +
                        `दिनांक: ${nextPradosh.formattedDate}\n` +
                        `प्रदोष काल मुहूर्त: ${nextPradosh.muhurtaFormatted}\n` +
                        `स्थान: ${loc.label}\n` +
                        `फल: ${nextPradosh.metadata.specialBenefitsHindi}\n` +
                        `पारण: ${nextPradosh.paranaTimeFormatted}\n` +
                        `संकल्प मन्त्र: ${nextPradosh.sankalpaMantra}`,
                      "प्रदोष विवरण",
                    )
                  }
                  className="text-xs h-8 rounded-xl gap-1"
                >
                  <Share2 className="size-3" /> शेयर
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MAIN NAVIGATION TABS */}
      <Tabs defaultValue="calendar" className="w-full">
        <div className="border-b border-border/70 pb-2 print:hidden">
          <TabsList className="bg-muted/60 p-1 rounded-2xl h-auto flex flex-wrap gap-1">
            <TabsTrigger value="calendar" className="rounded-xl py-2 px-4 text-xs font-medium">
              📅 वर्ष {selectedYear} प्रदोष तालिका ({filteredList.length})
            </TabsTrigger>
            <TabsTrigger value="mahatmya" className="rounded-xl py-2 px-4 text-xs font-medium">
              🪔 वार-अनुसार प्रदोष माहात्म्य व कथा
            </TabsTrigger>
            <TabsTrigger value="vidhi" className="rounded-xl py-2 px-4 text-xs font-medium">
              🔱 षोडशोपचार प्रदोष पूजा विधि
            </TabsTrigger>
            <TabsTrigger value="stotras" className="rounded-xl py-2 px-4 text-xs font-medium">
              📜 शिव स्तोत्र व मन्त्र संग्रह
            </TabsTrigger>
          </TabsList>
        </div>

        {/* TAB 1: YEARLY CALENDAR */}
        <TabsContent value="calendar" className="space-y-6 pt-4 m-0">
          {/* YEAR & WEEKDAY FILTERS */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border border-border bg-card">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">वर्ष:</Label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold"
                >
                  <option value={2025}>2025</option>
                  <option value={2026}>2026</option>
                  <option value={2027}>2027</option>
                  <option value={2028}>2028</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">वार:</Label>
                <select
                  value={selectedDayFilter}
                  onChange={(e) => setSelectedDayFilter(e.target.value)}
                  className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold"
                >
                  <option value="all">सभी वार (All Days)</option>
                  <option value="soma">सोम प्रदोष (Monday)</option>
                  <option value="bhauma">भौम प्रदोष (Tuesday)</option>
                  <option value="budha">बुध प्रदोष (Wednesday)</option>
                  <option value="guru">गुरु प्रदोष (Thursday)</option>
                  <option value="shukra">शुक्र प्रदोष (Friday)</option>
                  <option value="shani">शनि प्रदोष (Saturday)</option>
                  <option value="ravi">रवि प्रदोष (Sunday)</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">पक्ष:</Label>
                <select
                  value={selectedPakshaFilter}
                  onChange={(e) => setSelectedPakshaFilter(e.target.value)}
                  className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold"
                >
                  <option value="all">दोनों पक्ष (All Pakshas)</option>
                  <option value="Shukla">शुक्ल पक्ष (Shukla)</option>
                  <option value="Krishna">कृष्ण पक्ष (Krishna)</option>
                </select>
              </div>
            </div>

            <div className="text-xs text-muted-foreground font-mono">
              कुल {filteredList.length} प्रदोष व्रत
            </div>
          </div>

          {/* PRADOSH DATES GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredList.map((entry) => (
              <div
                key={entry.id}
                className="group rounded-3xl border border-border/80 bg-card hover:border-primary/50 transition-all p-6 shadow-sm hover:shadow-elegant flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-bold text-xl text-foreground group-hover:text-primary transition">
                          {entry.dayTypeNameHindi}
                        </h4>
                      </div>
                      <div className="text-xs text-primary font-semibold mt-0.5">
                        {entry.formattedDate}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="outline" className="text-[10px]">
                        {entry.pakshaHindi}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px]">
                        {entry.lunarMonthHindi} मास
                      </Badge>
                    </div>
                  </div>

                  {/* TIMINGS CARD */}
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl border border-border/60 bg-muted/20 text-xs">
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                        प्रदोष काल मुहूर्त
                      </div>
                      <div className="font-semibold text-foreground mt-0.5">
                        {entry.muhurtaFormatted}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                        व्रत पारण समय
                      </div>
                      <div className="font-semibold text-foreground mt-0.5">
                        {entry.paranaTimeFormatted}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    <strong>माहात्म्य:</strong> {entry.metadata.specialBenefitsHindi}
                  </p>
                </div>

                <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownloadICS(entry)}
                    className="text-xs gap-1 h-8 rounded-xl"
                  >
                    <CalendarIcon className="size-3 text-primary" /> .ics
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleCopy(
                        `${entry.dayTypeNameHindi} - ${entry.formattedDate}\n` +
                          `प्रदोष काल: ${entry.muhurtaFormatted}\n` +
                          `स्थान: ${loc.label}\n` +
                          `पारण: ${entry.paranaTimeFormatted}`,
                        "व्रत विवरण",
                      )
                    }
                    className="text-xs gap-1 h-8 rounded-xl"
                  >
                    <Copy className="size-3" /> कॉपी
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* TAB 2: WEEKDAY MAHATMYA & KATHAS */}
        <TabsContent value="mahatmya" className="space-y-6 pt-4 m-0">
          <div className="flex flex-wrap gap-2 pb-2 border-b border-border/60">
            {Object.values(PRADOSHA_DAY_METADATA).map((meta) => (
              <button
                key={meta.dayType}
                onClick={() => setActiveKathaDay(meta.dayType)}
                className={`rounded-2xl border px-4 py-2 text-xs font-semibold transition ${
                  activeKathaDay === meta.dayType
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-card hover:border-primary/40 text-foreground"
                }`}
              >
                {meta.nameHindi.split(" (")[0]}
              </button>
            ))}
          </div>

          {/* ACTIVE DAY KATHA & BENEFITS */}
          {(() => {
            const meta = PRADOSHA_DAY_METADATA[activeKathaDay];
            return (
              <div className="space-y-6">
                <Card className="rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-card via-background to-primary/5 p-6 md:p-8 shadow-card space-y-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <Badge variant="outline" className="text-xs">
                        ग्रह अधिपति: {meta.rulingPlanet}
                      </Badge>
                      <h3 className="mt-2 font-display text-2xl md:text-3xl font-bold text-foreground">
                        {meta.nameHindi}
                      </h3>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">
                        {meta.nameEnglish}
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSpeech(meta.kathaSummary)}
                      className="rounded-xl text-xs gap-1.5"
                    >
                      <Volume2 className="size-3.5 text-primary" /> कथा सुनें
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-border/70">
                    <div className="rounded-2xl border border-border bg-card p-5 space-y-1.5">
                      <div className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="size-3.5" /> व्रत के विशेष फल व लाभ
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                        {meta.specialBenefitsHindi}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-5 space-y-1.5">
                      <div className="text-xs font-semibold text-accent uppercase tracking-wider flex items-center gap-1.5">
                        <Flame className="size-3.5" /> विशिष्ट शिव पूजा उपाय
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                        {meta.remedyHint}
                      </p>
                    </div>
                  </div>

                  {/* KATHA BOX */}
                  <div className="rounded-2xl border border-border bg-muted/20 p-6 space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                      <BookOpen className="size-4 text-primary" /> {meta.nameHindi} की पौराणिक कथा
                    </div>
                    <p className="text-sm font-devanagari text-foreground leading-relaxed">
                      {meta.kathaSummary}
                    </p>
                  </div>
                </Card>
              </div>
            );
          })()}
        </TabsContent>

        {/* TAB 3: PUJA VIDHI */}
        <TabsContent value="vidhi" className="space-y-6 pt-4 m-0">
          <div className="text-xs text-muted-foreground pb-2 border-b border-border/50">
            शास्त्रसम्मत <strong>८-चरणीय प्रदोष शिव पूजा विधान (8-Step Ritual Workflow)</strong>:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PRADOSH_PUJA_STEPS.map((step) => (
              <div
                key={step.stepNumber}
                className="rounded-3xl border border-border/80 bg-card p-6 space-y-3 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {step.stepNumber}
                  </span>
                  <div>
                    <h4 className="font-display font-bold text-base text-foreground">
                      {step.titleHindi}
                    </h4>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {step.titleEnglish}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-primary/20 bg-primary/5 font-devanagari text-xs text-primary font-semibold leading-relaxed">
                  {step.mantra}
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {step.descriptionHindi}
                </p>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* TAB 4: SHIVA STOTRAS */}
        <TabsContent value="stotras" className="space-y-6 pt-4 m-0">
          <div className="grid grid-cols-1 gap-6">
            {SHIVA_STOTRAS.map((stotra) => (
              <Card
                key={stotra.id}
                className="rounded-3xl border border-border bg-card p-6 md:p-8 space-y-6 shadow-card"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-border/70">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-foreground">
                      {stotra.titleHindi}{" "}
                      <span className="text-sm font-normal text-muted-foreground font-mono">
                        ({stotra.titleEnglish})
                      </span>
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      रचयिता: <strong className="text-foreground">{stotra.composer}</strong>
                    </p>
                    <p className="text-xs text-primary font-medium mt-1">
                      फल: {stotra.benefits}
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleSpeech(stotra.verses.map((v) => v.sanskrit).join(" "))
                    }
                    className="rounded-xl text-xs gap-1.5"
                  >
                    <Volume2 className="size-3.5 text-primary" /> सम्पूर्ण स्तोत्र पाठ सुनें
                  </Button>
                </div>

                <div className="space-y-6">
                  {stotra.verses.map((v, vIdx) => (
                    <div
                      key={vIdx}
                      className="p-5 rounded-2xl border border-border/80 bg-muted/20 space-y-3"
                    >
                      <div className="font-devanagari text-base md:text-lg font-bold text-foreground leading-relaxed whitespace-pre-wrap">
                        {v.sanskrit}
                      </div>
                      <div className="text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border/50">
                        <strong>हिन्दी भावार्थ:</strong> {v.hindi}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
