import type { FestivalRule } from "../types";
import { findSunriseVyapiniDay, isoLocalDate } from "../helpers";
import type { LatLon } from "@/lib/panchang";

/**
 * Maha Shivaratri
 * Traditional rule: Phalguna Krishna Chaturdashi (14 in Krishna paksha =>
 * index 15+14 = 29) prevailing at nishitha kaal (midnight). Some traditions
 * use Magha Krishna Chaturdashi — this engine uses the widely-followed
 * Phalguna Krishna Chaturdashi.
 */
export const mahaShivaratri: FestivalRule = {
  slug: "maha-shivaratri",
  name: "Maha Shivaratri",
  devanagari: "महाशिवरात्रि",
  category: "Major",
  deity: "Shiva",
  dependencies: {
    tithi: { paksha: "Krishna", index: 14 },
    lunarMonth: "Phalguna",
    anchor: "night-vyapini",
  },
  traditionalRule:
    "Phalguna (Amanta: Magha) Krishna Chaturdashi prevailing at nishitha kaal (midnight). Night-long vigil, four prahar puja.",
  regionalVariations: [
    {
      region: "Kashmir (Herath)",
      note: "Observed over three days from Trayodashi; family puja of Vatuk Bhairava.",
    },
    { region: "Nepal", note: "Grand celebration at Pashupatinath; Sadhus gather in thousands." },
    {
      region: "South India",
      note: "Some panchangas fix the date via Magha Krishna Chaturdashi (Amanta system).",
    },
  ],
  edgeCases: [
    {
      scenario: "Chaturdashi at midnight on both consecutive nights",
      handling: "Earlier night preferred by most panchangas.",
    },
    {
      scenario: "Chaturdashi ends before midnight",
      handling: "Preceding day chosen so nishitha falls in Chaturdashi.",
    },
  ],
  i18n: {
    nameKey: "festivals.maha_shivaratri.name",
    descriptionKey: "festivals.maha_shivaratri.description",
  },
  validation: {
    tolerance: 1,
    knownDates: [
      { year: 2024, date: "2024-03-08", source: "DrikPanchang" },
      { year: 2025, date: "2025-02-26", source: "DrikPanchang" },
      { year: 2026, date: "2026-02-15", source: "DrikPanchang" },
      { year: 2027, date: "2027-03-06", source: "DrikPanchang" },
    ],
  },
  resolve(year: number, loc: LatLon) {
    // Purnimanta Phalguna Krishna Chaturdashi corresponds to Amanta Magha Krishna
    // Chaturdashi — falls in Feb / early March.
    // Phalguna Krishna Chaturdashi typically falls mid-Feb – mid-Mar.
    const day = findSunriseVyapiniDay(loc, `${year}-02-10`, 38, "Krishna", 14, {
      preferEarlier: true,
    });
    if (!day) return [];
    return [
      {
        slug: this.slug,
        name: this.name,
        date: day,
        isoDate: isoLocalDate(day, loc.tz),
        notes: ["Krishna Chaturdashi nishitha-vyapini approximation."],
      },
    ];
  },
};
