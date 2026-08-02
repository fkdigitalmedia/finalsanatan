// ============================================================
// Dynamic Translation Registry — Sanatan Astro Terms
// ------------------------------------------------------------
// The Panchang / Kundli / Festival / Astrology engines MUST NOT
// return language-specific strings. They return neutral IDs
// (numbers or canonical English keys). This module maps those
// IDs to display labels per language.
//
// Rules:
//   • Engines ↔ IDs only. UI ↔ this file for labels.
//   • Sanskrit terms (Panchang, Tithi, Nakshatra, Yoga, Karana,
//     Rahu Kaal, Lagna, Kundli, Navamsa, Mahadasha, Antardasha,
//     Ekadashi, etc.) are preserved across languages — only
//     the script changes; the word does not.
//   • Missing (language, id) pair → falls back to English.
//   • Admin overrides via the `translations` table with keys
//     of the form `astro.<domain>.<id>` take precedence at
//     runtime (see I18nProvider `applyOverrides`).
//
// Adding a new domain:
//   1. Add it to `DOMAINS` with English + Hindi labels.
//   2. Extend `LOCALIZED` for any language that diverges.
//   3. Use `getAstroLabel(domain, id, lang)` — never hardcode
//      the term anywhere in components or engines.
// ============================================================

import type { LanguageDef } from "@/i18n/config";

export type AstroDomain =
  | "tithi" // 1..30 (1..15 Shukla, 16..30 Krishna)
  | "paksha" // "shukla" | "krishna"
  | "nakshatra" // 1..27
  | "yoga" // 1..27
  | "karana" // 1..11
  | "weekday" // 0..6 (Sunday..Saturday)
  | "month_gregorian" // 1..12
  | "month_lunar" // 1..12 (Chaitra..Phalguna)
  | "month_solar" // 1..12 (Mesha..Meena)
  | "rashi" // 1..12 (Mesha..Meena)
  | "planet" // "sun"|"moon"|"mars"|"mercury"|"jupiter"|"venus"|"saturn"|"rahu"|"ketu"
  | "house" // 1..12
  | "muhurat" // canonical keys
  | "temple_type"
  | "element" // fire/earth/air/water/ether
  | "direction" // 8 directions
  | "dosha" // mangal/kaal-sarp/pitra/...
  | "yogas" // gaja-kesari/raja-yoga/...
  | "dasha" // ketu/venus/sun/...
  | "planet_status" // exalted/debilitated/own/friendly/enemy/neutral
  | "planet_strength" // strong/moderate/weak
  | "retrograde" // direct/retrograde/combust
  | "festival" // slug keys from festivals engine
  | "astro_term"; // catch-all: panchang, kundli, navamsa, lagna, ...

type Dict = Record<string | number, string>;
type DomainMap = Record<AstroDomain, Dict>;

