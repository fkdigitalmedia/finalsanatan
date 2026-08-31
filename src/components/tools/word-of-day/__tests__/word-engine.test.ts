import React from "react";
import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import {
  getRandomWord,
  getWordForDate,
  SANSKRIT_WORDS_DATABASE,
} from "../word-engine";
import { SanskritWordOfDayView } from "../SanskritWordOfDayView";

describe("word-engine", () => {
  it("contains extensive sacred Sanskrit lexicon database", () => {
    expect(SANSKRIT_WORDS_DATABASE.length).toBeGreaterThanOrEqual(10);
    const satya = SANSKRIT_WORDS_DATABASE.find((w) => w.id === "satyam");
    expect(satya).toBeDefined();
    expect(satya?.devanagari).toBe("सत्यम्");
    expect(satya?.shloka.source).toContain("मुण्डकोपनिषद्");
  });

  it("retrieves deterministic word for specific date", () => {
    const d1 = new Date("2026-08-31");
    const w1 = getWordForDate(d1);
    expect(w1).toBeDefined();
    expect(w1.devanagari).toBeDefined();
  });

  it("retrieves random sacred words", () => {
    const w = getRandomWord();
    expect(w).toBeDefined();
    expect(w.meaningHindi).toBeDefined();
  });

  it("renders SanskritWordOfDayView component without crashing", () => {
    const html = renderToString(React.createElement(SanskritWordOfDayView));
    expect(html).toContain("दैनिक संस्कृत पद");
    expect(html).toContain("शास्त्र प्रमाण");
  });
});
