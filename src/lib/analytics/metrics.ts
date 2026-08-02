/**
 * Metric dictionary + shared math helpers.
 * Dashboards read labels/units from here so no metric is hardcoded in UI.
 */

import type { MetricDefinition, Point } from "./types";

const METRICS: MetricDefinition[] = [
  // Users
  {
    key: "total_users",
    label: "Total Users",
    description: "All registered accounts.",
    unit: "count",
    group: "users",
    positive: true,
  },
  {
    key: "new_users",
    label: "New Users",
    description: "Accounts created in range.",
    unit: "count",
    group: "users",
    positive: true,
  },
  {
    key: "returning_users",
    label: "Returning Users",
    description: "Users with a prior session.",
    unit: "count",
    group: "users",
    positive: true,
  },
  {
    key: "dau",
    label: "Daily Active Users",
    description: "Distinct users active in a day.",
    unit: "count",
    group: "users",
    positive: true,
  },
  {
    key: "wau",
    label: "Weekly Active Users",
    description: "Distinct users active in 7 days.",
    unit: "count",
    group: "users",
    positive: true,
  },
  {
    key: "mau",
    label: "Monthly Active Users",
    description: "Distinct users active in 30 days.",
    unit: "count",
    group: "users",
    positive: true,
  },
  {
    key: "sessions",
    label: "Sessions",
    description: "Visits with a 30-minute inactivity window.",
    unit: "count",
    group: "users",
    positive: true,
  },
  {
    key: "avg_session_duration",
    label: "Avg Session Duration",
    description: "Mean time between first and last event.",
    unit: "seconds",
    group: "users",
    positive: true,
  },
  {
    key: "bounce_rate",
    label: "Bounce Rate",
    description: "Single-page sessions share.",
    unit: "percent",
    group: "users",
    positive: false,
  },
  {
    key: "pageviews",
    label: "Pageviews",
    description: "Rendered pages.",
    unit: "count",
    group: "content",
    positive: true,
  },
  // Tools
  {
    key: "tool_views",
    label: "Tool Views",
    description: "Tool pages opened.",
    unit: "count",
    group: "tools",
    positive: true,
  },
  {
    key: "tool_generations",
    label: "Generations",
    description: "Successful tool runs.",
    unit: "count",
    group: "tools",
    positive: true,
  },
  {
    key: "tool_failures",
    label: "Failures",
    description: "Failed tool runs.",
    unit: "count",
    group: "tools",
    positive: false,
  },
  {
    key: "tool_avg_ms",
    label: "Avg Execution",
    description: "Mean tool run time.",
    unit: "ms",
    group: "tools",
    positive: false,
  },
  {
    key: "tool_success_rate",
    label: "Success Rate",
    description: "Generations / (generations + failures).",
    unit: "percent",
    group: "tools",
    positive: true,
  },
  // AI
  {
    key: "ai_requests",
    label: "AI Requests",
    description: "Model calls logged.",
    unit: "count",
    group: "ai",
    positive: true,
  },
  {
    key: "ai_input_tokens",
    label: "Input Tokens",
    description: "Prompt tokens consumed.",
    unit: "tokens",
    group: "ai",
    positive: false,
  },
  {
    key: "ai_output_tokens",
    label: "Output Tokens",
    description: "Completion tokens produced.",
    unit: "tokens",
    group: "ai",
    positive: false,
  },
  {
    key: "ai_avg_tokens",
    label: "Avg Tokens / Request",
    description: "Mean total tokens.",
    unit: "tokens",
    group: "ai",
    positive: false,
  },
  {
    key: "ai_cost",
    label: "AI Cost",
    description: "Estimated provider spend.",
    unit: "currency",
    group: "ai",
    positive: false,
  },
  {
    key: "ai_latency",
    label: "AI Response Time",
    description: "Mean model latency.",
    unit: "ms",
    group: "ai",
    positive: false,
  },
  {
    key: "ai_failure_rate",
    label: "AI Failure Rate",
    description: "Failed calls share.",
    unit: "percent",
    group: "ai",
    positive: false,
  },
  {
    key: "ai_fallback_rate",
    label: "Fallback Usage",
    description: "Calls served by a fallback provider.",
    unit: "percent",
    group: "ai",
    positive: false,
  },
  // Revenue
  {
    key: "revenue",
    label: "Revenue",
    description: "Gross captured payments.",
    unit: "currency",
    group: "revenue",
    positive: true,
  },
  {
    key: "mrr",
    label: "MRR",
    description: "Monthly recurring revenue.",
    unit: "currency",
    group: "revenue",
    positive: true,
  },
  {
    key: "arr",
    label: "ARR",
    description: "MRR × 12.",
    unit: "currency",
    group: "revenue",
    positive: true,
  },
  {
    key: "aov",
    label: "Average Order Value",
    description: "Revenue / paid orders.",
    unit: "currency",
    group: "revenue",
    positive: true,
  },
  {
    key: "ltv",
    label: "Lifetime Revenue / User",
    description: "Total revenue per paying user.",
    unit: "currency",
    group: "revenue",
    positive: true,
  },
  {
    key: "refunds",
    label: "Refunds",
    description: "Refunded amount.",
    unit: "currency",
    group: "revenue",
    positive: false,
  },
  {
    key: "coupon_discount",
    label: "Coupon Discount",
    description: "Value given away via coupons.",
    unit: "currency",
    group: "revenue",
    positive: false,
  },
  {
    key: "payment_failure_rate",
    label: "Payment Failure Rate",
    description: "Failed / attempted payments.",
    unit: "percent",
    group: "revenue",
    positive: false,
  },
  // SEO + performance
  {
    key: "organic_visits",
    label: "Organic Visits",
    description: "Sessions from search engines.",
    unit: "count",
    group: "seo",
    positive: true,
  },
  {
    key: "indexed_pages",
    label: "Indexed Pages",
    description: "Distinct pages receiving traffic.",
    unit: "count",
    group: "seo",
    positive: true,
  },
  {
    key: "lcp",
    label: "LCP",
    description: "Largest Contentful Paint (p75).",
    unit: "ms",
    group: "performance",
    positive: false,
  },
  {
    key: "inp",
    label: "INP",
    description: "Interaction to Next Paint (p75).",
    unit: "ms",
    group: "performance",
    positive: false,
  },
  {
    key: "cls",
    label: "CLS",
    description: "Cumulative Layout Shift (p75).",
    unit: "count",
    group: "performance",
    positive: false,
  },
  {
    key: "js_errors",
    label: "JS Errors",
    description: "Client exceptions captured.",
    unit: "count",
    group: "performance",
    positive: false,
  },
  // Notifications
  {
    key: "notifications_sent",
    label: "Notifications Sent",
    description: "Successful deliveries.",
    unit: "count",
    group: "notifications",
    positive: true,
  },
  {
    key: "notification_open_rate",
    label: "Open Rate",
    description: "Opens / delivered.",
    unit: "percent",
    group: "notifications",
    positive: true,
  },
  {
    key: "notification_click_rate",
    label: "Click Rate",
    description: "Clicks / delivered.",
    unit: "percent",
    group: "notifications",
    positive: true,
  },
];

