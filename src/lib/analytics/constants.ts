/**
 * Analytics constants — event names, cache TTLs, retention windows,
 * funnel definition and dashboard registry.
 * Everything here is data, not logic, so new tools/features only add entries.
 */

export const ANALYTICS_VERSION = "14.9.0";

/** Canonical event names. Feature code should use `EVENTS.*`, never a literal. */
export const EVENTS = {
  PAGEVIEW: "pageview",
  USER_REGISTERED: "user_registered",
  LOGIN: "login",
  LOGOUT: "logout",
  TOOL_VIEW: "tool_view",
  TOOL_USED: "tool_used",
  TOOL_FAILED: "tool_failed",
  SEARCH: "search",
  KUNDLI_GENERATED: "kundli_generated",
  HOROSCOPE_GENERATED: "horoscope_generated",
  PDF_GENERATED: "pdf_generated",
  AI_REPORT_GENERATED: "ai_report_generated",
  SUBSCRIPTION_PURCHASE: "subscription_purchase",
  SUBSCRIPTION_RENEWAL: "subscription_renewal",
  COUPON_USED: "coupon_used",
  PAYMENT_SUCCESS: "payment_success",
  PAYMENT_FAILURE: "payment_failure",
  DOWNLOAD: "download",
  LANGUAGE_CHANGE: "language_change",
  THEME_CHANGE: "theme_change",
  NOTIFICATION_OPEN: "notification_open",
  NOTIFICATION_CLICK: "notification_click",
  API_CALL: "api_call",
  JS_ERROR: "js_error",
  WEB_VITAL: "web_vital",
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];

/** Events that represent a successful "conversion" of a tool run. */
export const GENERATION_EVENTS: string[] = [
  EVENTS.TOOL_USED,
  EVENTS.KUNDLI_GENERATED,
  EVENTS.HOROSCOPE_GENERATED,
  EVENTS.AI_REPORT_GENERATED,
  EVENTS.PDF_GENERATED,
];

export const REVENUE_EVENTS: string[] = [
  EVENTS.SUBSCRIPTION_PURCHASE,
  EVENTS.SUBSCRIPTION_RENEWAL,
  EVENTS.PAYMENT_SUCCESS,
];

/** Retention measurement windows (days). */
export const RETENTION_WINDOWS = [1, 7, 30, 90, 180, 365] as const;

/** Default acquisition → revenue funnel. Configurable per query. */
export const DEFAULT_FUNNEL: { key: string; label: string; events: string[] }[] = [
  { key: "visitor", label: "Visitor", events: [EVENTS.PAGEVIEW] },
  { key: "registration", label: "Registration", events: [EVENTS.USER_REGISTERED, EVENTS.LOGIN] },
  { key: "first_tool", label: "First Tool Usage", events: GENERATION_EVENTS },
  { key: "first_pdf", label: "First PDF", events: [EVENTS.PDF_GENERATED, EVENTS.DOWNLOAD] },
  {
    key: "premium",
    label: "Premium Upgrade",
    events: [EVENTS.SUBSCRIPTION_PURCHASE, EVENTS.PAYMENT_SUCCESS],
  },
  { key: "renewal", label: "Renewal", events: [EVENTS.SUBSCRIPTION_RENEWAL] },
];

/** Cache TTLs (ms) per query family. */
export const CACHE_TTL = {
  live: 10_000,
  overview: 60_000,
  timeseries: 120_000,
  breakdown: 120_000,
  funnel: 300_000,
  cohort: 600_000,
  retention: 600_000,
  revenue: 300_000,
  seo: 600_000,
} as const;

/** Dashboards exposed by the admin console. */
export const DASHBOARDS = [
  { key: "overview", label: "Overview", description: "Platform-wide KPIs and trends" },
  { key: "realtime", label: "Realtime", description: "Live users, tools and AI requests" },
  { key: "users", label: "Users", description: "Acquisition, activity and geography" },
  { key: "tools", label: "Tools", description: "Per-tool usage, failures and conversions" },
  { key: "ai", label: "AI", description: "Provider usage, tokens, latency and cost" },
  { key: "seo", label: "SEO", description: "Organic traffic, landing pages and queries" },
  { key: "revenue", label: "Revenue", description: "MRR, ARR, AOV, refunds and gateways" },
  { key: "funnels", label: "Funnels", description: "Visitor to renewal conversion path" },
  { key: "cohorts", label: "Cohorts", description: "Weekly signup cohorts" },
  { key: "retention", label: "Retention", description: "1/7/30/90/180/365-day retention" },
  { key: "notifications", label: "Notifications", description: "Delivery, open and click rates" },
  { key: "performance", label: "Performance", description: "Core Web Vitals and JS errors" },
] as const;

/** Maximum rows a single export may contain. */
export const MAX_EXPORT_ROWS = 50_000;
/** Maximum rows fetched for in-memory aggregation. */
export const MAX_SCAN_ROWS = 50_000;
