/**
 * Devanagari & Sanskrit Typing Engine
 * -----------------------------------
 * Provides smart phonetic transliteration, IAST/Harvard-Kyoto bidirectional conversion,
 * virtual keyboard layout maps (Varnamala, Inscript, Vedic Accents), and text metrics.
 */

export interface TextMetrics {
  charactersWithSpaces: number;
  charactersNoSpaces: number;
  words: number;
  lines: number;
  aksharaCount: number;
  matraCount: number;
  swarCount: number;
  vyanjanCount: number;
}

export interface PresetSnippet {
  id: string;
  title: string;
  category: string;
  devanagari: string;
  iast: string;
  meaningHindi: string;
}

// ──────────────────────────────────────────
// 1. SMART PHONETIC TRANSLITERATION TABLE
// ──────────────────────────────────────────

const DICT_WORDS: Record<string, string> = {
  namaste: "नमस्ते",
  namaskar: "नमस्कार",
  pranam: "प्रणाम",
  om: "ॐ",
  aum: "ॐ",
  shri: "श्री",
  shree: "श्री",
  namah: "नमः",
  namaha: "नमः",
  swaha: "स्वाहा",
  svaha: "स्वाहा",
  shanti: "शान्तिः",
  shantihi: "शान्तिः",
  jai: "जय",
  jay: "जय",
  ram: "राम",
  rama: "राम",
  shiva: "शिव",
  shiv: "शिव",
  ganesh: "गणेश",
  ganesha: "गणेश",
  ganeshaya: "गणेशाय",
  krishna: "कृष्ण",
  krishnaya: "कृष्णाय",
  hanuman: "हनुमान",
  durga: "दुर्गा",
  lakshmi: "लक्ष्मी",
  laxmi: "लक्ष्मी",
  saraswati: "सरस्वती",
  surya: "सूर्य",
  guru: "गुरु",
  brahma: "ब्रह्मा",
  vishnu: "विष्णु",
  mahesh: "महेश",
  dharmakshetre: "धर्मक्षेत्रे",
  kurukshetre: "कुरुक्षेत्रे",
  gayatri: "गायत्री",
  mantra: "मन्त्र",
  shloka: "श्लोक",
  puja: "पूजा",
  pooja: "पूजा",
  havan: "हवन",
  vrat: "व्रत",
  aarti: "आरती",
  bhagavad: "भगवद्",
  gita: "गीता",
  bharat: "भारत",
  india: "भारत",
  sanatan: "सनातन",
  dharma: "धर्म",
  satyam: "सत्यम्",
  eva: "एव",
  jayate: "जयते",
};

const CONJUNCTS: Array<[string, string]> = [
  ["ksha", "क्ष"],
  ["kshi", "क्षि"],
  ["kshu", "क्षु"],
  ["kshe", "क्षे"],
  ["ksho", "क्षो"],
  ["ksh", "क्ष्"],
  ["stra", "स्त्र"],
  ["stri", "स्त्री"],
  ["str", "स्त्र्"],
  ["tra", "त्र"],
  ["tri", "त्रि"],
  ["tru", "त्रु"],
  ["tre", "त्रे"],
  ["tro", "त्रो"],
  ["tr", "त्र्"],
  ["gya", "ज्ञ"],
  ["jnya", "ज्ञ"],
  ["shra", "श्र"],
  ["shri", "श्री"],
  ["shree", "श्री"],
  ["shru", "श्रु"],
  ["shre", "श्रे"],
  ["shr", "श्र्"],
  ["sta", "स्त"],
  ["ste", "स्ते"],
  ["sti", "स्ति"],
  ["stu", "स्तु"],
  ["st", "स्त्"],
  ["ddha", "द्ध"],
  ["ddhi", "द्धि"],
  ["ddh", "द्ध्"],
  ["dhya", "ध्य"],
  ["dhy", "ध्य्"],
  ["dva", "द्व"],
  ["dvi", "द्वि"],
  ["dya", "द्य"],
  ["kta", "क्त"],
  ["kti", "क्ति"],
  ["pra", "प्र"],
  ["pri", "प्रिय"],
  ["priya", "प्रिय"],
  ["pre", "प्रे"],
  ["pro", "प्रो"],
  ["pr", "प्र्"],
  ["kra", "क्र"],
  ["kri", "क्रि"],
  ["gra", "ग्र"],
  ["gri", "गृ"],
  ["griha", "गृह"],
  ["dra", "द्र"],
  ["bra", "ब्र"],
  ["mra", "म्र"],
  ["vra", "व्र"],
  ["sva", "स्व"],
  ["swa", "स्व"],
];

