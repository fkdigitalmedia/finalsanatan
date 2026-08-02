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
    label: "English",
    nativeLabel: "English",
    htmlLang: "en-IN",
    dir: "ltr",
    enabled: true,
  },
  {
    code: "hi",
    label: "Hindi",
    nativeLabel: "हिन्दी",
    htmlLang: "hi-IN",
    dir: "ltr",
    enabled: true,
  },
  {
    code: "mr",
    label: "Marathi",
    nativeLabel: "मराठी",
    htmlLang: "mr-IN",
    dir: "ltr",
    enabled: true,
  },
  {
    code: "gu",
    label: "Gujarati",
    nativeLabel: "ગુજરાતી",
    htmlLang: "gu-IN",
    dir: "ltr",
    enabled: true,
  },
  {
    code: "ta",
    label: "Tamil",
    nativeLabel: "தமிழ்",
    htmlLang: "ta-IN",
    dir: "ltr",
    enabled: true,
  },
  {
    code: "te",
    label: "Telugu",
    nativeLabel: "తెలుగు",
    htmlLang: "te-IN",
    dir: "ltr",
    enabled: true,
  },
  {
    code: "kn",
    label: "Kannada",
    nativeLabel: "ಕನ್ನಡ",
    htmlLang: "kn-IN",
    dir: "ltr",
    enabled: true,
  },
  {
    code: "bn",
    label: "Bengali",
    nativeLabel: "বাংলা",
    htmlLang: "bn-IN",
    dir: "ltr",
    enabled: true,
  },
  {
    code: "ml",
    label: "Malayalam",
    nativeLabel: "മലയാളം",
    htmlLang: "ml-IN",
    dir: "ltr",
    enabled: true,
  },
  {
    code: "pa",
    label: "Punjabi",
    nativeLabel: "ਪੰਜਾਬੀ",
    htmlLang: "pa-IN",
    dir: "ltr",
    enabled: true,
  },
  { code: "or", label: "Odia", nativeLabel: "ଓଡ଼ିଆ", htmlLang: "or-IN", dir: "ltr", enabled: true },
  {
    code: "as",
    label: "Assamese",
    nativeLabel: "অসমীয়া",
    htmlLang: "as-IN",
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
