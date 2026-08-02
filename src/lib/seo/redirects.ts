// ============================================================
// Phase 14.7 — Redirect manager (pure logic).
// Matching supports exact paths, trailing-slash tolerance, wildcard
// prefixes (`/old/*` → `/new/*`) and 301/302/307/308/410.
// Bulk import/export uses CSV so migrations can be pasted in one go.
// ============================================================

import { normalizePath } from "./canonical";

export interface RedirectRule {
  from_path: string;
  to_path: string;
  code: number;
  enabled?: boolean;
}

export interface RedirectMatch {
  to: string;
  code: number;
  rule: RedirectRule;
}

export const VALID_CODES = [301, 302, 307, 308, 410];

/** Find the redirect that applies to `path`, or null. Longest match wins. */
export function matchRedirect(path: string, rules: RedirectRule[]): RedirectMatch | null {
  const target = normalizePath(path).split("?")[0];
  const active = rules.filter((r) => r.enabled !== false);

  const exact = active
    .filter((r) => !r.from_path.includes("*"))
    .find((r) => normalizePath(r.from_path) === target);
  if (exact) return { to: exact.to_path, code: exact.code, rule: exact };

  const wildcards = active
    .filter((r) => r.from_path.includes("*"))
    .sort((a, b) => b.from_path.length - a.from_path.length);

  for (const r of wildcards) {
    const prefix = normalizePath(r.from_path.replace(/\*+$/, "")).replace(/\/$/, "");
    if (target === prefix || target.startsWith(`${prefix}/`)) {
      const rest = target.slice(prefix.length);
      const to = r.to_path.includes("*")
        ? r.to_path.replace(/\*+$/, "").replace(/\/$/, "") + rest
        : r.to_path;
      return { to: normalizePath(to), code: r.code, rule: r };
    }
  }

  return null;
}

/** Follow chained redirects (A→B→C) up to `maxHops`, guarding against loops. */
export function resolveRedirect(
  path: string,
  rules: RedirectRule[],
  maxHops = 5,
): RedirectMatch | null {
  let current = normalizePath(path);
  let last: RedirectMatch | null = null;
  const seen = new Set([current]);

  for (let i = 0; i < maxHops; i += 1) {
    const hit = matchRedirect(current, rules);
    if (!hit || hit.code === 410) return hit ?? last;
    if (seen.has(hit.to)) break;
    seen.add(hit.to);
    last = { ...hit, to: hit.to };
    current = hit.to;
  }
  return last;
}

export interface RedirectIssue {
  rule: RedirectRule;
  level: "error" | "warning";
  message: string;
}

/** Validate a rule set: loops, chains, duplicates, self-redirects, bad codes. */
export function validateRedirects(rules: RedirectRule[]): RedirectIssue[] {
  const issues: RedirectIssue[] = [];
  const froms = new Map<string, number>();

  for (const rule of rules) {
    const from = normalizePath(rule.from_path);
    const to = normalizePath(rule.to_path);

    if (!VALID_CODES.includes(rule.code)) {
      issues.push({ rule, level: "error", message: `Unsupported status code ${rule.code}.` });
    }
    if (from === to) {
      issues.push({ rule, level: "error", message: "Redirects to itself." });
    }
    froms.set(from, (froms.get(from) ?? 0) + 1);
    if ((froms.get(from) ?? 0) > 1) {
      issues.push({ rule, level: "error", message: `Duplicate rule for ${from}.` });
    }
    if (
      rule.code !== 410 &&
      matchRedirect(
        to,
        rules.filter((r) => r !== rule),
      )
    ) {
      issues.push({ rule, level: "warning", message: `Chained redirect — ${to} redirects again.` });
    }
  }

  return issues;
}

/** Parse `from,to,code` CSV (header optional) into rules. */
export function parseRedirectCsv(csv: string): { rules: RedirectRule[]; errors: string[] } {
  const rules: RedirectRule[] = [];
  const errors: string[] = [];

  csv.split(/\r?\n/).forEach((raw, i) => {
    const line = raw.trim();
    if (!line || line.startsWith("#")) return;
    const cells = line.split(/[,\t]/).map((c) => c.trim().replace(/^"|"$/g, ""));
    if (/^from/i.test(cells[0])) return;
    const [from, to, code] = cells;
    if (!from || !to) {
      errors.push(`Line ${i + 1}: needs at least "from,to".`);
      return;
    }
    const parsed = Number(code ?? 301) || 301;
    if (!VALID_CODES.includes(parsed)) {
      errors.push(`Line ${i + 1}: unsupported code ${code}.`);
      return;
    }
    rules.push({
      from_path: normalizePath(from),
      to_path: parsed === 410 ? normalizePath(to || from) : normalizePath(to),
      code: parsed,
      enabled: true,
    });
  });

  return { rules, errors };
}

export function toRedirectCsv(rules: RedirectRule[]): string {
  return ["from,to,code", ...rules.map((r) => `${r.from_path},${r.to_path},${r.code}`)].join("\n");
}

/**
 * Suggest redirects for URLs that 404: find the closest known path by
 * token overlap so a mistyped or renamed URL still lands somewhere useful.
 */
export function suggestForMissing(missing: string, knownPaths: string[]): string | null {
  const tokens = normalizePath(missing).split(/[/\-]/).filter(Boolean);
  if (!tokens.length) return null;

  let best: { path: string; score: number } | null = null;
  for (const path of knownPaths) {
    const other = normalizePath(path).split(/[/\-]/).filter(Boolean);
    const set = new Set(other);
    const score = tokens.reduce((n, t) => n + (set.has(t) ? 1 : 0), 0) / tokens.length;
    if (!best || score > best.score) best = { path, score };
  }
  return best && best.score >= 0.5 ? best.path : null;
}
