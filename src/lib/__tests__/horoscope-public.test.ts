import { describe, it, expect } from "vitest";
import {
  SIGNS,
  findSign,
  isPeriod,
  periodPath,
  periodLabel,
  horoscopeFaqs,
  buildHoroscope,
  HOROSCOPE_PERIODS,
} from "../horoscope-public";

describe("horoscope-public", () => {
  it("exposes all 12 rashis with unique slugs", () => {
    expect(SIGNS).toHaveLength(12);
    expect(new Set(SIGNS.map((s) => s.slug)).size).toBe(12);
  });

  it("resolves signs by english slug, rashi key and sanskrit name", () => {
    expect(findSign("aries")?.key).toBe("mesha");
    expect(findSign("mesha")?.english).toBe("Aries");
    expect(findSign("Vrishabha")?.slug).toBe("taurus");
    expect(findSign("nonsense")).toBeUndefined();
  });

  it("validates periods and builds canonical paths", () => {
    expect(HOROSCOPE_PERIODS).toEqual(["daily", "weekly", "monthly", "yearly"]);
    expect(isPeriod("daily")).toBe(true);
    expect(isPeriod("hourly")).toBe(false);
    expect(periodPath("weekly")).toBe("/weekly-horoscope");
    expect(periodPath("weekly", "leo")).toBe("/weekly-horoscope/leo");
    expect(periodLabel("monthly")).toBe("Monthly");
  });

  it("returns FAQ entries for schema and UI", () => {
    const faqs = horoscopeFaqs("daily", findSign("aries"));
    expect(faqs.length).toBeGreaterThanOrEqual(4);
    expect(faqs[0].question).toContain("Aries");
  });

  it("builds a daily horoscope view model from the engine", () => {
    const view = buildHoroscope("daily", findSign("aries")!, { date: "2026-08-01" });
    expect(view.period).toBe("daily");
    expect(view.sign.key).toBe("mesha");
    expect(view.rangeLabel).toBe("2026-08-01");
    expect(view.categories.length).toBeGreaterThan(0);
    for (const c of view.categories) {
      expect(c.score).toBeGreaterThanOrEqual(0);
      expect(c.score).toBeLessThanOrEqual(100);
    }
    expect(view.overallScore).toBeGreaterThanOrEqual(0);
    expect(view.panchang.length).toBe(3);
  });
});
