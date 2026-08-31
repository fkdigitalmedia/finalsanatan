/**
 * Universal Indic & Sanskrit Multi-Script Transliteration Engine
 * ---------------------------------------------------------------
 * High-performance, deterministic bidirectional transliteration engine supporting:
 * - Devanagari (देवनागरी)
 * - IAST (International Alphabet of Sanskrit Transliteration)
 * - ITRANS (Indian Language Transliteration)
 * - Harvard-Kyoto (HK)
 * - SLP1 (Sanskrit Library Phonetic)
 * - Bengali (বাংলা)
 * - Tamil (தமிழ்)
 * - Telugu (తెలుగు)
 * - Kannada (ಕನ್ನಡ)
 * - Malayalam (മലയാളം)
 * - Gujarati (ગુજરાતી)
 * - Gurmukhi (ਗੁਰਮੁਖੀ)
 * - Odia (ଓଡ଼ିଆ)
 */

export type ScriptId =
  | "devanagari"
  | "iast"
  | "itrans"
  | "hk"
  | "slp1"
  | "bengali"
  | "tamil"
  | "telugu"
  | "kannada"
  | "malayalam"
  | "gujarati"
  | "gurmukhi"
  | "odia";

export interface ScriptInfo {
  id: ScriptId;
  nameSanskrit: string;
  nameEnglish: string;
  nativeName: string;
  type: "indic" | "roman";
  sample: string;
}

export const SCRIPT_REGISTRY: Record<ScriptId, ScriptInfo> = {
  devanagari: {
    id: "devanagari",
    nameSanskrit: "देवनागरी लिपि",
    nameEnglish: "Devanagari",
    nativeName: "देवनागरी",
    type: "indic",
    sample: "ॐ नमः शिवाय",
  },
  iast: {
    id: "iast",
    nameSanskrit: "आई.ए.एस.टी. (रोमन)",
    nameEnglish: "IAST (Diacritics)",
    nativeName: "IAST Roman",
    type: "roman",
    sample: "oṁ namaḥ śivāya",
  },
  itrans: {
    id: "itrans",
    nameSanskrit: "आईट्रांस (ITRANS)",
    nameEnglish: "ITRANS (ASCII)",
    nativeName: "ITRANS",
    type: "roman",
    sample: "OM namaH shivAya",
  },
  hk: {
    id: "hk",
    nameSanskrit: "हार्वर्ड-क्योतो (HK)",
    nameEnglish: "Harvard-Kyoto",
    nativeName: "Harvard-Kyoto",
    type: "roman",
    sample: "oM namaH zivAya",
  },
  slp1: {
    id: "slp1",
    nameSanskrit: "एस.एल.पी.१ (SLP1)",
    nameEnglish: "SLP1",
    nativeName: "SLP1",
    type: "roman",
    sample: "oM namaH SivAya",
  },
  bengali: {
    id: "bengali",
    nameSanskrit: "बाङ्गला लिपि",
    nameEnglish: "Bengali",
    nativeName: "বাংলা",
    type: "indic",
    sample: "ওঁ নমঃ শিবায়",
  },
  tamil: {
    id: "tamil",
    nameSanskrit: "तमिऴ् लिपि",
    nameEnglish: "Tamil",
    nativeName: "தமிழ்",
    type: "indic",
    sample: "ௐ நமஃ ஶிவாய",
  },
  telugu: {
    id: "telugu",
    nameSanskrit: "तेलुगु लिपि",
    nameEnglish: "Telugu",
    nativeName: "తెలుగు",
    type: "indic",
    sample: "ఓం నమః శివాయ",
  },
  kannada: {
    id: "kannada",
    nameSanskrit: "कन्नड लिपि",
    nameEnglish: "Kannada",
    nativeName: "ಕನ್ನಡ",
    type: "indic",
    sample: "ಓಂ ನಮಃ ಶಿವಾಯ",
  },
  malayalam: {
    id: "malayalam",
    nameSanskrit: "मलयाळम् लिपि",
    nameEnglish: "Malayalam",
    nativeName: "മലയാളം",
    type: "indic",
    sample: "ഓം നമഃ ശിവായ",
  },
  gujarati: {
    id: "gujarati",
    nameSanskrit: "गुजराती लिपि",
    nameEnglish: "Gujarati",
    nativeName: "ગુજરાતી",
    type: "indic",
    sample: "ૐ નમઃ શિવાય",
  },
  gurmukhi: {
    id: "gurmukhi",
    nameSanskrit: "गुरुमुखी लिपि",
    nameEnglish: "Gurmukhi (Punjabi)",
    nativeName: "ਗੁਰਮੁਖੀ",
    type: "indic",
    sample: "ੴ ਨਮਃ ਸ਼ਿਵਾਯ",
  },
  odia: {
    id: "odia",
    nameSanskrit: "ओड़िआ लिपि",
    nameEnglish: "Odia",
    nativeName: "ଓଡ଼ିଆ",
    type: "indic",
    sample: "ଓଁ ନମଃ ଶିବାୟ",
  },
};

