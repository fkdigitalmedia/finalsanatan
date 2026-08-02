// ============================================================
// Horoscope Engine — Types
// ------------------------------------------------------------
// Structural contracts consumed by core / helpers / validators /
// engine. No runtime code lives here.
// ============================================================

/** Which period a horoscope covers. */
export type HoroscopeType = "daily" | "weekly" | "monthly" | "yearly" | "personalized";

/** Zodiac element classification. */
export type ZodiacElement = "Fire" | "Earth" | "Air" | "Water";

/** Machine key for a Rashi (see constants.RASHIS). */
export type RashiKey =
  | "mesha"
  | "vrishabha"
  | "mithuna"
  | "karka"
  | "simha"
  | "kanya"
  | "tula"
  | "vrishchika"
  | "dhanu"
  | "makara"
  | "kumbha"
  | "meena";

/** Reference metadata for a single Rashi. */
export interface RashiInfo {
  key: RashiKey;
  sanskrit: string;
  english: string;
  hindi: string;
  symbol: string;
  element: ZodiacElement;
  rulingPlanet: string;
}

/**
 * Input contract for HoroscopeEngine.generate().
 * All personalized fields are optional — a `rashi`-only call
 * (Sun/Moon sign horoscope) is a valid usage.
 */
export interface HoroscopeInput {
  type: HoroscopeType;
  /** Target date. Defaults to "now" if omitted. */
  date?: string; // YYYY-MM-DD
  time?: string; // HH:mm (birth time; required for personalized)
  place?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string | number;
  language?: string;
  rashi?: RashiKey; // required for non-personalized types
  gender?: "male" | "female" | "other";
}

/** Snapshot of a single planet at the target instant. */
export interface PlanetSummary {
  graha: string;
  sidereal: number; // 0..360
  rashi: string;
  rashiIndex: number; // 0..11
  degreesInRashi: number; // 0..30
  retrograde: boolean;
}

/** Transit / gochar summary for the horoscope period. */
export interface TransitData {
  referenceDate: string; // ISO instant used for computation
  planets: PlanetSummary[];
  ayanamsaDegrees: number;
}

/** Lucky attributes surfaced with every horoscope. */
export interface LuckyInfo {
  color?: string;
  number?: number;
  direction?: string;
  gemstone?: string;
  mantra?: string;
}

/** Metadata describing how / when the horoscope was produced. */
export interface HoroscopeMetadata {
  type: HoroscopeType;
  rashi?: RashiKey;
  language: string;
  timezone: string | number;
  generatedAt: string; // ISO instant
  engineVersion: string;
  source: "engine" | "ai" | "hybrid";
}

/** Output contract for HoroscopeEngine.generate(). */
export interface HoroscopeOutput {
  metadata: HoroscopeMetadata;
  transit?: TransitData;
  lucky?: LuckyInfo;
  /** Reserved for Phase 12.2+ content generation. */
  content?: {
    summary?: string;
    sections?: Record<string, string>;
  };
  /** Placeholder flag while content generation is not implemented. */
  placeholder: boolean;
}

/** Result of validators.validateHoroscopeInput. */
export interface ValidationResult {
  ok: boolean;
  errors: Array<{ field: string; message: string }>;
}
