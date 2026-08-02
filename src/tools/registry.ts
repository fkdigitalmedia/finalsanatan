import { lazy, type ComponentType } from "react";
import type { FAQItem } from "@/components/ui-kit/FAQList";
import { FLAGSHIP_CONTENT } from "@/tools/content/flagship";
import { BATCH2_CONTENT } from "@/tools/content/batch2";
import { BATCH3_MANTRAS } from "@/tools/content/batch3-mantras";
import { BATCH4_CONTENT } from "@/tools/content/batch4";
import { BATCH5_CONTENT } from "@/tools/content/batch5";

/**
 * Tool widgets are code-split per module.
 *
 * These five modules hold ~90 interactive tool widgets. Importing them eagerly
 * made every /tools/:slug page ship all of them in a single chunk. Each entry
 * below is a `React.lazy` wrapper, so a tool page downloads only the module its
 * own widget lives in. The SEO-relevant copy (title, intro, howToUse, benefits,
 * FAQs) stays in this module and is still server-rendered.
 *
 * The `<Component />` render site is wrapped in Suspense in
 * `src/routes/tools.$slug.tsx`.
 */
type ToolModule = () => Promise<Record<string, unknown>>;

const loadPanchang = (() => import("@/tools/panchang")) as ToolModule;
const loadPanchangExtras = (() => import("@/tools/panchang-extras")) as ToolModule;
const loadCollections = (() => import("@/tools/collections")) as ToolModule;
const loadAi = (() => import("@/tools/ai")) as ToolModule;
const loadLibrary = (() => import("@/tools/library")) as ToolModule;

/** Wrap one named export of a lazily-imported module as a lazy component. */
function lazyNamed(loader: ToolModule, name: string): ComponentType {
  return lazy(async () => {
    const mod = await loader();
    const Component = mod[name] as ComponentType | undefined;
    if (!Component) {
      throw new Error(`Tool component "${name}" is missing from its module`);
    }
    return { default: Component };
  });
}

/** Cached accessor so each named export maps to exactly one lazy component. */
function lazyModule(loader: ToolModule) {
  const cache = new Map<string, ComponentType>();
  return new Proxy({} as Record<string, ComponentType>, {
    get(_target, prop: string) {
      let existing = cache.get(prop);
      if (!existing) {
        existing = lazyNamed(loader, prop);
        cache.set(prop, existing);
      }
      return existing;
    },
  });
}

const P = lazyModule(loadPanchang);
const PX = lazyModule(loadPanchangExtras);
const C = lazyModule(loadCollections);
const A = lazyModule(loadAi);
const Lib = lazyModule(loadLibrary);

const {
  TodaysPanchang,
  TodaysTithi,
  TodaysNakshatra,
  TodaysYoga,
  TodaysKarana,
  TodaysSunrise,
  TodaysSunset,
  RahuKaal,
  GulikaKaal,
  Yamaganda,
  Choghadiya,
  MuhuratDashboard,
  PersonalGuidance,
  AdvancedPanchang,
} = P;
const { MonthlyPanchang, PanchangCompare, PlanYourDay } = PX;
const {
  FestivalCalendar,
  FestivalCountdown,
  FestivalFinder,
  DigitalJaapCounter,
  OmCounter,
  MalaCounter,
  MantraTimer,
  DailyQuote,
  DailyShlok,
  AartiCollection,
  ChalisaCollection,
  StotraCollection,
  TempleFinder,
  PujaChecklistGenerator,
} = C;
const {
  AIDharmaAssistant,
  AIGitaSummary,
  AIShlokExplainer,
  AIFestivalGuide,
  AIPujaPlanner,
  AIMantraMeaning,
  AISanskritHelper,
} = A;

export interface ToolExample {
  label: string;
  value: string;
}

export interface ToolContent {
  Component: ComponentType;
  intro?: string;
  howToUse: string[];
  benefits: string[];
  faqs: FAQItem[];
  copyText?: string;
  /** Global Tool Page Standard — unique, per-tool sections. */
  useCases?: string[];
  mistakes?: string[];
  formula?: { title: string; body: string };
  accuracy?: string;
  privacy?: string;
  examples?: ToolExample[];
  /** Optional related-tool overrides (slugs). If omitted, category-based related is used. */
  relatedSlugs?: string[];
}

