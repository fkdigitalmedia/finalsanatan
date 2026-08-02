# Centralized Logging

One entry point for every log line: `src/lib/logging`.

```ts
import { logger } from "@/lib/logging";

logger.app.info("kundli generated", { userId, toolId: "kundli" });
logger.auth.warn("sign-in failed", { email }); // email is auto-masked
logger.security.warn("role check denied", { path, role });
logger.error.error("pdf render crashed", { reportId }, err);
```

## Channels

| Channel    | Use for                                            |
| ---------- | -------------------------------------------------- |
| `app`      | business/domain events                             |
| `api`      | inbound API + server-function traffic              |
| `security` | authz denials, suspicious input, policy violations |
| `auth`     | sign-in / sign-out / session lifecycle             |
| `error`    | unhandled exceptions                               |

## Guarantees

- **Redaction first.** Keys matching password/secret/token/api key/authorization/
  cookie/session/card/etc. are replaced with `[redacted]`. Bearer tokens, JWTs,
  `sk_`/`sb_`/`rzp_`/`whsec_` keys and email addresses are scrubbed from free text.
- **No stack traces in production.** `error.stack` is only attached outside
  production; API responses never carry internal messages (see `src/api/errors`).
- **Structured.** Every line is JSON with `ts`, `level`, `channel`, `message`,
  `context`.
- **Level gating.** `LOG_LEVEL` env var, defaulting to `info` in production and
  `debug` elsewhere.
- **Pluggable sinks.** `logger.addSink(fn)` to forward entries (e.g. persist
  security logs). A throwing sink can never break a request.
