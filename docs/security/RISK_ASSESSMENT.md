# Risk Assessment — SanatanTools.com

Scoring: Likelihood (L) × Impact (I), 1–5 each. Risk = L × I.

| #   | Risk                                        | L   | I   | Score | Controls in place                                                                                       | Residual |
| --- | ------------------------------------------- | --- | --- | ----- | ------------------------------------------------------------------------------------------------------- | -------- |
| 1   | Privilege escalation to admin               | 1   | 5   | 5     | Roles in `user_roles`, `has_role()` SECURITY DEFINER, server-side re-check in every privileged function | Low      |
| 2   | Data leakage between users                  | 1   | 5   | 5     | RLS on all public tables, `auth.uid()` scoping, per-user cache keys                                     | Low      |
| 3   | Payment tampering (plan/amount)             | 1   | 5   | 5     | Server-side order creation + signature verification, entitlements written server-side only              | Low      |
| 4   | Credential leak via logs                    | 2   | 4   | 8     | Automatic redaction in `src/lib/logging`                                                                | Low      |
| 5   | XSS from AI/blog content                    | 2   | 4   | 8     | Sanitized Markdown rendering, CSP, no raw HTML injection of user content                                | Low-Med  |
| 6   | API abuse / scraping                        | 3   | 3   | 9     | Tiered rate limits, caching, role gating                                                                | Medium   |
| 7   | AI cost runaway                             | 3   | 3   | 9     | Usage logging, cost analytics, alert rules with 15-min cron                                             | Medium   |
| 8   | Third-party outage (payments, AI, geocoder) | 3   | 3   | 9     | Graceful fallbacks, provider fallback chain, degraded status reporting                                  | Medium   |
| 9   | Data loss                                   | 1   | 5   | 5     | Managed daily backups + documented restore procedure                                                    | Low      |
| 10  | Dependency vulnerability                    | 3   | 3   | 9     | Automated dependency scan in the release checklist                                                      | Medium   |
| 11  | Misconfigured RLS on a new table            | 2   | 5   | 10    | Migration policy: GRANT + RLS + policies in the same migration; linter run each release                 | Medium   |
| 12  | CSP weakened by `unsafe-inline`             | 3   | 2   | 6     | Strict object-src/base-uri/form-action; nonce migration planned                                         | Medium   |

## Top follow-ups (not blocking launch)

1. Nonce-based CSP to drop `'unsafe-inline'` / `'unsafe-eval'`.
2. Distributed rate-limit store once running multiple instances.
3. Persist `security` channel logs to a queryable table with retention.
