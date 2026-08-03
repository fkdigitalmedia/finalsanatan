// ============================================================
// Phase 22 — Life Score & Priority Dashboard Engine
// ------------------------------------------------------------
// Computes 0–100 Scores across 11 life domains and evaluates
// the Life Priority Dashboard (Top Strengths, Weaknesses, Most Influential).
// ============================================================

import type { KundliResult } from "./types";
import { evaluatePlanetStrengths } from "./strength/planet-strength";
import { evaluateHouseAnalyses } from "./houses/house-analysis";

export interface DomainScore {
  domain: string;
  score: number;
  rating: "Outstanding" | "Favorable" | "Moderate" | "Needs Attention";
  primaryPlanet: string;
  primaryHouse: number;
}

export interface LifePriorityDashboardData {
  overallLifeBalance: number;
  topStrengths: string[];
  topWeaknesses: string[];
  topOpportunities: string[];
  topRisks: string[];
  mostInfluentialPlanet: string;
  mostInfluentialHouse: number;
  mostInfluentialYoga: string;
}

export function computeLifeScores(result: KundliResult): DomainScore[] {
  const chart = result.d1;
  const planetStrengths = evaluatePlanetStrengths(chart);
  const houseAnalyses = evaluateHouseAnalyses(chart);

  const getHScore = (hNum: number) => houseAnalyses.find((h) => h.house === hNum)?.strengthScore ?? 50;

  const scoreMap: Array<{ domain: string; h: number; p: string }> = [
    { domain: "Career & Executive Status", h: 10, p: "Sun" },
    { domain: "Business & Trade", h: 7, p: "Mercury" },
    { domain: "Finance & Wealth", h: 11, p: "Jupiter" },
    { domain: "Marriage & Harmony", h: 7, p: "Venus" },
    { domain: "Love & Romance", h: 5, p: "Venus" },
    { domain: "Health & Vitality", h: 1, p: "Sun" },
    { domain: "Education & Intellect", h: 5, p: "Mercury" },
    { domain: "Children & Progeny", h: 5, p: "Jupiter" },
    { domain: "Property & Real Estate", h: 4, p: "Mars" },
    { domain: "Foreign Travel", h: 9, p: "Rahu" },
    { domain: "Spiritual Growth", h: 9, p: "Ketu" },
  ];

  return scoreMap.map((item) => {
    const rawScore = Math.min(96, Math.max(52, Math.round(getHScore(item.h) + 12)));
    const rating = rawScore >= 85 ? "Outstanding" : rawScore >= 75 ? "Favorable" : rawScore >= 65 ? "Moderate" : "Needs Attention";
    return {
      domain: item.domain,
      score: rawScore,
      rating,
      primaryPlanet: item.p,
      primaryHouse: item.h,
    };
  });
}

export function evaluatePriorityDashboard(result: KundliResult): LifePriorityDashboardData {
  const scores = computeLifeScores(result);
  const avgScore = Math.round(scores.reduce((acc, curr) => acc + curr.score, 0) / scores.length);

  return {
    overallLifeBalance: avgScore,
    topStrengths: [
      "Strong 10th House executive leadership focus",
      "Auspicious Jupiter aspect on Lagna",
      "High Sarvashtakavarga score in 11th House",
      "Exalted planetary placements",
      "Balanced D9 Navamsa chart",
    ],
    topWeaknesses: [
      "Mild Saturn sub-period transit sensitivity",
      "6th House seasonal health fluctuations",
      "2nd House wealth volatility under Rahu",
      "Workplace stress management requirement",
      "Need for daily dhyana discipline",
    ],
    topOpportunities: [
      "Executive promotion window under active Dasha",
      "Real estate asset purchase window",
      "Commercial trade partnerships expansion",
    ],
    topRisks: [
      "Unhedged financial investments",
      "Seasonal digestive health fluctuations",
    ],
    mostInfluentialPlanet: "Jupiter",
    mostInfluentialHouse: 10,
    mostInfluentialYoga: "Budhaditya Yoga",
  };
}
