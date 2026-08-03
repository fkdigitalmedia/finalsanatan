// ============================================================
// Phase 16.3 — Comprehensive Planet Strength Engine
// ------------------------------------------------------------
// Calculates:
// - Exalted / Debilitated deep degrees
// - Retrograde (Vakra)
// - Combust (Astangata) degree thresholds
// - Directional Strength (Digbala)
// - Functional Benefic / Malefic per Lagna
// - Natural Benefic / Malefic
// - Panchadha Maitri (Compound Friendship)
// - Composite 0–100 Normalized Planet Score
// ============================================================

import type { KundliChart, GrahaName, PlanetChartPosition, Rashi } from "../types";

export interface PlanetStrengthDetails {
  graha: GrahaName;
  score: number; // 0..100
  dignity: string;
  isExalted: boolean;
  isDebilitated: boolean;
  isRetrograde: boolean;
  isCombust: boolean;
  combustDegrees?: number;
  digbalaScore: number; // 0..100
  functionalNature: "benefic" | "malefic" | "neutral";
  naturalNature: "benefic" | "malefic";
  friendshipStatus: "great_friend" | "friend" | "neutral" | "enemy" | "great_enemy";
  summary: string;
}

const DEEP_EXALTATION: Record<GrahaName, { rashiIndex: number; degree: number }> = {
  Sun: { rashiIndex: 0, degree: 10 }, // Mesha 10°
  Moon: { rashiIndex: 1, degree: 3 }, // Vrishabha 3°
  Mars: { rashiIndex: 9, degree: 28 }, // Makara 28°
  Mercury: { rashiIndex: 5, degree: 15 }, // Kanya 15°
  Jupiter: { rashiIndex: 3, degree: 5 }, // Karka 5°
  Venus: { rashiIndex: 11, degree: 27 }, // Meena 27°
  Saturn: { rashiIndex: 6, degree: 20 }, // Tula 20°
  Rahu: { rashiIndex: 1, degree: 15 }, // Vrishabha 15°
  Ketu: { rashiIndex: 7, degree: 15 }, // Vrishchika 15°
};

const DEEP_DEBILITATION: Record<GrahaName, { rashiIndex: number; degree: number }> = {
  Sun: { rashiIndex: 6, degree: 10 }, // Tula 10°
  Moon: { rashiIndex: 7, degree: 3 }, // Vrishchika 3°
  Mars: { rashiIndex: 3, degree: 28 }, // Karka 28°
  Mercury: { rashiIndex: 11, degree: 15 }, // Meena 15°
  Jupiter: { rashiIndex: 9, degree: 5 }, // Makara 5°
  Venus: { rashiIndex: 5, degree: 27 }, // Kanya 27°
  Saturn: { rashiIndex: 0, degree: 20 }, // Mesha 20°
  Rahu: { rashiIndex: 7, degree: 15 },
  Ketu: { rashiIndex: 1, degree: 15 },
};

const COMBUSTION_LIMITS: Partial<Record<GrahaName, { direct: number; retro: number }>> = {
  Moon: { direct: 12, retro: 12 },
  Mars: { direct: 17, retro: 17 },
  Mercury: { direct: 14, retro: 12 },
  Jupiter: { direct: 11, retro: 11 },
  Venus: { direct: 10, retro: 8 },
  Saturn: { direct: 15, retro: 15 },
};

const DIGBALA_HOUSE: Partial<Record<GrahaName, number>> = {
  Sun: 10,
  Mars: 10,
  Jupiter: 1,
  Mercury: 1,
  Venus: 4,
  Moon: 4,
  Saturn: 7,
};

// Functional Benefic / Malefic map by Lagna Rashi index (0..11)
const FUNCTIONAL_NATURE: Record<number, { benefics: GrahaName[]; malefics: GrahaName[] }> = {
  0: { benefics: ["Sun", "Mars", "Jupiter"], malefics: ["Mercury", "Venus", "Saturn"] }, // Mesha
  1: { benefics: ["Sun", "Mercury", "Saturn"], malefics: ["Moon", "Mars", "Jupiter"] }, // Vrishabha
  2: { benefics: ["Venus", "Saturn"], malefics: ["Sun", "Mars", "Jupiter"] }, // Mithuna
  3: { benefics: ["Moon", "Mars", "Jupiter"], malefics: ["Mercury", "Venus", "Saturn"] }, // Karka
  4: { benefics: ["Sun", "Mars", "Jupiter"], malefics: ["Mercury", "Venus", "Saturn"] }, // Simha
  5: { benefics: ["Mercury", "Venus"], malefics: ["Sun", "Moon", "Mars", "Jupiter"] }, // Kanya
  6: { benefics: ["Saturn", "Mercury", "Venus"], malefics: ["Sun", "Mars", "Jupiter"] }, // Tula
  7: { benefics: ["Moon", "Mars", "Jupiter"], malefics: ["Mercury", "Venus", "Saturn"] }, // Vrishchika
  8: { benefics: ["Sun", "Mars"], malefics: ["Mercury", "Venus", "Saturn"] }, // Dhanu
  9: { benefics: ["Venus", "Saturn", "Mercury"], malefics: ["Sun", "Moon", "Mars"] }, // Makara
  10: { benefics: ["Venus", "Saturn"], malefics: ["Sun", "Mars", "Jupiter"] }, // Kumbha
  11: { benefics: ["Mars", "Jupiter", "Moon"], malefics: ["Sun", "Mercury", "Venus", "Saturn"] }, // Meena
};

