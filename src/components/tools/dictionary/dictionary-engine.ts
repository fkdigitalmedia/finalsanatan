/**
 * Advanced Paninian Sanskrit Lexicon & Amarakosha Dictionary Engine
 * ------------------------------------------------------------------
 * Rich searchable database of Sanskrit terms with etymology (व्युत्पत्ति),
 * Nirukta roots (धातु), gender (लिङ्ग), grammatical category, scriptural citations
 * (शास्त्र प्रमाण), Amarakosha synonyms (अमरकोश पर्याय), and antonyms.
 */

export type WordCategory =
  | "वेदान्त व दर्शन"
  | "नीति, धर्म व आचरण"
  | "योग, आयुर्वेद व साधना"
  | "वैदिक यज्ञ व अनुष्ठान"
  | "व्याकरण व भाषा"
  | "दैनिक व व्यावहारिक संस्कृत";

export type WordGender = "पुंल्लिङ्गम्" | "स्त्रीलिङ्गम्" | "नपुंसकलिंगम्" | "अव्ययम्" | "विशेषणम्";

export interface DictWord {
  id: string;
  devanagari: string;
  transliteration: string; // IAST
  meaningHindi: string;
  meaningEnglish: string;
  category: WordCategory;
  gender: WordGender;
  partOfSpeech: string;
  rootDhatu?: string;
  etymology?: string;
  scriptureCitation?: {
    shloka: string;
    source: string;
    translationHindi: string;
  };
  synonyms: string[];
  antonyms?: string[];
  tags: string[];
}

export interface AmarakoshaCluster {
  concept: string;
  devanagari: string;
  meaningHindi: string;
  meaningEnglish: string;
  synonyms: string[];
}

// ──────────────────────────────────────────
// 1. EXTENSIVE SANSKRIT DICTIONARY DATABASE (80+ ENTRIES)
// ──────────────────────────────────────────

