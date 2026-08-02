// ============================================================
// Transit Engine — Types
// ------------------------------------------------------------
// Structural contracts consumed by core / calculator / engine.
// No runtime code lives here.
// ============================================================

export type TransitPlanetName =
  "Sun" | "Moon" | "Mars" | "Mercury" | "Jupiter" | "Venus" | "Saturn" | "Rahu" | "Ketu";

/** Reference metadata for a transit-capable planet. */
export interface TransitPlanetInfo {
  name: TransitPlanetName;
  sanskrit: string;
  /** Whether the planet is a mean-node shadow point (Rahu/Ketu). */
  isNode: boolean;
}

/** Snapshot of a single planet at a given instant. */
export interface PlanetTransit {
  name: TransitPlanetName;
  sanskrit: string;
  /** Sidereal longitude (Lahiri), 0..360. */
  longitude: number;
  /** Ecliptic latitude in degrees. 0 for shadow points. */
  latitude: number;
  rashiIndex: number; // 0..11
  rashi: string; // English name
  degreesInRashi: number; // 0..30
  nakshatraIndex: number; // 0..26
  nakshatra: string;
  pada: 1 | 2 | 3 | 4;
  /** Sidereal speed in degrees / day. Negative = retrograde. */
  speed: number;
  retrograde: boolean;
  /** Instant this planet last ingressed into its current sign (ISO). */
  signEntry: string | null;
  /** Instant this planet next ingresses into a new sign (ISO). */
  nextSignChange: string | null;
}

/** Location context for a transit snapshot. */
export interface TransitLocation {
  place?: string;
  latitude: number;
  longitude: number;
  timezone: string | number;
}

/** Input contract for TransitEngine.generateTransitSnapshot(). */
export interface TransitInput {
  /** ISO instant OR YYYY-MM-DD. Defaults to "now". */
  date?: string;
  location?: Partial<TransitLocation>;
  language?: string;
  /** Restrict to a subset of planets. Defaults to all 9. */
  planets?: TransitPlanetName[];
}

/** Compact per-planet metadata surfaced with a snapshot. */
export interface PlanetMetadata {
  name: TransitPlanetName;
  rashi: string;
  nakshatra: string;
  retrograde: boolean;
}

/** Complete transit snapshot returned by the engine. */
export interface TransitSnapshot {
  date: string; // ISO instant used for the compute
  location: TransitLocation;
  timezone: string | number;
  planets: PlanetTransit[];
  summary: PlanetMetadata[];
  ayanamsaDegrees: number;
  computedAt: string;
  engineVersion: string;
}

/** Result of validators.validateTransitInput. */
export interface TransitValidationResult {
  ok: boolean;
  errors: Array<{ field: string; message: string }>;
}
