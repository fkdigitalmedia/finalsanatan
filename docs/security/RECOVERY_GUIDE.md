# Backup & Recovery Guide

## 1. What is backed up

| Asset                                      | Mechanism                                                             | Frequency                           | Retention  |
| ------------------------------------------ | --------------------------------------------------------------------- | ----------------------------------- | ---------- |
| Database (all `public` tables, auth users) | Managed automated backups                                             | Daily (point-in-time on paid tiers) | Per plan   |
| Storage objects                            | Managed bucket replication                                            | Daily                               | Per plan   |
| Configuration (env/secrets inventory)      | Manual export of secret **names** + values held in a password manager | On every change                     | Indefinite |
| Code & migrations                          | Git history (`supabase/migrations/*`)                                 | Every commit                        | Indefinite |

Secrets themselves (`SUPABASE_SERVICE_ROLE_KEY`, `RAZORPAY_KEY_SECRET`, …) are
never exported into the repository or into backup artifacts. Keep the canonical
copy in the team password manager.

## 2. Manual database export (pre-release snapshot)

Before a risky migration, capture a logical dump from an operator machine with
the connection string held in the password manager:

```bash
pg_dump --no-owner --no-privileges --format=custom "$DB_URL" > sanatantools-$(date +%F).dump
```

Store the dump in encrypted object storage. Never commit it.

## 3. Restore procedure

1. **Declare the incident.** Freeze deploys; put the app in a maintenance state.
2. **Pick the restore point.** Latest healthy automated backup, or the manual
   dump taken before the failing migration.
3. **Restore the database.**
   - Managed backup: restore through the platform backup UI to the target point.
   - Logical dump: `pg_restore --clean --if-exists --no-owner -d "$DB_URL" file.dump`
4. **Re-apply pending migrations** that post-date the restore point, in order.
5. **Re-seed derived data** that is safe to recompute: analytics rollups,
   notification schedules, SEO caches. Never re-seed user data.
6. **Verify secrets** are still bound to the environment (`/api/public/status`
   should report the AI provider as `ok`, not `degraded`).
7. **Smoke test**: `/api/public/health`, `/api/public/ready`,
   `/api/public/status`, sign-in, generate a free Kundli, load `/panchang`,
   open `/admin`.
8. **Unfreeze** and post an incident note.

## 4. Backup verification (monthly)

1. Restore the most recent backup into a scratch project.
2. Run: row counts for `profiles`, `user_roles`, `orders`, `user_entitlements`,
   `legal_pages`, `festivals`, `temples`.
3. Confirm RLS is enabled on every public table after restore.
4. Record the verification date in the release log.

## 5. Recovery objectives

- **RPO** (max data loss): 24 hours (daily backup); minutes with PITR enabled.
- **RTO** (max downtime): 2 hours for a full database restore + verification.

## 6. Rollback of application code

Application deploys are immutable. To roll back, redeploy the previous
published build; the database is forward-compatible because migrations are
additive (no destructive column drops in the same release as code changes).
