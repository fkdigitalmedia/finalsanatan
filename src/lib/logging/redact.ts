// Redaction — strips credentials and PII from anything we log.

const SENSITIVE_KEY = new RegExp(
  [
    "pass(word)?",
    "secret",
    "token",
    "api[-_]?key",
    "authorization",
    "cookie",
    "session",
    "credential",
    "otp",
    "pin",
    "card",
    "cvv",
    "signature",
    "service[-_]?role",
  ].join("|"),
  "i",
);

const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const BEARER_RE = /Bearer\s+[A-Za-z0-9._~+/-]+=*/gi;
const JWT_RE = /\beyJ[A-Za-z0-9_-]{5,}\.[A-Za-z0-9_-]{5,}\.[A-Za-z0-9_-]{5,}\b/g;
const LONG_KEY_RE = /\b(sk|sb|rzp|pk|whsec)_[A-Za-z0-9_-]{8,}\b/gi;

export const REDACTED = "[redacted]";

export function redactString(value: string): string {
  return value
    .replace(BEARER_RE, `Bearer ${REDACTED}`)
    .replace(JWT_RE, REDACTED)
    .replace(LONG_KEY_RE, REDACTED)
    .replace(EMAIL_RE, (m) => {
      const [user, domain] = m.split("@");
      return `${user.slice(0, 2)}***@${domain}`;
    });
}

/** Deep-clone `value`, masking sensitive keys and scrubbing strings. */
export function redact(value: unknown, depth = 0): unknown {
  if (depth > 6) return REDACTED;
  if (value == null) return value;
  if (typeof value === "string") return redactString(value);
  if (typeof value === "number" || typeof value === "boolean") return value;
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.slice(0, 50).map((v) => redact(v, depth + 1));
  if (typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = SENSITIVE_KEY.test(k) ? REDACTED : redact(v, depth + 1);
    }
    return out;
  }
  return REDACTED;
}

export function redactContext(
  context?: Record<string, unknown>,
): Record<string, unknown> | undefined {
  if (!context) return undefined;
  return redact(context) as Record<string, unknown>;
}
