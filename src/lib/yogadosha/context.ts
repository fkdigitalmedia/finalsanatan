// ============================================================
// Dosha & Yoga Detection Engine — Chart Context
// ------------------------------------------------------------
// Derives a read-only, rule-friendly view of the D1 chart.
// Every rule receives this object and nothing else, so rules
// never touch astronomy or the Kundli engine directly.
// ============================================================

import type { GrahaName, KundliChart, PlanetChartPosition } from "@/lib/kundli/types";
import { COMBUSTION_ARC_DEG, NATURAL_BENEFICS, SIGN_LORDS, SPECIAL_ASPECTS } from "./constants";
import { arcBetween, houseFrom, norm12 } from "./helpers";
import type { ChartContext } from "./types";

export function buildChartContext(chart: KundliChart): ChartContext {
  const byGraha = new Map<GrahaName, PlanetChartPosition>();
  for (const p of chart.planets) byGraha.set(p.graha, p);

  const lagnaRashiIndex = chart.ascendant.rashiIndex;
  const moon = byGraha.get("Moon");
  const moonRashiIndex = moon ? moon.rashiIndex : lagnaRashiIndex;

  const planet = (g: GrahaName) => byGraha.get(g);
  const houseOf = (g: GrahaName) => planet(g)?.house ?? null;
  const rashiOfHouse = (house: number) => norm12(lagnaRashiIndex + (house - 1));
  const lordOfRashi = (rashiIndex: number) => SIGN_LORDS[norm12(rashiIndex)];
  const lordOfHouse = (house: number) => lordOfRashi(rashiOfHouse(house));

  const aspectsHouse = (g: GrahaName, house: number): boolean => {
    const from = houseOf(g);
    if (!from) return false;
    const distance = houseFrom(from, house);
    if (distance === 7) return true;
    return (SPECIAL_ASPECTS[g] ?? []).includes(distance);
  };

  const separation = (a: GrahaName, b: GrahaName): number | null => {
    const pa = planet(a);
    const pb = planet(b);
    if (!pa || !pb) return null;
    return arcBetween(pa.longitudeSidereal, pb.longitudeSidereal);
  };

  const areConnected = (a: GrahaName, b: GrahaName): boolean => {
    const ha = houseOf(a);
    const hb = houseOf(b);
    if (!ha || !hb) return false;
    if (ha === hb) return true;
    return aspectsHouse(a, hb) || aspectsHouse(b, ha);
  };

  const isCombust = (g: GrahaName): boolean => {
    if (g === "Sun" || g === "Rahu" || g === "Ketu") return false;
    const arc = COMBUSTION_ARC_DEG[g];
    const sep = separation("Sun", g);
    return arc !== undefined && sep !== null && sep <= arc;
  };

  return {
    chart,
    lagnaRashiIndex,
    moonRashiIndex,
    planets: chart.planets,
    planet,
    houseOf,
    planetsInHouse: (house: number) => chart.planets.filter((p) => p.house === house),
    rashiOfHouse,
    lordOfHouse,
    lordOfRashi,
    houseFrom,
    houseFromMoon: (g: GrahaName) => {
      const h = houseOf(g);
      const mh = moon?.house ?? null;
      return h && mh ? houseFrom(mh, h) : null;
    },
    dignity: (g: GrahaName) => planet(g)?.dignity ?? null,
    isBenefic: (g: GrahaName) => NATURAL_BENEFICS.includes(g),
    aspectsHouse,
    areConnected,
    separation,
    isCombust,
  };
}
