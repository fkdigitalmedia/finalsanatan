// ============================================================
// Universal API Layer — public entry point
// ------------------------------------------------------------
// Frontend, mobile, admin, AI and third-party clients all enter
// through `handleApiRequest`. Business logic lives in engines.
// ============================================================

import { dispatch, preflight } from "./middleware/pipeline";
import { matchV1, V1_ROUTES } from "./routes/v1";
import { buildOpenApiDocument } from "./routes/openapi";
import { API_VERSIONS, CURRENT_API_VERSION, type ApiVersion } from "./responses";

export * from "./types";
export * from "./errors";
export * from "./responses";
export { apiCache } from "./cache";
export { RATE_RULES, rateLimiter } from "./rate-limit";
export { V1_ROUTES, matchV1 } from "./routes/v1";
export { buildOpenApiDocument } from "./routes/openapi";
export { CORS_HEADERS, SECURITY_HEADERS, preflight } from "./middleware/pipeline";

const REGISTRIES: Record<ApiVersion, typeof matchV1> = {
  v1: matchV1,
};

export function isApiVersion(value: string): value is ApiVersion {
  return (API_VERSIONS as readonly string[]).includes(value);
}

/**
 * Handle one request against `/api/{version}/{...path}`.
 * `splat` is everything after the version segment.
 */
export async function handleApiRequest(request: Request, splat: string): Promise<Response> {
  if (request.method === "OPTIONS") return preflight();

  const clean = splat.split("?")[0].split("#")[0];
  const segments = clean.split("/").filter(Boolean);
  const version = segments[0] ?? "";
  const rest = segments.slice(1).join("/");

  // Un-versioned calls fall back to the current version so clients can
  // migrate gradually without breaking.
  const apiVersion: ApiVersion = isApiVersion(version) ? version : CURRENT_API_VERSION;
  const path = isApiVersion(version) ? rest : segments.join("/");

  if (path === "openapi.json" || path === "docs.json") {
    const origin = new URL(request.url).origin;
    return Response.json(buildOpenApiDocument(origin), {
      headers: { "Access-Control-Allow-Origin": "*", "Cache-Control": "public, max-age=300" },
    });
  }

  if (path === "" || path === "index") {
    return Response.json({
      name: "SanatanTools Universal Astrology API",
      apiVersion,
      versions: API_VERSIONS,
      endpoints: V1_ROUTES.map((r) => ({
        method: r.method,
        path: `/api/${apiVersion}/${r.path}`,
        group: r.group,
        summary: r.summary,
        minRole: r.minRole ?? "guest",
      })),
      openapi: `/api/${apiVersion}/openapi.json`,
    });
  }

  return dispatch({ request, path, apiVersion, match: REGISTRIES[apiVersion] });
}
