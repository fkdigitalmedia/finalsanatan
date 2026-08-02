// ============================================================
// Kundli PDF — Language dictionary + on-demand font loader
// ------------------------------------------------------------
// Provides translated labels for every string rendered in the
// premium Kundli PDF, plus a helper to fetch & register a
// Noto Sans script font at runtime so non-Latin scripts render
// correctly inside jsPDF (which ships only Helvetica by default).
// ============================================================

import type { jsPDF } from "jspdf";

export type PdfLang =
  "en" | "hi" | "mr" | "gu" | "ta" | "te" | "kn" | "bn" | "ml" | "pa" | "or" | "as";

export interface PdfLabels {
  // cover
  brandTagline: string;
  title: string;
  subtitle: string;
  nativeDetails: string;
  dob: string;
  tob: string;
  place: string;
  coords: string;
  timezone: string;
  ayanamsa: string;
  lagna: string;
  moonRashi: string;
  sunRashi: string;
  nakshatra: string;
  scanOnline: string;
  disclaimer: string;
  // charts
  rashiCharts: string;
  chartsSubtitle: string;
  northIndian: string;
  southIndian: string;
  eastIndian: string;
  legend: string;
  // planets
  planetaryPositions: string;
  sidereal: string;
  colPlanet: string;
  colSign: string;
  colDeg: string;
  colHouse: string;
  colNakshatra: string;
  colPada: string;
  colDignity: string;
  colR: string;
  ascendantLagna: string;
  // houses
  housesNakshatra: string;
  wholeSign: string;
  colCusp: string;
  colPlanets: string;
  janmaNakshatra: string;
  padaOf: (p: number, lord: string) => string;
  mahadashaLord: (lord: string) => string;
  // summary
  chartSummary: string;
  snapshot: string;
  summary1: (date: string, time: string, place: string) => string;
  summary2: (rashi: string, deg: string, nak: string, pada: number) => string;
  summary3: (moon: string, sun: string) => string;
  summary4: (nak: string, pada: number, lord: string) => string;
  summary5: (aya: string) => string;
  notable: string;
  retrograde: string;
  closing: string;
  // footer
  pageXofY: (p: number, t: number) => string;
}

const EN: PdfLabels = {
  brandTagline: "VEDIC WISDOM · MODERN TOOLS",
  title: "Janam Kundli",
  subtitle: "A Personalised Vedic Birth Chart",
  nativeDetails: "Native Details",
  dob: "Date of Birth",
  tob: "Time of Birth",
  place: "Place",
  coords: "Coordinates",
  timezone: "Timezone",
  ayanamsa: "Ayanamsa (Lahiri)",
  lagna: "Lagna",
  moonRashi: "Moon Rashi",
  sunRashi: "Sun Rashi",
  nakshatra: "Nakshatra",
  scanOnline: "Scan to view online",
  disclaimer:
    "This report is based on classical Vedic astronomy (Lahiri ayanamsa, whole-sign houses) and is intended for reflection and study — not deterministic prediction.",
  rashiCharts: "Rashi Charts",
  chartsSubtitle: "D1 · Lagna Kundli",
  northIndian: "North Indian",
  southIndian: "South Indian",
  eastIndian: "East Indian (Bengali)",
  legend:
    "Su Sun · Mo Moon · Ma Mars · Me Mercury · Ju Jupiter · Ve Venus · Sa Saturn · Ra Rahu · Ke Ketu · R Retrograde",
  planetaryPositions: "Planetary Positions",
  sidereal: "Sidereal · Lahiri Ayanamsa",
  colPlanet: "Planet",
  colSign: "Sign",
  colDeg: "Deg",
  colHouse: "House",
  colNakshatra: "Nakshatra",
  colPada: "Pada",
  colDignity: "Dignity",
  colR: "R",
  ascendantLagna: "Ascendant (Lagna)",
  housesNakshatra: "Houses & Nakshatra",
  wholeSign: "Whole-Sign Bhava · Janma Nakshatra",
  colCusp: "Cusp",
  colPlanets: "Planets",
  janmaNakshatra: "JANMA NAKSHATRA",
  padaOf: (p, lord) => `Pada ${p} · Lord ${lord}`,
  mahadashaLord: (l) => `Mahadasha lord: ${l}`,
  chartSummary: "Chart Summary",
  snapshot: "Snapshot of key placements",
  summary1: (d, t, p) => `The native was born on ${d} at ${t} in ${p}.`,
  summary2: (r, deg, n, p) =>
    `The Ascendant (Lagna) rises in ${r} at ${deg}°, in the nakshatra ${n} pada ${p}.`,
  summary3: (m, s) => `The Moon occupies ${m} and the Sun occupies ${s}.`,
  summary4: (n, p, l) =>
    `The birth nakshatra is ${n} (pada ${p}), whose lord is ${l} — this initiates the Vimshottari Mahadasha sequence.`,
  summary5: (a) =>
    `Planetary positions are computed sidereally using the Lahiri ayanamsa (${a}°). Houses follow the whole-sign convention traditional to North & South Indian jyotisha.`,
  notable: "Notable Placements",
  retrograde: "retrograde",
  closing:
    "Traditional jyotisha frames a chart as a mirror of tendencies — not fate. For a fuller reading please consult a qualified jyotishi.",
  pageXofY: (p, t) => `Page ${p} of ${t}`,
};

