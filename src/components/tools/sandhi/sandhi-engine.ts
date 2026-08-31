/**
 * Paninian Sanskrit Sandhi Engine
 * --------------------------------
 * Comprehensive rule-based engine for Sanskrit Sandhi splitting (विच्छेद)
 * and combination (संयोजन) covering Svara (अच्), Vyanjana (हल्), and Visarga Sandhis.
 */

export type SandhiCategory = "svara" | "vyanjana" | "visarga";

export interface SandhiRule {
  id: string;
  category: SandhiCategory;
  nameSanskrit: string;
  nameEnglish: string;
  sutra: string;
  ruleExplanation: string;
  patternFormula: string;
}

export interface SandhiPreset {
  id: string;
  compound: string;
  part1: string;
  part2: string;
  category: SandhiCategory;
  sandhiType: string;
  sutra: string;
  meaningHindi: string;
  meaningEnglish: string;
}

export interface SplitCandidate {
  word1: string;
  word2: string;
  sandhiType: string;
  category: SandhiCategory;
  sutra: string;
  explanation: string;
  confidence: number;
}

export interface SplitResult {
  originalInput: string;
  candidates: SplitCandidate[];
  exactMatch: SandhiPreset | null;
}

export interface JoinResult {
  word1: string;
  word2: string;
  joinedWord: string;
  sandhiType: string;
  category: SandhiCategory;
  sutra: string;
  explanation: string;
}

// ──────────────────────────────────────────
// 1. PANINIAN SANDHI RULES
// ──────────────────────────────────────────

