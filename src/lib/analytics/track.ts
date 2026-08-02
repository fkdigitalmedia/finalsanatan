/**
 * Client-safe analytics tracker.
 * Batches events and flushes to `/api/public/track` (max ~2s or 20 events).
 * Respects `sanatan-analytics-opt-out` in localStorage. Never blocks UI.
 */

const OPT_OUT_KEY = "sanatan-analytics-opt-out";
const SESSION_KEY = "sanatan-sid";
const SESSION_TTL_MS = 30 * 60 * 1000; // 30 min inactivity => new session

type TrackEvent = {
  event_name: string;
  session_id: string;
  user_id?: string | null;
  tool_slug?: string | null;
  category?: string | null;
  path?: string | null;
  referrer?: string | null;
  lang?: string | null;
  device?: string | null;
  browser?: string | null;
  os?: string | null;
  screen?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  meta?: Record<string, unknown>;
};

let queue: TrackEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function optedOut(): boolean {
  if (!isBrowser()) return true;
  try {
    return window.localStorage.getItem(OPT_OUT_KEY) === "1";
  } catch {
    return false;
  }
}

function getSessionId(): string {
  if (!isBrowser()) return "server";
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    const now = Date.now();
    if (raw) {
      const parsed = JSON.parse(raw) as { id: string; t: number };
      if (now - parsed.t < SESSION_TTL_MS) {
        parsed.t = now;
        window.localStorage.setItem(SESSION_KEY, JSON.stringify(parsed));
        return parsed.id;
      }
    }
    const id =
      (crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)) + Date.now().toString(36);
    window.localStorage.setItem(SESSION_KEY, JSON.stringify({ id, t: now }));
    return id;
  } catch {
    return "anon-" + Date.now().toString(36);
  }
}

function detectDevice(): string {
  if (!isBrowser()) return "unknown";
  const ua = navigator.userAgent;
  if (/Tablet|iPad/i.test(ua)) return "tablet";
  if (/Mobile|Android|iPhone/i.test(ua)) return "mobile";
  return "desktop";
}

function detectBrowser(): string {
  if (!isBrowser()) return "unknown";
  const ua = navigator.userAgent;
  if (/Edg\//.test(ua)) return "Edge";
  if (/OPR\//.test(ua)) return "Opera";
  if (/Chrome\//.test(ua)) return "Chrome";
  if (/Firefox\//.test(ua)) return "Firefox";
  if (/Safari\//.test(ua) && !/Chrome/.test(ua)) return "Safari";
  return "Other";
}

function detectOs(): string {
  if (!isBrowser()) return "unknown";
  const ua = navigator.userAgent;
  if (/Windows/i.test(ua)) return "Windows";
  if (/Mac OS X/i.test(ua)) return "macOS";
  if (/Android/i.test(ua)) return "Android";
  if (/iPhone|iPad|iOS/i.test(ua)) return "iOS";
  if (/Linux/i.test(ua)) return "Linux";
  return "Other";
}

function detectLang(): string | null {
  if (!isBrowser()) return null;
  try {
    return document.documentElement.lang || navigator.language || null;
  } catch {
    return null;
  }
}

function getUtms(): {
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
} {
  if (!isBrowser()) return {};
  try {
    const p = new URLSearchParams(window.location.search);
    return {
      utm_source: p.get("utm_source"),
      utm_medium: p.get("utm_medium"),
      utm_campaign: p.get("utm_campaign"),
    };
  } catch {
    return {};
  }
}

function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = setTimeout(flush, 2000);
}

async function flush() {
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  if (!queue.length) return;
  const batch = queue.splice(0, queue.length);
  try {
    const body = JSON.stringify({ events: batch });
    if (isBrowser() && "sendBeacon" in navigator) {
      const blob = new Blob([body], { type: "application/json" });
      const ok = navigator.sendBeacon("/api/public/track", blob);
      if (ok) return;
    }
    await fetch("/api/public/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    });
  } catch (err) {
    // best-effort; drop silently
    if (typeof console !== "undefined") console.warn("[track] flush failed", err);
  }
}

export function track(event_name: string, overrides: Partial<TrackEvent> = {}): void {
  if (!isBrowser() || optedOut()) return;

  const utms = getUtms();
  const evt: TrackEvent = {
    event_name,
    session_id: getSessionId(),
    path: overrides.path ?? window.location.pathname + window.location.search,
    referrer: overrides.referrer ?? (document.referrer || null),
    lang: overrides.lang ?? detectLang(),
    device: overrides.device ?? detectDevice(),
    browser: overrides.browser ?? detectBrowser(),
    os: overrides.os ?? detectOs(),
    screen: overrides.screen ?? `${window.innerWidth}x${window.innerHeight}`,
    utm_source: overrides.utm_source ?? utms.utm_source ?? null,
    utm_medium: overrides.utm_medium ?? utms.utm_medium ?? null,
    utm_campaign: overrides.utm_campaign ?? utms.utm_campaign ?? null,
    tool_slug: overrides.tool_slug ?? null,
    category: overrides.category ?? null,
    user_id: overrides.user_id ?? null,
    meta: overrides.meta ?? {},
  };
  queue.push(evt);
  if (queue.length >= 20) {
    void flush();
  } else {
    scheduleFlush();
  }
}

/** Flush on page hide (best-effort). Called by AnalyticsTracker. */
export function flushOnHide() {
  if (!isBrowser()) return;
  void flush();
}

/** Set analytics opt-out (privacy). */
export function setAnalyticsOptOut(opt: boolean) {
  if (!isBrowser()) return;
  try {
    if (opt) window.localStorage.setItem(OPT_OUT_KEY, "1");
    else window.localStorage.removeItem(OPT_OUT_KEY);
  } catch {
    /* noop */
  }
}

export function isOptedOut(): boolean {
  return optedOut();
}
