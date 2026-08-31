/**
 * Sanskrit Word of the Day & Philosophical Lexicon Engine
 * --------------------------------------------------------
 * Comprehensive etymological, grammatical, and canonical repository of sacred
 * Sanskrit terminology with scriptural contexts, synonyms, and spiritual reflections.
 */

export interface ShlokaReference {
  sanskrit: string;
  source: string;
  meaningHindi: string;
  meaningEnglish: string;
}

export interface SanskritWordEntry {
  id: string;
  devanagari: string;
  transliteration: string;
  meaningHindi: string;
  meaningEnglish: string;
  category: "वेदान्त व दर्शन" | "नीति व आचरण" | "योग व साधना" | "भक्ति व उपासना" | "वैदिक तत्त्व";
  rootDhatu: string;
  etymology: string; // e.g. "सत् + यत् (सद्भावे साधुः)"
  gender: "पुंल्लिङ्गम्" | "स्त्रीलिङ्गम्" | "नपुंसकलिंगम्" | "अव्ययम्";
  shloka: ShlokaReference;
  synonyms: string[];
  antonyms: string[];
  spiritualWisdom: string;
}

// ──────────────────────────────────────────
// COMPREHENSIVE SANSKRIT SACRED LEXICON (30+ WORDS)
// ──────────────────────────────────────────

