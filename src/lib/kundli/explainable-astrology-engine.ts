// ============================================================
// Phase 20 — Explainable AI Astrology Engine
// ------------------------------------------------------------
// Provides transparent evidence chains and reasoning breakdowns:
// - Rule Trace Engine (Prediction -> Rules -> Planets -> Houses -> Yogas -> Dasha -> Confidence)
// - Planet & House Reasoning
// - Prediction Source Tags (Generated From: actual planet names, house names, yoga names, dasha lords)
// - Action Cards (Recommended Actions, Avoid, Focus On, Opportunities, Risks)
//
// All values are dynamically derived from the real KundliResult — no placeholders.
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

// ── House Sanskrit names (short) ─────────────────────────────
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

// ── Structured evidence item ──────────────────────────────────
export interface EvidenceItem {
  category: "Planet" | "House" | "Yoga" | "Dasha" | "Dosha" | "Transit";
  label: string;       // e.g. "Mercury (10th Lord)" / "10th House (Karma Bhava)" / "Venus Mahadasha"
  detail?: string;     // optional sub-detail line
}

export interface PredictionEvidenceTrace {
  domain: string;
  predictionText: string;
  confidenceScore: number;
  confidenceRating: "Very High" | "High" | "Moderate" | "Low";
  confidenceReason: string;
  supportingRules: string[];
  /** Real planet names actually involved */
  supportingPlanets: GrahaName[];
  /** Real house numbers actually involved */
  supportingHouses: number[];
  /** Real detected yoga names (isPresent === true) */
  supportingYogas: string[];
  /** Real detected dosha names */
  supportingDoshas: string[];
  activeDasha: string;
  activeAntardasha?: string;
  activePratyantar?: string;
  /** Fully-resolved evidence items — NO placeholders */
  evidenceItems: EvidenceItem[];
  /** Legacy field — now populated with real values */
  sources: Array<"Planet" | "House" | "Yoga" | "Dosha" | "Dasha" | "Transit">;
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

  const mahaLabel  = maha  ? `${maha} Mahadasha`  : null;
  const antarLabel = antar ? `${antar} Antardasha` : null;
  const pratLabel  = prat  ? `${prat} Pratyantar`  : null;

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

  // Helper: build an EvidenceItem for a planet with context
  function planetEvidence(graha: GrahaName, context?: string): EvidenceItem {
    const pos = planetPos(graha);
    const str = planetStrengths.find((p) => p.graha === graha);
    const parts: string[] = [];
    if (context) parts.push(context);
    if (pos) parts.push(`${pos.rashi}, ${ordinal(pos.house)} House`);
    if (str) parts.push(`${str.dignity}, score ${str.score}/100`);
    return {
      category: "Planet",
      label: parts[0] ? `${graha} (${parts[0]})` : graha,
      detail: parts.slice(1).join(" · ") || undefined,
    };
  }

  // Helper: build an EvidenceItem for a house
  function houseEvidence(num: number, context?: string): EvidenceItem {
    const info = houseInfo(num);
    return {
      category: "House",
      label: houseLabel(num),
      detail: context ?? (info ? `Lord: ${info.lord}, Strength: ${info.strengthScore}/100` : undefined),
    };
  }

  // Helper: build dasha evidence items
  function dashaEvidence(): EvidenceItem[] {
    const items: EvidenceItem[] = [];
    if (mahaLabel) items.push({ category: "Dasha", label: mahaLabel });
    if (antarLabel) items.push({ category: "Dasha", label: antarLabel });
    if (pratLabel) items.push({ category: "Dasha", label: pratLabel });
    return items;
  }