const genericHow = [
  "Open the tool — no signup needed.",
  "Enter or pick the inputs shown.",
  "Read the result — copy or share with one tap.",
  "Bookmark for quick access anytime.",
];
const genericBenefits = [
  "Free, fast and ad-light.",
  "Built for daily practice.",
  "Works on every device.",
  "Grounded in traditional sources.",
];
const genericFaqs: FAQItem[] = [
  { q: "Is this tool free?", a: "Yes — every SanatanTools utility is free and ad-light." },
  {
    q: "Do I need to sign up?",
    a: "No signup is required. Sign in only if you want to save bookmarks and history across devices.",
  },
  {
    q: "How accurate is the data?",
    a: "We source from traditional shastra and use standard drik-precision astronomy where computation is involved.",
  },
];

function mk(
  Component: ComponentType,
  opts: Partial<Omit<ToolContent, "Component">> = {},
): ToolContent {
  return {
    Component,
    intro: opts.intro,
    howToUse: opts.howToUse ?? genericHow,
    benefits: opts.benefits ?? genericBenefits,
    faqs: opts.faqs ?? genericFaqs,
    copyText: opts.copyText,
    useCases: opts.useCases,
    mistakes: opts.mistakes,
    formula: opts.formula,
    accuracy: opts.accuracy,
    privacy: opts.privacy,
    examples: opts.examples,
    relatedSlugs: opts.relatedSlugs,
  };
}

const panchangFaqs = (topic: string): FAQItem[] => [
  {
    q: `How is ${topic} calculated?`,
    a: `We use astronomy-engine with real solar and lunar ephemerides. Nakshatra and yoga use the Lahiri (Chitrapaksha) ayanamsa.`,
  },
  {
    q: "Does it work for any city?",
    a: "Yes — pick any city preset or set your own. All timings honour real sunrise, sunset and time zone.",
  },
  {
    q: "Why differ from another panchang?",
    a: "Some traditional panchangs use different ayanamsa systems (Raman, Krishnamurti). Values match modern drik panchangs within a small margin.",
  },
  {
    q: "Is my location saved?",
    a: "Yes — saved on your device only. Nothing is sent to a server.",
  },
];

