/**
 * Vedic Pradosha Vrat Calculation & Shiva Mahatmya Engine
 * --------------------------------------------------------
 * Computes astronomical Pradosha Kaal windows, Trayodashi pradosh-vyapini dates,
 * weekday-specific vrat types (Som, Bhauma, Shani, etc.), authentic Puja Vidhi,
 * Vrat Kathas, and sacred Shiva Stotras.
 */

import { getSunTimes, getTithi, type LatLon, DEFAULT_LOCATION } from "@/lib/panchang";

export type DayType =
  | "soma"
  | "bhauma"
  | "budha"
  | "guru"
  | "shukra"
  | "shani"
  | "ravi";

export interface PradoshaDayMetadata {
  dayType: DayType;
  nameHindi: string;
  nameEnglish: string;
  rulingPlanet: string;
  specialBenefitsHindi: string;
  specialBenefitsEnglish: string;
  kathaSummary: string;
  remedyHint: string;
}

export interface PradoshDateEntry {
  id: string;
  date: Date;
  dateString: string; // YYYY-MM-DD
  formattedDate: string; // e.g. "12 March 2026, Thursday"
  dayOfWeek: number; // 0=Sun..6=Sat
  dayType: DayType;
  dayTypeNameHindi: string;
  dayTypeNameEnglish: string;
  paksha: "Shukla" | "Krishna";
  pakshaHindi: "शुक्ल पक्ष" | "कृष्ण पक्ष";
  tithiName: string;
  lunarMonthHindi: string;
  sunset: Date;
  pradoshKaalStart: Date;
  pradoshKaalEnd: Date;
  muhurtaFormatted: string;
  durationMinutes: number;
  paranaTimeFormatted: string;
  metadata: PradoshaDayMetadata;
  sankalpaMantra: string;
}

export interface ShivaStotra {
  id: string;
  titleHindi: string;
  titleEnglish: string;
  composer: string;
  benefits: string;
  verses: {
    sanskrit: string;
    hindi: string;
    english: string;
  }[];
}

// ──────────────────────────────────────────
// 1. 7 WEEKDAY PRADOSHA VRAT METADATA
// ──────────────────────────────────────────

