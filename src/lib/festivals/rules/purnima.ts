import type { FestivalRule, ResolvedFestival } from "../types";
import { dayWindow, isoLocalDate, sunriseTithi } from "../helpers";
import type { LatLon } from "@/lib/panchang";

/**
 * Purnima — full moon day (Shukla index 15). Emits all Purnimas in the year.
 * Named Purnimas (Guru Purnima, Sharad Purnima, etc.) can be flagged by
 * matching the lunar month; this base rule returns the raw list.
 */
export const purnima: FestivalRule = {
  slug: "purnima",
  name: "Purnima",
  devanagari: "पूर्णिमा",
  category: "Purnima",
  dependencies: {
    tithi: { paksha: "Shukla", index: 15 },
    anchor: "sunrise-vyapini",
  },
  traditionalRule:
    "Full moon day — Shukla Paksha Purnima with Purnima prevailing at sunrise. Sacred for Satyanarayana Vrat, holy bath (snana) and dana.",
  regionalVariations: [
    {
      region: "All-India",
      note: "Satyanarayana katha performed in the evening in most Hindu homes.",
    },
    { region: "Kartika Purnima", note: "Dev Deepawali at Varanasi; Guru Nanak Jayanti (Sikh)." },
    { region: "Ashadha Purnima", note: "Guru Purnima — honouring Vyasa and one's own guru." },
    {
      region: "Sharad Purnima (Ashwin)",
      note: "Kheer left in moonlight; associated with Lakshmi and Krishna's raas leela.",
    },
  ],
  edgeCases: [
    {
      scenario: "Purnima ends shortly after sunrise",
      handling: "Fasting and puja still done on that day; snana at dawn.",
    },
    {
      scenario: "Purnima spans two sunrises",
      handling: "Vrat on the first sunrise; snana-dana on the second.",
    },
  ],
  i18n: { nameKey: "festivals.purnima.name", descriptionKey: "festivals.purnima.description" },
  validation: {
    tolerance: 0,
    knownDates: [
      { year: 2025, date: "2025-01-13", source: "DrikPanchang", note: "Pausha Purnima" },
      { year: 2025, date: "2025-07-10", source: "DrikPanchang", note: "Guru Purnima" },
    ],
  },
  resolve(year: number, loc: LatLon): ResolvedFestival[] {
    const out: ResolvedFestival[] = [];
    let last = -1;
    for (const day of dayWindow(loc, `${year}-01-01`, 366)) {
      const t = sunriseTithi(day, loc);
      if (!t) continue;
      if (t.index === 15 && last !== 15) {
        out.push({
          slug: this.slug,
          name: "Purnima",
          date: day,
          isoDate: isoLocalDate(day, loc.tz),
          notes: ["Shukla Paksha Purnima — sunrise-vyapini."],
        });
      }
      last = t.index;
    }
    return out;
  },
};
