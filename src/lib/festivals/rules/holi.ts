import type { FestivalRule } from "../types";
import { findPradoshVyapiniDay, isoLocalDate } from "../helpers";
import type { LatLon } from "@/lib/panchang";

/**
 * Holi — festival of colours.
 * Traditional rule: The day AFTER Holika Dahan.
 * Holika Dahan = Phalguna Shukla Purnima (index 15), evening (pradosh) with
 * Bhadra karana absent. Holi (Dhulandi) is celebrated the next morning.
 */
export const holi: FestivalRule = {
  slug: "holi",
  name: "Holi",
  devanagari: "होली",
  category: "Major",
  deity: "Krishna",
  dependencies: {
    tithi: { paksha: "Shukla", index: 15 },
    lunarMonth: "Phalguna",
    anchor: "sunrise-vyapini",
  },
  traditionalRule:
    "Phalguna Purnima marks Holika Dahan; the day after Purnima is Rangwali Holi / Dhulandi.",
  regionalVariations: [
    {
      region: "Braj (Mathura-Vrindavan)",
      note: "Lathmar Holi celebrated days earlier at Barsana and Nandgaon.",
    },
    { region: "West Bengal", note: "Observed as Dol Yatra / Dol Purnima on Purnima itself." },
    {
      region: "South India",
      note: "Kamavilas / Kama Dahanam — less commercial, focus on Kama-dahana story.",
    },
  ],
  edgeCases: [
    {
      scenario: "Purnima ends before sunset on day of dahan",
      handling: "Dahan performed on preceding day if Bhadra covers the evening.",
    },
    {
      scenario: "Purnima spans two sunrises",
      handling: "Later sunrise chosen for Holi; Dahan on the earlier evening if Bhadra-free.",
    },
  ],
  i18n: { nameKey: "festivals.holi.name", descriptionKey: "festivals.holi.description" },
  validation: {
    tolerance: 1,
    knownDates: [
      { year: 2024, date: "2024-03-25", source: "DrikPanchang" },
      { year: 2025, date: "2025-03-14", source: "DrikPanchang" },
      { year: 2026, date: "2026-03-04", source: "DrikPanchang" },
      { year: 2027, date: "2027-03-23", source: "DrikPanchang" },
    ],
  },
  resolve(year: number, loc: LatLon) {
    // Holika Dahan = day of Phalguna Purnima at pradosh (sunset). Holi = next day.
    const dahan = findPradoshVyapiniDay(loc, `${year}-02-25`, 30, "Shukla", 15);
    if (!dahan) return [];
    const holi = new Date(dahan.getTime() + 24 * 3600 * 1000);
    return [
      {
        slug: this.slug,
        name: this.name,
        date: holi,
        isoDate: isoLocalDate(holi, loc.tz),
        notes: ["Day after Phalguna Purnima (Holika Dahan)."],
      },
    ];
  },
};
