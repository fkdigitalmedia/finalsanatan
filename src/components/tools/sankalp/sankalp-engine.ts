/**
 * Vedic Sankalp Generation Engine
 * --------------------------------
 * Produces authentic Shastriya Sankalpa mantras with complete
 * Desha-Kala-Patra (Geography, Astronomical Time, Host Lineage, and Purpose).
 * Grounded in Vedic ritual tradition (Parasari, Bodhayana, and Smarta traditions).
 */

import {
  getTithi,
  getNakshatra,
  getYoga,
  getKarana,
  getMoonRashi,
  type LatLon,
} from "@/lib/panchang";

export type SankalpType = "maha" | "laghu" | "daan" | "parana";
export type FamilyMode = "self" | "spouse" | "family" | "behalf";

export interface SankalpInput {
  date: Date;
  location: LatLon;
  name: string;
  spouseName?: string;
  gotra: string;
  vedaShakha?: string;
  familyMode: FamilyMode;
  behalfName?: string;
  purposePreset: string;
  customPurpose?: string;
  sankalpType: SankalpType;
}

export interface SankalpResult {
  sanskrit: string;
  iast: string;
  hindiTranslation: string;
  englishTranslation: string;
  panchangSummary: {
    samvat: number;
    shaka: number;
    samvatsara: string;
    ayana: string;
    ritu: string;
    masa: string;
    paksha: string;
    tithi: string;
    vaara: string;
    nakshatra: string;
    yoga: string;
    karana: string;
    suryaRashi: string;
    chandraRashi: string;
  };
  vidhiSteps: { step: number; title: string; instruction: string }[];
}

export interface GotraOption {
  value: string;
  label: string;
  rishi: string;
}

export const COMMON_GOTRAS: GotraOption[] = [
  { value: "Kashyapa", label: "कश्यप (Kashyapa - Universal Default)", rishi: "महर्षि कश्यप" },
  { value: "Bharadwaja", label: "भारद्वाज (Bharadwaja)", rishi: "महर्षि भारद्वाज" },
  { value: "Vashistha", label: "वशिष्ठ (Vashistha)", rishi: "महर्षि वशिष्ठ" },
  { value: "Vishvamitra", label: "विश्वामित्र (Vishvamitra)", rishi: "महर्षि विश्वामित्र" },
  { value: "Gautama", label: "गौतम (Gautama)", rishi: "महर्षि गौतम" },
  { value: "Jamadagni", label: "जमदग्नि (Jamadagni)", rishi: "महर्षि जमदग्नि" },
  { value: "Atri", label: "अत्रि (Atri)", rishi: "महर्षि अत्रि" },
  { value: "Agastya", label: "अगस्त्य (Agastya)", rishi: "महर्षि अगस्त्य" },
  { value: "Garga", label: "गर्ग (Garga)", rishi: "महर्षि गर्ग" },
  { value: "Sandilya", label: "शाण्डिल्य (Sandilya)", rishi: "महर्षि शाण्डिल्य" },
  { value: "Kausika", label: "कौशिक (Kaushika)", rishi: "महर्षि कौशिक" },
  { value: "Parashara", label: "पाराशर (Parashara)", rishi: "महर्षि पराशर" },
  { value: "Bhrigu", label: "भृगु (Bhrigu)", rishi: "महर्षि भृगु" },
  { value: "Angirasa", label: "आङ्गिरस (Angirasa)", rishi: "महर्षि अङ्गिरा" },
  { value: "Harita", label: "हारीत (Harita)", rishi: "महर्षि हारीत" },
  { value: "Upamanyu", label: "उपमन्यु (Upamanyu)", rishi: "महर्षि उपमन्यु" },
  { value: "Mudgala", label: "मुद्गल (Mudgala)", rishi: "महर्षि मुद्गल" },
  { value: "Vatsa", label: "वत्स (Vatsa)", rishi: "महर्षि वत्स" },
  { value: "Kaundinya", label: "कौण्डिन्य (Kaundinya)", rishi: "महर्षि कौण्डिन्य" },
  { value: "Shiva", label: "शिव (Shiva Gotra)", rishi: "भगवान शिव" },
];

export const VEDA_SHAKHAS = [
  { value: "Rigveda", label: "ऋग्वेद (शाकल शाखा)" },
  { value: "Yajurveda-Shukla", label: "शुक्ल यजुर्वेद (वाजसनेयि माध्यन्दिन)" },
  { value: "Yajurveda-Krishna", label: "कृष्ण यजुर्वेद (तैत्तिरीय शाखा)" },
  { value: "Samaveda", label: "सामवेद (कौथुम शाखा)" },
  { value: "Atharvaveda", label: "अथर्ववेद (शौनक शाखा)" },
];

export interface PurposePreset {
  id: string;
  category: "daily" | "deity" | "vrat" | "samskara" | "desire";
  titleSanskrit: string;
  titleHindi: string;
  phalaSanskrit: string;
  phalaHindi: string;
  phalaEnglish: string;
}

