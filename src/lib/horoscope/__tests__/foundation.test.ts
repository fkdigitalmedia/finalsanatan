// ============================================================
// Horoscope Engine — Foundation tests
// ------------------------------------------------------------
// Run with: `bunx vitest run src/lib/horoscope`
// Verifies validation, module loading, and placeholder generation.
// ============================================================
import { describe, it, expect } from "vitest";
import {
  createHoroscopeEngine,
  HoroscopeEngine,
  HOROSCOPE_ENGINE_VERSION,
  RASHIS,
  RASHI_KEYS,
  HOROSCOPE_TYPES,
  validateHoroscopeInput,
  getRashi,
  rashiIndexFromLongitude,
  rashiKeyFromLongitude,
} from "../index";

describe("horoscope/constants", () => {
  it("ships 12 Rashis with complete metadata", () => {
    expect(RASHIS).toHaveLength(12);
    for (const r of RASHIS) {
      expect(r.key).toBeTruthy();
      expect(r.sanskrit).toBeTruthy();
      expect(r.english).toBeTruthy();
      expect(r.hindi).toBeTruthy();
      expect(r.symbol).toBeTruthy();
      expect(r.element).toMatch(/Fire|Earth|Air|Water/);
      expect(r.rulingPlanet).toBeTruthy();
    }
  });

  it("lists all supported horoscope types", () => {
    expect(HOROSCOPE_TYPES).toEqual(["daily", "weekly", "monthly", "yearly", "personalized"]);
  });

  it("looks up a Rashi by key", () => {
    expect(getRashi("mesha")?.english).toBe("Aries");
    expect(getRashi("MEENA")?.english).toBe("Pisces");
    expect(getRashi("nope")).toBeUndefined();
  });
});

describe("horoscope/helpers", () => {
  it("maps sidereal longitudes to Rashi indices", () => {
    expect(rashiIndexFromLongitude(0)).toBe(0);
    expect(rashiIndexFromLongitude(29.9)).toBe(0);
    expect(rashiIndexFromLongitude(30)).toBe(1);
    expect(rashiIndexFromLongitude(359.9)).toBe(11);
    expect(rashiKeyFromLongitude(45)).toBe("vrishabha");
  });
});

describe("horoscope/validators", () => {
  it("accepts a valid daily-by-rashi request", () => {
    const r = validateHoroscopeInput({ type: "daily", rashi: "mesha" });
    expect(r.ok).toBe(true);
    expect(r.errors).toHaveLength(0);
  });

  it("rejects unknown type", () => {
    // @ts-expect-error – deliberately invalid
    const r = validateHoroscopeInput({ type: "hourly", rashi: "mesha" });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.field === "type")).toBe(true);
  });

  it("requires rashi for non-personalized requests", () => {
    const r = validateHoroscopeInput({ type: "weekly" });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.field === "rashi")).toBe(true);
  });

  it("requires birth data for personalized requests", () => {
    const r = validateHoroscopeInput({ type: "personalized" });
    expect(r.ok).toBe(false);
    for (const f of ["date", "time", "latitude", "longitude", "timezone"]) {
      expect(r.errors.some((e) => e.field === f)).toBe(true);
    }
  });

  it("rejects out-of-range lat/lon", () => {
    const r = validateHoroscopeInput({
      type: "daily",
      rashi: "mesha",
      latitude: 200,
      longitude: -999,
    });
    expect(r.ok).toBe(false);
  });

  it("accepts every RashiKey", () => {
    for (const k of RASHI_KEYS) {
      const r = validateHoroscopeInput({ type: "daily", rashi: k });
      expect(r.ok).toBe(true);
    }
  });
});

describe("horoscope/engine", () => {
  it("constructs and initializes without runtime error", () => {
    const eng = createHoroscopeEngine();
    expect(eng).toBeInstanceOf(HoroscopeEngine);
    eng.initialize();
    expect(eng.config.defaultLanguage).toBeTruthy();
  });

  it("generates a placeholder envelope with metadata + transit", () => {
    const eng = createHoroscopeEngine();
    const out = eng.generate({ type: "daily", rashi: "mesha" });
    expect(out.placeholder).toBe(true);
    expect(out.metadata.engineVersion).toBe(HOROSCOPE_ENGINE_VERSION);
    expect(out.metadata.source).toBe("engine");
    expect(out.transit?.planets.length).toBeGreaterThan(0);
    expect(out.content).toBeUndefined();
  });

  it("throws on invalid input", () => {
    const eng = createHoroscopeEngine();
    // @ts-expect-error – deliberately invalid
    expect(() => eng.generate({ type: "nope" })).toThrow(/Invalid horoscope input/);
  });
});
