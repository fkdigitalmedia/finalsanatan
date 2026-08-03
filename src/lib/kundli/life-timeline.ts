// ============================================================
// Phase 18 — Decade-by-Decade Life Timeline Engine
// ------------------------------------------------------------
// Generates detailed timeline predictions for every life phase:
// - 0–10 Years (Early Childhood & Health)
// - 10–20 Years (Education & Growth)
// - 20–30 Years (Career Launch & Marriage)
// - 30–40 Years (Professional Rise & Assets)
// - 40–50 Years (Leadership & Wealth Peak)
// - 50–60 Years (Mentorship & Stability)
// - 60+ Years (Legacy & Spiritual Fulfillment)
// ============================================================

import type { KundliResult, GrahaName } from "./types";
import { evaluateHouseAnalyses } from "./houses/house-analysis";

export interface DecadeTimelineItem {
  decade: "0–10" | "10–20" | "20–30" | "30–40" | "40–50" | "50–60" | "60+";
  ageSpan: string;
  phaseTitle: string;
  rulingPlanet: GrahaName;
  keyOpportunities: string[];
  keyChallenges: string[];
  detailedPrediction: string;
  recommendedFocus: string;
}

export function computeDecadeTimeline(result: KundliResult): DecadeTimelineItem[] {
  const houseAnalyses = evaluateHouseAnalyses(result.d1);
  const getHouseScore = (hNum: number) => houseAnalyses.find((h) => h.house === hNum)?.strengthScore ?? 50;

  const h1 = getHouseScore(1);
  const h4 = getHouseScore(4);
  const h5 = getHouseScore(5);
  const h7 = getHouseScore(7);
  const h10 = getHouseScore(10);
  const h11 = getHouseScore(11);
  const h9 = getHouseScore(9);

  return [
    {
      decade: "0–10",
      ageSpan: "Ages 0 to 10 Years",
      phaseTitle: "Childhood Foundation & Vitality",
      rulingPlanet: "Moon",
      keyOpportunities: ["Strong family bonding", "Immunity building", "Early talent manifestation"],
      keyChallenges: ["Childhood health sensitivity", "Adapting to school routines"],
      detailedPrediction: `Early childhood is governed by Moon and Lagna strength (${h1}/100). Indicates steady emotional support from mother and family.`,
      recommendedFocus: "Focus on balanced nutrition, early reading, and emotional security.",
    },
    {
      decade: "10–20",
      ageSpan: "Ages 10 to 20 Years",
      phaseTitle: "Education & Intellectual Growth",
      rulingPlanet: "Mercury",
      keyOpportunities: ["Academic excellence", "Competitive exam success", "Developing technical skills"],
      keyChallenges: ["Distractions during exams", "Peer pressure"],
      detailedPrediction: `Governed by 4th and 5th house intellect scores (${h4}/100 & ${h5}/100). High analytical capability for competitive education and skill acquisition.`,
      recommendedFocus: "Maintain structured study hours and practice Saraswati Vandana daily.",
    },
    {
      decade: "20–30",
      ageSpan: "Ages 20 to 30 Years",
      phaseTitle: "Career Launch & Marriage Window",
      rulingPlanet: "Venus",
      keyOpportunities: ["First major career breakthrough", "Matrimonial alliance", "Financial independence"],
      keyChallenges: ["Initial work pressure", "Balancing personal and professional life"],
      detailedPrediction: `Governed by 7th and 10th houses (${h7}/100 & ${h10}/100). Prime decade for entering profession, establishing marital ties, and setting long-term goals.`,
      recommendedFocus: "Focus on career consolidation and transparent marital communication.",
    },
    {
      decade: "30–40",
      ageSpan: "Ages 30 to 40 Years",
      phaseTitle: "Professional Rise & Asset Creation",
      rulingPlanet: "Mars",
      keyOpportunities: ["Real estate acquisition", "Promotions & leadership roles", "Savings growth"],
      keyChallenges: ["Managing financial commitments", "Workplace competition"],
      detailedPrediction: `Governed by 2nd, 4th, and 10th house strength. High potential for home ownership, land investments, and executive authority.`,
      recommendedFocus: "Invest in low-risk real estate and build long-term liquid reserves.",
    },
    {
      decade: "40–50",
      ageSpan: "Ages 40 to 50 Years",
      phaseTitle: "Leadership & Peak Wealth Accumulation",
      rulingPlanet: "Jupiter",
      keyOpportunities: ["Peak financial gains", "Mentorship positions", "Children's academic milestones"],
      keyChallenges: ["Health maintenance", "Work-life balance"],
      detailedPrediction: `Governed by 11th and 9th houses (${h11}/100 & ${h9}/100). Represents peak commercial earnings, institutional leadership, and philanthropic expansion.`,
      recommendedFocus: "Maintain regular physical checkups and engage in charitable initiatives.",
    },
    {
      decade: "50–60",
      ageSpan: "Ages 50 to 60 Years",
      phaseTitle: "Mentorship, Family Joy & Stability",
      rulingPlanet: "Saturn",
      keyOpportunities: ["Executive advisory roles", "Grandchildren joy", "Spiritual pilgrimages"],
      keyChallenges: ["Joint health care", "Planning retirement transition"],
      detailedPrediction: `Saturnian maturity and 9th house Dharma bring deep satisfaction, family lineage prosperity, and public honor.`,
      recommendedFocus: "Delegate operational tasks and focus on mentoring younger generations.",
    },
    {
      decade: "60+",
      ageSpan: "Ages 60 Years & Beyond",
      phaseTitle: "Legacy, Wisdom & Spiritual Liberation",
      rulingPlanet: "Ketu",
      keyOpportunities: ["Spiritual enlightenment", "Legacy fulfillment", "Inner peace & meditation"],
      keyChallenges: ["Physical stamina maintenance"],
      detailedPrediction: `Governed by 12th house Moksha Sthana. Deep receptivity to higher truth, spiritual peace, and timeless legacy.`,
      recommendedFocus: "Daily dhyana, spiritual reading, and selfless community service.",
    },
  ];
}
