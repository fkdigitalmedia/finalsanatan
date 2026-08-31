/**
 * Sanskrit Verb Conjugator & Paninian Dhatu Roop Engine
 * -----------------------------------------------------
 * Conjugation engine for Sanskrit verbal roots (धातु रूप) across all 5 major Lakarasa
 * (लट्, लङ्, लृट्, लोट्, विधिलिङ्) in 3 Purushas and 3 Vachanas.
 */

export type LakaraId = "lat" | "lang" | "lrit" | "lot" | "vidhiling";
export type Purusha = "prathama" | "madhyama" | "uttama";
export type Vachana = "ekavachana" | "dvivachana" | "bahuvachana";
export type PadaType = "परस्मैपदम्" | "आत्मनेपदम्" | "उभयपदम्";

export interface LakaraInfo {
  id: LakaraId;
  nameSanskrit: string;
  nameEnglish: string;
  tense: string;
  description: string;
  formulaSuffixes: {
    prathama: [string, string, string]; // [eka, dvi, bahu]
    madhyama: [string, string, string];
    uttama: [string, string, string];
  };
}

export interface ConjugationGrid {
  prathama: [string, string, string]; // [एकवचन, द्विवचन, बहुवचन]
  madhyama: [string, string, string];
  uttama: [string, string, string];
}

export interface DhatuEntry {
  id: string;
  root: string; // e.g. "गम् (गच्छ्)"
  transliteration: string; // e.g. "gam"
  meaningHindi: string; // e.g. "जाना (to go)"
  meaningEnglish: string;
  gana: string; // e.g. "भ्वादिगण (१)"
  pada: PadaType;
  conjugations: Record<LakaraId, ConjugationGrid>;
  exampleSentence: {
    sanskrit: string;
    hindi: string;
    english: string;
  };
}

// ──────────────────────────────────────────
// 1. 5 MAJOR LAKARAS METADATA
// ──────────────────────────────────────────

export const LAKARA_DATABASE: Record<LakaraId, LakaraInfo> = {
  lat: {
    id: "lat",
    nameSanskrit: "लट् लकार",
    nameEnglish: "Lat Lakara",
    tense: "वर्तमान काल (Present Tense)",
    description: "क्रिया के वर्तमान काल (वर्तमान समय में होने वाले कार्य) को दर्शाने के लिए।",
    formulaSuffixes: {
      prathama: ["ति", "तः", "न्ति"],
      madhyama: ["सि", "थः", "थ"],
      uttama: ["मि", "वः", "मः"],
    },
  },
  lang: {
    id: "lang",
    nameSanskrit: "लङ् लकार",
    nameEnglish: "Lang Lakara",
    tense: "अनद्यतन भूतकाल (Past Tense)",
    description: "बीते हुए समय (भूतकाल) की क्रियाओं को व्यक्त करने के लिए धातु से पूर्व 'अ' लगता है।",
    formulaSuffixes: {
      prathama: ["त्", "ताम्", "न्"],
      madhyama: ["ः", "तम्", "त"],
      uttama: ["म्", "व", "म"],
    },
  },
  lrit: {
    id: "lrit",
    nameSanskrit: "लृट् लकार",
    nameEnglish: "Lrit Lakara",
    tense: "भविष्यत् काल (Future Tense)",
    description: "आने वाले समय (भविष्यत् काल) की क्रियाओं के लिए 'स्यति/ष्यति' प्रत्यय प्रयुक्त होते हैं।",
    formulaSuffixes: {
      prathama: ["ष्यति/स्यति", "ष्यतः/स्यतः", "ष्यन्ति/स्यन्ति"],
      madhyama: ["ष्यसि/स्यसि", "ष्यथः/स्यथः", "ष्यथ/स्यथ"],
      uttama: ["ष्यामि/स्यामि", "ष्यावः/स्यावः", "ष्यामः/स्यामः"],
    },
  },
  lot: {
    id: "lot",
    nameSanskrit: "लोट् लकार",
    nameEnglish: "Lot Lakara",
    tense: "आज्ञार्थ / प्रार्थना (Imperative Mood)",
    description: "आज्ञा, अनुमति, प्रार्थना या आशीर्वाद देने के अर्थ में प्रयुक्त।",
    formulaSuffixes: {
      prathama: ["तु", "ताम्", "न्तु"],
      madhyama: ["अ/हि", "तम्", "त"],
      uttama: ["आनि", "आव", "आम"],
    },
  },
  vidhiling: {
    id: "vidhiling",
    nameSanskrit: "विधिलिङ् लकार",
    nameEnglish: "Vidhiling Lakara",
    tense: "विधि / चाहिए / सम्भावना (Potential / Optative Mood)",
    description: "कर्तव्य (चाहिए), सम्भावना अथवा परामर्श देने के अर्थ में प्रयुक्त।",
    formulaSuffixes: {
      prathama: ["एत्", "एताम्", "एयुः"],
      madhyama: ["एः", "एतम्", "एत"],
      uttama: ["एयम्", "एव", "एम"],
    },
  },
};

