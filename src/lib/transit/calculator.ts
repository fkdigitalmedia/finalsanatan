// ============================================================
// Transit Engine — Calculator
// ------------------------------------------------------------
// Pure per-planet computation: sidereal longitude, latitude,
// speed, retrograde flag, and ingress detection (previous /
// next sign change). No caching, no orchestration, no I/O.
// ============================================================

import { RASHI_SPAN, TRANSIT_PLANETS } from "./constants";
import { nakshatraIndex, nakshatraName, norm360, padaOf, rashiIndex, rashiName } from "./helpers";
import {
  transitEclipticLatitude,
  transitSiderealLongitude,
  transitTropicalLongitude,
} from "./core";
import type { PlanetTransit, TransitPlanetName } from "./types";

/** Finite-difference speed (deg/day) using ±Δt around `date`. */
export function detectSpeed(planet: TransitPlanetName, date: Date): number {
  const dtHours = 6;
  const half = dtHours / 24;
  const t1 = new Date(date.getTime() - half * 86_400_000);
  const t2 = new Date(date.getTime() + half * 86_400_000);
  const a = transitTropicalLongitude(planet, t1);
  const b = transitTropicalLongitude(planet, t2);
  let d = b - a;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  return d / (2 * half);
}

/** Whether `planet` is moving retrograde at `date`. */
export function detectRetrograde(planet: TransitPlanetName, date: Date): boolean {
  if (planet === "Sun" || planet === "Moon") return false;
  if (planet === "Rahu" || planet === "Ketu") return true;
  return detectSpeed(planet, date) < 0;
}

/**
 * Locate the nearest 30° sign boundary crossing for `planet`
 * within [`from`, `from + windowDays`]. Returns `null` if the
 * planet stays inside its current sign for the whole window.
 */
export function calculateNextIngress(
  planet: TransitPlanetName,
  from: Date,
  windowDays = 365,
): Date | null {
  const startRashi = rashiIndex(transitSiderealLongitude(planet, from));
  const stepHours = planet === "Moon" ? 2 : 24;
  const stepMs = stepHours * 3600 * 1000;
  const endMs = from.getTime() + windowDays * 86_400_000;

  let prevT = from;
  let prevRashi = startRashi;
  for (let t = from.getTime() + stepMs; t <= endMs; t += stepMs) {
    const cur = new Date(t);
    const rashi = rashiIndex(transitSiderealLongitude(planet, cur));
    if (rashi !== prevRashi) return refineIngress(planet, prevT, cur);
    prevT = cur;
    prevRashi = rashi;
  }
  return null;
}

/**
 * Locate the most recent past ingress of `planet` into its
 * current sign, searching back up to `windowDays`.
 */
export function calculatePreviousIngress(
  planet: TransitPlanetName,
  from: Date,
  windowDays = 365,
): Date | null {
  const startRashi = rashiIndex(transitSiderealLongitude(planet, from));
  const stepHours = planet === "Moon" ? 2 : 24;
  const stepMs = stepHours * 3600 * 1000;
  const startMs = from.getTime() - windowDays * 86_400_000;

  let prevT = from;
  let prevRashi = startRashi;
  for (let t = from.getTime() - stepMs; t >= startMs; t -= stepMs) {
    const cur = new Date(t);
    const rashi = rashiIndex(transitSiderealLongitude(planet, cur));
    if (rashi !== prevRashi) return refineIngress(planet, cur, prevT);
    prevT = cur;
    prevRashi = rashi;
  }
  return null;
}

/** Binary-refine an ingress bracket down to ~1 minute precision. */
function refineIngress(planet: TransitPlanetName, lo: Date, hi: Date): Date {
  const targetPrecisionMs = 60_000;
  let a = lo.getTime();
  let b = hi.getTime();
  const rashiA = rashiIndex(transitSiderealLongitude(planet, new Date(a)));
  while (b - a > targetPrecisionMs) {
    const mid = Math.floor((a + b) / 2);
    const rashiMid = rashiIndex(transitSiderealLongitude(planet, new Date(mid)));
    if (rashiMid === rashiA) a = mid;
    else b = mid;
  }
  return new Date(b);
}

/** Full transit record for a single planet at `date`. */
export function calculatePlanetTransit(planet: TransitPlanetName, date: Date): PlanetTransit {
  const info = TRANSIT_PLANETS.find((p) => p.name === planet)!;
  const longitude = norm360(transitSiderealLongitude(planet, date));
  const latitude = transitEclipticLatitude(planet, date);
  const speed = detectSpeed(planet, date);
  const retrograde = detectRetrograde(planet, date);
  const rIdx = rashiIndex(longitude);
  const nIdx = nakshatraIndex(longitude);
  const prevIngress = calculatePreviousIngress(planet, date);
  const nextIngress = calculateNextIngress(planet, date);

  return {
    name: info.name,
    sanskrit: info.sanskrit,
    longitude,
    latitude,
    rashiIndex: rIdx,
    rashi: rashiName(longitude),
    degreesInRashi: longitude - rIdx * RASHI_SPAN,
    nakshatraIndex: nIdx,
    nakshatra: nakshatraName(longitude),
    pada: padaOf(longitude),
    speed,
    retrograde,
    signEntry: prevIngress?.toISOString() ?? null,
    nextSignChange: nextIngress?.toISOString() ?? null,
  };
}
