// ============================================================
// Universal API Layer — OpenAPI 3.1 generation
// ------------------------------------------------------------
// Derived from the route registry, so docs can never drift.
// ============================================================

import { CURRENT_API_VERSION } from "../responses";
import { RATE_RULES } from "../rate-limit";
import type { RouteDefinition } from "../types";
import { V1_ROUTES } from "./v1";

const ENVELOPE_SCHEMA = {
  type: "object",
  required: [
    "success",
    "statusCode",
    "message",
    "data",
    "metadata",
    "requestId",
    "timestamp",
    "apiVersion",
    "executionTime",
  ],
  properties: {
    success: { type: "boolean" },
    statusCode: { type: "integer" },
    message: { type: "string" },
    data: {},
    error: {
      type: "object",
      properties: {
        code: { type: "string" },
        message: { type: "string" },
        issues: {
          type: "array",
          items: {
            type: "object",
            properties: { field: { type: "string" }, message: { type: "string" } },
          },
        },
      },
    },
    metadata: { type: "object", additionalProperties: true },
    pagination: {
      type: "object",
      properties: {
        page: { type: "integer" },
        pageSize: { type: "integer" },
        total: { type: "integer" },
        totalPages: { type: "integer" },
        hasNext: { type: "boolean" },
        hasPrev: { type: "boolean" },
      },
    },
    requestId: { type: "string" },
    timestamp: { type: "string", format: "date-time" },
    apiVersion: { type: "string" },
    executionTime: { type: "integer" },
  },
} as const;

function toOpenApiPath(path: string): string {
  return `/api/${CURRENT_API_VERSION}/${path.replace(/:([A-Za-z0-9_]+)/g, "{$1}")}`;
}

function operation(route: RouteDefinition) {
  const params = [...route.path.matchAll(/:([A-Za-z0-9_]+)/g)].map((m) => ({
    name: m[1],
    in: "path",
    required: true,
    schema: { type: "string" },
  }));

  return {
    tags: [route.group],
    summary: route.summary,
    description: [
      route.description,
      route.engine ? `Served by the **${route.engine}** engine.` : null,
      `Minimum role: \`${route.minRole ?? "guest"}\`.`,
      route.cacheTtlMs ? `Cached for ${Math.round(route.cacheTtlMs / 1000)}s.` : "Not cached.",
      `Rate-limit cost: ${route.rateCost ?? 1}.`,
    ]
      .filter(Boolean)
      .join("\n\n"),
    security: route.minRole && route.minRole !== "guest" ? [{ bearerAuth: [] }] : [],
    parameters: params,
    ...(route.method === "GET"
      ? {}
      : {
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { type: "object", additionalProperties: true },
                ...(route.requestExample ? { example: route.requestExample } : {}),
              },
            },
          },
        }),
    responses: {
      "200": {
        description: "Success",
        content: { "application/json": { schema: ENVELOPE_SCHEMA } },
      },
      "401": {
        description: "Unauthorized",
        content: { "application/json": { schema: ENVELOPE_SCHEMA } },
      },
      "403": {
        description: "Forbidden",
        content: { "application/json": { schema: ENVELOPE_SCHEMA } },
      },
      "422": {
        description: "Validation error",
        content: { "application/json": { schema: ENVELOPE_SCHEMA } },
      },
      "429": {
        description: "Rate limited",
        content: { "application/json": { schema: ENVELOPE_SCHEMA } },
      },
      "500": {
        description: "Internal error",
        content: { "application/json": { schema: ENVELOPE_SCHEMA } },
      },
    },
  };
}

export function buildOpenApiDocument(origin = "https://sanatantools.com") {
  const paths: Record<string, Record<string, unknown>> = {};
  for (const route of V1_ROUTES) {
    const key = toOpenApiPath(route.path);
    paths[key] = paths[key] ?? {};
    paths[key][route.method.toLowerCase()] = operation(route);
  }

  return {
    openapi: "3.1.0",
    info: {
      title: "SanatanTools Universal Astrology API",
      version: "1.0.0",
      description: [
        "Single entry point for every SanatanTools client: website, mobile apps,",
        "admin panel, AI modules and third-party integrations.",
        "",
        "**Authentication** — send `Authorization: Bearer <supabase access token>`.",
        "Anonymous callers are treated as the `guest` role and may use public endpoints.",
        "",
        "**Rate limits (per minute)** — " +
          Object.entries(RATE_RULES)
            .map(([role, r]) => `${role}: ${r.limit}`)
            .join(", ") +
          ". Expensive endpoints (AI, PDF) consume multiple units per call.",
        "",
        "**Versioning** — every endpoint lives under `/api/v1/`. Future `v2` mounts alongside; v1 keeps working.",
      ].join("\n"),
    },
    servers: [{ url: origin }],
    tags: [...new Set(V1_ROUTES.map((r) => r.group))].map((name) => ({ name })),
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
      schemas: { ApiEnvelope: ENVELOPE_SCHEMA },
    },
    paths,
  };
}
