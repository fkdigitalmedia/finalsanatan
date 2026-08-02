// ============================================================
// Universal API Layer — automated tests
// Unit + integration + schema + security + performance smoke.
// ============================================================

import { describe, it, expect, beforeEach } from "vitest";
import { handleApiRequest } from "../index";
import { ApiCache, buildCacheKey, stableStringify } from "../cache";
import { RateLimiter, rateLimiter } from "../rate-limit";
import { ApiError, toApiError, serializeError } from "../errors";
import { buildPagination, newRequestId } from "../responses";
import { BirthDetailsSchema, sanitizeText, parseOrThrow, readJsonBody } from "../validators";
import { matchV1, V1_ROUTES } from "../routes/v1";
import { buildOpenApiDocument } from "../routes/openapi";
import { ROLE_RANK, hasMinRole, GUEST } from "../auth";

const BASE = "https://sanatantools.test";

function req(path: string, init: RequestInit = {}) {
  return new Request(`${BASE}/api/${path}`, init);
}
function post(path: string, body: unknown) {
  return req(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
async function call(path: string, init?: RequestInit) {
  const r = await handleApiRequest(init ? req(path, init) : req(path), path.split("?")[0]);
  return { res: r, json: (await r.json()) as Record<string, unknown> };
}

const BIRTH = {
  date: "1990-08-15",
  time: "10:45",
  place: "Varanasi",
  latitude: 25.3176,
  longitude: 82.9739,
  timezone: "Asia/Kolkata",
};

beforeEach(() => rateLimiter.reset());

// ------------------------------------------------------------------ errors
describe("errors", () => {
  it("maps unknown throwables to a masked 500", () => {
    const e = toApiError(new Error("pg: connection string postgres://secret"));
    expect(e.statusCode).toBe(500);
    expect(serializeError(e).message).not.toMatch(/postgres/);
  });

  it("keeps explicit ApiErrors intact", () => {
    const e = toApiError(new ApiError("FORBIDDEN", "nope"));
    expect(e.statusCode).toBe(403);
    expect(serializeError(e).message).toBe("nope");
  });

  it("recognises auth-ish engine failures", () => {
    expect(toApiError(new Error("Unauthorized: Invalid token")).statusCode).toBe(401);
    expect(toApiError(new Error("No enabled AI providers")).statusCode).toBe(503);
  });
});

// -------------------------------------------------------------- validation
describe("validators", () => {
  it("accepts a valid birth payload", () => {
    expect(parseOrThrow(BirthDetailsSchema, BIRTH).latitude).toBeCloseTo(25.3176);
  });

  it("rejects out-of-range coordinates with field issues", () => {
    try {
      parseOrThrow(BirthDetailsSchema, { ...BIRTH, latitude: 120 });
      throw new Error("should have thrown");
    } catch (e) {
      const api = e as ApiError;
      expect(api.statusCode).toBe(422);
      expect(api.issues[0].field).toBe("latitude");
    }
  });

  it("rejects invalid timezone and time formats", () => {
    expect(() =>
      parseOrThrow(BirthDetailsSchema, { ...BIRTH, timezone: "Mars/Olympus" }),
    ).toThrow();
    expect(() => parseOrThrow(BirthDetailsSchema, { ...BIRTH, time: "25:00" })).toThrow();
    expect(() => parseOrThrow(BirthDetailsSchema, { ...BIRTH, date: "15-08-1990" })).toThrow();
  });

  it("sanitizes XSS payloads out of free text", () => {
    expect(sanitizeText("<script>alert(1)</script>Kashi")).toBe("scriptalert(1)/scriptKashi");
    const parsed = parseOrThrow(BirthDetailsSchema, { ...BIRTH, place: "<b>Varanasi</b>" });
    expect(parsed.place).not.toMatch(/[<>]/);
  });

  it("rejects oversized bodies", async () => {
    const huge = JSON.stringify({ blob: "x".repeat(200_000) });
    const r = new Request(`${BASE}/api/v1/kundli`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: huge,
    });
    await expect(readJsonBody(r)).rejects.toMatchObject({ statusCode: 413 });
  });

  it("rejects malformed JSON", async () => {
    const r = new Request(`${BASE}/api/v1/kundli`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{ nope",
    });
    await expect(readJsonBody(r)).rejects.toMatchObject({ statusCode: 400 });
  });
});

// ------------------------------------------------------------------- cache
describe("cache", () => {
  it("stable-stringifies regardless of key order", () => {
    expect(stableStringify({ a: 1, b: 2 })).toBe(stableStringify({ b: 2, a: 1 }));
  });

  it("hits, expires and invalidates by tag", async () => {
    const cache = new ApiCache(20);
    cache.set("k", { v: 1 }, { tags: ["panchang"] });
    expect(cache.get("k")).toEqual({ v: 1 });
    expect(cache.invalidateTag("panchang")).toBe(1);
    expect(cache.get("k")).toBeUndefined();

    cache.set("k2", { v: 2 }, { ttlMs: 1 });
    await new Promise((r) => setTimeout(r, 5));
    expect(cache.get("k2")).toBeUndefined();
  });

  it("evicts the oldest entry past the cap", () => {
    const cache = new ApiCache(60_000, 2);
    cache.set("a", 1);
    cache.set("b", 2);
    cache.set("c", 3);
    expect(cache.size).toBeLessThanOrEqual(2);
    expect(cache.stats().evictions).toBeGreaterThan(0);
  });

  it("separates cache keys per visibility", () => {
    const a = buildCacheKey({
      version: "v1",
      endpoint: "kundli",
      method: "POST",
      visibility: "u1",
      payload: {},
    });
    const b = buildCacheKey({
      version: "v1",
      endpoint: "kundli",
      method: "POST",
      visibility: "u2",
      payload: {},
    });
    expect(a).not.toBe(b);
  });
});

// -------------------------------------------------------------- rate limit
describe("rate limiting", () => {
  it("allows up to the tier budget then blocks", () => {
    const limiter = new RateLimiter({
      guest: { limit: 3, windowMs: 60_000 },
      user: { limit: 5, windowMs: 60_000 },
      premium: { limit: 5, windowMs: 60_000 },
      admin: { limit: 5, windowMs: 60_000 },
      super_admin: { limit: 5, windowMs: 60_000 },
    });
    expect(limiter.check("ip:1", "guest").allowed).toBe(true);
    expect(limiter.check("ip:1", "guest").allowed).toBe(true);
    expect(limiter.check("ip:1", "guest").allowed).toBe(true);
    const blocked = limiter.check("ip:1", "guest");
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("gives premium a bigger budget than guest", () => {
    const limiter = new RateLimiter();
    expect(limiter.check("user:x", "premium").limit).toBeGreaterThan(
      limiter.check("ip:y", "guest").limit,
    );
  });

  it("charges expensive endpoints more", () => {
    const limiter = new RateLimiter({
      guest: { limit: 10, windowMs: 60_000 },
      user: { limit: 10, windowMs: 60_000 },
      premium: { limit: 10, windowMs: 60_000 },
      admin: { limit: 10, windowMs: 60_000 },
      super_admin: { limit: 10, windowMs: 60_000 },
    });
    const r = limiter.check("ip:cost", "guest", 4);
    expect(r.remaining).toBe(6);
  });
});

// ------------------------------------------------------------------- roles
describe("roles", () => {
  it("ranks roles in ascending privilege", () => {
    expect(ROLE_RANK.guest).toBeLessThan(ROLE_RANK.user);
    expect(ROLE_RANK.user).toBeLessThan(ROLE_RANK.premium);
    expect(ROLE_RANK.premium).toBeLessThan(ROLE_RANK.admin);
    expect(ROLE_RANK.admin).toBeLessThan(ROLE_RANK.super_admin);
  });

  it("guests fail min-role checks", () => {
    expect(hasMinRole(GUEST, "user")).toBe(false);
    expect(hasMinRole({ ...GUEST, role: "admin" }, "premium")).toBe(true);
  });
});

// ------------------------------------------------------------------ router
describe("route registry", () => {
  it("matches static and param routes", () => {
    expect(matchV1("GET", "panchang").match?.route.path).toBe("panchang");
    const m = matchV1("GET", "festivals/holi");
    expect(m.match?.params.slug).toBe("holi");
  });

  it("prefers a static segment over a param segment", () => {
    expect(matchV1("GET", "festivals/rules").match?.route.path).toBe("festivals/rules");
  });

  it("reports method mismatch separately from unknown paths", () => {
    expect(matchV1("DELETE", "panchang").pathExists).toBe(true);
    expect(matchV1("GET", "nope/nope").pathExists).toBe(false);
  });

  it("declares every endpoint group required by the spec", () => {
    const groups = new Set(V1_ROUTES.map((r) => r.group));
    for (const g of [
      "Auth",
      "Users",
      "Panchang",
      "Kundli",
      "Horoscope",
      "Dasha",
      "Gochar",
      "Dosha",
      "Yoga",
      "Numerology",
      "Vastu",
      "Festival",
      "Reports",
      "AI",
    ]) {
      expect(groups.has(g)).toBe(true);
    }
  });
});

// -------------------------------------------------------------- envelope
describe("response envelope", () => {
  it("returns every mandated field", async () => {
    const { res, json } = await call("v1/auth/session");
    expect(res.status).toBe(200);
    for (const key of [
      "success",
      "statusCode",
      "message",
      "data",
      "metadata",
      "requestId",
      "timestamp",
      "apiVersion",
      "executionTime",
    ]) {
      expect(json).toHaveProperty(key);
    }
    expect(json.apiVersion).toBe("v1");
  });

  it("builds pagination correctly", () => {
    const p = buildPagination(2, 20, 45);
    expect(p).toMatchObject({ totalPages: 3, hasNext: true, hasPrev: true });
  });

  it("mints unique request ids", () => {
    expect(newRequestId()).not.toBe(newRequestId());
  });
});

// ------------------------------------------------------------ integration
describe("integration", () => {
  it("computes a Panchang through the pipeline", async () => {
    const { res, json } = await call(
      "v1/panchang?date=2026-01-14&latitude=28.6139&longitude=77.209&timezone=Asia/Kolkata",
    );
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    const data = json.data as Record<string, unknown>;
    expect(data.tithi).toBeDefined();
    expect(data.nakshatra).toBeDefined();
  });

  it("serves a cached second call", async () => {
    const path =
      "v1/panchang?date=2026-02-02&latitude=19.076&longitude=72.8777&timezone=Asia/Kolkata";
    await call(path);
    const { json } = await call(path);
    expect((json.metadata as Record<string, unknown>).cached).toBe(true);
  });

  it("generates a kundli summary from birth details", async () => {
    const r = await handleApiRequest(
      post("v1/kundli/summary", { birth: BIRTH }),
      "v1/kundli/summary",
    );
    const json = (await r.json()) as Record<string, unknown>;
    expect(r.status).toBe(200);
    const data = json.data as Record<string, unknown>;
    expect(data.moonSign).toBeTruthy();
    expect(Array.isArray(data.planets)).toBe(true);
  });

  it("runs the vastu engine", async () => {
    const r = await handleApiRequest(
      post("v1/vastu", { facing: "north-east", rooms: { kitchen: "north-east" } }),
      "v1/vastu",
    );
    const json = (await r.json()) as Record<string, unknown>;
    const data = json.data as Record<string, unknown>;
    expect(r.status).toBe(200);
    expect(typeof data.score).toBe("number");
    expect(Array.isArray(data.defects)).toBe(true);
  });

  it("computes numerology", async () => {
    const r = await handleApiRequest(
      post("v1/numerology", { name: "Aarav Sharma", dob: "1994-03-21" }),
      "v1/numerology",
    );
    const json = (await r.json()) as Record<string, unknown>;
    expect((json.data as Record<string, unknown>).lifePathNumber).toBeGreaterThan(0);
  });

  it("returns 404 for unknown endpoints and 405 for wrong methods", async () => {
    const missing = await call("v1/does-not-exist");
    expect(missing.res.status).toBe(404);
    const wrong = await handleApiRequest(
      new Request(`${BASE}/api/v1/panchang`, { method: "DELETE" }),
      "v1/panchang",
    );
    expect(wrong.status).toBe(405);
  });

  it("requires authentication on protected endpoints", async () => {
    const r = await handleApiRequest(
      post("v1/ai/interpret", { report: "kundli-summary", data: {} }),
      "v1/ai/interpret",
    );
    expect(r.status).toBe(401);
    expect(((await r.json()) as Record<string, unknown>).success).toBe(false);
  });

  it("rejects a malformed bearer token", async () => {
    const r = await handleApiRequest(
      new Request(`${BASE}/api/v1/users/me`, { headers: { Authorization: "Bearer not-a-jwt" } }),
      "v1/users/me",
    );
    expect(r.status).toBe(401);
  });

  it("returns 422 with field issues on bad input", async () => {
    const r = await handleApiRequest(
      post("v1/kundli", { birth: { ...BIRTH, latitude: 999 } }),
      "v1/kundli",
    );
    const json = (await r.json()) as Record<string, unknown>;
    expect(r.status).toBe(422);
    expect((json.error as Record<string, unknown>).code).toBe("VALIDATION_ERROR");
  });

  it("answers CORS preflight with the documented headers", async () => {
    const r = await handleApiRequest(
      new Request(`${BASE}/api/v1/panchang`, { method: "OPTIONS" }),
      "v1/panchang",
    );
    expect(r.status).toBe(204);
    expect(r.headers.get("Access-Control-Allow-Origin")).toBe("*");
    expect(r.headers.get("Access-Control-Allow-Headers")).toContain("Authorization");
  });

  it("stamps security headers and a request id on every response", async () => {
    const { res } = await call("v1/auth/session");
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(res.headers.get("X-Frame-Options")).toBe("DENY");
    expect(res.headers.get("X-Request-Id")).toBeTruthy();
    expect(res.headers.get("X-RateLimit-Limit")).toBeTruthy();
  });

  it("honours a client-supplied request id", async () => {
    const r = await handleApiRequest(
      new Request(`${BASE}/api/v1/auth/session`, { headers: { "X-Request-Id": "trace-123" } }),
      "v1/auth/session",
    );
    expect(r.headers.get("X-Request-Id")).toBe("trace-123");
  });

  it("returns 429 once the guest budget is exhausted", async () => {
    let last: Response | null = null;
    for (let i = 0; i < 70; i++) {
      last = await handleApiRequest(req("v1/auth/session"), "v1/auth/session");
      if (last.status === 429) break;
    }
    expect(last?.status).toBe(429);
    expect(last?.headers.get("Retry-After")).toBeTruthy();
  });

  it("handles SQL-injection-shaped input safely", async () => {
    const r = await handleApiRequest(
      post("v1/numerology", { name: "Robert'); DROP TABLE users;--<script>", dob: "1994-03-21" }),
      "v1/numerology",
    );
    const json = (await r.json()) as Record<string, unknown>;
    // Input is never interpolated into SQL (engines are pure), and markup is stripped.
    expect(r.status).toBe(200);
    expect(JSON.stringify(json)).not.toMatch(/[<>]/);
    expect((json.data as Record<string, unknown>).lifePathNumber).toBeGreaterThan(0);
  });

  it("falls back to the current version when none is given", async () => {
    const r = await handleApiRequest(
      new Request(
        `${BASE}/api/panchang?date=2026-01-14&latitude=28.6&longitude=77.2&timezone=Asia/Kolkata`,
      ),
      "panchang",
    );
    expect(r.status).toBe(200);
  });
});

// ---------------------------------------------------------------- openapi
describe("openapi", () => {
  it("documents every registered route", () => {
    const doc = buildOpenApiDocument(BASE);
    const count = Object.values(doc.paths).reduce((n, ops) => n + Object.keys(ops).length, 0);
    expect(count).toBe(V1_ROUTES.length);
    expect(doc.openapi).toBe("3.1.0");
    expect(doc.components.securitySchemes.bearerAuth.scheme).toBe("bearer");
  });

  it("is served from the API itself", async () => {
    const r = await handleApiRequest(req("v1/openapi.json"), "v1/openapi.json");
    const doc = (await r.json()) as Record<string, unknown>;
    expect(r.status).toBe(200);
    expect(doc.openapi).toBe("3.1.0");
  });

  it("lists the endpoint index at the API root", async () => {
    const r = await handleApiRequest(req("v1"), "v1");
    const json = (await r.json()) as { endpoints: unknown[] };
    expect(json.endpoints.length).toBe(V1_ROUTES.length);
  });
});

// ------------------------------------------------------------- performance
describe("performance", () => {
  it("serves 30 concurrent cached reads quickly", async () => {
    rateLimiter.reset();
    const path = "v1/festivals/rules";
    await call(path);
    const started = Date.now();
    await Promise.all(Array.from({ length: 30 }, () => call(path)));
    expect(Date.now() - started).toBeLessThan(2000);
  });

  it("reports executionTime on every response", async () => {
    rateLimiter.reset();
    const { json } = await call("v1/auth/session");
    expect(typeof json.executionTime).toBe("number");
  });
});
