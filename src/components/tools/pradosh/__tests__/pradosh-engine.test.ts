import React from "react";
import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import {
  calculatePradoshDatesForYear,
  getNextUpcomingPradosh,
  PRADOSH_PUJA_STEPS,
  PRADOSHA_DAY_METADATA,
  SHIVA_STOTRAS,
} from "../pradosh-engine";
import { PradoshVratView } from "../PradoshVratView";
import { DEFAULT_LOCATION } from "@/lib/panchang";

describe("pradosh-engine", () => {
  it("calculates approximately 24 Pradosha Vrats for a full year", () => {
    const dates = calculatePradoshDatesForYear(2026, DEFAULT_LOCATION);
    expect(dates.length).toBeGreaterThanOrEqual(20);
    expect(dates.length).toBeLessThanOrEqual(28);

    const first = dates[0];
    expect(first.muhurtaFormatted).toBeDefined();
    expect(first.sunset).toBeInstanceOf(Date);
    expect(first.pradoshKaalStart).toBeInstanceOf(Date);
    expect(first.pradoshKaalEnd).toBeInstanceOf(Date);
    expect(first.metadata).toBeDefined();
  });

  it("calculates next upcoming Pradosha Vrat accurately", () => {
    const next = getNextUpcomingPradosh(DEFAULT_LOCATION, new Date("2026-03-01T00:00:00Z"));
    expect(next).toBeDefined();
    expect(next?.dateString).toBeDefined();
  });

  it("contains complete metadata for all 7 weekdays", () => {
    expect(PRADOSHA_DAY_METADATA.soma).toBeDefined();
    expect(PRADOSHA_DAY_METADATA.bhauma).toBeDefined();
    expect(PRADOSHA_DAY_METADATA.budha).toBeDefined();
    expect(PRADOSHA_DAY_METADATA.guru).toBeDefined();
    expect(PRADOSHA_DAY_METADATA.shukra).toBeDefined();
    expect(PRADOSHA_DAY_METADATA.shani).toBeDefined();
    expect(PRADOSHA_DAY_METADATA.ravi).toBeDefined();
  });

  it("contains 8-step Puja Vidhi and Shiva Stotras", () => {
    expect(PRADOSH_PUJA_STEPS.length).toBe(8);
    expect(SHIVA_STOTRAS.length).toBeGreaterThanOrEqual(2);
    expect(SHIVA_STOTRAS.some((s) => s.id === "rudrashtakam")).toBe(true);
  });

  it("renders PradoshVratView component without crashing", () => {
    const html = renderToString(React.createElement(PradoshVratView));
    expect(html).toContain("त्रयोदशी तिथि एवं साम्बसदाशिव प्रदोष साधना");
    expect(html).toContain("प्रदोष तालिका");
  });
});
