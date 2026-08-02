import { CATEGORIES, type Category } from "./categories";

export type ToolStatus = "live" | "beta" | "coming-soon";

export interface Tool {
  slug: string;
  title: string;
  description: string;
  category: string;
  status: ToolStatus;
  tags: string[];
  popularity: number;
  addedAt: string;
  featured?: boolean;
}

const L = "live" as const;

/** Master registry. Single source of truth for all tools. */
export const TOOLS: Tool[] = [
  // ─── PANCHANG ───
  t(
    "todays-panchang",
    "Today's Panchang",
    "panchang",
    "Full panchang for today — tithi, nakshatra, yoga, karana, sunrise, sunset and inauspicious windows.",
    {
      pop: 98,
      added: "2026-07-14",
      featured: true,
      tags: ["panchang", "daily", "tithi"],
      status: L,
    },
  ),
  t(
    "muhurat-dashboard",
    "Muhurat Dashboard",
    "panchang",
    "Live Choghadiya, Abhijit Muhurat and Rahu Kaal — one glance, right now.",
    {
      pop: 95,
      added: "2026-07-27",
      featured: true,
      tags: ["muhurat", "choghadiya", "rahu kaal", "abhijit"],
      status: L,
    },
  ),
  t(
    "advanced-panchang",
    "Advanced Panchang",
    "panchang",
    "Live Lagna, Graha Gochar, Rahu-Ketu alerts, eclipses, Moonrise/Moonset, Paksha, Ritu, Ayana & Samvatsara.",
    {
      pop: 94,
      added: "2026-07-29",
      featured: true,
      tags: ["lagna", "gochar", "transits", "eclipse", "ritu", "samvatsara"],
      status: L,
    },
  ),
  t(
    "personal-guidance",
    "Personal Guidance",
    "panchang",
    "Deity of the day, lucky colour/number/direction, fasting rules, Tarabalam, Chandrabalam & your Moon-sign horoscope.",
    {
      pop: 96,
      added: "2026-07-29",
      featured: true,
      tags: ["horoscope", "tarabalam", "chandrabalam", "vrat", "lucky", "deity"],
      status: L,
    },
  ),
  t(
    "monthly-panchang",
    "Monthly Panchang",
    "panchang",
    "Full month calendar with daily tithi/nakshatra, festivals & vrats — ICS and PDF export.",
    {
      pop: 93,
      added: "2026-07-30",
      featured: true,
      tags: ["calendar", "month", "ics", "pdf"],
      status: L,
    },
  ),
  t(
    "panchang-compare",
    "Compare Panchang",
    "panchang",
    "Panchang side-by-side for any two cities — great for families across time zones.",
    { pop: 82, added: "2026-07-30", tags: ["compare", "cities"], status: L },
  ),
  t(
    "plan-your-day",
    "Plan Your Day",
    "panchang",
    "Panchang-derived daily tips — best & worst windows, do's, avoids and today's focus.",
    { pop: 90, added: "2026-07-30", featured: true, tags: ["tip", "daily", "muhurat"], status: L },
  ),
  t(
    "todays-tithi",
    "Today's Tithi",
    "panchang",
    "Precise tithi for any date and city — with paksha and exact end time.",
    { pop: 90, added: "2026-07-14", tags: ["tithi", "daily"], status: L },
  ),
  t(
    "todays-nakshatra",
    "Today's Nakshatra",
    "panchang",
    "Today's nakshatra with pada, ruling planet, deity and end time.",
    { pop: 88, added: "2026-07-14", tags: ["nakshatra"], status: L },
  ),
  t(
    "todays-yoga",
    "Today's Yoga",
    "panchang",
    "Today's yoga (one of 27) with progress and end time.",
    { pop: 76, added: "2026-07-14", tags: ["yoga"], status: L },
  ),
  t(
    "todays-karana",
    "Today's Karana",
    "panchang",
    "Today's karana with type (movable / fixed) and exact end time.",
    { pop: 70, added: "2026-07-14", tags: ["karana"], status: L },
  ),
  t(
    "todays-sunrise",
    "Today's Sunrise",
    "panchang",
    "Precise sunrise for any city — with sunset, solar noon and day length.",
    { pop: 82, added: "2026-07-14", tags: ["sunrise"], status: L },
  ),
  t(
    "todays-sunset",
    "Today's Sunset",
    "panchang",
    "Precise sunset for any city — with sunrise, solar noon and day length.",
    { pop: 78, added: "2026-07-14", tags: ["sunset"], status: L },
  ),
  t(
    "rahu-kaal",
    "Rahu Kaal",
    "panchang",
    "Today's rahu kaal window — location-aware and to the minute.",
    { pop: 86, added: "2026-07-14", tags: ["rahu kaal"], status: L },
  ),
  t(
    "gulika-kaal",
    "Gulika Kaal",
    "panchang",
    "Today's gulika kaal window with real sunrise / sunset.",
    { pop: 62, added: "2026-07-14", tags: ["gulika"], status: L },
  ),
  t(
    "yamaganda",
    "Yamaganda",
    "panchang",
    "Today's yamaganda window — one of the eight parts of the day.",
    { pop: 60, added: "2026-07-14", tags: ["yamaganda"], status: L },
  ),
  t(
    "choghadiya",
    "Choghadiya",
    "panchang",
    "Day and night choghadiya with auspicious and inauspicious windows.",
    { pop: 84, added: "2026-07-14", tags: ["choghadiya", "muhurat"], status: L },
  ),
  t(
    "panchang-by-date",
    "Panchang by Date",
    "panchang",
    "Look up the complete panchang for any date and any city on Earth.",
    { pop: 68, added: "2026-07-16", tags: ["panchang", "date"], status: L },
  ),
  t(
    "hora-chart",
    "Hora Chart",
    "panchang",
    "Planetary hora chart for choosing the right time for any activity.",
    { pop: 55, added: "2026-07-16", tags: ["hora"], status: L },
  ),
  t(
    "sunrise-sunset-atlas",
    "Sunrise & Sunset Atlas",
    "panchang",
    "Compare sunrise and sunset across cities around the world.",
    { pop: 56, added: "2026-07-16", tags: ["sunrise", "sunset"], status: L },
  ),
  t(
    "moon-phase",
    "Moon Phase",
    "panchang",
    "Current moon phase, illumination and phase angle for any date.",
    { pop: 64, added: "2026-07-16", tags: ["moon"], status: L },
  ),
  t(
    "abhijit-muhurat",
    "Abhijit Muhurat",
    "panchang",
    "Today's Abhijit muhurat window — the most auspicious 48 minutes.",
    { pop: 66, added: "2026-07-16", tags: ["muhurat"], status: L },
  ),
  t(
    "brahma-muhurat",
    "Brahma Muhurat",
    "panchang",
    "The pre-dawn Brahma muhurat window — ideal for meditation.",
    { pop: 68, added: "2026-07-16", tags: ["muhurat"], status: L },
  ),

  // ─── FESTIVALS ───
  t(
    "festival-calendar-2026",
    "Festival Calendar 2026",
    "festivals",
    "Every Sanatan festival of 2026, month by month, with regional and category filters.",
    { pop: 92, added: "2026-07-14", featured: true, tags: ["calendar"], status: L },
  ),
  t(
    "festival-countdown",
    "Festival Countdown",
    "festivals",
    "A live countdown — down to the second — to any festival of 2026.",
    { pop: 70, added: "2026-07-14", tags: ["countdown"], status: L },
  ),
  t(
    "festival-finder",
    "Festival Finder",
    "festivals",
    "Search festivals by name, deity or month — perfect for planning.",
    { pop: 62, added: "2026-07-14", tags: ["search"], status: L },
  ),
  t(
    "vrat-calendar",
    "Vrat Calendar",
    "festivals",
    "Every major vrat with fasting rules, timings and mantras.",
    { pop: 58, added: "2026-07-16", tags: ["vrat", "fasting"], status: L },
  ),
  t(
    "ekadashi-dates",
    "Ekadashi Dates",
    "festivals",
    "Every ekadashi of 2026 with description and vrat vidhi.",
    { pop: 60, added: "2026-07-16", tags: ["ekadashi", "vrat"], status: L },
  ),
  t(
    "purnima-amavasya",
    "Purnima & Amavasya",
    "festivals",
    "All purnima and amavasya dates with regional significance.",
    { pop: 55, added: "2026-07-16", tags: ["purnima", "amavasya"], status: L },
  ),
  t(
    "regional-festivals",
    "Regional Festivals",
    "festivals",
    "Discover festivals unique to each state and community.",
    { pop: 50, added: "2026-07-16", tags: ["regional"], status: L },
  ),
  t(
    "pradosh-vrat",
    "Pradosh Vrat Dates",
    "festivals",
    "Every Pradosh vrat date with day-type (Som, Bhaum, Shani) noted.",
    { pop: 52, added: "2026-07-16", tags: ["pradosh"], status: L },
  ),
  t(
    "sankashti-chaturthi",
    "Sankashti Chaturthi",
    "festivals",
    "Monthly Sankashti chaturthi dates — Ganesha's day of grace.",
    { pop: 54, added: "2026-07-16", tags: ["ganesha"], status: L },
  ),
  t(
    "festival-of-the-day",
    "Festival of the Day",
    "festivals",
    "Today's or the very next Sanatan festival — one-glance card.",
    { pop: 62, added: "2026-07-16", tags: ["daily"], status: L },
  ),
  t(
    "upcoming-festivals",
    "Upcoming Festivals",
    "festivals",
    "The next 12 festivals ahead — plan the coming weeks.",
    { pop: 58, added: "2026-07-16", tags: ["upcoming"], status: L },
  ),

  // ─── PUJA ───
  t(
    "puja-checklist-generator",
    "Puja Checklist Generator",
    "puja",
    "Interactive samagri, vidhi and mantra checklist for 6 major pujas.",
    { pop: 84, added: "2026-07-14", featured: true, tags: ["puja", "checklist"], status: L },
  ),
  t(
    "aarti-collection",
    "Aarti Collection",
    "puja",
    "Hand-picked collection of the most-loved aartis, beautifully typeset.",
    { pop: 76, added: "2026-07-14", tags: ["aarti"], status: L },
  ),
  t(
    "chalisa-collection",
    "Chalisa Collection",
    "puja",
    "Hanuman, Durga, Shiv, Ganesh and Saraswati chalisas in Devanagari.",
    { pop: 78, added: "2026-07-14", tags: ["chalisa"], status: L },
  ),
  t(
    "puja-vidhi-planner",
    "Puja Vidhi Planner",
    "puja",
    "A step-by-step planner for any puja — sankalp, mantras, aarti and time budget.",
    { pop: 60, added: "2026-07-16", tags: ["puja", "vidhi"], status: L },
  ),
  t(
    "samagri-checklist",
    "Samagri Checklist",
    "puja",
    "Curated samagri lists for eight major pujas with quantities.",
    { pop: 55, added: "2026-07-16", tags: ["samagri"], status: L },
  ),
  t(
    "sankalp-generator",
    "Sankalp Generator",
    "puja",
    "Generate the correct sankalp with your name, gotra, date and place.",
    { pop: 52, added: "2026-07-16", tags: ["sankalp"], status: L },
  ),
  t(
    "griha-pravesh-planner",
    "Griha Pravesh Planner",
    "puja",
    "Complete step-by-step guide to your griha pravesh.",
    { pop: 45, added: "2026-07-16", tags: ["griha pravesh"], status: L },
  ),
  t(
    "havan-guide",
    "Havan Guide",
    "puja",
    "Complete havan guide with samagri, procedure and safety tips.",
    { pop: 50, added: "2026-07-16", tags: ["havan"], status: L },
  ),
  t(
    "aarti-thali-guide",
    "Aarti Thali Guide",
    "puja",
    "Every item on the aarti thali and its symbolic meaning.",
    { pop: 48, added: "2026-07-16", tags: ["aarti"], status: L },
  ),
  t(
    "prasad-recipes",
    "Prasad Recipes",
    "puja",
    "Traditional prasad recipes — modak, panjiri, sheera and more.",
    { pop: 56, added: "2026-07-16", tags: ["prasad", "recipes"], status: L },
  ),

  // ─── MANTRAS ───
  t(
    "digital-jaap-counter",
    "Digital Jaap Counter",
    "mantras",
    "Distraction-free jaap counter with 108-bead mala progress and lifetime count.",
    { pop: 90, added: "2026-07-14", featured: true, tags: ["jaap"], status: L },
  ),
  t(
    "om-counter",
    "Om Counter",
    "mantras",
    "A focused Om counter — chant ॐ with mala progress and gentle chime.",
    { pop: 82, added: "2026-07-14", tags: ["om"], status: L },
  ),
  t(
    "mala-counter",
    "Mala Counter",
    "mantras",
    "A silent mala counter — track beads, malas and lifetime count.",
    { pop: 74, added: "2026-07-14", tags: ["mala"], status: L },
  ),
  t(
    "mantra-timer",
    "Mantra Timer",
    "mantras",
    "A gentle timer for timed mantra sessions with a soft completion chime.",
    { pop: 66, added: "2026-07-14", tags: ["timer"], status: L },
  ),
  t(
    "stotra-collection",
    "Stotra Collection",
    "mantras",
    "Classical stotras — Shiv Tandav, Lingashtakam, Mahamrityunjaya and more.",
    { pop: 72, added: "2026-07-14", tags: ["stotra"], status: L },
  ),
  t(
    "daily-quote",
    "Daily Quote",
    "mantras",
    "A hand-picked Sanatan quote each day — Gita, Upanishads and more.",
    { pop: 68, added: "2026-07-14", tags: ["daily"], status: L },
  ),
  t(
    "daily-shlok",
    "Daily Shlok",
    "mantras",
    "A daily shlok in Devanagari with transliteration and meaning.",
    { pop: 70, added: "2026-07-14", tags: ["daily", "shlok"], status: L },
  ),
  t(
    "mantra-library",
    "Mantra Library",
    "mantras",
    "A curated library of 30+ mantras with Devanagari, IAST and meaning.",
    { pop: 66, added: "2026-07-16", tags: ["library"], status: L },
  ),
  t(
    "beej-mantras",
    "Beej Mantras",
    "mantras",
    "Every beej mantra with deity, meaning and pronunciation guide.",
    { pop: 58, added: "2026-07-16", tags: ["beej"], status: L },
  ),
  t(
    "deity-mantras",
    "Deity Mantras",
    "mantras",
    "Mantras organised by deity — Shiva, Vishnu, Devi, Ganesha and more.",
    { pop: 62, added: "2026-07-16", tags: ["deity"], status: L },
  ),
  t(
    "mantra-of-the-day",
    "Mantra of the Day",
    "mantras",
    "A rotating traditional mantra each day — Devanagari, IAST, meaning.",
    { pop: 60, added: "2026-07-16", tags: ["daily"], status: L },
  ),
  t(
    "gayatri-mantra",
    "Gayatri Mantra Guide",
    "mantras",
    "Word-by-word meaning, chanting rules and benefits of the Gayatri.",
    { pop: 74, added: "2026-07-16", tags: ["gayatri"], status: L },
  ),
  t(
    "mahamrityunjaya-mantra",
    "Mahamrityunjaya Guide",
    "mantras",
    "The healing mantra of Rudra — meaning, benefits and jaap rules.",
    { pop: 72, added: "2026-07-16", tags: ["shiva", "healing"], status: L },
  ),

  // ─── AI ───
  t(
    "ai-dharma-assistant",
    "AI Dharma Assistant",
    "ai",
    "Ask anything about Sanatan Dharma and get a thoughtful, cited answer.",
    { pop: 94, added: "2026-07-15", featured: true, tags: ["ai", "q&a"], status: L },
  ),
  t(
    "ai-gita-summary",
    "AI Gita Summary",
    "ai",
    "Instant, faithful summary of any Bhagavad Gita chapter with key verses.",
    { pop: 88, added: "2026-07-15", featured: true, tags: ["ai", "gita"], status: L },
  ),
  t(
    "ai-shlok-explainer",
    "AI Shlok Explainer",
    "ai",
    "Paste any shloka — get Devanagari, IAST, word-by-word meaning and commentary.",
    { pop: 86, added: "2026-07-15", tags: ["ai"], status: L },
  ),
  t(
    "ai-festival-guide",
    "AI Festival Guide",
    "ai",
    "Any festival, explained — story, tithi, vidhi, samagri and mantras.",
    { pop: 80, added: "2026-07-15", tags: ["ai"], status: L },
  ),
  t(
    "ai-puja-planner",
    "AI Puja Planner",
    "ai",
    "Describe your occasion — AI plans a full puja with sankalp, vidhi and mantras.",
    { pop: 78, added: "2026-07-15", tags: ["ai"], status: L },
  ),
  t(
    "ai-mantra-meaning",
    "AI Mantra Meaning",
    "ai",
    "Any mantra, decoded — Devanagari, IAST, word-by-word meaning, benefits.",
    { pop: 76, added: "2026-07-15", tags: ["ai"], status: L },
  ),
  t(
    "ai-sanskrit-helper",
    "AI Sanskrit Helper",
    "ai",
    "Translate, decode grammar, and pronounce Sanskrit — Devanagari and IAST every time.",
    { pop: 72, added: "2026-07-15", tags: ["ai"], status: L },
  ),
  t(
    "mantra-recommender",
    "AI Mantra Recommender",
    "ai",
    "AI-powered mantra suggestions based on intent, deity and time of day.",
    { pop: 68, added: "2026-07-16", tags: ["ai", "mantra"], status: L },
  ),
  t(
    "baby-name-ai",
    "AI Baby Name Suggester",
    "ai",
    "AI baby name suggestions by nakshatra, syllable, meaning and gender.",
    { pop: 70, added: "2026-07-16", tags: ["ai", "names"], status: L },
  ),

  // ─── TEMPLES ───
  t(
    "temple-finder",
    "Temple Finder",
    "temples",
    "Search 20+ major temples with one-tap directions.",
    { pop: 82, added: "2026-07-14", featured: true, tags: ["directory"], status: L },
  ),
  t(
    "temple-directory",
    "Temple Directory",
    "temples",
    "Searchable directory of 25+ major temples across India.",
    { pop: 66, added: "2026-07-16", tags: ["directory"], status: L },
  ),
  t(
    "darshan-timings",
    "Darshan Timings",
    "temples",
    "Darshan timings and aarti schedules for major temples.",
    { pop: 78, added: "2026-07-16", tags: ["darshan"], status: L },
  ),
  t(
    "char-dham-planner",
    "Char Dham Planner",
    "temples",
    "Plan your Char Dham yatra — routes, best months and stopovers.",
    { pop: 68, added: "2026-07-16", tags: ["yatra"], status: L },
  ),
  t(
    "jyotirlinga-guide",
    "Jyotirlinga Guide",
    "temples",
    "Complete guide to the 12 Jyotirlingas — history, timings and travel.",
    { pop: 74, added: "2026-07-16", tags: ["jyotirlinga"], status: L },
  ),
  t(
    "shakti-peeth-guide",
    "Shakti Peeth Guide",
    "temples",
    "The most-visited Shakti Peethas — stories and how to reach.",
    { pop: 58, added: "2026-07-16", tags: ["shakti peeth"], status: L },
  ),
  t(
    "nearby-temples",
    "Nearby Temples",
    "temples",
    "Find temples nearest to your saved location with distance and details.",
    { pop: 64, added: "2026-07-16", tags: ["nearby"], status: L },
  ),

  // ─── CALCULATORS ───
  t(
    "kundli-generator",
    "Kundli Generator",
    "calculators",
    "Free Vedic kundli with rashi, nakshatra, tithi and yoga.",
    { pop: 94, added: "2026-07-16", featured: true, tags: ["kundli"], status: L },
  ),
  t(
    "rashi-calculator",
    "Rashi Calculator",
    "calculators",
    "Find your moon sign (rashi) from birth date and time.",
    { pop: 80, added: "2026-07-16", tags: ["rashi"], status: L },
  ),
  t(
    "nakshatra-finder",
    "Nakshatra Finder",
    "calculators",
    "Discover your janma nakshatra, pada and its ruling deity.",
    { pop: 78, added: "2026-07-16", tags: ["nakshatra"], status: L },
  ),
  t(
    "dasha-calculator",
    "Vimshottari Dasha",
    "calculators",
    "Vimshottari mahadasha timeline computed from your janma nakshatra.",
    { pop: 65, added: "2026-07-16", tags: ["dasha"], status: L },
  ),
  t(
    "gemstone-recommender",
    "Gemstone Recommender",
    "calculators",
    "Personalised gemstone recommendation based on your rashi.",
    { pop: 60, added: "2026-07-16", tags: ["gemstone"], status: L },
  ),
  t("numerology", "Numerology", "calculators", "Life-path and destiny numbers with meaning.", {
    pop: 55,
    added: "2026-07-16",
    tags: ["numerology"],
    status: L,
  }),
  t(
    "name-numerology",
    "Name Numerology",
    "calculators",
    "Numerological value of any name with meaning and planetary vibration.",
    { pop: 52, added: "2026-07-16", tags: ["numerology"], status: L },
  ),
  t(
    "birthstone-finder",
    "Birthstone Finder",
    "calculators",
    "Traditional Western birthstone for any birth month.",
    { pop: 46, added: "2026-07-16", tags: ["birthstone"], status: L },
  ),

  // ─── SANSKRIT ───
  t(
    "sanskrit-dictionary",
    "Sanskrit Dictionary",
    "sanskrit",
    "Look up 60+ core Sanskrit words with meaning and root.",
    { pop: 72, added: "2026-07-16", featured: true, tags: ["dictionary"], status: L },
  ),
  t(
    "transliteration",
    "IAST → Devanagari",
    "sanskrit",
    "Convert IAST or phonetic English to Devanagari instantly.",
    { pop: 68, added: "2026-07-16", tags: ["transliteration"], status: L },
  ),
  t(
    "sandhi-splitter",
    "Sandhi Splitter",
    "sanskrit",
    "Rule-based sandhi splitter for common compound words.",
    { pop: 48, added: "2026-07-16", tags: ["sandhi"], status: L },
  ),
  t(
    "shloka-analyzer",
    "Shloka Analyzer",
    "sanskrit",
    "Count syllables, padas, and guess the chhandas of any shloka.",
    { pop: 52, added: "2026-07-16", tags: ["shloka"], status: L },
  ),
  t(
    "devanagari-typing",
    "Devanagari Typing",
    "sanskrit",
    "Type in Devanagari with an on-screen keyboard.",
    { pop: 58, added: "2026-07-16", tags: ["typing"], status: L },
  ),
  t(
    "verb-conjugator",
    "Verb Conjugator",
    "sanskrit",
    "Conjugate common Sanskrit dhatus in the present tense (lat lakara).",
    { pop: 44, added: "2026-07-16", tags: ["grammar"], status: L },
  ),
  t(
    "sanskrit-word-of-day",
    "Sanskrit Word of the Day",
    "sanskrit",
    "A new Sanskrit word every day with meaning and root.",
    { pop: 60, added: "2026-07-16", tags: ["daily"], status: L },
  ),

  // ─── BABY NAMES ───
  t(
    "names-by-nakshatra",
    "Names by Nakshatra",
    "baby-names",
    "Baby names aligned to your child's janma nakshatra pada syllables.",
    { pop: 85, added: "2026-07-16", featured: true, tags: ["nakshatra"], status: L },
  ),
  t(
    "names-by-rashi",
    "Names by Rashi",
    "baby-names",
    "Baby names by moon-sign syllables — beautiful and meaningful.",
    { pop: 78, added: "2026-07-16", tags: ["rashi"], status: L },
  ),
  t(
    "names-by-deity",
    "Names by Deity",
    "baby-names",
    "Names inspired by Shiva, Vishnu, Devi, Ganesha and more.",
    { pop: 72, added: "2026-07-16", tags: ["deity"], status: L },
  ),
  t(
    "names-by-meaning",
    "Names by Meaning",
    "baby-names",
    "Find names by meaning — light, strength, wisdom, love and more.",
    { pop: 65, added: "2026-07-16", tags: ["meaning"], status: L },
  ),
  t(
    "twin-names",
    "Twin Names",
    "baby-names",
    "Beautifully paired names for twins, drawn from Sanskrit tradition.",
    { pop: 50, added: "2026-07-16", tags: ["twins"], status: L },
  ),
  t(
    "ai-name-suggester",
    "AI Name Suggester",
    "baby-names",
    "AI baby name suggestions by nakshatra, syllable and meaning.",
    { pop: 68, added: "2026-07-16", tags: ["ai"], status: L },
  ),

  // ─── LEARNING ───
  t(
    "bhagavad-gita",
    "Bhagavad Gita — Chapter Reader",
    "learning",
    "All 18 chapters of the Gita with summary and core teaching.",
    { pop: 90, added: "2026-07-16", featured: true, tags: ["gita"], status: L },
  ),
  t(
    "upanishads-guide",
    "Upanishads Guide",
    "learning",
    "The principal Upanishads with theme and key teaching.",
    { pop: 72, added: "2026-07-16", tags: ["upanishads"], status: L },
  ),
  t(
    "vedas-introduction",
    "Vedas Introduction",
    "learning",
    "An accessible introduction to the four Vedas.",
    { pop: 68, added: "2026-07-16", tags: ["vedas"], status: L },
  ),
  t(
    "yoga-sutras",
    "Yoga Sutras Overview",
    "learning",
    "The four padas of Patanjali's Yoga Sutras with key verses.",
    { pop: 62, added: "2026-07-16", tags: ["yoga"], status: L },
  ),
  t(
    "sanatan-timeline",
    "Sanatan Timeline",
    "learning",
    "A visual timeline of Sanatan Dharma — from the Vedic era to today.",
    { pop: 55, added: "2026-07-16", tags: ["history"], status: L },
  ),
  t(
    "deity-encyclopedia",
    "Deity Encyclopedia",
    "learning",
    "22+ deities with iconography, mantras and lore.",
    { pop: 74, added: "2026-07-16", tags: ["deities"], status: L },
  ),
  t(
    "mahabharata-summary",
    "Mahabharata Summary",
    "learning",
    "All 18 parvas of the Mahabharata with themes and story arc.",
    { pop: 66, added: "2026-07-16", tags: ["mahabharata"], status: L },
  ),
  t(
    "ramayana-summary",
    "Ramayana Summary",
    "learning",
    "The seven kandas of the Valmiki Ramayana in one page.",
    { pop: 68, added: "2026-07-16", tags: ["ramayana"], status: L },
  ),
  t(
    "puranas-overview",
    "18 Mahapuranas",
    "learning",
    "Complete list of the 18 Mahapuranas — deity, theme and verse count.",
    { pop: 58, added: "2026-07-16", tags: ["puranas"], status: L },
  ),
  t(
    "deity-of-the-day",
    "Deity of the Day",
    "learning",
    "A rotating deity each day — with mantra and significance.",
    { pop: 56, added: "2026-07-16", tags: ["daily"], status: L },
  ),
  t(
    "nakshatra-guide",
    "27 Nakshatras Guide",
    "learning",
    "All 27 nakshatras with lord, deity, symbol and nature.",
    { pop: 62, added: "2026-07-16", tags: ["nakshatra"], status: L },
  ),
  t(
    "rashi-guide",
    "12 Rashis Guide",
    "learning",
    "All 12 rashis with lord, element and characteristics.",
    { pop: 60, added: "2026-07-16", tags: ["rashi"], status: L },
  ),
];

