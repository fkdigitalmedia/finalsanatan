# Notification & Communication Engine (Phase 14.8)

Single entry point for every message the platform sends.

## Modules

| File                  | Role                                                                   |
| --------------------- | ---------------------------------------------------------------------- |
| `types.ts`            | Channels, notification types, priorities, preference shape             |
| `templates.ts`        | `{{variable}}` rendering, variable extraction, template fallback chain |
| `preferences.ts`      | Preference gating, quiet hours, retry backoff                          |
| `schedules.ts`        | Recurring schedule due-evaluation (daily/weekly/monthly/yearly)        |
| `providers.server.ts` | Per-channel delivery adapters (in-app, email, push, webhook, relays)   |
| `engine.server.ts`    | `enqueueNotification`, `enqueueBulk`, `processQueue`, `requeueStuck`   |

## Sending from feature code

```ts
const { enqueueNotification } = await import("@/lib/notifications/engine.server");
await enqueueNotification({
  userId,
  type: "report_ready",
  channels: ["in_app", "email"],
  data: { reportName: "Kundli Report", downloadLink: url },
  dedupeKey: `report:${reportId}`,
});
```

The engine loads the user's preferences, skips disabled channels/categories,
defers non-critical sends past quiet hours, renders the matching template and
writes a queue row. The tick route delivers it and records a delivery row.

## Delivery loop

`/api/public/hooks/notifications-tick` runs every 5 minutes via pg_cron:
requeue stuck rows → evaluate schedules → drain the due queue (priority first,
exponential backoff, max attempts then `failed`).

## Admin

`/admin/notifications` — analytics, broadcast, manual trigger, template editor
with live preview, channel switches + JSON config, queue monitor with
retry/cancel/process-now, recurring schedules and the delivery log.

## Users

`/notifications` → Preferences tab: channel switches, category switches,
quiet hours, timezone and a global unsubscribe (critical billing/security
messages always deliver).
