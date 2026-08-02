// ============================================================
// Weekly Horoscope Engine — Rules
// ------------------------------------------------------------
// Canonical (non-prose) label derivation from aggregated daily
// data. No natural language, no AI.
// ============================================================

import { INAUSPICIOUS_YOGAS } from "../daily/constants";
import type { DailyHoroscopeOutput, DailyScoreCategory } from "../daily/types";
import type { TrendResult } from "../trend";
import type { WeeklyPlanetHighlight, WeeklyPanchangSummary } from "./types";

/** Categories that should surface as opportunities when trending up. */
const OPPORTUNITY_CATEGORIES: DailyScoreCategory[] = [
  "career",
  "business",
  "finance",
  "love",
  "education",
  "spiritual",
  "productivity",
  "communication",
  "confidence",
  "travel",
];

/** Canonical opportunity labels derived from trending-up categories. */
export function deriveOpportunities(trends: Record<DailyScoreCategory, TrendResult>): string[] {
  const out: string[] = [];
  for (const c of OPPORTUNITY_CATEGORIES) {
    const t = trends[c];
    if (!t) continue;
    if (t.direction === "improving" && t.average >= 55) out.push(`opportunity:${c}`);
  }
  return out;
}

/** Canonical challenge labels derived from trending-down categories. */
export function deriveChallenges(trends: Record<DailyScoreCategory, TrendResult>): string[] {
  const out: string[] = [];
  for (const c of Object.keys(trends) as DailyScoreCategory[]) {
    const t = trends[c];
    if (!t) continue;
    if (
      (t.direction === "declining" && t.average <= 55) ||
      (t.direction === "mixed" && t.min <= 35)
    ) {
      out.push(`challenge:${c}`);
    }
  }
  return out;
}

/** Detect sign-change / retrograde events across a set of daily payloads. */
export function derivePlanetHighlights(days: DailyHoroscopeOutput[]): WeeklyPlanetHighlight[] {
  const highlights: WeeklyPlanetHighlight[] = [];
  const seenIngress = new Set<string>();
  const retroState = new Map<string, boolean>();

  for (const day of days) {
    for (const p of day.planetaryInfluence.detailed) {
      // Retrograde transitions.
      const prev = retroState.get(p.name);
      if (prev !== undefined && prev !== p.retrograde) {
        highlights.push({
          planet: p.name,
          event: p.retrograde ? "retrograde-start" : "retrograde-end",
          when: day.transits.referenceInstant,
        });
      }
      retroState.set(p.name, p.retrograde);
    }
    // Imminent sign changes reported per day — dedupe by (planet, when).
    for (const ic of day.planetaryInfluence.imminentSignChanges) {
      const key = `${ic.planet}|${ic.when}`;
      if (seenIngress.has(key)) continue;
      seenIngress.add(key);
      highlights.push({
        planet: ic.planet,
        event: "sign-change",
        fromSign: ic.from,
        toSign: ic.to,
        when: ic.when,
      });
    }
  }
  return highlights;
}

/** Panchang aggregate: tithi + yoga tallies across the week. */
export function derivePanchangSummary(days: DailyHoroscopeOutput[]): WeeklyPanchangSummary {
  const ekadashi: string[] = [];
  const purnima: string[] = [];
  const amavasya: string[] = [];
  let auspicious = 0;
  let inauspicious = 0;
  for (const day of days) {
    const idx = day.panchang.tithi.index;
    if (idx === 11 || idx === 26) ekadashi.push(day.date);
    if (idx === 15) purnima.push(day.date);
    if (idx === 30) amavasya.push(day.date);
    if (INAUSPICIOUS_YOGAS.has(day.panchang.yoga.name)) inauspicious++;
    else auspicious++;
  }
  return {
    ekadashiDates: ekadashi,
    purnimaDates: purnima,
    amavasyaDates: amavasya,
    auspiciousYogasCount: auspicious,
    inauspiciousYogasCount: inauspicious,
  };
}
