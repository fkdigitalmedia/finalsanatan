import type { FestivalRule } from "../types";
import { isoLocalDate, sunIngressDate } from "../helpers";
import type { LatLon } from "@/lib/panchang";
import { startOfLocalDay } from "@/lib/panchang";

/**
 * Makar Sankranti — Sun's ingress into sidereal Makara (Capricorn, rashi=9).
 * Solar (not lunar) festival — precesses ~1 day per 72 years relative to
 * Gregorian. In current epoch this is Jan 14 (or Jan 15 leap-adjacent).
 */
export const makarSankranti: FestivalRule = {
  slug: "makar-sankranti",
  name: "Makar Sankranti",
  devanagari: "मकर संक्रांति",
  category: "Sankranti",
  deity: "Surya",
  dependencies: {
    solarRashi: 9, // Makara
    anchor: "sankranti",
  },
  traditionalRule:
    "The Gregorian day on which the Sun (sidereal, Lahiri) enters Makara rashi. Punya Kaal typically the 6-hour window after ingress; if ingress is after sunset, festival observed next day.",
  regionalVariations: [
    { region: "Punjab (Lohri)", note: "Lohri celebrated the previous evening with bonfire." },
    { region: "Gujarat (Uttarayan)", note: "Kite-flying festival, two-day observance." },
    {
      region: "Tamil Nadu (Pongal)",
      note: "Four-day harvest festival starting on Bhogi; Thai Pongal on Sankranti day.",
    },
    { region: "Assam (Bhogali Bihu)", note: "Feasting, mejis (bonfires), community meals." },
    {
      region: "Karnataka",
      note: "Ellu-Bella exchange; sesame-jaggery mixture symbolising sweet speech.",
    },
  ],
  edgeCases: [
    {
      scenario: "Sankranti after sunset",
      handling: "Some panchangas defer punya kaal to next sunrise.",
    },
    {
      scenario: "Precession drift",
      handling: "Date will shift to Jan 15 for most locations by ~2050 (Lahiri ayanamsa).",
    },
  ],
  i18n: {
    nameKey: "festivals.makar_sankranti.name",
    descriptionKey: "festivals.makar_sankranti.description",
  },
  validation: {
    tolerance: 1,
    knownDates: [
      {
        year: 2024,
        date: "2024-01-15",
        source: "DrikPanchang",
        note: "Ingress late on Jan 14 IST — punya kaal Jan 15.",
      },
      { year: 2025, date: "2025-01-14", source: "DrikPanchang" },
      { year: 2026, date: "2026-01-14", source: "DrikPanchang" },
      { year: 2027, date: "2027-01-14", source: "DrikPanchang" },
    ],
  },
  resolve(year: number, loc: LatLon) {
    const ingress = sunIngressDate(year, 9);
    // Local calendar day of ingress in `loc.tz`.
    const localDayStart = startOfLocalDay(ingress, loc.tz);
    return [
      {
        slug: this.slug,
        name: this.name,
        date: localDayStart,
        isoDate: isoLocalDate(ingress, loc.tz),
        notes: [`Ingress UT: ${ingress.toISOString()}`],
      },
    ];
  },
};
