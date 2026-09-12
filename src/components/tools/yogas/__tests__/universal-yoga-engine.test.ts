import React from "react";
import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import {
  evaluateYogaBySlug,
  scanAllYogasFromBirth,
  YOGA_DEFINITIONS,
} from "../universal-yoga-engine";
import { YogaCalculatorWidget } from "../YogaCalculatorWidget";
import { MasterYogaScannerView } from "../MasterYogaScannerView";

describe("universal-yoga-engine", () => {
  it("contains definitions for all 14 Vedic yogas", () => {
    expect(Object.keys(YOGA_DEFINITIONS).length).toBe(14);
    expect(YOGA_DEFINITIONS["gaja-kesari-yoga"]).toBeDefined();
    expect(YOGA_DEFINITIONS["budhaditya-yoga"]).toBeDefined();
    expect(YOGA_DEFINITIONS["hamsa-yoga"]).toBeDefined();
    expect(YOGA_DEFINITIONS["ruchaka-yoga"]).toBeDefined();
    expect(YOGA_DEFINITIONS["shasha-yoga"]).toBeDefined();
    expect(YOGA_DEFINITIONS["bhadra-yoga"]).toBeDefined();
    expect(YOGA_DEFINITIONS["dhana-yoga"]).toBeDefined();
    expect(YOGA_DEFINITIONS["raja-yoga"]).toBeDefined();
  });

  it("evaluates Gaja Kesari Yoga correctly", () => {
    const res = evaluateYogaBySlug("gaja-kesari-yoga", {
      lagnaRashiIndex: 0,
      planets: [
        { graha: "Moon", house: 1, rashiIndex: 0, dignity: "own" },
        { graha: "Jupiter", house: 4, rashiIndex: 3, dignity: "exalted" },
      ],
    });
    expect(res.isPresent).toBe(true);
    expect(res.strengthPercentage).toBeGreaterThanOrEqual(80);
    expect(res.factors.length).toBeGreaterThan(0);
  });

  it("evaluates Budhaditya Yoga correctly", () => {
    const res = evaluateYogaBySlug("budhaditya-yoga", {
      lagnaRashiIndex: 0,
      planets: [
        { graha: "Sun", house: 10, rashiIndex: 0, dignity: "exalted" },
        { graha: "Mercury", house: 10, rashiIndex: 0, dignity: "friend", isCombust: false },
      ],
    });
    expect(res.isPresent).toBe(true);
    expect(res.strengthPercentage).toBeGreaterThanOrEqual(85);
  });

  it("scans all 14 yogas from birth data without crashing", () => {
    const scan = scanAllYogasFromBirth({
      date: "1995-04-14",
      time: "10:30",
      latitude: 28.6139,
      longitude: 77.209,
      timezone: "Asia/Kolkata",
      place: "New Delhi",
    });
    expect(scan.results.length).toBe(14);
    expect(scan.kundli).toBeDefined();
  });

  it("renders YogaCalculatorWidget component without crashing", () => {
    const html = renderToString(React.createElement(YogaCalculatorWidget, { slug: "gaja-kesari-yoga" }));
    expect(html).toContain("गजकेसरी योग");
    expect(html).toContain("गणक व विश्लेषक");
  });

  it("renders MasterYogaScannerView component without crashing", () => {
    const html = renderToString(React.createElement(MasterYogaScannerView));
    expect(html).toContain("Kundli Yoga Scanner");
    expect(html).toContain("सम्पूर्ण वैदिक योग विश्लेषक");
  });
});
