import type { FestivalRule } from "../types";
import {
  findMadhyahnaVyapiniDay,
  findSunriseVyapiniDay,
  isoLocalDate,
  moonriseOn,
} from "../helpers";
import type { LatLon } from "@/lib/panchang";

/**
 * Karva Chauth — Kartika Krishna Chaturthi.
 * Married women fast from sunrise to moonrise, then break fast after sighting
 * the moon through a sieve.
 */
export const karvaChauth: FestivalRule = {
  slug: "karva-chauth",
  name: "Karva Chauth",
  devanagari: "करवा चौथ",
  category: "Vrat",
  deity: "Shiva-Parvati",
  dependencies: {
    tithi: { paksha: "Krishna", index: 4 },
    lunarMonth: "Kartika",
    anchor: "moonrise",
  },
  traditionalRule:
    "Kartika (Purnimanta) Krishna Chaturthi prevailing at moonrise. Fast from sunrise; broken after moon darshan through a sieve.",
  regionalVariations: [
    {
      region: "North India (Punjab, Haryana, UP, Rajasthan, Delhi)",
      note: "Primary observance region; sargi meal before sunrise from mother-in-law.",
    },
    {
      region: "Rajasthan",
      note: "Karwa (earthen pot) exchange between women; folk katha of Veervati.",
    },
    { region: "Newar community (Nepal)", note: "Not observed — regional to North Indian Hindus." },
  ],
  edgeCases: [
    {
      scenario: "Chaturthi ends before moonrise",
      handling: "Fast still broken after moon rises even if tithi ended earlier.",
    },
    {
      scenario: "Moon obscured by weather",
      handling: "Symbolic sighting through sieve after expected moonrise time is acceptable.",
    },
  ],
  i18n: {
    nameKey: "festivals.karva_chauth.name",
    descriptionKey: "festivals.karva_chauth.description",
  },
  validation: {
    tolerance: 1,
    knownDates: [
      { year: 2024, date: "2024-10-20", source: "DrikPanchang" },
      { year: 2025, date: "2025-10-10", source: "DrikPanchang" },
      { year: 2026, date: "2026-10-30", source: "DrikPanchang" },
      { year: 2027, date: "2027-10-19", source: "DrikPanchang" },
    ],
  },
  resolve(year: number, loc: LatLon) {
    // Chandra-udaya-vyapini is the true rule; use madhyahna then sunrise as fallbacks.
    const day =
      findMadhyahnaVyapiniDay(loc, `${year}-10-05`, 30, "Krishna", 4) ??
      findSunriseVyapiniDay(loc, `${year}-10-05`, 30, "Krishna", 4, { preferEarlier: true });
    if (!day) return [];
    const mr = moonriseOn(day, loc);
    return [
      {
        slug: this.slug,
        name: this.name,
        date: day,
        isoDate: isoLocalDate(day, loc.tz),
        window: mr ? { start: day, end: mr } : undefined,
        notes: [
          "Kartika (Purnimanta) Krishna Chaturthi.",
          mr
            ? `Moonrise (fast broken): ${mr.toISOString()}`
            : "Moonrise unavailable at this location.",
        ],
      },
    ];
  },
};
