// ============================================================
// Monthly Horoscope Engine — Helpers
// ============================================================

import { addDays, daysBetween, isoDay, parseDate } from "../weekly/helpers";

/** Number of days in a Gregorian year/month. */
export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** First & last YYYY-MM-DD of a Gregorian month. */
export function monthBounds(year: number, month: number): { start: string; end: string } {
  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  const end = `${year}-${String(month).padStart(2, "0")}-${String(daysInMonth(year, month)).padStart(2, "0")}`;
  return { start, end };
}

/**
 * Split an inclusive [start, end] window into 7-day chunks
 * (final chunk may be shorter, but is always ≥ 6 days — the
 * Weekly engine requires 6..13 day windows, so any trailing
 * partial chunk shorter than that is folded into the prior one).
 */
export function chunkWeeks(
  startISO: string,
  endISO: string,
): Array<{ start: string; end: string }> {
  const chunks: Array<{ start: string; end: string }> = [];
  let cursor = startISO;
  while (parseDate(cursor).getTime() <= parseDate(endISO).getTime()) {
    const tentativeEnd = addDays(cursor, 6);
    const end =
      parseDate(tentativeEnd).getTime() > parseDate(endISO).getTime() ? endISO : tentativeEnd;
    chunks.push({ start: cursor, end });
    cursor = addDays(end, 1);
  }
  // Fold a too-short trailing chunk into the previous week (max window is 13 days).
  if (chunks.length >= 2) {
    const last = chunks[chunks.length - 1];
    if (daysBetween(last.start, last.end) < 6) {
      const prev = chunks[chunks.length - 2];
      prev.end = last.end;
      chunks.pop();
    }
  }
  return chunks;
}

export { addDays, daysBetween, isoDay, parseDate };