export const PRADOSHA_DAY_METADATA: Record<DayType, PradoshaDayMetadata> = {
  soma: {
    dayType: "soma",
    nameHindi: "सोम प्रदोष व्रत (Somwar Pradosh)",
    nameEnglish: "Soma Pradosham (Monday)",
    rulingPlanet: "चन्द्रमा (Moon)",
    specialBenefitsHindi: "मनोकामना पूर्ति, मानसिक शान्ति, चन्द्रदोष निवारण, उत्तम स्वास्थ्य एवं भगवान शिव-पार्वती की अनन्य कृपा।",
    specialBenefitsEnglish: "Fulfillment of deepest desires, peace of mind, alleviation of Chandra Dosha, and blessings of Shiva-Parvati.",
    kathaSummary: "एक निर्धन ब्राह्मणी और विदर्भ के राजकुमार की कथा; भगवान शिव के सोम प्रदोष व्रत के प्रभाव से राजकुमार को खोया हुआ राज्य और ब्राह्मणी के पुत्र को अकूत धन की प्राप्ति हुई।",
    remedyHint: "शिवलिंग पर कच्चा दूध, मिश्री व बिल्वपत्र अर्पित करें और 'ॐ नमः शिवाय' का १०८ बार जप करें।",
  },
  bhauma: {
    dayType: "bhauma",
    nameHindi: "भौम प्रदोष व्रत (Mangalwar Pradosh)",
    nameEnglish: "Bhauma Pradosham (Tuesday)",
    rulingPlanet: "मंगल (Mars)",
    specialBenefitsHindi: "समस्त कर्जों (ऋण) से शीघ्र मुक्ति, मंगल दोष शान्ति, रक्तविकार निवारण, भूमि व पराक्रम में वृद्धि।",
    specialBenefitsEnglish: "Speedy freedom from debts (Rin-Mukti), pacification of Mangal Dosha, courage, physical vitality, and property gains.",
    kathaSummary: "एक वृद्ध ब्राह्मणी और उसके पुत्र मंगलो की कथा; भगवान शिव ने हनुमान जी व मंगलदेव के रूप में प्रकट होकर उसके पुत्र को संकट से बचाया और जीवन को सुख-समृद्धि से भर दिया।",
    remedyHint: "शिवलिंग पर लाल चन्दन, शहद व मसूर की दाल अर्पित करें तथा ऋणमुक्ति मंगल स्तोत्र का पाठ करें।",
  },
  budha: {
    dayType: "budha",
    nameHindi: "बुध प्रदोष व्रत (Budhwar Pradosh)",
    nameEnglish: "Budha Pradosham (Wednesday)",
    rulingPlanet: "बुध (Mercury)",
    specialBenefitsHindi: "विद्या, बुद्धि, वाणी में ओज, व्यापार में भारी सफलता, सन्तान सुख एवं बुध ग्रह जनित दोषों का शमन।",
    specialBenefitsEnglish: "Enhancement of intellect, memory, eloquence, commercial success, child welfare, and pacification of Mercury.",
    kathaSummary: "एक नवविवाहित दम्पति की कथा; बुधवार को यात्रा करने पर उत्पन्न हुए संकट में भगवान शिव ने प्रकट होकर दोनों की रक्षा की और सुखमय दांपत्य का वरदान दिया।",
    remedyHint: "शिवलिंग पर हरी दूर्वा, हरे मूंग और गन्ने का रस अर्पित करें।",
  },
  guru: {
    dayType: "guru",
    nameHindi: "गुरु प्रदोष व्रत (Guruwar Pradosh)",
    nameEnglish: "Guru Pradosham (Thursday)",
    rulingPlanet: "बृहस्पति (Jupiter)",
    specialBenefitsHindi: "शत्रु विजय, पितृदोष शान्ति, ज्ञान, यश, मान-सम्मान में अपार वृद्धि एवं अविवाहितों को सुयोग्य जीवनसाथी की प्राप्ति।",
    specialBenefitsEnglish: "Victory over adversaries, pacification of Pitra Dosha, immense spiritual knowledge, fame, and auspicious marriage prospects.",
    kathaSummary: "देवताओं और असुरों के संग्राम की कथा; वृत्रासुर के आतंक से मुक्ति के लिए देवगुरु बृहस्पति के निर्देश पर इन्द्रदेव ने गुरु प्रदोष व्रत कर विजय प्राप्त की।",
    remedyHint: "शिवलिंग पर पीले पुष्प, केसर युक्त चन्दन व चने की दाल अर्पित करें।",
  },
  shukra: {
    dayType: "shukra",
    nameHindi: "शुक्र प्रदोष व्रत (Shukrawar Pradosh)",
    nameEnglish: "Shukra Pradosham (Friday)",
    rulingPlanet: "शुक्र (Venus)",
    specialBenefitsHindi: "अखण्ड सौभाग्य, धन-वैभव, भौतिक सुख-सुविधाओं में वृद्धि, दांपत्य जीवन में माधुर्य एवं ऐश्वर्य प्राप्ति।",
    specialBenefitsEnglish: "Boundless fortune, financial abundance, marital harmony, aesthetic luxury, and family happiness.",
    kathaSummary: "एक नगर सेठ के पुत्र और उसकी पुत्रवधू की कथा; प्रदोष व्रत के पुण्य से सर्पदंश से मृत पुत्र को भगवान शिव ने पुनर्जीवित किया और अपार वैभव प्रदान किया।",
    remedyHint: "शिवलिंग पर सफेद चन्दन, इत्र, मखाना व सफेद मिष्ठान्न का भोग लगाएं।",
  },
  shani: {
    dayType: "shani",
    nameHindi: "शनि प्रदोष व्रत (Shaniwar Pradosh)",
    nameEnglish: "Shani Pradosham (Saturday)",
    rulingPlanet: "शनि (Saturn)",
    specialBenefitsHindi: "शनि की साढ़ेसाती व ढैया का शमन, अकाल मृत्यु निवारण, सन्तान प्राप्ति, असाध्य रोगों से मुक्ति एवं मोक्ष।",
    specialBenefitsEnglish: "Relief from Saturn's Sade Sati and Dhaiya, prevention of untoward events, progeny blessings, and cure from chronic ailments.",
    kathaSummary: "एक निःसन्तान सेठ की कथा; शनि प्रदोष व्रत के महात्म्य से भगवान शिव और शनिदेव ने प्रसन्न होकर उसे सुयोग्य और दीर्घायु सन्तान का वरदान दिया।",
    remedyHint: "शिवलिंग पर काले तिल, भस्म, शमी पत्र व सरसों के तेल का दीपक प्रदोष काल में प्रज्वलित करें।",
  },
  ravi: {
    dayType: "ravi",
    nameHindi: "रवि प्रदोष व्रत (Raviwar Pradosh)",
    nameEnglish: "Ravi Pradosham (Sunday)",
    rulingPlanet: "सूर्य (Sun)",
    specialBenefitsHindi: "आरोग्य, दीर्घायु, नेत्र ज्योति, समाज में उच्च पद-प्रतिष्ठा, प्रशासनिक कार्यों में सफलता एवं सूर्यदोष मुक्ति।",
    specialBenefitsEnglish: "Supreme health, longevity, social stature, administrative success, leadership power, and elimination of Surya Dosha.",
    kathaSummary: "एक दीन-हीन ब्राह्मण की कथा; रवि प्रदोष व्रत के प्रभाव से उसके समस्त चर्मरोग व दारिद्र्य दूर हुए और वह दीर्घायु तथा राज-सम्मान को प्राप्त हुआ।",
    remedyHint: "तांबे के लोटे से सूर्यदेव को अर्घ्य दें और प्रदोष काल में शिवलिंग पर बिल्वपत्र और आक के पुष्प अर्पित करें।",
  },
};

