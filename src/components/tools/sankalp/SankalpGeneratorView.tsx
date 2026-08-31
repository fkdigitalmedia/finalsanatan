import { useMemo, useState } from "react";
import {
  Calendar as CalendarIcon,
  Check,
  Compass,
  Copy,
  Download,
  Flame,
  Globe2,
  Heart,
  Info,
  MapPin,
  Moon,
  Printer,
  Sparkles,
  Sun,
  User,
  Users,
  Volume2,
  VolumeX,
} from "lucide-react";
import { toast } from "sonner";

import { CITY_PRESETS, DEFAULT_LOCATION, type LatLon } from "@/lib/panchang";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  COMMON_GOTRAS,
  type FamilyMode,
  generateVedicSankalp,
  PURPOSE_PRESETS,
  type PurposePreset,
  type SankalpType,
  VEDA_SHAKHAS,
} from "./sankalp-engine";

export function SankalpGeneratorView() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [selectedLocIndex, setSelectedLocIndex] = useState<number>(0);
  const [customCity, setCustomCity] = useState<string>("");

  const [name, setName] = useState<string>("");
  const [spouseName, setSpouseName] = useState<string>("");
  const [gotra, setGotra] = useState<string>("Kashyapa");
  const [customGotra, setCustomGotra] = useState<string>("");
  const [vedaShakha, setVedaShakha] = useState<string>("Yajurveda-Shukla");
  const [familyMode, setFamilyMode] = useState<FamilyMode>("self");
  const [behalfName, setBehalfName] = useState<string>("");

  const [purposePreset, setPurposePreset] = useState<string>("ganesh-puja");
  const [customPurpose, setCustomPurpose] = useState<string>("");
  const [sankalpType, setSankalpType] = useState<SankalpType>("maha");

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const activeLocation: LatLon = useMemo(() => {
    if (customCity.trim()) {
      return {
        ...CITY_PRESETS[selectedLocIndex],
        label: customCity.trim(),
      };
    }
    return CITY_PRESETS[selectedLocIndex] || DEFAULT_LOCATION;
  }, [selectedLocIndex, customCity]);

  const finalGotra = useMemo(() => {
    if (gotra === "Custom") return customGotra.trim() || "कश्यप";
    return gotra || "कश्यप";
  }, [gotra, customGotra]);

  const activeDate = useMemo(() => {
    const d = new Date(selectedDate);
    return isNaN(d.getTime()) ? new Date() : d;
  }, [selectedDate]);

  const result = useMemo(() => {
    return generateVedicSankalp({
      date: activeDate,
      location: activeLocation,
      name,
      spouseName,
      gotra: finalGotra,
      vedaShakha,
      familyMode,
      behalfName,
      purposePreset,
      customPurpose: purposePreset === "custom" ? customPurpose : undefined,
      sankalpType,
    });
  }, [
    activeDate,
    activeLocation,
    name,
    spouseName,
    finalGotra,
    vedaShakha,
    familyMode,
    behalfName,
    purposePreset,
    customPurpose,
    sankalpType,
  ]);

  const handleCopy = (text: string, label: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
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
    utterance.pitch = 1.0;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const categories: Array<{ key: PurposePreset["category"]; label: string }> = [
    { key: "deity", label: "प्रमुख देवता पूजन" },
    { key: "daily", label: "दैनिक / नित्य" },
    { key: "vrat", label: "व्रत एवं उपवास" },
    { key: "samskara", label: "संस्कार / गृह / हवन" },
    { key: "desire", label: "मनोकामना / आरोग्य / व्यापार" },
  ];

  return (
    <div className="space-y-8 print:p-0">
      {/* HEADER CONTROLS BANNER */}
      <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-accent/5 p-6 md:p-8 shadow-elegant print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-border/60">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Flame className="size-3.5" /> वैदिक संकल्प निर्माण विधान
            </div>
            <h2 className="mt-2 font-display text-2xl md:text-3xl font-semibold">
              Desha-Kala-Patra Sankalpa Studio
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Live Panchang ephemeris synchronised with Vedic Muhurta, Gotra, and Shastriya phala.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={sankalpType === "maha" ? "default" : "outline"}
              size="sm"
              onClick={() => setSankalpType("maha")}
              className="rounded-full"
            >
              महासंकल्प (Full)
            </Button>
            <Button
              variant={sankalpType === "laghu" ? "default" : "outline"}
              size="sm"
              onClick={() => setSankalpType("laghu")}
              className="rounded-full"
            >
              लघु संकल्प (Short)
            </Button>
            <Button
              variant={sankalpType === "daan" ? "default" : "outline"}
              size="sm"
              onClick={() => setSankalpType("daan")}
              className="rounded-full"
            >
              दान / पुण्य
            </Button>
            <Button
              variant={sankalpType === "parana" ? "default" : "outline"}
              size="sm"
              onClick={() => setSankalpType("parana")}
              className="rounded-full"
            >
              व्रत पारण
            </Button>
          </div>
        </div>

        {/* INPUT GRID */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* STEP 1: DESHA & KALA (LIVE PANCHANG) */}
          <div className="space-y-4 rounded-2xl border border-border/80 bg-card/60 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent">
              <Sun className="size-4" /> १. देश व काल (Location & Date)
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">संकल्प तिथि (Date)</Label>
              <div className="relative">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-background text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">स्थान / नगर (City Preset)</Label>
              <Select
                value={String(selectedLocIndex)}
                onValueChange={(val) => {
                  setSelectedLocIndex(Number(val));
                  setCustomCity("");
                }}
              >
                <SelectTrigger className="bg-background text-sm">
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  {CITY_PRESETS.map((city, idx) => (
                    <SelectItem key={city.label} value={String(idx)}>
                      {city.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">अन्य तीर्थ / विशिष्ट स्थान (Custom Place)</Label>
              <Input
                placeholder="उदा. हरिद्वार, श्री काशी विश्वनाथ, प्रयागराज"
                value={customCity}
                onChange={(e) => setCustomCity(e.target.value)}
                className="bg-background text-xs"
              />
            </div>
          </div>

          {/* STEP 2: YAJAMANA PATRA (HOST DETAILS) */}
          <div className="space-y-4 rounded-2xl border border-border/80 bg-card/60 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
              <User className="size-4" /> २. यजमान एवं गोत्र (Host Details)
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">आपका नाम (Your Full Name)</Label>
              <Input
                placeholder="उदा. राहुल शर्मा / अमित वर्मा"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-background text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">गोत्र (Gotra)</Label>
              <Select value={gotra} onValueChange={(v) => setGotra(v)}>
                <SelectTrigger className="bg-background text-sm">
                  <SelectValue placeholder="Select Gotra" />
                </SelectTrigger>
                <SelectContent className="max-h-56">
                  {COMMON_GOTRAS.map((g) => (
                    <SelectItem key={g.value} value={g.value}>
                      {g.label}
                    </SelectItem>
                  ))}
                  <SelectItem value="Custom">अन्य गोत्र (Custom Write-in)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {gotra === "Custom" && (
              <div className="space-y-1.5">
                <Label className="text-xs">गोत्र नाम लिखें (Write Gotra)</Label>
                <Input
                  placeholder="उदा. मुद्गल, पराशर, शाण्डिल्य"
                  value={customGotra}
                  onChange={(e) => setCustomGotra(e.target.value)}
                  className="bg-background text-xs"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs">संकल्प स्वरूप (Who is participating?)</Label>
              <Select value={familyMode} onValueChange={(v: FamilyMode) => setFamilyMode(v)}>
                <SelectTrigger className="bg-background text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="self">स्वयं (Individual / Single)</SelectItem>
                  <SelectItem value="spouse">सपत्नीक (With Wife / Husband)</SelectItem>
                  <SelectItem value="family">सपरिवार (With Entire Family & Kids)</SelectItem>
                  <SelectItem value="behalf">प्रतिनिधि (On Behalf of someone else)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {familyMode === "spouse" && (
              <div className="space-y-1.5">
                <Label className="text-xs">पत्नी का नाम (Spouse Name)</Label>
                <Input
                  placeholder="उदा. सुनीता देवी"
                  value={spouseName}
                  onChange={(e) => setSpouseName(e.target.value)}
                  className="bg-background text-xs"
                />
              </div>
            )}

            {familyMode === "behalf" && (
              <div className="space-y-1.5">
                <Label className="text-xs">मूल यजमान का नाम (Principal Person's Name)</Label>
                <Input
                  placeholder="उदा. श्री रामेश्वर दयाल"
                  value={behalfName}
                  onChange={(e) => setBehalfName(e.target.value)}
                  className="bg-background text-xs"
                />
              </div>
            )}
          </div>

          {/* STEP 3: PUJA PURPOSE / NIMITYA */}
          <div className="space-y-4 rounded-2xl border border-border/80 bg-card/60 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-success">
              <Sparkles className="size-4" /> ३. पूजन निमित्त व प्रयोजन (Purpose)
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">पूजा / अनुष्ठान का चयन (Select Puja)</Label>
              <Select value={purposePreset} onValueChange={(v) => setPurposePreset(v)}>
                <SelectTrigger className="bg-background text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {categories.map((cat) => (
                    <SelectGroup key={cat.key}>
                      <SelectLabel className="text-xs text-accent font-semibold">
                        {cat.label}
                      </SelectLabel>
                      {PURPOSE_PRESETS.filter((p) => p.category === cat.key).map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.titleHindi} ({p.titleSanskrit})
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                  <SelectGroup>
                    <SelectLabel className="text-xs text-accent font-semibold">अन्य</SelectLabel>
                    <SelectItem value="custom">अन्य विशिष्ट मनोरथ (Custom Purpose)</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {purposePreset === "custom" && (
              <div className="space-y-1.5">
                <Label className="text-xs">विशिष्ट कामना / पूजा का नाम लिखें</Label>
                <Input
                  placeholder="उदा. सुपुत्र की परीक्षा में सफलता एवं गृह शान्ति हेतु"
                  value={customPurpose}
                  onChange={(e) => setCustomPurpose(e.target.value)}
                  className="bg-background text-xs"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs">वेद शाखा (Optional Veda Shakha)</Label>
              <Select value={vedaShakha} onValueChange={(v) => setVedaShakha(v)}>
                <SelectTrigger className="bg-background text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VEDA_SHAKHAS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* SANKALPA DISPLAY & TABBED RESULTS */}
      <Card className="rounded-3xl border border-border shadow-elegant overflow-hidden bg-card">
        {/* TOP BAR ACTIONS */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-border/70 bg-muted/30">
          <div className="flex items-center gap-2">
            <span className="flex size-3 rounded-full bg-success animate-pulse" />
            <span className="font-display font-semibold text-base">
              {sankalpType === "maha" && "सम्पूर्ण वैदिक महासंकल्प"}
              {sankalpType === "laghu" && "लघु नित्य पूजा संकल्प"}
              {sankalpType === "daan" && "दान एवं पुण्य संकल्प"}
              {sankalpType === "parana" && "व्रत पारण संकल्प"}
            </span>
            <Badge variant="outline" className="text-xs font-mono ml-2">
              संवत् {result.panchangSummary.samvat} · {result.panchangSummary.tithi}
            </Badge>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSpeech(result.sanskrit)}
              className="gap-1.5 text-xs rounded-xl"
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="size-3.5 text-destructive" /> रोके (Stop)
                </>
              ) : (
                <>
                  <Volume2 className="size-3.5 text-primary" /> मन्त्र सुनें (Audio)
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(result.sanskrit, "संस्कृत संकल्प")}
              className="gap-1.5 text-xs rounded-xl"
            >
              <Copy className="size-3.5" /> कॉपी (Copy)
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="gap-1.5 text-xs rounded-xl"
            >
              <Printer className="size-3.5" /> प्रिंट / PDF
            </Button>
          </div>
        </div>

        {/* TABS CONTAINER */}
        <Tabs defaultValue="sanskrit" className="w-full">
          <div className="px-6 pt-4 border-b border-border/50 bg-background/50 print:hidden">
            <TabsList className="bg-muted/60 p-1 rounded-2xl h-auto flex flex-wrap gap-1">
              <TabsTrigger value="sanskrit" className="rounded-xl py-2 px-4 text-xs font-medium">
                🕉️ शुद्ध संस्कृत पाठ
              </TabsTrigger>
              <TabsTrigger value="hindi" className="rounded-xl py-2 px-4 text-xs font-medium">
                📖 हिन्दी अनुवाद व भावार्थ
              </TabsTrigger>
              <TabsTrigger value="iast" className="rounded-xl py-2 px-4 text-xs font-medium">
                🔤 IAST (English Roman)
              </TabsTrigger>
              <TabsTrigger value="english" className="rounded-xl py-2 px-4 text-xs font-medium">
                🌐 English Translation
              </TabsTrigger>
              <TabsTrigger value="vidhi" className="rounded-xl py-2 px-4 text-xs font-medium">
                🪔 संकल्प विधि निर्देश
              </TabsTrigger>
              <TabsTrigger value="panchang" className="rounded-xl py-2 px-4 text-xs font-medium">
                📊 पञ्चाङ्ग विवरण
              </TabsTrigger>
            </TabsList>
          </div>

          {/* TAB 1: SANSKRIT TEXT */}
          <TabsContent value="sanskrit" className="p-6 md:p-8 space-y-6 m-0">
            <div className="rounded-2xl border-2 border-primary/20 bg-gradient-to-b from-primary/5 via-background to-card p-6 md:p-8 shadow-card relative">
              <div className="absolute top-3 right-4 text-4xl opacity-10 select-none font-serif">
                ॐ
              </div>
              <div className="text-center font-serif text-lg text-accent mb-4 tracking-wide">
                ॥ ॐ श्री परमात्मने नमः ॥
              </div>
              <pre className="font-devanagari text-lg md:text-xl leading-loose whitespace-pre-wrap text-foreground/95 text-justify tracking-wide selection:bg-primary selection:text-primary-foreground">
                {result.sanskrit}
              </pre>
            </div>

            <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground bg-muted/40 p-4 rounded-xl">
              <span>
                💡 <strong>विधि:</strong> दाहिने हाथ में जल, अक्षत, पुष्प, सुपारी व सिक्का लेकर पूर्व
                या उत्तर मुख होकर उच्चार करें।
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(result.sanskrit, "संस्कृत संकल्प")}
                className="text-xs text-primary"
              >
                Copy Sanskrit
              </Button>
            </div>
          </TabsContent>

          {/* TAB 2: HINDI ANUVAD */}
          <TabsContent value="hindi" className="p-6 md:p-8 space-y-6 m-0">
            <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
                <Info className="size-4" /> सम्पूर्ण संकल्प का हिन्दी अर्थ व रहस्य
              </div>
              <p className="font-body text-base md:text-lg leading-relaxed whitespace-pre-wrap text-muted-foreground text-justify">
                {result.hindiTranslation}
              </p>
            </div>
          </TabsContent>

          {/* TAB 3: IAST */}
          <TabsContent value="iast" className="p-6 md:p-8 space-y-6 m-0">
            <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                IAST International Sanskrit Roman Transliteration
              </div>
              <pre className="font-mono text-sm md:text-base leading-relaxed whitespace-pre-wrap text-foreground/90 overflow-x-auto">
                {result.iast}
              </pre>
            </div>
          </TabsContent>

          {/* TAB 4: ENGLISH */}
          <TabsContent value="english" className="p-6 md:p-8 space-y-6 m-0">
            <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-accent">
                English Meaning & Cosmological Significance
              </div>
              <p className="font-body text-base leading-relaxed whitespace-pre-wrap text-muted-foreground text-justify">
                {result.englishTranslation}
              </p>
            </div>
          </TabsContent>

          {/* TAB 5: VIDHI STEPS */}
          <TabsContent value="vidhi" className="p-6 md:p-8 space-y-6 m-0">
            <div className="grid gap-4 md:grid-cols-2">
              {result.vidhiSteps.map((s) => (
                <div
                  key={s.step}
                  className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted/20 p-5 shadow-card space-y-2"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {s.step}
                    </span>
                    <h3 className="font-display font-semibold text-sm md:text-base">{s.title}</h3>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed pl-10">
                    {s.instruction}
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* TAB 6: PANCHANG METADATA */}
          <TabsContent value="panchang" className="p-6 md:p-8 space-y-6 m-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              <div className="rounded-xl border border-border bg-muted/20 p-3.5">
                <div className="text-xs text-muted-foreground">विक्रम संवत्</div>
                <div className="font-display font-semibold text-base mt-1">
                  {result.panchangSummary.samvat}
                </div>
              </div>
              <div className="rounded-xl border border-border bg-muted/20 p-3.5">
                <div className="text-xs text-muted-foreground">संवत्सर</div>
                <div className="font-display font-semibold text-base mt-1">
                  {result.panchangSummary.samvatsara}
                </div>
              </div>
              <div className="rounded-xl border border-border bg-muted/20 p-3.5">
                <div className="text-xs text-muted-foreground">अयन व ऋतु</div>
                <div className="font-display font-semibold text-base mt-1">
                  {result.panchangSummary.ayana}, {result.panchangSummary.ritu}
                </div>
              </div>
              <div className="rounded-xl border border-border bg-muted/20 p-3.5">
                <div className="text-xs text-muted-foreground">मास एवं पक्ष</div>
                <div className="font-display font-semibold text-base mt-1">
                  {result.panchangSummary.masa} ({result.panchangSummary.paksha})
                </div>
              </div>
              <div className="rounded-xl border border-border bg-muted/20 p-3.5">
                <div className="text-xs text-muted-foreground">तिथि</div>
                <div className="font-display font-semibold text-base mt-1 text-primary">
                  {result.panchangSummary.tithi}
                </div>
              </div>
              <div className="rounded-xl border border-border bg-muted/20 p-3.5">
                <div className="text-xs text-muted-foreground">वार (Day)</div>
                <div className="font-display font-semibold text-base mt-1">
                  {result.panchangSummary.vaara}
                </div>
              </div>
              <div className="rounded-xl border border-border bg-muted/20 p-3.5">
                <div className="text-xs text-muted-foreground">नक्षत्र</div>
                <div className="font-display font-semibold text-base mt-1 text-accent">
                  {result.panchangSummary.nakshatra}
                </div>
              </div>
              <div className="rounded-xl border border-border bg-muted/20 p-3.5">
                <div className="text-xs text-muted-foreground">सूर्य / चन्द्र राशि</div>
                <div className="font-display font-semibold text-base mt-1">
                  {result.panchangSummary.suryaRashi} / {result.panchangSummary.chandraRashi}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* TRADITIONAL PRINTABLE CARD (Only visible when printing or in presentation) */}
      <div className="hidden print:block border-4 border-amber-800 p-8 rounded-2xl bg-amber-50/20 text-center space-y-4">
        <div className="text-2xl font-serif text-amber-900">॥ श्री गणेशाय नमः ॥</div>
        <h1 className="text-xl font-bold font-serif text-amber-950">वैदिक संकल्प पत्रम्</h1>
        <div className="text-xs font-mono text-amber-800">
          तिथि: {result.panchangSummary.tithi} | संवत्: {result.panchangSummary.samvat} | स्थान:{" "}
          {activeLocation.label}
        </div>
        <p className="text-base font-serif leading-loose text-left mt-4 text-black whitespace-pre-wrap">
          {result.sanskrit}
        </p>
        <div className="pt-6 border-t border-amber-300 text-xs text-amber-900 flex justify-between">
          <span>यजमान: {name || "अमुक"}</span>
          <span>गोत्र: {finalGotra}</span>
          <span>सनातन टूल्स (sanatantools.com)</span>
        </div>
      </div>
    </div>
  );
}