const HI: PdfLabels = {
  brandTagline: "वैदिक ज्ञान · आधुनिक साधन",
  title: "जन्म कुंडली",
  subtitle: "आपकी व्यक्तिगत वैदिक जन्म कुंडली",
  nativeDetails: "जातक का विवरण",
  dob: "जन्म तिथि",
  tob: "जन्म समय",
  place: "स्थान",
  coords: "निर्देशांक",
  timezone: "समय क्षेत्र",
  ayanamsa: "अयनांश (लाहिरी)",
  lagna: "लग्न",
  moonRashi: "चंद्र राशि",
  sunRashi: "सूर्य राशि",
  nakshatra: "नक्षत्र",
  scanOnline: "ऑनलाइन देखने के लिए स्कैन करें",
  disclaimer:
    "यह रिपोर्ट शास्त्रीय वैदिक ज्योतिष (लाहिरी अयनांश, पूर्ण राशि भाव) पर आधारित है और यह चिंतन एवं अध्ययन हेतु है — निश्चित भविष्यवाणी हेतु नहीं।",
  rashiCharts: "राशि चक्र",
  chartsSubtitle: "डी१ · लग्न कुंडली",
  northIndian: "उत्तर भारतीय",
  southIndian: "दक्षिण भारतीय",
  eastIndian: "पूर्व भारतीय (बंगाली)",
  legend:
    "सू सूर्य · चं चंद्र · मं मंगल · बु बुध · गु गुरु · शु शुक्र · श शनि · रा राहु · के केतु · R वक्री",
  planetaryPositions: "ग्रह स्थिति",
  sidereal: "निरयन · लाहिरी अयनांश",
  colPlanet: "ग्रह",
  colSign: "राशि",
  colDeg: "अंश",
  colHouse: "भाव",
  colNakshatra: "नक्षत्र",
  colPada: "पद",
  colDignity: "बल",
  colR: "व",
  ascendantLagna: "लग्न",
  housesNakshatra: "भाव एवं नक्षत्र",
  wholeSign: "पूर्ण राशि भाव · जन्म नक्षत्र",
  colCusp: "आरंभ",
  colPlanets: "ग्रह",
  janmaNakshatra: "जन्म नक्षत्र",
  padaOf: (p, l) => `पद ${p} · स्वामी ${l}`,
  mahadashaLord: (l) => `महादशा स्वामी: ${l}`,
  chartSummary: "कुंडली सारांश",
  snapshot: "मुख्य स्थितियों का सार",
  summary1: (d, t, p) => `जातक का जन्म ${d} को ${t} बजे ${p} में हुआ।`,
  summary2: (r, deg, n, p) => `लग्न ${r} राशि में ${deg}° पर उदय हो रहा है, नक्षत्र ${n} पद ${p}।`,
  summary3: (m, s) => `चंद्र ${m} में तथा सूर्य ${s} में स्थित हैं।`,
  summary4: (n, p, l) =>
    `जन्म नक्षत्र ${n} (पद ${p}) है, जिसका स्वामी ${l} है — यही विंशोत्तरी महादशा का आरंभ है।`,
  summary5: (a) =>
    `ग्रह स्थितियाँ लाहिरी अयनांश (${a}°) के साथ निरयन गणना पर आधारित हैं। भाव पूर्ण-राशि पद्धति से लिए गए हैं।`,
  notable: "उल्लेखनीय स्थितियाँ",
  retrograde: "वक्री",
  closing:
    "पारंपरिक ज्योतिष कुंडली को प्रवृत्तियों का दर्पण मानता है — भाग्य नहीं। सम्पूर्ण फलादेश हेतु योग्य ज्योतिषी से परामर्श लें।",
  pageXofY: (p, t) => `पृष्ठ ${p} / ${t}`,
};

// For remaining languages we translate the most-visible labels and reuse
// English structure for long prose (translated per-language for the summary
// so the report still reads natively).
const MR: PdfLabels = {
  brandTagline: "वैदिक ज्ञान · आधुनिक साधने",
  title: "जन्म कुंडली",
  subtitle: "आपली वैयक्तिक वैदिक जन्म कुंडली",
  nativeDetails: "जातकाचा तपशील",
  dob: "जन्म तारीख",
  tob: "जन्म वेळ",
  place: "स्थान",
  coords: "अक्षांश-रेखांश",
  timezone: "काळ क्षेत्र",
  ayanamsa: "अयनांश (लाहिरी)",
  lagna: "लग्न",
  moonRashi: "चंद्र राशी",
  sunRashi: "सूर्य राशी",
  nakshatra: "नक्षत्र",
  scanOnline: "ऑनलाइन पाहण्यासाठी स्कॅन करा",
  disclaimer:
    "हा अहवाल शास्त्रीय वैदिक ज्योतिषावर (लाहिरी अयनांश, पूर्ण-राशी भाव) आधारित आहे आणि चिंतन व अभ्यासासाठी आहे — निश्चित भविष्यवाणीसाठी नाही.",
  rashiCharts: "राशी कुंडली",
  chartsSubtitle: "डी१ · लग्न कुंडली",
  northIndian: "उत्तर भारतीय",
  southIndian: "दक्षिण भारतीय",
  eastIndian: "पूर्व भारतीय (बंगाली)",
  legend:
    "सू सूर्य · चं चंद्र · मं मंगळ · बु बुध · गु गुरु · शु शुक्र · श शनि · रा राहू · के केतू · R वक्री",
  planetaryPositions: "ग्रह स्थान",
  sidereal: "निरयन · लाहिरी अयनांश",
  colPlanet: "ग्रह",
  colSign: "राशी",
  colDeg: "अंश",
  colHouse: "भाव",
  colNakshatra: "नक्षत्र",
  colPada: "पाद",
  colDignity: "बल",
  colR: "व",
  ascendantLagna: "लग्न",
  housesNakshatra: "भाव आणि नक्षत्र",
  wholeSign: "पूर्ण-राशी भाव · जन्म नक्षत्र",
  colCusp: "आरंभ",
  colPlanets: "ग्रह",
  janmaNakshatra: "जन्म नक्षत्र",
  padaOf: (p, l) => `पाद ${p} · स्वामी ${l}`,
  mahadashaLord: (l) => `महादशा स्वामी: ${l}`,
  chartSummary: "कुंडली सारांश",
  snapshot: "मुख्य स्थानांचा सारांश",
  summary1: (d, t, p) => `जातकाचा जन्म ${d} रोजी ${t} वाजता ${p} येथे झाला.`,
  summary2: (r, deg, n, p) => `लग्न ${r} राशीत ${deg}° वर उदय होत आहे, नक्षत्र ${n} पाद ${p}.`,
  summary3: (m, s) => `चंद्र ${m} मध्ये आणि सूर्य ${s} मध्ये स्थित आहेत.`,
  summary4: (n, p, l) =>
    `जन्म नक्षत्र ${n} (पाद ${p}) आहे, ज्याचा स्वामी ${l} आहे — येथूनच विंशोत्तरी महादशा सुरू होते.`,
  summary5: (a) =>
    `ग्रह स्थाने लाहिरी अयनांश (${a}°) सह निरयन पद्धतीने काढली आहेत. भाव पूर्ण-राशी पद्धतीने घेतले आहेत.`,
  notable: "महत्त्वाची स्थाने",
  retrograde: "वक्री",
  closing:
    "पारंपरिक ज्योतिष कुंडलीला प्रवृत्तींचा आरसा मानते — नियती नाही. संपूर्ण फलादेशासाठी योग्य ज्योतिषाचा सल्ला घ्या.",
  pageXofY: (p, t) => `पान ${p} / ${t}`,
};

