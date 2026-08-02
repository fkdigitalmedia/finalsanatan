# Analytics & Business Intelligence (Phase 14.9)

First-party, centralized analytics for SanatanTools. Every metric is derived
from data we already own (`analytics_events`, `analytics_sessions`,
`ai_usage_logs`, `orders`, `user_entitlements`, `profiles`) — no third-party
dependency is required, and GA4/Clarity remain optional add-ons.

## Architecture

```text
browser ──track()──► /api/public/track ──► analytics_events
                                              │
                     server functions ────────┤
             (analytics-bi.functions.ts)      ▼
        ┌──────── dashboard.ts ── loadDashboard(dashboard, range, filters)
        │             ├── users.ts / funnels.ts / cohorts.ts / retention.ts
        │             ├── revenue.ts / ai.ts / seo.ts / performance.ts
        │             └── engine.ts (fetch, bucket, timeseries, breakdown)
        ├──────── reports.ts ──► export.ts (csv | xlsx | json | pdf)
        └──────── alerts.ts  ──► alert_events + notification engine
```

| Module           | Responsibility                                                   |
| ---------------- | ---------------------------------------------------------------- |
| `types.ts`       | Shared browser-safe contracts                                    |
| `constants.ts`   | Canonical event names, funnel, cache TTLs, dashboards            |
| `events.ts`      | Event catalog + runtime registration for new features            |
| `track.ts`       | Low-level batching browser tracker (beacon + keepalive)          |
| `tracker.ts`     | Typed semantic helpers (`analytics.kundliGenerated(...)`)        |
| `engine.ts`      | Query primitives: fetch, count, bucket, timeseries, breakdown    |
| `metrics.ts`     | Metric dictionary + math (delta, percentile, formatting)         |
| `validators.ts`  | Zod validation, range resolution, granularity, filter sanitizing |
| `cache.ts`       | TTL + tag cache (`withCache`) for expensive aggregations         |
| `users.ts`       | Audience, activity, geo, tech + per-tool statistics              |
| `funnels.ts`     | Visitor → registration → tool → PDF → premium → renewal          |
| `cohorts.ts`     | Signup cohorts by retention / engagement / revenue / tools       |
| `retention.ts`   | 1/7/30/90/180/365-day retention + curve                          |
| `revenue.ts`     | Revenue, MRR, ARR, AOV, LTV, refunds, coupons, gateways          |
| `ai.ts`          | Provider/model usage, tokens, cost, latency, failures, fallbacks |
| `seo.ts`         | Organic traffic, landing pages, internal search, devices         |
| `performance.ts` | Core Web Vitals, JS errors, API latency                          |
| `dashboard.ts`   | Composes overview, realtime and per-dashboard payloads           |
| `reports.ts`     | Flat exportable tables for every dashboard                       |
| `export.ts`      | CSV / Excel / JSON / printable-PDF renderers                     |
| `alerts.ts`      | Cost, payment, error, traffic and subscription alerting          |
| `bi.server.ts`   | Server-only glue + staff gate + audit logging                    |

## Tracking new features

Nothing needs to change in the platform when a new tool ships — call a typed
helper and the event flows into every dashboard automatically:

```ts
import { analytics } from "@/lib/analytics";

analytics.toolUsed("varshphal", { premium: true });
analytics.pdfGenerated("varshphal", { pages: 22 });
analytics.aiReportGenerated("varshphal", { provider: "google", tokens: 4210 });
```

To surface a brand-new event type in the admin catalog, register it once:

```ts
import { registerEvents } from "@/lib/analytics";

registerEvents([{ name: "temple_visit_planned", label: "Temple visit planned", group: "tools" }]);
```

## Metrics dictionary

`listMetrics()` returns every metric with key, label, group, unit and
description. The same list is exportable from the admin **Reports** tab
(`metrics_dictionary`) so product and marketing share one definition.

## Dashboards

`/admin/analytics` exposes Overview, Realtime, Traffic, Users, Tools, AI, SEO,
Revenue, Funnels, Retention, Cohorts, Reports, Alerts, Performance and
Integrations. Each tab is a thin view over `getBiDashboard({ dashboard })`.

## API

All BI access is staff-gated (`is_staff`) through server functions in
`src/lib/analytics-bi.functions.ts`:

- `getBiDashboard({ dashboard, days|from|to, granularity, filters })`
- `getBiCohorts({ metric, period, periods, days })`
- `getBiReport({ type, days, filters })`
- `exportBiReport({ type, format, days })` — also writes an audit-log row
- `evaluateBiAlerts({ persist })`

Public ingestion stays on `/api/public/track`; the cron endpoint
`/api/public/hooks/analytics-tick` (apikey-gated) evaluates alert rules,
persists firings and notifies admins through the notification engine.

## Filters

`country`, `language`, `device`, `browser`, `os`, `tool`, `path`, `userType`,
`plan`, `provider`. Unknown keys are stripped by `sanitizeFilters`, and scans
are hard-capped at `MAX_SCAN_ROWS` so a wide date range can never run away.

## Performance

- Aggregations are memoized with `withCache` (30s live, 5m overview, 10m revenue).
- Counting queries use `head: true` so no rows cross the wire.
- Charts and heavy tabs are rendered only when their tab is opened.
- Exports are capped at `MAX_EXPORT_ROWS` (50k).

## Privacy & security

- Every read requires a staff role; the RLS-scoped request client is used.
- No raw IPs or emails are stored on events; sessions hold coarse geo only.
- Users can opt out client-side (`setAnalyticsOptOut(true)`), which stops
  collection at the source.
- Exports are audit-logged with actor, report type and format.

## Testing

`src/lib/analytics/__tests__/analytics.test.ts` covers metric math, bucketing,
aggregation, validators, caching, export encoders and the event catalog.
Run with `bunx vitest run src/lib/analytics`.
