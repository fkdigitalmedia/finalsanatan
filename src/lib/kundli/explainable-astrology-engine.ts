// ============================================================
// Phase 20 — Explainable AI Astrology Engine
// ------------------------------------------------------------
// Provides transparent evidence audit models and reasoning breakdowns:
// - User-Facing Evidence Summary (Planets, Houses, Yogas, Dasha, Dosha, Confidence)
// - No internal rule IDs, debug labels, or raw developer strings
// - Action Cards (Recommended Actions, Avoid, Focus On, Opportunities, Risks)
//
// All values are dynamically derived from the real KundliResult — 100% clean output.
// ============================================================

import type { KundliResult, GrahaName } from "./types";
import { evaluatePlanetStrengths } from "./strength/planet-strength";
import { evaluateHouseAnalyses } from "./houses/house-analysis";
import { detectYogas } from "./yogas";

// ── Ordinal suffix helper ─────────────────────────────────────
function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// ── House Sanskrit names ──────────────────────────────────────
const HOUSE_BHAVA: Record<number, string> = {
  1: "Tanu Bhava",
  2: "Dhana Bhava",
  3: "Sahaja Bhava",
  4: "Sukha Bhava",
  5: "Putra Bhava",
  6: "Ari Bhava",
  7: "Yuvati Bhava",
  8: "Randhra Bhava",
  9: "Dharma Bhava",
  10: "Karma Bhava",
  11: "Labha Bhava",
  12: "Vyaya Bhava",
};

function houseLabel(num: number): string {
  return `${ordinal(num)} House (${HOUSE_BHAVA[num] ?? ""})`;
}

// ── Clean User-Facing Evidence Structures ────────────────────

export interface PlanetEvidenceDetail {
  name: GrahaName;
  role: string;         // e.g. "10th House Lord" | "Ascendant Lord" | "Kalatra Karaka"
  position: string;     // e.g. "Kanya (3rd House)"
  status: string;       // e.g. "Exalted" | "Own Sign" | "Favorable"
}

export interface HouseEvidenceDetail {
  houseNumber: number;
  name: string;         // e.g. "10th House (Karma Bhava)"
  lord: GrahaName;      // e.g. "Mercury"
  status: string;       // e.g. "Strong Alignment" | "Favorable"
}

export interface StructuredEvidenceSummary {
  planets: PlanetEvidenceDetail[];
  houses: HouseEvidenceDetail[];
  yogas: string[];      // Only present yogas e.g. ["Raj Yoga", "Budhaditya Yoga"]
  dasha: {
    mahadasha: string;
    antardasha?: string;
    pratyantar?: string;
  };
  doshas: string[];     // Only active doshas e.g. ["Mangal Dosha"]
  confidence: {
    score: number;
    rating: "Very High" | "High" | "Moderate" | "Low";
    summary: string;
  };
}

export interface PredictionEvidenceTrace {
  domain: string;
  predictionText: string;
  confidenceScore: number;
  confidenceRating: "Very High" | "High" | "Moderate" | "Low";
  confidenceReason: string;
  supportingPlanets: GrahaName[];
  supportingHouses: number[];
  supportingYogas: string[];
  supportingDoshas: string[];
  activeDasha: string;
  activeAntardasha?: string;
  activePratyantar?: string;
  /** Fully-structured user-facing evidence summary — NO internal rule IDs or debug labels */
  evidenceSummary: StructuredEvidenceSummary;
}

export interface ActionCardData {
  recommendedActions: string[];
  thingsToAvoid: string[];
  focusOn: string[];
  opportunityWindow: string;
  riskWindow: string;
}

// ── Lord of a house sign index ────────────────────────────────
const SIGN_LORDS: Record<number, GrahaName> = {
  0: "Mars", 1: "Venus", 2: "Mercury", 3: "Moon", 4: "Sun", 5: "Mercury",
  6: "Venus", 7: "Mars", 8: "Jupiter", 9: "Saturn", 10: "Saturn", 11: "Jupiter",
};

function houseLord(ascRashiIndex: number, houseNum: number): GrahaName {
  return SIGN_LORDS[(ascRashiIndex + houseNum - 1) % 12];
}

