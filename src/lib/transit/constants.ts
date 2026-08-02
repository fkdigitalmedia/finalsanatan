// ============================================================
// Transit Engine — Constants
// ------------------------------------------------------------
// Static reference data for the 9 Vedic planets, the 27
// Nakshatras, and the 12 Rashis (English labels).
// ============================================================

import type { TransitPlanetInfo, TransitPlanetName } from "./types";

/** Canonical list of transit-capable planets. */
export const TRANSIT_PLANETS: readonly TransitPlanetInfo[] = [
  { name: "Sun", sanskrit: "Surya", isNode: false },
  { name: "Moon", sanskrit: "Chandra", isNode: false },
  { name: "Mars", sanskrit: "Mangala", isNode: false },
  { name: "Mercury", sanskrit: "Budha", isNode: false },
  { name: "Jupiter", sanskrit: "Guru", isNode: false },
  { name: "Venus", sanskrit: "Shukra", isNode: false },
  { name: "Saturn", sanskrit: "Shani", isNode: false },
  { name: "Rahu", sanskrit: "Rahu", isNode: true },
  { name: "Ketu", sanskrit: "Ketu", isNode: true },
] as const;

export const TRANSIT_PLANET_NAMES: readonly TransitPlanetName[] = TRANSIT_PLANETS.map(
  (p) => p.name,
);

export const RASHIS_EN = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
] as const;

export const NAKSHATRAS_EN = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishta",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
] as const;

export const NAKSHATRA_SPAN = 360 / 27; // 13°20′
export const RASHI_SPAN = 30;

/** Semver-ish tag surfaced in every snapshot. */
export const TRANSIT_ENGINE_VERSION = "0.1.0-phase12.2";

/** Default reference location (Ujjain — the traditional Meridian). */
export const DEFAULT_TRANSIT_LOCATION = {
  place: "Ujjain, India",
  latitude: 23.1793,
  longitude: 75.7849,
  timezone: "Asia/Kolkata" as string | number,
};
