/**
 * Event registry — the modularity contract of the analytics platform.
 *
 * Any new tool, report, AI module or feature registers its events here (or at
 * runtime via `registerEvents`) and immediately appears in the admin metrics
 * dictionary, exports and dashboards without touching dashboard code.
 */

import { EVENTS } from "./constants";

export interface EventDefinition {
  name: string;
  label: string;
  group: "user" | "tool" | "content" | "revenue" | "ai" | "system" | "notification";
  description: string;
  /** Keys expected inside `meta` for this event. Documentation + validation. */
  metaKeys?: string[];
  /** Counts towards conversion funnels / value metrics. */
  conversion?: boolean;
}

const CORE_EVENTS: EventDefinition[] = [
  {
    name: EVENTS.PAGEVIEW,
    label: "Pageview",
    group: "content",
    description: "A page was rendered.",
  },
  {
    name: EVENTS.USER_REGISTERED,
    label: "User Registration",
    group: "user",
    description: "New account created.",
    conversion: true,
  },
  { name: EVENTS.LOGIN, label: "Login", group: "user", description: "User signed in." },
  { name: EVENTS.LOGOUT, label: "Logout", group: "user", description: "User signed out." },
  {
    name: EVENTS.TOOL_VIEW,
    label: "Tool View",
    group: "tool",
    description: "A tool page was opened.",
    metaKeys: ["tool"],
  },
  {
    name: EVENTS.TOOL_USED,
    label: "Tool Used",
    group: "tool",
    description: "A tool produced a result.",
    metaKeys: ["tool", "ms"],
    conversion: true,
  },
  {
    name: EVENTS.TOOL_FAILED,
    label: "Tool Failure",
    group: "tool",
    description: "A tool run failed.",
    metaKeys: ["tool", "error"],
  },
  {
    name: EVENTS.SEARCH,
    label: "Search",
    group: "content",
    description: "Internal site search.",
    metaKeys: ["q", "n"],
  },
  {
    name: EVENTS.KUNDLI_GENERATED,
    label: "Kundli Generated",
    group: "tool",
    description: "Birth chart computed.",
    conversion: true,
  },
  {
    name: EVENTS.HOROSCOPE_GENERATED,
    label: "Horoscope Generated",
    group: "tool",
    description: "Horoscope produced.",
    conversion: true,
  },
  {
    name: EVENTS.PDF_GENERATED,
    label: "PDF Generated",
    group: "tool",
    description: "A PDF report was rendered.",
    metaKeys: ["template", "pages", "ms"],
    conversion: true,
  },
  {
    name: EVENTS.AI_REPORT_GENERATED,
    label: "AI Report",
    group: "ai",
    description: "AI narration produced.",
    metaKeys: ["provider", "model", "tokens"],
    conversion: true,
  },
  {
    name: EVENTS.SUBSCRIPTION_PURCHASE,
    label: "Subscription Purchase",
    group: "revenue",
    description: "New paid subscription.",
    metaKeys: ["plan", "amount", "currency"],
    conversion: true,
  },
  {
    name: EVENTS.SUBSCRIPTION_RENEWAL,
    label: "Subscription Renewal",
    group: "revenue",
    description: "Recurring charge succeeded.",
    conversion: true,
  },
  {
    name: EVENTS.COUPON_USED,
    label: "Coupon Used",
    group: "revenue",
    description: "Discount code redeemed.",
    metaKeys: ["code", "discount"],
  },
  {
    name: EVENTS.PAYMENT_SUCCESS,
    label: "Payment Success",
    group: "revenue",
    description: "Payment captured.",
    metaKeys: ["gateway", "amount"],
    conversion: true,
  },
  {
    name: EVENTS.PAYMENT_FAILURE,
    label: "Payment Failure",
    group: "revenue",
    description: "Payment declined or errored.",
    metaKeys: ["gateway", "reason"],
  },
  {
    name: EVENTS.DOWNLOAD,
    label: "Download",
    group: "tool",
    description: "A generated asset was downloaded.",
    metaKeys: ["kind"],
  },
  {
    name: EVENTS.LANGUAGE_CHANGE,
    label: "Language Change",
    group: "user",
    description: "UI language switched.",
    metaKeys: ["from", "to"],
  },
  {
    name: EVENTS.THEME_CHANGE,
    label: "Theme Change",
    group: "user",
    description: "Light/dark toggled.",
    metaKeys: ["theme"],
  },
  {
    name: EVENTS.NOTIFICATION_OPEN,
    label: "Notification Open",
    group: "notification",
    description: "Notification opened.",
    metaKeys: ["template", "channel"],
  },
  {
    name: EVENTS.NOTIFICATION_CLICK,
    label: "Notification Click",
    group: "notification",
    description: "Notification CTA clicked.",
    metaKeys: ["template", "channel"],
  },
  {
    name: EVENTS.API_CALL,
    label: "API Call",
    group: "system",
    description: "Public API request.",
    metaKeys: ["endpoint", "status", "ms"],
  },
  {
    name: EVENTS.JS_ERROR,
    label: "JS Error",
    group: "system",
    description: "Client-side exception.",
    metaKeys: ["message", "kind"],
  },
  {
    name: EVENTS.WEB_VITAL,
    label: "Web Vital",
    group: "system",
    description: "Core Web Vitals sample.",
    metaKeys: ["name", "value", "rating"],
  },
];

const registry = new Map<string, EventDefinition>(CORE_EVENTS.map((e) => [e.name, e]));

/** Register (or override) event definitions at runtime — used by feature modules. */
export function registerEvents(defs: EventDefinition[]): void {
  for (const def of defs) registry.set(def.name, def);
}

export function listEvents(): EventDefinition[] {
  return [...registry.values()].sort(
    (a, b) => a.group.localeCompare(b.group) || a.name.localeCompare(b.name),
  );
}

export function getEvent(name: string): EventDefinition | undefined {
  return registry.get(name);
}

export function isKnownEvent(name: string): boolean {
  return registry.has(name);
}

/** Unknown events are still ingested; this labels them nicely in dashboards. */
export function labelFor(name: string): string {
  return (
    registry.get(name)?.label ?? name.replace(/[_.]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

export function conversionEvents(): string[] {
  return listEvents()
    .filter((e) => e.conversion)
    .map((e) => e.name);
}
