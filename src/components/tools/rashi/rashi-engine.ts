/**
 * Advanced Vedic Rashi, Chandra Kundli & Avakahada Engine
 * --------------------------------------------------------
 * Computes:
 * 1. Astronomical Sidereal Moon Sign (चन्द्र राशि), Sun Sign (सूर्य राशि), Ascendant (लग्न)
 * 2. Complete Avakahada Chakra (वर्ण, वश्य, योनि, गण, नाड़ी, तत्व)
 * 3. 12 Rashi Profiles with strengths, weaknesses, lucky numbers/colors/gemstones, Ishta Devata
 * 4. Name-based Akshara / Syllable Rashi matcher
 * 5. Planetary Friendship (मैत्री चक्र) and Saturn Sade Sati / Dhaiya status indicator
 */

import { generateKundli } from "@/lib/kundli/engine";
import type { BirthInput, KundliResult } from "@/lib/kundli/types";

export interface RashiProfile {
  id: string; // e.g. "Mesha"
  index: number; // 0..11
  nameHindi: string;
  nameEnglish: string;
  sanskritName: string;
  symbol: string;
  symbolHindi: string;
  lord: string;
  lordHindi: string;
  element: "Fire (अग्नि)" | "Earth (पृथ्वी)" | "Air (वायु)" | "Water (जल)";
  modality: "Chara (चर - Movable)" | "Sthira (स्थिर - Fixed)" | "Dwisvabhava (द्विस्वभाव - Dual)";
  varna: "Brahmin (ब्राह्मण)" | "Kshatriya (क्षत्रिय)" | "Vaishya (वैश्य)" | "Shudra (शूद्र)";
  vashya: "Chatushpada (चतुष्पद)" | "Dvipada (द्विपद)" | "Jalachara (जलचर)" | "Vanachara (वनचर)" | "Keeta (कीटक)";
  ishtaDevata: string;
  ishtaDevataMantra: string;
  luckyNumbers: number[];
  luckyColors: string[];
  luckyDays: string[];
  luckyGemstone: string;
  luckyDirection: string;
  compatibleRashis: string[];
  incompatibleRashis: string[];
  syllables: string[];
  syllablesHindi: string[];
  personalityTraits: {
    strengths: string[];
    weaknesses: string[];
    coreNatureHindi: string;
    coreNatureEnglish: string;
  };
  beejMantra: string;
  vedicRemedy: string;
}

export interface RashiCalculationResult {
  moonRashi: RashiProfile;
  sunRashi: RashiProfile;
  lagnaRashi: RashiProfile;
  moonLongitude: number;
  moonDegreesInSign: number;
  nakshatra: {
    name: string;
    index: number;
    pada: number;
    lord: string;
    deity: string;
    symbol: string;
  };
  avakahada: {
    varna: string;
    vashya: string;
    yoni: string;
    gana: string;
    nadi: string;
    tattva: string;
    rashiLord: string;
  };
  sadeSatiStatus: {
    isActive: boolean;
    phase: "उदय (1st Phase - Setting in)" | "शिखर (2nd Phase - Peak / Janma)" | "अस्त (3rd Phase - Receding)" | "ढैया (Kantaka/Ashtama Dhaiya)" | "None (मुक्त)";
    descriptionHindi: string;
    descriptionEnglish: string;
  };
  kundliResult?: KundliResult;
}

// ──────────────────────────────────────────
// 1. 12 VEDIC RASHIS MASTER REPOSITORY
// ──────────────────────────────────────────

