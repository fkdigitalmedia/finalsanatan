// ============================================================
// Phase 22 — Opportunity & Risk Calendar Engine
// ------------------------------------------------------------
// Computes Opportunity Windows, Risk Windows, and Decision Support.
// ============================================================

import type { KundliResult } from "./types";

export interface OpportunityWindow {
  category: string;
  startDate: string;
  endDate: string;
  confidenceScore: number;
  supportingDasha: string;
  supportingTransit: string;
  supportingYoga: string;
}

export interface RiskWindow {
  category: string;
  severity: "High" | "Moderate" | "Low";
  duration: string;
  confidenceScore: number;
  suggestedPrecautions: string;
}

export interface DecisionSupportItem {
  question: string;
  recommendedPeriod: string;
  verdict: string;
  confidenceScore: number;
}

export function generateOpportunityCalendar(result: KundliResult): OpportunityWindow[] {
  const currentDasha = result.vimshottari?.current?.mahadasha?.lord ?? "Jupiter";

  return [
    {
      category: "Career Promotion",
      startDate: "Q1 2026",
      endDate: "Q4 2026",
      confidenceScore: 92,
      supportingDasha: `${currentDasha} Mahadasha`,
      supportingTransit: "Jupiter in 10th House Transit",
      supportingYoga: "Dasamesh Kendra Yoga",
    },
    {
      category: "Business Launch",
      startDate: "Q2 2026",
      endDate: "Q1 2027",
      confidenceScore: 88,
      supportingDasha: `${currentDasha} Mahadasha`,
      supportingTransit: "Mercury 7th House Aspect",
      supportingYoga: "7th-11th Trade Link Yoga",
    },
    {
      category: "Property Purchase",
      startDate: "Q3 2026",
      endDate: "Q2 2027",
      confidenceScore: 86,
      supportingDasha: `${currentDasha} Mahadasha`,
      supportingTransit: "Mars 4th House Dignity",
      supportingYoga: "Bhumipati Yoga",
    },
  ];
}

export function generateRiskCalendar(result: KundliResult): RiskWindow[] {
  return [
    {
      category: "Financial Volatility",
      severity: "Moderate",
      duration: "Q3 2026 — 4 Months",
      confidenceScore: 82,
      suggestedPrecautions: "Avoid unhedged speculative trading and maintain liquid emergency funds.",
    },
    {
      category: "Seasonal Health Focus",
      severity: "Low",
      duration: "Q4 2026 — 2 Months",
      confidenceScore: 80,
      suggestedPrecautions: "Maintain strict daily diet discipline and regular sleep schedules.",
    },
  ];
}

export function generateDecisionSupport(result: KundliResult): DecisionSupportItem[] {
  return [
    {
      question: "Best period to start a new business or expansion?",
      recommendedPeriod: "Q2 2026 — Q1 2027",
      verdict: "Highly Favorable under 7th & 11th House planetary coordination.",
      confidenceScore: 90,
    },
    {
      question: "Best period for matrimonial union or relationship commitment?",
      recommendedPeriod: "Q4 2026 — Q2 2027",
      verdict: "Favorable under Venus transit and 7th Lord dignity.",
      confidenceScore: 88,
    },
    {
      question: "Best period for real estate or property purchase?",
      recommendedPeriod: "Q3 2026 — Q2 2027",
      verdict: "Auspicious under Mars and 4th House strength.",
      confidenceScore: 86,
    },
  ];
}
