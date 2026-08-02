// ============================================================
// Sade Sati & Dhaiya Engine — tests (Phase 13.3)
// Run: `bunx vitest run src/lib/sadesati`
// ============================================================
import { describe, it, expect } from "vitest";
import {
  buildSaturnOccupancies,
  createSadeSatiEngine,
  generateSadeSati,
  saturnSignIndex,
  validateSadeSatiInput,
} from "..";
import type { BirthInput } from "@/lib/kundli/types";
import type { SadeSatiInput } from "../types";

const BIRTH: BirthInput = {
  date: "1990-06-15",
  time: "10:30",
  place: "Mumbai, India",
  latitude: 19.076,
  longitude: 72.8777,
  timezone: "Asia/Kolkata",
};
const INPUT: SadeSatiInput = { birth: BIRTH, currentDate: "2026-07-29", windowYears: 40 };

type Err = { field: string; message: string };

describe("sadesati/validators", () => {
  it("accepts a valid input", () => {
    expect(validateSadeSatiInput(INPUT).ok).toBe(true);
  });
  it("rejects a missing birth object", () => {
    const r = validateSadeSatiInput({} as unknown as SadeSatiInput);
    expect(r.ok).toBe(false);
    expect(r.errors.some((e: Err) => e.field === "birth")).toBe(true);
  });
  it("rejects a malformed currentDate", () => {
    const r = validateSadeSatiInput({ ...INPUT, currentDate: "29-07-2026" });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e: Err) => e.field === "currentDate")).toBe(true);
  });
  it("rejects an out-of-range windowYears", () => {
    expect(validateSadeSatiInput({ ...INPUT, windowYears: 500 }).ok).toBe(false);
  });
  it("throws on generate() with invalid input", () => {
    expect(() => generateSadeSati({ ...INPUT, birth: { ...BIRTH, latitude: 999 } })).toThrow();
  });
});

describe("sadesati/saturn scanner", () => {
  const from = new Date(Date.UTC(2015, 0, 1));
  const to = new Date(Date.UTC(2035, 0, 1));
  const occ = buildSaturnOccupancies(from, to);

  it("produces a continuous, ordered timeline", () => {
    expect(occ.length).toBeGreaterThan(5);
    for (let i = 1; i < occ.length; i++) {
      expect(occ[i].startISO).toBe(occ[i - 1].endISO);
      expect(Date.parse(occ[i].endISO)).toBeGreaterThan(Date.parse(occ[i].startISO));
    }
  });

  it("advances one sign at a time", () => {
    for (let i = 1; i < occ.length; i++) {
      expect(occ[i].rashiIndex).toBe((occ[i - 1].rashiIndex + 1) % 12);
    }
  });

  it("keeps stays close to Saturn's ~2.5 year pace", () => {
    const inner = occ.slice(1, -1);
    for (const o of inner) {
      expect(o.durationDays).toBeGreaterThan(600);
      expect(o.durationDays).toBeLessThan(1300);
    }
  });

  it("matches the ephemeris at interval midpoints", () => {
    for (const o of occ.slice(1, -1)) {
      const mid = new Date((Date.parse(o.startISO) + Date.parse(o.endISO)) / 2);
      expect(saturnSignIndex(mid)).toBe(o.rashiIndex);
    }
  });
});

