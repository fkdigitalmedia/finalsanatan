// ============================================================
// Kundli / time module
// ------------------------------------------------------------
// Converts a user birth date+time+tz into:
//   • a UTC Date
//   • Julian Day (UT)
//   • Greenwich Apparent Sidereal Time (hours)
//   • Local Sidereal Time (hours)
//   • Mean obliquity of the ecliptic (degrees)
// Uses the astronomy-engine that already backs `src/lib/astro/core.ts`.
// ============================================================
import { AstronomyEngine as A } from "@/lib/astro/core";

/** Convert IANA tz string or numeric offset into offset minutes for a given wall-clock date */
export function resolveTzOffsetMinutes(
  dateISO: string,
  timeHHmm: string,
  tz: string | number,
): number {
  if (typeof tz === "number") return tz * 60;
  // Interpret local wall-clock in given IANA zone via Intl trick
  // Take the wall-clock as if it were UTC, then find diff to what Intl reports.
  const asUTC = new Date(`${dateISO}T${timeHHmm}:00Z`);
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = Object.fromEntries(
    fmt
      .formatToParts(asUTC)
      .filter((p) => p.type !== "literal")
      .map((p) => [p.type, p.value]),
  );
  const asIfLocal = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour) % 24,
    Number(parts.minute),
    Number(parts.second),
  );
  return Math.round((asIfLocal - asUTC.getTime()) / 60000);
}

/** Build UTC Date from birth (local) input. */
export function toUtcDate(dateISO: string, timeHHmm: string, tz: string | number): Date {
  const offsetMin = resolveTzOffsetMinutes(dateISO, timeHHmm, tz);
  const local = new Date(`${dateISO}T${timeHHmm}:00Z`);
  return new Date(local.getTime() - offsetMin * 60_000);
}

/** Julian Day (UT) — astronomy-engine's AstroTime.ut is JD - 2451545.0 */
export function julianDayUT(d: Date): number {
  return A.MakeTime(d).ut + 2451545.0;
}

/** Greenwich Apparent Sidereal Time in hours (0..24) */
export function gastHours(d: Date): number {
  return A.SiderealTime(A.MakeTime(d));
}

/** Local Sidereal Time in hours (0..24) at given east-longitude (deg) */
export function lstHours(d: Date, eastLonDeg: number): number {
  let lst = gastHours(d) + eastLonDeg / 15;
  lst = ((lst % 24) + 24) % 24;
  return lst;
}

/** Mean obliquity of the ecliptic in degrees (IAU 2006 short form) */
export function meanObliquityDeg(d: Date): number {
  const T = (julianDayUT(d) - 2451545.0) / 36525;
  // arcseconds polynomial → deg
  const eps = 84381.406 - 46.836769 * T - 0.0001831 * T * T + 0.0020034 * T * T * T;
  return eps / 3600;
}
