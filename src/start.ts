import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { applySecurityHeaders } from "./lib/security/headers";
import { recordMetric } from "./lib/perf/metrics";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";
import { LANGUAGE_COOKIE_NAME, isSupportedLanguage } from "@/i18n/config";
import { langFromPathname, pickFromAcceptLanguage } from "@/i18n/detect";

/** `/lovable/*` routes (email webhooks, previews) authenticate themselves. */
const isLovableRoute = (url: string) => {
  try {
    return new URL(url).pathname.startsWith("/lovable/");
  } catch {
    return false;
  }
};

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

/**
 * Host Canonicalization middleware — permanently redirects (HTTP 301) requests from
 * www.sanatantools.com to https://sanatantools.com to prevent duplicate host crawling.
 */
const hostCanonicalizationMiddleware = createMiddleware().server(async ({ next, request }) => {
  if (isLovableRoute(request.url)) return next();
  try {
    const url = new URL(request.url);
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? url.host;
    if (host.startsWith("www.sanatantools.com")) {
      const canonicalHost = "sanatantools.com";
      const redirectUrl = `https://${canonicalHost}${url.pathname}${url.search}`;
      return new Response(null, {
        status: 301,
        headers: { Location: redirectUrl },
      });
    }
  } catch (err) {
    console.warn("[seo] host canonicalization middleware failed", err);
  }
  return next();
});

/**
 * Language middleware — resolves the visitor's language on every SSR request
 * and forwards it via a `x-lovable-lang` header so SSR entry code / route
 * loaders can read the resolved language synchronously. Priority:
 * URL prefix → cookie → Accept-Language header.
 */
const languageMiddleware = createMiddleware().server(async ({ next, request }) => {
  if (isLovableRoute(request.url)) return next();
  try {
    const url = new URL(request.url);
    const fromUrl = langFromPathname(url.pathname);

    const cookieHeader = request.headers.get("cookie") ?? "";
    const cookieMatch = cookieHeader
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith(`${LANGUAGE_COOKIE_NAME}=`));
    const fromCookie = cookieMatch
      ? decodeURIComponent(cookieMatch.slice(LANGUAGE_COOKIE_NAME.length + 1))
      : undefined;

    const fromHeader = pickFromAcceptLanguage(request.headers.get("accept-language") ?? undefined);

    const resolved =
      fromUrl ?? (isSupportedLanguage(fromCookie) ? fromCookie : undefined) ?? fromHeader ?? "en";

    // Mutating request headers lets downstream code (server fns, route
    // handlers) read the resolved language without re-parsing the URL.
    request.headers.set("x-lovable-lang", resolved);
  } catch (err) {
    console.warn("[i18n] language middleware failed", err);
  }
  return next();
});

/**
 * Security headers middleware — applies CSP, HSTS, framing, referrer and
 * permissions policies to every SSR/HTML response. The `/api/*` layer sets
 * its own stricter headers, so existing values are never overwritten.
 */
const securityHeadersMiddleware = createMiddleware().server(async ({ next, request }) => {
  if (isLovableRoute(request.url)) return next();
  const result = await next();
  try {
    const response = (result as unknown as { response?: Response })?.response;
    const target = response instanceof Response ? response : (result as unknown as Response);
    if (target instanceof Response) applySecurityHeaders(target, request.url);
  } catch (err) {
    console.warn("[security] header middleware failed", err);
  }
  return result;
});

/**
 * SSR timing middleware — records document render latency per route so the
 * admin performance dashboard can grade the homepage / tool-page budgets,
 * and exposes it to the browser via `Server-Timing` for field debugging.
 */
const perfMiddleware = createMiddleware().server(async ({ next, request }) => {
  if (isLovableRoute(request.url)) return next();
  const startedAt = Date.now();
  const result = await next();
  try {
    const url = new URL(request.url);
    if (!url.pathname.startsWith("/api/") && !url.pathname.startsWith("/_serverFn")) {
      const elapsed = Date.now() - startedAt;
      recordMetric("ssr", url.pathname === "/" ? "/" : url.pathname, elapsed, true);
      const response = (result as unknown as { response?: Response })?.response;
      const target = response instanceof Response ? response : (result as unknown as Response);
      if (target instanceof Response && !target.headers.has("Server-Timing")) {
        target.headers.set("Server-Timing", `ssr;dur=${elapsed}`);
      }
    }
  } catch {
    /* never let instrumentation break a response */
  }
  return result;
});

export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [
    errorMiddleware,
    hostCanonicalizationMiddleware,
    perfMiddleware,
    securityHeadersMiddleware,
    languageMiddleware,
  ],
}));
