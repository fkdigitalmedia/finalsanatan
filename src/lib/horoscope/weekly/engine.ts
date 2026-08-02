// ============================================================
// Weekly Horoscope Engine — Orchestrator
// ------------------------------------------------------------
// Public entry point for Phase 12.4 (weekly half). Delegates to
// the Daily Engine, aggregates via trend module, returns pure
// structured JSON. No AI, no prose, no PDFs, no routes.
// ============================================================

import { TransitCache } from "@/lib/transit/cache";
import { DailyHoroscopeEngine } from "../daily/engine";
import { DAILY_DATA_SOURCE, DAILY_ENGINE_VERSION } from "../daily/constants";
import { aggregateWeekly, runDailyWindow } from "./calculator";
import { addDays, daysBetween } from "./helpers";
import {
  derivePanchangSummary,
  derivePlanetHighlights,
  deriveChallenges,
  deriveOpportunities,
} from "./rules";
import { validateWeeklyInput } from "./validators";
import type {
  WeeklyHoroscopeInput,
  WeeklyHoroscopeOutput,
  WeeklyLuckyFactors,
  WeeklyValidationResult,
} from "./types";

export const WEEKLY_ENGINE_VERSION = `${DAILY_ENGINE_VERSION}+weekly.1`;

export class WeeklyHoroscopeEngine {
  private readonly daily: DailyHoroscopeEngine;
  private readonly cache: TransitCache<WeeklyHoroscopeOutput>;
  private initialized = false;

  constructor(
    opts: { daily?: DailyHoroscopeEngine; cache?: TransitCache<WeeklyHoroscopeOutput> } = {},
  ) {
    this.daily = opts.daily ?? new DailyHoroscopeEngine();
    this.cache =
      opts.cache ??
      new TransitCache<WeeklyHoroscopeOutput>({ ttlMs: 30 * 60 * 1000, maxEntries: 64 });
  }

  initialize(): void {
    this.initialized = true;
    this.cache.clear();
    this.daily.initialize();
  }

  validateInput(input: WeeklyHoroscopeInput): WeeklyValidationResult {
    return validateWeeklyInput(input);
  }

  generate(input: WeeklyHoroscopeInput): WeeklyHoroscopeOutput {
    if (!this.initialized) this.initialize();
    const validation = this.validateInput(input);
    if (!validation.ok) {
      throw new Error(
        `Invalid weekly horoscope input: ${validation.errors.map((e) => `${e.field}: ${e.message}`).join("; ")}`,
      );
    }
    const endDate = input.endDate ?? addDays(input.startDate, 6);
    const key = [
      input.startDate,
      endDate,
      input.rashi,
      String(input.timezone ?? "Asia/Kolkata"),
      input.language ?? "en",
    ].join("|");
    return this.cache.memoize(key, () => this.compute(input, endDate));
  }

  private compute(input: WeeklyHoroscopeInput, endDate: string): WeeklyHoroscopeOutput {
    const started = Date.now();
    const days = runDailyWindow(this.daily, input, endDate);
    const agg = aggregateWeekly(days);
    const opportunities = deriveOpportunities(agg.trends);
    const challenges = deriveChallenges(agg.trends);
    const highlights = derivePlanetHighlights(days);
    const panchang = derivePanchangSummary(days);

    // Weekly lucky factors: reuse per-day lucky data + pick highest-scoring days.
    const rankedDays = [...agg.dailyScores].sort((a, b) => b.score - a.score);
    const topDays = rankedDays.slice(0, 3).map((d) => d.date);
    const first = days[0];
    const lucky: WeeklyLuckyFactors = {
      days: topDays,
      numbers: Array.from(new Set(days.map((d) => d.luckyFactors.number))),
      colors: Array.from(new Set(days.map((d) => d.luckyFactors.color))),
      direction: first?.luckyFactors.direction ?? "East",
      timeRange: first?.luckyFactors.timeWindow ?? { start: null, end: null, label: "Unavailable" },
    };

    return {
      startDate: input.startDate,
      endDate,
      rashi: input.rashi,
      trends: agg.trends,
      scores: agg.scoreBands,
      opportunities,
      challenges,
      favorableDays: agg.favorableDays,
      cautionDays: agg.cautionDays,
      planetHighlights: highlights,
      panchangSummary: panchang,
      luckyFactors: lucky,
      dailyScores: agg.dailyScores,
      days,
      metadata: {
        calculationTimestamp: new Date().toISOString(),
        timezone: input.timezone ?? "Asia/Kolkata",
        engineVersion: WEEKLY_ENGINE_VERSION,
        language: input.language ?? "en",
        dataSource: DAILY_DATA_SOURCE,
        calculationDurationMs: Date.now() - started,
        daysComputed: days.length,
      },
    };
  }
}

export function createWeeklyHoroscopeEngine(): WeeklyHoroscopeEngine {
  return new WeeklyHoroscopeEngine();
}

/** Convenience one-shot. */
export function generateWeeklyHoroscope(input: WeeklyHoroscopeInput): WeeklyHoroscopeOutput {
  return createWeeklyHoroscopeEngine().generate(input);
}

// re-export for convenience callers
export { daysBetween };
