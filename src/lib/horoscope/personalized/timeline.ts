// ============================================================
// Personalized Horoscope Engine — Timeline Builder
// ------------------------------------------------------------
// Composes today / week / month / year highlights by delegating
// to the shared Daily / Weekly / Monthly / Yearly engines using
// the caller's natal Moon rashi.
// ============================================================

import { DailyHoroscopeEngine } from "../daily/engine";
import { WeeklyHoroscopeEngine } from "../weekly/engine";
import { MonthlyHoroscopeEngine } from "../monthly/engine";
import { YearlyHoroscopeEngine } from "../yearly/engine";
import type { DailyHoroscopeOutput } from "../daily/types";
import type { WeeklyHoroscopeOutput } from "../weekly/types";
import type { MonthlyHoroscopeOutput } from "../monthly/types";
import type { YearlyHoroscopeOutput } from "../yearly/types";
import type { RashiKey } from "../types";
import type { BirthInput } from "@/lib/kundli/types";
import { mondayOfWeek, parseYmd } from "./helpers";
import type {
  PersonalizedPeriod,
  PersonalizedTimeline,
  PersonalizedTimelineHighlight,
  PlanetInfluenceMap,
} from "./types";

export interface TimelineEngines {
  daily: DailyHoroscopeEngine;
  weekly: WeeklyHoroscopeEngine;
  monthly: MonthlyHoroscopeEngine;
  yearly: YearlyHoroscopeEngine;
}

export interface TimelinePayloads {
  daily?: DailyHoroscopeOutput;
  weekly?: WeeklyHoroscopeOutput;
  monthly?: MonthlyHoroscopeOutput;
  yearly?: YearlyHoroscopeOutput;
}

/** Run the period-specific engines needed for a given caller. */
export function runTimelineEngines(
  engines: TimelineEngines,
  moonRashiKey: RashiKey,
  birth: BirthInput,
  currentDate: string,
  period: PersonalizedPeriod,
): TimelinePayloads {
  const timezone = birth.timezone;
  const language = birth.language ?? "en";
  const latitude = birth.latitude;
  const longitude = birth.longitude;

  const daily = engines.daily.generate({
    date: currentDate,
    rashi: moonRashiKey,
    timezone,
    language,
    latitude,
    longitude,
    location: birth.place,
  });

  const payloads: TimelinePayloads = { daily };

  if (period === "weekly" || period === "monthly" || period === "yearly") {
    const startDate = mondayOfWeek(currentDate);
    payloads.weekly = engines.weekly.generate({
      startDate,
      rashi: moonRashiKey,
      timezone,
      language,
      latitude,
      longitude,
      location: birth.place,
    });
  }

  if (period === "monthly" || period === "yearly") {
    const d = parseYmd(currentDate);
    payloads.monthly = engines.monthly.generate({
      year: d.getUTCFullYear(),
      month: d.getUTCMonth() + 1,
      rashi: moonRashiKey,
      timezone,
      language,
      latitude,
      longitude,
      location: birth.place,
    });
  }

  if (period === "yearly") {
    const d = parseYmd(currentDate);
    payloads.yearly = engines.yearly.generate({
      year: d.getUTCFullYear(),
      rashi: moonRashiKey,
      timezone,
      language,
      latitude,
      longitude,
      location: birth.place,
    });
  }

  return payloads;
}

/** Build the structured timeline object surfaced in the output. */
export function buildTimeline(
  payloads: TimelinePayloads,
  planetInfluence: PlanetInfluenceMap,
): PersonalizedTimeline {
  const daily = payloads.daily;
  const weekly = payloads.weekly;
  const monthly = payloads.monthly;
  const yearly = payloads.yearly;

  const todayHighlights: PersonalizedTimelineHighlight[] = [];
  if (daily) {
    // Top 3 category scores today.
    const topCategories = Object.entries(daily.scores)
      .sort((a, b) => b[1].score - a[1].score)
      .slice(0, 3);
    for (const [cat, entry] of topCategories) {
      todayHighlights.push({
        key: `top-category:${cat}`,
        score: entry.score,
        meta: { category: cat, confidence: entry.confidence },
      });
    }
    if (daily.moonStatus.favorable) {
      todayHighlights.push({
        key: "moon-benefic-house",
        planet: "Moon",
        meta: { house: daily.moonStatus.houseFromNatal },
      });
    }
    for (const p of daily.planetaryInfluence.retrograde) {
      todayHighlights.push({ key: "planet-retrograde", planet: p });
    }
    // Top-influence natal planet
    const topInfluence = Object.values(planetInfluence).sort(
      (a, b) => b.influenceScore - a.influenceScore,
    )[0];
    if (topInfluence) {
      todayHighlights.push({
        key: "top-influence",
        planet: topInfluence.planet,
        score: topInfluence.influenceScore,
      });
    }
  }

  const upcomingPlanetChanges: PersonalizedTimeline["upcomingPlanetChanges"] =
    daily?.planetaryInfluence.imminentSignChanges ?? [];

  const importantPanchangDays: PersonalizedTimeline["importantPanchangDays"] = {
    ekadashi: monthly?.panchangSummary.ekadashiDates ?? [],
    purnima: monthly?.panchangSummary.purnimaDates ?? [],
    amavasya: monthly?.panchangSummary.amavasyaDates ?? [],
  };

  return {
    todayHighlights,
    thisWeek: weekly
      ? {
          startDate: weekly.startDate,
          endDate: weekly.endDate,
          trend: weekly.trends.overall,
          averageScore: weekly.scores.overall.average,
          favorableDays: weekly.favorableDays,
          cautionDays: weekly.cautionDays,
        }
      : null,
    thisMonth: monthly
      ? {
          year: monthly.year,
          month: monthly.month,
          trend: monthly.overview.trend,
          averageScore: monthly.overview.averageScore,
          peakDay: monthly.overview.peakDay?.date ?? null,
          lowDay: monthly.overview.lowDay?.date ?? null,
          bestWeek: monthly.bestWeek,
        }
      : null,
    thisYear: yearly
      ? {
          year: yearly.year,
          trend: yearly.overview.trend,
          averageScore: yearly.overview.averageScore,
          peakMonth: yearly.overview.peakMonth?.month ?? null,
          lowMonth: yearly.overview.lowMonth?.month ?? null,
        }
      : null,
    upcomingPlanetChanges,
    importantPanchangDays,
  };
}
