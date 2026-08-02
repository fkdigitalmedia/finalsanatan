import type { FestivalRule } from "../types";
import { findMadhyahnaVyapiniDay, findSunriseVyapiniDay, isoLocalDate } from "../helpers";
import type { LatLon } from "@/lib/panchang";

/**
 * Ganesh Chaturthi (Vinayaka Chaturthi)
 * Traditional rule: Bhadrapada Shukla Chaturthi (index 4) prevailing at
 * madhyahna (midday). Ten-day utsav ends on Anant Chaturdashi.
 */
export const ganeshChaturthi: FestivalRule = {
  slug: "ganesh-chaturthi",
  name: "Ganesh Chaturthi",
  devanagari: "गणेश चतुर्थी",
  category: "Major",
  deity: "Ganesha",
  dependencies: {
    tithi: { paksha: "Shukla", index: 4 },
    lunarMonth: "Bhadrapada",
    anchor: "sunrise-vyapini",
  },
  traditionalRule:
    "Bhadrapada Shukla Chaturthi prevailing at madhyahna kaal. Sthapana of Ganesha murti; visarjan on Anant Chaturdashi (10 days later).",
  regionalVariations: [
    {
      region: "Maharashtra",
      note: "Largest public sarvajanik pandals; started by Lokmanya Tilak in 1893.",
    },
    {
      region: "Karnataka, Andhra & Telangana",
      note: "Household puja with Gowri Habba the previous day.",
    },
    {
      region: "Tamil Nadu (Vinayaka Chaturthi)",
      note: "Kozhukattai offered; clay murtis dissolved in wells.",
    },
  ],
  edgeCases: [
    {
      scenario: "Chaturthi spans two madhyahnas",
      handling: "Later day preferred (later sunrise-vyapini match).",
    },
    {
      scenario: "Chandra darshan forbidden that evening",
      handling: "Avoid moon-sight on Ganesh Chaturthi to escape Mithya Dosha.",
    },
  ],
  i18n: {
    nameKey: "festivals.ganesh_chaturthi.name",
    descriptionKey: "festivals.ganesh_chaturthi.description",
  },
  validation: {
    tolerance: 0,
    knownDates: [
      { year: 2024, date: "2024-09-07", source: "DrikPanchang" },
      { year: 2025, date: "2025-08-27", source: "DrikPanchang" },
      { year: 2026, date: "2026-09-14", source: "DrikPanchang" },
      { year: 2027, date: "2027-09-04", source: "DrikPanchang" },
    ],
  },
  resolve(year: number, loc: LatLon) {
    // Madhyahna-vyapini is the true rule; sunrise-vyapini is fallback.
    const day =
      findMadhyahnaVyapiniDay(loc, `${year}-08-20`, 35, "Shukla", 4) ??
      findSunriseVyapiniDay(loc, `${year}-08-20`, 35, "Shukla", 4, { preferEarlier: true });
    if (!day) return [];
    return [
      {
        slug: this.slug,
        name: this.name,
        date: day,
        isoDate: isoLocalDate(day, loc.tz),
        notes: ["Bhadrapada Shukla Chaturthi, madhyahna-vyapini approximation."],
      },
    ];
  },
};