export const PURPOSE_PRESETS: PurposePreset[] = [
  {
    id: "nitya-puja",
    category: "daily",
    titleSanskrit: "नित्य देवपूजा",
    titleHindi: "दैनिक नित्य पूजा",
    phalaSanskrit: "मम आत्मनः श्रुतिस्मृतिपुराणोक्त फलप्राप्त्यर्थं श्रीपरमेश्वरप्रीत्यर्थं नित्यपूजाकर्म",
    phalaHindi: "अपने अंतःकरण की शुद्धि, शास्त्रों में कहे फल की प्राप्ति और ईश्वर की प्रसन्नता हेतु नित्य पूजा",
    phalaEnglish: "Daily worship for spiritual purification and divine grace according to Shastras",
  },
  {
    id: "ganesh-puja",
    category: "deity",
    titleSanskrit: "श्री गणेश पूजनम्",
    titleHindi: "श्री गणेश पूजन (विघ्न विनाशक)",
    phalaSanskrit: "मम सकलविघ्नविनाशपूर्वकं सर्वकार्येषु निर्विघ्नतासिद्ध्यर्थं श्रीगणेशदेवताप्रीत्यर्थं पूजनम्",
    phalaHindi: "समस्त विघ्नों के नाश तथा सभी कार्यों की निर्विघ्न सिद्धि के लिए श्रीगणेश जी का पूजन",
    phalaEnglish: "Worship of Lord Ganesha for removal of all obstacles and auspicious success",
  },
  {
    id: "satyanarayan",
    category: "deity",
    titleSanskrit: "श्री सत्यनारायण व्रत कथा",
    titleHindi: "श्री सत्यनारायण व्रत एवं कथा",
    phalaSanskrit: "सकुटुम्बस्य मम धर्मार्थकाममोक्ष फलावाप्तये श्रीसत्यनारायणस्वामिप्रीत्यर्थं व्रताङ्गपूजनं कथाश्रवणं च",
    phalaHindi: "सपरिवार धर्म, अर्थ, काम और मोक्ष की प्राप्ति तथा श्री सत्यनारायण भगवान की प्रसन्नता हेतु पूजन व कथा श्रवण",
    phalaEnglish: "Sri Satyanarayan Vrat Katha worship for familial peace, prosperity and spiritual liberation",
  },
  {
    id: "rudrabhishek",
    category: "deity",
    titleSanskrit: "श्री साम्बसदाशिव रुद्राभिषेक",
    titleHindi: "रुद्राभिषेक / शिव पूजन",
    phalaSanskrit: "अस्माकं त्रिविधतापशमनार्थं आयुरारोग्यैश्वर्याभिवृद्ध्यर्थं श्रीसाम्बसदाशिवप्रीत्यर्थं रुद्राभिषेककर्म",
    phalaHindi: "आधि-व्याधि-उपाधि के शमन तथा दीर्घायु, आरोग्य एवं ऐश्वर्य वृद्धि हेतु भगवान शिव का रुद्राभिषेक",
    phalaEnglish: "Rudrabhishek of Lord Shiva for relief from all afflictions, long life and good health",
  },
  {
    id: "navratri-durga",
    category: "deity",
    titleSanskrit: "श्री दुर्गा पूजन / चण्डी पाठ",
    titleHindi: "श्री दुर्गा पूजन एवं चण्डी पाठ",
    phalaSanskrit: "मम सकलभयविनाशाय शत्रुपराभवाय श्रीदुर्गाभगवतीप्रीत्यर्थं नवदुर्गापूजनं पाठं च",
    phalaHindi: "समस्त भयों के नाश, शत्रु पराभव तथा माँ दुर्गा की कृपा प्राप्ति हेतु पूजन व दुर्गा सप्तशती पाठ",
    phalaEnglish: "Worship of Goddess Durga / Chandi Path for courage, victory and divine motherly protection",
  },
  {
    id: "hanuman-puja",
    category: "deity",
    titleSanskrit: "श्री हनुमत् पूजन / सुन्दरकाण्ड पाठ",
    titleHindi: "श्री हनुमान जी का पूजन / सुन्दरकाण्ड",
    phalaSanskrit: "मम शरीरे सकलरोगाधिनिवृत्तये बलवीर्यधैर्यप्राप्त्यर्थं श्रीहनुमत्प्रसन्नतासिद्ध्यर्थं पूजनं च",
    phalaHindi: "शारीरिक-मानसिक रोगों की निवृत्ति, बल-बुद्धि-विद्या की प्राप्ति एवं श्री हनुमान जी की कृपा हेतु",
    phalaEnglish: "Worship of Lord Hanuman / Sundarkand for strength, health, protection and fearlessness",
  },
  {
    id: "griha-pravesh",
    category: "samskara",
    titleSanskrit: "गृहप्रवेश एवं वास्तु शान्ति",
    titleHindi: "नूतन गृह प्रवेश व वास्तु शान्ति",
    phalaSanskrit: "नूतनगृहे सर्वदोषनिवारणपूर्वकं सुखशान्तिसमृद्धिस्थिरतासिद्ध्यर्थं वास्तुपुरुषप्रीत्यर्थं च गृहप्रवेशपूजनम्",
    phalaHindi: "नए घर में समस्त वास्तु दोषों की निवृत्ति, सुख, शान्ति, धन-धान्य और स्थायित्व हेतु गृह प्रवेश व वास्तु पूजन",
    phalaEnglish: "Housewarming and Vastu Shanti puja for harmony, prosperity and peace in the new residence",
  },
  {
    id: "ekadashi-vrat",
    category: "vrat",
    titleSanskrit: "श्री एकादशी व्रत संकल्प",
    titleHindi: "एकादशी व्रत संकल्प",
    phalaSanskrit: "श्रीलक्ष्मीनारायणप्रीत्यर्थं कायिकवाचिकमानसिकपापक्षयार्थं अद्यैकादशीव्रतम् अहं करिष्ये",
    phalaHindi: "भगवान लक्ष्मीनारायण की प्रीति तथा मन-वाणी-शरीर से हुए पापों के नाश हेतु एकादशी व्रत का संकल्प",
    phalaEnglish: "Ekadashi Vrat resolution to observe fast for spiritual purity and Lord Vishnu's blessings",
  },
  {
    id: "havan-yajna",
    category: "samskara",
    titleSanskrit: "हवन / होम संकल्प",
    titleHindi: "हवन / यज्ञ आहुति विधान",
    phalaSanskrit: "ग्रहपीडानिवारणाय विश्वशान्तिसमृद्धिसिद्ध्यर्थं श्रीअग्निदेवनारायणप्रीत्यर्थं हवनाङ्गकर्म",
    phalaHindi: "ग्रह दोषों की शान्ति, वातावरण शुद्धि और सुख-समृद्धि हेतु हवन/होम विधान",
    phalaEnglish: "Havan / Homa ceremony for planetary pacification, environmental purification and welfare",
  },
  {
    id: "arogya-swasthya",
    category: "desire",
    titleSanskrit: "आरोग्य एवं रोगमुक्ति",
    titleHindi: "स्वास्थ्य एवं रोगमुक्ति हेतु",
    phalaSanskrit: "मम (अथवा अमुकस्य) देहे विद्यमानसकलव्याधिशमनपूर्वकं पूर्णायुरारोग्यप्राप्त्यर्थं महामृत्युञ्जयदेवतापूजनम्",
    phalaHindi: "शरीर में स्थित समस्त व्याधियों के शमन तथा पूर्ण आरोग्य और दीर्घायु की प्राप्ति हेतु",
    phalaEnglish: "Sankalpa for physical well-being, recovery from illness and radiant health",
  },
  {
    id: "vyapar-dhan",
    category: "desire",
    titleSanskrit: "व्यापार वृद्धि एवं धन लाभ",
    titleHindi: "व्यापार वृद्धि एवं लक्ष्मी कृपा",
    phalaSanskrit: "मम व्यापारव्यवसाये धनधान्यस्थिरलक्ष्मीप्राप्त्यर्थं श्रीमहागणपतिमहालक्ष्मीप्रीत्यर्थं पूजनम्",
    phalaHindi: "व्यवसाय में उन्नति, आर्थिक समृद्धि और स्थिर लक्ष्मी की प्राप्ति के लिए महालक्ष्मी व गणपति पूजन",
    phalaEnglish: "Puja for business expansion, financial stability and Goddess Mahalakshmi's abundance",
  },
  {
    id: "birthday",
    category: "samskara",
    titleSanskrit: "आयुष्य / जन्मदिन वर्धापन संकल्प",
    titleHindi: "जन्मदिन / वर्धापन संस्कार",
    phalaSanskrit: "मम जन्मनक्षत्रतिथौ शतवर्षायुष्यतेजोबलवर्धनार्थं कुलदेवताप्रीत्यर्थं च आयुष्यहोमपूजनम्",
    phalaHindi: "जन्म दिवस के शुभ अवसर पर शतायु, तेज, बल और यश की वृद्धि हेतु कुलदेवता व इष्टदेवता का पूजन",
    phalaEnglish: "Birthday blessing sankalpa for long life, vitality, wisdom and family prosperity",
  },
  {
    id: "pitru-tarpan",
    category: "samskara",
    titleSanskrit: "पितृ तर्पण / श्राद्ध संकल्प",
    titleHindi: "पितृ तर्पण एवं श्राद्ध",
    phalaSanskrit: "मम पितृ-पितामह-प्रपितामहानां तृप्त्यर्थं अक्षयलोकप्राप्त्यर्थं च अद्य श्राद्ध/तर्पणकर्म",
    phalaHindi: "अपने पूर्वज पितरों की तृप्ति, मोक्ष तथा कुल में शान्ति हेतु तर्पण/श्राद्ध कर्म",
    phalaEnglish: "Tarpan and Shraddha sankalpa for the contentment and liberation of ancestral forefathers",
  },
];