const GU: PdfLabels = {
  ...EN,
  brandTagline: "વૈદિક જ્ઞાન · આધુનિક સાધનો",
  title: "જન્મ કુંડળી",
  subtitle: "તમારી વ્યક્તિગત વૈદિક જન્મ કુંડળી",
  nativeDetails: "જાતકની વિગત",
  dob: "જન્મ તારીખ",
  tob: "જન્મ સમય",
  place: "સ્થળ",
  coords: "અક્ષાંશ-રેખાંશ",
  timezone: "સમય ક્ષેત્ર",
  ayanamsa: "અયનાંશ (લાહિરી)",
  lagna: "લગ્ન",
  moonRashi: "ચંદ્ર રાશિ",
  sunRashi: "સૂર્ય રાશિ",
  nakshatra: "નક્ષત્ર",
  scanOnline: "ઓનલાઈન જોવા સ્કેન કરો",
  rashiCharts: "રાશિ કુંડળી",
  chartsSubtitle: "ડી૧ · લગ્ન કુંડળી",
  northIndian: "ઉત્તર ભારતીય",
  southIndian: "દક્ષિણ ભારતીય",
  eastIndian: "પૂર્વ ભારતીય (બંગાળી)",
  planetaryPositions: "ગ્રહ સ્થિતિ",
  sidereal: "નિરયન · લાહિરી અયનાંશ",
  colPlanet: "ગ્રહ",
  colSign: "રાશિ",
  colDeg: "અંશ",
  colHouse: "ભાવ",
  colNakshatra: "નક્ષત્ર",
  colPada: "પદ",
  colDignity: "બળ",
  colR: "વ",
  ascendantLagna: "લગ્ન",
  housesNakshatra: "ભાવ અને નક્ષત્ર",
  wholeSign: "પૂર્ણ-રાશિ ભાવ · જન્મ નક્ષત્ર",
  colCusp: "આરંભ",
  colPlanets: "ગ્રહો",
  janmaNakshatra: "જન્મ નક્ષત્ર",
  padaOf: (p, l) => `પદ ${p} · સ્વામી ${l}`,
  mahadashaLord: (l) => `મહાદશા સ્વામી: ${l}`,
  chartSummary: "કુંડળી સાર",
  snapshot: "મુખ્ય સ્થાનોનો સાર",
  summary1: (d, t, p) => `જાતકનો જન્મ ${d} ના ${t} વાગ્યે ${p} માં થયો.`,
  summary2: (r, deg, n, p) => `લગ્ન ${r} માં ${deg}° પર ઉદય પામે છે, નક્ષત્ર ${n} પદ ${p}.`,
  summary3: (m, s) => `ચંદ્ર ${m} માં અને સૂર્ય ${s} માં સ્થિત છે.`,
  summary4: (n, p, l) => `જન્મ નક્ષત્ર ${n} (પદ ${p}) છે, જેના સ્વામી ${l} છે.`,
  summary5: (a) => `ગ્રહ સ્થિતિ લાહિરી અયનાંશ (${a}°) સાથે નિરયન ગણતરી પર આધારિત છે.`,
  notable: "નોંધપાત્ર સ્થાનો",
  retrograde: "વક્રી",
  closing: "પરંપરાગત જ્યોતિષ કુંડળીને પ્રવૃત્તિઓનું દર્પણ માને છે — ભાગ્ય નહીં.",
  pageXofY: (p, t) => `પૃષ્ઠ ${p} / ${t}`,
};

const BN: PdfLabels = {
  ...EN,
  brandTagline: "বৈদিক জ্ঞান · আধুনিক সরঞ্জাম",
  title: "জন্ম কুণ্ডলী",
  subtitle: "আপনার ব্যক্তিগত বৈদিক জন্ম কুণ্ডলী",
  nativeDetails: "জাতকের বিবরণ",
  dob: "জন্ম তারিখ",
  tob: "জন্ম সময়",
  place: "স্থান",
  coords: "স্থানাঙ্ক",
  timezone: "সময় অঞ্চল",
  ayanamsa: "অয়নাংশ (লাহিড়ী)",
  lagna: "লগ্ন",
  moonRashi: "চন্দ্র রাশি",
  sunRashi: "সূর্য রাশি",
  nakshatra: "নক্ষত্র",
  scanOnline: "অনলাইনে দেখতে স্ক্যান করুন",
  rashiCharts: "রাশি চক্র",
  chartsSubtitle: "ডি১ · লগ্ন কুণ্ডলী",
  northIndian: "উত্তর ভারতীয়",
  southIndian: "দক্ষিণ ভারতীয়",
  eastIndian: "পূর্ব ভারতীয় (বাংলা)",
  planetaryPositions: "গ্রহ অবস্থান",
  sidereal: "নিরয়ন · লাহিড়ী অয়নাংশ",
  colPlanet: "গ্রহ",
  colSign: "রাশি",
  colDeg: "অংশ",
  colHouse: "ভাব",
  colNakshatra: "নক্ষত্র",
  colPada: "পদ",
  colDignity: "বল",
  colR: "ব",
  ascendantLagna: "লগ্ন",
  housesNakshatra: "ভাব ও নক্ষত্র",
  wholeSign: "পূর্ণ-রাশি ভাব · জন্ম নক্ষত্র",
  colCusp: "আরম্ভ",
  colPlanets: "গ্রহ",
  janmaNakshatra: "জন্ম নক্ষত্র",
  padaOf: (p, l) => `পদ ${p} · অধিপতি ${l}`,
  mahadashaLord: (l) => `মহাদশা অধিপতি: ${l}`,
  chartSummary: "কুণ্ডলী সারাংশ",
  snapshot: "প্রধান অবস্থানের সারাংশ",
  summary1: (d, t, p) => `জাতকের জন্ম ${d} তারিখ ${t} সময়ে ${p}-এ হয়েছিল।`,
  summary2: (r, deg, n, p) => `লগ্ন ${r} রাশিতে ${deg}° উদিত, নক্ষত্র ${n} পদ ${p}।`,
  summary3: (m, s) => `চন্দ্র ${m}-এ এবং সূর্য ${s}-এ অবস্থিত।`,
  summary4: (n, p, l) => `জন্ম নক্ষত্র ${n} (পদ ${p}), যার অধিপতি ${l}।`,
  summary5: (a) => `গ্রহ অবস্থান লাহিড়ী অয়নাংশ (${a}°) সহ নিরয়ন গণনায় নির্ণীত।`,
  notable: "উল্লেখযোগ্য অবস্থান",
  retrograde: "বক্রী",
  closing: "পরম্পরাগত জ্যোতিষ কুণ্ডলীকে প্রবণতার আয়না মনে করে — নিয়তি নয়।",
  pageXofY: (p, t) => `পৃষ্ঠা ${p} / ${t}`,
};

