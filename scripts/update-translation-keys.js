import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const translationsDir = path.resolve(__dirname, "../src/i18n/translations");

const baseKundliSection = {
  en: {
    eyebrow: "Vedic Astrology",
    title: "Kundli & Jyotish Tools",
    description:
      "Complete suite of Vedic astrology — Kundli, matching, dasha, muhurat, numerology, Vastu, career reports and more, all in one place.",
    explore_all: "Explore all",
    open: "Open",
    trusted: "Trusted by 50,000+ seekers",
    lahiri: "Lahiri Ayanamsa",
    free_core: "100% Free core tools",
    see_all: "See all astrology tools →",
  },
  hi: {
    eyebrow: "वैदिक ज्योतिष",
    title: "कुंडली एवं ज्योतिष टूल्स",
    description:
      "वैदिक ज्योतिष का संपूर्ण संग्रह — कुंडली, मिलान, दशा, मुहूर्त, अंकशास्त्र, वास्तु, करियर रिपोर्ट और बहुत कुछ, एक ही स्थान पर।",
    explore_all: "सभी देखें",
    open: "खोलें",
    trusted: "50,000+ साधकों द्वारा विश्वस्त",
    lahiri: "लाहिड़ी अयनांश",
    free_core: "100% नि:शुल्क टूल्स",
    see_all: "सभी ज्योतिष टूल्स देखें →",
  },
};

const baseKundliTools = {
  en: {
    free_kundli: {
      title: "Free Janam Kundli",
      desc: "Full Vedic birth chart with D1/D9, planets, houses & AI reading.",
    },
    kundli_matching: {
      title: "Kundli Matching",
      desc: "Ashtakoot 36 guna, Mangal & Nadi dosha check.",
    },
    love_compatibility: {
      title: "Love Compatibility",
      desc: "Modern Vedic relationship & emotional compatibility.",
    },
    muhurat_finder: {
      title: "Muhurat Finder",
      desc: "Choghadiya, Rahu Kaal & auspicious daily windows.",
    },
    career_report: {
      title: "Career & Business",
      desc: "10th-house analysis with career planet insights.",
    },
    varshphal: {
      title: "Varshphal — Annual",
      desc: "Yearly horoscope from Maha Dasha & solar return.",
    },
    numerology: {
      title: "Numerology Report",
      desc: "Life Path & Destiny number with Vedic planet vibration.",
    },
    vastu: {
      title: "Vastu Shastra Guide",
      desc: "8 directions, room placement & practical remedies.",
    },
    baby_name: {
      title: "Baby Name Generator",
      desc: "Sanskrit names by nakshatra, deity & meaning.",
    },
    rashi_calc: {
      title: "Rashi Calculator",
      desc: "Find your Moon sign (Chandra Rashi) accurately.",
    },
    nakshatra_finder: {
      title: "Nakshatra Finder",
      desc: "Discover your birth Nakshatra, pada & deity.",
    },
    gemstone: {
      title: "Gemstone Recommender",
      desc: "Lucky gemstone based on Lagna & planets.",
    },
  },
  hi: {
    free_kundli: {
      title: "निःशुल्क जन्म कुंडली",
      desc: "D1/D9 चार्ट, ग्रह, भाव एवं AI व्याख्या सहित पूर्ण जन्म कुंडली।",
    },
    kundli_matching: {
      title: "कुंडली मिलान (गुण मिलान)",
      desc: "अष्टकूट 36 गुण, मंगल एवं नाड़ी दोष जांच।",
    },
    love_compatibility: {
      title: "लव कम्पैटिबिलिटी",
      desc: "आधुनिक वैदिक संबंध एवं भावनात्मक अनुकूलता जांच।",
    },
    muhurat_finder: {
      title: "शुभ मुहूर्त खोजें",
      desc: "चौघड़िया, राहु काल एवं दैनिक शुभ समय।",
    },
    career_report: {
      title: "करियर एवं व्यापार रिपोर्ट",
      desc: "दशम भाव विश्लेषण एवं करियर ग्रह अंतर्दृष्टि।",
    },
    varshphal: {
      title: "वार्षिक वर्षफल",
      desc: "महादशा एवं सौर वर्षफल से वार्षिक राशिफल।",
    },
    numerology: {
      title: "अंकशास्त्र रिपोर्ट",
      desc: "मूलांक एवं भाग्यांक सहित वैदिक ग्रह स्पंदन।",
    },
    vastu: {
      title: "वास्तु शास्त्र गाइड",
      desc: "8 दिशाएं, कक्ष स्थान एवं व्यावहारिक उपाय।",
    },
    baby_name: {
      title: "शिशु नामकरण (AI)",
      desc: "नक्षत्र, देवता एवं अर्थ अनुसार संस्कृत नाम।",
    },
    rashi_calc: {
      title: "राशि कैलकुलेटर",
      desc: "अपनी चंद्र राशि (Moon Sign) सटीक जानें।",
    },
    nakshatra_finder: {
      title: "नक्षत्र खोजें",
      desc: "अपना जन्म नक्षत्र, चरण एवं स्वामी देवता जानें।",
    },
    gemstone: {
      title: "रत्न सुझाव",
      desc: "लग्न एवं ग्रहों के अनुसार शुभ रत्न सलाह।",
    },
  },
};

const baseBadges = {
  en: { popular: "Popular", new: "New", premium: "Premium" },
  hi: { popular: "लोकप्रिय", new: "नया", premium: "प्रीमियम" },
};

const files = fs.readdirSync(translationsDir).filter((f) => f.endsWith(".json"));

for (const file of files) {
  const langCode = file.replace(".json", "");
  const filePath = path.join(translationsDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  data.home = data.home || {};
  data.home.kundli_section = baseKundliSection[langCode] || baseKundliSection.en;
  data.home.kundli_tools = baseKundliTools[langCode] || baseKundliTools.en;

  data.badges = data.badges || {};
  const badgesForLang = baseBadges[langCode] || baseBadges.en;
  Object.assign(data.badges, badgesForLang);

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
  console.log(`Updated ${file}`);
}

console.log("All translation files updated successfully!");