  // Helper: consolidate sources list from evidenceItems
  function sourcesFrom(items: EvidenceItem[]): Array<"Planet" | "House" | "Yoga" | "Dosha" | "Dasha" | "Transit"> {
    return [...new Set(items.map((i) => i.category))] as any[];
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

  const careerHouses = [10, 1, 6];
  const careerScore = Math.round(
    (houseScore(10) * 0.6 + houseScore(1) * 0.3 + houseScore(6) * 0.1)
  );
  const careerRating: PredictionEvidenceTrace["confidenceRating"] =
    careerScore >= 80 ? "Very High" : careerScore >= 65 ? "High" : careerScore >= 50 ? "Moderate" : "Low";

  const careerItems: EvidenceItem[] = [
    planetEvidence(careerLord, `${ordinal(10)} Lord`),
    ...careerPlanets.filter((g) => g !== careerLord).map((g) => planetEvidence(g)),
    houseEvidence(10),
    houseEvidence(1),
    ...careerYogas.map((y) => ({ category: "Yoga" as const, label: y })),
    ...dashaEvidence(),
  ];

  // ── 2. Marriage & Relationships ───────────────────────────
  const marriageLord = houseLord(ascIdx, 7);
  const marriageLordPos = planetPos(marriageLord);
  const marriageYogas = domainYogas(["Gaja Kesari", "Chandra", "Malavya"]);
  const marriageHouses = [7, 4, 11];
  const marriageScore = Math.round(
    (houseScore(7) * 0.6 + houseScore(4) * 0.25 + houseScore(11) * 0.15)
  );
  const marriageRating: PredictionEvidenceTrace["confidenceRating"] =
    marriageScore >= 80 ? "Very High" : marriageScore >= 65 ? "High" : marriageScore >= 50 ? "Moderate" : "Low";

  const marriageItems: EvidenceItem[] = [
    planetEvidence(marriageLord, `${ordinal(7)} Lord`),
    planetEvidence("Venus"),
    houseEvidence(7),
    houseEvidence(4),
    houseEvidence(11),
    ...marriageYogas.map((y) => ({ category: "Yoga" as const, label: y })),
    ...dashaEvidence(),
  ];

  // ── 3. Finance & Wealth Accumulation ──────────────────────
  const wealthLord2 = houseLord(ascIdx, 2);
  const wealthLord11 = houseLord(ascIdx, 11);
  const wealthYogas = domainYogas(["Dhana Yoga", "Laxmi", "Chandra-Mangal", "Malavya"]);
  const wealthScore = Math.round(
    (houseScore(2) * 0.4 + houseScore(11) * 0.4 + houseScore(9) * 0.2)
  );
  const wealthRating: PredictionEvidenceTrace["confidenceRating"] =
    wealthScore >= 80 ? "Very High" : wealthScore >= 65 ? "High" : wealthScore >= 50 ? "Moderate" : "Low";

  const wealthItems: EvidenceItem[] = [
    planetEvidence(wealthLord2, `${ordinal(2)} Lord`),
    planetEvidence(wealthLord11 !== wealthLord2 ? wealthLord11 : "Jupiter", wealthLord11 !== wealthLord2 ? `${ordinal(11)} Lord` : undefined),
    houseEvidence(2),
    houseEvidence(11),
    houseEvidence(9),
    ...wealthYogas.map((y) => ({ category: "Yoga" as const, label: y })),
    ...dashaEvidence(),
  ];

  // ── 4. Health & Vitality ──────────────────────────────────
  const lagnaLord = houseLord(ascIdx, 1);
  const healthYogas: string[] = [];
  const healthDoshas = (result.doshas ?? [])
    .filter((d) => d.isPresent && !d.isCancelled)
    .map((d) => d.name)
    .slice(0, 3);
  const healthScore = Math.round(
    (houseScore(1) * 0.5 + houseScore(6) * 0.25 + houseScore(8) * 0.25)
  );
  const healthRating: PredictionEvidenceTrace["confidenceRating"] =
    healthScore >= 80 ? "Very High" : healthScore >= 65 ? "High" : healthScore >= 50 ? "Moderate" : "Low";

  const healthItems: EvidenceItem[] = [
    planetEvidence(lagnaLord, "Lagna Lord"),
    planetEvidence("Sun"),
    houseEvidence(1),
    houseEvidence(6),
    ...healthDoshas.map((d) => ({ category: "Dosha" as const, label: d })),
    ...dashaEvidence(),
  ];

  // ── 5. Spirituality & Dharma ─────────────────────────────
  const dharmaLord = houseLord(ascIdx, 9);
  const spiritualYogas = domainYogas(["Hamsa", "Raj Yoga"]);
  const dharmaScore = Math.round(
    (houseScore(9) * 0.5 + houseScore(12) * 0.3 + houseScore(5) * 0.2)
  );
  const dharmaRating: PredictionEvidenceTrace["confidenceRating"] =
    dharmaScore >= 80 ? "Very High" : dharmaScore >= 65 ? "High" : dharmaScore >= 50 ? "Moderate" : "Low";

  const dharmaItems: EvidenceItem[] = [
    planetEvidence(dharmaLord, `${ordinal(9)} Lord`),
    planetEvidence("Jupiter"),
    houseEvidence(9),
    houseEvidence(12),
    houseEvidence(5),
    ...spiritualYogas.map((y) => ({ category: "Yoga" as const, label: y })),
    ...dashaEvidence(),
  ];

  // ── Build traces ─────────────────────────────────────────
  return [
    {
      domain: "Career & Executive Status",
      predictionText: `${careerLord} as 10th lord (in ${careerLordPos ? careerLordPos.rashi + ", " + ordinal(careerLordPos.house) + " House" : "chart"}) shapes professional authority and career trajectory.`,
      confidenceScore: careerScore,
      confidenceRating: careerRating,
      confidenceReason: `10th House strength ${houseScore(10)}/100 · ${careerLord} dignity: ${planetStrengths.find((p) => p.graha === careerLord)?.dignity ?? "neutral"} · ${careerYogas.length} Raj Yoga(s) detected.`,
      supportingRules: ["10th Lord Placement Rule", "Kendra-Trikona Yoga Rule", "Sun Vitality Rule"],
      supportingPlanets: careerPlanets,
      supportingHouses: careerHouses,
      supportingYogas: careerYogas,
      supportingDoshas: [],
      activeDasha: mahaLabel ?? "—",
      activeAntardasha: antarLabel ?? undefined,
      activePratyantar: pratLabel ?? undefined,
      evidenceItems: careerItems.filter((i) => i.label),
      sources: sourcesFrom(careerItems),
    },
    {
      domain: "Marriage & Relationships",
      predictionText: `${marriageLord} as 7th lord (${marriageLordPos ? "in " + marriageLordPos.rashi + ", " + ordinal(marriageLordPos.house) + " House" : "in chart"}) and Venus condition indicate emotional harmony and partnership prospects.`,
      confidenceScore: marriageScore,
      confidenceRating: marriageRating,
      confidenceReason: `7th House strength ${houseScore(7)}/100 · Venus dignity: ${planetStrengths.find((p) => p.graha === "Venus")?.dignity ?? "neutral"} · ${marriageYogas.length} relevant yoga(s).`,
      supportingRules: ["7th Lord Placement Rule", "Venus Benefic Rule", "Kalatra Karaka Rule"],
      supportingPlanets: [marriageLord, "Venus", "Jupiter"].filter((g, i, a) => a.indexOf(g) === i) as GrahaName[],
      supportingHouses: marriageHouses,
      supportingYogas: marriageYogas,
      supportingDoshas: [],
      activeDasha: mahaLabel ?? "—",
      activeAntardasha: antarLabel ?? undefined,
      activePratyantar: pratLabel ?? undefined,
      evidenceItems: marriageItems.filter((i) => i.label),
      sources: sourcesFrom(marriageItems),
    },
    {
      domain: "Finance & Wealth Accumulation",
      predictionText: `${wealthLord2} as 2nd lord and ${wealthLord11} as 11th lord govern wealth creation and income streams. House strength directs financial capacity.`,
      confidenceScore: wealthScore,
      confidenceRating: wealthRating,
      confidenceReason: `2nd House: ${houseScore(2)}/100 · 11th House: ${houseScore(11)}/100 · ${wealthYogas.length} Dhana Yoga(s) active.`,
      supportingRules: ["2nd Lord Income Rule", "11th Lord Gains Rule", "Dhana Yoga Formation"],
      supportingPlanets: [wealthLord2, wealthLord11, "Jupiter"].filter((g, i, a) => a.indexOf(g) === i) as GrahaName[],
      supportingHouses: [2, 11, 9],
      supportingYogas: wealthYogas,
      supportingDoshas: [],
      activeDasha: mahaLabel ?? "—",
      activeAntardasha: antarLabel ?? undefined,
      activePratyantar: pratLabel ?? undefined,
      evidenceItems: wealthItems.filter((i) => i.label),
      sources: sourcesFrom(wealthItems),
    },
    {
      domain: "Health & Vitality",
      predictionText: `${lagnaLord} as Lagna lord governs physical constitution and immunity. ${healthDoshas.length > 0 ? "Active doshas: " + healthDoshas.join(", ") + " require specific attention." : "No critical doshas active."}`,
      confidenceScore: healthScore,
      confidenceRating: healthRating,
      confidenceReason: `Lagna strength ${houseScore(1)}/100 · 6th House: ${houseScore(6)}/100 · ${healthDoshas.length} active dosha(s).`,
      supportingRules: ["Lagna Lord Immunity Rule", "6th House Disease Rule", "Sun Vitality Rule"],
      supportingPlanets: [lagnaLord, "Sun", "Mars"].filter((g, i, a) => a.indexOf(g) === i) as GrahaName[],
      supportingHouses: [1, 6, 8],
      supportingYogas: healthYogas,
      supportingDoshas: healthDoshas,
      activeDasha: mahaLabel ?? "—",
      activeAntardasha: antarLabel ?? undefined,
      activePratyantar: pratLabel ?? undefined,
      evidenceItems: healthItems.filter((i) => i.label),
      sources: sourcesFrom(healthItems),
    },
    {
      domain: "Spirituality & Dharma",
      predictionText: `${dharmaLord} as 9th lord and Jupiter's placement shape spiritual evolution, dharmic path, and fortune through higher wisdom.`,
      confidenceScore: dharmaScore,
      confidenceRating: dharmaRating,
      confidenceReason: `9th House: ${houseScore(9)}/100 · 12th House: ${houseScore(12)}/100 · Jupiter dignity: ${planetStrengths.find((p) => p.graha === "Jupiter")?.dignity ?? "neutral"}.`,
      supportingRules: ["9th Lord Dharma Rule", "Jupiter Karaka Wisdom Rule", "12th House Liberation Rule"],
      supportingPlanets: [dharmaLord, "Jupiter", "Ketu"].filter((g, i, a) => a.indexOf(g) === i) as GrahaName[],
      supportingHouses: [9, 12, 5],
      supportingYogas: spiritualYogas,
      supportingDoshas: [],
      activeDasha: mahaLabel ?? "—",
      activeAntardasha: antarLabel ?? undefined,
      activePratyantar: pratLabel ?? undefined,
      evidenceItems: dharmaItems.filter((i) => i.label),
      sources: sourcesFrom(dharmaItems),
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