const CONSONANTS: Array<[string, string]> = [
  ["kh", "ख"],
  ["gh", "घ"],
  ["chh", "छ"],
  ["ch", "च"],
  ["jh", "झ"],
  ["Th", "ठ"],
  ["Dh", "ढ"],
  ["th", "थ"],
  ["dh", "ध"],
  ["ph", "फ"],
  ["bh", "भ"],
  ["sh", "श"],
  ["Sh", "ष"],
  ["k", "क"],
  ["g", "ग"],
  ["j", "ज"],
  ["T", "ट"],
  ["D", "ड"],
  ["N", "ण"],
  ["t", "त"],
  ["d", "द"],
  ["n", "न"],
  ["p", "प"],
  ["f", "फ़"],
  ["b", "ब"],
  ["m", "म"],
  ["y", "य"],
  ["r", "र"],
  ["l", "ल"],
  ["v", "व"],
  ["w", "व"],
  ["s", "स"],
  ["h", "ह"],
  ["z", "ज़"],
  ["q", "क़"],
];

const VOWELS_INDEPENDENT: Array<[string, string]> = [
  ["aa", "आ"],
  ["ee", "ई"],
  ["ii", "ई"],
  ["oo", "ऊ"],
  ["uu", "ऊ"],
  ["ai", "ऐ"],
  ["au", "औ"],
  ["ou", "औ"],
  ["ri", "ऋ"],
  ["a", "अ"],
  ["i", "इ"],
  ["u", "उ"],
  ["e", "ए"],
  ["o", "ओ"],
];

const MATRA_MAP: Record<string, string> = {
  aa: "ा",
  ee: "ी",
  ii: "ी",
  i: "ि",
  oo: "ू",
  uu: "ू",
  u: "ु",
  ri: "ृ",
  ai: "ै",
  e: "े",
  au: "ौ",
  ou: "ौ",
  o: "ो",
  a: "",
};

/**
 * Phonetically transliterate an English word or sentence into Devanagari
 */
export function phoneticToDevanagari(input: string): string {
  if (!input) return "";

  const tokens = input.split(/(\s+|[.,!?;:।॥\n\r])/);
  return tokens
    .map((tok) => {
      if (/^\s+$/.test(tok) || /^[.,!?;:।॥\n\r]+$/.test(tok)) return tok;
      const lower = tok.toLowerCase();
      if (DICT_WORDS[lower]) return DICT_WORDS[lower];
      return transliterateWord(tok);
    })
    .join("");
}

function transliterateWord(word: string): string {
  let s = word;

  // 1. Check direct conjuncts first
  for (const [eng, dev] of CONJUNCTS) {
    const reg = new RegExp(eng, "gi");
    s = s.replace(reg, dev);
  }

  // 2. Map consonants
  for (const [eng, dev] of CONSONANTS) {
    const reg = new RegExp(eng, "g");
    s = s.replace(reg, dev);
  }

  // 3. Map vowels with matra awareness
  for (const [eng, dev] of VOWELS_INDEPENDENT) {
    const reg = new RegExp(eng, "gi");
    s = s.replace(reg, dev);
  }

  return fixVowelMatras(s);
}

/**
 * Convert independent vowels to dependent matras when preceded by consonants
 */
function fixVowelMatras(text: string): string {
  const matraMap: Record<string, string> = {
    अ: "",
    आ: "ा",
    इ: "ि",
    ई: "ी",
    उ: "ु",
    ऊ: "ू",
    ऋ: "ृ",
    ए: "े",
    ऐ: "ै",
    ओ: "ो",
    औ: "ौ",
  };

  const consonants = "कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसहक्षत्रज्ञश्र";
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const prev = text[i - 1];
    if (matraMap[char] !== undefined && prev && consonants.includes(prev)) {
      out += matraMap[char];
    } else {
      out += char;
    }
  }
  return out;
}

