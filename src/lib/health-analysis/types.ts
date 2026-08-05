import type { BirthInput, KundliResult, GrahaName } from "@/lib/kundli/types";

export interface HealthAnalysisInput extends BirthInput {
  name: string;
}

export interface HealthScores {
  overallHealth: number;       // 0–100 overall health index
  mentalWellness: number;      // 0–100 emotional & mental peace
  physicalVitality: number;    // 0–100 stamina & constitution
  stress: number;              // 0–100 stress level (higher = more stress)
  energy: number;              // 0–100 daily vitality & drive
  immunity: number;            // 0–100 immune system resilience
  recovery: number;            // 0–100 recuperation capacity
  lifestyleBalance: number;    // 0–100 daily routine alignment
  sleep: number;               // 0–100 rest & circadian rhythm quality
  emotionalStability: number;  // 0–100 psychological balance
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
  house: number;
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
  score: number; // 0–100
}

// ── Organ Dashboard ───────────────────────────────────────────────────────────

export type OrganColorIndicator = 'green' | 'yellow' | 'orange' | 'red';

export interface OrganDashboardCard {
  organName: string;           // e.g. "Heart", "Liver", "Kidney"
  planet: GrahaName;
  house: number;
  healthScore: number;         // 0–100
  riskPercent: number;         // 0–100
  colorIndicator: OrganColorIndicator;
  currentStrength: string;     // e.g. "Moderate"
  futureTrend: string;         // e.g. "Stable", "Improving", "Declining"
  dashaImpact: string;
  transitImpact: string;
  recoveryPotential: string;   // e.g. "Excellent", "Good", "Fair"
  preventiveAdvice: string;
  ayurvedicHerbs: string[];
  bestFoods: string[];
  worstFoods: string[];
  yoga: string[];
  pranayama: string[];
  medicalDisclaimer: string;
}

// ── Risk Dashboard ────────────────────────────────────────────────────────────

export type RiskSeverity = 'Low' | 'Moderate' | 'High' | 'Critical';
export type RiskTrend = 'Improving' | 'Stable' | 'Worsening';

export interface RiskDashboardCard {
  conditionName: string;       // e.g. "Heart Disease"
  riskPercent: number;
  currentSeverity: RiskSeverity;
  futureTrend: RiskTrend;
  recoveryPotential: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  keyPlanet: GrahaName;
  keyHouse: number;
  preventiveSummary: string;
  actionItems: string[];
}

// ── Organ System (legacy, retained for backward compat) ───────────────────────

export interface OrganSystemTendency {
  systemName: string;
  rulingPlanets: GrahaName[];
  rulingHouses: number[];
  wellnessStatus: 'Optimal' | 'Favorable' | 'Needs Attention' | 'Vulnerable';
  description: string;
  preventiveTips: string[];
}

// ── Monthly Forecast (v2 — fully unique per month) ────────────────────────────

export interface MonthlyWellnessForecastItem {
  month: string;               // "Month 1 – August 2026"
  monthName: string;
  focusArea: string;
  wellnessRating: number;      // 1–5
  energyLevel: string;
  stressLevel: string;
  sleepQuality: string;
  exerciseTip: string;
  dietAdvice: string;
  meditationGuidance: string;
  travelPrecaution: string;
  recoveryOutlook: string;
  keyAstrologicalDriver: string;
  // v2 unique fields
  transitPlanet: string;
  mahadasha: string;
  antardasha: string;
  houseActivated: number;
  season: string;
  rahuKetuImpact: string;
  solarEvent: string;
  moonInfluence: string;
  riskWindow: string;
  opportunityWindow: string;
  luckyDay: string;
  thingsToAvoid: string[];
  medicalPrecautions: string;
  aiCommentary: string;
  energyScore: number;         // 0–100
  stressScore: number;         // 0–100
  recoveryScore: number;       // 0–100
}

// ── Annual Timeline ───────────────────────────────────────────────────────────

export interface AnnualWellnessTimelineEvent {
  year: number;
  phaseTitle: string;
  planetaryTransits: string;
  keyTheme: string;
  wellnessOpportunities: string;
  preventivePrecautions: string;
}

// ── Wellness Timeline (90-Day, 1-Year, 5-Year) ────────────────────────────────

export interface WellnessTimelineMilestone {
  period: string;              // e.g. "Week 1–2", "Month 3", "Year 2"
  focus: string;
  action: string;
  expectedOutcome: string;
  planetarySupport: string;
}

