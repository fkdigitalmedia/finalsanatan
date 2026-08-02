# Phase 15.1 — Security Report (SanatanTools.com)

_Last audit: production hardening pass, Phase 15.1._

## 1. Scope

Full application audit: authentication, authorization, session handling, admin
and API permissions, input validation, output encoding, secrets, headers,
logging, health, error handling and dependencies. No user-facing features were
added or changed; all changes are backward compatible.

## 2. Authentication & Session Management

| Area             | Finding                                                                                                                       | Status |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------ |
| Auth provider    | Managed backend auth (email/password + Google). No custom crypto.                                                             | OK     |
| Session storage  | Provider-managed tokens; bearer attached to server functions by `attachSupabaseAuth` in `src/start.ts`.                       | OK     |
| Protected routes | Gated by the `_authenticated` layout (`beforeLoad` redirect to `/auth`), not component checks.                                | OK     |
| Server functions | Protected functions use `requireSupabaseAuth`; the handler derives `userId` from the verified token, never from request data. | OK     |
| Password reset   | Dedicated `/reset-password` route, `noindex`.                                                                                 | OK     |

## 3. Authorization / RBAC

- Roles live in `public.user_roles` (never on `profiles`), read through the
  `SECURITY DEFINER` helpers `has_role()` / `is_staff()` — no recursive RLS.
- Admin server functions and BI analytics functions re-verify staff role
  server-side before any privileged read (`src/lib/analytics/bi.server.ts`).
- API routes declare `minRole`; `assertRole` runs in the pipeline before the
  controller (`src/api/middleware/pipeline.ts`).
- Every public table has RLS enabled with explicit GRANTs; earlier phases fixed
  over-permissive write policies (festival translations, public writes).

## 4. OWASP Top 10 Coverage

| Risk                      | Control                                                                                                                                                                                                              |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SQL Injection             | All DB access goes through the PostgREST client / parameterized RPC. No string-built SQL in app code.                                                                                                                |
| XSS                       | React escapes by default; no `dangerouslySetInnerHTML` on user content. AI/blog Markdown is rendered through a sanitizing renderer. CSP blocks unknown script origins.                                               |
| CSRF                      | No cookie-based session authority for state changes — server functions and APIs authenticate with a bearer token, so cross-site form posts cannot act as a user. `form-action 'self'` + `SameSite` provider cookies. |
| SSRF                      | No user-supplied URL is fetched server-side; outbound calls target a fixed allowlist (AI gateway, payment gateways, Photon geocoder).                                                                                |
| Command Injection         | No `child_process` (unavailable in the Worker runtime) and no shell execution anywhere in server code.                                                                                                               |
| Path Traversal            | No filesystem reads driven by user input; assets are bundled.                                                                                                                                                        |
| Clickjacking              | `X-Frame-Options: SAMEORIGIN` + CSP `frame-ancestors 'self'` on all HTML; `DENY`/`'none'` on API responses.                                                                                                          |
| Broken Authentication     | Provider-managed sessions, no anonymous sign-ups, leaked-password protection available in auth settings.                                                                                                             |
| Broken Access Control     | RLS + `minRole` + server-side staff re-checks; admin UI is not the security boundary.                                                                                                                                |
| Sensitive Data Exposure   | Service role key and DB URL exist only as server env vars; logging redacts credentials/PII; API errors never expose internals.                                                                                       |
| Security Misconfiguration | Security headers applied globally (`src/lib/security/headers.ts`), `no-store` on API responses, health endpoints expose status only.                                                                                 |

## 5. API Security

- Single pipeline: CORS → security headers → route match → body guard →
  auth → role → rate limit → cache → controller → envelope → structured log.
- Zod validation on every request body and query parameter.
- Request size limits and unsupported-media-type rejection in
  `src/api/validators`.
- Tiered rate limiting per subject/role with `X-RateLimit-*` and `Retry-After`.
- Versioned surface (`/api/v1/*`) with fallback to the current version; unknown
  versions never reach a handler.
- Public hook routes (`/api/public/hooks/*`) authenticate callers via the
  `apikey` header before doing work; the webhook route verifies signatures.

## 6. Security Headers

Applied to every HTML/SSR response by `securityHeadersMiddleware`:

- `Content-Security-Policy` (default-src 'self', object-src 'none',
  base-uri 'self', form-action 'self', frame-ancestors 'self',
  upgrade-insecure-requests, explicit allowlists for payment/analytics/geocoder)
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` (https only)
- `X-Frame-Options: SAMEORIGIN`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` (camera, mic, USB, sensors, FLoC disabled)
- `X-Content-Type-Options: nosniff`
- `Cross-Origin-Opener-Policy`, `X-Permitted-Cross-Domain-Policies: none`

## 7. Secrets

Repository scan found **no** hardcoded API keys, tokens, passwords or database
credentials. All secrets are environment variables read inside handlers:
`SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_DB_URL`, `LOVABLE_API_KEY`,
`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`. Only the publishable/anon key appears
client-side, which is by design.

## 8. Logging

Centralized in `src/lib/logging` with five channels (app, api, security, auth,
error), automatic redaction of credentials and PII, JSON output, level gating
via `LOG_LEVEL`, and pluggable sinks.

## 9. Health

- `GET /api/public/health` — liveness (no dependencies)
- `GET /api/public/ready` — readiness (database reachable)
- `GET /api/public/status` — app, database, storage, AI provider, queue

`503` is returned when any component is `down`. Responses contain status only —
no versions of dependencies, no connection strings.

## 10. Residual Risks

| Risk                                                       | Severity | Mitigation / accepted                                                                                                                                       |
| ---------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CSP allows `'unsafe-inline'` / `'unsafe-eval'` for scripts | Medium   | Required by SSR hydration, JSON-LD and chart/PDF dependencies. Mitigated by strict `object-src`, `base-uri`, `form-action`. Nonce-based CSP is a follow-up. |
| Rate limiting is per-instance in-memory                    | Medium   | Acceptable at current scale; a shared store is the follow-up when horizontally scaled.                                                                      |
| No WAF in front of the app                                 | Low      | Platform edge provides basic protection.                                                                                                                    |