// -----------------------------------------------------------
// EN — canonical source of truth. Every ID lives here first.
// -----------------------------------------------------------
const EN: DomainMap = {
  tithi: {
    1: "Pratipada",
    2: "Dwitiya",
    3: "Tritiya",
    4: "Chaturthi",
    5: "Panchami",
    6: "Shashthi",
    7: "Saptami",
    8: "Ashtami",
    9: "Navami",
    10: "Dashami",
    11: "Ekadashi",
    12: "Dwadashi",
    13: "Trayodashi",
    14: "Chaturdashi",
    15: "Purnima",
    16: "Pratipada",
    17: "Dwitiya",
    18: "Tritiya",
    19: "Chaturthi",
    20: "Panchami",
    21: "Shashthi",
    22: "Saptami",
    23: "Ashtami",
    24: "Navami",
    25: "Dashami",
    26: "Ekadashi",
    27: "Dwadashi",
    28: "Trayodashi",
    29: "Chaturdashi",
    30: "Amavasya",
  },
  paksha: { shukla: "Shukla Paksha", krishna: "Krishna Paksha" },
  nakshatra: {
    1: "Ashwini",
    2: "Bharani",
    3: "Krittika",
    4: "Rohini",
    5: "Mrigashira",
    6: "Ardra",
    7: "Punarvasu",
    8: "Pushya",
    9: "Ashlesha",
    10: "Magha",
    11: "Purva Phalguni",
    12: "Uttara Phalguni",
    13: "Hasta",
    14: "Chitra",
    15: "Swati",
    16: "Vishakha",
    17: "Anuradha",
    18: "Jyeshtha",
    19: "Mula",
    20: "Purva Ashadha",
    21: "Uttara Ashadha",
    22: "Shravana",
    23: "Dhanishta",
    24: "Shatabhisha",
    25: "Purva Bhadrapada",
    26: "Uttara Bhadrapada",
    27: "Revati",
  },
  yoga: {
    1: "Vishkambha",
    2: "Priti",
    3: "Ayushman",
    4: "Saubhagya",
    5: "Shobhana",
    6: "Atiganda",
    7: "Sukarma",
    8: "Dhriti",
    9: "Shula",
    10: "Ganda",
    11: "Vriddhi",
    12: "Dhruva",
    13: "Vyaghata",
    14: "Harshana",
    15: "Vajra",
    16: "Siddhi",
    17: "Vyatipata",
    18: "Variyan",
    19: "Parigha",
    20: "Shiva",
    21: "Siddha",
    22: "Sadhya",
    23: "Shubha",
    24: "Shukla",
    25: "Brahma",
    26: "Indra",
    27: "Vaidhriti",
  },
  karana: {
    1: "Bava",
    2: "Balava",
    3: "Kaulava",
    4: "Taitila",
    5: "Gara",
    6: "Vanija",
    7: "Vishti",
    8: "Shakuni",
    9: "Chatushpada",
    10: "Naga",
    11: "Kimstughna",
  },
  weekday: {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
  },
  month_gregorian: {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
  },
  month_lunar: {
    1: "Chaitra",
    2: "Vaishakha",
    3: "Jyeshtha",
    4: "Ashadha",
    5: "Shravana",
    6: "Bhadrapada",
    7: "Ashwin",
    8: "Kartik",
    9: "Margashirsha",
    10: "Pausha",
    11: "Magha",
    12: "Phalguna",
  },
  month_solar: {
    1: "Mesha",
    2: "Vrishabha",
    3: "Mithuna",
    4: "Karka",
    5: "Simha",
    6: "Kanya",
    7: "Tula",
    8: "Vrischika",
    9: "Dhanu",
    10: "Makara",
    11: "Kumbha",
    12: "Meena",
  },
  rashi: {
    1: "Mesha",
    2: "Vrishabha",
    3: "Mithuna",
    4: "Karka",
    5: "Simha",
    6: "Kanya",
    7: "Tula",
    8: "Vrischika",
    9: "Dhanu",
    10: "Makara",
    11: "Kumbha",
    12: "Meena",
  },
  planet: {
    sun: "Surya",
    moon: "Chandra",
    mars: "Mangala",
    mercury: "Budha",
    jupiter: "Guru",
    venus: "Shukra",
    saturn: "Shani",
    rahu: "Rahu",
    ketu: "Ketu",
  },
  house: {
    1: "Lagna Bhava",
    2: "Dhana Bhava",
    3: "Sahaja Bhava",
    4: "Sukha Bhava",
    5: "Putra Bhava",
    6: "Ripu Bhava",
    7: "Kalatra Bhava",
    8: "Ayur Bhava",
    9: "Dharma Bhava",
    10: "Karma Bhava",
    11: "Labha Bhava",
    12: "Vyaya Bhava",
  },
  muhurat: {
    abhijit: "Abhijit Muhurat",
    brahma: "Brahma Muhurat",
    amrit_kaal: "Amrit Kaal",
    vijaya: "Vijaya Muhurat",
    godhuli: "Godhuli Muhurat",
    nishita: "Nishita Muhurat",
    rahu_kaal: "Rahu Kaal",
    gulika_kaal: "Gulika Kaal",
    yamaganda: "Yamaganda Kaal",
    dur_muhurat: "Dur Muhurat",
    varjyam: "Varjyam",
    pradosha: "Pradosha Kaal",
  },
  temple_type: {
    shiva: "Shiva Temple",
    vishnu: "Vishnu Temple",
    devi: "Devi Temple",
    ganesha: "Ganesha Temple",
    hanuman: "Hanuman Temple",
    surya: "Surya Temple",
    murugan: "Murugan Temple",
    jyotirlinga: "Jyotirlinga",
    shakti_peeth: "Shakti Peeth",
    char_dham: "Char Dham",
    tirtha: "Tirtha",
  },
  element: {
    fire: "Agni",
    earth: "Prithvi",
    air: "Vayu",
    water: "Jala",
    ether: "Akasha",
  },
  direction: {
    east: "Purva",
    west: "Paschima",
    north: "Uttara",
    south: "Dakshina",
    northeast: "Ishanya",
    northwest: "Vayavya",
    southeast: "Agneya",
    southwest: "Nairutya",
  },
  dosha: {
    mangal: "Mangal Dosha",
    kaal_sarp: "Kaal Sarp Dosha",
    pitra: "Pitra Dosha",
    shani: "Shani Dosha",
    nadi: "Nadi Dosha",
    bhakoot: "Bhakoot Dosha",
    guru_chandal: "Guru Chandal Dosha",
    grahan: "Grahan Dosha",
  },
  yogas: {
    gaja_kesari: "Gaja Kesari Yoga",
    raja: "Raja Yoga",
    dhana: "Dhana Yoga",
    vipreet_raja: "Vipreet Raja Yoga",
    panch_mahapurush: "Panch Mahapurush Yoga",
    budhaditya: "Budhaditya Yoga",
    chandra_mangal: "Chandra Mangal Yoga",
    neech_bhang: "Neech Bhang Raja Yoga",
    kemadruma: "Kemadruma Yoga",
    kalasarpa: "Kalasarpa Yoga",
  },
  dasha: {
    ketu: "Ketu Mahadasha",
    venus: "Shukra Mahadasha",
    sun: "Surya Mahadasha",
    moon: "Chandra Mahadasha",
    mars: "Mangala Mahadasha",
    rahu: "Rahu Mahadasha",
    jupiter: "Guru Mahadasha",
    saturn: "Shani Mahadasha",
    mercury: "Budha Mahadasha",
  },
  planet_status: {
    exalted: "Uccha (Exalted)",
    debilitated: "Neecha (Debilitated)",
    own: "Swakshetra (Own Sign)",
    moolatrikona: "Moolatrikona",
    friendly: "Mitra (Friendly)",
    enemy: "Shatru (Enemy)",
    neutral: "Sama (Neutral)",
  },
  planet_strength: {
    strong: "Balvan (Strong)",
    moderate: "Madhyam (Moderate)",
    weak: "Nirbal (Weak)",
  },
  retrograde: {
    direct: "Marga (Direct)",
    retrograde: "Vakri (Retrograde)",
    combust: "Asta (Combust)",
    stationary: "Sthir (Stationary)",
  },
  festival: {
    diwali: "Diwali",
    holi: "Holi",
    raksha_bandhan: "Raksha Bandhan",
    janmashtami: "Krishna Janmashtami",
    maha_shivaratri: "Maha Shivaratri",
    ganesh_chaturthi: "Ganesh Chaturthi",
    navratri: "Navratri",
    makar_sankranti: "Makar Sankranti",
    karva_chauth: "Karva Chauth",
    ekadashi: "Ekadashi",
    purnima: "Purnima",
    amavasya: "Amavasya",
  },
  astro_term: {
    panchang: "Panchang",
    kundli: "Kundli",
    lagna: "Lagna",
    navamsa: "Navamsa",
    mahadasha: "Mahadasha",
    antardasha: "Antardasha",
    pratyantardasha: "Pratyantardasha",
    gochar: "Gochar",
    muhurat: "Muhurat",
    ayanamsa: "Ayanamsa",
    tithi: "Tithi",
    nakshatra: "Nakshatra",
    yoga: "Yoga",
    karana: "Karana",
    rahu_kaal: "Rahu Kaal",
    gulika_kaal: "Gulika Kaal",
    yamaganda: "Yamaganda",
    abhijit_muhurat: "Abhijit Muhurat",
    brahma_muhurat: "Brahma Muhurat",
    sunrise: "Suryodaya",
    sunset: "Suryast",
    moonrise: "Chandrodaya",
    moonset: "Chandrast",
    rashi: "Rashi",
    graha: "Graha",
    bhava: "Bhava",
    drishti: "Drishti",
    yoni: "Yoni",
    gana: "Gana",
    nadi: "Nadi",
    varna: "Varna",
    vashya: "Vashya",
    tara: "Tara",
    ashtakoot: "Ashtakoot",
    gun_milan: "Guna Milan",
  },
};

