import { useState, useMemo } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  UserCheck,
  ChevronRight,
  HelpCircle,
  BookOpen,
  Compass,
  Heart,
  Briefcase,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useKundlis } from "@/lib/workspace/hooks";
import { useTranslation } from "@/i18n/I18nProvider";

export type AstrologyTopic = "kundli" | "marriage" | "career" | "finance" | "remedies" | "general";

export interface RecommendedReportConfig {
  title: string;
  description: string;
  href: string;
  badge?: string;
}

export interface AiAstrologerCtaProps {
  articleTitle?: string;
  category?: string;
  tags?: string[];
  topic?: AstrologyTopic;
  customHeading?: string;
  customSuggestedQuestions?: string[];
  recommendedReport?: RecommendedReportConfig;
  className?: string;
}

const DEFAULT_QUESTIONS_BY_TOPIC: Record<AstrologyTopic, string[]> = {
  kundli: [
    "What do my Ascendant (Lagna) and Lagna Lord reveal about my true life purpose?",
    "Which Vimshottari Mahadasha is active in my chart right now and what does it indicate?",
    "Do I have any powerful Raja Yogas or Dhana Yogas in my birth chart?",
    "How is Saturn (Shani) positioned in my chart — am I undergoing Sade Sati?",
    "What are my ruling Nakshatra, deity, and recommended life paths?",
  ],
  marriage: [
    "Does my Kundli have Mangal Dosha (Kuja Dosha) and is there any classical cancellation?",
    "What do my 7th house and Navamsha (D9) reveal about my spouse's nature?",
    "Which upcoming Dasha or planetary transit indicates favorable marriage timing?",
    "If Nadi Dosha or Bhakoot Dosha appears in compatibility, how is it mitigated?",
    "What planetary combinations govern peace, intimacy, and longevity in my marriage?",
  ],
  career: [
    "Which profession or industry best aligns with my 10th house and Amatyakaraka?",
    "Should I pursue independent business/entrepreneurship or a stable job?",
    "When is the next favorable Mahadasha or Antardasha for promotion or career pivot?",
    "Does my chart indicate foreign career opportunities or overseas relocation?",
    "How can I strengthen my weak 10th lord or Saturn for steady professional growth?",
  ],
  finance: [
    "Do I have strong Dhana Yogas or Lakshmi Yogas formed across my 2nd, 5th, and 11th houses?",
    "What planetary periods indicate the greatest wealth accumulation in my lifetime?",
    "Are there any financial leakages (6th or 12th house afflictions) and how can I resolve them?",
    "When is an auspicious planetary period to invest in real estate or long-term assets?",
  ],
  remedies: [
    "What authentic Vedic remedies (mantras, daan, gemstones) suit my active Dasha period?",
    "How can I balance Saturn (Shani) or Rahu during testing transits without fear?",
    "What daily spiritual practice (Sadhana) does my 5th and 9th house combination favor?",
    "How do my challenging house placements (6th, 8th, 12th) turn into sources of growth?",
  ],
  general: [
    "What are the dominant planetary influences currently shaping my decisions?",
    "What is the core psychological strength shown by my Moon sign (Chandra Rashi)?",
    "Which planetary deities and sacred mantras are traditionally aligned with my birth chart?",
    "How can I use my planetary blueprint for personal growth and spiritual discipline?",
  ],
};

