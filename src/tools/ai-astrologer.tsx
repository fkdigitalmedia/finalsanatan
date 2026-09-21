import { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Sparkles,
  Loader2,
  ShieldCheck,
  Compass,
  ArrowRight,
  User,
  Calendar,
  Clock,
  MapPin,
  HelpCircle,
  Briefcase,
  Heart,
  Coins,
  Activity,
  Flame,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RotateCcw,
  Crown,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FormattedMarkdown } from "@/components/ui/FormattedMarkdown";
import { PhotonPlacePicker } from "@/components/tools/PhotonPlacePicker";
import { DEFAULT_LOCATION, type LatLon } from "@/lib/panchang";
import { generateKundli } from "@/lib/kundli";
import type { KundliResult } from "@/lib/kundli/types";
import { useAuth } from "@/hooks/useAuth";
import { useKundlis } from "@/lib/workspace/hooks";
import { useTranslation } from "@/i18n/I18nProvider";
import { getAiAstrologerUsage } from "@/lib/ai-astrologer.functions";

const QUESTION_CATEGORIES = [
  {
    id: "career",
    label: "Career & Business",
    icon: Briefcase,
    questions: [
      "Which career path or profession is favored by my 10th house and Amatyakaraka?",
      "When is my next favorable planetary period for promotion or career growth?",
      "Should I pursue an independent business/startup or stick with a corporate job?",
      "Does my birth chart indicate foreign career opportunities or overseas relocation?",
    ],
  },
  {
    id: "marriage",
    label: "Marriage & Love",
    icon: Heart,
    questions: [
      "What do my 7th house and Navamsha (D9) reveal about my future spouse?",
      "Does my chart have Mangal Dosha (Kuja Dosha) and is there any classical cancellation?",
      "Which upcoming Dasha or transit indicates favorable timing for marriage?",
      "What planetary combinations govern peace and long-term harmony in my relationship?",
    ],
  },
  {
    id: "wealth",
    label: "Wealth & Finance",
    icon: Coins,
    questions: [
      "Do I have strong Dhana Yogas or Lakshmi Yogas formed in my 2nd, 5th, and 11th houses?",
      "What planetary periods indicate maximum wealth accumulation in my lifetime?",
      "Are there any financial leakages or debt indicators in my chart and how do I resolve them?",
      "When is an auspicious planetary period to invest in property or long-term assets?",
    ],
  },
  {
    id: "dasha",
    label: "Dasha & Future Cycles",
    icon: Activity,
    questions: [
      "Which Vimshottari Mahadasha is running now and what life themes will it activate?",
      "How is Saturn (Shani) transiting relative to my Moon sign — am I undergoing Sade Sati?",
      "What are the strongest and weakest planets in my horoscope according to Shadbala?",
      "How will the upcoming Dasha transition affect my personal and professional life?",
    ],
  },
  {
    id: "remedies",
    label: "Remedies & Sadhana",
    icon: Flame,
    questions: [
      "What authentic Vedic remedies (mantras, dāna, gemstones) suit my active Dasha period?",
      "How can I balance Saturn (Shani) or Rahu during testing transits without fear?",
      "What is my Ishta Devata and ideal daily spiritual practice based on my 5th and 9th houses?",
      "What gemstones or colors are harmoniously aligned with my Lagna Lord?",
    ],
  },
];

