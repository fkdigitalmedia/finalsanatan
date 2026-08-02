# Production Hardening Checklist

Run before every production release.

## Security

- [ ] `bun run test` — full suite green (includes security header + redaction tests)
- [ ] Dependency scan clean of high/critical advisories
- [ ] Database linter clean (RLS enabled + policies + GRANTs on every public table)
- [ ] No secrets in the repository (`rg -i "sk_live|whsec_|service_role|BEGIN PRIVATE KEY" src`)
- [ ] New tables: RLS enabled, GRANTs written in the same migration
- [ ] New API routes: `minRole`, Zod validator, rate cost declared
- [ ] New server functions: `requireSupabaseAuth` where user data is touched
- [ ] Admin-only logic re-verifies role server-side, never trusts the UI

## Headers & Transport

- [ ] `curl -sI https://sanatantools.com | grep -Ei 'content-security|strict-transport|x-frame|referrer|permissions'`
- [ ] HTTPS enforced, HSTS present with `includeSubDomains`
- [ ] API responses `Cache-Control: no-store`

## Observability

- [ ] `GET /api/public/health` → 200
- [ ] `GET /api/public/ready` → 200
- [ ] `GET /api/public/status` → all components `ok`
- [ ] Cron ticks (notifications, analytics, festivals, panchang) ran in the last hour
- [ ] Error logs contain no stack traces leaked to clients

## Data

- [ ] Latest database backup verified restorable (see RECOVERY_GUIDE.md)
- [ ] Storage bucket policies reviewed
- [ ] Configuration/env inventory exported and stored securely

## Performance

- [ ] Analytics rollups current
- [ ] Cache hit rate acceptable on hot API endpoints
- [ ] No unbounded queries added (every list endpoint paginates)
