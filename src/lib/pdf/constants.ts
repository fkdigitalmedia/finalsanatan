// ============================================================
// Universal PDF Report Engine — Constants & built-in presets
// ============================================================

import type {
  ExportConfig,
  FooterConfig,
  HeaderConfig,
  PaperConfig,
  PdfBranding,
  PdfTheme,
  QrConfig,
  SignatureConfig,
  ThemeName,
  WatermarkConfig,
} from "./types";

export const PDF_ENGINE_VERSION = "1.0.0";

/** mm, portrait */
export const PAPER_SIZES: Record<string, { width: number; height: number }> = {
  a4: { width: 210, height: 297 },
  letter: { width: 215.9, height: 279.4 },
  legal: { width: 215.9, height: 355.6 },
};

export const DEFAULT_MARGINS = { top: 18, right: 15, bottom: 18, left: 15 };

export const DEFAULT_PAPER: PaperConfig = {
  size: "a4",
  orientation: "portrait",
  margins: { ...DEFAULT_MARGINS },
};

export const DEFAULT_BRANDING: PdfBranding = {
  company: "SanatanTools",
  website: "https://sanatantools.com",
  email: "support@sanatantools.com",
  supportNumber: "",
  copyright: `© ${new Date().getFullYear()} SanatanTools. All rights reserved.`,
  socialLinks: [],
};

export const DEFAULT_HEADER: HeaderConfig = {
  enabled: true,
  showOnCover: false,
  left: "{{branding.company}}",
  center: "",
  right: "{{reportTitle}}",
  showLogo: true,
  rule: true,
  height: 12,
};

export const DEFAULT_FOOTER: FooterConfig = {
  enabled: true,
  showOnCover: false,
  left: "{{branding.website}}",
  center: "",
  right: "",
  pageNumbers: true,
  pageNumberFormat: "Page {{page}} / {{pages}}",
  rule: true,
  height: 12,
};

export const DEFAULT_WATERMARK: WatermarkConfig = {
  enabled: false,
  text: "",
  opacity: 0.07,
  angle: 45,
  scale: 0.6,
};

export const DEFAULT_QR: QrConfig = {
  enabled: true,
  value: "{{shareUrl}}",
  size: 24,
  position: "cover-bottom-right",
  caption: "Scan to view online",
};

export const DEFAULT_SIGNATURE: SignatureConfig = { enabled: false };

export const DEFAULT_EXPORT: ExportConfig = {
  quality: "standard",
  imageDpi: 150,
  compress: true,
};

export const EXPORT_PRESETS: Record<ExportConfig["quality"], ExportConfig> = {
  standard: { quality: "standard", imageDpi: 150, compress: true },
  high: { quality: "high", imageDpi: 300, compress: false },
  print: { quality: "print", imageDpi: 300, compress: false },
  compressed: { quality: "compressed", imageDpi: 96, compress: true },
};

// ---------- Themes ----------
function theme(
  name: ThemeName,
  label: string,
  colors: PdfTheme["colors"],
  typography: Partial<PdfTheme["typography"]> = {},
  decoration: Partial<PdfTheme["decoration"]> = {},
): PdfTheme {
  return {
    name,
    label,
    colors,
    typography: {
      headingFont: "helvetica",
      bodyFont: "helvetica",
      baseSize: 10,
      scale: 1,
      lineHeight: 1.45,
      letterSpacing: 0,
      rtl: false,
      ...typography,
    },
    decoration: {
      sectionBackground: true,
      decorativeBorder: false,
      borderWidth: 0.4,
      cornerRadius: 2,
      dividerStyle: "line",
      ...decoration,
    },
  };
}