export interface WellnessTimeline {
  ninetyDayRecoveryPlan: WellnessTimelineMilestone[];
  oneYearRoadmap: WellnessTimelineMilestone[];
  fiveYearForecast: WellnessTimelineMilestone[];
  majorDashaChanges: string[];
  transitWindows: string[];
  recoveryOpportunities: string[];
  weakPeriods: string[];
  strongPeriods: string[];
}

// ── Ayurvedic Chapter ─────────────────────────────────────────────────────────

export interface AyurvedicChapter {
  prakriti: string;            // constitutional nature
  vikriti: string;             // current imbalance
  doshaPercentage: { vata: number; pitta: number; kapha: number };
  morningRoutine: string[];
  nightRoutine: string[];
  idealWakeTime: string;
  idealSleepTime: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  hydration: string;
  detox: string;
  seasonalAdvice: { summer: string; monsoon: string; winter: string };
  massageOil: string;
  yoga: string[];
  meditation: string;
  pranayama: string[];
  dailySchedule: { time: string; activity: string }[];
}

// ── Remedy Card (v2 — structured, no placeholders) ────────────────────────────

export interface AyurvedicRemedyItem {
  category: 'mantra' | 'meditation' | 'yoga' | 'pranayama' | 'charity' | 'temple' | 'lifestyle' | 'daily_routine' | 'gemstone' | 'fasting' | 'yantra' | 'herb';
  title: string;
  description: string;
  instructions: string;
  bestTime: string;
  // v2 structured fields
  relatedPlanet: GrahaName;
  purpose: string;
  frequency: string;
  expectedResult: string;
  difficulty: 'Easy' | 'Moderate' | 'Advanced';
  estimatedCost: string;
  bestDay: string;
  alternativeRemedy: string;
  scientificWellnessTip: string;
  medicalDisclaimer: string;
}

// ── Evidence Chain (9-step explainable AI) ────────────────────────────────────

export interface EvidenceChainItem {
  claim: string;
  planet: GrahaName;
  house: number;
  lord: GrahaName;
  yoga: string;
  dasha: string;
  transit: string;
  astrologicalLogic: string;
  conclusion: string;
  confidencePercent: number;
  lifestyleAdvice: string;
  // legacy compat
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
}

// ── AI Health Coach ───────────────────────────────────────────────────────────

export interface AIHealthCoach {
  todaysFocus: string;
  thisWeek: string[];
  thisMonth: string[];
  top5Priorities: string[];
  topMistakes: string[];
  improvementPlan: string[];
  emergencyWarnings: string[];
  recoveryGoals: string[];
  motivationalGuidance: string;
}

// ── Expanded Lucky Elements (14 fields) ──────────────────────────────────────

export interface ExpandedLuckyElements {
  colors: string[];
  numbers: number[];
  days: string[];
  directions: string[];
  gemstone: string;
  metal: string;
  healingHerbs: string[];
  temple: string;
  donation: string;
  fast: string;
  mantra: string;
  yantra: string;
  meditation: string;
  mudra: string;
  healingFrequency: string;
  healingTime: string;
}

// ── Final Verdict ─────────────────────────────────────────────────────────────

export interface FinalVerdict {
  overallHealthRating: string;        // e.g. "Good (78/100)"
  topStrengths: string[];
  topWeaknesses: string[];
  criticalRisks: string[];
  recoveryPotential: string;
  lifestyleAdvice: string[];
  planetarySummary: string;
  next12Months: string;
  finalAIVerdict: string;
  confidencePercent: number;
  actionPlan: string[];
}

// ── SVG Charts ────────────────────────────────────────────────────────────────

export interface HealthSVGCharts {
  healthWheelRadar: string;       // SVG string
  riskRadarChart: string;         // SVG string
  doshaTriangle: string;          // SVG string
  organHealthMatrix: string;      // SVG string
  energyTimeline: string;         // SVG string
  monthlyHeatmap: string;         // SVG string
}

// ── Main Result ───────────────────────────────────────────────────────────────

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
  // Legacy organ systems (kept for backward compat)
  organSystems: OrganSystemTendency[];
  // v2 Enterprise additions
  organDashboard: OrganDashboardCard[];
  riskDashboard: RiskDashboardCard[];
  ayurvedicChapter: AyurvedicChapter;
  aiHealthCoach: AIHealthCoach;
  wellnessTimeline: WellnessTimeline;
  svgCharts: HealthSVGCharts;
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
  luckyElements: ExpandedLuckyElements;
  aiCoachVerdict: {
    executiveSummary: string;
    wellnessReadiness: 'Optimal Wellness' | 'Moderate Balance' | 'Preventive Attention Required';
    actionPlan: string[];
    finalVerdict: string;
  };
  evidenceChain: EvidenceChainItem[];
  finalVerdict: FinalVerdict;
}
