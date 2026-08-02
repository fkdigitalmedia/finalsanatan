// ============================================================
// Festival helpers — thin wrappers over the Panchang engine.
// Rules MUST call these helpers instead of re-implementing
// astronomical math. This is the only file allowed to reach
// into panchang.ts / astro core for festival resolution.
// ============================================================
import {
  getTithi,
  getNakshatra,
  getSunTimes,
  moonLon,
  startOfLocalDay,
  type LatLon,
} from "@/lib/panchang";
import { AstronomyEngine as A, siderealLongitude } from "@/lib/astro/core";

const MS_DAY = 86_400_000;

export function isoLocalDate(d: Date, tz: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

/** Sunrise for a given local-calendar day. */
export function sunriseOn(date: Date, loc: LatLon): Date | null {
  return getSunTimes(date, loc).sunrise;
}

/**
 * Tithi index (1..30) prevailing at sunrise for the given local day.
 * This implements the "sunrise-vyāpinī" rule used for most festivals.
 */
export function sunriseTithi(
  date: Date,
  loc: LatLon,
): { index: number; paksha: "Shukla" | "Krishna"; sunrise: Date } | null {
  const sr = sunriseOn(date, loc);
  if (!sr) return null;
  const t = getTithi(sr);
  return { index: t.index, paksha: t.paksha, sunrise: sr };
}

/**
 * Iterate day-by-day across a window and yield each local day (midnight local tz)
 * from `startYmd` inclusive for `days` days.
 */
export function* dayWindow(loc: LatLon, startYmd: string, days: number): Generator<Date> {
  const [y, m, d] = startYmd.split("-").map(Number);
  const anchor = startOfLocalDay(new Date(Date.UTC(y, m - 1, d, 12)), loc.tz);
  for (let i = 0; i < days; i++) {
    yield new Date(anchor.getTime() + i * MS_DAY);
  }
}

/**
 * Sunrise-vyāpinī finder.
 *   - `paksha`: Shukla|Krishna (1..15 within paksha)
 *   - `tithiInPaksha`: 1..15 (Purnima=15 in Shukla, Amavasya=15 in Krishna)
 *   - Scans a window and returns the local day whose sunrise falls in that tithi.
 *   - If multiple days qualify (rare double-tithi), the LATER day is used per
 *     the "next-day preference" rule that most festivals follow for tithis
 *     that touch two sunrises. Rules can override via `preferEarlier`.
 */
export function findSunriseVyapiniDay(
  loc: LatLon,
  windowStartYmd: string,
  windowDays: number,
  paksha: "Shukla" | "Krishna",
  tithiInPaksha: number,
  opts: { preferEarlier?: boolean } = {},
): Date | null {
  const targetIndex = paksha === "Shukla" ? tithiInPaksha : 15 + tithiInPaksha;
  const matches: Date[] = [];
  for (const day of dayWindow(loc, windowStartYmd, windowDays)) {
    const info = sunriseTithi(day, loc);
    if (info && info.index === targetIndex) matches.push(day);
  }
  if (matches.length === 0) return null;
  return opts.preferEarlier ? matches[0] : matches[matches.length - 1];
}

/**
 * Pradosh-vyapini finder — day whose sunset tithi matches target.
 * Used for Holika Dahan (Phalguna Purnima at pradosh) and Diwali variants.
 */
export function findPradoshVyapiniDay(
  loc: LatLon,
  windowStartYmd: string,
  windowDays: number,
  paksha: "Shukla" | "Krishna",
  tithiInPaksha: number,
): Date | null {
  const targetIndex = paksha === "Shukla" ? tithiInPaksha : 15 + tithiInPaksha;
  for (const day of dayWindow(loc, windowStartYmd, windowDays)) {
    const ss = getSunTimes(day, loc).sunset;
    if (!ss) continue;
    if (getTithi(ss).index === targetIndex) return day;
  }
  return null;
}

/**
 * Madhyahna-vyapini finder — day whose local midday tithi matches target.
 * Used for Ganesh Chaturthi, Karva Chauth (kshaya-tithi fallback).
 */
export function findMadhyahnaVyapiniDay(
  loc: LatLon,
  windowStartYmd: string,
  windowDays: number,
  paksha: "Shukla" | "Krishna",
  tithiInPaksha: number,
): Date | null {
  const targetIndex = paksha === "Shukla" ? tithiInPaksha : 15 + tithiInPaksha;
  for (const day of dayWindow(loc, windowStartYmd, windowDays)) {
    const st = getSunTimes(day, loc);
    if (!st.sunrise || !st.sunset) continue;
    const noon = new Date((st.sunrise.getTime() + st.sunset.getTime()) / 2);
    if (getTithi(noon).index === targetIndex) return day;
  }
  return null;
}

/**
 * Find the local day where the given nakshatra prevails at midnight local time.
 * Used by Krishna Janmashtami (Rohini nakshatra + Ashtami combination check).
 */
export function midnightNakshatra(date: Date, loc: LatLon): number {
  const midnight = new Date(startOfLocalDay(date, loc.tz).getTime() + 12 * 3600_000);
  return getNakshatra(midnight).index; // 1..27
}

/**
 * Solar-ingress: find the UT date/time when the Sun enters the given sidereal
 * rashi (0=Mesha/Aries … 9=Makara/Capricorn …). Uses binary search over the year.
 * Return value is a Date in UTC; callers convert to local via `isoLocalDate`.
 */
export function sunIngressDate(year: number, rashi: number): Date {
  // Start scanning ~40 days before the nominal date. Sankranti indices roughly:
  // Makara≈Jan 14, Mesha≈Apr 14, Karka≈Jul 16, Tula≈Oct 17.
  const nominalMonth: Record<number, number> = {
    9: 0, // Makara — January
    10: 1, // Kumbha — February
    11: 2, // Meena  — March
    0: 3, // Mesha  — April
    1: 4, // Vrishabha — May
    2: 5, // Mithuna  — June
    3: 6, // Karka   — July
    4: 7, // Simha   — August
    5: 8, // Kanya   — September
    6: 9, // Tula    — October
    7: 10, // Vrishchika — November
    8: 11, // Dhanu   — December
  };
  const startMonth = nominalMonth[rashi] ?? 0;
  const scanStart = new Date(Date.UTC(year, startMonth, 5));
  const scanEnd = new Date(Date.UTC(year, startMonth, 30));

  const targetLon = rashi * 30; // sidereal boundary

  const sunSid = (d: Date) => siderealLongitude(A.Body.Sun, d);
  // Bracket: sun's sidereal lon should cross targetLon between scanStart and scanEnd.
  let lo = scanStart.getTime();
  let hi = scanEnd.getTime();

  // Normalized signed distance from target (unwrap 360 discontinuity).
  const dist = (d: Date) => {
    const s = sunSid(d);
    let diff = s - targetLon;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    return diff;
  };

  // Ensure lo is before crossing (dist < 0) and hi after (dist > 0).
  if (dist(new Date(lo)) > 0) lo = Date.UTC(year, startMonth - 1, 25);
  if (dist(new Date(hi)) < 0) hi = Date.UTC(year, startMonth + 1, 10);

  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (dist(new Date(mid)) < 0) lo = mid;
    else hi = mid;
    if (hi - lo < 1000) break;
  }
  return new Date((lo + hi) / 2);
}

/** Moonrise on a given local day (used for Karva Chauth). */
export function moonriseOn(date: Date, loc: LatLon): Date | null {
  const obs = new A.Observer(loc.lat, loc.lon, 0);
  const start = startOfLocalDay(date, loc.tz);
  const r = A.SearchRiseSet(A.Body.Moon, obs, +1, A.MakeTime(start), 2);
  return r ? r.date : null;
}

// Re-export so rule modules don't reach into panchang.ts directly.
export { getTithi, moonLon };
