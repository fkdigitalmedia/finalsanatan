// ============================================================
// Service — Festivals
// ============================================================

import { resolveAllFestivals, resolveFestival, listFestivalRules } from "@/lib/festivals/engine";
import { DEFAULT_LOCATION, type LatLon } from "@/lib/panchang";

function place(lat?: number, lon?: number, tz?: string): LatLon {
  if (lat === undefined || lon === undefined) return DEFAULT_LOCATION;
  return { label: "Custom", lat, lon, tz: tz ?? DEFAULT_LOCATION.tz };
}

export function festivalsForYear(year: number, lat?: number, lon?: number, tz?: string) {
  return resolveAllFestivals(year, place(lat, lon, tz)).map((f) => ({
    ...f,
    date: f.date.toISOString(),
  }));
}

export function festivalBySlug(
  slug: string,
  year: number,
  lat?: number,
  lon?: number,
  tz?: string,
) {
  return resolveFestival(slug, year, place(lat, lon, tz)).map((f) => ({
    ...f,
    date: f.date.toISOString(),
  }));
}

export function festivalCatalogue() {
  return listFestivalRules().map((r) => ({ slug: r.slug, name: r.name }));
}