describe("sadesati/engine", () => {
  const out = generateSadeSati(INPUT);

  it("emits the expected top-level keys", () => {
    for (const k of [
      "profile",
      "sadeSati",
      "phases",
      "cycles",
      "dhaiya",
      "dhaiyaPeriods",
      "saturnTransit",
      "metadata",
    ] as const) {
      expect(out).toHaveProperty(k);
    }
  });

  it("resolves a natal Moon rashi", () => {
    expect(out.profile.moonRashiIndex).toBeGreaterThanOrEqual(0);
    expect(out.profile.moonRashiIndex).toBeLessThan(12);
    expect(typeof out.profile.moonRashi).toBe("string");
  });

  it("builds cycles with three ordered phases", () => {
    expect(out.cycles.length).toBeGreaterThan(0);
    for (const c of out.cycles) {
      expect(c.phases.map((p) => p.key)).toEqual(["first", "second", "third"]);
      expect(c.phases.map((p) => p.houseFromMoon)).toEqual([12, 1, 2]);
      expect(c.phases[0].startISO).toBe(c.startISO);
      expect(c.phases[2].endISO).toBe(c.endISO);
      expect(c.phases[1].startISO).toBe(c.phases[0].endISO);
      expect(c.phases[2].startISO).toBe(c.phases[1].endISO);
    }
  });

  it("gives each cycle a classical ~7.5 year span", () => {
    for (const c of out.cycles) {
      expect(c.durationDays).toBeGreaterThan(2200);
      expect(c.durationDays).toBeLessThan(3200);
    }
  });

  it("places each phase in the correct sign from the Moon", () => {
    const m = out.profile.moonRashiIndex;
    for (const c of out.cycles) {
      expect(c.phases[0].rashiIndex).toBe((m + 11) % 12);
      expect(c.phases[1].rashiIndex).toBe(m);
      expect(c.phases[2].rashiIndex).toBe((m + 1) % 12);
    }
  });

  it("keeps the sade sati status consistent with the current cycle", () => {
    if (out.sadeSati.active) {
      expect(out.currentCycle).not.toBeNull();
      expect(out.sadeSati.startISO).toBe(out.currentCycle!.startISO);
      expect(out.sadeSati.remainingDays).toBeGreaterThan(0);
      expect(out.sadeSati.progress).toBeGreaterThanOrEqual(0);
      expect(out.sadeSati.progress).toBeLessThanOrEqual(1);
      expect(out.sadeSati.currentPhase).not.toBeNull();
      expect(out.sadeSati.remaining?.humanized).toBeTruthy();
    } else {
      expect(out.currentCycle).toBeNull();
      expect(out.sadeSati.currentPhase).toBeNull();
    }
  });

  it("orders previous < current/next cycles chronologically", () => {
    if (out.previousCycle && out.nextCycle) {
      expect(Date.parse(out.previousCycle.endISO)).toBeLessThan(Date.parse(out.nextCycle.startISO));
    }
  });

  it("computes dhaiya periods in the 4th and 8th from the Moon", () => {
    const m = out.profile.moonRashiIndex;
    expect(out.dhaiyaPeriods.length).toBeGreaterThan(0);
    for (const p of out.dhaiyaPeriods) {
      const expected = p.kind === "kantaka" ? (m + 3) % 12 : (m + 7) % 12;
      expect(p.rashiIndex).toBe(expected);
      expect(p.houseFromMoon).toBe(p.kind === "kantaka" ? 4 : 8);
    }
  });

  it("keeps dhaiya status consistent", () => {
    if (out.dhaiya.active) {
      expect(out.dhaiya.current).not.toBeNull();
      expect(out.dhaiya.remainingDays).toBeGreaterThan(0);
    } else {
      expect(out.dhaiya.current).toBeNull();
    }
  });

  it("never reports sade sati and dhaiya simultaneously", () => {
    expect(out.sadeSati.active && out.dhaiya.active).toBe(false);
  });

  it("summarises the current Saturn transit", () => {
    const s = out.saturnTransit;
    expect(s.siderealLongitude).toBeGreaterThanOrEqual(0);
    expect(s.siderealLongitude).toBeLessThan(360);
    expect(s.rashiIndex).toBe(Math.floor(s.siderealLongitude / 30));
    expect(s.houseFromMoon).toBeGreaterThanOrEqual(1);
    expect(s.houseFromMoon).toBeLessThanOrEqual(12);
    expect(s.nextSignRashiIndex).toBe((s.rashiIndex + 1) % 12);
    expect(typeof s.retrograde).toBe("boolean");
    expect(s.daysUntilNextSign).not.toBeNull();
  });

  it("agrees with the sade sati flag from the transit house", () => {
    const h = out.saturnTransit.houseFromMoon;
    expect(out.sadeSati.active).toBe(h === 12 || h === 1 || h === 2);
    expect(out.dhaiya.active).toBe(h === 4 || h === 8);
  });

  it("serialises to JSON without cycles or NaN", () => {
    const json = JSON.stringify(out);
    expect(json.length).toBeGreaterThan(100);
    expect(json).not.toContain("NaN");
    expect(JSON.parse(json).metadata.engineVersion).toBe(out.metadata.engineVersion);
  });

  it("caches repeated calls on the same engine instance", () => {
    const engine = createSadeSatiEngine();
    const a = engine.generate(INPUT);
    const b = engine.generate(INPUT);
    expect(b).toBe(a);
    expect(b.metadata.cacheHits).toBeGreaterThanOrEqual(0);
  });

  it("handles a different birth chart and date", () => {
    const other = generateSadeSati({
      birth: {
        date: "1975-11-02",
        time: "04:15",
        place: "Varanasi, India",
        latitude: 25.3176,
        longitude: 82.9739,
        timezone: "Asia/Kolkata",
      },
      currentDate: "2030-01-15",
    });
    expect(other.cycles.length).toBeGreaterThan(0);
    expect(other.metadata.calculationDurationMs).toBeGreaterThanOrEqual(0);
  });
});
