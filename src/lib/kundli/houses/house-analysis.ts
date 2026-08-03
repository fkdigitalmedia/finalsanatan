// ============================================================
// Phase 16.4 — House Analysis Engine (All 12 Bhavas)
// ------------------------------------------------------------
// Evaluates every house in D1 chart:
// - Significations (Karakatva)
// - House Lord & Dignity
// - Occupants & Aspecting Planets
// - Net Strength Score (0-100)
// - Positive Results & Challenges
// - Impact on Career, Marriage, Finance, Health
// - Custom Remedies per House
// ============================================================

import type { KundliChart, GrahaName, Rashi, PlanetDignity } from "../types";

export interface HouseAnalysisResult {
  house: number; // 1..12
  name: string;
  sanskritName: string;
  rashi: Rashi;
  lord: GrahaName;
  lordDignity: PlanetDignity;
  lordHouse: number;
  occupants: GrahaName[];
  aspectingPlanets: GrahaName[];
  strengthScore: number; // 0..100
  purpose: string;
  positiveResults: string[];
  challenges: string[];
  careerImpact: string;
  marriageImpact: string;
  financeImpact: string;
  healthImpact: string;
  remedies: string[];
}

const HOUSE_NAMES: Record<number, { english: string; sanskrit: string; purpose: string }> = {
  1: {
    english: "1st House (Ascendant / Lagna)",
    sanskrit: "तनु भाव (Tanu Bhava)",
    purpose: "Self, physical body, vitality, character, life journey, overall constitution.",
  },
  2: {
    english: "2nd House (Wealth & Family)",
    sanskrit: "धन भाव (Dhana Bhava)",
    purpose: "Accumulated wealth, family lineage, speech, early childhood, food habits.",
  },
  3: {
    english: "3rd House (Courage & Siblings)",
    sanskrit: "सहज भाव (Sahaja Bhava)",
    purpose: "Courage, initiative, younger siblings, communication, short travels, skills.",
  },
  4: {
    english: "4th House (Home & Happiness)",
    sanskrit: "सुख भाव (Sukha Bhava)",
    purpose: "Mother, home environment, emotional peace, real estate, vehicles, happiness.",
  },
  5: {
    english: "5th House (Intellect & Children)",
    sanskrit: "पुत्र भाव (Putra Bhava)",
    purpose: "Children, creative intelligence, ancient wisdom, romantic life, past life merit.",
  },
  6: {
    english: "6th House (Enemies & Health)",
    sanskrit: "अरि भाव (Ari Bhava)",
    purpose: "Health challenges, daily work, litigation, debt, service, overcoming obstacles.",
  },
  7: {
    english: "7th House (Marriage & Partnership)",
    sanskrit: "युवती भाव (Yuvati Bhava)",
    purpose: "Spouse, marriage, public relationships, commercial business partnerships, foreign trade.",
  },
  8: {
    english: "8th House (Transformation & Longevity)",
    sanskrit: "रंध्र भाव (Randhra Bhava)",
    purpose: "Longevity, sudden transformations, hidden research, occult, joint finances, inheritance.",
  },
  9: {
    english: "9th House (Dharma & Fortune)",
    sanskrit: "धर्म भाव (Dharma Bhava)",
    purpose: "Father, guru, higher philosophy, spiritual devotion, long journeys, luck.",
  },
  10: {
    english: "10th House (Career & Status)",
    sanskrit: "कर्म भाव (Karma Bhava)",
    purpose: "Career, profession, reputation, authority, government honors, public duty.",
  },
  11: {
    english: "11th House (Gains & Fulfillments)",
    sanskrit: "लाभ भाव (Labha Bhava)",
    purpose: "Financial gains, elder siblings, social networks, wish fulfillment, profits.",
  },
  12: {
    english: "12th House (Losses & Liberation)",
    sanskrit: "व्यय भाव (Vyaya Bhava)",
    purpose: "Subconscious, expenses, foreign settlement, isolation, hospitals, spiritual liberation (Moksha).",
  },
};

const RASHI_LORDS: GrahaName[] = [
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
  "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"
];

