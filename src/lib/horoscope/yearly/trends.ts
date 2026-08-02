// ============================================================
// Yearly Horoscope Engine — Trend & label rollups
// ------------------------------------------------------------
// Derives quarterly trends and machine-readable opportunity /
// challenge labels from monthly-level data.
// ============================================================

import type { DailyHoroscopeOutput, DailyScoreCategory } from "../daily/types";
import type { MonthlyHoroscopeOutput } from "../monthly/types";
import { classifyTrend, type TrendResult } from "../trend";
import { avg, quarterBounds } from "./helpers";
import type { YearlyMonthSummary, YearlyQuarter } from "./types";

/** Slice the daily series for a given day-range [start,end] inclusive (YYYY-MM-DD). */
function seriesInRange(
  days: DailyHoroscopeOutput[],
  startISO: string,
  endISO: string,
  category: DailyScoreCategory,
): number[] {
  const out: number[] = [];
  for (const d of days) {
    if (d.date >= startISO && d.date <= endISO) out.push(d.scores[category].score);
  }
  return out;
}

const QUARTER_CATEGORY_MAP: Record<keyof YearlyQuarter["trends"], DailyScoreCategory> = {
  overall: "overall",
  career: "career",
  finance: "finance",
  relationships: "love",
  health: "health",
  travel: "travel",
  business: "business",
};

export function buildQuarters(
  year: number,
  months: MonthlyHoroscopeOutput[],
  days: DailyHoroscopeOutput[],
): YearlyQuarter[] {
  const out: YearlyQuarter[] = [];
  for (const q of [1, 2, 3, 4] as const) {
    const { start, end, months: mIdx } = quarterBounds(year, q);
    const qMonths = months.filter((m) => mIdx.includes(m.month));
    const overallAvgs = qMonths.map((m) => m.overview.averageScore);
    const averageScore = Math.round(avg(overallAvgs));

    const trends = {} as YearlyQuarter["trends"];
    for (const key of Object.keys(QUARTER_CATEGORY_MAP) as Array<keyof YearlyQuarter["trends"]>) {
      const cat = QUARTER_CATEGORY_MAP[key];
      trends[key] = classifyTrend(seriesInRange(days, start, end, cat));
    }

    let bestMonth: number | null = null;
    let toughestMonth: number | null = null;
    let bestVal = -Infinity;
    let worstVal = Infinity;
    for (const m of qMonths) {
      if (m.overview.averageScore > bestVal) {
        bestVal = m.overview.averageScore;
        bestMonth = m.month;
      }
      if (m.overview.averageScore < worstVal) {
        worstVal = m.overview.averageScore;
        toughestMonth = m.month;
      }
    }

    out.push({
      quarter: q,
      startDate: start,
      endDate: end,
      months: mIdx,
      averageScore,
      trends,
      bestMonth,
      toughestMonth,
    });
  }
  return out;
}

export function buildMonthSummaries(months: MonthlyHoroscopeOutput[]): YearlyMonthSummary[] {
  return months.map<YearlyMonthSummary>((m) => ({
    month: m.month,
    averageScore: Math.round(m.overview.averageScore),
    trend: m.overview.trend,
    peakDay: m.overview.peakDay?.date ?? null,
    lowDay: m.overview.lowDay?.date ?? null,
    bestWeek: m.bestWeek,
    mostSensitiveWeek: m.mostSensitiveWeek,
  }));
}

/** Union & dedupe the monthly-level labels for the whole year. */
export function rollupLabels(months: MonthlyHoroscopeOutput[]): {
  opportunities: string[];
  challenges: string[];
} {
  const opp = new Set<string>();
  const ch = new Set<string>();
  for (const m of months) {
    m.opportunities.forEach((x) => opp.add(x));
    m.challenges.forEach((x) => ch.add(x));
  }
  return { opportunities: [...opp].sort(), challenges: [...ch].sort() };
}

/** Annual overall trend derived from the 12 monthly averages. */
export function annualOverallTrend(months: MonthlyHoroscopeOutput[]): TrendResult {
  return classifyTrend(months.map((m) => m.overview.averageScore));
}
