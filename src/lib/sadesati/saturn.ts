// ============================================================
// Sade Sati & Dhaiya Engine — Saturn scanner
// ------------------------------------------------------------
// Builds Saturn's sign-occupancy timeline by coarse scanning +
// bisection refinement. Astronomy comes exclusively from the
// Transit Engine core (no duplicate ephemeris code).
// ============================================================

import { transitSiderealLongitude } from "@/lib/transit/core";
import { DAY_MS, MIN_STAY_DAYS, REFINE_PRECISION_HOURS, SCAN_STEP_DAYS } from "./constants";
import { addDays, norm12, rashiOf, round } from "./helpers";
import type { SaturnOccupancy } from "./types";

/** Saturn's sidereal longitude (Lahiri) at an instant. */
export function saturnLongitude(date: Date): number {
  return transitSiderealLongitude("Saturn", date);
}

/** Saturn's sidereal rashi index 0..11 at an instant. */
export function saturnSignIndex(date: Date): number {
  return Math.floor(saturnLongitude(date) / 30) % 12;
}

/** Approximate daily motion (deg/day) via central difference. */
export function saturnDailySpeed(date: Date): number {
  const before = saturnLongitude(new Date(date.getTime() - 0.5 * DAY_MS));
  const after = saturnLongitude(new Date(date.getTime() + 0.5 * DAY_MS));
  let d = after - before;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  return round(d, 6);
}

export function saturnRetrograde(date: Date): boolean {
  return saturnDailySpeed(date) < 0;
}

/** Bisect the instant where Saturn's sign changes between a and b. */
function refineBoundary(a: Date, b: Date): Date {
  const signA = saturnSignIndex(a);
  let lo = a.getTime();
  let hi = b.getTime();
  const precision = REFINE_PRECISION_HOURS * 60 * 60 * 1000;
  while (hi - lo > precision) {
    const mid = lo + (hi - lo) / 2;
    if (saturnSignIndex(new Date(mid)) === signA) lo = mid;
    else hi = mid;
  }
  return new Date(hi);
}

/**
 * Contiguous Saturn sign stays across [from, to]. Short retrograde
 * wobbles (< MIN_STAY_DAYS) flanked by the same sign are merged so
 * one classical "stay" stays one interval.
 */
export function buildSaturnOccupancies(from: Date, to: Date): SaturnOccupancy[] {
  const raw: Array<{ sign: number; start: Date; end: Date }> = [];
  let cursor = from;
  let currentSign = saturnSignIndex(cursor);
  let segStart = from;

  while (cursor < to) {
    const next = addDays(cursor, SCAN_STEP_DAYS);
    const probe = next > to ? to : next;
    const sign = saturnSignIndex(probe);
    if (sign !== currentSign) {
      const boundary = refineBoundary(cursor, probe);
      raw.push({ sign: currentSign, start: segStart, end: boundary });
      segStart = boundary;
      currentSign = saturnSignIndex(boundary);
    }
    cursor = probe;
    if (probe.getTime() === to.getTime()) break;
  }
  raw.push({ sign: currentSign, start: segStart, end: to });

  // Merge wobble: [X][short Y][X] → [X]; and adjacent identical signs.
  let merged = raw;
  for (let pass = 0; pass < 4; pass++) {
    const out: typeof merged = [];
    let changed = false;
    for (let i = 0; i < merged.length; i++) {
      const cur = merged[i];
      const prev = out[out.length - 1];
      if (prev && prev.sign === cur.sign) {
        prev.end = cur.end;
        changed = true;
        continue;
      }
      const nxt = merged[i + 1];
      const days = (cur.end.getTime() - cur.start.getTime()) / DAY_MS;
      if (prev && nxt && prev.sign === nxt.sign && days < MIN_STAY_DAYS) {
        prev.end = nxt.end;
        i++; // consume nxt
        changed = true;
        continue;
      }
      out.push({ ...cur });
    }
    merged = out;
    if (!changed) break;
  }

  return merged.map((m) => ({
    rashiIndex: norm12(m.sign),
    rashi: rashiOf(m.sign),
    startISO: m.start.toISOString(),
    endISO: m.end.toISOString(),
    durationDays: round((m.end.getTime() - m.start.getTime()) / DAY_MS, 2),
  }));
}

/** The occupancy containing `at`, if any. */
export function occupancyAt(occupancies: SaturnOccupancy[], at: Date): SaturnOccupancy | null {
  const t = at.getTime();
  return occupancies.find((o) => Date.parse(o.startISO) <= t && t < Date.parse(o.endISO)) ?? null;
}
