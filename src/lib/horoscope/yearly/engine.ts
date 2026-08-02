// ============================================================
// Yearly Horoscope Engine — Orchestrator (Phase 12.5)
// ------------------------------------------------------------
// Public entry point. Composes Monthly → Weekly → Daily +
// Panchang / Transit / Festival engines into a single yearly
// JSON payload. NO AI text, NO frontend, NO PDF, NO SEO.
// ============================================================

import { TransitCache } from "@/lib/transit/cache";
import { MonthlyHoroscopeEngine } from "../monthly/engine";
import { runMonthlyForYear } from "./calculator";
import { YEARLY_DATA_SOURCE, YEARLY_ENGINE_VERSION, YEARLY_CATEGORY_SOURCE } from "./constants";
import { avg, quarterOfMonth } from "./helpers";
import { collectDailySeries, computeYearlyScores } from "./scores";
import { annualOverallTrend, buildMonthSummaries, buildQuarters, rollupLabels } from "./trends";
import { buildFestivalCalendar, buildPlanetaryEvents } from "./timeline";
import { validateYearlyInput } from "./validators";
import type {
  YearlyHoroscopeInput,
  YearlyHoroscopeOutput,
  YearlyLuckyFactors,
  YearlyPanchangSummary,
  YearlyValidationResult,
} from "./types";

export { YEARLY_ENGINE_VERSION };

export class YearlyHoroscopeEngine {
  private readonly monthly: MonthlyHoroscopeEngine;
  private readonly cache: TransitCache<YearlyHoroscopeOutput>;
  private initialized = false;

  constructor(
    opts: { monthly?: MonthlyHoroscopeEngine; cache?: TransitCache<YearlyHoroscopeOutput> } = {},
  ) {
    this.monthly = opts.monthly ?? new MonthlyHoroscopeEngine();
    this.cache =
      opts.cache ??
      new TransitCache<YearlyHoroscopeOutput>({ ttlMs: 6 * 60 * 60 * 1000, maxEntries: 24 });
  }

  initialize(): void {
    this.initialized = true;
    this.cache.clear();
    this.monthly.initialize();
  }

  validateInput(input: YearlyHoroscopeInput): YearlyValidationResult {
    return validateYearlyInput(input);
  }

  generate(input: YearlyHoroscopeInput): YearlyHoroscopeOutput {
    if (!this.initialized) this.initialize();
    const validation = this.validateInput(input);
    if (!validation.ok) {
      throw new Error(
        `Invalid yearly horoscope input: ${validation.errors
          .map((e) => `${e.field}: ${e.message}`)
          .join("; ")}`,
      );
    }
    const key = [
      input.year,
      input.rashi,
      String(input.timezone ?? "Asia/Kolkata"),
      input.language ?? "en",
      input.latitude ?? "-",
      input.longitude ?? "-",
    ].join("|");
    return this.cache.memoize(key, () => this.compute(input));
  }

  private compute(input: YearlyHoroscopeInput): YearlyHoroscopeOutput {
    const started = Date.now();

    // 1) Run the monthly engine 12x (cache-backed within monthly/weekly/daily).
    const months = runMonthlyForYear(this.monthly, input);

    // 2) Collect every day's category scores just once.
    const { days, series } = collectDailySeries(months);

    // 3) Scores + trends (yearly vocabulary, sourced from daily buckets).
    const { scores, trends } = computeYearlyScores(series);

    // 4) Structural rollups.
    const quarters = buildQuarters(input.year, months, days);
    const monthSummaries = buildMonthSummaries(months);
    const { opportunities, challenges } = rollupLabels(months);

    // 5) Planetary events + festival calendar.
    const { events, retrogrades } = buildPlanetaryEvents(months, days);
    const festivals = buildFestivalCalendar(input.year, input.latitude, input.longitude);

    // 6) Panchang aggregate for the whole year.
    const panchang = aggregatePanchang(months);

    // 7) Overview + lucky factors.
    const monthlyAverages = months.map((m) => m.overview.averageScore);
    const overallTrend = annualOverallTrend(months);
    let peakMonth: YearlyHoroscopeOutput["overview"]["peakMonth"] = null;
    let lowMonth: YearlyHoroscopeOutput["overview"]["lowMonth"] = null;
    for (const m of months) {
      const s = Math.round(m.overview.averageScore);
      if (!peakMonth || s > peakMonth.averageScore) peakMonth = { month: m.month, averageScore: s };
      if (!lowMonth || s < lowMonth.averageScore) lowMonth = { month: m.month, averageScore: s };
    }
    const sortedDays = [...days].sort((a, b) => b.scores.overall.score - a.scores.overall.score);
    const topDay = sortedDays[0];
    const botDay = sortedDays[sortedDays.length - 1];

    const lucky = buildLuckyFactors(months, days, monthlyAverages);

    const daysComputed = months.reduce((s, m) => s + m.metadata.daysComputed, 0);
    const weeksComputed = months.reduce((s, m) => s + m.metadata.weeksComputed, 0);

    return {
      year: input.year,
      rashi: input.rashi,
      overview: {
        trend: overallTrend,
        averageScore: Math.round(avg(monthlyAverages)),
        peakMonth,
        lowMonth,
        peakDay: topDay ? { date: topDay.date, score: topDay.scores.overall.score } : null,
        lowDay: botDay ? { date: botDay.date, score: botDay.scores.overall.score } : null,
      },
      scores,
      trends,
      quarters,
      months: monthSummaries,
      planetaryEvents: events,
      planetRetrogrades: retrogrades,
      festivals,
      panchangSummary: panchang,
      luckyFactors: lucky,
      opportunities,
      challenges,
      categorySources: YEARLY_CATEGORY_SOURCE,
      monthly: months,
      metadata: {
        calculationTimestamp: new Date().toISOString(),
        timezone: input.timezone ?? "Asia/Kolkata",
        engineVersion: YEARLY_ENGINE_VERSION,
        language: input.language ?? "en",
        dataSource: YEARLY_DATA_SOURCE,
        calculationDurationMs: Date.now() - started,
        monthsComputed: months.length,
        weeksComputed,
        daysComputed,
        festivalCount: festivals.length,
        eventCount: events.length,
      },
    };
  }
}

