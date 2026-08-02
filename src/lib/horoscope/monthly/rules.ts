// ============================================================
// Monthly Horoscope Engine — Rules
// ------------------------------------------------------------
// Canonical (non-prose) derivations for monthly rollups.
// ============================================================

import { INAUSPICIOUS_YOGAS } from "../daily/constants";
import type { DailyHoroscopeOutput } from "../daily/types";
import type { MonthlyPanchangSummary, MonthlyPlanetRetrograde } from "./types";

/** Aggregate tithi + yoga counts across every day of the month. */
export function derivePanchangSummary(days: DailyHoroscopeOutput[]): MonthlyPanchangSummary {
  const ekadashi: string[] = [];
  const purnima: string[] = [];
  const amavasya: string[] = [];
  const sankashti: string[] = [];
  let auspicious = 0;
  let inauspicious = 0;
  for (const day of days) {
    const idx = day.panchang.tithi.index;
    if (idx === 11 || idx === 26) ekadashi.push(day.date);
    if (idx === 15) purnima.push(day.date);
    if (idx === 30) amavasya.push(day.date);
    if (idx === 19) sankashti.push(day.date); // Krishna Chaturthi
    if (INAUSPICIOUS_YOGAS.has(day.panchang.yoga.name)) inauspicious++;
    else auspicious++;
  }
  return {
    ekadashiDates: ekadashi,
    purnimaDates: purnima,
    amavasyaDates: amavasya,
    sankashtiDates: sankashti,
    auspiciousYogasCount: auspicious,
    inauspiciousYogasCount: inauspicious,
  };
}

/** Per-planet retrograde windows detected within the daily series. */
export function deriveRetrogrades(days: DailyHoroscopeOutput[]): MonthlyPlanetRetrograde[] {
  const state = new Map<string, { starts?: string; ends?: string; daysRetrograde: number }>();
  let prev = new Map<string, boolean>();

  for (const day of days) {
    const cur = new Map<string, boolean>();
    for (const p of day.planetaryInfluence.detailed) {
      cur.set(p.name, p.retrograde);
      const info = state.get(p.name) ?? { daysRetrograde: 0 };
      if (p.retrograde) info.daysRetrograde += 1;
      if (p.retrograde && prev.get(p.name) !== true && !info.starts) {
        info.starts = day.transits.referenceInstant;
      }
      if (!p.retrograde && prev.get(p.name) === true && !info.ends) {
        info.ends = day.transits.referenceInstant;
      }
      state.set(p.name, info);
    }
    prev = cur;
  }
  return [...state.entries()]
    .filter(([, v]) => v.daysRetrograde > 0)
    .map(([planet, v]) => ({ planet, ...v }));
}