export const SANDHI_RULES: Record<string, SandhiRule> = {
  dirgha: {
    id: "dirgha",
    category: "svara",
    nameSanskrit: "दीर्घ सन्धि",
    nameEnglish: "Dirgha Sandhi (Vowel Lengthening)",
    sutra: "अकः सवर्णे दीर्घः (६.१.१०१)",
    ruleExplanation: "ह्रस्व या दीर्घ अ, इ, उ, ऋ के बाद यदि समान स्वर आए तो दोनों मिलकर दीर्घ हो जाते हैं।",
    patternFormula: "अ/आ + अ/आ = आ | इ/ई + इ/ई = ई | उ/ऊ + उ/ऊ = ऊ | ऋ + ऋ = ॠ",
  },
  guna: {
    id: "guna",
    category: "svara",
    nameSanskrit: "गुण सन्धि",
    nameEnglish: "Guna Sandhi",
    sutra: "आद्गुणः (६.१.८७)",
    ruleExplanation: "अ या आ के बाद इ/ई आए तो 'ए', उ/ऊ आए तो 'ओ', तथा ऋ आए तो 'अर्' हो जाता है।",
    patternFormula: "अ/आ + इ/ई = ए | अ/आ + उ/ऊ = ओ | अ/आ + ऋ = अर्",
  },
  vriddhi: {
    id: "vriddhi",
    category: "svara",
    nameSanskrit: "वृद्धि सन्धि",
    nameEnglish: "Vriddhi Sandhi",
    sutra: "वृद्धिरेचि (६.१.८८)",
    ruleExplanation: "अ या आ के बाद ए/ऐ आए तो 'ऐ', और ओ/औ आए तो 'औ' हो जाता है।",
    patternFormula: "अ/आ + ए/ऐ = ऐ | अ/आ + ओ/औ = औ",
  },
  yan: {
    id: "yan",
    category: "svara",
    nameSanskrit: "यण् सन्धि",
    nameEnglish: "Yan Sandhi (Semivowel substitution)",
    sutra: "इको यणचि (६.१.७७)",
    ruleExplanation: "इ/ई का 'य', उ/ऊ का 'व', ऋ का 'र', तथा ऌ का 'ल' हो जाता है यदि बाद में कोई असमान स्वर हो।",
    patternFormula: "इ/ई + असमान स्वर = य् | उ/ऊ + असमान स्वर = व् | ऋ + असमान स्वर = र्",
  },
  ayadi: {
    id: "ayadi",
    category: "svara",
    nameSanskrit: "अयादि सन्धि",
    nameEnglish: "Ayadi Sandhi",
    sutra: "एचोऽयवायावः (६.१.७८)",
    ruleExplanation: "ए का 'अय', ऐ का 'आय', ओ का 'अव', तथा औ का 'आव' हो जाता है यदि बाद में कोई स्वर हो।",
    patternFormula: "ए = अय् | ऐ = आय् | ओ = अव् | औ = आव्",
  },
  purvarupa: {
    id: "purvarupa",
    category: "svara",
    nameSanskrit: "पूर्वरूप सन्धि",
    nameEnglish: "Purvarupa Sandhi (Avagraha insertion)",
    sutra: "एङः पदान्तादति (६.१.१०९)",
    ruleExplanation: "पद के अन्त में स्थित 'ए' या 'ओ' के बाद यदि ह्रस्व 'अ' आए तो 'अ' का लोप होकर 'ऽ' (अवग्रह) बन जाता है।",
    patternFormula: "ए/ओ + अ = एऽ / ओऽ",
  },
  schutva: {
    id: "schutva",
    category: "vyanjana",
    nameSanskrit: "श्चुत्व सन्धि",
    nameEnglish: "Schutva Sandhi (Palatalization)",
    sutra: "स्तोः श्चुना श्चुः (८.४.४०)",
    ruleExplanation: "सकार या त-वर्ग का शकार या च-वर्ग के साथ योग होने पर स का 'श' और त-वर्ग का 'च-वर्ग' हो जाता है।",
    patternFormula: "त् + च् = च्च् | त् + श् = च्छ् | स् + च् = श्च्",
  },
  jashtva: {
    id: "jashtva",
    category: "vyanjana",
    nameSanskrit: "जश्त्व सन्धि (तृतीय वर्ण परिवर्तन)",
    nameEnglish: "Jashtva Sandhi (Voicing)",
    sutra: "झलां जशोऽन्ते (८.२.३९)",
    ruleExplanation: "वर्ग के प्रथम वर्ण (क्, च्, ट्, त्, प्) के बाद कोई स्वर या घोष व्यंजन आए तो वह अपने वर्ग के तीसरे वर्ण (ग्, ज्, ड्, द्, ब्) में बदल जाता है।",
    patternFormula: "क् -> ग् | च् -> ज् | ट् -> ड् | त् -> द् | प् -> ब्",
  },
  anunasika: {
    id: "anunasika",
    category: "vyanjana",
    nameSanskrit: "अनुनासिक सन्धि",
    nameEnglish: "Anunasika Sandhi (Nasal assimilation)",
    sutra: "यरोऽनुनासिकेऽनुनासिको वा (८.४.४५)",
    ruleExplanation: "वर्ग के प्रथम वर्ण के बाद यदि कोई अनुनासिक वर्ण (न्, म्) आए तो प्रथम वर्ण अपने वर्ग के पंचम वर्ण में बदल जाता है।",
    patternFormula: "त् + म् = न्म | त् + न् = न्न | क् + म् = ङ्म्",
  },
  anusvara: {
    id: "anusvara",
    category: "vyanjana",
    nameSanskrit: "अनुस्वार सन्धि",
    nameEnglish: "Anusvara Sandhi",
    sutra: "मोऽनुस्वारः (८.३.२३)",
    ruleExplanation: "पदान्त 'म्' के बाद यदि कोई व्यंजन आए तो 'म्' का अनुस्वार (ं) हो जाता है।",
    patternFormula: "म् + व्यंजन = ं",
  },
  utva: {
    id: "utva",
    category: "visarga",
    nameSanskrit: "उत्व विसर्ग सन्धि",
    nameEnglish: "Utva Visarga Sandhi",
    sutra: "अतो रोरप्लुतादप्लुते (६.१.११३) / हशि च (६.१.११४)",
    ruleExplanation: "ह्रस्व 'अ' के बाद स्थित विसर्ग (ः) के आगे यदि 'अ' या कोई घोष व्यंजन आए तो विसर्ग का 'ओ' हो जाता है।",
    patternFormula: "अः + अ = ओऽ | अः + घोष = ओ",
  },
  satva: {
    id: "satva",
    category: "visarga",
    nameSanskrit: "सत्व विसर्ग सन्धि",
    nameEnglish: "Satva Visarga Sandhi (Sibilant substitution)",
    sutra: "विसर्जनीयस्य सः (८.३.३४)",
    ruleExplanation: "विसर्ग के बाद यदि च्/छ् आए तो 'श्', ट्/ठ् आए तो 'ष्', तथा त्/थ् आए तो 'स्' हो जाता है।",
    patternFormula: "ः + च् = श्च् | ः + त् = स्त् | ः + ट् = ष्ट्",
  },
  rutva: {
    id: "rutva",
    category: "visarga",
    nameSanskrit: "रुत्व विसर्ग सन्धि",
    nameEnglish: "Rutva Visarga Sandhi",
    sutra: "ससजुषो रुः (८.२.६६)",
    ruleExplanation: "अ/आ को छोड़कर अन्य स्वर के बाद स्थित विसर्ग के आगे यदि कोई स्वर या घोष व्यंजन आए तो विसर्ग का 'र्' हो जाता है।",
    patternFormula: "इः/उः + स्वर/घोष = र् (उदा. निः + धन = निर्धन)",
  },
  lopa: {
    id: "lopa",
    category: "visarga",
    nameSanskrit: "विसर्ग लोप सन्धि",
    nameEnglish: "Visarga Lopa (Elision)",
    sutra: "भोभगोअघोअपूर्वस्य योऽशि (८.३.१७) / एतत्तदोः सुलोपोऽकोरनञ्पे (६.१.१३२)",
    ruleExplanation: "विशेष परिस्थितियों में विसर्ग का लोप हो जाता है (उदा. सः + गच्छति = स गच्छति)।",
    patternFormula: "सः/एषः + व्यंजन = स/एष",
  },
};