function aggregatePanchang(
  months: ReturnType<MonthlyHoroscopeEngine["generate"]>[],
): YearlyPanchangSummary {
  const ekadashiDates: string[] = [];
  const purnimaDates: string[] = [];
  const amavasyaDates: string[] = [];
  let sankashti = 0;
  let auspicious = 0;
  let inauspicious = 0;
  for (const m of months) {
    ekadashiDates.push(...m.panchangSummary.ekadashiDates);
    purnimaDates.push(...m.panchangSummary.purnimaDates);
    amavasyaDates.push(...m.panchangSummary.amavasyaDates);
    sankashti += m.panchangSummary.sankashtiDates.length;
    auspicious += m.panchangSummary.auspiciousYogasCount;
    inauspicious += m.panchangSummary.inauspiciousYogasCount;
  }
  return {
    ekadashiCount: ekadashiDates.length,
    purnimaCount: purnimaDates.length,
    amavasyaCount: amavasyaDates.length,
    sankashtiCount: sankashti,
    auspiciousYogasCount: auspicious,
    inauspiciousYogasCount: inauspicious,
    ekadashiDates,
    purnimaDates,
    amavasyaDates,
  };
}

function buildLuckyFactors(
  months: ReturnType<MonthlyHoroscopeEngine["generate"]>[],
  days: import("../daily/types").DailyHoroscopeOutput[],
  monthlyAverages: number[],
): YearlyLuckyFactors {
  // Lucky months: top 3 monthly averages.
  const indexed = monthlyAverages.map((s, i) => ({ month: months[i].month, s }));
  const luckyMonths = [...indexed]
    .sort((a, b) => b.s - a.s)
    .slice(0, 3)
    .map((x) => x.month);

  // Lucky dates: top-10 days overall.
  const luckyDates = [...days]
    .sort((a, b) => b.scores.overall.score - a.scores.overall.score)
    .slice(0, 10)
    .map((d) => d.date);

  // Lucky numbers / colors: union of daily lucky attributes (dedup preserves order).
  const numbers = Array.from(new Set(days.map((d) => d.luckyFactors.number)));
  const colors = Array.from(new Set(days.map((d) => d.luckyFactors.color)));
  const direction = days[0]?.luckyFactors.direction ?? "East";

  const favorableTimeWindows = months.map((m) => {
    const first = m.days[0];
    return {
      month: m.month,
      window: first?.luckyFactors.timeWindow.label ?? "n/a",
    };
  });

  // High opportunity / caution periods = best & most-sensitive week per month.
  const highOpportunityPeriods = months
    .map((m) => m.bestWeek)
    .filter((w): w is NonNullable<typeof w> => Boolean(w));
  const cautionPeriods = months
    .map((m) => m.mostSensitiveWeek)
    .filter((w): w is NonNullable<typeof w> => Boolean(w));

  return {
    luckyMonths,
    luckyDates,
    luckyNumbers: numbers,
    luckyColors: colors,
    luckyDirection: direction,
    favorableTimeWindows,
    highOpportunityPeriods,
    cautionPeriods,
  };
}

export function createYearlyHoroscopeEngine(): YearlyHoroscopeEngine {
  return new YearlyHoroscopeEngine();
}

export function generateYearlyHoroscope(input: YearlyHoroscopeInput): YearlyHoroscopeOutput {
  return createYearlyHoroscopeEngine().generate(input);
}

// Small compile-time reference to keep quarterOfMonth publicly re-exported via helpers.
void quarterOfMonth;