function formatDignity(dignity?: string): string {
  if (!dignity) return "Neutral";
  switch (dignity) {
    case "exalted": return "Exalted";
    case "moolatrikona": return "Moolatrikona";
    case "own": return "Own Sign";
    case "friend": return "Friendly Sign";
    case "neutral": return "Neutral";
    case "enemy": return "In Enemy Sign";
    case "debilitated": return "Debilitated";
    default: return dignity;
  }
}

// ── Main evidence generation ─────────────────────────────────
export function generateEvidenceTraces(result: KundliResult): PredictionEvidenceTrace[] {
  const chart = result.d1;
  const planetStrengths = evaluatePlanetStrengths(chart);
  const houseAnalyses = evaluateHouseAnalyses(chart);
  const detectedYogas = detectYogas(chart);
  const presentYogas = detectedYogas.filter((y) => y.isPresent);

  const ascIdx = chart.ascendant.rashiIndex;

  // Active dasha lords from real vimshottari calculation
  const maha  = result.vimshottari?.current?.mahadasha?.lord;
  const antar = result.vimshottari?.current?.antardasha?.lord;
  const prat  = result.vimshottari?.current?.pratyantar?.lord;

  const mahaLabel  = maha  ? `${maha} Mahadasha`  : "Active Dasha";
  const antarLabel = antar ? `${antar} Antardasha` : undefined;
  const pratLabel  = prat  ? `${prat} Pratyantar`  : undefined;

  const dashaObj = {
    mahadasha: mahaLabel,
    antardasha: antarLabel,
    pratyantar: pratLabel,
  };

  // Helper: get house analysis by number
  const houseInfo = (n: number) => houseAnalyses.find((h) => h.house === n);
  // Helper: get planet position
  const planetPos = (g: GrahaName) => chart.planets.find((p) => p.graha === g);
  // Helper: strength score for a house
  const houseScore = (n: number) => houseInfo(n)?.strengthScore ?? 50;

  // Helper: find yogas relevant to a domain keyword
  const domainYogas = (keywords: string[]): string[] =>
    presentYogas
      .filter((y) => keywords.some((kw) => y.name.toLowerCase().includes(kw.toLowerCase()) || y.category.toLowerCase().includes(kw.toLowerCase())))
      .map((y) => y.name);

  // Helper: build structured PlanetEvidenceDetail
  function buildPlanetDetail(graha: GrahaName, role: string): PlanetEvidenceDetail {
    const pos = planetPos(graha);
    const str = planetStrengths.find((p) => p.graha === graha);
    return {
      name: graha,
      role,
      position: pos ? `${pos.rashi} (${ordinal(pos.house)} House)` : "In Chart",
      status: formatDignity(str?.dignity),
    };
  }

  // Helper: build structured HouseEvidenceDetail
  function buildHouseDetail(num: number): HouseEvidenceDetail {
    const info = houseInfo(num);
    const score = info?.strengthScore ?? 50;
    const statusLabel = score >= 75 ? "Strong Alignment" : score >= 55 ? "Favorable Alignment" : "Moderate Alignment";
    return {
      houseNumber: num,
      name: houseLabel(num),
      lord: info?.lord ?? houseLord(ascIdx, num),
      status: statusLabel,
    };
  }

  // ── 1. Career & Executive Status ──────────────────────────
  const careerLord = houseLord(ascIdx, 10);
  const careerLordPos = planetPos(careerLord);
  const career1stLord = houseLord(ascIdx, 1);

  const careerPlanets: GrahaName[] = [careerLord, career1stLord, "Sun"].filter(
    (g, i, a) => a.indexOf(g) === i
  ) as GrahaName[];

  const careerYogas = [
    ...domainYogas(["Raj Yoga", "Budhaditya"]),
    ...presentYogas.filter((y) => y.category === "Pancha Mahapurusha").map((y) => y.name),
  ].filter((y, i, a) => a.indexOf(y) === i);

  const careerScore = Math.round(houseScore(10) * 0.6 + houseScore(1) * 0.3 + houseScore(6) * 0.1);
  const careerRating: PredictionEvidenceTrace["confidenceRating"] =
    careerScore >= 80 ? "Very High" : careerScore >= 65 ? "High" : careerScore >= 50 ? "Moderate" : "Low";

  const careerSummary: StructuredEvidenceSummary = {
    planets: [
      buildPlanetDetail(careerLord, `${ordinal(10)} House Lord`),
      buildPlanetDetail("Sun", "Executive Authority Karaka"),
      ...(career1stLord !== careerLord ? [buildPlanetDetail(career1stLord, "Ascendant Lord")] : []),
    ],
    houses: [buildHouseDetail(10), buildHouseDetail(1)],
    yogas: careerYogas,
    dasha: dashaObj,
    doshas: [],
    confidence: {
      score: careerScore,
      rating: careerRating,
      summary: `10th House alignment score is ${careerScore}/100 with ${careerLord} as 10th lord.`,
    },
  };

  // ── 2. Marriage & Relationships ───────────────────────────
  const marriageLord = houseLord(ascIdx, 7);
  const marriageLordPos = planetPos(marriageLord);
  const marriageYogas = domainYogas(["Gaja Kesari", "Chandra", "Malavya"]);

  const marriageScore = Math.round(houseScore(7) * 0.6 + houseScore(4) * 0.25 + houseScore(11) * 0.15);
  const marriageRating: PredictionEvidenceTrace["confidenceRating"] =
    marriageScore >= 80 ? "Very High" : marriageScore >= 65 ? "High" : marriageScore >= 50 ? "Moderate" : "Low";

  const marriageSummary: StructuredEvidenceSummary = {
    planets: [
      buildPlanetDetail(marriageLord, `${ordinal(7)} House Lord`),
      buildPlanetDetail("Venus", "Kalatra Karaka (Relationships)"),
    ],
    houses: [buildHouseDetail(7), buildHouseDetail(4)],
    yogas: marriageYogas,
    dasha: dashaObj,
    doshas: [],
    confidence: {
      score: marriageScore,
      rating: marriageRating,
      summary: `7th House alignment score is ${marriageScore}/100 with ${marriageLord} as 7th lord.`,
    },
  };

  // ── 3. Finance & Wealth Accumulation ──────────────────────
  const wealthLord2 = houseLord(ascIdx, 2);
  const wealthLord11 = houseLord(ascIdx, 11);
  const wealthYogas = domainYogas(["Dhana Yoga", "Laxmi", "Chandra-Mangal", "Malavya"]);

  const wealthScore = Math.round(houseScore(2) * 0.4 + houseScore(11) * 0.4 + houseScore(9) * 0.2);
  const wealthRating: PredictionEvidenceTrace["confidenceRating"] =
    wealthScore >= 80 ? "Very High" : wealthScore >= 65 ? "High" : wealthScore >= 50 ? "Moderate" : "Low";

  const wealthSummary: StructuredEvidenceSummary = {
    planets: [
      buildPlanetDetail(wealthLord2, `${ordinal(2)} House Lord (Dhana)`),
      buildPlanetDetail(wealthLord11, `${ordinal(11)} House Lord (Labha)`),
      buildPlanetDetail("Jupiter", "Dhana Karaka (Wealth)"),
    ],
    houses: [buildHouseDetail(2), buildHouseDetail(11)],
    yogas: wealthYogas,
    dasha: dashaObj,
    doshas: [],
    confidence: {
      score: wealthScore,
      rating: wealthRating,
      summary: `Combined wealth houses alignment score is ${wealthScore}/100.`,
    },
  };

  // ── 4. Health & Vitality ──────────────────────────────────
  const lagnaLord = houseLord(ascIdx, 1);
  const healthDoshas = (result.doshas ?? [])
    .filter((d) => d.isPresent && !d.isCancelled)
    .map((d) => d.name)
    .slice(0, 3);

  const healthScore = Math.round(houseScore(1) * 0.5 + houseScore(6) * 0.25 + houseScore(8) * 0.25);
  const healthRating: PredictionEvidenceTrace["confidenceRating"] =
    healthScore >= 80 ? "Very High" : healthScore >= 65 ? "High" : healthScore >= 50 ? "Moderate" : "Low";

  const healthSummary: StructuredEvidenceSummary = {
    planets: [
      buildPlanetDetail(lagnaLord, "Ascendant Lord (Vitality)"),
      buildPlanetDetail("Sun", "Atma Karaka (Immunity)"),
    ],
    houses: [buildHouseDetail(1), buildHouseDetail(6)],
    yogas: [],
    dasha: dashaObj,
    doshas: healthDoshas,
    confidence: {
      score: healthScore,
      rating: healthRating,
      summary: `Physical vitality & lagna alignment score is ${healthScore}/100.`,
    },
  };

  // ── 5. Spirituality & Dharma ─────────────────────────────
  const dharmaLord = houseLord(ascIdx, 9);
  const spiritualYogas = domainYogas(["Hamsa", "Raj Yoga"]);

  const dharmaScore = Math.round(houseScore(9) * 0.5 + houseScore(12) * 0.3 + houseScore(5) * 0.2);
  const dharmaRating: PredictionEvidenceTrace["confidenceRating"] =
    dharmaScore >= 80 ? "Very High" : dharmaScore >= 65 ? "High" : dharmaScore >= 50 ? "Moderate" : "Low";

  const dharmaSummary: StructuredEvidenceSummary = {
    planets: [
      buildPlanetDetail(dharmaLord, `${ordinal(9)} House Lord (Dharma)`),
      buildPlanetDetail("Jupiter", "Guru & Wisdom Karaka"),
    ],
    houses: [buildHouseDetail(9), buildHouseDetail(12)],
    yogas: spiritualYogas,
    dasha: dashaObj,
    doshas: [],
    confidence: {
      score: dharmaScore,
      rating: dharmaRating,
      summary: `Dharmic alignment and 9th House score is ${dharmaScore}/100.`,
    },
  };

  // ── Build clean evidence trace array ─────────────────────
  return [
    {
      domain: "Career & Executive Status",
      predictionText: `${careerLord} as 10th lord (${careerLordPos ? "in " + careerLordPos.rashi + ", " + ordinal(careerLordPos.house) + " House" : "in chart"}) shapes professional authority, strategic execution, and long-term career growth.`,
      confidenceScore: careerScore,
      confidenceRating: careerRating,
      confidenceReason: `Supported by 10th House score (${houseScore(10)}/100) and ${careerLord} alignment.`,
      supportingPlanets: careerPlanets,
      supportingHouses: [10, 1, 6],
      supportingYogas: careerYogas,
      supportingDoshas: [],
      activeDasha: mahaLabel,
      activeAntardasha: antarLabel,
      activePratyantar: pratLabel,
      evidenceSummary: careerSummary,
    },
    {
      domain: "Marriage & Relationships",
      predictionText: `${marriageLord} as 7th lord (${marriageLordPos ? "in " + marriageLordPos.rashi + ", " + ordinal(marriageLordPos.house) + " House" : "in chart"}) and Venus condition reflect partnership harmony, emotional trust, and mutual commitment.`,
      confidenceScore: marriageScore,
      confidenceRating: marriageRating,
      confidenceReason: `Supported by 7th House score (${houseScore(7)}/100) and Venus placement.`,
      supportingPlanets: [marriageLord, "Venus", "Jupiter"].filter((g, i, a) => a.indexOf(g) === i) as GrahaName[],
      supportingHouses: [7, 4, 11],
      supportingYogas: marriageYogas,
      supportingDoshas: [],
      activeDasha: mahaLabel,
      activeAntardasha: antarLabel,
      activePratyantar: pratLabel,
      evidenceSummary: marriageSummary,
    },
    {
      domain: "Finance & Wealth Accumulation",
      predictionText: `${wealthLord2} as 2nd lord and ${wealthLord11} as 11th lord govern wealth creation, asset accumulation, and secondary revenue streams.`,
      confidenceScore: wealthScore,
      confidenceRating: wealthRating,
      confidenceReason: `Supported by 2nd & 11th House strength scores and wealth planet alignments.`,
      supportingPlanets: [wealthLord2, wealthLord11, "Jupiter"].filter((g, i, a) => a.indexOf(g) === i) as GrahaName[],
      supportingHouses: [2, 11, 9],
      supportingYogas: wealthYogas,
      supportingDoshas: [],
      activeDasha: mahaLabel,
      activeAntardasha: antarLabel,
      activePratyantar: pratLabel,
      evidenceSummary: wealthSummary,
    },
    {
      domain: "Health & Vitality",
      predictionText: `${lagnaLord} as Lagna lord determines physical constitution and natural immunity. ${healthDoshas.length > 0 ? "Active indicators (" + healthDoshas.join(", ") + ") suggest preventive routine." : "Optimal constitutional stamina indicated."}`,
      confidenceScore: healthScore,
      confidenceRating: healthRating,
      confidenceReason: `Supported by Lagna strength score (${houseScore(1)}/100) and Sun immunity status.`,
      supportingPlanets: [lagnaLord, "Sun", "Mars"].filter((g, i, a) => a.indexOf(g) === i) as GrahaName[],
      supportingHouses: [1, 6, 8],
      supportingYogas: [],
      supportingDoshas: healthDoshas,
      activeDasha: mahaLabel,
      activeAntardasha: antarLabel,
      activePratyantar: pratLabel,
      evidenceSummary: healthSummary,
    },
    {
      domain: "Spirituality & Dharma",
      predictionText: `${dharmaLord} as 9th lord and Jupiter's placement govern philosophical wisdom, dharmic integrity, and inner spiritual evolution.`,
      confidenceScore: dharmaScore,
      confidenceRating: dharmaRating,
      confidenceReason: `Supported by 9th House score (${houseScore(9)}/100) and Jupiter karaka alignment.`,
      supportingPlanets: [dharmaLord, "Jupiter", "Ketu"].filter((g, i, a) => a.indexOf(g) === i) as GrahaName[],
      supportingHouses: [9, 12, 5],
      supportingYogas: spiritualYogas,
      supportingDoshas: [],
      activeDasha: mahaLabel,
      activeAntardasha: antarLabel,
      activePratyantar: pratLabel,
      evidenceSummary: dharmaSummary,
    },
  ];
}