const DEFAULT_HINDI_QUESTIONS_BY_TOPIC: Record<AstrologyTopic, string[]> = {
  kundli: [
    "मेरे लग्न और लग्नेश के अनुसार मेरे जीवन का मुख्य उद्देश्य क्या है?",
    "वर्तमान में मेरी कुंडली में कौन सी विंशोत्तरी महादशा चल रही है और इसके क्या फल होंगे?",
    "क्या मेरी जन्म कुंडली में कोई शक्तिशाली राजयोग या धन योग बना है?",
    "मेरी कुंडली में शनि की क्या स्थिति है — क्या मुझ पर साढ़ेसाती का प्रभाव है?",
    "मेरे जन्म नक्षत्र, स्वामी ग्रह और इष्ट देव के अनुसार कौन सा मार्ग श्रेष्ठ है?",
  ],
  marriage: [
    "क्या मेरी कुंडली में मांगलिक दोष है और क्या इसका कोई शास्त्रीय परिहार है?",
    "मेरे 7वें भाव और नवांश (D9) से भावी जीवनसाथी के स्वभाव के क्या संकेत मिलते हैं?",
    "विवाह के लिए कौन सी आगामी महादशा या अंतर्दशा सबसे शुभ है?",
    "कुंडली मिलान में नाड़ी या भकूट दोष आने पर उसका सही समाधान क्या है?",
    "दांपत्य जीवन में सामंजस्य और प्रेम बनाए रखने के लिए कौन से ग्रह अनुकूल हैं?",
  ],
  career: [
    "10वें भाव और अमात्यकारक के अनुसार मेरे लिए कौन सा करियर या व्यवसाय सबसे उत्तम है?",
    "क्या मुझे नौकरी करनी चाहिए या खुद का व्यवसाय/स्टार्टअप शुरू करना चाहिए?",
    "पदोन्नति या करियर में बदलाव के लिए अगला सबसे अनुकूल समय कब है?",
    "क्या मेरी कुंडली में विदेश में नौकरी करने या विदेश में बसने के योग हैं?",
    "करियर में स्थिरता और वृद्धि के लिए 10वें भाव के स्वामी को कैसे मजबूत करें?",
  ],
  finance: [
    "क्या मेरी कुंडली में 2रे, 5वें और 11वें भाव में धन योग या लक्ष्मी योग हैं?",
    "जीवन में सबसे अधिक आर्थिक लाभ किस महादशा में होने की संभावना है?",
    "क्या कुंडली में अनावश्यक खर्च या कर्ज के योग हैं और उनसे कैसे बचें?",
    "संपत्ति, वाहन या दीर्घकालिक निवेश के लिए कौन सा समय श्रेष्ठ रहेगा?",
  ],
  remedies: [
    "मेरी सक्रिय दशा के अनुसार कौन से प्रामाणिक वैदिक उपाय (मंत्र, दान, रत्न) करने चाहिए?",
    "शनि साढ़ेसाती या राहु की दशा में बिना भय के सकारात्मक ऊर्जा कैसे बनाएं?",
    "मेरे 5वें और 9वें भाव के अनुसार मेरी नित्य साधना और इष्ट देव कौन हैं?",
    "कुंडली के चुनौतीपूर्ण भावों (6, 8, 12) के प्रभाव को आत्म-विकास में कैसे बदलें?",
  ],
  general: [
    "वर्तमान में कौन से ग्रह मेरे निर्णयों और जीवन को सबसे ज्यादा प्रभावित कर रहे हैं?",
    "मेरी चंद्र राशि के अनुसार मेरी सबसे बड़ी मानसिक और भावनात्मक शक्ति क्या है?",
    "मेरी जन्म कुंडली के अनुकूल कौन से वैदिक मंत्र और देवी-देवता हैं?",
    "कुंडली के ग्रहों का संतुलन बनाकर आध्यात्मिक और भौतिक प्रगति कैसे करें?",
  ],
};