// ──────────────────────────────────────────
// 2. EXTENSIVE CLASSICAL SANDHI PRESETS DATABASE
// ──────────────────────────────────────────

export const SANDHI_PRESETS: SandhiPreset[] = [
  // Svara - Dirgha
  {
    id: "dharmakshetre",
    compound: "धर्मक्षेत्रे",
    part1: "धर्म",
    part2: "क्षेत्रे",
    category: "svara",
    sandhiType: "समास पद / अच् सन्धि",
    sutra: "प्रातिपदिक समास",
    meaningHindi: "धर्म के क्षेत्र (कुरुक्षेत्र) में",
    meaningEnglish: "In the field of sacred righteousness",
  },
  {
    id: "himalaya",
    compound: "हिमालयः",
    part1: "हिम",
    part2: "आलयः",
    category: "svara",
    sandhiType: "दीर्घ सन्धि",
    sutra: "अकः सवर्णे दीर्घः",
    meaningHindi: "बर्फ का घर (पर्वतराज हिमालय)",
    meaningEnglish: "Abode of snow (The Himalayas)",
  },
  {
    id: "vidyalaya",
    compound: "विद्यालयः",
    part1: "विद्या",
    part2: "आलयः",
    category: "svara",
    sandhiType: "दीर्घ सन्धि",
    sutra: "अकः सवर्णे दीर्घः",
    meaningHindi: "विद्या का मन्दिर / स्कूल",
    meaningEnglish: "Abode of learning / School",
  },
  {
    id: "ravindrah",
    compound: "रवीन्द्रः",
    part1: "रवि",
    part2: "इन्द्रः",
    category: "svara",
    sandhiType: "दीर्घ सन्धि",
    sutra: "अकः सवर्णे दीर्घः",
    meaningHindi: "सूर्य",
    meaningEnglish: "Lord of the Sun",
  },
  {
    id: "gurupadeshah",
    compound: "गुरूपदेशः",
    part1: "गुरु",
    part2: "उपदेशः",
    category: "svara",
    sandhiType: "दीर्घ सन्धि",
    sutra: "अकः सवर्णे दीर्घः",
    meaningHindi: "गुरु का उपदेश",
    meaningEnglish: "Teacher's instruction",
  },

  // Svara - Guna
  {
    id: "devendrah",
    compound: "देवेन्द्रः",
    part1: "देव",
    part2: "इन्द्रः",
    category: "svara",
    sandhiType: "गुण सन्धि",
    sutra: "आद्गुणः",
    meaningHindi: "देवताओं के राजा (इन्द्र)",
    meaningEnglish: "King of the Devas (Indra)",
  },
  {
    id: "suryodayah",
    compound: "सूर्योदयः",
    part1: "सूर्य",
    part2: "उदयः",
    category: "svara",
    sandhiType: "गुण सन्धि",
    sutra: "आद्गुणः",
    meaningHindi: "सूर्य का उदय होना",
    meaningEnglish: "Sunrise",
  },
  {
    id: "maharshi",
    compound: "महर्षिः",
    part1: "महा",
    part2: "ऋषिः",
    category: "svara",
    sandhiType: "गुण सन्धि",
    sutra: "आद्गुणः",
    meaningHindi: "महान ऋषि",
    meaningEnglish: "Great sage / Seer",
  },
  {
    id: "rameshah",
    compound: "रमेशः",
    part1: "रमा",
    part2: "ईशः",
    category: "svara",
    sandhiType: "गुण सन्धि",
    sutra: "आद्गुणः",
    meaningHindi: "रमा (लक्ष्मी) के स्वामी (विष्णु)",
    meaningEnglish: "Lord of Rama (Vishnu)",
  },

  // Svara - Vriddhi
  {
    id: "sadaiva",
    compound: "सदैव",
    part1: "सदा",
    part2: "एव",
    category: "svara",
    sandhiType: "वृद्धि सन्धि",
    sutra: "वृद्धिरेचि",
    meaningHindi: "हमेशा / सर्वदा",
    meaningEnglish: "Always / Forever",
  },
  {
    id: "ekaika",
    compound: "एकैकम्",
    part1: "एक",
    part2: "एकम्",
    category: "svara",
    sandhiType: "वृद्धि सन्धि",
    sutra: "वृद्धिरेचि",
    meaningHindi: "एक-एक करके",
    meaningEnglish: "One by one",
  },
  {
    id: "mahaushadhi",
    compound: "महौषधिः",
    part1: "महा",
    part2: "ओषधिः",
    category: "svara",
    sandhiType: "वृद्धि सन्धि",
    sutra: "वृद्धिरेचि",
    meaningHindi: "दिव्य महान औषधि",
    meaningEnglish: "Great medicinal herb",
  },

  // Svara - Yan
  {
    id: "ityadi",
    compound: "इत्यादि",
    part1: "इति",
    part2: "आदि",
    category: "svara",
    sandhiType: "यण् सन्धि",
    sutra: "इको यणचि",
    meaningHindi: "इत्यादि / और भी",
    meaningEnglish: "Et cetera / and so forth",
  },
  {
    id: "yadyapi",
    compound: "यद्यपि",
    part1: "यदि",
    part2: "अपि",
    category: "svara",
    sandhiType: "यण् सन्धि",
    sutra: "इको यणचि",
    meaningHindi: "हालाँकि / अगरचे",
    meaningEnglish: "Although / Even if",
  },
  {
    id: "swagatam",
    compound: "स्वागतम्",
    part1: "सु",
    part2: "आगतम्",
    category: "svara",
    sandhiType: "यण् सन्धि",
    sutra: "इको यणचि",
    meaningHindi: "शुभ आगमन / वेलकम",
    meaningEnglish: "Welcome / Auspicious arrival",
  },
  {
    id: "matragya",
    compound: "मात्राज्ञा",
    part1: "मातृ",
    part2: "आज्ञा",
    category: "svara",
    sandhiType: "यण् सन्धि",
    sutra: "इको यणचि",
    meaningHindi: "माता की आज्ञा",
    meaningEnglish: "Mother's command",
  },

  // Svara - Ayadi
  {
    id: "nayanam",
    compound: "नयनम्",
    part1: "ने",
    part2: "अनम्",
    category: "svara",
    sandhiType: "अयादि सन्धि",
    sutra: "एचोऽयवायावः",
    meaningHindi: "नेत्र / आँख",
    meaningEnglish: "Eye / Vision",
  },
  {
    id: "pavakah",
    compound: "पावकः",
    part1: "पौ",
    part2: "अकः",
    category: "svara",
    sandhiType: "अयादि सन्धि",
    sutra: "एचोऽयवायावः",
    meaningHindi: "अग्नि / पवित्र करने वाला",
    meaningEnglish: "Fire / The purifier",
  },
  {
    id: "bhavanam",
    compound: "भवनम्",
    part1: "भो",
    part2: "अनम्",
    category: "svara",
    sandhiType: "अयादि सन्धि",
    sutra: "एचोऽयवायावः",
    meaningHindi: "घर / महल",
    meaningEnglish: "Mansion / Building",
  },

  // Svara - Purvarupa
  {
    id: "hare-ava",
    compound: "हरेऽव",
    part1: "हरे",
    part2: "अव",
    category: "svara",
    sandhiType: "पूर्वरूप सन्धि",
    sutra: "एङः पदान्तादति",
    meaningHindi: "हे हरि! रक्षा करो",
    meaningEnglish: "O Hari, protect me",
  },
  {
    id: "kopi",
    compound: "कोऽपि",
    part1: "कः",
    part2: "अपि",
    category: "visarga",
    sandhiType: "उत्व विसर्ग एवं पूर्वरूप",
    sutra: "अतो रोरप्लुतादप्लुते",
    meaningHindi: "कोई भी",
    meaningEnglish: "Anyone / Someone",
  },
  {
    id: "shivo-ham",
    compound: "शिवोऽहम्",
    part1: "शिवः",
    part2: "अहम्",
    category: "visarga",
    sandhiType: "उत्व विसर्ग एवं पूर्वरूप",
    sutra: "अतो रोरप्लुतादप्लुते",
    meaningHindi: "मैं शिवस्वरूप हूँ",
    meaningEnglish: "I am Shiva (pure consciousness)",
  },

  // Vyanjana Sandhis
  {
    id: "sajjana",
    compound: "सज्जनः",
    part1: "सत्",
    part2: "जनः",
    category: "vyanjana",
    sandhiType: "श्चुत्व सन्धि",
    sutra: "स्तोः श्चुना श्चुः",
    meaningHindi: "सत्पुरुष / अच्छा मनुष्य",
    meaningEnglish: "Noble / Good person",
  },
  {
    id: "ucchvasa",
    compound: "उच्छ्वासः",
    part1: "उत्",
    part2: "श्वासः",
    category: "vyanjana",
    sandhiType: "श्चुत्व एवं छत्व सन्धि",
    sutra: "शश्छोऽटि",
    meaningHindi: "गहरी श्वास",
    meaningEnglish: "Exhalation / Breath",
  },
  {
    id: "jagadishah",
    compound: "जगदीशः",
    part1: "जगत्",
    part2: "ईशः",
    category: "vyanjana",
    sandhiType: "जश्त्व सन्धि",
    sutra: "झलां जशोऽन्ते",
    meaningHindi: "संसार के स्वामी (परमात्मा)",
    meaningEnglish: "Lord of the Universe",
  },
  {
    id: "digambarah",
    compound: "दिगम्बरः",
    part1: "दिक्",
    part2: "अम्बरः",
    category: "vyanjana",
    sandhiType: "जश्त्व सन्धि",
    sutra: "झलां जशोऽन्ते",
    meaningHindi: "दिशाएं ही जिसके वस्त्र हैं (शिव/जैन मुनि)",
    meaningEnglish: "Clothed in directions (Lord Shiva)",
  },
  {
    id: "sanmati",
    compound: "सन्मतिः",
    part1: "सत्",
    part2: "मतिः",
    category: "vyanjana",
    sandhiType: "अनुनासिक सन्धि",
    sutra: "यरोऽनुनासिकेऽनुनासिको वा",
    meaningHindi: "सद्बुद्धि / श्रेष्ठ बुद्धि",
    meaningEnglish: "Noble intellect",
  },
  {
    id: "vangunmayam",
    compound: "वाङ्मयम्",
    part1: "वाक्",
    part2: "मयम्",
    category: "vyanjana",
    sandhiType: "अनुनासिक सन्धि",
    sutra: "यरोऽनुनासिकेऽनुनासिको वा",
    meaningHindi: "साहित्य / वाणी-संसार",
    meaningEnglish: "Literature / Sacred corpus",
  },

  // Visarga Sandhis
  {
    id: "namastasmai",
    compound: "नमस्तस्मै",
    part1: "नमः",
    part2: "तस्मै",
    category: "visarga",
    sandhiType: "सत्व विसर्ग सन्धि",
    sutra: "विसर्जनीयस्य सः",
    meaningHindi: "उन (परमात्मा) को नमस्कार",
    meaningEnglish: "Salutations unto Him",
  },
  {
    id: "manobalam",
    compound: "मनोबलम्",
    part1: "मनः",
    part2: "बलम्",
    category: "visarga",
    sandhiType: "उत्व विसर्ग सन्धि",
    sutra: "हशि च",
    meaningHindi: "मन की शक्ति / आत्मबल",
    meaningEnglish: "Mental strength / Willpower",
  },
  {
    id: "nirdhana",
    compound: "निर्धनः",
    part1: "निः",
    part2: "धनः",
    category: "visarga",
    sandhiType: "रुत्व विसर्ग सन्धि",
    sutra: "ससजुषो रुः",
    meaningHindi: "धनहीन / दरिद्र",
    meaningEnglish: "Poor / Destitute",
  },
  {
    id: "durlabha",
    compound: "दुर्लभः",
    part1: "दुः",
    part2: "लभः",
    category: "visarga",
    sandhiType: "रुत्व विसर्ग सन्धि",
    sutra: "ससजुषो रुः",
    meaningHindi: "कठिनाई से प्राप्त होने वाला",
    meaningEnglish: "Rare / Hard to obtain",
  },
];

