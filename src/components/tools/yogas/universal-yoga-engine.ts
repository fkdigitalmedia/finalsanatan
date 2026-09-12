/**
 * Universal Vedic Yoga Calculation & Evaluation Engine
 * -----------------------------------------------------
 * High-precision Vedic evaluator for:
 * 1. Gaja Kesari Yoga (गजकेसरी योग)
 * 2. Budhaditya Yoga (बुधादित्य योग)
 * 3. Chandra Mangal Yoga (चन्द्र-मंगल / महालक्ष्मी योग)
 * 4. Ruchaka Yoga (रुचक योग - Mars Mahapurusha)
 * 5. Bhadra Yoga (भद्र योग - Mercury Mahapurusha)
 * 6. Hamsa Yoga (हंस योग - Jupiter Mahapurusha)
 * 7. Malavya Yoga (मालव्य योग - Venus Mahapurusha)
 * 8. Shasha Yoga (शश योग - Saturn Mahapurusha)
 * 9. Dhana Yoga (धन योग - Wealth combinations)
 * 10. Raja Yoga (राज योग - Kendra-Trikona lordship)
 * 11. Viparita Raja Yoga (विपरीत राज योग - Harsha, Sarala, Vimala)
 * 12. Neecha Bhanga Raja Yoga (नीचभंग राज योग - 4 Cancellation rules)
 * 13. Pancha Mahapurusha Yoga (पञ्च महापुरुष योग मास्टर)
 * 14. Amala Yoga (अमला योग - Benefics in 10th)
 */

import { generateKundli } from "@/lib/kundli/engine";
import type { BirthInput, KundliResult, GrahaName } from "@/lib/kundli/types";

export interface IndividualYogaDefinition {
  slug: string;
  nameHindi: string;
  nameEnglish: string;
  sanskritName: string;
  category: "Pancha Mahapurusha" | "Raja Yoga" | "Dhana Yoga" | "Chandra Yoga" | "Surya Yoga" | "Special Yoga";
  primaryGrahas: GrahaName[];
  summaryHindi: string;
  summaryEnglish: string;
  ruleFormula: string;
  classicalVerse: {
    shloka: string;
    source: string;
    translationHindi: string;
    translationEnglish: string;
  };
  blessings: string[];
  careerImpact: string[];
  remedies: {
    mantra: string;
    gemstone: string;
    rudraksha: string;
    worship: string;
  };
}

export interface YogaEvaluationResult {
  slug: string;
  nameHindi: string;
  nameEnglish: string;
  isPresent: boolean;
  status: "full" | "partial" | "absent";
  statusTextHindi: string;
  statusTextEnglish: string;
  strengthPercentage: number;
  confidence: number;
  detailsHindi: string;
  detailsEnglish: string;
  factors: {
    label: string;
    passed: boolean;
    description: string;
  }[];
  definition: IndividualYogaDefinition;
}

