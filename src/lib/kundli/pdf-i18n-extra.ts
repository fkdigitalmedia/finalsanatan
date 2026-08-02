// ============================================================
// Kundli PDF — Sprint 1 extra labels
// ------------------------------------------------------------
// Panchang-at-birth, Avakahada Chakra, Vimshottari Dasha labels.
// Kept separate so we don't need to expand every language object
// in pdf-i18n.ts — English is the default, Hindi provided.
// ============================================================
import type { PdfLang } from "./pdf-i18n";

export interface PdfExtraLabels {
  // Panchang at Birth
  panchangTitle: string;
  panchangSubtitle: string;
  tithi: string;
  paksha: string;
  vaar: string;
  nakshatraLabel: string;
  yoga: string;
  karana: string;
  deity: string;
  lord: string;
  pada: string;
  // Avakahada
  avakahadaTitle: string;
  avakahadaSubtitle: string;
  varna: string;
  vashya: string;
  yoni: string;
  gana: string;
  nadi: string;
  tatva: string;
  paya: string;
  namingLetter: string;
  namingLetters: string;
  nakLord: string;
  rashiLord: string;
  // Vimshottari
  dashaTitle: string;
  dashaSubtitle: string;
  balanceAtBirth: string;
  yearsRemaining: string;
  currentMd: string;
  currentAd: string;
  mahadasha: string;
  antardasha: string;
  from: string;
  to: string;
  years: string;
  timeline: string;
  // Sprint 2 — Yogas / Doshas / Remedies
  yogasTitle: string;
  yogasSubtitle: string;
  doshasTitle: string;
  doshasSubtitle: string;
  remediesTitle: string;
  remediesSubtitle: string;
  presentYes: string;
  presentNo: string;
  severity: string;
  strength: string;
  category: string;
  notPresentNote: string;
  disclaimerRemedy: string;
  // Sprint 3 — Divisional / Shadbala / Ashtakvarga
  divisionalTitle: string;
  divisionalSubtitle: string;
  shadbalaTitle: string;
  shadbalaSubtitle: string;
  ashtakvargaTitle: string;
  ashtakvargaSubtitle: string;
  sthanaBala: string;
  digBala: string;
  kalaBala: string;
  cheshtaBala: string;
  naisargikaBala: string;
  drikBala: string;
  totalVirupas: string;
  totalRupas: string;
  requiredRupas: string;
  strongest: string;
  weakest: string;
  sarvashtakavarga: string;
  bhinnashtakavarga: string;
  totalBindus: string;
  pratyantar: string;
  currentPd: string;
  meaningTitle: string;
  effectsTitle: string;
  causesTitle: string;
  cancellationTitle: string;
  detailedRemediesTitle: string;
  areasOfLife: string;
  nowMarker: string;
  timelineVisual: string;
  strengthChart: string;
  savHeatmap: string;
  savHeatmapSubtitle: string;
}