// ──────────────────────────────────────────
// 3. RULE-BASED SPLITTING & JOINING
// ──────────────────────────────────────────

/**
 * Split a Sanskrit compound word using dictionary matching & Paninian heuristic patterns
 */
export function splitCompoundWord(input: string): SplitResult {
  const clean = input.trim();
  if (!clean) {
    return { originalInput: "", candidates: [], exactMatch: null };
  }

  // 1. Direct Preset Check
  const exact = SANDHI_PRESETS.find(
    (p) =>
      p.compound === clean ||
      p.compound.replace(/ः/g, "") === clean.replace(/ः/g, "") ||
      p.id.toLowerCase() === clean.toLowerCase(),
  );

  const candidates: SplitCandidate[] = [];

  if (exact) {
    candidates.push({
      word1: exact.part1,
      word2: exact.part2,
      sandhiType: exact.sandhiType,
      category: exact.category,
      sutra: exact.sutra,
      explanation: `${exact.meaningHindi} (${exact.meaningEnglish})`,
      confidence: 100,
    });
  }

  // 2. Heuristic Paninian Rule Check
  // Purvarupa / Avagraha (ऽ)
  if (clean.includes("ऽ")) {
    const parts = clean.split("ऽ");
    if (parts.length === 2) {
      candidates.push({
        word1: parts[0],
        word2: "अ" + parts[1],
        sandhiType: "पूर्वरूप सन्धि",
        category: "svara",
        sutra: SANDHI_RULES.purvarupa.sutra,
        explanation: SANDHI_RULES.purvarupa.ruleExplanation,
        confidence: 95,
      });
    }
  }

  // Schutva check (ज्ज, च्च, च्छ, श्च)
  if (/ज्ज्|च्च|च्छ|श्च/.test(clean)) {
    const match = clean.match(/(.+?)(ज्ज|च्च|च्छ|श्च)(.*)/);
    if (match) {
      const prefix = match[1];
      const middle = match[2];
      const suffix = match[3];

      let w1 = prefix + "त्";
      let w2 = (middle === "ज्ज्" ? "ज" : middle === "च्छ" ? "श" : "च") + suffix;

      candidates.push({
        word1: w1,
        word2: w2,
        sandhiType: "श्चुत्व व्यञ्जन सन्धि",
        category: "vyanjana",
        sutra: SANDHI_RULES.schutva.sutra,
        explanation: SANDHI_RULES.schutva.ruleExplanation,
        confidence: 88,
      });
    }
  }

  // Jashtva check (ग्, ज्, ड्, द्, ब् before vowel)
  if (/ग्|ज्|ड्|द्|ब्/.test(clean)) {
    const match = clean.match(/(.+?)(ग|ज|ड|द|ब)(.+)/);
    if (match) {
      const map: Record<string, string> = { ग: "क्", ज: "च्", ड: "ट्", द: "त्", ब: "प्" };
      const w1 = match[1] + (map[match[2]] || "त्");
      const w2 = match[3];
      candidates.push({
        word1: w1,
        word2: w2,
        sandhiType: "जश्त्व व्यञ्जन सन्धि",
        category: "vyanjana",
        sutra: SANDHI_RULES.jashtva.sutra,
        explanation: SANDHI_RULES.jashtva.ruleExplanation,
        confidence: 80,
      });
    }
  }

  // Satva / Visarga check (स्त, ष्ठ, श्च)
  if (/स्त|ष्ठ|श्च/.test(clean) && !candidates.some((c) => c.sandhiType.includes("सत्व"))) {
    const match = clean.match(/(.+?)(स्त|ष्ठ|श्च)(.*)/);
    if (match) {
      const w1 = match[1] + "ः";
      const w2 = match[2].slice(1) + match[3];
      candidates.push({
        word1: w1,
        word2: w2,
        sandhiType: "सत्व विसर्ग सन्धि",
        category: "visarga",
        sutra: SANDHI_RULES.satva.sutra,
        explanation: SANDHI_RULES.satva.ruleExplanation,
        confidence: 78,
      });
    }
  }

  // Dirgha / Guna vowel joins (ा, े, ो, ै, ौ)
  if (/[ाेोैौ]/.test(clean)) {
    const match = clean.match(/(.+?)([ाेोैौ])(.+)/);
    if (match) {
      const sign = match[2];
      let w1 = match[1];
      let w2 = match[3];
      let type = "स्वर सन्धि";
      let sutra = "आद्गुणः / वृद्धिरेचि";

      if (sign === "ा") {
        w1 = match[1];
        w2 = "आ" + match[3];
        type = "दीर्घ सन्धि";
        sutra = SANDHI_RULES.dirgha.sutra;
      } else if (sign === "े") {
        w1 = match[1];
        w2 = "इ" + match[3];
        type = "गुण सन्धि";
        sutra = SANDHI_RULES.guna.sutra;
      } else if (sign === "ो") {
        w1 = match[1] + "ः";
        w2 = match[3];
        type = "उत्व विसर्ग / गुण सन्धि";
        sutra = SANDHI_RULES.utva.sutra;
      }

      candidates.push({
        word1: w1,
        word2: w2,
        sandhiType: type,
        category: "svara",
        sutra,
        explanation: `स्वर सम्मिश्रण रूपान्तरण`,
        confidence: 75,
      });
    }
  }

  return {
    originalInput: clean,
    candidates: candidates.length > 0 ? candidates : [
      {
        word1: clean.slice(0, Math.floor(clean.length / 2)),
        word2: clean.slice(Math.floor(clean.length / 2)),
        sandhiType: "समास / सामान्य पद",
        category: "svara",
        sutra: "पदमध्य विभाजन",
        explanation: "प्राकृतिक पद विभाजन",
        confidence: 50,
      },
    ],
    exactMatch: exact || null,
  };
}