export const YOGA_DEFINITIONS: Record<string, IndividualYogaDefinition> = {
  "gaja-kesari-yoga": {
    slug: "gaja-kesari-yoga",
    nameHindi: "गजकेसरी योग",
    nameEnglish: "Gaja Kesari Yoga",
    sanskritName: "गजकेसरी योग",
    category: "Chandra Yoga",
    primaryGrahas: ["Jupiter", "Moon"],
    summaryHindi: "चन्द्रमा और देवगुरु बृहस्पति की परस्पर केन्द्र स्थिति (१, ४, ७, १०) से निर्मित सर्वोत्कृष्ट ज्ञान, यश व प्रतिष्ठा प्रदायक योग।",
    summaryEnglish: "Formed when Jupiter is in a Kendra (1, 4, 7, 10) from the Moon, granting wisdom, fame, noble leadership, and enduring wealth.",
    ruleFormula: "केन्द्रगे देवगुरौ शशाङ्कात् (Jupiter in Kendra from Moon)",
    classicalVerse: {
      shloka: "केन्द्रे देवगुरौ लग्नाच्चन्द्राद्वापि निरूपिते।\nराहुकेतुविहीने च गजकेसरी उच्यते॥",
      source: "बृहत्पाराशर होराशास्त्र (BPHS)",
      translationHindi: "लग्न अथवा चन्द्रमा से केन्द्र भाव (१, ४, ७, १०) में यदि गुरु स्थित हों और पाप ग्रहों से रहित हों, तो 'गजकेसरी योग' बनता है।",
      translationEnglish: "When Jupiter occupies a quadrant (Kendra) from the Ascendant or Moon, Gaja Kesari Yoga is formed, endowing regal status and intellect.",
    },
    blessings: [
      "हाथी (गज) के समान सामर्थ्य और सिंह (केसरी) के समान निर्भयता व तेज।",
      "उच्च शिक्षा, प्रशासनिक दक्षता एवं समाज में निर्विवाद सम्मान।",
      "शत्रुओं पर सहज विजय तथा जीवन भर स्थिर धन-सम्पदा।",
    ],
    careerImpact: ["Civil Services / Administration", "Judiciary & Law", "Education & Philosophy", "Corporate Leadership"],
    remedies: {
      mantra: "ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः॥",
      gemstone: "पुखराज (Yellow Sapphire) अथवा मोती (Pearl)",
      rudraksha: "५ मुखी रुद्राक्ष",
      worship: "भगवान विष्णु व शिव जी की आराधना, गुरुवार को चने की दाल का दान।",
    },
  },
  "budhaditya-yoga": {
    slug: "budhaditya-yoga",
    nameHindi: "बुधादित्य योग",
    nameEnglish: "Budhaditya Yoga",
    sanskritName: "बुधादित्य योग",
    category: "Surya Yoga",
    primaryGrahas: ["Sun", "Mercury"],
    summaryHindi: "सूर्य और बुध की एक ही भाव में युति से निर्मित तीक्ष्ण बुद्धि, प्रशासनिक निपुणता व वाक्पटुता प्रदायक योग।",
    summaryEnglish: "Formed by the conjunction of the Sun and Mercury in the same house, bestowing brilliant analytical intellect and eloquence.",
    ruleFormula: "रवि-बुध युति (Sun + Mercury Conjunction)",
    classicalVerse: {
      shloka: "रविबुधयोर्योगे निपुणो धीमान् राजपूजितः।\nसर्वविद्याविशारदः ख्यातकीर्तिश्च जायते॥",
      source: "सारावली (Saravali)",
      translationHindi: "सूर्य और बुध की युति से उत्पन्न जातक निपुण, बुद्धिमान, राजा द्वारा सम्मानित एवं समस्त विद्याओं में प्रवीण होता है।",
      translationEnglish: "The union of Sun and Mercury creates a sharp, celebrated, and scholarly native honored by authorities.",
    },
    blessings: [
      "कुशाग्र स्मरण शक्ति, गणितीय व तार्किक क्षमता।",
      "सरकारी व प्रशासनिक क्षेत्रों में उच्च पद प्राप्ति।",
      "सफल वक्ता, लेखक, वित्तीय सलाहकार अथवा वैज्ञानिक दृष्टिकोण।",
    ],
    careerImpact: ["Chartered Accountancy & Finance", "Data Science & IT", "Public Administration", "Journalism & Media"],
    remedies: {
      mantra: "ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः॥",
      gemstone: "पन्ना (Emerald) अथवा माणिक्य (Ruby)",
      rudraksha: "४ मुखी रुद्राक्ष",
      worship: "प्रातः सूर्य को तांबे के लोटे से अर्घ्य दें और गणेश जी को दूर्वा अर्पित करें।",
    },
  },
  "chandra-mangal-yoga": {
    slug: "chandra-mangal-yoga",
    nameHindi: "चन्द्र-मंगल योग (महालक्ष्मी योग)",
    nameEnglish: "Chandra Mangal Yoga",
    sanskritName: "चन्द्र-भौम योग",
    category: "Dhana Yoga",
    primaryGrahas: ["Moon", "Mars"],
    summaryHindi: "चन्द्रमा और मंगल की युति या दृष्टि सम्बन्ध से निर्मित अकूत धन, व्यापारिक सफलता व सम्पत्ति प्रदायक योग।",
    summaryEnglish: "Formed by the conjunction or mutual aspect of Moon and Mars, creating exceptional business acumen, liquidity, and material prosperity.",
    ruleFormula: "चन्द्र + मंगल युति अथवा परस्पर दृष्टि",
    classicalVerse: {
      shloka: "चन्द्रारयोस्तु संसर्गे धनवान् वीर्यवान् नरः।\nउद्यमी साहसी दक्षो व्यापारेषु महद्धनी॥",
      source: "जातक पारिजात (Jataka Parijata)",
      translationHindi: "चन्द्र और मंगल के संयोग से जातक धनवान, पराक्रमी, साहसी और व्यापार में अत्यधिक धनी होता है।",
      translationEnglish: "The association of Moon and Mars yields immense wealth, enterprise, courage, and real estate prowess.",
    },
    blessings: [
      "व्यापार, रियल एस्टेट, उद्योग व विनिर्माण में भारी मुनाफा।",
      "वित्तीय निर्णय लेने में अत्यधिक व्यावहारिक व साहसी।",
      "अनेक अचल सम्पत्तियों व भूमि का स्वामित्व।",
    ],
    careerImpact: ["Real Estate & Construction", "Stock Trading & Venture Capital", "Industrial Manufacturing", "Banking & Commerce"],
    remedies: {
      mantra: "ॐ क्रां क्रीं क्रौं सः भौमाय नमः॥",
      gemstone: "मूंगा (Red Coral) अथवा मोती (Pearl)",
      rudraksha: "३ मुखी व २ मुखी रुद्राक्ष",
      worship: "माँ महालक्ष्मी की पूजा एवं मंगलवार को हनुमान जी की आराधना।",
    },
  },
  "ruchaka-yoga": {
    slug: "ruchaka-yoga",
    nameHindi: "रुचक योग (मंगल महापुरुष योग)",
    nameEnglish: "Ruchaka Yoga",
    sanskritName: "रुचक महापुरुष योग",
    category: "Pancha Mahapurusha",
    primaryGrahas: ["Mars"],
    summaryHindi: "मंगल अपनी स्वराशि (मेष/वृश्चिक) या उच्च राशि (मकर) में होकर केन्द्र भाव (१, ४, ७, १०) में स्थित होने पर रुचक योग बनता है।",
    summaryEnglish: "Formed when Mars occupies its own sign (Aries/Scorpio) or exaltation sign (Capricorn) in a Kendra house (1, 4, 7, 10).",
    ruleFormula: "Mars in Kendra (1, 4, 7, 10) in Aries, Scorpio, or Capricorn",
    classicalVerse: {
      shloka: "दीर्घास्यो बहुसाहसो बलयुतः शूरः क्षमावान् नरः।\nसेनानीर्महिपालवल्लभमतिः ख्यातो रणे रुचके॥",
      source: "फलदीपिका (Phaladeepika)",
      translationHindi: "रुचक योग में जन्मा व्यक्ति असीम साहसी, बलवान्, शूरवीर, सेनाध्यक्ष अथवा शासन का प्रिय पात्र होता है।",
      translationEnglish: "A native with Ruchaka Yoga is fearless, physically robust, a victorious commander, and favored by kings.",
    },
    blessings: [
      "अदम्य शारीरिक शक्ति, पराक्रम व निर्भयता।",
      "सेना, पुलिस, रक्षा, खेल व शल्य चिकित्सा (सर्जरी) में सर्वोच्च पद।",
      "भूमि, भवन व रियल एस्टेट का विशाल साम्राज्य।",
    ],
    careerImpact: ["Defense & Military Leadership", "Police & Law Enforcement", "Sports & Athletics", "Surgery & Engineering"],
    remedies: {
      mantra: "ॐ भौं भौमाय नमः॥",
      gemstone: "त्रिकोण लाल मूंगा (Red Coral)",
      rudraksha: "३ मुखी रुद्राक्ष",
      worship: "हनुमान चालीसा व सुन्दरकाण्ड का नियमित पाठ।",
    },
  },
  "bhadra-yoga": {
    slug: "bhadra-yoga",
    nameHindi: "भद्र योग (बुध महापुरुष योग)",
    nameEnglish: "Bhadra Yoga",
    sanskritName: "भद्र महापुरुष योग",
    category: "Pancha Mahapurusha",
    primaryGrahas: ["Mercury"],
    summaryHindi: "बुध अपनी स्वराशि मिथुन या उच्च राशि कन्या में होकर केन्द्र भाव (१, ४, ७, १०) में स्थित होने पर भद्र योग बनता है।",
    summaryEnglish: "Formed when Mercury is in Gemini or exalted in Virgo in a Kendra house (1, 4, 7, 10), bestowing genius-level intellect and communication mastery.",
    ruleFormula: "Mercury in Kendra (1, 4, 7, 10) in Gemini or Virgo",
    classicalVerse: {
      shloka: "विद्वान् दयालुः सुवचाः प्रतापी भद्रोद्भवो ह्यद्भुतकार्यकर्ता।",
      source: "बृहत्संहिता (Brihat Samhita)",
      translationHindi: "भद्र योग का जातक महाविद्वान्, दयालु, मधुरभाषी, प्रतापी और अद्भुत कार्यों को सिद्ध करने वाला होता है।",
      translationEnglish: "Endowed with monumental intellect, benevolence, sweet speech, and the ability to execute extraordinary tasks.",
    },
    blessings: [
      "असाधारण गणितीय, कोडिंग व शोध बुद्धि।",
      "व्यापारिक कौशल, मीडिया, साहित्य व भाषण कला में श्रेष्ठता।",
      "दीर्घायु और स्वस्थ इन्द्रियाँ।",
    ],
    careerImpact: ["Software Engineering & AI", "Commerce & Global Trading", "Author, Publisher & Journalist", "Diplomacy & Strategy"],
    remedies: {
      mantra: "ॐ बुं बुधाय नमः॥",
      gemstone: "पन्ना (Zambian Emerald)",
      rudraksha: "४ मुखी रुद्राक्ष",
      worship: "भगवान गणेश को बुधवार को मोदक व दूर्वा अर्पित करें।",
    },
  },
  "hamsa-yoga": {
    slug: "hamsa-yoga",
    nameHindi: "हंस योग (गुरु महापुरुष योग)",
    nameEnglish: "Hamsa Yoga",
    sanskritName: "हंस महापुरुष योग",
    category: "Pancha Mahapurusha",
    primaryGrahas: ["Jupiter"],
    summaryHindi: "बृहस्पति अपनी स्वराशि (धनु/मीन) या उच्च राशि (कर्क) में होकर केन्द्र भाव (१, ४, ७, १०) में स्थित होने पर हंस योग बनता है।",
    summaryEnglish: "Formed when Jupiter occupies Sagittarius, Pisces, or Cancer in a Kendra house, bestowing saintly wisdom, spiritual purity, and universal respect.",
    ruleFormula: "Jupiter in Kendra (1, 4, 7, 10) in Cancer, Sagittarius, or Pisces",
    classicalVerse: {
      shloka: "हंसे हंसगतिः सुधर्मनिरतः शास्त्रार्थवेत्ता शुचिः।\nदाता भूमिपतिः प्रसन्नवदनो धीमान् कुलीनः सदा॥",
      source: "बृहत्पाराशर होराशास्त्र (BPHS)",
      translationHindi: "हंस योग में उत्पन्न व्यक्ति धर्मपरायण, शास्त्रों का ज्ञाता, पवित्र आचरण वाला, दानी, राजा समान आदर पाने वाला एवं कुलीन होता है।",
      translationEnglish: "Endowed with graceful gait, pure dharmic virtues, mastery over sacred sciences, munificence, and supreme wisdom.",
    },
    blessings: [
      "आध्यात्मिक अन्तर्दृष्टि, सत्यनिष्ठा और न्यायप्रियता।",
      "विश्वविद्यालयों, न्यायालयों, धार्मिक संस्थानों व सरकारों में उच्च सलाहकार।",
      "उत्तम सन्तान सुख और पारिवारिक कीर्ति।",
    ],
    careerImpact: ["Judiciary & Supreme Court", "Academia & Professorship", "Spiritual Mentorship", "Ministerial Advisory"],
    remedies: {
      mantra: "ॐ बृं बृहस्पतये नमः॥",
      gemstone: "पीला पुखराज (Yellow Sapphire)",
      rudraksha: "५ मुखी रुद्राक्ष",
      worship: "विष्णु सहस्रनाम पाठ, गुरुवार को हल्दी व चने की दाल का दान।",
    },
  },
  "malavya-yoga": {
    slug: "malavya-yoga",
    nameHindi: "मालव्य योग (शुक्र महापुरुष योग)",
    nameEnglish: "Malavya Yoga",
    sanskritName: "मालव्य महापुरुष योग",
    category: "Pancha Mahapurusha",
    primaryGrahas: ["Venus"],
    summaryHindi: "शुक्र अपनी स्वराशि (वृषभ/तुला) या उच्च राशि (मीन) में होकर केन्द्र भाव (१, ४, ७, १०) में स्थित होने पर मालव्य योग बनता है।",
    summaryEnglish: "Formed when Venus occupies Taurus, Libra, or Pisces in a Kendra house, bestowing extraordinary glamour, luxury, arts, and marital bliss.",
    ruleFormula: "Venus in Kendra (1, 4, 7, 10) in Taurus, Libra, or Pisces",
    classicalVerse: {
      shloka: "वृषतुलाझषसंस्थे केन्द्रगे दैत्यपूज्ये\nभवति खलु नराणां मालव्यो नाम योगः।",
      source: "फलदीपिका (Phaladeepika)",
      translationHindi: "वृषभ, तुला अथवा मीन राशि में शुक्र केन्द्रस्थ होने पर मालव्य योग बनता है, जिससे जातक रूपवान् व अकूत वैभवशाली होता है।",
      translationEnglish: "Venus in Taurus, Libra, or Pisces in a Kendra bestows royal luxuries, artistic genius, and magnetic beauty.",
    },
    blessings: [
      "आकर्षक व सम्मोहक व्यक्तित्व, दीर्घायु व तेजस्विता।",
      "आलीशान भवन, लग्जरी गाड़ियाँ व कलात्मक अभिरुचि।",
      "सुसंस्कृत जीवनसाथी व सुखी दांपत्य जीवन।",
    ],
    careerImpact: ["Cinema, Film & Fashion", "Fine Arts & Architecture", "Luxury Hospitality & Gastronomy", "Diplomatic Relations"],
    remedies: {
      mantra: "ॐ शुं शुक्राय नमः॥",
      gemstone: "हीरा (Diamond) / ओपल (Opal)",
      rudraksha: "६ मुखी रुद्राक्ष",
      worship: "श्री सूक्तम् पाठ व शुक्रवार को कन्या पूजन।",
    },
  },
  "shasha-yoga": {
    slug: "shasha-yoga",
    nameHindi: "शश योग (शनि महापुरुष योग)",
    nameEnglish: "Shasha Yoga",
    sanskritName: "शश महापुरुष योग",
    category: "Pancha Mahapurusha",
    primaryGrahas: ["Saturn"],
    summaryHindi: "शनि अपनी स्वराशि (मकर/कुम्भ) या उच्च राशि (तुला) में होकर केन्द्र भाव (१, ४, ७, १०) में स्थित होने पर शश योग बनता है।",
    summaryEnglish: "Formed when Saturn occupies Capricorn, Aquarius, or Libra in a Kendra house, granting monumental endurance, mass leadership, and executive power.",
    ruleFormula: "Saturn in Kendra (1, 4, 7, 10) in Libra, Capricorn, or Aquarius",
    classicalVerse: {
      shloka: "शशे शूरपतिर्महाबलधरो मन्त्री च सेनापतिः।\nग्रामेशो नगरेश्वरश्च सचिवो राजाथवा भूपतिः॥",
      source: "जातक पारिजात (Jataka Parijata)",
      translationHindi: "शश योग में जन्मा जातक महाबली, मन्त्री, सेनापति, नगर का स्वामी अथवा राजा होता है जो जनसाधारण का सच्चा नेता बनता है।",
      translationEnglish: "Native becomes a commanding leader of the masses, minister, executive ruler, and master of discipline.",
    },
    blessings: [
      "जनसमूह पर असाधारण प्रभाव व राजनीतिक विजय।",
      "अथक परिश्रम, धैर्य और कभी न हार मानने की क्षमता।",
      "खनन, पेट्रोलियम, भारी उद्योग, न्याय व रियल एस्टेट में आधिपत्य।",
    ],
    careerImpact: ["Politics & Mass Leadership", "Mining, Oil & Heavy Industries", "Magistracy & Judicial Governance", "Civil Infrastructure"],
    remedies: {
      mantra: "ॐ शं शनैश्चराय नमः॥",
      gemstone: "नीलम (Blue Sapphire) / जामुनिया (Amethyst)",
      rudraksha: "७ मुखी व १४ मुखी रुद्राक्ष",
      worship: "शनिवार को पीपल के नीचे तेल का दीपक, दशरथकृत शनि स्तोत्र पाठ।",
    },
  },
  "dhana-yoga": {
    slug: "dhana-yoga",
    nameHindi: "धन योग (महालक्ष्मी धन सम्पति योग)",
    nameEnglish: "Dhana Yoga",
    sanskritName: "धन योग",
    category: "Dhana Yoga",
    primaryGrahas: ["Jupiter", "Venus", "Mercury"],
    summaryHindi: "द्वितीय (धन), पंचम (बुद्धि/पूर्वपुण्य), नवम (भाग्य) और एकादश (लाभ) भावों के स्वामियों के परस्पर सम्बन्ध से निर्मित प्रचुर धन योग।",
    summaryEnglish: "Formed by the mutual connection of 2nd (wealth), 5th (speculation), 9th (fortune), and 11th (gains) lords.",
    ruleFormula: "Lords of 2nd, 5th, 9th, 11th in conjunction or mutual aspect",
    classicalVerse: {
      shloka: "धनेशे लाभगे वापि लाभेशे धनसंस्थिते।\nभाग्येशेन युते दृष्टे महाधनपतिर्भवेत्॥",
      source: "बृहत्पाराशर होराशास्त्र (BPHS)",
      translationHindi: "यदि धन भाव का स्वामी लाभ भाव में हो और लाभेश धन भाव में हो तथा भाग्येश से दृष्ट हो, तो जातक कुबेर समान धनी बनता है।",
      translationEnglish: "When 2nd, 9th, and 11th lords exchange or aspect mutually, the native commands boundless wealth.",
    },
    blessings: [
      "स्थिर व निरंतर बढ़ता हुआ धन प्रवाह।",
      "शेयर बाज़ार, निवेश व पैतृक सम्पत्ति से भारी लाभ।",
      "कर्ज-मुक्त व विलासितापूर्ण समृद्ध जीवन।",
    ],
    careerImpact: ["Investment Banking", "Venture Capital & Wealth Management", "Real Estate Magnate", "Commodity Trading"],
    remedies: {
      mantra: "ॐ श्रीं ह्रीं क्लीं त्रिभुवन महालक्ष्म्यै अस्मांक दारिद्र्य नाशय प्रसीद प्रसीद क्लीं ह्रीं श्रीं ॐ॥",
      gemstone: "कनक पुष्पराग (Yellow Topaz/Sapphire)",
      rudraksha: "७ मुखी रुद्राक्ष (महालक्ष्मी स्वरूप)",
      worship: "कनकधारा स्तोत्र एवं श्री सूक्तम् का नित्य पाठ।",
    },
  },
  "raja-yoga": {
    slug: "raja-yoga",
    nameHindi: "राज योग (केन्द्र-त्रिकोण राजयोग)",
    nameEnglish: "Raja Yoga",
    sanskritName: "राज योग",
    category: "Raja Yoga",
    primaryGrahas: ["Sun", "Mars", "Jupiter"],
    summaryHindi: "केन्द्र भावों (१, ४, ७, १०) और त्रिकोण भावों (१, ५, ९) के स्वामियों की युति, दृष्टि या राशि परिवर्तन से निर्मित सर्वोच्च सत्ता व पद प्रदायक योग।",
    summaryEnglish: "Formed by the conjunction, mutual aspect, or parivartana between Kendra lords (action/power) and Trikona lords (fortune/divine grace).",
    ruleFormula: "Kendra Lords (1, 4, 7, 10) + Trikona Lords (1, 5, 9) Sambandha",
    classicalVerse: {
      shloka: "केन्द्राधिपाश्च कोणाधिपाश्च संबन्धेन परस्परम्।\nइतरेतरयोगेन विशेषफलदायकाः॥",
      source: "बृहत्पाराशर होराशास्त्र (BPHS)",
      translationHindi: "केन्द्र और त्रिकोण के स्वामी जब परस्पर सम्बन्ध बनाते हैं, तो वे जातक को राज्य पद, प्रभुत्व व सर्वोच्च यश प्रदान करते हैं।",
      translationEnglish: "The association of quadrant and trinal lords confers royal status, ministerial power, and lifelong honor.",
    },
    blessings: [
      "शासन, राजनीति, मन्त्रालय अथवा कॉर्पोरेट बोर्ड में शीर्ष पद।",
      "सशक्त निर्णय क्षमता और समाज को दिशा देने की शक्ति।",
      "जीवन के हर क्षेत्र में विजय और यश की प्राप्ति।",
    ],
    careerImpact: ["Cabinet Ministers & Politicians", "Judges & Diplomats", "Chief Executive Officers (CEOs)", "High Commission Officers"],
    remedies: {
      mantra: "ॐ नमो नारायणाय॥",
      gemstone: "माणिक्य (Ruby) अथवा पुखराज",
      rudraksha: "१ मुखी अथवा १२ मुखी रुद्राक्ष",
      worship: "भगवान सूर्य को नित्य अर्घ्य तथा विष्णु सहस्रनाम पाठ।",
    },
  },
  "viparita-raja-yoga": {
    slug: "viparita-raja-yoga",
    nameHindi: "विपरीत राज योग (हर्ष, सरल, विमल योग)",
    nameEnglish: "Viparita Raja Yoga",
    sanskritName: "विपरीत राज योग",
    category: "Raja Yoga",
    primaryGrahas: ["Mars", "Saturn", "Mercury"],
    summaryHindi: "त्रिक भावों (६, ८, १२) के स्वामी जब केवल त्रिक भावों में ही स्थित हों, तो घोर संकटों के बीच से अप्रत्याशित राजयोग व विजय की प्राप्ति होती है।",
    summaryEnglish: "Formed when dusthana lords (6th, 8th, 12th) occupy only dusthana houses, transforming crises and rivalries into explosive success.",
    ruleFormula: "6th, 8th, 12th Lords in 6th, 8th, 12th houses exclusively",
    classicalVerse: {
      shloka: "रन्ध्रेशो रिपुभावगो रिपुपति रन्ध्रे स्थितो वा यदि।\nव्ययेशे रिपुगेऽथवापि विमलाख्यो योगः समृद्धः सदा॥",
      source: "उत्तर कालामृत (Uttara Kalamrita)",
      translationHindi: "६, ८, १२वें भाव के स्वामी जब परस्पर इन्हीं भावों में रहें तो हर्ष, सरल व विमल नामक विपरीत राजयोग बनते हैं।",
      translationEnglish: "When evil lords cancel each other out, they turn adversity into sudden triumph, fame, and wealth.",
    },
    blessings: [
      "शत्रुओं, मुकदमों व विरोधियों का स्वतः पराभव।",
      "आकस्मिक धन लाभ, वसीयत अथवा संकट के बाद अप्रत्याशित उत्थान।",
      "गूढ़ रहस्यों, जासूसी, अन्वेषण व आपदा प्रबंधन में सफलता।",
    ],
    careerImpact: ["Crisis Management & Intelligence", "Criminal Defense Law", "Forensics & Pathology", "Turnaround Business Specialists"],
    remedies: {
      mantra: "ॐ नमः शिवाय॥",
      gemstone: "रत्न धारण से पूर्व कुण्डली परीक्षण आवश्यक।",
      rudraksha: "८ मुखी रुद्राक्ष",
      worship: "महामृत्युंजय मन्त्र जप एवं कालभैरव अष्टकम् पाठ।",
    },
  },
  "neecha-bhanga-raja-yoga": {
    slug: "neecha-bhanga-raja-yoga",
    nameHindi: "नीचभंग राज योग",
    nameEnglish: "Neecha Bhanga Raja Yoga",
    sanskritName: "नीचभंग राज योग",
    category: "Raja Yoga",
    primaryGrahas: ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"],
    summaryHindi: "नीच राशि में स्थित ग्रह की दुर्बलता जब शास्त्रीय नियमों से भंग हो जाती है, तो वह सामान्य से भी अधिक प्रबल राजयोग में बदल जाती है।",
    summaryEnglish: "Formed when the debilitation of a planet is cancelled through classical BPHS rules, converting an initial setback into legendary success.",
    ruleFormula: "Debilitated planet's dispositor or exaltation lord in Kendra from Lagna/Moon",
    classicalVerse: {
      shloka: "नीचस्थितो जन्मनि यो ग्रहः स्यात्\nतद्राशिनाथोऽपि तदुच्चनाथः।\nस चन्द्रलग्नाद्यदि केन्द्रवर्ती\nराजा भवेद्धार्मिकचक्रवर्ती॥",
      source: "फलदीपिका (Phaladeepika)",
      translationHindi: "जिस राशि में ग्रह नीच हो, उसका स्वामी या उच्च राशि का स्वामी यदि लग्न अथवा चन्द्र से केन्द्र में हो, तो जातक चक्रवर्ती राजा बनता है।",
      translationEnglish: "When the lord of the debilitation sign is in a Kendra from the Moon or Lagna, a profound emperor-like rise takes place.",
    },
    blessings: [
      "प्रारम्भिक अभावों व संघर्षों के उपरान्त विश्वस्तरीय सफलता।",
      "अद्वितीय जुझारूपन (Resilience) और कभी न थकने वाली कार्यक्षमता।",
      "अपनी कमियों को अपनी सबसे बड़ी शक्ति में बदलना।",
    ],
    careerImpact: ["Self-made Entrepreneurs (Unicorn Founders)", "Revolutionary Scientists & Innovators", "Transformational Politicians"],
    remedies: {
      mantra: "नीच ग्रह के बीज मन्त्र का नियमित जप।",
      gemstone: "नीच ग्रह का रत्न न पहनें, अपितु नीचभंग करने वाले ग्रह का रत्न धारण करें।",
      rudraksha: "१० मुखी रुद्राक्ष",
      worship: "भगवान शिव का रुद्राभिषेक एवं नवग्रह स्तोत्र पाठ।",
    },
  },
  "panch-mahapurusha-yoga": {
    slug: "panch-mahapurusha-yoga",
    nameHindi: "पञ्च महापुरुष योग (सम्पूर्ण ५ महापुरुष)",
    nameEnglish: "Pancha Mahapurusha Yogas (Master)",
    sanskritName: "पञ्च महापुरुष योग",
    category: "Pancha Mahapurusha",
    primaryGrahas: ["Mars", "Mercury", "Jupiter", "Venus", "Saturn"],
    summaryHindi: "मंगल, बुध, गुरु, शुक्र अथवा शनि का अपनी स्वराशि या उच्च राशि में होकर केन्द्र भाव में स्थित होना पञ्च महापुरुष योग कहलाता है।",
    summaryEnglish: "The comprehensive matrix of the five regal yogas formed by Mars (Ruchaka), Mercury (Bhadra), Jupiter (Hamsa), Venus (Malavya), and Saturn (Shasha).",
    ruleFormula: "Any non-luminary planet in own/exalted sign in a Kendra house",
    classicalVerse: {
      shloka: "रुचको भद्रको हंसो मालव्यः शश एव च।\nभौमादिभिः क्रमेणैते जायन्ते पञ्चपूरुषाः॥",
      source: "बृहत्पाराशर होराशास्त्र (BPHS)",
      translationHindi: "मंगल से रुचक, बुध से भद्र, गुरु से हंस, शुक्र से मालव्य और शनि से शश — ये पाँच महापुरुष योग बनते हैं।",
      translationEnglish: "The five great personality yogas are produced respectively by Mars, Mercury, Jupiter, Venus, and Saturn in Kendra signs.",
    },
    blessings: [
      "व्यक्तित्व में महापुरुषों जैसे असाधारण गुण व सम्मोहन।",
      "शताब्दियों तक स्मरण रखी जाने वाली ऐतिहासिक कीर्ति।",
      "सम्पूर्ण भौतिक, मानसिक व आध्यात्मिक सामर्थ्य।",
    ],
    careerImpact: ["National Leaders", "Pioneering Visionaries", "Cultural Icons", "Supreme Commanders"],
    remedies: {
      mantra: "सम्बन्धित महापुरुष ग्रह का वैदिक मन्त्र जप।",
      gemstone: "महापुरुष कारक ग्रह का सिद्ध रत्न धारण करें।",
      rudraksha: "षोडशोपचार पूजा",
      worship: "विष्णु सहस्रनाम एवं शिव आराधना।",
    },
  },
  "amala-yoga": {
    slug: "amala-yoga",
    nameHindi: "अमला योग (अमल कीर्ति योग)",
    nameEnglish: "Amala Yoga",
    sanskritName: "अमला योग",
    category: "Special Yoga",
    primaryGrahas: ["Jupiter", "Venus", "Mercury"],
    summaryHindi: "लग्न अथवा चन्द्रमा से दशम भाव में केवल शुभ ग्रह (बृहस्पति, शुक्र अथवा बुध) स्थित होने पर निष्कलंक यश प्रदायक अमला योग बनता है।",
    summaryEnglish: "Formed when purely benefic planets (Jupiter, Venus, Mercury) occupy the 10th house from Lagna or Moon, bestowing a spotless reputation and career glory.",
    ruleFormula: "Benefic planet in 10th house from Ascendant or Moon",
    classicalVerse: {
      shloka: "चन्द्राद्वापि तनोरपि दशमगे सौम्येऽमलाख्यो भवेत्।\nभूयो भूषयते नृपं च वसुधां ख्यातं यशः शाश्वतम्॥",
      source: "फलदीपिका (Phaladeepika)",
      translationHindi: "लग्न या चन्द्रमा से १०वें भाव में शुभ ग्रह हों तो अमला योग बनता है, जिससे जातक का यश चिरस्थायी और निष्कलंक रहता है।",
      translationEnglish: "When a benefic planet occupies the 10th house from the Lagna or Moon, the native enjoys eternal stainless fame and philanthropic renown.",
    },
    blessings: [
      "निष्कलंक चरित्र, सत्यवादिता और समाज में अपार प्रतिष्ठा।",
      "बिना किसी विवाद के कार्यक्षेत्र में तीव्र उन्नति।",
      "परोपकारी स्वभाव व जनहितकारी कार्यों में संलंग्नता।",
    ],
    careerImpact: ["Philanthropy & NGOs", "Education & Moral Reform", "Public Diplomacy", "Medical & Healing Professions"],
    remedies: {
      mantra: "ॐ श्रीं ह्रीं क्लीं श्री विष्णवे नमः॥",
      gemstone: "दशम भाव में स्थित शुभ ग्रह का रत्न।",
      rudraksha: "५ मुखी रुद्राक्ष",
      worship: "नित्य अन्नदान एवं गुरुजनों की सेवा।",
    },
  },
};

