// ============================================================
// AI Interpretation Engine — Constants
// ============================================================

import type { InterpretationLanguage, ReportDepth, ReportKind } from "./types";

export const ENGINE_VERSION = "14.1.0";

/** Feature keys are namespaced so admins can map providers per report. */
export const FEATURE_PREFIX = "interpretation";

export const REPORT_KINDS: ReportKind[] = [
  "daily-horoscope",
  "weekly-horoscope",
  "monthly-horoscope",
  "yearly-horoscope",
  "kundli-summary",
  "career-report",
  "marriage-compatibility",
  "guna-milan",
  "varshphal",
  "muhurat",
  "numerology",
  "vastu",
  "dosha",
  "yoga",
];

export const REPORT_DEPTHS: ReportDepth[] = ["summary", "detailed", "professional", "beginner"];

export const SUPPORTED_LANGUAGES: InterpretationLanguage[] = [
  "en",
  "hi",
  "mr",
  "gu",
  "ta",
  "te",
  "kn",
  "ml",
  "pa",
  "bn",
];

export const LANGUAGE_NAMES: Record<InterpretationLanguage, string> = {
  en: "English",
  hi: "Hindi (हिन्दी)",
  mr: "Marathi (मराठी)",
  gu: "Gujarati (ગુજરાતી)",
  ta: "Tamil (தமிழ்)",
  te: "Telugu (తెలుగు)",
  kn: "Kannada (ಕನ್ನಡ)",
  ml: "Malayalam (മലയാളം)",
  pa: "Punjabi (ਪੰਜਾਬੀ)",
  bn: "Bengali (বাংলা)",
};

export const DEFAULT_LANGUAGE: InterpretationLanguage = "en";
export const DEFAULT_DEPTH: ReportDepth = "summary";

/** Token budget per depth. */
export const MAX_TOKENS: Record<ReportDepth, number> = {
  summary: 700,
  beginner: 1100,
  detailed: 1800,
  professional: 2400,
};

/** Cache TTL — reports are deterministic for identical engine data. */
export const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
export const CACHE_MAX_ENTRIES = 300;

/** Engine data larger than this is rejected (prompt-size guard). */
export const MAX_DATA_BYTES = 120_000;

/** Below this engine confidence the narration must state uncertainty. */
export const LOW_CONFIDENCE_THRESHOLD = 45;

/** Never-negotiable safety rules appended to every system prompt. */
export const SAFETY_RULES = [
  "Present everything as traditional Vedic astrological guidance, never as fact or prophecy.",
  "Never promise or guarantee an outcome. Use language such as 'traditionally indicates', 'classical texts suggest', 'may support'.",
  "Never give medical, legal, financial or investment advice; suggest consulting a qualified professional instead.",
  "Never predict death, disease, disaster, pregnancy outcomes or legal verdicts.",
  "Never invent planetary positions, dashas, doshas, timings or scores. Use ONLY the numbers present in the supplied JSON.",
  "If the supplied data is missing a detail, say it is not available instead of guessing.",
  "Be respectful, hopeful and remedy-oriented; avoid fear-based language.",
].join("\n- ");

/** Footer appended to every generated report (per language). */
export const DISCLAIMERS: Record<InterpretationLanguage, string> = {
  en: "_This interpretation is based on traditional Vedic astrology and is offered for guidance and reflection only. It is not medical, legal or financial advice._",
  hi: "_यह विश्लेषण पारंपरिक वैदिक ज्योतिष पर आधारित है और केवल मार्गदर्शन हेतु है। यह चिकित्सकीय, कानूनी या वित्तीय सलाह नहीं है।_",
  mr: "_हे विश्लेषण पारंपरिक वैदिक ज्योतिषावर आधारित असून केवळ मार्गदर्शनासाठी आहे. ही वैद्यकीय, कायदेशीर किंवा आर्थिक सल्ला नाही._",
  gu: "_આ અર્થઘટન પરંપરાગત વૈદિક જ્યોતિષ પર આધારિત છે અને માત્ર માર્ગદર્શન માટે છે. તે તબીબી, કાનૂની કે નાણાકીય સલાહ નથી._",
  ta: "_இந்த விளக்கம் பாரம்பரிய வேத ஜோதிடத்தை அடிப்படையாகக் கொண்டது, வழிகாட்டுதலுக்காக மட்டுமே. இது மருத்துவ, சட்ட அல்லது நிதி ஆலோசனை அல்ல._",
  te: "_ఈ వివరణ సాంప్రదాయ వేద జ్యోతిష్యంపై ఆధారపడినది, మార్గదర్శకత్వం కోసం మాత్రమే. ఇది వైద్య, న్యాయ లేదా ఆర్థిక సలహా కాదు._",
  kn: "_ಈ ವಿವರಣೆ ಸಾಂಪ್ರದಾಯಿಕ ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯವನ್ನು ಆಧರಿಸಿದೆ ಮತ್ತು ಮಾರ್ಗದರ್ಶನಕ್ಕಾಗಿ ಮಾತ್ರ. ಇದು ವೈದ್ಯಕೀಯ, ಕಾನೂನು ಅಥವಾ ಆರ್ಥಿಕ ಸಲಹೆಯಲ್ಲ._",
  ml: "_ഈ വ്യാഖ്യാനം പരമ്പരാഗത വേദ ജ്യോതിഷത്തെ അടിസ്ഥാനമാക്കിയുള്ളതും മാർഗനിർദേശത്തിനു മാത്രവുമാണ്. ഇത് വൈദ്യ, നിയമ അല്ലെങ്കിൽ സാമ്പത്തിക ഉപദേശമല്ല._",
  pa: "_ਇਹ ਵਿਆਖਿਆ ਪਰੰਪਰਾਗਤ ਵੈਦਿਕ ਜੋਤਿਸ਼ 'ਤੇ ਆਧਾਰਿਤ ਹੈ ਅਤੇ ਸਿਰਫ਼ ਮਾਰਗਦਰਸ਼ਨ ਲਈ ਹੈ। ਇਹ ਡਾਕਟਰੀ, ਕਾਨੂੰਨੀ ਜਾਂ ਵਿੱਤੀ ਸਲਾਹ ਨਹੀਂ ਹੈ।_",
  bn: "_এই ব্যাখ্যা প্রথাগত বৈদিক জ্যোতিষের উপর ভিত্তি করে এবং কেবল দিকনির্দেশনার জন্য। এটি চিকিৎসা, আইনি বা আর্থিক পরামর্শ নয়।_",
};

/** Low-confidence caveat inserted before the disclaimer. */
export const LOW_CONFIDENCE_NOTE =
  "> **Note:** the underlying calculation reported low confidence for this chart, so treat the following as indicative rather than conclusive.";

/** Style guidance per depth, injected into the prompt. */
export const DEPTH_STYLE: Record<ReportDepth, string> = {
  summary:
    "Write a short, crisp summary. Plain sentences, no jargon, no tables. Roughly 120-200 words total.",
  detailed:
    "Write a complete report with every section filled in. Explain each factor in plain language and connect it to daily life. Use short paragraphs and bullet lists.",
  professional:
    "Write for a practising astrologer. Use correct Sanskrit terminology (graha, bhava, rashi, dasha, yoga) with the English term in brackets on first use, cite the exact values from the JSON, and keep the tone analytical.",
  beginner:
    "Write for someone completely new to astrology. Define every Sanskrit term the first time it appears, use everyday analogies, keep sentences short and warm, and avoid intimidating language.",
};