const DEFAULT_REPORTS_BY_TOPIC: Record<AstrologyTopic, RecommendedReportConfig> = {
  kundli: {
    title: "Janam Kundli Pro (Complete Life Blueprint)",
    description:
      "Full 50+ page Vedic chart dossier with D1–D12 divisional charts, 120-year Dasha timeline, Shadbala, and AI interpretations.",
    href: "/kundli",
    badge: "Flagship Report",
  },
  marriage: {
    title: "Marriage & Compatibility Pro Report",
    description:
      "Comprehensive 36 Guna Ashta Koota matching, Mangal Dosha verification, Navamsha D9 depth audit, and relationship timing.",
    href: "/tools/kundli-matching",
    badge: "Marriage & Compatibility",
  },
  career: {
    title: "Career & Business Astrology Report",
    description:
      "In-depth D10 Dasamsa analysis, promotion cycles, auspicious career pivot timings, and wealth yogas.",
    href: "/tools/career-report",
    badge: "Career Blueprint",
  },
  finance: {
    title: "Wealth & Dhana Yoga Blueprint",
    description:
      "Comprehensive audit of 2nd, 5th, 9th, and 11th houses with Ashtakvarga bindu strength and financial timing.",
    href: "/kundli",
    badge: "Financial Astrology",
  },
  remedies: {
    title: "Vedic Remedial Guide & Dasha Report",
    description:
      "Authentic classical remedies derived from your exact planetary strengths, avoiding fear-based commercialism.",
    href: "/kundli",
    badge: "Remedies & Dasha",
  },
  general: {
    title: "Janam Kundli Pro",
    description:
      "Mathematical Vedic birth chart calculation with transparent Astronomy Engine verification.",
    href: "/kundli",
    badge: "Verified Engine",
  },
};

