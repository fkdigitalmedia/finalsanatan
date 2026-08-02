// ============================================================
// Daily Horoscope Engine — Phase 12.3 tests
// Run with: `bunx vitest run src/lib/horoscope/daily`
// ============================================================
import { describe, it, expect } from "vitest";
import { RASHI_KEYS } from "../../index";
import {
  createDailyHoroscopeEngine,
  DailyHoroscopeEngine,
  DAILY_ENGINE_VERSION,
  DAILY_SCORE_CATEGORIES,
  validateDailyInput,
  luckyNumberForRashi,
  luckyColorForRashi,
  computeDailyScores,
} from "../index";

const FIXED_DATE = "2026-07-29";

describe("daily/validators", () => {
  it("accepts a minimal request", () => {
    const r = validateDailyInput({ rashi: "mesha" });
    expect(r.ok).toBe(true);
  });
  it("rejects missing rashi", () => {
    const r = validateDailyInput({} as never);
    expect(r.ok).toBe(false);
    expect(r.errors.some((e: { field: string }) => e.field === "rashi")).toBe(true);
  });
  it("rejects bad date/lat/lon", () => {
    const r = validateDailyInput({
      rashi: "mesha",
      date: "29/07/2026",
      latitude: 91,
      longitude: -999,
    });
    expect(r.ok).toBe(false);
    expect(r.errors.map((e: { field: string }) => e.field).sort()).toEqual([
      "date",
      "latitude",
      "longitude",
    ]);
  });
});

describe("daily/rules", () => {
  it("returns a lucky number in 1..9 per rashi", () => {
    for (const k of RASHI_KEYS) {
      const n = luckyNumberForRashi(k);
      expect(n).toBeGreaterThanOrEqual(1);
      expect(n).toBeLessThanOrEqual(9);
    }
  });
  it("returns a non-empty lucky color per rashi", () => {
    for (const k of RASHI_KEYS) expect(luckyColorForRashi(k)).toBeTruthy();
  });
});

describe("daily/engine", () => {
  it("constructs and exposes version metadata", () => {
    const eng = createDailyHoroscopeEngine();
    expect(eng).toBeInstanceOf(DailyHoroscopeEngine);
    const out = eng.generate({ rashi: "mesha", date: FIXED_DATE });
    expect(out.metadata.engineVersion).toBe(DAILY_ENGINE_VERSION);
  });

  it("generates a full payload for every rashi with valid schema", () => {
    const eng = createDailyHoroscopeEngine();
    for (const k of RASHI_KEYS) {
      const out = eng.generate({ rashi: k, date: FIXED_DATE });
      expect(out.rashi).toBe(k);
      expect(out.date).toBe(FIXED_DATE);
      expect(out.planetaryInfluence.detailed.length).toBeGreaterThan(0);
      expect(out.transits.planetCount).toBeGreaterThan(0);
      expect(out.panchang.tithi.name).toBeTruthy();
      expect(out.panchang.nakshatra.name).toBeTruthy();
      expect(out.luckyFactors.number).toBeGreaterThanOrEqual(1);
      expect(out.luckyFactors.favorableActivities.length).toBeGreaterThan(0);
      // Score categories complete + within 0..100.
      for (const cat of DAILY_SCORE_CATEGORIES) {
        const s = out.scores[cat];
        expect(s.score).toBeGreaterThanOrEqual(0);
        expect(s.score).toBeLessThanOrEqual(100);
        expect(s.confidence).toBeGreaterThanOrEqual(0);
        expect(s.confidence).toBeLessThanOrEqual(1);
        expect(s.source).toBeTruthy();
        expect(s.updatedAt).toBeTruthy();
      }
    }
  });

  it("caches identical requests (second call is faster / equal payload)", () => {
    const eng = createDailyHoroscopeEngine();
    const a = eng.generate({ rashi: "simha", date: FIXED_DATE });
    const b = eng.generate({ rashi: "simha", date: FIXED_DATE });
    // Same object identity confirms the cache short-circuit.
    expect(a).toBe(b);
  });

  it("throws on invalid input", () => {
    const eng = createDailyHoroscopeEngine();
    expect(() => eng.generate({ rashi: "not-a-rashi" as never })).toThrow(
      /Invalid daily horoscope input/,
    );
  });

  it("computeDailyScores stays within 0..100 with empty planet list", () => {
    const scores = computeDailyScores([], "mesha", new Date().toISOString());
    for (const cat of DAILY_SCORE_CATEGORIES) {
      expect(scores[cat].score).toBeGreaterThanOrEqual(0);
      expect(scores[cat].score).toBeLessThanOrEqual(100);
      expect(scores[cat].confidence).toBe(0);
    }
  });
});
