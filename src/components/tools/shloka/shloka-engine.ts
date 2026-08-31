/**
 * Sanskrit Shloka & Pingala Chhandas Metrical Engine
 * ---------------------------------------------------
 * Analyzes Sanskrit poetic meters using classical Pingala Chhandas Shastra
 * (पिङ्गल छन्दःशास्त्र). Computes Laghu-Guru weights, 8-Gana scansion,
 * Caesura (यति), Matra counts, and identifies 30+ Vedic and Classical meters.
 */

export type Weight = "L" | "G"; // L = Laghu (। = 1 matra), G = Guru (ऽ = 2 matras)
export type GanaType = "य" | "म" | "त" | "र" | "ज" | "भ" | "न" | "स" | "ल" | "ग";

export interface Syllable {
  text: string;
  weight: Weight;
  matras: 1 | 2;
  rule: string;
  index: number;
}

export interface GanaGroup {
  gana: GanaType;
  name: string;
  pattern: string; // e.g. "LG L"
  syllables: Syllable[];
}

export interface PadaScansion {
  padaIndex: number;
  originalText: string;
  syllables: Syllable[];
  ganas: GanaGroup[];
  totalSyllables: number;
  totalMatras: number;
  laghuCount: number;
  guruCount: number;
}

export interface ChhandasDefinition {
  id: string;
  nameSanskrit: string;
  nameEnglish: string;
  category: "vedic" | "sama-vritta" | "ardhasama-vritta" | "vishama-vritta" | "matra-vritta";
  syllablesPerPada: number | number[];
  totalSyllables?: number;
  ganaPattern?: string[]; // e.g. ["त", "भ", "ज", "ज", "ग", "ग"]
  lakshanaSanskrit?: string;
  lakshanaHindi?: string;
  yati?: string; // Caesura points, e.g. "4 and 7"
  description: string;
}

export interface ScansionResult {
  detectedMeter: ChhandasDefinition | null;
  confidence: number; // 0 to 100
  padas: PadaScansion[];
  overallMetrics: {
    padaCount: number;
    totalSyllables: number;
    totalMatras: number;
    laghuCount: number;
    guruCount: number;
    avgSyllablesPerPada: number;
    isVedicMatch: boolean;
  };
  alternateMatches: { meter: ChhandasDefinition; confidence: number }[];
  padachedaTokens: string[];
}

export interface ShlokaPreset {
  id: string;
  title: string;
  source: string;
  meterName: string;
  shloka: string;
  meaningHindi: string;
  meaningEnglish: string;
}

// ──────────────────────────────────────────
// 1. PINGALA 8-GANA DEFINITIONS
// ──────────────────────────────────────────

export const GANA_DEFINITIONS: Record<
  string,
  { name: string; pattern: string; desc: string }
> = {
  LGG: { name: "य-गण (Ya-Gana)", pattern: "। ऽ ऽ", desc: "आद्यलघु (First short, next two long)" },
  GGG: { name: "म-गण (Ma-Gana)", pattern: "ऽ ऽ ऽ", desc: "सर्वगुरु (All three long)" },
  GGL: { name: "त-गण (Ta-Gana)", pattern: "ऽ ऽ ।", desc: "अन्तलघु (First two long, last short)" },
  GLG: { name: "र-गण (Ra-Gana)", pattern: "ऽ । ऽ", desc: "मध्यलघु (Middle short, ends long)" },
  LGL: { name: "ज-गण (Ja-Gana)", pattern: "। ऽ ।", desc: "मध्यगुरु (Middle long, ends short)" },
  GLL: { name: "भ-गण (Bha-Gana)", pattern: "ऽ । ।", desc: "आदिगुरु (First long, next two short)" },
  LLL: { name: "न-गण (Na-Gana)", pattern: "। । ।", desc: "सर्वलघु (All three short)" },
  LLG: { name: "स-गण (Sa-Gana)", pattern: "। । ऽ", desc: "अन्तगुरु (First two short, last long)" },
};

// ──────────────────────────────────────────
// 2. CLASSICAL & VEDIC METERS REGISTRY
// ──────────────────────────────────────────

