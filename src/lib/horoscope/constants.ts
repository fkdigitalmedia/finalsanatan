// ============================================================
// Horoscope Engine — Constants
// ------------------------------------------------------------
// Static reference data for the 12 Rashis and supported
// horoscope periods. Consumed by types / validators / engine.
// ============================================================

import type { RashiInfo, HoroscopeType } from "./types";

/**
 * Canonical list of the 12 Vedic Rashis in zodiacal order.
 * Index 0 = Mesha (Aries) through index 11 = Meena (Pisces).
 * `key` is the stable machine identifier used across the app.
 */
export const RASHIS: readonly RashiInfo[] = [
  {
    key: "mesha",
    sanskrit: "Mesha",
    english: "Aries",
    hindi: "मेष",
    symbol: "♈",
    element: "Fire",
    rulingPlanet: "Mars",
  },
  {
    key: "vrishabha",
    sanskrit: "Vrishabha",
    english: "Taurus",
    hindi: "वृषभ",
    symbol: "♉",
    element: "Earth",
    rulingPlanet: "Venus",
  },
  {
    key: "mithuna",
    sanskrit: "Mithuna",
    english: "Gemini",
    hindi: "मिथुन",
    symbol: "♊",
    element: "Air",
    rulingPlanet: "Mercury",
  },
  {
    key: "karka",
    sanskrit: "Karka",
    english: "Cancer",
    hindi: "कर्क",
    symbol: "♋",
    element: "Water",
    rulingPlanet: "Moon",
  },
  {
    key: "simha",
    sanskrit: "Simha",
    english: "Leo",
    hindi: "सिंह",
    symbol: "♌",
    element: "Fire",
    rulingPlanet: "Sun",
  },
  {
    key: "kanya",
    sanskrit: "Kanya",
    english: "Virgo",
    hindi: "कन्या",
    symbol: "♍",
    element: "Earth",
    rulingPlanet: "Mercury",
  },
  {
    key: "tula",
    sanskrit: "Tula",
    english: "Libra",
    hindi: "तुला",
    symbol: "♎",
    element: "Air",
    rulingPlanet: "Venus",
  },
  {
    key: "vrishchika",
    sanskrit: "Vrishchika",
    english: "Scorpio",
    hindi: "वृश्चिक",
    symbol: "♏",
    element: "Water",
    rulingPlanet: "Mars",
  },
  {
    key: "dhanu",
    sanskrit: "Dhanu",
    english: "Sagittarius",
    hindi: "धनु",
    symbol: "♐",
    element: "Fire",
    rulingPlanet: "Jupiter",
  },
  {
    key: "makara",
    sanskrit: "Makara",
    english: "Capricorn",
    hindi: "मकर",
    symbol: "♑",
    element: "Earth",
    rulingPlanet: "Saturn",
  },
  {
    key: "kumbha",
    sanskrit: "Kumbha",
    english: "Aquarius",
    hindi: "कुम्भ",
    symbol: "♒",
    element: "Air",
    rulingPlanet: "Saturn",
  },
  {
    key: "meena",
    sanskrit: "Meena",
    english: "Pisces",
    hindi: "मीन",
    symbol: "♓",
    element: "Water",
    rulingPlanet: "Jupiter",
  },
] as const;

export const RASHI_KEYS = RASHIS.map((r) => r.key);

/** Supported horoscope period types. Content generation lands in Phase 12.2+. */
export const HOROSCOPE_TYPES: readonly HoroscopeType[] = [
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "personalized",
] as const;

/** Supported UI/content languages (aligned with app i18n). */
export const SUPPORTED_LANGUAGES = [
  "en",
  "hi",
  "mr",
  "gu",
  "ta",
  "te",
  "kn",
  "ml",
  "bn",
  "or",
  "pa",
  "as",
] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/** Lookup a Rashi by key. */
export function getRashi(key: string): RashiInfo | undefined {
  return RASHIS.find((r) => r.key === key.toLowerCase());
}
