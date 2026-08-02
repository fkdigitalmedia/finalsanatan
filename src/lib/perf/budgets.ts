// ============================================================
// Performance budgets — Phase 15.2 targets
// ------------------------------------------------------------
// Single source of truth for the numbers the dashboard grades
// against. Kept in a plain module so both the UI and the tests
// read the same values.
// ============================================================

export interface Budget {
  key: string;
  label: string;
  /** Target in milliseconds. */
  targetMs: number;
  /** Anything above this is red on the dashboard. */
  criticalMs: number;
}

export const BUDGETS: Budget[] = [
  { key: "homepage", label: "Homepage load", targetMs: 1500, criticalMs: 3000 },
  { key: "tool-page", label: "Tool page load", targetMs: 2000, criticalMs: 4000 },
  { key: "api", label: "API average", targetMs: 300, criticalMs: 800 },
  { key: "api-cached", label: "Cached API", targetMs: 100, criticalMs: 300 },
  { key: "pdf", label: "PDF generation", targetMs: 10_000, criticalMs: 20_000 },
  { key: "ai", label: "AI response", targetMs: 8000, criticalMs: 20_000 },
];

export type BudgetVerdict = "ok" | "warn" | "critical" | "unknown";

export function gradeBudget(budget: Budget, actualMs: number | null): BudgetVerdict {
  if (actualMs == null || actualMs <= 0) return "unknown";
  if (actualMs <= budget.targetMs) return "ok";
  if (actualMs <= budget.criticalMs) return "warn";
  return "critical";
}

export function budgetByKey(key: string): Budget | undefined {
  return BUDGETS.find((b) => b.key === key);
}
