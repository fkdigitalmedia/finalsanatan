// ============================================================
// Dasha Engine — tests (Phase 13.1)
// Run: `bunx vitest run src/lib/dasha`
// ============================================================
import { describe, it, expect } from "vitest";
import {
  createDashaEngine,
  generateDasha,
  validateDashaInput,
  DASHA_ENGINE_VERSION,
  DASHA_YEARS,
  IMPLEMENTED_SYSTEMS,
} from "..";
import type { BirthInput } from "@/lib/kundli/types";
import type { DashaInput } from "../types";

const BIRTH: BirthInput = {
  date: "1990-06-15",
  time: "10:30",
  place: "Mumbai, India",
  latitude: 19.076,
  longitude: 72.8777,
  timezone: "Asia/Kolkata",
};

const INPUT: DashaInput = { birth: BIRTH, currentDate: "2026-07-29" };

type Err = { field: string; message: string };

describe("dasha/validators", () => {
  it("accepts a well-formed input", () => {
    expect(validateDashaInput(INPUT).ok).toBe(true);
  });
  it("rejects a missing birth block", () => {
    /* forced invalid */
    const r = validateDashaInput({} as unknown as DashaInput);
    expect(r.ok).toBe(false);
    expect(r.errors.some((e: Err) => e.field === "birth")).toBe(true);
  });
  it("rejects an out-of-range latitude", () => {
    const r = validateDashaInput({ ...INPUT, birth: { ...BIRTH, latitude: 999 } });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e: Err) => e.field === "birth.latitude")).toBe(true);
  });
  it("rejects an unimplemented system", () => {
    const r = validateDashaInput({ ...INPUT, system: "yogini" });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e: Err) => e.field === "system")).toBe(true);
  });
  it("rejects a bad currentDate format", () => {
    const r = validateDashaInput({ ...INPUT, currentDate: "2026/07/29" });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e: Err) => e.field === "currentDate")).toBe(true);
  });
});

describe("dasha/engine — vimshottari", () => {
  const out = generateDasha(INPUT);

  it("emits the expected top-level keys", () => {
    for (const key of [
      "profile",
      "balanceAtBirth",
      "currentMahadasha",
      "currentAntardasha",
      "currentPratyantar",
      "previousMahadasha",
      "nextMahadasha",
      "timeline",
      "metadata",
    ] as const) {
      expect(out).toHaveProperty(key);
    }
  });

  it("produces a 9-lord timeline summing to ~120 years", () => {
    expect(out.timeline.length).toBe(9);
    // First MD is the truncated balance-at-birth slot; the classical
    // 120-year cycle covers timeline[0].start → timeline[8].end
    // MINUS the elapsed portion of the birth-lord's dasha.
    const spanYears =
      (Date.parse(out.timeline.at(-1)!.endISO) - Date.parse(out.timeline[0].startISO)) /
      (365.2425 * 86400_000);
    expect(spanYears).toBeGreaterThan(100);
    expect(spanYears).toBeLessThanOrEqual(120.01);
  });

  it("classical DASHA_YEARS table is exposed", () => {
    expect(
      DASHA_YEARS.Ketu +
        DASHA_YEARS.Venus +
        DASHA_YEARS.Sun +
        DASHA_YEARS.Moon +
        DASHA_YEARS.Mars +
        DASHA_YEARS.Rahu +
        DASHA_YEARS.Jupiter +
        DASHA_YEARS.Saturn +
        DASHA_YEARS.Mercury,
    ).toBe(120);
  });

  it("current Mahadasha bounds contain the currentDate", () => {
    const md = out.currentMahadasha;
    expect(md).not.toBeNull();
    const now = Date.parse("2026-07-29T12:00:00Z");
    expect(now).toBeGreaterThanOrEqual(Date.parse(md!.startISO));
    expect(now).toBeLessThan(Date.parse(md!.endISO));
    expect(md!.progress).toBeGreaterThanOrEqual(0);
    expect(md!.progress).toBeLessThanOrEqual(1);
  });

  it("current Antardasha lies within current Mahadasha", () => {
    const md = out.currentMahadasha!;
    const ad = out.currentAntardasha!;
    expect(ad).not.toBeNull();
    expect(Date.parse(ad.startISO)).toBeGreaterThanOrEqual(Date.parse(md.startISO));
    expect(Date.parse(ad.endISO)).toBeLessThanOrEqual(Date.parse(md.endISO));
  });

  it("elapsed + remaining ≈ duration for the current Mahadasha", () => {
    const md = out.currentMahadasha!;
    expect(Math.abs(md.elapsedDays + md.remainingDays - md.durationDays)).toBeLessThan(0.5);
  });

  it("balance-at-birth uses a known Vimshottari lord and non-negative years", () => {
    const validLords = [
      "Ketu",
      "Venus",
      "Sun",
      "Moon",
      "Mars",
      "Rahu",
      "Jupiter",
      "Saturn",
      "Mercury",
    ];
    expect(validLords).toContain(out.balanceAtBirth.lord);
    expect(out.balanceAtBirth.yearsRemaining).toBeGreaterThanOrEqual(0);
    expect(out.balanceAtBirth.daysRemaining).toBeGreaterThanOrEqual(0);
  });

  it("timeline is contiguous and monotonically increasing", () => {
    for (let i = 1; i < out.timeline.length; i++) {
      expect(out.timeline[i].startISO).toBe(out.timeline[i - 1].endISO);
    }
  });

  it("previous / next Mahadashas are consistent with the current slot", () => {
    const md = out.currentMahadasha!;
    const idx = out.timeline.findIndex((m) => m.startISO === md.startISO);
    expect(idx).toBeGreaterThan(-1);
    expect(out.previousMahadasha?.lord ?? null).toBe(out.timeline[idx - 1]?.lord ?? null);
    expect(out.nextMahadasha?.lord ?? null).toBe(out.timeline[idx + 1]?.lord ?? null);
  });

  it("stamps engine version + system metadata", () => {
    expect(out.metadata.engineVersion).toBe(DASHA_ENGINE_VERSION);
    expect(out.metadata.system).toBe("vimshottari");
    expect(IMPLEMENTED_SYSTEMS).toContain(out.metadata.system);
  });

  it("cache returns identical output for a repeat call", () => {
    const engine = createDashaEngine();
    engine.initialize();
    const a = engine.generate(INPUT);
    const b = engine.generate(INPUT);
    expect(b.metadata.calculationTimestamp).toBe(a.metadata.calculationTimestamp);
  });
});
