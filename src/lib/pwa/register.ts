/**
 * PWA service worker registration wrapper.
 *
 * Registration is gated behind BOTH:
 *  1. Production build (never in dev / Lovable preview / iframe).
 *  2. Admin-controlled localStorage flag `sanatan-pwa-cache-enabled` === "1".
 *
 * Admins toggle the flag from /admin/pwa. Users can force-off with `?sw=off`.
 */

const SW_URL = "/sw.js";
const FLAG_KEY = "sanatan-pwa-cache-enabled";

function isRefusedContext(): boolean {
  if (typeof window === "undefined") return true;
  if (!import.meta.env.PROD) return true;
  try {
    if (window.self !== window.top) return true;
  } catch {
    return true;
  }
  const host = window.location.hostname;
  if (
    host.startsWith("id-preview--") ||
    host.startsWith("preview--") ||
    host === "lovableproject.com" ||
    host.endsWith(".lovableproject.com") ||
    host === "lovableproject-dev.com" ||
    host.endsWith(".lovableproject-dev.com") ||
    host === "beta.lovable.dev" ||
    host.endsWith(".beta.lovable.dev")
  ) {
    return true;
  }
  if (new URLSearchParams(window.location.search).get("sw") === "off") return true;
  return false;
}

async function unregisterAppSW() {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
  const regs = await navigator.serviceWorker.getRegistrations();
  await Promise.allSettled(
    regs
      .filter((r) => {
        const url = r.active?.scriptURL || r.installing?.scriptURL || r.waiting?.scriptURL || "";
        return url.endsWith(SW_URL);
      })
      .map((r) => r.unregister()),
  );
}

export function isCacheEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(FLAG_KEY) === "1";
  } catch {
    return false;
  }
}

export async function enableCache() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FLAG_KEY, "1");
  await registerPwa();
}

export async function disableCache() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FLAG_KEY, "0");
  await unregisterAppSW();
}

export async function clearAllCaches() {
  if (typeof window === "undefined" || !("caches" in window)) return;
  const names = await caches.keys();
  await Promise.allSettled(names.map((n) => caches.delete(n)));
}

export async function registerPwa() {
  if (isRefusedContext()) {
    await unregisterAppSW();
    return;
  }
  if (!isCacheEnabled()) {
    await unregisterAppSW();
    return;
  }
  if (!("serviceWorker" in navigator)) return;
  try {
    await navigator.serviceWorker.register(SW_URL, { scope: "/" });
  } catch (err) {
    console.warn("[pwa] register failed", err);
  }
}