const byKey = new Map(METRICS.map((m) => [m.key, m]));

export function listMetrics(): MetricDefinition[] {
  return [...byKey.values()];
}

export function registerMetrics(defs: MetricDefinition[]): void {
  for (const d of defs) byKey.set(d.key, d);
}

export function getMetric(key: string): MetricDefinition | undefined {
  return byKey.get(key);
}

// --- math -------------------------------------------------------------------

export function deltaPct(current: number, previous: number): number | null {
  if (!Number.isFinite(current) || !Number.isFinite(previous)) return null;
  if (previous === 0) return current === 0 ? 0 : 100;
  return round(((current - previous) / previous) * 100, 1);
}

export function round(n: number, digits = 2): number {
  const f = 10 ** digits;
  return Math.round(n * f) / f;
}

export function safeDiv(a: number, b: number): number {
  return b === 0 ? 0 : a / b;
}

export function pctOf(part: number, total: number): number {
  return round(safeDiv(part, total) * 100, 1);
}

export function sum(values: number[]): number {
  return values.reduce((a, b) => a + b, 0);
}

export function mean(values: number[]): number {
  return values.length ? sum(values) / values.length : 0;
}

export function percentile(values: number[], p: number): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1));
  return sorted[idx];
}

/** Fill missing buckets with zeros so charts never show gaps. */
export function fillSeries(points: Point[], buckets: string[]): Point[] {
  const map = new Map(points.map((p) => [p.t, p.value]));
  return buckets.map((t) => ({ t, value: map.get(t) ?? 0 }));
}

export function formatMetric(
  value: number,
  unit: MetricDefinition["unit"],
  currency = "INR",
): string {
  switch (unit) {
    case "percent":
      return `${round(value, 1)}%`;
    case "seconds":
      return value >= 60
        ? `${Math.floor(value / 60)}m ${Math.round(value % 60)}s`
        : `${round(value, 1)}s`;
    case "ms":
      return value >= 1000 ? `${round(value / 1000, 2)}s` : `${Math.round(value)}ms`;
    case "currency":
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      }).format(value);
    case "tokens":
    case "count":
    default:
      return new Intl.NumberFormat("en-IN").format(Math.round(value * 100) / 100);
  }
}
