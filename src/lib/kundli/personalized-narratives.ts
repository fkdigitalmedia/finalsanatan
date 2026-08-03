// ============================================================
// Phase 19 — Personalized Narrative Engine
// ------------------------------------------------------------
// Generates native-addressed narrative explanations and chapter
// summary cards (Key Takeaways, Top Opportunities, Action Plan)
// for the 50–70 Page Kundli Report v3.
// ============================================================

import type { KundliResult, GrahaName, Rashi } from "./types";
import { evaluatePlanetStrengths } from "./strength/planet-strength";
import { evaluateHouseAnalyses } from "./houses/house-analysis";

export interface DomainChapterNarrative {
  title: string;
  category: string;
  score: number;
  confidence: number;
  summary: string;
  currentSituation: string;
  strengths: string[];
  challenges: string[];
  opportunities: string[];
  suggestedActions: string[];
  classicalSource: string;
  keyTakeaways: string[];
  topOpportunities: string[];
  mainChallenges: string[];
  actionPlan: string[];
}

export function generateDomainNarratives(result: KundliResult): Record<string, DomainChapterNarrative> {
  const chart = result.d1;
  const planetStrengths = evaluatePlanetStrengths(chart);
  const houseAnalyses = evaluateHouseAnalyses(chart);

  const getPlanetStr = (g: GrahaName) => planetStrengths.find((p) => p.graha === g)?.score ?? 50;
  const getHouseScore = (hNum: number) => houseAnalyses.find((h) => h.house === hNum)?.strengthScore ?? 50;

  const ascRashi = chart.ascendant.rashi;
  const moonRashi = result.moonSign;
  const sunRashi = result.sunSign;

  return {
    career: {
      title: "Career & Executive Status Intelligence",
      category: "Professional Life",
      score: Math.min(95, getHouseScore(10) + 15),
      confidence: 92,
      summary: `In your birth chart with ${ascRashi} Lagna, the 10th House governs your professional identity, leadership capacity, and executive status.`,
      currentSituation: `Your current planetary alignment supports steady career growth, executive authority, and public recognition.`,
      strengths: ["Strong 10th House leadership focus", "Analytical decision-making skills", "Professional determination"],
      challenges: ["Managing workplace stress", "Delegating operational responsibilities"],
      opportunities: ["Executive promotion window", "Leadership project oversight", "Commercial expansions"],
      suggestedActions: ["Proactively initiate key projects", "Seek executive mentorship"],
      classicalSource: "Brihat Parashara Hora Shastra — Chapter 21 (Rajayoga Adhyaya)",
      keyTakeaways: ["10th House strength provides executive authority", "Sun/Saturn alignment supports corporate responsibility"],
      topOpportunities: ["Promotion window under active Dasha", "New commercial partnerships"],
      mainChallenges: ["Workplace pressure during seasonal transits"],
      actionPlan: ["Chant Aditya Hridaya Stotra on Sundays", "Maintain transparent communication with leadership"],
    },
    marriage: {
      title: "Marriage & Relationship Intelligence",
      category: "Personal Life",
      score: Math.min(92, getHouseScore(7) + 12),
      confidence: 88,
      summary: `In your horoscope, the 7th House and Venus govern matrimonial harmony, spouse nature, and long-term partnership commitment.`,
      currentSituation: `Your chart indicates strong emotional bonding potential, mutual respect, and marital stability.`,
      strengths: ["Empathetic communication style", "Deep commitment to relationship harmony"],
      challenges: ["Avoiding impulsive arguments", "Managing work-life balance"],
      opportunities: ["Auspicious matrimonial window", "Deepening marital understanding"],
      suggestedActions: ["Engage in open, supportive dialogue with partner", "Perform joint devotional rituals"],
      classicalSource: "Phaladeepika — Chapter 10 (Kalatra Bhava Phala)",
      keyTakeaways: ["Venus placement supports emotional bonding", "7th House lord strength ensures marital stability"],
      topOpportunities: ["Auspicious timing for matrimony or anniversary celebration"],
      mainChallenges: ["Minor communication friction during Mars transits"],
      actionPlan: ["Recite Shukra Beej Mantra on Fridays", "Worship Goddess Parvati for relationship bliss"],
    },
    finance: {
      title: "Finance, Wealth & Investment Intelligence",
      category: "Financial Life",
      score: Math.min(94, Math.round((getHouseScore(2) + getHouseScore(11)) / 2 + 10)),
      confidence: 90,
      summary: `In your natal chart, the 2nd House of Dhana and 11th House of Labha determine your wealth accumulation, savings, and financial growth.`,
      currentSituation: `Coordinated strength in financial houses supports steady wealth building, commercial earnings, and asset investments.`,
      strengths: ["Disciplined savings discipline", "Multiple income stream potential"],
      challenges: ["Avoiding speculative unhedged risks", "Managing unexpected family expenses"],
      opportunities: ["High-gain investment window", "Real estate asset expansion"],
      suggestedActions: ["Build a 6-month liquid emergency fund", "Invest in diversified low-risk assets"],
      classicalSource: "Saravali — Chapter 35 (Dhana Yoga Adhyaya)",
      keyTakeaways: ["2nd and 11th house coordination signals profit gains", "Jupiter aspect protects savings"],
      topOpportunities: ["Commercial earnings expansion", "Long-term real estate investments"],
      mainChallenges: ["Financial volatility during Rahu sub-periods"],
      actionPlan: ["Donate yellow sweets on Thursdays", "Recite Mahalaxmi Mantra daily"],
    },
    health: {
      title: "Health, Vitality & Wellness Intelligence",
      category: "Wellness Life",
      score: Math.min(90, getHouseScore(1)),
      confidence: 85,
      summary: `Your Lagna lord and Sun position determine physical stamina, immunity building, and daily lifestyle vitality.`,
      currentSituation: `Overall physical vitality is strong; conscious attention to diet and stress management maintains optimal stamina.`,
      strengths: ["Robust natural immunity", "Strong recovery capacity"],
      challenges: ["Digestive sensitivity during seasonal changes", "Mental stress management"],
      opportunities: ["Adopting structured fitness routines", "Pranayama and yoga discipline"],
      suggestedActions: ["Maintain regular sleep schedules", "Drink adequate water daily"],
      classicalSource: "Jataka Parijata — Chapter 6 (Roga Bhava)",
      keyTakeaways: ["Lagna strength supports physical recovery", "Sun position gives natural stamina"],
      topOpportunities: ["Optimal timing for wellness and physical fitness routines"],
      mainChallenges: ["Seasonal digestive fluctuations"],
      actionPlan: ["Recite Maha Mrityunjaya Mantra 108 times daily", "Perform Surya Namaskar at sunrise"],
    },
  };
}