export const TOOL_CONTENT: Record<string, ToolContent> = {
  // Existing Phase 3 tools
  "todays-panchang": mk(TodaysPanchang, {
    intro: "Your complete drik-precise panchang — computed live for your city.",
    faqs: panchangFaqs("the panchang"),
  }),
  "todays-tithi": mk(TodaysTithi, { faqs: panchangFaqs("tithi") }),
  "todays-nakshatra": mk(TodaysNakshatra, { faqs: panchangFaqs("nakshatra") }),
  "todays-yoga": mk(TodaysYoga, { faqs: panchangFaqs("yoga") }),
  "todays-karana": mk(TodaysKarana, { faqs: panchangFaqs("karana") }),
  "todays-sunrise": mk(TodaysSunrise, { faqs: panchangFaqs("sunrise") }),
  "todays-sunset": mk(TodaysSunset, { faqs: panchangFaqs("sunset") }),
  "rahu-kaal": mk(RahuKaal, { faqs: panchangFaqs("rahu kaal") }),
  "gulika-kaal": mk(GulikaKaal, { faqs: panchangFaqs("gulika kaal") }),
  yamaganda: mk(Yamaganda, { faqs: panchangFaqs("yamaganda") }),
  choghadiya: mk(Choghadiya, { faqs: panchangFaqs("choghadiya") }),
  "muhurat-dashboard": mk(MuhuratDashboard, {
    intro:
      "One-glance Muhurat cockpit — live Choghadiya window, Abhijit Muhurat and Rahu Kaal for your city.",
    faqs: panchangFaqs("the muhurat dashboard"),
  }),
  "advanced-panchang": mk(AdvancedPanchang, {
    intro:
      "Deep panchang — live Lagna chart, Graha Gochar transits, Rahu-Ketu alerts, eclipse calendar, Moonrise/Moonset, Paksha, Ritu, Ayana and Samvatsara for any city and date.",
    howToUse: [
      "Pick your city and the date you want to analyse.",
      "Read the Lagna — it recalculates for the current moment on refresh.",
      "Scan Paksha, Ritu, Ayana, Samvatsara and Solar Masa in the Almanac card.",
      "Check Graha Gochar for planet-wise rashi, nakshatra and retrogression.",
      "Track upcoming Solar & Lunar eclipses and the next Rahu-Ketu transit.",
    ],
    benefits: [
      "One dashboard for everything astrologers scan every morning.",
      "Live Lagna without opening a full Kundli tool.",
      "Rahu-Ketu shift dates — plan Shanti pujas ahead of time.",
      "Global eclipse calendar in your local time zone.",
      "Traditional Vedic frame: Vikram, Shaka and Kali Samvat all shown.",
    ],
    faqs: [
      {
        q: "Which ayanamsa is used?",
        a: "Lahiri (Chitrapaksha) — the Government-of-India standard used across drik panchangs.",
      },
      {
        q: "Are eclipse times visible from my city?",
        a: "Peak times are global, converted to your local time zone. Whether the eclipse is visible from your location depends on the eclipse geometry — check a visibility map.",
      },
      {
        q: "Why is Rahu always retrograde?",
        a: "Rahu and Ketu are the Moon's mean nodes, not physical bodies. By convention they are always shown moving backwards through the zodiac.",
      },
      {
        q: "How accurate is the Lagna?",
        a: "Ascendant is computed with Meeus' formula 14.5 using mean obliquity, LST from GMST and Lahiri ayanamsa — matches modern astrological software within an arc-minute for civil use.",
      },
    ],
    accuracy:
      "Astronomy-engine ephemeris + Lahiri ayanamsa. Rahu uses the mean lunar node (Meeus ch. 47). Eclipses via astronomy-engine's Search/Next Solar & Lunar eclipse functions.",
    privacy:
      "All computation is client-side. Nothing about your location or lookups leaves your device.",
  }),
  "monthly-panchang": mk(MonthlyPanchang, {
    intro:
      "Full month at a glance — daily tithi & nakshatra with festival highlights, ICS and PDF export.",
    faqs: panchangFaqs("the monthly panchang"),
  }),
  "panchang-compare": mk(PanchangCompare, {
    intro:
      "Compare panchang side-by-side for any two cities — perfect for family across time zones.",
    faqs: panchangFaqs("the compare view"),
  }),
  "plan-your-day": mk(PlanYourDay, {
    intro: "Panchang-derived tips — best & worst windows, do's, avoids and a daily focus.",
    faqs: panchangFaqs("plan your day"),
  }),
  "personal-guidance": mk(PersonalGuidance, {
    intro:
      "Your personal Sanatan companion — deity of the day, lucky attributes, fasting rules, Tarabalam, Chandrabalam and a Moon-sign horoscope crafted for today.",
    howToUse: [
      "Pick your city and today's date (already set).",
      "See today's deity, mantra, lucky colour, number, direction and fasting rules.",
      "Optionally add your janma nakshatra and janma rashi — get personal Tarabalam & Chandrabalam.",
      "Read your Moon-sign daily guidance for work, money, health and relations.",
    ],
    benefits: [
      "One place for the practical questions devotees ask every morning.",
      "Nakshatra & Rashi-aware — becomes personal in one tap.",
      "Traditional Tarabalam (9 taras) and Chandrabalam (12 houses) for travel decisions.",
      "Deity + mantra + practice — perfect for a 2-minute morning ritual.",
    ],
    faqs: [
      {
        q: "How accurate is Tarabalam?",
        a: "We compute the exact difference between your janma nakshatra and today's nakshatra using Lahiri ayanamsa, then map to the 9-tara scheme used across drik panchangs.",
      },
      {
        q: "What is Chandrabalam used for?",
        a: "Chandrabalam is the traditional check for whether today's Moon supports travel, meetings and new ventures — based on the Moon's house from your janma rashi.",
      },
      {
        q: "Is the horoscope generic AI text?",
        a: "No — it is deterministic guidance seeded by your janma rashi and today's date; the same rashi always sees the same reading on the same day.",
      },
      {
        q: "Is my birth data stored?",
        a: "No — your janma nakshatra & rashi live only in your browser tab; nothing is sent to a server.",
      },
    ],
    accuracy:
      "Astronomy-engine + Lahiri (Chitrapaksha) ayanamsa for Moon sign & nakshatra; traditional Tarabalam & Chandrabalam mappings.",
    privacy: "All computation is client-side. Your janma details never leave your device.",
  }),
  "festival-calendar-2026": mk(FestivalCalendar),
  "festival-countdown": mk(FestivalCountdown),
  "festival-finder": mk(FestivalFinder),
  "digital-jaap-counter": mk(DigitalJaapCounter),
  "om-counter": mk(OmCounter),
  "mala-counter": mk(MalaCounter),
  "mantra-timer": mk(MantraTimer),
  "daily-quote": mk(DailyQuote),
  "daily-shlok": mk(DailyShlok),
  "aarti-collection": mk(AartiCollection),
  "chalisa-collection": mk(ChalisaCollection),
  "stotra-collection": mk(StotraCollection),
  "temple-finder": mk(TempleFinder),
  "puja-checklist-generator": mk(PujaChecklistGenerator),

  // AI (existing + new)
  "ai-dharma-assistant": mk(AIDharmaAssistant, {
    intro:
      "Ask anything about Sanatan Dharma — scripture, ritual, philosophy — and get a thoughtful, cited answer.",
  }),
  "ai-gita-summary": mk(AIGitaSummary),
  "ai-shlok-explainer": mk(AIShlokExplainer),
  "ai-festival-guide": mk(AIFestivalGuide),
  "ai-puja-planner": mk(AIPujaPlanner),
  "ai-mantra-meaning": mk(AIMantraMeaning),
  "ai-sanskrit-helper": mk(AISanskritHelper),
  "mantra-recommender": mk(Lib.AIMantraRecommender, {
    intro:
      "Describe your intent — AI suggests three traditional mantras with meaning, benefit and jaap count.",
  }),
  "baby-name-ai": mk(Lib.AIBabyNameSuggester, {
    intro: "AI-crafted Sanskrit name suggestions based on nakshatra, syllable, meaning and gender.",
  }),
  "ai-name-suggester": mk(Lib.AIBabyNameSuggester),

  // Panchang (new)
  "panchang-by-date": mk(Lib.PanchangByDate, { faqs: panchangFaqs("the panchang") }),
  "hora-chart": mk(Lib.HoraChart, {
    intro:
      "The 24 planetary horas of the day and night — perfect for choosing the right time to act.",
  }),
  "sunrise-sunset-atlas": mk(Lib.SunriseSunsetAtlas),
  "moon-phase": mk(Lib.MoonPhase, {
    intro: "Current moon phase, illumination and phase angle — computed live for any date.",
  }),
  "abhijit-muhurat": mk(Lib.AbhijitMuhurat, {
    intro:
      "Abhijit is the 8th of 15 day-muhurats — 48 minutes centred on solar noon. The most auspicious window of the day (except Wednesdays).",
  }),
  "brahma-muhurat": mk(Lib.BrahmaMuhurat, {
    intro:
      "The two muhurats before sunrise — the sattva-rich window when the mind is most receptive to sadhana.",
  }),

  // Festivals (new)
  "vrat-calendar": mk(Lib.VratCalendar),
  "ekadashi-dates": mk(Lib.EkadashiDates, {
    intro: "All 24 ekadashis of 2026 with description and vrat vidhi.",
  }),
  "purnima-amavasya": mk(Lib.PurnimaAmavasya),
  "regional-festivals": mk(Lib.RegionalFestivals),
  "pradosh-vrat": mk(Lib.PradoshVrat),
  "sankashti-chaturthi": mk(Lib.SankashtiChaturthi),
  "festival-of-the-day": mk(Lib.FestivalOfTheDay),
  "upcoming-festivals": mk(Lib.UpcomingFestivals),

  // Puja (new)
  "puja-vidhi-planner": mk(Lib.PujaVidhiPlanner),
  "samagri-checklist": mk(Lib.SamagriChecklist),
  "sankalp-generator": mk(Lib.SankalpGenerator),
  "griha-pravesh-planner": mk(Lib.GrihaPraveshPlanner),
  "havan-guide": mk(Lib.HavanGuide),
  "aarti-thali-guide": mk(Lib.AartiThaliGuide),
  "prasad-recipes": mk(Lib.PrasadRecipes),

  // Mantras (new)
  "mantra-library": mk(Lib.MantraLibrary),
  "beej-mantras": mk(Lib.BeejMantras),
  "deity-mantras": mk(Lib.DeityMantras),
  "mantra-of-the-day": mk(Lib.MantraOfTheDay),
  "gayatri-mantra": mk(Lib.GayatriGuide),
  "mahamrityunjaya-mantra": mk(Lib.MahamrityunjayaGuide),

  // Temples (new)
  "temple-directory": mk(Lib.TempleDirectory),
  "darshan-timings": mk(Lib.DarshanTimings),
  "char-dham-planner": mk(Lib.CharDhamPlanner),
  "jyotirlinga-guide": mk(Lib.JyotirlingaGuide),
  "shakti-peeth-guide": mk(Lib.ShaktiPeethGuide),
  "nearby-temples": mk(Lib.NearbyTemples),

  // Calculators
  "kundli-generator": mk(Lib.KundliGenerator, {
    intro:
      "A quick Vedic snapshot from birth date and time — rashi, nakshatra, tithi, yoga and naming syllables.",
  }),
  "rashi-calculator": mk(Lib.RashiCalculator),
  "nakshatra-finder": mk(Lib.NakshatraFinder),
  "dasha-calculator": mk(Lib.DashaCalculator, {
    intro: "Your Vimshottari mahadasha timeline computed from your janma nakshatra.",
  }),
  "gemstone-recommender": mk(Lib.GemstoneRecommender),
  numerology: mk(Lib.Numerology),
  "name-numerology": mk(Lib.NameNumerology),
  "birthstone-finder": mk(Lib.BirthstoneFinder),

  // Sanskrit
  "sanskrit-dictionary": mk(Lib.SanskritDictionary),
  transliteration: mk(Lib.Transliteration, {
    intro: "Type IAST or English phonetic; get instant Devanagari. Try: 'om namah shivaya'.",
  }),
  "sandhi-splitter": mk(Lib.SandhiSplitter),
  "shloka-analyzer": mk(Lib.ShlokaAnalyzer),
  "devanagari-typing": mk(Lib.DevanagariTyping),
  "verb-conjugator": mk(Lib.VerbConjugator),
  "sanskrit-word-of-day": mk(Lib.SanskritWordOfDay),

  // Baby names
  "names-by-nakshatra": mk(Lib.NamesByNakshatra),
  "names-by-rashi": mk(Lib.NamesByRashi),
  "names-by-deity": mk(Lib.NamesByDeity),
  "names-by-meaning": mk(Lib.NamesByMeaning),
  "twin-names": mk(Lib.TwinNames),

  // Learning
  "bhagavad-gita": mk(Lib.BhagavadGita),
  "upanishads-guide": mk(Lib.UpanishadsGuide),
  "vedas-introduction": mk(Lib.VedasIntroduction),
  "yoga-sutras": mk(Lib.YogaSutras),
  "sanatan-timeline": mk(Lib.SanatanTimeline),
  "deity-encyclopedia": mk(Lib.DeityEncyclopedia),
  "mahabharata-summary": mk(Lib.MahabharataSummary),
  "ramayana-summary": mk(Lib.RamayanaSummary),
  "puranas-overview": mk(Lib.PuranasOverview),
  "deity-of-the-day": mk(Lib.DeityOfTheDay),
  "nakshatra-guide": mk(Lib.NakshatraGuide),
  "rashi-guide": mk(Lib.RashiGuide),
};

// ─── Merge Global Tool Page Standard content packs ───
for (const [slug, spec] of Object.entries({
  ...FLAGSHIP_CONTENT,
  ...BATCH2_CONTENT,
  ...BATCH3_MANTRAS,
  ...BATCH4_CONTENT,
  ...BATCH5_CONTENT,
})) {
  const base = TOOL_CONTENT[slug];
  if (!base) continue;
  TOOL_CONTENT[slug] = {
    ...base,
    intro: spec.intro,
    howToUse: spec.howToUse,
    benefits: spec.benefits,
    faqs: spec.faqs,
    useCases: spec.useCases,
    mistakes: spec.mistakes,
    examples: spec.examples,
    formula: spec.formula,
    accuracy: spec.accuracy,
    privacy: spec.privacy,
    relatedSlugs: spec.relatedSlugs,
  };
}

export function getToolContent(slug: string): ToolContent | undefined {
  return TOOL_CONTENT[slug];
}
