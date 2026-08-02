// ============================================================
// Horoscope Engine — Configuration
// ------------------------------------------------------------
// Central defaults for language, timezone, location, and
// forward-looking AI toggles. Phase 12.2+ will read from here
// so callers never have to hard-code these values.
// ============================================================

import type { HoroscopeType, RashiKey } from "./types";

export interface HoroscopeConfig {
  defaultLanguage: string;
  defaultTimezone: string;
  defaultLocation: {
    place: string;
    latitude: number;
    longitude: number;
  };
  defaultType: HoroscopeType;
  defaultRashi?: RashiKey;
  ai: {
    /** Toggle AI-authored narrative content once Phase 12.3 ships. */
    enabled: boolean;
    /** Preferred provider slug ("lovable-ai", "openai", etc.). */
    provider: string;
    model?: string;
  };
}

export const DEFAULT_HOROSCOPE_CONFIG: HoroscopeConfig = {
  defaultLanguage: "en",
  defaultTimezone: "Asia/Kolkata",
  defaultLocation: {
    place: "Ujjain, India",
    latitude: 23.1793,
    longitude: 75.7849,
  },
  defaultType: "daily",
  ai: {
    enabled: false,
    provider: "lovable-ai",
  },
};

/** Shallow-merge a partial override on top of the shipped defaults. */
export function resolveHoroscopeConfig(partial: Partial<HoroscopeConfig> = {}): HoroscopeConfig {
  return {
    ...DEFAULT_HOROSCOPE_CONFIG,
    ...partial,
    defaultLocation: {
      ...DEFAULT_HOROSCOPE_CONFIG.defaultLocation,
      ...(partial.defaultLocation ?? {}),
    },
    ai: { ...DEFAULT_HOROSCOPE_CONFIG.ai, ...(partial.ai ?? {}) },
  };
}
