/**
 * i18n Configuration — Supported languages for SanatanTools
 *
 * Add a new language by appending a LanguageDef entry and creating a matching
 * translation file at `src/i18n/translations/<code>.json`. Nothing else needs
 * to change — the provider, switcher, loader and routing all read from here.
 */

export interface LanguageDef {
  /** ISO 639-1 code — also used as the URL prefix (`/hi`, `/en`, ...) */
  code: string;
  /** Short 2-letter uppercase badge (EN, HI, MR, TA, TE, etc.) */
  badge: string;
  /** English display name */
  label: string;
  /** Native display name (shown in the switcher) */
  nativeLabel: string;
  /** BCP-47 tag for the <html lang> attribute and Intl APIs */
  htmlLang: string;
  /** Writing direction */
  dir: "ltr" | "rtl";
  /** Whether the translation file is complete enough to expose in the switcher */
  enabled: boolean;
}

export const LANGUAGES: LanguageDef[] = [
  {
    code: "en",
    badge: "EN",
    label: "English",
    nativeLabel: "English",
    htmlLang: "en",
    dir: "ltr",
    enabled: true,
  },
  {
    code: "hi",
    badge: "HI",
    label: "Hindi",
    nativeLabel: "हिन्दी",
    htmlLang: "hi",
    dir: "ltr",
    enabled: true,
  },
  {
    code: "mr",
    badge: "MR",
    label: "Marathi",
    nativeLabel: "मराठी",
    htmlLang: "mr",
    dir: "ltr",
    enabled: true,
  },
  {
    code: "gu",
    badge: "GU",
    label: "Gujarati",
    nativeLabel: "ગુજરાતી",
    htmlLang: "gu",
    dir: "ltr",
    enabled: true,
  },
  {
    code: "ta",
    badge: "TA",
    label: "Tamil",
    nativeLabel: "தமிழ்",
    htmlLang: "ta",
    dir: "ltr",
    enabled: true,
  },
  {
    code: "te",
    badge: "TE",
    label: "Telugu",
    nativeLabel: "తెలుగు",
    htmlLang: "te",
    dir: "ltr",
    enabled: true,
  },
  {
    code: "kn",
    badge: "KN",
    label: "Kannada",
    nativeLabel: "ಕನ್ನಡ",
    htmlLang: "kn",
    dir: "ltr",
    enabled: true,
  },
  {
    code: "bn",
    badge: "BN",
    label: "Bengali",
    nativeLabel: "বাংলা",
    htmlLang: "bn",
    dir: "ltr",
    enabled: true,
  },
  {
    code: "ml",
    badge: "ML",
    label: "Malayalam",
    nativeLabel: "മലയാളം",
    htmlLang: "ml",
    dir: "ltr",
    enabled: true,
  },
  {
    code: "pa",
    badge: "PA",
    label: "Punjabi",
    nativeLabel: "ਪੰਜਾਬੀ",
    htmlLang: "pa",
    dir: "ltr",
    enabled: true,
  },
  {
    code: "or",
    badge: "OR",
    label: "Odia",
    nativeLabel: "ଓଡ଼ିଆ",
    htmlLang: "or",
    dir: "ltr",
    enabled: true,
  },
  {
    code: "ur",
    badge: "UR",
    label: "Urdu",
    nativeLabel: "اردو",
    htmlLang: "ur",
    dir: "rtl",
    enabled: true,
  },
  {
    code: "sa",
    badge: "SA",
    label: "Sanskrit",
    nativeLabel: "संस्कृतम्",
    htmlLang: "sa",
    dir: "ltr",
    enabled: true,
  },
  {
    code: "as",
    badge: "AS",
    label: "Assamese",
    nativeLabel: "অসমীয়া",
    htmlLang: "as",
    dir: "ltr",
    enabled: true,
  },
];

export const DEFAULT_LANGUAGE = "en";
export const LANGUAGE_STORAGE_KEY = "sanatan-lang";
export const LANGUAGE_COOKIE_NAME = "sanatan_lang";

export const LANGUAGE_CODES: string[] = LANGUAGES.map((l) => l.code);

export function isSupportedLanguage(code: string | undefined | null): code is string {
  return !!code && LANGUAGE_CODES.includes(code);
}

export function getLanguage(code: string | undefined | null): LanguageDef {
  return (
    LANGUAGES.find((l) => l.code === code) ?? LANGUAGES.find((l) => l.code === DEFAULT_LANGUAGE)!
  );
}

export function getLanguageBadge(code: string | undefined | null): string {
  if (!code) return "EN";
  const found = LANGUAGES.find((l) => l.code === code.toLowerCase());
  return found ? found.badge : code.toUpperCase().slice(0, 2);
}

export function getLanguageLabel(code: string | undefined | null): string {
  if (!code) return "English";
  const found = LANGUAGES.find((l) => l.code === code.toLowerCase());
  return found ? found.label : code;
}