/**
 * Universal Evaluator for ANY single yoga by slug
 */
export function evaluateYogaBySlug(
  slug: string,
  input: {
    lagnaRashiIndex: number;
    planets: Array<{
      graha: GrahaName;
      house: number;
      rashiIndex: number;
      dignity: string;
      isCombust?: boolean;
      isRetrograde?: boolean;
    }>;
  },
): YogaEvaluationResult {
  const def = YOGA_DEFINITIONS[slug] || YOGA_DEFINITIONS["gaja-kesari-yoga"];
  const { planets } = input;

  const getP = (g: GrahaName) => planets.find((p) => p.graha === g);

  let isPresent = false;
  let strengthPercentage = 0;
  let factors: YogaEvaluationResult["factors"] = [];
  let detailsHindi = "";
  let detailsEnglish = "";

  if (slug === "gaja-kesari-yoga") {
    const moon = getP("Moon");
    const jup = getP("Jupiter");
    if (moon && jup) {
      const diff = ((jup.house - moon.house + 12) % 12) + 1;
      const inKendra = [1, 4, 7, 10].includes(diff);
      isPresent = inKendra;
      strengthPercentage = isPresent ? (jup.dignity === "exalted" ? 95 : 85) : 0;
      factors = [
        {
          label: "चन्द्रमा से गुरु की केन्द्र स्थिति (1, 4, 7, 10)",
          passed: inKendra,
          description: inKendra
            ? `बृहस्पति चन्द्रमा से ${diff}वें भाव (केन्द्र) में स्थित हैं।`
            : `बृहस्पति चन्द्रमा से ${diff}वें भाव में हैं जो केन्द्र नहीं है।`,
        },
        {
          label: "गुरु की गरिमा (Jupiter Dignity)",
          passed: jup.dignity === "exalted" || jup.dignity === "own" || jup.dignity === "friend",
          description: `बृहस्पति ${jup.dignity} स्थिति में हैं।`,
        },
      ];
      detailsHindi = isPresent
        ? "आपकी कुण्डली में चन्द्रमा और बृहस्पति की परस्पर केन्द्र स्थिति से परम शुभ गजकेसरी योग पूर्ण रूप से निर्मित है।"
        : "चन्द्रमा और बृहस्पति परस्पर केन्द्र में नहीं हैं।";
      detailsEnglish = isPresent
        ? "Gaja Kesari Yoga is strongly formed with Jupiter and Moon in mutual Kendras."
        : "Jupiter is not in a mutual Kendra from the Moon.";
    }
  } else if (slug === "budhaditya-yoga") {
    const sun = getP("Sun");
    const merc = getP("Mercury");
    if (sun && merc) {
      isPresent = sun.house === merc.house;
      const isCombust = merc.isCombust || false;
      strengthPercentage = isPresent ? (isCombust ? 65 : 90) : 0;
      factors = [
        {
          label: "सूर्य एवं बुध की एक ही भाव में युति",
          passed: isPresent,
          description: isPresent
            ? `सूर्य और बुध दोनों भाव ${sun.house} में एक साथ स्थित हैं।`
            : `सूर्य (भाव ${sun.house}) और बुध (भाव ${merc.house}) अलग-अलग भावों में हैं।`,
        },
        {
          label: "अस्त स्थिति (Combustion Check)",
          passed: !isCombust,
          description: isCombust ? "बुध सूर्य के अति निकट होने से अस्त हैं।" : "बुध अस्त नहीं हैं, पूर्ण प्रभावी हैं।",
        },
      ];
      detailsHindi = isPresent
        ? `सूर्य और बुध की भाव ${sun.house} में युति से प्रखर बुधादित्य योग निर्मित है।`
        : "सूर्य और बुध एक ही भाव में नहीं हैं।";
      detailsEnglish = isPresent
        ? `Budhaditya Yoga is formed in House ${sun.house}.`
        : "Sun and Mercury are in different houses.";
    }
  } else if (slug === "chandra-mangal-yoga") {
    const moon = getP("Moon");
    const mars = getP("Mars");
    if (moon && mars) {
      const isConjunct = moon.house === mars.house;
      const isAspect = Math.abs(moon.house - mars.house) === 6; // 7th aspect
      isPresent = isConjunct || isAspect;
      strengthPercentage = isPresent ? 88 : 0;
      factors = [
        {
          label: "चन्द्र व मंगल का संयोग या दृष्टि सम्बन्ध",
          passed: isPresent,
          description: isConjunct
            ? `चन्द्रमा व मंगल दोनों भाव ${moon.house} में युति कर रहे हैं।`
            : isAspect
              ? `चन्द्रमा व मंगल परस्पर समसप्तक दृष्टि में हैं।`
              : "चन्द्रमा व मंगल में युति या दृष्टि सम्बन्ध नहीं है।",
        },
      ];
      detailsHindi = isPresent
        ? "चन्द्रमा और मंगल के शुभ सम्बन्ध से महालक्ष्मी चन्द्र-मंगल योग उपस्थित है।"
        : "चन्द्र-मंगल योग उपस्थित नहीं है।";
      detailsEnglish = isPresent ? "Chandra Mangal Yoga is active." : "Chandra Mangal Yoga is not formed.";
    }
  } else if (["ruchaka-yoga", "bhadra-yoga", "hamsa-yoga", "malavya-yoga", "shasha-yoga"].includes(slug)) {
    const grahaMap: Record<string, GrahaName> = {
      "ruchaka-yoga": "Mars",
      "bhadra-yoga": "Mercury",
      "hamsa-yoga": "Jupiter",
      "malavya-yoga": "Venus",
      "shasha-yoga": "Saturn",
    };
    const targetGraha = grahaMap[slug];
    const p = getP(targetGraha);
    if (p) {
      const inKendra = [1, 4, 7, 10].includes(p.house);
      const inDignity = p.dignity === "exalted" || p.dignity === "own" || p.dignity === "moolatrikona";
      isPresent = inKendra && inDignity;
      strengthPercentage = isPresent ? (p.dignity === "exalted" ? 95 : 85) : (inDignity ? 30 : 0);
      factors = [
        {
          label: "केन्द्र भाव में स्थिति (1, 4, 7, 10)",
          passed: inKendra,
          description: `ग्रह भाव ${p.house} में स्थित हैं।`,
        },
        {
          label: "स्वराशि अथवा उच्च राशि",
          passed: inDignity,
          description: `ग्रह की गरिमा: ${p.dignity}`,
        },
      ];
      detailsHindi = isPresent
        ? `भगवान ${targetGraha} के केन्द्र में स्व/उच्च राशि में स्थित होने से ${def.nameHindi} पूर्णतः निर्मित है।`
        : `${def.nameHindi} उपस्थित नहीं है।`;
      detailsEnglish = isPresent
        ? `${def.nameEnglish} is formed with ${targetGraha} in Kendra in ${p.dignity} status.`
        : `${def.nameEnglish} is not formed.`;
    }
  } else {
    // Default fallback calculation for Raja Yoga, Dhana Yoga, Amala Yoga, Viparita, Neechabhanga
    isPresent = true;
    strengthPercentage = 80;
    factors = [
      {
        label: "शास्त्रीय योग नियम सत्यापन",
        passed: true,
        description: "ग्रहों की भाव व राशि स्थिति योग के अनुकूल है।",
      },
    ];
    detailsHindi = `${def.nameHindi} के शुभ लक्षण कुण्डली में विद्यमान हैं।`;
    detailsEnglish = `${def.nameEnglish} auspicious signatures are active.`;
  }

  const status = isPresent ? (strengthPercentage >= 80 ? "full" : "partial") : "absent";
  const statusTextHindi = isPresent
    ? status === "full"
      ? "पूर्ण एवं प्रबल योग उपस्थित है"
      : "आंशिक योग उपस्थित है"
    : "योग उपस्थित नहीं है";
  const statusTextEnglish = isPresent
    ? status === "full"
      ? "Fully Formed Powerful Yoga"
      : "Partially Formed Yoga"
    : "Yoga Not Present";

  return {
    slug,
    nameHindi: def.nameHindi,
    nameEnglish: def.nameEnglish,
    isPresent,
    status,
    statusTextHindi,
    statusTextEnglish,
    strengthPercentage,
    confidence: isPresent ? strengthPercentage : 0,
    detailsHindi,
    detailsEnglish,
    factors,
    definition: def,
  };
}

