import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const translationsDir = path.resolve(__dirname, "../src/i18n/translations");

const dictionaries = {
  en: {
    kundli_section: {
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
    kundli: {
      aiPanel: {
        title: "AI Kundli Analysis & Insights",
        subtitle: "Personalized AI-powered astrological interpretation of your birth chart",
        premium_badge: "PREMIUM REPORT",
        free_preview_badge: "FREE PREVIEW",
        unlock_full_report: "Unlock Full Report",
        premium_only: "Premium Feature",
        loading_title: "GENERATING AI KUNDLI INTERPRETATION",
        loading_subtitle: "Analyzing planetary placements, house positions & classical Vedic yogas...",
        loading_tips: {
          "0": "Calculating planetary dignities and Ashtakavarga strength...",
          "1": "Synthesizing Vimshottari Dasha sub-periods with natal chart placements...",
          "2": "Evaluating 150+ classical Yogas and Dosha cancellation rules...",
          "3": "Formatting custom personalized life recommendations..."
        },
        could_not_generate: "Could not generate AI interpretation",
        retry: "Retry",
        disclaimer: "Disclaimer: AI interpretations are generated using classical Vedic astrology principles for guidance and educational purposes."
      }
    },
    kundli_tools: {
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
      gemstone: { title: "Gemstone Recommender", desc: "Lucky gemstone based on Lagna & planets." },
    },
    badges: { popular: "Popular", new: "New", premium: "Premium" },
  },
  hi: {
    kundli_section: {
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
    kundli_tools: {
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
      muhurat_finder: { title: "शुभ मुहूर्त खोजें", desc: "चौघड़िया, राहु काल एवं दैनिक शुभ समय।" },
      career_report: {
        title: "करियर एवं व्यापार रिपोर्ट",
        desc: "दशम भाव विश्लेषण एवं करियर ग्रह अंतर्दृष्टि।",
      },
      varshphal: { title: "वार्षिक वर्षफल", desc: "महादशा एवं सौर वर्षफल से वार्षिक राशिफल।" },
      numerology: {
        title: "अंकशास्त्र रिपोर्ट",
        desc: "मूलांक एवं भाग्यांक सहित वैदिक ग्रह स्पंदन।",
      },
      vastu: { title: "वास्तु शास्त्र गाइड", desc: "8 दिशाएं, कक्ष स्थान एवं व्यावहारिक उपाय।" },
      baby_name: { title: "शिशु नामकरण (AI)", desc: "नक्षत्र, देवता एवं अर्थ अनुसार संस्कृत नाम।" },
      rashi_calc: { title: "राशि कैलकुलेटर", desc: "अपनी चंद्र राशि (Moon Sign) सटीक जानें।" },
      nakshatra_finder: {
        title: "नक्षत्र खोजें",
        desc: "अपना जन्म नक्षत्र, चरण एवं स्वामी देवता जानें।",
      },
      gemstone: { title: "रत्न सुझाव", desc: "लग्न एवं ग्रहों के अनुसार शुभ रत्न सलाह।" },
    },
    badges: { popular: "लोकप्रिय", new: "नया", premium: "प्रीमियम" },
  },
  mr: {
    kundli_section: {
      eyebrow: "वैदिक ज्योतिष",
      title: "कुंडली आणि ज्योतिष साधने",
      description:
        "वैदिक ज्योतिषाचा संपूर्ण संग्रह — कुंडली, गुण जुळवणी, महादशा, मुहूर्त, अंकशास्त्र, वास्तू, करिअर अहवाल आणि बरंच काही एकाच ठिकाणी.",
      explore_all: "सर्व पाहा",
      open: "उघडा",
      trusted: "50,000+ साधकांचा विश्वास",
      lahiri: "लाहिडी अयनांश",
      free_core: "100% मोफत साधने",
      see_all: "सर्व ज्योतिष साधने पाहा →",
    },
    kundli_tools: {
      free_kundli: {
        title: "मोफत जन्म कुंडली",
        desc: "D1/D9 तक्ता, ग्रह स्थिति, भाव आणि AI विश्लेषणासह संपूर्ण कुंडली.",
      },
      kundli_matching: {
        title: "कुंडली जुळवणी (गुण मिलन)",
        desc: "अष्टकूट 36 गुण, मंगळ व नाडी दोष तपासणी.",
      },
      love_compatibility: {
        title: "प्रेम सुसंगतता",
        desc: "आधुनिक वैदिक संबंध आणि भावनिक सुसंगतता.",
      },
      muhurat_finder: { title: "शुभ मुहूर्त शोधक", desc: "चौघडिया, राहू काळ आणि दैनंदिन शुभ वेळ." },
      career_report: {
        title: "करिअर आणि व्यवसाय रिपोर्ट",
        desc: "दशम भाव विश्लेषण आणि करिअर ग्रहांची अंतर्दृष्टी.",
      },
      varshphal: { title: "वार्षिक वर्षफळ", desc: "महादशा आणि सौर चक्रावरून वार्षिक राशीभविष्य." },
      numerology: { title: "अंकशास्त्र अहवाल", desc: "मूलांक आणि भाग्यांकासह वैदिक ग्रह स्पंदन." },
      vastu: {
        title: "वास्तू शास्त्र मार्गदर्शक",
        desc: "८ दिशा, खोलीची रचना आणि व्यावहारिक उपाय.",
      },
      baby_name: {
        title: "बाळाचे नाव शोधक (AI)",
        desc: "नक्षत्र, देवता आणि अर्थानुसार संस्कृत नावे.",
      },
      rashi_calc: { title: "राशी कॅल्क्युलेटर", desc: "आपली चंद्र राशी अचूक शोधा." },
      nakshatra_finder: {
        title: "नक्षत्र शोधक",
        desc: "आपले जन्म नक्षत्र, चरण आणि स्वामी देवता जाणून घ्या.",
      },
      gemstone: { title: "रत्न शिफारस", desc: "लग्न आणि ग्रहांनुसार लकी रत्न सल्ला." },
    },
    badges: { popular: "लोकप्रिय", new: "नवीन", premium: "प्रीमियम" },
  },
  gu: {
    kundli_section: {
      eyebrow: "વૈદિક જ્યોતિષ",
      title: "કુંડળી અને જ્યોતિષ સાધનો",
      description:
        "વૈદિક જ્યોતિષનો સંપૂર્ણ સંગ્રહ — કુંડળી, ગુણ મિલન, મહાદશા, મુહૂર્ત, અંકશાસ્ત્ર, વાસ્તુ, કરિયર રિપોર્ટ અને ઘણું બધું એક જ જગ્યાએ.",
      explore_all: "બધા જુઓ",
      open: "ખોલો",
      trusted: "50,000+ સાધકો દ્વારા વિશ્વસનીય",
      lahiri: "લાહિડી અયનાંશ",
      free_core: "100% મફત સાધનો",
      see_all: "તમામ જ્યોતિષ સાધનો જુઓ →",
    },
    kundli_tools: {
      free_kundli: {
        title: "મફત જન્મ કુંડળી",
        desc: "D1/D9 ચાર્ટ, ગ્રહો, ભાવ અને AI વિશ્લેષણ સાથે પૂર્ણ કુંડળી.",
      },
      kundli_matching: {
        title: "કુંડળી મિલન (ગુણ મિલન)",
        desc: "અષ્ટકૂટ 36 ગુણ, મંગળ અને નાડી દોષ તપાસ.",
      },
      love_compatibility: {
        title: "પ્રેમ અનુકૂળતા",
        desc: "આધુનિક વૈદિક સંબંધ અને ભાવાત્મક અનુકૂળતા.",
      },
      muhurat_finder: { title: "શુભ મુહૂર્ત શોધક", desc: "ચોઘડિયા, રાહુ કાળ અને દૈનિક શુભ સમય." },
      career_report: {
        title: "કરિયર અને વ્યવસાય રિપોર્ટ",
        desc: "દશમ ભાવ વિશ્લેષણ અને ગ્રહ અંતર્દ્રષ્ટિ.",
      },
      varshphal: { title: "વાર્ષિક વર્ષફળ", desc: "મહાદશા અને સૂર્ય ચક્ર પરથી વાર્ષિક રાશિફળ." },
      numerology: {
        title: "અંકશાસ્ત્ર રિપોર્ટ",
        desc: "મૂળાંક અને ભાગ્યાંક સાથે વૈદિક ગ્રહ કંપન.",
      },
      vastu: {
        title: "વાસ્તુ શાસ્ત્ર માર્ગદર્શિકા",
        desc: "8 દિશાઓ, રૂમ ની ગોઠવણી અને વ્યવહારુ ઉપાયો.",
      },
      baby_name: {
        title: "બાળકનું નામકરણ (AI)",
        desc: "નક્ષત્ર, દેવતા અને અર્થ મુજબ સંસ્કૃત નામો.",
      },
      rashi_calc: { title: "રાશિ કેલ્ક્યુલેટર", desc: "તમારી ચંદ્ર રાશિ ચોક્કસ શોધો." },
      nakshatra_finder: {
        title: "નક્ષત્ર શોધક",
        desc: "તમારું જન્મ નક્ષત્ર, ચરણ અને સ્વામી દેવતા જાણો.",
      },
      gemstone: { title: "રત્ન ભલામણ", desc: "લગ્ન અને ગ્રહો મુજબ લકી રત્ન સલાહ." },
    },
    badges: { popular: "લોકપ્રિય", new: "નવું", premium: "પ્રીમિયમ" },
  },
  bn: {
    kundli_section: {
      eyebrow: "বৈদিক জ্যোতিষ",
      title: "কুষ্ঠি ও জ্যোতিষ সরঞ্জাম",
      description:
        "বৈদিক জ্যোতিষের সম্পূর্ণ সংগ্রহ — কুষ্ঠি, যোটক বিচার, দশা, মুহূর্ত, সংখ্যা জ্যোতিষ, বাস্তু, ক্যারেয়ার রিপোর্ট এবং আরও অনেক কিছু এক জায়গায়।",
      explore_all: "সব দেখুন",
      open: "খুলুন",
      trusted: "৫০,০০০+ অনুসারী দ্বারা বিশ্বস্ত",
      lahiri: "লাহিড়ী অয়নাম্শ",
      free_core: "১০০% বিনামূল্যে সরঞ্জাম",
      see_all: "সমস্ত জ্যোতিষ সরঞ্জাম দেখুন →",
    },
    kundli_tools: {
      free_kundli: {
        title: "বিনামূল্যে জন্ম কুষ্ঠি",
        desc: "D1/D9 ছক, গ্রহের অবস্থান, ভাব ও AI ব্যাখ্যা সহ সম্পূর্ণ জন্ম কুষ্ঠি।",
      },
      kundli_matching: {
        title: "কুষ্ঠি যোটক বিচার",
        desc: "অষ্টকূট ৩৬ গুণ, মঙ্গল ও নাড়ী দোষ বিচার।",
      },
      love_compatibility: {
        title: "প্রেমের সামঞ্জস্যতা",
        desc: "আধুনিক বৈদিক সম্পর্ক ও আবেগীয় সামঞ্জস্য পরীক্ষা।",
      },
      muhurat_finder: {
        title: "শুভ মুহূর্ত নির্ণয়",
        desc: "চৌঘড়িয়া, রাহুকাল ও দৈনিক শুভ সময়।",
      },
      career_report: {
        title: "ক্যারিয়ার ও ব্যবসা রিপোর্ট",
        desc: "দশম ভাব বিশ্লেষণ ও কর্মজীবনের গ্রহীয় নির্দেশিকা।",
      },
      varshphal: { title: "বার্ষিক বর্ষফল", desc: "মহাদশা ও সৌর বর্ষফল অনুযায়ী বার্ষিক রাশিফল।" },
      numerology: {
        title: "সংখ্যা জ্যোতিষ রিপোর্ট",
        desc: "মূলাঙ্ক ও ভাগ্য সংখ্যা সহ বৈদিক গ্রহীয় কম্পন।",
      },
      vastu: { title: "বাস্তু শাস্ত্র গাইড", desc: "৮টি দিক, ঘরের অবস্থান ও ব্যবহারিক প্রতিকার।" },
      baby_name: {
        title: "শিশুর নামকরণ (AI)",
        desc: "নক্ষত্র, দেবতা ও অর্থ অনুযায়ী সংস্কৃত নাম।",
      },
      rashi_calc: {
        title: "রাশি ক্যালকুলেটর",
        desc: "আপনার চন্দ্র রাশি (Moon Sign) নির্ভুলভাবে জানুন।",
      },
      nakshatra_finder: {
        title: "নক্ষত্র নির্ণয়",
        desc: "আপনার জন্ম নক্ষত্র, পদ ও অধিষ্ঠাত্রী দেবতা জানুন।",
      },
      gemstone: {
        title: "রত্ন পরামর্শ",
        desc: "লগ্ন ও গ্রহ অনুযায়ী ভাগ্য নিয়ন্ত্রক রত্ন পরামর্শ।",
      },
    },
    badges: { popular: "জনপ্রিয়", new: "নতুন", premium: "প্রিমিয়াম" },
  },
  pa: {
    kundli_section: {
      eyebrow: "ਵੈਦਿਕ ਜੋਤਿਸ਼",
      title: "ਕੁੰਡਲੀ ਅਤੇ ਜੋਤਿਸ਼ ਔਜ਼ਾਰ",
      description:
        "ਵੈਦਿਕ ਜੋਤਿਸ਼ ਦਾ ਪੂਰਾ ਸੰਗ੍ਰਹਿ — ਕੁੰਡਲੀ, ਮਿਲਾਨ, ਦਸ਼ਾ, ਮੁਹੂਰਤ, ਅੰਕ ਜੋਤਿਸ਼, ਵਾਸਤੂ, ਕਰੀਅਰ ਰਿਪੋਰਟ ਅਤੇ ਹੋਰ ਬਹੁਤ ਕੁਝ ਇੱਕੋ ਥਾਂ 'ਤੇ।",
      explore_all: "ਸਾਰੇ ਦੇਖੋ",
      open: "ਖੋਲ੍ਹੋ",
      trusted: "50,000+ ਸ਼ਰਧਾਲੂਆਂ ਦੁਆਰਾ ਵਿਸ਼ਵਾਸਯੋਗ",
      lahiri: "ਲਾਹਿੜੀ ਅਯਨਾਂਸ਼",
      free_core: "100% ਮੁਫ਼ਤ ਔਜ਼ਾਰ",
      see_all: "ਸਾਰੇ ਜੋਤਿਸ਼ ਔਜ਼ਾਰ ਦੇਖੋ →",
    },
    kundli_tools: {
      free_kundli: {
        title: "ਮੁਫ਼ਤ ਜਨਮ ਕੁੰਡਲੀ",
        desc: "D1/D9 ਚਾਰਟ, ਗ੍ਰਹਿ, ਭਾਵ ਅਤੇ AI ਵਿਆਖਿਆ ਸਮੇਤ ਪੂਰੀ ਕੁੰਡਲੀ।",
      },
      kundli_matching: {
        title: "ਕੁੰਡਲੀ ਮਿਲਾਨ (ਗੁਣ ਮਿਲਾਨ)",
        desc: "ਅਸ਼ਟਕੂਟ 36 ਗੁਣ, ਮੰਗਲ ਅਤੇ ਨਾੜੀ ਦੋਸ਼ ਜਾਂਚ।",
      },
      love_compatibility: {
        title: "ਪਿਆਰ ਅਨੁਕੂਲਤਾ",
        desc: "ਆਧੁਨਿਕ ਵੈਦਿਕ ਰਿਸ਼ਤੇ ਅਤੇ ਭਾਵਨਾਤਮਕ ਅਨੁਕੂਲਤਾ।",
      },
      muhurat_finder: {
        title: "ਸ਼ੁਭ ਮੁਹੂਰਤ ਖੋਜਕ",
        desc: "ਚੌਘੜੀਆ, ਰਾਹੂ ਕਾਲ ਅਤੇ ਰੋਜ਼ਾਨਾ ਸ਼ੁਭ ਸਮਾਂ।",
      },
      career_report: {
        title: "ਕਰੀਅਰ ਅਤੇ ਕਾਰੋਬਾਰ ਰਿਪੋਰਟ",
        desc: "ਦਸਵੇਂ ਭਾਵ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਅਤੇ ਕਰੀਅਰ ਗ੍ਰਹਿ।",
      },
      varshphal: { title: "ਸਾਲਾਨਾ ਵਰਸ਼ਫਲ", desc: "ਮਹਾਦਸ਼ਾ ਅਤੇ ਸੂਰਜ ਚੱਕਰ ਤੋਂ ਸਾਲਾਨਾ ਰਾਸ਼ੀਫਲ।" },
      numerology: { title: "ਅੰਕ ਜੋਤਿਸ਼ ਰਿਪੋਰਟ", desc: "ਮੂਲਾਂਕ ਅਤੇ ਭਾਗਿਆਂਕ ਨਾਲ ਵੈਦਿਕ ਗ੍ਰਹਿ ਕੰਪਨ।" },
      vastu: { title: "ਵਾਸਤੂ ਸ਼ਾਸਤਰ ਗਾਈਡ", desc: "8 ਦਿਸ਼ਾਵਾਂ, ਕਮਰੇ ਦੀ ਸਥਿਤੀ ਅਤੇ ਉਪਾਅ।" },
      baby_name: {
        title: "ਬੱਚੇ ਦਾ ਨਾਮਕਰਨ (AI)",
        desc: "ਨਕਸ਼ਤਰ, ਦੇਵਤਾ ਅਤੇ ਅਰਥ ਅਨੁਸਾਰ ਸੰਸਕ੍ਰਿਤ ਨਾਮ।",
      },
      rashi_calc: { title: "ਰਾਸ਼ੀ ਕੈਲਕੁਲੇਟਰ", desc: "ਆਪਣੀ ਚੰਦਰ ਰਾਸ਼ੀ ਸਹੀ ਲੱਭੋ।" },
      nakshatra_finder: { title: "ਨਕਸ਼ਤਰ ਖੋਜਕ", desc: "ਆਪਣਾ ਜਨਮ ਨਕਸ਼ਤਰ, ਚਰਨ ਅਤੇ ਦੇਵਤਾ ਜਾਣੋ।" },
      gemstone: { title: "ਰਤਨ ਸੁਝਾਅ", desc: "ਲਗਨ ਅਤੇ ਗ੍ਰਹਿਆਂ ਅਨੁਸਾਰ ਸ਼ੁਭ ਰਤਨ ਸਲਾਹ।" },
    },
    badges: { popular: "ਮਸ਼ਹੂਰ", new: "ਨਵਾਂ", premium: "ਪ੍ਰੀਮੀਅਮ" },
  },
  ta: {
    kundli_section: {
      eyebrow: "வேத ஜோதிடம்",
      title: "ஜாதகம் மற்றும் ஜோதிட கருவிகள்",
      description:
        "வேத ஜோதிடத்தின் முழுமையான தொகுப்பு — ஜாதகம், பொருத்தம், தசாபுத்தி, முஹூர்த்தம், எண் கணிதம், வாஸ்து, தொழில் அறிக்கை மற்றும் பல ஒரே இடத்தில்.",
      explore_all: "அனைத்தையும் காண்க",
      open: "திறக்க",
      trusted: "50,000+ பயனர்களால் நம்பப்பட்டது",
      lahiri: "லாஹிரி அயனாம்சம்",
      free_core: "100% இலவச கருவிகள்",
      see_all: "அனைத்து ஜோதிட கருவிகளையும் காண்க →",
    },
    kundli_tools: {
      free_kundli: {
        title: "இலவச பிறப்பு ஜாதகம்",
        desc: "D1/D9 சக்கரம், கிரக நிலைகள் மற்றும் AI விளக்கத்துடன் முழு ஜாதகம்.",
      },
      kundli_matching: {
        title: "ஜாதக பொருத்தம்",
        desc: "அஷ்டகூட 36 குண பொருத்தம், செவ்வாய் & நாடி தோஷ பரிசோதனை.",
      },
      love_compatibility: {
        title: "காதல் பொருத்தம்",
        desc: "நவீன வேத ஜோதிட உறவு மற்றும் உணர்வுபூர்வ பொருத்தம்.",
      },
      muhurat_finder: {
        title: "சுப முகூர்த்தம் காண்க",
        desc: "சொகடியா, ராகு காலம் மற்றும் தினசரி சுப நேரங்கள்.",
      },
      career_report: {
        title: "தொழில் & வியாபார அறிக்கை",
        desc: "10-ஆம் பாவ பகுப்பாய்வு மற்றும் தொழில் கிரக வழிகாட்டல்.",
      },
      varshphal: {
        title: "வருடாந்திர பலன்கள்",
        desc: "மகா தசை மற்றும் சூரிய சுழற்சி அடிப்படையிலான வருடாந்திர பலன்.",
      },
      numerology: {
        title: "எண் கணித அறிக்கை",
        desc: "பிறப்பு எண் மற்றும் விதி எண்ணுடன் வேத கிரக அதிர்வுகள்.",
      },
      vastu: {
        title: "வாஸ்து சாஸ்திர வழிகாட்டி",
        desc: "8 திசைகள், அறை அமைப்பு மற்றும் நடைமுறை பரிகாரங்கள்.",
      },
      baby_name: {
        title: "குழந்தை பெயர் ஜெனரேட்டர்",
        desc: "நட்சத்திரம், தெய்வம் மற்றும் பொருள் சார்ந்த சமஸ்கிருத பெயர்கள்.",
      },
      rashi_calc: { title: "ராசி கணிப்பான்", desc: "உங்கள் சந்திர ராசியை துல்லியமாக கண்டறியவும்." },
      nakshatra_finder: {
        title: "நட்சத்திர கண்டறிதல்",
        desc: "உங்கள் பிறப்பு நட்சத்திரம், பாதம் மற்றும் அதிபதி தெய்வம் அறியலாம்.",
      },
      gemstone: {
        title: "அதிர்ஷ்ட ரத்தின பரிந்துரை",
        desc: "லக்னம் மற்றும் கிரகங்கள் அடிப்படையில் ரத்தின ஆலோசனைகள்.",
      },
    },
    badges: { popular: "பிரபலமானது", new: "புதியது", premium: "பிரிமியம்" },
  },
  te: {
    kundli_section: {
      eyebrow: "వేద జ్యోతిషం",
      title: "జాతకం & జ్యోతిష్య పరికరాలు",
      description:
        "వేద జ్యోతిష్య సంపూర్ణ సమాహారం — జాతకం, గుణ మేళన, దశా కాలం, ముహూర్తం, సంఖ్యా శాస్త్రం, వాస్తు, కెరీర్ నివేదికలు అన్నీ ఒకే చోట.",
      explore_all: "అన్నీ చూడండి",
      open: "తెరువు",
      trusted: "50,000+ సాధకుల నమ్మకం",
      lahiri: "లాహిరి అయనాంశ",
      free_core: "100% ఉచిత పరికరాలు",
      see_all: "అన్ని జ్యోతిష్య పరికరాలను చూడండి →",
    },
    kundli_tools: {
      free_kundli: {
        title: "ఉచిత జన్మ జాతకం",
        desc: "D1/D9 చక్రాలు, గ్రహ స్థితులు మరియు AI వివరణతో సంపూర్ణ జాతకం.",
      },
      kundli_matching: {
        title: "జాతక పొంతన (గుణ మేళన)",
        desc: "అష్టకూట 36 గుణాలు, కుజ దోషం & నాడీ దోష పరిశీలన.",
      },
      love_compatibility: {
        title: "ప్రేమ అనుకూలత",
        desc: "ఆధునిక వేద జ్యోతిష్య సంబంధం మరియు భావోద్వేగ పొంతన.",
      },
      muhurat_finder: {
        title: "శుభ ముహూర్తం",
        desc: "చోఘడియా, రాహు కాలం మరియు దైనందిన శుభ సమయాలు.",
      },
      career_report: {
        title: "కెరీర్ & వ్యాపార నివేదిక",
        desc: "10వ భావ విశ్లేషణ మరియు ఉద్యోగ గ్రహాల మార్గదర్శనం.",
      },
      varshphal: {
        title: "వార్షిక జాతక ఫలాలు",
        desc: "మహాదశ మరియు సూర్య పరిభ్రమణ ఆధారిత వార్షిక ఫలాలు.",
      },
      numerology: {
        title: "సంఖ్యా శాస్త్ర నివేదిక",
        desc: "మూలాంక సంఖ్య మరియు భాగ్యాంకంతో గ్రహ స్పందనలు.",
      },
      vastu: {
        title: "వాస్తు శాస్త్ర మార్గదర్శి",
        desc: "8 దిక్కులు, గదుల అమరిక మరియు ఆచరణాత్మక పరిహారాలు.",
      },
      baby_name: {
        title: "పిల్లల పేర్ల ఎంపిక (AI)",
        desc: "నక్షత్రం, దేవత మరియు అర్థం ఆధారంగా సంస్కృత పేర్లు.",
      },
      rashi_calc: { title: "రాశి క్యాలిక్యులేటర్", desc: "మీ చంద్ర రాశిని ఖచ్చితంగా తెలుసుకోండి." },
      nakshatra_finder: {
        title: "నక్షత్ర శోధన",
        desc: "మీ జన్మ నక్షత్రం, పాదం మరియు అధిపతి దేవత వివరాలు.",
      },
      gemstone: { title: "రత్న సూచనలు", desc: "లగ్నం మరియు గ్రహాల ఆధారంగా అదృష్ట రత్న సలహాలు." },
    },
    badges: { popular: "పాపులర్", new: "కొత్తది", premium: "ప్రీమియం" },
  },
  kn: {
    kundli_section: {
      eyebrow: "ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯ",
      title: "ಜಾತಕ ಮತ್ತು ಜ್ಯೋತಿಷ್ಯ ಉಪಕರಣಗಳು",
      description:
        "ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯದ ಸಂಪೂರ್ಣ ಸಂಗ್ರಹ — ಜಾತಕ, ಗುಣ ಮಿಲನ, ದಶಾ ಕಾಲ, ಮುಹೂರ್ತ, ಸಂಖ್ಯಾಶಾಸ್ತ್ರ, ವಾಸ್ತು, ವೃತ್ತಿಪರ ವರದಿಗಳು ಎಲ್ಲವೂ ಒಂದೇ ಸ್ಥಳದಲ್ಲಿ.",
      explore_all: "ಎಲ್ಲವನ್ನೂ ನೋಡಿ",
      open: "ತೆರೆಯಿರಿ",
      trusted: "50,000+ ಬಳಕೆದಾರರ ನಂಬಿಕೆ",
      lahiri: "ಲಾಹಿರಿ ಅಯನಾಂಶ",
      free_core: "100% ಉಚಿತ ಉಪಕರಣಗಳು",
      see_all: "ಎಲ್ಲಾ ಜ್ಯೋತಿಷ್ಯ ಉಪಕರಣಗಳನ್ನು ನೋಡಿ →",
    },
    kundli_tools: {
      free_kundli: {
        title: "ಉಚಿತ ಜನ್ಮ ಜಾತಕ",
        desc: "D1/D9 ಕುಂಡಲಿ, ಗ್ರಹ ಸ್ಥಿತಿ, ಭಾವ ಮತ್ತು AI ವಿಶ್ಲೇಷಣೆಯೊಂದಿಗೆ ಪೂರ್ಣ ಜಾತಕ.",
      },
      kundli_matching: {
        title: "ಜಾತಕ ಮಿಲನ (ಗುಣ ಕೂಟ)",
        desc: "ಅಷ್ಟಕೂಟ 36 ಗುಣಗಳು, ಮಂಗಳ ಮತ್ತು ನಾಡಿ ದೋಷ ಪರೀಕ್ಷೆ.",
      },
      love_compatibility: {
        title: "ಪ್ರೀತಿಯ ಹೊಂದಾಣಿಕೆ",
        desc: "ಆಧುನಿಕ ವೈದಿಕ ಸಂಬಂಧ ಮತ್ತು ಭಾವನಾತ್ಮಕ ಹೊಂದಾಣಿಕೆ.",
      },
      muhurat_finder: {
        title: "ಶುಭ ಮುಹೂರ್ತ ಶೋಧಕ",
        desc: "ಚೌಘಡಿಯಾ, ರಾಹು ಕಾಲ ಮತ್ತು ದೈನಂದಿನ ಶುಭ ಸಮಯಗಳು.",
      },
      career_report: {
        title: "ವೃತ್ತಿ ಮತ್ತು ಉದ್ಯೋಗ ವರದಿ",
        desc: "10ನೇ ಭಾವದ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಉದ್ಯೋಗ ಗ್ರಹಗಳ ವರದಿ.",
      },
      varshphal: {
        title: "ವಾರ್ಷಿಕ ಭವಿಷ್ಯ",
        desc: "ಮಹಾದಶ ಮತ್ತು ಸೂರ್ಯ ಪರಿಕ್ರಮಣ ಆಧಾರಿತ ವಾರ್ಷಿಕ ಜಾತಕ.",
      },
      numerology: {
        title: "ಸಂಖ್ಯಾಶಾಸ್ತ್ರ ವರದಿ",
        desc: "ಮೂಲಾಂಕ ಮತ್ತು ಭಾಗ್ಯಾಂಕದೊಂದಿಗೆ ಗ್ರಹಗಳ ಕಂಪನ.",
      },
      vastu: {
        title: "ವಾಸ್ತು ಶಾಸ್ತ್ರ ಮಾರ್ಗದರ್ಶಿ",
        desc: "8 ದಿಕ್ಕುಗಳು, ಕೊಠಡಿ ವಿನ್ಯಾಸ ಮತ್ತು ಸರಳ ಪರಿಹಾರಗಳು.",
      },
      baby_name: {
        title: "ಮಗುವಿನ ನಾಮಕರಣ (AI)",
        desc: "ನಕ್ಷತ್ರ, ದೇವತೆ ಮತ್ತು ಅರ್ಥದ ಆಧಾರದ ಮೇಲೆ ಸಂಸ್ಕೃತ ಹೆಸರುಗಳು.",
      },
      rashi_calc: { title: "ರಾಶಿ ಕ್ಯಾಲ್ಕುಲೇಟರ್", desc: "ನಿಮ್ಮ ಚಂದ್ರ ರಾಶಿಯನ್ನು ನಿಖರವಾಗಿ ತಿಳಿಯಿರಿ." },
      nakshatra_finder: {
        title: "ನಕ್ಷತ್ರ ಶೋಧಕ",
        desc: "ನಿಮ್ಮ ಜನ್ಮ ನಕ್ಷತ್ರ, ಪಾದ ಮತ್ತು ಅಧಿಪತಿ ದೇವತೆ ಶೋಧಿಸಿ.",
      },
      gemstone: { title: "ರತ್ನ ಶಿಫಾರಸು", desc: "ಲಗ್ನ ಮತ್ತು ಗ್ರಹಗಳ ಆಧಾರದ ಮೇಲೆ ಅದೃಷ್ಟ ರತ್ನ ಸಲಹೆ." },
    },
    badges: { popular: "ಜನಪ್ರಿಯ", new: "ಹೊಸತು", premium: "ಪ್ರೀಮಿಯಂ" },
  },
  ml: {
    kundli_section: {
      eyebrow: "വൈദിക ജ്യോതിഷം",
      title: "ജാതകവും ജ്യോതിഷ ഉപകരണങ്ങളും",
      description:
        "വൈദിക ജ്യോതിഷത്തിന്റെ സമ്പൂർണ്ണ ശേഖരം — ജാതകം, പൊരുത്തം, ദശാകാലം, മുഹൂർത്തം, സംഖ്യാശാസ്ത്രം, വാസ്തു, കരിയർ റിപ്പോർട്ടുകൾ എല്ലാം ഒരിടത്ത്.",
      explore_all: "എല്ലാം കാണുക",
      open: "തുറക്കുക",
      trusted: "50,000+ ആളുകൾ വിശ്വസിക്കുന്നത്",
      lahiri: "ലാഹിരി അയനാംശം",
      free_core: "100% സൗജന്യ ഉപകരണങ്ങൾ",
      see_all: "എല്ലാ ജ്യോതിഷ ഉപകരണങ്ങളും കാണുക →",
    },
    kundli_tools: {
      free_kundli: {
        title: "സൗജന്യ ജന്മജാതകം",
        desc: "D1/D9 ചാർട്ടുകൾ, ഗ്രഹനിലകൾ, ഭാവങ്ങൾ, AI വിശകലനം സഹിതം സമ്പൂർണ്ണ ജാതകം.",
      },
      kundli_matching: {
        title: "ജാതക പൊരുത്തം",
        desc: "അഷ്ടകൂട 36 ഗുണ പൊരുത്തം, ചൊവ്വാദോഷം, നാഡി ദോഷ പരിശോധന.",
      },
      love_compatibility: {
        title: "പ്രണയ പൊരുത്തം",
        desc: "ആധുനിക വൈദിക ബന്ധ പൊരുത്തവും വൈകാരിക വിശകലനവും.",
      },
      muhurat_finder: {
        title: "ശുഭ മുഹൂർത്തം കണ്ടെത്തുക",
        desc: "ചോഘടിയ, രാഹുകാലം, ദിവസേനയുള്ള ശുഭ സമയങ്ങൾ.",
      },
      career_report: {
        title: "തൊഴിൽ & ബിസിനസ്സ് റിപ്പോർട്ട്",
        desc: "10-ാം ഭാവ വിശകലനവും കരിയർ ഗ്രഹ സൂചനകളും.",
      },
      varshphal: {
        title: "വാർഷിക വർഷഫലം",
        desc: "മഹാദശയും സൂര്യ പരിക്രമണവും ആധാരമാക്കിയുള്ള വർഷഫലം.",
      },
      numerology: {
        title: "സംഖ്യാശാസ്ത്ര റിപ്പോർട്ട്",
        desc: "ജന്മസംഖ്യയും വിധിസംഖ്യയും ഒപ്പം വൈദിക ഗ്രഹ തരംഗങ്ങളും.",
      },
      vastu: {
        title: "വാസ്തു ശാസ്ത്ര ഗൈഡ്",
        desc: "8 ദിക്കുകൾ, മുറികളുടെ ക്രമീകരണം, ലളിതമായ പരിഹാരങ്ങൾ.",
      },
      baby_name: {
        title: "കുഞ്ഞിന്റെ പേരിടൽ (AI)",
        desc: "നക്ഷത്രം, ദേവത, അർത്ഥം എന്നിവ അടിസ്ഥാനമാക്കിയുള്ള സംസ്കൃത പേരുകൾ.",
      },
      rashi_calc: {
        title: "രാശി കാൽക്കുലേറ്റർ",
        desc: "നിങ്ങളുടെ ചന്ദ്രരാശി കൃത്യമായി കണ്ടെത്തുക.",
      },
      nakshatra_finder: {
        title: "നക്ഷത്രം കണ്ടെത്തുക",
        desc: "നിങ്ങളുടെ ജന്മനക്ഷത്രം, പാദം, അധിപ ദേവത എന്നിവ അറിയുക.",
      },
      gemstone: {
        title: "രത്ന നിർദ്ദേശം",
        desc: "ലഗ്നവും ഗ്രഹനിലയും അടിസ്ഥാനമാക്കിയുള്ള ഭാഗ്യ രത്ന ഉപദേശം.",
      },
    },
    badges: { popular: "പ്രശസ്തമായത്", new: "പുതിയത്", premium: "പ്രീമിയം" },
  },
  or: {
    kundli_section: {
      eyebrow: "ବୈଦିକ ଜ୍ୟୋତିଷ",
      title: "କୁଣ୍ଡଳୀ ଓ ଜ୍ୟୋତିଷ ଉପକରଣ",
      description:
        "ବୈଦିକ ଜ୍ୟୋତିଷର ସମ୍ପୂର୍ଣ୍ଣ ସଂଗ୍ରହ — କୁଣ୍ଡଳୀ, ମେଳକ, ଦଶା, ମୁହୂର୍ତ୍ତ, ସଂଖ୍ୟା ଜ୍ୟୋତିଷ, ବାସ୍ତୁ, କାରିୟର ରିପୋର୍ଟ ଏବଂ ଅନେକ କିଛି ଏକ ସ୍ଥାନରେ।",
      explore_all: "ସବୁ ଦେଖନ୍ତୁ",
      open: "ଖୋଲନ୍ତୁ",
      trusted: "୫୦,୦୦୦+ ସାଧକଙ୍କ ଦ୍ୱାରା ବିଶ୍ୱସ୍ତ",
      lahiri: "ଲାହିଡ଼ି ଅୟନାଂଶ",
      free_core: "୧୦୦% ମାଗଣା ଉପକରଣ",
      see_all: "ସମସ୍ତ ଜ୍ୟୋତିଷ ଉପକରଣ ଦେଖନ୍ତୁ →",
    },
    kundli_tools: {
      free_kundli: {
        title: "ମାଗଣା ଜନ୍ମ କୁଣ୍ଡଳୀ",
        desc: "D1/D9 ଚାର୍ଟ, ଗ୍ରହ ସ୍ଥିତି, ଭାବ ଏବଂ AI ବ୍ୟାଖ୍ୟା ସହିତ ସମ୍ପୂର୍ଣ୍ଣ କୁଣ୍ଡଳୀ।",
      },
      kundli_matching: {
        title: "କୁଣ୍ଡଳୀ ମେଳକ (ଗୁଣ ମିଳନ)",
        desc: "ଅଷ୍ଟକୂଟ ୩୬ ଗୁଣ, ମଙ୍ଗଳ ଓ ନାଡ଼ୀ ଦୋଷ ଯାଞ୍ଚ।",
      },
      love_compatibility: {
        title: "ପ୍ରେମ ଅନୁକୂଳତା",
        desc: "ଆଧୁନିକ ବୈଦିକ ସମ୍ପର୍କ ଏବଂ ଭାବନାତ୍ମକ ଅନୁକୂଳତା।",
      },
      muhurat_finder: {
        title: "ଶୁଭ ମୁହୂର୍ତ୍ତ ନିର୍ଣ୍ଣୟ",
        desc: "ଚୌଘଡ଼ିଆ, ରାହୁ କାଳ ଏବଂ ଦୈନନ୍ଦିନ ଶୁଭ ସମୟ।",
      },
      career_report: {
        title: "କାରିୟର ଓ ବ୍ୟବସାୟ ରିପୋର୍ଟ",
        desc: "ଦଶମ ଭାବ ବିଶ୍ଳେଷଣ ଏବଂ କାରିୟର ଗ୍ରହ ସୂଚନା।",
      },
      varshphal: { title: "ବାର୍ଷିକ ବର୍ଷଫଳ", desc: "ମହାଦଶା ଏବଂ ସୂର୍ଯ୍ୟ ଚକ୍ରରୁ ବାର୍ଷିକ ରାଶିଫଳ।" },
      numerology: {
        title: "ସଂଖ୍ୟା ଜ୍ୟୋତିଷ ରିପୋର୍ଟ",
        desc: "ମୂଳାଙ୍କ ଏବଂ ଭାଗ୍ୟାଙ୍କ ସହିତ ବୈଦିକ ଗ୍ରହ ସ୍ପନ୍ଦନ।",
      },
      vastu: {
        title: "ବାସ୍ତୁ ଶାସ୍ତ୍ର ମାର୍ଗଦର୍ଶିକା",
        desc: "୮ ଦିଗ, ଘରର ସଜାଣି ଏବଂ ବ୍ୟବହାରିକ ପ୍ରତିକାର।",
      },
      baby_name: {
        title: "ଶିଶୁ ନାମକରଣ (AI)",
        desc: "ନକ୍ଷତ୍ର, ଦେବତା ଏବଂ ଅର୍ଥ ଅନୁସାରେ ସଂସ୍କୃତ ନାମ।",
      },
      rashi_calc: { title: "ରାଶି କାଲକୁଲେଟର", desc: "ଆପଣଙ୍କ ଚନ୍ଦ୍ର ରାଶି ନିର୍ଭୁଲ ଭାବେ ଜାଣନ୍ତୁ।" },
      nakshatra_finder: {
        title: "ନକ୍ଷତ୍ର ନିର୍ଣ୍ଣୟ",
        desc: "ଆପଣଙ୍କ ଜନ୍ମ ନକ୍ଷତ୍ର, ପାଦ ଏବଂ ଦେବତା ଜାଣନ୍ତୁ।",
      },
      gemstone: { title: "ରତ୍ନ ପରାମର୍ଶ", desc: "ଲଗ୍ନ ଏବଂ ଗ୍ରହ ଅନୁସାରେ ଭାଗ୍ୟଶାଳୀ ରତ୍ନ ପରାମର୍ଶ।" },
    },
    badges: { popular: "ଲୋକପ୍ରିୟ", new: "ନୂଆ", premium: "ପ୍ରିମିୟମ" },
  },
  as: {
    kundli_section: {
      eyebrow: "বৈদিক জ্যোতিষ",
      title: "কোষ্ঠী আৰু জ্যোতিষ সঁজুলি",
      description:
        "বৈদিক জ্যোতিষৰ সম্পূৰ্ণ সংগ্ৰহ — কোষ্ঠী, যোটক বিচাৰ, দশা, মুহূৰ্ত, সংখ্যা জ্যোতিষ, বাস্তু, কেৰিয়াৰ ৰিপোৰ্ট আৰু বহুত কিছু একে ঠাইতে।",
      explore_all: "সকলো চাওক",
      open: "খোলক",
      trusted: "৫০,০০০+ বিশ্বাসী ব্যৱহাৰকাৰী",
      lahiri: "লাহিড়ী অয়নাম্শ",
      free_core: "১০০% বিনামূলীয়া সঁজুলি",
      see_all: "সকলো জ্যোতিষ সঁজুলি চাওক →",
    },
    kundli_tools: {
      free_kundli: {
        title: "বিনামূলীয়া জন্ম কোষ্ঠী",
        desc: "D1/D9 ছক, গ্ৰহৰ স্থিতি, ভাব আৰু AI ব্যাখ্যাৰে সম্পূৰ্ণ কোষ্ঠী।",
      },
      kundli_matching: {
        title: "কোষ্ঠী যোটক বিচাৰ",
        desc: "অষ্টকূট ৩৬ গুণ, মঙ্গল আৰু নাড়ী দোষ বিচাৰ।",
      },
      love_compatibility: {
        title: "প্ৰেমৰ সামঞ্জস্যতা",
        desc: "আধুনিক বৈদিক সম্পৰ্ক আৰু আৱেগিক সামঞ্জস্য পৰীক্ষা।",
      },
      muhurat_finder: {
        title: "শুভ মুহূৰ্ত নিৰ্ণয়",
        desc: "চৌঘড়ীয়া, ৰাহুকাল আৰু দৈনিক শুভ সময়।",
      },
      career_report: {
        title: "কেৰিয়াৰ আৰু ব্যৱসায় ৰিপোৰ্ট",
        desc: "দশম ভাব বিশ্লেষণ আৰু কেৰিয়াৰ গ্ৰহ নিৰ্দেশিকা।",
      },
      varshphal: { title: "বাৰ্ষিক বৰ্ষফল", desc: "মহাদশা আৰু সূৰ্য চক্ৰ অনুসৰি বাৰ্ষিক ৰাশিফল।" },
      numerology: {
        title: "সংখ্যা জ্যোতিষ ৰিপোৰ্ট",
        desc: "মূলাংক আৰু ভাগ্য সংখ্যাৰ সৈতে বৈদিক গ্ৰহীয় স্পন্দন।",
      },
      vastu: {
        title: "বাস্তু শাস্ত্র গাইড",
        desc: "৮টা দিশ, কোঠাৰ অৱস্থান আৰু ব্যৱহাৰিক প্ৰতিকাৰ।",
      },
      baby_name: {
        title: "শিশুৰ নামকৰণ (AI)",
        desc: "নক্ষত্ৰ, দেৱতা আৰু অৰ্থ অনুসৰি সংস্কৃত নাম।",
      },
      rashi_calc: { title: "ৰাশি কেলকুলেটৰ", desc: "আপোনাৰ চন্দ্ৰ ৰাশি শুদ্ধভাৱে জানক।" },
      nakshatra_finder: {
        title: "নক্ষত্ৰ নিৰ্ণয়",
        desc: "আপোনাৰ জন্ম নক্ষত্ৰ, পদ আৰু দেৱতা জানক।",
      },
      gemstone: {
        title: "ৰত্ন পৰামৰ্শ",
        desc: "লগ্ন আৰু গ্ৰহ অনুসৰি ভাগ্য নিৰ্ধাৰক ৰত্ন পৰামৰ্শ।",
      },
    },
    badges: { popular: "জনপ্ৰিয়", new: "নতুন", premium: "প্ৰিমিয়াম" },
  },
};

const files = fs.readdirSync(translationsDir).filter((f) => f.endsWith(".json"));

for (const file of files) {
  const langCode = file.replace(".json", "");
  const filePath = path.join(translationsDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const dict = dictionaries[langCode] || dictionaries.en;

  data.home = data.home || {};
  data.home.kundli_section = dict.kundli_section;
  data.home.kundli_tools = dict.kundli_tools;

  data.badges = data.badges || {};
  Object.assign(data.badges, dict.badges);

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
  console.log(`Updated ${file} with full native translations for ${langCode}!`);
}

console.log("All 12 translation files updated with complete native translations!");
