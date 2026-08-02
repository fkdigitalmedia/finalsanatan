// ============================================================
// Universal API Layer — Request pipeline
// ------------------------------------------------------------
// cors → security headers → method/route match → body guard →
// auth → role check → rate limit → cache → controller →
// envelope → logging. Errors are funnelled through one handler.
// ============================================================

import { assertRole, guestFor, resolveAuth, type AuthContext } from "../auth";
import { apiCache, buildCacheKey } from "../cache";
import { methodNotAllowed, notFound, toApiError } from "../errors";
import { enforceRateLimit } from "../rate-limit";
import {
  CURRENT_API_VERSION,
  failure,
  newRequestId,
  success,
  type ApiEnvelope,
  type ApiVersion,
  type EnvelopeContext,
  type ResponseMetadata,
} from "../responses";
import { queryObject, readJsonBody } from "../validators";
import type { HandlerContext, RouteDefinition } from "../types";
import { hashKey } from "@/lib/cache";
import { recordMetric } from "@/lib/perf";

export const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Requested-With, Accept, Origin, X-Request-Id",
  "Access-Control-Expose-Headers":
    "X-Request-Id, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, Retry-After",
  "Access-Control-Max-Age": "86400",
};

export const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "no-referrer",
  "Cross-Origin-Resource-Policy": "same-site",
  "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
  "Cache-Control": "no-store",
};

export function preflight(): Response {
  return new Response(null, { status: 204, headers: { ...CORS_HEADERS, ...SECURITY_HEADERS } });
}

function respond(envelope: ApiEnvelope, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(envelope), {
    status: envelope.statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "X-Request-Id": envelope.requestId,
      ...CORS_HEADERS,
      ...SECURITY_HEADERS,
      ...extra,
    },
  });
}

/**
 * Validator + edge-cache headers for cacheable reads. Lets CDNs and
 * browsers skip the payload entirely on repeat requests (304), which is
 * what keeps cached API responses inside the <100 ms budget.
 */
function cacheHeaders(payload: unknown, ttlMs: number): Record<string, string> {
  const seconds = Math.max(1, Math.round(ttlMs / 1000));
  return {
    ETag: `W/"${hashKey(JSON.stringify(payload ?? null))}"`,
    "Cache-Control": `public, max-age=0, s-maxage=${seconds}, stale-while-revalidate=${seconds * 2}`,
    Vary: "Accept-Encoding, Authorization",
  };
}

function notModified(headers: Record<string, string>, requestId: string): Response {
  return new Response(null, {
    status: 304,
    headers: { "X-Request-Id": requestId, ...CORS_HEADERS, ...headers },
  });
}

export interface DispatchOptions {
  request: Request;
  /** Path relative to /api/{version}, e.g. "kundli/summary". */
  path: string;
  apiVersion?: ApiVersion;
  match: (
    method: string,
    path: string,
  ) => {
    match?: { route: RouteDefinition; params: Record<string, string> };
    pathExists: boolean;
  };
}