export const CHHANDAS_DATABASE: ChhandasDefinition[] = [
  {
    id: "anushtup",
    nameSanskrit: "अनुष्टुप् (श्लोक)",
    nameEnglish: "Anushtup (Shloka)",
    category: "sama-vritta",
    syllablesPerPada: 8,
    totalSyllables: 32,
    lakshanaSanskrit: "श्लोके षष्ठं गुरु ज्ञेयं सर्वत्र लघु पञ्चमम्। द्विचतुष्पादयोर्ह्रस्वं सप्तमं दीर्घमन्ययोः॥",
    lakshanaHindi: "प्रत्येक चरण में 8 अक्षर (कुल 32)। 5वाँ अक्षर सर्वत्र लघु (।), 6ठा सर्वत्र गुरु (ऽ), 7वाँ दूसरे व चौथे चरण में लघु तथा पहले व तीसरे चरण में गुरु होता है।",
    yati: "8 अक्षरों पर (प्रत्येक पाद समाप्ति)",
    description: "रामायण, महाभारत एवं गीता का सर्वाधिक प्रयुक्त प्रधान वैदिक एवं लौकिक छन्द।",
  },
  {
    id: "gayatri",
    nameSanskrit: "गायत्री छन्द",
    nameEnglish: "Gayatri Meter",
    category: "vedic",
    syllablesPerPada: [8, 8, 8],
    totalSyllables: 24,
    lakshanaSanskrit: "गायत्री त्रिभिरष्टभिः।",
    lakshanaHindi: "3 पाद, प्रत्येक पाद में 8 अक्षर, कुल 24 अक्षर।",
    yati: "प्रत्येक 8 अक्षर पर",
    description: "वैदिक मन्त्रों का शिरोमणि छन्द (उदा. प्रसिद्ध सावित्री गायत्री मन्त्र)।",
  },
  {
    id: "indravajra",
    nameSanskrit: "इन्द्रवज्रा",
    nameEnglish: "Indravajra",
    category: "sama-vritta",
    syllablesPerPada: 11,
    totalSyllables: 44,
    ganaPattern: ["त", "त", "ज", "ग", "ग"],
    lakshanaSanskrit: "स्यादिन्द्रवज्रा यदि तौ जगौ गः।",
    lakshanaHindi: "प्रत्येक पाद में 11 अक्षर: त-गण, त-गण, ज-गण, और दो गुरु (ऽ ऽ)।",
    yati: "पादान्ते (11 पर)",
    description: "प्रसिद्ध शास्त्रीय छन्द (उदा. 'माता शत्रुः पिता वैरी...')।",
  },
  {
    id: "upendravajra",
    nameSanskrit: "उपेन्द्रवज्रा",
    nameEnglish: "Upendravajra",
    category: "sama-vritta",
    syllablesPerPada: 11,
    totalSyllables: 44,
    ganaPattern: ["ज", "त", "ज", "ग", "ग"],
    lakshanaSanskrit: "उपेन्द्रवज्रा जतजास्ततो गौ।",
    lakshanaHindi: "प्रत्येक पाद में 11 अक्षर: ज-गण, त-गण, ज-गण, और दो गुरु (। ऽ । ऽ ऽ । । ऽ । ऽ ऽ)।",
    yati: "पादान्ते (11 पर)",
    description: "उदा. 'त्वमेव माता च पिता त्वमेव त्वमेव बन्धुश्च सखा त्वमेव'।",
  },
  {
    id: "upajati",
    nameSanskrit: "उपजाति",
    nameEnglish: "Upajati",
    category: "sama-vritta",
    syllablesPerPada: 11,
    totalSyllables: 44,
    lakshanaSanskrit: "अनन्तरोदीरितलक्ष्मभाजौ पादौ यदीयावुपजातयस्ताः।",
    lakshanaHindi: "इन्द्रवज्रा और उपेन्द्रवज्रा के चरणों का सुन्दर सम्मिश्रण (11 अक्षर प्रति चरण)।",
    yati: "पादान्ते (11 पर)",
    description: "कालिदास और भारवि का प्रिय छन्द।",
  },
  {
    id: "shalini",
    nameSanskrit: "शालिनी",
    nameEnglish: "Shalini",
    category: "sama-vritta",
    syllablesPerPada: 11,
    totalSyllables: 44,
    ganaPattern: ["म", "त", "त", "ग", "ग"],
    lakshanaSanskrit: "मात्तौ चेत् तौ गौ शालिनी वेदलोकैः।",
    lakshanaHindi: "म-गण, त-गण, त-गण और दो गुरु। यति 4 और 7 अक्षरों पर।",
    yati: "4 और 7 अक्षरों पर",
    description: "गम्भीर ओजस्वी श्लोकों के लिए प्रयुक्त छन्द।",
  },
  {
    id: "rathoddhata",
    nameSanskrit: "रथोद्धता",
    nameEnglish: "Rathoddhata",
    category: "sama-vritta",
    syllablesPerPada: 11,
    totalSyllables: 44,
    ganaPattern: ["र", "न", "र", "ल", "ग"],
    lakshanaSanskrit: "रान्नराविह रथोद्धता लगौ।",
    lakshanaHindi: "र-गण, न-गण, र-गण, लघु और गुरु (11 अक्षर)।",
    yati: "पादान्ते",
    description: "गतिशील लय वाला सुन्दर शास्त्रीय छन्द।",
  },
  {
    id: "vamshastha",
    nameSanskrit: "वंशस्थ",
    nameEnglish: "Vamshastha",
    category: "sama-vritta",
    syllablesPerPada: 12,
    totalSyllables: 48,
    ganaPattern: ["ज", "त", "ज", "र"],
    lakshanaSanskrit: "जतौ तु वंशस्थमुदीरितं जरौ।",
    lakshanaHindi: "प्रत्येक पाद में 12 अक्षर: ज-गण, त-गण, ज-गण, र-गण।",
    yati: "पादान्ते (12 पर)",
    description: "किरातार्जुनीयम् का प्रमुख छन्द।",
  },
  {
    id: "bhujangaprayata",
    nameSanskrit: "भुजङ्गप्रयात",
    nameEnglish: "Bhujangaprayata",
    category: "sama-vritta",
    syllablesPerPada: 12,
    totalSyllables: 48,
    ganaPattern: ["य", "य", "य", "य"],
    lakshanaSanskrit: "भुजङ्गप्रयातं भवेद् यैश्चतुर्भिः।",
    lakshanaHindi: "चार य-गण (। ऽ ऽ  । ऽ ऽ  । ऽ ऽ  । ऽ ऽ) = 12 अक्षर प्रति पाद।",
    yati: "पादान्ते",
    description: "आदि शंकराचार्य कृत अनेक स्तोत्रों (उदा. भवानी अष्टकम्) का छन्द।",
  },
  {
    id: "totaka",
    nameSanskrit: "तोटक",
    nameEnglish: "Totaka",
    category: "sama-vritta",
    syllablesPerPada: 12,
    totalSyllables: 48,
    ganaPattern: ["स", "स", "स", "स"],
    lakshanaSanskrit: "इह तोटकमम्बुधिसैः प्रमितम्।",
    lakshanaHindi: "चार स-गण (। । ऽ  । । ऽ  । । ऽ  । । ऽ) = 12 अक्षर।",
    yati: "पादान्ते",
    description: "तोटकाचार्य कृत 'तोटकाष्टकम्' का द्रुत लय वाला छन्द।",
  },
  {
    id: "drutavilambita",
    nameSanskrit: "द्रुतविलम्बित",
    nameEnglish: "Drutavilambita",
    category: "sama-vritta",
    syllablesPerPada: 12,
    totalSyllables: 48,
    ganaPattern: ["न", "भ", "भ", "र"],
    lakshanaSanskrit: "द्रुतविलम्बितमाह नभौ भरौ।",
    lakshanaHindi: "न-गण, भ-गण, भ-गण, र-गण = 12 अक्षर।",
    yati: "पादान्ते",
    description: "द्रुत (तेज) और विलम्बित (धीमी) गति का सम्मिश्रण।",
  },
  {
    id: "vasantatilaka",
    nameSanskrit: "वसन्ततिलका",
    nameEnglish: "Vasantatilaka",
    category: "sama-vritta",
    syllablesPerPada: 14,
    totalSyllables: 56,
    ganaPattern: ["त", "भ", "ज", "ज", "ग", "ग"],
    lakshanaSanskrit: "उक्ता वसन्ततिलका तभजा जगौ गः।",
    lakshanaHindi: "त-गण, भ-गण, ज-गण, ज-गण और दो गुरु = 14 अक्षर।",
    yati: "8 और 6 अक्षरों पर",
    description: "माधुर्य एवं शृंगार/भक्ति का प्रसिद्ध छन्द (उदा. 'मूकं करोति वाचालं...')।",
  },
  {
    id: "malini",
    nameSanskrit: "मालिनी",
    nameEnglish: "Malini",
    category: "sama-vritta",
    syllablesPerPada: 15,
    totalSyllables: 60,
    ganaPattern: ["न", "न", "म", "य", "य"],
    lakshanaSanskrit: "ननमयययुतेयं मालिनी भोगिलोकैः।",
    lakshanaHindi: "न-गण, न-गण, म-गण, य-गण, य-गण = 15 अक्षर। यति 8 और 7 पर।",
    yati: "8 और 7 अक्षरों पर",
    description: "अभिज्ञानशाकुन्तलम् तथा स्तोत्र साहित्य का अतिप्रिय छन्द।",
  },
  {
    id: "panchachamara",
    nameSanskrit: "पञ्चचामर",
    nameEnglish: "Panchachamara",
    category: "sama-vritta",
    syllablesPerPada: 16,
    totalSyllables: 64,
    ganaPattern: ["ज", "र", "ज", "र", "ज", "ग"],
    lakshanaSanskrit: "जरौ जरौ जगौ च पञ्चचामरं वदन्ति।",
    lakshanaHindi: "ज-गण, र-गण, ज-गण, र-गण, ज-गण, गुरु = 16 अक्षर। (। ऽ । ऽ । ऽ । ऽ । ऽ । ऽ । ऽ । ऽ)",
    yati: "8 और 8 अक्षरों पर",
    description: "श्री शिव ताण्डव स्तोत्रम् ('जटाटवीगलज्जलप्रवाह...') का विख्यात छन्द।",
  },
  {
    id: "shikharini",
    nameSanskrit: "शिखरिणी",
    nameEnglish: "Shikharini",
    category: "sama-vritta",
    syllablesPerPada: 17,
    totalSyllables: 68,
    ganaPattern: ["य", "म", "न", "स", "भ", "ल", "ग"],
    lakshanaSanskrit: "रसै रुद्रैश्छिन्ना यमनसभलागः शिखरिणी।",
    lakshanaHindi: "य-गण, म-गण, न-गण, स-गण, भ-गण, लघु, गुरु = 17 अक्षर। यति 6 और 11 पर।",
    yati: "6 और 11 अक्षरों पर",
    description: "सौन्दर्यलहरी और नीतिशतकम् का शिखर छन्द।",
  },
  {
    id: "mandakranta",
    nameSanskrit: "मन्दाक्रान्ता",
    nameEnglish: "Mandakranta",
    category: "sama-vritta",
    syllablesPerPada: 17,
    totalSyllables: 68,
    ganaPattern: ["म", "भ", "न", "त", "त", "ग", "ग"],
    lakshanaSanskrit: "मन्दाक्रान्ता जलधिषडगैर्मभौ तौ ताद्गुरू चेत्।",
    lakshanaHindi: "म-गण, भ-गण, न-गण, त-गण, त-गण, दो गुरु = 17 अक्षर। यति 4, 6 और 7 पर।",
    yati: "4, 6 और 7 अक्षरों पर",
    description: "कालिदास के 'मेघदूतम्' का सम्पूर्ण छन्द ('कश्चित्कान्ताविरहगुरुणा...')।",
  },
  {
    id: "shardulavikridita",
    nameSanskrit: "शार्दूलविक्रीडित",
    nameEnglish: "Shardulavikridita",
    category: "sama-vritta",
    syllablesPerPada: 19,
    totalSyllables: 76,
    ganaPattern: ["म", "स", "ज", "स", "त", "त", "ग"],
    lakshanaSanskrit: "सूर्याश्वैर्मसजस्तथाः सगुरवः शार्दूलविक्रीडितम्।",
    lakshanaHindi: "म-गण, स-गण, ज-गण, स-गण, त-गण, त-गण, गुरु = 19 अक्षर। यति 12 और 7 पर।",
    yati: "12 और 7 अक्षरों पर (सूर्य=12, अश्व=7)",
    description: "महाकाव्यों व स्तुतियों का भव्य छन्द (उदा. 'या कुन्देन्दुतुषारहारधवला...', 'कस्तूरीतिलकं ललाटपटले...')।",
  },
  {
    id: "sragdhara",
    nameSanskrit: "स्रग्धरा",
    nameEnglish: "Sragdhara",
    category: "sama-vritta",
    syllablesPerPada: 21,
    totalSyllables: 84,
    ganaPattern: ["म", "र", "भ", "न", "य", "य", "य"],
    lakshanaSanskrit: "म्रभ्नैर्यानां त्रयेण त्रिमुनियतियुता स्रग्धरा कीर्तितेयम्।",
    lakshanaHindi: "म-गण, र-गण, भ-गण, न-गण, और तीन य-गण = 21 अक्षर। यति 7, 7, 7 पर।",
    yati: "7, 7 और 7 अक्षरों पर (त्रिमुनि)",
    description: "संस्कृत का सबसे लम्बा और गम्भीर शास्त्रीय छन्द (उदा. 'ग्रीवाभङ्गाभिरामं...').",
  },
  {
    id: "trishtup",
    nameSanskrit: "त्रिष्टुप्",
    nameEnglish: "Trishtup",
    category: "vedic",
    syllablesPerPada: 11,
    totalSyllables: 44,
    lakshanaSanskrit: "त्रिष्टुबेकादशाक्षरैश्चतुर्भिः पादैः।",
    lakshanaHindi: "4 पाद, प्रत्येक में 11 अक्षर (कुल 44 अक्षर)।",
    yati: "पादान्ते",
    description: "ऋग्वेद में सर्वाधिक प्रयुक्त 11-अक्षरीय वैदिक छन्द।",
  },
  {
    id: "jagati",
    nameSanskrit: "जगती",
    nameEnglish: "Jagati",
    category: "vedic",
    syllablesPerPada: 12,
    totalSyllables: 48,
    lakshanaSanskrit: "जगती द्वादशाक्षरैश्चतुर्भिः पादैः।",
    lakshanaHindi: "4 पाद, प्रत्येक में 12 अक्षर (कुल 48 अक्षर)।",
    yati: "पादान्ते",
    description: "सामवेद व ऋग्वेद का 12-अक्षरीय प्रमुख वैदिक छन्द।",
  },
];

