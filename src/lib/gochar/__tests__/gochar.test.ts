// ============================================================
// Gochar Engine — tests (Phase 13.2)
// Run: `bunx vitest run src/lib/gochar`
// ============================================================
import { describe, it, expect } from "vitest";
import { createGocharEngine, generateGochar, validateGocharInput } from "..";
import type { BirthInput } from "@/lib/kundli/types";
import type { GocharInput } from "../types";

const BIRTH: BirthInput = {
  date: "1990-06-15",
  time: "10:30",
  place: "Mumbai, India",
  latitude: 19.076,
  longitude: 72.8777,
  timezone: "Asia/Kolkata",
};
const INPUT: GocharInput = { birth: BIRTH, currentDate: "2026-07-29" };

type Err = { field: string; message: string };

describe("gochar/validators", () => {
  it("accepts a valid input", () => {
    expect(validateGocharInput(INPUT).ok).toBe(true);
  });
  it("rejects a missing birth", () => {
    const r = validateGocharInput({} as unknown as GocharInput);
    expect(r.ok).toBe(false);
    expect(r.errors.some((e: Err) => e.field === "birth")).toBe(true);
  });
  it("rejects an out-of-range latitude", () => {
    const r = validateGocharInput({ ...INPUT, birth: { ...BIRTH, latitude: 999 } });
    expect(r.ok).toBe(false);
  });
  it("rejects an unknown planet", () => {
    const r = validateGocharInput({
      ...INPUT,
      planets: ["Sun", "Pluto"] as unknown as GocharInput["planets"],
    });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e: Err) => e.field === "planets")).toBe(true);
  });
});

describe("gochar/engine", () => {
  const out = generateGochar(INPUT);

  it("emits the expected top-level keys", () => {
    for (const k of ["profile", "influences", "summary", "metadata"] as const) {
      expect(out).toHaveProperty(k);
    }
  });

  it("covers all 9 supported planets", () => {
    expect(out.influences.length).toBe(9);
    const names = new Set(out.influences.map((i) => i.planet));
    for (const p of [
      "Sun",
      "Moon",
      "Mars",
      "Mercury",
      "Jupiter",
      "Venus",
      "Saturn",
      "Rahu",
      "Ketu",
    ]) {
      expect(names.has(p as never)).toBe(true);
    }
  });

  it("each influence exposes natal + current + houses + score", () => {
    for (const i of out.influences) {
      expect(i.natal.rashiIndex).toBeGreaterThanOrEqual(0);
      expect(i.natal.rashiIndex).toBeLessThan(12);
      expect(i.current.rashiIndex).toBeGreaterThanOrEqual(0);
      expect(i.current.rashiIndex).toBeLessThan(12);
      expect(i.transitHouseFromLagna).toBeGreaterThanOrEqual(1);
      expect(i.transitHouseFromLagna).toBeLessThanOrEqual(12);
      expect(i.transitHouseFromNatalMoon).toBeGreaterThanOrEqual(1);
      expect(i.transitHouseFromNatalMoon).toBeLessThanOrEqual(12);
      expect(i.influenceScore).toBeGreaterThanOrEqual(0);
      expect(i.influenceScore).toBeLessThanOrEqual(100);
      expect(i.confidence).toBeGreaterThan(0);
      expect(i.confidence).toBeLessThanOrEqual(1);
      expect(["positive", "neutral", "sensitive"]).toContain(i.verdict);
    }
  });

  it("sensitive periods are well-ordered ISO ranges", () => {
    for (const i of out.influences) {
      for (const p of i.sensitivePeriods) {
        expect(Date.parse(p.endISO)).toBeGreaterThanOrEqual(Date.parse(p.startISO));
        expect(["sign-change", "retrograde", "combustion", "gochara-adverse"]).toContain(p.reason);
      }
    }
  });

  it("summary rolls up planets into positive / neutral / sensitive buckets", () => {
    const bucketed =
      out.summary.positivePlanets.length +
      out.summary.neutralPlanets.length +
      out.summary.sensitivePlanets.length;
    expect(bucketed).toBe(out.influences.length);
    expect(out.summary.overallScore).toBeGreaterThanOrEqual(0);
    expect(out.summary.overallScore).toBeLessThanOrEqual(100);
    expect(["positive", "neutral", "sensitive"]).toContain(out.summary.verdict);
  });

  it("dasha overlay marks at least one active lord (default includeDasha=true)", () => {
    const active = out.influences.filter(
      (i) => i.dashaActive.mahadasha || i.dashaActive.antardasha || i.dashaActive.pratyantar,
    );
    // The current Vimshottari Mahadasha lord must appear among transit planets
    // (all 9 are in scope), so at least one entry should be flagged.
    expect(active.length).toBeGreaterThan(0);
  });

  it("stamps engine version + planet count", () => {
    expect(out.metadata.engineVersion).toMatch(/gochar/);
    expect(out.metadata.planetCount).toBe(9);
  });

  it("cache returns the identical payload on repeat calls", () => {
    const engine = createGocharEngine();
    engine.initialize();
    const a = engine.generate(INPUT);
    const b = engine.generate(INPUT);
    expect(b.metadata.calculationTimestamp).toBe(a.metadata.calculationTimestamp);
  });

  it("respects the includeDasha=false flag", () => {
    const bare = generateGochar({ ...INPUT, includeDasha: false });
    const anyActive = bare.influences.some(
      (i) => i.dashaActive.mahadasha || i.dashaActive.antardasha || i.dashaActive.pratyantar,
    );
    expect(anyActive).toBe(false);
  });
});
