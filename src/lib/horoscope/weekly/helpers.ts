// ============================================================
// Weekly Horoscope Engine — Helpers
// ============================================================

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isIsoDate(s: unknown): s is string {
  return typeof s === "string" && DATE_RE.test(s);
}

/** Parse YYYY-MM-DD to a UTC-noon Date (matches daily engine convention). */
export function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, (m || 1) - 1, d || 1, 12, 0, 0));
}

/** Format a Date as YYYY-MM-DD in UTC (stable across tz). */
export function isoDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Inclusive list of YYYY-MM-DD strings between start and end. */
export function enumerateDates(startISO: string, endISO: string): string[] {
  const out: string[] = [];
  const start = parseDate(startISO);
  const end = parseDate(endISO);
  const cur = new Date(start);
  while (cur.getTime() <= end.getTime()) {
    out.push(isoDay(cur));
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return out;
}

/** Add `days` to a YYYY-MM-DD string. */
export function addDays(dateISO: string, days: number): string {
  const d = parseDate(dateISO);
  d.setUTCDate(d.getUTCDate() + days);
  return isoDay(d);
}

/** Delta in whole days between two YYYY-MM-DD strings. */
export function daysBetween(startISO: string, endISO: string): number {
  const ms = parseDate(endISO).getTime() - parseDate(startISO).getTime();
  return Math.round(ms / 86_400_000);
}
