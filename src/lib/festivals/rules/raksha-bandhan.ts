import type { FestivalRule } from "../types";
import { findSunriseVyapiniDay, isoLocalDate } from "../helpers";
import type { LatLon } from "@/lib/panchang";

/**
 * Raksha Bandhan — Shravana Purnima.
 * Sisters tie rakhi during aparahna (afternoon) with Bhadra ended.
 */
export const rakshaBandhan: FestivalRule = {
  slug: "raksha-bandhan",
  name: "Raksha Bandhan",
  devanagari: "रक्षा बंधन",
  category: "Purnima",
  dependencies: {
    tithi: { paksha: "Shukla", index: 15 },
    lunarMonth: "Shravana",
    anchor: "sunrise-vyapini",
  },
  traditionalRule: "Shravana Purnima. Rakhi tied during aparahna kaal after Bhadra ends.",
  regionalVariations: [
    {
      region: "South India (Avani Avittam)",
      note: "Yajur Upakarma performed by Brahmins on the same Purnima.",
    },
    {
      region: "Maharashtra",
      note: "Also observed as Narali Purnima — coconuts offered to the sea.",
    },
    {
      region: "Odisha (Gamha Purnima)",
      note: "Balarama Jayanti and cattle worship on the same day.",
    },
  ],
  edgeCases: [
    {
      scenario: "Bhadra covers full aparahna",
      handling: "Rakhi tied in the evening after Bhadra Punchha or on next day.",
    },
    {
      scenario: "Purnima ends before aparahna",
      handling: "Observed on previous day if Purnima at midday.",
    },
  ],
  i18n: {
    nameKey: "festivals.raksha_bandhan.name",
    descriptionKey: "festivals.raksha_bandhan.description",
  },
  validation: {
    tolerance: 0,
    knownDates: [
      { year: 2024, date: "2024-08-19", source: "DrikPanchang" },
      { year: 2025, date: "2025-08-09", source: "DrikPanchang" },
      { year: 2026, date: "2026-08-28", source: "DrikPanchang" },
      { year: 2027, date: "2027-08-17", source: "DrikPanchang" },
    ],
  },
  resolve(year: number, loc: LatLon) {
    const day = findSunriseVyapiniDay(loc, `${year}-08-01`, 30, "Shukla", 15, {
      preferEarlier: true,
    });
    if (!day) return [];
    return [
      {
        slug: this.slug,
        name: this.name,
        date: day,
        isoDate: isoLocalDate(day, loc.tz),
        notes: ["Shravana Purnima."],
      },
    ];
  },
};
