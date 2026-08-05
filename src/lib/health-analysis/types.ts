import type { BirthInput, KundliResult, GrahaName } from "@/lib/kundli/types";

export interface HealthAnalysisInput extends BirthInput {
  name: string;
}

export interface HealthScores {
  overallHealth: number; // 0 - 100 overall health index
  mentalWellness: number; // 0 - 100 emotional & mental peace
  physicalVitality: number; // 0 - 100 stamina & constitution
  stress: number; // 0 - 100 stress level (higher = more stress)
  energy: number; // 0 - 100 daily vitality & drive
  immunity: number; // 0 - 100 immune system resilience
  recovery: number; // 0 - 100 recuperation capacity
  lifestyleBalance: number; // 0 - 100 daily routine alignment
  sleep: number; // 0 - 100 rest & circadian rhythm quality
  emotionalStability: number; // 0 - 100 psychological balance
}

export type strokeDoshaType = 'Vata' | 'Pitta' | 'Kapha' | 'Vata-Pitta' | 'Pitta-Kapha' | 'Vata-Kapha' | 'Tridoshic';

export interface BodyConstitution {
  primaryDosha: strokeDoshaType;
  vataPercentage: number;
  pittaPercentage: number;
  kaphaPercentage: number;
  summary: string;
  recommendations: string[];
}

export interface HouseHealthAnalysis {
  house: number; // 1, 6, 8, 12
  houseName: string;
  rashi: string;
  rashiLord: GrahaName;
  planetsInHouse: GrahaName[];
  aspectingPlanets: GrahaName[];
  healthSignificance: string;
  tendencies: string[];
}

export interface PlanetHealthRole {
  planet: GrahaName;
  house: number;
  rashi: string;
  isRetrograde: boolean;
  isCombust: boolean;
  dignity: 'exalted' | 'own' | 'friendly' | 'neutral' | 'enemy' | 'debilitated';
  healthImpact: string;
  governedOrgans: string[];
  score: number; // 0 - 100
}

export interface OrganSystemTendency {
  systemName: string; // e.g. "Digestive System (Agni)", "Cardiovascular System", "Musculoskeletal System"
  rulingPlanets: GrahaName[];
  rulingHouses: number[];
  wellnessStatus: 'Optimal' | 'Favorable' | 'Needs Attention' | 'Vulnerable';
  description: string;
  preventiveTips: string[];
}

export interface MonthlyWellnessForecastItem {
  month: string; // e.g. "Month 1 - August 2026"
  monthName: string;
  focusArea: string; // e.g. "Immunity & Digestive Agni"
  wellnessRating: number; // 1 - 5 stars
  energyLevel: string;
  stressLevel: string;
  sleepQuality: string;
  exerciseTip: string;
  dietAdvice: string;
  meditationGuidance: string;
  travelPrecaution: string;
  recoveryOutlook: string;
  keyAstrologicalDriver: string;
}

export interface AnnualWellnessTimelineEvent {
  year: number;
  phaseTitle: string;
  planetaryTransits: string;
  keyTheme: string;
  wellnessOpportunities: string;
  preventivePrecautions: string;
}

export interface AyurvedicRemedyItem {
  category: 'mantra' | 'meditation' | 'yoga' | 'pranayama' | 'charity' | 'temple' | 'lifestyle' | 'daily_routine';
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
  lifestyleAdvice: string;
}

export interface HealthAnalysisResult {
  input: HealthAnalysisInput;
  calculatedAt: string;
  kundli: KundliResult;
  scores: HealthScores;
  constitution: BodyConstitution;
  house1: HouseHealthAnalysis;
  house6: HouseHealthAnalysis;
  house8: HouseHealthAnalysis;
  house12: HouseHealthAnalysis;
  planets: Record<GrahaName, PlanetHealthRole>;
  d6Shashtamsha: {
    ascendantSign: string;
    house6Sign: string;
    house6Lord: GrahaName;
    keyPlanetsInD6: string;
    summary: string;
  };
  organSystems: OrganSystemTendency[];
  monthlyForecast: MonthlyWellnessForecastItem[];
  annualTimeline: AnnualWellnessTimelineEvent[];
  riskAndRecoveryPeriods: {
    riskPeriods: string[];
    recoveryPeriods: string[];
  };
  seasonalWellness: {
    summerTips: string[];
    monsoonTips: string[];
    winterTips: string[];
  };
  exerciseAndNutrition: {
    recommendedExercises: string[];
    nutritionGuidance: string[];
    foodsToFavor: string[];
    foodsToModerate: string[];
  };
  remedies: AyurvedicRemedyItem[];
  luckyElements: {
    colors: string[];
    days: string[];
    numbers: number[];
    directions: string[];
    healingHerbs: string[];
  };
  aiCoachVerdict: {
    executiveSummary: string;
    wellnessReadiness: 'Optimal Wellness' | 'Moderate Balance' | 'Preventive Attention Required';
    actionPlan: string[];
    finalVerdict: string;
  };
  evidenceChain: EvidenceChainItem[];
}
