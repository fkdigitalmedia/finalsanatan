# Phase 15.2.5 — Enterprise Architecture Review & Migration Readiness Audit

**Date:** 2026-07-31
**Codebase:** ~100k LOC, 1,115 files under `src/` (641 `.ts/.tsx` analyzed), 110 routes, 68 database tables, 63 dependencies.
**Method:** five parallel audits (architecture/dependencies, database/security, API/frontend/SEO/i18n, Vercel migration readiness/engines) plus a local build, typecheck, lint and test gate.

---

## 0. Verdict

The codebase is **architecturally sound and genuinely portable**. There is no framework lock-in, no circular dependencies, no Node-incompatible code, and no Cloudflare binding usage. Domain engines follow a clean, replicable module convention.

Three things must be fixed before this is production/migration-ready:

| #   | Severity     | Issue                                                              | Status                     |
| --- | ------------ | ------------------------------------------------------------------ | -------------------------- |
| C1  | **CRITICAL** | Cron/webhook endpoints authenticate with the **public** anon key   | ⚠️ **Open — fix required** |
| C2  | HIGH         | 6 API routes bypass the hardened pipeline (no auth, no rate limit) | ⚠️ Open                    |
| C3  | HIGH         | `/tools/:slug` shipped a 1.98 MB JS chunk to every visitor         | ✅ **Fixed this turn**     |

---

## 1. Build & Quality Gate (measured locally)

| Gate                        | Result                                                                     |
| --------------------------- | -------------------------------------------------------------------------- |
| Typecheck (`tsgo --noEmit`) | ✅ Clean                                                                   |
| Tests (`vitest run`)        | ✅ 381/381 passing, 20 files                                               |
| Production build            | ✅ Succeeds, ~9s                                                           |
| Lint                        | ⚠️ 13.6k issues — overwhelmingly `prettier/prettier` formatting, not logic |
| Dependency vulnerabilities  | ✅ None high/critical                                                      |

### Fixed during this audit

**React hook-order violation — `src/components/tools/ToolShell.tsx`**
`useLocalizedHowToUse` / `useLocalizedBenefits` / `useLocalizedFaqs` were called behind `??` short-circuits, so hook order changed between renders whenever the optional props appeared or disappeared. This is a latent crash ("Rendered fewer hooks than expected"), not a style issue. Hooks now run unconditionally with the props applied afterwards.

**1.98 MB tool-page chunk — `src/tools/content/i18n/index.ts`**
Root cause was an `import.meta.glob(..., { eager: true })` that inlined **every** translated content pack — all languages × all ~90 tools, ~990k characters of Devanagari/Tamil/Telugu copy — into the `/tools/:slug` route chunk. Every visitor to every tool page downloaded translations for every other tool in every other language.

Made the glob lazy and added `useLocalizedToolContent()`, which fetches exactly one `(lang, slug)` pack on demand. The tool widget registry (`src/tools/registry.ts`) was also converted to `React.lazy` so a tool page loads only the module its own widget lives in, with a `<Suspense>` boundary in `src/routes/tools.$slug.tsx`.

|                            | Before         | After                   |
| -------------------------- | -------------- | ----------------------- |
| `/tools/:slug` route chunk | **1,982 KB**   | **244 KB** (−87%)       |
| Largest widget chunk       | (in the above) | 78 KB, loaded on demand |
| Tests after change         | —              | 381/381 passing         |

Behaviour is preserved: the translated copy was already applied client-side from `useTranslation()`, never during SSR, so nothing regressed for SEO.

---

## 2. CRITICAL — C1: cron endpoints are effectively unauthenticated

`src/routes/api/public/hooks/analytics-tick.ts:42`, `festivals-tick.ts:174`, and `notifications-tick.ts:60` all do:

```ts
const expected = process.env.SUPABASE_PUBLISHABLE_KEY;
```

That value is also shipped to the browser as `VITE_SUPABASE_PUBLISHABLE_KEY` and is readable in any page's JS bundle. **Anyone can extract it and call these endpoints at will**, triggering festival auto-publish/archive writes and notification inserts.

The Lemon Squeezy webhook (`lemonsqueezy-webhook.ts`) already does this correctly with HMAC + `timingSafeEqual` — that is the pattern to copy.

**Fix:** introduce a dedicated server-only `CRON_SECRET` (never `VITE_`-prefixed), compare with `timingSafeEqual`, and update the `pg_cron` job header. This also resolves migration blocker H1 below, since that job must be re-pointed anyway.

---

## 3. Database & Security

**Healthy baseline.** All 68 public tables have RLS enabled; none is enabled-with-zero-policies. All 5 `SECURITY DEFINER` functions (`has_role`, `is_staff`, `handle_new_user`, `touch_streak`, `get_public_integrations`) correctly pin `search_path = public`. Admin gating is DB-driven via `is_staff()`, never client-side. No hardcoded keys in `src/`. No service-role usage outside `*.server.ts` / `*.functions.ts`.