const EN: PdfExtraLabels = {
  panchangTitle: "Panchang at Birth",
  panchangSubtitle: "The five limbs of time at your birth moment",
  tithi: "Tithi",
  paksha: "Paksha",
  vaar: "Vaar (Weekday)",
  nakshatraLabel: "Nakshatra",
  yoga: "Yoga",
  karana: "Karana",
  deity: "Deity",
  lord: "Lord",
  pada: "Pada",
  avakahadaTitle: "Avakahada Chakra",
  avakahadaSubtitle: "Traditional classification derived from Janma Nakshatra",
  varna: "Varna",
  vashya: "Vashya",
  yoni: "Yoni",
  gana: "Gana",
  nadi: "Nadi",
  tatva: "Tatva",
  paya: "Paya",
  namingLetter: "Naming Letter",
  namingLetters: "Naming Letters (all padas)",
  nakLord: "Nakshatra Lord",
  rashiLord: "Rashi Lord",
  dashaTitle: "Vimshottari Mahadasha",
  dashaSubtitle: "120-year planetary timeline from birth",
  balanceAtBirth: "Balance of Dasha at Birth",
  yearsRemaining: "Years remaining",
  currentMd: "Current Mahadasha",
  currentAd: "Current Antardasha",
  mahadasha: "Mahadasha",
  antardasha: "Antardasha",
  from: "From",
  to: "To",
  years: "Years",
  timeline: "Full Timeline",
  yogasTitle: "Yogas in your Chart",
  yogasSubtitle: "Classical planetary combinations detected in the D1 chart",
  doshasTitle: "Doshas Analysis",
  doshasSubtitle: "Traditional afflictions — presence, severity and cancellation",
  remediesTitle: "Suggested Remedies",
  remediesSubtitle: "Traditional guidance based on your chart",
  presentYes: "Present",
  presentNo: "Not present",
  severity: "Severity",
  strength: "Strength",
  category: "Category",
  notPresentNote: "Only formed yogas are shown in the detailed section below.",
  disclaimerRemedy:
    "Remedies are traditional guidance. Consult a qualified astrologer before wearing gemstones or making major changes.",
  divisionalTitle: "Divisional Charts (Vargas)",
  divisionalSubtitle: "D3 Drekkana · D7 Saptamsa · D10 Dasamsa · D12 Dwadasamsa",
  shadbalaTitle: "Shadbala — Six-fold Strength",
  shadbalaSubtitle: "Classical strength of the seven grahas (in Virupas / Rupas)",
  ashtakvargaTitle: "Ashtakvarga",
  ashtakvargaSubtitle: "Bhinnashtakavarga bindus + Sarvashtakavarga total by sign",
  sthanaBala: "Sthana",
  digBala: "Dig",
  kalaBala: "Kala",
  cheshtaBala: "Cheshta",
  naisargikaBala: "Naisargika",
  drikBala: "Drik",
  totalVirupas: "Total (V)",
  totalRupas: "Rupas",
  requiredRupas: "Required",
  strongest: "Strongest",
  weakest: "Weakest",
  sarvashtakavarga: "Sarvashtakavarga (SAV)",
  bhinnashtakavarga: "Bhinnashtakavarga (BAV)",
  totalBindus: "Total",
  pratyantar: "Pratyantar-dasha",
  currentPd: "Current Pratyantar",
  meaningTitle: "What this means",
  effectsTitle: "Effects & Areas of Life",
  causesTitle: "Why it forms",
  cancellationTitle: "Cancellation & Mitigation",
  detailedRemediesTitle: "Detailed Remedies",
  areasOfLife: "Areas of Life",
  nowMarker: "Today",
  timelineVisual: "120-Year Timeline",
  strengthChart: "Strength vs Required",
  savHeatmap: "Sarvashtakavarga Heatmap",
  savHeatmapSubtitle: "Sign-wise strength — darker = more benefic points",
};

