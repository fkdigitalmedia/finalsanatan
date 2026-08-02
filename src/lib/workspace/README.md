# Phase 14.5 — User Dashboard & Astrology Workspace

The workspace is the permanent home for a signed-in user's astrology life:
saved charts, family profiles, reports, downloads, horoscope history, billing
and settings. Every future module plugs in without schema or UI rewrites.

## Architecture

```
src/lib/workspace/
  types.ts       open unions (report kinds, periods, relationships) + row types
  api.ts         typed Data API access (pagination, search, RLS-scoped)
  hooks.ts       React Query hooks (caching, keepPreviousData, invalidation)
  insights.ts    pure adapters over Panchang / Kundli / Dasha / Gochar engines
  download.ts    PDF export via the Universal PDF Engine
  shared.functions.ts  public read for explicitly shared reports

src/components/user/
  DashboardShell.tsx  sidebar + global search + page chrome
  WorkspaceUI.tsx     EmptyState / Pager / SkeletonGrid
  KundliForm.tsx      chart create & edit form (Photon place picker)

src/routes/_authenticated/
  dashboard · my-kundlis · family · reports · downloads ·
  horoscope-history · billing · profile · settings · notifications
src/routes/reports.shared.$token.tsx   public shared-report page
```

**No business logic lives in the dashboard.** All astrology values come from
existing engines (`@/lib/panchang`, `@/lib/kundli`, `@/lib/dasha`,
`@/lib/gochar`, `@/lib/horoscope`, `@/lib/pdf`, `@/lib/ai`). `insights.ts`
only reshapes their JSON for widgets, which is why it is pure and unit-tested.

## Database relationships

```
auth user
 ├─ profiles / user_settings / user_entitlements / orders   (existing)
 ├─ user_kundlis ──┬─ horoscope_history.kundli_id
 │                 └─ user_reports.kundli_id
 ├─ family_members ┬─ user_kundlis.family_member_id
 │                 └─ user_reports.family_member_id
 ├─ user_reports ──── report_downloads.report_id
 │                 └─ pdf_reports.id (pdf_report_id)
 ├─ report_downloads
 ├─ user_devices          (session / device list)
 └─ user_activity_log     (per-user audit trail)
```

Every table is RLS-locked to `auth.uid() = user_id`. The single exception is
`user_reports`, which additionally allows anonymous SELECT when
`is_shared = true AND share_token IS NOT NULL` — that is what powers
`/reports/shared/$token`.

## API flow

1. Component calls a hook (`useReports`, `useKundlis`, …).
2. Hook calls `api.*`, which issues an RLS-scoped Data API query with
   `range()` pagination and `count: "exact"`.
3. Mutations go through `useWorkspaceMutation`, which invalidates the `["ws"]`
   query prefix so every affected panel refreshes once.
4. Engine-derived widgets run inside `useQuery` with long `staleTime`
   (15 min panchang, 1 h dasha/gochar) — calculations are deterministic, so
   caching is safe and cheap.

Server-side reads that must work for signed-out visitors (shared reports) go
through `createServerFn` with the publishable key, never the admin client.

## Component structure

`DashboardShell` owns navigation (grouped Workspace / Library / Account) and
global search across kundlis, family, reports, downloads and horoscopes.
Pages compose `EmptyState`, `Pager` and `SkeletonGrid` so loading, empty and
paged states look identical everywhere.

## Performance

- Pagination everywhere (`DEFAULT_PAGE_SIZE = 12`) with `keepPreviousData`.
- React Query caching + a single invalidation prefix.
- Engine results memoised per chart/day.
- Images lazy-loaded; PDF fonts lazy-loaded by the PDF engine.

## Security

- RLS on every table; the client never sees another user's rows.
- Free-text search is sanitized (`sanitizeSearch`) before reaching PostgREST
  filters.
- Share tokens are 128-bit random hex, validated server-side by regex.
- `user_devices` gives users a device list; `user_activity_log` is their own
  audit trail (`api.logActivity`).
- Role gating is inherited from the managed `_authenticated` layout; admin
  surfaces stay under `_admin`.

## Multilingual & responsive

Chart, report and horoscope rows carry a `language` column, which flows into
the PDF engine and AI interpretation layer. Layouts are mobile-first grids
and the routes are inside the existing PWA shell.

## Future mobile app compatibility

Every dashboard read/write is a plain table operation or an existing engine
call, all of which are already exposed through the Phase 14.4 API layer at
`/api/v1/*`. A mobile client can reuse the same contracts: the dashboard is a
view over that layer, not a parallel implementation.

## Testing

`src/lib/workspace/__tests__/workspace.test.ts` covers pagination, search
sanitization, duplication, share tokens, device parsing, catalogue
completeness, all engine adapters (panchang, muhurat, dasha, gochar) and the
PDF variable/filename builders.

```
bunx vitest run src/lib/workspace
```
