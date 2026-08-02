# Universal Astrology API Layer (`src/api/`)

Phase 14.4. One entry point for every SanatanTools client — website, mobile
apps, admin panel, AI modules, future public API and third-party integrations.

> **Golden rule:** no business logic lives here. Routes validate, authorize,
> rate-limit, cache, call an engine, and shape the response. Every astrological
> number comes from the existing engines (Astronomy, Panchang, Kundli,
> Horoscope, Transit, Dasha, Gochar, Sade Sati, Yoga/Dosha, Numerology, Vastu,
> Festivals, AI Interpretation, PDF).

---

## 1. Architecture

```text
src/routes/api/v1/$.ts        transport shim (TanStack server route)
        │
        ▼
src/api/index.ts              handleApiRequest(request, splat)
        │  version routing, /openapi.json, endpoint index
        ▼
src/api/middleware/pipeline   CORS → security headers → route match →
                              body guard → auth → role → rate limit →
                              cache → controller → envelope → logging
        │
        ▼
src/api/controllers/*         validate (zod) → service → shape
        │
        ▼
src/api/services/*            thin adapters over src/lib/* engines
        │
        ▼
src/lib/<engine>              ALL calculations (unchanged)
```

Supporting modules:

| Module              | Responsibility                                                       |
| ------------------- | -------------------------------------------------------------------- |
| `errors/`           | `ApiError`, code catalogue, `toApiError` masking, safe serialization |
| `responses/`        | Standard envelope, pagination builder, request ids                   |
| `auth/`             | Bearer-token resolution, role derivation, `assertRole`               |
| `rate-limit/`       | Per-role fixed-window budgets with per-endpoint cost                 |
| `cache/`            | Response cache with TTL, LRU eviction and tag invalidation           |
| `validators/`       | Zod schemas, sanitization, body size guard, query parsing            |
| `routes/v1.ts`      | Route registry — single source of truth                              |
| `routes/openapi.ts` | OpenAPI 3.1 generated from the registry                              |

---

## 2. Standard response format

Every response — success or failure — is the same envelope:

```jsonc
{
  "success": true,
  "statusCode": 200,
  "message": "Panchang computed.",
  "data": { "tithi": { "...": "..." } },
  "metadata": {
    "endpoint": "/panchang",
    "method": "GET",
    "cached": false,
    "role": "guest",
    "engine": "panchang",
    "rateLimit": { "limit": 60, "remaining": 59, "resetAt": "2026-01-14T10:01:00.000Z" },
  },
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 45,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false,
  },
  "requestId": "req_m9x2_8fk3ab",
  "timestamp": "2026-01-14T10:00:00.000Z",
  "apiVersion": "v1",
  "executionTime": 42,
}
```

Errors keep the same shape and add `error`:

```jsonc
{
  "success": false,
  "statusCode": 422,
  "message": "Request validation failed.",
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "issues": [{ "field": "birth.latitude", "message": "Number must be less than or equal to 90" }],
  },
}
```

Error codes: `BAD_REQUEST`, `VALIDATION_ERROR`, `UNAUTHORIZED`, `FORBIDDEN`,
`NOT_FOUND`, `METHOD_NOT_ALLOWED`, `PAYLOAD_TOO_LARGE`, `RATE_LIMITED`,
`UPSTREAM_ERROR`, `SERVICE_UNAVAILABLE`, `INTERNAL_ERROR`.
Internal exception text is never exposed — unknown throwables become a generic
`INTERNAL_ERROR` message while the full stack is logged server-side.

---

## 3. Endpoints (v1)

Base URL: `/api/v1`. Discovery: `GET /api/v1` (index), `GET /api/v1/openapi.json`.

| Group      | Endpoint                                                         | Auth                                                              |
| ---------- | ---------------------------------------------------------------- | ----------------------------------------------------------------- |
| Auth       | `GET /auth/session`                                              | guest                                                             |
| Users      | `GET /users/me`                                                  | user                                                              |
| Panchang   | `GET                                                             | POST /panchang`, `GET /panchang/muhurat`, `GET /panchang/almanac` | guest |
| Festival   | `GET /festivals`, `GET /festivals/rules`, `GET /festivals/:slug` | guest                                                             |
| Kundli     | `POST /kundli`, `POST /kundli/summary`, `POST /kundli/charts`    | guest                                                             |
| Dasha      | `POST /dasha`                                                    | guest                                                             |
| Gochar     | `POST /gochar`, `POST /gochar/sade-sati`, `GET /transits`        | guest                                                             |
| Dosha      | `POST /dosha`                                                    | guest                                                             |
| Yoga       | `POST /yoga`, `POST /yoga-dosha`                                 | guest                                                             |
| Horoscope  | `POST /horoscope`, `GET /horoscope/:type`                        | guest                                                             |
| Numerology | `POST /numerology`                                               | guest                                                             |
| Vastu      | `POST /vastu`                                                    | guest                                                             |
| AI         | `GET /ai/reports`, `POST /ai/interpret`                          | user                                                              |
| Reports    | `POST /reports/pdf`                                              | user                                                              |
| System     | `GET /system/cache`, `POST /system/cache/invalidate`             | admin                                                             |

