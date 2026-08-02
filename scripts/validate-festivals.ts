// ============================================================
// Festival Rules Engine — Validation Suite
// Run: bun run scripts/validate-festivals.ts
// Compares every rule's `validation.knownDates` against its
// `resolve()` output and prints a pass/fail report.
// ============================================================
import { RULES } from "../src/lib/festivals/registry";
import { DEFAULT_LOCATION } from "../src/lib/panchang";

interface Row {
  slug: string;
  year: number;
  expected: string;
  actual: string;
  diffDays: number | null;
  status: "PASS" | "SOFT" | "FAIL";
  note?: string;
}

const rows: Row[] = [];

for (const rule of RULES) {
  for (const known of rule.validation.knownDates) {
    let actual = "—";
    let diffDays: number | null = null;
    try {
      const resolved = rule.resolve(known.year, DEFAULT_LOCATION);
      // Multi-emit rules (Ekadashi/Purnima/Amavasya): find nearest match.
      let best = resolved[0];
      if (resolved.length > 1) {
        best = resolved.reduce((a, b) => {
          const da = Math.abs(+new Date(a.isoDate) - +new Date(known.date));
          const db = Math.abs(+new Date(b.isoDate) - +new Date(known.date));
          return db < da ? b : a;
        });
      }
      if (!best) throw new Error("no resolution");
      actual = best.isoDate;
      diffDays = Math.round((+new Date(actual) - +new Date(known.date)) / 86_400_000);
    } catch (err) {
      actual = `ERROR: ${(err as Error).message}`;
    }
    const tol = rule.validation.tolerance ?? 0;
    let status: Row["status"] = "FAIL";
    if (diffDays !== null) {
      if (Math.abs(diffDays) === 0) status = "PASS";
      else if (Math.abs(diffDays) <= tol) status = "SOFT";
    }
    rows.push({
      slug: rule.slug,
      year: known.year,
      expected: known.date,
      actual,
      diffDays,
      status,
      note: known.note,
    });
  }
}

const pass = rows.filter((r) => r.status === "PASS").length;
const soft = rows.filter((r) => r.status === "SOFT").length;
const fail = rows.filter((r) => r.status === "FAIL").length;

console.log("\nFestival Rules Engine — Validation Report");
console.log("==========================================");
console.log(`Total: ${rows.length}   PASS: ${pass}   SOFT: ${soft}   FAIL: ${fail}\n`);

const w = (s: string, n: number) => s.padEnd(n);
console.log(w("Slug", 24), w("Year", 6), w("Expected", 12), w("Actual", 12), w("Δd", 5), "Status");
console.log("-".repeat(80));
for (const r of rows) {
  console.log(
    w(r.slug, 24),
    w(String(r.year), 6),
    w(r.expected, 12),
    w(r.actual, 12),
    w(r.diffDays === null ? "—" : String(r.diffDays), 5),
    r.status,
    r.note ? `— ${r.note}` : "",
  );
}

if (fail > 0) {
  console.error(`\n${fail} hard failure(s). Exiting non-zero.`);
  process.exit(1);
}
