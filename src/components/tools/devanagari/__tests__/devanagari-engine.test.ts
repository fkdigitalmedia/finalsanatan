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

  it("renders DevanagariTypingStudio component without crashing", async () => {
    const React = await import("react");
    const { renderToString } = await import("react-dom/server");
    const { DevanagariTypingStudio } = await import("../DevanagariTypingStudio");
    const html = renderToString(React.createElement(DevanagariTypingStudio));
    expect(html).toContain("देवनागरी एवं संस्कृत टाइपिंग स्टूडियो");
  });
});