const AS: PdfLabels = {
  ...BN,
  brandTagline: "বৈদিক জ্ঞান · আধুনিক সঁজুলি",
  title: "জন্ম কুণ্ডলী",
  subtitle: "আপোনাৰ ব্যক্তিগত বৈদিক জন্ম কুণ্ডলী",
  nativeDetails: "জাতকৰ বিৱৰণ",
  place: "স্থান",
  scanOnline: "অনলাইনত চাবলৈ স্কেন কৰক",
  chartSummary: "কুণ্ডলী সাৰাংশ",
  pageXofY: (p, t) => `পৃষ্ঠা ${p} / ${t}`,
};

const TA: PdfLabels = {
  ...EN,
  brandTagline: "வேத ஞானம் · நவீன கருவிகள்",
  title: "ஜென்ம குண்டலி",
  subtitle: "உங்கள் தனிப்பட்ட வேத ஜென்ம குண்டலி",
  nativeDetails: "ஜாதகர் விவரம்",
  dob: "பிறந்த தேதி",
  tob: "பிறந்த நேரம்",
  place: "இடம்",
  coords: "அட்சரேகை",
  timezone: "நேர மண்டலம்",
  ayanamsa: "அயனாம்சம் (லாஹிரி)",
  lagna: "லக்னம்",
  moonRashi: "சந்திர ராசி",
  sunRashi: "சூரிய ராசி",
  nakshatra: "நட்சத்திரம்",
  scanOnline: "ஆன்லைனில் காண ஸ்கேன் செய்யவும்",
  rashiCharts: "ராசி சக்கரம்",
  chartsSubtitle: "D1 · லக்ன குண்டலி",
  northIndian: "வட இந்திய",
  southIndian: "தென் இந்திய",
  eastIndian: "கிழக்கு இந்திய",
  planetaryPositions: "கிரக நிலைகள்",
  sidereal: "நிரயன · லாஹிரி அயனாம்சம்",
  colPlanet: "கிரகம்",
  colSign: "ராசி",
  colDeg: "பாகை",
  colHouse: "வீடு",
  colNakshatra: "நட்சத்திரம்",
  colPada: "பாதம்",
  colDignity: "பலம்",
  colR: "வ",
  ascendantLagna: "லக்னம்",
  housesNakshatra: "வீடுகள் & நட்சத்திரம்",
  wholeSign: "முழு-ராசி பாவம் · ஜென்ம நட்சத்திரம்",
  colCusp: "தொடக்கம்",
  colPlanets: "கிரகங்கள்",
  janmaNakshatra: "ஜென்ம நட்சத்திரம்",
  padaOf: (p, l) => `பாதம் ${p} · அதிபதி ${l}`,
  mahadashaLord: (l) => `மகாதசை அதிபதி: ${l}`,
  chartSummary: "குண்டலி சுருக்கம்",
  snapshot: "முக்கிய நிலைகளின் சுருக்கம்",
  summary1: (d, t, p) => `ஜாதகர் ${d} அன்று ${t} மணிக்கு ${p}-ல் பிறந்தார்.`,
  summary2: (r, deg, n, p) => `லக்னம் ${r}-ல் ${deg}° உதயமாகிறது, நட்சத்திரம் ${n} பாதம் ${p}.`,
  summary3: (m, s) => `சந்திரன் ${m}-ல், சூரியன் ${s}-ல் அமைந்துள்ளார்.`,
  summary4: (n, p, l) => `ஜென்ம நட்சத்திரம் ${n} (பாதம் ${p}), அதிபதி ${l}.`,
  summary5: (a) => `கிரக நிலைகள் லாஹிரி அயனாம்சத்துடன் (${a}°) நிரயன கணக்கீட்டில் உள்ளன.`,
  notable: "குறிப்பிடத்தக்க நிலைகள்",
  retrograde: "வக்கிரம்",
  closing: "பாரம்பரிய ஜோதிடம் குண்டலியை போக்குகளின் கண்ணாடியாகக் காணுகிறது — விதி அல்ல.",
  pageXofY: (p, t) => `பக்கம் ${p} / ${t}`,
};