const HI: PdfExtraLabels = {
  panchangTitle: "जन्म पंचांग",
  panchangSubtitle: "जन्म के समय पंचांग के पाँच अंग",
  tithi: "तिथि",
  paksha: "पक्ष",
  vaar: "वार",
  nakshatraLabel: "नक्षत्र",
  yoga: "योग",
  karana: "करण",
  deity: "देवता",
  lord: "स्वामी",
  pada: "पद",
  avakahadaTitle: "अवकहड़ा चक्र",
  avakahadaSubtitle: "जन्म नक्षत्र से प्राप्त पारंपरिक वर्गीकरण",
  varna: "वर्ण",
  vashya: "वश्य",
  yoni: "योनि",
  gana: "गण",
  nadi: "नाड़ी",
  tatva: "तत्व",
  paya: "पाया",
  namingLetter: "नामाक्षर",
  namingLetters: "नामाक्षर (सभी पद)",
  nakLord: "नक्षत्र स्वामी",
  rashiLord: "राशि स्वामी",
  dashaTitle: "विंशोत्तरी महादशा",
  dashaSubtitle: "जन्म से १२० वर्ष की ग्रह दशा",
  balanceAtBirth: "जन्म समय दशा शेष",
  yearsRemaining: "शेष वर्ष",
  currentMd: "वर्तमान महादशा",
  currentAd: "वर्तमान अंतर्दशा",
  mahadasha: "महादशा",
  antardasha: "अंतर्दशा",
  from: "प्रारंभ",
  to: "समाप्ति",
  years: "वर्ष",
  timeline: "पूर्ण समय-रेखा",
  yogasTitle: "आपकी कुंडली के योग",
  yogasSubtitle: "D1 कुंडली में पाए गए शास्त्रीय ग्रह योग",
  doshasTitle: "दोष विश्लेषण",
  doshasSubtitle: "पारंपरिक दोष — उपस्थिति, तीव्रता और निवारण",
  remediesTitle: "सुझाए गए उपाय",
  remediesSubtitle: "आपकी कुंडली पर आधारित पारंपरिक मार्गदर्शन",
  presentYes: "उपस्थित",
  presentNo: "अनुपस्थित",
  severity: "तीव्रता",
  strength: "बल",
  category: "श्रेणी",
  notPresentNote: "नीचे केवल बने हुए योगों का विस्तृत विवरण दिखाया गया है।",
  disclaimerRemedy:
    "उपाय पारंपरिक मार्गदर्शन हैं। रत्न धारण करने से पहले योग्य ज्योतिषी से परामर्श लें।",
  divisionalTitle: "वर्ग कुंडलियाँ",
  divisionalSubtitle: "द्रेष्काण · सप्तमांश · दशमांश · द्वादशांश",
  shadbalaTitle: "षड्बल — ग्रह बल",
  shadbalaSubtitle: "सात ग्रहों का शास्त्रीय षड्बल (विरूप / रूप)",
  ashtakvargaTitle: "अष्टकवर्ग",
  ashtakvargaSubtitle: "भिन्नाष्टकवर्ग बिंदु और सर्वाष्टकवर्ग योग",
  sthanaBala: "स्थान",
  digBala: "दिग्",
  kalaBala: "काल",
  cheshtaBala: "चेष्टा",
  naisargikaBala: "नैसर्गिक",
  drikBala: "दृक्",
  totalVirupas: "योग (वि)",
  totalRupas: "रूप",
  requiredRupas: "आवश्यक",
  strongest: "सर्वाधिक बलवान",
  weakest: "सबसे निर्बल",
  sarvashtakavarga: "सर्वाष्टकवर्ग",
  bhinnashtakavarga: "भिन्नाष्टकवर्ग",
  totalBindus: "योग",
  pratyantar: "प्रत्यंतर दशा",
  currentPd: "वर्तमान प्रत्यंतर",
  meaningTitle: "इसका अर्थ",
  effectsTitle: "प्रभाव और जीवन क्षेत्र",
  causesTitle: "बनने का कारण",
  cancellationTitle: "निवारण एवं शमन",
  detailedRemediesTitle: "विस्तृत उपाय",
  areasOfLife: "जीवन क्षेत्र",
  nowMarker: "आज",
  timelineVisual: "१२० वर्ष समय-रेखा",
  strengthChart: "बल तुलना",
  savHeatmap: "सर्वाष्टकवर्ग हीट-मैप",
  savHeatmapSubtitle: "राशिवार शक्ति — गहरा रंग = अधिक शुभ बिंदु",
};

