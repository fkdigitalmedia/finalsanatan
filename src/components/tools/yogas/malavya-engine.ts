/**
 * Malavya Yoga Calculator & Analysis Engine
 * -------------------------------------------
 * Evaluates the formation, planetary strength, dignity, combustion, and house-specific
 * manifestations of Malavya Yoga (one of the 5 Pancha Mahapurusha Yogas formed by Venus).
 * References: Brihat Parashara Hora Shastra (BPHS), Phaladeepika, Saravali, Jataka Parijata.
 */

import { generateKundli } from "@/lib/kundli/engine";
import type { BirthInput, KundliResult } from "@/lib/kundli/types";

export type RashiId =
  | "Aries"
  | "Taurus"
  | "Gemini"
  | "Cancer"
  | "Leo"
  | "Virgo"
  | "Libra"
  | "Scorpio"
  | "Sagittarius"
  | "Capricorn"
  | "Aquarius"
  | "Pisces";

export const RASHIS: { id: RashiId; nameHindi: string; nameEnglish: string; lord: string }[] = [
  { id: "Aries", nameHindi: "मेष (Aries)", nameEnglish: "Aries", lord: "Mars" },
  { id: "Taurus", nameHindi: "वृषभ (Taurus)", nameEnglish: "Taurus", lord: "Venus" },
  { id: "Gemini", nameHindi: "मिथुन (Gemini)", nameEnglish: "Gemini", lord: "Mercury" },
  { id: "Cancer", nameHindi: "कर्क (Cancer)", nameEnglish: "Cancer", lord: "Moon" },
  { id: "Leo", nameHindi: "सिंह (Leo)", nameEnglish: "Leo", lord: "Sun" },
  { id: "Virgo", nameHindi: "कन्या (Virgo)", nameEnglish: "Virgo", lord: "Mercury" },
  { id: "Libra", nameHindi: "तुला (Libra)", nameEnglish: "Libra", lord: "Venus" },
  { id: "Scorpio", nameHindi: "वृश्चिक (Scorpio)", nameEnglish: "Scorpio", lord: "Mars" },
  { id: "Sagittarius", nameHindi: "धनु (Sagittarius)", nameEnglish: "Sagittarius", lord: "Jupiter" },
  { id: "Capricorn", nameHindi: "मकर (Capricorn)", nameEnglish: "Capricorn", lord: "Saturn" },
  { id: "Aquarius", nameHindi: "कुम्भ (Aquarius)", nameEnglish: "Aquarius", lord: "Saturn" },
  { id: "Pisces", nameHindi: "मीन (Pisces)", nameEnglish: "Pisces", lord: "Jupiter" },
];

export interface MalavyaEvaluationInput {
  lagnaRashi: RashiId;
  venusRashi: RashiId;
  venusHouse: number; // 1 to 12
  isVenusCombust?: boolean;
  isVenusRetrograde?: boolean;
  hasBeneficAspect?: boolean;
}

export interface MalavyaYogaResult {
  isPresent: boolean;
  status: "full" | "partial" | "absent";
  statusTextHindi: string;
  statusTextEnglish: string;
  strengthPercentage: number; // 0 - 100%
  lagnaRashi: RashiId;
  venusRashi: RashiId;
  venusHouse: number;
  dignity: "Exalted (उच्च)" | "Own Sign (स्वराशि)" | "Debilitated (नीच)" | "Enemy / Neutral";
  isKendra: boolean;
  isCombust: boolean;
  isRetrograde: boolean;
  factors: {
    label: string;
    passed: boolean;
    description: string;
  }[];
  housePrediction: {
    houseNumber: number;
    titleHindi: string;
    titleEnglish: string;
    effectsHindi: string;
    effectsEnglish: string;
  };
  generalEffectsHindi: string[];
  generalEffectsEnglish: string[];
  careerIndications: string[];
  remedies: {
    mantra: string;
    mantraHindi: string;
    gemstone: string;
    rudraksha: string;
    worship: string;
    charity: string;
  };
  classicalVerse: {
    shloka: string;
    source: string;
    translationHindi: string;
    translationEnglish: string;
  };
}

const RASHI_INDEX: Record<RashiId, number> = {
  Aries: 0,
  Taurus: 1,
  Gemini: 2,
  Cancer: 3,
  Leo: 4,
  Virgo: 5,
  Libra: 6,
  Scorpio: 7,
  Sagittarius: 8,
  Capricorn: 9,
  Aquarius: 10,
  Pisces: 11,
};

const KENDRA_HOUSES = [1, 4, 7, 10];