export function generateChapterActionCard(domain: string, result?: KundliResult): ActionCardData {
  const maha  = result?.vimshottari?.current?.mahadasha?.lord;
  const antar = result?.vimshottari?.current?.antardasha?.lord;
  const mahaLabel  = maha  ? `${maha} Mahadasha`   : "current Mahadasha";
  const antarLabel = antar ? `${antar} Antardasha`  : "active Antardasha";

  if (domain === "Career") {
    return {
      recommendedActions: [
        "Proactively lead key projects under active Dasha energy",
        "Seek mentorship aligned with 10th Lord planet qualities",
      ],
      thingsToAvoid: [`Impulsive decisions during ${antarLabel} transitions`],
      focusOn: ["Skill upgrading and executive communication"],
      opportunityWindow: `Next 12–18 months under ${mahaLabel}`,
      riskWindow: `${antarLabel} Saturn/Rahu sub-periods`,
    };
  }
  if (domain === "Marriage") {
    return {
      recommendedActions: ["Strengthen bonds through shared spiritual practice", "Engage 7th House remedies for Venus"],
      thingsToAvoid: ["Conflict during Rahu/Saturn Antardasha"],
      focusOn: ["Emotional communication and family harmony"],
      opportunityWindow: `Venus or Jupiter ${antarLabel} period`,
      riskWindow: `Rahu or Saturn ${antarLabel} transitions`,
    };
  }
  return {
    recommendedActions: ["Maintain disciplined daily routines", "Engage in weekly charity aligned with active Dasha lord"],
    thingsToAvoid: ["High-risk financial speculation during 8th House transits"],
    focusOn: ["Long-term asset building and family wellness"],
    opportunityWindow: `Current ${mahaLabel} period`,
    riskWindow: `Rahu or Saturn ${antarLabel} transitions`,
  };
}
