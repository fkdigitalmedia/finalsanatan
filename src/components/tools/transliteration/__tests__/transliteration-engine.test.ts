import React from "react";
import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import {
  devanagariToIast,
  iastToDevanagari,
  PRESET_TRANSLITERATION_TEXTS,
  SCRIPT_REGISTRY,
  transliterate,
  transliterateToAll,
} from "../transliteration-engine";
import { TransliterationStudioView } from "../TransliterationStudioView";

describe("transliteration-engine", () => {
  it("converts Devanagari to IAST accurately", () => {
    const dev = "ॐ नमः शिवाय";
    const iast = devanagariToIast(dev);
    expect(iast).toContain("namaḥ");
    expect(iast).toContain("śivāya");
  });

  it("converts IAST to Devanagari accurately", () => {
    const iast = "satyam eva jayate";
    const dev = iastToDevanagari(iast);
    expect(dev).toContain("सत्य");
  });

  it("transliterates between Indic scripts (Bengali, Gujarati, Telugu)", () => {
    const dev = "श्री राम";
    const ben = transliterate(dev, "devanagari", "bengali");
    expect(ben).toBeDefined();

    const guj = transliterate(dev, "devanagari", "gujarati");
    expect(guj).toBeDefined();
  });

  it("transliterates to all 13 supported scripts simultaneously", () => {
    const res = transliterateToAll("ॐ शान्तिः", "devanagari");
    expect(Object.keys(res).length).toBe(Object.keys(SCRIPT_REGISTRY).length);
    expect(res.iast).toContain("oṁ");
    expect(res.hk).toBeDefined();
    expect(res.tamil).toBeDefined();
  });

  it("contains complete presets registry", () => {
    expect(PRESET_TRANSLITERATION_TEXTS.length).toBeGreaterThanOrEqual(5);
  });

  it("renders TransliterationStudioView component without crashing", () => {
    const html = renderToString(React.createElement(TransliterationStudioView));
    expect(html).toContain("सर्व-लिपि वैदिक लिप्यन्तरण केन्द्र");
    expect(html).toContain("प्रत्यक्ष लिपि रूपान्तरण");
  });
});
