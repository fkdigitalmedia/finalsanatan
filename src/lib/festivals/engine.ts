// ============================================================
// Festival Rules Engine
// ------------------------------------------------------------
// Orchestrates rule modules. Never contains festival-specific
// math — that lives in `rules/*.ts` and calls into `helpers.ts`.
// ============================================================
import type { FestivalRule, ResolvedFestival } from "./types";
import { DEFAULT_LOCATION, type LatLon } from "@/lib/panchang";
import { RULES } from "./registry";

/** Resolve a single named festival for a given year. */
export function resolveFestival(
  slug: string,
  year: number,
  loc: LatLon = DEFAULT_LOCATION,
): ResolvedFestival[] {
  const rule = RULES.find((r) => r.slug === slug);
  if (!rule) throw new Error(`Unknown festival rule: ${slug}`);
  return rule.resolve(year, loc);
}

/** Resolve all registered festivals for a year, sorted chronologically. */
export function resolveAllFestivals(
  year: number,
  loc: LatLon = DEFAULT_LOCATION,
): ResolvedFestival[] {
  const out: ResolvedFestival[] = [];
  for (const rule of RULES) {
    try {
      out.push(...rule.resolve(year, loc));
    } catch (err) {
      // Rules are isolated — one failure never breaks the calendar.
      console.warn(`[festival-engine] ${rule.slug} failed for ${year}:`, err);
    }
  }
  return out.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/** Look up rule metadata (no computation). */
export function getFestivalRule(slug: string): FestivalRule | undefined {
  return RULES.find((r) => r.slug === slug);
}

export function listFestivalRules(): FestivalRule[] {
  return RULES;
}

export type { FestivalRule, ResolvedFestival } from "./types";
