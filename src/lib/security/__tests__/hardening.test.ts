import { describe, expect, it } from "vitest";

import { redact, redactString } from "@/lib/logging/redact";
import { log, addLogSink } from "@/lib/logging/logger";
import { buildSecurityHeaders, buildContentSecurityPolicy } from "@/lib/security/headers";

describe("redaction", () => {
  it("masks sensitive keys", () => {
    const out = redact({ password: "hunter2", apiKey: "abc", nested: { token: "t" } }) as Record<
      string,
      unknown
    >;
    expect(out.password).toBe("[redacted]");
    expect(out.apiKey).toBe("[redacted]");
    expect((out.nested as Record<string, unknown>).token).toBe("[redacted]");
  });

  it("scrubs bearer tokens, JWTs and provider keys", () => {
    expect(redactString("Authorization: Bearer abc.def")).toContain("[redacted]");
    expect(redactString("eyJhbGciOi.eyJzdWIiOi.SflKxwRJ")).toBe("[redacted]");
    expect(redactString("key sk_live_1234567890")).toContain("[redacted]");
  });

  it("partially masks emails", () => {
    expect(redactString("user@example.com")).toBe("us***@example.com");
  });
});

describe("logger", () => {
  it("emits redacted entries to registered sinks", () => {
    const seen: unknown[] = [];
    const off = addLogSink((e) => seen.push(e));
    log("security", "warn", "denied for user@example.com", { token: "secret" });
    off();
    const entry = seen[0] as { channel: string; message: string; context: Record<string, unknown> };
    expect(entry.channel).toBe("security");
    expect(entry.message).toContain("us***@example.com");
    expect(entry.context.token).toBe("[redacted]");
  });
});

describe("security headers", () => {
  it("includes the OWASP baseline", () => {
    const h = buildSecurityHeaders({ hsts: true });
    expect(h["X-Content-Type-Options"]).toBe("nosniff");
    expect(h["X-Frame-Options"]).toBe("SAMEORIGIN");
    expect(h["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(h["Strict-Transport-Security"]).toContain("max-age=");
    expect(h["Permissions-Policy"]).toContain("microphone=()");
    expect(h["Content-Security-Policy"]).toContain("default-src 'self'");
  });

  it("omits HSTS for non-https and locks down dangerous directives", () => {
    expect(buildSecurityHeaders({ hsts: false })["Strict-Transport-Security"]).toBeUndefined();
    const csp = buildContentSecurityPolicy();
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("form-action 'self'");
    expect(csp).toContain("frame-ancestors 'self'");
  });
});
