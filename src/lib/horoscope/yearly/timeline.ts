// ============================================================
// Yearly Horoscope Engine — Planetary Events + Festival Timeline
// ------------------------------------------------------------
// Detects yearly-level planetary transits & retrograde windows
// from the monthly rollups, and resolves the annual festival
// calendar via the shared festivals engine.
// ============================================================

import { resolveFestival } from "@/lib/festivals/engine";
import type { DailyHoroscopeOutput } from "../daily/types";
import type { MonthlyHoroscopeOutput, MonthlyPlanetRetrograde } from "../monthly/types";
import type { WeeklyPlanetHighlight } from "../weekly/types";
import { YEARLY_FESTIVAL_SLUGS } from "./constants";
import { quarterOfMonth } from "./helpers";
import type { YearlyFestival, YearlyPlanetEvent } from "./types";

const MAJOR_PLANETS = new Set(["Jupiter", "Saturn", "Rahu", "Ketu"]);

/** Merge weekly highlights + monthly retrograde windows into a single event log. */
export function buildPlanetaryEvents(
  months: MonthlyHoroscopeOutput[],
  days: DailyHoroscopeOutput[],
): { events: YearlyPlanetEvent[]; retrogrades: MonthlyPlanetRetrograde[] } {
  const events: YearlyPlanetEvent[] = [];
  const seen = new Set<string>();

  // 1) Sign-change & retrograde start/end pulled from monthly.planetHighlights
  for (const m of months) {
    for (const h of m.planetHighlights) {
      const key = `${h.planet}|${h.event}|${h.when ?? ""}|${h.toSign ?? ""}`;
      if (seen.has(key)) continue;
      seen.add(key);
      events.push(mapHighlight(h));
    }
  }

  // 2) Whole-year retrograde windows (union across months per planet)
  const perPlanet = new Map<string, MonthlyPlanetRetrograde>();
  for (const m of months) {
    for (const r of m.planetRetrogrades) {
      const cur = perPlanet.get(r.planet) ?? { planet: r.planet, daysRetrograde: 0 };
      cur.daysRetrograde += r.daysRetrograde;
      if (r.starts && (!cur.starts || r.starts < cur.starts)) cur.starts = r.starts;
      if (r.ends && (!cur.ends || r.ends > cur.ends)) cur.ends = r.ends;
      perPlanet.set(r.planet, cur);
    }
  }
  const retrogrades = [...perPlanet.values()];
  for (const r of retrogrades) {
    if (r.daysRetrograde <= 0) continue;
    events.push({
      planet: r.planet,
      type: "retrograde-window",
      startDate: r.starts?.slice(0, 10),
      endDate: r.ends?.slice(0, 10),
      daysRetrograde: r.daysRetrograde,
    });
  }

  // 3) Major-planet ingresses (Jupiter/Saturn/Rahu/Ketu) elevated to major-transit
  for (const d of days) {
    for (const ic of d.planetaryInfluence.imminentSignChanges) {
      if (!MAJOR_PLANETS.has(ic.planet)) continue;
      const key = `major|${ic.planet}|${ic.when}`;
      if (seen.has(key)) continue;
      seen.add(key);
      events.push({
        planet: ic.planet,
        type: "major-transit",
        fromSign: ic.from,
        toSign: ic.to,
        when: ic.when,
      });
    }
  }

  events.sort((a, b) => (a.when ?? a.startDate ?? "").localeCompare(b.when ?? b.startDate ?? ""));
  return { events, retrogrades };
}

function mapHighlight(h: WeeklyPlanetHighlight): YearlyPlanetEvent {
  return {
    planet: h.planet,
    type:
      h.event === "sign-change"
        ? "sign-change"
        : h.event === "retrograde-start"
          ? "retrograde-start"
          : h.event === "retrograde-end"
            ? "retrograde-end"
            : "major-transit",
    fromSign: h.fromSign,
    toSign: h.toSign,
    when: h.when,
  };
}

/** Resolve the annual festival calendar with optional lat/lon. */
export function buildFestivalCalendar(
  year: number,
  latitude?: number,
  longitude?: number,
): YearlyFestival[] {
  const loc =
    latitude !== undefined && longitude !== undefined
      ? { lat: latitude, lon: longitude, label: "custom", tz: "Asia/Kolkata" }
      : undefined;
  const out: YearlyFestival[] = [];
  for (const slug of YEARLY_FESTIVAL_SLUGS) {
    try {
      const resolved = resolveFestival(slug, year, loc);
      for (const r of resolved) {
        const month = Number(r.isoDate.slice(5, 7));
        out.push({
          slug: r.slug,
          name: r.name,
          isoDate: r.isoDate,
          timestamp: r.date.toISOString(),
          monthIndex: month,
          quarter: quarterOfMonth(month),
          window: r.window
            ? { start: r.window.start.toISOString(), end: r.window.end.toISOString() }
            : undefined,
        });
      }
    } catch {
      // one bad rule must never break the yearly output
    }
  }
  return out.sort((a, b) => a.isoDate.localeCompare(b.isoDate));
}