export const RASHI_DATABASE: RashiProfile[] = [
  {
    id: "Mesha",
    index: 0,
    nameHindi: "मेष राशि",
    nameEnglish: "Aries",
    sanskritName: "मेष",
    symbol: "Ram (मेढ़ा)",
    symbolHindi: "मेढ़ा",
    lord: "Mars (मंगल)",
    lordHindi: "मंगल देव",
    element: "Fire (अग्नि)",
    modality: "Chara (चर - Movable)",
    varna: "Kshatriya (क्षत्रिय)",
    vashya: "Chatushpada (चतुष्पद)",
    ishtaDevata: "भगवान श्री हनुमान जी / कार्तिकेय",
    ishtaDevataMantra: "ॐ हं हनुमते नमः",
    luckyNumbers: [9, 1, 8],
    luckyColors: ["लाल (Red)", "सिन्दूरी (Vermilion)", "गुलाबी (Pink)"],
    luckyDays: ["मंगलवार (Tuesday)", "रविवार (Sunday)"],
    luckyGemstone: "मूंगा (Red Coral)",
    luckyDirection: "पूर्व (East)",
    compatibleRashis: ["सिंह (Leo)", "धनु (Sagittarius)", "मिथुन (Gemini)", "कुम्भ (Aquarius)"],
    incompatibleRashis: ["कर्क (Cancer)", "मकर (Capricorn)"],
    syllables: ["Chu", "Che", "Cho", "La", "Li", "Lu", "Le", "Lo", "A"],
    syllablesHindi: ["चू", "चे", "चो", "ला", "ली", "लू", "ले", "लो", "अ"],
    personalityTraits: {
      strengths: ["साहसी व निडर", "नेतृत्व क्षमता (Natural Leader)", "ऊर्जावान व महत्वाकांक्षी", "ईमानदार व स्पष्टवादी"],
      weaknesses: ["शीघ्र क्रोध (Impatience)", "अधीरता", "हठधर्मिता"],
      coreNatureHindi: "मेष राशि के जातक जन्मजात उत्साही, साहसी एवं पराक्रमी होते हैं। ये किसी के अधीन कार्य करने की अपेक्षा स्वयं निर्णय लेना पसन्द करते हैं।",
      coreNatureEnglish: "Courageous, dynamic, pioneering, and ambitious individuals with natural leadership instincts.",
    },
    beejMantra: "ॐ क्रां क्रीं क्रौं सः भौमाय नमः॥",
    vedicRemedy: "प्रतिदिन हनुमान चालीसा का पाठ करें, मंगलवार को लाल पुष्प व गुड़ अर्पित करें।",
  },
  {
    id: "Vrishabha",
    index: 1,
    nameHindi: "वृषभ राशि",
    nameEnglish: "Taurus",
    sanskritName: "वृषभ",
    symbol: "Bull (बैल)",
    symbolHindi: "बैल / वृषभ",
    lord: "Venus (शुक्र)",
    lordHindi: "शुक्र देव",
    element: "Earth (पृथ्वी)",
    modality: "Sthira (स्थिर - Fixed)",
    varna: "Vaishya (वैश्य)",
    vashya: "Chatushpada (चतुष्पद)",
    ishtaDevata: "माँ महालक्ष्मी / माँ जगदम्बा",
    ishtaDevataMantra: "ॐ श्रीं ह्रीं श्रीं कमले कमलालये प्रसीद प्रसीद",
    luckyNumbers: [6, 5, 2],
    luckyColors: ["सफेद (White)", "गुलाबी (Pink)", "हल्का नीला (Light Blue)"],
    luckyDays: ["शुक्रवार (Friday)", "बुधवार (Wednesday)"],
    luckyGemstone: "हीरा (Diamond) / ओपल (Opal)",
    luckyDirection: "दक्षिण (South)",
    compatibleRashis: ["कन्या (Virgo)", "मकर (Capricorn)", "कर्क (Cancer)", "मीन (Pisces)"],
    incompatibleRashis: ["सिंह (Leo)", "वृश्चिक (Scorpio)"],
    syllables: ["I", "U", "E", "O", "Va", "Vi", "Vu", "Ve", "Vo"],
    syllablesHindi: ["इ", "उ", "ए", "ओ", "वा", "वी", "वू", "वे", "वो"],
    personalityTraits: {
      strengths: ["धैर्यवान व स्थिर", "कलाप्रिय व सुरुचिपूर्ण", "विश्वसनीय व निष्ठावान", "आर्थिक रूप से दूरदर्शी"],
      weaknesses: ["अत्यधिक हठी (Stubborn)", "आलस्य की प्रवृत्ति", "परिवर्तन का विरोध"],
      coreNatureHindi: "वृषभ राशि के जातक सौन्दर्य, कला और सुख-सुविधाओं के प्रेमी होते हैं। इनका स्वभाव गम्भीर, व्यावहारिक एवं दृढ़निश्चयी होता है।",
      coreNatureEnglish: "Patient, dependable, aesthetic-minded, practical, and possessing extraordinary perseverance.",
    },
    beejMantra: "ॐ द्रां द्रीं द्रौं सः शुक्राय नमः॥",
    vedicRemedy: "प्रतिदिन श्री सूक्तम् का पाठ करें, शुक्रवार को गाय को हरा चारा व श्वेत मिष्ठान्न खिलाएं।",
  },
  {
    id: "Mithuna",
    index: 2,
    nameHindi: "मिथुन राशि",
    nameEnglish: "Gemini",
    sanskritName: "मिथुन",
    symbol: "Twins (स्त्री-पुरुष युग्म)",
    symbolHindi: "युगल",
    lord: "Mercury (बुध)",
    lordHindi: "बुध देव",
    element: "Air (वायु)",
    modality: "Dwisvabhava (द्विस्वभाव - Dual)",
    varna: "Shudra (शूद्र)",
    vashya: "Dvipada (द्विपद)",
    ishtaDevata: "भगवान श्री गणेश जी / भगवान विष्णु",
    ishtaDevataMantra: "ॐ गं गणपतये नमः",
    luckyNumbers: [5, 3, 6],
    luckyColors: ["हरा (Green)", "हल्का पीला (Light Yellow)", "आसमानी (Sky Blue)"],
    luckyDays: ["बुधवार (Wednesday)", "गुरुवार (Thursday)"],
    luckyGemstone: "पन्ना (Emerald)",
    luckyDirection: "पश्चिम (West)",
    compatibleRashis: ["तुला (Libra)", "कुम्भ (Aquarius)", "मेष (Aries)", "सिंह (Leo)"],
    incompatibleRashis: ["कन्या (Virgo)", "मीन (Pisces)"],
    syllables: ["Ka", "Ki", "Ku", "Gha", "Ing", "Chha", "Ke", "Ko", "Ha"],
    syllablesHindi: ["का", "की", "कू", "घ", "ङ", "छ", "के", "को", "हा"],
    personalityTraits: {
      strengths: ["कुशाग्र बुद्धि (Sharp Intellect)", "वाक्पटुता व संचार कौशल", "बहुमुखी प्रतिभा (Versatile)", "जिज्ञासु व मिलनसार"],
      weaknesses: ["मन की चंचलता (Inconsistency)", "अनिर्णय की स्थिति", "दोहरा स्वभाव"],
      coreNatureHindi: "मिथुन राशि के जातक तीक्ष्ण बुद्धि, हाजिरजवाबी एवं उत्कृष्ट वार्तालाप शैली के धनी होते हैं।",
      coreNatureEnglish: "Intellectually curious, witty, highly communicative, adaptable, and multifaceted.",
    },
    beejMantra: "ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः॥",
    vedicRemedy: "भगवान गणेश को दुर्वा अर्पित करें, बुधवार को हरे मूंग का दान करें तथा विष्णु सहस्रनाम सुनें।",
  },
  {
    id: "Karka",
    index: 3,
    nameHindi: "कर्क राशि",
    nameEnglish: "Cancer",
    sanskritName: "कर्क",
    symbol: "Crab (कर्कट / केकड़ा)",
    symbolHindi: "कर्कट",
    lord: "Moon (चन्द्रमा)",
    lordHindi: "चन्द्र देव",
    element: "Water (जल)",
    modality: "Chara (चर - Movable)",
    varna: "Brahmin (ब्राह्मण)",
    vashya: "Jalachara (जलचर)",
    ishtaDevata: "भगवान शिव (चन्द्रमौलीश)",
    ishtaDevataMantra: "ॐ नमः शिवाय",
    luckyNumbers: [2, 7, 9],
    luckyColors: ["सफेद (White)", "चांदी जैसा (Silver)", "क्रीम (Cream)"],
    luckyDays: ["सोमवार (Monday)", "मंगलवार (Tuesday)"],
    luckyGemstone: "मोती (Pearl) / चन्द्रकान्त मणि (Moonstone)",
    luckyDirection: "उत्तर (North)",
    compatibleRashis: ["वृश्चिक (Scorpio)", "मीन (Pisces)", "वृषभ (Taurus)", "कन्या (Virgo)"],
    incompatibleRashis: ["मेष (Aries)", "तुला (Libra)"],
    syllables: ["Hi", "Hu", "He", "Ho", "Da", "Di", "Du", "De", "Do"],
    syllablesHindi: ["ही", "हू", "हे", "हो", "डा", "डी", "डू", "डे", "डो"],
    personalityTraits: {
      strengths: ["अत्यन्त संवेदनशील व दयालु", "परिवार-प्रेमी व सुरक्षात्मक", "गहन अंतर्दृष्टि (Intuitive)", "समर्पण भाव"],
      weaknesses: ["अति-भावुकता (Over-emotional)", "मूड स्विंग्स", "असुरक्षा की भावना"],
      coreNatureHindi: "कर्क राशि के जातक भावुक, स्नेही, कल्पनाशील एवं दयालु होते हैं। परिवार और मातृभूमि से इनका गहरा जुड़ाव होता है।",
      coreNatureEnglish: "Intuitive, nurturing, empathetic, highly imaginative, and deeply devoted to loved ones.",
    },
    beejMantra: "ॐ श्रां श्रीं श्रौं सः चन्द्रमसे नमः॥",
    vedicRemedy: "शिवलिंग पर कच्चा दूध व जल अर्पित करें, पूर्णिमा को चन्द्रमा को अर्घ्य दें और माता का सम्मान करें।",
  },
  {
    id: "Simha",
    index: 4,
    nameHindi: "सिंह राशि",
    nameEnglish: "Leo",
    sanskritName: "सिंह",
    symbol: "Lion (सिंह / शेर)",
    symbolHindi: "सिंह",
    lord: "Sun (सूर्य)",
    lordHindi: "सूर्य नारायण",
    element: "Fire (अग्नि)",
    modality: "Sthira (स्थिर - Fixed)",
    varna: "Kshatriya (क्षत्रिय)",
    vashya: "Vanachara (वनचर)",
    ishtaDevata: "भगवान सूर्य नारायण / श्री राम",
    ishtaDevataMantra: "ॐ घृणिः सूर्याय नमः",
    luckyNumbers: [1, 5, 9],
    luckyColors: ["स्वर्ण (Gold)", "नारंगी (Orange)", "पीला (Yellow)", "ताम्र (Copper)"],
    luckyDays: ["रविवार (Sunday)", "मंगलवार (Tuesday)"],
    luckyGemstone: "माणिक्य (Ruby)",
    luckyDirection: "पूर्व (East)",
    compatibleRashis: ["मेष (Aries)", "धनु (Sagittarius)", "मिथुन (Gemini)", "तुला (Libra)"],
    incompatibleRashis: ["वृषभ (Taurus)", "वृश्चिक (Scorpio)"],
    syllables: ["Ma", "Mi", "Mu", "Me", "Mo", "Ta", "Ti", "Tu", "Te"],
    syllablesHindi: ["मा", "मी", "मू", "मे", "मो", "टा", "टी", "टू", "टे"],
    personalityTraits: {
      strengths: ["तेजस्वी व राजसी स्वभाव", "उदार हृदय व दानी", "नेतृत्व एवं आत्मविश्वास", "स्वाभिमानी"],
      weaknesses: ["अहंकार (Ego)", "अत्यधिक प्रभुत्व जमाने की प्रवृत्ति", "चाटुकारिता में आना"],
      coreNatureHindi: "सिंह राशि के जातक राजा के समान प्रतापी, स्वाभिमानी, साहसी एवं उदार हृदय होते हैं। ये सदैव प्रमुख स्थान पर रहना पसन्द करते हैं।",
      coreNatureEnglish: "Magnanimous, regal, confident, charismatic, and born to inspire and command respect.",
    },
    beejMantra: "ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः॥",
    vedicRemedy: "प्रतिदिन प्रातः तांबे के लोटे से सूर्यदेव को अर्घ्य दें और आदित्य हृदय स्तोत्र का पाठ करें।",
  },
  {
    id: "Kanya",
    index: 5,
    nameHindi: "कन्या राशि",
    nameEnglish: "Virgo",
    sanskritName: "कन्या",
    symbol: "Maiden (हाथ में धान व दीपक लिए कन्या)",
    symbolHindi: "कन्या",
    lord: "Mercury (बुध)",
    lordHindi: "बुध देव",
    element: "Earth (पृथ्वी)",
    modality: "Dwisvabhava (द्विस्वभाव - Dual)",
    varna: "Vaishya (वैश्य)",
    vashya: "Dvipada (द्विपद)",
    ishtaDevata: "माँ सरस्वती / भगवान नारायण",
    ishtaDevataMantra: "ॐ ऐं सरस्वत्यै नमः",
    luckyNumbers: [5, 2, 7],
    luckyColors: ["हरा (Dark Green)", "हल्का नीला (Sky Blue)", "सफेद (White)"],
    luckyDays: ["बुधवार (Wednesday)", "शुक्रवार (Friday)"],
    luckyGemstone: "पन्ना (Emerald)",
    luckyDirection: "दक्षिण (South)",
    compatibleRashis: ["वृषभ (Taurus)", "मकर (Capricorn)", "कर्क (Cancer)", "वृश्चिक (Scorpio)"],
    incompatibleRashis: ["मिथुन (Gemini)", "धनु (Sagittarius)"],
    syllables: ["To", "Pa", "Pi", "Pu", "Sha", "Na", "Tha", "Pe", "Po"],
    syllablesHindi: ["टो", "पा", "पी", "पू", "ष", "ण", "ठ", "पे", "पो"],
    personalityTraits: {
      strengths: ["विश्लेषणात्मक व तार्किक (Analytical)", "परिश्रमी व व्यवस्थित", "व्यावहारिक व विवेकशील", "सत्यनिष्ठ"],
      weaknesses: ["अति-आलोचक (Overcritical)", "अनावश्यक चिंता व तनाव", "परफेक्शनिज़्म"],
      coreNatureHindi: "कन्या राशि के जातक अत्यधिक बुद्धिमान, परिश्रमी, व्यवस्थित एवं सेवाभावी होते हैं। हर कार्य को बारीकी से करना इनकी विशेषता है।",
      coreNatureEnglish: "Detail-oriented, analytical, meticulous, pragmatic, service-oriented, and intellectually gifted.",
    },
    beejMantra: "ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः॥",
    vedicRemedy: "गाय को हरी घास खिलाएं, माँ सरस्वती की वन्दना करें और पक्षियों को दाना डालें।",
  },
  {
    id: "Tula",
    index: 6,
    nameHindi: "तुला राशि",
    nameEnglish: "Libra",
    sanskritName: "तुला",
    symbol: "Scales (तराजू लिए पुरुष)",
    symbolHindi: "तराजू / तुला",
    lord: "Venus (शुक्र)",
    lordHindi: "शुक्र देव",
    element: "Air (वायु)",
    modality: "Chara (चर - Movable)",
    varna: "Shudra (शूद्र)",
    vashya: "Dvipada (द्विपद)",
    ishtaDevata: "माँ महालक्ष्मी / भगवान श्रीकृष्ण",
    ishtaDevataMantra: "ॐ श्रीं श्रियै नमः",
    luckyNumbers: [6, 5, 8],
    luckyColors: ["सफेद (White)", "गुलाबी (Pink)", "हल्का पीला (Cream)"],
    luckyDays: ["शुक्रवार (Friday)", "शनिवार (Saturday)"],
    luckyGemstone: "हीरा (Diamond) / ओपल (Opal)",
    luckyDirection: "पश्चिम (West)",
    compatibleRashis: ["मिथुन (Gemini)", "कुम्भ (Aquarius)", "सिंह (Leo)", "धनु (Sagittarius)"],
    incompatibleRashis: ["कर्क (Cancer)", "मकर (Capricorn)"],
    syllables: ["Ra", "Ri", "Ru", "Re", "Ro", "Ta", "Ti", "Tu", "Te"],
    syllablesHindi: ["रा", "री", "रू", "रे", "रो", "ता", "ती", "तू", "ते"],
    personalityTraits: {
      strengths: ["न्यायप्रिय व सन्तुलित", "आकर्षक व सौम्य व्यवहार", "कूटनीतिक व सामंजस्यवादी", "कला व सौन्दर्य प्रेमी"],
      weaknesses: ["अनिर्णय की स्थिति (Indecisiveness)", "दूसरों पर अति-निर्भरता", "विवादों से अत्यधिक पलायन"],
      coreNatureHindi: "तुला राशि के जातक न्यायप्रिय, सन्तुलित, सौम्य एवं कलाप्रेमी होते हैं। जीवन में सामंजस्य और शान्ति स्थापित करना इनका मुख्य लक्ष्य होता है।",
      coreNatureEnglish: "Diplomatic, harmonious, refined, aesthetically sensitive, and naturally inclined toward balance and justice.",
    },
    beejMantra: "ॐ द्रां द्रीं द्रौं सः शुक्राय नमः॥",
    vedicRemedy: "शुक्रवार को माँ लक्ष्मी को कमल का पुष्प अर्पित करें, सफेद चन्दन का तिलक लगाएं और कन्याओं का सम्मान करें।",
  },
  {
    id: "Vrishchika",
    index: 7,
    nameHindi: "वृश्चिक राशि",
    nameEnglish: "Scorpio",
    sanskritName: "वृश्चिक",
    symbol: "Scorpion (बिच्छू)",
    symbolHindi: "वृश्चिक / बिच्छू",
    lord: "Mars (मंगल)",
    lordHindi: "मंगल देव",
    element: "Water (जल)",
    modality: "Sthira (स्थिर - Fixed)",
    varna: "Brahmin (ब्राह्मण)",
    vashya: "Keeta (कीटक)",
    ishtaDevata: "भगवान श्री हनुमान जी / भैरव देव",
    ishtaDevataMantra: "ॐ क्रां क्रीं क्रौं सः भौमाय नमः",
    luckyNumbers: [9, 1, 4],
    luckyColors: ["गहरा लाल (Deep Red)", "मैरून (Maroon)", "केसरिया (Saffron)"],
    luckyDays: ["मंगलवार (Tuesday)", "गुरुवार (Thursday)"],
    luckyGemstone: "मूंगा (Red Coral)",
    luckyDirection: "उत्तर (North)",
    compatibleRashis: ["कर्क (Cancer)", "मीन (Pisces)", "मकर (Capricorn)", "वृषभ (Taurus)"],
    incompatibleRashis: ["सिंह (Leo)", "कुम्भ (Aquarius)"],
    syllables: ["To", "Na", "Ni", "Nu", "Ne", "No", "Ya", "Yi", "Yu"],
    syllablesHindi: ["तो", "ना", "नी", "नू", "ने", "नो", "या", "यी", "यू"],
    personalityTraits: {
      strengths: ["दृढ़ संकल्पी व साहसी", "गूढ़ रहस्यवेत्ता (Mystic & Deep)", "वफादार व निष्ठावान", "तीक्ष्ण अंतर्ज्ञान"],
      weaknesses: ["अति-गोपनीयता (Secretive)", "प्रतिशोध की भावना", "ईर्ष्या व संदेह"],
      coreNatureHindi: "वृश्चिक राशि के जातक दृढ़ संकल्पी, गूढ़, रहस्यमयी एवं अदम्य इच्छाशक्ति के धनी होते हैं। एक बार जो ठान लेते हैं, उसे पूरा करके ही रहते हैं।",
      coreNatureEnglish: "Intense, deeply perceptive, resolute, secretive, transformative, and fiercely loyal.",
    },
    beejMantra: "ॐ क्रां क्रीं क्रौं सः भौमाय नमः॥",
    vedicRemedy: "सुन्दरकाण्ड का पाठ करें, मंगलवार को हनुमान जी को सिन्दूर व चमेली का तेल अर्पित करें।",
  },
  {
    id: "Dhanu",
    index: 8,
    nameHindi: "धनु राशि",
    nameEnglish: "Sagittarius",
    sanskritName: "धनु",
    symbol: "Archer (धनुष बाण लिए अश्व-मानव)",
    symbolHindi: "धनुर्धर",
    lord: "Jupiter (बृहस्पति / गुरु)",
    lordHindi: "देवगुरु बृहस्पति",
    element: "Fire (अग्नि)",
    modality: "Dwisvabhava (द्विस्वभाव - Dual)",
    varna: "Kshatriya (क्षत्रिय)",
    vashya: "Dvipada / Chatushpada",
    ishtaDevata: "भगवान श्री हरि विष्णु / दत्तात्रेय",
    ishtaDevataMantra: "ॐ नमो भगवते वासुदेवाय",
    luckyNumbers: [3, 9, 1],
    luckyColors: ["पीला (Yellow)", "केसरिया (Saffron)", "सुनहरा (Golden)"],
    luckyDays: ["गुरुवार (Thursday)", "रविवार (Sunday)"],
    luckyGemstone: "पुखराज (Yellow Sapphire)",
    luckyDirection: "पूर्व (East)",
    compatibleRashis: ["मेष (Aries)", "सिंह (Leo)", "तुला (Libra)", "कुम्भ (Aquarius)"],
    incompatibleRashis: ["कन्या (Virgo)", "मिथुन (Gemini)"],
    syllables: ["Ye", "Yo", "Bha", "Bhi", "Bhu", "Dha", "Pha", "Dha", "Bhe"],
    syllablesHindi: ["ये", "यो", "भा", "भी", "भू", "धा", "फा", "ढा", "भे"],
    personalityTraits: {
      strengths: ["आशावादी व ज्ञानी (Philosophical)", "सत्यप्रिय व धर्मनिष्ठ", "स्वतंत्रता प्रेमी व साहसी", "उदार व दयालु"],
      weaknesses: ["अति-उत्साह (Over-enthusiasm)", "अस्पष्ट वचन व मुंहफटपन", "अधीरता"],
      coreNatureHindi: "धनु राशि के जातक धार्मिक, ज्ञानी, सत्यनिष्ठ एवं उच्च आदर्शों वाले होते हैं। ये सदैव ज्ञानार्जन व यात्राओं में रुचि रखते हैं।",
      coreNatureEnglish: "Visionary, optimistic, philosophical, truth-seeking, generous, and freedom-loving.",
    },
    beejMantra: "ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः॥",
    vedicRemedy: "प्रतिदिन विष्णु सहस्रनाम का पाठ करें, गुरुवार को चने की दाल व केले के वृक्ष का पूजन करें।",
  },
  {
    id: "Makara",
    index: 9,
    nameHindi: "मकर राशि",
    nameEnglish: "Capricorn",
    sanskritName: "मकर",
    symbol: "Sea-Goat (मृगास्य मगरमच्छ)",
    symbolHindi: "मकर",
    lord: "Saturn (शनि)",
    lordHindi: "शनि देव",
    element: "Earth (पृथ्वी)",
    modality: "Chara (चर - Movable)",
    varna: "Vaishya (वैश्य)",
    vashya: "Jalachara (जलचर)",
    ishtaDevata: "भगवान शिव / भगवान शनिदेव",
    ishtaDevataMantra: "ॐ शं शनैश्चराय नमः",
    luckyNumbers: [8, 4, 6],
    luckyColors: ["नीला (Blue)", "काला (Black)", "गहरा भूरा (Dark Brown)"],
    luckyDays: ["शनिवार (Saturday)", "शुक्रवार (Friday)"],
    luckyGemstone: "नीलम (Blue Sapphire) / जामुनिया (Amethyst)",
    luckyDirection: "दक्षिण (South)",
    compatibleRashis: ["वृषभ (Taurus)", "कन्या (Virgo)", "वृश्चिक (Scorpio)", "मीन (Pisces)"],
    incompatibleRashis: ["मेष (Aries)", "कर्क (Cancer)"],
    syllables: ["Bho", "Ja", "Ji", "Khi", "Khu", "Khe", "Kho", "Ga", "Gi"],
    syllablesHindi: ["भो", "जा", "जी", "खी", "खू", "खे", "खो", "गा", "गी"],
    personalityTraits: {
      strengths: ["अथक परिश्रमी व अनुशासित", "धैर्यवान व व्यावहारिक", "रणनीतिक योजनाकार", "विश्वसनीय व गम्भीर"],
      weaknesses: ["निराशावादी प्रवृत्ति (Pessimistic)", "कंजूसी", "अत्यधिक कठोरता"],
      coreNatureHindi: "मकर राशि के जातक कर्मठ, अनुशासित, व्यावहारिक एवं महत्वाकांक्षी होते हैं। ये धैर्यपूर्वक अपने लक्ष्य की ओर निरंतर बढ़ते हैं।",
      coreNatureEnglish: "Disciplined, hardworking, strategic, highly patient, ambitious, and grounded in reality.",
    },
    beejMantra: "ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः॥",
    vedicRemedy: "शनिवार को पीपल के वृक्ष के नीचे सरसों के तेल का दीपक जलाएं और शनि चालीसा का पाठ करें।",
  },
  {
    id: "Kumbha",
    index: 10,
    nameHindi: "कुम्भ राशि",
    nameEnglish: "Aquarius",
    sanskritName: "कुम्भ",
    symbol: "Water-Bearer (कुम्भ / घड़ा लिए पुरुष)",
    symbolHindi: "घड़ा / कुम्भ",
    lord: "Saturn (शनि)",
    lordHindi: "शनि देव",
    element: "Air (वायु)",
    modality: "Sthira (स्थिर - Fixed)",
    varna: "Shudra (शूद्र)",
    vashya: "Dvipada (द्विपद)",
    ishtaDevata: "भगवान शिव (महाकाल) / माँ दुर्गा",
    ishtaDevataMantra: "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्",
    luckyNumbers: [8, 4, 7],
    luckyColors: ["नीला (Navy Blue)", "जामुनी (Purple)", "आसमानी (Electric Blue)"],
    luckyDays: ["शनिवार (Saturday)", "बुधवार (Wednesday)"],
    luckyGemstone: "नीलम (Blue Sapphire) / लाजवर्त (Lapis Lazuli)",
    luckyDirection: "पश्चिम (West)",
    compatibleRashis: ["मिथुन (Gemini)", "तुला (Libra)", "मेष (Aries)", "धनु (Sagittarius)"],
    incompatibleRashis: ["वृषभ (Taurus)", "वृश्चिक (Scorpio)"],
    syllables: ["Gu", "Ge", "Go", "Sa", "Si", "Su", "Se", "So", "Da"],
    syllablesHindi: ["गू", "गे", "गो", "सा", "सी", "सू", "से", "सो", "दा"],
    personalityTraits: {
      strengths: ["मानवतावादी व दूरदर्शी (Visionary)", "मौलिक व नवाचारी (Innovative)", "स्वतंत्र विचारक", "सच्चे मित्र"],
      weaknesses: ["भावनात्मक दूरी (Detached)", "विद्रोही स्वभाव", "अति-अड़ियलपन"],
      coreNatureHindi: "कुम्भ राशि के जातक मानवतावादी, दार्शनिक, मौलिक एवं स्वतंत्र विचारों वाले होते हैं। समाज कल्याण में इनकी गहरी रुचि होती है।",
      coreNatureEnglish: "Humanitarian, visionary, innovative, intellectually detached, and progressive.",
    },
    beejMantra: "ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः॥",
    vedicRemedy: "भगवान शिव का रुद्राभिषेक करें, शनिवार को काले तिल व उड़द का दान करें और असहायों की सेवा करें।",
  },
  {
    id: "Meena",
    index: 11,
    nameHindi: "मीन राशि",
    nameEnglish: "Pisces",
    sanskritName: "मीन",
    symbol: "Two Fishes (परस्पर विपरीत तैरती दो मछलियाँ)",
    symbolHindi: "मीन / मत्स्य",
    lord: "Jupiter (बृहस्पति / गुरु)",
    lordHindi: "देवगुरु बृहस्पति",
    element: "Water (जल)",
    modality: "Dwisvabhava (द्विस्वभाव - Dual)",
    varna: "Brahmin (ब्राह्मण)",
    vashya: "Jalachara (जलचर)",
    ishtaDevata: "भगवान श्री हरि विष्णु (नारायण)",
    ishtaDevataMantra: "ॐ नमो नारायणाय",
    luckyNumbers: [3, 7, 9],
    luckyColors: ["पीला (Yellow)", "केसरिया (Saffron)", "समुद्री हरा (Sea Green)"],
    luckyDays: ["गुरुवार (Thursday)", "सोमवार (Monday)"],
    luckyGemstone: "पुखराज (Yellow Sapphire)",
    luckyDirection: "उत्तर (North)",
    compatibleRashis: ["कर्क (Cancer)", "वृश्चिक (Scorpio)", "वृषभ (Taurus)", "मकर (Capricorn)"],
    incompatibleRashis: ["मिथुन (Gemini)", "कन्या (Virgo)"],
    syllables: ["Di", "Du", "Tha", "Jha", "Jna", "De", "Do", "Cha", "Chi"],
    syllablesHindi: ["दी", "दू", "थ", "झ", "ञ", "दे", "दो", "चा", "ची"],
    personalityTraits: {
      strengths: ["अत्यन्त दयालु व परोपकारी", "आध्यात्मिक व अन्तर्ज्ञानी", "कलात्मक व कल्पनाशील", "क्षमाशील"],
      weaknesses: ["अति-संवेदनशीलता", "काल्पनिक दुनिया में खोना (Escapism)", "निर्णय में कमजोरी"],
      coreNatureHindi: "मीन राशि के जातक दयालु, संवेदनशील, आध्यात्मिक एवं परोपकारी होते हैं। ये दूसरों के दुःख को अपना समझकर सहायता करते हैं।",
      coreNatureEnglish: "Compassionate, spiritually inclined, imaginative, deeply intuitive, and unconditionally empathetic.",
    },
    beejMantra: "ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः॥",
    vedicRemedy: "गुरुवार को भगवान सत्यनारायण की कथा सुनें, केसर का तिलक लगाएं और पीले वस्त्र धारण करें।",
  },
];