export const SAMVATSARA_NAMES = [
  "प्रभव", "विभव", "शुक्ल", "प्रमोद", "प्रजापति", "अङ्गिरा", "श्रीमुख", "भाव", "युवा", "धाता",
  "ईश्वर", "बहुधान्य", "प्रमाथी", "विक्रम", "वृषप्रजा", "चित्रभानु", "सुभानु", "तारण", "पार्थिव", "व्यय",
  "सर्वजित्", "सर्वधारी", "विरोधी", "विकृत", "खर", "नन्दन", "विजय", "जय", "मन्मथ", "दुर्मुख",
  "हेमलम्ब", "विलम्ब", "विकारी", "शार्वरी", "प्लव", "शुभकृत्", "शोभन", "क्रोधी", "विश्वावसु", "पराभव",
  "प्लवङ्ग", "कीलक", "सौम्य", "साधारण", "विरोधकृत्", "परिधावी", "प्रमादी", "आनन्द", "राक्षस", "नल",
  "पिङ्गल", "कालयुक्त", "सिद्धार्थी", "रौद्र", "दुर्मति", "दुन्दुभी", "रुधिरोद्गारी", "रक्ताक्ष", "क्रोधन", "क्षय"
];

const VEDA_SAMVAT_NAMES = [
  "चैत्र", "वैशाख", "ज्येष्ठ", "आषाढ", "श्रावण", "भाद्रपद",
  "आश्विन", "कार्तिक", "मार्गशीर्ष", "पौष", "माघ", "फाल्गुन"
];

