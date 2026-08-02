import type { FestivalRule, ResolvedFestival } from "../types";
import { findSunriseVyapiniDay, isoLocalDate } from "../helpers";
import type { LatLon } from "@/lib/panchang";

/**
 * Sharadiya Navratri (autumn) — nine days from Ashwin Shukla Pratipada.
 * Ends on Navami; Vijayadashami (Dussehra) is Ashwin Shukla Dashami.
 * Returns Ghatasthapana date (day 1); a longer resolver could emit all 9 days.
 */
export const navratri: FestivalRule = {
  slug: "sharadiya-navratri",
  name: "Sharadiya Navratri",
  devanagari: "शारदीय नवरात्रि",
  category: "Major",
  deity: "Durga",
  dependencies: {
    tithi: { paksha: "Shukla", index: 1 },
    lunarMonth: "Ashwin",
    anchor: "sunrise-vyapini",
  },
  traditionalRule:
    "Nine nights from Ashwin Shukla Pratipada (Ghatasthapana) to Ashwin Shukla Navami. Vijayadashami follows on Dashami.",
  regionalVariations: [
    { region: "Gujarat", note: "Nightly garba and dandiya-raas; largest public celebrations." },
    {
      region: "West Bengal (Durga Puja)",
      note: "Sasthi to Dashami is the main festival; Kolkata's pandals.",
    },
    { region: "Karnataka & Mysuru", note: "Royal Mysuru Dasara procession on Vijayadashami." },
    { region: "Tamil Nadu (Golu)", note: "Doll displays; Saraswati Puja on ninth day." },
  ],
  edgeCases: [
    {
      scenario: "Pratipada is 'kshaya' (short-lived)",
      handling: "Ghatasthapana done in Abhijit muhurta even if Pratipada is brief.",
    },
    {
      scenario: "Navami and Dashami on same day",
      handling: "Vijayadashami observed on the day when Dashami prevails at aparahna.",
    },
  ],
  i18n: { nameKey: "festivals.navratri.name", descriptionKey: "festivals.navratri.description" },
  validation: {
    tolerance: 0,
    knownDates: [
      { year: 2024, date: "2024-10-03", source: "DrikPanchang", note: "Ghatasthapana" },
      { year: 2025, date: "2025-09-22", source: "DrikPanchang" },
      { year: 2026, date: "2026-10-11", source: "DrikPanchang" },
    ],
  },
  resolve(year: number, loc: LatLon): ResolvedFestival[] {
    const day1 = findSunriseVyapiniDay(loc, `${year}-09-20`, 30, "Shukla", 1, {
      preferEarlier: true,
    });
    if (!day1) return [];
    return [
      {
        slug: this.slug,
        name: this.name,
        date: day1,
        isoDate: isoLocalDate(day1, loc.tz),
        window: { start: day1, end: new Date(day1.getTime() + 8 * 86400_000) },
        notes: ["Ghatasthapana on Ashwin Shukla Pratipada; nine-night window."],
      },
    ];
  },
};
