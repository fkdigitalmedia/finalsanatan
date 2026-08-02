// ============================================================
// Transit Engine — Astronomy Bridge (core)
// ------------------------------------------------------------
// Thin adapter over `src/lib/astro/core`. This is the ONLY file
// in the transit module that touches astronomy-engine (via the
// shared core), so future ephemeris swaps stay isolated.
// ============================================================

import {
  AstronomyEngine as A,
  BODIES,
  ayanamsaLahiri,
  siderealLongitude,
  tropicalLongitude,
} from "@/lib/astro/core";
import { norm360 } from "./helpers";
import type { TransitPlanetName } from "./types";

const JULIAN_CENTURY_DAYS = 36525;

/**
 * Sidereal longitude (Lahiri) for any transit planet, including
 * the shadow points Rahu / Ketu. Delegates to the shared astro
 * core for real bodies; computes the Moon's mean ascending node
 * analytically for the shadow points.
 */
export function transitSiderealLongitude(planet: TransitPlanetName, date: Date): number {
  if (planet === "Rahu") return norm360(meanLunarNodeSidereal(date));
  if (planet === "Ketu") return norm360(meanLunarNodeSidereal(date) + 180);
  const body = BODIES[planet as keyof typeof BODIES];
  return siderealLongitude(body, date);
}

/** Tropical longitude — used internally for speed / ingress work. */
export function transitTropicalLongitude(planet: TransitPlanetName, date: Date): number {
  if (planet === "Rahu") return norm360(meanLunarNodeTropical(date));
  if (planet === "Ketu") return norm360(meanLunarNodeTropical(date) + 180);
  const body = BODIES[planet as keyof typeof BODIES];
  return tropicalLongitude(body, date);
}

/** Ecliptic latitude in degrees. Returns 0 for shadow points. */
export function transitEclipticLatitude(planet: TransitPlanetName, date: Date): number {
  if (planet === "Rahu" || planet === "Ketu") return 0;
  const t = A.MakeTime(date);
  if (planet === "Moon") return A.EclipticGeoMoon(t).lat;
  if (planet === "Sun") return 0; // ecliptic definition
  const body = BODIES[planet as keyof typeof BODIES];
  const ecl = A.Ecliptic(A.GeoVector(body, t, true));
  return ecl.elat;
}

/** Ayanamsa passthrough so callers never import astro/core directly. */
export function ayanamsaAt(date: Date): number {
  return ayanamsaLahiri(date);
}

// ------------------------------------------------------------
// Mean lunar node (tropical / sidereal) — Meeus, Ch. 47
// ------------------------------------------------------------
// The mean node moves retrograde at ~19.3°/year. Rahu is by
// convention taken to be the ascending node; Ketu = Rahu + 180.
// Accurate to a few arc-minutes, matching mainstream Vedic engines.
function meanLunarNodeTropical(date: Date): number {
  const jd = A.MakeTime(date).ut + 2451545.0;
  const T = (jd - 2451545.0) / JULIAN_CENTURY_DAYS;
  const omega =
    125.0445479 -
    1934.1362891 * T +
    0.0020754 * T * T +
    (T * T * T) / 467441 -
    (T * T * T * T) / 60616000;
  return norm360(omega);
}

function meanLunarNodeSidereal(date: Date): number {
  return norm360(meanLunarNodeTropical(date) - ayanamsaLahiri(date));
}