// ──────────────────────────────────────────
// 2. IAST & HARVARD-KYOTO CONVERTERS
// ──────────────────────────────────────────

export const DEVANAGARI_TO_IAST_MAP: Record<string, string> = {
  अ: "a",
  आ: "ā",
  इ: "i",
  ई: "ī",
  उ: "u",
  ऊ: "ū",
  ऋ: "ṛ",
  ॠ: "ṝ",
  ऌ: "ḷ",
  ए: "e",
  ऐ: "ai",
  ओ: "o",
  औ: "au",
  "ा": "ā",
  "ि": "i",
  "ी": "ī",
  "ु": "u",
  "ू": "ū",
  "ृ": "ṛ",
  "े": "e",
  "ै": "ai",
  "ो": "o",
  "ौ": "au",
  "ं": "ṁ",
  "ः": "ḥ",
  "ँ": "m̐",
  "्": "",
  "ऽ": "'",
  "।": " | ",
  "॥": " || ",
  ॐ: "Oṁ",
  क: "ka",
  ख: "kha",
  ग: "ga",
  घ: "gha",
  ङ: "ṅa",
  च: "ca",
  छ: "cha",
  ज: "ja",
  झ: "jha",
  ञ: "ña",
  ट: "ṭa",
  ठ: "ṭha",
  ड: "ḍa",
  ढ: "ḍha",
  ण: "ṇa",
  त: "ta",
  थ: "tha",
  द: "da",
  ध: "dha",
  न: "na",
  प: "pa",
  फ: "pha",
  ब: "ba",
  भ: "bha",
  म: "ma",
  य: "ya",
  र: "ra",
  ल: "la",
  व: "va",
  श: "śa",
  ष: "ṣa",
  स: "sa",
  ह: "ha",
  क्ष: "kṣa",
  त्र: "tra",
  ज्ञ: "jña",
  श्र: "śra",
  "०": "0",
  "१": "1",
  "२": "2",
  "३": "3",
  "४": "4",
  "५": "5",
  "६": "6",
  "७": "7",
  "८": "8",
  "९": "9",
};

export function devanagariToIast(text: string): string {
  if (!text) return "";
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (DEVANAGARI_TO_IAST_MAP[char]) {
      let val = DEVANAGARI_TO_IAST_MAP[char];
      // If consonant is followed by a matra or virama, strip the inherent 'a'
      if (val.endsWith("a") && nextChar) {
        if (
          ["ा", "ि", "ी", "ु", "ू", "ृ", "े", "ै", "ो", "ौ", "्"].includes(nextChar)
        ) {
          val = val.slice(0, -1);
        }
      }
      out += val;
    } else {
      out += char;
    }
  }
  return out.replace(/\s+/g, " ").trim();
}

export function devanagariToHarvardKyoto(text: string): string {
  const iast = devanagariToIast(text);
  return iast
    .replace(/ā/g, "A")
    .replace(/ī/g, "I")
    .replace(/ū/g, "U")
    .replace(/ṛ/g, "R")
    .replace(/ṝ/g, "RR")
    .replace(/ḷ/g, "lR")
    .replace(/ṁ/g, "M")
    .replace(/ḥ/g, "H")
    .replace(/ś/g, "z")
    .replace(/ṣ/g, "S")
    .replace(/ṭh/g, "Th")
    .replace(/ṭ/g, "T")
    .replace(/ḍh/g, "Dh")
    .replace(/ḍ/g, "D")
    .replace(/ṇ/g, "N")
    .replace(/ñ/g, "J")
    .replace(/ṅ/g, "G");
}

// ──────────────────────────────────────────
// 3. VIRTUAL KEYBOARD LAYOUTS
// ──────────────────────────────────────────

export interface VirtualKeyboardLayout {
  swar: string[];
  matras: string[];
  vyanjanRows: string[][];
  sanyuktakshar: string[];
  vedicAccents: string[];
  numerals: string[];
  punctuation: string[];
}