const RITU_SANSKRIT = [
  "वसन्ते", "ग्रीष्मे", "वर्षा", "शरद्", "हेमन्ते", "शिशिरे"
];

const VAARA_SANSKRIT: Record<number, string> = {
  0: "भानुवासरे (रविवासरे)",
  1: "सोमवासरे (इन्दुवासरे)",
  2: "भौमवासरे (मङ्गलवासरे)",
  3: "सौम्यवासरे (बुधवासरे)",
  4: "गुरुवासरे (बृहस्पतिवासरे)",
  5: "भृगुवासरे (शुक्रवासरे)",
  6: "स्थिरवासरे (शनिवासरे)",
};

const VAARA_IAST: Record<number, string> = {
  0: "Bhānuvāsare (Ravivāsare)",
  1: "Somavāsare (Induvāsare)",
  2: "Bhaumavāsare (Maṅgalavāsare)",
  3: "Saumyavāsare (Budhavāsare)",
  4: "Guruvāsare (Bṛhaspativāsare)",
  5: "Bhṛguvāsare (Śukravāsare)",
  6: "Sthiravāsare (Śanivāsare)",
};

const RASHI_SANSKRIT = [
  "मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या",
  "तुला", "वृश्चिक", "धनु", "मकर", "कुम्भ", "मीन"
];

/**
 * Generate full Vedic Sankalpa with all variants
 */