// ──────────────────────────────────────────
// 1. UNICODE INDIC SCRIPTS OFFSET MAPS
// ──────────────────────────────────────────

const INDIC_OFFSETS: Record<string, number> = {
  devanagari: 0x0900,
  bengali: 0x0980,
  gurmukhi: 0x0a00,
  gujarati: 0x0a80,
  odia: 0x0b00,
  tamil: 0x0b80,
  telugu: 0x0c00,
  kannada: 0x0c80,
  malayalam: 0x0d00,
};

/**
 * Transliterate between any Indic Brahmic script via Devanagari base offsets
 */
function indicToIndic(text: string, fromScript: ScriptId, toScript: ScriptId): string {
  const fromBase = INDIC_OFFSETS[fromScript];
  const toBase = INDIC_OFFSETS[toScript];

  if (fromBase === undefined || toBase === undefined) return text;

  let result = "";
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code >= fromBase && code < fromBase + 0x80) {
      const offset = code - fromBase;
      result += String.fromCharCode(toBase + offset);
    } else {
      result += text[i];
    }
  }
  return result;
}

// ──────────────────────────────────────────
// 2. IAST / ITRANS / HK ⇄ DEVANAGARI CONVERTERS
// ──────────────────────────────────────────

const IAST_TO_DEV_MAP: [RegExp, string][] = [
  // Independent vowels
  [/aum/gi, "ॐ"],
  [/om/gi, "ॐ"],
  [/ā/g, "आ"],
  [/ī/g, "ई"],
  [/ū/g, "ऊ"],
  [/ṛ/g, "ऋ"],
  [/ṝ/g, "ॠ"],
  [/ḷ/g, "ऌ"],
  [/ḹ/g, "ॡ"],
  [/ai/g, "ऐ"],
  [/au/g, "औ"],
  [/e/g, "ए"],
  [/o/g, "ओ"],
  [/a/g, "अ"],
  [/i/g, "इ"],
  [/u/g, "उ"],

  // Consonants with virama / halanta
  [/kh/g, "ख्"],
  [/gh/g, "घ्"],
  [/ṅ/g, "ङ्"],
  [/ch/g, "छ्"],
  [/jh/g, "झ्"],
  [/ñ/g, "ञ्"],
  [/ṭh/g, "ठ्"],
  [/ḍh/g, "ढ्"],
  [/ṇ/g, "ण्"],
  [/th/g, "थ्"],
  [/dh/g, "ध्"],
  [/ph/g, "फ्"],
  [/bh/g, "भ्"],
  [/k/g, "क्"],
  [/g/g, "ग्"],
  [/c/g, "च्"],
  [/j/g, "ज्"],
  [/ṭ/g, "ट्"],
  [/ḍ/g, "ड्"],
  [/t/g, "त्"],
  [/d/g, "द्"],
  [/n/g, "न्"],
  [/p/g, "प्"],
  [/b/g, "ब्"],
  [/m/g, "म्"],
  [/y/g, "य्"],
  [/r/g, "र्"],
  [/l/g, "ल्"],
  [/v/g, "व्"],
  [/w/g, "व्"],
  [/ś/g, "श्"],
  [/ṣ/g, "ष्"],
  [/sh/g, "श्"],
  [/s/g, "स्"],
  [/h/g, "ह्"],

  // Modifiers
  [/ṃ/g, "ं"],
  [/ṁ/g, "ं"],
  [/ḥ/g, "ः"],
  [/'/g, "ऽ"],
];

const DEV_TO_IAST_MAP: [RegExp, string][] = [
  // Independent vowels
  [/ॐ/g, "oṁ"],
  [/अ/g, "a"],
  [/आ/g, "ā"],
  [/इ/g, "i"],
  [/ई/g, "ī"],
  [/उ/g, "u"],
  [/ऊ/g, "ū"],
  [/ऋ/g, "ṛ"],
  [/ॠ/g, "ṝ"],
  [/ऌ/g, "ḷ"],
  [/ॡ/g, "ḹ"],
  [/ए/g, "e"],
  [/ऐ/g, "ai"],
  [/ओ/g, "o"],
  [/औ/g, "au"],

  // Consonants (full syllable with inherent 'a')
  [/क/g, "ka"],
  [/ख/g, "kha"],
  [/ग/g, "ga"],
  [/घ/g, "gha"],
  [/ङ/g, "ṅa"],
  [/च/g, "ca"],
  [/छ/g, "cha"],
  [/ज/g, "ja"],
  [/झ/g, "jha"],
  [/ञ/g, "ña"],
  [/ट/g, "ṭa"],
  [/ठ/g, "ṭha"],
  [/ड/g, "ḍa"],
  [/ढ/g, "ḍha"],
  [/ण/g, "ṇa"],
  [/त/g, "ta"],
  [/थ/g, "tha"],
  [/द/g, "da"],
  [/ध/g, "dha"],
  [/न/g, "na"],
  [/प/g, "pa"],
  [/फ/g, "pha"],
  [/ब/g, "ba"],
  [/भ/g, "bha"],
  [/म/g, "ma"],
  [/य/g, "ya"],
  [/र/g, "ra"],
  [/ल/g, "la"],
  [/व/g, "va"],
  [/श/g, "śa"],
  [/ष/g, "ṣa"],
  [/स/g, "sa"],
  [/ह/g, "ha"],

  // Matras (dependent vowel signs replacing inherent 'a')
  [/aा/g, "ā"],
  [/aि/g, "i"],
  [/aी/g, "ī"],
  [/aु/g, "u"],
  [/aू/g, "ū"],
  [/aृ/g, "ṛ"],
  [/aॄ/g, "ṝ"],
  [/aॢ/g, "ḷ"],
  [/aॣ/g, "ḹ"],
  [/aे/g, "e"],
  [/aै/g, "ai"],
  [/aो/g, "o"],
  [/aौ/g, "au"],
  [/a्/g, ""], // Halanta / Virama removes inherent 'a'

  // Modifiers
  [/ं/g, "ṁ"],
  [/ः/g, "ḥ"],
  [/ँ/g, "m̐"],
  [/ऽ/g, "'"],
  [/।/g, "|"],
  [/॥/g, "||"],
];

const IAST_TO_HK_MAP: [RegExp, string][] = [
  [/ā/g, "A"],
  [/ī/g, "I"],
  [/ū/g, "U"],
  [/ṛ/g, "R"],
  [/ṝ/g, "RR"],
  [/ḷ/g, "lR"],
  [/ḹ/g, "lRR"],
  [/ṅ/g, "G"],
  [/ñ/g, "J"],
  [/ṭ/g, "T"],
  [/ḍ/g, "D"],
  [/ṇ/g, "N"],
  [/ś/g, "z"],
  [/ṣ/g, "S"],
  [/ṃ|ṁ/g, "M"],
  [/ḥ/g, "H"],
];

const IAST_TO_ITRANS_MAP: [RegExp, string][] = [
  [/ā/g, "A"],
  [/ī/g, "I"],
  [/ū/g, "U"],
  [/ṛ/g, "R^i"],
  [/ṝ/g, "R^I"],
  [/ḷ/g, "L^i"],
  [/ṅ/g, "~N"],
  [/ñ/g, "~n"],
  [/ṭ/g, "T"],
  [/ḍ/g, "D"],
  [/ṇ/g, "N"],
  [/ś/g, "sh"],
  [/ṣ/g, "Sh"],
  [/ṃ|ṁ/g, "M"],
  [/ḥ/g, "H"],
  [/ca/g, "cha"],
  [/cha/g, "Cha"],
];

const IAST_TO_SLP1_MAP: [RegExp, string][] = [
  [/ā/g, "A"],
  [/ī/g, "I"],
  [/ū/g, "U"],
  [/ṛ/g, "f"],
  [/ṝ/g, "F"],
  [/ḷ/g, "x"],
  [/ḹ/g, "X"],
  [/ai/g, "E"],
  [/au/g, "O"],
  [/ṅ/g, "N"],
  [/ñ/g, "Y"],
  [/ṭ/g, "w"],
  [/ṭh/g, "W"],
  [/ḍ/g, "q"],
  [/ḍh/g, "Q"],
  [/ṇ/g, "R"],
  [/th/g, "T"],
  [/dh/g, "D"],
  [/ph/g, "P"],
  [/bh/g, "B"],
  [/ś/g, "S"],
  [/ṣ/g, "z"],
  [/ṃ|ṁ/g, "M"],
  [/ḥ/g, "H"],
];

/**
 * Convert Devanagari text to standard IAST Romanization
 */
export function devanagariToIast(text: string): string {
  let res = text;
  for (const [regex, rep] of DEV_TO_IAST_MAP) {
    res = res.replace(regex, rep);
  }
  return res;
}

const IAST_CONSONANTS_MAP: Record<string, string> = {
  k: "क",
  kh: "ख",
  g: "ग",
  gh: "घ",
  ṅ: "ङ",
  c: "च",
  ch: "छ",
  j: "ज",
  jh: "झ",
  ñ: "ञ",
  ṭ: "ट",
  ṭh: "ठ",
  ḍ: "ड",
  ḍh: "ढ",
  ṇ: "ण",
  t: "त",
  th: "थ",
  d: "द",
  dh: "ध",
  n: "न",
  p: "प",
  ph: "फ",
  b: "ब",
  bh: "भ",
  m: "म",
  y: "य",
  r: "र",
  l: "ल",
  v: "व",
  w: "व",
  ś: "श",
  ṣ: "ष",
  s: "स",
  h: "ह",
  sh: "श",
  Sh: "ष",
};

const IAST_INDEPENDENT_VOWELS: Record<string, string> = {
  ā: "आ",
  i: "इ",
  ī: "ई",
  u: "उ",
  ū: "ऊ",
  ṛ: "ऋ",
  ṝ: "ॠ",
  ḷ: "ऌ",
  ḹ: "ॡ",
  e: "ए",
  ai: "ऐ",
  o: "ओ",
  au: "औ",
  a: "अ",
};

const IAST_MATRAS_MAP: Record<string, string> = {
  ā: "ा",
  i: "ि",
  ī: "ी",
  u: "ु",
  ū: "ू",
  ṛ: "ृ",
  ṝ: "ॄ",
  ḷ: "ॢ",
  ḹ: "ॣ",
  e: "े",
  ai: "ै",
  o: "ो",
  au: "ौ",
  a: "", // inherent
};

/**
 * Robust Syllabic IAST / Latin to Devanagari Converter
 */
export function iastToDevanagari(text: string): string {
  if (!text) return "";
  let out = "";
  const len = text.length;
  let i = 0;

  while (i < len) {
    // Check OM
    if (
      text.substring(i, i + 2).toLowerCase() === "om" ||
      text.substring(i, i + 3).toLowerCase() === "aum" ||
      text.substring(i, i + 2) === "oṁ" ||
      text.substring(i, i + 2) === "oṃ"
    ) {
      out += "ॐ";
      i += text.substring(i, i + 3).toLowerCase() === "aum" ? 3 : 2;
      continue;
    }

    // Check special symbols
    const ch = text[i];
    if (ch === "'" || ch === "’") {
      out += "ऽ";
      i++;
      continue;
    }
    if (ch === "ṃ" || ch === "ṁ" || ch === "M") {
      out += "ं";
      i++;
      continue;
    }
    if (ch === "ḥ" || ch === "H") {
      out += "ः";
      i++;
      continue;
    }
    if (ch === "|" && text[i + 1] === "|") {
      out += "॥";
      i += 2;
      continue;
    }
    if (ch === "|") {
      out += "।";
      i++;
      continue;
    }
    if (/\s|[.,!?;:\-()"0-9]/.test(ch)) {
      out += ch;
      i++;
      continue;
    }

    // Check two-char consonant (e.g. kh, gh, ch, jh, ṭh, ḍh, th, dh, ph, bh, sh, Sh)
    let cons = "";
    let consLen = 0;
    const two = text.substring(i, i + 2);
    const one = text.substring(i, i + 1);

    if (IAST_CONSONANTS_MAP[two]) {
      cons = IAST_CONSONANTS_MAP[two];
      consLen = 2;
    } else if (IAST_CONSONANTS_MAP[one]) {
      cons = IAST_CONSONANTS_MAP[one];
      consLen = 1;
    }

    if (cons) {
      i += consLen;

      // Check following vowel/matra
      let matra = "";
      let matraLen = 0;
      const nextTwoVowel = text.substring(i, i + 2);
      const nextOneVowel = text.substring(i, i + 1);

      if (IAST_MATRAS_MAP[nextTwoVowel] !== undefined) {
        matra = IAST_MATRAS_MAP[nextTwoVowel];
        matraLen = 2;
      } else if (IAST_MATRAS_MAP[nextOneVowel] !== undefined) {
        matra = IAST_MATRAS_MAP[nextOneVowel];
        matraLen = 1;
      }

      if (matraLen > 0) {
        out += cons + matra;
        i += matraLen;
      } else {
        // No following vowel -> add halanta (virama)
        out += cons + "्";
      }
    } else {
      // Independent vowel
      let vow = "";
      let vowLen = 0;
      const nextTwoVow = text.substring(i, i + 2);
      const nextOneVow = text.substring(i, i + 1);

      if (IAST_INDEPENDENT_VOWELS[nextTwoVow]) {
        vow = IAST_INDEPENDENT_VOWELS[nextTwoVow];
        vowLen = 2;
      } else if (IAST_INDEPENDENT_VOWELS[nextOneVow]) {
        vow = IAST_INDEPENDENT_VOWELS[nextOneVow];
        vowLen = 1;
      }

      if (vow) {
        out += vow;
        i += vowLen;
      } else {
        out += ch;
        i++;
      }
    }
  }

  // Remove trailing virama before spaces or end of words if preceded by plain word
  return out;
}

/**
 * Universal Transliterate between any pair of supported scripts
 */
export function transliterate(text: string, fromScript: ScriptId, toScript: ScriptId): string {
  if (!text || !text.trim()) return "";
  if (fromScript === toScript) return text;

  // Step 1: Normalize input to Devanagari first
  let devanagariText = text;

  if (fromScript === "devanagari") {
    devanagariText = text;
  } else if (fromScript === "iast") {
    devanagariText = iastToDevanagari(text);
  } else if (fromScript === "hk") {
    // Convert HK to IAST then Devanagari
    let iast = text
      .replace(/A/g, "ā")
      .replace(/I/g, "ī")
      .replace(/U/g, "ū")
      .replace(/R/g, "ṛ")
      .replace(/G/g, "ṅ")
      .replace(/J/g, "ñ")
      .replace(/T/g, "ṭ")
      .replace(/D/g, "ḍ")
      .replace(/N/g, "ṇ")
      .replace(/z/g, "ś")
      .replace(/S/g, "ṣ")
      .replace(/M/g, "ṁ")
      .replace(/H/g, "ḥ");
    devanagariText = iastToDevanagari(iast);
  } else if (fromScript === "itrans") {
    let iast = text
      .replace(/A/g, "ā")
      .replace(/I/g, "ī")
      .replace(/U/g, "ū")
      .replace(/R\^i/g, "ṛ")
      .replace(/~N/g, "ṅ")
      .replace(/~n/g, "ñ")
      .replace(/T/g, "ṭ")
      .replace(/D/g, "ḍ")
      .replace(/N/g, "ṇ")
      .replace(/sh/g, "ś")
      .replace(/Sh/g, "ṣ")
      .replace(/M/g, "ṁ")
      .replace(/H/g, "ḥ");
    devanagariText = iastToDevanagari(iast);
  } else {
    // From regional Indic to Devanagari
    devanagariText = indicToIndic(text, fromScript, "devanagari");
  }

  // Step 2: Convert Devanagari to target script
  if (toScript === "devanagari") {
    return devanagariText;
  }

  const iast = devanagariToIast(devanagariText);

  if (toScript === "iast") {
    return iast;
  }

  if (toScript === "hk") {
    let res = iast;
    for (const [r, rep] of IAST_TO_HK_MAP) res = res.replace(r, rep);
    return res;
  }

  if (toScript === "itrans") {
    let res = iast;
    for (const [r, rep] of IAST_TO_ITRANS_MAP) res = res.replace(r, rep);
    return res;
  }

  if (toScript === "slp1") {
    let res = iast;
    for (const [r, rep] of IAST_TO_SLP1_MAP) res = res.replace(r, rep);
    return res;
  }

  // Regional Indic Script
  return indicToIndic(devanagariText, "devanagari", toScript);
}

/**
 * Transliterate input into all 13 supported scripts and Romanization systems simultaneously
 */
export function transliterateToAll(
  text: string,
  fromScript: ScriptId = "devanagari",
): Record<ScriptId, string> {
  const result: Partial<Record<ScriptId, string>> = {};
  const scripts = Object.keys(SCRIPT_REGISTRY) as ScriptId[];

  for (const script of scripts) {
    result[script] = transliterate(text, fromScript, script);
  }

  return result as Record<ScriptId, string>;
}

// ──────────────────────────────────────────
// 3. CLASSICAL PRESETS
// ──────────────────────────────────────────

export interface TransliterationPreset {
  id: string;
  title: string;
  category: string;
  text: string;
  description: string;
}

export const PRESET_TRANSLITERATION_TEXTS: TransliterationPreset[] = [
  {
    id: "gayatri",
    title: "गायत्री मन्त्र (Gayatri Mantra)",
    category: "वैदिक मन्त्र",
    text: "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥",
    description: "ऋग्वेद का सर्वोत्कृष्ट सावित्री मन्त्र।",
  },
  {
    id: "mahamrityunjaya",
    title: "महामृत्युंजय मन्त्र (Mahamrityunjaya)",
    category: "वैदिक मन्त्र",
    text: "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात् ॥",
    description: "आयु, आरोग्य और मोक्ष प्रदायक भगवान शिव का मन्त्र।",
  },
  {
    id: "shanti-mantra",
    title: "शान्ति मन्त्र (Om Sahana Vavatu)",
    category: "उपनिषद् मन्त्र",
    text: "ॐ सह नाववतु। सह नौ भुनक्तु। सह वीर्यं करवावहै। तेजस्वि नावधीतमस्तु मा विद्विषावहै। ॐ शान्तिः शान्तिः शान्तिः ॥",
    description: "कठोपनिषद् एवं तैत्तिरीयोपनिषद् का विद्याध्ययन शान्ति पाठ।",
  },
  {
    id: "gita-2-47",
    title: "कर्मण्येवाधिकारस्ते (Gita 2.47)",
    category: "भगवद्गीता",
    text: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥",
    description: "श्रीमद्भगवद्गीता का निष्काम कर्मयोग सूत्र।",
  },
  {
    id: "shiva-tandava",
    title: "शिवताण्डव स्तोत्रम् (Shiva Tandava)",
    category: "स्तोत्रम्",
    text: "जटाटवीगलज्जलप्रवाहपावितस्थले गलेऽवलम्ब्य लम्बितां भुजङ्गतुङ्गमालिकाम्। डमड्डमड्डमड्डमन्निनादवड्डमर्वयं चकार चण्डताण्डवं तनोतु नः शिवः शिवम् ॥",
    description: "रावण विरचित भगवान शिव का ओजस्वी स्तोत्र।",
  },
  {
    id: "ganesha-shloka",
    title: "वक्रतुण्ड महाकाय (Ganesha Vandana)",
    category: "स्तुति",
    text: "वक्रतुण्ड महाकाय सूर्यकोटिसमप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥",
    description: "विघ्नहर्ता श्री गणेश जी की मंगलकारी प्रार्थना।",
  },
];
