// ============================================================
// Personalized Horoscope Engine — tests (Phase 12.6)
// Run: `bunx vitest run src/lib/horoscope/personalized`
// ============================================================
import { describe, it, expect } from "vitest";
import {
  createPersonalizedHoroscopeEngine,
  generatePersonalizedHoroscope,
  validatePersonalizedInput,
  PERSONALIZED_ENGINE_VERSION,
  PERSONALIZED_SCORE_CATEGORIES,
  buildComparison,
  buildPlanetInfluence,
  loadNatalChart,
  snapshotBirthChart,
} from "..";
import { TransitEngine } from "@/lib/transit";
import type { BirthInput } from "@/lib/kundli/types";
import type { PersonalizedInput } from "../types";

const BIRTH: BirthInput = {
  date: "1990-06-15",
  time: "10:30",
  place: "Mumbai, India",
  latitude: 19.076,
  longitude: 72.8777,
  timezone: "Asia/Kolkata",
  gender: "male",
};

const INPUT: PersonalizedInput = {
  birth: BIRTH,
  currentDate: "2026-07-29",
  period: "daily",
  language: "en",
};

type Err = { field: string; message: string };

describe("personalized/validators", () => {
  it("accepts a well-formed input", () => {
    expect(validatePersonalizedInput(INPUT).ok).toBe(true);
  });
  it("rejects a missing birth", () => {
    /* forced invalid */
    const r = validatePersonalizedInput({} as unknown as PersonalizedInput);
    expect(r.ok).toBe(false);
    expect(r.errors.some((e: Err) => e.field === "birth")).toBe(true);
  });
  it("rejects an out-of-range latitude", () => {
    const r = validatePersonalizedInput({
      ...INPUT,
      birth: { ...BIRTH, latitude: 1000 },
    });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e: Err) => e.field === "birth.latitude")).toBe(true);
  });
  it("rejects an unknown period", () => {
    const r = validatePersonalizedInput({
      ...INPUT,
      /* invalid enum on purpose */
      period: "hourly" as never,
    });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e: Err) => e.field === "period")).toBe(true);
  });
  it("rejects a bad currentDate format", () => {
    const r = validatePersonalizedInput({ ...INPUT, currentDate: "2026/07/29" });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e: Err) => e.field === "currentDate")).toBe(true);
  });
});

describe("personalized/birth chart loader", () => {
  const natal = loadNatalChart(BIRTH);
  const snap = snapshotBirthChart(natal);

  it("loads a natal chart with 9 grahas", () => {
    expect(natal.d1.planets.length).toBe(9);
  });
  it("resolves the moon rashi key", () => {
    expect(snap.moonRashiKey).toMatch(/^[a-z]+$/);
  });
  it("caches natal chart calls", () => {
    const engine = createPersonalizedHoroscopeEngine();
    engine.initialize();
    const a = engine.generate(INPUT);
    const b = engine.generate(INPUT);
    expect(b.metadata.calculationTimestamp).toBe(a.metadata.calculationTimestamp);
  });
});

describe("personalized/comparison", () => {
  const natal = loadNatalChart(BIRTH);
  const transitEngine = new TransitEngine();
  transitEngine.initialize();
  const snap = transitEngine.generateTransitSnapshot({
    date: "2026-07-29T12:00:00Z",
    location: {
      place: BIRTH.place,
      latitude: BIRTH.latitude,
      longitude: BIRTH.longitude,
      timezone: BIRTH.timezone,
    },
  });
  const transit = {
    referenceInstant: snap.date,
    ayanamsaDegrees: snap.ayanamsaDegrees,
    planets: snap.planets,
  };

  const comparison = buildComparison(natal.d1, transit);
  const influence = buildPlanetInfluence(comparison);

  it("produces one comparison record per graha", () => {
    expect(comparison.length).toBe(9);
    for (const c of comparison) {
      expect(c.transitHouseFromLagna).toBeGreaterThanOrEqual(1);
      expect(c.transitHouseFromLagna).toBeLessThanOrEqual(12);
      expect(c.degreesTravelledSinceBirth).toBeGreaterThanOrEqual(0);
      expect(c.degreesTravelledSinceBirth).toBeLessThan(360);
    }
  });

  it("produces influence with score in [0,100]", () => {
    for (const p of Object.values(influence)) {
      expect(p.influenceScore).toBeGreaterThanOrEqual(0);
      expect(p.influenceScore).toBeLessThanOrEqual(100);
      expect(p.confidence).toBeGreaterThanOrEqual(0);
      expect(p.confidence).toBeLessThanOrEqual(1);
      expect(Array.isArray(p.affectedAreas)).toBe(true);
    }
  });
});

describe("personalized/engine — daily payload", () => {
  const out = generatePersonalizedHoroscope(INPUT);

  it("emits the expected top-level keys", () => {
    for (const key of [
      "profile",
      "birthChart",
      "transits",
      "comparison",
      "planetInfluence",
      "scores",
      "timeline",
      "luckyFactors",
      "metadata",
    ] as const) {
      expect(out).toHaveProperty(key);
    }
  });

  it("emits all 20 personalized categories", () => {
    for (const cat of PERSONALIZED_SCORE_CATEGORIES) {
      expect(out.scores).toHaveProperty(cat);
      const s = out.scores[cat];
      expect(s.score).toBeGreaterThanOrEqual(0);
      expect(s.score).toBeLessThanOrEqual(100);
      expect(s.confidence).toBeGreaterThanOrEqual(0);
      expect(s.confidence).toBeLessThanOrEqual(1);
    }
  });

  it("stamps the personalized engine version", () => {
    expect(out.metadata.engineVersion).toBe(PERSONALIZED_ENGINE_VERSION);
    expect(out.metadata.period).toBe("daily");
  });

  it("does not populate weekly/monthly/yearly for period=daily", () => {
    expect(out.timeline.thisWeek).toBeNull();
    expect(out.timeline.thisMonth).toBeNull();
    expect(out.timeline.thisYear).toBeNull();
  });

  it("returns 9-planet comparison and influence maps", () => {
    expect(out.comparison.length).toBe(9);
    expect(Object.keys(out.planetInfluence).length).toBe(9);
  });
});

describe("personalized/engine — weekly payload", () => {
  const engine = createPersonalizedHoroscopeEngine();
  engine.initialize();
  const out = engine.generate({ ...INPUT, period: "weekly" });

  it("includes weekly rollup and top highlights", () => {
    expect(out.timeline.thisWeek).not.toBeNull();
    expect(out.timeline.thisWeek?.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(Array.isArray(out.timeline.todayHighlights)).toBe(true);
    expect(out.timeline.todayHighlights.length).toBeGreaterThan(0);
  });
});