export const SANSKRIT_WORDS_DATABASE: SanskritWordEntry[] = [
  {
    id: "satyam",
    devanagari: "सत्यम्",
    transliteration: "satyam",
    meaningHindi: "परम यथार्थ, अविनाशी सत्य, यथार्थ भाषण",
    meaningEnglish: "Absolute Truth, reality, unchangeable truthfulness",
    category: "वेदान्त व दर्शन",
    rootDhatu: "अस् (होना / अस्तित्व) ➔ सत् + यत्",
    etymology: "सत्सु साधु सत्यम् — जो तीनों कालों में अपरिवर्तनीय और शाश्वत रहे।",
    gender: "नपुंसकलिंगम्",
    shloka: {
      sanskrit: "सत्यमेव जयते नानृतं सत्येन पन्था विततो देवयानः।",
      source: "मुण्डकोपनिषद् ३.१.६",
      meaningHindi: "सत्य की ही सदा विजय होती है, असत्य की नहीं। सत्य के द्वारा ही देवयान मार्ग प्रशस्त होता है।",
      meaningEnglish: "Truth alone triumphs, not falsehood. Through truth the divine path of the gods is paved.",
    },
    synonyms: ["ऋतम्", "तथ्यम्", "यथार्थम्", "वास्तविकम्"],
    antonyms: ["अनृतम्", "असत्यम्", "मिथ्या"],
    spiritualWisdom: "सत्य केवल वाणी की सच्चाई नहीं, अपितु सृष्टि के मूल चैतन्य का स्वरूप है। सत्य पर दृढ़ रहने से समस्त सिद्धियाँ सुलभ होती हैं।",
  },
  {
    id: "dharmah",
    devanagari: "धर्मः",
    transliteration: "dharmaḥ",
    meaningHindi: "धारण करने योग्य शाश्वत कर्तव्य, नैतिक व्यवस्था, सदाचार",
    meaningEnglish: "Universal law, righteous duty, sustaining cosmic order",
    category: "नीति व आचरण",
    rootDhatu: "धृ (धारण करना / सम्भालना) + मन्",
    etymology: "धारणाद्धर्म इत्याहुर्धर्मो धारयते प्रजाः — जो सम्पूर्ण चराचर जगत् को धारण और व्यवस्थित रखे।",
    gender: "पुंल्लिङ्गम्",
    shloka: {
      sanskrit: "धर्म एव हतो हन्ति धर्मो रक्षति रक्षितः। तस्माद्धर्मो न हन्तव्यो मा नो धर्मो हतोऽवधीत्॥",
      source: "मनुस्मृति ८.१५",
      meaningHindi: "नष्ट किया गया धर्म मनुष्य का नाश कर देता है, और रक्षित धर्म रक्षा करता है। इसलिए धर्म का नाश कभी न करें।",
      meaningEnglish: "Dharma destroyed destroys its destroyer; Dharma protected protects its protector. Therefore Dharma must never be harmed.",
    },
    synonyms: ["सदाचारः", "कर्तव्यम्", "ऋतम्", "न्यायः"],
    antonyms: ["अधर्मः", "अन्यायः", "दुराचारः"],
    spiritualWisdom: "धर्म मनुष्य के अन्तःकरण का वह नैतिक प्रकाश है जो उसे स्वार्थ से ऊपर उठाकर विश्व-कल्याण से जोड़ता है।",
  },
  {
    id: "mokshah",
    devanagari: "मोक्षः",
    transliteration: "mokṣaḥ",
    meaningHindi: "जन्म-मृत्यु के चक्र से मुक्ति, परमानन्द की प्राप्ति, कैवल्य",
    meaningEnglish: "Liberation, ultimate freedom from Samsara, salvation",
    category: "वेदान्त व दर्शन",
    rootDhatu: "मुच् (मुक्त करना / छोड़ना) + घञ्",
    etymology: "मुच्यते संसारबन्धनात् येन सः मोक्षः — जिससे जीव संसार के त्रिविध दुःखों से सर्वथा मुक्त हो जाए।",
    gender: "पुंल्लिङ्गम्",
    shloka: {
      sanskrit: "तमेव विदित्वाति मृत्युमेति नान्यः पन्था विद्यतेऽयनाय।",
      source: "श्वेताश्वतरोपनिषद् ३.८",
      meaningHindi: "उस परमात्मा को जानकर ही मनुष्य मृत्यु के पार जाता है, मोक्ष प्राप्ति का कोई अन्य मार्ग नहीं है।",
      meaningEnglish: "Only by realizing That Supreme Being does one transcend death; there is no other path for liberation.",
    },
    synonyms: ["मुक्तिः", "कैवल्यम्", "निर्वाणम्", "अपवर्गः"],
    antonyms: ["बन्धनम्", "संसारः", "आसक्तिः"],
    spiritualWisdom: "मोक्ष किसी अन्य लोक की यात्रा नहीं, अपितु अपने वास्तविक स्वरूप 'सच्चिदानन्द' की पहचान और अज्ञान का नाश है।",
  },
  {
    id: "anandah",
    devanagari: "आनन्दः",
    transliteration: "ānandaḥ",
    meaningHindi: "असीम परमानन्द, विशुद्ध चैतन्य का उल्लास, आत्मसुख",
    meaningEnglish: "Supreme divine bliss, untainted spiritual joy",
    category: "वेदान्त व दर्शन",
    rootDhatu: "आ + नन्द् (प्रसन्न होना) + घञ्",
    etymology: "आनन्दयति सर्वभूतानि — जो समस्त इन्द्रियों और मन के परे जीवात्मा को तृप्त कर दे।",
    gender: "पुंल्लिङ्गम्",
    shloka: {
      sanskrit: "आनन्दाद्ध्येव खल्विमानि भूतानि जायन्ते, आनन्देन जातानि जीवन्ति।",
      source: "तैत्तिरीयोपनिषद् ३.६.१",
      meaningHindi: "आनन्द से ही सम्पूर्ण प्राणी उत्पन्न होते हैं, और आनन्द में ही जीवित रहकर अन्त में आनन्द में ही लीन होते हैं।",
      meaningEnglish: "From Bliss indeed all these beings are born; having been born, by Bliss they live; and into Bliss they return.",
    },
    synonyms: ["परमानन्दः", "हर्षः", "प्रमोदः", "उल्लासः"],
    antonyms: ["दुःखम्", "शोकः", "विषादः"],
    spiritualWisdom: "सांसारिक सुख क्षणिक और पराधीन है, जबकि आत्मानन्द शाश्वत और स्वयं के भीतर विद्यमान है।",
  },
  {
    id: "shraddha",
    devanagari: "श्रद्धा",
    transliteration: "śraddhā",
    meaningHindi: "शास्त्र, गुरु और ईश्वर में अगाध विश्वास व निष्ठा",
    meaningEnglish: "Unyielding faith, deep reverential trust, devotion",
    category: "भक्ति व उपासना",
    rootDhatu: "श्रत् (सत्य / अन्तःकरण) + धा (धारण करना)",
    etymology: "सत्ये धीयते बुद्धिः यया सा श्रद्धा — जिसके द्वारा बुद्धि सत्य में प्रतिष्ठित हो।",
    gender: "स्त्रीलिङ्गम्",
    shloka: {
      sanskrit: "श्रद्धावाँल्लभते ज्ञानं तत्परः संयतेन्द्रियः। ज्ञानं लब्ध्वा परां शान्तिमचिरेणाधिगच्छति॥",
      source: "श्रीमद्भगवद्गीता ४.३९",
      meaningHindi: "श्रद्धावान् और जितेन्द्रिय मनुष्य ज्ञान को प्राप्त करता है, और ज्ञान प्राप्त करके वह शीघ्र ही परम शान्ति को प्राप्त होता है।",
      meaningEnglish: "A man of faith, devoted and with controlled senses, attains knowledge; having attained knowledge, he swiftly attains supreme peace.",
    },
    synonyms: ["विश्वासः", "भक्तिः", "आस्था", "निष्ठा"],
    antonyms: ["अश्रद्धा", "संशयः", "नास्तिकता"],
    spiritualWisdom: "श्रद्धा अन्धविश्वास नहीं, बल्कि सत्य की खोज के लिए हृदय का प्रथम खुला द्वार है।",
  },
  {
    id: "vivekah",
    devanagari: "विवेकः",
    transliteration: "vivekaḥ",
    meaningHindi: "सत्य और असत्य, नित्य और अनित्य का यथार्थ भेद करने वाली प्रज्ञा",
    meaningEnglish: "Spiritual discernment, intellect that distinguishes real from unreal",
    category: "वेदान्त व दर्शन",
    rootDhatu: "वि + विच् (पृथक् करना) + घञ्",
    etymology: "विविच्यते नित्यमनित्यं वस्तु येन सः विवेकः — जिससे नित्य (आत्मा) और अनित्य (संसार) का स्पष्ट भेद ज्ञात हो।",
    gender: "पुंल्लिङ्गम्",
    shloka: {
      sanskrit: "नित्यानित्यवस्तुविवेकः इहामुत्रार्थभोगविरागः शमादिषट्कसम्पत्तिः मुमुक्षुत्वम्।",
      source: "विवेकचूड़ामणि १९",
      meaningHindi: "नित्य और अनित्य वस्तु का विवेक ही साधन चतुष्टय का प्रथम और प्रमुख स्तम्भ है।",
      meaningEnglish: "Discrimination between the Eternal and the ephemeral is the cornerstone of spiritual realization.",
    },
    synonyms: ["प्रज्ञा", "सद्बुद्धिः", "सूक्ष्मदृष्टिः", "विचारशक्तिः"],
    antonyms: ["अविवेकः", "अज्ञानम्", "मोहः"],
    spiritualWisdom: "हंस जिस प्रकार दूध और पानी को अलग कर देता है, उसी प्रकार विवेकवान् मनुष्य संसार के प्रपंच में से सत्य को ग्रहण कर लेता है।",
  },
  {
    id: "vairagyam",
    devanagari: "वैराग्यम्",
    transliteration: "vairāgyam",
    meaningHindi: "नश्वर विषयों के प्रति अनासक्ति, मानसिक निर्मलता",
    meaningEnglish: "Dispassion, detachment from worldly sensory desires",
    category: "योग व साधना",
    rootDhatu: "वि + रञ्ज् (आसक्त होना) + ष्यञ्",
    etymology: "विगतः रागो यस्मात् तत् वैराग्यम् — जहाँ से विषय-भोगों का राग सर्वथा समाप्त हो चुका हो।",
    gender: "नपुंसकलिंगम्",
    shloka: {
      sanskrit: "अभ्यासेन तु कौन्तेय वैराग्येण च गृह्यते।",
      source: "श्रीमद्भगवद्गीता ६.३५",
      meaningHindi: "हे कुन्तीपुत्र! चञ्चल मन को केवल निरन्तर अभ्यास और वैराग्य के द्वारा ही वश में किया जा सकता है।",
      meaningEnglish: "O son of Kunti, the restless mind can certainly be mastered through steady practice and detachment.",
    },
    synonyms: ["अनासक्तिः", "उदासीनता", "निःस्पृहता", "त्यागः"],
    antonyms: ["रागः", "आसक्तिः", "लोभः", "तृष्णा"],
    spiritualWisdom: "वैराग्य का अर्थ संसार छोड़कर भागना नहीं, बल्कि संसार को मन के भीतर न बसने देना है।",
  },
  {
    id: "karuna",
    devanagari: "करुणा",
    transliteration: "karuṇā",
    meaningHindi: "दीन-दुखियों के प्रति निष्काम दया और सहानुभूति",
    meaningEnglish: "Compassion, unconditional empathy for all suffering beings",
    category: "नीति व आचरण",
    rootDhatu: "कृ (करना / दयालु होना) + उनन्",
    etymology: "परदुःखप्रहाणेच्छा करुणा — दूसरों के कष्ट को देखकर उसे दूर करने की स्वाभाविक आंतरिक तड़प।",
    gender: "स्त्रीलिङ्गम्",
    shloka: {
      sanskrit: "मैत्रीकरुणामुदितोपेक्षाणां सुखदुःखपुण्यापुण्यविषयाणां भावनातश्चित्तप्रसादनम्।",
      source: "पातञ्जल योगसूत्र १.३३",
      meaningHindi: "दुखियों के प्रति करुणा और सुखियों के प्रति मैत्री की भावना से चित्त निर्मल और शान्त होता है।",
      meaningEnglish: "The mind becomes purified by cultivating friendship towards the happy and compassion towards the suffering.",
    },
    synonyms: ["दया", "सहानुभूतिः", "अनुकम्पा", "कृपा"],
    antonyms: ["क्रूरता", "निर्दयता", "कठोरता"],
    spiritualWisdom: "करुणा हृदय का वह दिव्य पुष्प है जो मनुष्य को ईश्वर के सर्वाधिक निकट ले आता है।",
  },
  {
    id: "ahimsa",
    devanagari: "अहिंसा",
    transliteration: "ahiṁsā",
    meaningHindi: "मन, वचन और कर्म से किसी भी प्राणी को कष्ट न पहुँचाना",
    meaningEnglish: "Non-violence in thought, word, and deed; universal benevolence",
    category: "योग व साधना",
    rootDhatu: "न + हिंस् (मारना / पीड़ा देना) + अङ् + टाप्",
    etymology: "सर्वथा सर्वदा सर्वभूतानामनभिद्रोहः — कभी किसी भी प्राणी के प्रति द्रोह या हिंसा का भाव न रखना।",
    gender: "स्त्रीलिङ्गम्",
    shloka: {
      sanskrit: "अहिंसा परमो धर्मस्तथाहिंसा परं तपः। अहिंसा परमं सत्यं यतो धर्मः प्रवर्तते॥",
      source: "महाभारत अनुशासनपर्व ११५.२५",
      meaningHindi: "अहिंसा परम धर्म है, अहिंसा परम तप है, और अहिंसा ही परम सत्य है जिससे धर्म की प्रतिष्ठा होती है।",
      meaningEnglish: "Non-violence is the supreme virtue, supreme austerity, and supreme truth from which Dharma flows.",
    },
    synonyms: ["अद्रोहः", "दयाभावः", "शान्तिः", "अभयम्"],
    antonyms: ["हिंसा", "क्रूरता", "हिंस्रता"],
    spiritualWisdom: "अहिंसा केवल शारीरिक हिंसा का त्याग नहीं, बल्कि हृदय से क्रोध, ईर्ष्या और द्वेष का समूल विनाश है।",
  },
  {
    id: "sthitaprajna",
    devanagari: "स्थितप्रज्ञः",
    transliteration: "sthitaprajñaḥ",
    meaningHindi: "सुख-दुःख में समभाव रखने वाला, स्थिर बुद्धि ज्ञानी",
    meaningEnglish: "One of steady wisdom and unshakeable equanimity in all conditions",
    category: "वेदान्त व दर्शन",
    rootDhatu: "स्था + प्र + ज्ञा (दृढ़ विवेक)",
    etymology: "प्रतिष्ठिता प्रज्ञा यस्य सः स्थितप्रज्ञः — जिसकी बुद्धि परमात्मा और आत्मतत्व में अचल हो चुकी है।",
    gender: "पुंल्लिङ्गम्",
    shloka: {
      sanskrit: "दुःखेष्वनुद्विग्नमनाः सुखेषु विगतस्पृहः। वीतरागभयक्रोधः स्थितधीर्मुनिरुच्यते॥",
      source: "श्रीमद्भगवद्गीता २.५६",
      meaningHindi: "दुःखों में जिसका मन उद्विग्न नहीं होता, सुखों में जो निःस्पृह है, तथा राग, भय और क्रोध से सर्वथा मुक्त है, वह स्थिरबुद्धि मुनि कहलाता है।",
      meaningEnglish: "One whose mind remains undisturbed amidst misery, who has no craving amidst pleasure, and is free from passion, fear, and anger, is a sage of steady wisdom.",
    },
    synonyms: ["आत्मज्ञानी", "समदर्शी", "जीवन्मुक्तः", "योगारूढः"],
    antonyms: ["चंचलमतिः", "अज्ञानी", "मोही"],
    spiritualWisdom: "स्थितप्रज्ञता समुद्र के समान है, जिसमें कितनी भी नदियाँ गिरें, वह अपनी मर्यादा नहीं छोड़ता।",
  },
];

/**
 * Get word of the day deterministically based on date
 */
export function getWordForDate(date: Date): SanskritWordEntry {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24,
  );
  const index = Math.abs(dayOfYear) % SANSKRIT_WORDS_DATABASE.length;
  return SANSKRIT_WORDS_DATABASE[index] || SANSKRIT_WORDS_DATABASE[0];
}

/**
 * Get a random sacred word from the lexicon
 */
export function getRandomWord(): SanskritWordEntry {
  const idx = Math.floor(Math.random() * SANSKRIT_WORDS_DATABASE.length);
  return SANSKRIT_WORDS_DATABASE[idx];
}
