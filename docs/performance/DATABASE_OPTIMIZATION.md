# Database & Query Optimization Report — Phase 15.2

## Index strategy

Indexes were added only where a real access pattern exists in the codebase
(filter column + sort column together), not speculatively — every index costs
write throughput and disk.

Patterns covered:

| Pattern                     | Shape                                                 | Example tables                                                                                                           |
| --------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Owner timeline              | `(user_id, created_at DESC)`                          | `pdf_reports`, `user_kundlis`, `horoscope_history`, `notifications`, `orders`, `saved_mantras`, `bookmarks`, `favorites` |
| Moderation / workflow queue | `(status, created_at DESC)`                           | `notification_queue`, `translation_queue`, `user_reports`, `orders`                                                      |
| Slug lookup                 | `(slug)` unique/btree                                 | `admin_festivals`, `admin_articles`, `admin_temples`, `legal_pages`                                                      |
| Localisation                | `(<parent>_id, locale                                 | lang)`                                                                                                                   | `festival_translations`, `legal_page_translations`, `translations` |
| Time-series analytics       | `(created_at DESC)` / `(visited_at)` / `(started_at)` | `analytics_events`, `analytics_sessions`, `ai_usage_logs`, `affiliate_clicks`                                            |
| Role lookup                 | `(user_id, role)`                                     | `user_roles` (already unique)                                                                                            |

## Column naming inconsistencies found

Older tables diverge from the `created_at` convention:

| Table                | Timestamp column |
| -------------------- | ---------------- |
| `affiliate_clicks`   | `visited_at`     |
| `analytics_sessions` | `started_at`     |

Similarly `locale` vs `lang`, and `is_active` vs `enabled` / `active`.
Indexes were written against the actual column names. **Renaming was deliberately
not done** — it is a breaking change and this phase is non-behavioural.

## Query rules for new code

1. **Always project columns.** `select("id, title, slug")`, never `select("*")` on a
   list endpoint. Wide rows dominate transfer time on `admin_festivals` (65 columns).
2. **Always paginate.** `.range(from, to)` with a hard cap; never fetch an unbounded set
   for a UI list.
3. **Sort on an indexed column.** If you sort by it, it belongs in the composite index
   after the filter column.
4. **Kill N+1 with embeds.** Use PostgREST relationship embedding
   (`select("id, festival:admin_festivals(name)")`) instead of a per-row lookup loop.
5. **Count separately and sparingly.** `{ count: "exact", head: true }` on its own query;
   do not attach an exact count to every page fetch.
6. **Cache read-mostly config.** Site settings, gateways, providers and tool overrides go
   through `cache("config")`.
7. **Type select strings as `string`** and pin the row shape with `.returns<T>()` when a
   query builder is assembled conditionally — otherwise the type checker parses every
   select-string variant and typecheck time explodes.

## Monitoring

- `supabase--slow_queries` ranks statements by total execution time.
- `EXPLAIN (ANALYZE, BUFFERS)` on any candidate before and after adding an index.
- Admin → System → Performance shows queue depth, AI volume/cost and PDF volume over 24 h.

## Full-text search

Search currently uses `ilike` prefix matching, which is adequate at present volume.
When the corpus grows, the migration path is a generated `tsvector` column plus a GIN
index on `admin_articles` and `admin_festivals` — no application redesign required,
since search already goes through a single server function.