// -----------------------------------------------------------
// HI — Devanagari script for common domains. Sanskrit-origin
// terms keep their form; only the script changes.
// -----------------------------------------------------------
const HI: Partial<DomainMap> = {
  tithi: {
    1: "प्रतिपदा",
    2: "द्वितीया",
    3: "तृतीया",
    4: "चतुर्थी",
    5: "पंचमी",
    6: "षष्ठी",
    7: "सप्तमी",
    8: "अष्टमी",
    9: "नवमी",
    10: "दशमी",
    11: "एकादशी",
    12: "द्वादशी",
    13: "त्रयोदशी",
    14: "चतुर्दशी",
    15: "पूर्णिमा",
    16: "प्रतिपदा",
    17: "द्वितीया",
    18: "तृतीया",
    19: "चतुर्थी",
    20: "पंचमी",
    21: "षष्ठी",
    22: "सप्तमी",
    23: "अष्टमी",
    24: "नवमी",
    25: "दशमी",
    26: "एकादशी",
    27: "द्वादशी",
    28: "त्रयोदशी",
    29: "चतुर्दशी",
    30: "अमावस्या",
  },
  paksha: { shukla: "शुक्ल पक्ष", krishna: "कृष्ण पक्ष" },
  nakshatra: {
    1: "अश्विनी",
    2: "भरणी",
    3: "कृत्तिका",
    4: "रोहिणी",
    5: "मृगशिरा",
    6: "आर्द्रा",
    7: "पुनर्वसु",
    8: "पुष्य",
    9: "आश्लेषा",
    10: "मघा",
    11: "पूर्व फाल्गुनी",
    12: "उत्तर फाल्गुनी",
    13: "हस्त",
    14: "चित्रा",
    15: "स्वाति",
    16: "विशाखा",
    17: "अनुराधा",
    18: "ज्येष्ठा",
    19: "मूल",
    20: "पूर्वाषाढ़ा",
    21: "उत्तराषाढ़ा",
    22: "श्रवण",
    23: "धनिष्ठा",
    24: "शतभिषा",
    25: "पूर्व भाद्रपद",
    26: "उत्तर भाद्रपद",
    27: "रेवती",
  },
  yoga: {
    1: "विष्कम्भ",
    2: "प्रीति",
    3: "आयुष्मान",
    4: "सौभाग्य",
    5: "शोभन",
    6: "अतिगण्ड",
    7: "सुकर्मा",
    8: "धृति",
    9: "शूल",
    10: "गण्ड",
    11: "वृद्धि",
    12: "ध्रुव",
    13: "व्याघात",
    14: "हर्षण",
    15: "वज्र",
    16: "सिद्धि",
    17: "व्यतिपात",
    18: "वरीयान",
    19: "परिघ",
    20: "शिव",
    21: "सिद्ध",
    22: "साध्य",
    23: "शुभ",
    24: "शुक्ल",
    25: "ब्रह्म",
    26: "इन्द्र",
    27: "वैधृति",
  },
  karana: {
    1: "बव",
    2: "बालव",
    3: "कौलव",
    4: "तैतिल",
    5: "गर",
    6: "वणिज",
    7: "विष्टि",
    8: "शकुनि",
    9: "चतुष्पद",
    10: "नाग",
    11: "किंस्तुघ्न",
  },
  weekday: {
    0: "रविवार",
    1: "सोमवार",
    2: "मंगलवार",
    3: "बुधवार",
    4: "गुरुवार",
    5: "शुक्रवार",
    6: "शनिवार",
  },
  month_gregorian: {
    1: "जनवरी",
    2: "फरवरी",
    3: "मार्च",
    4: "अप्रैल",
    5: "मई",
    6: "जून",
    7: "जुलाई",
    8: "अगस्त",
    9: "सितंबर",
    10: "अक्टूबर",
    11: "नवंबर",
    12: "दिसंबर",
  },
  month_lunar: {
    1: "चैत्र",
    2: "वैशाख",
    3: "ज्येष्ठ",
    4: "आषाढ़",
    5: "श्रावण",
    6: "भाद्रपद",
    7: "आश्विन",
    8: "कार्तिक",
    9: "मार्गशीर्ष",
    10: "पौष",
    11: "माघ",
    12: "फाल्गुन",
  },
  month_solar: {
    1: "मेष",
    2: "वृषभ",
    3: "मिथुन",
    4: "कर्क",
    5: "सिंह",
    6: "कन्या",
    7: "तुला",
    8: "वृश्चिक",
    9: "धनु",
    10: "मकर",
    11: "कुम्भ",
    12: "मीन",
  },
  rashi: {
    1: "मेष",
    2: "वृषभ",
    3: "मिथुन",
    4: "कर्क",
    5: "सिंह",
    6: "कन्या",
    7: "तुला",
    8: "वृश्चिक",
    9: "धनु",
    10: "मकर",
    11: "कुम्भ",
    12: "मीन",
  },
  planet: {
    sun: "सूर्य",
    moon: "चन्द्र",
    mars: "मंगल",
    mercury: "बुध",
    jupiter: "गुरु",
    venus: "शुक्र",
    saturn: "शनि",
    rahu: "राहु",
    ketu: "केतु",
  },
  house: {
    1: "लग्न भाव",
    2: "धन भाव",
    3: "सहज भाव",
    4: "सुख भाव",
    5: "पुत्र भाव",
    6: "रिपु भाव",
    7: "कलत्र भाव",
    8: "आयु भाव",
    9: "धर्म भाव",
    10: "कर्म भाव",
    11: "लाभ भाव",
    12: "व्यय भाव",
  },
  direction: {
    east: "पूर्व",
    west: "पश्चिम",
    north: "उत्तर",
    south: "दक्षिण",
    northeast: "ईशान्य",
    northwest: "वायव्य",
    southeast: "आग्नेय",
    southwest: "नैऋत्य",
  },
  element: { fire: "अग्नि", earth: "पृथ्वी", air: "वायु", water: "जल", ether: "आकाश" },
  festival: {
    diwali: "दीपावली",
    holi: "होली",
    raksha_bandhan: "रक्षा बंधन",
    janmashtami: "कृष्ण जन्माष्टमी",
    maha_shivaratri: "महा शिवरात्रि",
    ganesh_chaturthi: "गणेश चतुर्थी",
    navratri: "नवरात्रि",
    makar_sankranti: "मकर संक्रांति",
    karva_chauth: "करवा चौथ",
    ekadashi: "एकादशी",
    purnima: "पूर्णिमा",
    amavasya: "अमावस्या",
  },
  astro_term: {
    panchang: "पंचांग",
    kundli: "कुण्डली",
    lagna: "लग्न",
    navamsa: "नवमांश",
    mahadasha: "महादशा",
    antardasha: "अन्तर्दशा",
    pratyantardasha: "प्रत्यन्तर्दशा",
    gochar: "गोचर",
    muhurat: "मुहूर्त",
    ayanamsa: "अयनांश",
    tithi: "तिथि",
    nakshatra: "नक्षत्र",
    yoga: "योग",
    karana: "करण",
    rahu_kaal: "राहु काल",
    gulika_kaal: "गुलिक काल",
    yamaganda: "यमगण्ड",
    abhijit_muhurat: "अभिजित मुहूर्त",
    brahma_muhurat: "ब्रह्म मुहूर्त",
    sunrise: "सूर्योदय",
    sunset: "सूर्यास्त",
    moonrise: "चन्द्रोदय",
    moonset: "चन्द्रास्त",
    rashi: "राशि",
    graha: "ग्रह",
    bhava: "भाव",
    drishti: "दृष्टि",
    yoni: "योनि",
    gana: "गण",
    nadi: "नाड़ी",
    varna: "वर्ण",
    vashya: "वश्य",
    tara: "तारा",
    ashtakoot: "अष्टकूट",
    gun_milan: "गुण मिलान",
  },
};

