# Caching Strategy

## Layers

1. **Browser / CDN** — `Cache-Control: public, max-age=0, s-maxage=<ttl>,
stale-while-revalidate=<2×ttl>` plus a weak `ETag` on every cacheable API read.
   A matching `If-None-Match` returns `304` with no body.
2. **Application cache** (`src/lib/cache`) — namespaced, driver-backed, in-process by
   default, Redis/Upstash when configured.
3. **Engine caches** — AI interpretation cache and PDF render cache, keyed by a
   deterministic hash of their inputs.
4. **Database** — Postgres shared buffers; helped by the composite indexes added in
   Phase 15.2.

## Namespaces and TTLs

| Namespace   | Default TTL | Max entries | Contents                                  |
| ----------- | ----------- | ----------- | ----------------------------------------- |
| `query`     | 60 s        | 500         | Raw database result sets                  |
| `result`    | 10 min      | 300         | Engine output (dasha, transit, panchang)  |
| `session`   | 5 min       | 500         | Short-lived request/session values        |
| `user`      | 2 min       | 500         | Entitlements, preferences                 |
| `config`    | 15 min      | 100         | Site settings, gateways, providers, flags |
| `analytics` | 5 min       | 200         | BI aggregates                             |
| `seo`       | 30 min      | 400         | Metadata, sitemaps, schema                |
| `ai`        | 24 h        | 200         | AI completions by prompt hash             |
| `api`       | 5 min       | 500         | HTTP response envelopes                   |

## Usage

```ts
import { cache, keyOf } from "@/lib/cache";

const settings = await cache("config").remember("site-settings", () => loadSiteSettings(), {
  tags: ["settings"],
});

const report = await cache("result").remember(
  keyOf("dasha", { dob, tob, lat, lon }),
  () => computeDasha(input),
  { ttlMs: 30 * 60_000, tags: ["kundli"] },
);
```

`remember()` coalesces concurrent misses: only one loader runs per key in flight.

## Invalidation

- **Tags** are the primary mechanism: `cache("seo").invalidateTag("festivals")`.
- `invalidateTagEverywhere(tag)` clears a tag across all namespaces after a content edit.
- Admin → System → Performance can flush one namespace or all of them.

Tag names in use: `settings`, `festivals`, `temples`, `legal`, `blog`, `kundli`,
`horoscope`, `panchang`, `pricing`.

## Going distributed (Redis / Upstash)

No application code changes. Either:

1. Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`, and register the driver
   once at server boot:

```ts
import { setCacheDriverFactory, MemoryCacheDriver, NAMESPACE_TTL_MS } from "@/lib/cache";
import { UpstashCacheDriver } from "@/lib/cache/upstash-driver.server";

setCacheDriverFactory(
  (ns) =>
    UpstashCacheDriver.fromEnv(NAMESPACE_TTL_MS[ns]) ?? new MemoryCacheDriver(NAMESPACE_TTL_MS[ns]),
);
```

2. Or implement `CacheDriver` for any other store and pass it to the same factory.

Tag invalidation is implemented with Redis sets (`tag:<name>`), so semantics are
identical across drivers.

## What must never be cached

- Anything derived from `auth.uid()` in a `public` (shared) namespace bucket.
  Private endpoints are keyed per user by the API pipeline.
- Payment/order state, entitlement grants at the moment of purchase.
- Health and status endpoints (`no-store`).