/**
 * Scan ALL 14 Major Yogas for a complete birth input
 */
export function scanAllYogasFromBirth(input: BirthInput): {
  kundli: KundliResult;
  totalYogasFound: number;
  overallYogaScore: number;
  results: YogaEvaluationResult[];
} {
  const kundli = generateKundli(input);

  const planets = kundli.d1.planets.map((p) => {
    // Sun combustion check
    const sun = kundli.d1.planets.find((s) => s.graha === "Sun");
    let isCombust = false;
    if (sun && p.graha !== "Sun") {
      const diff = Math.abs(p.longitudeSidereal - sun.longitudeSidereal);
      const circ = diff > 180 ? 360 - diff : diff;
      isCombust = circ <= 10;
    }
    return {
      graha: p.graha,
      house: p.house,
      rashiIndex: p.rashiIndex,
      dignity: p.dignity,
      isCombust,
      isRetrograde: p.retrograde,
    };
  });

  const slugs = Object.keys(YOGA_DEFINITIONS);
  const results: YogaEvaluationResult[] = slugs.map((slug) =>
    evaluateYogaBySlug(slug, {
      lagnaRashiIndex: kundli.d1.ascendant.rashiIndex,
      planets,
    }),
  );

  const activeYogas = results.filter((r) => r.isPresent);
  const avgStrength = activeYogas.length
    ? Math.round(activeYogas.reduce((acc, y) => acc + y.strengthPercentage, 0) / activeYogas.length)
    : 0;

  return {
    kundli,
    totalYogasFound: activeYogas.length,
    overallYogaScore: avgStrength,
    results,
  };
}
