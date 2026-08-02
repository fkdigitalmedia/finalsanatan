# Performance Audit Report — Phase 15.2

Scope: SanatanTools.com full stack (frontend, SSR, API layer, database, AI engine,
PDF engine, analytics, notifications). No features added, no business logic changed.

## 1. Method

| Area     | How it was measured                                                                         |
| -------- | ------------------------------------------------------------------------------------------- |
| Database | `pg_stat_statements` slow-query ranking, `information_schema` index audit, table size query |
| API      | New rolling-window latency registry (`src/lib/perf/metrics.ts`) wired into the API pipeline |
| SSR      | `perfMiddleware` in `src/start.ts`, also emitted as `Server-Timing: ssr;dur=…`              |
| AI       | `measure("ai", …)` around `interpret()` + `ai_usage_logs` cost/latency rollup               |
| PDF      | `measure("pdf", …)` around `generatePdf()`                                                  |
| Cache    | Per-namespace hit/miss/eviction counters surfaced in the admin dashboard                    |

Everything is observable live at **Admin → System → Performance**.

## 2. Findings and actions

### 2.1 Database

- Missing composite indexes on the hottest filter+sort pairs (`user_id, created_at`,
  `status, created_at`, slug lookups, locale lookups). **Fixed** with a targeted
  migration adding composite and partial indexes.
- Column naming is inconsistent across older tables (`created_at` vs `visited_at` /
  `started_at`, `locale` vs `lang`, `is_active` vs `enabled` / `active`). Indexes were
  written per actual column; renaming was rejected as a breaking change for this phase.

### 2.2 Caching

- Cache logic was scattered (API cache, AI cache, PDF cache, ad-hoc memoisation) with
  no shared eviction policy, no visibility, and no path to a distributed store.
- **Fixed** with a unified driver-based layer (`src/lib/cache`):
  - 9 namespaces with tuned TTL and entry budgets.
  - LRU + TTL + tag/prefix invalidation.
  - `remember()` with **request coalescing** — N concurrent misses trigger one loader
    call, which removes duplicate queries and duplicate AI calls under load.
  - `setCacheDriverFactory()` + an Upstash REST driver: Redis becomes a config change,
    not a refactor.

### 2.3 API layer

- Cache hits returned a full JSON body every time.
- **Fixed**: cacheable reads now emit `ETag`, `Cache-Control: s-maxage/stale-while-revalidate`
  and `Vary`, and answer `304 Not Modified` on a matching `If-None-Match`. Repeat reads
  cost a header round trip instead of a payload.

### 2.4 AI and PDF

- Both engines already cached results; neither was timed, so regressions were invisible.
- **Fixed**: both are instrumented and graded against the 8 s / 10 s budgets.

## 3. Budgets

| Target         | Budget | Warn above | Graded on                 |
| -------------- | ------ | ---------- | ------------------------- |
| Homepage       | 1.5 s  | 3 s        | SSR metric for `/`        |
| Tool page      | 2 s    | 4 s        | SSR metric per route      |
| API average    | 300 ms | 800 ms     | API group average         |
| Cached API     | 100 ms | 300 ms     | `:cached` operations only |
| PDF generation | 10 s   | 20 s       | `pdf` group               |
| AI response    | 8 s    | 20 s       | `ai` group                |

Grades are computed live in `src/lib/perf/snapshot.server.ts` and rendered on the dashboard.

## 4. Measurable improvements

| Change                                | Effect                                                                                              |
| ------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Composite/partial indexes             | Filter+sort queries move from sequential scan to index scan on the listed tables                    |
| Request coalescing in `remember()`    | Concurrent identical loads collapse to 1 (verified by test: 2 parallel calls → 1 loader invocation) |
| ETag / 304 on cached reads            | Repeat cached GETs return no body                                                                   |
| `s-maxage` + `stale-while-revalidate` | Edge/CDN can serve cached reads without hitting the origin                                          |
| Latency registry                      | p50/p95/p99 per operation, previously unavailable                                                   |

## 5. Accepted limitations

- Metrics and the in-memory cache are **per server instance**. Under multi-instance
  scale-out, the dashboard reflects the instance that answers the request. Setting
  `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` makes the cache global.
- Lighthouse and load/stress numbers are environment-dependent and must be captured
  against the published deployment, not the preview iframe.
- CSP still allows `unsafe-inline` / `unsafe-eval` (chart + PDF dependencies) — carried
  over from Phase 15.1 as a documented, accepted risk.