// Marathi and Gujarati share most Devanagari/Sanskrit terms with Hindi
// for astrological vocabulary; native scripts diverge for a few strings.
const MR: Partial<DomainMap> = {
  ...HI,
  weekday: {
    0: "रविवार",
    1: "सोमवार",
    2: "मंगळवार",
    3: "बुधवार",
    4: "गुरुवार",
    5: "शुक्रवार",
    6: "शनिवार",
  },
};

const GU: Partial<DomainMap> = {
  paksha: { shukla: "શુક્લ પક્ષ", krishna: "કૃષ્ણ પક્ષ" },
  weekday: {
    0: "રવિવાર",
    1: "સોમવાર",
    2: "મંગળવાર",
    3: "બુધવાર",
    4: "ગુરુવાર",
    5: "શુક્રવાર",
    6: "શનિવાર",
  },
  rashi: {
    1: "મેષ",
    2: "વૃષભ",
    3: "મિથુન",
    4: "કર્ક",
    5: "સિંહ",
    6: "કન્યા",
    7: "તુલા",
    8: "વૃશ્ચિક",
    9: "ધનુ",
    10: "મકર",
    11: "કુંભ",
    12: "મીન",
  },
  tithi: {
    ...(HI.tithi as Dict),
    11: "એકાદશી",
    15: "પૂર્ણિમા",
    26: "એકાદશી",
    30: "અમાવસ્યા",
  },
};