function getLordForRashiIndex(rashiIdx: number): GrahaName {
  return RASHI_LORDS[rashiIdx % 12];
}

export function evaluateHouseAnalyses(chart: KundliChart): HouseAnalysisResult[] {
  return Array.from({ length: 12 }, (_, i) => {
    const houseNum = i + 1;
    const info = HOUSE_NAMES[houseNum];
    const cusp = chart.houses.find((h) => h.house === houseNum);
    const rashiIdx = cusp ? cusp.rashiIndex : ((chart.ascendant.rashiIndex + houseNum - 1) % 12);
    const rashi = cusp ? cusp.rashi : chart.ascendant.rashi;
    const lord = getLordForRashiIndex(rashiIdx);
    const pLord = chart.planets.find((p) => p.graha === lord);

    const occupants = chart.planets.filter((p) => p.house === houseNum).map((p) => p.graha);

    // Simplistic aspect rule: 7th house mutual aspect + Mars/Jupiter/Saturn special aspects
    const aspectingPlanets: GrahaName[] = [];
    for (const p of chart.planets) {
      if (p.house === houseNum) continue;
      const diff = ((houseNum - p.house + 12) % 12);
      if (diff === 6) aspectingPlanets.push(p.graha); // 7th aspect
      else if (p.graha === "Mars" && (diff === 3 || diff === 7)) aspectingPlanets.push("Mars"); // 4th, 8th
      else if (p.graha === "Jupiter" && (diff === 4 || diff === 8)) aspectingPlanets.push("Jupiter"); // 5th, 9th
      else if (p.graha === "Saturn" && (diff === 2 || diff === 9)) aspectingPlanets.push("Saturn"); // 3rd, 10th
    }

    // Compute house strength score (0..100)
    let score = 50;
    if (pLord) {
      if (pLord.dignity === "exalted" || pLord.dignity === "own") score += 20;
      else if (pLord.dignity === "debilitated") score -= 20;
      if ([1, 4, 7, 10, 5, 9].includes(pLord.house)) score += 10;
      if ([6, 8, 12].includes(pLord.house)) score -= 10;
    }
    const beneficOcc = occupants.filter((g) => ["Jupiter", "Venus", "Mercury", "Moon"].includes(g));
    const maleficOcc = occupants.filter((g) => ["Sun", "Mars", "Saturn", "Rahu", "Ketu"].includes(g));
    score += beneficOcc.length * 10 - maleficOcc.length * 8;
    score = Math.min(100, Math.max(10, score));

    const positiveResults: string[] = [];
    const challenges: string[] = [];

    if (score >= 70) {
      positiveResults.push(`Strong placement of House ${houseNum} lord (${lord}) in House ${pLord?.house}.`);
      if (beneficOcc.length) positiveResults.push(`Benefic presence of ${beneficOcc.join(", ")} enhances positive significations.`);
    } else {
      challenges.push(`House ${houseNum} lord (${lord}) requires activation; placed in House ${pLord?.house}.`);
      if (maleficOcc.length) challenges.push(`Presence of ${maleficOcc.join(", ")} introduces testing circumstances.`);
    }

    return {
      house: houseNum,
      name: info.english,
      sanskritName: info.sanskrit,
      rashi,
      lord,
      lordDignity: pLord?.dignity || "neutral",
      lordHouse: pLord?.house || houseNum,
      occupants,
      aspectingPlanets: [...new Set(aspectingPlanets)],
      strengthScore: score,
      purpose: info.purpose,
      positiveResults,
      challenges,
      careerImpact: `House ${houseNum} strength (${score}/100) shapes professional decisions relating to ${info.purpose.split(",")[0]}.`,
      marriageImpact: `Influence of ${lord} in House ${pLord?.house} influences partnership dynamics.`,
      financeImpact: `Net house strength score ${score}/100 indicates financial capacity for this life domain.`,
      healthImpact: `Physical and mental constitution is supported when House ${houseNum} is active.`,
      remedies: [
        `Chant mantra for ${lord} (${lord} Beej Mantra)`,
        `Support charitable activities associated with House ${houseNum} significations`,
      ],
    };
  });
}
