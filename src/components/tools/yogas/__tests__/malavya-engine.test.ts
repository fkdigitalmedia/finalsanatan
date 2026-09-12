import React from "react";
import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import {
  evaluateMalavyaYoga,
  calculateMalavyaYogaFromBirth,
  RASHIS,
} from "../malavya-engine";
import { MalavyaYogaCalculator } from "../MalavyaYogaCalculator";

describe("malavya-engine", () => {
  it("detects Malavya Yoga when Venus is exalted in 1st house (Pisces Lagna)", () => {
    const res = evaluateMalavyaYoga({
      lagnaRashi: "Pisces",
      venusRashi: "Pisces",
      venusHouse: 1,
    });
    expect(res.isPresent).toBe(true);
    expect(res.status).toBe("full");
    expect(res.strengthPercentage).toBeGreaterThanOrEqual(90);
    expect(res.dignity).toContain("Exalted");
    expect(res.housePrediction.titleHindi).toContain("प्रथम भाव");
  });

  it("detects Malavya Yoga when Venus is in own sign in 7th house (Aries Lagna, Venus in Libra)", () => {
    const res = evaluateMalavyaYoga({
      lagnaRashi: "Aries",
      venusRashi: "Libra",
      venusHouse: 7,
    });
    expect(res.isPresent).toBe(true);
    expect(res.status).toBe("full");
    expect(res.strengthPercentage).toBeGreaterThanOrEqual(80);
    expect(res.dignity).toContain("Own Sign");
  });

  it("penalizes strength when Venus is combust with Sun", () => {
    const normal = evaluateMalavyaYoga({
      lagnaRashi: "Taurus",
      venusRashi: "Taurus",
      venusHouse: 1,
      isVenusCombust: false,
    });
    const combust = evaluateMalavyaYoga({
      lagnaRashi: "Taurus",
      venusRashi: "Taurus",
      venusHouse: 1,
      isVenusCombust: true,
    });
    expect(combust.status).toBe("partial");
    expect(combust.strengthPercentage).toBeLessThan(normal.strengthPercentage);
  });

  it("returns absent when Venus is not in Kendra", () => {
    const res = evaluateMalavyaYoga({
      lagnaRashi: "Aries",
      venusRashi: "Taurus",
      venusHouse: 2, // 2nd house is not Kendra
    });
    expect(res.isPresent).toBe(false);
    expect(res.status).toBe("absent");
  });

  it("calculates from birth data without crashing", () => {
    const birthRes = calculateMalavyaYogaFromBirth({
      date: "1990-05-15",
      time: "14:30",
      latitude: 28.6139,
      longitude: 77.209,
      timezone: "Asia/Kolkata",
    });
    expect(birthRes.kundli).toBeDefined();
    expect(birthRes.result).toBeDefined();
    expect(birthRes.result.factors.length).toBe(3);
  });

  it("renders MalavyaYogaCalculator component without crashing", () => {
    const html = renderToString(React.createElement(MalavyaYogaCalculator));
    expect(html).toContain("मालव्य योग गणक");
    expect(html).toContain("पञ्च महापुरुष योग");
    expect(html).toContain("त्वरित परीक्षण");
  });
});