export const VARNAMALA_LAYOUT: VirtualKeyboardLayout = {
  swar: ["अ", "आ", "इ", "ई", "उ", "ऊ", "ऋ", "ॠ", "ऌ", "ए", "ऐ", "ओ", "औ", "अं", "अः"],
  matras: ["ा", "ि", "ी", "ु", "ू", "ृ", "ॄ", "े", "ै", "ो", "ौ", "ं", "ः", "ँ", "्", "ऽ"],
  vyanjanRows: [
    ["क", "ख", "ग", "घ", "ङ"], // Ka-varga
    ["च", "छ", "ज", "झ", "ञ"], // Cha-varga
    ["ट", "ठ", "ड", "ढ", "ण"], // Ta-varga
    ["त", "थ", "द", "ध", "न"], // Ta-varga (dental)
    ["प", "फ", "ब", "भ", "म"], // Pa-varga
    ["य", "र", "ल", "व"], // Antahastha
    ["श", "ष", "स", "ह"], // Ushma
  ],
  sanyuktakshar: ["क्ष", "त्र", "ज्ञ", "श्र", "द्ध", "द्व", "द्य", "ष्ट", "ङ्क", "ङ्ख", "ह्य", "ह्र"],
  vedicAccents: [
    "॑", // Udatta / Svarita (U+0951)
    "॒", // Anudatta (U+0952)
    "॓", // Grave accent
    "॔", // Acute accent
    "ॐ", // Sacred Pranava
    "卐", // Swastika
    "☬", // Khanda
    "॰", // Abbreviation sign
  ],
  numerals: ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"],
  punctuation: ["।", "॥", " ", ",", ".", ":", "-", "(", ")"],
};

export const INSCRIPT_KEYS_NORMAL: string[][] = [
  ["१", "२", "३", "४", "५", "६", "७", "८", "९", "०", "-", "ृ"],
  ["ौ", "ै", "ा", "ी", "ू", "ब", "ह", "ग", "द", "ज", "ड", "़"],
  ["ो", "े", "्", "ि", "ु", "प", "र", "क", "त", "च", "ट"],
  ["ं", "म", "न", "व", "ल", "स", "य", "।", "॥"],
];

export const INSCRIPT_KEYS_SHIFT: string[][] = [
  ["ज्ञ", "ऋ", "श्र", "क्ष", "त्र", "द्ब", "द्य", "द्ध", "ऋ", "ॐ", "ः", "ॄ"],
  ["औ", "ऐ", "आ", "ई", "ऊ", "भ", "ङ", "घ", "ध", "झ", "ढ", "ञ"],
  ["ओ", "ए", "अ", "इ", "उ", "फ", "ऱ", "ख", "थ", "छ", "ठ"],
  ["ँ", "ण", "ष", "श", "ळ", "स", "य", "ऽ", "!"],
];

// ──────────────────────────────────────────
// 4. TEXT METRICS & ANALYTICS
// ──────────────────────────────────────────

export function analyzeDevanagariText(text: string): TextMetrics {
  const charactersWithSpaces = text.length;
  const charactersNoSpaces = text.replace(/\s+/g, "").length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text.trim() ? text.split(/\r\n|\r|\n/).length : 0;

  const swarRegex = /[अआइईउऊऋॠऌएऐओऔ]/g;
  const matraRegex = /[ािीुूृॄेैोौंःँ्ऽ]/g;
  const vyanjanRegex = /[क-ह]/g;

  const swarCount = (text.match(swarRegex) || []).length;
  const matraCount = (text.match(matraRegex) || []).length;
  const vyanjanCount = (text.match(vyanjanRegex) || []).length;

  // Approximate akshara count (syllables = consonants + independent vowels - virama)
  const viramas = (text.match(/्/g) || []).length;
  const aksharaCount = Math.max(0, vyanjanCount + swarCount - viramas);

  return {
    charactersWithSpaces,
    charactersNoSpaces,
    words,
    lines,
    aksharaCount,
    matraCount,
    swarCount,
    vyanjanCount,
  };
}

// ──────────────────────────────────────────
// 5. CLASSIC MANTRAS & PRESETS
// ──────────────────────────────────────────