// ──────────────────────────────────────────
// 2. NAME AKSHARA TO RASHI FINDER
// ──────────────────────────────────────────

export function findRashiByName(name: string): RashiProfile | null {
  if (!name || !name.trim()) return null;
  const cleanName = name.trim().toLowerCase();

  // Check English prefix match
  for (const rashi of RASHI_DATABASE) {
    for (const syl of rashi.syllables) {
      if (cleanName.startsWith(syl.toLowerCase())) {
        return rashi;
      }
    }
  }

  // Check Devanagari prefix match
  for (const rashi of RASHI_DATABASE) {
    for (const sylHindi of rashi.syllablesHindi) {
      if (name.startsWith(sylHindi)) {
        return rashi;
      }
    }
  }

  // Default fallback matching by first 2 chars
  return RASHI_DATABASE[0];
}

// ──────────────────────────────────────────
// 3. ASTRONOMICAL BIRTH RASHI CALCULATOR
// ──────────────────────────────────────────

export function calculateRashiFromBirth(input: BirthInput): RashiCalculationResult {
  const kundli = generateKundli(input);

  const moon = kundli.d1.planets.find((p) => p.graha === "Moon")!;
  const sun = kundli.d1.planets.find((p) => p.graha === "Sun")!;
  const asc = kundli.d1.ascendant;

  const moonRashi = RASHI_DATABASE[moon.rashiIndex];
  const sunRashi = RASHI_DATABASE[sun.rashiIndex];
  const lagnaRashi = RASHI_DATABASE[asc.rashiIndex];

  // Avakahada
  const avakahada = {
    varna: kundli.avakahada.varna,
    vashya: kundli.avakahada.vashya,
    yoni: kundli.avakahada.yoni,
    gana: kundli.avakahada.gana,
    nadi: kundli.avakahada.nadi,
    tattva: moonRashi.element,
    rashiLord: moonRashi.lordHindi,
  };

  // Determine Saturn Sade Sati status (Assuming current Saturn is in Aquarius/Pisces sidereal)
  // Saturn currently in Kumbha (Aquarius - 10) transitioning to Meena (Pisces - 11)
  const currentSaturnRashiIdx = 10; // Aquarius
  const diff = (moon.rashiIndex - currentSaturnRashiIdx + 12) % 12;

  let sadeSatiStatus: RashiCalculationResult["sadeSatiStatus"] = {
    isActive: false,
    phase: "None (मुक्त)",
    descriptionHindi: "वर्तमान में आपकी राशि पर शनि की साढ़ेसाती या ढैया का कोई प्रतिकूल प्रभाव नहीं है।",
    descriptionEnglish: "Currently your Moon sign is completely free from Shani Sade Sati or Dhaiya.",
  };

  if (diff === 11) {
    sadeSatiStatus = {
      isActive: true,
      phase: "उदय (1st Phase - Setting in)",
      descriptionHindi: "आपकी राशि पर शनि की साढ़ेसाती का प्रथम चरण (उदय काल) प्रभावी है। मानसिक सजगता व धैर्य अपेक्षित है।",
      descriptionEnglish: "1st Phase of Shani Sade Sati is active. Patience and spiritual contemplation are beneficial.",
    };
  } else if (diff === 0) {
    sadeSatiStatus = {
      isActive: true,
      phase: "शिखर (2nd Phase - Peak / Janma)",
      descriptionHindi: "आपकी राशि पर शनि की साढ़ेसाती का द्वितीय चरण (जन्म शनि / शिखर) चल रहा है। कर्मशुद्धि व शनि उपासना करें।",
      descriptionEnglish: "Peak (2nd) Phase of Shani Sade Sati is active. Strict discipline and ethical conduct are paramount.",
    };
  } else if (diff === 1) {
    sadeSatiStatus = {
      isActive: true,
      phase: "अस्त (3rd Phase - Receding)",
      descriptionHindi: "आपकी राशि पर साढ़ेसाती का तृतीय चरण (अस्त काल / उतरती साढ़ेसाती) है। पुराने कष्टों से मुक्ति का समय है।",
      descriptionEnglish: "Final (3rd) Phase of Shani Sade Sati is receding, paving way for relief and stabilization.",
    };
  } else if (diff === 3 || diff === 7) {
    sadeSatiStatus = {
      isActive: true,
      phase: "ढैया (Kantaka/Ashtama Dhaiya)",
      descriptionHindi: "आपकी राशि पर शनि की लघु कल्याणी ढैया (Kantaka / Ashtama Shani) प्रभावी है।",
      descriptionEnglish: "Shani Dhaiya (Small 2.5-year cycle) is active.",
    };
  }

  return {
    moonRashi,
    sunRashi,
    lagnaRashi,
    moonLongitude: moon.longitudeSidereal,
    moonDegreesInSign: moon.degreesInRashi,
    nakshatra: {
      name: moon.nakshatra,
      index: moon.nakshatraIndex,
      pada: moon.pada,
      lord: kundli.birthNakshatra.lord,
      deity: "वैदिक देव",
      symbol: "पवित्र प्रतीक",
    },
    avakahada,
    sadeSatiStatus,
    kundliResult: kundli,
  };
}