const MR: PdfExtraLabels = {
  panchangTitle: "जन्म पंचांग",
  panchangSubtitle: "जन्माच्या क्षणी पंचांगाची पाच अंगे",
  tithi: "तिथी",
  paksha: "पक्ष",
  vaar: "वार",
  nakshatraLabel: "नक्षत्र",
  yoga: "योग",
  karana: "करण",
  deity: "देवता",
  lord: "स्वामी",
  pada: "पाद",
  avakahadaTitle: "अवकहडा चक्र",
  avakahadaSubtitle: "जन्म नक्षत्रावरून मिळालेले पारंपरिक वर्गीकरण",
  varna: "वर्ण",
  vashya: "वश्य",
  yoni: "योनी",
  gana: "गण",
  nadi: "नाडी",
  tatva: "तत्व",
  paya: "पाया",
  namingLetter: "नामाक्षर",
  namingLetters: "नामाक्षरे (सर्व पाद)",
  nakLord: "नक्षत्र स्वामी",
  rashiLord: "राशी स्वामी",
  dashaTitle: "विंशोत्तरी महादशा",
  dashaSubtitle: "जन्मापासून १२० वर्षांची ग्रह दशा",
  balanceAtBirth: "जन्मवेळी दशा शिल्लक",
  yearsRemaining: "शिल्लक वर्षे",
  currentMd: "सध्याची महादशा",
  currentAd: "सध्याची अंतर्दशा",
  mahadasha: "महादशा",
  antardasha: "अंतर्दशा",
  from: "पासून",
  to: "पर्यंत",
  years: "वर्षे",
  timeline: "संपूर्ण कालरेखा",
  yogasTitle: "तुमच्या कुंडलीतील योग",
  yogasSubtitle: "D1 कुंडलीत आढळलेले शास्त्रीय ग्रह योग",
  doshasTitle: "दोष विश्लेषण",
  doshasSubtitle: "पारंपरिक दोष — उपस्थिती, तीव्रता आणि निवारण",
  remediesTitle: "सुचवलेले उपाय",
  remediesSubtitle: "तुमच्या कुंडलीवर आधारित पारंपरिक मार्गदर्शन",
  presentYes: "उपस्थित",
  presentNo: "अनुपस्थित",
  severity: "तीव्रता",
  strength: "बल",
  category: "श्रेणी",
  notPresentNote: "खाली फक्त तयार झालेल्या योगांचे तपशील दाखवले आहेत.",
  disclaimerRemedy:
    "उपाय हे पारंपरिक मार्गदर्शन आहेत. रत्न धारण करण्यापूर्वी योग्य ज्योतिषाचा सल्ला घ्या.",
  divisionalTitle: "वर्ग कुंडल्या",
  divisionalSubtitle: "द्रेष्काण · सप्तमांश · दशमांश · द्वादशांश",
  shadbalaTitle: "षड्बल — ग्रह बल",
  shadbalaSubtitle: "सात ग्रहांचे शास्त्रीय षड्बल (विरूप / रूप)",
  ashtakvargaTitle: "अष्टकवर्ग",
  ashtakvargaSubtitle: "भिन्नाष्टकवर्ग बिंदू आणि सर्वाष्टकवर्ग एकूण",
  sthanaBala: "स्थान",
  digBala: "दिक्",
  kalaBala: "काल",
  cheshtaBala: "चेष्टा",
  naisargikaBala: "नैसर्गिक",
  drikBala: "दृक्",
  totalVirupas: "एकूण (वि)",
  totalRupas: "रूप",
  requiredRupas: "आवश्यक",
  strongest: "सर्वात बलवान",
  weakest: "सर्वात दुर्बल",
  sarvashtakavarga: "सर्वाष्टकवर्ग",
  bhinnashtakavarga: "भिन्नाष्टकवर्ग",
  totalBindus: "एकूण",
  pratyantar: "प्रत्यंतर दशा",
  currentPd: "सध्याची प्रत्यंतर",
  meaningTitle: "याचा अर्थ",
  effectsTitle: "परिणाम आणि जीवन क्षेत्रे",
  causesTitle: "तयार होण्याचे कारण",
  cancellationTitle: "निवारण आणि शमन",
  detailedRemediesTitle: "तपशीलवार उपाय",
  areasOfLife: "जीवन क्षेत्रे",
  nowMarker: "आज",
  timelineVisual: "१२० वर्षांची कालरेखा",
  strengthChart: "बल तुलना",
  savHeatmap: "सर्वाष्टकवर्ग हीट-मॅप",
  savHeatmapSubtitle: "राशीनुसार बल — गडद रंग = अधिक शुभ बिंदू",
};

export const PDF_EXTRA_LABELS: Record<PdfLang, PdfExtraLabels> = {
  en: EN,
  hi: HI,
  mr: MR,
  gu: EN,
  ta: EN,
  te: EN,
  kn: EN,
  bn: EN,
  ml: EN,
  pa: EN,
  or: EN,
  as: EN,
};