const HINDI_QUESTION_CATEGORIES = [
  {
    id: "career",
    label: "करियर और व्यवसाय",
    icon: Briefcase,
    questions: [
      "मेरे 10वें भाव और अमात्यकारक के अनुसार कौन सा करियर या व्यवसाय सबसे अनुकूल है?",
      "पदोन्नति या करियर में बदलाव के लिए अगला अनुकूल समय कब है?",
      "क्या मुझे स्वतंत्र व्यवसाय/स्टार्टअप करना चाहिए या नौकरी?",
      "क्या मेरी कुंडली में विदेश यात्रा या विदेश में बसने के योग हैं?",
    ],
  },
  {
    id: "marriage",
    label: "विवाह और प्रेम",
    icon: Heart,
    questions: [
      "मेरे 7वें भाव और नवांश (D9) के अनुसार जीवनसाथी का स्वभाव कैसा रहेगा?",
      "क्या मेरी कुंडली में मांगलिक दोष है और क्या इसका कोई शास्त्रीय परिहार है?",
      "विवाह के लिए कौन सी आगामी दशा या गोचर सबसे अनुकूल है?",
      "दांपत्य जीवन में सुख, शांति और दीर्घायु के लिए कौन से ग्रह योग हैं?",
    ],
  },
  {
    id: "wealth",
    label: "धन और समृद्धि",
    icon: Coins,
    questions: [
      "क्या मेरी कुंडली के 2रे, 5वें और 11वें भाव में शक्तिशाली धन योग या लक्ष्मी योग हैं?",
      "जीवन में अधिकतम धन संचय के लिए कौन सी महादशा सबसे शुभ है?",
      "क्या मेरी कुंडली में कर्ज या धन हानि के योग हैं और उनका समाधान क्या है?",
      "संपत्ति या जमीन में निवेश के लिए कौन सा समय सबसे उत्तम रहेगा?",
    ],
  },
  {
    id: "dasha",
    label: "दशा और भविष्य चक्र",
    icon: Activity,
    questions: [
      "वर्तमान में कौन सी विंशोत्तरी महादशा चल रही है और इसका क्या प्रभाव होगा?",
      "क्या मुझ पर शनि की साढ़ेसाती या ढैय्या का प्रभाव है?",
      "षड्बल के अनुसार मेरी कुंडली में सबसे बलवान और कमजोर ग्रह कौन से हैं?",
      "आगामी दशा परिवर्तन मेरे व्यक्तिगत और पेशेवर जीवन को कैसे प्रभावित करेगा?",
    ],
  },
  {
    id: "remedies",
    label: "वैदिक उपाय और साधना",
    icon: Flame,
    questions: [
      "मेरी सक्रिय दशा के अनुसार कौन से प्रामाणिक वैदिक उपाय (मंत्र, दान, रत्न) उपयुक्त हैं?",
      "शनि या राहु की दशा के दौरान बिना भय के शांति कैसे प्राप्त करें?",
      "मेरे 5वें और 9वें भाव के अनुसार मेरे इष्ट देव और दैनिक साधना क्या होनी चाहिए?",
      "मेरे लग्नेश के अनुकूल कौन से रत्न, रंग और मंत्र हैं?",
    ],
  },
];

