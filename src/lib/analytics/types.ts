/**
 * Shared analytics types. Browser-safe (types + interfaces only).
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type Sb = SupabaseClient<Database>;

export type Granularity = "hour" | "day" | "week" | "month";

export interface DateRange {
  from: Date;
  to: Date;
  days: number;
}

export interface RangeInput {
  from?: string;
  to?: string;
  days?: number;
}

/** Global dashboard filters. Every analytics query accepts these. */
export interface AnalyticsFilters {
  country?: string | null;
  lang?: string | null;
  device?: string | null;
  /** "all" | "guest" | "registered" | "premium" */
  userType?: string | null;
  planSlug?: string | null;
  tool?: string | null;
  aiProvider?: string | null;
}

export interface QueryInput extends RangeInput {
  filters?: AnalyticsFilters;
  granularity?: Granularity;
}

export interface Point {
  t: string;
  value: number;
}

export interface Series {
  key: string;
  label: string;
  points: Point[];
}

export interface BreakdownRow {
  key: string;
  label?: string;
  value: number;
  pct?: number;
}

export interface Kpi {
  value: number;
  delta_pct: number | null;
  unit?: MetricUnit;
}

export type MetricUnit = "count" | "percent" | "seconds" | "ms" | "currency" | "tokens";

export interface MetricDefinition {
  key: string;
  label: string;
  description: string;
  unit: MetricUnit;
  group: string;
  /** Higher is better? Used for delta colouring + alert direction. */
  positive?: boolean;
}

export interface FunnelStep {
  key: string;
  label: string;
  users: number;
  /** conversion from the previous step */
  stepPct: number;
  /** conversion from the first step */
  overallPct: number;
  dropOff: number;
}

export interface CohortRow {
  cohort: string;
  size: number;
  /** index = period offset (0 = signup period) */
  values: number[];
  pct: number[];
}

export interface RetentionSummary {
  windowDays: number;
  retained: number;
  cohortSize: number;
  pct: number;
}

export interface RevenueSummary {
  gross: number;
  net: number;
  refunds: number;
  currency: string;
  orders: number;
  aov: number;
  mrr: number;
  arr: number;
  ltv: number;
  couponDiscount: number;
  byGateway: BreakdownRow[];
  byPlan: BreakdownRow[];
  timeseries: Point[];
}

export interface ToolStat {
  tool: string;
  views: number;
  generations: number;
  failures: number;
  avgExecutionMs: number;
  downloads: number;
  premiumConversions: number;
  successRate: number;
}

export interface AlertRule {
  id: string;
  rule_name: string;
  kind: string;
  condition: Record<string, unknown>;
  threshold: number | null;
  channel: string;
  enabled: boolean;
  last_triggered_at: string | null;
}

export interface ExportRequest {
  format: "csv" | "json" | "xlsx" | "pdf";
  filename: string;
  columns: string[];
  rows: Record<string, unknown>[];
  title?: string;
}