const DAY_INDEX_TO_TYPE: Record<number, DayType> = {
  0: "ravi",
  1: "soma",
  2: "bhauma",
  3: "budha",
  4: "guru",
  5: "shukra",
  6: "shani",
};

const LUNAR_MONTH_NAMES = [
  "चैत्र",
  "वैशाख",
  "ज्येष्ठ",
  "आषाढ़",
  "श्रावण",
  "भाद्रपद",
  "अश्विन",
  "कार्तिक",
  "मार्गशीर्ष",
  "पौष",
  "माघ",
  "फाल्गुन",
];

// ──────────────────────────────────────────
// 2. EPHEMERIS CALCULATION ENGINE
// ──────────────────────────────────────────

/**
 * Calculate all Trayodashi Pradosha Vrat dates and precise Pradosha Kaal windows for any given year
 */
export function calculatePradoshDatesForYear(
  year: number,
  loc: LatLon = DEFAULT_LOCATION,
): PradoshDateEntry[] {
  const entries: PradoshDateEntry[] = [];

  const startDate = new Date(Date.UTC(year, 0, 1, 0, 0, 0));
  const endDate = new Date(Date.UTC(year, 11, 31, 23, 59, 59));

  // Step through each day of the year
  const curr = new Date(startDate.getTime());

  while (curr.getTime() <= endDate.getTime()) {
    try {
      const sun = getSunTimes(curr, loc);

      if (sun.sunset) {
        // Pradosha Kaal: From sunset to approx 2 hours 24 mins after sunset (6 Ghatis / Evening twilight window)
        // Standard Shastriya window: 2 Ghatis (48 min) before/after or Sunset to +2h 24m
        const pradoshStart = new Date(sun.sunset.getTime());
        const pradoshEnd = new Date(sun.sunset.getTime() + 2 * 60 * 60 * 1000 + 24 * 60 * 1000); // +2h 24m

        // Check Tithi prevailing at sunset/pradosha kaal
        const tithiAtSunset = getTithi(sun.sunset);

        // Trayodashi is index 13 (Shukla Trayodashi) or index 28 (Krishna Trayodashi)
        const isShuklaTrayodashi = tithiAtSunset.index === 13;
        const isKrishnaTrayodashi = tithiAtSunset.index === 28;

        if (isShuklaTrayodashi || isKrishnaTrayodashi) {
          const dayOfWeek = curr.getUTCDay();
          const dayType = DAY_INDEX_TO_TYPE[dayOfWeek];
          const meta = PRADOSHA_DAY_METADATA[dayType];
          const paksha = isShuklaTrayodashi ? "Shukla" : "Krishna";
          const pakshaHindi = isShuklaTrayodashi ? "शुक्ल पक्ष" : "कृष्ण पक्ष";

          const monthIdx = (curr.getUTCMonth() + (curr.getUTCDate() > 15 ? 1 : 0)) % 12;
          const lunarMonth = LUNAR_MONTH_NAMES[monthIdx];

          const dateStr = curr.toISOString().split("T")[0];
          const duration = Math.round(
            (pradoshEnd.getTime() - pradoshStart.getTime()) / (60 * 1000),
          );

          // Parana: Next day after sunrise
          const nextDaySun = getSunTimes(
            new Date(curr.getTime() + 24 * 60 * 60 * 1000),
            loc,
          );
          const paranaFormatted = nextDaySun.sunrise
            ? new Intl.DateTimeFormat("en-IN", {
                timeZone: loc.tz,
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              }).format(nextDaySun.sunrise)
            : "सूर्योदय उपरांत";

          const timeFmt = new Intl.DateTimeFormat("en-IN", {
            timeZone: loc.tz,
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });

          const startStr = timeFmt.format(pradoshStart);
          const endStr = timeFmt.format(pradoshEnd);

          const dateFormatted = new Intl.DateTimeFormat("en-IN", {
            timeZone: loc.tz,
            day: "numeric",
            month: "long",
            year: "numeric",
            weekday: "long",
          }).format(curr);

          const sankalpa = `मम कायिक-वाचिक-मानसिक सकल पापनिवृत्तिपूर्वक सर्व-मनोरथ-सिद्धये, आयुरारोग्य-ऐश्वर्य-ऋणमुक्ति-प्राप्तये श्री साम्बसदाशिव-प्रीत्यर्थं ${meta.nameHindi} करिष्ये।`;

          entries.push({
            id: `pradosh-${dateStr}`,
            date: new Date(curr.getTime()),
            dateString: dateStr,
            formattedDate: dateFormatted,
            dayOfWeek,
            dayType,
            dayTypeNameHindi: meta.nameHindi,
            dayTypeNameEnglish: meta.nameEnglish,
            paksha,
            pakshaHindi,
            tithiName: isShuklaTrayodashi ? "शुक्ल त्रयोदशी" : "कृष्ण त्रयोदशी",
            lunarMonthHindi: lunarMonth,
            sunset: sun.sunset,
            pradoshKaalStart: pradoshStart,
            pradoshKaalEnd: pradoshEnd,
            muhurtaFormatted: `${startStr} से ${endStr}`,
            durationMinutes: duration,
            paranaTimeFormatted: `अगले दिन प्रातः ${paranaFormatted} के बाद`,
            metadata: meta,
            sankalpaMantra: sankalpa,
          });
        }
      }
    } catch {
      // ignore
    }

    // Advance 1 day
    curr.setUTCDate(curr.getUTCDate() + 1);
  }

  return entries;
}