export async function dispatch(opts: DispatchOptions): Promise<Response> {
  const { request, path } = opts;
  const apiVersion = opts.apiVersion ?? CURRENT_API_VERSION;
  const requestId = request.headers.get("x-request-id")?.slice(0, 64) || newRequestId();
  const startedAt = Date.now();
  const url = new URL(request.url);

  const metadata: ResponseMetadata = {
    endpoint: `/${path}`,
    method: request.method,
    cached: false,
    role: "guest",
  };
  const envCtx: EnvelopeContext = { requestId, startedAt, apiVersion, metadata };

  let auth: AuthContext = guestFor(request);
  let extraHeaders: Record<string, string> = {};

  try {
    if (request.method === "OPTIONS") return preflight();

    const { match, pathExists } = opts.match(request.method, path);
    if (!match) {
      throw pathExists
        ? methodNotAllowed(`${request.method} is not supported on /${path}.`)
        : notFound(`No API endpoint at /api/${apiVersion}/${path}.`);
    }
    const { route, params } = match;

    const body = await readJsonBody(request);
    const query = queryObject(url);

    auth = await resolveAuth(request);
    metadata.role = auth.role;
    if (route.minRole) assertRole(auth, route.minRole);

    const rate = enforceRateLimit(auth.subject, auth.role, route.rateCost ?? 1);
    metadata.rateLimit = {
      limit: rate.limit,
      remaining: rate.remaining,
      resetAt: new Date(rate.resetAt).toISOString(),
    };
    extraHeaders = {
      "X-RateLimit-Limit": String(rate.limit),
      "X-RateLimit-Remaining": String(rate.remaining),
      "X-RateLimit-Reset": String(Math.ceil(rate.resetAt / 1000)),
    };

    // ---- response cache -------------------------------------------------
    const cacheable =
      Boolean(route.cacheTtlMs) && (route.method === "GET" || route.method === "POST");
    const cacheKey = cacheable
      ? buildCacheKey({
          version: apiVersion,
          endpoint: route.path,
          method: route.method,
          // Public endpoints share one bucket; private data is keyed per user.
          visibility: route.minRole ? (auth.userId ?? "anon") : "public",
          payload: { body, query, params },
        })
      : "";

    if (cacheable) {
      const hit = apiCache.get<{ data: unknown; message?: string }>(cacheKey);
      if (hit) {
        metadata.cached = true;
        const headers = { ...extraHeaders, ...cacheHeaders(hit.data, route.cacheTtlMs ?? 60_000) };
        logRequest(request, path, auth, 200, Date.now() - startedAt, requestId, true);
        if (request.headers.get("if-none-match") === headers.ETag) {
          return notModified(headers, requestId);
        }
        return respond(success(envCtx, hit.data, { message: hit.message }), headers);
      }
    }

    const handlerCtx: HandlerContext = {
      request,
      url,
      body,
      query,
      params,
      auth,
      requestId,
      apiVersion,
    };
    const result = await route.handler(handlerCtx);
    Object.assign(metadata, result.metadata ?? {});

    if (cacheable) {
      apiCache.set(
        cacheKey,
        { data: result.data, message: result.message },
        {
          ttlMs: route.cacheTtlMs,
          tags: route.cacheTags ?? [route.group.toLowerCase()],
        },
      );
      extraHeaders = { ...extraHeaders, ...cacheHeaders(result.data, route.cacheTtlMs ?? 60_000) };
    }

    const envelope = success(envCtx, result.data, {
      message: result.message,
      statusCode: result.statusCode,
      pagination: result.pagination,
    });
    logRequest(request, path, auth, envelope.statusCode, envelope.executionTime, requestId, false);
    return respond(envelope, extraHeaders);
  } catch (err) {
    const apiError = toApiError(err);
    const envelope = failure(envCtx, apiError);
    if (apiError.statusCode === 429) {
      const retry = Number(
        (apiError.details as { retryAfterSeconds?: number } | undefined)?.retryAfterSeconds ?? 60,
      );
      extraHeaders["Retry-After"] = String(retry);
    }
    logRequest(
      request,
      path,
      auth,
      envelope.statusCode,
      envelope.executionTime,
      requestId,
      false,
      apiError.code,
      err,
    );
    return respond(envelope, extraHeaders);
  }
}

/** Structured observability line — one per request. */
function logRequest(
  request: Request,
  path: string,
  auth: AuthContext,
  status: number,
  ms: number,
  requestId: string,
  cached: boolean,
  errorCode?: string,
  raw?: unknown,
): void {
  // Feed the performance dashboard: cached hits are tracked separately so the
  // "<100 ms cached API" budget is measured against real cache hits only.
  recordMetric("api", cached ? `/${path}:cached` : `/${path}`, ms, status < 500);
  const line = {
    tag: "api",
    requestId,
    method: request.method,
    path: `/${path}`,
    status,
    role: auth.role,
    userId: auth.userId,
    ms,
    cached,
    ...(errorCode ? { errorCode } : {}),
  };
  if (status >= 500) {
    console.error("[api]", JSON.stringify(line), raw instanceof Error ? raw.stack : raw);
  } else if (status >= 400) {
    console.warn("[api]", JSON.stringify(line));
  } else {
    console.log("[api]", JSON.stringify(line));
  }
}
