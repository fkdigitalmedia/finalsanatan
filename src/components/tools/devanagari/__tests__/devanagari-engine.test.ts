import { describe, expect, it } from "vitest";
import {
  analyzeDevanagariText,
  devanagariToHarvardKyoto,
  devanagariToIast,
  phoneticToDevanagari,
  PRESET_SHLOKAS,
  VARNAMALA_LAYOUT,
} from "../devanagari-engine";

describe("devanagari-engine", () => {
  it("converts phonetic English phrases to authentic Devanagari", () => {
    expect(phoneticToDevanagari("namaste")).toBe("नमस्ते");
    expect(phoneticToDevanagari("om")).toBe("ॐ");
    expect(phoneticToDevanagari("shri ganeshaya namah")).toBe("श्री गणेशाय नमः");
    expect(phoneticToDevanagari("dharmakshetre")).toContain("धर्म");
  });

  it("converts Devanagari to IAST and Harvard-Kyoto", () => {
    const dev = "ॐ नमः शिवाय";
    const iast = devanagariToIast(dev);
    expect(iast.toLowerCase()).toContain("nama");

    const hk = devanagariToHarvardKyoto("श्री गणेशाय नमः");
    expect(hk).toBeDefined();
  });

  it("analyzes Devanagari text metrics accurately", () => {
    const text = "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं";
    const metrics = analyzeDevanagariText(text);

    expect(metrics.words).toBe(4);
    expect(metrics.charactersWithSpaces).toBe(text.length);
    expect(metrics.matraCount).toBeGreaterThan(0);
    expect(metrics.vyanjanCount).toBeGreaterThan(0);
  });

  it("contains complete keyboard layout categories", () => {
    expect(VARNAMALA_LAYOUT.swar.length).toBeGreaterThan(10);
    expect(VARNAMALA_LAYOUT.matras.length).toBeGreaterThan(10);
    expect(VARNAMALA_LAYOUT.vyanjanRows.length).toBe(7);
    expect(VARNAMALA_LAYOUT.vedicAccents).toContain("ॐ");
    expect(VARNAMALA_LAYOUT.vedicAccents).toContain("॑");
  });

  it("contains preset classic shlokas and mantras", () => {
    expect(PRESET_SHLOKAS.length).toBeGreaterThanOrEqual(5);
    const gayatri = PRESET_SHLOKAS.find((s) => s.id === "gayatri");
    expect(gayatri?.title).toContain("गायत्री");
    expect(gayatri?.devanagari).toContain("भूर्भुवः");
  });
});