const TE: PdfLabels = {
  ...EN,
  brandTagline: "వైదిక జ్ఞానం · ఆధునిక సాధనలు",
  title: "జన్మ కుండలి",
  subtitle: "మీ వ్యక్తిగత వైదిక జన్మ కుండలి",
  nativeDetails: "జాతకుని వివరాలు",
  dob: "పుట్టిన తేదీ",
  tob: "పుట్టిన సమయం",
  place: "ప్రదేశం",
  coords: "అక్షాంశాలు",
  timezone: "సమయ మండలం",
  ayanamsa: "అయనాంశం (లాహిరి)",
  lagna: "లగ్నం",
  moonRashi: "చంద్ర రాశి",
  sunRashi: "సూర్య రాశి",
  nakshatra: "నక్షత్రం",
  scanOnline: "ఆన్‌లైన్‌లో చూడటానికి స్కాన్ చేయండి",
  rashiCharts: "రాశి చక్రం",
  chartsSubtitle: "D1 · లగ్న కుండలి",
  northIndian: "ఉత్తర భారత",
  southIndian: "దక్షిణ భారత",
  eastIndian: "తూర్పు భారత",
  planetaryPositions: "గ్రహ స్థానాలు",
  sidereal: "నిరయన · లాహిరి అయనాంశం",
  colPlanet: "గ్రహం",
  colSign: "రాశి",
  colDeg: "అంశ",
  colHouse: "భావం",
  colNakshatra: "నక్షత్రం",
  colPada: "పాదం",
  colDignity: "బలం",
  colR: "వ",
  ascendantLagna: "లగ్నం",
  housesNakshatra: "భావాలు & నక్షత్రం",
  wholeSign: "పూర్ణ-రాశి భావం · జన్మ నక్షత్రం",
  colCusp: "ఆరంభం",
  colPlanets: "గ్రహాలు",
  janmaNakshatra: "జన్మ నక్షత్రం",
  padaOf: (p, l) => `పాదం ${p} · అధిపతి ${l}`,
  mahadashaLord: (l) => `మహాదశ అధిపతి: ${l}`,
  chartSummary: "కుండలి సారాంశం",
  snapshot: "ప్రధాన స్థానాల సారాంశం",
  summary1: (d, t, p) => `జాతకుడు ${d} న ${t} కి ${p}లో జన్మించారు.`,
  summary2: (r, deg, n, p) => `లగ్నం ${r}లో ${deg}° వద్ద ఉదయిస్తుంది, నక్షత్రం ${n} పాదం ${p}.`,
  summary3: (m, s) => `చంద్రుడు ${m}లో, సూర్యుడు ${s}లో ఉన్నారు.`,
  summary4: (n, p, l) => `జన్మ నక్షత్రం ${n} (పాదం ${p}), అధిపతి ${l}.`,
  summary5: (a) => `గ్రహ స్థానాలు లాహిరి అయనాంశం (${a}°)తో నిరయనంగా లెక్కించబడ్డాయి.`,
  notable: "గమనించదగిన స్థానాలు",
  retrograde: "వక్రి",
  closing: "సాంప్రదాయ జ్యోతిషం కుండలిని ధోరణుల అద్దంగా చూస్తుంది — విధి కాదు.",
  pageXofY: (p, t) => `పేజీ ${p} / ${t}`,
};

const KN: PdfLabels = {
  ...EN,
  brandTagline: "ವೈದಿಕ ಜ್ಞಾನ · ಆಧುನಿಕ ಸಾಧನಗಳು",
  title: "ಜನ್ಮ ಕುಂಡಲಿ",
  subtitle: "ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ವೈದಿಕ ಜನ್ಮ ಕುಂಡಲಿ",
  nativeDetails: "ಜಾತಕನ ವಿವರ",
  dob: "ಜನ್ಮ ದಿನಾಂಕ",
  tob: "ಜನ್ಮ ಸಮಯ",
  place: "ಸ್ಥಳ",
  coords: "ಅಕ್ಷಾಂಶ",
  timezone: "ಸಮಯ ವಲಯ",
  ayanamsa: "ಅಯನಾಂಶ (ಲಾಹಿರಿ)",
  lagna: "ಲಗ್ನ",
  moonRashi: "ಚಂದ್ರ ರಾಶಿ",
  sunRashi: "ಸೂರ್ಯ ರಾಶಿ",
  nakshatra: "ನಕ್ಷತ್ರ",
  scanOnline: "ಆನ್‌ಲೈನ್ ನೋಡಲು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",
  rashiCharts: "ರಾಶಿ ಚಕ್ರ",
  chartsSubtitle: "D1 · ಲಗ್ನ ಕುಂಡಲಿ",
  northIndian: "ಉತ್ತರ ಭಾರತೀಯ",
  southIndian: "ದಕ್ಷಿಣ ಭಾರತೀಯ",
  eastIndian: "ಪೂರ್ವ ಭಾರತೀಯ",
  planetaryPositions: "ಗ್ರಹ ಸ್ಥಾನ",
  sidereal: "ನಿರಯನ · ಲಾಹಿರಿ ಅಯನಾಂಶ",
  colPlanet: "ಗ್ರಹ",
  colSign: "ರಾಶಿ",
  colDeg: "ಅಂಶ",
  colHouse: "ಭಾವ",
  colNakshatra: "ನಕ್ಷತ್ರ",
  colPada: "ಪಾದ",
  colDignity: "ಬಲ",
  colR: "ವ",
  ascendantLagna: "ಲಗ್ನ",
  housesNakshatra: "ಭಾವಗಳು & ನಕ್ಷತ್ರ",
  wholeSign: "ಪೂರ್ಣ-ರಾಶಿ ಭಾವ · ಜನ್ಮ ನಕ್ಷತ್ರ",
  colCusp: "ಆರಂಭ",
  colPlanets: "ಗ್ರಹಗಳು",
  janmaNakshatra: "ಜನ್ಮ ನಕ್ಷತ್ರ",
  padaOf: (p, l) => `ಪಾದ ${p} · ಅಧಿಪತಿ ${l}`,
  mahadashaLord: (l) => `ಮಹಾದಶಾ ಅಧಿಪತಿ: ${l}`,
  chartSummary: "ಕುಂಡಲಿ ಸಾರಾಂಶ",
  snapshot: "ಮುಖ್ಯ ಸ್ಥಾನಗಳ ಸಾರಾಂಶ",
  summary1: (d, t, p) => `ಜಾತಕರು ${d} ರಂದು ${t} ಸಮಯಕ್ಕೆ ${p}ನಲ್ಲಿ ಜನಿಸಿದರು.`,
  summary2: (r, deg, n, p) => `ಲಗ್ನ ${r}ನಲ್ಲಿ ${deg}° ಉದಯಿಸುತ್ತದೆ, ನಕ್ಷತ್ರ ${n} ಪಾದ ${p}.`,
  summary3: (m, s) => `ಚಂದ್ರ ${m}ನಲ್ಲಿ, ಸೂರ್ಯ ${s}ನಲ್ಲಿ ಇದ್ದಾರೆ.`,
  summary4: (n, p, l) => `ಜನ್ಮ ನಕ್ಷತ್ರ ${n} (ಪಾದ ${p}), ಅಧಿಪತಿ ${l}.`,
  summary5: (a) => `ಗ್ರಹ ಸ್ಥಾನಗಳು ಲಾಹಿರಿ ಅಯನಾಂಶ (${a}°)ದೊಂದಿಗೆ ನಿರಯನ ಗಣನೆಯಲ್ಲಿವೆ.`,
  notable: "ಗಮನಾರ್ಹ ಸ್ಥಾನಗಳು",
  retrograde: "ವಕ್ರ",
  closing: "ಪಾರಂಪರಿಕ ಜ್ಯೋತಿಷ ಕುಂಡಲಿಯನ್ನು ಪ್ರವೃತ್ತಿಗಳ ಕನ್ನಡಿಯಾಗಿ ನೋಡುತ್ತದೆ — ವಿಧಿಯಲ್ಲ.",
  pageXofY: (p, t) => `ಪುಟ ${p} / ${t}`,
};

