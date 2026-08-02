# Deployment Recommendations

## Environment

| Variable                   | Purpose                                                     | Required                |
| -------------------------- | ----------------------------------------------------------- | ----------------------- |
| `LOG_LEVEL`                | `info` in production, `debug` only while diagnosing         | no (defaults to `info`) |
| `APP_VERSION`              | Shown on the performance dashboard and `/api/public/status` | recommended             |
| `UPSTASH_REDIS_REST_URL`   | Distributed cache endpoint                                  | only for multi-instance |
| `UPSTASH_REDIS_REST_TOKEN` | Distributed cache token                                     | only for multi-instance |

Without the Upstash pair the app runs exactly as before, on the in-process cache.

## Edge / CDN

Cacheable API reads now emit `s-maxage` and `stale-while-revalidate`. Configure the CDN to
honour origin `Cache-Control` and to forward `If-None-Match`, so repeat reads terminate at
the edge with a `304`.

Static assets (`/assets/*`, fonts, icons, manifest) are content-hashed by the build and can
be served with `Cache-Control: public, max-age=31536000, immutable`.

Enable Brotli (fallback gzip) and HTTP/2 or HTTP/3 at the edge — the runtime does not
compress responses itself.

## Scaling

- **Compute**: raise the Lovable Cloud database instance size only when the health snapshot
  shows memory or connection saturation. High _disk_ usage is a separate control.
- **Cache**: the moment more than one app instance serves traffic, switch to Upstash so hit
  rates and invalidation are shared. Until then the in-process cache is faster and free.
- **Rate limiting** is in-memory per instance (carried over from Phase 15.1). It becomes
  per-instance-lenient under scale-out; move it onto the same Redis when that happens.

## Background work

Already queued: notification delivery (5-minute cron drain), translation queue, analytics
alert scan (15-minute cron). Keep new heavy work on the same pattern — enqueue in the
request, drain in cron — rather than extending request duration.

## Post-deploy verification

1. `GET /api/public/health` → `200 ok`
2. `GET /api/public/ready` → `200 ok`
3. `GET /api/public/status` → every component `ok`
4. Repeat a cacheable API read with the returned `ETag` → `304`
5. Admin → System → Performance → no `critical` budget after warm-up
6. Lighthouse against the published URL

## Rollback

All Phase 15.2 changes are additive and non-behavioural: the cache layer defaults to
memory, metrics are fire-and-forget, and the new headers are advisory. Reverting the
`Cache-Control`/`ETag` block in `src/api/middleware/pipeline.ts` restores the previous
response semantics without touching business logic.