| Sev      | Finding                                                                                                                                                                                                                           |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CRITICAL | C1 above.                                                                                                                                                                                                                         |
| HIGH     | `/api/public/track.ts` writes with `supabaseAdmin` and has **no rate limiting** — open write endpoint, `analytics_events` bloat risk. Zod validation and IP hashing are present.                                                  |
| HIGH     | Missing FKs to `auth.users` on `analytics_events`, `analytics_sessions`, `ai_usage_logs`, `notification_preferences`, `notification_deliveries`. Either add them or document the omission as intentional for ephemeral analytics. |
| MEDIUM   | FK columns without supporting indexes (`admin_articles.author_id`, `translations.updated_by`, `pdf_reports.template_id`, others). Low impact at current row counts; revisit before ~10k rows.                                     |
| MEDIUM   | `pdf_reports` vs `user_reports` are overlapping "report" concepts and `report_downloads` FKs to both. Document the distinction or consolidate.                                                                                    |
| MEDIUM   | Not every `*.functions.ts` handler was individually confirmed to gate on `requireSupabaseAuth` + role check before privileged writes. Recommend a per-file pass.                                                                  |
| LOW      | 155 indexes at `idx_scan = 0` and ~45 zero-row tables — both explained by low traffic on newly shipped features, not dead schema. Re-evaluate after real traffic.                                                                 |
| LOW      | `USING (true)` SELECT policies exist only on genuinely public content (`kundli_interpretations`, `festival_tool_rules`, `festival_date_cache`) — no PII exposure.                                                                 |

---

## 4. API Layer

The `/api/v1` surface is **the strongest part of the codebase**: 22 endpoints through one registry and one pipeline, with a single response envelope, single error taxonomy, Zod-first validation, role-aware rate limiting with per-endpoint cost weights, and TTL caching. Middleware order is correct — auth resolves before rate limiting and before the cache read, and the cache key includes `userId` for role-gated routes, so no cross-user leakage.

**C2 (HIGH) — a second, ungoverned API surface exists.** These bypass the pipeline entirely — no auth, no rate limiting, no unified errors, no security headers — while duplicating functionality `/api/v1` already exposes with full protection:

- `src/routes/api/ai.ts`
- `src/routes/api/kundli/index.ts`
- `src/routes/api/lagna.ts`
- `src/routes/api/rashi.ts`
- `src/routes/api/planets.ts`
- `src/routes/api/nakshatra.ts`

These expose the compute-heavy astrology engines to unlimited anonymous traffic. Retire them or fold them into `/api/v1`.

Also: the Lemon Squeezy webhook parses its payload with a TypeScript cast rather than a runtime schema (signature verification is correct); and there is no global handler timeout in the pipeline.

---

## 5. Frontend

- **Routing:** 110 route files, no duplicate paths, uniform `createFileRoute` pattern.
- **`/robots.txt` conflict (P0 for SEO):** both `public/robots.txt` (static) and `src/routes/robots[.]txt.ts` (dynamic, admin-configurable) claim the path. Depending on static-file ordering the static file shadows the dynamic one, silently discarding the admin's `seo.robots` override.
- **Error boundaries:** only 9 of 110 routes define `errorComponent`. Nine loader-bearing routes lack one — the four horoscope-by-sign pages, `blog.$slug`, `blog.index`, `legal.index`, `festivals.tsx`, and two festival taxonomy routes. A loader failure there blanks the page.
- **Loading states:** `SanatanLoader` covers 17 files. The astrology detail routes (`dosha.$slug`, `nakshatra.$slug`, `rashi.$slug`, `yoga.$slug`, `numerology.$slug`, `vastu.$slug`) have no confirmed loading state.
- **Accessibility:** clean — 11/11 `<img>` have `alt`, no `onClick` on non-semantic `<div>`, `<Label>` count exceeds `<Input>` count.
- **Theming:** only 5 files use hardcoded colours, all modal backdrop scrims in shadcn primitives — an accepted pattern.
- **Responsive:** 21 fixed `w-[NNpx]` widths, all on small form controls (150–240px). Low risk.

---

## 6. SEO

`src/lib/seo/**` is a comprehensive purpose-built engine (canonical, hreflang, OG, Twitter, schema, robots, sitemap). The gaps are in **adoption**, not capability:

