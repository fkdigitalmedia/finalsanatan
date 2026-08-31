import React from "react";
import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import {
  joinSandhiWords,
  SANDHI_PRESETS,
  SANDHI_RULES,
  splitCompoundWord,
} from "../sandhi-engine";
import { SandhiSplitterView } from "../SandhiSplitterView";

describe("sandhi-engine", () => {
  it("splits classic compound words accurately", () => {
    const res1 = splitCompoundWord("धर्मक्षेत्रे");
    expect(res1.candidates.length).toBeGreaterThan(0);
    expect(res1.candidates[0].word1).toBe("धर्म");
    expect(res1.candidates[0].word2).toBe("क्षेत्रे");

    const res2 = splitCompoundWord("सज्जनः");
    expect(res2.candidates[0].word1).toBe("सत्");
    expect(res2.candidates[0].word2).toBe("जनः");
  });

  it("splits Purvarupa words containing Avagraha (ऽ)", () => {
    const res = splitCompoundWord("शिवोऽहम्");
    expect(res.candidates.some((c) => c.word2.includes("अहम्"))).toBe(true);
  });

  it("joins two Sanskrit words with appropriate Sandhi rules", () => {
    const join1 = joinSandhiWords("सत्", "जनः");
    expect(join1.joinedWord).toBe("सज्जनः");
    expect(join1.sandhiType).toContain("श्चुत्व");

    const join2 = joinSandhiWords("देव", "इन्द्रः");
    expect(join2.joinedWord).toBe("देवेन्द्रः");
  });

  it("contains complete Paninian rules and presets", () => {
    expect(Object.keys(SANDHI_RULES).length).toBeGreaterThanOrEqual(10);
    expect(SANDHI_PRESETS.length).toBeGreaterThanOrEqual(20);
  });

  it("renders SandhiSplitterView component without crashing", () => {
    const html = renderToString(React.createElement(SandhiSplitterView));
    expect(html).toContain("पाणिनीय संस्कृत सन्धि स्टूडियो");
    expect(html).toContain("समस्त पद");
  });
});
