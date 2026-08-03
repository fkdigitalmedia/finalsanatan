// ============================================================
// Mini Phase — Dynamic Credit Rules Engine Types
// Enterprise-grade TypeScript models for dynamic credit costs
// ============================================================

export type FeatureCategory =
  | "Kundli Reports"
  | "AI Jyotish Assistant"
  | "Panchang Tools"
  | "Matchmaking"
  | "Numerology"
  | "Family Astrology"
  | "Remedies & Pujas";

export interface DynamicCreditRule {
  id: string;
  featureKey: string; // unique identifier (e.g. "kundli_pdf", "ai_chat")
  featureName: string; // human-readable name
  category: FeatureCategory;
  description: string;
  creditsRequired: number; // editable cost
  dailyLimit: number; // -1 for unlimited
  monthlyLimit: number; // -1 for unlimited
  isEnabled: boolean;
  unlimitedInPlans: string[]; // e.g. ["pro", "lifetime"]
  updatedAt: string;
  updatedBy: string;
}

export interface CreditRuleAuditLog {
  id: string;
  featureKey: string;
  featureName: string;
  previousCost: number;
  newCost: number;
  previousStatus: boolean;
  newStatus: boolean;
  changedBy: string;
  timestamp: string;
}