- **26 public routes have no canonical tag** — including the entire high-volume programmatic family: `rashi.*`, `nakshatra.*`, `dosha.*`, `numerology.*`, `muhurat.*` (both detail and index). These are precisely the pages most exposed to duplicate-content penalties.
- **16 routes missing OG tags**, **34 missing `twitter:card`** — including the homepage.
- **15 routes missing JSON-LD**, notably `panchang.tsx` and `temples.tsx`.
- **3 public routes have no `head()` at all:** `$lang.$.tsx`, `$lang.index.tsx`, `tools.tsx`.
- Sitemaps are well decomposed (9 shards) with no duplicate claimants.
- Shared "not found" title strings across `$slug` routes should be confirmed to return a real 404 rather than a soft-404 with status 200.

---

## 7. Translations

12 locales. English base = 296 keys.

| Locale               | Coverage           |
| -------------------- | ------------------ |
| `hi`                 | **100%**           |
| `gu, kn, mr, ta, te` | 88.2% (35 missing) |
| `as, bn, ml, or, pa` | 88.2% (35 missing) |

The **same 35 `common.*` keys** are missing from 10 of 11 non-English locales (`common.profile`, `common.sign_in`, `common.sign_up`, `common.settings`, `common.next`, …) — a single systemic gap, not scattered drift, so it is a cheap fix. No duplicate JSON keys. Detection priority (URL → cookie → localStorage → `Accept-Language` → `en`) is sound, and keeping English un-prefixed is correct for canonical stability. Admin UI is intentionally English-only. RTL is scaffolded (`LanguageDef.dir`) but no RTL locale exists, so it is untested.

---

## 8. Vercel Migration Readiness

**One true hard blocker.**

| #      | Blocker                                                             | Detail                                                                                                                                                         |
| ------ | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **H3** | **Nitro build preset defaults to `cloudflare`**                     | Via `@lovable.dev/vite-tanstack-config`. Produces a Worker bundle, not `.vercel/output`. Must be set to `vercel`. Everything else below is downstream of this. |
| H4     | `src/server.ts` uses the Workers `{fetch(request, env, ctx)}` shape | `env`/`ctx` are unused pass-throughs, so it likely survives the preset switch — but must be retested against Nitro's Vercel entry contract.                    |
| H5     | PWA/Workbox asset globbing                                          | Output-directory-relative; re-verify `sw.js` emission after the preset change.                                                                                 |
| H1     | `pg_cron` targets a hard-coded `*.lovable.app` URL                  | Silent breakage, not a deploy blocker. Must be re-pointed to the production domain. Fix alongside C1.                                                          |

**Clean bill of health elsewhere:** no Cloudflare bindings anywhere (no KV/D1/R2/`waitUntil`/`caches.default`), no `fs`/`child_process`/`sharp`/`canvas`/`__dirname`, no module-scope `process.env` reads, and all 25 `createServerFn` files plus the `src/routes/api/**` handlers are framework-standard and portable. `astronomy-engine`, `jspdf` and `qrcode` are pure JS. PDF generation is client-side, so it sidesteps serverless memory and timeout limits entirely.

**Config-only:** pin `engines.node` (currently unpinned), set env vars in Vercel. `nitro` is pinned to a pre-1.0 beta (`3.0.260603-beta`) — move off it when stable.

### The biggest hidden migration risk: in-memory state

Nine module-scope `Map`s hold cross-request state. On a warm Worker isolate these behave like a shared cache; on Vercel each invocation may be a fresh instance, so they degrade **silently** rather than erroring:

| State                                      | Impact on Vercel                                                                                                                                                                                   |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/lib/cache/index.ts` registry          | **Most consequential.** Without `UPSTASH_REDIS_REST_URL`/`TOKEN`, the entire cache layer becomes per-instance and effectively useless. The Upstash driver already exists — it just needs env vars. |
| `src/lib/ai/cache.ts` interpretation cache | Near-zero hit rate ⇒ every cold instance re-calls the AI provider. Direct latency **and cost** impact.                                                                                             |
| `src/lib/perf/metrics.ts` rolling window   | The admin performance dashboard would show one lambda's metrics — **actively misleading**. Needs a DB-backed or external sink.                                                                     |
| `src/lib/ai/prompts.ts` overrides          | Admin prompt overrides may not apply consistently across instances. Verify they re-hydrate from DB per request.                                                                                    |
| i18n loader, analytics, SEO caches         | Perf only; Supabase remains the source of truth.                                                                                                                                                   |

### Lovable coupling — soft, not lock-in

| Item                                   | Breaks off-platform?                                                                                                                                                                                  |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@lovable.dev/cloud-auth-js` OAuth     | **Yes.** Replace with `supabase.auth.signInWithOAuth` and drop the `lovable` provider.                                                                                                                |
| Lovable AI Gateway + `LOVABLE_API_KEY` | No — public HTTPS, keeps working. It is `is_default: true` in `ai_providers`, so it is tried first. Re-seed if you want to own the keys; `ai-router.server.ts` already supports 8 providers directly. |
| `@lovable.dev/vite-tanstack-config`    | Degrades — dictates the wrong build target (H3).                                                                                                                                                      |
| Cron URL on `*.lovable.app`            | Operationally, yes (H1).                                                                                                                                                                              |

