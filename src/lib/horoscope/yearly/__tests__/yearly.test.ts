// ============================================================
// Yearly Horoscope Engine — tests (Phase 12.5)
// Run: `bunx vitest run src/lib/horoscope/yearly`
// ------------------------------------------------------------
// These are integration-style tests: they run the real Monthly
// engine 12x, which itself runs Weekly + Daily + Transit +
// Panchang. Kept to a single year to hold total runtime down.
// ============================================================
import { describe, it, expect } from "vitest";
import {
  createYearlyHoroscopeEngine,
  generateYearlyHoroscope,
  quarterBounds,
  validateYearlyInput,
  YEARLY_ENGINE_VERSION,
  YEARLY_SCORE_CATEGORIES,
  YEARLY_CATEGORY_SOURCE,
} from "..";

type Err = { field: string; message: string };

const YEAR = 2026;

describe("yearly/validators", () => {
  it("accepts a valid input", () => {
    const r = validateYearlyInput({ year: YEAR, rashi: "mesha" });
    expect(r.ok).toBe(true);
  });
  it("rejects an out-of-range year", () => {
    const r = validateYearlyInput({ year: 1800, rashi: "mesha" });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e: Err) => e.field === "year")).toBe(true);
  });
  it("rejects an unknown rashi", () => {
    /* invalid enum on purpose */
    const r = validateYearlyInput({ year: YEAR, rashi: "unknown" as never });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e: Err) => e.field === "rashi")).toBe(true);
  });
  it("rejects an out-of-range latitude", () => {
    const r = validateYearlyInput({ year: YEAR, rashi: "mesha", latitude: 200 });
    expect(r.ok).toBe(false);
  });
});

describe("yearly/helpers.quarterBounds", () => {
  it("Q1 spans Jan-Mar", () => {
    const b = quarterBounds(YEAR, 1);
    expect(b.start).toBe(`${YEAR}-01-01`);
    expect(b.end).toBe(`${YEAR}-03-31`);
    expect(b.months).toEqual([1, 2, 3]);
  });
  it("Q4 spans Oct-Dec", () => {
    const b = quarterBounds(YEAR, 4);
    expect(b.start).toBe(`${YEAR}-10-01`);
    expect(b.end).toBe(`${YEAR}-12-31`);
    expect(b.months).toEqual([10, 11, 12]);
  });
});

describe("yearly/engine.generate", () => {
  const engine = createYearlyHoroscopeEngine();
  engine.initialize();
  const out = engine.generate({ year: YEAR, rashi: "mesha" });

  it("returns the target year + rashi", () => {
    expect(out.year).toBe(YEAR);
    expect(out.rashi).toBe("mesha");
  });

  it("computes 12 monthly summaries and 12 raw monthlies", () => {
    expect(out.months).toHaveLength(12);
    expect(out.monthly).toHaveLength(12);
    for (let i = 0; i < 12; i++) {
      expect(out.months[i].month).toBe(i + 1);
      expect(out.monthly[i].month).toBe(i + 1);
    }
  });

  it("computes exactly 4 quarters with contiguous month coverage", () => {
    expect(out.quarters).toHaveLength(4);
    const covered = out.quarters.flatMap(
      (q: { months: number[]; trends: { overall: { samples: number } }; averageScore: number }) =>
        q.months,
    );
    expect(covered).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    for (const q of out.quarters) {
      expect(q.trends.overall.samples).toBeGreaterThan(0);
      expect(q.averageScore).toBeGreaterThanOrEqual(0);
      expect(q.averageScore).toBeLessThanOrEqual(100);
    }
  });

  it("emits a yearly score for every category with valid 0..100 range", () => {
    for (const cat of YEARLY_SCORE_CATEGORIES) {
      const entry = out.scores[cat];
      expect(entry).toBeDefined();
      expect(entry.score).toBeGreaterThanOrEqual(0);
      expect(entry.score).toBeLessThanOrEqual(100);
      expect(entry.min).toBeLessThanOrEqual(entry.max);
      expect(entry.source).toContain("daily.");
    }
  });

  it("echoes the daily category source map for every yearly category", () => {
    for (const cat of YEARLY_SCORE_CATEGORIES) {
      expect(out.categorySources[cat]).toBe(YEARLY_CATEGORY_SOURCE[cat]);
    }
  });

  it("detects at least one planetary event across the year", () => {
    expect(out.planetaryEvents.length).toBeGreaterThan(0);
    const kinds = new Set(out.planetaryEvents.map((e: { type: string }) => e.type));
    expect(
      [...kinds].every((k: string) =>
        [
          "sign-change",
          "retrograde-start",
          "retrograde-end",
          "retrograde-window",
          "major-transit",
        ].includes(k),
      ),
    ).toBe(true);
  });

  it("resolves at least one festival with metadata", () => {
    expect(out.festivals.length).toBeGreaterThan(0);
    const f = out.festivals[0];
    expect(f.isoDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(f.monthIndex).toBeGreaterThanOrEqual(1);
    expect(f.monthIndex).toBeLessThanOrEqual(12);
    expect([1, 2, 3, 4]).toContain(f.quarter);
  });

  it("produces a non-empty lucky factors block", () => {
    expect(out.luckyFactors.luckyMonths.length).toBe(3);
    expect(out.luckyFactors.luckyDates.length).toBeGreaterThan(0);
    expect(out.luckyFactors.luckyNumbers.length).toBeGreaterThan(0);
    expect(out.luckyFactors.luckyDirection).toBeTruthy();
  });

  it("aggregates panchang counts across the whole year", () => {
    const p = out.panchangSummary;
    expect(p.ekadashiCount).toBe(p.ekadashiDates.length);
    expect(p.purnimaCount).toBe(p.purnimaDates.length);
    expect(p.amavasyaCount).toBe(p.amavasyaDates.length);
    // A calendar year has ~24 Ekadashi + ~12 Purnima + ~12 Amavasya.
    expect(p.ekadashiCount).toBeGreaterThan(15);
    expect(p.purnimaCount).toBeGreaterThan(8);
  });

  it("returns valid metadata with the correct engine version", () => {
    expect(out.metadata.engineVersion).toBe(YEARLY_ENGINE_VERSION);
    expect(out.metadata.monthsComputed).toBe(12);
    expect(out.metadata.daysComputed).toBeGreaterThan(360);
    expect(out.metadata.calculationDurationMs).toBeGreaterThanOrEqual(0);
    expect(out.metadata.festivalCount).toBe(out.festivals.length);
    expect(out.metadata.eventCount).toBe(out.planetaryEvents.length);
  });

  it("returns cached identical output on repeat generate()", () => {
    const again = engine.generate({ year: YEAR, rashi: "mesha" });
    expect(again).toBe(out); // identity — cache hit
  });

  it("has a JSON-serializable payload (no cycles, no functions)", () => {
    const json = JSON.stringify(out);
    expect(typeof json).toBe("string");
    expect(json.length).toBeGreaterThan(1000);
    const parsed = JSON.parse(json);
    expect(parsed.year).toBe(YEAR);
    expect(parsed.rashi).toBe("mesha");
  });
});

describe("yearly convenience export", () => {
  it("generateYearlyHoroscope() works end-to-end", () => {
    const out = generateYearlyHoroscope({ year: YEAR, rashi: "tula" });
    expect(out.rashi).toBe("tula");
    expect(out.quarters).toHaveLength(4);
    expect(out.months).toHaveLength(12);
  }, 30000);
});