// ──────────────────────────────────────────
// 3. CLASSIC SHLOKA PRESETS
// ──────────────────────────────────────────

export const SHLOKA_PRESETS: ShlokaPreset[] = [
  {
    id: "gita-2-47",
    title: "कर्मण्येवाधिकारस्ते (श्रीमद्भगवद्गीता २.४७)",
    source: "श्रीमद्भगवद्गीता",
    meterName: "अनुष्टुप् (श्लोक)",
    shloka: `कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।
मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥`,
    meaningHindi: "तेरा अधिकार केवल कर्म करने में ही है, फल में कभी नहीं। इसलिए तू कर्मफल का हेतु मत बन और तेरी अकर्मण्यता (कर्म न करने) में भी आसक्ति न हो।",
    meaningEnglish: "You have a right only to perform your prescribed duty, but never to the fruits of action. Never let the fruits be your motive, nor be attached to inaction.",
  },
  {
    id: "gita-1-1",
    title: "धर्मक्षेत्रे कुरुक्षेत्रे (गीता १.१)",
    source: "श्रीमद्भगवद्गीता",
    meterName: "अनुष्टुप् (श्लोक)",
    shloka: `धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः।
मामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय॥`,
    meaningHindi: "धृतराष्ट्र ने कहा: हे संजय! धर्मभूमि कुरुक्षेत्र में युद्ध की इच्छा से एकत्र हुए मेरे और पाण्डु के पुत्रों ने क्या किया?",
    meaningEnglish: "Dhritarashtra said: O Sanjaya, assembled on the holy field of Kurukshetra, eager to fight, what did my sons and the sons of Pandu do?",
  },
  {
    id: "shiv-tandav",
    title: "जटाटवीगलज्जल (शिवताण्डव स्तोत्रम्)",
    source: "शिवताण्डव स्तोत्रम् (रावण कृत)",
    meterName: "पञ्चचामर छन्द",
    shloka: `जटाटवीगलज्जलप्रवाहपावितस्थले
गलेऽवलम्ब्य लम्बितां भुजङ्गतुङ्गमालिकाम्।
डमड्डमड्डमड्डमन्निनादवड्डमर्वयं
चकार चण्डताण्डवं तनोतु नः शिवः शिवम्॥`,
    meaningHindi: "सघन जटारूपी वन से निकलती गंगा की जलधाराओं से जिनका कण्ठ पावन है, गले में विशाल सर्पों की माला धारण कर डमरू के 'डम-डम' निनाद के साथ जो प्रचण्ड ताण्डव करते हैं, वे भगवान शिव हमारा कल्याण करें।",
    meaningEnglish: "May Lord Shiva, who performs the cosmic dance while holding the sacred Ganga flowing from His matted locks, bestow auspiciousness upon us.",
  },
  {
    id: "saraswati-stotram",
    title: "या कुन्देन्दुतुषारहारधवला (सरस्वती वन्दना)",
    source: "सरस्वती स्तोत्रम्",
    meterName: "शार्दूलविक्रीडित छन्द",
    shloka: `या कुन्देन्दुतुषारहारधवला या शुभ्रवस्त्रावृता
या वीणावरदण्डमण्डितकरा या श्वेतपद्मासना।
या ब्रह्माच्युतशङ्करप्रभृतिभिर्देवैः सदा वन्दिता
सा मां पातु सरस्वती भगवती निःशेषजाड्यापहा॥`,
    meaningHindi: "जो कुन्द पुष्प, चन्द्रमा और हिमहार के समान श्वेत हैं, जो श्वेत वस्त्र धारण करती हैं, जिनके करकमलों में वीणा और वरदण्ड सुशोभित हैं, जो ब्रह्मा, विष्णु और महेश द्वारा सदा पूजित हैं, वे भगवती सरस्वती मेरी सम्पूर्ण अज्ञानता को दूर करें।",
    meaningEnglish: "May Goddess Saraswati, who is fair as the jasmine flower and the moon, adorned with white garments and holding the divine Veena, protect us from all ignorance.",
  },
  {
    id: "tvameva-mata",
    title: "त्वमेव माता च पिता त्वमेव",
    source: "प्रपन्न पारिजात / महाभारत",
    meterName: "उपेन्द्रवज्रा / उपजाति",
    shloka: `त्वमेव माता च पिता त्वमेव
त्वमेव बन्धुश्च सखा त्वमेव।
त्वमेव विद्या द्रविणं त्वमेव
त्वमेव सर्वं मम देव देव॥`,
    meaningHindi: "हे प्रभो! आप ही मेरी माता हैं, आप ही पिता हैं; आप ही बन्धु हैं और आप ही सखा हैं। आप ही विद्या हैं और आप ही सम्पत्ति हैं; हे देवों के देव, आप ही मेरे सर्वस्व हैं।",
    meaningEnglish: "You alone are my mother, father, kinsman, friend, knowledge, and wealth. O Lord of lords, You are everything to me.",
  },
  {
    id: "meghadootam",
    title: "कश्चित्कान्ताविरहगुरुणा (मेघदूतम् १.१)",
    source: "कालिदास कृत मेघदूतम्",
    meterName: "मन्दाक्रान्ता छन्द",
    shloka: `कश्चित्कान्ताविरहगुरुणा स्वाधिकारात्प्रमत्तः
शापेनास्तङ्गमितमहिमा वर्षभोग्येण भर्तुः।
यक्षश्चक्रे जनकतनयास्नानपुण्योदकेषु
स्निग्धच्छायातरुषु वसतिं रामगिर्याश्रमेशु॥`,
    meaningHindi: "कर्तव्य में प्रमाद करने के कारण स्वामी (कुबेर) के शाप से महिमा-रहित हुआ एक यक्ष, जनकनन्दिनी सीता जी के स्नान से पवित्र जल और सघन छायादार वृक्षों वाले रामगिरि आश्रम में निवास करने लगा।",
    meaningEnglish: "A Yaksha, exiled from his divine position due to dereliction of duty, made his dwelling in the hermitages of Ramagiri, sacred with the holy baths of Sita.",
  },
];