const ML: PdfLabels = {
  ...EN,
  brandTagline: "വൈദിക ജ്ഞാനം · ആധുനിക ഉപകരണങ്ങൾ",
  title: "ജന്മ കുണ്ഡലി",
  subtitle: "നിങ്ങളുടെ വ്യക്തിഗത വൈദിക ജന്മ കുണ്ഡലി",
  nativeDetails: "ജാതകവിവരം",
  dob: "ജനന തീയതി",
  tob: "ജനന സമയം",
  place: "സ്ഥലം",
  coords: "അക്ഷാംശം",
  timezone: "സമയമേഖല",
  ayanamsa: "അയനാംശം (ലാഹിരി)",
  lagna: "ലഗ്നം",
  moonRashi: "ചന്ദ്ര രാശി",
  sunRashi: "സൂര്യ രാശി",
  nakshatra: "നക്ഷത്രം",
  scanOnline: "ഓൺലൈനിൽ കാണാൻ സ്കാൻ ചെയ്യുക",
  rashiCharts: "രാശി ചക്രം",
  chartsSubtitle: "D1 · ലഗ്ന കുണ്ഡലി",
  northIndian: "ഉത്തരേന്ത്യൻ",
  southIndian: "ദക്ഷിണേന്ത്യൻ",
  eastIndian: "കിഴക്കൻ ഇന്ത്യൻ",
  planetaryPositions: "ഗ്രഹ സ്ഥാനങ്ങൾ",
  sidereal: "നിരയന · ലാഹിരി അയനാംശം",
  colPlanet: "ഗ്രഹം",
  colSign: "രാശി",
  colDeg: "അംശം",
  colHouse: "ഭാവം",
  colNakshatra: "നക്ഷത്രം",
  colPada: "പാദം",
  colDignity: "ബലം",
  colR: "വ",
  ascendantLagna: "ലഗ്നം",
  housesNakshatra: "ഭാവങ്ങൾ & നക്ഷത്രം",
  wholeSign: "പൂർണ-രാശി ഭാവം · ജന്മ നക്ഷത്രം",
  colCusp: "ആരംഭം",
  colPlanets: "ഗ്രഹങ്ങൾ",
  janmaNakshatra: "ജന്മ നക്ഷത്രം",
  padaOf: (p, l) => `പാദം ${p} · അധിപൻ ${l}`,
  mahadashaLord: (l) => `മഹാദശാ അധിപൻ: ${l}`,
  chartSummary: "കുണ്ഡലി സാരാംശം",
  snapshot: "പ്രധാന സ്ഥാനങ്ങളുടെ സാരാംശം",
  summary1: (d, t, p) => `ജാതകൻ ${d}-ന് ${t}-ന് ${p}-ൽ ജനിച്ചു.`,
  summary2: (r, deg, n, p) => `ലഗ്നം ${r}-ൽ ${deg}° ഉദിക്കുന്നു, നക്ഷത്രം ${n} പാദം ${p}.`,
  summary3: (m, s) => `ചന്ദ്രൻ ${m}-ൽ, സൂര്യൻ ${s}-ൽ.`,
  summary4: (n, p, l) => `ജന്മ നക്ഷത്രം ${n} (പാദം ${p}), അധിപൻ ${l}.`,
  summary5: (a) => `ഗ്രഹസ്ഥാനങ്ങൾ ലാഹിരി അയനാംശം (${a}°) ഉപയോഗിച്ച് നിരയനമായി ഗണിച്ചത്.`,
  notable: "ശ്രദ്ധേയ സ്ഥാനങ്ങൾ",
  retrograde: "വക്രം",
  closing: "പാരമ്പര്യ ജ്യോതിഷം കുണ്ഡലിയെ പ്രവണതകളുടെ കണ്ണാടിയായി കാണുന്നു — വിധിയല്ല.",
  pageXofY: (p, t) => `പേജ് ${p} / ${t}`,
};