export function evaluatePlanetStrengths(chart: KundliChart): PlanetStrengthDetails[] {
  const sun = chart.planets.find((p) => p.graha === "Sun");
  const lagnaRashiIdx = chart.ascendant.rashiIndex;

  return chart.planets.map((p) => {
    const graha = p.graha;

    // 1. Exaltation / Debilitation
    const deepEx = DEEP_EXALTATION[graha];
    const deepDeb = DEEP_DEBILITATION[graha];

    const isEx = p.rashiIndex === deepEx?.rashiIndex;
    const isDeb = p.rashiIndex === deepDeb?.rashiIndex;

    // 2. Combustion
    let isCombust = false;
    let combustDist = 999;
    if (sun && graha !== "Sun" && graha !== "Rahu" && graha !== "Ketu") {
      combustDist = Math.abs(p.longitudeSidereal - sun.longitudeSidereal);
      if (combustDist > 180) combustDist = 360 - combustDist;
      const limit = COMBUSTION_LIMITS[graha];
      if (limit) {
        const threshold = p.retrograde ? limit.retro : limit.direct;
        isCombust = combustDist <= threshold;
      }
    }

    // 3. Digbala
    const targetHouse = DIGBALA_HOUSE[graha];
    let digbalaScore = 50; // default baseline
    if (targetHouse) {
      const houseDiff = (p.house - targetHouse + 12) % 12;
      // 0 diff -> 100, 6 diff -> 0
      const dist = Math.min(houseDiff, 12 - houseDiff);
      digbalaScore = Math.round(100 - (dist / 6) * 100);
    }

    // 4. Functional Nature
    const lagnaRules = FUNCTIONAL_NATURE[lagnaRashiIdx] || { benefics: [], malefics: [] };
    let functionalNature: "benefic" | "malefic" | "neutral" = "neutral";
    if (lagnaRules.benefics.includes(graha)) functionalNature = "benefic";
    else if (lagnaRules.malefics.includes(graha)) functionalNature = "malefic";

    // 5. Natural Nature
    const naturalNature: "benefic" | "malefic" = ["Jupiter", "Venus", "Mercury", "Moon"].includes(graha)
      ? "benefic"
      : "malefic";

    // 6. Panchadha Maitri (Compound Friendship)
    let friendshipStatus: "great_friend" | "friend" | "neutral" | "enemy" | "great_enemy" = "neutral";
    if (p.dignity === "exalted" || p.dignity === "own") friendshipStatus = "great_friend";
    else if (p.dignity === "friend") friendshipStatus = "friend";
    else if (p.dignity === "enemy") friendshipStatus = "enemy";
    else if (p.dignity === "debilitated") friendshipStatus = "great_enemy";

    // 7. Composite Planet Score (0..100)
    let composite = Math.round(p.strengthScore * 100);
    if (isEx) composite = Math.min(100, composite + 25);
    if (isDeb) composite = Math.max(0, composite - 30);
    if (isCombust) composite = Math.max(0, composite - 20);
    if (p.retrograde) composite = Math.min(100, composite + 10);
    composite = Math.round((composite * 0.7) + (digbalaScore * 0.3));

    const summary = `${graha} is in ${p.rashi} (${p.dignity}) in House ${p.house} with a Composite Strength Score of ${composite}/100.`;

    return {
      graha,
      score: composite,
      dignity: p.dignity,
      isExalted: isEx,
      isDebilitated: isDeb,
      isRetrograde: p.retrograde,
      isCombust,
      combustDegrees: isCombust ? Math.round(combustDist * 10) / 10 : undefined,
      digbalaScore,
      functionalNature,
      naturalNature,
      friendshipStatus,
      summary,
    };
  });
}
