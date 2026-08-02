/**
 * Analytics platform — public barrel.
 * Browser-safe: only pure helpers, types and query builders are re-exported.
 * Server-only alert/queue plumbing lives in the individual modules.
 */

export * from "./types";
export * from "./constants";
export * from "./events";
export * from "./metrics";
export * from "./validators";
export * from "./cache";
export * from "./engine";
export * from "./tracker";
export * from "./export";
export { track, flushOnHide, setAnalyticsOptOut, isOptedOut } from "./track";

export { getUserAnalytics, getToolAnalytics } from "./users";
export { getFunnel } from "./funnels";
export { getCohorts } from "./cohorts";
export { getRetention } from "./retention";
export { getRevenueAnalytics } from "./revenue";
export { getAiAnalytics } from "./ai";
export { getSeoAnalytics } from "./seo";
export { getPerformanceAnalytics } from "./performance";
export { getOverview, getRealtime, loadDashboard, dashboards } from "./dashboard";
export { buildReport, REPORT_TYPES, type ReportType, type ReportTable } from "./reports";
export { ALERT_KINDS, evaluateRule, evaluateAllRules, type AlertEvaluation } from "./alerts";