/**
 * Combine two Sanskrit words into a single Sandhi compound
 */
export function joinSandhiWords(w1: string, w2: string): JoinResult {
  const word1 = w1.trim();
  const word2 = w2.trim();

  // Check presets
  const preset = SANDHI_PRESETS.find(
    (p) =>
      (p.part1 === word1 || p.part1.replace(/ः/g, "") === word1.replace(/ः/g, "")) &&
      (p.part2 === word2 || p.part2.replace(/ः/g, "") === word2.replace(/ः/g, "")),
  );

  if (preset) {
    return {
      word1,
      word2,
      joinedWord: preset.compound,
      sandhiType: preset.sandhiType,
      category: preset.category,
      sutra: preset.sutra,
      explanation: `${preset.meaningHindi} (${preset.meaningEnglish})`,
    };
  }

  // Visarga + sibilant / vowel rules
  if (word1.endsWith("ः")) {
    const base = word1.slice(0, -1);
    if (word2.startsWith("अ")) {
      return {
        word1,
        word2,
        joinedWord: base + "ोऽ" + word2.slice(1),
        sandhiType: "उत्व विसर्ग एवं पूर्वरूप सन्धि",
        category: "visarga",
        sutra: "अतो रोरप्लुतादप्लुते (६.१.११३)",
        explanation: "विसर्ग का 'ओ' और 'अ' का अवग्रह 'ऽ' हो गया।",
      };
    }
    if (word2.startsWith("त") || word2.startsWith("थ")) {
      return {
        word1,
        word2,
        joinedWord: base + "स्" + word2,
        sandhiType: "सत्व विसर्ग सन्धि",
        category: "visarga",
        sutra: "विसर्जनीयस्य सः (८.३.३४)",
        explanation: "त्/थ् से पूर्व विसर्ग का 'स्' हो गया।",
      };
    }
    if (word2.startsWith("च") || word2.startsWith("छ")) {
      return {
        word1,
        word2,
        joinedWord: base + "श्" + word2,
        sandhiType: "सत्व विसर्ग सन्धि",
        category: "visarga",
        sutra: "विसर्जनीयस्य सः (८.३.३४)",
        explanation: "च्/छ् से पूर्व विसर्ग का 'श्' हो गया।",
      };
    }
  }

  // Consonant ending (त्)
  if (word1.endsWith("त्")) {
    const base = word1.slice(0, -1);
    if (word2.startsWith("ज")) {
      return {
        word1,
        word2,
        joinedWord: base + "ज्" + word2,
        sandhiType: "श्चुत्व सन्धि",
        category: "vyanjana",
        sutra: "स्तोः श्चुना श्चुः (८.४.४०)",
        explanation: "त् का ज-वर्ग के साथ मिलकर 'ज्' हो गया।",
      };
    }
    if (word2.startsWith("च")) {
      return {
        word1,
        word2,
        joinedWord: base + "च्" + word2,
        sandhiType: "श्चुत्व सन्धि",
        category: "vyanjana",
        sutra: "स्तोः श्चुना श्चुः (८.४.४०)",
        explanation: "त् का 'च्' हो गया।",
      };
    }
    if (word2.startsWith("म") || word2.startsWith("न")) {
      return {
        word1,
        word2,
        joinedWord: base + "न्" + word2,
        sandhiType: "अनुनासिक सन्धि",
        category: "vyanjana",
        sutra: "यरोऽनुनासिकेऽनुनासिको वा (८.४.४५)",
        explanation: "त् का अपने वर्ग का पंचम वर्ण 'न्' हो गया।",
      };
    }
    if (/[अआइईउऊऋएऐओऔ]/.test(word2[0])) {
      return {
        word1,
        word2,
        joinedWord: base + "द्" + word2,
        sandhiType: "जश्त्व सन्धि",
        category: "vyanjana",
        sutra: "झलां जशोऽन्ते (८.२.३९)",
        explanation: "स्वर से पूर्व 'त्' का 'द्' हो गया।",
      };
    }
  }

  // Vowel ending
  if (word1.endsWith("इ") || word1.endsWith("ि")) {
    const base = word1.endsWith("ि") ? word1.slice(0, -1) : word1.slice(0, -1);
    if (word2.startsWith("आ")) {
      return {
        word1,
        word2,
        joinedWord: base + "्या" + word2.slice(1),
        sandhiType: "यण् सन्धि",
        category: "svara",
        sutra: "इको यणचि (६.१.७७)",
        explanation: "इ + आ मिलकर 'या' बन गया।",
      };
    }
  }

  // Default join
  return {
    word1,
    word2,
    joinedWord: word1 + word2,
    sandhiType: "समास / संयोजन",
    category: "svara",
    sutra: "सामान्य पद संयोजन",
    explanation: "दोनों पदों का स्वाभाविक संयोजन।",
  };
}