export function AIAstrologer() {
  const { user, session } = useAuth();
  const { t, lang } = useTranslation();
  const isHindi = lang === "hi";
  const questionCategories = useMemo(
    () => (isHindi ? HINDI_QUESTION_CATEGORIES : QUESTION_CATEGORIES),
    [isHindi],
  );
  const { data: kundliData } = useKundlis();
  const savedCharts = useMemo(() => kundliData?.rows || [], [kundliData]);

  // Quota and entitlement tracking for Free (3 questions max) vs Pro/Premium (unlimited)
  const LOCAL_STORAGE_KEY = "sanatan_ai_astrologer_questions_used";
  const FREE_QUESTIONS_LIMIT = 3;

  const [questionsUsed, setQuestionsUsed] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored ? Math.max(0, parseInt(stored, 10) || 0) : 0;
    } catch {
      return 0;
    }
  });

  const fetchUsage = useServerFn(getAiAstrologerUsage);
  const { data: usageData } = useQuery({
    queryKey: ["ai-astrologer-usage", user?.id ?? "anon"],
    queryFn: () => fetchUsage(),
    enabled: !!user,
    staleTime: 30_000,
  });

  const isProOrPremium = Boolean(usageData?.isPro);

  // Sync questions count if server has logged higher usage
  useEffect(() => {
    if (usageData && typeof usageData.usedCount === "number") {
      setQuestionsUsed((prev) => {
        const next = Math.max(prev, usageData.usedCount);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, String(next));
          } catch {}
        }
        return next;
      });
    }
  }, [usageData]);

  const hasReachedLimit = !isProOrPremium && questionsUsed >= FREE_QUESTIONS_LIMIT;
  const remainingQuestions = isProOrPremium
    ? 999999
    : Math.max(0, FREE_QUESTIONS_LIMIT - questionsUsed);

  // Read URL search params for pre-filling
  const initialParams = useMemo(() => {
    if (typeof window === "undefined") return {};
    const p = new URLSearchParams(window.location.search);
    return {
      name: p.get("name") || "",
      dob: p.get("dob") || "",
      tob: p.get("tob") || "",
      place: p.get("place") || "",
      lat: p.get("lat") ? Number(p.get("lat")) : undefined,
      lon: p.get("lon") ? Number(p.get("lon")) : undefined,
      tz: p.get("tz") || "",
      q: p.get("q") || "",
      auto: p.get("auto") === "true",
    };
  }, []);

  const [name, setName] = useState(initialParams.name || "");
  const [gender, setGender] = useState<"male" | "female" | "other" | "">("");
  const [date, setDate] = useState(initialParams.dob || "1995-08-15");
  const [time, setTime] = useState(initialParams.tob || "06:30");
  const [loc, setLoc] = useState<LatLon>(() => {
    if (initialParams.lat && initialParams.lon) {
      return {
        lat: initialParams.lat,
        lon: initialParams.lon,
        label: initialParams.place || "Selected City",
        tz: initialParams.tz || DEFAULT_LOCATION.tz,
      };
    }
    return DEFAULT_LOCATION;
  });

  const [question, setQuestion] = useState(
    initialParams.q || questionCategories[0].questions[0],
  );
  const [activeCategory, setActiveCategory] = useState("career");

  const [computing, setComputing] = useState(false);
  const [kundliResult, setKundliResult] = useState<KundliResult | null>(null);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Auto-fill from saved chart if user picks one
  const handleSelectSavedKundli = (id: string) => {
    const k = savedCharts.find((c) => c.id === id);
    if (!k) return;
    setName(k.name);
    setGender((k.gender as "male" | "female" | "other") || "male");
    setDate(k.birth_date);
    setTime(String(k.birth_time).slice(0, 5));
    setLoc({
      lat: k.latitude,
      lon: k.longitude,
      label: k.place_name,
      tz: k.timezone,
    });
    setKundliResult(null);
    setAiResponse(null);
    toast.success(`Loaded chart for ${k.name}`);
  };

  const executeAnalysis = async () => {
    if (!date || !time) {
      toast.error(
        isHindi ? "कृपया जन्म तिथि और जन्म समय भरें।" : "Please provide birth date and birth time.",
      );
      return;
    }
    if (!question.trim()) {
      toast.error(
        isHindi
          ? "कृपया AI ज्योतिषी के लिए प्रश्न दर्ज करें।"
          : "Please enter a question for the AI Astrologer.",
      );
      return;
    }

    if (hasReachedLimit) {
      toast.error(
        isHindi
          ? "आपकी 3 मुफ़्त सवालों की सीमा पूरी हो चुकी है। असीमित सवाल पूछने के लिए Pro प्लान में अपग्रेड करें।"
          : "Free limit reached (3 questions). Please upgrade to Pro for unlimited questions.",
      );
      return;
    }

    setComputing(true);
    setError(null);
    setAiResponse(null);

    try {
      // Step 1: Compute verified birth chart using mathematical engine
      const computed = generateKundli({
        date,
        time,
        place: `${name ? name + " · " : ""}${loc.label}`,
        latitude: loc.lat,
        longitude: loc.lon,
        timezone: loc.tz,
      });
      setKundliResult(computed);

      // Step 2: Assemble structured summaries of verified calculation data
      const chartSummary = [
        `Ascendant (Lagna): ${computed.d1.ascendant.rashi} (${computed.d1.ascendant.degreesInRashi.toFixed(2)}°)`,
        `Moon Sign (Chandra Rashi): ${computed.moonSign}`,
        `Sun Sign (Surya Rashi): ${computed.sunSign}`,
        `Birth Nakshatra: ${computed.birthNakshatra.nakshatra} (Pada ${computed.birthNakshatra.pada}, Lord: ${computed.birthNakshatra.lord})`,
        "Planetary Placements:",
        ...computed.d1.planets.map(
          (p) =>
            `- ${p.name}: in ${p.rashi} (${p.degreesInRashi.toFixed(1)}°), House ${p.house}, Dignity: ${p.dignity}${p.isRetrograde ? " (Retrograde)" : ""}`,
        ),
      ].join("\n");

      const dashaSummary = computed.vimshottari?.current
        ? `Current Mahadasha: ${computed.vimshottari.current.mahadasha.lord} (until ${computed.vimshottari.current.mahadasha.endISO.slice(0, 10)})\nCurrent Antardasha: ${computed.vimshottari.current.antardasha.lord} (until ${computed.vimshottari.current.antardasha.endISO.slice(0, 10)})`
        : "Vimshottari Dasha data calculated from natal Moon.";

      const yogasSummary = computed.yogas
        ? computed.yogas
            .filter((y) => y.isPresent)
            .map((y) => `${y.name}: ${y.description}`)
            .join("\n")
        : "Standard planetary configurations.";

      // Step 3: Call AI Astrologer API with verified calculation facts and quota metadata
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "x-questions-used": String(questionsUsed),
      };
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      const res = await fetch("/api/ai", {
        method: "POST",
        headers,
        body: JSON.stringify({
          mode: "ai-astrologer",
          input: {
            question: question.trim(),
            language: lang,
            chartSummary,
            dashaSummary,
            yogasSummary,
          },
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        text?: string;
        error?: string;
        isPro?: boolean;
        limitReached?: boolean;
      };

      if (!res.ok) {
        if (res.status === 402 || data.limitReached) {
          setQuestionsUsed(FREE_QUESTIONS_LIMIT);
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem(LOCAL_STORAGE_KEY, String(FREE_QUESTIONS_LIMIT));
            } catch {}
          }
        }
        throw new Error(data.error || "AI Astrologer analysis failed.");
      }

      setAiResponse(data.text || "Interpretation complete.");

      // If free user, increment count
      if (!isProOrPremium && !data.isPro) {
        const nextUsed = questionsUsed + 1;
        setQuestionsUsed(nextUsed);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, String(nextUsed));
          } catch {}
        }
        if (nextUsed >= FREE_QUESTIONS_LIMIT) {
          toast.info(
            isHindi
              ? "यह आपका तीसरा और अंतिम मुफ़्त सवाल था। आगे और सवाल पूछने के लिए Pro में अपग्रेड करें।"
              : "This was your 3rd and final free question. Upgrade to Pro for unlimited questions.",
          );
        } else {
          toast.success(
            isHindi
              ? `उत्तर तैयार है! (${FREE_QUESTIONS_LIMIT - nextUsed} मुफ़्त सवाल शेष)`
              : `Answer ready! (${FREE_QUESTIONS_LIMIT - nextUsed} free question${FREE_QUESTIONS_LIMIT - nextUsed === 1 ? "" : "s"} left)`,
          );
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Calculation failed.";
      setError(msg);
      toast.error(msg);
    } finally {
      setComputing(false);
    }
  };

  // Auto-run once if requested via query param
  const hasAutoRan = useRef(false);
  useEffect(() => {
    if (initialParams.auto && !hasAutoRan.current && date && time) {
      hasAutoRan.current = true;
      executeAnalysis();
    }
  }, [initialParams.auto, date, time]);

  const copyResponse = () => {
    if (!aiResponse) return;
    navigator.clipboard.writeText(aiResponse);
    setCopied(true);
    toast.success("Interpretation copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-background p-6 sm:p-8 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge className="bg-primary/20 text-primary border-primary/30 px-3 py-1 font-semibold">
            <Sparkles className="size-3.5 mr-1.5 animate-pulse" />
            SanatanTools AI Astrologer
          </Badge>
          <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5 text-emerald-500" />
            <span>Calculation-First • Zero Hallucination</span>
          </div>
        </div>
        <h1 className="mt-4 font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Ask the AI Astrologer About Your Kundli
        </h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
          Ask personalized questions about career, marriage, wealth, and dasha cycles. Our AI
          interprets your authentic astronomical chart computed with the high-precision Astronomy
          Engine — never fabricating planetary positions or predictions.
        </p>

        {/* Architecture Pill */}
        <div className="mt-5 rounded-xl border border-border/80 bg-background/60 p-3.5 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-2 font-mono">
            <span className="font-semibold text-foreground">Verified Architecture:</span>
            <span>Birth Coordinates</span>
            <span>→</span>
            <span className="text-foreground">Astronomy Engine (Sidereal Lahiri)</span>
            <span>→</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Verified Chart Data</span>
            <span>→</span>
            <span className="text-primary font-semibold">AI Astrologer Analysis</span>
          </div>
        </div>
      </div>

      {/* Free vs Pro Quota Status Card */}
      {isProOrPremium ? (
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/15 via-primary/10 to-amber-500/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex shrink-0 items-center justify-center size-10 rounded-xl bg-amber-500/20 text-amber-500 border border-amber-500/30">
              <Crown className="size-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-sm text-foreground">
                  {isHindi ? "Pro / Premium अकाउंट सक्रिय" : "Pro / Premium Account Active"}
                </span>
                <Badge className="bg-amber-600 text-white text-[10px] px-2 py-0 border-0">
                  {isHindi ? "असीमित सवाल अनलॉक ✨" : "Unlimited Questions ✨"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isHindi
                  ? "आप AI ज्योतिषी से अपनी कुंडली के बारे में जितने चाहें उतने सवाल पूछ सकते हैं — कोई सीमा नहीं।"
                  : "You have unlimited consultations with the AI Astrologer. Ask as many questions as you need."}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-foreground">
                {isHindi ? "निःशुल्क योजना (Free Plan)" : "Free Plan Account"}
              </span>
              <Badge
                variant="outline"
                className={`text-[11px] font-medium ${
                  hasReachedLimit
                    ? "border-destructive/40 text-destructive bg-destructive/10"
                    : "border-primary/40 text-primary bg-primary/5"
                }`}
              >
                {hasReachedLimit
                  ? isHindi
                    ? "सीमा समाप्त (3/3 प्रयुक्त)"
                    : "Limit Reached (3/3 used)"
                  : isHindi
                    ? `${remainingQuestions} मुफ़्त सवाल शेष`
                    : `${remainingQuestions} of 3 free questions left`}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {isHindi
                ? "निःशुल्क यूज़र अधिकतम 3 सवाल पूछ सकते हैं। Pro और Premium यूज़र असीमित सवाल पूछ सकते हैं।"
                : "Free users can ask up to 3 questions. Pro & Premium accounts enjoy unlimited questions."}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {/* 3 Visual Progress Dots */}
            <div
              className="flex items-center gap-1.5"
              title={`${questionsUsed}/${FREE_QUESTIONS_LIMIT} questions used`}
            >
              {[1, 2, 3].map((step) => {
                const used = questionsUsed >= step;
                return (
                  <span
                    key={step}
                    className={`size-2.5 rounded-full transition-all ${
                      used
                        ? "bg-muted-foreground/30 scale-90"
                        : "bg-primary ring-2 ring-primary/20 animate-pulse"
                    }`}
                  />
                );
              })}
              <span className="text-xs font-mono font-medium ml-1">
                {Math.min(FREE_QUESTIONS_LIMIT, questionsUsed)}/{FREE_QUESTIONS_LIMIT}
              </span>
            </div>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="text-xs h-8 border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 font-semibold"
            >
              <Link to="/pricing">
                <Crown className="size-3.5 mr-1 text-amber-500" />
                {isHindi ? "Pro अपग्रेड" : "Upgrade Pro"}
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* Saved Kundli Quick Picker */}
      {user && savedCharts.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <User className="size-4 text-primary" />
              <span className="text-sm font-medium">Use a saved birth chart:</span>
            </div>
            <select
              onChange={(e) => handleSelectSavedKundli(e.target.value)}
              className="h-9 rounded-lg border border-border bg-background px-3 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
              defaultValue=""
            >
              <option value="" disabled>
                Select from saved Kundlis ({savedCharts.length})...
              </option>
              {savedCharts.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.name} ({k.birth_date} • {k.place_name})
                </option>
              ))}
            </select>
          </CardContent>
        </Card>
      )}

      {/* Step 1: Birth Details Form */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Compass className="size-4 text-primary" />
              <h2 className="font-semibold text-base">Step 1: Your Birth Details</h2>
            </div>
            <span className="text-xs text-muted-foreground">Required for sidereal calculation</span>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="astro-name">Name (Optional)</Label>
              <Input
                id="astro-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rohit"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="astro-gender">Gender</Label>
              <select
                id="astro-gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as typeof gender)}
                className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <Label htmlFor="astro-date">Date of Birth</Label>
              <Input
                id="astro-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="astro-time">Time of Birth</Label>
              <Input
                id="astro-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label className="block mb-1">Place of Birth (City, Country)</Label>
            <PhotonPlacePicker
              value={loc}
              onChange={(newLoc) => setLoc(newLoc)}
              placeholder="Search birth city, town or state..."
            />
            <p className="text-xs text-muted-foreground mt-1">
              Currently set to: <strong className="text-foreground">{loc.label}</strong> (Lat: {loc.lat.toFixed(2)}, Lon: {loc.lon.toFixed(2)})
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Question Selection & Input */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <h2 className="font-semibold text-base">Step 2: Ask Your Question</h2>
            </div>
            <span className="text-xs text-muted-foreground">Pick a topic or write your own</span>
          </div>

          {/* Topic Selector Tabs */}
          <div className="flex flex-wrap gap-2">
            {questionCategories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                  }`}
                >
                  <Icon className="size-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Question Chips */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              {isHindi ? "सुझाए गए प्रश्न (क्लिक करके चुनें):" : "Suggested Questions (click to select):"}
            </Label>
            <div className="grid sm:grid-cols-2 gap-2">
              {questionCategories.find((c) => c.id === activeCategory)?.questions.map((q, i) => {
                const isSelected = question === q;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setQuestion(q)}
                    className={`text-left rounded-xl p-3 text-xs sm:text-sm border transition-all ${
                      isSelected
                        ? "border-primary bg-primary/10 text-primary font-medium shadow-sm"
                        : "border-border/70 bg-card hover:bg-muted/50 text-foreground/80"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <Sparkles className={`size-3.5 shrink-0 mt-0.5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                      <span>{q}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Question Textarea */}
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="custom-astro-q">
                {isHindi ? "AI ज्योतिषी के लिए आपका प्रश्न" : "Your Question for AI Astrologer"}
              </Label>
              <span className="text-[11px] text-primary font-medium flex items-center gap-1">
                <span>🌐</span> {isHindi ? "किसी भी भाषा में पूछें — उसी भाषा में उत्तर मिलेगा" : "Ask in any language — reply will be in the same language"}
              </span>
            </div>
            <Input
              id="custom-astro-q"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={
                isHindi
                  ? "उदा. मेरी नौकरी में पदोन्नति कब होगी? या शादी कब होगी?"
                  : "e.g. When is the best time for me to change jobs or start a venture?"
              }
              className="h-11 text-sm bg-background"
            />
            <p className="text-[11px] text-muted-foreground">
              {isHindi
                ? "💡 आप हिंदी, हिंग्लिश (Hinglish), गुजराती, मराठी, बंगाली, तमिल, तेलुगु या अंग्रेजी किसी भी भाषा में पूछ सकते हैं।"
                : "💡 You can ask in Hindi (हिंदी), Hinglish ('shadi kab hogi'), Gujarati, Marathi, Tamil, Telugu, Bengali, or English."}
            </p>
          </div>

          {/* Limit Reached Banner for Free Users */}
          {hasReachedLimit && (
            <div className="rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-background to-amber-500/10 p-4 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-sm">
                  <Crown className="size-4" />
                  <span>
                    {isHindi
                      ? "3 मुफ़्त सवालों का कोटा समाप्त हो गया है"
                      : "Free 3 Questions Limit Reached"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {isHindi
                    ? "AI ज्योतिषी से अपनी कुंडली, महादशा, करियर, विवाह और धन पर असीमित सवाल पूछने के लिए Pro या Premium में अपग्रेड करें।"
                    : "Upgrade to Pro or Premium to unlock unlimited questions about your horoscope, Mahadasha, and future cycles."}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto">
                {!user && (
                  <Button asChild variant="outline" size="sm" className="text-xs w-full sm:w-auto">
                    <Link to="/login" search={{ redirect: "/tools/ai-astrologer" }}>
                      {isHindi ? "लॉगिन करें" : "Sign In"}
                    </Link>
                  </Button>
                )}
                <Button
                  asChild
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-700 text-white shadow-sm text-xs font-semibold w-full sm:w-auto"
                >
                  <Link to="/pricing">
                    <Crown className="size-3.5 mr-1.5" />
                    {isHindi ? "Pro अपग्रेड करें" : "Upgrade to Pro"}
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {hasReachedLimit ? (
            <Button
              asChild
              size="lg"
              className="w-full h-12 text-base font-semibold shadow-md bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
            >
              <Link to="/pricing">
                <Crown className="mr-2 size-4" />
                {isHindi
                  ? "3 मुफ़्त सवाल पूरे • असीमित सवालों के लिए Pro लें"
                  : "3 Free Questions Used • Upgrade to Pro for Unlimited"}
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          ) : (
            <Button
              type="button"
              size="lg"
              onClick={executeAnalysis}
              disabled={computing}
              className="w-full h-12 text-base font-semibold shadow-md"
            >
              {computing ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  {isHindi
                    ? "कुंडली गणना और AI ज्योतिषी से परामर्श जारी है..."
                    : "Calculating Chart & Consulting AI Astrologer..."}
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 size-4" />
                  {isHindi ? "AI ज्योतिषी से पूछें" : "Ask AI Astrologer"}
                  {!isProOrPremium && (
                    <span className="ml-2 text-xs opacity-85 font-normal">
                      ({remainingQuestions} {isHindi ? "मुफ़्त शेष" : "free left"})
                    </span>
                  )}
                  <ArrowRight className="ml-2 size-4" />
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Error state */}
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-destructive flex items-start gap-3">
          <AlertCircle className="size-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm">Calculation or Analysis Error</h4>
            <p className="text-xs mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Calculation & AI Output Section */}
      {kundliResult && aiResponse && (
        <div className="space-y-6">
          {/* Verified Astronomical Facts Card */}
          <Card className="border-primary/25 bg-card shadow-sm overflow-hidden">
            <div className="border-b border-border/80 bg-muted/40 px-5 py-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-500" />
                <h3 className="font-semibold text-sm">Verified Astronomical Chart Snapshot</h3>
              </div>
              <span className="text-xs text-muted-foreground">
                {name || "User"} • {date} • {time} • {loc.label}
              </span>
            </div>
            <CardContent className="p-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="rounded-lg border border-border bg-background p-2.5">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Ascendant (Lagna)
                  </span>
                  <span className="text-sm font-semibold text-foreground block mt-0.5">
                    {kundliResult.d1.ascendant.rashi}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {kundliResult.d1.ascendant.degreesInRashi.toFixed(1)}°
                  </span>
                </div>
                <div className="rounded-lg border border-border bg-background p-2.5">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Moon Sign (Rashi)
                  </span>
                  <span className="text-sm font-semibold text-foreground block mt-0.5">
                    {kundliResult.moonSign}
                  </span>
                  <span className="text-[11px] text-muted-foreground">Chandra Rashi</span>
                </div>
                <div className="rounded-lg border border-border bg-background p-2.5">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Birth Nakshatra
                  </span>
                  <span className="text-sm font-semibold text-foreground block mt-0.5">
                    {kundliResult.birthNakshatra.nakshatra}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Pada {kundliResult.birthNakshatra.pada} • {kundliResult.birthNakshatra.lord}
                  </span>
                </div>
                <div className="rounded-lg border border-border bg-background p-2.5">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Active Mahadasha
                  </span>
                  <span className="text-sm font-semibold text-foreground block mt-0.5">
                    {kundliResult.vimshottari?.current?.mahadasha.lord || "Calculated"}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {kundliResult.vimshottari?.current?.mahadasha.endISO.slice(0, 10) || "Active"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Astrologer's Vedic Explanation */}
          <Card className="border-primary/40 bg-card shadow-md">
            <div className="border-b border-border/80 bg-primary/5 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-primary animate-pulse" />
                <h3 className="font-serif text-lg font-bold">AI Astrologer Interpretation</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyResponse}
                className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground"
              >
                {copied ? <Check className="size-3.5 mr-1 text-emerald-500" /> : <Copy className="size-3.5 mr-1" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <CardContent className="p-6 sm:p-8">
              <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-serif">
                <FormattedMarkdown content={aiResponse} />
              </div>

              {/* Question Quota Reminder for Free Users */}
              {!isProOrPremium && (
                <div className="mt-6 rounded-xl border border-border bg-background/80 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">
                      {isHindi
                        ? `मुफ़्त सवाल प्रयुक्त: ${Math.min(FREE_QUESTIONS_LIMIT, questionsUsed)} / ${FREE_QUESTIONS_LIMIT}`
                        : `Free Questions Used: ${Math.min(FREE_QUESTIONS_LIMIT, questionsUsed)} / ${FREE_QUESTIONS_LIMIT}`}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">
                      {questionsUsed >= FREE_QUESTIONS_LIMIT
                        ? isHindi
                          ? "सभी 3 मुफ़्त सवाल पूरे हो चुके हैं"
                          : "All 3 free questions used"
                        : isHindi
                          ? `${remainingQuestions} मुफ़्त सवाल शेष`
                          : `${remainingQuestions} question${remainingQuestions === 1 ? "" : "s"} remaining`}
                    </span>
                  </div>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-amber-600 dark:text-amber-400 font-semibold hover:bg-amber-500/10"
                  >
                    <Link to="/pricing">
                      <Crown className="size-3.5 mr-1 text-amber-500" />
                      {isHindi ? "Pro में असीमित सवाल पाएं" : "Get Unlimited with Pro"}
                    </Link>
                  </Button>
                </div>
              )}

              {/* Action Banner for Full Reports */}
              <div className="mt-8 rounded-xl border border-border bg-muted/40 p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm sm:text-base">
                      Want deeper divisional charts & lifelong timelines?
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Explore our comprehensive pro tools for Career, Marriage Matching, and 50+ page Janam Kundli Pro.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button asChild size="sm" variant="default">
                      <Link to="/kundli">
                        Full Janam Kundli Pro
                        <ArrowRight className="size-3.5 ml-1.5" />
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link to="/tools/career-report">Career Report</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
