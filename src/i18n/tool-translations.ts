/**
 * Per-tool i18n dictionary.
 *
 * Contains title, description and optional intro for every tool, in every
 * supported language. English is the source of truth and falls back when a
 * translation is missing. Add more languages by adding more `Lang` keys.
 *
 * FAQ, how-to, benefits, shell buttons, notify/save/share, badges and search
 * strings live in `src/i18n/translations/<lang>.json` under `tool_shell.*`
 * and `tool_page.*` — they are shared across every tool.
 */

export type ToolLang =
  "en" | "hi" | "mr" | "gu" | "ta" | "te" | "kn" | "bn" | "ml" | "pa" | "or" | "as";

export interface ToolEntry {
  title: string;
  description: string;
  intro?: string;
}

/**
 * Panchang tools share a 4-question FAQ template that takes a `topic` slot.
 * This maps a slug to its localised topic key under `tool_shell.panchang_topics.*`.
 */
export const PANCHANG_TOPIC: Record<string, string> = {
  "todays-panchang": "panchang",
  "todays-tithi": "tithi",
  "todays-nakshatra": "nakshatra",
  "todays-yoga": "yoga",
  "todays-karana": "karana",
  "todays-sunrise": "sunrise",
  "todays-sunset": "sunset",
  "rahu-kaal": "rahu_kaal",
  "gulika-kaal": "gulika_kaal",
  yamaganda: "yamaganda",
  choghadiya: "choghadiya",
  "panchang-by-date": "panchang",
};

/** Per-tool translations. English is authoritative. */
export const TOOL_I18N: Record<ToolLang, Record<string, ToolEntry>> = {
  en: {
    // PANCHANG
    "todays-panchang": {
      title: "Today's Panchang",
      description:
        "Full panchang for today — tithi, nakshatra, yoga, karana, sunrise, sunset and inauspicious windows.",
      intro: "Your complete drik-precise panchang — computed live for your city.",
    },
    "todays-tithi": {
      title: "Today's Tithi",
      description: "Precise tithi for any date and city — with paksha and exact end time.",
    },
    "todays-nakshatra": {
      title: "Today's Nakshatra",
      description: "Today's nakshatra with pada, ruling planet, deity and end time.",
    },
    "todays-yoga": {
      title: "Today's Yoga",
      description: "Today's yoga (one of 27) with progress and end time.",
    },
    "todays-karana": {
      title: "Today's Karana",
      description: "Today's karana with type (movable / fixed) and exact end time.",
    },
    "todays-sunrise": {
      title: "Today's Sunrise",
      description: "Precise sunrise for any city — with sunset, solar noon and day length.",
    },
    "todays-sunset": {
      title: "Today's Sunset",
      description: "Precise sunset for any city — with sunrise, solar noon and day length.",
    },
    "rahu-kaal": {
      title: "Rahu Kaal",
      description: "Today's rahu kaal window — location-aware and to the minute.",
    },
    "gulika-kaal": {
      title: "Gulika Kaal",
      description: "Today's gulika kaal window with real sunrise / sunset.",
    },
    yamaganda: {
      title: "Yamaganda",
      description: "Today's yamaganda window — one of the eight parts of the day.",
    },
    choghadiya: {
      title: "Choghadiya",
      description: "Day and night choghadiya with auspicious and inauspicious windows.",
    },
    "panchang-by-date": {
      title: "Panchang by Date",
      description: "Look up the complete panchang for any date and any city on Earth.",
    },
    "hora-chart": {
      title: "Hora Chart",
      description: "Planetary hora chart for choosing the right time for any activity.",
      intro:
        "The 24 planetary horas of the day and night — perfect for choosing the right time to act.",
    },
    "sunrise-sunset-atlas": {
      title: "Sunrise & Sunset Atlas",
      description: "Compare sunrise and sunset across cities around the world.",
    },
    "moon-phase": {
      title: "Moon Phase",
      description: "Current moon phase, illumination and phase angle for any date.",
      intro: "Current moon phase, illumination and phase angle — computed live for any date.",
    },
    "abhijit-muhurat": {
      title: "Abhijit Muhurat",
      description: "Today's Abhijit muhurat window — the most auspicious 48 minutes.",
      intro:
        "Abhijit is the 8th of 15 day-muhurats — 48 minutes centred on solar noon. The most auspicious window of the day (except Wednesdays).",
    },
    "brahma-muhurat": {
      title: "Brahma Muhurat",
      description: "The pre-dawn Brahma muhurat window — ideal for meditation.",
      intro:
        "The two muhurats before sunrise — the sattva-rich window when the mind is most receptive to sadhana.",
    },

    // FESTIVALS
    "festival-calendar-2026": {
      title: "Festival Calendar 2026",
      description:
        "Every Sanatan festival of 2026, month by month, with regional and category filters.",
    },
    "festival-countdown": {
      title: "Festival Countdown",
      description: "A live countdown — down to the second — to any festival of 2026.",
    },
    "festival-finder": {
      title: "Festival Finder",
      description: "Search festivals by name, deity or month — perfect for planning.",
    },
    "vrat-calendar": {
      title: "Vrat Calendar",
      description: "Every major vrat with fasting rules, timings and mantras.",
    },
    "ekadashi-dates": {
      title: "Ekadashi Dates",
      description: "Every ekadashi of 2026 with description and vrat vidhi.",
      intro: "All 24 ekadashis of 2026 with description and vrat vidhi.",
    },
    "purnima-amavasya": {
      title: "Purnima & Amavasya",
      description: "All purnima and amavasya dates with regional significance.",
    },
    "regional-festivals": {
      title: "Regional Festivals",
      description: "Discover festivals unique to each state and community.",
    },
    "pradosh-vrat": {
      title: "Pradosh Vrat Dates",
      description: "Every Pradosh vrat date with day-type (Som, Bhaum, Shani) noted.",
    },
    "sankashti-chaturthi": {
      title: "Sankashti Chaturthi",
      description: "Monthly Sankashti chaturthi dates — Ganesha's day of grace.",
    },
    "festival-of-the-day": {
      title: "Festival of the Day",
      description: "Today's or the very next Sanatan festival — one-glance card.",
    },
    "upcoming-festivals": {
      title: "Upcoming Festivals",
      description: "The next 12 festivals ahead — plan the coming weeks.",
    },

    // PUJA
    "puja-checklist-generator": {
      title: "Puja Checklist Generator",
      description: "Interactive samagri, vidhi and mantra checklist for 6 major pujas.",
    },
    "aarti-collection": {
      title: "Aarti Collection",
      description: "Hand-picked collection of the most-loved aartis, beautifully typeset.",
    },
    "chalisa-collection": {
      title: "Chalisa Collection",
      description: "Hanuman, Durga, Shiv, Ganesh and Saraswati chalisas in Devanagari.",
    },
    "puja-vidhi-planner": {
      title: "Puja Vidhi Planner",
      description: "A step-by-step planner for any puja — sankalp, mantras, aarti and time budget.",
    },
    "samagri-checklist": {
      title: "Samagri Checklist",
      description: "Curated samagri lists for eight major pujas with quantities.",
    },
    "sankalp-generator": {
      title: "Sankalp Generator",
      description: "Generate the correct sankalp with your name, gotra, date and place.",
    },
    "griha-pravesh-planner": {
      title: "Griha Pravesh Planner",
      description: "Complete step-by-step guide to your griha pravesh.",
    },
    "havan-guide": {
      title: "Havan Guide",
      description: "Complete havan guide with samagri, procedure and safety tips.",
    },
    "aarti-thali-guide": {
      title: "Aarti Thali Guide",
      description: "Every item on the aarti thali and its symbolic meaning.",
    },
    "prasad-recipes": {
      title: "Prasad Recipes",
      description: "Traditional prasad recipes — modak, panjiri, sheera and more.",
    },

    // MANTRAS
    "digital-jaap-counter": {
      title: "Digital Jaap Counter",
      description: "Distraction-free jaap counter with 108-bead mala progress and lifetime count.",
    },
    "om-counter": {
      title: "Om Counter",
      description: "A focused Om counter — chant ॐ with mala progress and gentle chime.",
    },
    "mala-counter": {
      title: "Mala Counter",
      description: "A silent mala counter — track beads, malas and lifetime count.",
    },
    "mantra-timer": {
      title: "Mantra Timer",
      description: "A gentle timer for timed mantra sessions with a soft completion chime.",
    },
    "stotra-collection": {
      title: "Stotra Collection",
      description: "Classical stotras — Shiv Tandav, Lingashtakam, Mahamrityunjaya and more.",
    },
    "daily-quote": {
      title: "Daily Quote",
      description: "A hand-picked Sanatan quote each day — Gita, Upanishads and more.",
    },
    "daily-shlok": {
      title: "Daily Shlok",
      description: "A daily shlok in Devanagari with transliteration and meaning.",
    },
    "mantra-library": {
      title: "Mantra Library",
      description: "A curated library of 30+ mantras with Devanagari, IAST and meaning.",
    },
    "beej-mantras": {
      title: "Beej Mantras",
      description: "Every beej mantra with deity, meaning and pronunciation guide.",
    },
    "deity-mantras": {
      title: "Deity Mantras",
      description: "Mantras organised by deity — Shiva, Vishnu, Devi, Ganesha and more.",
    },
    "mantra-of-the-day": {
      title: "Mantra of the Day",
      description: "A rotating traditional mantra each day — Devanagari, IAST, meaning.",
    },
    "gayatri-mantra": {
      title: "Gayatri Mantra Guide",
      description: "Word-by-word meaning, chanting rules and benefits of the Gayatri.",
    },
    "mahamrityunjaya-mantra": {
      title: "Mahamrityunjaya Guide",
      description: "The healing mantra of Rudra — meaning, benefits and jaap rules.",
    },

    // AI
    "ai-dharma-assistant": {
      title: "AI Dharma Assistant",
      description: "Ask anything about Sanatan Dharma and get a thoughtful, cited answer.",
      intro:
        "Ask anything about Sanatan Dharma — scripture, ritual, philosophy — and get a thoughtful, cited answer.",
    },
    "ai-gita-summary": {
      title: "AI Gita Summary",
      description: "Instant, faithful summary of any Bhagavad Gita chapter with key verses.",
    },
    "ai-shlok-explainer": {
      title: "AI Shlok Explainer",
      description: "Paste any shloka — get Devanagari, IAST, word-by-word meaning and commentary.",
    },
    "ai-festival-guide": {
      title: "AI Festival Guide",
      description: "Any festival, explained — story, tithi, vidhi, samagri and mantras.",
    },
    "ai-puja-planner": {
      title: "AI Puja Planner",
      description: "Describe your occasion — AI plans a full puja with sankalp, vidhi and mantras.",
    },
    "ai-mantra-meaning": {
      title: "AI Mantra Meaning",
      description: "Any mantra, decoded — Devanagari, IAST, word-by-word meaning, benefits.",
    },
    "ai-sanskrit-helper": {
      title: "AI Sanskrit Helper",
      description:
        "Translate, decode grammar, and pronounce Sanskrit — Devanagari and IAST every time.",
    },
    "mantra-recommender": {
      title: "AI Mantra Recommender",
      description: "AI-powered mantra suggestions based on intent, deity and time of day.",
      intro:
        "Describe your intent — AI suggests three traditional mantras with meaning, benefit and jaap count.",
    },
    "baby-name-ai": {
      title: "AI Baby Name Suggester",
      description: "AI baby name suggestions by nakshatra, syllable, meaning and gender.",
      intro:
        "AI-crafted Sanskrit name suggestions based on nakshatra, syllable, meaning and gender.",
    },

    // TEMPLES
    "temple-finder": {
      title: "Temple Finder",
      description: "Search 20+ major temples with one-tap directions.",
    },
    "temple-directory": {
      title: "Temple Directory",
      description: "Searchable directory of 25+ major temples across India.",
    },
    "darshan-timings": {
      title: "Darshan Timings",
      description: "Darshan timings and aarti schedules for major temples.",
    },
    "char-dham-planner": {
      title: "Char Dham Planner",
      description: "Plan your Char Dham yatra — routes, best months and stopovers.",
    },
    "jyotirlinga-guide": {
      title: "Jyotirlinga Guide",
      description: "Complete guide to the 12 Jyotirlingas — history, timings and travel.",
    },
    "shakti-peeth-guide": {
      title: "Shakti Peeth Guide",
      description: "The most-visited Shakti Peethas — stories and how to reach.",
    },
    "nearby-temples": {
      title: "Nearby Temples",
      description: "Find temples nearest to your saved location with distance and details.",
    },

    // CALCULATORS
    "kundli-generator": {
      title: "Kundli Generator",
      description: "Free Vedic kundli with rashi, nakshatra, tithi and yoga.",
      intro:
        "A quick Vedic snapshot from birth date and time — rashi, nakshatra, tithi, yoga and naming syllables.",
    },
    "rashi-calculator": {
      title: "Rashi Calculator",
      description: "Find your moon sign (rashi) from birth date and time.",
    },
    "nakshatra-finder": {
      title: "Nakshatra Finder",
      description: "Discover your janma nakshatra, pada and its ruling deity.",
    },
    "dasha-calculator": {
      title: "Vimshottari Dasha",
      description: "Vimshottari mahadasha timeline computed from your janma nakshatra.",
      intro: "Your Vimshottari mahadasha timeline computed from your janma nakshatra.",
    },
    "gemstone-recommender": {
      title: "Gemstone Recommender",
      description: "Personalised gemstone recommendation based on your rashi.",
    },
    numerology: { title: "Numerology", description: "Life-path and destiny numbers with meaning." },
    "name-numerology": {
      title: "Name Numerology",
      description: "Numerological value of any name with meaning and planetary vibration.",
    },
    "birthstone-finder": {
      title: "Birthstone Finder",
      description: "Traditional Western birthstone for any birth month.",
    },

    // SANSKRIT
    "sanskrit-dictionary": {
      title: "Sanskrit Dictionary",
      description: "Look up 60+ core Sanskrit words with meaning and root.",
    },
    transliteration: {
      title: "IAST → Devanagari",
      description: "Convert IAST or phonetic English to Devanagari instantly.",
      intro: "Type IAST or English phonetic; get instant Devanagari. Try: 'om namah shivaya'.",
    },
    "sandhi-splitter": {
      title: "Sandhi Splitter",
      description: "Rule-based sandhi splitter for common compound words.",
    },
    "shloka-analyzer": {
      title: "Shloka Analyzer",
      description: "Count syllables, padas, and guess the chhandas of any shloka.",
    },
    "devanagari-typing": {
      title: "Devanagari Typing",
      description: "Type in Devanagari with an on-screen keyboard.",
    },
    "verb-conjugator": {
      title: "Verb Conjugator",
      description: "Conjugate common Sanskrit dhatus in the present tense (lat lakara).",
    },
    "sanskrit-word-of-day": {
      title: "Sanskrit Word of the Day",
      description: "A new Sanskrit word every day with meaning and root.",
    },

    // BABY NAMES
    "names-by-nakshatra": {
      title: "Names by Nakshatra",
      description: "Baby names aligned to your child's janma nakshatra pada syllables.",
    },
    "names-by-rashi": {
      title: "Names by Rashi",
      description: "Baby names by moon-sign syllables — beautiful and meaningful.",
    },
    "names-by-deity": {
      title: "Names by Deity",
      description: "Names inspired by Shiva, Vishnu, Devi, Ganesha and more.",
    },
    "names-by-meaning": {
      title: "Names by Meaning",
      description: "Find names by meaning — light, strength, wisdom, love and more.",
    },
    "twin-names": {
      title: "Twin Names",
      description: "Beautifully paired names for twins, drawn from Sanskrit tradition.",
    },
    "ai-name-suggester": {
      title: "AI Name Suggester",
      description: "AI baby name suggestions by nakshatra, syllable and meaning.",
    },

    // LEARNING
    "bhagavad-gita": {
      title: "Bhagavad Gita — Chapter Reader",
      description: "All 18 chapters of the Gita with summary and core teaching.",
    },
    "upanishads-guide": {
      title: "Upanishads Guide",
      description: "The principal Upanishads with theme and key teaching.",
    },
    "vedas-introduction": {
      title: "Vedas Introduction",
      description: "An accessible introduction to the four Vedas.",
    },
    "yoga-sutras": {
      title: "Yoga Sutras Overview",
      description: "The four padas of Patanjali's Yoga Sutras with key verses.",
    },
    "sanatan-timeline": {
      title: "Sanatan Timeline",
      description: "A visual timeline of Sanatan Dharma — from the Vedic era to today.",
    },
    "deity-encyclopedia": {
      title: "Deity Encyclopedia",
      description: "22+ deities with iconography, mantras and lore.",
    },
    "mahabharata-summary": {
      title: "Mahabharata Summary",
      description: "All 18 parvas of the Mahabharata with themes and story arc.",
    },
    "ramayana-summary": {
      title: "Ramayana Summary",
      description: "The seven kandas of the Valmiki Ramayana in one page.",
    },
    "puranas-overview": {
      title: "18 Mahapuranas",
      description: "Complete list of the 18 Mahapuranas — deity, theme and verse count.",
    },
    "deity-of-the-day": {
      title: "Deity of the Day",
      description: "A rotating deity each day — with mantra and significance.",
    },
    "nakshatra-guide": {
      title: "27 Nakshatras Guide",
      description: "All 27 nakshatras with lord, deity, symbol and nature.",
    },
    "rashi-guide": {
      title: "12 Rashis Guide",
      description: "All 12 rashis with lord, element and characteristics.",
    },
  },

  hi: {
    // PANCHANG
    "todays-panchang": {
      title: "आज का पंचांग",
      description:
        "आज का पूर्ण पंचांग — तिथि, नक्षत्र, योग, करण, सूर्योदय, सूर्यास्त तथा अशुभ काल।",
      intro: "आपके नगर के लिए लाइव गणना किया गया दृक-सटीक पंचांग।",
    },
    "todays-tithi": {
      title: "आज की तिथि",
      description: "किसी भी दिनांक और नगर की सटीक तिथि — पक्ष और समाप्ति समय सहित।",
    },
    "todays-nakshatra": {
      title: "आज का नक्षत्र",
      description: "आज का नक्षत्र — पाद, स्वामी ग्रह, देवता एवं समाप्ति समय के साथ।",
    },
    "todays-yoga": {
      title: "आज का योग",
      description: "आज का योग (27 में से एक) — प्रगति और समाप्ति समय सहित।",
    },
    "todays-karana": {
      title: "आज का करण",
      description: "आज का करण — प्रकार (चर / स्थिर) और सटीक समाप्ति समय।",
    },
    "todays-sunrise": {
      title: "आज का सूर्योदय",
      description: "किसी भी नगर का सटीक सूर्योदय — सूर्यास्त, मध्याह्न व दिन की अवधि सहित।",
    },
    "todays-sunset": {
      title: "आज का सूर्यास्त",
      description: "किसी भी नगर का सटीक सूर्यास्त — सूर्योदय, मध्याह्न व दिन की अवधि सहित।",
    },
    "rahu-kaal": {
      title: "राहु काल",
      description: "आज का राहु काल — स्थान के अनुसार, सटीक मिनट तक।",
    },
    "gulika-kaal": {
      title: "गुलिक काल",
      description: "आज का गुलिक काल — वास्तविक सूर्योदय / सूर्यास्त के साथ।",
    },
    yamaganda: { title: "यमगण्ड", description: "आज का यमगण्ड — दिन के आठ भागों में से एक।" },
    choghadiya: {
      title: "चौघड़िया",
      description: "दिन एवं रात्रि के चौघड़िये — शुभ एवं अशुभ कालों सहित।",
    },
    "panchang-by-date": {
      title: "तिथि अनुसार पंचांग",
      description: "किसी भी तिथि व नगर के लिए पूर्ण पंचांग देखें।",
    },
    "hora-chart": {
      title: "होरा चक्र",
      description: "किसी भी कार्य के लिए उपयुक्त समय चुनने हेतु ग्रह होरा चक्र।",
      intro: "दिन और रात्रि की 24 ग्रह होराएँ — कार्य आरम्भ के लिए सर्वोत्तम समय।",
    },
    "sunrise-sunset-atlas": {
      title: "सूर्योदय-सूर्यास्त एटलस",
      description: "विश्वभर के नगरों के सूर्योदय व सूर्यास्त की तुलना करें।",
    },
    "moon-phase": {
      title: "चन्द्र कला",
      description: "किसी भी तिथि के लिए चन्द्रमा की वर्तमान कला, प्रकाश एवं कोण।",
      intro: "किसी भी तिथि के लिए लाइव गणना — चन्द्र कला, प्रकाश और कोण।",
    },
    "abhijit-muhurat": {
      title: "अभिजित मुहूर्त",
      description: "आज का अभिजित मुहूर्त — दिन के सर्वाधिक शुभ 48 मिनट।",
      intro:
        "अभिजित 15 दिन-मुहूर्तों में आठवाँ है — मध्याह्न पर केन्द्रित 48 मिनट। बुधवार को छोड़कर दिन का सर्वश्रेष्ठ मुहूर्त।",
    },
    "brahma-muhurat": {
      title: "ब्रह्म मुहूर्त",
      description: "सूर्योदय से पूर्व का ब्रह्म मुहूर्त — ध्यान के लिए श्रेष्ठ।",
      intro:
        "सूर्योदय से पूर्व के दो मुहूर्त — सत्त्वप्रधान काल जब मन साधना के लिए सर्वाधिक ग्रहणशील होता है।",
    },

    // FESTIVALS
    "festival-calendar-2026": {
      title: "पर्व कैलेंडर 2026",
      description: "2026 के सभी सनातन पर्व — माह-दर-माह, क्षेत्रीय एवं श्रेणी फ़िल्टर सहित।",
    },
    "festival-countdown": {
      title: "पर्व काउंटडाउन",
      description: "2026 के किसी भी पर्व तक सेकंड-दर-सेकंड लाइव काउंटडाउन।",
    },
    "festival-finder": {
      title: "पर्व खोज",
      description: "नाम, देवता या माह के अनुसार पर्व खोजें।",
    },
    "vrat-calendar": {
      title: "व्रत कैलेंडर",
      description: "प्रत्येक प्रमुख व्रत — नियम, समय एवं मंत्रों सहित।",
    },
    "ekadashi-dates": {
      title: "एकादशी तिथियाँ",
      description: "2026 की प्रत्येक एकादशी — विवरण एवं व्रत विधि सहित।",
      intro: "2026 की सभी 24 एकादशियाँ — विवरण एवं व्रत विधि सहित।",
    },
    "purnima-amavasya": {
      title: "पूर्णिमा एवं अमावस्या",
      description: "सभी पूर्णिमा एवं अमावस्या तिथियाँ — क्षेत्रीय महत्त्व सहित।",
    },
    "regional-festivals": {
      title: "क्षेत्रीय पर्व",
      description: "प्रत्येक राज्य एवं समुदाय के विशिष्ट पर्व जानें।",
    },
    "pradosh-vrat": {
      title: "प्रदोष व्रत तिथियाँ",
      description: "प्रत्येक प्रदोष व्रत — दिन-प्रकार (सोम, भौम, शनि) सहित।",
    },
    "sankashti-chaturthi": {
      title: "संकष्टी चतुर्थी",
      description: "मासिक संकष्टी चतुर्थी तिथियाँ — गणेश जी की कृपा का दिन।",
    },
    "festival-of-the-day": {
      title: "आज का पर्व",
      description: "आज का या तुरन्त आगामी सनातन पर्व — एक-नज़र कार्ड।",
    },
    "upcoming-festivals": {
      title: "आगामी पर्व",
      description: "अगले 12 पर्व — आने वाले सप्ताहों की योजना बनाइए।",
    },

    // PUJA
    "puja-checklist-generator": {
      title: "पूजा चेकलिस्ट जनरेटर",
      description: "6 प्रमुख पूजाओं हेतु सामग्री, विधि एवं मंत्रों की इंटरेक्टिव चेकलिस्ट।",
    },
    "aarti-collection": {
      title: "आरती संग्रह",
      description: "सबसे लोकप्रिय आरतियों का चयनित संग्रह — सुन्दर रूप में।",
    },
    "chalisa-collection": {
      title: "चालीसा संग्रह",
      description: "हनुमान, दुर्गा, शिव, गणेश एवं सरस्वती चालीसा — देवनागरी में।",
    },
    "puja-vidhi-planner": {
      title: "पूजा विधि प्लानर",
      description: "किसी भी पूजा हेतु चरण-दर-चरण योजना — संकल्प, मंत्र, आरती एवं समय।",
    },
    "samagri-checklist": {
      title: "सामग्री चेकलिस्ट",
      description: "आठ प्रमुख पूजाओं की चयनित सामग्री सूची — मात्रा सहित।",
    },
    "sankalp-generator": {
      title: "संकल्प जनरेटर",
      description: "अपने नाम, गोत्र, तिथि एवं स्थान के साथ सही संकल्प बनाइए।",
    },
    "griha-pravesh-planner": {
      title: "गृह प्रवेश प्लानर",
      description: "गृह प्रवेश हेतु पूर्ण चरण-दर-चरण मार्गदर्शिका।",
    },
    "havan-guide": {
      title: "हवन मार्गदर्शिका",
      description: "हवन की पूर्ण विधि — सामग्री, प्रक्रिया एवं सुरक्षा-निर्देश।",
    },
    "aarti-thali-guide": {
      title: "आरती थाली मार्गदर्शिका",
      description: "आरती थाली का प्रत्येक वस्तु और उसका प्रतीकात्मक अर्थ।",
    },
    "prasad-recipes": {
      title: "प्रसाद विधियाँ",
      description: "पारम्परिक प्रसाद विधियाँ — मोदक, पंजीरी, शीरा और अधिक।",
    },

    // MANTRAS
    "digital-jaap-counter": {
      title: "डिजिटल जाप काउंटर",
      description: "एकाग्र जाप काउंटर — 108 माला की प्रगति एवं जीवन-भर की गिनती।",
    },
    "om-counter": {
      title: "ॐ काउंटर",
      description: "ॐ जाप हेतु समर्पित काउंटर — माला प्रगति एवं मधुर घंटी।",
    },
    "mala-counter": {
      title: "माला काउंटर",
      description: "मौन माला काउंटर — मणि, माला एवं जीवन-भर की गिनती।",
    },
    "mantra-timer": {
      title: "मंत्र टाइमर",
      description: "समय-बद्ध मंत्र साधना हेतु मृदु टाइमर — समाप्ति पर कोमल घंटी।",
    },
    "stotra-collection": {
      title: "स्तोत्र संग्रह",
      description: "शिव ताण्डव, लिंगाष्टकम्, महामृत्युंजय आदि पारम्परिक स्तोत्र।",
    },
    "daily-quote": {
      title: "दैनिक उद्धरण",
      description: "प्रतिदिन एक चयनित सनातन उद्धरण — गीता, उपनिषद आदि से।",
    },
    "daily-shlok": {
      title: "दैनिक श्लोक",
      description: "प्रतिदिन देवनागरी में एक श्लोक — लिप्यंतरण एवं अर्थ सहित।",
    },
    "mantra-library": {
      title: "मंत्र पुस्तकालय",
      description: "30+ मंत्रों का चयनित पुस्तकालय — देवनागरी, IAST एवं अर्थ।",
    },
    "beej-mantras": {
      title: "बीज मंत्र",
      description: "प्रत्येक बीज मंत्र — देवता, अर्थ एवं उच्चारण-मार्गदर्शिका।",
    },
    "deity-mantras": {
      title: "देव मंत्र",
      description: "देवता अनुसार मंत्र — शिव, विष्णु, देवी, गणेश आदि।",
    },
    "mantra-of-the-day": {
      title: "आज का मंत्र",
      description: "प्रतिदिन एक पारम्परिक मंत्र — देवनागरी, IAST एवं अर्थ।",
    },
    "gayatri-mantra": {
      title: "गायत्री मंत्र मार्गदर्शिका",
      description: "गायत्री का शब्द-दर-शब्द अर्थ, जाप-नियम एवं लाभ।",
    },
    "mahamrityunjaya-mantra": {
      title: "महामृत्युंजय मार्गदर्शिका",
      description: "रुद्र का आरोग्यदायी मंत्र — अर्थ, लाभ एवं जाप-नियम।",
    },

    // AI
    "ai-dharma-assistant": {
      title: "AI धर्म सहायक",
      description: "सनातन धर्म पर कोई भी प्रश्न पूछें — विचारपूर्ण, संदर्भित उत्तर पाइए।",
      intro:
        "सनातन धर्म पर कुछ भी पूछिए — शास्त्र, कर्मकाण्ड, दर्शन — और विचारपूर्ण, संदर्भित उत्तर पाइए।",
    },
    "ai-gita-summary": {
      title: "AI गीता सारांश",
      description: "भगवद्गीता के किसी भी अध्याय का तत्काल, प्रामाणिक सारांश — मुख्य श्लोकों सहित।",
    },
    "ai-shlok-explainer": {
      title: "AI श्लोक व्याख्याता",
      description: "कोई भी श्लोक चिपकाइए — देवनागरी, IAST, शब्द-दर-शब्द अर्थ एवं व्याख्या।",
    },
    "ai-festival-guide": {
      title: "AI पर्व मार्गदर्शिका",
      description: "किसी भी पर्व की पूर्ण व्याख्या — कथा, तिथि, विधि, सामग्री एवं मंत्र।",
    },
    "ai-puja-planner": {
      title: "AI पूजा प्लानर",
      description: "अवसर बताइए — AI संकल्प, विधि एवं मंत्रों सहित पूर्ण पूजा योजना बनाएगा।",
    },
    "ai-mantra-meaning": {
      title: "AI मंत्र अर्थ",
      description: "कोई भी मंत्र, समझें — देवनागरी, IAST, शब्द-दर-शब्द अर्थ एवं लाभ।",
    },
    "ai-sanskrit-helper": {
      title: "AI संस्कृत सहायक",
      description: "संस्कृत अनुवाद, व्याकरण एवं उच्चारण — देवनागरी एवं IAST दोनों में।",
    },
    "mantra-recommender": {
      title: "AI मंत्र अनुशंसक",
      description: "इरादे, देवता एवं समय के आधार पर AI मंत्र-सुझाव।",
      intro: "अपना इरादा बताइए — AI तीन पारम्परिक मंत्र सुझाएगा, अर्थ, लाभ एवं जाप संख्या सहित।",
    },
    "baby-name-ai": {
      title: "AI शिशु नाम सुझावक",
      description: "नक्षत्र, अक्षर, अर्थ एवं लिंग अनुसार AI शिशु-नाम सुझाव।",
      intro: "नक्षत्र, अक्षर, अर्थ एवं लिंग के आधार पर AI-निर्मित संस्कृत नाम-सुझाव।",
    },

    // TEMPLES
    "temple-finder": {
      title: "मंदिर खोज",
      description: "20+ प्रमुख मंदिरों की खोज — एक-टैप दिशा-निर्देश सहित।",
    },
    "temple-directory": {
      title: "मंदिर निर्देशिका",
      description: "भारत के 25+ प्रमुख मंदिरों की खोज-योग्य निर्देशिका।",
    },
    "darshan-timings": {
      title: "दर्शन समय",
      description: "प्रमुख मंदिरों के दर्शन समय एवं आरती-कार्यक्रम।",
    },
    "char-dham-planner": {
      title: "चारधाम प्लानर",
      description: "अपनी चारधाम यात्रा की योजना — मार्ग, श्रेष्ठ माह एवं पड़ाव।",
    },
    "jyotirlinga-guide": {
      title: "ज्योतिर्लिंग मार्गदर्शिका",
      description: "12 ज्योतिर्लिंगों की पूर्ण मार्गदर्शिका — इतिहास, समय एवं यात्रा।",
    },
    "shakti-peeth-guide": {
      title: "शक्तिपीठ मार्गदर्शिका",
      description: "प्रमुख शक्तिपीठ — कथाएँ एवं पहुँचने का मार्ग।",
    },
    "nearby-temples": {
      title: "निकटवर्ती मंदिर",
      description: "अपनी सहेजी स्थिति के निकटतम मंदिर — दूरी एवं विवरण सहित।",
    },

    // CALCULATORS
    "kundli-generator": {
      title: "कुण्डली जनरेटर",
      description: "निःशुल्क वैदिक कुण्डली — राशि, नक्षत्र, तिथि एवं योग।",
      intro: "जन्म तिथि व समय से त्वरित वैदिक झलक — राशि, नक्षत्र, तिथि, योग एवं नामाक्षर।",
    },
    "rashi-calculator": {
      title: "राशि कैलकुलेटर",
      description: "जन्म तिथि व समय से अपनी चन्द्र-राशि जानें।",
    },
    "nakshatra-finder": {
      title: "नक्षत्र खोज",
      description: "अपना जन्म-नक्षत्र, पाद एवं स्वामी देवता जानें।",
    },
    "dasha-calculator": {
      title: "विंशोत्तरी दशा",
      description: "आपके जन्म-नक्षत्र से गणना की गई विंशोत्तरी महादशा समयरेखा।",
      intro: "आपके जन्म-नक्षत्र से गणना की गई विंशोत्तरी महादशा समयरेखा।",
    },
    "gemstone-recommender": {
      title: "रत्न अनुशंसक",
      description: "आपकी राशि के आधार पर व्यक्तिगत रत्न-अनुशंसा।",
    },
    numerology: { title: "अंक ज्योतिष", description: "जीवन-पथ एवं भाग्य अंक — अर्थ सहित।" },
    "name-numerology": {
      title: "नाम अंक ज्योतिष",
      description: "किसी भी नाम का अंक-मूल्य — अर्थ एवं ग्रह-कम्पन सहित।",
    },
    "birthstone-finder": {
      title: "जन्म-रत्न खोज",
      description: "किसी भी जन्म-माह हेतु पारम्परिक पश्चिमी जन्म-रत्न।",
    },

    // SANSKRIT
    "sanskrit-dictionary": {
      title: "संस्कृत शब्दकोश",
      description: "60+ मुख्य संस्कृत शब्द — अर्थ एवं मूल-धातु सहित।",
    },
    transliteration: {
      title: "IAST → देवनागरी",
      description: "IAST या फोनेटिक अंग्रेज़ी को तुरन्त देवनागरी में परिवर्तित करें।",
      intro:
        "IAST या अंग्रेज़ी फोनेटिक टाइप कीजिए; तुरन्त देवनागरी पाइए। जैसे: 'om namah shivaya'।",
    },
    "sandhi-splitter": {
      title: "सन्धि विच्छेदक",
      description: "सामान्य समस्त पदों हेतु नियम-आधारित सन्धि विच्छेदक।",
    },
    "shloka-analyzer": {
      title: "श्लोक विश्लेषक",
      description: "किसी भी श्लोक के अक्षर, पाद गिनें एवं छन्द का अनुमान लगाइए।",
    },
    "devanagari-typing": {
      title: "देवनागरी टाइपिंग",
      description: "ऑन-स्क्रीन कीबोर्ड से देवनागरी में टाइप कीजिए।",
    },
    "verb-conjugator": {
      title: "क्रिया रूपकार",
      description: "सामान्य संस्कृत धातुओं का लट् लकार में रूपान्तरण।",
    },
    "sanskrit-word-of-day": {
      title: "आज का संस्कृत शब्द",
      description: "प्रतिदिन एक नया संस्कृत शब्द — अर्थ एवं मूल सहित।",
    },

    // BABY NAMES
    "names-by-nakshatra": {
      title: "नक्षत्रानुसार नाम",
      description: "आपके शिशु के जन्म-नक्षत्र पाद अक्षरों के अनुरूप नाम।",
    },
    "names-by-rashi": {
      title: "राशि अनुसार नाम",
      description: "चन्द्र-राशि अक्षरों के अनुसार सुन्दर एवं अर्थपूर्ण नाम।",
    },
    "names-by-deity": {
      title: "देवता अनुसार नाम",
      description: "शिव, विष्णु, देवी, गणेश आदि से प्रेरित नाम।",
    },
    "names-by-meaning": {
      title: "अर्थ अनुसार नाम",
      description: "अर्थ अनुसार नाम खोजें — प्रकाश, बल, ज्ञान, प्रेम आदि।",
    },
    "twin-names": {
      title: "जुड़वाँ नाम",
      description: "जुड़वाँ शिशुओं हेतु संस्कृत परम्परा से सुन्दर युग्म नाम।",
    },
    "ai-name-suggester": {
      title: "AI नाम सुझावक",
      description: "नक्षत्र, अक्षर एवं अर्थ अनुसार AI शिशु-नाम सुझाव।",
    },

    // LEARNING
    "bhagavad-gita": {
      title: "भगवद्गीता — अध्याय पाठक",
      description: "गीता के सभी 18 अध्याय — सारांश एवं मूल शिक्षा सहित।",
    },
    "upanishads-guide": {
      title: "उपनिषद मार्गदर्शिका",
      description: "मुख्य उपनिषद — विषय एवं मूल शिक्षा सहित।",
    },
    "vedas-introduction": { title: "वेद परिचय", description: "चार वेदों का सहज परिचय।" },
    "yoga-sutras": {
      title: "योग सूत्र अवलोकन",
      description: "पातञ्जल योग सूत्र के चार पाद — मुख्य सूत्रों सहित।",
    },
    "sanatan-timeline": {
      title: "सनातन समयरेखा",
      description: "सनातन धर्म की दृश्य समयरेखा — वैदिक युग से आज तक।",
    },
    "deity-encyclopedia": {
      title: "देव-विश्वकोश",
      description: "22+ देवता — मूर्ति-लक्षण, मंत्र एवं कथाएँ।",
    },
    "mahabharata-summary": {
      title: "महाभारत सारांश",
      description: "महाभारत के सभी 18 पर्व — विषय एवं कथा-प्रवाह सहित।",
    },
    "ramayana-summary": {
      title: "रामायण सारांश",
      description: "वाल्मीकि रामायण के सात काण्ड — एक पृष्ठ में।",
    },
    "puranas-overview": {
      title: "18 महापुराण",
      description: "18 महापुराणों की पूर्ण सूची — देवता, विषय एवं श्लोक-संख्या सहित।",
    },
    "deity-of-the-day": {
      title: "आज के देवता",
      description: "प्रतिदिन एक देवता — मंत्र एवं महत्त्व सहित।",
    },
    "nakshatra-guide": {
      title: "27 नक्षत्र मार्गदर्शिका",
      description: "सभी 27 नक्षत्र — स्वामी, देवता, प्रतीक एवं स्वभाव सहित।",
    },
    "rashi-guide": {
      title: "12 राशि मार्गदर्शिका",
      description: "सभी 12 राशियाँ — स्वामी, तत्त्व एवं विशेषताएँ सहित।",
    },
  },

  mr: {
    // Marathi — auto-translated
    "todays-panchang": {
      title: "आजचे पंचांग",
      description:
        "आजचे संपूर्ण पंचांग — तिथी, नक्षत्र, योग, करण, सूर्योदय, सूर्यास्त आणि अशुभ मुहूर्त.",
      intro: "तुमचे संपूर्ण दृक्-शुद्ध पंचांग — तुमच्या शहरासाठी थेट गणना केलेले.",
    },
    "todays-tithi": {
      title: "आजची तिथी",
      description: "कोणत्याही तारखेची आणि शहराची अचूक तिथी — पक्ष आणि समाप्ती वेळेसह.",
    },
    "todays-nakshatra": {
      title: "आजचे नक्षत्र",
      description: "आजचे नक्षत्र पदासह, अधिपती ग्रह, देवता आणि समाप्ती वेळेसह.",
    },
    "todays-yoga": {
      title: "आजचा योग",
      description: "आजचा योग (२७ पैकी एक) प्रगती आणि समाप्ती वेळेसह.",
    },
    "todays-karana": {
      title: "आजचे करण",
      description: "आजचे करण प्रकारासह (चर / स्थिर) आणि अचूक समाप्ती वेळेसह.",
    },
    "todays-sunrise": {
      title: "आजचा सूर्योदय",
      description: "कोणत्याही शहरासाठी अचूक सूर्योदय — सूर्यास्त, मध्यान्ह आणि दिनमानासह.",
    },
    "todays-sunset": {
      title: "आजचा सूर्यास्त",
      description: "कोणत्याही शहरासाठी अचूक सूर्यास्त — सूर्योदय, मध्यान्ह आणि दिनमानासह.",
    },
    "rahu-kaal": {
      title: "राहु काळ",
      description: "आजचा राहु काळाचा अवधी — ठिकाणापरत्वे आणि मिनिटापर्यंत अचूक.",
    },
    "gulika-kaal": {
      title: "गुलिका काळ",
      description: "आजचा गुलिका काळाचा अवधी वास्तविक सूर्योदय / सूर्यास्तासह.",
    },
    yamaganda: { title: "यमगंड", description: "आजचा यमगंडाचा अवधी — दिवसाच्या आठ भागांपैकी एक." },
    choghadiya: { title: "चौघडिया", description: "दिवस आणि रात्रीचे चौघडिया शुभ आणि अशुभ वेळेसह." },
    "panchang-by-date": {
      title: "तारखेनुसार पंचांग",
      description: "कोणत्याही तारखेचे आणि पृथ्वीवरील कोणत्याही शहराचे संपूर्ण पंचांग पहा.",
    },
    "hora-chart": {
      title: "होरा चार्ट",
      description: "कोणत्याही कार्यासाठी योग्य वेळ निवडण्यासाठी ग्रहांचे होरा चार्ट.",
      intro: "दिवस आणि रात्रीच्या २४ ग्रहांच्या होरा - कृती करण्याची योग्य वेळ निवडण्यासाठी उत्तम.",
    },
    "sunrise-sunset-atlas": {
      title: "सूर्योदय आणि सूर्यास्त एटलस",
      description: "जगभरातील शहरांमध्ये सूर्योदय आणि सूर्यास्ताची तुलना करा.",
    },
    "moon-phase": {
      title: "चंद्राची कला",
      description: "कोणत्याही तारखेसाठी चंद्राची सध्याची कला, प्रकाश आणि कला कोन.",
      intro:
        "चंद्राची सध्याची कला, प्रकाश आणि कला कोन — कोणत्याही तारखेसाठी प्रत्यक्ष गणना केली जाते.",
    },
    "abhijit-muhurat": {
      title: "अभिजित मुहूर्त",
      description: "आजची अभिजित मुहूर्ताची वेळ – सर्वात शुभ ४८ मिनिटे.",
      intro:
        "अभिजित हे १५ दिवसांच्या मुहूर्तांपैकी ८ वे मुहूर्त आहे – सौर मध्यान्हाभोवती केंद्रित असलेले ४८ मिनिटे. दिवसातील सर्वात शुभ वेळ (बुधवार वगळता).",
    },
    "brahma-muhurat": {
      title: "ब्रह्म मुहूर्त",
      description: "पहाटेपूर्वीचा ब्रह्म मुहूर्ताची वेळ – ध्यानासाठी आदर्श.",
      intro:
        "सूर्योदयापूर्वीचे दोन मुहूर्त – सत्त्वप्रधान वेळ, जेव्हा मन साधनेसाठी सर्वात जास्त ग्रहणक्षम असते.",
    },
    "festival-calendar-2026": {
      title: "सण कॅलेंडर २०२६",
      description: "२०२६ मधील प्रत्येक सनातन सण, महिना-दर-महिना, प्रादेशिक आणि श्रेणी फिल्टरसह.",
    },
    "festival-countdown": {
      title: "सण उलटी गिनती",
      description: "२०२६ च्या कोणत्याही सणासाठी थेट उलटी गिनती – सेकंदापर्यंत.",
    },
    "festival-finder": {
      title: "सण शोधक",
      description: "नाव, देव किंवा महिनानुसार सण शोधा – नियोजनासाठी उत्तम.",
    },
    "vrat-calendar": {
      title: "व्रत कॅलेंडर",
      description: "उपवासाच्या नियमांसह, वेळा आणि मंत्रांसह प्रत्येक प्रमुख व्रत.",
    },
    "ekadashi-dates": {
      title: "एकादशीच्या तारखा",
      description: "२०२६ च्या प्रत्येक एकादशीची माहिती आणि व्रत विधी.",
      intro: "२०२६ च्या सर्व २४ एकादशीची माहिती आणि व्रत विधी.",
    },
    "purnima-amavasya": {
      title: "पौर्णिमा आणि अमावस्या",
      description: "प्रादेशिक महत्त्व असलेल्या सर्व पौर्णिमा आणि अमावस्याच्या तारखा.",
    },
    "regional-festivals": {
      title: "प्रादेशिक सण",
      description: "प्रत्येक राज्य आणि समुदायासाठी अद्वितीय असलेल्या सणांचा शोध घ्या.",
    },
    "pradosh-vrat": {
      title: "प्रदोष व्रत तिथी",
      description:
        "प्रत्येक प्रदोष व्रताची तिथी दिवसाच्या प्रकारानुसार (सोम, भौम, शनि) नमूद केली आहे.",
    },
    "sankashti-chaturthi": {
      title: "संकष्टी चतुर्थी",
      description: "मासिक संकष्टी चतुर्थीच्या तिथी — गणपती बाप्पाच्या कृपेचा दिवस.",
    },
    "festival-of-the-day": {
      title: "आजचा सण",
      description: "आजचा किंवा सर्वात जवळचा सनातनी सण — एका दृष्टिक्षेपात पाहण्यासाठी.",
    },
    "upcoming-festivals": {
      title: "आगामी सण",
      description: "पुढील 12 सण — येणाऱ्या आठवड्यांचे नियोजन करण्यासाठी.",
    },
    "puja-checklist-generator": {
      title: "पूजा चेकलिस्ट जनरेटर",
      description: "6 प्रमुख पूजांसाठी परस्परसंवादी सामग्री, विधी आणि मंत्रांची चेकलिस्ट.",
    },
    "aarti-collection": {
      title: "आरती संग्रह",
      description: "सर्वाधिक प्रिय आरत्यांचा निवडक संग्रह, सुंदर टंकलेखनात.",
    },
    "chalisa-collection": {
      title: "चालीसा संग्रह",
      description: "हनुमान, दुर्गा, शिव, गणेश आणि सरस्वती चालीसा देवनागरीमध्ये.",
    },
    "puja-vidhi-planner": {
      title: "पूजा विधी नियोजक",
      description: "कोणत्याही पूजेसाठी चरण-दर-चरण नियोजक — संकल्प, मंत्र, आरती आणि वेळेचे नियोजन.",
    },
    "samagri-checklist": {
      title: "सामग्री चेकलिस्ट",
      description: "आठ प्रमुख पूजांसाठी आवश्यक सामग्रीची यादी, प्रमाणासह.",
    },
    "sankalp-generator": {
      title: "संकल्प जनरेटर",
      description: "तुमचे नाव, गोत्र, तिथी आणि स्थळानुसार योग्य संकल्प तयार करा.",
    },
    "griha-pravesh-planner": {
      title: "गृहप्रवेश नियोजक",
      description: "तुमच्या गृहप्रवेशासाठी संपूर्ण चरण-दर-चरण मार्गदर्शक.",
    },
    "havan-guide": {
      title: "हवन मार्गदर्शक",
      description: "सामग्री, प्रक्रिया आणि सुरक्षितता टिपांसह संपूर्ण हवन मार्गदर्शक.",
    },
    "aarti-thali-guide": {
      title: "आरती थाळी मार्गदर्शक",
      description: "आरती थाळीतील प्रत्येक वस्तू आणि तिचे प्रतीकात्मक महत्त्व.",
    },
    "prasad-recipes": {
      title: "प्रसादाच्या पाककृती",
      description: "पारंपारिक प्रसादाच्या पाककृती — मोदक, पंजीरी, शिरा आणि बरेच काही.",
    },
    "digital-jaap-counter": {
      title: "डिजिटल जाप काउंटर",
      description:
        "108 मण्यांच्या माळेची प्रगती आणि एकूण जप संख्येसह विचलित न करणारा डिजिटल जप काउंटर.",
    },
    "om-counter": {
      title: "ओम काउंटर",
      description: "माळेची प्रगती आणि मंद घंटेच्या नादासह ॐ चा जप करण्यासाठी एक केंद्रित काउंटर.",
    },
    "mala-counter": {
      title: "माळा काउंटर",
      description: "एक शांत माळा काउंटर — मण्यांची संख्या, माळा आणि एकूण संख्या मागोवा घ्या.",
    },
    "mantra-timer": {
      title: "मंत्र टाइमर",
      description:
        "वेळेनुसार मंत्र जपाच्या सत्रांसाठी एक शांत टाइमर, ज्यात पूर्ण झाल्यावर मृदू घंटा वाजते.",
    },
    "stotra-collection": {
      title: "स्तोत्र संग्रह",
      description: "शास्त्रीय स्तोत्रे — शिव तांडव, लिंगाष्टकम, महामृत्युंजय आणि बरेच काही.",
    },
    "daily-quote": {
      title: "दैनिक सुविचार",
      description: "दररोज एक निवडक सनातन सुविचार — गीता, उपनिषद आणि बरेच काही.",
    },
    "daily-shlok": {
      title: "दैनिक श्लोक",
      description: "देवनागरीमधील दररोजचा श्लोक, तसेच लिपींतरण आणि अर्थासह.",
    },
    "mantra-library": {
      title: "मंत्र संग्रह",
      description: "30+ मंत्रांचा निवडक संग्रह, ज्यात देवनागरी, IAST आणि अर्थ समाविष्ट आहे.",
    },
    "beej-mantras": {
      title: "बीज मंत्र",
      description: "प्रत्येक बीज मंत्र, देवता, अर्थ आणि उच्चार मार्गदर्शकासह.",
    },
    "deity-mantras": {
      title: "देवता मंत्र",
      description: "देवतेनुसार आयोजित मंत्र — शिव, विष्णू, देवी, गणेश आणि बरेच काही.",
    },
    "mantra-of-the-day": {
      title: "आजचा मंत्र",
      description: "प्रत्येक दिवसासाठी एक फिरणारा पारंपारिक मंत्र — देवनागरी, IAST, अर्थासह.",
    },
    "gayatri-mantra": {
      title: "गायत्री मंत्र मार्गदर्शक",
      description: "गायत्री मंत्राचा शब्द-शः अर्थ, जप नियम आणि फायदे.",
    },
    "mahamrityunjaya-mantra": {
      title: "महामृत्युंजय मार्गदर्शक",
      description: "रुद्राचा आरोग्यदायी मंत्र — अर्थ, फायदे आणि जप नियम.",
    },
    "ai-dharma-assistant": {
      title: "AI धर्म सहाय्यक",
      description: "सनातन धर्माबद्दल काहीही विचारा आणि विचारपूर्वक, संदर्भानुसार उत्तर मिळवा.",
      intro:
        "सनातन धर्माबद्दल काहीही विचारा — शास्त्र, विधी, तत्त्वज्ञान — आणि विचारपूर्वक, संदर्भानुसार उत्तर मिळवा.",
    },
    "ai-gita-summary": {
      title: "AI गीता सारांश",
      description:
        "कोणत्याही भगवद्गीतेच्या अध्यायाचा तात्काळ, विश्वासार्ह सारांश महत्त्वाच्या श्लोकांसह.",
    },
    "ai-shlok-explainer": {
      title: "AI श्लोक स्पष्टीकरण",
      description: "कोणताही श्लोक पेस्ट करा — देवनागरी, IAST, शब्द-शः अर्थ आणि भाष्य मिळवा.",
    },
    "ai-festival-guide": {
      title: "AI उत्सव मार्गदर्शक",
      description: "कोणताही सण, समजावून सांगितलेला — कथा, तिथी, विधी, सामग्री आणि मंत्र.",
    },
    "ai-puja-planner": {
      title: "AI पूजा नियोजक",
      description:
        "आपल्या प्रसंगाचे वर्णन करा — AI संकल्पना, विधी आणि मंत्रांसह संपूर्ण पूजा आयोजित करते.",
    },
    "ai-mantra-meaning": {
      title: "AI मंत्र अर्थ",
      description: "कोणताही मंत्र, उकललेला — देवनागरी, IAST, शब्द-शः अर्थ, फायदे.",
    },
    "ai-sanskrit-helper": {
      title: "AI संस्कृत सहाय्यक",
      description:
        "संस्कृतचे भाषांतर करा, व्याकरण उकलून दाखवा आणि उच्चार करा — प्रत्येक वेळी देवनागरी आणि IAST.",
    },
    "mantra-recommender": {
      title: "AI मंत्र शिफारसकर्ता",
      description: "तुमचा उद्देश, देवता आणि दिवसाच्या वेळेनुसार AI-शक्तीशाली मंत्र सूचना.",
      intro: "तुमचा उद्देश वर्णन करा — AI अर्थ, फायदे आणि जपसंख्येसह तीन पारंपारिक मंत्र सुचवते.",
    },
    "baby-name-ai": {
      title: "AI बाळाचे नाव सुचवणारे",
      description: "नक्षत्र, अक्षर, अर्थ आणि लिंगानुसार AI बाळाच्या नावाच्या सूचना.",
      intro: "नक्षत्र, अक्षर, अर्थ आणि लिंगावर आधारित AI-निर्मित संस्कृत नावाच्या सूचना.",
    },
    "temple-finder": {
      title: "मंदिर शोधक",
      description: "एका टॅपने 20+ प्रमुख मंदिरांमध्ये जाण्याचे मार्ग शोधा.",
    },
    "temple-directory": {
      title: "मंदिर निर्देशिका",
      description: "भारतातील 25+ प्रमुख मंदिरांची शोधण्यायोग्य निर्देशिका.",
    },
    "darshan-timings": {
      title: "दर्शन वेळा",
      description: "प्रमुख मंदिरांच्या दर्शनाच्या वेळा आणि आरतीचे वेळापत्रक.",
    },
    "char-dham-planner": {
      title: "चार धाम नियोजक",
      description:
        "तुमच्या चार धाम यात्रेचे नियोजन करा — मार्ग, उत्तम महिने आणि थांबण्याची ठिकाणे.",
    },
    "jyotirlinga-guide": {
      title: "ज्योतिर्लिंग मार्गदर्शक",
      description: "12 ज्योतिर्लिंगांचे संपूर्ण मार्गदर्शन — इतिहास, वेळा आणि प्रवास.",
    },
    "shakti-peeth-guide": {
      title: "शक्ती पीठ मार्गदर्शक",
      description: "सर्वाधिक भेट दिलेल्या शक्ती पीठे — कथा आणि तेथे कसे पोहोचाल.",
    },
    "nearby-temples": {
      title: "जवळची मंदिरे",
      description: "तुमच्या जतन केलेल्या स्थानाजवळची मंदिरे अंतर आणि माहितीसह शोधा.",
    },
    "kundli-generator": {
      title: "कुंडली जनरेटर",
      description:
        "तुमच्या जन्मतारीख आणि वेळेनुसार मोफत वैदिक कुंडली — राशी, नक्षत्र, तिथी आणि योग.",
      intro:
        "जन्मतारीख आणि वेळेनुसार वैदिक ज्योतिषशास्त्राचे त्वरित अवलोकन — राशी, नक्षत्र, तिथी, योग आणि नामाक्षर.",
    },
    "rashi-calculator": {
      title: "राशी कॅल्क्युलेटर",
      description: "तुमच्या जन्मतारीख आणि वेळेनुसार तुमची चंद्र राशी (राशी) शोधा.",
    },
    "nakshatra-finder": {
      title: "नक्षत्र शोधक",
      description: "तुमचे जन्म नक्षत्र, पद आणि त्याचे अधिपती देव शोधा.",
    },
    "dasha-calculator": {
      title: "विंशोत्तरी दशा",
      description: "तुमच्या जन्म नक्षत्रावरून विंशोत्तरी महादशेची गणना केलेली अंदाजित वेळ.",
      intro: "तुमच्या जन्म नक्षत्रावरून गणना केलेली तुमची विंशोत्तरी महादशा.",
    },
    "gemstone-recommender": {
      title: "रत्न शिफारसकर्ता",
      description: "तुमच्या राशीनुसार वैयक्तिकृत रत्नाची शिफारस.",
    },
    numerology: {
      title: "अंकशास्त्र",
      description: "जीवनमार्ग आणि नशीब संख्या तसेच त्यांचे अर्थ.",
    },
    "name-numerology": {
      title: "नाव अंकशास्त्र",
      description: "कोणत्याही नावाचे अंकशास्त्रीय मूल्य, अर्थ आणि ग्रहीय कंपन.",
    },
    "birthstone-finder": {
      title: "जन्मदागिना शोधक",
      description: "कोणत्याही जन्म महिन्यासाठी पारंपरिक पाश्चात्त्य जन्मदागिना.",
    },
    "sanskrit-dictionary": {
      title: "संस्कृत शब्दकोश",
      description: "60+ प्रमुख संस्कृत शब्दांचे अर्थ आणि मूळासहित शोधा.",
    },
    transliteration: {
      title: "IAST → देवनागरी",
      description: "IAST किंवा ध्वन्यात्मक इंग्रजीचे त्वरित देवनागरीमध्ये रूपांतर करा.",
      intro:
        "IAST किंवा इंग्रजी ध्वन्यात्मक टाइप करा; त्वरित देवनागरी मिळवा. 'om namah shivaya' असे करून पहा.",
    },
    "sandhi-splitter": {
      title: "संधि विच्छेदक",
      description: "सामान्य संयुक्त शब्दांसाठी नियम-आधारित संधि विच्छेदक.",
    },
    "shloka-analyzer": {
      title: "श्लोक विश्लेषक",
      description: "कोणत्याही श्लोकातील अक्षरे, पदे मोजा आणि छंद ओळखा.",
    },
    "devanagari-typing": {
      title: "देवनागरी टायपिंग",
      description: "ऑन-स्क्रीन कीबोर्ड वापरून देवनागरीमध्ये टाइप करा.",
    },
    "verb-conjugator": {
      title: "क्रियापद conjugator",
      description: "सामान्य संस्कृत धातूंची वर्तमानकाळातील (लट् लकार) रूपे तयार करा.",
    },
    "sanskrit-word-of-day": {
      title: "आजचा संस्कृत शब्द",
      description: "दररोज एक नवीन संस्कृत शब्द अर्थ आणि मूळासहित.",
    },
    "names-by-nakshatra": {
      title: "नक्षत्रानुसार नावे",
      description: "तुमच्या बाळाच्या जन्म नक्षत्राच्या पाद अक्षरांनुसार बाळ नावे.",
    },
    "names-by-rashi": {
      title: "राशीनुसार नावे",
      description: "चंद्र-राशीच्या अक्षरांनुसार बाळ नावे - सुंदर आणि अर्थपूर्ण.",
    },
    "names-by-deity": {
      title: "देवतेनुसार नावे",
      description: "शिव, विष्णू, देवी, गणेश आणि इतर देवतांवरून प्रेरित नावे.",
    },
    "names-by-meaning": {
      title: "अर्थानुसार नावे",
      description: "प्रकाश, सामर्थ्य, ज्ञान, प्रेम आणि यांसारख्या अर्थांवरून नावे शोधा.",
    },
    "twin-names": {
      title: "जुळ्या मुलांची नावे",
      description: "संस्कृत परंपरेतून घेतलेली, जुळ्यांसाठी सुंदर नावे.",
    },
    "ai-name-suggester": {
      title: "AI नाम सुचवणारे",
      description: "नक्षत्र, अक्षरांची संख्या आणि अर्थानुसार AI द्वारे बाळाच्या नावाच्या सूचना.",
    },
    "bhagavad-gita": {
      title: "भगवद्गीता — अध्याय वाचक",
      description: "गीतेचे सर्व 18 अध्याय सारांश आणि मुख्य शिकवणीसह.",
    },
    "upanishads-guide": {
      title: "उपनिषद मार्गदर्शक",
      description: "प्रमुख उपनिषदे, त्यांची प्रमुख शिकवण आणि विषय.",
    },
    "vedas-introduction": {
      title: "वेदांचा परिचय",
      description: "चार वेदांचा सहज समजून घेता येईल असा परिचय.",
    },
    "yoga-sutras": {
      title: "योग सूत्रे विहंगावलोकन",
      description: "पतंजलींच्या योग सूत्रांचे चार पाद महत्त्वाच्या श्लोकांसह.",
    },
    "sanatan-timeline": {
      title: "सनातन टाइमलाइन",
      description: "सनातन धर्माची व्हिज्युअल टाइमलाइन — वैदिक काळापासून आजपर्यंत.",
    },
    "deity-encyclopedia": {
      title: "देवता विश्वकोष",
      description: "22+ देवतांची मूर्तीशास्त्र, मंत्र आणि कथांसह माहिती.",
    },
    "mahabharata-summary": {
      title: "महाभारत सारांश",
      description: "महाभारतातील सर्व 18 पर्व त्यांची मुख्य संकल्पना आणि कथांसह.",
    },
    "ramayana-summary": {
      title: "रामायण सारांश",
      description: "वाल्मिकी रामायणातील सात कांडे एकाच पानावर.",
    },
    "puranas-overview": {
      title: "18 महापुराणे",
      description: "18 महापुराणांची संपूर्ण यादी — देवता, विषय आणि श्लोक संख्या यासह.",
    },
    "deity-of-the-day": {
      title: "आजचे दैवत",
      description: "दररोज बदलणारे दैवत — मंत्र आणि महत्त्वाच्या माहितीसह.",
    },
    "nakshatra-guide": {
      title: "27 नक्षत्रांचे मार्गदर्शन",
      description: "सर्व 27 नक्षत्रे त्यांचे स्वामी, देवता, प्रतीक आणि स्वभावासह.",
    },
    "rashi-guide": {
      title: "12 राशींचे मार्गदर्शन",
      description: "सर्व 12 राशी त्यांचे स्वामी, तत्व आणि वैशिष्ट्यांसह.",
    },
  },

  gu: {
    // Gujarati — auto-translated
    "todays-panchang": {
      title: "આજનું પંચાંગ",
      description:
        "આજનું સંપૂર્ણ પંચાંગ — તિથિ, નક્ષત્ર, યોગ, કરણ, સૂર્યોદય, સૂર્યાસ્ત અને અશુભ મુહૂર્ત.",
      intro: "તમારા શહેર માટે ગણવામાં આવેલ તમારું સંપૂર્ણ દ્રિક-ચોક્કસ પંચાંગ.",
    },
    "todays-tithi": {
      title: "આજની તિથિ",
      description: "કોઈપણ તારીખ અને શહેર માટે ચોક્કસ તિથિ — પક્ષ અને ચોક્કસ સમાપ્તિ સમય સાથે.",
    },
    "todays-nakshatra": {
      title: "આજનું નક્ષત્ર",
      description: "આજનું નક્ષત્ર પદ, શાસક ગ્રહ, દેવતા અને સમાપ્તિ સમય સાથે.",
    },
    "todays-yoga": {
      title: "આજનો યોગ",
      description: "આજનો યોગ (27 માંથી એક) પ્રગતિ અને સમાપ્તિ સમય સાથે.",
    },
    "todays-karana": {
      title: "આજનું કરણ",
      description: "આજનું કરણ પ્રકાર (ચલ / સ્થિર) અને ચોક્કસ સમાપ્તિ સમય સાથે.",
    },
    "todays-sunrise": {
      title: "આજનો સૂર્યોદય",
      description:
        "કોઈપણ શહેર માટે ચોક્કસ સૂર્યોદય — સૂર્યાસ્ત, સૌર મધ્યાહન અને દિવસની લંબાઈ સાથે.",
    },
    "todays-sunset": {
      title: "આજનો સૂર્યાસ્ત",
      description:
        "કોઈપણ શહેર માટે ચોક્કસ સૂર્યાસ્ત — સૂર્યોદય, સૌર મધ્યાહન અને દિવસની લંબાઈ સાથે.",
    },
    "rahu-kaal": {
      title: "રાહુ કાળ",
      description: "આજનો રાહુ કાળ — સ્થાન-જાગૃત અને મિનિટ સુધી ચોક્કસ.",
    },
    "gulika-kaal": {
      title: "ગુલિકા કાળ",
      description: "આજનો ગુલિકા કાળ વાસ્તવિક સૂર્યોદય / સૂર્યાસ્ત સાથે.",
    },
    yamaganda: { title: "યમગંડ", description: "આજનો યમગંડ — દિવસના આઠ ભાગોમાંથી એક." },
    choghadiya: {
      title: "ચોઘડિયા",
      description: "દિવસ અને રાત ચોઘડિયા શુભ અને અશુભ મુહૂર્ત સાથે.",
    },
    "panchang-by-date": {
      title: "તારીખ દ્વારા પંચાંગ",
      description: "પૃથ્વી પરની કોઈપણ તારીખ અને કોઈપણ શહેર માટે સંપૂર્ણ પંચાંગ શોધો.",
    },
    "hora-chart": {
      title: "હોરા ચાર્ટ",
      description: "કોઈપણ પ્રવૃત્તિ માટે યોગ્ય સમય પસંદ કરવા માટે ગ્રહોનો હોરા ચાર્ટ.",
      intro: "દિવસ અને રાતની 24 ગ્રહોની હોરા — કાર્ય કરવા માટે યોગ્ય સમય પસંદ કરવા માટે શ્રેષ્ઠ.",
    },
    "sunrise-sunset-atlas": {
      title: "સૂર્યોદય અને સૂર્યાસ્ત એટલાસ",
      description: "વિશ્વભરના શહેરોમાં સૂર્યોદય અને સૂર્યાસ્તની તુલના કરો.",
    },
    "moon-phase": {
      title: "ચંદ્ર કલા",
      description: "કોઈપણ તારીખ માટે વર્તમાન ચંદ્ર કલા, પ્રકાશ અને કલા કોણ.",
      intro: "વર્તમાન ચંદ્ર કલા, પ્રકાશ અને કલા કોણ — કોઈપણ તારીખ માટે જીવંત ગણતરી.",
    },
    "abhijit-muhurat": {
      title: "અભિજિત મુહૂર્ત",
      description: "આજની અભિજિત મુહૂર્ત વિન્ડો — સૌથી શુભ 48 મિનિટ.",
      intro:
        "અભિજિત એ 15 દિવસ-મુહૂર્તોમાંનો 8મો છે — સૌર બપોરની આસપાસ કેન્દ્રિત 48 મિનિટ. દિવસની સૌથી શુભ વિન્ડો (બુધવાર સિવાય).",
    },
    "brahma-muhurat": {
      title: "બ્રહ્મ મુહૂર્ત",
      description: "પ્રભાત પહેલાની બ્રહ્મ મુહૂર્ત વિન્ડો — ધ્યાન માટે આદર્શ.",
      intro:
        "સૂર્યોદય પહેલાના બે મુહૂર્ત — સત્વ-સમૃદ્ધ વિન્ડો જ્યારે મન સાધના માટે સૌથી વધુ ગ્રહણશીલ હોય છે.",
    },
    "festival-calendar-2026": {
      title: "ઉત્સવ કેલેન્ડર 2026",
      description: "2026 ના દરેક સનાતન ઉત્સવ, મહિને મહિને, પ્રાદેશિક અને શ્રેણી ફિલ્ટર્સ સાથે.",
    },
    "festival-countdown": {
      title: "ઉત્સવ કાઉન્ટડાઉન",
      description: "2026 ના કોઈપણ ઉત્સવ સુધીનું જીવંત કાઉન્ટડાઉન — સેકન્ડ સુધી.",
    },
    "festival-finder": {
      title: "ઉત્સવ શોધક",
      description: "નામ, દેવી-દેવતા અથવા મહિના દ્વારા તહેવારો શોધો — આયોજન માટે શ્રેષ્ઠ.",
    },
    "vrat-calendar": {
      title: "વ્રત કેલેન્ડર",
      description: "દરેક મુખ્ય વ્રત ઉપવાસના નિયમો, સમય અને મંત્રો સાથે.",
    },
    "ekadashi-dates": {
      title: "એકાદશી તારીખો",
      description: "2026 ની દરેક એકાદશી વર્ણન અને વ્રત વિધિ સાથે.",
      intro: "2026 ની બધી 24 એકાદશીઓ વર્ણન અને વ્રત વિધિ સાથે.",
    },
    "purnima-amavasya": {
      title: "પૂર્ણિમા અને અમાવસ્યા",
      description: "પ્રાદેશિક મહત્વ સાથેની બધી પૂર્ણિમા અને અમાવસ્યાની તારીખો.",
    },
    "regional-festivals": {
      title: "પ્રાદેશિક ઉત્સવો",
      description: "દરેક રાજ્ય અને સમુદાય માટે અનન્ય તહેવારો શોધો.",
    },
    "pradosh-vrat": {
      title: "પ્રદોષ વ્રતની તારીખો",
      description: "પ્રદોષ વ્રતની દરેક તારીખ દિવસના પ્રકાર (સોમ, ભૌમ, શનિ) સાથે નોંધાયેલી છે.",
    },
    "sankashti-chaturthi": {
      title: "સંકષ્ટિ ચતુર્થી",
      description: "માસિક સંકષ્ટિ ચતુર્થીની તારીખો — ગણેશની કૃપાનો દિવસ.",
    },
    "festival-of-the-day": {
      title: "આજનો તહેવાર",
      description: "આજનો અથવા પછીનો તરત આવતો સનાતન તહેવાર — એક નજરમાં કાર્ડ.",
    },
    "upcoming-festivals": {
      title: "આગામી તહેવારો",
      description: "આગામી 12 તહેવારો — આવનારા અઠવાડિયાની યોજના બનાવો.",
    },
    "puja-checklist-generator": {
      title: "પૂજા ચેકલિસ્ટ જનરેટર",
      description: "6 મુખ્ય પૂજાઓ માટે ઇન્ટરેક્ટિવ સામગ્રી, વિધિ અને મંત્ર ચેકલિસ્ટ.",
    },
    "aarti-collection": {
      title: "આરતી સંગ્રહ",
      description: "સૌથી વધુ પસંદ કરાયેલી આરતીઓનો હાથથી પસંદ કરેલો સંગ્રહ, સુંદર રીતે ગોઠવેલો.",
    },
    "chalisa-collection": {
      title: "ચાલીસા સંગ્રહ",
      description: "દેવનાગરીમાં હનુમાન, દુર્ગા, શિવ, ગણેશ અને સરસ્વતી ચાલીસા.",
    },
    "puja-vidhi-planner": {
      title: "પૂજા વિધિ પ્લાનર",
      description: "કોઈપણ પૂજા માટે સ્ટેપ-બાય-સ્ટેપ પ્લાનર — સંકલ્પ, મંત્ર, આરતી અને સમયનું બજેટ.",
    },
    "samagri-checklist": {
      title: "સામગ્રી ચેકલિસ્ટ",
      description: "આઠ મુખ્ય પૂજાઓ માટે જથ્થા સાથે ક્યુરેટેડ સામગ્રીની સૂચિ.",
    },
    "sankalp-generator": {
      title: "સંકલ્પ જનરેટર",
      description: "તમારા નામ, ગોત્ર, તારીખ અને સ્થળ સાથે સાચો સંકલ્પ બનાવો.",
    },
    "griha-pravesh-planner": {
      title: "ગૃહ પ્રવેશ પ્લાનર",
      description: "તમારા ગૃહ પ્રવેશ માટે સંપૂર્ણ સ્ટેપ-બાય-સ્ટેપ માર્ગદર્શિકા.",
    },
    "havan-guide": {
      title: "હવન માર્ગદર્શિકા",
      description: "સામગ્રી, પ્રક્રિયા અને સલામતી ટિપ્સ સાથે સંપૂર્ણ હવન માર્ગદર્શિકા.",
    },
    "aarti-thali-guide": {
      title: "આરતી થાળી માર્ગદર્શિકા",
      description: "આરતી થાળી પરની દરેક વસ્તુ અને તેનો સાંકેતિક અર્થ.",
    },
    "prasad-recipes": {
      title: "પ્રસાદની વાનગીઓ",
      description: "પરંપરાગત પ્રસાદની વાનગીઓ — મોદક, પંજીરી, શીરા અને બીજી ઘણી બધી.",
    },
    "digital-jaap-counter": {
      title: "ડિજિટલ જાપ કાઉન્ટર",
      description:
        "108 મણકાની માળાની પ્રગતિ અને આજીવન ગણતરી સાથે ધ્યાન ભંગ ન થાય તેવું જાપ કાઉન્ટર.",
    },
    "om-counter": {
      title: "ૐ કાઉન્ટર",
      description: "એક કેન્દ્રિત ૐ (Om) કાઉન્ટર — માળાની પ્રગતિ અને મધુર ધ્વનિ સાથે ॐ નો જાપ કરો.",
    },
    "mala-counter": {
      title: "માળા કાઉન્ટર",
      description: "એક શાંત માળા કાઉન્ટર — મણકા, માળા અને આજીવન ગણતરી ટ્રૅક કરો.",
    },
    "mantra-timer": {
      title: "મંત્ર ટાઈમર",
      description: "સમયબદ્ધ મંત્ર સત્રો માટે એક સૌમ્ય ટાઈમર જેમાં પૂર્ણ થવા પર મધુર ધ્વનિ હોય.",
    },
    "stotra-collection": {
      title: "સ્તોત્ર સંગ્રહ",
      description: "શાસ્ત્રીય સ્તોત્રો — શિવ તાંડવ, લિંગાષ્ટકમ, મહામૃત્યુંજય અને બીજા ઘણા.",
    },
    "daily-quote": {
      title: "દૈનિક અવતરણ",
      description: "દરરોજ એક હાથથી ચૂકેલું સનાતન અવતરણ — ગીતા, ઉપનિષદ અને બીજા ઘણા.",
    },
    "daily-shlok": {
      title: "દૈનિક શ્લોક",
      description: "દેવનાગરી લિપિમાં અનુવાદ અને અર્થ સાથેનો દૈનિક શ્લોક.",
    },
    "mantra-library": {
      title: "મંત્ર પુસ્તકાલય",
      description: "દેવનાગરી, IAST અને અર્થ સાથેના 30+ મંત્રોનો એક ક્યુરેટેડ સંગ્રહ.",
    },
    "beej-mantras": {
      title: "બીજ મંત્રો",
      description: "દરેક બીજ મંત્ર દેવતા, અર્થ અને ઉચ્ચાર માર્ગદર્શિકા સાથે.",
    },
    "deity-mantras": {
      title: "દેવી-દેવતાના મંત્રો",
      description: "દેવતા મુજબ ગોઠવાયેલા મંત્રો — શિવ, વિષ્ણુ, દેવી, ગણેશ અને બીજા ઘણા.",
    },
    "mantra-of-the-day": {
      title: "આજનો મંત્ર",
      description: "દરેક દિવસ માટે એક પરંપરાગત મંત્ર — દેવનાગરી, IAST, અને અર્થ.",
    },
    "gayatri-mantra": {
      title: "ગાયત્રી મંત્ર માર્ગદર્શિકા",
      description: "દરેક શબ્દનો અર્થ, ઉચ્ચારના નિયમો અને ગાયત્રી મંત્રના ફાયદા.",
    },
    "mahamrityunjaya-mantra": {
      title: "મહામૃત્યુંજય માર્ગદર્શિકા",
      description: "રુદ્રનો હીલિંગ મંત્ર — અર્થ, ફાયદા અને જાપના નિયમો.",
    },
    "ai-dharma-assistant": {
      title: "AI ધર્મ સહાયક",
      description: "સનાતન ધર્મ વિશે કંઈપણ પૂછો અને વિચારપૂર્વક, સંદર્ભિત જવાબ મેળવો.",
      intro:
        "સનાતન ધર્મ — શાસ્ત્ર, રીતરિવાજ, ફિલસૂફી — વિશે કંઈપણ પૂછો અને વિચારપૂર્વક, સંદર્ભિત જવાબ મેળવો.",
    },
    "ai-gita-summary": {
      title: "AI ગીતા સારાંશ",
      description: "ભગવદ ગીતાના કોઈપણ અધ્યાયનો મુખ્ય શ્લોકો સાથે ત્વરિત, સચોટ સારાંશ.",
    },
    "ai-shlok-explainer": {
      title: "AI શ્લોક વિશ્લેષક",
      description: "કોઈપણ શ્લોક પેસ્ટ કરો — દેવનાગરી, IAST, શબ્દ-દર-શબ્દ અર્થ અને ભાષ્ય મેળવો.",
    },
    "ai-festival-guide": {
      title: "AI તહેવાર માર્ગદર્શિકા",
      description: "કોઈપણ તહેવાર, સમજાવેલ — વાર્તા, તિથિ, વિધિ, સામગ્રી અને મંત્રો.",
    },
    "ai-puja-planner": {
      title: "AI પૂજા પ્લાનર",
      description:
        "તમારા પ્રસંગનું વર્ણન કરો — AI સંકલ્પ, વિધિ અને મંત્રો સાથે સંપૂર્ણ પૂજાનું આયોજન કરે છે.",
    },
    "ai-mantra-meaning": {
      title: "AI મંત્રનો અર્થ",
      description: "કોઈપણ મંત્ર, ડીકોડ કરેલ — દેવનાગરી, IAST, શબ્દ-દર-શબ્દ અર્થ, ફાયદા.",
    },
    "ai-sanskrit-helper": {
      title: "AI સંસ્કૃત સહાયક",
      description:
        "સંસ્કૃતનું ભાષાંતર કરો, વ્યાકરણ ડીકોડ કરો અને ઉચ્ચાર કરો — હંમેશા દેવનાગરી અને IAST માં.",
    },
    "mantra-recommender": {
      title: "AI મંત્ર ભલામણકર્તા",
      description: "ઇરાદા, દેવતા અને દિવસના સમયના આધારે AI-સંચાલિત મંત્ર સૂચનો.",
      intro:
        "તમારા ઇરાદાનું વર્ણન કરો — AI અર્થ, ફાયદા અને જાપની સંખ્યા સાથે ત્રણ પરંપરાગત મંત્રો સૂચવે છે.",
    },
    "baby-name-ai": {
      title: "AI બાળકનું નામ સૂચક",
      description: "નક્ષત્ર, સિલેબલ, અર્થ અને લિંગ દ્વારા AI દ્વારા બાળકના નામ સૂચનો.",
      intro: "નક્ષત્ર, સિલેબલ, અર્થ અને લિંગના આધારે AI-નિર્મિત સંસ્કૃત નામના સૂચનો.",
    },
    "temple-finder": {
      title: "મંદિર શોધક",
      description: "20+ મુખ્ય મંદિરો એક ટૅપ દિશા નિર્દેશો સાથે શોધો.",
    },
    "temple-directory": {
      title: "મંદિર ડિરેક્ટરી",
      description: "સમગ્ર ભારતમાં 25+ મુખ્ય મંદિરોની શોધી શકાય તેવી ડિરેક્ટરી.",
    },
    "darshan-timings": {
      title: "દર્શન સમય",
      description: "મુખ્ય મંદિરો માટે દર્શનનો સમય અને આરતીનું સમયપત્રક.",
    },
    "char-dham-planner": {
      title: "ચાર ધામ યોજનાકાર",
      description: "તમારી ચાર ધામ યાત્રાનું આયોજન કરો — માર્ગો, શ્રેષ્ઠ મહિના અને રોકાણના સ્થળો.",
    },
    "jyotirlinga-guide": {
      title: "જ્યોતિર્લિંગ માર્ગદર્શિકા",
      description: "12 જ્યોતિર્લિંગો માટે સંપૂર્ણ માર્ગદર્શિકા — ઇતિહાસ, સમય અને યાત્રા.",
    },
    "shakti-peeth-guide": {
      title: "શક્તિ પીઠ માર્ગદર્શિકા",
      description: "સૌથી વધુ મુલાકાત કરાયેલા શક્તિ પીઠો — વાર્તાઓ અને ત્યાં કેવી રીતે પહોંચવું.",
    },
    "nearby-temples": {
      title: "નજીકના મંદિરો",
      description: "તમારા સાચવેલા સ્થાનની નજીકના મંદિરો અંતર અને વિગતો સાથે શોધો.",
    },
    "kundli-generator": {
      title: "કુંડળી જનરેટર",
      description: "રાશિ, નક્ષત્ર, તિથિ અને યોગ સાથે મફત વૈદિક કુંડળી.",
      intro:
        "જન્મ તારીખ અને સમય પરથી વૈદિક કુંડળીનો ઝડપી સ્નેપશોટ — રાશિ, નક્ષત્ર, તિથિ, યોગ અને નામકરણના અક્ષરો.",
    },
    "rashi-calculator": {
      title: "રાશિ કેલ્ક્યુલેટર",
      description: "જન્મ તારીખ અને સમય પરથી તમારી ચંદ્ર રાશિ (રાશિ) શોધો.",
    },
    "nakshatra-finder": {
      title: "નક્ષત્ર શોધક",
      description: "તમારા જન્મા નક્ષત્ર, પદ અને તેના શાસક દેવતા શોધો.",
    },
    "dasha-calculator": {
      title: "વિમશોત્તરી દશા",
      description: "તમારા જન્મ નક્ષત્ર પરથી ગણતરી કરેલ વિમશોત્તરી મહાદશા સમયરેખા.",
      intro: "તમારા જન્મા નક્ષત્ર પરથી ગણતરી કરેલ તમારી વિમશોત્તરી મહાદશા સમયરેખા.",
    },
    "gemstone-recommender": {
      title: "રત્ન ભલામણકર્તા",
      description: "તમારી રાશિના આધારે વ્યક્તિગત રત્ન ભલામણ.",
    },
    numerology: {
      title: "અંકશાસ્ત્ર",
      description: "જીવન-માર્ગ અને ભાગ્યના અંકો તેમના અર્થ સાથે.",
    },
    "name-numerology": {
      title: "નામ અંકશાસ્ત્ર",
      description: "કોઈપણ નામનું અંકશાસ્ત્રીય મૂલ્ય તેના અર્થ અને ગ્રહ કંપન સાથે.",
    },
    "birthstone-finder": {
      title: "બર્થસ્ટોન શોધક",
      description: "કોઈપણ જન્મ મહિના માટે પરંપરાગત પશ્ચિમી બર્થસ્ટોન.",
    },
    "sanskrit-dictionary": {
      title: "સંસ્કૃત શબ્દકોશ",
      description: "60+ મુખ્ય સંસ્કૃત શબ્દો તેમના અર્થ અને મૂળ સાથે શોધો.",
    },
    transliteration: {
      title: "IAST → દેવનાગરી",
      description: "IAST અથવા ફોનેટિક અંગ્રેજીને તરત દેવનાગરીમાં રૂપાંતરિત કરો.",
      intro:
        "IAST અથવા અંગ્રેજી ફોનેટિક ટાઇપ કરો; ત્વરિત દેવનાગરી મેળવો. પ્રયાસ કરો: 'om namah shivaya'.",
    },
    "sandhi-splitter": {
      title: "સંધિ વિચ્છેદક",
      description: "સામાન્ય સંયુક્ત શબ્દો માટે નિયમ-આધારિત સંધિ વિચ્છેદક.",
    },
    "shloka-analyzer": {
      title: "શ્લોક વિશ્લેષક",
      description: "કોઈપણ શ્લોકના સિલેબલ, પાદસની ગણતરી કરો અને છંદોનો અંદાજ લગાવો.",
    },
    "devanagari-typing": {
      title: "દેવનાગરી ટાઇપિંગ",
      description: "ઓન-સ્ક્રીન કીબોર્ડ વડે દેવનાગરીમાં ટાઇપ કરો.",
    },
    "verb-conjugator": {
      title: "ક્રિયાપદ સંયોગક",
      description: "સામાન્ય સંસ્કૃત ધાતુઓનો વર્તમાનકાળમાં (લટ્ લકાર) સંયોગ કરો.",
    },
    "sanskrit-word-of-day": {
      title: "આજનો સંસ્કૃત શબ્દ",
      description: "દરરોજ એક નવો સંસ્કૃત શબ્દ તેના અર્થ અને મૂળ સાથે.",
    },
    "names-by-nakshatra": {
      title: "નક્ષત્ર અનુસાર નામ",
      description: "તમારા બાળકના જન્મ નક્ષત્રના પાદ સિલેબલ સાથે સુસંગત બાળકના નામ.",
    },
    "names-by-rashi": {
      title: "રાશિ અનુસાર નામ",
      description: "ચંદ્ર-રાશિ સિલેબલ દ્વારા બાળકના નામ — સુંદર અને અર્થપૂર્ણ.",
    },
    "names-by-deity": {
      title: "દેવી-દેવતાના નામો",
      description: "શિવ, વિષ્ણુ, દેવી, ગણેશ અને અન્ય દેવી-દેવતાઓથી પ્રેરિત નામો.",
    },
    "names-by-meaning": {
      title: "અર્થ પ્રમાણે નામો",
      description: "પ્રકાશ, શક્તિ, જ્ઞાન, પ્રેમ અને અન્ય અર્થોવાળા નામો શોધો.",
    },
    "twin-names": {
      title: "જોડિયા નામો",
      description: "સંસ્કૃત પરંપરામાંથી લેવાયેલા જોડિયા બાળકો માટે સુંદર જોડીવાળા નામો.",
    },
    "ai-name-suggester": {
      title: "AI નામ સૂચક",
      description: "નક્ષત્ર, સિલેબલ અને અર્થ પ્રમાણે AI બાળકના નામ સૂચવે છે.",
    },
    "bhagavad-gita": {
      title: "ભગવદ ગીતા — અધ્યાય વાચક",
      description: "ગીતાના તમામ 18 અધ્યાયો સારાંશ અને મુખ્ય ઉપદેશ સાથે.",
    },
    "upanishads-guide": {
      title: "ઉપનિષદો માર્ગદર્શિકા",
      description: "મુખ્ય ઉપનિષદો તેમના વિષયવસ્તુ અને મુખ્ય ઉપદેશ સાથે.",
    },
    "vedas-introduction": { title: "વેદ પરિચય", description: "ચાર વેદોનો સંક્ષિપ્ત પરિચય." },
    "yoga-sutras": {
      title: "યોગ સૂત્રો વિહંગાવલોકન",
      description: "પતંજલિના યોગ સૂત્રોના ચાર પાદ મુખ્ય શ્લોકો સાથે.",
    },
    "sanatan-timeline": {
      title: "સનાતન સમયરેખા",
      description: "વૈદિક યુગથી આજ સુધીનો સનાતન ધર્મનો દ્રશ્ય સમયરેખા.",
    },
    "deity-encyclopedia": {
      title: "દેવી-દેવતાનો જ્ઞાનકોશ",
      description: "22+ દેવી-દેવતાઓ તેમની પ્રતિમાશાસ્ત્ર, મંત્રો અને કથાઓ સાથે.",
    },
    "mahabharata-summary": {
      title: "મહાભારત સારાંશ",
      description: "મહાભારતના તમામ 18 પર્વ તેમના વિષયવસ્તુ અને કથાના પ્રવાહ સાથે.",
    },
    "ramayana-summary": {
      title: "રામાયણ સારાંશ",
      description: "વાલ્મીકિ રામાયણના સાત કાંડ એક જ પૃષ્ઠમાં.",
    },
    "puranas-overview": {
      title: "18 મહાપુરાણ",
      description: "18 મહાપુરાણોની સંપૂર્ણ સૂચિ — દેવતા, મુખ્ય વિષય અને શ્લોકોની સંખ્યા સાથે.",
    },
    "deity-of-the-day": {
      title: "આજનો દેવતા",
      description: "દરરોજ એક ફરતા દેવતા — મંત્ર અને મહત્વ સાથે.",
    },
    "nakshatra-guide": {
      title: "27 નક્ષત્રોની માર્ગદર્શિકા",
      description: "બધા 27 નક્ષત્રો તેમના સ્વામી, દેવતા, પ્રતીક અને પ્રકૃતિ સાથે.",
    },
    "rashi-guide": {
      title: "12 રાશિઓની માર્ગદર્શિકા",
      description: "બધી 12 રાશિઓ તેમના સ્વામી, તત્વ અને લાક્ષણિકતાઓ સાથે.",
    },
  },

  ta: {
    // Tamil — auto-translated
    "todays-panchang": {
      title: "இன்றைய பஞ்சாங்கம்",
      description:
        "இன்றைய முழு பஞ்சாங்கம் — திதி, நட்சத்திரம், யோகம், கரணம், சூரிய உதயம், மறைவு மற்றும் அசுப நேரங்கள்.",
      intro: "உங்கள் இருப்பிடத்திற்கு ஏற்ப துல்லியமாக கணக்கிடப்பட்ட முழு பஞ்சாங்கம்.",
    },
    "todays-tithi": {
      title: "இன்றைய திதி",
      description:
        "எந்த ஒரு தேதி மற்றும் நகரத்திற்கான துல்லியமான திதி — பக்ஷம் மற்றும் சரியான முடிவு நேரத்துடன்.",
    },
    "todays-nakshatra": {
      title: "இன்றைய நட்சத்திரம்",
      description: "பதம், ஆளும் கிரகம், தெய்வம் மற்றும் முடிவு நேரத்துடன் இன்றைய நட்சத்திரம்.",
    },
    "todays-yoga": {
      title: "இன்றைய யோகம்",
      description: "இன்றைய யோகம் (27ல் ஒன்று) முன்னேற்றம் மற்றும் முடிவு நேரத்துடன்.",
    },
    "todays-karana": {
      title: "இன்றைய கரணம்",
      description: "வகையுடன் (நகரும் / நிலையானது) மற்றும் சரியான முடிவு நேரத்துடன் இன்றைய கரணம்.",
    },
    "todays-sunrise": {
      title: "இன்றைய சூரிய உதயம்",
      description:
        "எந்த ஒரு நகரத்திற்கான துல்லியமான சூரிய உதயம் — சூரிய மறைவு, சூரிய உச்சம் மற்றும் பகல் நேர நீளத்துடன்.",
    },
    "todays-sunset": {
      title: "இன்றைய சூரிய மறைவு",
      description:
        "எந்த ஒரு நகரத்திற்கான துல்லியமான சூரிய மறைவு — சூரிய உதயம், சூரிய உச்சம் மற்றும் பகல் நேர நீளத்துடன்.",
    },
    "rahu-kaal": {
      title: "இன்றைய ராகு காலம்",
      description: "இன்றைய ராகு கால சாளரம் — இருப்பிடமறிந்து, நிமிடம் வரை துல்லியமானது.",
    },
    "gulika-kaal": {
      title: "இன்றைய குளிகை காலம்",
      description: "உண்மையான சூரிய உதயம் / மறைவுடன் இன்றைய குளிகை கால சாளரம்.",
    },
    yamaganda: {
      title: "இன்றைய யமகண்டம்",
      description: "இன்றைய யமகண்ட சாளரம் — நாளின் எட்டு பகுதிகளில் ஒன்று.",
    },
    choghadiya: {
      title: "சௌகாடியா",
      description: "பகல் மற்றும் இரவு சௌகாடியா சுபன் மற்றும் அசுப சாளரங்களுடன்.",
    },
    "panchang-by-date": {
      title: "தேதி வாரியான பஞ்சாங்கம்",
      description:
        "பூமியில் உள்ள எந்த ஒரு தேதி மற்றும் எந்த ஒரு நகரத்திற்கான முழு பஞ்சாங்கத்தையும் தேடுங்கள்.",
    },
    "hora-chart": {
      title: "ஹோரை விளக்கப்படம்",
      description:
        "எந்தவொரு செயலையும் செய்ய சரியான நேரத்தைத் தேர்ந்தெடுப்பதற்கான கிரக ஹோரை விளக்கப்படம்.",
      intro:
        "பகல் மற்றும் இரவில் 24 கிரக ஹோரை — செயல்பட சரியான நேரத்தைத் தேர்ந்தெடுப்பதற்கு ஏற்றது.",
    },
    "sunrise-sunset-atlas": {
      title: "சூரிய உதயம் & அஸ்தமனம் அட்லஸ்",
      description: "உலகம் முழுவதும் உள்ள நகரங்களில் சூரிய உதயம் மற்றும் அஸ்தமனத்தை ஒப்பிடவும்.",
    },
    "moon-phase": {
      title: "சந்திரனின் கட்டம்",
      description: "எந்த தேதிக்கும் தற்போதைய சந்திரனின் கட்டம், வெளிச்சம் மற்றும் கோண நிலை.",
      intro:
        "தற்போதைய சந்திரனின் கட்டம், வெளிச்சம் மற்றும் கோண நிலை — எந்த தேதிக்கும் நேரலையில் கணக்கிடப்படுகிறது.",
    },
    "abhijit-muhurat": {
      title: "அபிஜித் முகூர்த்தம்",
      description: "இன்றைய அபிஜித் முகூர்த்த நேரம் – மிகவும் சுபகரமான 48 நிமிடங்கள்.",
      intro:
        "அபிஜித் என்பது 15 பகல் முகூர்த்தங்களில் 8 வது முகூர்த்தமாகும் — சூரியன் நடுப்பகலை மையமாகக் கொண்ட 48 நிமிடங்கள். இது நாளின் மிகவும் சுபகரமான நேரமாகும் (புதன்கிழமை தவிர).",
    },
    "brahma-muhurat": {
      title: "பிரம்ம முகூர்த்தம்",
      description: "அதிகாலையில் பிரம்ம முகூர்த்த நேரம் – தியானத்திற்கு ஏற்றது.",
      intro:
        "சூரிய உதயத்திற்கு முன் வரும் இரண்டு முகூர்த்தங்கள் — சாத்விக குணம் நிறைந்த இந்த நேரத்தில் மனம் ச साधनाவிற்கு மிகவும் உகந்ததாக இருக்கும்.",
    },
    "festival-calendar-2026": {
      title: "பண்டிகை காலண்டர் 2026",
      description:
        "2026 ஆம் ஆண்டின் ஒவ்வொரு சனாதன பண்டிகையும், மாதம் தோறும் பிராந்திய மற்றும் வகை வடிகட்டிகளுடன்.",
    },
    "festival-countdown": {
      title: "பண்டிகை கவுண்ட்டவுன்",
      description:
        "2026 ஆம் ஆண்டின் எந்தவொரு பண்டிகைக்கும் ஒரு நேரலை கவுண்ட்டவுன் — வினாடி தோறும்.",
    },
    "festival-finder": {
      title: "பண்டிகை தேடல்",
      description:
        "பண்டிகைகளை பெயர், தெய்வம் அல்லது மாதம் வாரியாக தேடுங்கள் — திட்டமிடுவதற்கு ஏற்றது.",
    },
    "vrat-calendar": {
      title: "விரத காலண்டர்",
      description: "முக்கியமான ஒவ்வொரு விரதமும், விரத விதிகள், நேரங்கள் மற்றும் மந்திரங்களுடன்.",
    },
    "ekadashi-dates": {
      title: "ஏகாதசி தேதிகள்",
      description: "2026 ஆம் ஆண்டின் ஒவ்வொரு ஏகாதசியும் விளக்கம் மற்றும் விரத விதியுடன்.",
      intro: "2026 ஆம் ஆண்டின் அனைத்து 24 ஏகாதசிகளும் விளக்கம் மற்றும் விரத விதியுடன்.",
    },
    "purnima-amavasya": {
      title: "பௌர்ணமி & அமாவாசை",
      description: "பிராந்திய முக்கியத்துவத்துடன் அனைத்து பௌர்ணமி மற்றும் அமாவாசை தேதிகள்.",
    },
    "regional-festivals": {
      title: "பிராந்திய பண்டிகைகள்",
      description: "ஒவ்வொரு மாநிலத்திற்கும் சமூகத்திற்கும் தனித்துவமான பண்டிகைகளைக் கண்டறியவும்.",
    },
    "pradosh-vrat": {
      title: "பிரதோஷ விரத தேதிகள்",
      description:
        "ஒவ்வொரு பிரதோஷ விரத தேதியும் அதனுடன் கூடிய கிழமை வகை (சோம, பெளம, சனி) குறிப்புகளுடன்.",
    },
    "sankashti-chaturthi": {
      title: "சங்கடஹர சதுர்த்தி",
      description: "மாதாந்திர சங்கடஹர சதுர்த்தி தேதிகள் — விநாயகப் பெருமானின் அருள் கூரும் நாள்.",
    },
    "festival-of-the-day": {
      title: "இன்றைய பண்டிகை",
      description: "இன்றைய அல்லது அடுத்த சனாதனப் பண்டிகை — ஒரே பார்வையில் காண.",
    },
    "upcoming-festivals": {
      title: "வரவிருக்கும் பண்டிகைகள்",
      description: "அடுத்த 12 பண்டிகைகள் — வரவிருக்கும் வாரங்களைத் திட்டமிடவும்.",
    },
    "puja-checklist-generator": {
      title: "பூஜை சரிபார்ப்பு பட்டியல் ஜெனரேட்டர்",
      description:
        "6 முக்கிய பூஜைகளுக்கான ஊடாடும் சாமகிரி, விதி மற்றும் மந்திர சரிபார்ப்பு பட்டியல்.",
    },
    "aarti-collection": {
      title: "ஆரத்தி தொகுப்பு",
      description:
        "மிகவும் விரும்பப்படும் ஆரத்திகளின் கவனமாக தேர்ந்தெடுக்கப்பட்ட தொகுப்பு, அழகாக வடிவமைக்கப்பட்டுள்ளது.",
    },
    "chalisa-collection": {
      title: "சாலிசா தொகுப்பு",
      description:
        "Hanuman, Durga, Shiv, Ganesh மற்றும் Saraswati சாலிசாக்கள் Devanagari எழுத்துருவில் அடங்கும்.",
    },
    "puja-vidhi-planner": {
      title: "பூஜா விதி திட்டமிடுபவர்",
      description:
        "எந்த ஒரு பூஜைக்கும் படிநிலை திட்டமிடுபவர் — சங்கல்பம், மந்திரங்கள், ஆரத்தி மற்றும் நேர ஒதுக்கீடு.",
    },
    "samagri-checklist": {
      title: "சாமகிரி சரிபார்ப்பு பட்டியல்",
      description: "எட்டு முக்கிய பூஜைகளுக்கான சாமகிரி பட்டியல்கள் அளவில்.",
    },
    "sankalp-generator": {
      title: "சங்கல்ப ஜெனரேட்டர்",
      description:
        "உங்கள் பெயர், கோத்திரம், தேதி மற்றும் இடத்துடன் சரியான சங்கல்பத்தை உருவாக்கவும்.",
    },
    "griha-pravesh-planner": {
      title: "கிருஹப் பிரவேச திட்டமிடுபவர்",
      description: "உங்கள் கிருஹப் பிரவேசத்திற்கான முழுமையான படிநிலை வழிகாட்டி.",
    },
    "havan-guide": {
      title: "ஹோம வழிகாட்டி",
      description: "சாமகிரி, செயல்முறை மற்றும் பாதுகாப்பு குறிப்புகளுடன் முழுமையான ஹோம வழிகாட்டி.",
    },
    "aarti-thali-guide": {
      title: "ஆரத்தி தாலி வழிகாட்டி",
      description: "ஆரத்தி தாலியில் உள்ள ஒவ்வொரு பொருளும் அதன் குறியீட்டு அர்த்தமும்.",
    },
    "prasad-recipes": {
      title: "பிரசாத சமையல் குறிப்புகள்",
      description: "பாரம்பரிய பிரசாத சமையல் குறிப்புகள் — மோதகம், பஞ்ஜிரி, ஷீரா மற்றும் பல.",
    },
    "digital-jaap-counter": {
      title: "டிஜிட்டல் ஜாப் கவுண்டர்",
      description:
        "108 மணிகள் கொண்ட மாலா முன்னேற்றம் மற்றும் வாழ்நாள் எண்ணிக்கையுடன், கவனம் சிதறாத ஜாப் கவுண்டர்.",
    },
    "om-counter": {
      title: "ஓம் கவுண்டர்",
      description:
        "ஒருமுகப்படுத்தப்பட்ட ஓம் கவுண்டர் — மாலா முன்னேற்றம் மற்றும் மென்மையான ஒலி மணியுடன் ॐ ஜபம் செய்யுங்கள்.",
    },
    "mala-counter": {
      title: "மாலா கவுண்டர்",
      description:
        "ஒரு அமைதியான மாலா கவுண்டர் — மணிகள், மாலாக்கள் மற்றும் வாழ்நாள் எண்ணிக்கையை கண்காணிக்கவும்.",
    },
    "mantra-timer": {
      title: "மந்திர டைமர்",
      description:
        "மென்மையான நிறைவு ஒலி மணியுடன், நேரம் நிர்ணயிக்கப்பட்ட மந்திர அமர்வுகளுக்கான ஒரு மென்மையான டைமர்.",
    },
    "stotra-collection": {
      title: "ஸ்தோத்திரத் தொகுப்பு",
      description:
        "பாரம்பரிய ஸ்தோத்திரங்கள் — சிவ தாண்டவம், லிங்காஷ்டகம், மகாமிருத்யுஞ்சய மற்றும் பல.",
    },
    "daily-quote": {
      title: "தினசரி மேற்கோள்",
      description:
        "தினமும் கையால் தேர்ந்தெடுக்கப்பட்ட சனாதன மேற்கோள் — கீதை, உபநிடதங்கள் மற்றும் பல.",
    },
    "daily-shlok": {
      title: "தினசரி ஸ்லோகம்",
      description: "தேவநாகரி எழுத்தில் ஒலிபெயர்ப்பு மற்றும் அர்த்தத்துடன் ஒரு தினசரி ஸ்லோகம்.",
    },
    "mantra-library": {
      title: "மந்திர நூலகம்",
      description: "தேவநாகரி, IAST மற்றும் அர்த்தத்துடன் 30+ மந்திரங்களின் தொகுக்கப்பட்ட நூலகம்.",
    },
    "beej-mantras": {
      title: "பீஜ் மந்திரங்கள்",
      description: "ஒவ்வொரு பீஜ் மந்திரமும் தெய்வம், பொருள் மற்றும் உச்சரிப்பு வழிகாட்டியுடன்.",
    },
    "deity-mantras": {
      title: "தெய்வ மந்திரங்கள்",
      description:
        "தெய்வத்தால் வகைப்படுத்தப்பட்ட மந்திரங்கள் — சிவன், விஷ்ணு, தேவி, கணேசர் மற்றும் பல.",
    },
    "mantra-of-the-day": {
      title: "தினசரி மந்திரம்",
      description: "ஒவ்வொரு நாளும் சுழலும் ஒரு பாரம்பரிய Mantra — Devanagari, IAST, பொருள்.",
    },
    "gayatri-mantra": {
      title: "Gayatri Mantra வழிகாட்டி",
      description: "Gayatriயின் வார்த்தைக்கு வார்த்தை பொருள், ஜபிக்கும் விதிகள் மற்றும் பலன்கள்.",
    },
    "mahamrityunjaya-mantra": {
      title: "Mahamrityunjaya வழிகாட்டி",
      description: "ருத்ரரின் குணப்படுத்தும் Mantra — பொருள், பலன்கள் மற்றும் ஜப விதிகள்.",
    },
    "ai-dharma-assistant": {
      title: "AI Dharma உதவியாளர்",
      description:
        "Sanatan Dharma பற்றி எதையும் கேளுங்கள் மற்றும் சிந்தனைமிக்க, மேற்கோள் காட்டப்பட்ட பதிலைப் பெறுங்கள்.",
      intro:
        "Sanatan Dharma பற்றி எதையும் — வேதம், சடங்கு, தத்துவம் — கேளுங்கள் மற்றும் சிந்தனைமிக்க, மேற்கோள் காட்டப்பட்ட பதிலைப் பெறுங்கள்.",
    },
    "ai-gita-summary": {
      title: "AI Gita சுருக்கம்",
      description:
        "எந்தவொரு Bhagavad Gita அத்தியாயத்தின் உடனடி, நம்பகமான சுருக்கம் முக்கிய வசனங்களுடன்.",
    },
    "ai-shlok-explainer": {
      title: "AI Shlok விளக்கமளிப்பவர்",
      description:
        "எந்த Shlokaஐயும் ஒட்டவும் — Devanagari, IAST, வார்த்தைக்கு வார்த்தை பொருள் மற்றும் வர்ணனை கிடைக்கும்.",
    },
    "ai-festival-guide": {
      title: "AI பண்டிகை வழிகாட்டி",
      description: "எந்த பண்டிகையும், விளக்கப்பட்டது — கதை, Tithi, Vidhi, Samagri மற்றும் Mantras.",
    },
    "ai-puja-planner": {
      title: "AI Puja திட்டமிடுபவர்",
      description:
        "உங்கள் சந்தர்ப்பத்தை விவரிக்கவும் — AI ஒரு முழு Pujaவை Sankalp, Vidhi மற்றும் Mantras உடன் திட்டமிடுகிறது.",
    },
    "ai-mantra-meaning": {
      title: "AI Mantra பொருள்",
      description:
        "எந்த Mantram, குறியீடு நீக்கப்பட்டது — Devanagari, IAST, வார்த்தைக்கு வார்த்தை பொருள், பலன்கள்.",
    },
    "ai-sanskrit-helper": {
      title: "AI சமஸ்கிருத உதவியாளர்",
      description:
        "சமஸ்கிருதத்தை மொழிபெயர்க்கவும், இலக்கணத்தை புரிந்து கொள்ளவும், உச்சரிக்கவும் — ஒவ்வொரு முறையும் Devanagari மற்றும் IAST.",
    },
    "mantra-recommender": {
      title: "AI Mantra பரிந்துரையாளர்",
      description:
        "நோக்கம், தெய்வம் மற்றும் நாளின் நேரத்தின் அடிப்படையில் AI-சக்தி வாய்ந்த Mantra பரிந்துரைகள்.",
      intro:
        "உங்கள் நோக்கத்தை விவரிக்கவும் — AI பொருள், பலன் மற்றும் ஜப எண்ணிக்கை கொண்ட மூன்று பாரம்பரிய Mantrasகளை பரிந்துரைக்கிறது.",
    },
    "baby-name-ai": {
      title: "AI குழந்தை பெயர் பரிந்துரையாளர்",
      description:
        "Nakshatra, அசை, பொருள் மற்றும் பாலினத்தின் அடிப்படையில் AI குழந்தை பெயர் பரிந்துரைகள்.",
      intro:
        "Nakshatra, அசை, பொருள் மற்றும் பாலினத்தின் அடிப்படையில் AI-உருவாக்கப்பட்ட சமஸ்கிருத பெயர் பரிந்துரைகள்.",
    },
    "temple-finder": {
      title: "கோவில் கண்டுபிடிப்பான்",
      description: "20+ முக்கிய கோவில்களை ஒரே தட்டலில் திசைகளுடன் தேடுங்கள்.",
    },
    "temple-directory": {
      title: "கோவில் அடைவு",
      description: "இந்தியா முழுவதும் உள்ள 25+ முக்கிய கோவில்களின் தேடக்கூடிய அடைவு.",
    },
    "darshan-timings": {
      title: "தரிசன நேரம்",
      description: "முக்கிய கோவில்களுக்கான தரிசன நேரம் மற்றும் ஆரத்தி அட்டவணைகள்.",
    },
    "char-dham-planner": {
      title: "சார் தம் யாத்திரை திட்டமிடுபவர்",
      description:
        "உங்கள் சார் தம் யாத்திரையைத் திட்டமிடுங்கள் — வழித்தடங்கள், சிறந்த மாதங்கள் மற்றும் இடைநிறுத்தங்கள்.",
    },
    "jyotirlinga-guide": {
      title: "ஜோதிர்லிங்க வழிகாட்டி",
      description: "12 ஜோதிர்லிங்கங்களுக்கான முழுமையான வழிகாட்டி — வரலாறு, நேரம் மற்றும் பயணம்.",
    },
    "shakti-peeth-guide": {
      title: "சக்தி பீட வழிகாட்டி",
      description: "அடிக்கடி பார்வையிடப்படும் சக்தி பீடங்கள் — கதைகள் மற்றும் எப்படி அடைவது.",
    },
    "nearby-temples": {
      title: "அருகிலுள்ள கோவில்கள்",
      description:
        "உங்கள் சேமிக்கப்பட்ட இருப்பிடத்திற்கு மிக அருகில் உள்ள கோவில்களை தூரம் மற்றும் விவரங்களுடன் கண்டறியவும்.",
    },
    "kundli-generator": {
      title: "குண்டலி ஜெனரேட்டர்",
      description: "இலவச வேத குண்டலி ராசி, நட்சத்திரம், திதி மற்றும் யோகத்துடன்.",
      intro:
        "பிறந்த தேதி மற்றும் நேரத்தின் அடிப்படையில் ராசி, நட்சத்திரம், திதி, யோகம் மற்றும் பெயரிடும் எழுத்துக்களைக் கொண்ட ஒரு விரைவான வேத ஸ்னாப்ஷாட்.",
    },
    "rashi-calculator": {
      title: "ராசி கால்குலேட்டர்",
      description:
        "பிறந்த தேதி மற்றும் நேரத்திலிருந்தும் உங்கள் சந்திர ராசியைக் (ராசி) கண்டறியவும்.",
    },
    "nakshatra-finder": {
      title: "நட்சத்திரம் கண்டுபிடிப்பான்",
      description:
        "உங்கள் ஜென்ம நட்சத்திரம், பாதம் மற்றும் அதன் ஆட்சி செய்யும் தெய்வத்தைக் கண்டறியவும்.",
    },
    "dasha-calculator": {
      title: "விம்சோத்தரி தசா",
      description: "உங்கள் ஜென்ம நட்சத்திரத்திலிருந்து கணக்கிடப்பட்ட விம்சோத்தரி மகா தசா காலவரிசை.",
      intro:
        "உங்கள் ஜென்ம நட்சத்திரத்திலிருந்து கணக்கிடப்பட்ட உங்கள் விம்சோத்தரி மகா தசா காலவரிசை.",
    },
    "gemstone-recommender": {
      title: "ரத்தினக்கல் பரிந்துரையாளர்",
      description: "உங்கள் ராசியின் அடிப்படையில் தனிப்பயனாக்கப்பட்ட ரத்தினக்கல் பரிந்துரை.",
    },
    numerology: {
      title: "எண் கணிதம்",
      description: "வாழ்க்கைப் பாதை மற்றும் விதியின் எண்கள் அவற்றின் அர்த்தத்துடன்.",
    },
    "name-numerology": {
      title: "பெயர் எண் கணிதம்",
      description: "எந்தப் பெயரின் எண் கணித மதிப்பும், அதன் அர்த்தம் மற்றும் கிரக அதிர்வுடன்.",
    },
    "birthstone-finder": {
      title: "பிறப்புக் கல் கண்டுபிடிப்பான்",
      description: "எந்த மாதத்திற்கும் பாரம்பரிய மேற்கத்திய பிறப்புக் கல்.",
    },
    "sanskrit-dictionary": {
      title: "சமஸ்கிருத அகராதி",
      description: "60+ முக்கிய சமஸ்கிருத வார்த்தைகளின் அர்த்தம் மற்றும் மூலத்துடன் தேடுங்கள்.",
    },
    transliteration: {
      title: "IAST → தேவனாகரி",
      description: "IAST அல்லது ஒலிப்பு ஆங்கிலத்தை உடனடியாக தேவனாகரியாக மாற்றவும்.",
      intro:
        "IAST அல்லது ஆங்கில ஒலிப்பை தட்டச்சு செய்யவும்; உடனடியாக தேவனாகரியைப் பெறவும். உதாரணமாக: 'om namah shivaya'.",
    },
    "sandhi-splitter": {
      title: "சந்தி பிரிப்பான்",
      description: "பொதுவான கூட்டுச் சொற்களுக்கான விதி அடிப்படையிலான சந்தி பிரிப்பான்.",
    },
    "shloka-analyzer": {
      title: "சுலோகம் ஆய்வாளர்",
      description:
        "எந்த சுலோகத்தின் எழுத்துக்கள், பாதங்கள் மற்றும் சண்டஸ்களைக் கணக்கிட்டு அறியலாம்.",
    },
    "devanagari-typing": {
      title: "தேவனாகரி தட்டச்சு",
      description: "திரை விசைப்பலகையுடன் தேவனாகரியில் தட்டச்சு செய்யவும்.",
    },
    "verb-conjugator": {
      title: "வினைச்சொல் இணைப்பான்",
      description: "பொதுவான சமஸ்கிருத தாதுக்களை நிகழ்காலத்தில் (lat lakara) இணைக்கலாம்.",
    },
    "sanskrit-word-of-day": {
      title: "தினசரி சமஸ்கிருதச் சொல்",
      description: "ஒவ்வொரு நாளும் புதிய சமஸ்கிருதச் சொல், அதன் அர்த்தம் மற்றும் மூலத்துடன்.",
    },
    "names-by-nakshatra": {
      title: "நட்சத்திரத்தின் அடிப்படையிலான பெயர்கள்",
      description: "உங்கள் குழந்தையின் ஜன்ம நக்ஷத்ர பாத சிலபில்களுக்கு ஏற்ற குழந்தை பெயர்கள்.",
    },
    "names-by-rashi": {
      title: "ராசியின் அடிப்படையிலான பெயர்கள்",
      description:
        "சந்திர ராசியின் சிலபில்கள் மூலம் குழந்தை பெயர்கள் — அழகான மற்றும் அர்த்தமுள்ளவை.",
    },
    "names-by-deity": {
      title: "தெய்வத்தின் பெயர்கள்",
      description: "சிவன், விஷ்ணு, தேவி, கணேசன் மற்றும் பலரை அடிப்படையாகக் கொண்ட பெயர்கள்.",
    },
    "names-by-meaning": {
      title: "பொருளின்படி பெயர்கள்",
      description: "ஒளி, வலிமை, ஞானம், அன்பு மற்றும் பல போன்ற பொருளின்படி பெயர்களைக் கண்டறியவும்.",
    },
    "twin-names": {
      title: "இரட்டையர் பெயர்கள்",
      description:
        "சமஸ்கிருத பாரம்பரியத்திலிருந்து எடுக்கப்பட்ட இரட்டையர்களுக்கான அழகிய ஜோடிப் பெயர்கள்.",
    },
    "ai-name-suggester": {
      title: "AI பெயர் பரிந்துரையாளர்",
      description: "நட்சத்திரம், அசை மற்றும் பொருளின்படி AI குழந்தை பெயர் பரிந்துரைகள்.",
    },
    "bhagavad-gita": {
      title: "பகவத் கீதை — அத்தியாயம் படிப்பான்",
      description: "கீதையின் 18 அத்தியாயங்களும் ஒரு சுருக்கம் மற்றும் மைய போதனையுடன்.",
    },
    "upanishads-guide": {
      title: "உபநிடதங்கள் வழிகாட்டி",
      description: "முக்கிய உபநிடதங்கள் அவற்றின் கருப்பொருள்கள் மற்றும் முக்கிய போதனைகளுடன்.",
    },
    "vedas-introduction": {
      title: "வேதங்களுக்கு ஒரு அறிமுகம்",
      description: "நான்கு வேதங்களுக்கு ஒரு எளிமையான அறிமுகம்.",
    },
    "yoga-sutras": {
      title: "யோக சூத்திரங்களின் கண்ணோட்டம்",
      description: "பதஞ்சலியின் யோக சூத்திரங்களின் நான்கு பாதங்கள் முக்கிய செய்யுள்களுடன்.",
    },
    "sanatan-timeline": {
      title: "சனாதன காலவரிசை",
      description: "வேத காலம் முதல் இன்றுவரை சனாதன Dharmaத்தின் ஒரு காட்சி காலவரிசை.",
    },
    "deity-encyclopedia": {
      title: "தெய்வ கலைக்களஞ்சியம்",
      description: "22+ தெய்வங்கள் அவற்றின் iconography, mantras மற்றும் கதைகளுடன்.",
    },
    "mahabharata-summary": {
      title: "மகாபாரதச் சுருக்கம்",
      description:
        "மகாபாரதத்தின் அனைத்து 18 பர்வங்களும் அவற்றின் கருப்பொருள்கள் மற்றும் கதைக்களத்துடன்.",
    },
    "ramayana-summary": {
      title: "ராமாயணச் சுருக்கம்",
      description: "வால்மீகி ராமாயணத்தின் ஏழு காண்டங்கள் ஒரே பக்கத்தில்.",
    },
    "puranas-overview": {
      title: "18 மகா புராணங்கள்",
      description:
        "18 மகா புராணங்களின் முழுமையான பட்டியல் — தெய்வம், கருப்பொருள் மற்றும் ஸ்லோக எண்ணிக்கையுடன்.",
    },
    "deity-of-the-day": {
      title: "நாளைய தெய்வம்",
      description:
        "ஒவ்வொரு நாளும் சுழற்சி முறையில் ஒரு தெய்வம் — மந்திரம் மற்றும் முக்கியத்துவத்துடன்.",
    },
    "nakshatra-guide": {
      title: "27 நட்சத்திரங்களுக்கான வழிகாட்டி",
      description: "அனைத்து 27 நட்சத்திரங்களும் அதிபதி, தெய்வம், சின்னம் மற்றும் இயல்புடன்.",
    },
    "rashi-guide": {
      title: "12 ராசிகளுக்கான வழிகாட்டி",
      description: "அனைத்து 12 ராசிகளும் அதிபதி, தனிமம் மற்றும் குணாதிசயங்களுடன்.",
    },
  },

  te: {
    // Telugu — auto-translated
    "todays-panchang": {
      title: "నేటి పంచాంగ్",
      description:
        "నేటి పూర్తి పంచాంగ్ — తిథి, నక్షత్రం, యోగం, కరణం, సూర్యోదయం, సూర్యాస్తమయం, మరియు అశుభ సమయాలు.",
      intro: "మీ పూర్తి దృక్-ఖచ్చితమైన పంచాంగ్ — మీ నగరం కోసం ప్రత్యక్షంగా లెక్కించబడింది.",
    },
    "todays-tithi": {
      title: "నేటి తిథి",
      description:
        "ఏదైనా తేదీకి మరియు నగరానికి ఖచ్చితమైన తిథి — పక్ష మరియు ఖచ్చితమైన ముగింపు సమయంతో.",
    },
    "todays-nakshatra": {
      title: "నేటి నక్షత్రం",
      description: "నేటి నక్షత్రం పాదం, పాలక గ్రహం, దేవత మరియు ముగింపు సమయంతో.",
    },
    "todays-yoga": {
      title: "నేటి యోగం",
      description: "నేటి యోగం (27 లో ఒకటి) పురోగతి మరియు ముగింపు సమయంతో.",
    },
    "todays-karana": {
      title: "నేటి కరణం",
      description: "నేటి కరణం రకం (చర / స్థిర) మరియు ఖచ్చితమైన ముగింపు సమయంతో.",
    },
    "todays-sunrise": {
      title: "నేటి సూర్యోదయం",
      description:
        "ఏదైనా నగరానికి ఖచ్చితమైన సూర్యోదయం — సూర్యాస్తమయం, సౌర మధ్యాహ్నం మరియు పగటి నిడివితో.",
    },
    "todays-sunset": {
      title: "నేటి సూర్యాస్తమయం",
      description:
        "ఏదైనా నగరానికి ఖచ్చితమైన సూర్యాస్తమయం — సూర్యోదయం, సౌర మధ్యాహ్నం మరియు పగటి నిడివితో.",
    },
    "rahu-kaal": {
      title: "రాహు కాలం",
      description: "నేటి రాహు కాలం — స్థాన-అవగాహనతో మరియు నిమిషానికి.",
    },
    "gulika-kaal": {
      title: "గుళికా కాలం",
      description: "నిజమైన సూర్యోదయం / సూర్యాస్తమయంతో నేటి గుళికా కాలం.",
    },
    yamaganda: { title: "యమగండం", description: "నేటి యమగండం — రోజులోని ఎనిమిది భాగాలలో ఒకటి." },
    choghadiya: {
      title: "చోఘడియా",
      description: "అశుభ మరియు అశుభ సమయాలతో పగలు మరియు రాత్రి చోఘడియా.",
    },
    "panchang-by-date": {
      title: "తేదీ వారీగా పంచాంగ్",
      description: "ఏదైనా తేదీకి మరియు భూమిపై ఉన్న ఏదైనా నగరానికి సంపూర్ణ పంచాంగాన్ని చూడండి.",
    },
    "hora-chart": {
      title: "హోరా చార్ట్",
      description: "ఏదైనా కార్యకలాపానికి సరైన సమయాన్ని ఎంచుకోవడానికి గ్రహ హోరా చార్ట్.",
      intro:
        "పగలు మరియు రాత్రి యొక్క 24 గ్రహ హోరా‌లు — పనులు ప్రారంభించడానికి సరైన సమయాన్ని ఎంచుకోవడానికి ఉత్తమం.",
    },
    "sunrise-sunset-atlas": {
      title: "సూర్యోదయం & సూర్యాస్తమయం అట్లాస్",
      description:
        "ప్రపంచవ్యాప్తంగా ఉన్న నగరాల్లో సూర్యోదయం మరియు సూర్యాస్తమయ సమయాలను సరిపోల్చండి.",
    },
    "moon-phase": {
      title: "చంద్రుని దశ",
      description: "ఏ తేదీకైనా ప్రస్తుత చంద్రుని దశ, ప్రకాశం మరియు దశ కోణం.",
      intro:
        "ప్రస్తుత చంద్రుని దశ, ప్రకాశం మరియు దశ కోణం — ఏదైనా తేదీ కోసం ప్రత్యక్షంగా లెక్కించబడుతుంది.",
    },
    "abhijit-muhurat": {
      title: "అభిజిత్ ముహూర్తం",
      description: "నేటి అభిజిత్ ముహూర్త కాలం — అత్యంత శుభప్రదమైన 48 నిమిషాలు.",
      intro:
        "అభిజిత్ 15 పగటి ముహూర్తాలలో 8వది — సౌర మధ్యాహ్నం చుట్టూ కేంద్రీకృతమైన 48 నిమిషాలు. ఇది రోజులో అత్యంత శుభప్రదమైన సమయం (బుధవారాలు తప్ప).",
    },
    "brahma-muhurat": {
      title: "బ్రహ్మ ముహూర్తం",
      description: "తెల్లవారుజామున బ్రహ్మ ముహూర్త కాలం — ధ్యానానికి అనువైనది.",
      intro:
        "సూర్యోదయానికి ముందు రెండు ముహూర్తాలు — సత్వగుణం అధికంగా ఉండే ఈ కాలంలో మనస్సు సాధన కోసం అత్యంత ఆమోదయోగ్యంగా ఉంటుంది.",
    },
    "festival-calendar-2026": {
      title: "పండుగల క్యాలెండర్ 2026",
      description:
        "2026 సంవత్సరానికి సంబంధించిన ప్రతి సనాతన పండుగ, నెలవారీగా, ప్రాంతీయ మరియు వర్గ ఫిల్టర్‌లతో.",
    },
    "festival-countdown": {
      title: "పండుగల కౌంట్‌డౌన్",
      description: "2026లో ఏదైనా పండుగకు ప్రత్యక్ష కౌంట్‌డౌన్ — సెకనుల వరకు.",
    },
    "festival-finder": {
      title: "పండుగలను కనుగొనండి",
      description: "పండుగలను పేరు, దేవత లేదా నెల వారీగా శోధించండి — ప్రణాళిక చేసుకోవడానికి ఉత్తమం.",
    },
    "vrat-calendar": {
      title: "వ్రత క్యాలెండర్",
      description: "ప్రతి ప్రధాన వ్రతం ఉపవాస నియమాలు, సమయాలు మరియు మంత్రాలతో.",
    },
    "ekadashi-dates": {
      title: "ఏకాదశి తేదీలు",
      description: "2026లోని ప్రతి ఏకాదశి వివరణ మరియు వ్రత విధి తో.",
      intro: "2026లోని మొత్తం 24 ఏకాదశులు వివరణ మరియు వ్రత విధి తో.",
    },
    "purnima-amavasya": {
      title: "పౌర్ణమి & అమావాస్య",
      description: "అన్ని పౌర్ణమి మరియు అమావాస్య తేదీలు ప్రాంతీయ ప్రాముఖ్యతతో.",
    },
    "regional-festivals": {
      title: "ప్రాంతీయ పండుగలు",
      description: "ప్రతి రాష్ట్రం మరియు సముదాయానికి ప్రత్యేకమైన పండుగలను కనుగొనండి.",
    },
    "pradosh-vrat": {
      title: "ప్రదోష వ్రతపు తేదీలు",
      description:
        "ప్రదోష వ్రతం యొక్క ప్రతీ తేదీ, అది వచ్చే వారం రోజుతో పాటు (సోమ, భౌమ, శని) ఇవ్వబడింది.",
    },
    "sankashti-chaturthi": {
      title: "సంకష్ట చతుర్థి",
      description: "ప్రతీ నెల సంకష్ట చతుర్థి తేదీలు - గణేశుని అనుగ్రహ దినం.",
    },
    "festival-of-the-day": {
      title: "నేటి పండుగ",
      description: "నేటి లేదా తదుపరి సనాతన పండుగ - ఒక్క చూపులో కార్డు.",
    },
    "upcoming-festivals": {
      title: "రాబోయే పండుగలు",
      description: "తదుపరి 12 పండుగలు - రాబోయే వారాలను ప్లాన్ చేసుకోండి.",
    },
    "puja-checklist-generator": {
      title: "పూజా తనిఖీ జాబితా జనరేటర్",
      description: "6 ప్రధాన పూజల కోసం ఇంటరాక్టివ్ సామాగ్రి, విధి మరియు మంత్రాల తనిఖీ జాబితా.",
    },
    "aarti-collection": {
      title: "ఆరతి సేకరణ",
      description: "ఎంపిక చేసుకున్న, అత్యంత ప్రియమైన ఆరతుల సేకరణ, అందంగా టైప్‌సెట్ చేయబడింది.",
    },
    "chalisa-collection": {
      title: "చాలీసా సేకరణ",
      description: "హనుమాన్, దుర్గ, శివ, గణేష్ మరియు సరస్వతి చాలీసాలు దేవనాగరిలో.",
    },
    "puja-vidhi-planner": {
      title: "పూజా విధి ప్లానర్",
      description: "ఏ పూజకైనా దశల వారీ ప్లానర్ - సంకల్పం, మంత్రాలు, ఆరతి మరియు సమయ బడ్జెట్.",
    },
    "samagri-checklist": {
      title: "సామాగ్రి తనిఖీ జాబితా",
      description: "ఎనిమిది ప్రధాన పూజల కోసం పరిమాణాలతో కూడిన సామాగ్రి జాబితాలు.",
    },
    "sankalp-generator": {
      title: "సంకల్ప జనరేటర్",
      description: "మీ పేరు, గోత్రం, తేదీ మరియు స్థలంతో సరైన సంకల్పాన్ని రూపొందించండి.",
    },
    "griha-pravesh-planner": {
      title: "గృహ ప్రవేశ ప్లానర్",
      description: "మీ గృహ ప్రవేశానికి పూర్తి దశల వారీ మార్గదర్శి.",
    },
    "havan-guide": {
      title: "హవన్ గైడ్",
      description: "సామాగ్రి, విధానం మరియు భద్రతా చిట్కాలతో పూర్తి హవన్ గైడ్.",
    },
    "aarti-thali-guide": {
      title: "ఆరతి థాలి గైడ్",
      description: "ఆరతి థాలిలోని ప్రతి వస్తువు మరియు దాని ప్రతీకాత్మక అర్థం.",
    },
    "prasad-recipes": {
      title: "ప్రసాదం వంటకాలు",
      description: "సాంప్రదాయ ప్రసాదం వంటకాలు — మోదక్, పంజిరి, షీరా ఇంకా ఎన్నో.",
    },
    "digital-jaap-counter": {
      title: "డిజిటల్ జాప్ కౌంటర్",
      description: "108 పూసల మాల పురోగతి మరియు జీవితకాల గణనతో ఏకాగ్రతను భంగం చేయని జాప్ కౌంటర్.",
    },
    "om-counter": {
      title: "ఓం కౌంటర్",
      description:
        "ఏకాగ్రతతో కూడిన ఓం కౌంటర్ — మాల పురోగతి మరియు సున్నితమైన చిమ్ సౌండ్‌తో ॐ జపించండి.",
    },
    "mala-counter": {
      title: "మాల కౌంటర్",
      description: "నిశ్శబ్ద మాల కౌంటర్ — పూసలు, మాలలు మరియు జీవితకాల గణనను ట్రాక్ చేయండి.",
    },
    "mantra-timer": {
      title: "మంత్ర టైమర్",
      description:
        "సమయం నిర్ణీత మంత్ర సెషన్‌ల కోసం సున్నితమైన టైమర్, పూర్తి చేయడానికి మృదువైన చిమ్ సౌండ్‌తో.",
    },
    "stotra-collection": {
      title: "స్తోత్ర సేకరణ",
      description: "శాస్త్రీయ స్తోత్రాలు — శివ తాండవ్, లింగాష్టకం, మహామృత్యుంజయ మరియు మరిన్ని.",
    },
    "daily-quote": {
      title: "రోజువారీ కొటేషన్",
      description:
        "ప్రతిరోజూ చేతితో ఎంపిక చేయబడిన ఒక సనాతన కొటేషన్ — గీత, ఉపనిషత్తులు మరియు మరిన్ని.",
    },
    "daily-shlok": {
      title: "రోజువారీ శ్లోకం",
      description: "ప్రతిరోజూ దేవనాగరి లిపిలో శ్లోకం, దాని ట్రాన్స్లిటరేషన్ మరియు అర్థంతో.",
    },
    "mantra-library": {
      title: "మంత్ర లైబ్రరీ",
      description: "దేవనాగరి, IAST మరియు అర్థంతో 30+ మంత్రాలతో కూడిన క్యూరేటెడ్ లైబ్రరీ.",
    },
    "beej-mantras": {
      title: "బీజ మంత్రాలు",
      description: "ప్రతి బీజ మంత్రం దేవత, అర్థం మరియు ఉచ్చారణ మార్గదర్శకంతో.",
    },
    "deity-mantras": {
      title: "దేవతా మంత్రాలు",
      description: "దేవతల వారీగా మంత్రాలు — శివ, విష్ణు, దేవి, గణేశ మరియు మరిన్ని.",
    },
    "mantra-of-the-day": {
      title: "రోజువారీ మంత్రం",
      description: "ప్రతిరోజు ఒక సాంప్రదాయ మంత్రం — దేవనాగరి, IAST, అర్థంతో.",
    },
    "gayatri-mantra": {
      title: "గాయత్రీ మంత్రం గైడ్",
      description: "గాయత్రీ మంత్రం యొక్క పదబంధ అర్థం, జపించే నియమాలు మరియు ప్రయోజనాలు.",
    },
    "mahamrityunjaya-mantra": {
      title: "మహామృత్యుంజయ గైడ్",
      description: "రుద్రుని ఆయురారోగ్య ప్రదాత మంత్రం — అర్థం, ప్రయోజనాలు మరియు జప నియమాలు.",
    },
    "ai-dharma-assistant": {
      title: "AI ధర్మ అసిస్టెంట్",
      description:
        "సనాతన ధర్మం గురించి ఏదైనా అడగండి మరియు ఆలోచనాత్మకమైన, ఆధారాలతో కూడిన సమాధానం పొందండి.",
      intro:
        "సనాతన ధర్మం గురించి ఏదైనా అడగండి — గ్రంథాలు, ఆచారాలు, తత్వశాస్త్రం — మరియు ఆలోచనాత్మకమైన, ఆధారాలతో కూడిన సమాధానం పొందండి.",
    },
    "ai-gita-summary": {
      title: "AI గీతా సారాంశం",
      description: "ఏ భగవద్గీత అధ్యాయానికైనా కీలక శ్లోకాలతో తక్షణ, విశ్వసనీయ సంగ్రహం.",
    },
    "ai-shlok-explainer": {
      title: "AI శ్లోక వివరణ",
      description:
        "ఏ శ్లోకాన్నైనా పేస్ట్ చేయండి — దేవనాగరి, IAST, పదబంధ అర్థం మరియు వ్యాఖ్యానం పొందండి.",
    },
    "ai-festival-guide": {
      title: "AI పండుగల గైడ్",
      description: "ఏ పండుగైనా, వివరణాత్మకంగా — కథ, తిథి, విధి, సామాగ్రి మరియు మంత్రాలు.",
    },
    "ai-puja-planner": {
      title: "AI పూజ ప్లానర్",
      description:
        "మీ సందర్భాన్ని వివరించండి — సంకల్పం, విధి మరియు మంత్రాలతో కూడిన పూర్తి పూజను AI ప్లాన్ చేస్తుంది.",
    },
    "ai-mantra-meaning": {
      title: "AI మంత్ర అర్థం",
      description: "ఏ మంత్రమైనా, విశ్లేషణ — దేవనాగరి, IAST, పదబంధ అర్థం, ప్రయోజనాలు.",
    },
    "ai-sanskrit-helper": {
      title: "AI సంస్కృత సహాయకుడు",
      description:
        "సంస్కృతాన్ని అనువదించండి, వ్యాకరణాన్ని విశ్లేషించండి మరియు ఉచ్చరించండి — ప్రతిసారి దేవనాగరి మరియు IASTలో.",
    },
    "mantra-recommender": {
      title: "AI మంత్ర సిఫార్సుదారు",
      description: "ఉద్దేశ్యం, దేవత మరియు దిన సమయం ఆధారంగా AI-శక్తితో పనిచేసే మంత్ర సూచనలు.",
      intro:
        "మీ ఉద్దేశ్యాన్ని వివరించండి — AI అర్థం, ప్రయోజనం మరియు జప సంఖ్యతో మూడు సాంప్రదాయ మంత్రాలను సూచిస్తుంది.",
    },
    "baby-name-ai": {
      title: "AI శిశువు పేరు సూచించేది",
      description: "నక్షత్రం, అక్షరం, అర్థం మరియు లింగం ఆధారంగా AI శిశువు పేరు సూచనలు.",
      intro: "నక్షత్రం, అక్షరం, అర్థం మరియు లింగం ఆధారంగా AI- రూపొందించిన సంస్కృత పేరు సూచనలు.",
    },
    "temple-finder": {
      title: "దేవాలయ శోధన",
      description: "20+ ప్రధాన దేవాలయాలను ఒకేసారి దిశలతో శోధించండి.",
    },
    "temple-directory": {
      title: "దేవాలయ డైరెక్టరీ",
      description: "భారతదేశం అంతటా 25+ ప్రధాన దేవాలయాల శోధించదగిన డైరెక్టరీ.",
    },
    "darshan-timings": {
      title: "దర్శన సమయాలు",
      description: "ప్రధాన దేవాలయాల దర్శన సమయాలు మరియు ఆర్తి షెడ్యూల్స్.",
    },
    "char-dham-planner": {
      title: "చార్ ధామ్ ప్లానర్",
      description:
        "మీ చార్ ధామ్ యాత్రను ప్రణాళిక చేసుకోండి — మార్గాలు, ఉత్తమ నెలలు మరియు ఆగే ప్రదేశాలు.",
    },
    "jyotirlinga-guide": {
      title: "జ్యోతిర్లింగ గైడ్",
      description: "12 జ్యోతిర్లింగాల పూర్తి మార్గదర్శి — చరిత్ర, సమయాలు మరియు ప్రయాణం.",
    },
    "shakti-peeth-guide": {
      title: "శక్తి పీఠ గైడ్",
      description: "అత్యధికంగా సందర్శించే శక్తి పీఠాలు — కథలు మరియు ఎలా చేరుకోవాలి.",
    },
    "nearby-temples": {
      title: "సమీపంలోని దేవాలయాలు",
      description:
        "మీరు సేవ్ చేసిన ప్రదేశానికి దగ్గరగా ఉన్న దేవాలయాలను దూరం మరియు వివరాలతో కనుగొనండి.",
    },
    "kundli-generator": {
      title: "కుండ్లీ జనరేటర్",
      description: "రాశి, నక్షత్రం, తిథి మరియు యోగతో ఉచిత వైదిక కుండ్లీ.",
      intro:
        "పుట్టిన తేది మరియు సమయం నుండి త్వరిత వైదిక స్నాప్‌షాట్ — రాశి, నక్షత్రం, తిథి, యోగం మరియు నామకరణ అక్షరాలు.",
    },
    "rashi-calculator": {
      title: "రాశి కాలిక్యులేటర్",
      description: "పుట్టిన తేది మరియు సమయం నుండి మీ చంద్ర రాశిని (Rashi) కనుగొనండి.",
    },
    "nakshatra-finder": {
      title: "నక్షత్ర ఫైండర్",
      description: "మీ జన్మ నక్షత్రం, పాదం మరియు దాని అధిష్టాన దేవతను కనుగొనండి.",
    },
    "dasha-calculator": {
      title: "వింశోత్తరి దశ",
      description: "మీ జన్మ నక్షత్రం నుండి లెక్కించబడిన వింశోత్తరి మహర్దశ కాలక్రమం.",
      intro: "మీ జన్మ నక్షత్రం నుండి లెక్కించబడిన మీ వింశోత్తరి మహర్దశ కాలక్రమం.",
    },
    "gemstone-recommender": {
      title: "రత్నాల సిఫార్సుదారు",
      description: "మీ రాశి ఆధారంగా వ్యక్తిగతీకరించిన రత్నాల సిఫార్సు.",
    },
    numerology: {
      title: "సంఖ్యాశాస్త్రం",
      description: "మీ జీవిత గమనం, విధి సంఖ్యలు, వాటి అర్థాలు.",
    },
    "name-numerology": {
      title: "పేరు సంఖ్యాశాస్త్రం",
      description: "ఏ పేరుకైనా సంఖ్యాశాస్త్ర విలువ, అర్థం మరియు గ్రహ ప్రభావం.",
    },
    "birthstone-finder": {
      title: "జన్మరత్న శోధన",
      description: "ఏ పుట్టిన నెలకు పారదర్శిత పాశ్చాత్య జన్మరత్నం.",
    },
    "sanskrit-dictionary": {
      title: "సంస్కృత నిఘంటువు",
      description: "60+ ప్రధాన సంస్కృత పదాలు, వాటి అర్థాలు మరియు మూలాలను చూడండి.",
    },
    transliteration: {
      title: "IAST → దేవనాగరి",
      description: "IAST లేదా ఫోనెటిక్ ఇంగ్లీషును తక్షణమే దేవనాగరిలోకి మార్చండి.",
      intro:
        "IAST లేదా ఇంగ్లీష్ ఫోనెటిక్ టైప్ చేయండి; తక్షణ దేవనాగరిని పొందండి. ప్రయత్నించండి: 'om namah shivaya'.",
    },
    "sandhi-splitter": {
      title: "సంధి విడదీసేది",
      description: "సాధారణ సంయుక్త పదాల కోసం నియమ-ఆధారిత సంధి విడదీసేది.",
    },
    "shloka-analyzer": {
      title: "శ్లోక విశ్లేషణ",
      description: "ఏ శ్లోకంలోనైనా అక్షరాలు, పాదాలను లెక్కించండి మరియు ఛందస్సును గుర్తించండి.",
    },
    "devanagari-typing": {
      title: "దేవనాగరి టైపింగ్",
      description: "స్క్రీన్ కీబోర్డ్‌తో దేవనాగరిలో టైప్ చేయండి.",
    },
    "verb-conjugator": {
      title: "క్రియాపద సంయోగి",
      description: "ప్రస్తుత కాలం (లట్ లకారా)లో సాధారణ సంస్కృత ధాతువులను సంయోగం చేయండి.",
    },
    "sanskrit-word-of-day": {
      title: "రోజు సంస్కృత పదం",
      description: "ప్రతిరోజూ ఒక కొత్త సంస్కృత పదం, అర్థం మరియు మూలంతో.",
    },
    "names-by-nakshatra": {
      title: "నక్షత్రానుగుణంగా పేర్లు",
      description: "మీ పిల్లల జన్మ నక్షత్ర పాద అక్షరాలకు అనుగుణంగా శిశువు పేర్లు.",
    },
    "names-by-rashi": {
      title: "రాశి అనుగుణంగా పేర్లు",
      description: "చంద్రరాశి అక్షరాల వారీగా శిశువు పేర్లు — అందమైన మరియు అర్థవంతమైనవి.",
    },
    "names-by-deity": {
      title: "దేవతల పేర్లు",
      description: "శివుడు, విష్ణువు, దేవి, గణేశుడు మరియు ఇతర దేవతల నుండి ప్రేరణ పొందిన పేర్లు.",
    },
    "names-by-meaning": {
      title: "అర్ధం ద్వారా పేర్లు",
      description: "కాంతి, బలం, జ్ఞానం, ప్రేమ మరియు మరిన్నింటి అర్థం ద్వారా పేర్లను కనుగొనండి.",
    },
    "twin-names": {
      title: "జంట పేర్లు",
      description: "సంస్కృత సంప్రదాయం నుండి తీసుకోబడిన కవలల కోసం అందంగా జత చేయబడిన పేర్లు.",
    },
    "ai-name-suggester": {
      title: "AI పేరు సూచిక",
      description: "నక్షత్రం, అక్షరం మరియు అర్థం ప్రకారం AI శిశువు పేరు సూచనలు.",
    },
    "bhagavad-gita": {
      title: "భగవద్గీత — అధ్యాయ పఠనం",
      description: "సారాంశం మరియు ప్రధాన బోధనతో గీతలోని మొత్తం 18 అధ్యాయాలు.",
    },
    "upanishads-guide": {
      title: "ఉపనిషత్తుల మార్గదర్శి",
      description: "ప్రధాన ఉపనిషత్తులు వాటి నేపథ్యం మరియు ముఖ్య బోధనలతో.",
    },
    "vedas-introduction": { title: "వేదాల పరిచయం", description: "నాలుగు వేదాలకు సులభమైన పరిచయం." },
    "yoga-sutras": {
      title: "యోగ సూత్రాల అవలోకనం",
      description: "పతంజలి యోగ సూత్రాలలోని నాలుగు పాదాలు ముఖ్యమైన శ్లోకాలతో.",
    },
    "sanatan-timeline": {
      title: "సనాతన కాలక్రమం",
      description: "వేద కాలం నుండి నేటి వరకు సనాతన Dharma యొక్క దృశ్య కాలక్రమం.",
    },
    "deity-encyclopedia": {
      title: "దేవతా విజ్ఞాన సర్వస్వం",
      description: "22+ దేవతలు వారి ఐకానోగ్రఫీ, మంత్రాలు మరియు పురాణాలతో.",
    },
    "mahabharata-summary": {
      title: "మహాభారత సారాంశం",
      description: "మహాభారతంలోని 18 పర్వాలు వాటి నేపథ్యాలు మరియు కథాంశంతో.",
    },
    "ramayana-summary": {
      title: "రామాయణ సారాంశం",
      description: "వాల్మీకి రామాయణంలోని ఏడు కాండలు ఒకే పేజీలో.",
    },
    "puranas-overview": {
      title: "18 మహపురాణాలు",
      description: "18 మహపురాణాల పూర్తి జాబితా — దేవత, థీమ్ మరియు శ్లోకాల సంఖ్య.",
    },
    "deity-of-the-day": {
      title: "రోజువారీ దేవత",
      description: "ప్రతిరోజూ ఒక దేవత — మంత్రం మరియు ప్రాముఖ్యతతో.",
    },
    "nakshatra-guide": {
      title: "27 నక్షత్రాల గైడ్",
      description: "అన్ని 27 నక్షత్రాలు వాటి అధిపతి, దేవత, చిహ్నం మరియు స్వభావంతో.",
    },
    "rashi-guide": {
      title: "12 రాశుల గైడ్",
      description: "అన్ని 12 రాశులు వాటి అధిపతి, మూలకం మరియు లక్షణాలతో.",
    },
  },

  kn: {
    // Kannada — auto-translated
    "todays-panchang": {
      title: "ಇಂದಿನ ಪಂಚಾಂಗ",
      description:
        "ಇಂದಿನ ಸಂಪೂರ್ಣ ಪಂಚಾಂಗ — ತಿಥಿ, ನಕ್ಷತ್ರ, ಯೋಗ, ಕರಣ, ಸೂರ್ಯೋದಯ, ಸೂರ್ಯಾಸ್ತ ಮತ್ತು ಅಶುಭ ಕಾಲಗಳು.",
      intro: "ನಿಮ್ಮ ನಗರಕ್ಕೆ ಲೈವ್ ಆಗಿ ಲೆಕ್ಕಹಾಕಿದ ನಿಮ್ಮ ಸಂಪೂರ್ಣ ದೃಕ್-ನಿಖರವಾದ ಪಂಚಾಂಗ.",
    },
    "todays-tithi": {
      title: "ಇಂದಿನ ತಿಥಿ",
      description:
        "ಯಾವುದೇ ದಿನಾಂಕ ಮತ್ತು ನಗರಕ್ಕೆ ನಿಖರವಾದ ತಿಥಿ — ಪಕ್ಷ ಮತ್ತು ನಿಖರವಾದ ಅಂತಿಮ ಸಮಯದೊಂದಿಗೆ.",
    },
    "todays-nakshatra": {
      title: "ಇಂದಿನ ನಕ್ಷತ್ರ",
      description: "ಇಂದಿನ ನಕ್ಷತ್ರ ಪಾದ, ಆಡಳಿತ ಗ್ರಹ, ದೇವತೆ ಮತ್ತು ಅಂತಿಮ ಸಮಯದೊಂದಿಗೆ.",
    },
    "todays-yoga": {
      title: "ಇಂದಿನ ಯೋಗ",
      description: "ಇಂದಿನ ಯೋಗ (27 ರಲ್ಲಿ ಒಂದು) ಪ್ರಗತಿ ಮತ್ತು ಅಂತಿಮ ಸಮಯದೊಂದಿಗೆ.",
    },
    "todays-karana": {
      title: "ಇಂದಿನ ಕರಣ",
      description: "ಇಂದಿನ ಕರಣ ಪ್ರಕಾರದೊಂದಿಗೆ (ಚಲನಶೀಲ / ಸ್ಥಿರ) ಮತ್ತು ನಿಖರವಾದ ಅಂತಿಮ ಸಮಯದೊಂದಿಗೆ.",
    },
    "todays-sunrise": {
      title: "ಇಂದಿನ ಸೂರ್ಯೋದಯ",
      description:
        "ಯಾವುದೇ ನಗರಕ್ಕೆ ನಿಖರವಾದ ಸೂರ್ಯೋದಯ — ಸೂರ್ಯಾಸ್ತ, ಸೌರ ಮಧ್ಯಾಹ್ನ ಮತ್ತು ದಿನದ ಅವಧಿಯೊಂದಿಗೆ.",
    },
    "todays-sunset": {
      title: "ಇಂದಿನ ಸೂರ್ಯಾಸ್ತ",
      description:
        "ಯಾವುದೇ ನಗರಕ್ಕೆ ನಿಖರವಾದ ಸೂರ್ಯಾಸ್ತ — ಸೂರ್ಯೋದಯ, ಸೌರ ಮಧ್ಯಾಹ್ನ ಮತ್ತು ದಿನದ ಅವಧಿಯೊಂದಿಗೆ.",
    },
    "rahu-kaal": {
      title: "ರಾಹು ಕಾಲ",
      description: "ಇಂದಿನ ರಾಹು ಕಾಲದ ಅವಧಿ — ಸ್ಥಳ-ಅರಿವು ಮತ್ತು ನಿಮಿಷಕ್ಕೆ ನಿಖರವಾಗಿದೆ.",
    },
    "gulika-kaal": {
      title: "ಗುಳಿಕ ಕಾಲ",
      description: "ನಿಜವಾದ ಸೂರ್ಯೋದಯ / ಸೂರ್ಯಾಸ್ತದೊಂದಿಗೆ ಇಂದಿನ ಗುಳಿಕ ಕಾಲದ ಅವಧಿ.",
    },
    yamaganda: { title: "ಯಮಗಂಡ", description: "ಇಂದಿನ ಯಮಗಂಡದ ಅವಧಿ — ದಿನದ ಎಂಟು ಭಾಗಗಳಲ್ಲಿ ಒಂದು." },
    choghadiya: {
      title: "ಚೋಘಡಿಯಾ",
      description: "ಶುಭ ಮತ್ತು ಅಶುಭ ಅವಧಿಗಳೊಂದಿಗೆ ಹಗಲು ಮತ್ತು ರಾತ್ರಿ ಚೋಘಡಿಯಾ.",
    },
    "panchang-by-date": {
      title: "ದಿನಾಂಕದ ಮೂಲಕ ಪಂಚಾಂಗ",
      description: "ಯಾವುದೇ ದಿನಾಂಕ ಮತ್ತು ಭೂಮಿಯ ಮೇಲಿನ ಯಾವುದೇ ನಗರದ ಸಂಪೂರ್ಣ ಪಂಚಾಂಗವನ್ನು ಹುಡುಕಿ.",
    },
    "hora-chart": {
      title: "ಹೋರಾ ಚಾರ್ಟ್",
      description: "ಯಾವುದೇ ಚಟುವಟಿಕೆಗೆ ಸರಿಯಾದ ಸಮಯವನ್ನು ಆಯ್ಕೆ ಮಾಡಲು ಗ್ರಹಗಳ ಹೋರಾ ಚಾರ್ಟ್.",
      intro:
        "ಹಗಲು ಮತ್ತು ರಾತ್ರಿಯ 24 ಗ್ರಹಗಳ ಹೋರಾ — ಕಾರ್ಯನಿರ್ವಹಿಸಲು ಸರಿಯಾದ ಸಮಯವನ್ನು ಆಯ್ಕೆ ಮಾಡಲು ಸೂಕ್ತವಾಗಿದೆ.",
    },
    "sunrise-sunset-atlas": {
      title: "ಸೂರ್ಯೋದಯ ಮತ್ತು ಸೂರ್ಯಾಸ್ತ ಅಟ್ಲಾಸ್",
      description: "ಪ್ರಪಂಚದಾದ್ಯಂತದ ನಗರಗಳಲ್ಲಿ ಸೂರ್ಯೋದಯ ಮತ್ತು ಸೂರ್ಯಾಸ್ತವನ್ನು ಹೋಲಿಸಿ.",
    },
    "moon-phase": {
      title: "ಚಂದ್ರನ ಹಂತ",
      description: "ಯಾವುದೇ ದಿನಾಂಕಕ್ಕಾಗಿ ಪ್ರಸ್ತುತ ಚಂದ್ರನ ಹಂತ, ಪ್ರಕಾಶಮಾನ ಮತ್ತು ಹಂತದ ಕೋನ.",
      intro:
        "ಯಾವುದೇ ದಿನಾಂಕಕ್ಕಾಗಿ ಪ್ರಸ್ತುತ ಚಂದ್ರನ ಹಂತ, ಪ್ರಕಾಶಮಾನ ಮತ್ತು ಹಂತದ ಕೋನ — ನೇರವಾಗಿ ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತದೆ.",
    },
    "abhijit-muhurat": {
      title: "ಅಭಿಜಿತ್ ಮುಹೂರ್ತ",
      description: "ಇಂದಿನ ಅಭಿಜಿತ್ ಮುಹೂರ್ತದ ಸಮಯ — ಅತ್ಯಂತ ಮಂಗಳಕರ 48 ನಿಮಿಷಗಳು.",
      intro:
        "ಅಭಿಜಿತ್ 15 ದಿನದ ಮುಹೂರ್ತಗಳಲ್ಲಿ 8ನೇಯದು — ಸೌರ ಮಧ್ಯಾಹ್ನ ಕೇಂದ್ರಿತವಾಗಿರುವ 48 ನಿಮಿಷಗಳು. ದಿನದ ಅತ್ಯಂತ ಶುಭ ಸಮಯ (ಬುಧವಾರಗಳನ್ನು ಹೊರತುಪಡಿಸಿ).",
    },
    "brahma-muhurat": {
      title: "ಬ್ರಹ್ಮ ಮುಹೂರ್ತ",
      description: "ಮುಂಜಾನೆಯ ಬ್ರಹ್ಮ ಮುಹೂರ್ತದ ಸಮಯ — ಧ್ಯಾನಕ್ಕೆ ಸೂಕ್ತವಾಗಿದೆ.",
      intro:
        "ಸೂರ್ಯೋದಯಕ್ಕೆ ಮುಂಚಿನ ಎರಡು ಮುಹೂರ್ತಗಳು — ಮನಸ್ಸು ಸಾಧನೆಗೆ ಹೆಚ್ಚು ಗ್ರಹಿಸುವ ಸಾತ್ವಿಕ ಸಮೃದ್ಧಿಯ ಸಮಯ.",
    },
    "festival-calendar-2026": {
      title: "ಹಬ್ಬಗಳ ಕ್ಯಾಲೆಂಡರ್ 2026",
      description: "2026 ರ ಪ್ರತಿ ಸನಾತನ ಹಬ್ಬ, ತಿಂಗಳವಾರು, ಪ್ರಾದೇಶಿಕ ಮತ್ತು ವರ್ಗದ ಫಿಲ್ಟರ್‌ಗಳೊಂದಿಗೆ.",
    },
    "festival-countdown": {
      title: "ಹಬ್ಬದ ಕೌಂಟ್‌ಡೌನ್",
      description: "2026 ರ ಯಾವುದೇ ಹಬ್ಬಕ್ಕೆ ಲೈವ್ ಕ್ಷಣಗಣನೆ — ಸೆಕೆಂಡ್ ವರೆಗೆ.",
    },
    "festival-finder": {
      title: "ಹಬ್ಬಗಳ ಶೋಧಕ",
      description: "ಹೆಸರು, ದೇವತೆ ಅಥವಾ ತಿಂಗಳ ಮೂಲಕ ಹಬ್ಬಗಳನ್ನು ಹುಡುಕಿ — ಯೋಜನೆಗೆ ಸೂಕ್ತವಾಗಿದೆ.",
    },
    "vrat-calendar": {
      title: "ವ್ರತ ಕ್ಯಾಲೆಂಡರ್",
      description: "ಉಪವಾಸದ ನಿಯಮಗಳು, ಸಮಯಗಳು ಮತ್ತು ಮಂತ್ರಗಳೊಂದಿಗೆ ಪ್ರಮುಖ ವ್ರತಗಳು.",
    },
    "ekadashi-dates": {
      title: "ಏಕಾದಶಿ ದಿನಾಂಕಗಳು",
      description: "2026 ರ ಪ್ರತಿಯೊಂದು ಏಕಾದಶಿ ವಿವರಣೆ ಮತ್ತು ವ್ರತ ವಿಧಿಯೊಂದಿಗೆ.",
      intro: "2026 ರ ಎಲ್ಲಾ 24 ಏಕಾದಶಿಗಳು ವಿವರಣೆ ಮತ್ತು ವ್ರತ ವಿಧಿಯೊಂದಿಗೆ.",
    },
    "purnima-amavasya": {
      title: "ಪೂರ್ಣಿಮಾ ಮತ್ತು ಅಮಾವಾಸ್ಯೆ",
      description: "ಪ್ರಾದೇಶಿಕ ಮಹತ್ವದೊಂದಿಗೆ ಎಲ್ಲಾ ಪೂರ್ಣಿಮಾ ಮತ್ತು ಅಮಾವಾಸ್ಯೆ ದಿನಾಂಕಗಳು.",
    },
    "regional-festivals": {
      title: "ಪ್ರಾದೇಶಿಕ ಹಬ್ಬಗಳು",
      description: "ಪ್ರತಿ ರಾಜ್ಯ ಮತ್ತು ಸಮುದಾಯಕ್ಕೆ ವಿಶಿಷ್ಟವಾದ ಹಬ್ಬಗಳನ್ನು ಅನ್ವೇಷಿಸಿ.",
    },
    "pradosh-vrat": {
      title: "ಪ್ರದೋಷ ವ್ರತ ದಿನಾಂಕಗಳು",
      description: "ಪ್ರತೀ ಪ್ರದೋಷ ವ್ರತದ ದಿನಾಂಕವು ದಿನದ ಪ್ರಕಾರದೊಂದಿಗೆ (ಸೋಮ, ಭೌಮ, ಶನಿ) ನಮೂದಿಸಲಾಗಿದೆ.",
    },
    "sankashti-chaturthi": {
      title: "ಸಂಕಷ್ಟಿ ಚತುರ್ಥಿ",
      description: "ಮಾಸಿಕ ಸಂಕಷ್ಟಿ ಚತುರ್ಥಿ ದಿನಾಂಕಗಳು — ಗಣೇಶನ ಅನುಗ್ರಹದ ದಿನ.",
    },
    "festival-of-the-day": {
      title: "ಇಂದಿನ ಹಬ್ಬ",
      description: "ಇಂದಿನ ಅಥವಾ ಮುಂದಿನ ಸನಾತನ ಹಬ್ಬ — ಒಂದೇ ನೋಟದಲ್ಲಿ ಕಾರ್ಡ್.",
    },
    "upcoming-festivals": {
      title: "ಮುಂದಿನ ಹಬ್ಬಗಳು",
      description: "ಮುಂದಿನ 12 ಹಬ್ಬಗಳು — ಮುಂಬರುವ ವಾರಗಳನ್ನು ಯೋಜಿಸಿ.",
    },
    "puja-checklist-generator": {
      title: "ಪೂಜಾ ಪರಿಶೀಲನಾಪಟ್ಟಿ ಜನರೇಟರ್",
      description: "6 ಮುಖ್ಯ ಪೂಜೆಗಳಿಗಾಗಿ ಸಂವಾದಾತ್ಮಕ ಸಾಮಗ್ರಿ, ವಿಧಿ ಮತ್ತು ಮಂತ್ರ ಪರಿಶೀಲನಾಪಟ್ಟಿ.",
    },
    "aarti-collection": {
      title: "ಆರತಿ ಸಂಗ್ರಹ",
      description: "ಹೆಚ್ಚು ಇಷ್ಟವಾದ ಆರತಿಗಳ ಆಯ್ದ ಸಂಗ್ರಹ, ಸುಂದರವಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ.",
    },
    "chalisa-collection": {
      title: "ಚಾಲೀಸಾ ಸಂಗ್ರಹ",
      description: "ಹನುಮಾನ್, ದುರ್ಗಾ, ಶಿವ, ಗಣೇಶ ಮತ್ತು ಸರಸ್ವತಿ ಚಾಲೀಸಾಗಳು ದೇವನಾಗರಿಯಲ್ಲಿ.",
    },
    "puja-vidhi-planner": {
      title: "ಪೂಜಾ ವಿಧಿ ಯೋಜನೆಗಾರ",
      description: "ಯಾವುದೇ ಪೂಜೆಗೆ ಹಂತ-ಹಂತದ ಯೋಜನೆಗಾರ — ಸಂಕಲ್ಪ, ಮಂತ್ರಗಳು, ಆರತಿ ಮತ್ತು ಸಮಯದ ಬಜೆಟ್.",
    },
    "samagri-checklist": {
      title: "ಸಾಮಗ್ರಿ ಪರಿಶೀಲನಾಪಟ್ಟಿ",
      description: "ಪ್ರಮಾಣಗಳೊಂದಿಗೆ ಎಂಟು ಪ್ರಮುಖ ಪೂಜೆಗಳಿಗಾಗಿ ಕ್ಯುರೇಟೆಡ್ ಸಾಮಗ್ರಿ ಪಟ್ಟಿಗಳು.",
    },
    "sankalp-generator": {
      title: "ಸಂಕಲ್ಪ ಜನರೇಟರ್",
      description: "ನಿಮ್ಮ ಹೆಸರು, ಗೋತ್ರ, ದಿನಾಂಕ ಮತ್ತು ಸ್ಥಳದೊಂದಿಗೆ ಸರಿಯಾದ ಸಂಕಲ್ಪವನ್ನು ರಚಿಸಿ.",
    },
    "griha-pravesh-planner": {
      title: "ಗೃಹ ಪ್ರವೇಶ ಯೋಜನೆಗಾರ",
      description: "ನಿಮ್ಮ ಗೃಹ ಪ್ರವೇಶಕ್ಕಾಗಿ ಸಂಪೂರ್ಣ ಹಂತ-ಹಂತದ ಮಾರ್ಗದರ್ಶಿ.",
    },
    "havan-guide": {
      title: "ಹವನ ಮಾರ್ಗದರ್ಶಿ",
      description: "ಸಾಮಗ್ರಿ, ವಿಧಾನ ಮತ್ತು ಸುರಕ್ಷತಾ ಸಲಹೆಗಳೊಂದಿಗೆ ಸಂಪೂರ್ಣ ಹವನ ಮಾರ್ಗದರ್ಶಿ.",
    },
    "aarti-thali-guide": {
      title: "ಆರತಿ ತಟ್ಟೆ ಮಾರ್ಗದರ್ಶಿ",
      description: "ಆರತಿ ತಟ್ಟೆಯಲ್ಲಿರುವ ಪ್ರತಿಯೊಂದು ವಸ್ತುವೂ ಮತ್ತು ಅದರ ಸಾಂಕೇತಿಕ ಅರ್ಥ.",
    },
    "prasad-recipes": {
      title: "ಪ್ರಸಾದ ಪಾಕವಿಧಾನಗಳು",
      description: "ಸಾಂಪ್ರದಾಯಿಕ ಪ್ರಸಾದ ಪಾಕವಿಧಾನಗಳು — ಮೋದಕ, ಪಂಜೀರಿ, ಶಿರ ಮತ್ತು ಇನ್ನಷ್ಟು.",
    },
    "digital-jaap-counter": {
      title: "ಡಿಜಿಟಲ್ ಜಾಪ್ ಕೌಂಟರ್",
      description:
        "108-ಮಣಿಗಳ ಮಾಲಾ ಪ್ರಗತಿ ಮತ್ತು ಜೀವಿತಾವಧಿಯ ಎಣಿಕೆಯೊಂದಿಗೆ ಗಮನಕ್ಕೆ ಭಂಗವಾಗದ ಜಾಪ್ ಕೌಂಟರ್.",
    },
    "om-counter": {
      title: "ಓಂ ಕೌಂಟರ್",
      description: "ಗಮನವಿಟ್ಟು ಓಂ ಕೌಂಟರ್ — ಮಾಲಾ ಪ್ರಗತಿ ಮತ್ತು ಸೌಮ್ಯವಾದ ಚಿಮಿಂಗ್‌ನೊಂದಿಗೆ ॐ ಜಪಿಸಿ.",
    },
    "mala-counter": {
      title: "ಮಾಲಾ ಕೌಂಟರ್",
      description: "ಮೂಕ ಮಾಲಾ ಕೌಂಟರ್ — ಮಣಿಗಳು, ಮಾಲೆಗಳು ಮತ್ತು ಜೀವಿತಾವಧಿಯ ಎಣಿಕೆಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ.",
    },
    "mantra-timer": {
      title: "ಮಂತ್ರ ಟೈಮರ್",
      description:
        "ಕಾಲಮಿತಿಯ ಮಂತ್ರ ಸೆಷನ್‌ಗಳಿಗಾಗಿ ಸೌಮ್ಯವಾದ ಟೈಮರ್ ಜೊತೆಗೆ ಮೃದುವಾದ ಪೂರ್ಣಗೊಳಿಸುವ ಚಿಮಿಂಗ್.",
    },
    "stotra-collection": {
      title: "ಸ್ತೋತ್ರ ಸಂಗ್ರಹ",
      description: "ಶಾಸ್ತ್ರೀಯ ಸ್ತೋತ್ರಗಳು — ಶಿವ ತಾಂಡವ, ಲಿಂಗಾಷ್ಟಕಮ್, ಮಹಾಮೃತ್ಯುಂಜಯ ಮತ್ತು ಇನ್ನಷ್ಟು.",
    },
    "daily-quote": {
      title: "ದಿನದ ಉಲ್ಲೇಖ",
      description: "ಪ್ರತಿದಿನ ಕೈಯಿಂದ ಆಯ್ದ ಸನಾತನ ಉಲ್ಲೇಖ — ಗೀತೆ, ಉಪನಿಷತ್ತುಗಳು ಮತ್ತು ಇನ್ನಷ್ಟು.",
    },
    "daily-shlok": {
      title: "ದಿನದ ಶ್ಲೋಕ",
      description: "ದೇವನಾಗರಿ ಲಿಪಿಯಲ್ಲಿ ಪ್ರತಿ ದಿನದ ಶ್ಲೋಕ, ಲಿಪ್ಯಂತರ ಮತ್ತು ಅರ್ಥದೊಂದಿಗೆ.",
    },
    "mantra-library": {
      title: "ಮಂತ್ರ ಗ್ರಂಥಾಲಯ",
      description: "ದೇವನಾಗರಿ, IAST ಮತ್ತು ಅರ್ಥದೊಂದಿಗೆ 30+ ಮಂತ್ರಗಳ ಸಂಗ್ರಹ.",
    },
    "beej-mantras": {
      title: "ಬೀಜ ಮಂತ್ರಗಳು",
      description: "ಪ್ರತಿಯೊಂದು ಬೀಜ ಮಂತ್ರ, ದೇವತೆ, ಅರ್ಥ ಮತ್ತು ಉಚ್ಚಾರಣೆ ಮಾರ್ಗದರ್ಶಿಯೊಂದಿಗೆ.",
    },
    "deity-mantras": {
      title: "ದೇವಾಲಯದ ಮಂತ್ರಗಳು",
      description: "ದೇವತೆಗಳ ಪ್ರಕಾರ ವಿಂಗಡಿಸಲಾದ ಮಂತ್ರಗಳು — ಶಿವ, ವಿಷ್ಣು, ದೇವಿ, ಗಣೇಶ ಮತ್ತು ಇನ್ನಷ್ಟು.",
    },
    "mantra-of-the-day": {
      title: "ದಿನದ ಮಂತ್ರ",
      description: "ಪ್ರತಿದಿನ ತಿರುಗುವ ಸಾಂಪ್ರದಾಯಿಕ ಮಂತ್ರ — ದೇವನಾಗರಿ, IAST, ಅರ್ಥ.",
    },
    "gayatri-mantra": {
      title: "ಗಾಯತ್ರಿ ಮಂತ್ರ ಮಾರ್ಗದರ್ಶಿ",
      description: "ಪದದಿಂದ ಪದಕ್ಕೆ ಅರ್ಥ, ಜಪಿಸುವ ನಿಯಮಗಳು ಮತ್ತು ಗಾಯತ್ರಿ ಮಂತ್ರದ ಪ್ರಯೋಜನಗಳು.",
    },
    "mahamrityunjaya-mantra": {
      title: "ಮಹಾಮೃತ್ಯುಂಜಯ ಮಾರ್ಗದರ್ಶಿ",
      description: "ರುದ್ರನ ಗುಣಪಡಿಸುವ ಮಂತ್ರ — ಅರ್ಥ, ಪ್ರಯೋಜನಗಳು ಮತ್ತು ಜಪ ನಿಯಮಗಳು.",
    },
    "ai-dharma-assistant": {
      title: "AI ಧರ್ಮ ಸಹಾಯಕ",
      description: "ಸನಾತನ ಧರ್ಮದ ಬಗ್ಗೆ ಏನೇ ಬೇಕಾದರೂ ಕೇಳಿ ಮತ್ತು ಆಳವಾದ, ಉಲ್ಲೇಖಿತ ಉತ್ತರ ಪಡೆಯಿರಿ.",
      intro:
        "ಸನಾತನ ಧರ್ಮದ ಬಗ್ಗೆ ಏನೇ ಬೇಕಾದರೂ ಕೇಳಿ — ಧರ್ಮಗ್ರಂಥ, ಆಚರಣೆ, ತತ್ವಶಾಸ್ತ್ರ — ಮತ್ತು ಆಳವಾದ, ಉಲ್ಲೇಖಿತ ಉತ್ತರ ಪಡೆಯಿರಿ.",
    },
    "ai-gita-summary": {
      title: "AI ಗೀತಾ ಸಾರಾಂಶ",
      description: "ಭಗವದ್ಗೀತೆಯ ಯಾವುದೇ ಅಧ್ಯಾಯದ ಪ್ರಮುಖ ಶ್ಲೋಕಗಳೊಂದಿಗೆ ತಕ್ಷಣದ, ನಿಖರವಾದ ಸಾರಾಂಶ.",
    },
    "ai-shlok-explainer": {
      title: "AI ಶ್ಲೋಕ ವ್ಯಾಖ್ಯಾನಕಾರ",
      description:
        "ಯಾವುದೇ ಶ್ಲೋಕವನ್ನು ಅಂಟಿಸಿ — ದೇವನಾಗರಿ, IAST, ಪದದಿಂದ ಪದಕ್ಕೆ ಅರ್ಥ ಮತ್ತು ವ್ಯಾಖ್ಯಾನ ಪಡೆಯಿರಿ.",
    },
    "ai-festival-guide": {
      title: "AI ಹಬ್ಬದ ಮಾರ್ಗದರ್ಶಿ",
      description: "ಯಾವುದೇ ಹಬ್ಬವನ್ನು ವಿವರಿಸಲಾಗಿದೆ — ಕಥೆ, ತಿಥಿ, ವಿಧಿ, ಸಾಮಗ್ರಿ ಮತ್ತು ಮಂತ್ರಗಳು.",
    },
    "ai-puja-planner": {
      title: "AI ಪೂಜಾ ಯೋಜಕ",
      description:
        "ನಿಮ್ಮ ಸಂದರ್ಭವನ್ನು ವಿವರಿಸಿ — AI ಸಂಕಲ್ಪ, ವಿಧಿ ಮತ್ತು ಮಂತ್ರಗಳೊಂದಿಗೆ ಪೂರ್ಣ ಪೂಜೆಯನ್ನು ಯೋಜಿಸುತ್ತದೆ.",
    },
    "ai-mantra-meaning": {
      title: "AI ಮಂತ್ರದ ಅರ್ಥ",
      description:
        "ಯಾವುದೇ ಮಂತ್ರವನ್ನು ಡಿಕೋಡ್ ಮಾಡಲಾಗಿದೆ — ದೇವನಾಗರಿ, IAST, ಪದದಿಂದ ಪದಕ್ಕೆ ಅರ್ಥ, ಪ್ರಯೋಜನಗಳು.",
    },
    "ai-sanskrit-helper": {
      title: "AI ಸಂಸ್ಕೃತ ಸಹಾಯಕ",
      description:
        "ಸಂಸ್ಕೃತವನ್ನು ಅನುವಾದಿಸಿ, ವ್ಯಾಕರಣವನ್ನು ಡಿಕೋಡ್ ಮಾಡಿ ಮತ್ತು ಉಚ್ಚರಿಸಿ — ಪ್ರತಿ ಬಾರಿ ದೇವನಾಗರಿ ಮತ್ತು IAST.",
    },
    "mantra-recommender": {
      title: "AI ಮಂತ್ರ ಶಿಫಾರಸುಗಾರ",
      description: "ಉದ್ದೇಶ, ದೇವತೆ ಮತ್ತು ದಿನದ ಸಮಯವನ್ನು ಆಧರಿಸಿ AI-ಚಾಲಿತ ಮಂತ್ರ ಸಲಹೆಗಳು.",
      intro:
        "ನಿಮ್ಮ ಉದ್ದೇಶವನ್ನು ವಿವರಿಸಿ — AI ಅರ್ಥ, ಪ್ರಯೋಜನ ಮತ್ತು ಜಪಗಳ ಸಂಖ್ಯೆಯೊಂದಿಗೆ ಮೂರು ಸಾಂಪ್ರದಾಯಿಕ ಮಂತ್ರಗಳನ್ನು ಸೂಚಿಸುತ್ತದೆ.",
    },
    "baby-name-ai": {
      title: "AI ಮಗುವಿನ ಹೆಸರಿನ ಸಲಹೆಗಾರ",
      description: "ನಕ್ಷತ್ರ, ಉಚ್ಚಾರಾಂಶ, ಅರ್ಥ ಮತ್ತು ಲಿಂಗದ ಪ್ರಕಾರ AI ಮಗುವಿನ ಹೆಸರಿನ ಸಲಹೆಗಳು.",
      intro: "ನಕ್ಷತ್ರ, ಉಚ್ಚಾರಾಂಶ, ಅರ್ಥ ಮತ್ತು ಲಿಂಗವನ್ನು ಆಧರಿಸಿ AI-ರಚಿತ ಸಂಸ್ಕೃತ ಹೆಸರಿನ ಸಲಹೆಗಳು.",
    },
    "temple-finder": {
      title: "ದೇವಾಲಯ ಫೈಂಡರ್",
      description: "20+ ಪ್ರಮುಖ ದೇವಾಲಯಗಳನ್ನು ಒಂದೇ ಟ್ಯಾಪ್ ನಿರ್ದೇಶನಗಳೊಂದಿಗೆ ಹುಡುಕಿ.",
    },
    "temple-directory": {
      title: "ದೇವಾಲಯ ಡೈರೆಕ್ಟರಿ",
      description: "ಭಾರತದಾದ್ಯಂತ 25+ ಪ್ರಮುಖ ದೇವಾಲಯಗಳ ಹುಡುಕಬಹುದಾದ ಡೈರೆಕ್ಟರಿ.",
    },
    "darshan-timings": {
      title: "ದರ್ಶನ ಸಮಯಗಳು",
      description: "ಪ್ರಮುಖ ದೇವಾಲಯಗಳಿಗೆ ದರ್ಶನ ಸಮಯಗಳು ಮತ್ತು ಆರತಿ ವೇಳಾಪಟ್ಟಿಗಳು.",
    },
    "char-dham-planner": {
      title: "ಚಾರ್ ಧಾಮ್ ಪ್ಲಾನರ್",
      description:
        "ನಿಮ್ಮ ಚಾರ್ ಧಾಮ್ ಯಾತ್ರೆ ಯೋಜನೆ ಮಾಡಿ — ಮಾರ್ಗಗಳು, ಉತ್ತಮ ತಿಂಗಳುಗಳು ಮತ್ತು ನಿಲುಗಡೆಗಳು.",
    },
    "jyotirlinga-guide": {
      title: "ಜ್ಯೋತಿರ್ಲಿಂಗ ಗೈಡ್",
      description: "12 ಜ್ಯೋತಿರ್ಲಿಂಗಗಳ ಸಂಪೂರ್ಣ ಮಾರ್ಗದರ್ಶಿ — ಇತಿಹಾಸ, ಸಮಯಗಳು ಮತ್ತು ಪ್ರಯಾಣ.",
    },
    "shakti-peeth-guide": {
      title: "ಶಕ್ತಿ ಪೀಠ ಗೈಡ್",
      description: "ಅತ್ಯಂತ ಹೆಚ್ಚು ಭೇಟಿ ನೀಡಿದ ಶಕ್ತಿ ಪೀಠಗಳು — ಕಥೆಗಳು ಮತ್ತು ಹೇಗೆ ತಲುಪುವುದು.",
    },
    "nearby-temples": {
      title: "ಹತ್ತಿರದ ದೇವಾಲಯಗಳು",
      description: "ನಿಮ್ಮ ಉಳಿಸಿದ ಸ್ಥಳಕ್ಕೆ ಹತ್ತಿರದ ದೇವಾಲಯಗಳನ್ನು ದೂರ ಮತ್ತು ವಿವರಗಳೊಂದಿಗೆ ಹುಡುಕಿ.",
    },
    "kundli-generator": {
      title: "ಕುಂಡಲಿ ಜನರೇಟರ್",
      description: "ರಾಶಿ, ನಕ್ಷತ್ರ, ತಿಥಿ ಮತ್ತು ಯೋಗದೊಂದಿಗೆ ಉಚಿತ ವೈದಿಕ ಕುಂಡಲಿ.",
      intro:
        "ಹುಟ್ಟಿದ ದಿನಾಂಕ ಮತ್ತು ಸಮಯದಿಂದ ಶೀಘ್ರ ವೈದಿಕ ಸ್ನ್ಯಾಪ್‌ಶಾಟ್ — ರಾಶಿ, ನಕ್ಷತ್ರ, ತಿಥಿ, ಯೋಗ ಮತ್ತು ಹೆಸರಿಸುವ ಅಕ್ಷರಗಳು.",
    },
    "rashi-calculator": {
      title: "ರಾಶಿ ಕ್ಯಾಲ್ಕುಲೇಟರ್",
      description: "ಹುಟ್ಟಿದ ದಿನಾಂಕ ಮತ್ತು ಸಮಯದಿಂದ ನಿಮ್ಮ ಚಂದ್ರನ ರಾಶಿಯನ್ನು (ರಾಶಿ) ಹುಡುಕಿ.",
    },
    "nakshatra-finder": {
      title: "ನಕ್ಷತ್ರ ಫೈಂಡರ್",
      description: "ನಿಮ್ಮ ಜನ್ಮ ನಕ್ಷತ್ರ, ಪಾದ ಮತ್ತು ಅದರ ಆಳುವ ದೇವತೆಯನ್ನು ಕಂಡುಹಿಡಿಯಿರಿ.",
    },
    "dasha-calculator": {
      title: "ವಿಂಶೋತ್ತರಿ ದಶಾ",
      description: "ನಿಮ್ಮ ಜನ್ಮ ನಕ್ಷತ್ರದಿಂದ ಲೆಕ್ಕ ಹಾಕಿದ ವಿಂಶೋತ್ತರಿ ಮಹಾದಶಾ ಟೈಮ್‌ಲೈನ್.",
      intro: "ನಿಮ್ಮ ಜನ್ಮ ನಕ್ಷತ್ರದಿಂದ ಲೆಕ್ಕ ಹಾಕಿದ ನಿಮ್ಮ ವಿಂಶೋತ್ತರಿ ಮಹಾದಶಾ ಟೈಮ್‌ಲೈನ್.",
    },
    "gemstone-recommender": {
      title: "ರತ್ನ ಶಿಫಾರಸುಗಾರ",
      description: "ನಿಮ್ಮ ರಾಶಿಯ ಆಧಾರದ ಮೇಲೆ ವೈಯಕ್ತೀಕರಿಸಿದ ರತ್ನ ಶಿಫಾರಸು.",
    },
    numerology: {
      title: "ಸಂಖ್ಯಾಶಾಸ್ತ್ರ",
      description: "ಜೀವನ ಮಾರ್ಗ ಮತ್ತು ಅದೃಷ್ಟ ಸಂಖ್ಯೆಗಳು ಅವುಗಳ ಅರ್ಥದೊಂದಿಗೆ.",
    },
    "name-numerology": {
      title: "ಹೆಸರಿನ ಸಂಖ್ಯಾಶಾಸ್ತ್ರ",
      description: "ಯಾವುದೇ ಹೆಸರಿನ ಸಂಖ್ಯಾತ್ಮಕ ಮೌಲ್ಯ, ಅರ್ಥ ಮತ್ತು ಗ್ರಹಗಳ ಕಂಪನಗಳೊಂದಿಗೆ.",
    },
    "birthstone-finder": {
      title: "ಜನ್ಮರತ್ನ ಶೋಧಕ",
      description: "ಯಾವುದೇ ಜನ್ಮ ಮಾಸಕ್ಕೆ ಸಾಂಪ್ರದಾಯಿಕ ಪಾಶ್ಚಾತ್ಯ ಜನ್ಮರತ್ನ.",
    },
    "sanskrit-dictionary": {
      title: "ಸಂಸ್ಕೃತ ನಿಘಂಟು",
      description: "60+ ಪ್ರಮುಖ ಸಂಸ್ಕೃತ ಪದಗಳನ್ನು ಅವುಗಳ ಅರ್ಥ ಮತ್ತು ಮೂಲದೊಂದಿಗೆ ನೋಡಿ.",
    },
    transliteration: {
      title: "IAST → ದೇವನಾಗರಿ",
      description: "IAST ಅಥವಾ ಫೋನೆಟಿಕ್ ಇಂಗ್ಲಿಷ್ ಅನ್ನು ತಕ್ಷಣವೇ ದೇವನಾಗರಿಗೆ ಪರಿವರ್ತಿಸಿ.",
      intro:
        "IAST ಅಥವಾ ಇಂಗ್ಲಿಷ್ ಫೋನೆಟಿಕ್ ಟೈಪ್ ಮಾಡಿ; ತಕ್ಷಣ ದೇವನಾಗರಿ ಪಡೆಯಿರಿ. ಇದಕ್ಕೆ ಪ್ರಯತ್ನಿಸಿ: 'om namah shivaya'.",
    },
    "sandhi-splitter": {
      title: "ಸಂಧಿ ವಿಭಜಕ",
      description: "ಸಾಮಾನ್ಯ ಸಂಯುಕ್ತ ಪದಗಳಿಗಾಗಿ ನಿಯಮ ಆಧಾರಿತ ಸಂಧಿ ವಿಭಜಕ.",
    },
    "shloka-analyzer": {
      title: "ಶ್ಲೋಕ ವಿಶ್ಲೇಷಕ",
      description: "ಯಾವುದೇ ಶ್ಲೋಕದ ಅಕ್ಷರಗಳು, ಪಾದಗಳು ಮತ್ತು ಛಂದಸ್ಸು ಊಹಿಸಿ.",
    },
    "devanagari-typing": {
      title: "ದೇವನಾಗರಿ ಟೈಪಿಂಗ್",
      description: "ಪರದೆಯ ಕೀಬೋರ್ಡ್‌ನೊಂದಿಗೆ ದೇವನಾಗರಿಯಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ.",
    },
    "verb-conjugator": {
      title: "ಕ್ರಿಯಾಪದ ಸಂಯೋಜಕ",
      description: "ಪ್ರಸ್ತುತ ಕಾಲದಲ್ಲಿ (ಲಟ್ ಲಕಾರ) ಸಾಮಾನ್ಯ ಸಂಸ್ಕೃತ ಧಾತುಗಳನ್ನು ಸಂಯೋಜಿಸಿ.",
    },
    "sanskrit-word-of-day": {
      title: "ದಿನದ ಸಂಸ್ಕೃತ ಪದ",
      description: "ಪ್ರತಿದಿನ ಹೊಸ ಸಂಸ್ಕೃತ ಪದ ಅರ್ಥ ಮತ್ತು ಮೂಲದೊಂದಿಗೆ.",
    },
    "names-by-nakshatra": {
      title: "ನಕ್ಷತ್ರದ ಪ್ರಕಾರ ಹೆಸರುಗಳು",
      description: "ನಿಮ್ಮ ಮಗುವಿನ ಜನ್ಮ ನಕ್ಷತ್ರ ಪಾದದ ಅಕ್ಷರಗಳಿಗೆ ಅನುಗುಣವಾಗಿ ಶಿಶು ಹೆಸರುಗಳು.",
    },
    "names-by-rashi": {
      title: "ರಾಶಿಯ ಪ್ರಕಾರ ಹೆಸರುಗಳು",
      description: "ಚಂದ್ರ ರಾಶಿಯ ಅಕ್ಷರಗಳ ಪ್ರಕಾರ ಶಿಶು ಹೆಸರುಗಳು — ಸುಂದರ ಮತ್ತು ಅರ್ಥಪೂರ್ಣ.",
    },
    "names-by-deity": {
      title: "ದೇವಾನುದೇವತೆಗಳಿಂದ ಸ್ಫೂರ್ತಗೊಂಡ ಹೆಸರುಗಳು",
      description: "ಶಿವ, ವಿಷ್ಣು, ದೇವಿ, ಗಣೇಶ ಮತ್ತು ಇತರ ದೇವಾನುದೇವತೆಗಳಿಂದ ಸ್ಫೂರ್ತಗೊಂಡ ಹೆಸರುಗಳು.",
    },
    "names-by-meaning": {
      title: "ಅರ್ಥದ ಆಧಾರದ ಮೇಲೆ ಹೆಸರುಗಳು",
      description:
        "ಬೆಳಕು, ಶಕ್ತಿ, ಬುದ್ಧಿವಂತಿಕೆ, ಪ್ರೀತಿ ಮತ್ತು ಇತರ ಅರ್ಥಗಳ ಆಧಾರದ ಮೇಲೆ ಹೆಸರುಗಳನ್ನು ಹುಡುಕಿ.",
    },
    "twin-names": {
      title: "ಅವಳಿ ಮಕ್ಕಳಿಗೆ ಹೆಸರುಗಳು",
      description: "ಸಂಸ್ಕೃತ ಸಂಪ್ರದಾಯದ ಪ್ರಕಾರ ಅವಳಿ ಮಕ್ಕಳಿಗೆ ಸುಂದರವಾಗಿ ಹೊಂದಿಕೊಂಡ ಹೆಸರುಗಳು.",
    },
    "ai-name-suggester": {
      title: "AI ಹೆಸರು ಸಲಹೆಗಾರ",
      description: "ನಕ್ಷತ್ರ, ಉಚ್ಚಾರಾಂಶ ಮತ್ತು ಅರ್ಥದ ಆಧಾರದ ಮೇಲೆ AI ಶಿಶುಗಳ ಹೆಸರಿನ ಸಲಹೆಗಳು.",
    },
    "bhagavad-gita": {
      title: "ಭಗವದ್ಗೀತೆ — ಅಧ್ಯಾಯ ರೀಡರ್",
      description: "ಗೀತೆಯ 18 ಅಧ್ಯಾಯಗಳು ಸಾರಾಂಶ ಮತ್ತು ಪ್ರಮುಖ ಬೋಧನೆಯೊಂದಿಗೆ.",
    },
    "upanishads-guide": {
      title: "ಉಪನಿಷತ್ ಮಾರ್ಗದರ್ಶಿ",
      description: "ಪ್ರಮುಖ ಉಪನಿಷತ್ತುಗಳು ಅವುಗಳ ವಿಷಯ ಮತ್ತು ಮುಖ್ಯ ಬೋಧನೆಯೊಂದಿಗೆ.",
    },
    "vedas-introduction": {
      title: "ವೇದಗಳ ಪರಿಚಯ",
      description: "ನಾಲ್ಕು ವೇದಗಳಿಗೆ ಸುಲಭವಾಗಿ ಅರ್ಥೈಸುವ ಪರಿಚಯ.",
    },
    "yoga-sutras": {
      title: "ಯೋಗ ಸೂತ್ರಗಳ ಅವಲೋಕನ",
      description: "ಪತಂಜಲಿಯ ಯೋಗ ಸೂತ್ರಗಳ ನಾಲ್ಕು ಪಾದಗಳು ಪ್ರಮುಖ ಶ್ಲೋಕಗಳೊಂದಿಗೆ.",
    },
    "sanatan-timeline": {
      title: "ಸನಾತನ ಟೈಮ್‌ಲೈನ್",
      description: "ವೈದಿಕ ಯುಗದಿಂದ ಇಂದಿನವರೆಗಿನ ಸನಾತನ ಧರ್ಮದ ದೃಶ್ಯ ಟೈಮ್‌ಲೈನ್.",
    },
    "deity-encyclopedia": {
      title: "ದೇವತಾ ವಿಶ್ವಕೋಶ",
      description: "22+ ದೇವಾನುದೇವತೆಗಳ ಪ್ರತಿಮಾಶಾಸ್ತ್ರ, ಮಂತ್ರಗಳು ಮತ್ತು ಇತಿಹಾಸ.",
    },
    "mahabharata-summary": {
      title: "ಮಹಾಭಾರತ ಸಾರಾಂಶ",
      description: "ಮಹಾಭಾರತದ ಎಲ್ಲಾ 18 ಪರ್ವಗಳು ಅವುಗಳ ವಿಷಯ ಮತ್ತು ಕಥಾ ಹಂದರದೊಂದಿಗೆ.",
    },
    "ramayana-summary": {
      title: "ರಾಮಾಯಣ ಸಾರಾಂಶ",
      description: "ವಾಲ್ಮೀಕಿ ರಾಮಾಯಣದ ಏಳು ಕಾಂಡಗಳು ಒಂದೇ ಪುಟದಲ್ಲಿ.",
    },
    "puranas-overview": {
      title: "18 ಮಹಾಪುರಾಣಗಳು",
      description: "18 ಮಹಾಪುರಾಣಗಳ ಸಂಪೂರ್ಣ ಪಟ್ಟಿ — ದೇವತೆ, ವಿಷಯ ಮತ್ತು ಶ್ಲೋಕಗಳ ಸಂಖ್ಯೆ.",
    },
    "deity-of-the-day": {
      title: "ದಿನದ ದೇವತೆ",
      description: "ಪ್ರತಿದಿನ ಪರಿಭ್ರಮಿಸುವ ದೇವತೆ — ಮಂತ್ರ ಮತ್ತು ಮಹತ್ವದೊಂದಿಗೆ.",
    },
    "nakshatra-guide": {
      title: "27 ನಕ್ಷತ್ರಗಳ ಮಾರ್ಗದರ್ಶಿ",
      description: "ಎಲ್ಲಾ 27 ನಕ್ಷತ್ರಗಳು, ಅವುಗಳ ಅಧಿಪತಿ, ದೇವತೆ, ಚಿಹ್ನೆ ಮತ್ತು ಸ್ವಭಾವದೊಂದಿಗೆ.",
    },
    "rashi-guide": {
      title: "12 ರಾಶಿಗಳ ಮಾರ್ಗದರ್ಶಿ",
      description: "ಎಲ್ಲಾ 12 ರಾಶಿಗಳು, ಅವುಗಳ ಅಧಿಪತಿ, ಅಂಶ ಮತ್ತು ಗುಣಲಕ್ಷಣಗಳೊಂದಿಗೆ.",
    },
  },
  bn: {
    // Bengali (বাংলা) — auto-translated
    // PANCHANG
    "todays-panchang": {
      title: "আজকের পঞ্চাঙ্গ",
      description:
        "আজকের সম্পূর্ণ পঞ্চাঙ্গ — তিথি, নক্ষত্র, যোগ, করণ, সূর্যোদয়, সূর্যাস্ত এবং অশুভ সময়।",
      intro: "আপনার সম্পূর্ণ দৃক-সঠিক পঞ্চাঙ্গ — আপনার শহরের জন্য সরাসরি গণনা করা হয়েছে।",
    },
    "todays-tithi": {
      title: "আজকের তিথি",
      description: "যেকোনো তারিখ এবং শহরের জন্য সঠিক তিথি — পক্ষ এবং সঠিক শেষ সময় সহ।",
    },
    "todays-nakshatra": {
      title: "আজকের নক্ষত্র",
      description: "আজকের নক্ষত্র পদ, শাসক গ্রহ, দেবতা এবং শেষ সময় সহ।",
    },
    "todays-yoga": {
      title: "আজকের যোগ",
      description: "আজকের যোগ (২৭টির মধ্যে একটি) অগ্রগতি এবং শেষ সময় সহ।",
    },
    "todays-karana": {
      title: "আজকের করণ",
      description: "আজকের করণ প্রকার (চলমান / স্থির) এবং সঠিক শেষ সময় সহ।",
    },
    "todays-sunrise": {
      title: "আজকের সূর্যোদয়",
      description: "যেকোনো শহরের জন্য সঠিক সূর্যোদয় — সূর্যাস্ত, সৌর দুপুর এবং দিনের দৈর্ঘ্য সহ।",
    },
    "todays-sunset": {
      title: "আজকের সূর্যাস্ত",
      description: "যেকোনো শহরের জন্য সঠিক সূর্যাস্ত — সূর্যোদয়, সৌর দুপুর এবং দিনের দৈর্ঘ্য সহ।",
    },
    "rahu-kaal": {
      title: "রাহু কাল",
      description: "আজকের রাহু কাল উইন্ডো — অবস্থান-সচেতন এবং মিনিট পর্যন্ত নির্ভুল।",
    },
    "gulika-kaal": {
      title: "গুলিকা কাল",
      description: "আজকের গুলিকা কাল উইন্ডো বাস্তব সূর্যোদয় / সূর্যাস্ত সহ।",
    },
    yamaganda: {
      title: "যমগণ্ড",
      description: "আজকের যমগণ্ড উইন্ডো — দিনের আটটি অংশের মধ্যে একটি।",
    },
    choghadiya: { title: "চোগাড়িয়া", description: "দিন ও রাতের চোগাড়িয়া শুভ ও অশুভ সময় সহ।" },
    "panchang-by-date": {
      title: "তারিখ অনুসারে পঞ্চাঙ্গ",
      description: "পৃথিবীর যেকোনো তারিখ এবং যেকোনো শহরের জন্য সম্পূর্ণ পঞ্চাঙ্গ দেখুন।",
    },
    "hora-chart": {
      title: "হোরা চার্ট",
      description: "যেকোনো কার্যকলাপের জন্য সঠিক সময় বেছে নেওয়ার জন্য গ্রহের হোরা চার্ট।",
      intro: "দিন ও রাতের ২৪টি গ্রহের হোরা — কাজ করার সঠিক সময় বেছে নেওয়ার জন্য উপযুক্ত।",
    },
    "sunrise-sunset-atlas": {
      title: "সূর্যোদয় ও সূর্যাস্ত অ্যাটলাস",
      description: "বিশ্বের বিভিন্ন শহরের সূর্যোদয় ও সূর্যাস্তের তুলনা করুন।",
    },
    "moon-phase": {
      title: "চাঁদের দশা",
      description: "যেকোনো তারিখের জন্য বর্তমান চাঁদের দশা, আলোকসজ্জা এবং দশা কোণ।",
      intro:
        "বর্তমান চাঁদের দশা, আলোকসজ্জা এবং দশা কোণ — যেকোনো তারিখের জন্য সরাসরি গণনা করা হয়েছে।",
    },
    "abhijit-muhurat": {
      title: "অভিজিৎ মুহূর্ত",
      description: "আজকের অভিজিৎ মুহূর্ত উইন্ডো — সবচেয়ে শুভ ৪৮ মিনিট।",
      intro:
        "অভিজিৎ হল ১৫টি দিন-মুহূর্তের মধ্যে ৮ম — সৌর দুপুরের কেন্দ্র করে ৪৮ মিনিট। দিনের সবচেয়ে শুভ সময় (বুধবার ছাড়া)।",
    },
    "brahma-muhurat": {
      title: "ব্রহ্ম মুহূর্ত",
      description: "ভোরের আগের ব্রহ্ম মুহূর্ত উইন্ডো — ধ্যানের জন্য আদর্শ।",
      intro:
        "সূর্যোদয়ের আগের দুটি মুহূর্ত — সত্ত্ব-সমৃদ্ধ সময় যখন মন সাধনার জন্য সবচেয়ে বেশি সংবেদনশীল থাকে।",
    },

    // FESTIVALS
    "festival-calendar-2026": {
      title: "উৎসব ক্যালেন্ডার ২০২৬",
      description: "২০২৬ সালের প্রতিটি সনাতন উৎসব, মাস অনুযায়ী, আঞ্চলিক এবং বিভাগীয় ফিল্টার সহ।",
    },
    "festival-countdown": {
      title: "উৎসবের কাউন্টডাউন",
      description: "২০২৬ সালের যেকোনো উৎসবের জন্য একটি লাইভ কাউন্টডাউন — সেকেন্ড পর্যন্ত।",
    },
    "festival-finder": {
      title: "উৎসব অনুসন্ধানকারী",
      description: "নাম, দেবতা বা মাস অনুসারে উৎসব অনুসন্ধান করুন — পরিকল্পনার জন্য উপযুক্ত।",
    },
    "vrat-calendar": {
      title: "ব্রত ক্যালেন্ডার",
      description: "প্রতিটি প্রধান ব্রত উপবাসের নিয়ম, সময় এবং মন্ত্র সহ।",
    },
    "ekadashi-dates": {
      title: "একাদশী তারিখ",
      description: "২০২৬ সালের প্রতিটি একাদশী বর্ণনা এবং ব্রত বিধি সহ।",
      intro: "২০২৬ সালের সমস্ত ২৪টি একাদশী বর্ণনা এবং ব্রত বিধি সহ।",
    },
    "purnima-amavasya": {
      title: "পূর্ণিমা ও অমাবস্যা",
      description: "আঞ্চলিক গুরুত্ব সহ সমস্ত পূর্ণিমা এবং অমাবস্যার তারিখ।",
    },
    "regional-festivals": {
      title: "আঞ্চলিক উৎসব",
      description: "প্রতিটি রাজ্য এবং সম্প্রদায়ের অনন্য উৎসবগুলি আবিষ্কার করুন।",
    },
    "pradosh-vrat": {
      title: "প্রদোষ ব্রত তারিখ",
      description: "প্রতিটি প্রদোষ ব্রত তারিখ দিন-প্রকার (সোম, ভৌম, শনি) উল্লেখ সহ।",
    },
    "sankashti-chaturthi": {
      title: "সংকষ্টী চতুর্থী",
      description: "মাসিক সংকষ্টী চতুর্থীর তারিখ — গণেশের কৃপার দিন।",
    },
    "festival-of-the-day": {
      title: "দিনের উৎসব",
      description: "আজকের বা পরবর্তী সনাতন উৎসব — এক নজরে কার্ড।",
    },
    "upcoming-festivals": {
      title: "আসন্ন উৎসব",
      description: "আগামী ১২টি উৎসব — আগামী সপ্তাহগুলির পরিকল্পনা করুন।",
    },

    // PUJA
    "puja-checklist-generator": {
      title: "পূজা চেকলিস্ট জেনারেটর",
      description: "৬টি প্রধান পূজার জন্য ইন্টারেক্টিভ সামগ্রী, বিধি এবং মন্ত্র চেকলিস্ট।",
    },
    "aarti-collection": {
      title: "আরতি সংগ্রহ",
      description: "সবচেয়ে প্রিয় আরতিগুলির হাতে-বাছা সংগ্রহ, সুন্দরভাবে টাইপসেট করা।",
    },
    "chalisa-collection": {
      title: "চল্লিশা সংগ্রহ",
      description: "হনুমান, দুর্গা, শিব, গণেশ এবং সরস্বতী চল্লিশা দেবনাগরীতে।",
    },
    "puja-vidhi-planner": {
      title: "পূজা বিধি প্ল্যানার",
      description:
        "যেকোনো পূজার জন্য একটি ধাপে ধাপে পরিকল্পনাকারী — সংকল্প, মন্ত্র, আরতি এবং সময় বাজেট।",
    },
    "samagri-checklist": {
      title: "সামগ্রী চেকলিস্ট",
      description: "আটটি প্রধান পূজার জন্য পরিমাণ সহ নির্বাচিত সামগ্রী তালিকা।",
    },
    "sankalp-generator": {
      title: "সংকল্প জেনারেটর",
      description: "আপনার নাম, গোত্র, তারিখ এবং স্থান সহ সঠিক সংকল্প তৈরি করুন।",
    },
    "griha-pravesh-planner": {
      title: "গৃহ প্রবেশ প্ল্যানার",
      description: "আপনার গৃহ প্রবেশের জন্য সম্পূর্ণ ধাপে ধাপে নির্দেশিকা।",
    },
    "havan-guide": {
      title: "হবন গাইড",
      description: "সামগ্রী, পদ্ধতি এবং সুরক্ষা টিপস সহ সম্পূর্ণ হবন গাইড।",
    },
    "aarti-thali-guide": {
      title: "আরতি থালি গাইড",
      description: "আরতি থালির প্রতিটি জিনিস এবং এর প্রতীকী অর্থ।",
    },
    "prasad-recipes": {
      title: "প্রসাদ রেসিপি",
      description: "ঐতিহ্যবাহী প্রসাদ রেসিপি — মোদক, পঞ্জিরি, শিরা এবং আরও অনেক কিছু।",
    },

    // MANTRAS
    "digital-jaap-counter": {
      title: "ডিজিটাল জপ কাউন্টার",
      description: "১০৮-মালার অগ্রগতি এবং আজীবন গণনা সহ বিভ্রান্তি-মুক্ত জপ কাউন্টার।",
    },
    "om-counter": {
      title: "ওম কাউন্টার",
      description: "একটি কেন্দ্রীভূত ওম কাউন্টার — মালার অগ্রগতি এবং মৃদু ঘণ্টা সহ ॐ জপ করুন।",
    },
    "mala-counter": {
      title: "মালা কাউন্টার",
      description: "একটি নীরব মালা কাউন্টার — জপ, মালা এবং আজীবন গণনা ট্র্যাক করুন।",
    },
    "mantra-timer": {
      title: "মন্ত্র টাইমার",
      description: "একটি মৃদু টাইমার সময়বদ্ধ মন্ত্র সেশনের জন্য একটি নরম সমাপ্তি ঘণ্টা সহ।",
    },
    "stotra-collection": {
      title: "স্তোত্র সংগ্রহ",
      description: "শাস্ত্রীয় স্তোত্র — শিব তান্ডব, লিঙ্গষ্টকম, মহামৃত্যুঞ্জয় এবং আরও অনেক কিছু।",
    },
    "daily-quote": {
      title: "দৈনিক উক্তি",
      description: "প্রতিদিন একটি হাতে-বাছা সনাতন উক্তি — গীতা, উপনিষদ এবং আরও অনেক কিছু।",
    },
    "daily-shlok": {
      title: "দৈনিক শ্লোক",
      description: "দেবনাগরী, প্রতিবর্ণীকরণ এবং অর্থ সহ একটি দৈনিক শ্লোক।",
    },
    "mantra-library": {
      title: "মন্ত্র লাইব্রেরি",
      description: "দেবনাগরী, IAST এবং অর্থ সহ ৩০+ মন্ত্রের একটি নির্বাচিত লাইব্রেরি।",
    },
    "beej-mantras": {
      title: "বীজ মন্ত্র",
      description: "দেবতা, অর্থ এবং উচ্চারণ নির্দেশিকা সহ প্রতিটি বীজ মন্ত্র।",
    },
    "deity-mantras": {
      title: "দেবতা মন্ত্র",
      description: "দেবতা অনুসারে সংগঠিত মন্ত্র — শিব, বিষ্ণু, দেবী, গণেশ এবং আরও অনেক কিছু।",
    },
    "mantra-of-the-day": {
      title: "দিনের মন্ত্র",
      description: "প্রতিদিন একটি ঘূর্ণায়মান ঐতিহ্যবাহী মন্ত্র — দেবনাগরী, IAST, অর্থ।",
    },
    "gayatri-mantra": {
      title: "গায়ত্রী মন্ত্র গাইড",
      description: "গায়ত্রীর শব্দ-দ্বারা-শব্দ অর্থ, জপের নিয়ম এবং উপকারিতা।",
    },
    "mahamrityunjaya-mantra": {
      title: "মহামৃত্যুঞ্জয় গাইড",
      description: "রুদ্রের নিরাময় মন্ত্র — অর্থ, উপকারিতা এবং জপের নিয়ম।",
    },

    // AI
    "ai-dharma-assistant": {
      title: "এআই ধর্ম সহকারী",
      description:
        "সনাতন ধর্ম সম্পর্কে যেকোনো কিছু জিজ্ঞাসা করুন এবং একটি চিন্তাশীল, উদ্ধৃত উত্তর পান।",
      intro:
        "সনাতন ধর্ম সম্পর্কে যেকোনো কিছু জিজ্ঞাসা করুন — শাস্ত্র, আচার, দর্শন — এবং একটি চিন্তাশীল, উদ্ধৃত উত্তর পান।",
    },
    "ai-gita-summary": {
      title: "এআই গীতা সারাংশ",
      description: "ভগবদ্গীতার যেকোনো অধ্যায়ের তাৎক্ষণিক, বিশ্বস্ত সারাংশ মূল শ্লোক সহ।",
    },
    "ai-shlok-explainer": {
      title: "এআই শ্লোক ব্যাখ্যাকারী",
      description: "যেকোনো শ্লোক পেস্ট করুন — দেবনাগরী, IAST, শব্দ-দ্বারা-শব্দ অর্থ এবং ভাষ্য পান।",
    },
    "ai-festival-guide": {
      title: "এআই উৎসব গাইড",
      description: "যেকোনো উৎসব, ব্যাখ্যা করা হয়েছে — গল্প, তিথি, বিধি, সামগ্রী এবং মন্ত্র।",
    },
    "ai-puja-planner": {
      title: "এআই পূজা প্ল্যানার",
      description:
        "আপনার উপলক্ষ বর্ণনা করুন — এআই সংকল্প, বিধি এবং মন্ত্র সহ একটি সম্পূর্ণ পূজা পরিকল্পনা করে।",
    },
    "ai-mantra-meaning": {
      title: "এআই মন্ত্র অর্থ",
      description:
        "যেকোনো মন্ত্র, ডিকোড করা হয়েছে — দেবনাগরী, IAST, শব্দ-দ্বারা-শব্দ অর্থ, উপকারিতা।",
    },
    "ai-sanskrit-helper": {
      title: "এআই সংস্কৃত সহায়ক",
      description:
        "সংস্কৃত অনুবাদ করুন, ব্যাকরণ ডিকোড করুন এবং উচ্চারণ করুন — সর্বদা দেবনাগরী এবং IAST।",
    },
    "mantra-recommender": {
      title: "এআই মন্ত্র সুপারিশকারী",
      description: "উদ্দেশ্য, দেবতা এবং দিনের সময় অনুসারে এআই-চালিত মন্ত্রের পরামর্শ।",
      intro:
        "আপনার উদ্দেশ্য বর্ণনা করুন — এআই অর্থ, উপকারিতা এবং জপের সংখ্যা সহ তিনটি ঐতিহ্যবাহী মন্ত্রের পরামর্শ দেয়।",
    },
    "baby-name-ai": {
      title: "এআই শিশুর নাম প্রস্তাবক",
      description: "নক্ষত্র, অক্ষর, অর্থ এবং লিঙ্গ অনুসারে এআই শিশুর নামের পরামর্শ।",
      intro: "নক্ষত্র, অক্ষর, অর্থ এবং লিঙ্গ অনুসারে এআই-নির্মিত সংস্কৃত নামের পরামর্শ।",
    },

    // TEMPLES
    "temple-finder": {
      title: "মন্দির অনুসন্ধানকারী",
      description: "এক-ট্যাপ দিকনির্দেশ সহ ২০+ প্রধান মন্দির অনুসন্ধান করুন।",
    },
    "temple-directory": {
      title: "মন্দির ডিরেক্টরি",
      description: "ভারত জুড়ে ২৫+ প্রধান মন্দিরের অনুসন্ধানযোগ্য ডিরেক্টরি।",
    },
    "darshan-timings": {
      title: "দর্শন সময়",
      description: "প্রধান মন্দিরগুলির দর্শন সময় এবং আরতির সময়সূচী।",
    },
    "char-dham-planner": {
      title: "চার ধাম প্ল্যানার",
      description: "আপনার চার ধাম যাত্রা পরিকল্পনা করুন — রুট, সেরা মাস এবং বিরতি।",
    },
    "jyotirlinga-guide": {
      title: "জ্যোতির্লিঙ্গ গাইড",
      description: "১২টি জ্যোতির্লিঙ্গের সম্পূর্ণ গাইড — ইতিহাস, সময় এবং ভ্রমণ।",
    },
    "shakti-peeth-guide": {
      title: "শক্তি পীঠ গাইড",
      description: "সবচেয়ে বেশি পরিদর্শিত শক্তি পীঠ — গল্প এবং কীভাবে পৌঁছাবেন।",
    },
    "nearby-temples": {
      title: "কাছাকাছি মন্দির",
      description: "আপনার সংরক্ষিত অবস্থানের নিকটতম মন্দিরগুলি দূরত্ব এবং বিবরণ সহ খুঁজুন।",
    },

    // CALCULATORS
    "kundli-generator": {
      title: "কুন্ডলী জেনারেটর",
      description: "রাশি, নক্ষত্র, তিথি এবং যোগ সহ বিনামূল্যে বৈদিক কুন্ডলী।",
      intro:
        "জন্ম তারিখ এবং সময় থেকে একটি দ্রুত বৈদিক স্ন্যাপশট — রাশি, নক্ষত্র, তিথি, যোগ এবং নামকরণের অক্ষর।",
    },
    "rashi-calculator": {
      title: "রাশি ক্যালকুলেটর",
      description: "জন্ম তারিখ এবং সময় থেকে আপনার চন্দ্র রাশি (রাশি) খুঁজুন।",
    },
    "nakshatra-finder": {
      title: "নক্ষত্র অনুসন্ধানকারী",
      description: "আপনার জন্ম নক্ষত্র, পদ এবং এর শাসক দেবতা আবিষ্কার করুন।",
    },
    "dasha-calculator": {
      title: "বিংশোত্তরী দশা",
      description: "আপনার জন্ম নক্ষত্র থেকে গণনা করা বিংশোত্তরী মহাদশার সময়রেখা।",
      intro: "আপনার জন্ম নক্ষত্র থেকে গণনা করা আপনার বিংশোত্তরী মহাদশার সময়রেখা।",
    },
    "gemstone-recommender": {
      title: "রত্নপাথর সুপারিশকারী",
      description: "আপনার রাশি অনুসারে ব্যক্তিগতকৃত রত্নপাথরের সুপারিশ।",
    },
    numerology: { title: "সংখ্যা জ্যোতিষ", description: "জীবন-পথ এবং ভাগ্য সংখ্যা অর্থ সহ।" },
    "name-numerology": {
      title: "নাম সংখ্যা জ্যোতিষ",
      description: "যেকোনো নামের সংখ্যাগত মান অর্থ এবং গ্রহের কম্পন সহ।",
    },
    "birthstone-finder": {
      title: "জন্মপাথর অনুসন্ধানকারী",
      description: "যেকোনো জন্ম মাসের জন্য ঐতিহ্যবাহী পশ্চিমা জন্মপাথর।",
    },

    // SANSKRIT
    "sanskrit-dictionary": {
      title: "সংস্কৃত অভিধান",
      description: "অর্থ এবং মূল সহ ৬০+ মূল সংস্কৃত শব্দ দেখুন।",
    },
    transliteration: {
      title: "IAST → দেবনাগরী",
      description: "IAST বা ধ্বনিগত ইংরেজিকে তাৎক্ষণিকভাবে দেবনাগরীতে রূপান্তর করুন।",
      intro:
        "IAST বা ইংরেজি ধ্বনিগত টাইপ করুন; তাৎক্ষণিক দেবনাগরী পান। চেষ্টা করুন: 'om namah shivaya'।",
    },
    "sandhi-splitter": {
      title: "সন্ধি বিভাজক",
      description: "সাধারণ যৌগিক শব্দের জন্য নিয়ম-ভিত্তিক সন্ধি বিভাজক।",
    },
    "shloka-analyzer": {
      title: "শ্লোক বিশ্লেষক",
      description: "যেকোনো শ্লোকের অক্ষর, পদ গণনা করুন এবং ছন্দ অনুমান করুন।",
    },
    "devanagari-typing": {
      title: "দেবনাগরী টাইপিং",
      description: "অন-স্ক্রিন কীবোর্ড দিয়ে দেবনাগরীতে টাইপ করুন।",
    },
    "verb-conjugator": {
      title: "ক্রিয়া পদ রূপান্তরকারী",
      description: "বর্তমান কালে (লট্ লকার) সাধারণ সংস্কৃত ধাতুগুলির রূপান্তর করুন।",
    },
    "sanskrit-word-of-day": {
      title: "দিনের সংস্কৃত শব্দ",
      description: "প্রতিদিন একটি নতুন সংস্কৃত শব্দ অর্থ এবং মূল সহ।",
    },

    // BABY NAMES
    "names-by-nakshatra": {
      title: "নক্ষত্র অনুসারে নাম",
      description: "আপনার শিশুর জন্ম নক্ষত্রের পদ অক্ষর অনুসারে শিশুর নাম।",
    },
    "names-by-rashi": {
      title: "রাশি অনুসারে নাম",
      description: "চন্দ্র রাশি অক্ষর অনুসারে শিশুর নাম — সুন্দর এবং অর্থপূর্ণ।",
    },
    "names-by-deity": {
      title: "দেবতা অনুসারে নাম",
      description: "শিব, বিষ্ণু, দেবী, গণেশ এবং আরও অনেক কিছু দ্বারা অনুপ্রাণিত নাম।",
    },
    "names-by-meaning": {
      title: "অর্থ অনুসারে নাম",
      description: "অর্থ অনুসারে নাম খুঁজুন — আলো, শক্তি, জ্ঞান, প্রেম এবং আরও অনেক কিছু।",
    },
    "twin-names": {
      title: "যমজ নাম",
      description: "সংস্কৃত ঐতিহ্য থেকে নেওয়া যমজদের জন্য সুন্দরভাবে জোড়া নাম।",
    },
    "ai-name-suggester": {
      title: "এআই নাম প্রস্তাবক",
      description: "নক্ষত্র, অক্ষর এবং অর্থ অনুসারে এআই শিশুর নামের পরামর্শ।",
    },

    // LEARNING
    "bhagavad-gita": {
      title: "ভগবদ্গীতা — অধ্যায় পাঠক",
      description: "গীতার সমস্ত ১৮টি অধ্যায় সারাংশ এবং মূল শিক্ষা সহ।",
    },
    "upanishads-guide": {
      title: "উপনিষদ গাইড",
      description: "প্রধান উপনিষদগুলি বিষয়বস্তু এবং মূল শিক্ষা সহ।",
    },
    "vedas-introduction": {
      title: "বেদ পরিচিতি",
      description: "চারটি বেদের একটি সহজবোধ্য পরিচিতি।",
    },
    "yoga-sutras": {
      title: "যোগ সূত্র সংক্ষিপ্ত বিবরণ",
      description: "পতঞ্জলির যোগ সূত্রের চারটি পদ মূল শ্লোক সহ।",
    },
    "sanatan-timeline": {
      title: "সনাতন সময়রেখা",
      description: "সনাতন ধর্মের একটি ভিজ্যুয়াল সময়রেখা — বৈদিক যুগ থেকে আজ পর্যন্ত।",
    },
    "deity-encyclopedia": {
      title: "দেবতা বিশ্বকোষ",
      description: "২২+ দেবতা iconography, মন্ত্র এবং কিংবদন্তি সহ।",
    },
    "mahabharata-summary": {
      title: "মহাভারত সারাংশ",
      description: "মহাভারতের সমস্ত ১৮টি পর্ব বিষয়বস্তু এবং গল্পের আর্ক সহ।",
    },
    "ramayana-summary": {
      title: "রামায়ণ সারাংশ",
      description: "বাল্মীকি রামায়ণের সাতটি কাণ্ড এক পৃষ্ঠায়।",
    },
    "puranas-overview": {
      title: "১৮ মহাপুরাণ",
      description: "১৮টি মহাপুরাণের সম্পূর্ণ তালিকা — দেবতা, বিষয়বস্তু এবং শ্লোক সংখ্যা।",
    },
    "deity-of-the-day": {
      title: "দিনের দেবতা",
      description: "প্রতিদিন একটি ঘূর্ণায়মান দেবতা — মন্ত্র এবং গুরুত্ব সহ।",
    },
    "nakshatra-guide": {
      title: "২৭ নক্ষত্র গাইড",
      description: "সমস্ত ২৭টি নক্ষত্র অধিপতি, দেবতা, প্রতীক এবং প্রকৃতি সহ।",
    },
    "rashi-guide": {
      title: "১২ রাশি গাইড",
      description: "সমস্ত ১২টি রাশি অধিপতি, উপাদান এবং বৈশিষ্ট্য সহ।",
    },
  },
  ml: {
    // Malayalam (മലയാളം) — auto-translated
    // PANCHANG
    "todays-panchang": {
      title: "ഇന്നത്തെ പഞ്ചാംഗം",
      description:
        "ഇന്നത്തെ പൂർണ്ണ പഞ്ചാംഗം — തിഥി, നക്ഷത്രം, യോഗം, കരണം, സൂര്യോദയം, സൂര്യാസ്തമയം, അശുഭകരമായ സമയങ്ങൾ.",
      intro:
        "നിങ്ങളുടെ നഗരത്തിനായി തത്സമയം കണക്കാക്കുന്ന നിങ്ങളുടെ പൂർണ്ണമായ ദൃക്-കൃത്യമായ പഞ്ചാംഗം.",
    },
    "todays-tithi": {
      title: "ഇന്നത്തെ തിഥി",
      description:
        "ഏത് തീയതിയിലെയും നഗരത്തിലെയും കൃത്യമായ തിഥി — പക്ഷവും കൃത്യമായ അവസാന സമയവും സഹിതം.",
    },
    "todays-nakshatra": {
      title: "ഇന്നത്തെ നക്ഷത്രം",
      description: "ഇന്നത്തെ നക്ഷത്രം പാദം, ഭരണ ഗ്രഹം, ദേവത, അവസാന സമയം എന്നിവ സഹിതം.",
    },
    "todays-yoga": {
      title: "ഇന്നത്തെ യോഗം",
      description: "ഇന്നത്തെ യോഗം (27-ൽ ഒന്ന്) പുരോഗതിയും അവസാന സമയവും സഹിതം.",
    },
    "todays-karana": {
      title: "ഇന്നത്തെ കരണം",
      description: "ഇന്നത്തെ കരണം തരം (ചലിക്കുന്ന / സ്ഥിരമായ) കൃത്യമായ അവസാന സമയവും സഹിതം.",
    },
    "todays-sunrise": {
      title: "ഇന്നത്തെ സൂര്യോദയം",
      description:
        "ഏത് നഗരത്തിലെയും കൃത്യമായ സൂര്യോദയം — സൂര്യാസ്തമയം, സൗരമധ്യാഹ്നം, പകലിന്റെ ദൈർഘ്യം എന്നിവ സഹിതം.",
    },
    "todays-sunset": {
      title: "ഇന്നത്തെ സൂര്യാസ്തമയം",
      description:
        "ഏത് നഗരത്തിലെയും കൃത്യമായ സൂര്യാസ്തമയം — സൂര്യോദയം, സൗരമധ്യാഹ്നം, പകലിന്റെ ദൈർഘ്യം എന്നിവ സഹിതം.",
    },
    "rahu-kaal": {
      title: "രാഹുകാലം",
      description: "ഇന്നത്തെ രാഹുകാലം — സ്ഥാനം അനുസരിച്ച് കൃത്യമായ സമയം.",
    },
    "gulika-kaal": {
      title: "ഗുളികകാലം",
      description: "യഥാർത്ഥ സൂര്യോദയം / സൂര്യാസ്തമയം അനുസരിച്ചുള്ള ഇന്നത്തെ ഗുളികകാലം.",
    },
    yamaganda: {
      title: "യമഗണ്ഡം",
      description: "ഇന്നത്തെ യമഗണ്ഡം — ദിവസത്തിലെ എട്ട് ഭാഗങ്ങളിൽ ഒന്ന്.",
    },
    choghadiya: {
      title: "ചോഗാഡിയ",
      description: "പകൽ, രാത്രി ചോഗാഡിയ ശുഭകരവും അശുഭകരവുമായ സമയങ്ങൾ സഹിതം.",
    },
    "panchang-by-date": {
      title: "തീയതി അനുസരിച്ചുള്ള പഞ്ചാംഗം",
      description: "ഭൂമിയിലെ ഏത് തീയതിയിലെയും ഏത് നഗരത്തിലെയും പൂർണ്ണ പഞ്ചാംഗം കണ്ടെത്തുക.",
    },
    "hora-chart": {
      title: "ഹോര ചാർട്ട്",
      description: "ഏത് പ്രവർത്തനത്തിനും ശരിയായ സമയം തിരഞ്ഞെടുക്കുന്നതിനുള്ള ഗ്രഹ ഹോര ചാർട്ട്.",
      intro:
        "പകലിന്റെയും രാത്രിയുടെയും 24 ഗ്രഹ ഹോരകൾ — പ്രവർത്തിക്കാൻ ശരിയായ സമയം തിരഞ്ഞെടുക്കുന്നതിന് അനുയോജ്യം.",
    },
    "sunrise-sunset-atlas": {
      title: "സൂര്യോദയ സൂര്യാസ്തമയ അറ്റ്ലസ്",
      description: "ലോകമെമ്പാടുമുള്ള നഗരങ്ങളിലെ സൂര്യോദയവും സൂര്യാസ്തമയവും താരതമ്യം ചെയ്യുക.",
    },
    "moon-phase": {
      title: "ചന്ദ്രന്റെ ഘട്ടം",
      description: "ഏത് തീയതിയിലെയും നിലവിലെ ചന്ദ്രന്റെ ഘട്ടം, പ്രകാശം, ഘട്ട കോൺ.",
      intro: "ഏത് തീയതിയിലും തത്സമയം കണക്കാക്കുന്ന നിലവിലെ ചന്ദ്രന്റെ ഘട്ടം, പ്രകാശം, ഘട്ട കോൺ.",
    },
    "abhijit-muhurat": {
      title: "അഭിജിത് മുഹൂർത്തം",
      description: "ഇന്നത്തെ അഭിജിത് മുഹൂർത്തം — ഏറ്റവും ശുഭകരമായ 48 മിനിറ്റ്.",
      intro:
        "അഭിജിത് 15 പകൽ മുഹൂർത്തങ്ങളിൽ എട്ടാമത്തേതാണ് — സൗരമധ്യാഹ്നത്തെ കേന്ദ്രീകരിച്ചുള്ള 48 മിനിറ്റ്. ദിവസത്തിലെ ഏറ്റവും ശുഭകരമായ സമയം (ബുധനാഴ്ചകൾ ഒഴികെ).",
    },
    "brahma-muhurat": {
      title: "ബ്രഹ്മ മുഹൂർത്തം",
      description: "പ്രഭാതത്തിനു മുമ്പുള്ള ബ്രഹ്മ മുഹൂർത്തം — ധ്യാനത്തിന് അനുയോജ്യം.",
      intro:
        "സൂര്യോദയത്തിനു മുമ്പുള്ള രണ്ട് മുഹൂർത്തങ്ങൾ — മനസ്സ് സാധനയ്ക്ക് ഏറ്റവും സ്വീകാര്യമായ സത്വ സമ്പന്നമായ സമയം.",
    },

    // FESTIVALS
    "festival-calendar-2026": {
      title: "ഉത്സവ കലണ്ടർ 2026",
      description:
        "2026-ലെ എല്ലാ സനാതന ഉത്സവങ്ങളും, മാസം തോറും, പ്രാദേശികവും വിഭാഗീയവുമായ ഫിൽട്ടറുകളോടെ.",
    },
    "festival-countdown": {
      title: "ഉത്സവ കൗണ്ട്ഡൗൺ",
      description: "2026-ലെ ഏത് ഉത്സവത്തിലേക്കും തത്സമയ കൗണ്ട്ഡൗൺ — സെക്കൻഡ് വരെ.",
    },
    "festival-finder": {
      title: "ഉത്സവ ഫൈൻഡർ",
      description:
        "പേര്, ദേവത അല്ലെങ്കിൽ മാസം അനുസരിച്ച് ഉത്സവങ്ങൾ തിരയുക — ആസൂത്രണത്തിന് അനുയോജ്യം.",
    },
    "vrat-calendar": {
      title: "വ്രത കലണ്ടർ",
      description: "എല്ലാ പ്രധാന വ്രതങ്ങളും ഉപവാസ നിയമങ്ങൾ, സമയങ്ങൾ, മന്ത്രങ്ങൾ എന്നിവ സഹിതം.",
    },
    "ekadashi-dates": {
      title: "ഏകാദശി തീയതികൾ",
      description: "2026-ലെ എല്ലാ ഏകാദശികളും വിവരണവും വ്രതവിധിയും സഹിതം.",
      intro: "2026-ലെ എല്ലാ 24 ഏകാദശികളും വിവരണവും വ്രതവിധിയും സഹിതം.",
    },
    "purnima-amavasya": {
      title: "പൂർണ്ണിമ & അമാവാസി",
      description: "എല്ലാ പൂർണ്ണിമ, അമാവാസി തീയതികളും പ്രാദേശിക പ്രാധാന്യത്തോടെ.",
    },
    "regional-festivals": {
      title: "പ്രാദേശിക ഉത്സവങ്ങൾ",
      description: "ഓരോ സംസ്ഥാനത്തിനും സമൂഹത്തിനും തനതായ ഉത്സവങ്ങൾ കണ്ടെത്തുക.",
    },
    "pradosh-vrat": {
      title: "പ്രദോഷ വ്രത തീയതികൾ",
      description:
        "എല്ലാ പ്രദോഷ വ്രത തീയതികളും ദിവസത്തിന്റെ തരം (സോം, ഭൗമ, ശനി) രേഖപ്പെടുത്തിയിരിക്കുന്നു.",
    },
    "sankashti-chaturthi": {
      title: "സങ്കഷ്ടി ചതുർത്ഥി",
      description: "പ്രതിമാസ സങ്കഷ്ടി ചതുർത്ഥി തീയതികൾ — ഗണപതിയുടെ അനുഗ്രഹ ദിനം.",
    },
    "festival-of-the-day": {
      title: "ദിവസത്തിലെ ഉത്സവം",
      description: "ഇന്നത്തെ അല്ലെങ്കിൽ അടുത്ത സനാതന ഉത്സവം — ഒറ്റനോട്ടത്തിൽ.",
    },
    "upcoming-festivals": {
      title: "വരാനിരിക്കുന്ന ഉത്സവങ്ങൾ",
      description: "അടുത്ത 12 ഉത്സവങ്ങൾ — വരും ആഴ്ചകൾ ആസൂത്രണം ചെയ്യുക.",
    },

    // PUJA
    "puja-checklist-generator": {
      title: "പൂജാ ചെക്ക്‌ലിസ്റ്റ് ജനറേറ്റർ",
      description: "6 പ്രധാന പൂജകൾക്കുള്ള സംവേദനാത്മക സാമഗ്രി, വിധി, മന്ത്ര ചെക്ക്‌ലിസ്റ്റ്.",
    },
    "aarti-collection": {
      title: "ആരതി ശേഖരം",
      description:
        "കൈകൊണ്ട് തിരഞ്ഞെടുത്ത ഏറ്റവും പ്രിയപ്പെട്ട ആരതികളുടെ ശേഖരം, മനോഹരമായി ടൈപ്പ് ചെയ്തത്.",
    },
    "chalisa-collection": {
      title: "ചാലിസ ശേഖരം",
      description: "ഹനുമാൻ, ദുർഗ്ഗ, ശിവ്, ഗണേഷ്, സരസ്വതി ചാലിസകൾ ദേവനാഗരിയിൽ.",
    },
    "puja-vidhi-planner": {
      title: "പൂജാ വിധി പ്ലാനർ",
      description:
        "ഏത് പൂജയ്ക്കും ഒരു ഘട്ടം ഘട്ടമായുള്ള പ്ലാനർ — സങ്കൽപം, മന്ത്രങ്ങൾ, ആരതി, സമയ ബഡ്ജറ്റ്.",
    },
    "samagri-checklist": {
      title: "സാമഗ്രി ചെക്ക്‌ലിസ്റ്റ്",
      description: "എട്ട് പ്രധാന പൂജകൾക്കുള്ള സാമഗ്രി ലിസ്റ്റുകൾ അളവുകളോടെ.",
    },
    "sankalp-generator": {
      title: "സങ്കൽപം ജനറേറ്റർ",
      description: "നിങ്ങളുടെ പേര്, ഗോത്രം, തീയതി, സ്ഥലം എന്നിവ സഹിതം ശരിയായ സങ്കൽപം ഉണ്ടാക്കുക.",
    },
    "griha-pravesh-planner": {
      title: "ഗൃഹപ്രവേശ പ്ലാനർ",
      description: "നിങ്ങളുടെ ഗൃഹപ്രവേശത്തിനുള്ള പൂർണ്ണമായ ഘട്ടം ഘട്ടമായുള്ള വഴികാട്ടി.",
    },
    "havan-guide": {
      title: "ഹവനം ഗൈഡ്",
      description: "സാമഗ്രി, നടപടിക്രമം, സുരക്ഷാ നുറുങ്ങുകൾ എന്നിവ സഹിതം പൂർണ്ണമായ ഹവനം ഗൈഡ്.",
    },
    "aarti-thali-guide": {
      title: "ആരതി താലി ഗൈഡ്",
      description: "ആരതി താലിയിലെ ഓരോ ഇനവും അതിന്റെ പ്രതീകാത്മക അർത്ഥവും.",
    },
    "prasad-recipes": {
      title: "പ്രസാദ പാചകക്കുറിപ്പുകൾ",
      description: "പരമ്പരാഗത പ്രസാദ പാചകക്കുറിപ്പുകൾ — മോദക്, പഞ്ജിരി, ഷീര എന്നിവയും അതിലേറെയും.",
    },

    // MANTRAS
    "digital-jaap-counter": {
      title: "ഡിജിറ്റൽ ജാപ് കൗണ്ടർ",
      description:
        "ശ്രദ്ധ വ്യതിചലിക്കാത്ത ജാപ് കൗണ്ടർ 108-മുത്തുകളുടെ മാല പുരോഗതിയും ആജീവനാന്ത എണ്ണവും സഹിതം.",
    },
    "om-counter": {
      title: "ഓം കൗണ്ടർ",
      description: "ഒരു കേന്ദ്രീകൃത ഓം കൗണ്ടർ — മാല പുരോഗതിയും മൃദലമായ ശബ്ദവും സഹിതം ॐ ജപിക്കുക.",
    },
    "mala-counter": {
      title: "മാല കൗണ്ടർ",
      description:
        "ഒരു നിശബ്ദ മാല കൗണ്ടർ — മുത്തുകൾ, മാലകൾ, ആജീവനാന്ത എണ്ണം എന്നിവ ട്രാക്ക് ചെയ്യുക.",
    },
    "mantra-timer": {
      title: "മന്ത്ര ടൈമർ",
      description: "സമയബന്ധിതമായ മന്ത്ര സെഷനുകൾക്ക് മൃദലമായ ടൈമർ, മൃദലമായ പൂർത്തീകരണ ശബ്ദത്തോടെ.",
    },
    "stotra-collection": {
      title: "സ്തോത്ര ശേഖരം",
      description:
        "ക്ലാസിക്കൽ സ്തോത്രങ്ങൾ — ശിവ് താണ്ഡവ്, ലിംഗാഷ്ടകം, മഹാമൃത്യുഞ്ജയ എന്നിവയും അതിലേറെയും.",
    },
    "daily-quote": {
      title: "പ്രതിദിന ഉദ്ധരണി",
      description:
        "എല്ലാ ദിവസവും കൈകൊണ്ട് തിരഞ്ഞെടുത്ത ഒരു സനാതന ഉദ്ധരണി — ഗീത, ഉപനിഷത്തുകൾ എന്നിവയും അതിലേറെയും.",
    },
    "daily-shlok": {
      title: "പ്രതിദിന ശ്ലോകം",
      description: "ദേവനാഗരിയിൽ ലിപ്യന്തരണവും അർത്ഥവും സഹിതം ഒരു പ്രതിദിന ശ്ലോകം.",
    },
    "mantra-library": {
      title: "മന്ത്ര ലൈബ്രറി",
      description:
        "ദേവനാഗരി, IAST, അർത്ഥം എന്നിവ സഹിതം 30+ മന്ത്രങ്ങളുടെ ഒരു ക്യൂറേറ്റ് ചെയ്ത ലൈബ്രറി.",
    },
    "beej-mantras": {
      title: "ബീജ മന്ത്രങ്ങൾ",
      description: "ഓരോ ബീജ മന്ത്രവും ദേവത, അർത്ഥം, ഉച്ചാരണ ഗൈഡ് എന്നിവ സഹിതം.",
    },
    "deity-mantras": {
      title: "ദേവതാ മന്ത്രങ്ങൾ",
      description:
        "ദേവത അനുസരിച്ച് ക്രമീകരിച്ച മന്ത്രങ്ങൾ — ശിവ, വിഷ്ണു, ദേവി, ഗണേഷ എന്നിവയും അതിലേറെയും.",
    },
    "mantra-of-the-day": {
      title: "ദിവസത്തിലെ മന്ത്രം",
      description: "എല്ലാ ദിവസവും ഒരു കറങ്ങുന്ന പരമ്പരാഗത മന്ത്രം — ദേവനാഗരി, IAST, അർത്ഥം.",
    },
    "gayatri-mantra": {
      title: "ഗായത്രി മന്ത്ര ഗൈഡ്",
      description: "ഗായത്രിയുടെ വാക്ക്-വാക്ക് അർത്ഥം, ജപ നിയമങ്ങൾ, പ്രയോജനങ്ങൾ.",
    },
    "mahamrityunjaya-mantra": {
      title: "മഹാമൃത്യുഞ്ജയ ഗൈഡ്",
      description: "രുദ്രന്റെ രോഗശാന്തി മന്ത്രം — അർത്ഥം, പ്രയോജനങ്ങൾ, ജാപ് നിയമങ്ങൾ.",
    },

    // AI
    "ai-dharma-assistant": {
      title: "AI ധർമ്മ അസിസ്റ്റന്റ്",
      description:
        "സനാതന ധർമ്മത്തെക്കുറിച്ച് എന്തും ചോദിക്കുക, ചിന്തനീയവും ഉദ്ധരിച്ചതുമായ ഉത്തരം നേടുക.",
      intro:
        "സനാതന ധർമ്മത്തെക്കുറിച്ച് എന്തും ചോദിക്കുക — വേദഗ്രന്ഥം, ആചാരം, തത്ത്വചിന്ത — ചിന്തനീയവും ഉദ്ധരിച്ചതുമായ ഉത്തരം നേടുക.",
    },
    "ai-gita-summary": {
      title: "AI ഗീത സംഗ്രഹം",
      description:
        "ഏത് ഭഗവദ്ഗീത അധ്യായത്തിന്റെയും പ്രധാന വാക്യങ്ങൾ സഹിതം തൽക്ഷണ, വിശ്വസനീയമായ സംഗ്രഹം.",
    },
    "ai-shlok-explainer": {
      title: "AI ശ്ലോക വിശദീകരണം",
      description:
        "ഏത് ശ്ലോകവും ഒട്ടിക്കുക — ദേവനാഗരി, IAST, വാക്ക്-വാക്ക് അർത്ഥം, വ്യാഖ്യാനം എന്നിവ നേടുക.",
    },
    "ai-festival-guide": {
      title: "AI ഉത്സവ ഗൈഡ്",
      description: "ഏത് ഉത്സവവും വിശദീകരിക്കുന്നു — കഥ, തിഥി, വിധി, സാമഗ്രി, മന്ത്രങ്ങൾ.",
    },
    "ai-puja-planner": {
      title: "AI പൂജാ പ്ലാനർ",
      description:
        "നിങ്ങളുടെ അവസരം വിവരിക്കുക — AI സങ്കൽപം, വിധി, മന്ത്രങ്ങൾ എന്നിവ സഹിതം ഒരു പൂർണ്ണ പൂജ ആസൂത്രണം ചെയ്യുന്നു.",
    },
    "ai-mantra-meaning": {
      title: "AI മന്ത്ര അർത്ഥം",
      description:
        "ഏത് മന്ത്രവും ഡീകോഡ് ചെയ്യുന്നു — ദേവനാഗരി, IAST, വാക്ക്-വാക്ക് അർത്ഥം, പ്രയോജനങ്ങൾ.",
    },
    "ai-sanskrit-helper": {
      title: "AI സംസ്കൃത സഹായി",
      description:
        "സംസ്കൃതം വിവർത്തനം ചെയ്യുക, വ്യാകരണത്തെ ഡീകോഡ് ചെയ്യുക, ഉച്ചരിക്കുക — എല്ലായ്പ്പോഴും ദേവനാഗരിയും IAST-യും.",
    },
    "mantra-recommender": {
      title: "AI മന്ത്ര ശുപാർശകൻ",
      description:
        "ഉദ്ദേശ്യം, ദേവത, ദിവസത്തിലെ സമയം എന്നിവ അടിസ്ഥാനമാക്കിയുള്ള AI-ശക്തിപ്പെടുത്തിയ മന്ത്ര നിർദ്ദേശങ്ങൾ.",
      intro:
        "നിങ്ങളുടെ ഉദ്ദേശ്യം വിവരിക്കുക — AI അർത്ഥം, പ്രയോജനം, ജാപ് എണ്ണം എന്നിവ സഹിതം മൂന്ന് പരമ്പരാഗത മന്ത്രങ്ങൾ നിർദ്ദേശിക്കുന്നു.",
    },
    "baby-name-ai": {
      title: "AI ശിശുനാമ നിർദ്ദേശകൻ",
      description:
        "നക്ഷത്രം, അക്ഷരം, അർത്ഥം, ലിംഗഭേദം എന്നിവ അനുസരിച്ചുള്ള AI ശിശുനാമ നിർദ്ദേശങ്ങൾ.",
      intro:
        "നക്ഷത്രം, അക്ഷരം, അർത്ഥം, ലിംഗഭേദം എന്നിവ അടിസ്ഥാനമാക്കിയുള്ള AI-നിർമ്മിത സംസ്കൃത നാമ നിർദ്ദേശങ്ങൾ.",
    },

    // TEMPLES
    "temple-finder": {
      title: "ക്ഷേത്ര ഫൈൻഡർ",
      description: "ഒറ്റ ടാപ്പിൽ ദിശകളോടെ 20+ പ്രധാന ക്ഷേത്രങ്ങൾ തിരയുക.",
    },
    "temple-directory": {
      title: "ക്ഷേത്ര ഡയറക്ടറി",
      description: "ഇന്ത്യയിലുടനീളമുള്ള 25+ പ്രധാന ക്ഷേത്രങ്ങളുടെ തിരയാവുന്ന ഡയറക്ടറി.",
    },
    "darshan-timings": {
      title: "ദർശന സമയങ്ങൾ",
      description: "പ്രധാന ക്ഷേത്രങ്ങളിലെ ദർശന സമയങ്ങളും ആരതി ഷെഡ്യൂളുകളും.",
    },
    "char-dham-planner": {
      title: "ചാർ ധാം പ്ലാനർ",
      description:
        "നിങ്ങളുടെ ചാർ ധാം യാത്ര ആസൂത്രണം ചെയ്യുക — റൂട്ടുകൾ, മികച്ച മാസങ്ങൾ, ഇടത്താവളങ്ങൾ.",
    },
    "jyotirlinga-guide": {
      title: "ജ്യോതിർലിംഗ ഗൈഡ്",
      description: "12 ജ്യോതിർലിംഗങ്ങളെക്കുറിച്ചുള്ള പൂർണ്ണമായ ഗൈഡ് — ചരിത്രം, സമയങ്ങൾ, യാത്ര.",
    },
    "shakti-peeth-guide": {
      title: "ശക്തി പീഠ ഗൈഡ്",
      description:
        "ഏറ്റവും കൂടുതൽ സന്ദർശിക്കുന്ന ശക്തി പീഠങ്ങൾ — കഥകളും എങ്ങനെ എത്തിച്ചേരാമെന്നും.",
    },
    "nearby-temples": {
      title: "അടുത്തുള്ള ക്ഷേത്രങ്ങൾ",
      description:
        "നിങ്ങളുടെ സംരക്ഷിച്ച സ്ഥലത്തിന് ഏറ്റവും അടുത്തുള്ള ക്ഷേത്രങ്ങൾ ദൂരവും വിവരങ്ങളും സഹിതം കണ്ടെത്തുക.",
    },

    // CALCULATORS
    "kundli-generator": {
      title: "കുണ്ഡലി ജനറേറ്റർ",
      description: "രാശി, നക്ഷത്രം, തിഥി, യോഗം എന്നിവ സഹിതം സൗജന്യ വൈദിക കുണ്ഡലി.",
      intro:
        "ജനന തീയതിയും സമയവും അനുസരിച്ചുള്ള ഒരു ദ്രുത വൈദിക സ്നാപ്ഷോട്ട് — രാശി, നക്ഷത്രം, തിഥി, യോഗം, നാമകരണ അക്ഷരങ്ങൾ.",
    },
    "rashi-calculator": {
      title: "രാശി കാൽക്കുലേറ്റർ",
      description: "ജനന തീയതിയും സമയവും അനുസരിച്ച് നിങ്ങളുടെ ചന്ദ്ര രാശി (രാശി) കണ്ടെത്തുക.",
    },
    "nakshatra-finder": {
      title: "നക്ഷത്ര ഫൈൻഡർ",
      description: "നിങ്ങളുടെ ജന്മ നക്ഷത്രം, പാദം, അതിന്റെ ഭരണ ദേവത എന്നിവ കണ്ടെത്തുക.",
    },
    "dasha-calculator": {
      title: "വിംശോത്തരി ദശ",
      description: "നിങ്ങളുടെ ജന്മ നക്ഷത്രത്തിൽ നിന്ന് കണക്കാക്കിയ വിംശോത്തരി മഹാദശ ടൈംലൈൻ.",
      intro: "നിങ്ങളുടെ ജന്മ നക്ഷത്രത്തിൽ നിന്ന് കണക്കാക്കിയ നിങ്ങളുടെ വിംശോത്തരി മഹാദശ ടൈംലൈൻ.",
    },
    "gemstone-recommender": {
      title: "രത്ന ശുപാർശകൻ",
      description: "നിങ്ങളുടെ രാശി അടിസ്ഥാനമാക്കിയുള്ള വ്യക്തിഗത രത്ന ശുപാർശ.",
    },
    numerology: {
      title: "സംഖ്യാശാസ്ത്രം",
      description: "ജീവിത പാതയും വിധി സംഖ്യകളും അർത്ഥവും സഹിതം.",
    },
    "name-numerology": {
      title: "പേര് സംഖ്യാശാസ്ത്രം",
      description: "ഏത് പേരിന്റെയും സംഖ്യാശാസ്ത്ര മൂല്യം അർത്ഥവും ഗ്രഹ വൈബ്രേഷനും സഹിതം.",
    },
    "birthstone-finder": {
      title: "ബർത്ത്സ്റ്റോൺ ഫൈൻഡർ",
      description: "ഏത് ജനന മാസത്തിലെയും പരമ്പരാഗത പാശ്ചാത്യ ബർത്ത്സ്റ്റോൺ.",
    },

    // SANSKRIT
    "sanskrit-dictionary": {
      title: "സംസ്കൃത നിഘണ്ടു",
      description: "60+ പ്രധാന സംസ്കൃത പദങ്ങൾ അർത്ഥവും മൂലവും സഹിതം കണ്ടെത്തുക.",
    },
    transliteration: {
      title: "IAST → ദേവനാഗരി",
      description: "IAST അല്ലെങ്കിൽ ഫോണറ്റിക് ഇംഗ്ലീഷ് തൽക്ഷണം ദേവനാഗരിയിലേക്ക് മാറ്റുക.",
      intro:
        "IAST അല്ലെങ്കിൽ ഇംഗ്ലീഷ് ഫോണറ്റിക് ടൈപ്പ് ചെയ്യുക; തൽക്ഷണ ദേവനാഗരി നേടുക. ശ്രമിക്കുക: 'om namah shivaya'.",
    },
    "sandhi-splitter": {
      title: "സന്ധി സ്പ്ലിറ്റർ",
      description: "സാധാരണ സംയുക്ത പദങ്ങൾക്കുള്ള നിയമങ്ങളെ അടിസ്ഥാനമാക്കിയുള്ള സന്ധി സ്പ്ലിറ്റർ.",
    },
    "shloka-analyzer": {
      title: "ശ്ലോക അനലൈസർ",
      description: "ഏത് ശ്ലോകത്തിലെയും അക്ഷരങ്ങൾ, പാദങ്ങൾ എന്നിവ എണ്ണുക, ഛന്ദസ്സ് ഊഹിക്കുക.",
    },
    "devanagari-typing": {
      title: "ദേവനാഗരി ടൈപ്പിംഗ്",
      description: "ഓൺ-സ്ക്രീൻ കീബോർഡ് ഉപയോഗിച്ച് ദേവനാഗരിയിൽ ടൈപ്പ് ചെയ്യുക.",
    },
    "verb-conjugator": {
      title: "ക്രിയാപദ സംയോജകൻ",
      description: "സാധാരണ സംസ്കൃത ധാതുക്കൾ വർത്തമാനകാലത്തിൽ (ലട് ലകാര) സംയോജിപ്പിക്കുക.",
    },
    "sanskrit-word-of-day": {
      title: "ദിവസത്തിലെ സംസ്കൃത പദം",
      description: "എല്ലാ ദിവസവും ഒരു പുതിയ സംസ്കൃത പദം അർത്ഥവും മൂലവും സഹിതം.",
    },

    // BABY NAMES
    "names-by-nakshatra": {
      title: "നക്ഷത്രം അനുസരിച്ചുള്ള പേരുകൾ",
      description: "നിങ്ങളുടെ കുട്ടിയുടെ ജന്മ നക്ഷത്ര പാദ അക്ഷരങ്ങളുമായി യോജിക്കുന്ന ശിശുനാമങ്ങൾ.",
    },
    "names-by-rashi": {
      title: "രാശി അനുസരിച്ചുള്ള പേരുകൾ",
      description: "ചന്ദ്ര രാശി അക്ഷരങ്ങൾ അനുസരിച്ചുള്ള ശിശുനാമങ്ങൾ — മനോഹരവും അർത്ഥവത്തും.",
    },
    "names-by-deity": {
      title: "ദേവത അനുസരിച്ചുള്ള പേരുകൾ",
      description: "ശിവ, വിഷ്ണു, ദേവി, ഗണേഷ എന്നിവരിൽ നിന്ന് പ്രചോദനം ഉൾക്കൊണ്ട പേരുകൾ.",
    },
    "names-by-meaning": {
      title: "അർത്ഥം അനുസരിച്ചുള്ള പേരുകൾ",
      description:
        "അർത്ഥം അനുസരിച്ച് പേരുകൾ കണ്ടെത്തുക — വെളിച്ചം, ശക്തി, ജ്ഞാനം, സ്നേഹം എന്നിവയും അതിലേറെയും.",
    },
    "twin-names": {
      title: "ഇരട്ട പേരുകൾ",
      description: "സംസ്കൃത പാരമ്പര്യത്തിൽ നിന്ന് എടുത്ത ഇരട്ടകൾക്ക് മനോഹരമായി ചേർത്ത പേരുകൾ.",
    },
    "ai-name-suggester": {
      title: "AI നാമ നിർദ്ദേശകൻ",
      description: "നക്ഷത്രം, അക്ഷരം, അർത്ഥം എന്നിവ അനുസരിച്ചുള്ള AI ശിശുനാമ നിർദ്ദേശങ്ങൾ.",
    },

    // LEARNING
    "bhagavad-gita": {
      title: "ഭഗവദ്ഗീത — അധ്യായ വായനക്കാരൻ",
      description: "ഗീതയുടെ 18 അധ്യായങ്ങളും സംഗ്രഹവും പ്രധാന പഠിപ്പിക്കലും സഹിതം.",
    },
    "upanishads-guide": {
      title: "ഉപനിഷദ് ഗൈഡ്",
      description: "പ്രധാന ഉപനിഷത്തുകൾ തീമും പ്രധാന പഠിപ്പിക്കലും സഹിതം.",
    },
    "vedas-introduction": {
      title: "വേദങ്ങളുടെ ആമുഖം",
      description: "നാല് വേദങ്ങളെക്കുറിച്ചുള്ള ഒരു ലളിതമായ ആമുഖം.",
    },
    "yoga-sutras": {
      title: "യോഗ സൂത്രങ്ങളുടെ അവലോകനം",
      description: "പതഞ്ജലിയുടെ യോഗ സൂത്രങ്ങളുടെ നാല് പാദങ്ങൾ പ്രധാന വാക്യങ്ങൾ സഹിതം.",
    },
    "sanatan-timeline": {
      title: "സനാതന ടൈംലൈൻ",
      description: "വേദകാലഘട്ടം മുതൽ ഇന്നുവരെയുള്ള സനാതന ധർമ്മത്തിന്റെ ഒരു ദൃശ്യ ടൈംലൈൻ.",
    },
    "deity-encyclopedia": {
      title: "ദേവതാ വിജ്ഞാനകോശം",
      description: "22+ ദേവതകൾ ഐക്കണോഗ്രഫി, മന്ത്രങ്ങൾ, ഐതിഹ്യങ്ങൾ എന്നിവ സഹിതം.",
    },
    "mahabharata-summary": {
      title: "മഹാഭാരത സംഗ്രഹം",
      description: "മഹാഭാരതത്തിന്റെ 18 പർവങ്ങളും തീമുകളും കഥാഘടനയും സഹിതം.",
    },
    "ramayana-summary": {
      title: "രാമായണ സംഗ്രഹം",
      description: "വാൽമീകി രാമായണത്തിലെ ഏഴ് കാണ്ഡങ്ങൾ ഒറ്റ പേജിൽ.",
    },
    "puranas-overview": {
      title: "18 മഹാപുരാണങ്ങൾ",
      description: "18 മഹാപുരാണങ്ങളുടെ പൂർണ്ണമായ ലിസ്റ്റ് — ദേവത, തീം, വാക്യ എണ്ണം.",
    },
    "deity-of-the-day": {
      title: "ദിവസത്തിലെ ദേവത",
      description: "എല്ലാ ദിവസവും ഒരു കറങ്ങുന്ന ദേവത — മന്ത്രവും പ്രാധാന്യവും സഹിതം.",
    },
    "nakshatra-guide": {
      title: "27 നക്ഷത്ര ഗൈഡ്",
      description: "എല്ലാ 27 നക്ഷത്രങ്ങളും അധിപൻ, ദേവത, ചിഹ്നം, സ്വഭാവം എന്നിവ സഹിതം.",
    },
    "rashi-guide": {
      title: "12 രാശി ഗൈഡ്",
      description: "എല്ലാ 12 രാശികളും അധിപൻ, മൂലകം, സ്വഭാവസവിശേഷതകൾ എന്നിവ സഹിതം.",
    },
  },
  pa: {
    // Punjabi (ਪੰਜਾਬੀ, Gurmukhi script) — auto-translated
    // PANCHANG
    "todays-panchang": {
      title: "ਅੱਜ ਦਾ ਪੰਚਾਂਗ",
      description:
        "ਅੱਜ ਦਾ ਪੂਰਾ ਪੰਚਾਂਗ — ਤਿਥੀ, ਨਕਸ਼ਤਰ, ਯੋਗ, ਕਰਨ, ਸੂਰਜ ਚੜ੍ਹਨ, ਸੂਰਜ ਡੁੱਬਣ ਅਤੇ ਅਸ਼ੁਭ ਸਮੇਂ ਬਾਰੇ ਜਾਣਕਾਰੀ।",
      intro: "ਤੁਹਾਡਾ ਸੰਪੂਰਨ ਦ੍ਰਿਕ-ਸ਼ੁੱਧ ਪੰਚਾਂਗ — ਤੁਹਾਡੇ ਸ਼ਹਿਰ ਲਈ ਲਾਈਵ ਗਣਨਾ ਕੀਤੀ ਗਈ।",
    },
    "todays-tithi": {
      title: "ਅੱਜ ਦੀ ਤਿਥੀ",
      description: "ਕਿਸੇ ਵੀ ਮਿਤੀ ਅਤੇ ਸ਼ਹਿਰ ਲਈ ਸਹੀ ਤਿਥੀ — ਪੱਖ ਅਤੇ ਸਹੀ ਸਮਾਪਤੀ ਸਮੇਂ ਦੇ ਨਾਲ।",
    },
    "todays-nakshatra": {
      title: "ਅੱਜ ਦਾ ਨਕਸ਼ਤਰ",
      description: "ਅੱਜ ਦਾ ਨਕਸ਼ਤਰ ਪਦ, ਸ਼ਾਸਕ ਗ੍ਰਹਿ, ਦੇਵਤਾ ਅਤੇ ਸਮਾਪਤੀ ਸਮੇਂ ਦੇ ਨਾਲ।",
    },
    "todays-yoga": {
      title: "ਅੱਜ ਦਾ ਯੋਗ",
      description: "ਅੱਜ ਦਾ ਯੋਗ (27 ਵਿੱਚੋਂ ਇੱਕ) ਪ੍ਰਗਤੀ ਅਤੇ ਸਮਾਪਤੀ ਸਮੇਂ ਦੇ ਨਾਲ।",
    },
    "todays-karana": {
      title: "ਅੱਜ ਦਾ ਕਰਨ",
      description: "ਅੱਜ ਦਾ ਕਰਨ ਕਿਸਮ (ਚੱਲਣਯੋਗ / ਸਥਿਰ) ਅਤੇ ਸਹੀ ਸਮਾਪਤੀ ਸਮੇਂ ਦੇ ਨਾਲ।",
    },
    "todays-sunrise": {
      title: "ਅੱਜ ਦਾ ਸੂਰਜ ਚੜ੍ਹਨਾ",
      description:
        "ਕਿਸੇ ਵੀ ਸ਼ਹਿਰ ਲਈ ਸਹੀ ਸੂਰਜ ਚੜ੍ਹਨਾ — ਸੂਰਜ ਡੁੱਬਣ, ਸੂਰਜੀ ਦੁਪਹਿਰ ਅਤੇ ਦਿਨ ਦੀ ਲੰਬਾਈ ਦੇ ਨਾਲ।",
    },
    "todays-sunset": {
      title: "ਅੱਜ ਦਾ ਸੂਰਜ ਡੁੱਬਣਾ",
      description:
        "ਕਿਸੇ ਵੀ ਸ਼ਹਿਰ ਲਈ ਸਹੀ ਸੂਰਜ ਡੁੱਬਣਾ — ਸੂਰਜ ਚੜ੍ਹਨ, ਸੂਰਜੀ ਦੁਪਹਿਰ ਅਤੇ ਦਿਨ ਦੀ ਲੰਬਾਈ ਦੇ ਨਾਲ।",
    },
    "rahu-kaal": {
      title: "ਰਾਹੂ ਕਾਲ",
      description: "ਅੱਜ ਦਾ ਰਾਹੂ ਕਾਲ ਦਾ ਸਮਾਂ — ਸਥਾਨ-ਅਨੁਕੂਲ ਅਤੇ ਮਿੰਟ ਤੱਕ ਸਹੀ।",
    },
    "gulika-kaal": {
      title: "ਗੁਲਿਕਾ ਕਾਲ",
      description: "ਅਸਲ ਸੂਰਜ ਚੜ੍ਹਨ / ਸੂਰਜ ਡੁੱਬਣ ਦੇ ਨਾਲ ਅੱਜ ਦਾ ਗੁਲਿਕਾ ਕਾਲ ਦਾ ਸਮਾਂ।",
    },
    yamaganda: {
      title: "ਯਮਗੰਡ",
      description: "ਅੱਜ ਦਾ ਯਮਗੰਡ ਦਾ ਸਮਾਂ — ਦਿਨ ਦੇ ਅੱਠ ਭਾਗਾਂ ਵਿੱਚੋਂ ਇੱਕ।",
    },
    choghadiya: {
      title: "ਚੌਘੜੀਆ",
      description: "ਦਿਨ ਅਤੇ ਰਾਤ ਦਾ ਚੌਘੜੀਆ ਸ਼ੁਭ ਅਤੇ ਅਸ਼ੁਭ ਸਮਿਆਂ ਦੇ ਨਾਲ।",
    },
    "panchang-by-date": {
      title: "ਮਿਤੀ ਅਨੁਸਾਰ ਪੰਚਾਂਗ",
      description: "ਕਿਸੇ ਵੀ ਮਿਤੀ ਅਤੇ ਧਰਤੀ 'ਤੇ ਕਿਸੇ ਵੀ ਸ਼ਹਿਰ ਲਈ ਪੂਰਾ ਪੰਚਾਂਗ ਦੇਖੋ।",
    },
    "hora-chart": {
      title: "ਹੋਰਾ ਚਾਰਟ",
      description: "ਕਿਸੇ ਵੀ ਗਤੀਵਿਧੀ ਲਈ ਸਹੀ ਸਮਾਂ ਚੁਣਨ ਲਈ ਗ੍ਰਹਿ ਹੋਰਾ ਚਾਰਟ।",
      intro: "ਦਿਨ ਅਤੇ ਰਾਤ ਦੀਆਂ 24 ਗ੍ਰਹਿ ਹੋਰਾਵਾਂ — ਕੰਮ ਕਰਨ ਲਈ ਸਹੀ ਸਮਾਂ ਚੁਣਨ ਲਈ ਸੰਪੂਰਨ।",
    },
    "sunrise-sunset-atlas": {
      title: "ਸੂਰਜ ਚੜ੍ਹਨ ਅਤੇ ਸੂਰਜ ਡੁੱਬਣ ਦਾ ਐਟਲਸ",
      description: "ਦੁਨੀਆ ਭਰ ਦੇ ਸ਼ਹਿਰਾਂ ਵਿੱਚ ਸੂਰਜ ਚੜ੍ਹਨ ਅਤੇ ਸੂਰਜ ਡੁੱਬਣ ਦੀ ਤੁਲਨਾ ਕਰੋ।",
    },
    "moon-phase": {
      title: "ਚੰਦਰਮਾ ਦਾ ਪੜਾਅ",
      description: "ਕਿਸੇ ਵੀ ਮਿਤੀ ਲਈ ਮੌਜੂਦਾ ਚੰਦਰਮਾ ਦਾ ਪੜਾਅ, ਰੋਸ਼ਨੀ ਅਤੇ ਪੜਾਅ ਕੋਣ।",
      intro: "ਮੌਜੂਦਾ ਚੰਦਰਮਾ ਦਾ ਪੜਾਅ, ਰੋਸ਼ਨੀ ਅਤੇ ਪੜਾਅ ਕੋਣ — ਕਿਸੇ ਵੀ ਮਿਤੀ ਲਈ ਲਾਈਵ ਗਣਨਾ ਕੀਤੀ ਗਈ।",
    },
    "abhijit-muhurat": {
      title: "ਅਭਿਜੀਤ ਮੁਹੂਰਤ",
      description: "ਅੱਜ ਦਾ ਅਭਿਜੀਤ ਮੁਹੂਰਤ ਦਾ ਸਮਾਂ — ਸਭ ਤੋਂ ਸ਼ੁਭ 48 ਮਿੰਟ।",
      intro:
        "ਅਭਿਜੀਤ ਦਿਨ ਦੇ 15 ਮੁਹੂਰਤਾਂ ਵਿੱਚੋਂ 8ਵਾਂ ਹੈ — ਸੂਰਜੀ ਦੁਪਹਿਰ 'ਤੇ ਕੇਂਦਰਿਤ 48 ਮਿੰਟ। ਦਿਨ ਦਾ ਸਭ ਤੋਂ ਸ਼ੁਭ ਸਮਾਂ (ਬੁੱਧਵਾਰ ਨੂੰ ਛੱਡ ਕੇ)।",
    },
    "brahma-muhurat": {
      title: "ਬ੍ਰਹਮਾ ਮੁਹੂਰਤ",
      description: "ਸਵੇਰ ਤੋਂ ਪਹਿਲਾਂ ਦਾ ਬ੍ਰਹਮਾ ਮੁਹੂਰਤ ਦਾ ਸਮਾਂ — ਧਿਆਨ ਲਈ ਆਦਰਸ਼।",
      intro:
        "ਸੂਰਜ ਚੜ੍ਹਨ ਤੋਂ ਪਹਿਲਾਂ ਦੇ ਦੋ ਮੁਹੂਰਤ — ਸਤਵ-ਭਰਪੂਰ ਸਮਾਂ ਜਦੋਂ ਮਨ ਸਾਧਨਾ ਲਈ ਸਭ ਤੋਂ ਵੱਧ ਗ੍ਰਹਿਣਸ਼ੀਲ ਹੁੰਦਾ ਹੈ।",
    },

    // FESTIVALS
    "festival-calendar-2026": {
      title: "ਤਿਉਹਾਰ ਕੈਲੰਡਰ 2026",
      description: "2026 ਦੇ ਹਰ ਸਨਾਤਨ ਤਿਉਹਾਰ, ਮਹੀਨੇ ਅਨੁਸਾਰ, ਖੇਤਰੀ ਅਤੇ ਸ਼੍ਰੇਣੀ ਫਿਲਟਰਾਂ ਦੇ ਨਾਲ।",
    },
    "festival-countdown": {
      title: "ਤਿਉਹਾਰ ਕਾਊਂਟਡਾਊਨ",
      description: "ਕਿਸੇ ਵੀ 2026 ਦੇ ਤਿਉਹਾਰ ਲਈ ਇੱਕ ਲਾਈਵ ਕਾਊਂਟਡਾਊਨ — ਸਕਿੰਟ ਤੱਕ।",
    },
    "festival-finder": {
      title: "ਤਿਉਹਾਰ ਖੋਜਕ",
      description: "ਨਾਮ, ਦੇਵਤਾ ਜਾਂ ਮਹੀਨੇ ਅਨੁਸਾਰ ਤਿਉਹਾਰਾਂ ਦੀ ਖੋਜ ਕਰੋ — ਯੋਜਨਾਬੰਦੀ ਲਈ ਸੰਪੂਰਨ।",
    },
    "vrat-calendar": {
      title: "ਵਰਤ ਕੈਲੰਡਰ",
      description: "ਹਰ ਮੁੱਖ ਵਰਤ ਵਰਤ ਰੱਖਣ ਦੇ ਨਿਯਮਾਂ, ਸਮਿਆਂ ਅਤੇ ਮੰਤਰਾਂ ਦੇ ਨਾਲ।",
    },
    "ekadashi-dates": {
      title: "ਏਕਾਦਸ਼ੀ ਦੀਆਂ ਤਾਰੀਖਾਂ",
      description: "2026 ਦੀ ਹਰ ਏਕਾਦਸ਼ੀ ਵਰਣਨ ਅਤੇ ਵਰਤ ਵਿਧੀ ਦੇ ਨਾਲ।",
      intro: "2026 ਦੀਆਂ ਸਾਰੀਆਂ 24 ਏਕਾਦਸ਼ੀਆਂ ਵਰਣਨ ਅਤੇ ਵਰਤ ਵਿਧੀ ਦੇ ਨਾਲ।",
    },
    "purnima-amavasya": {
      title: "ਪੂਰਨਿਮਾ ਅਤੇ ਅਮਾਵਸਿਆ",
      description: "ਸਾਰੀਆਂ ਪੂਰਨਿਮਾ ਅਤੇ ਅਮਾਵਸਿਆ ਦੀਆਂ ਤਾਰੀਖਾਂ ਖੇਤਰੀ ਮਹੱਤਵ ਦੇ ਨਾਲ।",
    },
    "regional-festivals": {
      title: "ਖੇਤਰੀ ਤਿਉਹਾਰ",
      description: "ਹਰ ਰਾਜ ਅਤੇ ਭਾਈਚਾਰੇ ਲਈ ਵਿਲੱਖਣ ਤਿਉਹਾਰਾਂ ਦੀ ਖੋਜ ਕਰੋ।",
    },
    "pradosh-vrat": {
      title: "ਪ੍ਰਦੋਸ਼ ਵਰਤ ਦੀਆਂ ਤਾਰੀਖਾਂ",
      description: "ਹਰ ਪ੍ਰਦੋਸ਼ ਵਰਤ ਦੀ ਤਾਰੀਖ ਦਿਨ-ਕਿਸਮ (ਸੋਮ, ਭੌਮ, ਸ਼ਨੀ) ਦੇ ਨਾਲ ਨੋਟ ਕੀਤੀ ਗਈ।",
    },
    "sankashti-chaturthi": {
      title: "ਸੰਕਸ਼ਟੀ ਚਤੁਰਥੀ",
      description: "ਮਾਸਿਕ ਸੰਕਸ਼ਟੀ ਚਤੁਰਥੀ ਦੀਆਂ ਤਾਰੀਖਾਂ — ਗਣੇਸ਼ ਦਾ ਕਿਰਪਾ ਦਾ ਦਿਨ।",
    },
    "festival-of-the-day": {
      title: "ਦਿਨ ਦਾ ਤਿਉਹਾਰ",
      description: "ਅੱਜ ਦਾ ਜਾਂ ਅਗਲਾ ਸਨਾਤਨ ਤਿਉਹਾਰ — ਇੱਕ ਨਜ਼ਰ ਵਿੱਚ ਕਾਰਡ।",
    },
    "upcoming-festivals": {
      title: "ਆਉਣ ਵਾਲੇ ਤਿਉਹਾਰ",
      description: "ਅਗਲੇ 12 ਤਿਉਹਾਰ — ਆਉਣ ਵਾਲੇ ਹਫ਼ਤਿਆਂ ਦੀ ਯੋਜਨਾ ਬਣਾਓ।",
    },

    // PUJA
    "puja-checklist-generator": {
      title: "ਪੂਜਾ ਚੈਕਲਿਸਟ ਜਨਰੇਟਰ",
      description: "6 ਮੁੱਖ ਪੂਜਾਵਾਂ ਲਈ ਇੰਟਰਐਕਟਿਵ ਸਮੱਗਰੀ, ਵਿਧੀ ਅਤੇ ਮੰਤਰ ਚੈਕਲਿਸਟ।",
    },
    "aarti-collection": {
      title: "ਆਰਤੀ ਸੰਗ੍ਰਹਿ",
      description: "ਸਭ ਤੋਂ ਪਿਆਰੀਆਂ ਆਰਤੀਆਂ ਦਾ ਹੱਥੀਂ ਚੁਣਿਆ ਸੰਗ੍ਰਹਿ, ਸੁੰਦਰਤਾ ਨਾਲ ਟਾਈਪਸੈੱਟ।",
    },
    "chalisa-collection": {
      title: "ਚਾਲੀਸਾ ਸੰਗ੍ਰਹਿ",
      description: "ਦੇਵਨਾਗਰੀ ਵਿੱਚ ਹਨੂੰਮਾਨ, ਦੁਰਗਾ, ਸ਼ਿਵ, ਗਣੇਸ਼ ਅਤੇ ਸਰਸਵਤੀ ਚਾਲੀਸਾ।",
    },
    "puja-vidhi-planner": {
      title: "ਪੂਜਾ ਵਿਧੀ ਪਲੈਨਰ",
      description: "ਕਿਸੇ ਵੀ ਪੂਜਾ ਲਈ ਕਦਮ-ਦਰ-ਕਦਮ ਯੋਜਨਾਕਾਰ — ਸੰਕਲਪ, ਮੰਤਰ, ਆਰਤੀ ਅਤੇ ਸਮਾਂ ਬਜਟ।",
    },
    "samagri-checklist": {
      title: "ਸਮੱਗਰੀ ਚੈਕਲਿਸਟ",
      description: "ਅੱਠ ਮੁੱਖ ਪੂਜਾਵਾਂ ਲਈ ਮਾਤਰਾਵਾਂ ਦੇ ਨਾਲ ਤਿਆਰ ਕੀਤੀਆਂ ਸਮੱਗਰੀ ਸੂਚੀਆਂ।",
    },
    "sankalp-generator": {
      title: "ਸੰਕਲਪ ਜਨਰੇਟਰ",
      description: "ਆਪਣੇ ਨਾਮ, ਗੋਤਰ, ਮਿਤੀ ਅਤੇ ਸਥਾਨ ਦੇ ਨਾਲ ਸਹੀ ਸੰਕਲਪ ਤਿਆਰ ਕਰੋ।",
    },
    "griha-pravesh-planner": {
      title: "ਗ੍ਰਹਿ ਪ੍ਰਵੇਸ਼ ਪਲੈਨਰ",
      description: "ਤੁਹਾਡੇ ਗ੍ਰਹਿ ਪ੍ਰਵੇਸ਼ ਲਈ ਸੰਪੂਰਨ ਕਦਮ-ਦਰ-ਕਦਮ ਗਾਈਡ।",
    },
    "havan-guide": {
      title: "ਹਵਨ ਗਾਈਡ",
      description: "ਸਮੱਗਰੀ, ਪ੍ਰਕਿਰਿਆ ਅਤੇ ਸੁਰੱਖਿਆ ਸੁਝਾਵਾਂ ਦੇ ਨਾਲ ਸੰਪੂਰਨ ਹਵਨ ਗਾਈਡ।",
    },
    "aarti-thali-guide": {
      title: "ਆਰਤੀ ਥਾਲੀ ਗਾਈਡ",
      description: "ਆਰਤੀ ਥਾਲੀ 'ਤੇ ਹਰ ਵਸਤੂ ਅਤੇ ਉਸਦਾ ਪ੍ਰਤੀਕਾਤਮਕ ਅਰਥ।",
    },
    "prasad-recipes": {
      title: "ਪ੍ਰਸਾਦ ਪਕਵਾਨ",
      description: "ਰਵਾਇਤੀ ਪ੍ਰਸਾਦ ਪਕਵਾਨ — ਮੋਦਕ, ਪੰਜੀਰੀ, ਸ਼ੀਰਾ ਅਤੇ ਹੋਰ।",
    },

    // MANTRAS
    "digital-jaap-counter": {
      title: "ਡਿਜੀਟਲ ਜਾਪ ਕਾਊਂਟਰ",
      description: "108-ਮਣਕੇ ਵਾਲੀ ਮਾਲਾ ਦੀ ਪ੍ਰਗਤੀ ਅਤੇ ਜੀਵਨ ਭਰ ਦੀ ਗਿਣਤੀ ਦੇ ਨਾਲ ਧਿਆਨ-ਮੁਕਤ ਜਾਪ ਕਾਊਂਟਰ।",
    },
    "om-counter": {
      title: "ਓਮ ਕਾਊਂਟਰ",
      description: "ਇੱਕ ਕੇਂਦਰਿਤ ਓਮ ਕਾਊਂਟਰ — ਮਾਲਾ ਦੀ ਪ੍ਰਗਤੀ ਅਤੇ ਹਲਕੀ ਘੰਟੀ ਦੇ ਨਾਲ ॐ ਦਾ ਜਾਪ ਕਰੋ।",
    },
    "mala-counter": {
      title: "ਮਾਲਾ ਕਾਊਂਟਰ",
      description: "ਇੱਕ ਸ਼ਾਂਤ ਮਾਲਾ ਕਾਊਂਟਰ — ਮਣਕਿਆਂ, ਮਾਲਾਵਾਂ ਅਤੇ ਜੀਵਨ ਭਰ ਦੀ ਗਿਣਤੀ ਨੂੰ ਟ੍ਰੈਕ ਕਰੋ।",
    },
    "mantra-timer": {
      title: "ਮੰਤਰ ਟਾਈਮਰ",
      description: "ਇੱਕ ਨਰਮ ਸਮਾਪਤੀ ਘੰਟੀ ਦੇ ਨਾਲ ਸਮੇਂ ਅਨੁਸਾਰ ਮੰਤਰ ਸੈਸ਼ਨਾਂ ਲਈ ਇੱਕ ਹਲਕਾ ਟਾਈਮਰ।",
    },
    "stotra-collection": {
      title: "ਸਤੋਤਰ ਸੰਗ੍ਰਹਿ",
      description: "ਕਲਾਸੀਕਲ ਸਤੋਤਰ — ਸ਼ਿਵ ਤਾਂਡਵ, ਲਿੰਗਾਸ਼ਟਕਮ, ਮਹਾਮ੍ਰਿਤਯੁੰਜਯ ਅਤੇ ਹੋਰ।",
    },
    "daily-quote": {
      title: "ਰੋਜ਼ਾਨਾ ਹਵਾਲਾ",
      description: "ਹਰ ਰੋਜ਼ ਇੱਕ ਹੱਥੀਂ ਚੁਣਿਆ ਸਨਾਤਨ ਹਵਾਲਾ — ਗੀਤਾ, ਉਪਨਿਸ਼ਦ ਅਤੇ ਹੋਰ।",
    },
    "daily-shlok": {
      title: "ਰੋਜ਼ਾਨਾ ਸ਼ਲੋਕ",
      description: "ਦੇਵਨਾਗਰੀ ਵਿੱਚ ਇੱਕ ਰੋਜ਼ਾਨਾ ਸ਼ਲੋਕ ਲਿਪੀਅੰਤਰਨ ਅਤੇ ਅਰਥ ਦੇ ਨਾਲ।",
    },
    "mantra-library": {
      title: "ਮੰਤਰ ਲਾਇਬ੍ਰੇਰੀ",
      description: "ਦੇਵਨਾਗਰੀ, IAST ਅਤੇ ਅਰਥ ਦੇ ਨਾਲ 30+ ਮੰਤਰਾਂ ਦੀ ਇੱਕ ਤਿਆਰ ਕੀਤੀ ਲਾਇਬ੍ਰੇਰੀ।",
    },
    "beej-mantras": {
      title: "ਬੀਜ ਮੰਤਰ",
      description: "ਹਰ ਬੀਜ ਮੰਤਰ ਦੇਵਤਾ, ਅਰਥ ਅਤੇ ਉਚਾਰਨ ਗਾਈਡ ਦੇ ਨਾਲ।",
    },
    "deity-mantras": {
      title: "ਦੇਵਤਾ ਮੰਤਰ",
      description: "ਦੇਵਤਾ ਅਨੁਸਾਰ ਸੰਗਠਿਤ ਮੰਤਰ — ਸ਼ਿਵ, ਵਿਸ਼ਨੂੰ, ਦੇਵੀ, ਗਣੇਸ਼ ਅਤੇ ਹੋਰ।",
    },
    "mantra-of-the-day": {
      title: "ਦਿਨ ਦਾ ਮੰਤਰ",
      description: "ਹਰ ਰੋਜ਼ ਇੱਕ ਘੁੰਮਦਾ ਰਵਾਇਤੀ ਮੰਤਰ — ਦੇਵਨਾਗਰੀ, IAST, ਅਰਥ।",
    },
    "gayatri-mantra": {
      title: "ਗਾਇਤਰੀ ਮੰਤਰ ਗਾਈਡ",
      description: "ਗਾਇਤਰੀ ਦੇ ਸ਼ਬਦ-ਦਰ-ਸ਼ਬਦ ਅਰਥ, ਜਾਪ ਨਿਯਮ ਅਤੇ ਲਾਭ।",
    },
    "mahamrityunjaya-mantra": {
      title: "ਮਹਾਮ੍ਰਿਤਯੁੰਜਯ ਗਾਈਡ",
      description: "ਰੁਦਰ ਦਾ ਇਲਾਜ ਕਰਨ ਵਾਲਾ ਮੰਤਰ — ਅਰਥ, ਲਾਭ ਅਤੇ ਜਾਪ ਨਿਯਮ।",
    },

    // AI
    "ai-dharma-assistant": {
      title: "AI ਧਰਮ ਸਹਾਇਕ",
      description: "ਸਨਾਤਨ ਧਰਮ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ ਅਤੇ ਇੱਕ ਵਿਚਾਰਸ਼ੀਲ, ਹਵਾਲਾ ਦਿੱਤਾ ਜਵਾਬ ਪ੍ਰਾਪਤ ਕਰੋ।",
      intro:
        "ਸਨਾਤਨ ਧਰਮ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ — ਸ਼ਾਸਤਰ, ਰੀਤੀ ਰਿਵਾਜ, ਦਰਸ਼ਨ — ਅਤੇ ਇੱਕ ਵਿਚਾਰਸ਼ੀਲ, ਹਵਾਲਾ ਦਿੱਤਾ ਜਵਾਬ ਪ੍ਰਾਪਤ ਕਰੋ।",
    },
    "ai-gita-summary": {
      title: "AI ਗੀਤਾ ਸੰਖੇਪ",
      description: "ਕਿਸੇ ਵੀ ਭਗਵਦ ਗੀਤਾ ਅਧਿਆਇ ਦਾ ਮੁੱਖ ਆਇਤਾਂ ਦੇ ਨਾਲ ਤੁਰੰਤ, ਭਰੋਸੇਯੋਗ ਸੰਖੇਪ।",
    },
    "ai-shlok-explainer": {
      title: "AI ਸ਼ਲੋਕ ਵਿਆਖਿਆਕਾਰ",
      description:
        "ਕੋਈ ਵੀ ਸ਼ਲੋਕ ਪੇਸਟ ਕਰੋ — ਦੇਵਨਾਗਰੀ, IAST, ਸ਼ਬਦ-ਦਰ-ਸ਼ਬਦ ਅਰਥ ਅਤੇ ਟਿੱਪਣੀ ਪ੍ਰਾਪਤ ਕਰੋ।",
    },
    "ai-festival-guide": {
      title: "AI ਤਿਉਹਾਰ ਗਾਈਡ",
      description: "ਕੋਈ ਵੀ ਤਿਉਹਾਰ, ਵਿਆਖਿਆ ਕੀਤੀ ਗਈ — ਕਹਾਣੀ, ਤਿਥੀ, ਵਿਧੀ, ਸਮੱਗਰੀ ਅਤੇ ਮੰਤਰ।",
    },
    "ai-puja-planner": {
      title: "AI ਪੂਜਾ ਪਲੈਨਰ",
      description:
        "ਆਪਣੇ ਮੌਕੇ ਦਾ ਵਰਣਨ ਕਰੋ — AI ਸੰਕਲਪ, ਵਿਧੀ ਅਤੇ ਮੰਤਰਾਂ ਦੇ ਨਾਲ ਇੱਕ ਪੂਰੀ ਪੂਜਾ ਦੀ ਯੋਜਨਾ ਬਣਾਉਂਦਾ ਹੈ।",
    },
    "ai-mantra-meaning": {
      title: "AI ਮੰਤਰ ਅਰਥ",
      description: "ਕੋਈ ਵੀ ਮੰਤਰ, ਡੀਕੋਡ ਕੀਤਾ ਗਿਆ — ਦੇਵਨਾਗਰੀ, IAST, ਸ਼ਬਦ-ਦਰ-ਸ਼ਬਦ ਅਰਥ, ਲਾਭ।",
    },
    "ai-sanskrit-helper": {
      title: "AI ਸੰਸਕ੍ਰਿਤ ਸਹਾਇਕ",
      description:
        "ਸੰਸਕ੍ਰਿਤ ਦਾ ਅਨੁਵਾਦ ਕਰੋ, ਵਿਆਕਰਨ ਨੂੰ ਡੀਕੋਡ ਕਰੋ, ਅਤੇ ਉਚਾਰਨ ਕਰੋ — ਹਰ ਵਾਰ ਦੇਵਨਾਗਰੀ ਅਤੇ IAST।",
    },
    "mantra-recommender": {
      title: "AI ਮੰਤਰ ਸਿਫਾਰਸ਼ਕਰਤਾ",
      description: "ਇਰਾਦੇ, ਦੇਵਤਾ ਅਤੇ ਦਿਨ ਦੇ ਸਮੇਂ ਦੇ ਅਧਾਰ 'ਤੇ AI-ਸੰਚਾਲਿਤ ਮੰਤਰ ਸੁਝਾਅ।",
      intro:
        "ਆਪਣੇ ਇਰਾਦੇ ਦਾ ਵਰਣਨ ਕਰੋ — AI ਅਰਥ, ਲਾਭ ਅਤੇ ਜਾਪ ਗਿਣਤੀ ਦੇ ਨਾਲ ਤਿੰਨ ਰਵਾਇਤੀ ਮੰਤਰਾਂ ਦਾ ਸੁਝਾਅ ਦਿੰਦਾ ਹੈ।",
    },
    "baby-name-ai": {
      title: "AI ਬੱਚੇ ਦੇ ਨਾਮ ਦਾ ਸੁਝਾਅ ਦੇਣ ਵਾਲਾ",
      description: "ਨਕਸ਼ਤਰ, ਅੱਖਰ, ਅਰਥ ਅਤੇ ਲਿੰਗ ਅਨੁਸਾਰ AI ਬੱਚੇ ਦੇ ਨਾਮ ਦੇ ਸੁਝਾਅ।",
      intro: "ਨਕਸ਼ਤਰ, ਅੱਖਰ, ਅਰਥ ਅਤੇ ਲਿੰਗ ਦੇ ਅਧਾਰ 'ਤੇ AI-ਤਿਆਰ ਸੰਸਕ੍ਰਿਤ ਨਾਮ ਸੁਝਾਅ।",
    },

    // TEMPLES
    "temple-finder": {
      title: "ਮੰਦਰ ਖੋਜਕ",
      description: "ਇੱਕ-ਟੈਪ ਦਿਸ਼ਾਵਾਂ ਦੇ ਨਾਲ 20+ ਮੁੱਖ ਮੰਦਰਾਂ ਦੀ ਖੋਜ ਕਰੋ।",
    },
    "temple-directory": {
      title: "ਮੰਦਰ ਡਾਇਰੈਕਟਰੀ",
      description: "ਭਾਰਤ ਭਰ ਦੇ 25+ ਮੁੱਖ ਮੰਦਰਾਂ ਦੀ ਖੋਜਯੋਗ ਡਾਇਰੈਕਟਰੀ।",
    },
    "darshan-timings": {
      title: "ਦਰਸ਼ਨ ਸਮਾਂ",
      description: "ਮੁੱਖ ਮੰਦਰਾਂ ਲਈ ਦਰਸ਼ਨ ਸਮਾਂ ਅਤੇ ਆਰਤੀ ਅਨੁਸੂਚੀ।",
    },
    "char-dham-planner": {
      title: "ਚਾਰ ਧਾਮ ਪਲੈਨਰ",
      description: "ਆਪਣੀ ਚਾਰ ਧਾਮ ਯਾਤਰਾ ਦੀ ਯੋਜਨਾ ਬਣਾਓ — ਰਸਤੇ, ਸਭ ਤੋਂ ਵਧੀਆ ਮਹੀਨੇ ਅਤੇ ਰੁਕਣ ਦੇ ਸਥਾਨ।",
    },
    "jyotirlinga-guide": {
      title: "ਜਯੋਤਿਰਲਿੰਗ ਗਾਈਡ",
      description: "12 ਜਯੋਤਿਰਲਿੰਗਾਂ ਲਈ ਸੰਪੂਰਨ ਗਾਈਡ — ਇਤਿਹਾਸ, ਸਮਾਂ ਅਤੇ ਯਾਤਰਾ।",
    },
    "shakti-peeth-guide": {
      title: "ਸ਼ਕਤੀ ਪੀਠ ਗਾਈਡ",
      description: "ਸਭ ਤੋਂ ਵੱਧ ਵੇਖੇ ਗਏ ਸ਼ਕਤੀ ਪੀਠ — ਕਹਾਣੀਆਂ ਅਤੇ ਕਿਵੇਂ ਪਹੁੰਚਣਾ ਹੈ।",
    },
    "nearby-temples": {
      title: "ਨੇੜਲੇ ਮੰਦਰ",
      description: "ਦੂਰੀ ਅਤੇ ਵੇਰਵਿਆਂ ਦੇ ਨਾਲ ਤੁਹਾਡੇ ਸੁਰੱਖਿਅਤ ਕੀਤੇ ਸਥਾਨ ਦੇ ਸਭ ਤੋਂ ਨੇੜਲੇ ਮੰਦਰ ਲੱਭੋ।",
    },

    // CALCULATORS
    "kundli-generator": {
      title: "ਕੁੰਡਲੀ ਜਨਰੇਟਰ",
      description: "ਰਾਸ਼ੀ, ਨਕਸ਼ਤਰ, ਤਿਥੀ ਅਤੇ ਯੋਗ ਦੇ ਨਾਲ ਮੁਫਤ ਵੈਦਿਕ ਕੁੰਡਲੀ।",
      intro:
        "ਜਨਮ ਮਿਤੀ ਅਤੇ ਸਮੇਂ ਤੋਂ ਇੱਕ ਤੇਜ਼ ਵੈਦਿਕ ਸਨੈਪਸ਼ਾਟ — ਰਾਸ਼ੀ, ਨਕਸ਼ਤਰ, ਤਿਥੀ, ਯੋਗ ਅਤੇ ਨਾਮਕਰਨ ਦੇ ਅੱਖਰ।",
    },
    "rashi-calculator": {
      title: "ਰਾਸ਼ੀ ਕੈਲਕੁਲੇਟਰ",
      description: "ਜਨਮ ਮਿਤੀ ਅਤੇ ਸਮੇਂ ਤੋਂ ਆਪਣੀ ਚੰਦਰ ਰਾਸ਼ੀ (ਰਾਸ਼ੀ) ਲੱਭੋ।",
    },
    "nakshatra-finder": {
      title: "ਨਕਸ਼ਤਰ ਖੋਜਕ",
      description: "ਆਪਣਾ ਜਨਮ ਨਕਸ਼ਤਰ, ਪਦ ਅਤੇ ਇਸਦੇ ਸ਼ਾਸਕ ਦੇਵਤਾ ਦੀ ਖੋਜ ਕਰੋ।",
    },
    "dasha-calculator": {
      title: "ਵਿਮਸ਼ੋਤਰੀ ਦਸ਼ਾ",
      description: "ਤੁਹਾਡੇ ਜਨਮ ਨਕਸ਼ਤਰ ਤੋਂ ਗਣਨਾ ਕੀਤੀ ਗਈ ਵਿਮਸ਼ੋਤਰੀ ਮਹਾਦਸ਼ਾ ਸਮਾਂਰੇਖਾ।",
      intro: "ਤੁਹਾਡੇ ਜਨਮ ਨਕਸ਼ਤਰ ਤੋਂ ਗਣਨਾ ਕੀਤੀ ਗਈ ਤੁਹਾਡੀ ਵਿਮਸ਼ੋਤਰੀ ਮਹਾਦਸ਼ਾ ਸਮਾਂਰੇਖਾ।",
    },
    "gemstone-recommender": {
      title: "ਰਤਨ ਸਿਫਾਰਸ਼ਕਰਤਾ",
      description: "ਤੁਹਾਡੀ ਰਾਸ਼ੀ ਦੇ ਅਧਾਰ 'ਤੇ ਵਿਅਕਤੀਗਤ ਰਤਨ ਸਿਫਾਰਸ਼।",
    },
    numerology: { title: "ਅੰਕ ਵਿਗਿਆਨ", description: "ਅਰਥ ਦੇ ਨਾਲ ਜੀਵਨ-ਮਾਰਗ ਅਤੇ ਕਿਸਮਤ ਨੰਬਰ।" },
    "name-numerology": {
      title: "ਨਾਮ ਅੰਕ ਵਿਗਿਆਨ",
      description: "ਅਰਥ ਅਤੇ ਗ੍ਰਹਿ ਵਾਈਬ੍ਰੇਸ਼ਨ ਦੇ ਨਾਲ ਕਿਸੇ ਵੀ ਨਾਮ ਦਾ ਅੰਕ ਵਿਗਿਆਨਕ ਮੁੱਲ।",
    },
    "birthstone-finder": {
      title: "ਜਨਮ ਪੱਥਰ ਖੋਜਕ",
      description: "ਕਿਸੇ ਵੀ ਜਨਮ ਮਹੀਨੇ ਲਈ ਰਵਾਇਤੀ ਪੱਛਮੀ ਜਨਮ ਪੱਥਰ।",
    },

    // SANSKRIT
    "sanskrit-dictionary": {
      title: "ਸੰਸਕ੍ਰਿਤ ਡਿਕਸ਼ਨਰੀ",
      description: "ਅਰਥ ਅਤੇ ਮੂਲ ਦੇ ਨਾਲ 60+ ਮੁੱਖ ਸੰਸਕ੍ਰਿਤ ਸ਼ਬਦਾਂ ਦੀ ਖੋਜ ਕਰੋ।",
    },
    transliteration: {
      title: "IAST → ਦੇਵਨਾਗਰੀ",
      description: "IAST ਜਾਂ ਫੋਨੇਟਿਕ ਅੰਗਰੇਜ਼ੀ ਨੂੰ ਤੁਰੰਤ ਦੇਵਨਾਗਰੀ ਵਿੱਚ ਬਦਲੋ।",
      intro:
        "IAST ਜਾਂ ਅੰਗਰੇਜ਼ੀ ਫੋਨੇਟਿਕ ਟਾਈਪ ਕਰੋ; ਤੁਰੰਤ ਦੇਵਨਾਗਰੀ ਪ੍ਰਾਪਤ ਕਰੋ। ਕੋਸ਼ਿਸ਼ ਕਰੋ: 'om namah shivaya'।",
    },
    "sandhi-splitter": {
      title: "ਸੰਧੀ ਸਪਲਿਟਰ",
      description: "ਆਮ ਸੰਯੁਕਤ ਸ਼ਬਦਾਂ ਲਈ ਨਿਯਮ-ਅਧਾਰਤ ਸੰਧੀ ਸਪਲਿਟਰ।",
    },
    "shloka-analyzer": {
      title: "ਸ਼ਲੋਕ ਵਿਸ਼ਲੇਸ਼ਕ",
      description: "ਕਿਸੇ ਵੀ ਸ਼ਲੋਕ ਦੇ ਅੱਖਰਾਂ, ਪਦਾਂ ਦੀ ਗਿਣਤੀ ਕਰੋ, ਅਤੇ ਛੰਦਾਂ ਦਾ ਅੰਦਾਜ਼ਾ ਲਗਾਓ।",
    },
    "devanagari-typing": {
      title: "ਦੇਵਨਾਗਰੀ ਟਾਈਪਿੰਗ",
      description: "ਆਨ-ਸਕ੍ਰੀਨ ਕੀਬੋਰਡ ਨਾਲ ਦੇਵਨਾਗਰੀ ਵਿੱਚ ਟਾਈਪ ਕਰੋ।",
    },
    "verb-conjugator": {
      title: "ਕਿਰਿਆ ਸੰਯੋਜਕ",
      description: "ਵਰਤਮਾਨ ਕਾਲ (ਲਟ ਲਕਾਰ) ਵਿੱਚ ਆਮ ਸੰਸਕ੍ਰਿਤ ਧਾਤੂਆਂ ਨੂੰ ਸੰਯੋਜਿਤ ਕਰੋ।",
    },
    "sanskrit-word-of-day": {
      title: "ਦਿਨ ਦਾ ਸੰਸਕ੍ਰਿਤ ਸ਼ਬਦ",
      description: "ਹਰ ਰੋਜ਼ ਇੱਕ ਨਵਾਂ ਸੰਸਕ੍ਰਿਤ ਸ਼ਬਦ ਅਰਥ ਅਤੇ ਮੂਲ ਦੇ ਨਾਲ।",
    },

    // BABY NAMES
    "names-by-nakshatra": {
      title: "ਨਕਸ਼ਤਰ ਅਨੁਸਾਰ ਨਾਮ",
      description: "ਤੁਹਾਡੇ ਬੱਚੇ ਦੇ ਜਨਮ ਨਕਸ਼ਤਰ ਪਦ ਦੇ ਅੱਖਰਾਂ ਨਾਲ ਮੇਲ ਖਾਂਦੇ ਬੱਚੇ ਦੇ ਨਾਮ।",
    },
    "names-by-rashi": {
      title: "ਰਾਸ਼ੀ ਅਨੁਸਾਰ ਨਾਮ",
      description: "ਚੰਦਰ-ਰਾਸ਼ੀ ਦੇ ਅੱਖਰਾਂ ਅਨੁਸਾਰ ਬੱਚੇ ਦੇ ਨਾਮ — ਸੁੰਦਰ ਅਤੇ ਅਰਥਪੂਰਨ।",
    },
    "names-by-deity": {
      title: "ਦੇਵਤਾ ਅਨੁਸਾਰ ਨਾਮ",
      description: "ਸ਼ਿਵ, ਵਿਸ਼ਨੂੰ, ਦੇਵੀ, ਗਣੇਸ਼ ਅਤੇ ਹੋਰਾਂ ਤੋਂ ਪ੍ਰੇਰਿਤ ਨਾਮ।",
    },
    "names-by-meaning": {
      title: "ਅਰਥ ਅਨੁਸਾਰ ਨਾਮ",
      description: "ਅਰਥ ਅਨੁਸਾਰ ਨਾਮ ਲੱਭੋ — ਰੋਸ਼ਨੀ, ਸ਼ਕਤੀ, ਬੁੱਧੀ, ਪਿਆਰ ਅਤੇ ਹੋਰ।",
    },
    "twin-names": {
      title: "ਜੁੜਵਾਂ ਨਾਮ",
      description: "ਸੰਸਕ੍ਰਿਤ ਪਰੰਪਰਾ ਤੋਂ ਲਏ ਗਏ ਜੁੜਵਾਂ ਲਈ ਸੁੰਦਰਤਾ ਨਾਲ ਜੋੜੇ ਗਏ ਨਾਮ।",
    },
    "ai-name-suggester": {
      title: "AI ਨਾਮ ਸੁਝਾਅ ਦੇਣ ਵਾਲਾ",
      description: "ਨਕਸ਼ਤਰ, ਅੱਖਰ ਅਤੇ ਅਰਥ ਅਨੁਸਾਰ AI ਬੱਚੇ ਦੇ ਨਾਮ ਦੇ ਸੁਝਾਅ।",
    },

    // LEARNING
    "bhagavad-gita": {
      title: "ਭਗਵਦ ਗੀਤਾ — ਅਧਿਆਇ ਪਾਠਕ",
      description: "ਗੀਤਾ ਦੇ ਸਾਰੇ 18 ਅਧਿਆਇ ਸੰਖੇਪ ਅਤੇ ਮੁੱਖ ਸਿੱਖਿਆ ਦੇ ਨਾਲ।",
    },
    "upanishads-guide": {
      title: "ਉਪਨਿਸ਼ਦ ਗਾਈਡ",
      description: "ਮੁੱਖ ਉਪਨਿਸ਼ਦ ਵਿਸ਼ੇ ਅਤੇ ਮੁੱਖ ਸਿੱਖਿਆ ਦੇ ਨਾਲ।",
    },
    "vedas-introduction": {
      title: "ਵੇਦਾਂ ਦੀ ਜਾਣ-ਪਛਾਣ",
      description: "ਚਾਰ ਵੇਦਾਂ ਦੀ ਇੱਕ ਪਹੁੰਚਯੋਗ ਜਾਣ-ਪਛਾਣ।",
    },
    "yoga-sutras": {
      title: "ਯੋਗ ਸੂਤਰਾਂ ਦੀ ਸੰਖੇਪ ਜਾਣਕਾਰੀ",
      description: "ਪਤੰਜਲੀ ਦੇ ਯੋਗ ਸੂਤਰਾਂ ਦੇ ਚਾਰ ਪਦ ਮੁੱਖ ਆਇਤਾਂ ਦੇ ਨਾਲ।",
    },
    "sanatan-timeline": {
      title: "ਸਨਾਤਨ ਸਮਾਂਰੇਖਾ",
      description: "ਸਨਾਤਨ ਧਰਮ ਦੀ ਇੱਕ ਵਿਜ਼ੂਅਲ ਸਮਾਂਰੇਖਾ — ਵੈਦਿਕ ਯੁੱਗ ਤੋਂ ਅੱਜ ਤੱਕ।",
    },
    "deity-encyclopedia": {
      title: "ਦੇਵਤਾ ਐਨਸਾਈਕਲੋਪੀਡੀਆ",
      description: "22+ ਦੇਵਤੇ ਆਈਕੋਨੋਗ੍ਰਾਫੀ, ਮੰਤਰਾਂ ਅਤੇ ਲੋਰ ਦੇ ਨਾਲ।",
    },
    "mahabharata-summary": {
      title: "ਮਹਾਭਾਰਤ ਸੰਖੇਪ",
      description: "ਮਹਾਭਾਰਤ ਦੇ ਸਾਰੇ 18 ਪਰਵ ਵਿਸ਼ਿਆਂ ਅਤੇ ਕਹਾਣੀ ਚਾਪ ਦੇ ਨਾਲ।",
    },
    "ramayana-summary": {
      title: "ਰਾਮਾਇਣ ਸੰਖੇਪ",
      description: "ਵਾਲਮੀਕੀ ਰਾਮਾਇਣ ਦੇ ਸੱਤ ਕਾਂਡ ਇੱਕ ਪੰਨੇ ਵਿੱਚ।",
    },
    "puranas-overview": {
      title: "18 ਮਹਾਪੁਰਾਣ",
      description: "18 ਮਹਾਪੁਰਾਣਾਂ ਦੀ ਪੂਰੀ ਸੂਚੀ — ਦੇਵਤਾ, ਵਿਸ਼ਾ ਅਤੇ ਆਇਤਾਂ ਦੀ ਗਿਣਤੀ।",
    },
    "deity-of-the-day": {
      title: "ਦਿਨ ਦਾ ਦੇਵਤਾ",
      description: "ਹਰ ਰੋਜ਼ ਇੱਕ ਘੁੰਮਦਾ ਦੇਵਤਾ — ਮੰਤਰ ਅਤੇ ਮਹੱਤਵ ਦੇ ਨਾਲ।",
    },
    "nakshatra-guide": {
      title: "27 ਨਕਸ਼ਤਰ ਗਾਈਡ",
      description: "ਸਾਰੇ 27 ਨਕਸ਼ਤਰ ਸੁਆਮੀ, ਦੇਵਤਾ, ਪ੍ਰਤੀਕ ਅਤੇ ਸੁਭਾਅ ਦੇ ਨਾਲ।",
    },
    "rashi-guide": {
      title: "12 ਰਾਸ਼ੀਆਂ ਗਾਈਡ",
      description: "ਸਾਰੀਆਂ 12 ਰਾਸ਼ੀਆਂ ਸੁਆਮੀ, ਤੱਤ ਅਤੇ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ ਦੇ ਨਾਲ।",
    },
  },
  or: {
    // Odia (ଓଡ଼ିଆ) — auto-translated
    // PANCHANG
    "todays-panchang": {
      title: "ଆଜିର ପଞ୍ଚାଙ୍ଗ",
      description:
        "ଆଜିର ସମ୍ପୂର୍ଣ୍ଣ ପଞ୍ଚାଙ୍ଗ — ତିଥି, ନକ୍ଷତ୍ର, ଯୋଗ, କରଣ, ସୂର୍ଯ୍ୟୋଦୟ, ସୂର୍ଯ୍ୟାସ୍ତ ଏବଂ ଅଶୁଭ ସମୟ।",
      intro: "ଆପଣଙ୍କ ସମ୍ପୂର୍ଣ୍ଣ ଦୃକ-ସଠିକ୍ ପଞ୍ଚାଙ୍ଗ — ଆପଣଙ୍କ ସହର ପାଇଁ ସିଧାସଳଖ ଗଣନା କରାଯାଇଛି।",
    },
    "todays-tithi": {
      title: "ଆଜିର ତିଥି",
      description: "ଯେକୌଣସି ତାରିଖ ଏବଂ ସହର ପାଇଁ ସଠିକ୍ ତିଥି — ପକ୍ଷ ଏବଂ ସଠିକ୍ ଶେଷ ସମୟ ସହିତ।",
    },
    "todays-nakshatra": {
      title: "ଆଜିର ନକ୍ଷତ୍ର",
      description: "ଆଜିର ନକ୍ଷତ୍ର ପାଦ, ଶାସକ ଗ୍ରହ, ଦେବତା ଏବଂ ଶେଷ ସମୟ ସହିତ।",
    },
    "todays-yoga": {
      title: "ଆଜିର ଯୋଗ",
      description: "ଆଜିର ଯୋଗ (୨୭ଟି ମଧ୍ୟରୁ ଗୋଟିଏ) ପ୍ରଗତି ଏବଂ ଶେଷ ସମୟ ସହିତ।",
    },
    "todays-karana": {
      title: "ଆଜିର କରଣ",
      description: "ଆଜିର କରଣ ପ୍ରକାର (ଚଳ / ସ୍ଥିର) ଏବଂ ସଠିକ୍ ଶେଷ ସମୟ ସହିତ।",
    },
    "todays-sunrise": {
      title: "ଆଜିର ସୂର୍ଯ୍ୟୋଦୟ",
      description:
        "ଯେକୌଣସି ସହର ପାଇଁ ସଠିକ୍ ସୂର୍ଯ୍ୟୋଦୟ — ସୂର୍ଯ୍ୟାସ୍ତ, ସୌର ମଧ୍ୟାହ୍ନ ଏବଂ ଦିନର ଦୈର୍ଘ୍ୟ ସହିତ।",
    },
    "todays-sunset": {
      title: "ଆଜିର ସୂର୍ଯ୍ୟାସ୍ତ",
      description:
        "ଯେକୌଣସି ସହର ପାଇଁ ସଠିକ୍ ସୂର୍ଯ୍ୟାସ୍ତ — ସୂର୍ଯ୍ୟୋଦୟ, ସୌର ମଧ୍ୟାହ୍ନ ଏବଂ ଦିନର ଦୈର୍ଘ୍ୟ ସହିତ।",
    },
    "rahu-kaal": {
      title: "ରାହୁ କାଳ",
      description: "ଆଜିର ରାହୁ କାଳ ସମୟ — ସ୍ଥାନ-ଜାଣିବା ଏବଂ ମିନିଟ୍ ପର୍ଯ୍ୟନ୍ତ।",
    },
    "gulika-kaal": {
      title: "ଗୁଳିକା କାଳ",
      description: "ବାସ୍ତବ ସୂର୍ଯ୍ୟୋଦୟ / ସୂର୍ଯ୍ୟାସ୍ତ ସହିତ ଆଜିର ଗୁଳିକା କାଳ ସମୟ।",
    },
    yamaganda: { title: "ଯମଗଣ୍ଡ", description: "ଆଜିର ଯମଗଣ୍ଡ ସମୟ — ଦିନର ଆଠ ଭାଗ ମଧ୍ୟରୁ ଗୋଟିଏ।" },
    choghadiya: { title: "ଚୋଘଡ଼ିଆ", description: "ଦିନ ଓ ରାତିର ଚୋଘଡ଼ିଆ ଶୁଭ ଓ ଅଶୁଭ ସମୟ ସହିତ।" },
    "panchang-by-date": {
      title: "ତାରିଖ ଅନୁଯାୟୀ ପଞ୍ଚାଙ୍ଗ",
      description: "ପୃଥିବୀର ଯେକୌଣସି ତାରିଖ ଏବଂ ଯେକୌଣସି ସହର ପାଇଁ ସମ୍ପୂର୍ଣ୍ଣ ପଞ୍ଚାଙ୍ଗ ଦେଖନ୍ତୁ।",
    },
    "hora-chart": {
      title: "ହୋରା ଚାର୍ଟ",
      description: "ଯେକୌଣସି କାର୍ଯ୍ୟ ପାଇଁ ସଠିକ୍ ସମୟ ବାଛିବା ପାଇଁ ଗ୍ରହ ହୋରା ଚାର୍ଟ।",
      intro: "ଦିନ ଓ ରାତିର ୨୪ଟି ଗ୍ରହ ହୋରା — କାର୍ଯ୍ୟ କରିବା ପାଇଁ ସଠିକ୍ ସମୟ ବାଛିବା ପାଇଁ ଉପଯୁକ୍ତ।",
    },
    "sunrise-sunset-atlas": {
      title: "ସୂର୍ଯ୍ୟୋଦୟ ଓ ସୂର୍ଯ୍ୟାସ୍ତ ଆଟଲାସ୍",
      description: "ବିଶ୍ୱର ବିଭିନ୍ନ ସହରରେ ସୂର୍ଯ୍ୟୋଦୟ ଏବଂ ସୂର୍ଯ୍ୟାସ୍ତ ତୁଳନା କରନ୍ତୁ।",
    },
    "moon-phase": {
      title: "ଚନ୍ଦ୍ର କଳା",
      description: "ଯେକୌଣସି ତାରିଖ ପାଇଁ ବର୍ତ୍ତମାନର ଚନ୍ଦ୍ର କଳା, ଆଲୋକ ଏବଂ କଳା କୋଣ।",
      intro: "ବର୍ତ୍ତମାନର ଚନ୍ଦ୍ର କଳା, ଆଲୋକ ଏବଂ କଳା କୋଣ — ଯେକୌଣସି ତାରିଖ ପାଇଁ ସିଧାସଳଖ ଗଣନା କରାଯାଇଛି।",
    },
    "abhijit-muhurat": {
      title: "ଅଭିଜିତ ମୁହୂର୍ତ୍ତ",
      description: "ଆଜିର ଅଭିଜିତ ମୁହୂର୍ତ୍ତ ସମୟ — ସବୁଠାରୁ ଶୁଭ ୪୮ ମିନିଟ୍।",
      intro:
        "ଅଭିଜିତ ହେଉଛି ୧୫ଟି ଦିନ-ମୁହୂର୍ତ୍ତ ମଧ୍ୟରୁ ୮ମ — ସୌର ମଧ୍ୟାହ୍ନକୁ କେନ୍ଦ୍ର କରି ୪୮ ମିନିଟ୍। ଦିନର ସବୁଠାରୁ ଶୁଭ ସମୟ (ବୁଧବାର ବ୍ୟତୀତ)।",
    },
    "brahma-muhurat": {
      title: "ବ୍ରହ୍ମ ମୁହୂର୍ତ୍ତ",
      description: "ସୂର୍ଯ୍ୟୋଦୟ ପୂର୍ବରୁ ବ୍ରହ୍ମ ମୁହୂର୍ତ୍ତ ସମୟ — ଧ୍ୟାନ ପାଇଁ ଆଦର୍ଶ।",
      intro:
        "ସୂର୍ଯ୍ୟୋଦୟ ପୂର୍ବରୁ ଦୁଇଟି ମୁହୂର୍ତ୍ତ — ସତ୍ତ୍ୱ-ସମୃଦ୍ଧ ସମୟ ଯେତେବେଳେ ମନ ସାଧନା ପାଇଁ ସବୁଠାରୁ ଗ୍ରହଣୀୟ ହୋଇଥାଏ।",
    },

    // FESTIVALS
    "festival-calendar-2026": {
      title: "ପର୍ବପର୍ବାଣୀ କ୍ୟାଲେଣ୍ଡର ୨୦୨୬",
      description: "୨୦୨୬ର ପ୍ରତ୍ୟେକ Sanatan ପର୍ବ, ମାସ ଅନୁଯାୟୀ, ଆଞ୍ଚଳିକ ଏବଂ ବର୍ଗ ଫିଲ୍ଟର ସହିତ।",
    },
    "festival-countdown": {
      title: "ପର୍ବ କାଉଣ୍ଟଡାଉନ୍",
      description: "୨୦୨୬ର ଯେକୌଣସି ପର୍ବ ପାଇଁ ଏକ ଲାଇଭ୍ କାଉଣ୍ଟଡାଉନ୍ — ସେକେଣ୍ଡ ପର୍ଯ୍ୟନ୍ତ।",
    },
    "festival-finder": {
      title: "ପର୍ବ ଖୋଜକ",
      description: "ନାମ, ଦେବତା କିମ୍ବା ମାସ ଅନୁଯାୟୀ ପର୍ବ ଖୋଜନ୍ତୁ — ଯୋଜନା ପାଇଁ ଉପଯୁକ୍ତ।",
    },
    "vrat-calendar": {
      title: "ବ୍ରତ କ୍ୟାଲେଣ୍ଡର",
      description: "ଉପବାସ ନିୟମ, ସମୟ ଏବଂ ମନ୍ତ୍ର ସହିତ ପ୍ରତ୍ୟେକ ମୁଖ୍ୟ ବ୍ରତ।",
    },
    "ekadashi-dates": {
      title: "ଏକାଦଶୀ ତାରିଖ",
      description: "ବର୍ଣ୍ଣନା ଏବଂ ବ୍ରତ ବିଧି ସହିତ ୨୦୨୬ର ପ୍ରତ୍ୟେକ ଏକାଦଶୀ।",
      intro: "ବର୍ଣ୍ଣନା ଏବଂ ବ୍ରତ ବିଧି ସହିତ ୨୦୨୬ର ସମସ୍ତ ୨୪ଟି ଏକାଦଶୀ।",
    },
    "purnima-amavasya": {
      title: "ପୂର୍ଣ୍ଣିମା ଓ ଅମାବାସ୍ୟା",
      description: "ଆଞ୍ଚଳିକ ମହତ୍ତ୍ୱ ସହିତ ସମସ୍ତ ପୂର୍ଣ୍ଣିମା ଏବଂ ଅମାବାସ୍ୟା ତାରିଖ।",
    },
    "regional-festivals": {
      title: "ଆଞ୍ଚଳିକ ପର୍ବ",
      description: "ପ୍ରତ୍ୟେକ ରାଜ୍ୟ ଏବଂ ସମ୍ପ୍ରଦାୟ ପାଇଁ ଅନନ୍ୟ ପର୍ବଗୁଡ଼ିକୁ ଆବିଷ୍କାର କରନ୍ତୁ।",
    },
    "pradosh-vrat": {
      title: "ପ୍ରଦୋଷ ବ୍ରତ ତାରିଖ",
      description: "ଦିନ-ପ୍ରକାର (ସୋମ, ଭୌମ, ଶନି) ସହିତ ପ୍ରତ୍ୟେକ ପ୍ରଦୋଷ ବ୍ରତ ତାରିଖ।",
    },
    "sankashti-chaturthi": {
      title: "ସଙ୍କଷ୍ଟି ଚତୁର୍ଥୀ",
      description: "ମାସିକ ସଙ୍କଷ୍ଟି ଚତୁର୍ଥୀ ତାରିଖ — ଗଣେଶଙ୍କ କୃପାର ଦିନ।",
    },
    "festival-of-the-day": {
      title: "ଆଜିର ପର୍ବ",
      description: "ଆଜିର କିମ୍ବା ପରବର୍ତ୍ତୀ Sanatan ପର୍ବ — ଏକ-ଦୃଷ୍ଟି କାର୍ଡ।",
    },
    "upcoming-festivals": {
      title: "ଆଗାମୀ ପର୍ବ",
      description: "ଆଗାମୀ ୧୨ଟି ପର୍ବ — ଆଗାମୀ ସପ୍ତାହଗୁଡ଼ିକର ଯୋଜନା କରନ୍ତୁ।",
    },

    // PUJA
    "puja-checklist-generator": {
      title: "ପୂଜା ଚେକଲିଷ୍ଟ ଜେନେରେଟର",
      description: "୬ଟି ମୁଖ୍ୟ ପୂଜା ପାଇଁ ଇଣ୍ଟରାକ୍ଟିଭ୍ ସାମଗ୍ରୀ, ବିଧି ଏବଂ ମନ୍ତ୍ର ଚେକଲିଷ୍ଟ।",
    },
    "aarti-collection": {
      title: "ଆରତୀ ସଂଗ୍ରହ",
      description: "ସବୁଠାରୁ ପ୍ରିୟ ଆରତୀଗୁଡ଼ିକର ହାତ-ବାଛିଥିବା ସଂଗ୍ରହ, ସୁନ୍ଦର ଭାବରେ ଟାଇପ୍‌ସେଟ୍।",
    },
    "chalisa-collection": {
      title: "ଚାଳିସା ସଂଗ୍ରହ",
      description: "ହନୁମାନ, ଦୁର୍ଗା, ଶିବ, ଗଣେଶ ଏବଂ ସରସ୍ୱତୀ ଚାଳିସା ଦେବନାଗରୀରେ।",
    },
    "puja-vidhi-planner": {
      title: "ପୂଜା ବିଧି ପ୍ଲାନର",
      description:
        "ଯେକୌଣସି ପୂଜା ପାଇଁ ଏକ ପଦକ୍ଷେପ-ପଦକ୍ଷେପ ଯୋଜନାକାରୀ — ସଙ୍କଳ୍ପ, ମନ୍ତ୍ର, ଆରତୀ ଏବଂ ସମୟ ବଜେଟ୍।",
    },
    "samagri-checklist": {
      title: "ସାମଗ୍ରୀ ଚେକଲିଷ୍ଟ",
      description: "ଆଠଟି ମୁଖ୍ୟ ପୂଜା ପାଇଁ ପରିମାଣ ସହିତ କ୍ୟୁରେଟେଡ୍ ସାମଗ୍ରୀ ତାଲିକା।",
    },
    "sankalp-generator": {
      title: "ସଙ୍କଳ୍ପ ଜେନେରେଟର",
      description: "ଆପଣଙ୍କ ନାମ, ଗୋତ୍ର, ତାରିଖ ଏବଂ ସ୍ଥାନ ସହିତ ସଠିକ୍ ସଙ୍କଳ୍ପ ଉତ୍ପନ୍ନ କରନ୍ତୁ।",
    },
    "griha-pravesh-planner": {
      title: "ଗୃହ ପ୍ରବେଶ ପ୍ଲାନର",
      description: "ଆପଣଙ୍କ ଗୃହ ପ୍ରବେଶ ପାଇଁ ସମ୍ପୂର୍ଣ୍ଣ ପଦକ୍ଷେପ-ପଦକ୍ଷେପ ମାର୍ଗଦର୍ଶିକା।",
    },
    "havan-guide": {
      title: "ହବନ ଗାଇଡ୍",
      description: "ସାମଗ୍ରୀ, ପ୍ରକ୍ରିୟା ଏବଂ ନିରାପତ୍ତା ଟିପ୍ସ ସହିତ ସମ୍ପୂର୍ଣ୍ଣ ହବନ ଗାଇଡ୍।",
    },
    "aarti-thali-guide": {
      title: "ଆରତୀ ଥାଳି ଗାଇଡ୍",
      description: "ଆରତୀ ଥାଳିରେ ଥିବା ପ୍ରତ୍ୟେକ ବସ୍ତୁ ଏବଂ ଏହାର ପ୍ରତୀକାତ୍ମକ ଅର୍ଥ।",
    },
    "prasad-recipes": {
      title: "ପ୍ରସାଦ ରେସିପି",
      description: "ପାରମ୍ପରିକ ପ୍ରସାଦ ରେସିପି — ମୋଦକ, ପଞ୍ଜିରୀ, ଶିରା ଏବଂ ଅଧିକ।",
    },

    // MANTRAS
    "digital-jaap-counter": {
      title: "ଡିଜିଟାଲ୍ ଜାପ୍ କାଉଣ୍ଟର",
      description: "୧୦୮-ମାଳି ପ୍ରଗତି ଏବଂ ଆଜୀବନ ଗଣନା ସହିତ ବିଭ୍ରାଟ-ମୁକ୍ତ ଜାପ୍ କାଉଣ୍ଟର।",
    },
    "om-counter": {
      title: "ଓମ୍ କାଉଣ୍ଟର",
      description: "ଏକ କେନ୍ଦ୍ରିତ ଓମ୍ କାଉଣ୍ଟର — ମାଳି ପ୍ରଗତି ଏବଂ କୋମଳ ଘଣ୍ଟି ସହିତ ॐ ଜପ କରନ୍ତୁ।",
    },
    "mala-counter": {
      title: "ମାଳା କାଉଣ୍ଟର",
      description: "ଏକ ନୀରବ ମାଳା କାଉଣ୍ଟର — ମାଳି, ମାଳା ଏବଂ ଆଜୀବନ ଗଣନା ଟ୍ରାକ୍ କରନ୍ତୁ।",
    },
    "mantra-timer": {
      title: "ମନ୍ତ୍ର ଟାଇମର",
      description: "ଏକ କୋମଳ ସମାପ୍ତି ଘଣ୍ଟି ସହିତ ସମୟୋଚିତ ମନ୍ତ୍ର ଅଧିବେଶନ ପାଇଁ ଏକ କୋମଳ ଟାଇମର।",
    },
    "stotra-collection": {
      title: "ସ୍ତୋତ୍ର ସଂଗ୍ରହ",
      description: "ଶାସ୍ତ୍ରୀୟ ସ୍ତୋତ୍ର — ଶିବ ତାଣ୍ଡବ, ଲିଙ୍ଗାଷ୍ଟକମ୍, ମହାମୃତ୍ୟୁଞ୍ଜୟ ଏବଂ ଅଧିକ।",
    },
    "daily-quote": {
      title: "ଦୈନିକ ଉଦ୍ଧୃତି",
      description: "ପ୍ରତ୍ୟେକ ଦିନ ଏକ ହାତ-ବାଛିଥିବା Sanatan ଉଦ୍ଧୃତି — Gita, Upanishads ଏବଂ ଅଧିକ।",
    },
    "daily-shlok": {
      title: "ଦୈନିକ ଶ୍ଳୋକ",
      description: "ଦେବନାଗରୀରେ ଅନୁବାଦ ଏବଂ ଅର୍ଥ ସହିତ ଏକ ଦୈନିକ ଶ୍ଳୋକ।",
    },
    "mantra-library": {
      title: "ମନ୍ତ୍ର ଲାଇବ୍ରେରୀ",
      description: "ଦେବନାଗରୀ, IAST ଏବଂ ଅର୍ଥ ସହିତ ୩୦+ ମନ୍ତ୍ରର ଏକ କ୍ୟୁରେଟେଡ୍ ଲାଇବ୍ରେରୀ।",
    },
    "beej-mantras": {
      title: "ବୀଜ ମନ୍ତ୍ର",
      description: "ଦେବତା, ଅର୍ଥ ଏବଂ ଉଚ୍ଚାରଣ ମାର୍ଗଦର୍ଶିକା ସହିତ ପ୍ରତ୍ୟେକ ବୀଜ ମନ୍ତ୍ର।",
    },
    "deity-mantras": {
      title: "ଦେବତା ମନ୍ତ୍ର",
      description: "ଦେବତା ଅନୁଯାୟୀ ସଂଗଠିତ ମନ୍ତ୍ର — Shiv, Vishnu, ଦେବୀ, ଗଣେଶ ଏବଂ ଅଧିକ।",
    },
    "mantra-of-the-day": {
      title: "ଆଜିର ମନ୍ତ୍ର",
      description: "ପ୍ରତ୍ୟେକ ଦିନ ଏକ ଘୂର୍ଣ୍ଣାୟମାନ ପାରମ୍ପରିକ ମନ୍ତ୍ର — ଦେବନାଗରୀ, IAST, ଅର୍ଥ।",
    },
    "gayatri-mantra": {
      title: "ଗାୟତ୍ରୀ ମନ୍ତ୍ର ଗାଇଡ୍",
      description: "ଗାୟତ୍ରୀର ଶବ୍ଦ-ଦ୍ୱାରା-ଶବ୍ଦ ଅର୍ଥ, ଜପ ନିୟମ ଏବଂ ଲାଭ।",
    },
    "mahamrityunjaya-mantra": {
      title: "ମହାମୃତ୍ୟୁଞ୍ଜୟ ଗାଇଡ୍",
      description: "ରୁଦ୍ରଙ୍କ ଆରୋଗ୍ୟ ମନ୍ତ୍ର — ଅର୍ଥ, ଲାଭ ଏବଂ ଜାପ୍ ନିୟମ।",
    },

    // AI
    "ai-dharma-assistant": {
      title: "AI ଧର୍ମ ସହାୟକ",
      description: "Sanatan ଧର୍ମ ବିଷୟରେ ଯାହା ବି ପଚାରନ୍ତୁ ଏବଂ ଏକ ଚିନ୍ତାଶୀଳ, ଉଦ୍ଧୃତ ଉତ୍ତର ପାଆନ୍ତୁ।",
      intro:
        "Sanatan ଧର୍ମ ବିଷୟରେ ଯାହା ବି ପଚାରନ୍ତୁ — ଶାସ୍ତ୍ର, ରୀତିନୀତି, ଦର୍ଶନ — ଏବଂ ଏକ ଚିନ୍ତାଶୀଳ, ଉଦ୍ଧୃତ ଉତ୍ତର ପାଆନ୍ତୁ।",
    },
    "ai-gita-summary": {
      title: "AI Gita ସାରାଂଶ",
      description: "ମୁଖ୍ୟ ଶ୍ଳୋକ ସହିତ ଯେକୌଣସି Bhagavad Gita ଅଧ୍ୟାୟର ତତ୍କ୍ଷଣାତ୍, ବିଶ୍ୱସ୍ତ ସାରାଂଶ।",
    },
    "ai-shlok-explainer": {
      title: "AI ଶ୍ଳୋକ ବ୍ୟାଖ୍ୟାକାରୀ",
      description:
        "ଯେକୌଣସି ଶ୍ଳୋକ ପେଷ୍ଟ କରନ୍ତୁ — ଦେବନାଗରୀ, IAST, ଶବ୍ଦ-ଦ୍ୱାରା-ଶବ୍ଦ ଅର୍ଥ ଏବଂ ବ୍ୟାଖ୍ୟା ପାଆନ୍ତୁ।",
    },
    "ai-festival-guide": {
      title: "AI ପର୍ବ ଗାଇଡ୍",
      description: "ଯେକୌଣସି ପର୍ବ, ବ୍ୟାଖ୍ୟା କରାଯାଇଛି — କାହାଣୀ, ତିଥି, ବିଧି, ସାମଗ୍ରୀ ଏବଂ ମନ୍ତ୍ର।",
    },
    "ai-puja-planner": {
      title: "AI ପୂଜା ପ୍ଲାନର",
      description:
        "ଆପଣଙ୍କ ଅବସର ବର୍ଣ୍ଣନା କରନ୍ତୁ — AI ସଙ୍କଳ୍ପ, ବିଧି ଏବଂ ମନ୍ତ୍ର ସହିତ ଏକ ସମ୍ପୂର୍ଣ୍ଣ ପୂଜା ଯୋଜନା କରେ।",
    },
    "ai-mantra-meaning": {
      title: "AI ମନ୍ତ୍ର ଅର୍ଥ",
      description: "ଯେକୌଣସି ମନ୍ତ୍ର, ଡିକୋଡ୍ କରାଯାଇଛି — ଦେବନାଗରୀ, IAST, ଶବ୍ଦ-ଦ୍ୱାରା-ଶବ୍ଦ ଅର୍ଥ, ଲାଭ।",
    },
    "ai-sanskrit-helper": {
      title: "AI ସଂସ୍କୃତ ସହାୟକ",
      description:
        "ସଂସ୍କୃତ ଅନୁବାଦ କରନ୍ତୁ, ବ୍ୟାକରଣ ଡିକୋଡ୍ କରନ୍ତୁ, ଏବଂ ଉଚ୍ଚାରଣ କରନ୍ତୁ — ପ୍ରତ୍ୟେକ ଥର ଦେବନାଗରୀ ଏବଂ IAST।",
    },
    "mantra-recommender": {
      title: "AI ମନ୍ତ୍ର ସୁପାରିଶକାରୀ",
      description: "ଉଦ୍ଦେଶ୍ୟ, ଦେବତା ଏବଂ ଦିନର ସମୟ ଉପରେ ଆଧାରିତ AI-ଶକ୍ତିପ୍ରାପ୍ତ ମନ୍ତ୍ର ସୁପାରିଶ।",
      intro:
        "ଆପଣଙ୍କ ଉଦ୍ଦେଶ୍ୟ ବର୍ଣ୍ଣନା କରନ୍ତୁ — AI ଅର୍ଥ, ଲାଭ ଏବଂ ଜାପ୍ ଗଣନା ସହିତ ତିନୋଟି ପାରମ୍ପରିକ ମନ୍ତ୍ର ସୁପାରିଶ କରେ।",
    },
    "baby-name-ai": {
      title: "AI ଶିଶୁ ନାମ ସୁପାରିଶକାରୀ",
      description: "ନକ୍ଷତ୍ର, ଅକ୍ଷର, ଅର୍ଥ ଏବଂ ଲିଙ୍ଗ ଅନୁଯାୟୀ AI ଶିଶୁ ନାମ ସୁପାରିଶ।",
      intro: "ନକ୍ଷତ୍ର, ଅକ୍ଷର, ଅର୍ଥ ଏବଂ ଲିଙ୍ଗ ଉପରେ ଆଧାରିତ AI-ନିର୍ମିତ ସଂସ୍କୃତ ନାମ ସୁପାରିଶ।",
    },

    // TEMPLES
    "temple-finder": {
      title: "ମନ୍ଦିର ଖୋଜକ",
      description: "ଏକ-ଟ୍ୟାପ୍ ନିର୍ଦ୍ଦେଶ ସହିତ ୨୦+ ମୁଖ୍ୟ ମନ୍ଦିର ଖୋଜନ୍ତୁ।",
    },
    "temple-directory": {
      title: "ମନ୍ଦିର ଡିରେକ୍ଟୋରୀ",
      description: "ଭାରତର ୨୫+ ମୁଖ୍ୟ ମନ୍ଦିରର ଖୋଜିବା ଯୋଗ୍ୟ ଡିରେକ୍ଟୋରୀ।",
    },
    "darshan-timings": {
      title: "ଦର୍ଶନ ସମୟ",
      description: "ମୁଖ୍ୟ ମନ୍ଦିର ପାଇଁ ଦର୍ଶନ ସମୟ ଏବଂ ଆରତୀ ସୂଚୀ।",
    },
    "char-dham-planner": {
      title: "ଚାରି ଧାମ ପ୍ଲାନର",
      description: "ଆପଣଙ୍କ ଚାରି ଧାମ ଯାତ୍ରା ଯୋଜନା କରନ୍ତୁ — ମାର୍ଗ, ସର୍ବୋତ୍ତମ ମାସ ଏବଂ ରହଣି ସ୍ଥାନ।",
    },
    "jyotirlinga-guide": {
      title: "ଜ୍ୟୋତିର୍ଲିଙ୍ଗ ଗାଇଡ୍",
      description: "୧୨ଟି ଜ୍ୟୋତିର୍ଲିଙ୍ଗ ପାଇଁ ସମ୍ପୂର୍ଣ୍ଣ ମାର୍ଗଦର୍ଶିକା — ଇତିହାସ, ସମୟ ଏବଂ ଯାତ୍ରା।",
    },
    "shakti-peeth-guide": {
      title: "ଶକ୍ତି ପୀଠ ଗାଇଡ୍",
      description: "ସବୁଠାରୁ ଅଧିକ ପରିଦର୍ଶିତ ଶକ୍ତି ପୀଠ — କାହାଣୀ ଏବଂ କିପରି ପହଞ୍ଚିବେ।",
    },
    "nearby-temples": {
      title: "ନିକଟସ୍ଥ ମନ୍ଦିର",
      description: "ଆପଣଙ୍କ ସଂରକ୍ଷିତ ସ୍ଥାନର ନିକଟତମ ମନ୍ଦିରଗୁଡ଼ିକୁ ଦୂରତା ଏବଂ ବିବରଣୀ ସହିତ ଖୋଜନ୍ତୁ।",
    },

    // CALCULATORS
    "kundli-generator": {
      title: "କୁଣ୍ଡଳୀ ଜେନେରେଟର",
      description: "ରାଶି, ନକ୍ଷତ୍ର, ତିଥି ଏବଂ ଯୋଗ ସହିତ ମାଗଣା ବୈଦିକ କୁଣ୍ଡଳୀ।",
      intro:
        "ଜନ୍ମ ତାରିଖ ଏବଂ ସମୟରୁ ଏକ ଶୀଘ୍ର ବୈଦିକ ସ୍ନାପସଟ୍ — ରାଶି, ନକ୍ଷତ୍ର, ତିଥି, ଯୋଗ ଏବଂ ନାମକରଣ ଅକ୍ଷର।",
    },
    "rashi-calculator": {
      title: "ରାଶି କାଲକୁଲେଟର",
      description: "ଜନ୍ମ ତାରିଖ ଏବଂ ସମୟରୁ ଆପଣଙ୍କ ଚନ୍ଦ୍ର ରାଶି (ରାଶି) ଖୋଜନ୍ତୁ।",
    },
    "nakshatra-finder": {
      title: "ନକ୍ଷତ୍ର ଖୋଜକ",
      description: "ଆପଣଙ୍କ ଜନ୍ମ ନକ୍ଷତ୍ର, ପାଦ ଏବଂ ଏହାର ଶାସକ ଦେବତା ଆବିଷ୍କାର କରନ୍ତୁ।",
    },
    "dasha-calculator": {
      title: "ବିଂଶୋତ୍ତରୀ ଦଶା",
      description: "ଆପଣଙ୍କ ଜନ୍ମ ନକ୍ଷତ୍ରରୁ ଗଣନା କରାଯାଇଥିବା ବିଂଶୋତ୍ତରୀ ମହାଦଶା ଟାଇମଲାଇନ୍।",
      intro: "ଆପଣଙ୍କ ଜନ୍ମ ନକ୍ଷତ୍ରରୁ ଗଣନା କରାଯାଇଥିବା ଆପଣଙ୍କ ବିଂଶୋତ୍ତରୀ ମହାଦଶା ଟାଇମଲାଇନ୍।",
    },
    "gemstone-recommender": {
      title: "ରତ୍ନ ସୁପାରିଶକାରୀ",
      description: "ଆପଣଙ୍କ ରାଶି ଉପରେ ଆଧାରିତ ବ୍ୟକ୍ତିଗତ ରତ୍ନ ସୁପାରିଶ।",
    },
    numerology: { title: "ସଂଖ୍ୟା ଜ୍ୟୋତିଷ", description: "ଅର୍ଥ ସହିତ ଜୀବନ-ପଥ ଏବଂ ଭାଗ୍ୟ ସଂଖ୍ୟା।" },
    "name-numerology": {
      title: "ନାମ ସଂଖ୍ୟା ଜ୍ୟୋତିଷ",
      description: "ଅର୍ଥ ଏବଂ ଗ୍ରହ କମ୍ପନ ସହିତ ଯେକୌଣସି ନାମର ସଂଖ୍ୟା ଜ୍ୟୋତିଷ ମୂଲ୍ୟ।",
    },
    "birthstone-finder": {
      title: "ଜନ୍ମପଥର ଖୋଜକ",
      description: "ଯେକୌଣସି ଜନ୍ମ ମାସ ପାଇଁ ପାରମ୍ପରିକ ପାଶ୍ଚାତ୍ୟ ଜନ୍ମପଥର।",
    },

    // SANSKRIT
    "sanskrit-dictionary": {
      title: "ସଂସ୍କୃତ ଅଭିଧାନ",
      description: "ଅର୍ଥ ଏବଂ ମୂଳ ସହିତ ୬୦+ ମୁଖ୍ୟ ସଂସ୍କୃତ ଶବ୍ଦ ଖୋଜନ୍ତୁ।",
    },
    transliteration: {
      title: "IAST → ଦେବନାଗରୀ",
      description: "IAST କିମ୍ବା ଫୋନେଟିକ୍ ଇଂରାଜୀକୁ ତତ୍କ୍ଷଣାତ୍ ଦେବନାଗରୀରେ ରୂପାନ୍ତର କରନ୍ତୁ।",
      intro:
        "IAST କିମ୍ବା ଇଂରାଜୀ ଫୋନେଟିକ୍ ଟାଇପ୍ କରନ୍ତୁ; ତତ୍କ୍ଷଣାତ୍ ଦେବନାଗରୀ ପାଆନ୍ତୁ। ଚେଷ୍ଟା କରନ୍ତୁ: 'om namah shivaya'।",
    },
    "sandhi-splitter": {
      title: "ସନ୍ଧି ସ୍ପ୍ଲିଟର",
      description: "ସାଧାରଣ ଯୌଗିକ ଶବ୍ଦ ପାଇଁ ନିୟମ-ଆଧାରିତ ସନ୍ଧି ସ୍ପ୍ଲିଟର।",
    },
    "shloka-analyzer": {
      title: "ଶ୍ଳୋକ ବିଶ୍ଳେଷକ",
      description: "ଅକ୍ଷର, ପାଦ ଗଣନା କରନ୍ତୁ, ଏବଂ ଯେକୌଣସି ଶ୍ଳୋକର ଛନ୍ଦ ଅନୁମାନ କରନ୍ତୁ।",
    },
    "devanagari-typing": {
      title: "ଦେବନାଗରୀ ଟାଇପିଂ",
      description: "ଅନ୍-ସ୍କ୍ରିନ୍ କୀବୋର୍ଡ୍ ସହିତ ଦେବନାଗରୀରେ ଟାଇପ୍ କରନ୍ତୁ।",
    },
    "verb-conjugator": {
      title: "କ୍ରିୟା ସଂଯୋଜକ",
      description: "ବର୍ତ୍ତମାନ କାଳରେ (ଲଟ୍ ଲକାର) ସାଧାରଣ ସଂସ୍କୃତ ଧାତୁ ସଂଯୋଗ କରନ୍ତୁ।",
    },
    "sanskrit-word-of-day": {
      title: "ଆଜିର ସଂସ୍କୃତ ଶବ୍ଦ",
      description: "ପ୍ରତ୍ୟେକ ଦିନ ଅର୍ଥ ଏବଂ ମୂଳ ସହିତ ଏକ ନୂତନ ସଂସ୍କୃତ ଶବ୍ଦ।",
    },

    // BABY NAMES
    "names-by-nakshatra": {
      title: "ନକ୍ଷତ୍ର ଅନୁଯାୟୀ ନାମ",
      description: "ଆପଣଙ୍କ ଶିଶୁର ଜନ୍ମ ନକ୍ଷତ୍ର ପାଦ ଅକ୍ଷର ସହିତ ସମନ୍ୱିତ ଶିଶୁ ନାମ।",
    },
    "names-by-rashi": {
      title: "ରାଶି ଅନୁଯାୟୀ ନାମ",
      description: "ଚନ୍ଦ୍ର-ରାଶି ଅକ୍ଷର ଅନୁଯାୟୀ ଶିଶୁ ନାମ — ସୁନ୍ଦର ଏବଂ ଅର୍ଥପୂର୍ଣ୍ଣ।",
    },
    "names-by-deity": {
      title: "ଦେବତା ଅନୁଯାୟୀ ନାମ",
      description: "Shiv, Vishnu, ଦେବୀ, ଗଣେଶ ଏବଂ ଅଧିକଙ୍କ ଦ୍ୱାରା ଅନୁପ୍ରାଣିତ ନାମ।",
    },
    "names-by-meaning": {
      title: "ଅର୍ଥ ଅନୁଯାୟୀ ନାମ",
      description: "ଅର୍ଥ ଅନୁଯାୟୀ ନାମ ଖୋଜନ୍ତୁ — ଆଲୋକ, ଶକ୍ତି, ଜ୍ଞାନ, ପ୍ରେମ ଏବଂ ଅଧିକ।",
    },
    "twin-names": {
      title: "ଯମଜ ନାମ",
      description: "ସଂସ୍କୃତ ପରମ୍ପରାରୁ ନିଆଯାଇଥିବା ଯମଜମାନଙ୍କ ପାଇଁ ସୁନ୍ଦର ଭାବରେ ଯୋଡ଼ା ନାମ।",
    },
    "ai-name-suggester": {
      title: "AI ନାମ ସୁପାରିଶକାରୀ",
      description: "ନକ୍ଷତ୍ର, ଅକ୍ଷର ଏବଂ ଅର୍ଥ ଅନୁଯାୟୀ AI ଶିଶୁ ନାମ ସୁପାରିଶ।",
    },

    // LEARNING
    "bhagavad-gita": {
      title: "Bhagavad Gita — ଅଧ୍ୟାୟ ପାଠକ",
      description: "Gitaର ସମସ୍ତ ୧୮ଟି ଅଧ୍ୟାୟ ସାରାଂଶ ଏବଂ ମୁଖ୍ୟ ଶିକ୍ଷା ସହିତ।",
    },
    "upanishads-guide": {
      title: "Upanishads ଗାଇଡ୍",
      description: "ବିଷୟବସ୍ତୁ ଏବଂ ମୁଖ୍ୟ ଶିକ୍ଷା ସହିତ ମୁଖ୍ୟ Upanishads।",
    },
    "vedas-introduction": { title: "ବେଦ ପରିଚୟ", description: "ଚାରି ବେଦର ଏକ ସହଜ ପରିଚୟ।" },
    "yoga-sutras": {
      title: "ଯୋଗ ସୂତ୍ର ସମୀକ୍ଷା",
      description: "ପତଞ୍ଜଳିଙ୍କ ଯୋଗ ସୂତ୍ରର ଚାରି ପାଦ ମୁଖ୍ୟ ଶ୍ଳୋକ ସହିତ।",
    },
    "sanatan-timeline": {
      title: "Sanatan ଟାଇମଲାଇନ୍",
      description: "Sanatan ଧର୍ମର ଏକ ଭିଜୁଆଲ୍ ଟାଇମଲାଇନ୍ — ବୈଦିକ ଯୁଗରୁ ଆଜି ପର୍ଯ୍ୟନ୍ତ।",
    },
    "deity-encyclopedia": {
      title: "ଦେବତା ଏନସାଇକ୍ଲୋପିଡିଆ",
      description: "୨୨+ ଦେବତା ପ୍ରତିମା, ମନ୍ତ୍ର ଏବଂ ଲୋର ସହିତ।",
    },
    "mahabharata-summary": {
      title: "ମହାଭାରତ ସାରାଂଶ",
      description: "ମହାଭାରତର ସମସ୍ତ ୧୮ଟି ପର୍ବ ବିଷୟବସ୍ତୁ ଏବଂ କାହାଣୀ ଚାପ ସହିତ।",
    },
    "ramayana-summary": {
      title: "ରାମାୟଣ ସାରାଂଶ",
      description: "ବାଲ୍ମୀକି ରାମାୟଣର ସାତଟି କାଣ୍ଡ ଗୋଟିଏ ପୃଷ୍ଠାରେ।",
    },
    "puranas-overview": {
      title: "୧୮ ମହାପୁରାଣ",
      description: "୧୮ଟି ମହାପୁରାଣର ସମ୍ପୂର୍ଣ୍ଣ ତାଲିକା — ଦେବତା, ବିଷୟବସ୍ତୁ ଏବଂ ଶ୍ଳୋକ ସଂଖ୍ୟା।",
    },
    "deity-of-the-day": {
      title: "ଆଜିର ଦେବତା",
      description: "ପ୍ରତ୍ୟେକ ଦିନ ଏକ ଘୂର୍ଣ୍ଣାୟମାନ ଦେବତା — ମନ୍ତ୍ର ଏବଂ ମହତ୍ତ୍ୱ ସହିତ।",
    },
    "nakshatra-guide": {
      title: "୨୭ ନକ୍ଷତ୍ର ଗାଇଡ୍",
      description: "ସମସ୍ତ ୨୭ଟି ନକ୍ଷତ୍ର ସ୍ୱାମୀ, ଦେବତା, ପ୍ରତୀକ ଏବଂ ପ୍ରକୃତି ସହିତ।",
    },
    "rashi-guide": {
      title: "୧୨ ରାଶି ଗାଇଡ୍",
      description: "ସମସ୍ତ ୧୨ଟି ରାଶି ସ୍ୱାମୀ, ଉପାଦାନ ଏବଂ ବୈଶିଷ୍ଟ୍ୟ ସହିତ।",
    },
  },
  as: {
    // Assamese (অসমীয়া) — auto-translated
    // PANCHANG
    "todays-panchang": {
      title: "আজিৰ পঞ্চাংগ",
      description:
        "আজিৰ বাবে সম্পূৰ্ণ পঞ্চাংগ — তিথি, নক্ষত্ৰ, যোগ, কৰণ, সূৰ্যোদয়, সূৰ্যাস্ত আৰু অশুভ সময়।",
      intro: "আপোনাৰ সম্পূৰ্ণ দ্ৰিক-সঠিক পঞ্চাংগ — আপোনাৰ চহৰৰ বাবে লাইভ গণনা কৰা হৈছে।",
    },
    "todays-tithi": {
      title: "আজিৰ তিথি",
      description: "যিকোনো তাৰিখ আৰু চহৰৰ বাবে সঠিক তিথি — পক্ষ আৰু সঠিক অন্তিম সময়ৰ সৈতে।",
    },
    "todays-nakshatra": {
      title: "আজিৰ নক্ষত্ৰ",
      description: "আজিৰ নক্ষত্ৰ পদ, শাসক গ্ৰহ, দেৱতা আৰু অন্তিম সময়ৰ সৈতে।",
    },
    "todays-yoga": {
      title: "আজিৰ যোগ",
      description: "আজিৰ যোগ (২৭টাৰ ভিতৰত এটা) প্ৰগতি আৰু অন্তিম সময়ৰ সৈতে।",
    },
    "todays-karana": {
      title: "আজিৰ কৰণ",
      description: "আজিৰ কৰণ প্ৰকাৰ (চলনশীল / স্থিৰ) আৰু সঠিক অন্তিম সময়ৰ সৈতে।",
    },
    "todays-sunrise": {
      title: "আজিৰ সূৰ্যোদয়",
      description:
        "যিকোনো চহৰৰ বাবে সঠিক সূৰ্যোদয় — সূৰ্যাস্ত, সৌৰ দুপৰীয়া আৰু দিনৰ দৈৰ্ঘ্যৰ সৈতে।",
    },
    "todays-sunset": {
      title: "আজিৰ সূৰ্যাস্ত",
      description:
        "যিকোনো চহৰৰ বাবে সঠিক সূৰ্যাস্ত — সূৰ্যোদয়, সৌৰ দুপৰীয়া আৰু দিনৰ দৈৰ্ঘ্যৰ সৈতে।",
    },
    "rahu-kaal": {
      title: "ৰাহু কাল",
      description: "আজিৰ ৰাহু কালৰ সময় — স্থান-সচেতন আৰু মিনিটৰ ভিতৰত।",
    },
    "gulika-kaal": {
      title: "গুলিকা কাল",
      description: "আজিৰ গুলিকা কালৰ সময় প্ৰকৃত সূৰ্যোদয় / সূৰ্যাস্তৰ সৈতে।",
    },
    yamaganda: { title: "যমগণ্ড", description: "আজিৰ যমগণ্ডৰ সময় — দিনৰ আঠটা অংশৰ ভিতৰত এটা।" },
    choghadiya: {
      title: "চোগাড়িয়া",
      description: "দিন আৰু ৰাতিৰ চোগাড়িয়া শুভ আৰু অশুভ সময়ৰ সৈতে।",
    },
    "panchang-by-date": {
      title: "তাৰিখ অনুসৰি পঞ্চাংগ",
      description: "পৃথিৱীৰ যিকোনো তাৰিখ আৰু যিকোনো চহৰৰ বাবে সম্পূৰ্ণ পঞ্চাংগ চাওক।",
    },
    "hora-chart": {
      title: "হোৰা চাৰ্ট",
      description: "যিকোনো কাৰ্যকলাপৰ বাবে সঠিক সময় বাছনি কৰিবলৈ গ্ৰহীয় হোৰা চাৰ্ট।",
      intro: "দিন আৰু ৰাতিৰ ২৪টা গ্ৰহীয় হোৰা — কাম কৰিবলৈ সঠিক সময় বাছনি কৰাৰ বাবে উপযুক্ত।",
    },
    "sunrise-sunset-atlas": {
      title: "সূৰ্যোদয় আৰু সূৰ্যাস্ত এটলাস",
      description: "বিশ্বৰ চহৰসমূহৰ সূৰ্যোদয় আৰু সূৰ্যাস্ত তুলনা কৰক।",
    },
    "moon-phase": {
      title: "চন্দ্ৰৰ কলা",
      description: "যিকোনো তাৰিখৰ বাবে বৰ্তমানৰ চন্দ্ৰৰ কলা, পোহৰ আৰু কলা কোণ।",
      intro: "বৰ্তমানৰ চন্দ্ৰৰ কলা, পোহৰ আৰু কলা কোণ — যিকোনো তাৰিখৰ বাবে লাইভ গণনা কৰা হৈছে।",
    },
    "abhijit-muhurat": {
      title: "অভিজিৎ মুহূৰ্ত",
      description: "আজিৰ অভিজিৎ মুহূৰ্তৰ সময় — আটাইতকৈ শুভ ৪৮ মিনিট।",
      intro:
        "অভিজিৎ হৈছে ১৫টা দিনৰ মুহূৰ্তৰ ভিতৰত ৮ম — সৌৰ দুপৰীয়াৰ কেন্দ্ৰত ৪৮ মিনিট। দিনৰ আটাইতকৈ শুভ সময় (বুধবাৰৰ বাহিৰে)।",
    },
    "brahma-muhurat": {
      title: "ব্ৰহ্ম মুহূৰ্ত",
      description: "সূৰ্যোদয়ৰ আগৰ ব্ৰহ্ম মুহূৰ্তৰ সময় — ধ্যানৰ বাবে আদৰ্শ।",
      intro:
        "সূৰ্যোদয়ৰ আগৰ দুটা মুহূৰ্ত — সত্ত্ব-সমৃদ্ধ সময় যেতিয়া মন সাধনাৰ বাবে আটাইতকৈ গ্ৰহণশীল হয়।",
    },

    // FESTIVALS
    "festival-calendar-2026": {
      title: "উৎসৱ কেলেণ্ডাৰ ২০২৬",
      description: "২০২৬ চনৰ প্ৰতিটো সনাতন উৎসৱ, মাহ অনুসৰি, আঞ্চলিক আৰু শ্ৰেণী ফিল্টাৰৰ সৈতে।",
    },
    "festival-countdown": {
      title: "উৎসৱ কাউণ্টডাউন",
      description: "২০২৬ চনৰ যিকোনো উৎসৱলৈ এটা লাইভ কাউণ্টডাউন — ছেকেণ্ড পৰ্যন্ত।",
    },
    "festival-finder": {
      title: "উৎসৱ সন্ধানক",
      description: "নাম, দেৱতা বা মাহ অনুসৰি উৎসৱ বিচাৰক — পৰিকল্পনাৰ বাবে উপযুক্ত।",
    },
    "vrat-calendar": {
      title: "ব্ৰত কেলেণ্ডাৰ",
      description: "উপবাসৰ নিয়ম, সময় আৰু মন্ত্ৰৰ সৈতে প্ৰতিটো মুখ্য ব্ৰত।",
    },
    "ekadashi-dates": {
      title: "একাদশীৰ তাৰিখ",
      description: "২০২৬ চনৰ প্ৰতিটো একাদশী বৰ্ণনা আৰু ব্ৰত বিধিৰ সৈতে।",
      intro: "২০২৬ চনৰ সকলো ২৪টা একাদশী বৰ্ণনা আৰু ব্ৰত বিধিৰ সৈতে।",
    },
    "purnima-amavasya": {
      title: "পূৰ্ণিমা আৰু অমাবস্যা",
      description: "আঞ্চলিক গুৰুত্বৰ সৈতে সকলো পূৰ্ণিমা আৰু অমাবস্যাৰ তাৰিখ।",
    },
    "regional-festivals": {
      title: "আঞ্চলিক উৎসৱ",
      description: "প্ৰতিখন ৰাজ্য আৰু সম্প্ৰদায়ৰ বাবে অনন্য উৎসৱসমূহ আৱিষ্কাৰ কৰক।",
    },
    "pradosh-vrat": {
      title: "প্ৰদোষ ব্ৰতৰ তাৰিখ",
      description: "প্ৰতিটো প্ৰদোষ ব্ৰতৰ তাৰিখ দিন-প্ৰকাৰ (সোম, ভৌম, শনি) উল্লেখ কৰি।",
    },
    "sankashti-chaturthi": {
      title: "সংকষ্টি চতুৰ্থী",
      description: "মাহেকীয়া সংকষ্টি চতুৰ্থীৰ তাৰিখ — গণেশৰ কৃপাৰ দিন।",
    },
    "festival-of-the-day": {
      title: "দিনটোৰ উৎসৱ",
      description: "আজিৰ বা পৰৱৰ্তী সনাতন উৎসৱ — এক-দৃষ্টিৰ কাৰ্ড।",
    },
    "upcoming-festivals": {
      title: "আগন্তুক উৎসৱ",
      description: "আগন্তুক ১২টা উৎসৱ — অহা কেইসপ্তাহমানৰ পৰিকল্পনা কৰক।",
    },

    // PUJA
    "puja-checklist-generator": {
      title: "পূজা চেকলিষ্ট জেনেৰেটৰ",
      description: "৬টা মুখ্য পূজাৰ বাবে ইন্টাৰেক্টিভ সামগ্ৰী, বিধি আৰু মন্ত্ৰ চেকলিষ্ট।",
    },
    "aarti-collection": {
      title: "আৰতি সংগ্ৰহ",
      description: "আটাইতকৈ প্ৰিয় আৰতিসমূহৰ হাতেৰে বাছনি কৰা সংগ্ৰহ, সুন্দৰভাৱে টাইপছেট কৰা।",
    },
    "chalisa-collection": {
      title: "চালিশা সংগ্ৰহ",
      description: "দেৱনাগৰীত হনুমান, দুৰ্গা, শিৱ, গণেশ আৰু সৰস্বতী চালিশা।",
    },
    "puja-vidhi-planner": {
      title: "পূজা বিধি পৰিকল্পনাকাৰী",
      description:
        "যিকোনো পূজাৰ বাবে এক ক্ৰমান্বয়ে পৰিকল্পনাকাৰী — সংকল্প, মন্ত্ৰ, আৰতি আৰু সময় বাজেট।",
    },
    "samagri-checklist": {
      title: "সামগ্ৰী চেকলিষ্ট",
      description: "আঠটা মুখ্য পূজাৰ বাবে পৰিমাণৰ সৈতে সংগ্ৰহ কৰা সামগ্ৰীৰ তালিকা।",
    },
    "sankalp-generator": {
      title: "সংকল্প জেনেৰেটৰ",
      description: "আপোনাৰ নাম, গোত্ৰ, তাৰিখ আৰু স্থানৰ সৈতে সঠিক সংকল্প সৃষ্টি কৰক।",
    },
    "griha-pravesh-planner": {
      title: "গৃহ প্ৰৱেশ পৰিকল্পনাকাৰী",
      description: "আপোনাৰ গৃহ প্ৰৱেশৰ বাবে সম্পূৰ্ণ ক্ৰমান্বয়ে নিৰ্দেশনা।",
    },
    "havan-guide": {
      title: "হৱন নিৰ্দেশিকা",
      description: "সামগ্ৰী, পদ্ধতি আৰু সুৰক্ষা টিপছৰ সৈতে সম্পূৰ্ণ হৱন নিৰ্দেশিকা।",
    },
    "aarti-thali-guide": {
      title: "আৰতি থালি নিৰ্দেশিকা",
      description: "আৰতি থালিৰ প্ৰতিটো বস্তু আৰু ইয়াৰ প্ৰতীকী অৰ্থ।",
    },
    "prasad-recipes": {
      title: "প্ৰসাদ ৰেচিপি",
      description: "পৰম্পৰাগত প্ৰসাদ ৰেচিপি — মোদক, পঞ্জিৰী, শিৰা আৰু অধিক।",
    },

    // MANTRAS
    "digital-jaap-counter": {
      title: "ডিজিটেল জাপ কাউণ্টাৰ",
      description: "১০৮-মণিৰ মালাৰ প্ৰগতি আৰু আজীৱন গণনাৰ সৈতে মনোযোগহীন জাপ কাউণ্টাৰ।",
    },
    "om-counter": {
      title: "ওঁ কাউণ্টাৰ",
      description: "এটা কেন্দ্ৰীভূত ওঁ কাউণ্টাৰ — মালাৰ প্ৰগতি আৰু মৃদু ঘণ্টাৰ সৈতে ॐ জপ কৰক।",
    },
    "mala-counter": {
      title: "মালা কাউণ্টাৰ",
      description: "এটা নীৰৱ মালা কাউণ্টাৰ — মণি, মালা আৰু আজীৱন গণনা ট্ৰেক কৰক।",
    },
    "mantra-timer": {
      title: "মন্ত্ৰ টাইমাৰ",
      description: "এটা মৃদু টাইমাৰ সময়বদ্ধ মন্ত্ৰ অধিবেশনৰ বাবে এটা কোমল সমাপ্তি ঘণ্টাৰ সৈতে।",
    },
    "stotra-collection": {
      title: "স্তোত্ৰ সংগ্ৰহ",
      description: "শাস্ত্ৰীয় স্তোত্ৰ — শিৱ তাণ্ডৱ, লিংগাষ্টকম, মহামৃত্যুঞ্জয় আৰু অধিক।",
    },
    "daily-quote": {
      title: "দৈনিক উক্তি",
      description: "প্ৰতিদিনে এটা হাতেৰে বাছনি কৰা সনাতন উক্তি — গীতা, উপনিষদ আৰু অধিক।",
    },
    "daily-shlok": {
      title: "দৈনিক শ্লোক",
      description: "দেৱনাগৰীত প্ৰতিদিনে এটা শ্লোক অনুবাদ আৰু অৰ্থৰ সৈতে।",
    },
    "mantra-library": {
      title: "মন্ত্ৰ পুথিভঁৰাল",
      description: "দেৱনাগৰী, IAST আৰু অৰ্থৰ সৈতে ৩০+ মন্ত্ৰৰ এটা সংগ্ৰহ।",
    },
    "beej-mantras": {
      title: "বীজ মন্ত্ৰ",
      description: "দেৱতা, অৰ্থ আৰু উচ্চাৰণ নিৰ্দেশিকাৰ সৈতে প্ৰতিটো বীজ মন্ত্ৰ।",
    },
    "deity-mantras": {
      title: "দেৱতা মন্ত্ৰ",
      description: "দেৱতা অনুসৰি সংগঠিত মন্ত্ৰ — শিৱ, বিষ্ণু, দেৱী, গণেশ আৰু অধিক।",
    },
    "mantra-of-the-day": {
      title: "দিনটোৰ মন্ত্ৰ",
      description: "প্ৰতিদিনে এটা ঘূৰ্ণীয়মান পৰম্পৰাগত মন্ত্ৰ — দেৱনাগৰী, IAST, অৰ্থ।",
    },
    "gayatri-mantra": {
      title: "গায়ত্ৰী মন্ত্ৰ নিৰ্দেশিকা",
      description: "গায়ত্ৰীৰ শব্দে শব্দে অৰ্থ, জপ নিয়ম আৰু উপকাৰ।",
    },
    "mahamrityunjaya-mantra": {
      title: "মহামৃত্যুঞ্জয় নিৰ্দেশিকা",
      description: "ৰুদ্ৰৰ আৰোগ্য মন্ত্ৰ — অৰ্থ, উপকাৰ আৰু জাপ নিয়ম।",
    },

    // AI
    "ai-dharma-assistant": {
      title: "AI ধৰ্ম সহায়ক",
      description: "সনাতন ধৰ্মৰ বিষয়ে যিকোনো প্ৰশ্ন সুধক আৰু এটা চিন্তাশীল, উদ্ধৃত উত্তৰ পাওক।",
      intro:
        "সনাতন ধৰ্মৰ বিষয়ে যিকোনো প্ৰশ্ন সুধক — শাস্ত্ৰ, ৰীতি-নীতি, দৰ্শন — আৰু এটা চিন্তাশীল, উদ্ধৃত উত্তৰ পাওক।",
    },
    "ai-gita-summary": {
      title: "AI গীতা সাৰাংশ",
      description: "যিকোনো ভগৱদ্ গীতা অধ্যায়ৰ তাৎক্ষণিক, বিশ্বাসযোগ্য সাৰাংশ মূল শ্লোকসমূহৰ সৈতে।",
    },
    "ai-shlok-explainer": {
      title: "AI শ্লোক ব্যাখ্যাকাৰী",
      description: "যিকোনো শ্লোক পেষ্ট কৰক — দেৱনাগৰী, IAST, শব্দে শব্দে অৰ্থ আৰু ভাষ্য পাওক।",
    },
    "ai-festival-guide": {
      title: "AI উৎসৱ নিৰ্দেশিকা",
      description: "যিকোনো উৎসৱ, ব্যাখ্যা কৰা হৈছে — কাহিনী, তিথি, বিধি, সামগ্ৰী আৰু মন্ত্ৰ।",
    },
    "ai-puja-planner": {
      title: "AI পূজা পৰিকল্পনাকাৰী",
      description:
        "আপোনাৰ অনুষ্ঠান বৰ্ণনা কৰক — AI এ সংকল্প, বিধি আৰু মন্ত্ৰৰ সৈতে এটা সম্পূৰ্ণ পূজা পৰিকল্পনা কৰে।",
    },
    "ai-mantra-meaning": {
      title: "AI মন্ত্ৰ অৰ্থ",
      description: "যিকোনো মন্ত্ৰ, ডিকোড কৰা হৈছে — দেৱনাগৰী, IAST, শব্দে শব্দে অৰ্থ, উপকাৰ।",
    },
    "ai-sanskrit-helper": {
      title: "AI সংস্কৃত সহায়ক",
      description:
        "সংস্কৃত অনুবাদ কৰক, ব্যাকৰণ ডিকোড কৰক, আৰু উচ্চাৰণ কৰক — প্ৰতিবাৰ দেৱনাগৰী আৰু IAST।",
    },
    "mantra-recommender": {
      title: "AI মন্ত্ৰ পৰামৰ্শদাতা",
      description: "উদ্দেশ্য, দেৱতা আৰু দিনৰ সময়ৰ ওপৰত আধাৰিত AI-চালিত মন্ত্ৰ পৰামৰ্শ।",
      intro:
        "আপোনাৰ উদ্দেশ্য বৰ্ণনা কৰক — AI এ অৰ্থ, উপকাৰ আৰু জাপ গণনাৰ সৈতে তিনিটা পৰম্পৰাগত মন্ত্ৰ পৰামৰ্শ দিয়ে।",
    },
    "baby-name-ai": {
      title: "AI শিশু নাম পৰামৰ্শদাতা",
      description: "নক্ষত্ৰ, শব্দাংশ, অৰ্থ আৰু লিংগ অনুসৰি AI শিশু নামৰ পৰামৰ্শ।",
      intro: "নক্ষত্ৰ, শব্দাংশ, অৰ্থ আৰু লিংগৰ ওপৰত আধাৰিত AI-নিৰ্মিত সংস্কৃত নামৰ পৰামৰ্শ।",
    },

    // TEMPLES
    "temple-finder": {
      title: "মন্দিৰ সন্ধানক",
      description: "এক-টেপ নিৰ্দেশনাৰ সৈতে ২০+ মুখ্য মন্দিৰ বিচাৰক।",
    },
    "temple-directory": {
      title: "মন্দিৰ নিৰ্দেশিকা",
      description: "ভাৰতৰ ২৫+ মুখ্য মন্দিৰৰ সন্ধানযোগ্য নিৰ্দেশিকা।",
    },
    "darshan-timings": {
      title: "দৰ্শনৰ সময়",
      description: "মুখ্য মন্দিৰসমূহৰ বাবে দৰ্শনৰ সময় আৰু আৰতিৰ সময়সূচী।",
    },
    "char-dham-planner": {
      title: "চাৰ ধাম পৰিকল্পনাকাৰী",
      description: "আপোনাৰ চাৰ ধাম যাত্ৰা পৰিকল্পনা কৰক — পথ, শ্ৰেষ্ঠ মাহ আৰু মধ্যৱৰ্তী স্থান।",
    },
    "jyotirlinga-guide": {
      title: "জ্যোতিৰ্লিংগ নিৰ্দেশিকা",
      description: "১২টা জ্যোতিৰ্লিংগৰ সম্পূৰ্ণ নিৰ্দেশিকা — ইতিহাস, সময় আৰু ভ্ৰমণ।",
    },
    "shakti-peeth-guide": {
      title: "শক্তি পীঠ নিৰ্দেশিকা",
      description: "আটাইতকৈ বেছি ভ্ৰমণ কৰা শক্তি পীঠসমূহ — কাহিনী আৰু কেনেকৈ পাব।",
    },
    "nearby-temples": {
      title: "ওচৰৰ মন্দিৰ",
      description: "আপোনাৰ সংৰক্ষিত স্থানৰ আটাইতকৈ ওচৰৰ মন্দিৰসমূহ দূৰত্ব আৰু বিৱৰণৰ সৈতে বিচাৰক।",
    },

    // CALCULATORS
    "kundli-generator": {
      title: "কুণ্ডলী জেনেৰেটৰ",
      description: "ৰাশি, নক্ষত্ৰ, তিথি আৰু যোগৰ সৈতে বিনামূলীয়া বৈদিক কুণ্ডলী।",
      intro:
        "জন্ম তাৰিখ আৰু সময়ৰ পৰা এটা দ্ৰুত বৈদিক স্ন্যাপশ্বট — ৰাশি, নক্ষত্ৰ, তিথি, যোগ আৰু নামাকৰণৰ শব্দাংশ।",
    },
    "rashi-calculator": {
      title: "ৰাশি গণনা",
      description: "জন্ম তাৰিখ আৰু সময়ৰ পৰা আপোনাৰ চন্দ্ৰ ৰাশি (ৰাশি) বিচাৰক।",
    },
    "nakshatra-finder": {
      title: "নক্ষত্ৰ সন্ধানক",
      description: "আপোনাৰ জন্ম নক্ষত্ৰ, পদ আৰু ইয়াৰ শাসক দেৱতা আৱিষ্কাৰ কৰক।",
    },
    "dasha-calculator": {
      title: "বিংশোত্তৰী দশা",
      description: "আপোনাৰ জন্ম নক্ষত্ৰৰ পৰা গণনা কৰা বিংশোত্তৰী মহাদশাৰ সময়ৰেখা।",
      intro: "আপোনাৰ জন্ম নক্ষত্ৰৰ পৰা গণনা কৰা আপোনাৰ বিংশোত্তৰী মহাদশাৰ সময়ৰেখা।",
    },
    "gemstone-recommender": {
      title: "ৰত্ন পৰামৰ্শদাতা",
      description: "আপোনাৰ ৰাশিৰ ওপৰত আধাৰিত ব্যক্তিগতকৃত ৰত্ন পৰামৰ্শ।",
    },
    numerology: { title: "সংখ্যা বিজ্ঞান", description: "অৰ্থৰ সৈতে জীৱন-পথ আৰু ভাগ্য সংখ্যা।" },
    "name-numerology": {
      title: "নাম সংখ্যা বিজ্ঞান",
      description: "অৰ্থ আৰু গ্ৰহীয় কম্পনৰ সৈতে যিকোনো নামৰ সংখ্যা বিজ্ঞান মূল্য।",
    },
    "birthstone-finder": {
      title: "জন্মৰত্ন সন্ধানক",
      description: "যিকোনো জন্ম মাহৰ বাবে পৰম্পৰাগত পশ্চিমীয়া জন্মৰত্ন।",
    },

    // SANSKRIT
    "sanskrit-dictionary": {
      title: "সংস্কৃত অভিধান",
      description: "অৰ্থ আৰু মূলৰ সৈতে ৬০+ মূল সংস্কৃত শব্দ চাওক।",
    },
    transliteration: {
      title: "IAST → দেৱনাগৰী",
      description: "IAST বা ধ্বনিগত ইংৰাজী তাৎক্ষণিকভাৱে দেৱনাগৰীলৈ ৰূপান্তৰ কৰক।",
      intro:
        "IAST বা ইংৰাজী ধ্বনিগত টাইপ কৰক; তাৎক্ষণিক দেৱনাগৰী পাওক। চেষ্টা কৰক: 'om namah shivaya'।",
    },
    "sandhi-splitter": {
      title: "সন্ধি বিভাজক",
      description: "সাধাৰণ যৌগিক শব্দৰ বাবে নিয়ম-আধাৰিত সন্ধি বিভাজক।",
    },
    "shloka-analyzer": {
      title: "শ্লোক বিশ্লেষক",
      description: "যিকোনো শ্লোকৰ শব্দাংশ, পদ গণনা কৰক আৰু ছন্দ অনুমান কৰক।",
    },
    "devanagari-typing": {
      title: "দেৱনাগৰী টাইপিং",
      description: "অন-স্ক্ৰীণ কিবৰ্ডৰ সৈতে দেৱনাগৰীত টাইপ কৰক।",
    },
    "verb-conjugator": {
      title: "ক্ৰিয়া সংযোজক",
      description: "বৰ্তমান কালত (লট্ লকাৰ) সাধাৰণ সংস্কৃত ধাতুৰ ক্ৰিয়া সংযোজন কৰক।",
    },
    "sanskrit-word-of-day": {
      title: "দিনটোৰ সংস্কৃত শব্দ",
      description: "প্ৰতিদিনে এটা নতুন সংস্কৃত শব্দ অৰ্থ আৰু মূলৰ সৈতে।",
    },

    // BABY NAMES
    "names-by-nakshatra": {
      title: "নক্ষত্ৰ অনুসৰি নাম",
      description: "আপোনাৰ শিশুৰ জন্ম নক্ষত্ৰ পদৰ শব্দাংশৰ সৈতে সংলগ্ন শিশুৰ নাম।",
    },
    "names-by-rashi": {
      title: "ৰাশি অনুসৰি নাম",
      description: "চন্দ্ৰ-ৰাশিৰ শব্দাংশ অনুসৰি শিশুৰ নাম — সুন্দৰ আৰু অৰ্থপূৰ্ণ।",
    },
    "names-by-deity": {
      title: "দেৱতা অনুসৰি নাম",
      description: "শিৱ, বিষ্ণু, দেৱী, গণেশ আৰু অধিকৰ দ্বাৰা অনুপ্ৰাণিত নাম।",
    },
    "names-by-meaning": {
      title: "অৰ্থ অনুসৰি নাম",
      description: "অৰ্থ অনুসৰি নাম বিচাৰক — পোহৰ, শক্তি, জ্ঞান, প্ৰেম আৰু অধিক।",
    },
    "twin-names": {
      title: "যমজ নাম",
      description: "সংস্কৃত পৰম্পৰাৰ পৰা লোৱা যমজৰ বাবে সুন্দৰভাৱে যোৰা নাম।",
    },
    "ai-name-suggester": {
      title: "AI নাম পৰামৰ্শদাতা",
      description: "নক্ষত্ৰ, শব্দাংশ আৰু অৰ্থ অনুসৰি AI শিশু নামৰ পৰামৰ্শ।",
    },

    // LEARNING
    "bhagavad-gita": {
      title: "ভগৱদ্ গীতা — অধ্যায় পঢ়ুৱৈ",
      description: "গীতাৰ সকলো ১৮টা অধ্যায় সাৰাংশ আৰু মূল শিক্ষাৰ সৈতে।",
    },
    "upanishads-guide": {
      title: "উপনিষদ নিৰ্দেশিকা",
      description: "মূল উপনিষদসমূহ বিষয়বস্তু আৰু মূল শিক্ষাৰ সৈতে।",
    },
    "vedas-introduction": { title: "বেদৰ পৰিচয়", description: "চাৰিখন বেদৰ এক সুলভ পৰিচয়।" },
    "yoga-sutras": {
      title: "যোগ সূত্ৰৰ সংক্ষিপ্ত বিৱৰণ",
      description: "পতঞ্জলিৰ যোগ সূত্ৰৰ চাৰিটা পদ মূল শ্লোকসমূহৰ সৈতে।",
    },
    "sanatan-timeline": {
      title: "সনাতন সময়ৰেখা",
      description: "সনাতন ধৰ্মৰ এক দৃশ্যমান সময়ৰেখা — বৈদিক যুগৰ পৰা আজিলৈকে।",
    },
    "deity-encyclopedia": {
      title: "দেৱতা বিশ্বকোষ",
      description: "২২+ দেৱতা আইকনোগ্ৰাফী, মন্ত্ৰ আৰু লোককথাৰ সৈতে।",
    },
    "mahabharata-summary": {
      title: "মহাভাৰতৰ সাৰাংশ",
      description: "মহাভাৰতৰ সকলো ১৮টা পৰ্ব বিষয়বস্তু আৰু কাহিনীৰ সৈতে।",
    },
    "ramayana-summary": {
      title: "ৰামায়ণৰ সাৰাংশ",
      description: "বাল্মীকি ৰামায়ণৰ সাতটা কাণ্ড এটা পৃষ্ঠাত।",
    },
    "puranas-overview": {
      title: "১৮খন মহাপুৰাণ",
      description: "১৮খন মহাপুৰাণৰ সম্পূৰ্ণ তালিকা — দেৱতা, বিষয়বস্তু আৰু শ্লোক গণনা।",
    },
    "deity-of-the-day": {
      title: "দিনটোৰ দেৱতা",
      description: "প্ৰতিদিনে এটা ঘূৰ্ণীয়মান দেৱতা — মন্ত্ৰ আৰু গুৰুত্বৰ সৈতে।",
    },
    "nakshatra-guide": {
      title: "২৭টা নক্ষত্ৰৰ নিৰ্দেশিকা",
      description: "সকলো ২৭টা নক্ষত্ৰ অধিপতি, দেৱতা, প্ৰতীক আৰু প্ৰকৃতিৰ সৈতে।",
    },
    "rashi-guide": {
      title: "১২টা ৰাশিৰ নিৰ্দেশিকা",
      description: "সকলো ১২টা ৰাশি অধিপতি, উপাদান আৰু বৈশিষ্ট্যৰ সৈতে।",
    },
  },
};

/** Look up localised entry, falling back to English then to the raw slug title. */
export function getLocalizedToolEntry(slug: string, lang: string): ToolEntry {
  const l = (lang as ToolLang) in TOOL_I18N ? (lang as ToolLang) : "en";
  return TOOL_I18N[l]?.[slug] ?? TOOL_I18N.en[slug] ?? { title: slug, description: "" };
}