export function AiAstrologerCta({
  articleTitle,
  category,
  tags = [],
  topic: explicitTopic,
  customHeading,
  customSuggestedQuestions,
  recommendedReport: explicitReport,
  className = "",
}: AiAstrologerCtaProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, lang } = useTranslation();
  const { data: kundliData } = useKundlis();

  const savedCharts = useMemo(() => kundliData?.rows || [], [kundliData]);

  // Determine topic based on props, tags, or title
  const resolvedTopic: AstrologyTopic = useMemo(() => {
    if (explicitTopic) return explicitTopic;
    const combined = `${articleTitle || ""} ${category || ""} ${tags.join(" ")}`.toLowerCase();
    if (
      combined.includes("match") ||
      combined.includes("marriage") ||
      combined.includes("guna") ||
      combined.includes("milan") ||
      combined.includes("vivaha") ||
      combined.includes("compatibility") ||
      combined.includes("partner")
    ) {
      return "marriage";
    }
    if (
      combined.includes("career") ||
      combined.includes("job") ||
      combined.includes("business") ||
      combined.includes("profession") ||
      combined.includes("d10") ||
      combined.includes("dasamsa")
    ) {
      return "career";
    }
    if (
      combined.includes("wealth") ||
      combined.includes("money") ||
      combined.includes("finance") ||
      combined.includes("dhana") ||
      combined.includes("lakshmi")
    ) {
      return "finance";
    }
    if (
      combined.includes("remedy") ||
      combined.includes("remedies") ||
      combined.includes("sade sati") ||
      combined.includes("shani") ||
      combined.includes("dosha")
    ) {
      return "remedies";
    }
    return "kundli";
  }, [explicitTopic, articleTitle, category, tags]);

  const isHindi = lang === "hi";

  const defaultQuestions = isHindi
    ? DEFAULT_HINDI_QUESTIONS_BY_TOPIC[resolvedTopic] || DEFAULT_HINDI_QUESTIONS_BY_TOPIC.kundli
    : DEFAULT_QUESTIONS_BY_TOPIC[resolvedTopic] || DEFAULT_QUESTIONS_BY_TOPIC.kundli;

  const questions = customSuggestedQuestions || defaultQuestions;

  const report = explicitReport || DEFAULT_REPORTS_BY_TOPIC[resolvedTopic] || DEFAULT_REPORTS_BY_TOPIC.kundli;

  // Selected question in state
  const [selectedQuestion, setSelectedQuestion] = useState(questions[0] || "");
  // Selected saved chart (if logged in)
  const [selectedKundliId, setSelectedKundliId] = useState<string>("");

  const activeKundli = useMemo(() => {
    if (!savedCharts.length) return null;
    return savedCharts.find((k) => k.id === selectedKundliId) || savedCharts[0];
  }, [savedCharts, selectedKundliId]);

  const handleSelectQuestion = (q: string) => {
    setSelectedQuestion(q);
  };

  const handleAnalyze = () => {
    const questionText = selectedQuestion.trim() || questions[0];

    // If user has an active saved chart:
    if (user && activeKundli) {
      navigate({
        to: "/tools/$slug",
        params: { slug: "ai-astrologer" },
        search: {
          name: activeKundli.name,
          dob: activeKundli.birth_date,
          tob: String(activeKundli.birth_time).slice(0, 5),
          place: activeKundli.place_name,
          lat: activeKundli.latitude,
          lon: activeKundli.longitude,
          tz: activeKundli.timezone,
          q: questionText,
          auto: "true",
        },
      });
      return;
    }

    // Otherwise navigate to /tools/ai-astrologer with question prefilled
    navigate({
      to: "/tools/$slug",
      params: { slug: "ai-astrologer" },
      search: {
        q: questionText,
      },
    });
  };

  const isHindi = lang === "hi";

  // Dynamic heading based on login and saved chart state
  const heading = useMemo(() => {
    if (customHeading) return customHeading;
    if (user && activeKundli) {
      return isHindi
        ? `${activeKundli.name} की कुंडली के बारे में सवाल पूछें`
        : `Ask AI Astrologer About ${activeKundli.name}'s Chart`;
    }
    return isHindi ? "अपनी कुंडली के बारे में सवाल पूछें" : "Ask AI Astrologer About Your Kundli";
  }, [customHeading, user, activeKundli, isHindi]);

  const subHeading = useMemo(() => {
    if (user && activeKundli) {
      return isHindi
        ? `हमारे AI ज्योतिषी द्वारा ${activeKundli.name} के प्रामाणिक वैदिक ग्रहों, दशा और भावों का विश्लेषण प्राप्त करें।`
        : `Get personalized Vedic chart interpretations for ${activeKundli.name} computed from authentic astronomical data.`;
    }
    return isHindi
      ? "गणितीय रूप से प्रमाणित वैदिक गणना इंजन पर आधारित AI व्याख्या। कोई काल्पनिक भविष्यवाणियां नहीं — केवल वास्तविक ग्रह स्थितियां।"
      : "The AI Astrologer interprets verified astronomical data computed by our Vedic engine — never fabricating planetary positions or birth facts.";
  }, [user, activeKundli, isHindi]);

  return (
    <div
      className={`my-12 overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-b from-card via-card/95 to-primary/[0.03] p-6 sm:p-8 shadow-xl shadow-primary/5 ${className}`}
    >
      {/* Header section with Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Sparkles className="size-3.5 animate-pulse" />
          <span>SanatanTools AI Astrologer</span>
        </div>
        <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5 text-emerald-500" />
          <span>Zero Fabrication Guarantee</span>
        </div>
      </div>

      {/* Main Title & Subtitle */}
      <div className="mt-4">
        <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {heading}
        </h3>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
          {subHeading}
        </p>
      </div>

      {/* Architecture trust banner */}
      <div className="mt-4 rounded-xl border border-border/70 bg-muted/40 p-3 sm:p-3.5 text-xs text-muted-foreground">
        <div className="flex flex-wrap items-center gap-2 font-mono">
          <span className="font-semibold text-foreground">Architecture:</span>
          <span className="inline-flex items-center gap-1 text-primary">
            Birth Details <ChevronRight className="size-3 text-muted-foreground" />
          </span>
          <span className="inline-flex items-center gap-1 text-foreground">
            Calculation Engine (Astronomy Engine) <ChevronRight className="size-3 text-muted-foreground" />
          </span>
          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            Verified Kundli Data <ChevronRight className="size-3 text-muted-foreground" />
          </span>
          <span className="inline-flex items-center gap-1 text-primary font-semibold">
            AI Astrologer Interpretation
          </span>
        </div>
      </div>

      {/* Chart Selector (for logged-in users with saved charts) */}
      {user && savedCharts.length > 0 && (
        <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <UserCheck className="size-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                {isHindi ? "विश्लेषण के लिए कुंडली चुनें:" : "Select saved chart to analyze:"}
              </span>
            </div>
            <select
              value={activeKundli?.id}
              onChange={(e) => setSelectedKundliId(e.target.value)}
              className="h-9 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {savedCharts.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.name} ({k.birth_date})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Suggested Questions Section */}
      <div className="mt-6">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {isHindi ? "सुझाए गए प्रश्न (क्लिक करें):" : "Suggested questions (click to select):"}
        </label>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {questions.map((q, idx) => {
            const isSelected = selectedQuestion === q;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectQuestion(q)}
                className={`group relative text-left rounded-xl px-3.5 py-2 text-xs sm:text-sm transition-all duration-150 ${
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground font-medium shadow-sm"
                    : "border border-border/80 bg-background/80 hover:bg-muted text-foreground/90 hover:border-border"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles
                    className={`size-3 shrink-0 ${
                      isSelected ? "text-primary-foreground" : "text-primary group-hover:scale-110"
                    } transition-transform`}
                  />
                  <span>{q}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Question Input Box */}
      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="ai-astrologer-q" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {isHindi ? "आपका प्रश्न या विषय:" : "Your customized question:"}
          </label>
          <span className="text-[11px] text-primary font-medium flex items-center gap-1">
            <span>🌐</span> {isHindi ? "जिस भाषा में पूछेंगे, उसी भाषा में उत्तर मिलेगा" : "Replies in the language you ask"}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2.5">
          <Input
            id="ai-astrologer-q"
            value={selectedQuestion}
            onChange={(e) => setSelectedQuestion(e.target.value)}
            placeholder={
              isHindi
                ? "अपनी कुंडली के बारे में कोई भी सवाल पूछें..."
                : "Ask any specific question about your chart or dasha..."
            }
            className="h-11 bg-background text-sm"
          />
          <Button
            type="button"
            onClick={handleAnalyze}
            size="lg"
            className="h-11 px-6 font-semibold shrink-0 shadow-md"
          >
            <Sparkles className="mr-2 size-4" />
            {user && activeKundli
              ? isHindi
                ? `${activeKundli.name} की कुंडली से पूछें`
                : `Ask About ${activeKundli.name}`
              : isHindi
                ? "जन्म विवरण दर्ज करें और AI से पूछें"
                : "Enter Birth Details & Ask AI"}
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </div>

      {/* Relevant Premium Report / Tool Recommendation Card */}
      {report && (
        <div className="mt-8 rounded-xl border border-border/80 bg-background/80 p-4 sm:p-5 backdrop-blur">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
                  {report.badge || "Recommended Report"}
                </Badge>
                <h4 className="font-semibold text-sm sm:text-base text-foreground">{report.title}</h4>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">{report.description}</p>
            </div>
            <Button asChild variant="outline" size="sm" className="shrink-0 h-9 font-medium">
              <Link to={report.href}>
                {isHindi ? "रिपोर्ट देखें" : "Explore Report"}
                <ArrowRight className="ml-1.5 size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* Footer helper & General Assistant link */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
        <span>
          {isHindi
            ? "AI केवल गणना किए गए वैदिक सिद्धांतों की व्याख्या करता है, कोई मनगढ़ंत दावे नहीं।"
            : "AI interpretation only runs on verified calculation engine data."}
        </span>
        <Link
          to="/tools/$slug"
          params={{ slug: "ai-dharma-assistant" }}
          className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
        >
          <BookOpen className="size-3" />
          <span>{isHindi ? "सामान्य शास्त्र प्रश्न? AI धर्म सहायक से पूछें →" : "General scripture query? Ask AI Dharma Assistant →"}</span>
        </Link>
      </div>
    </div>
  );
}