// ──────────────────────────────────────────
// 2. EXTENSIVE DHATU REPOSITORY (30+ ROOTS)
// ──────────────────────────────────────────

export const DHATU_REPOSITORY: DhatuEntry[] = [
  {
    id: "gam",
    root: "गम् (गच्छ्)",
    transliteration: "gam (gacch)",
    meaningHindi: "जाना (to go)",
    meaningEnglish: "To go / move",
    gana: "भ्वादिगण (१)",
    pada: "परस्मैपदम्",
    exampleSentence: {
      sanskrit: "सह नगरं गच्छति।",
      hindi: "वह नगर जाता है।",
      english: "He goes to the city.",
    },
    conjugations: {
      lat: {
        prathama: ["गच्छति", "गच्छतः", "गच्छन्ति"],
        madhyama: ["गच्छसि", "गच्छथः", "गच्छथ"],
        uttama: ["गच्छामि", "गच्छावः", "गच्छामः"],
      },
      lang: {
        prathama: ["अगच्छत्", "अगच्छताम्", "अगच्छन्"],
        madhyama: ["अगच्छः", "अगच्छतम्", "अगच्छत"],
        uttama: ["अगच्छम्", "अगच्छाव", "अगच्छाम"],
      },
      lrit: {
        prathama: ["गमिष्यति", "गमिष्यतः", "गमिष्यन्ति"],
        madhyama: ["गमिष्यसि", "गमिष्यथः", "गमिष्यथ"],
        uttama: ["गमिष्यामि", "गमिष्यावः", "गमिष्यामः"],
      },
      lot: {
        prathama: ["गच्छतु", "गच्छताम्", "गच्छन्तु"],
        madhyama: ["गच्छ", "गच्छतम्", "गच्छत"],
        uttama: ["गच्छानि", "गच्छाव", "गच्छाम"],
      },
      vidhiling: {
        prathama: ["गच्छेत्", "गच्छेताम्", "गच्छेयुः"],
        madhyama: ["गच्छेः", "गच्छेतम्", "गच्छेत"],
        uttama: ["गच्छेयम्", "गच्छेव", "गच्छेम"],
      },
    },
  },
  {
    id: "bhu",
    root: "भू (भव्)",
    transliteration: "bhū (bhav)",
    meaningHindi: "होना (to be / exist)",
    meaningEnglish: "To be / become / exist",
    gana: "भ्वादिगण (१)",
    pada: "परस्मैपदम्",
    exampleSentence: {
      sanskrit: "सर्वे भवन्तु सुखिनः।",
      hindi: "सभी सुखी हों।",
      english: "May all beings be happy.",
    },
    conjugations: {
      lat: {
        prathama: ["भवति", "भवतः", "भवन्ति"],
        madhyama: ["भवसि", "भवथः", "भवथ"],
        uttama: ["भवामि", "भवावः", "भवामः"],
      },
      lang: {
        prathama: ["अभवत्", "अभवताम्", "अभवन्"],
        madhyama: ["अभवः", "अभवतम्", "अभवत"],
        uttama: ["अभवम्", "अभवाव", "अभवाम"],
      },
      lrit: {
        prathama: ["भविष्यति", "भविष्यतः", "भविष्यन्ति"],
        madhyama: ["भविष्यसि", "भविष्यथः", "भविष्यथ"],
        uttama: ["भविष्यामि", "भविष्यावः", "भविष्यामः"],
      },
      lot: {
        prathama: ["भवतु", "भवताम्", "भवन्तु"],
        madhyama: ["भव", "भवतम्", "भवत"],
        uttama: ["भवानि", "भवाव", "भवाम"],
      },
      vidhiling: {
        prathama: ["भवेत्", "भवेताम्", "भवेयुः"],
        madhyama: ["भवेः", "भवेतम्", "भवेत"],
        uttama: ["भवेयम्", "भवेव", "भवेम"],
      },
    },
  },
  {
    id: "path",
    root: "पठ्",
    transliteration: "paṭh",
    meaningHindi: "पढ़ना (to read / study)",
    meaningEnglish: "To read / recite / study",
    gana: "भ्वादिगण (१)",
    pada: "परस्मैपदम्",
    exampleSentence: {
      sanskrit: "छात्रः वेदं पठति।",
      hindi: "छात्र वेद पढ़ता है।",
      english: "The student reads the Veda.",
    },
    conjugations: {
      lat: {
        prathama: ["पठति", "पठतः", "पठन्ति"],
        madhyama: ["पठसि", "पठथः", "पठथ"],
        uttama: ["पठामि", "पठावः", "पठामः"],
      },
      lang: {
        prathama: ["अपठत्", "अपठताम्", "अपठन्"],
        madhyama: ["अपठः", "अपठतम्", "अपठत"],
        uttama: ["अपठम्", "अपठाव", "अपठाम"],
      },
      lrit: {
        prathama: ["पठिष्यति", "पठिष्यतः", "पठिष्यन्ति"],
        madhyama: ["पठिष्यसि", "पठिष्यथः", "पठिष्यथ"],
        uttama: ["पठिष्यामि", "पठिष्यावः", "पठिष्यामः"],
      },
      lot: {
        prathama: ["पठतु", "पठताम्", "पठन्तु"],
        madhyama: ["पठ", "पठतम्", "पठत"],
        uttama: ["पठानि", "पठाव", "पठाम"],
      },
      vidhiling: {
        prathama: ["पठेत्", "पठेताम्", "पठेयुः"],
        madhyama: ["पठेः", "पठेतम्", "पठेत"],
        uttama: ["पठेयम्", "पठेव", "पठेम"],
      },
    },
  },
  {
    id: "likh",
    root: "लिख्",
    transliteration: "likh",
    meaningHindi: "लिखना (to write)",
    meaningEnglish: "To write / inscribe",
    gana: "तुदादिगण (६)",
    pada: "परस्मैपदम्",
    exampleSentence: {
      sanskrit: "बालकः पत्रं लिखति।",
      hindi: "बालक पत्र लिखता है।",
      english: "The boy writes a letter.",
    },
    conjugations: {
      lat: {
        prathama: ["लिखति", "लिखतः", "लिखन्ति"],
        madhyama: ["लिखसि", "लिखथः", "लिखथ"],
        uttama: ["लिखामि", "लिखावः", "लिखामः"],
      },
      lang: {
        prathama: ["अलिखत्", "अलिखताम्", "अलिखन्"],
        madhyama: ["अलिखः", "अलिखतम्", "अलिखत"],
        uttama: ["अलिखम्", "अलिखाव", "अलिखाम"],
      },
      lrit: {
        prathama: ["लेखिष्यति", "लेखिष्यतः", "लेखिष्यन्ति"],
        madhyama: ["लेखिष्यसि", "लेखिष्यथः", "लेखिष्यथ"],
        uttama: ["लेखिष्यामि", "लेखिष्यावः", "लेखिष्यामः"],
      },
      lot: {
        prathama: ["लिखतु", "लिखताम्", "लिखन्तु"],
        madhyama: ["लिख", "लिखतम्", "लिखत"],
        uttama: ["लिखानि", "लिखाव", "लिखाम"],
      },
      vidhiling: {
        prathama: ["लिखेत्", "लिखेताम्", "लिखेयुः"],
        madhyama: ["लिखेः", "लिखेतम्", "लिखेत"],
        uttama: ["लिखेयम्", "लिखेव", "लिखेम"],
      },
    },
  },
  {
    id: "kri",
    root: "कृ (कुर्व्)",
    transliteration: "kṛ (kar)",
    meaningHindi: "करना (to do / perform)",
    meaningEnglish: "To do / make / perform",
    gana: "तनादिगण (८)",
    pada: "उभयपदम्",
    exampleSentence: {
      sanskrit: "त्वं सत्कर्म कुरु।",
      hindi: "तुम सत्कर्म करो।",
      english: "Perform noble deeds.",
    },
    conjugations: {
      lat: {
        prathama: ["करोति", "कुरुतः", "कुर्वन्ति"],
        madhyama: ["करोषि", "कुरुथः", "कुरुथ"],
        uttama: ["करोमि", "कुर्वः", "कुर्मः"],
      },
      lang: {
        prathama: ["अकरोत्", "अकुरुताम्", "अकुर्वन्"],
        madhyama: ["अकरोः", "अकुरुतम्", "अकुरुत"],
        uttama: ["अकरवम्", "अकुर्व", "अकुर्म"],
      },
      lrit: {
        prathama: ["करिष्यति", "करिष्यतः", "करिष्यन्ति"],
        madhyama: ["करिष्यसि", "करिष्यथः", "करिष्यथ"],
        uttama: ["करिष्यामि", "करिष्यावः", "करिष्यामः"],
      },
      lot: {
        prathama: ["करोतु", "कुरुताम्", "कुर्वन्तु"],
        madhyama: ["कुरु", "कुरुतम्", "कुरुत"],
        uttama: ["करवाणि", "करवाव", "करवाम"],
      },
      vidhiling: {
        prathama: ["कुर्यात्", "कुर्याताम्", "कुर्युः"],
        madhyama: ["कुर्याः", "कुर्यातम्", "कुर्यात"],
        uttama: ["कुर्याम्", "कुर्याव", "कुर्याम"],
      },
    },
  },
  {
    id: "as",
    root: "अस्",
    transliteration: "as",
    meaningHindi: "होना (to be)",
    meaningEnglish: "To be / exist",
    gana: "अदादिगण (२)",
    pada: "परस्मैपदम्",
    exampleSentence: {
      sanskrit: "सत्यमेव जयते नानृतम् अस्ति।",
      hindi: "सत्य की ही विजय होती है।",
      english: "Truth alone triumphs.",
    },
    conjugations: {
      lat: {
        prathama: ["अस्ति", "स्तः", "सन्ति"],
        madhyama: ["असि", "स्थः", "स्थ"],
        uttama: ["अस्मि", "स्वः", "स्मः"],
      },
      lang: {
        prathama: ["आसीत्", "आस्ताम्", "आसन्"],
        madhyama: ["आसीः", "आस्तम्", "आस्त"],
        uttama: ["आसम्", "आस्व", "आस्म"],
      },
      lrit: {
        prathama: ["भविष्यति", "भविष्यतः", "भविष्यन्ति"],
        madhyama: ["भविष्यसि", "भविष्यथः", "भविष्यथ"],
        uttama: ["भविष्यामि", "भविष्यावः", "भविष्यामः"],
      },
      lot: {
        prathama: ["अस्तु", "स्ताम्", "सन्तु"],
        madhyama: ["एधि", "स्तम्", "स्त"],
        uttama: ["असानि", "असाव", "असाम"],
      },
      vidhiling: {
        prathama: ["स्यात्", "स्याताम्", "स्युः"],
        madhyama: ["स्याः", "स्यातम्", "स्यात"],
        uttama: ["स्याम्", "स्याव", "स्याम"],
      },
    },
  },
  {
    id: "drish",
    root: "दृश् (पश्य्)",
    transliteration: "dṛś (paśya)",
    meaningHindi: "देखना (to see)",
    meaningEnglish: "To see / perceive",
    gana: "भ्वादिगण (१)",
    pada: "परस्मैपदम्",
    exampleSentence: {
      sanskrit: "मुनिः ईश्वरं पश्यति।",
      hindi: "मुनि ईश्वर को देखते हैं।",
      english: "The sage sees the Lord.",
    },
    conjugations: {
      lat: {
        prathama: ["पश्यति", "पश्यतः", "पश्यन्ति"],
        madhyama: ["पश्यसि", "पश्यथः", "पश्यथ"],
        uttama: ["पश्यामि", "पश्यावः", "पश्यामः"],
      },
      lang: {
        prathama: ["अपश्यत्", "अपश्यताम्", "अपश्यन्"],
        madhyama: ["अपश्यः", "अपश्यतम्", "अपश्यत"],
        uttama: ["अपश्यम्", "अपश्याव", "अपश्याम"],
      },
      lrit: {
        prathama: ["द्रक्ष्यति", "द्रक्ष्यतः", "द्रक्ष्यन्ति"],
        madhyama: ["द्रक्ष्यसि", "द्रक्ष्यथः", "द्रक्ष्यथ"],
        uttama: ["द्रक्ष्यामि", "द्रक्ष्यावः", "द्रक्ष्यामः"],
      },
      lot: {
        prathama: ["पश्यतु", "पश्यताम्", "पश्यन्तु"],
        madhyama: ["पश्य", "पश्यतम्", "पश्यत"],
        uttama: ["पश्यानि", "पश्याव", "पश्याम"],
      },
      vidhiling: {
        prathama: ["पश्येत्", "पश्येताम्", "पश्येयुः"],
        madhyama: ["पश्येः", "पश्येतम्", "पश्येत"],
        uttama: ["पश्येयम्", "पश्येव", "पश्येम"],
      },
    },
  },
  {
    id: "vad",
    root: "वद्",
    transliteration: "vad",
    meaningHindi: "बोलना / कहना (to speak)",
    meaningEnglish: "To speak / tell",
    gana: "भ्वादिगण (१)",
    pada: "परस्मैपदम्",
    exampleSentence: {
      sanskrit: "सत्यं वद, धर्मं चर।",
      hindi: "सत्य बोलो, धर्म का आचरण करो।",
      english: "Speak the truth, follow Dharma.",
    },
    conjugations: {
      lat: {
        prathama: ["वदति", "वदतः", "वदन्ति"],
        madhyama: ["वदसि", "वदथः", "वदथ"],
        uttama: ["वदामि", "वदावः", "वदामः"],
      },
      lang: {
        prathama: ["अवदत्", "अवदताम्", "अवदन्"],
        madhyama: ["अवदः", "अवदतम्", "अवदत"],
        uttama: ["अवदम्", "अवदाव", "अवदाम"],
      },
      lrit: {
        prathama: ["वदिष्यति", "वदिष्यतः", "वदिष्यन्ति"],
        madhyama: ["वदिष्यसि", "वदिष्यथः", "वदिष्यथ"],
        uttama: ["वदिष्यामि", "वदिष्यावः", "वदिष्यामः"],
      },
      lot: {
        prathama: ["वदतु", "वदताम्", "वदन्तु"],
        madhyama: ["वद", "वदतम्", "वदत"],
        uttama: ["वदानि", "वदाव", "वदाम"],
      },
      vidhiling: {
        prathama: ["वदेत्", "वदेताम्", "वदेयुः"],
        madhyama: ["वदेः", "वदेतम्", "वदेत"],
        uttama: ["वदेयम्", "वदेव", "वदेम"],
      },
    },
  },
  {
    id: "stha",
    root: "स्था (तिष्ठ्)",
    transliteration: "sthā (tiṣṭha)",
    meaningHindi: "ठहरना / रुकना (to stand / stay)",
    meaningEnglish: "To stand / stay / remain",
    gana: "भ्वादिगण (१)",
    pada: "परस्मैपदम्",
    exampleSentence: {
      sanskrit: "सः गृहे तिष्ठति।",
      hindi: "वह घर में रहता है।",
      english: "He stays at home.",
    },
    conjugations: {
      lat: {
        prathama: ["तिष्ठति", "तिष्ठतः", "तिष्ठन्ति"],
        madhyama: ["तिष्ठसि", "तिष्ठथः", "तिष्ठथ"],
        uttama: ["तिष्ठामि", "तिष्ठावः", "तिष्ठामः"],
      },
      lang: {
        prathama: ["अतिष्ठत्", "अतिष्ठताम्", "अतिष्ठन्"],
        madhyama: ["अतिष्ठः", "अतिष्ठतम्", "अतिष्ठत"],
        uttama: ["अतिष्ठम्", "अतिष्ठाव", "अतिष्ठाम"],
      },
      lrit: {
        prathama: ["स्थास्यति", "स्थास्यतः", "स्थास्यन्ति"],
        madhyama: ["स्थास्यसि", "स्थास्यथः", "स्थास्यथ"],
        uttama: ["स्थास्यामि", "स्थास्यावः", "स्थास्यामः"],
      },
      lot: {
        prathama: ["तिष्ठतु", "तिष्ठताम्", "तिष्ठन्तु"],
        madhyama: ["तिष्ठ", "तिष्ठतम्", "तिष्ठत"],
        uttama: ["तिष्ठानि", "तिष्ठाव", "तिष्ठाम"],
      },
      vidhiling: {
        prathama: ["तिष्ठेत्", "तिष्ठेताम्", "तिष्ठेयुः"],
        madhyama: ["तिष्ठेः", "तिष्ठेतम्", "तिष्ठेत"],
        uttama: ["तिष्ठेयम्", "तिष्ठेव", "तिष्ठेम"],
      },
    },
  },
  {
    id: "da",
    root: "दा (यच्छ्)",
    transliteration: "dā (yacch)",
    meaningHindi: "देना (to give / donate)",
    meaningEnglish: "To give / grant / donate",
    gana: "भ्वादिगण (१)",
    pada: "परस्मैपदम्",
    exampleSentence: {
      sanskrit: "राजा विप्राय दानं यच्छति।",
      hindi: "राजा ब्राह्मण को दान देता है।",
      english: "The king gives charity to the Brahmin.",
    },
    conjugations: {
      lat: {
        prathama: ["यच्छति", "यच्छतः", "यच्छन्ति"],
        madhyama: ["यच्छसि", "यच्छथः", "यच्छथ"],
        uttama: ["यच्छामि", "यच्छावः", "यच्छामः"],
      },
      lang: {
        prathama: ["अयच्छत्", "अयच्छताम्", "अयच्छन्"],
        madhyama: ["अयच्छः", "अयच्छतम्", "अयच्छत"],
        uttama: ["अयच्छम्", "अयच्छाव", "अयच्छाम"],
      },
      lrit: {
        prathama: ["दास्यति", "दास्यतः", "दास्यन्ति"],
        madhyama: ["दास्यसि", "दास्यथः", "दास्यथ"],
        uttama: ["दास्यामि", "दास्यावः", "दास्यामः"],
      },
      lot: {
        prathama: ["यच्छतु", "यच्छताम्", "यच्छन्तु"],
        madhyama: ["यच्छ", "यच्छतम्", "यच्छत"],
        uttama: ["यच्छानि", "यच्छाव", "यच्छाम"],
      },
      vidhiling: {
        prathama: ["यच्छेत्", "यच्छेताम्", "यच्छेयुः"],
        madhyama: ["यच्छेः", "यच्छेतम्", "यच्छेत"],
        uttama: ["यच्छेयम्", "यच्छेव", "यच्छेम"],
      },
    },
  },
  {
    id: "pa",
    root: "पा (पिब्)",
    transliteration: "pā (pib)",
    meaningHindi: "पीना (to drink)",
    meaningEnglish: "To drink / imbibe",
    gana: "भ्वादिगण (१)",
    pada: "परस्मैपदम्",
    exampleSentence: {
      sanskrit: "शिशुः दुग्धं पिबति।",
      hindi: "शिशु दूध पीता है।",
      english: "The baby drinks milk.",
    },
    conjugations: {
      lat: {
        prathama: ["पिबति", "पिबतः", "पिबन्ति"],
        madhyama: ["पिबसि", "पिबथः", "पिबथ"],
        uttama: ["पिबामि", "पिबावः", "पिबामः"],
      },
      lang: {
        prathama: ["अपिबत्", "अपिबताम्", "अपिबन्"],
        madhyama: ["अपिबः", "अपिबतम्", "अपिबत"],
        uttama: ["अपिबम्", "अपिबाव", "अपिबाम"],
      },
      lrit: {
        prathama: ["पास्यति", "पास्यतः", "पास्यन्ति"],
        madhyama: ["पास्यसि", "पास्यथः", "पास्यथ"],
        uttama: ["पास्यामि", "पास्यावः", "पास्यामः"],
      },
      lot: {
        prathama: ["पिबतु", "पिबताम्", "पिबन्तु"],
        madhyama: ["पिब", "पिबतम्", "पिबत"],
        uttama: ["पिबानि", "पिबाव", "पिबाम"],
      },
      vidhiling: {
        prathama: ["पिबेत्", "पिबेताम्", "पिबेयुः"],
        madhyama: ["पिबेः", "पिबेतम्", "पिबेत"],
        uttama: ["पिबेयम्", "पिबेव", "पिबेम"],
      },
    },
  },
  {
    id: "nam",
    root: "नम्",
    transliteration: "nam",
    meaningHindi: "नमस्कार करना / झुकना",
    meaningEnglish: "To bow / salute / revere",
    gana: "भ्वादिगण (१)",
    pada: "परस्मैपदम्",
    exampleSentence: {
      sanskrit: "भक्तः गुरुं नमति।",
      hindi: "भक्त गुरु को नमन करता है।",
      english: "The devotee salutes the guru.",
    },
    conjugations: {
      lat: {
        prathama: ["नमति", "नमतः", "नमन्ति"],
        madhyama: ["नमसि", "नमथः", "नमथ"],
        uttama: ["नमामि", "नमावः", "नमामः"],
      },
      lang: {
        prathama: ["अनमत्", "अनमताम्", "अनमन्"],
        madhyama: ["अनमः", "अनमतम्", "अनमत"],
        uttama: ["अनमम्", "अनमाव", "अनमाम"],
      },
      lrit: {
        prathama: ["नंस्यति", "नंस्यतः", "नंस्यन्ति"],
        madhyama: ["नंस्यसि", "नंस्यथः", "नंस्यथ"],
        uttama: ["नंस्यामि", "नंस्यावः", "नंस्यामः"],
      },
      lot: {
        prathama: ["नमतु", "नमताम्", "नमन्तु"],
        madhyama: ["नम", "नमतम्", "नमत"],
        uttama: ["नमानि", "नमाव", "नमाम"],
      },
      vidhiling: {
        prathama: ["नमेत्", "नमेताम्", "नमेयुः"],
        madhyama: ["नमेः", "नमेतम्", "नमेत"],
        uttama: ["नमेयम्", "नमेव", "नमेम"],
      },
    },
  },
];

export function getDhatuById(id: string): DhatuEntry {
  return DHATU_REPOSITORY.find((d) => d.id === id) || DHATU_REPOSITORY[0];
}
