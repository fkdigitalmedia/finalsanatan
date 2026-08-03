// ============================================================
// Mini Phase — Dynamic Credit Rules Engine API
// Comprehensive service layer with DB / LocalStorage persistence
// ============================================================

import type { CreditRuleAuditLog, DynamicCreditRule } from "./credit-rules-types";

const RULES_STORAGE_KEY = "sanatan_dynamic_credit_rules_v1";
const LOGS_STORAGE_KEY = "sanatan_credit_rule_audit_logs_v1";

const DEFAULT_RULES: DynamicCreditRule[] = [
  {
    id: "rule-1",
    featureKey: "kundli_pdf",
    featureName: "Janam Kundli Full PDF Report",
    category: "Kundli Reports",
    description: "Complete 25+ page Janam Kundli PDF with Dasha, Charts & Remedies.",
    creditsRequired: 10,
    dailyLimit: 20,
    monthlyLimit: 100,
    isEnabled: true,
    unlimitedInPlans: ["pro", "lifetime"],
    updatedAt: new Date().toISOString(),
    updatedBy: "System Default",
  },
  {
    id: "rule-2",
    featureKey: "matching_report",
    featureName: "Ashtakoot Matchmaking Report",
    category: "Matchmaking",
    description: "36 Gunas Ashtakoot & Nadi Milan Compatibility PDF Report.",
    creditsRequired: 8,
    dailyLimit: 15,
    monthlyLimit: 50,
    isEnabled: true,
    unlimitedInPlans: ["pro", "lifetime"],
    updatedAt: new Date().toISOString(),
    updatedBy: "System Default",
  },
  {
    id: "rule-3",
    featureKey: "career_report",
    featureName: "Career & Business Kundli Report",
    category: "Kundli Reports",
    description: "10th House analysis, wealth yoga indicators & career guidance.",
    creditsRequired: 5,
    dailyLimit: 10,
    monthlyLimit: 40,
    isEnabled: true,
    unlimitedInPlans: ["lifetime"],
    updatedAt: new Date().toISOString(),
    updatedBy: "System Default",
  },
  {
    id: "rule-4",
    featureKey: "marriage_report",
    featureName: "Marriage & Relationship Report",
    category: "Kundli Reports",
    description: "7th House Analysis, Vivah Yog timing & Spouse traits.",
    creditsRequired: 5,
    dailyLimit: 10,
    monthlyLimit: 40,
    isEnabled: true,
    unlimitedInPlans: ["lifetime"],
    updatedAt: new Date().toISOString(),
    updatedBy: "System Default",
  },
  {
    id: "rule-5",
    featureKey: "varshphal_pdf",
    featureName: "Varshphal Annual Solar Return PDF",
    category: "Kundli Reports",
    description: "1-Year Annual Forecast PDF report with Tajika Yogas.",
    creditsRequired: 12,
    dailyLimit: 5,
    monthlyLimit: 25,
    isEnabled: true,
    unlimitedInPlans: ["lifetime"],
    updatedAt: new Date().toISOString(),
    updatedBy: "System Default",
  },
  {
    id: "rule-6",
    featureKey: "ai_chat",
    featureName: "AI Jyotish Assistant Consultation",
    category: "AI Jyotish Assistant",
    description: "Interactive AI consultation per prompt/response.",
    creditsRequired: 1,
    dailyLimit: 100,
    monthlyLimit: 500,
    isEnabled: true,
    unlimitedInPlans: ["pro", "lifetime"],
    updatedAt: new Date().toISOString(),
    updatedBy: "System Default",
  },
  {
    id: "rule-7",
    featureKey: "family_astrology_report",
    featureName: "Combined Family Astrology Report",
    category: "Family Astrology",
    description: "Multi-member combined family astrology & transit PDF report.",
    creditsRequired: 15,
    dailyLimit: 5,
    monthlyLimit: 20,
    isEnabled: true,
    unlimitedInPlans: ["agency"],
    updatedAt: new Date().toISOString(),
    updatedBy: "System Default",
  },
  {
    id: "rule-8",
    featureKey: "numerology_report",
    featureName: "Full Numerology Life Analysis",
    category: "Numerology",
    description: "Life Path, Expression & Name Vibration Numerology Report.",
    creditsRequired: 4,
    dailyLimit: 20,
    monthlyLimit: 100,
    isEnabled: true,
    unlimitedInPlans: ["pro", "lifetime"],
    updatedAt: new Date().toISOString(),
    updatedBy: "System Default",
  },
];

function loadStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveStorage<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore
  }
}

// ------------------------------------------------------------
// API Service Methods
// ------------------------------------------------------------

export async function fetchCreditRules(): Promise<DynamicCreditRule[]> {
  return loadStorage<DynamicCreditRule[]>(RULES_STORAGE_KEY, DEFAULT_RULES);
}

export function getCreditCostForFeature(featureKey: string): {
  creditsRequired: number;
  dailyLimit: number;
  monthlyLimit: number;
  isEnabled: boolean;
} {
  const rules = loadStorage<DynamicCreditRule[]>(RULES_STORAGE_KEY, DEFAULT_RULES);
  const rule = rules.find((r) => r.featureKey === featureKey);
  if (!rule) {
    return { creditsRequired: 5, dailyLimit: -1, monthlyLimit: -1, isEnabled: true };
  }
  return {
    creditsRequired: rule.creditsRequired,
    dailyLimit: rule.dailyLimit,
    monthlyLimit: rule.monthlyLimit,
    isEnabled: rule.isEnabled,
  };
}

export async function saveCreditRule(
  rule: DynamicCreditRule,
  changedBy: string = "Admin Superuser",
): Promise<DynamicCreditRule> {
  const rules = loadStorage<DynamicCreditRule[]>(RULES_STORAGE_KEY, DEFAULT_RULES);
  const existing = rules.find((r) => r.id === rule.id || r.featureKey === rule.featureKey);

  const previousCost = existing ? existing.creditsRequired : 0;
  const previousStatus = existing ? existing.isEnabled : true;

  const updatedRule: DynamicCreditRule = {
    ...rule,
    updatedAt: new Date().toISOString(),
    updatedBy: changedBy,
  };

  const updatedRules = existing
    ? rules.map((r) => (r.id === rule.id || r.featureKey === rule.featureKey ? updatedRule : r))
    : [...rules, updatedRule];

  saveStorage(RULES_STORAGE_KEY, updatedRules);

  // Add audit log
  const logs = loadStorage<CreditRuleAuditLog[]>(LOGS_STORAGE_KEY, []);
  const newLog: CreditRuleAuditLog = {
    id: `log-rule-${Date.now()}`,
    featureKey: rule.featureKey,
    featureName: rule.featureName,
    previousCost,
    newCost: rule.creditsRequired,
    previousStatus,
    newStatus: rule.isEnabled,
    changedBy,
    timestamp: new Date().toISOString(),
  };

  saveStorage(LOGS_STORAGE_KEY, [newLog, ...logs]);

  return updatedRule;
}

export async function fetchCreditRuleAuditLogs(): Promise<CreditRuleAuditLog[]> {
  return loadStorage<CreditRuleAuditLog[]>(LOGS_STORAGE_KEY, []);
}
