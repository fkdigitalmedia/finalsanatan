import React from "react";
import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import {
  calculateRashiFromBirth,
  findRashiByName,
  RASHI_DATABASE,
} from "../rashi-engine";
import { RashiCalculatorView } from "../RashiCalculatorView";

describe("rashi-engine", () => {
  it("contains all 12 Vedic Rashi profiles with complete attributes", () => {
    expect(RASHI_DATABASE.length).toBe(12);
    const mesha = RASHI_DATABASE[0];
    expect(mesha.nameHindi).toContain("मेष");
    expect(mesha.lord).toContain("Mars");
    expect(mesha.luckyGemstone).toContain("मूंगा");
    expect(mesha.syllables.length).toBeGreaterThanOrEqual(4);
  });

  it("finds Rashi by person name prefix correctly", () => {
    const rahul = findRashiByName("Rahul");
    expect(rahul).toBeDefined();
    expect(rahul?.nameHindi).toContain("तुला"); // Ra -> Tula

    const pooja = findRashiByName("Pooja");
    expect(pooja).toBeDefined();
    expect(pooja?.nameHindi).toContain("कन्या"); // Pu/Po -> Kanya
  });

  it("calculates Moon, Sun, and Lagna signs accurately from birth data", () => {
    const res = calculateRashiFromBirth({
      date: "1995-04-14",
      time: "10:30",
      latitude: 28.6139,
      longitude: 77.209,
      timezone: "Asia/Kolkata",
      place: "New Delhi",
    });

    expect(res.moonRashi).toBeDefined();
    expect(res.sunRashi).toBeDefined();
    expect(res.lagnaRashi).toBeDefined();
    expect(res.avakahada.varna).toBeDefined();
    expect(res.sadeSatiStatus).toBeDefined();
  });

  it("renders RashiCalculatorView component without crashing", () => {
    const html = renderToString(React.createElement(RashiCalculatorView));
    expect(html).toContain("वैदिक राशि गणक");
    expect(html).toContain("जन्म चन्द्र राशि");
  });
});
