// ============================================================
// Monthly Horoscope Engine — Orchestrator
// ------------------------------------------------------------
// Public entry point for Phase 12.4 (monthly half). Delegates
// to WeeklyHoroscopeEngine (which delegates to Daily), rolls
// weekly bands into monthly trends, returns pure JSON.
// ============================================================

import { TransitCache } from "@/lib/transit/cache";
import { DAILY_DATA_SOURCE } from "../daily/constants";
import { WeeklyHoroscopeEngine, WEEKLY_ENGINE_VERSION } from "../weekly/engine";
import { deriveChallenges, deriveOpportunities, derivePlanetHighlights } from "../weekly/rules";
import type { DayScoreSample } from "../weekly/types";
import { aggregateMonthly, runWeeklyWindow } from "./calculator";
import { derivePanchangSummary, deriveRetrogrades } from "./rules";
import { validateMonthlyInput } from "./validators";
import type {
  MonthlyBestWeek,
  MonthlyHoroscopeInput,
  MonthlyHoroscopeOutput,
  MonthlyLuckyFactors,
  MonthlyValidationResult,
} from "./types";

export const MONTHLY_ENGINE_VERSION = `${WEEKLY_ENGINE_VERSION}+monthly.1`;

export class MonthlyHoroscopeEngine {
  private readonly weekly: WeeklyHoroscopeEngine;
  private readonly cache: TransitCache<MonthlyHoroscopeOutput>;
  private initialized = false;

  constructor(
    opts: { weekly?: WeeklyHoroscopeEngine; cache?: TransitCache<MonthlyHoroscopeOutput> } = {},
  ) {
    this.weekly = opts.weekly ?? new WeeklyHoroscopeEngine();
    this.cache =
      opts.cache ??
      new TransitCache<MonthlyHoroscopeOutput>({ ttlMs: 60 * 60 * 1000, maxEntries: 32 });
  }

  initialize(): void {
    this.initialized = true;
    this.cache.clear();
    this.weekly.initialize();
  }

  validateInput(input: MonthlyHoroscopeInput): MonthlyValidationResult {
    return validateMonthlyInput(input);
  }

  generate(input: MonthlyHoroscopeInput): MonthlyHoroscopeOutput {
    if (!this.initialized) this.initialize();
    const validation = this.validateInput(input);
    if (!validation.ok) {
      throw new Error(
        `Invalid monthly horoscope input: ${validation.errors.map((e) => `${e.field}: ${e.message}`).join("; ")}`,
      );
    }
    const key = [
      input.year,
      input.month,
      input.rashi,
      String(input.timezone ?? "Asia/Kolkata"),
      input.language ?? "en",
    ].join("|");
    return this.cache.memoize(key, () => this.compute(input));
  }

  private compute(input: MonthlyHoroscopeInput): MonthlyHoroscopeOutput {
    const started = Date.now();
    const weeks = runWeeklyWindow(this.weekly, input);
    const agg = aggregateMonthly(weeks);

    const dailyScores: DayScoreSample[] = agg.days.map((d) => ({
      date: d.date,
      score: d.scores.overall.score,
      confidence: d.scores.overall.confidence,
    }));
    const sortedByScore = [...dailyScores].sort((a, b) => b.score - a.score);
    const peakDay = sortedByScore[0] ?? null;
    const lowDay = sortedByScore[sortedByScore.length - 1] ?? null;

    // Best / most-sensitive week: use the pre-computed weekly overall averages.
    const weekAverages = weeks.map((w): MonthlyBestWeek => ({
      startDate: w.startDate,
      endDate: w.endDate,
      averageScore: w.scores.overall.average,
    }));
    const sortedWeeks = [...weekAverages].sort((a, b) => b.averageScore - a.averageScore);
    const bestWeek = sortedWeeks[0] ?? null;
    const mostSensitiveWeek = sortedWeeks[sortedWeeks.length - 1] ?? null;

    const opportunities = deriveOpportunities(agg.trends);
    const challenges = deriveChallenges(agg.trends);
    const planetHighlights = derivePlanetHighlights(agg.days);
    const retrogrades = deriveRetrogrades(agg.days);
    const panchang = derivePanchangSummary(agg.days);

    // Monthly lucky factors: top-5 dates + union of daily lucky attributes.
    const first = agg.days[0];
    const lucky: MonthlyLuckyFactors = {
      dates: sortedByScore.slice(0, 5).map((d) => d.date),
      numbers: Array.from(new Set(agg.days.map((d) => d.luckyFactors.number))),
      colors: Array.from(new Set(agg.days.map((d) => d.luckyFactors.color))),
      direction: first?.luckyFactors.direction ?? "East",
      bestWeek,
    };

    const average = agg.trends.overall.average;

    return {
      year: input.year,
      month: input.month,
      rashi: input.rashi,
      overview: {
        trend: agg.overallTrend,
        averageScore: average,
        peakDay,
        lowDay,
      },
      trends: agg.trends,
      scores: agg.scoreBands,
      opportunities,
      challenges,
      bestWeek,
      mostSensitiveWeek,
      planetHighlights,
      planetRetrogrades: retrogrades,
      panchangSummary: panchang,
      luckyFactors: lucky,
      dailyScores,
      weeks,
      days: agg.days,
      metadata: {
        calculationTimestamp: new Date().toISOString(),
        timezone: input.timezone ?? "Asia/Kolkata",
        engineVersion: MONTHLY_ENGINE_VERSION,
        language: input.language ?? "en",
        dataSource: DAILY_DATA_SOURCE,
        calculationDurationMs: Date.now() - started,
        daysComputed: agg.days.length,
        weeksComputed: weeks.length,
      },
    };
  }
}

export function createMonthlyHoroscopeEngine(): MonthlyHoroscopeEngine {
  return new MonthlyHoroscopeEngine();
}

export function generateMonthlyHoroscope(input: MonthlyHoroscopeInput): MonthlyHoroscopeOutput {
  return createMonthlyHoroscopeEngine().generate(input);
}