const TA: Partial<DomainMap> = {
  paksha: { shukla: "சுக்ல பக்ஷம்", krishna: "கிருஷ்ண பக்ஷம்" },
  weekday: {
    0: "ஞாயிறு",
    1: "திங்கள்",
    2: "செவ்வாய்",
    3: "புதன்",
    4: "வியாழன்",
    5: "வெள்ளி",
    6: "சனி",
  },
  rashi: {
    1: "மேஷம்",
    2: "ரிஷபம்",
    3: "மிதுனம்",
    4: "கடகம்",
    5: "சிம்மம்",
    6: "கன்னி",
    7: "துலாம்",
    8: "விருச்சிகம்",
    9: "தனுசு",
    10: "மகரம்",
    11: "கும்பம்",
    12: "மீனம்",
  },
  tithi: {
    1: "பிரதமை",
    2: "துவிதியை",
    3: "திருதியை",
    4: "சதுர்த்தி",
    5: "பஞ்சமி",
    6: "சஷ்டி",
    7: "சப்தமி",
    8: "அஷ்டமி",
    9: "நவமி",
    10: "தசமி",
    11: "ஏகாதசி",
    12: "துவாதசி",
    13: "திரயோதசி",
    14: "சதுர்தசி",
    15: "பௌர்ணமி",
    16: "பிரதமை",
    17: "துவிதியை",
    18: "திருதியை",
    19: "சதுர்த்தி",
    20: "பஞ்சமி",
    21: "சஷ்டி",
    22: "சப்தமி",
    23: "அஷ்டமி",
    24: "நவமி",
    25: "தசமி",
    26: "ஏகாதசி",
    27: "துவாதசி",
    28: "திரயோதசி",
    29: "சதுர்தசி",
    30: "அமாவாசை",
  },
  astro_term: {
    ...EN.astro_term,
    panchang: "பஞ்சாங்கம்",
    kundli: "ஜாதகம்",
    lagna: "லக்னம்",
    tithi: "திதி",
    nakshatra: "நக்ஷத்திரம்",
    yoga: "யோகம்",
    karana: "கரணம்",
    rahu_kaal: "ராகு காலம்",
    muhurat: "முகூர்த்தம்",
    rashi: "ராசி",
  },
};

