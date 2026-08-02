/**
 * Report builder — turns any dashboard payload into flat, exportable tables,
 * and evaluates saved alert rules.
 */

import { listMetrics } from "./metrics";
import { listEvents } from "./events";
import type { AnalyticsFilters, DateRange, Sb } from "./types";
import { getOverview } from "./dashboard";
import { getRevenueAnalytics } from "./revenue";
import { getToolAnalytics, getUserAnalytics } from "./users";
import { getAiAnalytics } from "./ai";
import { getSeoAnalytics } from "./seo";
import { getFunnel } from "./funnels";
import { getRetention } from "./retention";
import { getCohorts } from "./cohorts";

export interface ReportTable {
  key: string;
  title: string;
  columns: string[];
  rows: Record<string, unknown>[];
}

export const REPORT_TYPES = [
  "overview",
  "users",
  "tools",
  "ai",
  "seo",
  "revenue",
  "funnel",
  "retention",
  "cohorts",
  "metrics_dictionary",
  "event_catalog",
] as const;

export type ReportType = (typeof REPORT_TYPES)[number];

export async function buildReport(
  sb: Sb,
  type: ReportType,
  range: DateRange,
  filters: AnalyticsFilters = {},
): Promise<ReportTable> {
  switch (type) {
    case "users": {
      const u = await getUserAnalytics(sb, range, filters);
      return {
        key: "users",
        title: "User Analytics",
        columns: ["metric", "value"],
        rows: Object.entries(u.totals).map(([metric, value]) => ({ metric, value })),
      };
    }
    case "tools": {
      const tools = await getToolAnalytics(sb, range, filters);
      return {
        key: "tools",
        title: "Tool Analytics",
        columns: [
          "tool",
          "views",
          "generations",
          "failures",
          "avgExecutionMs",
          "downloads",
          "premiumConversions",
          "successRate",
        ],
        rows: tools as unknown as Record<string, unknown>[],
      };
    }
    case "ai": {
      const ai = await getAiAnalytics(sb, range, filters);
      return {
        key: "ai",
        title: "AI Analytics",
        columns: ["provider", "requests", "share_pct"],
        rows: ai.byProvider.map((p) => ({ provider: p.key, requests: p.value, share_pct: p.pct })),
      };
    }
    case "seo": {
      const seo = await getSeoAnalytics(sb, range, filters);
      return {
        key: "seo",
        title: "SEO — Top Pages",
        columns: ["page", "pageviews", "share_pct"],
        rows: seo.topPages.map((p) => ({ page: p.key, pageviews: p.value, share_pct: p.pct })),
      };
    }
    case "revenue": {
      const r = await getRevenueAnalytics(sb, range);
      return {
        key: "revenue",
        title: "Revenue Analytics",
        columns: ["metric", "value"],
        rows: [
          { metric: "gross", value: r.gross },
          { metric: "net", value: r.net },
          { metric: "refunds", value: r.refunds },
          { metric: "orders", value: r.orders },
          { metric: "aov", value: r.aov },
          { metric: "mrr", value: r.mrr },
          { metric: "arr", value: r.arr },
          { metric: "ltv", value: r.ltv },
          { metric: "coupon_discount", value: r.couponDiscount },
          { metric: "payment_failure_rate", value: r.paymentFailureRate },
        ],
      };
    }
    case "funnel": {
      const f = await getFunnel(sb, range, filters);
      return {
        key: "funnel",
        title: "Conversion Funnel",
        columns: ["step", "users", "stepPct", "overallPct", "dropOff"],
        rows: f.steps.map((s) => ({
          step: s.label,
          users: s.users,
          stepPct: s.stepPct,
          overallPct: s.overallPct,
          dropOff: s.dropOff,
        })),
      };
    }
    case "retention": {
      const r = await getRetention(sb, range, filters);
      return {
        key: "retention",
        title: "Retention",
        columns: ["windowDays", "cohortSize", "retained", "pct"],
        rows: r.windows as unknown as Record<string, unknown>[],
      };
    }
    case "cohorts": {
      const c = await getCohorts(sb, range, { filters });
      return {
        key: "cohorts",
        title: "Cohorts",
        columns: ["cohort", "size", ...Array.from({ length: c.periods }, (_, i) => `p${i}`)],
        rows: c.rows.map((row) => ({
          cohort: row.cohort,
          size: row.size,
          ...Object.fromEntries(row.pct.map((v, i) => [`p${i}`, v])),
        })),
      };
    }
    case "metrics_dictionary":
      return {
        key: "metrics_dictionary",
        title: "Metrics Dictionary",
        columns: ["key", "label", "group", "unit", "description"],
        rows: listMetrics() as unknown as Record<string, unknown>[],
      };
    case "event_catalog":
      return {
        key: "event_catalog",
        title: "Event Catalog",
        columns: ["name", "label", "group", "description"],
        rows: listEvents() as unknown as Record<string, unknown>[],
      };
    case "overview":
    default: {
      const o = await getOverview(sb, range, filters);
      return {
        key: "overview",
        title: "Overview",
        columns: ["metric", "value", "delta_pct"],
        rows: Object.entries(o.cards).map(([metric, kpi]) => ({
          metric,
          value: kpi.value,
          delta_pct: kpi.delta_pct,
        })),
      };
    }
  }
}