const HOUSE_PREDICTIONS: Record<
  number,
  {
    titleHindi: string;
    titleEnglish: string;
    effectsHindi: string;
    effectsEnglish: string;
  }
> = {
  1: {
    titleHindi: "प्रथम भाव (लग्न) में मालव्य योग",
    titleEnglish: "Malavya Yoga in 1st House (Ascendant)",
    effectsHindi:
      "जातक अत्यन्त रूपवान, आकर्षक, तेजस्वी एवं सम्मोहक व्यक्तित्व का स्वामी होता है। उत्तम स्वास्थ्य, दीर्घायु, समाज में राजा समान प्रतिष्ठा, कलात्मक दृष्टि और स्वाभाविक लोकप्रियता प्राप्त होती है।",
    effectsEnglish:
      "Radiant and magnetic appearance, robust vitality, supreme charisma, long life, royal dignity, and natural public admiration.",
  },
  4: {
    titleHindi: "चतुर्थ भाव (सुख भाव) में मालव्य योग",
    titleEnglish: "Malavya Yoga in 4th House (Comfort & Real Estate)",
    effectsHindi:
      "भव्य भवन, प्रासाद, आलीशान वाहन (लक्जरी गाड़ियाँ), अचल सम्पत्ति, माता का असीम स्नेह तथा जीवन में सर्वोत्कृष्ट भौतिक सुख-सुविधाओं की प्राप्ति होती है।",
    effectsEnglish:
      "Palatial residences, fleet of luxury conveyances, massive real estate holdings, deep maternal blessings, and abundant domestic bliss.",
  },
  7: {
    titleHindi: "सप्तम भाव (जाया भाव) में मालव्य योग",
    titleEnglish: "Malavya Yoga in 7th House (Marriage & Partnership)",
    effectsHindi:
      "अत्यन्त सुसंस्कृत, रूपवती एवं धनाढ्य जीवनसाथी की प्राप्ति। वैवाहिक जीवन आनन्दमय रहता है तथा व्यापारिक साझेदारियों (पार्टनरशिप) व विदेश व्यापार में भारी आर्थिक लाभ होता है।",
    effectsEnglish:
      "Extremely beautiful, refined, and prosperous spouse. Unbroken marital harmony, flourishing business partnerships, and immense fortune through diplomacy/trade.",
  },
  10: {
    titleHindi: "दशम भाव (कर्म भाव) में मालव्य योग",
    titleEnglish: "Malavya Yoga in 10th House (Career & Status)",
    effectsHindi:
      "सिनेमा, कला, संगीत, फैशन, सौन्दर्य प्रसाधन, आतिथ्य (हॉस्पिटैलिटी), कूटनीति अथवा उच्च प्रशासनिक पद पर अपार ख्याति और यश। जातक अपने कार्यक्षेत्र का सिरमौर बनता है।",
    effectsEnglish:
      "Skyrocketing fame in entertainment, cinema, high fashion, luxury industries, diplomacy, aesthetics, and government honors. Natural leader in their domain.",
  },
};

/**
 * Evaluate Malavya Yoga from discrete astrological parameters
 */