const TE: Partial<DomainMap> = {
  weekday: {
    0: "ఆదివారం",
    1: "సోమవారం",
    2: "మంగళవారం",
    3: "బుధవారం",
    4: "గురువారం",
    5: "శుక్రవారం",
    6: "శనివారం",
  },
  rashi: {
    1: "మేషం",
    2: "వృషభం",
    3: "మిథునం",
    4: "కర్కాటకం",
    5: "సింహం",
    6: "కన్య",
    7: "తుల",
    8: "వృశ్చికం",
    9: "ధనుస్సు",
    10: "మకరం",
    11: "కుంభం",
    12: "మీనం",
  },
};

const KN: Partial<DomainMap> = {
  weekday: {
    0: "ಭಾನುವಾರ",
    1: "ಸೋಮವಾರ",
    2: "ಮಂಗಳವಾರ",
    3: "ಬುಧವಾರ",
    4: "ಗುರುವಾರ",
    5: "ಶುಕ್ರವಾರ",
    6: "ಶನಿವಾರ",
  },
  rashi: {
    1: "ಮೇಷ",
    2: "ವೃಷಭ",
    3: "ಮಿಥುನ",
    4: "ಕರ್ಕ",
    5: "ಸಿಂಹ",
    6: "ಕನ್ಯಾ",
    7: "ತುಲಾ",
    8: "ವೃಶ್ಚಿಕ",
    9: "ಧನು",
    10: "ಮಕರ",
    11: "ಕುಂಭ",
    12: "ಮೀನ",
  },
};