const PA: PdfLabels = {
  ...EN,
  brandTagline: "ਵੈਦਿਕ ਗਿਆਨ · ਆਧੁਨਿਕ ਸੰਦ",
  title: "ਜਨਮ ਕੁੰਡਲੀ",
  subtitle: "ਤੁਹਾਡੀ ਨਿੱਜੀ ਵੈਦਿਕ ਜਨਮ ਕੁੰਡਲੀ",
  nativeDetails: "ਜਾਤਕ ਵੇਰਵਾ",
  dob: "ਜਨਮ ਮਿਤੀ",
  tob: "ਜਨਮ ਸਮਾਂ",
  place: "ਸਥਾਨ",
  coords: "ਧੁਰੇ",
  timezone: "ਸਮਾਂ ਖੇਤਰ",
  ayanamsa: "ਅਯਨਾਂਸ਼ (ਲਾਹਿਰੀ)",
  lagna: "ਲਗਨ",
  moonRashi: "ਚੰਦਰ ਰਾਸ਼ੀ",
  sunRashi: "ਸੂਰਜ ਰਾਸ਼ੀ",
  nakshatra: "ਨਕਸ਼ਤਰ",
  scanOnline: "ਆਨਲਾਈਨ ਵੇਖਣ ਲਈ ਸਕੈਨ ਕਰੋ",
  rashiCharts: "ਰਾਸ਼ੀ ਚੱਕਰ",
  chartsSubtitle: "D1 · ਲਗਨ ਕੁੰਡਲੀ",
  northIndian: "ਉੱਤਰ ਭਾਰਤੀ",
  southIndian: "ਦੱਖਣ ਭਾਰਤੀ",
  eastIndian: "ਪੂਰਬ ਭਾਰਤੀ",
  planetaryPositions: "ਗ੍ਰਹਿ ਸਥਿਤੀ",
  sidereal: "ਨਿਰਯਨ · ਲਾਹਿਰੀ ਅਯਨਾਂਸ਼",
  colPlanet: "ਗ੍ਰਹਿ",
  colSign: "ਰਾਸ਼ੀ",
  colDeg: "ਅੰਸ਼",
  colHouse: "ਭਾਵ",
  colNakshatra: "ਨਕਸ਼ਤਰ",
  colPada: "ਪਦ",
  colDignity: "ਬਲ",
  colR: "ਵ",
  ascendantLagna: "ਲਗਨ",
  housesNakshatra: "ਭਾਵ ਤੇ ਨਕਸ਼ਤਰ",
  wholeSign: "ਪੂਰਨ-ਰਾਸ਼ੀ ਭਾਵ · ਜਨਮ ਨਕਸ਼ਤਰ",
  colCusp: "ਸ਼ੁਰੂ",
  colPlanets: "ਗ੍ਰਹਿ",
  janmaNakshatra: "ਜਨਮ ਨਕਸ਼ਤਰ",
  padaOf: (p, l) => `ਪਦ ${p} · ਸਵਾਮੀ ${l}`,
  mahadashaLord: (l) => `ਮਹਾਦਸ਼ਾ ਸਵਾਮੀ: ${l}`,
  chartSummary: "ਕੁੰਡਲੀ ਸਾਰ",
  snapshot: "ਮੁੱਖ ਸਥਿਤੀਆਂ ਦਾ ਸਾਰ",
  summary1: (d, t, p) => `ਜਾਤਕ ਦਾ ਜਨਮ ${d} ਨੂੰ ${t} ਵਜੇ ${p} ਵਿੱਚ ਹੋਇਆ।`,
  summary2: (r, deg, n, p) => `ਲਗਨ ${r} ਵਿੱਚ ${deg}° ਉਦੈ ਹੁੰਦਾ ਹੈ, ਨਕਸ਼ਤਰ ${n} ਪਦ ${p}।`,
  summary3: (m, s) => `ਚੰਦਰ ${m} ਵਿੱਚ ਤੇ ਸੂਰਜ ${s} ਵਿੱਚ ਹੈ।`,
  summary4: (n, p, l) => `ਜਨਮ ਨਕਸ਼ਤਰ ${n} (ਪਦ ${p}), ਸਵਾਮੀ ${l}।`,
  summary5: (a) => `ਗ੍ਰਹਿ ਸਥਿਤੀਆਂ ਲਾਹਿਰੀ ਅਯਨਾਂਸ਼ (${a}°) ਨਾਲ ਨਿਰਯਨ ਗਣਨਾ 'ਤੇ ਆਧਾਰਿਤ ਹਨ।`,
  notable: "ਉਲੇਖਯੋਗ ਸਥਿਤੀਆਂ",
  retrograde: "ਵਕਰੀ",
  closing: "ਪਰੰਪਰਾਗਤ ਜੋਤਿਸ਼ ਕੁੰਡਲੀ ਨੂੰ ਪ੍ਰਵਿਰਤੀਆਂ ਦਾ ਸ਼ੀਸ਼ਾ ਮੰਨਦਾ ਹੈ — ਭਾਗ ਨਹੀਂ।",
  pageXofY: (p, t) => `ਪੰਨਾ ${p} / ${t}`,
};

const OR: PdfLabels = {
  ...EN,
  brandTagline: "ବୈଦିକ ଜ୍ଞାନ · ଆଧୁନିକ ଉପକରଣ",
  title: "ଜନ୍ମ କୁଣ୍ଡଳୀ",
  subtitle: "ଆପଣଙ୍କ ବ୍ୟକ୍ତିଗତ ବୈଦିକ ଜନ୍ମ କୁଣ୍ଡଳୀ",
  nativeDetails: "ଜାତକଙ୍କ ବିବରଣୀ",
  dob: "ଜନ୍ମ ତାରିଖ",
  tob: "ଜନ୍ମ ସମୟ",
  place: "ସ୍ଥାନ",
  coords: "ସ୍ଥାନାଙ୍କ",
  timezone: "ସମୟ ମଣ୍ଡଳ",
  ayanamsa: "ଅୟନାଂଶ (ଲାହିଡ଼ି)",
  lagna: "ଲଗ୍ନ",
  moonRashi: "ଚନ୍ଦ୍ର ରାଶି",
  sunRashi: "ସୂର୍ଯ୍ୟ ରାଶି",
  nakshatra: "ନକ୍ଷତ୍ର",
  scanOnline: "ଅନଲାଇନରେ ଦେଖିବା ପାଇଁ ସ୍କାନ କରନ୍ତୁ",
  rashiCharts: "ରାଶି ଚକ୍ର",
  chartsSubtitle: "D1 · ଲଗ୍ନ କୁଣ୍ଡଳୀ",
  northIndian: "ଉତ୍ତର ଭାରତୀୟ",
  southIndian: "ଦକ୍ଷିଣ ଭାରତୀୟ",
  eastIndian: "ପୂର୍ବ ଭାରତୀୟ",
  planetaryPositions: "ଗ୍ରହ ସ୍ଥିତି",
  sidereal: "ନିରୟନ · ଲାହିଡ଼ି ଅୟନାଂଶ",
  colPlanet: "ଗ୍ରହ",
  colSign: "ରାଶି",
  colDeg: "ଅଂଶ",
  colHouse: "ଭାବ",
  colNakshatra: "ନକ୍ଷତ୍ର",
  colPada: "ପଦ",
  colDignity: "ବଳ",
  colR: "ବ",
  ascendantLagna: "ଲଗ୍ନ",
  housesNakshatra: "ଭାବ ଓ ନକ୍ଷତ୍ର",
  wholeSign: "ପୂର୍ଣ୍ଣ-ରାଶି ଭାବ · ଜନ୍ମ ନକ୍ଷତ୍ର",
  colCusp: "ଆରମ୍ଭ",
  colPlanets: "ଗ୍ରହ",
  janmaNakshatra: "ଜନ୍ମ ନକ୍ଷତ୍ର",
  padaOf: (p, l) => `ପଦ ${p} · ଅଧିପତି ${l}`,
  mahadashaLord: (l) => `ମହାଦଶା ଅଧିପତି: ${l}`,
  chartSummary: "କୁଣ୍ଡଳୀ ସାରାଂଶ",
  snapshot: "ମୁଖ୍ୟ ସ୍ଥିତିର ସାରାଂଶ",
  summary1: (d, t, p) => `ଜାତକ ${d}ରେ ${t}ରେ ${p}ରେ ଜନ୍ମ ହୋଇଥିଲେ।`,
  summary2: (r, deg, n, p) => `ଲଗ୍ନ ${r}ରେ ${deg}° ଉଦୟ ହୁଏ, ନକ୍ଷତ୍ର ${n} ପଦ ${p}।`,
  summary3: (m, s) => `ଚନ୍ଦ୍ର ${m}ରେ, ସୂର୍ଯ୍ୟ ${s}ରେ ଅଛନ୍ତି।`,
  summary4: (n, p, l) => `ଜନ୍ମ ନକ୍ଷତ୍ର ${n} (ପଦ ${p}), ଅଧିପତି ${l}।`,
  summary5: (a) => `ଗ୍ରହ ସ୍ଥିତି ଲାହିଡ଼ି ଅୟନାଂଶ (${a}°) ସହ ନିରୟନ ଗଣନାରେ ଅଛି।`,
  notable: "ଉଲ୍ଲେଖନୀୟ ସ୍ଥିତି",
  retrograde: "ବକ୍ରୀ",
  closing: "ପାରମ୍ପରିକ ଜ୍ୟୋତିଷ କୁଣ୍ଡଳୀକୁ ପ୍ରବୃତ୍ତିର ଦର୍ପଣ ଭାବରେ ଦେଖେ — ଭାଗ୍ୟ ନୁହେଁ।",
  pageXofY: (p, t) => `ପୃଷ୍ଠା ${p} / ${t}`,
};

