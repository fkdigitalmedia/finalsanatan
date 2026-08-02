// ============================================================
// Kundli / planets
// ------------------------------------------------------------
// Reuses `planetSnapshot()` from the shared astro core for the 7
// classical grahas and adds Rahu/Ketu (mean lunar node).
// Retrogression is derived from short-baseline longitude delta.
// ============================================================
import {
  planetSnapshot,
  siderealLongitude,
  tropicalLongitude,
  BODIES,
  norm360,
  AstronomyEngine as A,
} from "@/lib/astro/core";
import { ayanamsa } from "@/lib/kundli/ayanamsa";
import type { GrahaName } from "@/lib/kundli/types";

/** Mean lunar ascending node (Rahu) — tropical longitude, degrees */
export function meanRahuTropical(d: Date): number {
  const T = A.MakeTime(d).ut / 36525; // ut is JD - 2451545, so T from J2000
  // Standard Meeus mean node
  const omega = 125.04452 - 1934.136261 * T + 0.0020708 * T * T + (T * T * T) / 450_000;
  return norm360(omega);
}

export interface RawPlanet {
  graha: GrahaName;
  tropical: number;
  sidereal: number;
  retrograde: boolean;
}

/** All 9 grahas (Nava-Graha) in sidereal longitude for the given UTC instant. */
export function nineGrahas(d: Date): RawPlanet[] {
  const snap = planetSnapshot(d);
  const out: RawPlanet[] = snap.map((p) => ({
    graha: p.body as GrahaName,
    tropical: p.tropical,
    sidereal: p.sidereal,
    retrograde: isRetrograde(p.body, d),
  }));

  const rahuTrop = meanRahuTropical(d);
  const rahuSid = norm360(rahuTrop - ayanamsa(d));
  out.push({ graha: "Rahu", tropical: rahuTrop, sidereal: rahuSid, retrograde: true });
  out.push({
    graha: "Ketu",
    tropical: norm360(rahuTrop + 180),
    sidereal: norm360(rahuSid + 180),
    retrograde: true,
  });
  return out;
}

/** Retrogression: negative dλ/dt in tropical longitude over ±6 h. */
function isRetrograde(body: keyof typeof BODIES, d: Date): boolean {
  if (body === "Sun" || body === "Moon") return false;
  const before = new Date(d.getTime() - 6 * 3600_000);
  const after = new Date(d.getTime() + 6 * 3600_000);
  const l1 = tropicalLongitude(BODIES[body], before);
  const l2 = tropicalLongitude(BODIES[body], after);
  // account for wrap-around
  let delta = l2 - l1;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  return delta < 0;
}

// Re-export sidereal helper for anyone needing single-body lookup
export { siderealLongitude };
