// ============================================================
// Weekly + Monthly + Trend Engine tests (Phase 12.4)
// Run with: `bunx vitest run src/lib/horoscope`
// ============================================================
import { describe, it, expect } from "vitest";
import { classifyTrend, classifyTrendMap } from "../trend";
import { createWeeklyHoroscopeEngine, validateWeeklyInput, WEEKLY_ENGINE_VERSION } from "../weekly";
import {
  chunkWeeks,
  createMonthlyHoroscopeEngine,
  MONTHLY_ENGINE_VERSION,
  validateMonthlyInput,
} from "../monthly";
import { DAILY_SCORE_CATEGORIES } from "../daily";

const WEEK_START = "2026-07-27"; // Monday
const YEAR = 2026;
const MONTH = 2; // 28 days — keeps monthly test fast

describe("trend/classifyTrend", () => {
  it("returns stable direction for a flat series", () => {
    const t = classifyTrend([60, 60, 60, 60, 60]);
    expect(t.direction).toBe("stable");
    expect(t.average).toBe(60);
    expect(t.samples).toBe(5);
  });
  it("returns improving direction for a rising series", () => {
    const t = classifyTrend([30, 40, 50, 60, 70]);
    expect(t.direction).toBe("improving");
    expect(t.slope).toBeGreaterThan(0);
  });
  it("returns declining direction for a falling series", () => {
    const t = classifyTrend([90, 80, 70, 60, 50]);
    expect(t.direction).toBe("declining");
    expect(t.slope).toBeLessThan(0);
  });
  it("returns mixed direction for a noisy flat series", () => {
    const t = classifyTrend([50, 80, 40, 80, 40, 80, 50]);
    expect(t.direction).toBe("mixed");
  });
  it("classifyTrendMap works for empty maps", () => {
    const t = classifyTrendMap<"a" | "b">({ a: [], b: [50] });
    expect(t.a.samples).toBe(0);
    expect(t.b.samples).toBe(1);
  });
});

describe("weekly/validators", () => {
  it("accepts a valid input", () => {
    const r = validateWeeklyInput({ startDate: WEEK_START, rashi: "mesha" });
    expect(r.ok).toBe(true);
  });
  it("rejects an out-of-range window", () => {
    const r = validateWeeklyInput({ startDate: WEEK_START, endDate: "2026-08-20", rashi: "mesha" });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e: { field: string }) => e.field === "endDate")).toBe(true);
  });
});

describe("weekly/engine", () => {
  const eng = createWeeklyHoroscopeEngine();
  const out = eng.generate({ startDate: WEEK_START, rashi: "mesha" });

  it("produces a well-formed weekly payload", () => {
    expect(out.startDate).toBe(WEEK_START);
    expect(out.metadata.engineVersion).toBe(WEEKLY_ENGINE_VERSION);
    expect(out.metadata.daysComputed).toBe(7);
    expect(out.days).toHaveLength(7);
    expect(out.dailyScores).toHaveLength(7);
    for (const cat of DAILY_SCORE_CATEGORIES) {
      expect(out.trends[cat]).toBeDefined();
      expect(out.trends[cat].samples).toBe(7);
      expect(out.scores[cat].average).toBeGreaterThanOrEqual(0);
      expect(out.scores[cat].average).toBeLessThanOrEqual(100);
    }
  });
  it("caches identical requests", () => {
    const a = eng.generate({ startDate: WEEK_START, rashi: "mesha" });
    const b = eng.generate({ startDate: WEEK_START, rashi: "mesha" });
    expect(a).toBe(b);
  });
  it("throws on invalid input", () => {
    expect(() => eng.generate({ startDate: "bad", rashi: "mesha" })).toThrow(/Invalid weekly/);
  });
});

describe("monthly/helpers", () => {
  it("chunks a month into 4-5 weekly windows", () => {
    const chunks = chunkWeeks("2026-02-01", "2026-02-28");
    expect(chunks[0].start).toBe("2026-02-01");
    expect(chunks[chunks.length - 1].end).toBe("2026-02-28");
    expect(chunks.length).toBeGreaterThanOrEqual(4);
    expect(chunks.length).toBeLessThanOrEqual(5);
  });
});

describe("monthly/validators", () => {
  it("accepts a valid input", () => {
    const r = validateMonthlyInput({ year: YEAR, month: MONTH, rashi: "simha" });
    expect(r.ok).toBe(true);
  });
  it("rejects an invalid month", () => {
    const r = validateMonthlyInput({ year: YEAR, month: 13, rashi: "simha" });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e: { field: string }) => e.field === "month")).toBe(true);
  });
});

describe("monthly/engine", () => {
  const eng = createMonthlyHoroscopeEngine();
  const out = eng.generate({ year: YEAR, month: MONTH, rashi: "simha" });

  it("produces a well-formed monthly payload", () => {
    expect(out.year).toBe(YEAR);
    expect(out.month).toBe(MONTH);
    expect(out.metadata.engineVersion).toBe(MONTHLY_ENGINE_VERSION);
    expect(out.metadata.daysComputed).toBe(28); // Feb 2026 = 28 days
    expect(out.weeks.length).toBeGreaterThanOrEqual(4);
    expect(out.dailyScores).toHaveLength(28);
    for (const cat of DAILY_SCORE_CATEGORIES) {
      expect(out.trends[cat].samples).toBe(28);
      expect(out.scores[cat].average).toBeGreaterThanOrEqual(0);
      expect(out.scores[cat].average).toBeLessThanOrEqual(100);
    }
    expect(out.bestWeek).not.toBeNull();
    expect(out.mostSensitiveWeek).not.toBeNull();
    if (out.bestWeek && out.mostSensitiveWeek) {
      expect(out.bestWeek.averageScore).toBeGreaterThanOrEqual(out.mostSensitiveWeek.averageScore);
    }
  }, 60_000);

  it("caches identical requests", () => {
    const a = eng.generate({ year: YEAR, month: MONTH, rashi: "simha" });
    const b = eng.generate({ year: YEAR, month: MONTH, rashi: "simha" });
    expect(a).toBe(b);
  });

  it("throws on invalid input", () => {
    expect(() => eng.generate({ year: YEAR, month: 0, rashi: "simha" })).toThrow(/Invalid monthly/);
  });
});