export const PDF_LABELS: Record<PdfLang, PdfLabels> = {
  en: EN,
  hi: HI,
  mr: MR,
  gu: GU,
  bn: BN,
  as: AS,
  ta: TA,
  te: TE,
  kn: KN,
  ml: ML,
  pa: PA,
  or: OR,
};

// ============================================================
// Font loading — jsPDF only ships Helvetica (Latin-1). Non-Latin
// scripts render as blanks unless we register a proper TTF.
// ============================================================

const FONT_URLS: Record<PdfLang, string | null> = {
  en: null,
  hi: "https://cdn.jsdelivr.net/gh/notofonts/notofonts.github.io/fonts/NotoSansDevanagari/full/ttf/NotoSansDevanagari-Regular.ttf",
  mr: "https://cdn.jsdelivr.net/gh/notofonts/notofonts.github.io/fonts/NotoSansDevanagari/full/ttf/NotoSansDevanagari-Regular.ttf",
  gu: "https://cdn.jsdelivr.net/gh/notofonts/notofonts.github.io/fonts/NotoSansGujarati/full/ttf/NotoSansGujarati-Regular.ttf",
  ta: "https://cdn.jsdelivr.net/gh/notofonts/notofonts.github.io/fonts/NotoSansTamil/full/ttf/NotoSansTamil-Regular.ttf",
  te: "https://cdn.jsdelivr.net/gh/notofonts/notofonts.github.io/fonts/NotoSansTelugu/full/ttf/NotoSansTelugu-Regular.ttf",
  kn: "https://cdn.jsdelivr.net/gh/notofonts/notofonts.github.io/fonts/NotoSansKannada/full/ttf/NotoSansKannada-Regular.ttf",
  bn: "https://cdn.jsdelivr.net/gh/notofonts/notofonts.github.io/fonts/NotoSansBengali/full/ttf/NotoSansBengali-Regular.ttf",
  as: "https://cdn.jsdelivr.net/gh/notofonts/notofonts.github.io/fonts/NotoSansBengali/full/ttf/NotoSansBengali-Regular.ttf",
  ml: "https://cdn.jsdelivr.net/gh/notofonts/notofonts.github.io/fonts/NotoSansMalayalam/full/ttf/NotoSansMalayalam-Regular.ttf",
  pa: "https://cdn.jsdelivr.net/gh/notofonts/notofonts.github.io/fonts/NotoSansGurmukhi/full/ttf/NotoSansGurmukhi-Regular.ttf",
  or: "https://cdn.jsdelivr.net/gh/notofonts/notofonts.github.io/fonts/NotoSansOriya/full/ttf/NotoSansOriya-Regular.ttf",
};

const fontCache = new Map<string, string>(); // url -> base64

async function fetchAsBase64(url: string): Promise<string> {
  if (fontCache.has(url)) return fontCache.get(url)!;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Font fetch failed: ${res.status}`);
  const buf = await res.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buf);
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + CHUNK)));
  }
  const b64 = btoa(binary);
  fontCache.set(url, b64);
  return b64;
}

/**
 * Register the correct script font on the jsPDF instance for the chosen
 * language and return the font-family name to pass to `setFont()`.
 * Falls back to "helvetica" if the language is Latin or the font fetch fails.
 */
export async function ensurePdfFont(doc: jsPDF, lang: PdfLang): Promise<string> {
  const url = FONT_URLS[lang];
  if (!url) return "helvetica";
  const family = `Noto-${lang}`;
  const filename = `${family}.ttf`;
  try {
    // If already registered on this doc, reuse.
    const list = (doc as unknown as { getFontList: () => Record<string, string[]> }).getFontList();
    if (list && list[family]) return family;
    const b64 = await fetchAsBase64(url);
    doc.addFileToVFS(filename, b64);
    doc.addFont(filename, family, "normal");
    doc.addFont(filename, family, "bold"); // Noto Sans regular used for both weights
    return family;
  } catch {
    return "helvetica";
  }
}
