// ============================================================
// Universal API Layer — Rate limiting
// ------------------------------------------------------------
// Fixed-window counter per (subject, endpoint-bucket), with a
// different budget per role. In-memory per server instance —
// good enough for abuse smoothing; a shared store can be added
// later behind the same `RateLimiter` interface.
// ============================================================

import type { ApiRole } from "../auth";
import { rateLimited } from "../errors";

export interface RateRule {
  /** Requests allowed inside the window. */
  limit: number;
  /** Window length in ms. */
  windowMs: number;
}

export const RATE_RULES: Record<ApiRole, RateRule> = {
  guest: { limit: 60, windowMs: 60_000 },
  user: { limit: 180, windowMs: 60_000 },
  premium: { limit: 600, windowMs: 60_000 },
  admin: { limit: 1200, windowMs: 60_000 },
  super_admin: { limit: 5000, windowMs: 60_000 },
};

/** Expensive endpoints (AI, PDF) consume more of the budget. */
export const DEFAULT_COST = 1;

export interface RateResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
}

interface Window {
  count: number;
  resetAt: number;
}

export class RateLimiter {
  private windows = new Map<string, Window>();

  constructor(private rules: Record<ApiRole, RateRule> = RATE_RULES) {}

  check(subject: string, role: ApiRole, cost = DEFAULT_COST): RateResult {
    const rule = this.rules[role] ?? this.rules.guest;
    const now = Date.now();
    const key = `${role}|${subject}`;
    let w = this.windows.get(key);

    if (!w || w.resetAt <= now) {
      w = { count: 0, resetAt: now + rule.windowMs };
      this.windows.set(key, w);
    }

    const wouldBe = w.count + cost;
    if (wouldBe > rule.limit) {
      return {
        allowed: false,
        limit: rule.limit,
        remaining: Math.max(0, rule.limit - w.count),
        resetAt: w.resetAt,
        retryAfterSeconds: Math.max(1, Math.ceil((w.resetAt - now) / 1000)),
      };
    }

    w.count = wouldBe;
    if (this.windows.size > 5000) this.prune(now);
    return {
      allowed: true,
      limit: rule.limit,
      remaining: Math.max(0, rule.limit - w.count),
      resetAt: w.resetAt,
      retryAfterSeconds: 0,
    };
  }

  private prune(now: number): void {
    for (const [k, v] of this.windows) if (v.resetAt <= now) this.windows.delete(k);
  }

  reset(): void {
    this.windows.clear();
  }
}

export const rateLimiter = new RateLimiter();

export function enforceRateLimit(subject: string, role: ApiRole, cost = DEFAULT_COST): RateResult {
  const result = rateLimiter.check(subject, role, cost);
  if (!result.allowed) {
    throw rateLimited(
      `Rate limit exceeded for the "${role}" tier. Try again in ${result.retryAfterSeconds}s.`,
      { limit: result.limit, retryAfterSeconds: result.retryAfterSeconds },
    );
  }
  return result;
}