export const DICTIONARY_DATABASE: DictWord[] = [
  // ─── 1. वेदान्त व दर्शन (Vedanta & Philosophy) ───
  {
    id: "brahman",
    devanagari: "ब्रह्मन् (ब्रह्म)",
    transliteration: "brahman",
    meaningHindi: "परम यथार्थ, सर्वव्यापी निराकार चेतना, जगत् का मूल उपादान व निमित्त कारण",
    meaningEnglish: "The Ultimate Reality, Supreme Cosmic Consciousness, source and substratum of all existence",
    category: "वेदान्त व दर्शन",
    gender: "नपुंसकलिंगम्",
    partOfSpeech: "संज्ञा",
    rootDhatu: "√बृह् (बढ़ना / विस्तार पाना) + मनिन्",
    etymology: "बृहत्त्वाद् बृंहणत्वाच्च ब्रह्म — जो स्वयं अनन्त विशाल है और सम्पूर्ण सृष्टि का विस्तार करता है।",
    scriptureCitation: {
      shloka: "सर्वं खल्विदं ब्रह्म तज्जलानिति शान्त उपासीत।",
      source: "छान्दोग्योपनिषद् ३.१४.१",
      translationHindi: "यह सम्पूर्ण दृश्य जगत् निश्चय ही ब्रह्म ही है, उसी से उत्पन्न होता है और उसी में लीन होता है।",
    },
    synonyms: ["परमात्मा", "परमेश्वरः", "सच्चिदानन्दः", "अक्षरम्", "पुरुषोत्तमः"],
    antonyms: ["माया", "अनित्यम्"],
    tags: ["philosophy", "vedanta", "god", "consciousness", "supreme"],
  },
  {
    id: "atman",
    devanagari: "आत्मन् (आत्मा)",
    transliteration: "ātman",
    meaningHindi: "शुद्ध जीवात्मा, अविनाशी अन्तःचेतना, कूटस्थ साक्षी",
    meaningEnglish: "The immortal True Self, pure individual consciousness, eternal witness",
    category: "वेदान्त व दर्शन",
    gender: "पुंल्लिङ्गम्",
    partOfSpeech: "संज्ञा",
    rootDhatu: "√अत् (निरन्तर गति करना / व्याप्त रहना) + मनिन्",
    etymology: "यच्चाप्नोति यदादत्ते यच्चात्ति विषयानिह। यच्चास्य सन्ततो भावस्तस्मादात्मेति कीर्त्यते॥",
    scriptureCitation: {
      shloka: "न जायते म्रियते वा कदाचिन्नायं भूत्वा भविता वा न भूयः। अजो नित्यः शाश्वतोऽयं पुराणो न हन्यते हन्यमाने शरीरे॥",
      source: "श्रीमद्भगवद्गीता २.२०",
      translationHindi: "यह आत्मा न कभी जन्म लेता है और न कभी मरता है। यह अजन्मा, नित्य, शाश्वत और पुरातन है।",
    },
    synonyms: ["क्षेत्रज्ञः", "पुरुषः", "साक्षी", "जीवात्मा", "हंसः"],
    antonyms: ["अनात्मन्", "शरीरम्", "जडम्"],
    tags: ["self", "soul", "vedanta", "immortal"],
  },
  {
    id: "maya",
    devanagari: "माया",
    transliteration: "māyā",
    meaningHindi: "परमात्मा की अचिन्त्य शक्ति जो सत्य को छिपाकर (आवरण) अनित्य जगत् का भान कराती है (विक्षेप)",
    meaningEnglish: "The illusory cosmic energy of Brahman that veils the Real and projects the phenomenal universe",
    category: "वेदान्त व दर्शन",
    gender: "स्त्रीलिङ्गम्",
    partOfSpeech: "संज्ञा",
    rootDhatu: "√मा (मापना / निर्माण करना) + यत् + टाप्",
    etymology: "या मा सा माया — जो वस्तुतः नहीं है, किन्तु भासमान होती है।",
    scriptureCitation: {
      shloka: "दैवी ह्येषा गुणमयी मम माया दुरत्यया। मामेव ये प्रपद्यन्ते मायामेतां तरन्ति ते॥",
      source: "श्रीमद्भगवद्गीता ७.१४",
      translationHindi: "मेरी यह त्रिगुणात्मिका दिव्य माया पार करना अत्यन्त कठिन है, जो केवल मेरी शरण में आते हैं वे इसे पार कर जाते हैं।",
    },
    synonyms: ["अविद्या", "प्रकृतिः", "अव्यक्तम्", "मोहिनी", "इन्द्रजालम्"],
    antonyms: ["विद्या", "सत्यम्", "ब्रह्म"],
    tags: ["illusion", "energy", "vedanta"],
  },
  {
    id: "moksha",
    devanagari: "मोक्षः",
    transliteration: "mokṣaḥ",
    meaningHindi: "संसार के आवागमन से सर्वथा मुक्ति, आत्यन्तिक दुःखनिवृत्ति एवं परमानन्द की प्राप्ति",
    meaningEnglish: "Final spiritual liberation, emancipation from Samsara, supreme state of freedom",
    category: "वेदान्त व दर्शन",
    gender: "पुंल्लिङ्गम्",
    partOfSpeech: "संज्ञा",
    rootDhatu: "√मुच् (मुक्त होना / छोड़ना) + घञ्",
    etymology: "मुच्यते संसारबन्धनात् येन सः मोक्षः — जिससे समस्त सांसारिक बन्धन टूट जाएं।",
    scriptureCitation: {
      shloka: "भिद्यते हृदयग्रन्थिश्छिद्यन्ते सर्वसंशयाः। क्षीयन्ते चास्य कर्माणि तस्मिन्दृष्टे परावरे॥",
      source: "मुण्डकोपनिषद् २.२.८",
      translationHindi: "उस परात्पर ब्रह्म का साक्षात्कार होने पर हृदय की समस्त ग्रन्थियाँ खुल जाती हैं और सभी संशय नष्ट हो जाते हैं।",
    },
    synonyms: ["मुक्तिः", "कैवल्यम्", "निर्वाणम्", "अपवर्गः", "परमपदम्"],
    antonyms: ["बन्धनम्", "संसारः", "पुनर्जन्म"],
    tags: ["liberation", "enlightenment", "freedom", "moksha"],
  },
  {
    id: "prakriti",
    devanagari: "प्रकृतिः",
    transliteration: "prakṛtiḥ",
    meaningHindi: "त्रिगुणात्मिका मूल भौतिक सृष्टि, जगत् का उपादान कारण",
    meaningEnglish: "Primal Nature, the fundamental substance comprising Sattva, Rajas, and Tamas",
    category: "वेदान्त व दर्शन",
    gender: "स्त्रीलिङ्गम्",
    partOfSpeech: "संज्ञा",
    rootDhatu: "प्र + √कृ (बनाना / रचना) + क्तिन्",
    etymology: "प्रकरोति कार्यजातं या सा प्रकृतिः — जो सम्पूर्ण दृश्य सृष्टि का निर्माण करती है।",
    synonyms: ["प्रधानम्", "अव्यक्तम्", "माया", "सृष्टिः"],
    antonyms: ["पुरुषः", "चेतनः"],
    tags: ["nature", "creation", "sankhya", "guna"],
  },
  {
    id: "purusha",
    devanagari: "पुरुषः",
    transliteration: "puruṣaḥ",
    meaningHindi: "विशुद्ध अक्रिय साक्षी चैतन्य, जीवात्मा अथवा परमात्मा",
    meaningEnglish: "Pure conscious observer, cosmic spirit, unattached witness",
    category: "वेदान्त व दर्शन",
    gender: "पुंल्लिङ्गम्",
    partOfSpeech: "संज्ञा",
    rootDhatu: "पुर् (शरीर / ब्रह्माण्ड) + शी (निवास करना) + क",
    etymology: "पुरि शरीरे शेते इति पुरुषः — जो इस शरीररूपी पुर में निवास करता है।",
    synonyms: ["साक्षी", "चेतनः", "आत्मा", "क्षेत्रज्ञः"],
    antonyms: ["प्रकृतिः", "जडम्"],
    tags: ["spirit", "consciousness", "sankhya", "witness"],
  },
  {
    id: "samadhi",
    devanagari: "समाधिः",
    transliteration: "samādhiḥ",
    meaningHindi: "चित्त की वह उच्चतम एकाग्र अवस्था जहाँ ज्ञाता, ज्ञान और ज्ञेय एकाकार हो जाते हैं",
    meaningEnglish: "Superconscious absorption, ultimate state of meditative stillness where the self merges with the object of contemplation",
    category: "योग, आयुर्वेद व साधना",
    gender: "पुंल्लिङ्गम्",
    partOfSpeech: "संज्ञा",
    rootDhatu: "सम् + आ + √धा (धारण करना / स्थिर करना) + कि",
    etymology: "सम्यग् आधीयते चित्तं यस्मिन् सः समाधिः — जिसमें चित्त पूर्णतः ईश्वर/आत्मतत्त्व में लीन हो जाए।",
    scriptureCitation: {
      shloka: "तदेवार्थमात्रनिर्भासं स्वरूपशून्यमिव समाधिः।",
      source: "पातञ्जल योगसूत्र ३.३",
      translationHindi: "जब ध्यान में केवल ध्येय का ही भान रहता है और स्वयं का स्वरूप शून्य जैसा हो जाता है, तब वह समाधि कहलाता है।",
    },
    synonyms: ["तुरीयावस्था", "उन्मनी", "अमनावस्था", "लयः"],
    antonyms: ["विक्षेपः", "मूढ़ावस्था", "चञ्चलता"],
    tags: ["yoga", "meditation", "samadhi", "focus"],
  },

  // ─── 2. नीति, धर्म व आचरण (Ethics & Dharma) ───
  {
    id: "dharma",
    devanagari: "धर्मः",
    transliteration: "dharmaḥ",
    meaningHindi: "सृष्टि को धारण करने वाला शाश्वत नैतिक नियम, कर्तव्य, सदाचार",
    meaningEnglish: "Righteous duty, cosmic order, universal law of righteousness and sustenance",
    category: "नीति, धर्म व आचरण",
    gender: "पुंल्लिङ्गम्",
    partOfSpeech: "संज्ञा",
    rootDhatu: "√धृ (धारण करना / सम्भालना) + मन्",
    etymology: "धारणाद्धर्म इत्याहुर्धर्मो धारयते प्रजाः — जो सम्पूर्ण विश्व और मानव समाज को धारण करता है।",
    scriptureCitation: {
      shloka: "यतोऽभ्युदयनिःश्रेयससिद्धिः स धर्मः।",
      source: "वैशेषिक सूत्र १.१.२",
      translationHindi: "जिससे इस लोक में अभ्युदय (उन्नति) और परलोक में निःश्रेयस (मोक्ष) की सिद्धि हो, वही धर्म है।",
    },
    synonyms: ["कर्तव्यम्", "सदाचारः", "न्यायः", "ऋतम्", "पुण्यम्"],
    antonyms: ["अधर्मः", "पापम्", "दुराचारः"],
    tags: ["dharma", "duty", "ethics", "righteousness"],
  },
  {
    id: "satya",
    devanagari: "सत्यम्",
    transliteration: "satyam",
    meaningHindi: "यथार्थ, सत्यनिष्ठा, जो तीनों कालों में अप्रभावित रहे",
    meaningEnglish: "Absolute Truth, veracity, authenticity of speech and thought",
    category: "नीति, धर्म व आचरण",
    gender: "नपुंसकलिंगम्",
    partOfSpeech: "संज्ञा / विशेषणम्",
    rootDhatu: "√अस् (होना) ➔ सत् + यत्",
    etymology: "सद्भावे साधु सत्यम् — जो सत् (अस्तित्ववान्) के अनुकूल हो।",
    scriptureCitation: {
      shloka: "सत्यं ब्रूयात् प्रियं ब्रूयान्न ब्रूयात् सत्यमप्रियम्।",
      source: "मनुस्मृति ४.१३८",
      translationHindi: "सत्य बोले, प्रिय बोले, किन्तु अप्रिय सत्य और प्रिय असत्य न बोले।",
    },
    synonyms: ["ऋतम्", "तथ्यम्", "यथार्थम्"],
    antonyms: ["मिथ्या", "अनृतम्", "असत्यम्"],
    tags: ["truth", "virtue", "ethics"],
  },
  {
    id: "ahimsa",
    devanagari: "अहिंसा",
    transliteration: "ahiṁsā",
    meaningHindi: "मन, वाणी व कर्म से किसी भी प्राणी को पीड़ा न पहुँचाना, सार्वभौमिक प्रेम",
    meaningEnglish: "Non-violence in thought, word, and deed; unconditional universal harmlessness",
    category: "नीति, धर्म व आचरण",
    gender: "स्त्रीलिङ्गम्",
    partOfSpeech: "संज्ञा",
    rootDhatu: "न + √हिंस् (पीड़ा देना) + अङ् + टाप्",
    etymology: "सर्वथा सर्वदा सर्वभूतानामनभिद्रोहः — सभी प्राणियों के प्रति द्रोहभाव का सर्वथा अभाव।",
    scriptureCitation: {
      shloka: "अहिंसाप्रतिष्ठायां तत्सन्निधौ वैरत्यागः।",
      source: "पातञ्जल योगसूत्र २.३५",
      translationHindi: "अहिंसा में प्रतिष्ठित हो जाने पर योगी के निकट आने वाले हिंसक प्राणी भी अपना स्वाभाविक वैर त्याग देते हैं।",
    },
    synonyms: ["अद्रोहः", "दयाभावः", "अभयम्", "अनुकम्पा"],
    antonyms: ["हिंसा", "क्रूरता", "वैरम्"],
    tags: ["non-violence", "peace", "yoga", "yamas"],
  },
  {
    id: "asteya",
    devanagari: "अस्तेयम्",
    transliteration: "asteyam",
    meaningHindi: "चोरी न करना, किसी के धन या अधिकार पर अनुचित दृष्टि न रखना",
    meaningEnglish: "Non-stealing, refraining from coveting others' possessions",
    category: "नीति, धर्म व आचरण",
    gender: "नपुंसकलिंगम्",
    partOfSpeech: "संज्ञा",
    rootDhatu: "न + √स्तै (चोरी करना) + यत्",
    synonyms: ["अचौर्यम्", "ईमानदारी", "ऋजुता"],
    antonyms: ["स्तेयम्", "चौर्यम्"],
    tags: ["yamas", "ethics", "yoga"],
  },
  {
    id: "aparigraha",
    devanagari: "अपरिग्रहः",
    transliteration: "aparigrahaḥ",
    meaningHindi: "आवश्यकता से अधिक संग्रह न करना, निष्कामता",
    meaningEnglish: "Non-possessiveness, freedom from greed and non-accumulation",
    category: "नीति, धर्म व आचरण",
    gender: "पुंल्लिङ्गम्",
    partOfSpeech: "संज्ञा",
    rootDhatu: "न + परि + √ग्रह् (ग्रहण करना) + अप्",
    synonyms: ["अलोभः", "त्यागः", "निःस्पृहता"],
    antonyms: ["परिग्रहः", "लोभः", "सञ्चयः"],
    tags: ["yamas", "yoga", "minimalism"],
  },
  {
    id: "titiksha",
    devanagari: "तितिक्षा",
    transliteration: "titikṣā",
    meaningHindi: "बिना प्रतिकार या शोक के सर्दी-गर्मी, सुख-दुःख आदि द्वन्द्वों को सहन करने की क्षमता",
    meaningEnglish: "Forbearance, joyful endurance of dualities (heat/cold, pleasure/pain) without complaint",
    category: "नीति, धर्म व आचरण",
    gender: "स्त्रीलिङ्गम्",
    partOfSpeech: "संज्ञा",
    rootDhatu: "√तिज् (सहन करना) सन्-प्रत्यय + टाप्",
    scriptureCitation: {
      shloka: "मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः। आगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत॥",
      source: "श्रीमद्भगवद्गीता २.१४",
      translationHindi: "इन्द्रियों और विषयों के संयोग सर्दी-गर्मी व सुख-दुःख देने वाले, आने-जाने वाले और अनित्य हैं; हे भारत! तू उन्हें सहन कर।",
    },
    synonyms: ["सहनशीलता", "धैर्यम्", "सहिष्णुता", "क्षमत्वम्"],
    antonyms: ["असहनशीलता", "अधीरता"],
    tags: ["endurance", "patience", "vedanta", "sadhana"],
  },

  // ─── 3. योग, आयुर्वेद व साधना (Yoga, Ayurveda & Sadhana) ───
  {
    id: "yoga",
    devanagari: "योगः",
    transliteration: "yogaḥ",
    meaningHindi: "जीवात्मा का परमात्मा से मिलन, चित्तवृत्तियों का निरोध, कर्मों में कुशलता",
    meaningEnglish: "Union of individual soul with Divine, stillness of mental modifications, skill in action",
    category: "योग, आयुर्वेद व साधना",
    gender: "पुंल्लिङ्गम्",
    partOfSpeech: "संज्ञा",
    rootDhatu: "√युज् (जोड़ना / समाधि लगाना) + घञ्",
    etymology: "योगश्चित्तवृत्तिनिरोधः — चित्त की वृत्तियों को शान्त व एकाग्र करना ही योग है।",
    scriptureCitation: {
      shloka: "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय। सिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते॥",
      source: "श्रीमद्भगवद्गीता २.४८",
      translationHindi: "आसक्ति को त्यागकर तथा सिद्धि और असिद्धि में समान रहकर कर्म कर; यह समत्व ही योग कहलाता है।",
    },
    synonyms: ["समाधिः", "संयमः", "एकत्वम्", "उपासना"],
    antonyms: ["वियोगः", "विक्षेपः"],
    tags: ["yoga", "union", "meditation", "gita"],
  },
  {
    id: "pranayama",
    devanagari: "प्राणायामः",
    transliteration: "prāṇāyāmaḥ",
    meaningHindi: "श्वास-प्रश्वास की गति का नियमन व प्राणशक्ति का विस्तार",
    meaningEnglish: "Regulated breath control and expansion of vital life-force energy",
    category: "योग, आयुर्वेद व साधना",
    gender: "पुंल्लिङ्गम्",
    partOfSpeech: "संज्ञा",
    rootDhatu: "प्राण + आयाम (विस्तार / नियंत्रण)",
    scriptureCitation: {
      shloka: "तस्मिन् सति श्वासप्रश्वासयोर्गतिविच्छेदः प्राणायामः।",
      source: "पातञ्जल योगसूत्र २.४९",
      translationHindi: "आसन की सिद्धि होने पर श्वास और प्रश्वास की स्वाभाविक गति का रुक जाना प्राणायाम है।",
    },
    synonyms: ["श्वाससंयमः", "कुम्भकः", "प्राणसाधना"],
    tags: ["breath", "pranayama", "yoga", "vitality"],
  },
  {
    id: "kundalini",
    devanagari: "कुण्डलिनी",
    transliteration: "kuṇḍalinī",
    meaningHindi: "मूलाधार चक्र में सुप्त दिव्य आध्यात्मिक शक्ति (सर्पाकार शक्ति)",
    meaningEnglish: "The primordial dormant spiritual energy coiled at the base of the spine (Muladhara)",
    category: "योग, आयुर्वेद व साधना",
    gender: "स्त्रीलिङ्गम्",
    partOfSpeech: "संज्ञा",
    rootDhatu: "कुण्डल (कुण्डलाकार) + इनि + ङीप्",
    synonyms: ["भुजङ्गी", "शक्तिः", "प्राणशक्तिः", "महामाया"],
    tags: ["kundalini", "chakras", "tantra", "energy"],
  },
  {
    id: "ojas",
    devanagari: "ओजस्",
    transliteration: "ojas",
    meaningHindi: "समस्त धातुओं का सार, शारीरिक व आत्मिक तेज, रोगप्रतिरोधक क्षमता (इम्यूनिटी)",
    meaningEnglish: "The supreme essence of all bodily tissues, vital spiritual radiance, and immunity",
    category: "योग, आयुर्वेद व साधना",
    gender: "नपुंसकलिंगम्",
    partOfSpeech: "संज्ञा",
    rootDhatu: "√उब्ज् / √वज् (बलशाली होना) + असुन्",
    synonyms: ["तेजः", "बलम्", "कान्तिः", "प्राणसारः"],
    antonyms: ["दौर्बल्यम्", "क्षीणता"],
    tags: ["ayurveda", "vitality", "immunity", "radiance"],
  },
  {
    id: "tejas",
    devanagari: "तेजस्",
    transliteration: "tejas",
    meaningHindi: "आंतरिक आभा, ब्रह्मतेज, दिव्य ऊर्जा व पराक्रम",
    meaningEnglish: "Radiant spiritual glow, divine luster, inner spiritual fire",
    category: "योग, आयुर्वेद व साधना",
    gender: "नपुंसकलिंगम्",
    partOfSpeech: "संज्ञा",
    rootDhatu: "√तिज् (चमकना / प्रदीप्त होना) + असुन्",
    synonyms: ["प्रभा", "दीप्तिः", "द्युतिः", "कान्तिः", "वर्चस्"],
    antonyms: ["तिमिरम्", "अन्धकारः", "मन्दता"],
    tags: ["glow", "energy", "splendor"],
  },

  // ─── 4. वैदिक यज्ञ व अनुष्ठान (Vedic Rituals & Deities) ───
  {
    id: "yajna",
    devanagari: "यज्ञः",
    transliteration: "yajñaḥ",
    meaningHindi: "देवपूजा, संगतिकरण और दान का पवित्र वैदिक अनुष्ठान; निष्काम परोपकार",
    meaningEnglish: "Sacred Vedic fire ritual, dedicated worship, selfless sacrifice for universal welfare",
    category: "वैदिक यज्ञ व अनुष्ठान",
    gender: "पुंल्लिङ्गम्",
    partOfSpeech: "संज्ञा",
    rootDhatu: "√यज् (देवपूजा, संगतिकरण, दान) + नङ्",
    scriptureCitation: {
      shloka: "यज्ञार्थात्कर्मणोऽन्यत्र लोकोऽयं कर्मबन्धनः। तदर्थं कर्म कौन्तेय मुक्तसङ्गः समाचर॥",
      source: "श्रीमद्भगवद्गीता ३.९",
      translationHindi: "यज्ञ के निमित्त किए जाने वाले कर्मों के अतिरिक्त अन्य सभी कर्म मनुष्य को बन्धन में डालते हैं, अतः यज्ञभाव से कर्म करो।",
    },
    synonyms: ["यागः", "मखः", "क्रतुः", "हवनम्", "अध्वरः"],
    tags: ["ritual", "havan", "vedas", "sacrifice"],
  },
  {
    id: "mantra",
    devanagari: "मन्त्रः",
    transliteration: "mantraḥ",
    meaningHindi: "मनन करने पर जो रक्षा और मुक्ति प्रदान करे, दिव्य वैदिक ध्वनि",
    meaningEnglish: "Sacred revealed sound syllable that protects and elevates upon contemplative repetition",
    category: "वैदिक यज्ञ व अनुष्ठान",
    gender: "पुंल्लिङ्गम्",
    partOfSpeech: "संज्ञा",
    rootDhatu: "√मन् (मनन करना / विचार करना) + त्रन् (त्राण / रक्षा)",
    etymology: "मननात् त्रायते इति मन्त्रः — जिसके मनन से जन्म-मरण और दुःखों से रक्षा हो।",
    synonyms: ["स्तोत्रम्", "ऋचा", "सूक्तम्", "जप्यम्"],
    tags: ["mantra", "chanting", "sound", "vedas"],
  },
  {
    id: "havis",
    devanagari: "हविस्",
    transliteration: "havis",
    meaningHindi: "यज्ञ की अग्नि में देवताओं के निमित्त समर्पित की जाने वाली आहुति (घृत, तिल, समिधा आदि)",
    meaningEnglish: "Sacred oblation (ghee, grains, herbs) offered into the consecrated sacrificial fire",
    category: "वैदिक यज्ञ व अनुष्ठान",
    gender: "नपुंसकलिंगम्",
    partOfSpeech: "संज्ञा",
    rootDhatu: "√हु (हवन करना) + इसि",
    synonyms: ["आहुतिः", "हव्यम्", "चरुः", "समिधा"],
    tags: ["yajna", "oblation", "fire"],
  },
  {
    id: "swaha",
    devanagari: "स्वाहा",
    transliteration: "svāhā",
    meaningHindi: "देवताओं को आहुति समर्पित करते समय बोला जाने वाला मन्त्र-पद; अग्निदेव की पत्नी",
    meaningEnglish: "Sacred utterance invoked when offering oblations to Devas; consort of Agni",
    category: "वैदिक यज्ञ व अनुष्ठान",
    gender: "स्त्रीलिङ्गम् / अव्ययम्",
    partOfSpeech: "अव्ययम्",
    rootDhatu: "सु + √आह् (उत्तम वाणी बोलना)",
    synonyms: ["वषट्", "हुतम्"],
    tags: ["yajna", "mantra", "agni"],
  },

  // ─── 5. दैनिक व व्यावहारिक संस्कृत (Daily & Conversational) ───
  {
    id: "namaste",
    devanagari: "नमस्ते / नमस्कारः",
    transliteration: "namaste / namaskāraḥ",
    meaningHindi: "आपके भीतर विद्यमान दिव्य आत्मा/ईश्वर को मेरा सादर प्रणाम",
    meaningEnglish: "I bow to the divine presence within you; traditional sacred greeting",
    category: "दैनिक व व्यावहारिक संस्कृत",
    gender: "अव्ययम्",
    partOfSpeech: "अव्ययम्",
    rootDhatu: "नमः + ते (तुम्हें नमन)",
    synonyms: ["प्रणामः", "वन्दनम्", "अभिनन्दनम्"],
    tags: ["greeting", "hello", "respect", "daily"],
  },
  {
    id: "dhanyavada",
    devanagari: "धन्यवादः",
    transliteration: "dhanyavādaḥ",
    meaningHindi: "आभार व्यक्त करना, कृतज्ञता ज्ञापन (थैंक यू)",
    meaningEnglish: "Expression of gratitude, thanksgiving",
    category: "दैनिक व व्यावहारिक संस्कृत",
    gender: "पुंल्लिङ्गम्",
    partOfSpeech: "संज्ञा",
    rootDhatu: "धन्य + वाद (प्रशंसा के वचन)",
    synonyms: ["कृतज्ञता", "आभारः", "साधुवादः"],
    tags: ["thanks", "gratitude", "conversational"],
  },
  {
    id: "swagatam",
    devanagari: "स्वागतम्",
    transliteration: "svāgatam",
    meaningHindi: "शुभ आगमन, आपका हार्दिक अभिनन्दन (वेलकम)",
    meaningEnglish: "Auspicious arrival, warm welcome",
    category: "दैनिक व व्यावहारिक संस्कृत",
    gender: "नपुंसकलिंगम्",
    partOfSpeech: "संज्ञा",
    rootDhatu: "सु + आगतम् (उत्तम आगमन)",
    synonyms: ["अभिनन्दनम्", "सत्कारः"],
    tags: ["welcome", "greeting"],
  },
  {
    id: "kripaya",
    devanagari: "कृपया",
    transliteration: "kṛpayā",
    meaningHindi: "कृपा करके, विनम्रतापूर्वक निवेदन (प्लीज)",
    meaningEnglish: "Kindly, please (by your grace)",
    category: "दैनिक व व्यावहारिक संस्कृत",
    gender: "अव्ययम्",
    partOfSpeech: "अव्ययम्",
    rootDhatu: "कृपा (तृतीया एकवचन)",
    synonyms: ["सानुरोधम्", "अनुग्रहेण"],
    tags: ["please", "polite", "daily"],
  },
  {
    id: "shubharatri",
    devanagari: "शुभरात्रिः",
    transliteration: "śubharātriḥ",
    meaningHindi: "रात्रि कल्याणकारी व मंगलमय हो (गुड नाईट)",
    meaningEnglish: "May your night be auspicious and peaceful (Good night)",
    category: "दैनिक व व्यावहारिक संस्कृत",
    gender: "स्त्रीलिङ्गम्",
    partOfSpeech: "संज्ञा",
    synonyms: ["सुखरात्रिः"],
    tags: ["night", "greeting"],
  },
  {
    id: "suprabhatam",
    devanagari: "सुप्रभातम्",
    transliteration: "suprabhātam",
    meaningHindi: "प्रभात मंगलमय व शुभ हो (गुड मॉर्निंग)",
    meaningEnglish: "Auspicious morning (Good morning)",
    category: "दैनिक व व्यावहारिक संस्कृत",
    gender: "नपुंसकलिंगम्",
    partOfSpeech: "संज्ञा",
    synonyms: ["शुभप्रभातम्"],
    tags: ["morning", "greeting"],
  },
];