export const PRESET_SHLOKAS: PresetSnippet[] = [
  {
    id: "gayatri",
    title: "गायत्री महामन्त्र",
    category: "Mantra",
    devanagari: "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥",
    iast: "Oṁ bhūr bhuvaḥ svaḥ tat savitur vareṇyaṁ bhargo devasya dhīmahi dhiyo yo naḥ pracodayāt ||",
    meaningHindi: "हम उस प्राणस्वरूप, दुःखनाशक, सुखस्वरूप, श्रेष्ठ, तेजस्वी, पापनाशक, देवस्वरूप परमात्मा का ध्यान करते हैं, जो हमारी बुद्धि को सन्मार्ग पर प्रेरित करे।",
  },
  {
    id: "mahamrityunjaya",
    title: "महामृत्युञ्जय मन्त्र",
    category: "Mantra",
    devanagari: "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् । उर्वारुकमिव बन्धनान्मृत्यौर्मुक्षीय माऽमृतात् ॥",
    iast: "Oṁ tryambakaṁ yajāmahe sugandhiṁ puṣṭi-vardhanam | urvārukam-iva bandhanān mṛtyor mukṣīya māmṛtāt ||",
    meaningHindi: "हम त्रिनेत्रधारी भगवान शिव की आराधना करते हैं, जो सुगंधित और पुष्टि का संवर्धन करने वाले हैं। जैसे ककड़ी पकने पर बेल के बंधन से मुक्त हो जाती है, वैसे ही हम मृत्यु से मुक्त होकर अमृत (मोक्ष) को प्राप्त करें।",
  },
  {
    id: "shanti-mantra",
    title: "शान्ति मन्त्र",
    category: "Mantra",
    devanagari: "ॐ सह नाववतु । सह नौ भुनक्तु । सह वीर्यं करवावहै । तेजस्वि नावधीतमस्तु मा विद्विषावहै ॥ ॐ शान्तिः शान्तिः शान्तिः ॥",
    iast: "Oṁ saha nāvavatu | saha nau bhunaktu | saha vīryaṁ karavāvahai | tejasvi nāvadhītam-astu mā vidviṣāvahai || Oṁ Śāntiḥ Śāntiḥ Śāntiḥ ||",
    meaningHindi: "परमात्मा हम दोनों (गुरु-शिष्य) की साथ-साथ रक्षा करें, साथ-साथ पालन करें। हम मिलकर विद्या का तेज प्राप्त करें और आपस में कभी द्वेष न करें।",
  },
  {
    id: "ganesh-vandana",
    title: "श्री गणेश वन्दना",
    category: "Stotram",
    devanagari: "वक्रतुण्ड महाकाय सूर्यकोटिसमप्रभ । निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥",
    iast: "Vakratuṇḍa mahākāya sūryakoṭi-samaprabha | nirvighnaṁ kuru me deva sarva-kāryeṣu sarvadā ||",
    meaningHindi: "घुमावदार सूंड वाले, विशाल शरीर वाले, करोड़ सूर्यों के समान तेजस्वी हे देव! मेरे समस्त कार्यों को सदा निर्विघ्न पूर्ण करें।",
  },
  {
    id: "gita-1-1",
    title: "श्रीमद्भगवद्गीता (१.१)",
    category: "Gita",
    devanagari: "धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः । मामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय ॥",
    iast: "Dharmakṣetre kurukṣetre samavetā yuyutsavaḥ | māmakāḥ pāṇḍavāścaiva kim akurvata sañjaya ||",
    meaningHindi: "धृतराष्ट्र बोले: हे संजय! धर्मभूमि कुरुक्षेत्र में युद्ध की इच्छा से एकत्र हुए मेरे और पाण्डु के पुत्रों ने क्या किया?",
  },
  {
    id: "guru-stotram",
    title: "गुरु स्तोत्रम्",
    category: "Stotram",
    devanagari: "गुरुर्ब्रह्मा गुरुर्विष्णुः गुरुर्देवो महेश्वरः । गुरुः साक्षात् परं ब्रह्म तस्मै श्रीगुरवे नमः ॥",
    iast: "Gurur-Brahmā Gurur-Viṣṇuḥ Gurur-Devo Maheśvaraḥ | Guruḥ sākṣāt paraṁ Brahma tasmai śrī-Gurave namaḥ ||",
    meaningHindi: "गुरु ही ब्रह्मा हैं, गुरु ही विष्णु हैं, गुरु ही महेश्वर (शिव) हैं। गुरु ही साक्षात् परब्रह्म हैं; ऐसे श्री गुरुदेव को मेरा नमन है।",
  },
];
