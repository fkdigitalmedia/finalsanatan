/**
 * Typed tracking helpers. Browser-safe.
 * Thin, semantic wrappers over the low-level batching tracker in `track.ts`
 * so feature code never types raw event-name strings.
 */

import { track } from "./track";
import { EVENTS } from "./constants";

type Meta = Record<string, unknown>;

interface Common {
  userId?: string | null;
  toolSlug?: string | null;
  category?: string | null;
  meta?: Meta;
}

function emit(name: string, c: Common = {}) {
  track(name, {
    user_id: c.userId ?? null,
    tool_slug: c.toolSlug ?? null,
    category: c.category ?? null,
    meta: c.meta ?? {},
  });
}

export const analytics = {
  event: emit,

  // --- user lifecycle -----------------------------------------------------
  registered: (userId: string, method = "email") =>
    emit(EVENTS.USER_REGISTERED, { userId, meta: { method } }),
  loggedIn: (userId: string, method = "email") => emit(EVENTS.LOGIN, { userId, meta: { method } }),
  loggedOut: (userId?: string | null) => emit(EVENTS.LOGOUT, { userId }),
  languageChanged: (from: string, to: string) =>
    emit(EVENTS.LANGUAGE_CHANGE, { meta: { from, to } }),
  themeChanged: (theme: string) => emit(EVENTS.THEME_CHANGE, { meta: { theme } }),

  // --- tools --------------------------------------------------------------
  toolViewed: (tool: string, category?: string) =>
    emit(EVENTS.TOOL_VIEW, { toolSlug: tool, category }),
  toolUsed: (
    tool: string,
    opts: { ms?: number; category?: string; userId?: string | null; meta?: Meta } = {},
  ) =>
    emit(EVENTS.TOOL_USED, {
      toolSlug: tool,
      category: opts.category,
      userId: opts.userId,
      meta: { ms: opts.ms ?? null, ...(opts.meta ?? {}) },
    }),
  toolFailed: (tool: string, error: string, meta: Meta = {}) =>
    emit(EVENTS.TOOL_FAILED, { toolSlug: tool, meta: { error: error.slice(0, 300), ...meta } }),

  kundliGenerated: (meta: Meta = {}) => emit(EVENTS.KUNDLI_GENERATED, { toolSlug: "kundli", meta }),
  horoscopeGenerated: (period: string, meta: Meta = {}) =>
    emit(EVENTS.HOROSCOPE_GENERATED, { toolSlug: `horoscope-${period}`, meta }),
  pdfGenerated: (template: string, meta: Meta = {}) =>
    emit(EVENTS.PDF_GENERATED, { toolSlug: template, meta }),
  aiReportGenerated: (provider: string, model: string, meta: Meta = {}) =>
    emit(EVENTS.AI_REPORT_GENERATED, { meta: { provider, model, ...meta } }),
  downloaded: (kind: string, meta: Meta = {}) => emit(EVENTS.DOWNLOAD, { meta: { kind, ...meta } }),
  searched: (q: string, n: number) => emit(EVENTS.SEARCH, { meta: { q: q.slice(0, 200), n } }),

  // --- revenue ------------------------------------------------------------
  purchased: (plan: string, amount: number, currency: string, gateway: string) =>
    emit(EVENTS.SUBSCRIPTION_PURCHASE, { meta: { plan, amount, currency, gateway } }),
  renewed: (plan: string, amount: number, currency: string, gateway: string) =>
    emit(EVENTS.SUBSCRIPTION_RENEWAL, { meta: { plan, amount, currency, gateway } }),
  couponUsed: (code: string, discount: number) =>
    emit(EVENTS.COUPON_USED, { meta: { code, discount } }),
  paymentSucceeded: (gateway: string, amount: number, currency: string) =>
    emit(EVENTS.PAYMENT_SUCCESS, { meta: { gateway, amount, currency } }),
  paymentFailed: (gateway: string, reason: string) =>
    emit(EVENTS.PAYMENT_FAILURE, { meta: { gateway, reason: reason.slice(0, 200) } }),

  // --- notifications ------------------------------------------------------
  notificationOpened: (template: string, channel: string) =>
    emit(EVENTS.NOTIFICATION_OPEN, { meta: { template, channel } }),
  notificationClicked: (template: string, channel: string) =>
    emit(EVENTS.NOTIFICATION_CLICK, { meta: { template, channel } }),

  // --- system -------------------------------------------------------------
  apiCall: (endpoint: string, status: number, ms: number) =>
    emit(EVENTS.API_CALL, { meta: { endpoint, status, ms } }),
};

/** Time a promise and emit `tool_used` / `tool_failed` automatically. */
export async function withToolTracking<T>(
  tool: string,
  run: () => Promise<T>,
  opts: { category?: string; userId?: string | null; meta?: Meta } = {},
): Promise<T> {
  const started = Date.now();
  try {
    const result = await run();
    analytics.toolUsed(tool, { ms: Date.now() - started, ...opts });
    return result;
  } catch (err) {
    analytics.toolFailed(tool, err instanceof Error ? err.message : String(err), {
      ms: Date.now() - started,
    });
    throw err;
  }
}

export { track } from "./track";
export { setAnalyticsOptOut, isOptedOut } from "./track";
