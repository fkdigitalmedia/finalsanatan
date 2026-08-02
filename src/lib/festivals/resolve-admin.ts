/**
 * Resolve Gregorian dates for an admin_festivals row.
 *
 * Bridges the DB-driven festival record (date_type + rule payload) with the
 * astronomical Panchang engine in `src/lib/festivals/helpers.ts`. Falls back
 * to the hard-coded rule module in `./registry` when the row's slug matches.
 */
import { DEFAULT_LOCATION, type LatLon } from "@/lib/panchang";
import {
  findSunriseVyapiniDay,
  findPradoshVyapiniDay,
  findMadhyahnaVyapiniDay,
  sunIngressDate,
  isoLocalDate,
} from "./helpers";
import { RULES } from "./registry";
import type { ResolvedFestival } from "./types";

export type AdminFestivalRow = {
  id: string;
  slug: string;
  name: string;
  date_type: "fixed" | "lunar" | "solar" | "dynamic";
  fixed_month?: number | null;
  fixed_day?: number | null;
  lunar_rule?: {
    tithi?: number;
    paksha?: "Shukla" | "Krishna";
    lunar_month?: string;
    anchor?: string;
  } | null;
  solar_rule?: { rashi?: number; event?: string; sign?: string } | null;
  is_multi_day?: boolean;
  duration_days?: number;
  year_overrides?: Record<string, { date?: string; skip?: boolean }> | null;
  timezone?: string;
};

// Rough Gregorian window centered on each purnimanta lunar month.
// Wide enough to capture both paksha events without excessive scanning.
const LUNAR_MONTH_WINDOWS: Record<string, { month: number; day: number; days: number }> = {
  Chaitra: { month: 3, day: 1, days: 45 },
  Vaishakha: { month: 4, day: 1, days: 45 },
  Jyeshtha: { month: 5, day: 1, days: 45 },
  Ashadha: { month: 6, day: 1, days: 45 },
  Shravana: { month: 7, day: 1, days: 45 },
  Bhadrapada: { month: 8, day: 1, days: 45 },
  Ashwin: { month: 9, day: 1, days: 45 },
  Kartika: { month: 10, day: 1, days: 45 },
  Margashirsha: { month: 11, day: 1, days: 45 },
  Pausha: { month: 12, day: 1, days: 40 },
  Magha: { month: 1, day: 1, days: 45 },
  Phalguna: { month: 2, day: 1, days: 40 },
};

const RASHI_INDEX: Record<string, number> = {
  Mesha: 0,
  Vrishabha: 1,
  Mithuna: 2,
  Karka: 3,
  Simha: 4,
  Kanya: 5,
  Tula: 6,
  Vrishchika: 7,
  Dhanu: 8,
  Makara: 9,
  Kumbha: 10,
  Meena: 11,
};

function buildOccurrence(
  row: AdminFestivalRow,
  date: Date,
  note: string,
  loc: LatLon,
): ResolvedFestival[] {
  const iso = isoLocalDate(date, loc.tz);
  const base: ResolvedFestival = {
    slug: row.slug,
    name: row.name,
    date,
    isoDate: iso,
    notes: [note],
  };
  const list = [base];
  const dur = Math.max(1, row.duration_days ?? 1);
  if (row.is_multi_day && dur > 1) {
    for (let i = 1; i < Math.min(dur, 15); i++) {
      const d = new Date(date.getTime() + i * 86_400_000);
      list.push({
        slug: row.slug,
        name: `${row.name} — Day ${i + 1}`,
        date: d,
        isoDate: isoLocalDate(d, loc.tz),
        notes: ["multi-day continuation"],
      });
    }
  }
  return list;
}