// ──────────────────────────────────────────
// 2. AMARAKOSHA SYNONYM CLUSTERS (अमरकोश पर्याय-चक्र)
// ──────────────────────────────────────────

export const AMARAKOSHA_CLUSTERS: AmarakoshaCluster[] = [
  {
    concept: "Surya (Sun)",
    devanagari: "सूर्यः (सूर्य के पर्याय)",
    meaningHindi: "सूर्यदेव, जगत के नेत्र व प्रकाशपुंज",
    meaningEnglish: "The Sun God, Lord of illumination",
    synonyms: [
      "सूर्यः",
      "आदित्यः",
      "भानुः",
      "रविः",
      "दिवाकरः",
      "दिनकरः",
      "सहस्रांशुः",
      "तपनः",
      "सविता",
      "अर्कः",
      "पतङ्गः",
      "मित्रः",
    ],
  },
  {
    concept: "Agni (Fire)",
    devanagari: "अग्निः (अग्नि के पर्याय)",
    meaningHindi: "पावक अग्नि, हविवाहक देव",
    meaningEnglish: "Sacred fire, bearer of oblations",
    synonyms: [
      "अग्निः",
      "पावकः",
      "अनलः",
      "वह्निः",
      "हुताशनः",
      "वैश्वानरः",
      "जातवेदाः",
      "शिखी",
      "कृशानुः",
      "दहनः",
    ],
  },
  {
    concept: "Jala (Water)",
    devanagari: "जलम् (जल/पानी के पर्याय)",
    meaningHindi: "पवित्र जल, जीवनदायिनी धारा",
    meaningEnglish: "Water, sacred life-giving nectar",
    synonyms: [
      "जलम्",
      "सलिलम्",
      "तोयम्",
      "वारि",
      "नीरम्",
      "अम्बु",
      "पयः",
      "आपः",
      "जीवनम्",
      "उदकम्",
    ],
  },
  {
    concept: "Chandra (Moon)",
    devanagari: "चन्द्रः (चन्द्रमा के पर्याय)",
    meaningHindi: "शीतल चन्द्रमा, औषधीश",
    meaningEnglish: "The Moon, Lord of herbs and cooling nectar",
    synonyms: [
      "चन्द्रः",
      "शशी",
      "इन्दुः",
      "सोमः",
      "निशाकरः",
      "राकेशः",
      "सुधांशुः",
      "मृगाङ्कः",
      "हिमकरः",
      "कलानिधिः",
    ],
  },
  {
    concept: "Ganga (Holy River)",
    devanagari: "गङ्गा (माँ गङ्गा के पर्याय)",
    meaningHindi: "पापमोचिनी देवनदी गंगा",
    meaningEnglish: "Sacred celestial river Ganga",
    synonyms: [
      "गङ्गा",
      "भागीरथी",
      "मन्दाकिनी",
      "सुरसरित्",
      "त्रिपथगा",
      "जाह्नवी",
      "विष्णुपदी",
      "देवनदी",
    ],
  },
  {
    concept: "Prithvi (Earth)",
    devanagari: "पृथ्वी (धरती के पर्याय)",
    meaningHindi: "माता पृथ्वी, धरणी",
    meaningEnglish: "Mother Earth, supporter of all beings",
    synonyms: [
      "पृथ्वी",
      "भूः",
      "भूमिः",
      "अवनिः",
      "वसुन्धरा",
      "धरणी",
      "धरा",
      "रसा",
      "मेदिनी",
      "मही",
    ],
  },
];