Example:

```bash
curl -X POST https://sanatantools.com/api/v1/kundli/summary \
  -H "Content-Type: application/json" \
  -d '{"birth":{"date":"1990-08-15","time":"10:45","place":"Varanasi",
       "latitude":25.3176,"longitude":82.9739,"timezone":"Asia/Kolkata"}}'
```

```bash
curl -X POST https://sanatantools.com/api/v1/ai/interpret \
  -H "Authorization: Bearer <access-token>" -H "Content-Type: application/json" \
  -d '{"report":"kundli-summary","depth":"standard","language":"hi","data":{ /* engine JSON */ }}'
```

---

## 4. Authentication flow

```text
Authorization: Bearer <supabase access token>
        │
        ├─ absent            → role "guest"  (public endpoints only)
        └─ present           → getClaims() → user_roles + user_entitlements
                               ├─ super_admin              → "super_admin"
                               ├─ admin/editor/moderator…  → "admin"
                               ├─ active entitlement       → "premium"
                               └─ otherwise                → "user"
```

A malformed or expired token is a hard `401` — it never silently degrades to
guest. `minRole` on the route definition is enforced before the handler runs.

---

## 5. Rate limits

Fixed 60-second window per (subject, role). Subject = user id, or client IP for
guests.

| Role        | Requests / minute |
| ----------- | ----------------- |
| guest       | 60                |
| user        | 180               |
| premium     | 600               |
| admin       | 1200              |
| super_admin | 5000              |

Expensive endpoints consume more than one unit: kundli/dasha/gochar/horoscope
`2`, `ai/interpret` `10`, `reports/pdf` `15`. Responses carry
`X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`; a `429` adds
`Retry-After`.

The limiter is in-memory per server instance — it smooths abuse per instance.
Swap `RateLimiter` for a shared-store implementation behind the same interface
when a global budget becomes necessary.

---

## 6. Caching strategy

Two layers:

1. **Engine caches** (unchanged) — Kundli, Transit, Gochar, Dasha, Sade Sati,
   AI interpretation and PDF each keep their own domain cache.
2. **API response cache** — keyed by
   `version : method : route : visibility : hash(body+query+params)`.
   `visibility` is `public` for open endpoints and the user id for
   role-gated ones, so private data can never cross users.

TTLs live on the route definition (`cacheTtlMs`), e.g. Panchang 10 min,
Kundli/Dasha 30 min, Festivals 60 min, transits 5 min. AI and PDF responses are
not cached here — those engines own their own caches.

Smart invalidation by tag:

```bash
curl -X POST /api/v1/system/cache/invalidate \
  -H "Authorization: Bearer <admin token>" -d '{"tag":"panchang"}'
```

---

## 7. Security

- **Input** — every payload passes a Zod schema; strings are trimmed, control
  characters and angle brackets stripped (`sanitizeText`).
- **Body size** — hard 128 KB cap → `413`.
- **Content type** — non-JSON bodies rejected.
- **SQL injection** — engines are pure functions; database reads go through
  Supabase's parameterized client. No string-built SQL exists in this layer.
- **XSS** — responses are JSON with `X-Content-Type-Options: nosniff` and a
  locked-down CSP; markup characters are stripped from free text at the edge.
- **CSRF** — the API is token-authenticated (`Authorization` header), not
  cookie-authenticated, so cross-site form posts cannot act as a user.
- **CORS** — permissive `*` origin with an explicit method/header allowlist and
  a 204 preflight handler; no credentials mode.
- **Headers** — `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`,
  `Cross-Origin-Resource-Policy: same-site`, `Cache-Control: no-store`.
- **Logging** — one structured line per request (`requestId`, method, path,
  status, role, userId, ms, cached, errorCode). 5xx logs the stack; the client
  never sees it.

---

## 8. Versioning

`/api/v1/...` today. A future `v2` registers its own route table in
`src/api/routes/v2.ts` and is added to `REGISTRIES` in `src/api/index.ts` —
v1 keeps serving unchanged clients. Calls without a version segment fall back
to the current version.

---

## 9. Developer guide

**Add an endpoint**

1. Add (or reuse) a service in `src/api/services/` that calls an existing
   engine. Never write astrology here.
2. Add a controller in `src/api/controllers/`: parse with `parseOrThrow`, call
   the service, return `{ data, message, metadata }`.
3. Register it in `src/api/routes/v1.ts` with `group`, `summary`, `minRole`,
   `cacheTtlMs`, `cacheTags`, `rateCost`, `requestExample`.
4. Docs and the OpenAPI document update themselves.

**Add a version** — new `routes/vN.ts` + entry in `REGISTRIES`.

**Add a role** — extend `ROLES` / `ROLE_RANK` / `RATE_RULES` in
`src/api/auth` and `src/api/rate-limit`.

**Tests** — `bunx vitest run src/api/__tests__/api-layer.test.ts` (45 tests:
unit, integration, schema, security, rate limit, OpenAPI, performance smoke).