/**
 * Find the next upcoming Pradosha Vrat relative to now
 */
export function getNextUpcomingPradosh(
  loc: LatLon = DEFAULT_LOCATION,
  referenceDate: Date = new Date(),
): PradoshDateEntry | null {
  const currentYear = referenceDate.getFullYear();
  let list = calculatePradoshDatesForYear(currentYear, loc);

  let upcoming = list.filter((p) => p.date.getTime() >= referenceDate.getTime() - 24 * 3600 * 1000);

  if (upcoming.length === 0) {
    list = calculatePradoshDatesForYear(currentYear + 1, loc);
    upcoming = list.filter((p) => p.date.getTime() >= referenceDate.getTime());
  }

  return upcoming[0] || null;
}

// ──────────────────────────────────────────
// 3. STEP-BY-STEP PUJA VIDHI
// ──────────────────────────────────────────

export interface PujaStep {
  stepNumber: number;
  titleHindi: string;
  titleEnglish: string;
  mantra: string;
  descriptionHindi: string;
  descriptionEnglish: string;
}

export const PRADOSH_PUJA_STEPS: PujaStep[] = [
  {
    stepNumber: 1,
    titleHindi: "प्रातः काल स्नान व शुद्धि",
    titleEnglish: "Morning Bath & Purification",
    mantra: "ॐ अपवित्रः पवित्रो वा सर्वावस्थां गतोऽपि वा। यः स्मरेत्पुण्डरीकाक्षं स बाह्याभ्यन्तरः शुचिः॥",
    descriptionHindi: "सूर्योदय से पूर्व उठकर स्नानादि से निवृत्त होकर श्वेत या पीत स्वच्छ वस्त्र धारण करें।",
    descriptionEnglish: "Wake up before sunrise, take a cleansing bath, and wear clean white or saffron clothing.",
  },
  {
    stepNumber: 2,
    titleHindi: "प्रदोष व्रत संकल्प",
    titleEnglish: "Pradosh Vrat Sankalpa",
    mantra: "मम सकल-पाप-क्षयार्थं श्री शिव-प्रीत्यर्थं प्रदोष व्रतमहं करिष्ये।",
    descriptionHindi: "हाथ में जल, अक्षत व पुष्प लेकर उत्तर या पूर्व दिशा की ओर मुख करके व्रत का दृढ़ संकल्प लें।",
    descriptionEnglish: "Take water, unbroken rice, and a flower in your right hand, facing North or East, and take the sacred resolve.",
  },
  {
    stepNumber: 3,
    titleHindi: "प्रदोष काल सन्ध्या दीप प्रज्वलन",
    titleEnglish: "Twilight Lamp Lighting",
    mantra: "शुभं करोति कल्याणमारोग्यं धनसम्पदाम्। शत्रुबुद्धिविनाशाय दीपज्योतिर्नमोऽस्तु ते॥",
    descriptionHindi: "सूर्यास्त के समय पूजा स्थान को गंगाजल से पवित्र कर शुद्ध घी का पंचमुखी अथवा एकमुखी दीपक प्रज्वलित करें।",
    descriptionEnglish: "At sunset, sanctify the altar with Ganga water and light a pure cow-ghee lamp.",
  },
  {
    stepNumber: 4,
    titleHindi: "शिवलिंग पञ्चामृत अभिषेक",
    titleEnglish: "Panchamrita Abhishekam",
    mantra: "ॐ नमः शिवाय। ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात्॥",
    descriptionHindi: "शिवलिंग पर क्रमशः जल, कच्चा दूध, दही, देसी घी, शहद और शर्करा (पंचामृत) से अभिषेक करें, तत्पश्चात् शुद्ध गंगाजल अर्पित करें।",
    descriptionEnglish: "Bathe the Shiva Lingam with water, raw milk, yogurt, pure ghee, honey, and sugar, followed by pure Ganga water.",
  },
  {
    stepNumber: 5,
    titleHindi: "बिल्वपत्र, भस्म व सुगन्ध समर्पण",
    titleEnglish: "Offering Bilva Patra & Bhasma",
    mantra: "त्रिदलं त्रिगुणाकारं त्रिनेत्रं च त्रियायुधम्। त्रिजन्मपापसंहारं बिल्वपत्रं शिवार्पणम्॥",
    descriptionHindi: "चन्दन से ॐ नमः शिवाय लिखकर अखण्डित ३-पत्रों वाले बिल्वपत्र, धतूरा, श्वेत मन्दार पुष्प और भस्म शिवलिंग पर अर्पित करें।",
    descriptionEnglish: "Offer intact 3-leaf Bilva leaves inscribed with Chandan, Datura fruit, white flowers, and sacred Vibhuti (Bhasma).",
  },
  {
    stepNumber: 6,
    titleHindi: "प्रदोष व्रत कथा श्रवण",
    titleEnglish: "Recitation of Pradosh Vrat Katha",
    mantra: "हर हर महादेव शम्भो काशी विश्वनाथ गङ्गे।",
    descriptionHindi: "वार-विशेष की प्रदोष व्रत कथा का भक्तिपूर्वक पाठ करें अथवा परिवार सहित श्रवण करें।",
    descriptionEnglish: "Devoutly read or listen to the specific weekday Pradosha Katha along with family.",
  },
  {
    stepNumber: 7,
    titleHindi: "श्री रुद्राष्टकम् / स्तोत्र पाठ",
    titleEnglish: "Rudrashtakam Chanting",
    mantra: "नमामीशमीशान निर्वाणरूपं विभुं व्यापकं ब्रह्मवेदस्वरूपम्।",
    descriptionHindi: "गोस्वामी तुलसीदास कृत श्री रुद्राष्टकम् अथवा शिव पञ्चाक्षर स्तोत्र का सस्वर पाठ करें।",
    descriptionEnglish: "Chant the sublime Rudrashtakam or Shiva Panchakshara Stotra in deep contemplation.",
  },
  {
    stepNumber: 8,
    titleHindi: "महाआरती, क्षमा-प्रार्थना व पारण",
    titleEnglish: "Maha Aarti & Next-day Parana",
    mantra: "कर्पूरगौरं करुणावतारं संसारसारं भुजगेन्द्रहारम्। सदा वसन्तं हृदयारविन्दे भवं भवानीसहितं नमामि॥",
    descriptionHindi: "कपूर आरती करें, 'अपराधसहस्त्राणि क्रियन्तेऽहर्निशं मया' से क्षमा याचना करें और अगले दिन सूर्योदयोपरांत पारण करें।",
    descriptionEnglish: "Perform Camphor Aarti, seek forgiveness for inadvertent flaws, and break the fast the following morning after sunrise.",
  },
];

