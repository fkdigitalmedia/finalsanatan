// ============================================================
// Shared Astronomical Core
// ------------------------------------------------------------
// Single source of truth for astronomical primitives used by:
//   • Panchang  (Tithi, Nakshatra, Yoga, Karana, Kaal)
//   • Kundli    (natal chart, houses, planetary positions)
//   • Muhurat   (electional timing)
//   • Transits  (Gochar)
//   • Festival  calculations
//
// All modules MUST import astronomical primitives from here.
// Never import `astronomy-engine` directly outside this file — this
// gives us one place to swap the ephemeris or change the ayanamsa.
// ============================================================
import * as A from "astronomy-engine";

// ---------- Math ----------
export const DEG = Math.PI / 180;
export function norm360(x: number): number {
  let v = x % 360;
  if (v < 0) v += 360;
  return v;
}
export function angularDiff(a: number, b: number): number {
  let d = norm360(a - b);
  if (d > 180) d -= 360;
  return d;
}

// ---------- Time ----------
export function makeTime(date: Date): A.AstroTime {
  return A.MakeTime(date);
}

// ---------- Ayanamsa (Lahiri / Chitrapaksha) ----------
// Linear approximation valid ±150 yr around J2000 to within ~0.02°.
// This is the SAME formula used by panchang.ts — keep in sync.
export function ayanamsaLahiri(date: Date): number {
  const jd = A.MakeTime(date).ut + 2451545.0;
  const T = (jd - 2451545.0) / 365.25;
  return 23.8531 + T * 0.01397;
}

// ---------- Body positions (tropical, apparent geocentric) ----------
export function tropicalLongitude(body: A.Body, date: Date): number {
  const t = A.MakeTime(date);
  if (body === A.Body.Moon) return norm360(A.EclipticGeoMoon(t).lon);
  if (body === A.Body.Sun) return norm360(A.SunPosition(t).elon);
  // Other planets — use GeoVector -> Ecliptic
  const vec = A.GeoVector(body, t, true);
  const ecl = A.Ecliptic(vec);
  return norm360(ecl.elon);
}

export function siderealLongitude(body: A.Body, date: Date): number {
  return norm360(tropicalLongitude(body, date) - ayanamsaLahiri(date));
}

export const BODIES = {
  Sun: A.Body.Sun,
  Moon: A.Body.Moon,
  Mercury: A.Body.Mercury,
  Venus: A.Body.Venus,
  Mars: A.Body.Mars,
  Jupiter: A.Body.Jupiter,
  Saturn: A.Body.Saturn,
} as const;
export type BodyName = keyof typeof BODIES;

// Full sidereal snapshot — building block for Kundli / Transits.
export interface PlanetPosition {
  body: BodyName;
  tropical: number;
  sidereal: number;
  rashi: number; // 0..11
  rashiDeg: number; // 0..30
  nakshatra: number; // 0..26
  pada: number; // 1..4
}
export function planetSnapshot(date: Date): PlanetPosition[] {
  return (Object.keys(BODIES) as BodyName[]).map((name) => {
    const trop = tropicalLongitude(BODIES[name], date);
    const sid = norm360(trop - ayanamsaLahiri(date));
    const rashi = Math.floor(sid / 30);
    const rashiDeg = sid - rashi * 30;
    const nakSpan = 360 / 27;
    const nakshatra = Math.floor(sid / nakSpan);
    const within = sid - nakshatra * nakSpan;
    const pada = Math.floor((within / nakSpan) * 4) + 1;
    return { body: name, tropical: trop, sidereal: sid, rashi, rashiDeg, nakshatra, pada };
  });
}

// ---------- Rise / Set ----------
export function riseSet(
  body: A.Body,
  date: Date,
  lat: number,
  lon: number,
  dir: 1 | -1,
): Date | null {
  const obs = new A.Observer(lat, lon, 0);
  const r = A.SearchRiseSet(body, obs, dir, A.MakeTime(date), 2);
  return r ? r.date : null;
}

// Re-export the underlying body enum for advanced callers.
export { A as AstronomyEngine };