function t(
  slug: string,
  title: string,
  category: string,
  description: string,
  opts: { pop: number; added: string; featured?: boolean; tags?: string[]; status?: ToolStatus },
): Tool {
  return {
    slug,
    title,
    description,
    category,
    status: opts.status ?? "coming-soon",
    tags: opts.tags ?? [],
    popularity: opts.pop,
    addedAt: opts.added,
    featured: opts.featured,
  };
}

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find((x) => x.slug === slug);
}
export function toolsByCategory(categorySlug: string): Tool[] {
  return TOOLS.filter((x) => x.category === categorySlug);
}
export function popularTools(limit = 8): Tool[] {
  return [...TOOLS].sort((a, b) => b.popularity - a.popularity).slice(0, limit);
}
export function recentTools(limit = 8): Tool[] {
  return [...TOOLS].sort((a, b) => b.addedAt.localeCompare(a.addedAt)).slice(0, limit);
}
export function relatedTools(tool: Tool, limit = 4): Tool[] {
  return TOOLS.filter((x) => x.category === tool.category && x.slug !== tool.slug).slice(0, limit);
}
export function categoryFor(tool: Tool): Category | undefined {
  return CATEGORIES.find((c) => c.slug === tool.category);
}
export function searchTools(
  query: string,
  opts?: { category?: string; status?: ToolStatus | "all" },
): Tool[] {
  const q = query.trim().toLowerCase();
  return TOOLS.filter((tool) => {
    if (opts?.category && opts.category !== "all" && tool.category !== opts.category) return false;
    if (opts?.status && opts.status !== "all" && tool.status !== opts.status) return false;
    if (!q) return true;
    return (
      tool.title.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      tool.category.toLowerCase().includes(q)
    );
  });
}