export function generateVedicSankalp(input: SankalpInput): SankalpResult {
  const safeDate =
    input.date instanceof Date && !isNaN(input.date.getTime()) ? input.date : new Date();
  const safeLocation = input.location || {
    lat: 28.6139,
    lon: 77.209,
    label: "New Delhi, India",
    tz: "Asia/Kolkata",
  };

  let tithiInfo: any = null;
  let nakshatraInfo: any = null;
  let yogaInfo: any = null;
  let karanaInfo: any = null;
  let moonRashiInfo: any = null;

  try {
    tithiInfo = getTithi(safeDate);
    nakshatraInfo = getNakshatra(safeDate);
    yogaInfo = getYoga(safeDate);
    karanaInfo = getKarana(safeDate);
    moonRashiInfo = getMoonRashi(safeDate);
  } catch (err) {
    console.warn("Panchang computation fallback:", err);
  }

  const calYear = safeDate.getFullYear();
  const vikramSamvat = calYear + 57;
  const shakaSamvat = calYear - 78;

  const samvatIndex = Math.abs((vikramSamvat + 9) % 60);
  const samvatsaraName = SAMVATSARA_NAMES[samvatIndex] || "विश्वावसु";

  const monthIdx = (safeDate.getMonth() + (safeDate.getDate() > 15 ? 1 : 0)) % 12;
  const masaSanskrit = VEDA_SAMVAT_NAMES[monthIdx] || "चैत्र";

  const isUttarayana = safeDate.getMonth() >= 0 && safeDate.getMonth() <= 5;
  const ayanaSanskrit = isUttarayana ? "उत्तरायणे" : "दक्षिणायने";
  const ayanaIast = isUttarayana ? "Uttarāyaṇe" : "Dakṣiṇāyane";

  const rituIdx = Math.floor((safeDate.getMonth() + 1) / 2) % 6;
  const rituSanskrit = RITU_SANSKRIT[rituIdx] || "वसन्ते";

  const isShukla = (tithiInfo?.index ?? 1) <= 15;
  const pakshaSanskrit = isShukla ? "शुक्लपक्षे" : "कृष्णपक्षे";
  const pakshaIast = isShukla ? "Śuklapakṣe" : "Kṛṣṇapakṣe";

  const tithiName = tithiInfo?.name || "प्रतिपदा";
  const nakshatraName = nakshatraInfo?.name || "अश्विनी";
  const yogaName = yogaInfo?.name || "विष्कम्भ";
  const karanaName = karanaInfo?.name || "बव";

  const weekdayNum = input.date.getDay();
  const vaaraSanskrit = VAARA_SANSKRIT[weekdayNum] || "शुभवासरे";
  const vaaraIast = VAARA_IAST[weekdayNum] || "Śubhavāsare";

  const suryaRashi = RASHI_SANSKRIT[monthIdx % 12];
  const chandraRashi = moonRashiInfo?.name?.split(" ")[0] || RASHI_SANSKRIT[0];

  const preset = PURPOSE_PRESETS.find((p) => p.id === input.purposePreset) || PURPOSE_PRESETS[0];
  const phalaSanskrit = input.customPurpose?.trim() || preset.phalaSanskrit;
  const phalaHindi = input.customPurpose?.trim() ? input.customPurpose : preset.phalaHindi;
  const phalaEnglish = input.customPurpose?.trim() ? input.customPurpose : preset.phalaEnglish;

  const yajamanaName = input.name.trim() || "अमुक";
  const gotraName = input.gotra.trim() || "कश्यप";
  const spouseName = input.spouseName?.trim() || "अमुकी";
  const locationName = input.location.label || "भारते";

  let yajamanaSanskrit = "";
  let yajamanaIast = "";
  let yajamanaHindi = "";

  if (input.familyMode === "spouse") {
    yajamanaSanskrit = `${gotraName}गोत्रोत्पन्नः ${yajamanaName}शर्मा/वर्मा (अहम्) मम धर्मपत्नी ${spouseName}सहितः सपत्नीकोऽहम्`;
    yajamanaIast = `${gotraName}-gotrotpannaḥ ${yajamanaName}-śarmā mama dharmapatnī ${spouseName}-sahitaḥ sapatnīko'ham`;
    yajamanaHindi = `${gotraName} गोत्र में उत्पन्न मैं (${yajamanaName}) अपनी धर्मपत्नी (${spouseName}) सहित`;
  } else if (input.familyMode === "family") {
    yajamanaSanskrit = `${gotraName}गोत्रोत्पन्नः ${yajamanaName}शर्मा (अहम्) सभार्यापुत्रपौत्रबन्धुबान्धवपरिवारसहितः`;
    yajamanaIast = `${gotraName}-gotrotpannaḥ ${yajamanaName}-śarmā sabhāryā-putra-pautra-parivāra-sahitaḥ`;
    yajamanaHindi = `${gotraName} गोत्र में उत्पन्न मैं (${yajamanaName}) अपनी पत्नी, पुत्र-पुत्री व समस्त परिवार सहित`;
  } else if (input.familyMode === "behalf") {
    const behalf = input.behalfName?.trim() || "यजमानस्य";
    yajamanaSanskrit = `${gotraName}गोत्रोत्पन्नस्य श्री ${behalf} नामधेयस्य यजमानस्य कृते प्रतिनिधिभूतोऽहम् ${yajamanaName}शर्मा`;
    yajamanaIast = `${gotraName}-gotrotpannasya śrī ${behalf} nāmādheyasya yajamānasya kṛte pratinidhibhūto'ham ${yajamanaName}`;
    yajamanaHindi = `${gotraName} गोत्र के यजमान श्री (${behalf}) के निमित्त प्रतिनिधि रूप में मैं (${yajamanaName})`;
  } else {
    yajamanaSanskrit = `${gotraName}गोत्रोत्पन्नः ${yajamanaName}शर्मा/वर्मा (अहम्)`;
    yajamanaIast = `${gotraName}-gotrotpannaḥ ${yajamanaName}-śarmā (aham)`;
    yajamanaHindi = `${gotraName} गोत्र में उत्पन्न मैं (${yajamanaName})`;
  }

  let sanskrit = "";
  let iast = "";
  let hindi = "";
  let english = "";

  if (input.sankalpType === "laghu") {
    sanskrit = `॥ श्री गणेशाय नमः ॥
ॐ तत्सत्। अद्य श्रीमद्भगवतो महापुरुषस्य विष्णोराज्ञया प्रवर्तमानस्य अद्य ब्रह्मणो द्वितीये परार्धे, श्रीश्वेतवाराहकल्पे, वैवस्वतमन्वन्तरे, अष्टाविंशतितमे कलियुगे कलिप्रथमचरणे, जम्बूद्वीपे, भारतवर्षे, भरतखण्डे, आर्यावर्तैकदेशे, ${locationName} नगरे/ग्रामे, 
विक्रमाब्दे ${vikramSamvat}, शाके ${shakaSamvat}, "${samvatsaraName}" नाम संवत्सरे, ${ayanaSanskrit}, ${rituSanskrit} ऋतौ, महामाङ्गल्यप्रदे ${masaSanskrit} मासे, ${pakshaSanskrit}, ${tithiName} तिथौ, ${vaaraSanskrit}, ${nakshatraName} नक्षत्रे, शुभ योगे, शुभ करणे, 
एवं ग्रह-गुण-विशेषण-विशिष्टायां शुभपुण्यतिथौ, ${yajamanaSanskrit}, 
${phalaSanskrit} यथाशक्ति गन्धाक्षतपुष्पादिभिः पूजनम् अहं करिष्ये।

॥ ॐ विष्णवे नमः ॥ ॐ विष्णवे नमः ॥ ॐ विष्णवे नमः ॥`;

    iast = `|| Śrī Gaṇeśāya Namaḥ ||
Oṁ Tat Sat. Adya Śrīmad-Bhagavato Mahāpuruṣasya Viṣṇor-ājñayā pravartamānasya adya Brahmaṇo dvitīye parārdhe, Śrī-Śveta-Vārāha-Kalpe, Vaivasvata-Manvantare, Aṣṭāviṁśatitame Kaliyuge Kali-prathama-caraṇe, Jambūdvīpe, Bhāratavarṣe, Bharatakhaṇḍe, Āryāvartāika-deśe, ${locationName} nagare,
Vikramābde ${vikramSamvat}, Śāke ${shakaSamvat}, "${samvatsaraName}" nāma saṁvatsare, ${ayanaIast}, ${masaSanskrit} māse, ${pakshaIast}, ${tithiName} tithau, ${vaaraIast}, ${nakshatraName} nakṣatre,
evaṁ graha-guṇa-viśeṣaṇa-viśiṣṭāyāṁ śubha-puṇya-tithau, ${yajamanaIast},
${preset.titleSanskrit} — yathā-śakti pūjanam ahaṁ kariṣye.
|| Oṁ Viṣṇave Namaḥ ||`;

    hindi = `ॐ तत् सत्। भगवान श्री हरि विष्णु की आज्ञा से प्रवर्तमान, ब्रह्मा जी के दूसरे परार्ध, श्वेतवाराह कल्प, वैवस्वत मन्वन्तर, अट्ठाईसवें कलियुग के प्रथम चरण में, जम्बूद्वीप के भारतवर्ष में, ${locationName} स्थान पर, विक्रम संवत् ${vikramSamvat}, "${samvatsaraName}" संवत्सर, ${ayanaSanskrit}, ${masaSanskrit} मास, ${pakshaSanskrit}, ${tithiName} तिथि, ${vaaraSanskrit} और ${nakshatraName} नक्षत्र के इस शुभ काल में — ${yajamanaHindi}, ${phalaHindi} अपनी सामर्थ्यानुसार श्रद्धापूर्वक पूजन का संकल्प करता हूँ/करती हूँ।`;

    english = `Om Tat Sat. Under the supreme cosmic order of Lord Vishnu, in the second half of Brahma's lifespan, during the Shveta-Varaha Kalpa, Vaivasvata Manvantara, 28th Kaliyuga (1st quarter), in Bharata-Varsha at ${locationName}, in Vikram Samvat ${vikramSamvat} (${samvatsaraName} Samvatsara), during ${masaSanskrit} month, ${pakshaSanskrit}, ${tithiName} tithi, on ${vaaraIast} with ${nakshatraName} nakshatra: I, belonging to ${gotraName} gotra, hereby solemnly resolve to perform ${phalaEnglish} with sincere devotion.`;
  } else if (input.sankalpType === "daan") {
    sanskrit = `॥ श्री गणेशाय नमः ॥
ॐ तत्सद् अद्य पूर्वोक्त-गुण-विशेषण-विशिष्टायां शुभ पुण्यतिथौ, ${locationName} नगरे, 
${yajamanaSanskrit}, 
मम सकलदुरितोपशमनार्थं, अक्षयपुण्यलोकप्राप्त्यर्थं, श्रीपरमेश्वरप्रीत्यर्थं च, 
अद्य इदं (अन्नम् / वस्त्रम् / द्रव्यम् / दक्षिणां) निष्कपटभावेन सत्पात्राय ब्राह्मणायाहं संप्रददे न मम।

॥ ॐ तत्सद् ब्रह्मार्पणमस्तु ॥`;

    iast = `|| Śrī Gaṇeśāya Namaḥ ||
Oṁ Tat Sad Adya pūrvokta-guṇa-viśeṣaṇa-viśiṣṭāyāṁ śubha-puṇyatithau, ${locationName} nagare,
${yajamanaIast},
mama sakala-duritopaśamanārthaṁ, akṣaya-puṇya-loka-prāptyarthaṁ, śrī-parameśvara-prītyarthaṁ ca,
idam annam/dravyāṁ satpātrāya brāhmaṇāyāhaṁ saṁpradade na mama.
|| Oṁ Tat Sad Brahmārpaṇamastu ||`;

    hindi = `ॐ तत् सत्। पूर्वोक्त समस्त देश, काल, तिथि व नक्षत्र के शुभ मुहूर्त में, ${locationName} स्थान पर, ${yajamanaHindi}, अपने समस्त पापों के क्षय, अक्षय पुण्य की प्राप्ति एवं श्री ईश्वर की प्रसन्नता हेतु यह दान (अन्न/द्रव्य/दक्षिणा) सत्पात्र को समर्पित करता हूँ — 'यह मेरा नहीं, सब ईश्वर का है'।`;

    english = `Om Tat Sat. On this auspicious moment in ${locationName}, I of ${gotraName} gotra, for the expiation of all sins, attainment of supreme spiritual merit, and the divine grace of Almighty God, hereby offer this charity/donation into worthy hands. May this be dedicated to the Supreme Divine.`;
  } else if (input.sankalpType === "parana") {
    sanskrit = `॥ व्रत पारण संकल्प ॥
ॐ अज्ञानाद्यदि वा मोहात् प्रच्यवेताध्वरेषु यत्।
स्मरणान्देव तद्विष्णोः सम्पूर्णं स्यादिति श्रुतिः॥

ॐ तत्सद् अद्य ${masaSanskrit} मासे ${pakshaSanskrit} ${tithiName} तिथौ ${locationName} स्थाने, 
${yajamanaSanskrit}, 
मया कृतस्य ${preset.titleSanskrit} व्रतस्य सम्पूर्णफलप्राप्त्यर्थं, सर्वदोषनिवारणार्थं च, 
श्रीलक्ष्मीनारायणप्रीत्यर्थं व्रतपारणमहं करिष्ये।

॥ ॐ विष्णवे नमः ॥ ॐ नमो भगवते वासुदेवाय ॥`;

    iast = `|| Vrat Pāraṇa Saṅkalpa ||
Oṁ ajñānād-yadi vā mohāt pracyavetādhvareṣu yat |
smaraṇāndeva tad-viṣṇoḥ sampūrṇaṁ syāditi śrutiḥ ||
Oṁ Tat Sad Adya ${masaSanskrit} māse ${pakshaIast} ${tithiName} tithau ${locationName} sthāne,
${yajamanaIast},
mayā kṛtasya ${preset.titleSanskrit} vratasya sampūrṇa-phala-prāptyarthaṁ,
Śrī-Lakṣmīnārāyaṇa-prītyarthaṁ vrata-pāraṇam-ahaṁ kariṣye.
|| Oṁ Namo Bhagavate Vāsudevāya ||`;

    hindi = `हे प्रभु! अज्ञान या प्रमादवश व्रत में जो भी न्यूनता रह गई हो, आपके स्मरण मात्र से वह पूर्ण हो। मैंने जो ${preset.titleHindi} व्रत रखा था, उसके सम्पूर्ण फल की प्राप्ति व प्रभु की प्रसन्नता हेतु अब मैं विधिपूर्वक पारण (व्रत भोजन) ग्रहण करने का संकल्प करता हूँ।`;

    english = `Om Tat Sat. In the holy presence of the Divine, I, having successfully observed the sacred ${preset.titleHindi} fasting vow, now undertake the ritual conclusion and fast-breaking (Parana) for the fulfillment of all spiritual fruit.`;
  } else {
    sanskrit = `॥ श्री गणेशाय नमः ॥ ॥ श्री गुरुभ्यो नमः ॥
ॐ विष्णुर्विष्णुर्विष्णुः, ॐ अद्य ब्रह्मणो द्वितीयपरार्धे, श्रीश्वेतवाराहकल्पे, वैवस्वतमन्वन्तरे, अष्टाविंशतितमे युगे कलियुगे, कलिप्रथमचरणे, भूर्लोके, जम्बूद्वीपे, भारतवर्षे, भरतखण्डे, आर्यावर्तैकदेशान्तर्गते, पुण्यपवित्रे ${locationName} क्षेत्रे/नगरे, 
बौद्धावतारे, वर्तमाने विक्रमादित्य नृपतेः विक्रमाब्दे ${vikramSamvat}, शालिवाहन शके ${shakaSamvat}, प्रभव-विभवादि षष्टि-संवत्सराणां मध्ये "${samvatsaraName}" नाम संवत्सरे, ${ayanaSanskrit}, ${rituSanskrit} ऋतौ, महामाङ्गल्यप्रदे शुभे ${masaSanskrit} मासे, ${pakshaSanskrit}, ${tithiName} पुण्यतिथौ, ${vaaraSanskrit}, ${nakshatraName} नक्षत्रे, ${yogaName} योगे, ${karanaName} करणे, ${suryaRashi} राशिस्थिते सूर्ये, ${chandraRashi} राशिस्थिते चन्द्रे, शेषेषु ग्रहेषु यथायथा राशिस्थानस्थितेषु सत्सु, 
एवं ग्रहगुणविशेषणविशिष्टायां शुभपुण्यतिथौ, 

${yajamanaSanskrit}, 

मम आत्मनः सपरिवारस्य च कायिक-वाचिक-मानसिक-संसर्गज-सकलपापक्षयपूर्वकं, आयुरारोग्य-ऐश्वर्य-यश-कीर्ति-धनधान्य-पुत्रपौत्रादि-सन्तति-वृद्धिद्वारा, धर्म-अर्थ-काम-मोक्ष-चतुर्विध-पुरुषार्थ-सिद्धये, 
श्रुतिस्मृतिपुराणोक्त-पुण्यफलप्राप्त्यर्थं, सकलमनोरथ-सिद्धिसिद्ध्यर्थं, 
${phalaSanskrit} 
अङ्गभूत-गणेशपूजन-कलशस्थापन-वरुणपूजन-दीपपूजन-सहितं यथाज्ञानेन यथासम्भवसामग्र्या भक्त्या च अहं करिष्ये।

॥ ॐ तत्सद् ब्रह्मार्पणमस्तु ॥ ॐ शान्तिः शान्तिः शान्तिः ॥`;

    iast = `|| Śrī Gaṇeśāya Namaḥ || || Śrī Gurubhyo Namaḥ ||
Oṁ Viṣṇur-Viṣṇur-Viṣṇuḥ, Oṁ adya Brahmaṇo dvitīya-parārdhe, Śrī-Śveta-Vārāha-Kalpe, Vaivasvata-Manvantare, Aṣṭāviṁśatitame yuge Kaliyuge, Kali-prathama-caraṇe, Bhūrloke, Jambūdvīpe, Bhāratavarṣe, Bharatakhaṇḍe, Āryāvartāika-deśāntargate, puṇya-pavitre ${locationName} kṣetre/nagare,
Bauddhāvatāre, vartamāne Vikramāditya nṛpateḥ Vikramābde ${vikramSamvat}, Śālivāhana Śake ${shakaSamvat}, "${samvatsaraName}" nāma saṁvatsare, ${ayanaIast}, ${masaSanskrit} māse, ${pakshaIast}, ${tithiName} puṇyatithau, ${vaaraIast}, ${nakshatraName} nakṣatre, ${yogaName} yoge, ${karanaName} karaṇe,
evaṁ graha-guṇa-viśeṣaṇa-viśiṣṭāyāṁ śubha-puṇyatithau,

${yajamanaIast},

mama ātmanaḥ saparivārasya ca kāyika-vācika-mānasika-sakala-pāpa-kṣaya-pūrvakaṁ, āyur-ārogya-aiśvarya-yaśa-kīrti-dhana-dhānya-santati-vṛddhi-dvārā, dharma-artha-kāma-mokṣa-caturvidha-puruṣārtha-siddhaye,
${phalaSanskrit}
yathā-jñānena yathā-sambhava-sāmagryā bhaktyā ca ahaṁ kariṣye.

|| Oṁ Tat Sad Brahmārpaṇamastu || Oṁ Śāntiḥ Śāntiḥ Śāntiḥ ||`;

    hindi = `॥ महासंकल्प का सम्पूर्ण भावार्थ ॥
ॐ विष्णु! ॐ विष्णु! ॐ विष्णु! — परमात्मा श्री हरि विष्णु के स्मरण के साथ:
1. ब्रह्माण्डीय देश-काल: ब्रह्मा जी की 100 वर्ष की आयु में से 50 वर्ष व्यतीत होने पर 51वें वर्ष के प्रथम दिन (द्वितीय परार्ध), 7वें वैवस्वत मन्वन्तर, 28वें चतुर्युगी के कलियुग के प्रथम चरण में, पृथ्वी लोक पर, जम्बूद्वीप के भारतवर्ष (आर्यावर्त) में, ${locationName} पावन क्षेत्र में।
2. पञ्चाङ्ग काल गणना: विक्रम संवत् ${vikramSamvat}, शक संवत् ${shakaSamvat}, "${samvatsaraName}" नामक संवत्सर, ${ayanaSanskrit}, ${masaSanskrit} मास, ${pakshaSanskrit}, ${tithiName} तिथि, ${vaaraSanskrit}, ${nakshatraName} नक्षत्र, ${yogaName} योग, ${karanaName} करण तथा सूर्य के ${suryaRashi} व चन्द्रमा के ${chandraRashi} राशि में स्थित होने पर।
3. यजमान एवं प्रयोजन: ${yajamanaHindi}, अपने व अपने परिवार के कायिक (शारीरिक), वाचिक (वाणी) व मानसिक समस्त पापों की शुद्धि, दीर्घायु, उत्तम स्वास्थ्य, यश, कीर्ति, धन-धान्य तथा धर्म-अर्थ-काम-मोक्ष रूपी चारों पुरुषार्थों की सिद्धि के लिए — ${phalaHindi} को भक्तिभाव व सामर्थ्यानुसार विधिवत् सम्पन्न करने का संकल्प करता हूँ। यह संकल्प ब्रह्म को समर्पित है।`;

    english = `॥ Complete Vedic Maha-Sankalpa Meaning ॥
In the name of the Supreme Divine Lord Vishnu:
1. Cosmic Geography & Age: In the second half of Brahma's cosmic era, in the Shveta-Varaha Kalpa, during the 7th Vaivasvata Manvantara, in the 28th Mahayuga's Kaliyuga (1st quarter), upon Jambudvipa in Bharatavarsha (Aryavarta), at the sacred location of ${locationName}.
2. Astronomical Almanac (Panchang): In Vikram Samvat ${vikramSamvat}, Shaka ${shakaSamvat} ("${samvatsaraName}" Jovian cycle), during ${ayanaIast}, ${masaSanskrit} month, ${pakshaIast}, on ${tithiName} lunar day, on ${vaaraIast} with ${nakshatraName} asterism.
3. Host Resolution: I, of ${gotraName} lineage, for the destruction of all physical, verbal, and mental transgressions, and for the attainment of life, health, prosperity, progeny, and the fourfold goals of life (Dharma, Artha, Kama, Moksha), hereby perform ${phalaEnglish} with all available offerings and devotion. May this resolve be blessed by the Almighty.`;
  }

  const vidhiSteps = [
    {
      step: 1,
      title: "पवित्रीकरण एवं आचमन (Purification & Achamana)",
      instruction:
        "आसन पर पूर्व या उत्तर की ओर मुख करके बैठें। ॐ केशवाय नमः, ॐ नारायणाय नमः, ॐ माधवाय नमः बोलकर 3 बार आचमन करें तथा ॐ हृषीकेशाय नमः कहकर हाथ धोएं।",
    },
    {
      step: 2,
      title: "संकल्प सामग्री ग्रहण (Hold Sacred Ingredients)",
      instruction:
        "दाहिने हाथ की हथेली में थोड़ा शुद्ध जल, पीले अक्षत (चावल), लाल/श्वेत पुष्प, एक सुपारी तथा दक्षिणा (सिक्का) रखें। बाएँ हाथ से दाहिनी हथेली को नीचे से सहारा दें।",
    },
    {
      step: 3,
      title: "ध्यान एवं उच्चार (Recitation with Devotion)",
      instruction:
        "भगवान श्री गणेश एवं अपने कुलदेवता का स्मरण करते हुए ऊपर दिए गए संस्कृत महासंकल्प/लघुसंकल्प को एकाग्रचित्त होकर पढ़ें या मन में भाव दोहराएं।",
    },
    {
      step: 4,
      title: "संकल्प समर्पण (Offering the Water)",
      instruction:
        "संकल्प मंत्र का पाठ पूर्ण होने पर हथेली की समस्त सामग्री (जल, अक्षत, पुष्प, दक्षिणा) को पूजा की तांबे की थाली या गणेश जी की प्रतिमा/कलश के आगे पूर्व-ईशान दिशा में छोड़ दें।",
    },
    {
      step: 5,
      title: "प्रार्थना एवं शान्ति (Prayer for Fulfillment)",
      instruction:
        "हाथ जोड़कर 'ॐ कायेन वाचा मनसेन्द्रियैर्वा...' बोलकर भगवान से पूजन को निर्विघ्न सम्पन्न कराने एवं मनोरथ पूर्ण करने की प्रार्थना करें।",
    },
  ];

  return {
    sanskrit,
    iast,
    hindiTranslation: hindi,
    englishTranslation: english,
    panchangSummary: {
      samvat: vikramSamvat,
      shaka: shakaSamvat,
      samvatsara: samvatsaraName,
      ayana: ayanaSanskrit,
      ritu: rituSanskrit,
      masa: masaSanskrit,
      paksha: pakshaSanskrit,
      tithi: tithiName,
      vaara: vaaraSanskrit,
      nakshatra: nakshatraName,
      yoga: yogaName,
      karana: karanaName,
      suryaRashi: `${suryaRashi} राशि`,
      chandraRashi: `${chandraRashi} राशि`,
    },
    vidhiSteps,
  };
}
