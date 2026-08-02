/**
 * Mounts in the root layout. Fires `pageview` on every route change,
 * captures Core Web Vitals (LCP/INP/CLS/TTFB/FCP), catches JS errors and
 * unhandled promise rejections, and flushes the queue when the tab hides.
 */

import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";
import { flushOnHide, track } from "@/lib/analytics/track";

function rate(name: string, v: number): "good" | "ni" | "poor" {
  switch (name) {
    case "LCP":
      return v <= 2500 ? "good" : v <= 4000 ? "ni" : "poor";
    case "INP":
      return v <= 200 ? "good" : v <= 500 ? "ni" : "poor";
    case "CLS":
      return v <= 0.1 ? "good" : v <= 0.25 ? "ni" : "poor";
    case "TTFB":
      return v <= 800 ? "good" : v <= 1800 ? "ni" : "poor";
    case "FCP":
      return v <= 1800 ? "good" : v <= 3000 ? "ni" : "poor";
    default:
      return "good";
  }
}

export function AnalyticsTracker() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const searchStr = useRouterState({ select: (s) => s.location.searchStr ?? "" });
  const lastPath = useRef<string | null>(null);

  // Pageviews
  useEffect(() => {
    const path = pathname + searchStr;
    if (path === lastPath.current) return;
    lastPath.current = path;
    track("pageview", { path });
  }, [pathname, searchStr]);

  // Visibility flush
  useEffect(() => {
    const onHide = () => flushOnHide();
    const onVis = () => {
      if (document.visibilityState === "hidden") onHide();
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pagehide", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pagehide", onHide);
    };
  }, []);

  // Core Web Vitals — one-shot per page load
  useEffect(() => {
    let cancelled = false;
    void import("web-vitals")
      .then((wv) => {
        if (cancelled) return;
        const send = (m: { name: string; value: number; id: string; rating?: string }) => {
          const value = m.name === "CLS" ? Math.round(m.value * 1000) / 1000 : Math.round(m.value);
          track("web_vital", {
            meta: {
              name: m.name,
              value,
              rating: m.rating ?? rate(m.name, m.value),
              id: m.id,
            },
          });
        };
        wv.onLCP(send);
        wv.onINP(send);
        wv.onCLS(send);
        wv.onTTFB(send);
        wv.onFCP(send);
      })
      .catch(() => {
        /* noop */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // JS errors + unhandled rejections (rate-limited, message-deduped per session)
  useEffect(() => {
    const seen = new Map<string, number>();
    const MAX_PER_ERR = 3;
    const MAX_TOTAL = 20;
    let total = 0;

    const report = (payload: {
      message: string;
      source?: string;
      line?: number;
      col?: number;
      stack?: string;
      kind: "error" | "unhandledrejection";
    }) => {
      if (total >= MAX_TOTAL) return;
      const key = payload.message.slice(0, 200);
      const count = seen.get(key) ?? 0;
      if (count >= MAX_PER_ERR) return;
      seen.set(key, count + 1);
      total += 1;
      track("js_error", {
        meta: {
          message: key,
          source: payload.source?.slice(0, 300),
          line: payload.line,
          col: payload.col,
          stack: payload.stack?.slice(0, 1500),
          kind: payload.kind,
        },
      });
    };

    const onError = (e: ErrorEvent) => {
      report({
        message: e.message || "Unknown error",
        source: e.filename,
        line: e.lineno,
        col: e.colno,
        stack: e.error?.stack,
        kind: "error",
      });
    };
    const onRejection = (e: PromiseRejectionEvent) => {
      const r = e.reason;
      const msg =
        r instanceof Error ? r.message : typeof r === "string" ? r : "Unhandled rejection";
      report({
        message: msg,
        stack: r instanceof Error ? r.stack : undefined,
        kind: "unhandledrejection",
      });
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
