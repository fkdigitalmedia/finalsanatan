// ============================================================
// Yearly Horoscope Engine — Helpers
// ============================================================

import { daysInMonth, monthBounds } from "../monthly/helpers";

export { daysInMonth, monthBounds };

/** Quarter index (1..4) for a 1-based month. */
export function quarterOfMonth(month: number): 1 | 2 | 3 | 4 {
  return Math.ceil(month / 3) as 1 | 2 | 3 | 4;
}

/** Inclusive [start, end] YYYY-MM-DD bounds for a calendar quarter. */
export function quarterBounds(
  year: number,
  q: 1 | 2 | 3 | 4,
): { start: string; end: string; months: number[] } {
  const first = (q - 1) * 3 + 1;
  const months = [first, first + 1, first + 2];
  const { start } = monthBounds(year, first);
  const { end } = monthBounds(year, first + 2);
  return { start, end, months };
}

/** Safe numeric average, rounded to 1 decimal. */
export function avg(values: number[]): number {
  if (!values.length) return 0;
  const s = values.reduce((a, b) => a + b, 0);
  return Math.round((s / values.length) * 10) / 10;
}

/** Return [min, max] or [0, 0] for empty arrays. */
export function minMax(values: number[]): [number, number] {
  if (!values.length) return [0, 0];
  return [Math.min(...values), Math.max(...values)];
}

/** Round a 0..1 confidence to 2 decimals. */
export function round2(v: number): number {
  return Math.round(v * 100) / 100;
}
