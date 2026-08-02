import type { FestivalRule, ResolvedFestival } from "../types";
import { dayWindow, isoLocalDate, sunriseTithi } from "../helpers";
import type { LatLon } from "@/lib/panchang";

/**
 * Amavasya — new moon day (Krishna index 30). Emits all Amavasyas of the year.
 * Sacred for pitru tarpan; specific Amavasyas (Mahalaya, Diwali) handled by
 * their own rule modules.
 */
export const amavasya: FestivalRule = {
  slug: "amavasya",
  name: "Amavasya",
  devanagari: "अमावस्या",
  category: "Amavasya",
  dependencies: {
    tithi: { paksha: "Krishna", index: 15 },
    anchor: "sunrise-vyapini",
  },
  traditionalRule:
    "New moon day. Krishna Amavasya prevailing at sunrise (or at aparahna, depending on ritual). Sacred for shraddha, tarpan and pitru puja.",
  regionalVariations: [
    {
      region: "Bhaumavati Amavasya (Tuesday)",
      note: "Special worship of Hanuman and Bhairava; considered highly potent.",
    },
    {
      region: "Shani Amavasya (Saturday)",
      note: "Shani puja, oil-lamp offerings to Shanidev, remedial rites.",
    },
    {
      region: "Mahalaya Amavasya (Ashwin)",
      note: "End of Pitru Paksha; grand tarpan for all ancestors.",
    },
    {
      region: "Somvati Amavasya (Monday)",
      note: "Married women perform pipal-tree parikrama for family welfare.",
    },
  ],
  edgeCases: [
    {
      scenario: "Amavasya spans two sunrises",
      handling: "Shraddha performed on the day when Amavasya prevails at aparahna (afternoon).",
    },
    {
      scenario: "Diwali night",
      handling: "Handled by the diwali rule (pradosh-vyapini instead of sunrise).",
    },
  ],
  i18n: { nameKey: "festivals.amavasya.name", descriptionKey: "festivals.amavasya.description" },
  validation: {
    tolerance: 0,
    knownDates: [
      { year: 2025, date: "2025-01-29", source: "DrikPanchang", note: "Mauni Amavasya" },
      { year: 2025, date: "2025-09-21", source: "DrikPanchang", note: "Mahalaya Amavasya" },
    ],
  },
  resolve(year: number, loc: LatLon): ResolvedFestival[] {
    const out: ResolvedFestival[] = [];
    let last = -1;
    for (const day of dayWindow(loc, `${year}-01-01`, 366)) {
      const t = sunriseTithi(day, loc);
      if (!t) continue;
      if (t.index === 30 && last !== 30) {
        out.push({
          slug: this.slug,
          name: "Amavasya",
          date: day,
          isoDate: isoLocalDate(day, loc.tz),
          notes: ["Krishna Paksha Amavasya — sunrise-vyapini."],
        });
      }
      last = t.index;
    }
    return out;
  },
};
