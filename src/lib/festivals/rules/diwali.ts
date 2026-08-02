import type { FestivalRule } from "../types";
import { findSunriseVyapiniDay, isoLocalDate } from "../helpers";
import type { LatLon } from "@/lib/panchang";

/**
 * Diwali / Deepavali
 * Traditional rule: Amavasya (Krishna Paksha 15) of Kartika month, when Amavasya
 * touches the pradosh (evening twilight). If Amavasya spans two evenings, the
 * evening on which it is present at pradosh is chosen. Approximation used here:
 * Kartika Amavasya scanned across Oct 15 – Nov 20 window.
 */
export const diwali: FestivalRule = {
  slug: "diwali",
  name: "Deepavali (Diwali)",
  devanagari: "दीपावली",
  category: "Major",
  deity: "Lakshmi-Ganesha",
  dependencies: {
    tithi: { paksha: "Krishna", index: 15 },
    lunarMonth: "Kartika",
    anchor: "night-vyapini",
  },
  traditionalRule:
    "Kartika Krishna Amavasya prevailing at pradosh (dusk). Lakshmi Puja is done in the evening.",
  regionalVariations: [
    {
      region: "South India",
      note: "Naraka Chaturdashi (day before) is the main celebration; oil bath at dawn.",
    },
    {
      region: "Gujarat",
      note: "Also marks the last day of the Vikram Samvat year; new year begins on Kartika Shukla Pratipada.",
    },
    { region: "Bengal", note: "Kali Puja is performed on the same Amavasya night." },
  ],
  edgeCases: [
    {
      scenario: "Amavasya at pradosh on two consecutive evenings",
      handling: "Prefer the earlier evening per Nirnaya Sindhu.",
    },
    {
      scenario: "Amavasya at pradosh on neither evening",
      handling: "Prefer the day where Amavasya prevails at sunset (later evening).",
    },
  ],
  i18n: { nameKey: "festivals.diwali.name", descriptionKey: "festivals.diwali.description" },
  validation: {
    tolerance: 1,
    knownDates: [
      {
        year: 2023,
        date: "2023-11-12",
        source: "DrikPanchang",
        note: "Nov 12/13 boundary; some regions Nov 13.",
      },
      { year: 2024, date: "2024-11-01", source: "DrikPanchang" },
      { year: 2025, date: "2025-10-20", source: "DrikPanchang" },
      { year: 2026, date: "2026-11-08", source: "DrikPanchang" },
    ],
  },
  resolve(year: number, loc: LatLon) {
    const day = findSunriseVyapiniDay(loc, `${year}-10-15`, 40, "Krishna", 15, {
      preferEarlier: true,
    });
    if (!day) return [];
    return [
      {
        slug: this.slug,
        name: this.name,
        date: day,
        isoDate: isoLocalDate(day, loc.tz),
        notes: ["Kartika Amavasya, pradosh-vyapini approximation via sunrise scan."],
      },
    ];
  },
};