---

## 9. Architecture & Code Quality

**Strengths.** No genuine circular dependencies (all 9 raw hits were type-only imports or commented-out examples). The per-domain module convention — `types / constants / helpers / validators / cache / calculator / engine / index` across `lib/{kundli,dasha,gochar,horoscope,sadesati,yogadosha,vastu}` — is the repo's best asset and makes adding a domain a known-shape exercise. No unused static assets. Only 3 genuinely unused dependencies.

**Muddled boundary.** Two parallel patterns for server logic — the formal `src/api/{controllers,middleware,validators,…}` layer and ad-hoc `src/lib/*.functions.ts` — with no documented rule for which to use. This ambiguity is what produced C2.

**Duplication.**

- `slugify` implemented **4 times**; the 3 simple copies (`pdf/helpers.ts`, `LegalShell.tsx`, `festivals.tsx`) are ASCII-only and will mangle the non-ASCII titles that the canonical `lib/seo/slug.ts` handles correctly.
- **5 ad-hoc `createClient()` calls** bypassing the shared singletons (`ai-router.server.ts`, `payments.functions.ts`, `pdf.functions.ts`, `razorpay.functions.ts`, `health/checks.server.ts`) — a key rotation means editing 5 files.
- Lat/long range validation hand-written **5 times**, byte-for-byte identical across `dasha`/`gochar`/`sadesati`/`yogadosha` validators.

**Dead code (9 files, all verified zero-inbound):** `src/lib/pdf.functions.ts` (206 LOC, **12 exported server functions with no call sites** — an unaudited exposed surface), the whole `src/i18n/astro/` module (466 LOC, Astro-migration leftover), `components/kundli/index.ts`, `ui-kit/PricingCard.tsx`, `ui-kit/ToolCard.tsx`, `i18n/LocalizedLink.tsx`, `lib/seo/quality.ts`, `lib/seo/redirects.ts`, `lib/analytics/index.ts`.

**Oversized files:** `tools/library.tsx` (1,729), `lib/kundli/pdf.ts` (1,660), `routes/kundli.tsx` (1,609), plus 500–750 LOC admin routes and components. The consistent offender pattern is admin routes mixing fetching, form state and rendering in one file.

**Engines.** `lib/kundli/panchang-at-birth.ts` should be confirmed to call the shared `panchang` engine rather than reimplementing tithi/nakshatra/yoga maths — duplicated astronomical formulas can drift and disagree. AI cost tracking is a stub: `costEstimate()` always returns `null` while `ai_usage_logs` has the columns, so cost widgets read zero. Server-side PDF generation would silently produce Latin-only output for Indic languages, since `pdf/fonts.ts` no-ops on the server — a latent trap if emailed reports are ever added.

---

## 10. Prioritized Action List

### P0 — before production / migration

1. **C1:** replace the publishable-key check in the three tick hooks with a real `CRON_SECRET` + `timingSafeEqual`; update the `pg_cron` job header and URL together (also clears H1).
2. **C2:** retire or fold the 6 ungoverned API routes into `/api/v1`.
3. **H3:** switch the Nitro preset to `vercel`, then re-verify `src/server.ts` and PWA output paths.
4. Resolve the `/robots.txt` static-vs-dynamic conflict.
5. Add canonical + OG tags to the 26 programmatic-SEO routes; add `twitter:card` to the homepage.
6. Set `UPSTASH_REDIS_REST_URL`/`TOKEN` in the target environment — otherwise the cache layer is inert.

### P1 — hardening and correctness

7. Rate-limit `/api/public/track.ts`.
8. Add `errorComponent`/`notFoundComponent` to the 9 loader-bearing routes missing them.
9. Backfill the 35 `common.*` keys across 10 locales.
10. Delete or wire up `src/lib/pdf.functions.ts` and `src/i18n/astro/`.
11. Consolidate the 5 `createClient()` calls and the 4 `slugify` implementations.
12. Move perf metrics off the in-memory registry to a DB-backed sink.
13. Add loading states to the six astrology detail routes.
14. Per-handler review of role checks and `inputValidator` coverage across `*.functions.ts`.

### P2 — hygiene

15. Extract a shared `validateCoordinates()`; split the four oversized files.
16. Document a single server-logic convention (`src/api/*` vs `*.functions.ts`).
17. Zod-validate the Lemon Squeezy payload; add JSON-LD to `panchang.tsx` and `temples.tsx`.
18. Remove `@ai-sdk/react` and `@hookform/resolvers`; pin `engines.node`; move `nitro` off beta.
19. Run `prettier --write` across the repo to clear the 13.6k lint issues in one commit.
20. Implement `costEstimate()` or remove the cost widgets.