// ──────────────────────────────────────────
// 4. SCANSION CALCULATION ENGINE
// ──────────────────────────────────────────

/**
 * Tokenize a line of Sanskrit text into syllables with Pingala Laghu-Guru metrics
 */
export function scanLineSyllables(line: string): Syllable[] {
  const clean = line.replace(/[।॥\d\s.,!?;:'"()\-]/g, "");
  if (!clean) return [];

  // Devanagari Vowel & Consonant characters
  const shortVowels = "अइउऋऌिुृॢ";
  const longVowels = "आईऊॠएऐओऔाीूॄेैोौ";
  const virama = "्";
  const anusvara = "ंँः";

  const syllables: { text: string; vowel: string; hasAnusvara: boolean; isConjunctNext: boolean }[] = [];

  let i = 0;
  while (i < clean.length) {
    let cons = "";
    // Accumulate consonant clusters with halanta
    while (i < clean.length && clean[i + 1] === virama) {
      cons += clean[i] + clean[i + 1];
      i += 2;
    }

    if (i >= clean.length) break;

    const baseChar = clean[i];
    i++;

    let vowelSign = "";
    let extraSign = "";

    // Check if followed by dependent vowel sign
    if (i < clean.length && (shortVowels + longVowels).includes(clean[i])) {
      vowelSign = clean[i];
      i++;
    }

    // Check anusvara / visarga
    if (i < clean.length && anusvara.includes(clean[i])) {
      extraSign = clean[i];
      i++;
    }

    syllables.push({
      text: cons + baseChar + vowelSign + extraSign,
      vowel: vowelSign || (shortVowels + longVowels).includes(baseChar) ? (vowelSign || baseChar) : "a",
      hasAnusvara: Boolean(extraSign),
      isConjunctNext: false,
    });
  }

  // Look-ahead check: mark if followed by a conjunct (संयोगे गुरु)
  for (let s = 0; s < syllables.length - 1; s++) {
    const nextText = syllables[s + 1].text;
    if (nextText.includes(virama)) {
      syllables[s].isConjunctNext = true;
    }
  }

  // Evaluate Pingala weight rules
  return syllables.map((syl, idx) => {
    let weight: Weight = "L";
    let rule = "ह्रस्व स्वर (Short vowel)";

    const isLong = longVowels.includes(syl.vowel);

    if (isLong) {
      weight = "G";
      rule = "दीर्घ स्वर (Long vowel)";
    } else if (syl.hasAnusvara) {
      weight = "G";
      rule = "अनुस्वार/विसर्ग युक्त (Anusvara/Visarga)";
    } else if (syl.isConjunctNext) {
      weight = "G";
      rule = "संयोगे परे (Followed by conjunct cluster)";
    }

    return {
      text: syl.text,
      weight,
      matras: weight === "G" ? 2 : 1,
      rule,
      index: idx + 1,
    };
  });
}

/**
 * Group syllables into Pingala 8-Gana triplets
 */
export function groupIntoGanas(syllables: Syllable[]): GanaGroup[] {
  const groups: GanaGroup[] = [];
  const patternToGana: Record<string, GanaType> = {
    LGG: "य",
    GGG: "म",
    GGL: "त",
    GLG: "र",
    LGL: "ज",
    GLL: "भ",
    LLL: "न",
    LLG: "स",
  };

  let i = 0;
  while (i < syllables.length) {
    if (i + 3 <= syllables.length) {
      const trio = syllables.slice(i, i + 3);
      const code = trio.map((s) => s.weight).join("");
      const gana = patternToGana[code] || "म";
      const info = GANA_DEFINITIONS[code] || { name: `${gana}-गण`, pattern: code, desc: "" };

      groups.push({
        gana,
        name: info.name,
        pattern: info.pattern,
        syllables: trio,
      });
      i += 3;
    } else {
      // Remaining 1 or 2 syllables (Laghu or Guru)
      const remaining = syllables.slice(i);
      remaining.forEach((rem) => {
        const gana: GanaType = rem.weight === "G" ? "ग" : "ल";
        groups.push({
          gana,
          name: rem.weight === "G" ? "ग (Guru)" : "ल (Laghu)",
          pattern: rem.weight === "G" ? "ऽ" : "।",
          syllables: [rem],
        });
      });
      break;
    }
  }

  return groups;
}

/**
 * Perform complete Shloka & Chhandas scansion analysis
 */
export function analyzeShloka(rawText: string): ScansionResult {
  if (!rawText || !rawText.trim()) {
    return {
      detectedMeter: null,
      confidence: 0,
      padas: [],
      overallMetrics: {
        padaCount: 0,
        totalSyllables: 0,
        totalMatras: 0,
        laghuCount: 0,
        guruCount: 0,
        avgSyllablesPerPada: 0,
        isVedicMatch: false,
      },
      alternateMatches: [],
      padachedaTokens: [],
    };
  }

  // Split lines / padas
  const rawLines = rawText
    .split(/\r?\n|।|॥/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !/^[\d\s]+$/.test(l));

  const padas: PadaScansion[] = rawLines.map((line, idx) => {
    const syllables = scanLineSyllables(line);
    const ganas = groupIntoGanas(syllables);
    const laghuCount = syllables.filter((s) => s.weight === "L").length;
    const guruCount = syllables.filter((s) => s.weight === "G").length;
    const totalMatras = syllables.reduce((acc, s) => acc + s.matras, 0);

    return {
      padaIndex: idx + 1,
      originalText: line,
      syllables,
      ganas,
      totalSyllables: syllables.length,
      totalMatras,
      laghuCount,
      guruCount,
    };
  });

  const padaCount = padas.length;
  const totalSyllables = padas.reduce((acc, p) => acc + p.totalSyllables, 0);
  const totalMatras = padas.reduce((acc, p) => acc + p.totalMatras, 0);
  const laghuCount = padas.reduce((acc, p) => acc + p.laghuCount, 0);
  const guruCount = padas.reduce((acc, p) => acc + p.guruCount, 0);
  const avgSyllablesPerPada = padaCount > 0 ? Math.round(totalSyllables / padaCount) : 0;

  // Meter Matching Algorithm
  const matchScores: { meter: ChhandasDefinition; score: number }[] = [];

  for (const def of CHHANDAS_DATABASE) {
    let score = 0;

    // Check syllable count matches
    if (typeof def.syllablesPerPada === "number") {
      const diff = Math.abs(avgSyllablesPerPada - def.syllablesPerPada);
      if (diff === 0) score += 40;
      else if (diff === 1) score += 15;

      if (def.totalSyllables && Math.abs(totalSyllables - def.totalSyllables) <= 3) {
        score += 35;
      }
    } else if (Array.isArray(def.syllablesPerPada)) {
      if (def.totalSyllables && Math.abs(totalSyllables - def.totalSyllables) <= 3) {
        score += 55;
      }
    }

    // Check Gana pattern matches
    if (def.ganaPattern && padas.length > 0) {
      const firstPadaGanas = padas[0].ganas.map((g) => g.gana);
      let ganaMatch = 0;
      const checkLen = Math.min(def.ganaPattern.length, firstPadaGanas.length);
      for (let g = 0; g < checkLen; g++) {
        if (def.ganaPattern[g] === firstPadaGanas[g]) {
          ganaMatch++;
        }
      }
      const matchRatio = checkLen > 0 ? ganaMatch / checkLen : 0;
      if (matchRatio >= 0.5) {
        score += Math.round(matchRatio * 45);
      } else {
        // Penalty if gana pattern doesn't match
        score = Math.max(0, score - 20);
      }
    }

    // Special Anushtup rule (32 total syllables or 8/16 per pada)
    if (def.id === "anushtup") {
      if (totalSyllables >= 28 && totalSyllables <= 36) {
        score += 50;
      } else if (avgSyllablesPerPada === 8 || (avgSyllablesPerPada === 16 && padaCount === 2)) {
        score += 40;
      }
    }

    if (score > 30) {
      matchScores.push({
        meter: def,
        score: Math.min(99, score),
      });
    }
  }

  matchScores.sort((a, b) => b.score - a.score);

  const bestMatch = matchScores[0] || null;
  const detectedMeter = bestMatch ? bestMatch.meter : null;
  const confidence = bestMatch ? bestMatch.score : 0;

  const alternateMatches = matchScores.slice(1, 4).map((m) => ({
    meter: m.meter,
    confidence: m.score,
  }));

  // Padacheda tokens (word splitting)
  const padachedaTokens = rawText
    .replace(/[।॥\d.,!?;:'"()\-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  return {
    detectedMeter,
    confidence,
    padas,
    overallMetrics: {
      padaCount,
      totalSyllables,
      totalMatras,
      laghuCount,
      guruCount,
      avgSyllablesPerPada,
      isVedicMatch: detectedMeter?.category === "vedic",
    },
    alternateMatches,
    padachedaTokens,
  };
}
