import type { FestivalRule } from "../types";
import { findSunriseVyapiniDay, isoLocalDate, midnightNakshatra } from "../helpers";
import type { LatLon } from "@/lib/panchang";

/**
 * Krishna Janmashtami
 * Traditional rule (Smarta): Bhadrapada Krishna Ashtami (index 8 in Krishna
 * paksha => 15+8 = 23) prevailing at midnight (nishitha kaal).
 * Vaishnava tradition: Ashtami combined with Rohini nakshatra at midnight;
 * often falls one day later. This resolver returns the Smarta date and
 * annotates Vaishnava as +1 when applicable.
 */
export const janmashtami: FestivalRule = {
  slug: "krishna-janmashtami",
  name: "Krishna Janmashtami",
  devanagari: "कृष्ण जन्माष्टमी",
  category: "Major",
  deity: "Krishna",
  dependencies: {
    tithi: { paksha: "Krishna", index: 8 },
    nakshatra: "Rohini",
    lunarMonth: "Bhadrapada",
    anchor: "night-vyapini",
  },
  traditionalRule:
    "Bhadrapada Krishna Ashtami with Ashtami prevailing at midnight. Vaishnavas additionally require Rohini nakshatra at midnight.",
  regionalVariations: [
    {
      region: "Smarta",
      note: "Ashtami at midnight suffices; celebrated one day earlier when Vaishnava differs.",
    },
    {
      region: "Vaishnava (ISKCON)",
      note: "Ashtami + Rohini at midnight required; often the following day.",
    },
    {
      region: "Maharashtra (Dahi Handi)",
      note: "Dahi Handi observed on the day after — Nanda Utsav.",
    },
  ],
  edgeCases: [
    {
      scenario: "Ashtami ends before midnight",
      handling: "Smarta uses that day; Vaishnava may shift to next.",
    },
    {
      scenario: "Rohini absent both nights",
      handling: "Vaishnava follows Smarta date as fallback.",
    },
  ],
  i18n: {
    nameKey: "festivals.janmashtami.name",
    descriptionKey: "festivals.janmashtami.description",
  },
  validation: {
    tolerance: 1,
    knownDates: [
      { year: 2024, date: "2024-08-26", source: "DrikPanchang" },
      { year: 2025, date: "2025-08-16", source: "DrikPanchang" },
      { year: 2026, date: "2026-09-04", source: "DrikPanchang" },
      { year: 2027, date: "2027-08-25", source: "DrikPanchang" },
    ],
  },
  resolve(year: number, loc: LatLon) {
    const smarta = findSunriseVyapiniDay(loc, `${year}-08-10`, 30, "Krishna", 8, {
      preferEarlier: true,
    });
    if (!smarta) return [];
    const nak = midnightNakshatra(smarta, loc); // 1..27; Rohini = 4
    const notes = [
      "Smarta: Krishna Ashtami sunrise-vyapini in Bhadrapada.",
      nak === 4
        ? "Rohini nakshatra present at midnight — Vaishnava date coincides."
        : `Rohini absent at midnight (nakshatra ${nak}); Vaishnava tradition may observe next day.`,
    ];
    return [
      {
        slug: this.slug,
        name: this.name,
        date: smarta,
        isoDate: isoLocalDate(smarta, loc.tz),
        notes,
      },
    ];
  },
};