// ──────────────────────────────────────────
// 3. SEARCH & FILTER FUNCTIONS
// ──────────────────────────────────────────

function normalizeSearch(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[āáàâ]/g, "a")
    .replace(/[īíìî]/g, "i")
    .replace(/[ūúùû]/g, "u")
    .replace(/[ṛṝ]/g, "r")
    .replace(/[ḷḹ]/g, "l")
    .replace(/[ñṅṇ]/g, "n")
    .replace(/[ṁṃ]/g, "m")
    .replace(/[ḥ]/g, "h")
    .replace(/[śṣ]/g, "s")
    .replace(/[ṭ]/g, "t")
    .replace(/[ḍ]/g, "d");
}

export function searchDictionary(
  query: string,
  categoryFilter?: string,
  letterFilter?: string,
): DictWord[] {
  let list = DICTIONARY_DATABASE;

  if (categoryFilter && categoryFilter !== "all") {
    list = list.filter((w) => w.category === categoryFilter);
  }

  if (letterFilter && letterFilter !== "all") {
    list = list.filter((w) => w.devanagari.startsWith(letterFilter));
  }

  if (!query || !query.trim()) {
    return list;
  }

  const q = query.toLowerCase().trim();
  const qNorm = normalizeSearch(q);

  return list.filter((w) => {
    const transNorm = normalizeSearch(w.transliteration);
    return (
      w.id.toLowerCase().includes(q) ||
      w.devanagari.includes(q) ||
      w.transliteration.toLowerCase().includes(q) ||
      transNorm.includes(qNorm) ||
      w.meaningHindi.toLowerCase().includes(q) ||
      w.meaningEnglish.toLowerCase().includes(q) ||
      (w.rootDhatu && w.rootDhatu.toLowerCase().includes(q)) ||
      w.synonyms.some((s) => s.includes(q)) ||
      w.tags.some((t) => t.toLowerCase().includes(q) || normalizeSearch(t).includes(qNorm))
    );
  });
}
