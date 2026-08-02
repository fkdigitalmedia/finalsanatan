import type { FestivalRule, ResolvedFestival } from "../types";
import { dayWindow, isoLocalDate, sunriseTithi } from "../helpers";
import type { LatLon } from "@/lib/panchang";

/**
 * Ekadashi — 11th tithi of both pakshas (Shukla index 11 and Krishna index 26).
 * Vaishnava fast day. Two per lunar month; ~24 per Gregorian year.
 * This rule emits ALL Ekadashis of the given year, sorted chronologically.
 */
export const ekadashi: FestivalRule = {
  slug: "ekadashi",
  name: "Ekadashi",
  devanagari: "एकादशी",
  category: "Ekadashi",
  deity: "Vishnu",
  dependencies: {
    tithi: { paksha: "Shukla", index: 11 },
    anchor: "sunrise-vyapini",
  },
  traditionalRule:
    "The 11th lunar day of each paksha with Ekadashi prevailing at sunrise. Vaishnavas fast (no grains); Smartas may observe on adjacent Dashami/Dwadashi if Vaidhruti/Vyatipata dosha applies.",
  regionalVariations: [
    {
      region: "Vaishnava (ISKCON, Sri Sampradaya)",
      note: "Fast strictly on sunrise-vyapini Ekadashi; break on Dwadashi within parana window.",
    },
    {
      region: "Smarta",
      note: "May follow 'Smarta Ekadashi' (earlier of the two when Ekadashi spans two sunrises).",
    },
    {
      region: "Puri Jagannath tradition",
      note: "'Bhadrapada Shukla Ekadashi' known as Parsva Ekadashi; day of Deity's side-turning.",
    },
  ],
  edgeCases: [
    {
      scenario: "Ekadashi touches two sunrises",
      handling: "Vaishnavas observe the later day; Smartas the earlier — dual dates possible.",
    },
    {
      scenario: "'Nirjala' Ekadashi (Jyeshtha Shukla)",
      handling: "Waterless fast; hardest of the year — flagged separately in extended engine.",
    },
  ],
  i18n: { nameKey: "festivals.ekadashi.name", descriptionKey: "festivals.ekadashi.description" },
  validation: {
    tolerance: 0,
    knownDates: [
      { year: 2025, date: "2025-01-10", source: "DrikPanchang", note: "Pausha Putrada Ekadashi" },
      { year: 2025, date: "2025-01-25", source: "DrikPanchang", note: "Shattila Ekadashi" },
    ],
  },
  resolve(year: number, loc: LatLon): ResolvedFestival[] {
    const out: ResolvedFestival[] = [];
    let lastIdx = -1;
    for (const day of dayWindow(loc, `${year}-01-01`, 366)) {
      const t = sunriseTithi(day, loc);
      if (!t) continue;
      // Ekadashi is index 11 (Shukla) or 26 (Krishna).
      if ((t.index === 11 || t.index === 26) && t.index !== lastIdx) {
        out.push({
          slug: this.slug,
          name: `${t.paksha} Ekadashi`,
          date: day,
          isoDate: isoLocalDate(day, loc.tz),
          notes: [`${t.paksha} Paksha Ekadashi — sunrise-vyapini.`],
        });
      }
      lastIdx = t.index;
    }
    return out;
  },
};