export function evaluateMalavyaYoga(input: MalavyaEvaluationInput): MalavyaYogaResult {
  const { lagnaRashi, venusRashi, venusHouse, isVenusCombust = false, isVenusRetrograde = false, hasBeneficAspect = false } = input;

  const isKendra = KENDRA_HOUSES.includes(venusHouse);
  const isOwnSign = venusRashi === "Taurus" || venusRashi === "Libra";
  const isExalted = venusRashi === "Pisces";
  const isDebilitated = venusRashi === "Virgo";

  let dignity: MalavyaYogaResult["dignity"] = "Enemy / Neutral";
  if (isExalted) dignity = "Exalted (उच्च)";
  else if (isOwnSign) dignity = "Own Sign (स्वराशि)";
  else if (isDebilitated) dignity = "Debilitated (नीच)";

  const isFormed = isKendra && (isOwnSign || isExalted);

  // Calculate Strength Percentage
  let strength = 0;
  if (isFormed) {
    strength = isExalted ? 95 : 85;
    if (isVenusRetrograde) strength += 5; // Cheshta Bala boost
    if (hasBeneficAspect) strength += 5;
    if (isVenusCombust) strength -= 30; // Combustion penalty
  } else if (isOwnSign || isExalted) {
    strength = 35; // Dignified but not in Kendra
  } else if (isKendra) {
    strength = 20;
  }

  strength = Math.max(0, Math.min(100, strength));

  let status: MalavyaYogaResult["status"] = "absent";
  let statusTextHindi = "मालव्य योग उपस्थित नहीं है";
  let statusTextEnglish = "Malavya Yoga Not Present";

  if (isFormed) {
    if (isVenusCombust) {
      status = "partial";
      statusTextHindi = "आंशिक / अस्त मालव्य योग (Combust Malavya Yoga)";
      statusTextEnglish = "Afflicted / Combust Malavya Yoga";
    } else {
      status = "full";
      statusTextHindi = "पूर्ण एवं प्रबल मालव्य योग उपस्थित है";
      statusTextEnglish = "Fully Formed Powerful Malavya Yoga";
    }
  }

  const factors = [
    {
      label: "केन्द्र भाव में स्थिति (Kendra Placement)",
      passed: isKendra,
      description: isKendra
        ? `शुक्र देव केन्द्र भाव (भाव ${venusHouse}) में स्थित हैं।`
        : `शुक्र देव केन्द्र भाव (1, 4, 7, 10) में नहीं, अपितु भाव ${venusHouse} में हैं।`,
    },
    {
      label: "स्वराशि अथवा उच्च राशि (Own/Exalted Sign)",
      passed: isOwnSign || isExalted,
      description: isExalted
        ? "शुक्र देव अपनी परम उच्च राशि मीन (Pisces) में विराजमान हैं।"
        : isOwnSign
          ? `शुक्र देव अपनी स्वराशि ${venusRashi} में स्थित हैं।`
          : `शुक्र देव ${venusRashi} में हैं जो स्वराशि या उच्च राशि नहीं है।`,
    },
    {
      label: "अस्त दोष से मुक्ति (Combustion Check)",
      passed: !isVenusCombust,
      description: isVenusCombust
        ? "शुक्र सूर्य के अत्यन्त निकट होने से अस्त (Combust) हैं, जिससे योग का प्रभाव कुछ क्षीण हो सकता है।"
        : "शुक्र अस्त नहीं हैं, अपनी पूर्ण कान्ति एवं तेज के साथ क्रियाशील हैं।",
    },
  ];

  const defaultHousePred = HOUSE_PREDICTIONS[venusHouse] || {
    titleHindi: `भाव ${venusHouse} में शुक्र का प्रभाव`,
    titleEnglish: `Venus in House ${venusHouse}`,
    effectsHindi: "शुक्र देव शुभ स्थिति में रहकर जातक को सुख-समृद्धि एवं कलात्मक अभिरुचि प्रदान करते हैं।",
    effectsEnglish: "Venus provides comforts, aesthetic inclinations, and wealth.",
  };

  return {
    isPresent: isFormed,
    status,
    statusTextHindi,
    statusTextEnglish,
    strengthPercentage: strength,
    lagnaRashi,
    venusRashi,
    venusHouse,
    dignity,
    isKendra,
    isCombust: isVenusCombust,
    isRetrograde: isVenusRetrograde,
    factors,
    housePrediction: defaultHousePred,
    generalEffectsHindi: [
      "सम्पूर्ण भौतिक सुख, ऐश्वर्य, प्रासाद (आलीशान भवन) तथा लक्जरी वाहनों का सुख।",
      "आकर्षक, मनमोहक एवं शालीन व्यक्तित्व, जिससे समाज में स्वतः आदर व प्रेम मिलता है।",
      "संगीत, नाट्य, सिनेमा, चित्रकला, काव्य अथवा सौन्दर्य प्रसाधनों में असाधारण प्रतिभा।",
      "सुसंस्कृत, रूपवान एवं गुणवान जीवनसाथी की प्राप्ति तथा सुखी दांपत्य जीवन।",
      "दीर्घायु, शारीरिक कान्ति, निर्मल बुद्धि तथा जीवन के अन्तिम समय तक समृद्धिशाली स्थिति।",
    ],
    generalEffectsEnglish: [
      "Unbounded material abundance, palatial residences, and fleet of luxury conveyances.",
      "Magnetic, graceful, and regal aura commanding spontaneous public affection.",
      "Extraordinary creative talents in cinema, music, arts, high fashion, and aesthetics.",
      "Virtuous, cultured, and wealthy life partner with harmonious domestic life.",
      "Longevity, radiant physical glow, sharp intellect, and aristocratic lifestyle.",
    ],
    careerIndications: [
      "Film, Cinema, Television & Entertainment Industries (फिल्म व अभिनय)",
      "Fashion Designing, Haute Couture & Luxury Brands (फैशन व वस्त्र उद्योग)",
      "Music, Performing Arts & Fine Arts (संगीत व ललित कलाएं)",
      "Architecture, Interior Designing & Real Estate (आर्किटेक्चर व इंटीरियर)",
      "Hospitality, Gourmet Dining & Tourism (हॉस्पिटैलिटी व पर्यटन)",
      "Diplomacy, International Trade & Public Relations (कूटनीति व जनसम्पर्क)",
      "Cosmetics, Perfumery & Gemstones (सौन्दर्य प्रसाधन व रत्न व्यवसाय)",
    ],
    remedies: {
      mantra: "ॐ शुं शुक्राय नमः (Om Shum Shukraya Namah)",
      mantraHindi: "ॐ द्रां द्रीं द्रौं सः शुक्राय नमः॥",
      gemstone: "हीरा (Diamond), उत्तम ओपल (Australian Opal) अथवा श्वेत जरकन अनामिका या मध्यमा में चांदी की अंगूठी में धारण करें।",
      rudraksha: "६ मुखी रुद्राक्ष (6-Mukhi Rudraksha — भगवान कार्तिकेय व शुक्र का स्वरूप) धारण करें।",
      worship: "प्रतिदिन श्री सूक्तम् (Sri Suktam) अथवा कनकधारा स्तोत्र का पाठ करें तथा माँ महालक्ष्मी की आराधना करें।",
      charity: "शुक्रवार के दिन श्वेत वस्त्र, चावल, दूध, मिश्री, कपूर अथवा श्वेत मिष्ठान्न का दान करें।",
    },
    classicalVerse: {
      shloka:
        "वृषतुलाझषसंस्थे केन्द्रगे दैत्यपूज्ये\nभवति खलु नराणां मालव्यो नाम योगः।\nप्रथितगुणकलाढ्यो नीतिमान् रूपयुक्तो\nमहितविभवयुक्तो जायते मालव्येण॥",
      source: "बृहत्पाराशर होराशास्त्र (BPHS) / फलदीपिका",
      translationHindi:
        "जब शुक्र वृषभ, तुला अथवा मीन राशि में होकर लग्न से केन्द्र (१, ४, ७, १०) भाव में स्थित हो, तब 'मालव्य योग' बनता है। इस योग में उत्पन्न जातक प्रसिद्ध गुणों व कलाओं से युक्त, नीतिवान, परम रूपवान, यशस्वी एवं अपार वैभवशाली होता है।",
      translationEnglish:
        "When Venus occupies Taurus, Libra, or Pisces in a Kendra house (1, 4, 7, 10) from the Ascendant, Malavya Yoga is formed. The native born under this yoga is endowed with refined arts, virtuous conduct, exceptional beauty, boundless wealth, and royal stature.",
    },
  };
}