const BN: Partial<DomainMap> = {
  weekday: {
    0: "রবিবার",
    1: "সোমবার",
    2: "মঙ্গলবার",
    3: "বুধবার",
    4: "বৃহস্পতিবার",
    5: "শুক্রবার",
    6: "শনিবার",
  },
  rashi: {
    1: "মেষ",
    2: "বৃষ",
    3: "মিথুন",
    4: "কর্কট",
    5: "সিংহ",
    6: "কন্যা",
    7: "তুলা",
    8: "বৃশ্চিক",
    9: "ধনু",
    10: "মকর",
    11: "কুম্ভ",
    12: "মীন",
  },
};

const ML: Partial<DomainMap> = {
  weekday: {
    0: "ഞായർ",
    1: "തിങ്കൾ",
    2: "ചൊവ്വ",
    3: "ബുധൻ",
    4: "വ്യാഴം",
    5: "വെള്ളി",
    6: "ശനി",
  },
  rashi: {
    1: "മേടം",
    2: "ഇടവം",
    3: "മിഥുനം",
    4: "കർക്കടകം",
    5: "ചിങ്ങം",
    6: "കന്നി",
    7: "തുലാം",
    8: "വൃശ്ചികം",
    9: "ധനു",
    10: "മകരം",
    11: "കുംഭം",
    12: "മീനം",
  },
};

const PA: Partial<DomainMap> = {
  weekday: {
    0: "ਐਤਵਾਰ",
    1: "ਸੋਮਵਾਰ",
    2: "ਮੰਗਲਵਾਰ",
    3: "ਬੁੱਧਵਾਰ",
    4: "ਵੀਰਵਾਰ",
    5: "ਸ਼ੁੱਕਰਵਾਰ",
    6: "ਸ਼ਨੀਵਾਰ",
  },
};

const OR: Partial<DomainMap> = {
  weekday: {
    0: "ରବିବାର",
    1: "ସୋମବାର",
    2: "ମଙ୍ଗଳବାର",
    3: "ବୁଧବାର",
    4: "ଗୁରୁବାର",
    5: "ଶୁକ୍ରବାର",
    6: "ଶନିବାର",
  },
};

const AS: Partial<DomainMap> = {
  weekday: {
    0: "দেওবাৰ",
    1: "সোমবাৰ",
    2: "মঙ্গলবাৰ",
    3: "বুধবাৰ",
    4: "বৃহস্পতিবাৰ",
    5: "শুক্রবাৰ",
    6: "শনিবাৰ",
  },
};

// Master registry — every language, keyed by ISO code.
export const LOCALIZED: Record<string, Partial<DomainMap>> = {
  en: EN,
  hi: HI,
  mr: MR,
  gu: GU,
  ta: TA,
  te: TE,
  kn: KN,
  bn: BN,
  ml: ML,
  pa: PA,
  or: OR,
  as: AS,
};

/**
 * Resolve an astro label for a given (domain, id, language).
 * Fallback order: language → English → stringified id.
 *
 * Admin overrides via the `translations` table with key
 * `astro.<domain>.<id>` take precedence — they are merged into
 * the language dict by the I18nProvider before this runs.
 */
export function getAstroLabel(
  domain: AstroDomain,
  id: string | number,
  lang: string,
  overrides?: Record<string, string>,
): string {
  const overrideKey = `astro.${domain}.${id}`;
  if (overrides && overrides[overrideKey]) return overrides[overrideKey];

  const langDict = LOCALIZED[lang]?.[domain];
  if (langDict && langDict[id] != null) return langDict[id];

  const enDict = EN[domain];
  if (enDict && enDict[id] != null) return enDict[id];

  return String(id);
}

/** List every canonical (domain, id, english) — used by admin translation panel. */
export function listAstroKeys(): { domain: AstroDomain; id: string; en: string }[] {
  const out: { domain: AstroDomain; id: string; en: string }[] = [];
  (Object.keys(EN) as AstroDomain[]).forEach((domain) => {
    Object.entries(EN[domain]).forEach(([id, en]) => {
      out.push({ domain, id, en });
    });
  });
  return out;
}

/** Coverage report — % of English keys translated per language. */
export function astroCoverage(): Record<string, number> {
  const totalKeys = listAstroKeys().length;
  const out: Record<string, number> = {};
  for (const lang of Object.keys(LOCALIZED)) {
    let n = 0;
    for (const [domain, dict] of Object.entries(LOCALIZED[lang] ?? {})) {
      n += Object.keys(dict ?? {}).length;
    }
    out[lang] = Math.round((n / totalKeys) * 100);
  }
  return out;
}

// Re-export the language type for consumers.
export type { LanguageDef };