export const BUILT_IN_THEME_MAP: Record<string, PdfTheme> = {
  classic: theme("classic", "Classic", {
    primary: "#5B1A1A",
    secondary: "#C8571C",
    accent: "#B8862E",
    ink: "#1A1108",
    muted: "#6B5847",
    paper: "#FFFFFF",
    surface: "#FFF8EE",
    divider: "#E8D9BE",
    success: "#2F7A46",
    warning: "#B8862E",
    danger: "#B93A2E",
  }),
  premium: theme(
    "premium",
    "Premium",
    {
      primary: "#7A2E12",
      secondary: "#C8571C",
      accent: "#D4A017",
      ink: "#181008",
      muted: "#6B5847",
      paper: "#FFFDF8",
      surface: "#FBF1DF",
      divider: "#E3CFA6",
      success: "#2F7A46",
      warning: "#B8862E",
      danger: "#B93A2E",
    },
    { baseSize: 10.5, scale: 1.08 },
    { decorativeBorder: true, dividerStyle: "ornament" },
  ),
  luxury: theme(
    "luxury",
    "Luxury",
    {
      primary: "#1C1206",
      secondary: "#8C6B1F",
      accent: "#C9A227",
      ink: "#15100A",
      muted: "#7A6A4E",
      paper: "#FFFDF6",
      surface: "#F6EEDA",
      divider: "#D8C79A",
      success: "#2F7A46",
      warning: "#C9A227",
      danger: "#9E2B20",
    },
    { baseSize: 10.5, scale: 1.15, lineHeight: 1.55, letterSpacing: 0.08 },
    { decorativeBorder: true, borderWidth: 0.8, dividerStyle: "ornament", cornerRadius: 0 },
  ),
  modern: theme(
    "modern",
    "Modern",
    {
      primary: "#123B57",
      secondary: "#1C7C9C",
      accent: "#E7A11A",
      ink: "#10171D",
      muted: "#5E6B75",
      paper: "#FFFFFF",
      surface: "#F2F6F9",
      divider: "#D6E1E8",
      success: "#1E7F4F",
      warning: "#E7A11A",
      danger: "#C0392B",
    },
    { baseSize: 10, scale: 1.1, lineHeight: 1.5 },
    { cornerRadius: 3 },
  ),
  minimal: theme(
    "minimal",
    "Minimal",
    {
      primary: "#222222",
      secondary: "#444444",
      accent: "#888888",
      ink: "#111111",
      muted: "#666666",
      paper: "#FFFFFF",
      surface: "#F7F7F7",
      divider: "#DDDDDD",
      success: "#2F7A46",
      warning: "#9A7B22",
      danger: "#A83226",
    },
    { baseSize: 10, scale: 1, lineHeight: 1.4 },
    { sectionBackground: false, dividerStyle: "line", cornerRadius: 0 },
  ),
  temple: theme(
    "temple",
    "Temple",
    {
      primary: "#8A1C1C",
      secondary: "#D2691E",
      accent: "#E0B33A",
      ink: "#20120A",
      muted: "#7A5B44",
      paper: "#FFF9F0",
      surface: "#FBEBD5",
      divider: "#E7CFA6",
      success: "#2F7A46",
      warning: "#C98A1F",
      danger: "#A62C22",
    },
    { baseSize: 10.5, scale: 1.12, lineHeight: 1.5 },
    { decorativeBorder: true, dividerStyle: "ornament", cornerRadius: 1 },
  ),
};

export const DEFAULT_THEME_NAME: ThemeName = "premium";

// ---------- Cache ----------
export const TEMPLATE_CACHE_TTL_MS = 10 * 60 * 1000;
export const PDF_CACHE_TTL_MS = 15 * 60 * 1000;
export const PDF_CACHE_MAX_ENTRIES = 24;
export const TEMPLATE_CACHE_MAX_ENTRIES = 64;

// ---------- Limits ----------
export const MAX_SECTIONS = 400;
export const MAX_TABLE_ROWS = 4000;
export const MAX_DATA_BYTES = 4 * 1024 * 1024;

export const DISCLAIMER_TEXT: Record<string, string> = {
  en: "This report is generated from traditional Vedic astrology calculations and is offered for guidance and reflection only. It is not medical, legal or financial advice.",
  hi: "यह रिपोर्ट पारंपरिक वैदिक ज्योतिष गणनाओं पर आधारित है और केवल मार्गदर्शन हेतु है। यह चिकित्सा, कानूनी या वित्तीय सलाह नहीं है।",
  mr: "हा अहवाल पारंपरिक वैदिक ज्योतिष गणनेवर आधारित असून केवळ मार्गदर्शनासाठी आहे. ही वैद्यकीय, कायदेशीर किंवा आर्थिक सल्ला नाही.",
  gu: "આ રિપોર્ટ પરંપરાગત વૈદિક જ્યોતિષ ગણતરીઓ પર આધારિત છે અને માત્ર માર્ગદર્શન માટે છે.",
  ta: "இந்த அறிக்கை பாரம்பரிய வேத ஜோதிட கணக்கீடுகளின் அடிப்படையில் வழிகாட்டுதலுக்காக மட்டுமே.",
  te: "ఈ నివేదిక సాంప్రదాయ వేద జ్యోతిష్య గణనల ఆధారంగా మార్గదర్శకత్వం కోసం మాత్రమే.",
  kn: "ಈ ವರದಿ ಸಾಂಪ್ರದಾಯಿಕ ವೇದ ಜ್ಯೋತಿಷ್ಯ ಲೆಕ್ಕಾಚಾರಗಳ ಆಧಾರದ ಮೇಲೆ ಮಾರ್ಗದರ್ಶನಕ್ಕಾಗಿ ಮಾತ್ರ.",
  ml: "ഈ റിപ്പോർട്ട് പരമ്പരാഗത വേദ ജ്യോതിഷ ഗണനകളെ ആധാരമാക്കി മാർഗ്ഗനിർദ്ദേശത്തിനു മാത്രമുള്ളതാണ്.",
  pa: "ਇਹ ਰਿਪੋਰਟ ਪਰੰਪਰਾਗਤ ਵੈਦਿਕ ਜੋਤਿਸ਼ ਗਣਨਾਵਾਂ 'ਤੇ ਆਧਾਰਿਤ ਹੈ ਅਤੇ ਸਿਰਫ਼ ਮਾਰਗਦਰਸ਼ਨ ਲਈ ਹੈ।",
  bn: "এই রিপোর্টটি প্রথাগত বৈদিক জ্যোতিষ গণনার ভিত্তিতে কেবল দিকনির্দেশনার জন্য।",
};
