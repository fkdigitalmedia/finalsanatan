// ============================================================
// Transit Engine — tests
// ------------------------------------------------------------
// Run with: `bunx vitest run src/lib/transit`
// ============================================================
import { describe, it, expect } from "vitest";
import {
  createTransitEngine,
  generateTransitSnapshot,
  TransitEngine,
  TRANSIT_ENGINE_VERSION,
  TRANSIT_PLANETS,
  TRANSIT_PLANET_NAMES,
  RASHIS_EN,
  NAKSHATRAS_EN,
  validateTransitInput,
  TransitCache,
  cacheKey,
  calculatePlanetTransit,
  detectRetrograde,
  detectSpeed,
  calculateNextIngress,
} from "../index";

const REFERENCE_DATE = new Date("2026-07-29T00:00:00Z");

describe("transit/constants", () => {
  it("ships 9 supported planets with Sanskrit names", () => {
    expect(TRANSIT_PLANETS).toHaveLength(9);
    expect(new Set(TRANSIT_PLANET_NAMES)).toEqual(
      new Set(["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]),
    );
    for (const p of TRANSIT_PLANETS) expect(p.sanskrit.length).toBeGreaterThan(0);
  });

  it("ships 12 Rashis and 27 Nakshatras", () => {
    expect(RASHIS_EN).toHaveLength(12);
    expect(NAKSHATRAS_EN).toHaveLength(27);
  });
});

describe("transit/validators", () => {
  it("accepts an empty input", () => {
    expect(validateTransitInput().ok).toBe(true);
  });
  it("rejects invalid date", () => {
    const r = validateTransitInput({ date: "not-a-date" });
    expect(r.ok).toBe(false);
    expect(r.errors[0].field).toBe("date");
  });
  it("rejects invalid coordinates", () => {
    const r = validateTransitInput({ location: { latitude: 99, longitude: -999 } });
    expect(r.ok).toBe(false);
  });
  it("rejects unknown planet", () => {
    // @ts-expect-error – deliberately invalid
    const r = validateTransitInput({ planets: ["Sun", "Pluto"] });
    expect(r.ok).toBe(false);
  });
});

describe("transit/cache", () => {
  it("memoizes and clears", () => {
    const c = new TransitCache<number>({ ttlMs: 1000 });
    let calls = 0;
    const v1 = c.memoize("k", () => (calls++, 42));
    const v2 = c.memoize("k", () => (calls++, 99));
    expect(v1).toBe(42);
    expect(v2).toBe(42);
    expect(calls).toBe(1);
    c.clear();
    expect(c.size).toBe(0);
  });
  it("produces a stable cacheKey", () => {
    expect(cacheKey({ b: 2, a: 1 })).toBe(cacheKey({ a: 1, b: 2 }));
  });
});

describe("transit/calculator", () => {
  it("produces a valid transit for every planet", () => {
    for (const p of TRANSIT_PLANET_NAMES) {
      const t = calculatePlanetTransit(p, REFERENCE_DATE);
      expect(t.longitude).toBeGreaterThanOrEqual(0);
      expect(t.longitude).toBeLessThan(360);
      expect(t.rashiIndex).toBeGreaterThanOrEqual(0);
      expect(t.rashiIndex).toBeLessThan(12);
      expect(t.nakshatraIndex).toBeGreaterThanOrEqual(0);
      expect(t.nakshatraIndex).toBeLessThan(27);
      expect([1, 2, 3, 4]).toContain(t.pada);
      expect(RASHIS_EN).toContain(t.rashi as (typeof RASHIS_EN)[number]);
      expect(NAKSHATRAS_EN).toContain(t.nakshatra as (typeof NAKSHATRAS_EN)[number]);
    }
  });

  it("detects retrograde correctly for Sun / Moon / Rahu / Ketu", () => {
    expect(detectRetrograde("Sun", REFERENCE_DATE)).toBe(false);
    expect(detectRetrograde("Moon", REFERENCE_DATE)).toBe(false);
    expect(detectRetrograde("Rahu", REFERENCE_DATE)).toBe(true);
    expect(detectRetrograde("Ketu", REFERENCE_DATE)).toBe(true);
  });

  it("gives a sensible daily speed for the Moon (~13°/day)", () => {
    const v = detectSpeed("Moon", REFERENCE_DATE);
    expect(Math.abs(v)).toBeGreaterThan(10);
    expect(Math.abs(v)).toBeLessThan(16);
  });

  it("finds the Moon's next sign change within 3 days", () => {
    const next = calculateNextIngress("Moon", REFERENCE_DATE, 5);
    expect(next).toBeInstanceOf(Date);
    const hours = (next!.getTime() - REFERENCE_DATE.getTime()) / 3_600_000;
    expect(hours).toBeGreaterThan(0);
    expect(hours).toBeLessThan(72);
  });
});

describe("transit/engine", () => {
  it("constructs, initializes, and versions its output", () => {
    const eng = createTransitEngine();
    expect(eng).toBeInstanceOf(TransitEngine);
    const snap = eng.generateTransitSnapshot({ date: "2026-07-29" });
    expect(snap.engineVersion).toBe(TRANSIT_ENGINE_VERSION);
    expect(snap.planets).toHaveLength(9);
    expect(snap.summary).toHaveLength(9);
    expect(typeof snap.ayanamsaDegrees).toBe("number");
  });

  it("respects a planet subset", () => {
    const snap = generateTransitSnapshot({ planets: ["Sun", "Moon"] });
    expect(snap.planets.map((p) => p.name)).toEqual(["Sun", "Moon"]);
  });

  it("throws on invalid input", () => {
    const eng = createTransitEngine();
    expect(() => eng.generateTransitSnapshot({ date: "garbage" })).toThrow(/Invalid transit input/);
  });

  it("returns pure JSON-serialisable data", () => {
    const snap = generateTransitSnapshot();
    expect(() => JSON.parse(JSON.stringify(snap))).not.toThrow();
  });
});