/**
 * Calculate Malavya Yoga directly from complete birth inputs (date, time, lat, lon)
 */
export function calculateMalavyaYogaFromBirth(input: BirthInput): {
  kundli: KundliResult;
  result: MalavyaYogaResult;
} {
  const kundli = generateKundli(input);

  const ascSignIdx = kundli.d1.ascendant.rashiIndex; // 0..11
  const lagnaRashi = RASHIS[ascSignIdx].id;

  const venus = kundli.d1.planets.find((p) => p.graha === "Venus");
  const sun = kundli.d1.planets.find((p) => p.graha === "Sun");

  if (!venus) {
    throw new Error("Venus planetary position could not be computed.");
  }

  const venusRashi = RASHIS[venus.rashiIndex].id;
  const venusHouse = venus.house; // 1..12

  // Check combustion with Sun (within 10 degrees sidereal)
  let isCombust = false;
  if (sun) {
    const diff = Math.abs(venus.longitudeSidereal - sun.longitudeSidereal);
    const circularDiff = diff > 180 ? 360 - diff : diff;
    isCombust = circularDiff <= 10;
  }

  const isRetrograde = venus.retrograde || false;

  // Check aspect from Jupiter
  const jupiter = kundli.d1.planets.find((p) => p.graha === "Jupiter");
  let hasBeneficAspect = false;
  if (jupiter) {
    const houseDiff = (venus.house - jupiter.house + 12) % 12;
    // Jupiter aspects 5th, 7th, 9th from its position
    if (houseDiff === 4 || houseDiff === 6 || houseDiff === 8) {
      hasBeneficAspect = true;
    }
  }

  const result = evaluateMalavyaYoga({
    lagnaRashi,
    venusRashi,
    venusHouse,
    isVenusCombust: isCombust,
    isVenusRetrograde: isRetrograde,
    hasBeneficAspect,
  });

  return { kundli, result };
}
