import type { BirthInput, KundliResult, GrahaName } from "@/lib/kundli/types";

export interface ForeignSettlementInput extends BirthInput {
  name: string;
}

export interface ForeignScores {
  foreignSettlementScore: number; // 0 - 100 permanent settlement potential
  foreignTravelScore: number; // 0 - 100 frequency of short & long trips
  educationAbroadScore: number; // 0 - 100 higher studies abroad
  foreignJobScore: number; // 0 - 100 international employment
  businessAbroadScore: number; // 0 - 100 foreign trade / business
  prProbabilityScore: number; // 0 - 100 Permanent Residence probability
  visaSuccessPotential: number; // 0 - 100 visa approval probability
  longStayProbability: number; // 0 - 100 multi-year stay probability
  permanentSettlementProbability: number; // 0 - 100 lifelong residence probability
}

export interface CountrySuitabilityItem {
  country: string;
  flag: string;
  suitabilityScore: number; // 0 - 100
  recommendationLevel: 'Highly Recommended' | 'Favorable' | 'Moderate' | 'Challenging';
  astrologicalReasoning: string;
  bestSector: string; // e.g. "IT & Higher Education", "Finance & Trade", "Research & Health"
}

export interface HouseForeignAnalysis {
  house: number; // 4, 7, 9, 10, 12
  houseName: string;
  rashi: string;
  rashiLord: GrahaName;
  planetsInHouse: GrahaName[];
  aspectingPlanets: GrahaName[];
  foreignSignificance: string;
  tendencies: string[];
}

export interface PlanetForeignRole {
  planet: GrahaName;
  house: number;
  rashi: string;
  isRetrograde: boolean;
  isCombust: boolean;
  dignity: 'exalted' | 'own' | 'friendly' | 'neutral' | 'enemy' | 'debilitated';
  foreignImpact: string;
  score: number; // 0 - 100
}

export interface MonthlyImmigrationForecastItem {
  month: string; // e.g. "Month 1 - August 2026"
  monthName: string;
  focusArea: string; // e.g. "Visa Documentation & Submission"
  travelRating: number; // 1 - 5 stars
  travelOutlook: string;
  visaOutlook: string;
  jobOutlook: string;
  businessOutlook: string;
  educationOutlook: string;
  keyOpportunity: string;
  riskPrecaution: string;
  recommendedAction: string;
  keyAstrologicalDriver: string;
}

export interface AnnualTravelTimelineEvent {
  year: number;
  phaseTitle: string;
  planetaryTransits: string;
  keyTheme: string;
  travelOpportunities: string;
  precautions: string;
}

export interface TravelRemedyItem {
  category: 'temple' | 'donation' | 'mantra' | 'charity' | 'gemstone' | 'lifestyle' | 'travel_prep';
  title: string;
  description: string;
  instructions: string;
  bestTime: string;
}

export interface EvidenceChainItem {
  claim: string;
  astrologicalBasis: string;
  factors: {
    planet?: GrahaName;
    house?: number;
    rashi?: string;
    yoga?: string;
    dosha?: string;
    dasha?: string;
    transit?: string;
  };
  confidencePercent: number;
  actionableAdvice: string;
}

export interface ForeignSettlementResult {
  input: ForeignSettlementInput;
  calculatedAt: string;
  kundli: KundliResult;
  scores: ForeignScores;
  house4: HouseForeignAnalysis;
  house7: HouseForeignAnalysis;
  house9: HouseForeignAnalysis;
  house10: HouseForeignAnalysis;
  house12: HouseForeignAnalysis;
  planets: Record<GrahaName, PlanetForeignRole>;
  countryRankings: CountrySuitabilityItem[];
  foreignYogas: Array<{
    name: string;
    description: string;
    strength: number;
    evidence: string;
  }>;
  challengesAndDelays: string[];
  monthlyForecast: MonthlyImmigrationForecastItem[];
  annualTimeline: AnnualTravelTimelineEvent[];
  bestTravelPeriods: string[];
  riskPeriods: string[];
  foreignIncomePotential: {
    incomeScore: number;
    description: string;
    bestAvenues: string[];
  };
  longTermSettlementOutlook: {
    verdict: string;
    keyFavorableAges: string[];
    prTimelineWindow: string;
  };
  remedies: TravelRemedyItem[];
  luckyElements: {
    colors: string[];
    days: string[];
    numbers: number[];
    directions: string[];
    auspiciousDatesMonth: number[];
  };
  aiConsultantVerdict: {
    executiveSummary: string;
    immigrationReadiness: 'High Readiness' | 'Moderate Readiness' | 'Remedial Action Needed';
    actionPlan: string[];
    finalVerdict: string;
  };
  evidenceChain: EvidenceChainItem[];
}