/** Compute all occurrences for a single admin festival in a given year. */
export function resolveAdminFestival(
  row: AdminFestivalRow,
  year: number,
  loc: LatLon = DEFAULT_LOCATION,
): ResolvedFestival[] {
  // 1) Year override wins.
  const override = row.year_overrides?.[String(year)];
  if (override?.skip) return [];
  if (override?.date) {
    const [y, m, d] = override.date.split("-").map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d, 6));
    return buildOccurrence(row, dt, "year override", loc);
  }

  // 2) Dynamic → dispatch to hard-coded rule module by slug.
  if (row.date_type === "dynamic") {
    const rule = RULES.find((r) => r.slug === row.slug);
    if (!rule) throw new Error(`No dynamic rule registered for slug "${row.slug}"`);
    return rule.resolve(year, loc);
  }

  // 3) Fixed Gregorian.
  if (row.date_type === "fixed") {
    if (!row.fixed_month || !row.fixed_day)
      throw new Error("Fixed festival requires fixed_month and fixed_day");
    const dt = new Date(Date.UTC(year, row.fixed_month - 1, row.fixed_day, 6));
    return buildOccurrence(row, dt, "fixed Gregorian date", loc);
  }

  // 4) Solar (Sankranti).
  if (row.date_type === "solar") {
    let rashi: number | undefined;
    if (typeof row.solar_rule?.rashi === "number") rashi = row.solar_rule.rashi;
    else if (row.solar_rule?.sign && row.solar_rule.sign in RASHI_INDEX)
      rashi = RASHI_INDEX[row.solar_rule.sign];
    if (rashi == null)
      throw new Error("Solar festival requires solar_rule.rashi or solar_rule.sign");
    const dt = sunIngressDate(year, rashi);
    return buildOccurrence(row, dt, `sun enters rashi ${rashi}`, loc);
  }

  // 5) Lunar (tithi + paksha + lunar_month).
  if (row.date_type === "lunar") {
    const lr = row.lunar_rule ?? {};
    if (!lr.tithi || !lr.paksha || !lr.lunar_month) {
      throw new Error("Lunar festival requires lunar_rule.{tithi, paksha, lunar_month}");
    }
    const win = LUNAR_MONTH_WINDOWS[lr.lunar_month];
    if (!win) throw new Error(`Unknown lunar month "${lr.lunar_month}"`);
    // Pausha/Magha windows can wrap into the next Gregorian year.
    const startYear = win.month === 1 ? year : year;
    const startYmd = `${startYear}-${String(win.month).padStart(2, "0")}-${String(win.day).padStart(2, "0")}`;

    const anchor = (lr.anchor ?? "sunrise").toLowerCase();
    let day: Date | null = null;
    if (anchor === "pradosh" || anchor === "sunset") {
      day = findPradoshVyapiniDay(loc, startYmd, win.days, lr.paksha, lr.tithi);
    } else if (anchor === "madhyahna" || anchor === "noon") {
      day = findMadhyahnaVyapiniDay(loc, startYmd, win.days, lr.paksha, lr.tithi);
    } else {
      day = findSunriseVyapiniDay(loc, startYmd, win.days, lr.paksha, lr.tithi);
    }
    if (!day)
      throw new Error(`No matching ${lr.paksha} ${lr.tithi} found in ${lr.lunar_month} window`);
    return buildOccurrence(
      row,
      day,
      `${lr.paksha} ${lr.tithi} of ${lr.lunar_month} via ${anchor}-vyapini`,
      loc,
    );
  }

  throw new Error(`Unsupported date_type "${row.date_type}"`);
}

/** Convenience: resolve N consecutive years, skipping years that error. */
export function resolveAdminFestivalRange(
  row: AdminFestivalRow,
  startYear: number,
  years: number,
  loc: LatLon = DEFAULT_LOCATION,
): { year: number; occurrences: ResolvedFestival[]; error?: string }[] {
  const out: { year: number; occurrences: ResolvedFestival[]; error?: string }[] = [];
  for (let i = 0; i < years; i++) {
    const y = startYear + i;
    try {
      out.push({ year: y, occurrences: resolveAdminFestival(row, y, loc) });
    } catch (e: any) {
      out.push({ year: y, occurrences: [], error: e?.message ?? "resolution failed" });
    }
  }
  return out;
}