// ──────────────────────────────────────────
// 4. SACRED SHIVA STOTRAS
// ──────────────────────────────────────────

export const SHIVA_STOTRAS: ShivaStotra[] = [
  {
    id: "rudrashtakam",
    titleHindi: "श्री रुद्राष्टकम्",
    titleEnglish: "Shri Rudrashtakam",
    composer: "गोस्वामी तुलसीदास कृत (श्रीरामचरितमानस उत्तरकाण्ड)",
    benefits: "समस्त भयों, रोगों व ग्रहों की पीड़ा से मुक्ति, भगवान शिव का प्रत्यक्ष कृपा-कवच।",
    verses: [
      {
        sanskrit: "नमामीशमीशान निर्वाणरूपं विभुं व्यापकं ब्रह्मवेदस्वरूपम्।\nनिजं निर्गुणं निर्विकल्पं निरीहं चिदाकाशमाकाशवासं भजेऽहम्॥",
        hindi: "हे मुक्ति के स्वरूप, सर्वसमर्थ, सर्वव्यापी, ब्रह्म और वेद स्वरूप, परम प्रभु ईशान! मैं आपको नमन करता हूँ। जो अपने निज स्वरूप में स्थित, निर्गुण, निर्विकल्प, निष्काम, चिदाकाश और आकाश को ही वस्त्र रूप में धारण करने वाले हैं, मैं उन भगवान शिव का भजन करता हूँ।",
        english: "I bow to the Lord of the Universe, who is the embodiment of Liberation, all-pervading, the essence of the Vedas. I worship the Supreme Shiva, who is self-poised, beyond gunas, unconditioned, desireless, the sky of consciousness.",
      },
      {
        sanskrit: "निराकारमोंकारमूलं तुरीयं गिरा ज्ञान गोतीतमीशं गिरीशम्।\nकरालं महाकाल कालं कृपालं गुणागारसंसारपारं नतोऽहम्॥",
        hindi: "जो निराकार हैं, ॐकार के मूल हैं, तुरीय अवस्था में स्थित हैं, वाणी, ज्ञान और इन्द्रियों से परे हैं; जो कैलाशपति, महाकाल के भी काल और अत्यन्त कृपालु हैं, उन संसार-सागर से पार ले जाने वाले भगवान शिव को मैं प्रणाम करता हूँ।",
        english: "He who is formless, the root of Omkara, the fourth state of consciousness (Turiya), beyond speech and sensory perception; the Lord of the mountains, the Destroyer of Time itself, the embodiment of compassion — to Him I bow.",
      },
      {
        sanskrit: "तुषाराद्रिसंकाशगौरं गभीरं मनोभूतकोटिप्रभाश्री शरीरम्।\nस्फुरन्मौलिकल्लोलिनी चारुगङ्गा लसद्भालबालेन्दु कण्ठे भुजङ्गा॥",
        hindi: "जिनका रूप हिमालय के समान श्वेत और गम्भीर है, जिनके शरीर की कान्ति करोड़ों कामदेवों के समान दिव्य है; जिनके मस्तक पर पावन गंगा की तरंगें सुशोभित हैं, भाल पर बाल-चन्द्रमा और कण्ठ में सर्पों की माला चमकती है।",
        english: "White as the snow of the Himalayas, profound in nature, radiant with the splendor of millions of Kamadevas; from whose crown flows the holy Ganga, on whose brow shines the crescent moon, and around whose neck coils the serpent garland.",
      },
      {
        sanskrit: "प्रचण्डं प्रकृष्टं प्रगल्भं परेशं अखण्डं अजं भानुकोटिप्रकाशम्।\nत्रयः शूलनिर्मूलनं शूलपाणिं भजेऽहं भवानीपतिं भावगम्यम्॥",
        hindi: "जो प्रचण्ड, प्रकृष्ट, प्रगल्भ, परमेश्वर, अखण्ड, अजन्मा और करोड़ों सूर्यों के समान तेजस्वी हैं; जो त्रिशूल से तीनों तापों (दैहिक, दैविक, भौतिक) का समूल नाश करते हैं, उन भक्ति से प्राप्त होने वाले माँ भवानी के पति भगवान शिव को मैं भजता हूँ।",
        english: "Fierce, exalted, courageous, the Supreme Sovereign, indivisible, unborn, radiant as millions of suns; wielding the trident that eliminates the three-fold miseries of life — I adore Lord Shiva, the consort of Bhavani.",
      },
    ],
  },
  {
    id: "panchakshara",
    titleHindi: "शिव पञ्चाक्षर स्तोत्रम्",
    titleEnglish: "Shiva Panchakshara Stotram",
    composer: "आदि शङ्कराचार्य विरचित",
    benefits: "पंच महाभूतों की शुद्धि एवं ॐ नमः शिवाय मन्त्र के अक्षरों का ध्यान।",
    verses: [
      {
        sanskrit: "नागेन्द्रहाराय त्रिलोचनाय भस्माङ्गरागाय महेश्वराय।\nनित्याय शुद्धाय दिगम्बराय तस्मै 'न'काराय नमः शिवाय॥",
        hindi: "जिनके गले में नागराज का हार है, जो त्रिनेत्रधारी हैं, शरीर पर भस्म का लेप लगाए हुए हैं, जो महेश्वर, नित्य, शुद्ध और दिगम्बर हैं; उस 'न'कार स्वरूप भगवान शिव को नमस्कार है।",
        english: "Salutations to Lord Shiva, who wears the king of serpents as a garland, has three eyes, is smeared with sacred ashes, eternal, pure, and clothed in space — salutations to the syllable 'Na'.",
      },
      {
        sanskrit: "मन्दाकिनीसलिलचन्दनचर्चिताय नन्दीश्वरप्रमथनाथमहेश्वराय।\nमन्दारमुख्यबहुपुष्पसुपूजिताय तस्मै 'म'काराय नमः शिवाय॥",
        hindi: "गंगाजल और चन्दन से जिनकी पूजा होती है, जो नन्दी और प्रमथगणों के स्वामी हैं, मन्दार आदि पुष्पों से जिनकी अर्चना की जाती है; उस 'म'कार स्वरूप भगवान शिव को नमस्कार है।",
        english: "Adorned with the holy water of Mandakini and Chandan, the Lord of Nandi and the Pramathas, worshipped with Mandara flowers — salutations to the syllable 'Ma'.",
      },
      {
        sanskrit: "शिवाय गौरीवदनाब्जवृन्दसूर्याय दक्षाध्वरनाशकाय।\nश्रीनीलकण्ठाय वृषध्वजाय तस्मै 'शि'काराय नमः शिवाय॥",
        hindi: "जो कल्याणकारी हैं, माँ गौरी के मुख-कमल को विकसित करने वाले सूर्य हैं, दक्ष के यज्ञ का नाश करने वाले हैं, नीलकण्ठ और वृषभ की ध्वजा वाले हैं; उस 'शि'कार स्वरूप भगवान शिव को नमस्कार है।",
        english: "Auspicious Lord, the Sun that blossoms the lotus face of Mother Gauri, the destroyer of Daksha's sacrifice, with blue throat and bull emblem — salutations to the syllable 'Shi'.",
      },
      {
        sanskrit: "वसिष्ठकुम्भोद्भवगौतमार्यमुनीन्द्रदेवार्चितशेखराय।\nचन्द्रार्कवैश्वानरलोचनाय तस्मै 'व'काराय नमः शिवाय॥",
        hindi: "वसिष्ठ, अगस्त्य और गौतम आदि श्रेष्ठ मुनियों तथा देवताओं द्वारा जिनके चरणों की पूजा की जाती है, सूर्य, चन्द्रमा और अग्नि जिनके तीन नेत्र हैं; उस 'व'कार स्वरूप भगवान शिव को नमस्कार है।",
        english: "Revered by great rishis like Vashistha, Agastya, and Gautama, whose eyes are the Sun, Moon, and Fire — salutations to the syllable 'Va'.",
      },
      {
        sanskrit: "यक्षस्वरूपाय जटाधराय पिनाकहस्ताय सनातनाय।\nदिव्याय देवाय दिगम्बराय तस्मै 'य'काराय नमः शिवाय॥",
        hindi: "जो यक्ष स्वरूप, जटाधारी, हाथ में पिनाक धनुष धारण करने वाले, सनातन, दिव्य देव और दिगम्बर हैं; उस 'य'कार स्वरूप भगवान शिव को नमस्कार है।",
        english: "Assuming celestial forms, wearing matted locks, holding the Pinaka bow, eternal, divine Lord — salutations to the syllable 'Ya'.",
      },
    ],
  },
];
