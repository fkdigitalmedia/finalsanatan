// Rule — Gaj Kesari Yoga
import { KENDRA_HOUSES } from "../constants";
import { clamp } from "../helpers";
import type { YogaDoshaRule } from "../types";

export const gajKesariRule: YogaDoshaRule = {
  id: "gaj-kesari-yoga",
  name: "Gaj Kesari Yoga",
  sanskrit: "गजकेसरी योग",
  kind: "yoga",
  category: "Chandra Yoga",
  description:
    "Jupiter in a kendra (1/4/7/10) from the Moon — grants reputation, discernment and steady rise through knowledge.",
  evaluate(ctx) {
    const jup = ctx.planet("Jupiter");
    const moon = ctx.planet("Moon");
    if (!jup || !moon) {
      return {
        detected: false,
        confidence: 0,
        ruleApplied: "Jupiter or Moon missing from chart data",
        planetCombination: [],
        affectedHouses: [],
      };
    }
    const fromMoon = ctx.houseFrom(moon.house, jup.house);
    const detected = (KENDRA_HOUSES as readonly number[]).includes(fromMoon);
    let confidence = detected ? 70 : 0;
    if (detected) {
      if (jup.dignity === "exalted" || jup.dignity === "own" || jup.dignity === "moolatrikona")
        confidence += 15;
      if (jup.dignity === "debilitated") confidence -= 25;
      if (ctx.isCombust("Jupiter")) confidence -= 15;
      if ((KENDRA_HOUSES as readonly number[]).includes(jup.house)) confidence += 8;
    }
    const cancellations: string[] = [];
    if (detected && jup.dignity === "debilitated") {
      cancellations.push("Jupiter is debilitated — the yoga delivers only partially");
    }
    if (detected && ctx.isCombust("Jupiter")) {
      cancellations.push("Jupiter is combust — results are muted");
    }

    return {
      detected,
      confidence: clamp(Math.round(confidence), 0, 100),
      ruleApplied: detected
        ? `Jupiter is in the ${fromMoon}th house from the Moon (kendra)`
        : `Jupiter is in the ${fromMoon}th from the Moon — not a kendra`,
      planetCombination: detected ? ["Jupiter", "Moon"] : [],
      affectedHouses: detected ? [moon.house, jup.house].sort((a, b) => a - b) : [],
      cancellations,
      details: { jupiterHouseFromMoon: fromMoon, jupiterDignity: jup.dignity },
    };
  },
};
