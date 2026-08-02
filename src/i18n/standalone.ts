/**
 * Provider-less translation helper for the outermost boundaries
 * (root 404, root error) that may render before I18nProvider mounts.
 *
 * Reads the language from the persisted cookie/localStorage and pulls
 * from the (already inlined) English fallback + any cached dict.
 */
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_COOKIE_NAME,
  LANGUAGE_STORAGE_KEY,
  isSupportedLanguage,
} from "./config";
import {
  fallbackTranslations,
  getCachedTranslations,
  resolveKey,
  loadTranslations,
} from "./loader";

function readCookieLang(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${LANGUAGE_COOKIE_NAME}=([^;]+)`));
  return match?.[1];
}

export function detectStandaloneLanguage(): string {
  try {
    const fromStorage =
      typeof window !== "undefined" ? window.localStorage.getItem(LANGUAGE_STORAGE_KEY) : null;
    if (isSupportedLanguage(fromStorage)) return fromStorage;
    const fromCookie = readCookieLang();
    if (isSupportedLanguage(fromCookie)) return fromCookie;
  } catch {
    /* ignore */
  }
  return DEFAULT_LANGUAGE;
}

export function tStandalone(key: string, vars?: Record<string, string | number>): string {
  const lang = detectStandaloneLanguage();
  const dict = getCachedTranslations(lang) ?? fallbackTranslations;
  // Kick off async load so subsequent renders benefit.
  if (!getCachedTranslations(lang)) void loadTranslations(lang);
  return resolveKey(dict, key, vars);
}
