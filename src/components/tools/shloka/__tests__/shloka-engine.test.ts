import React from "react";
import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import {
  analyzeShloka,
  CHHANDAS_DATABASE,
  groupIntoGanas,
  scanLineSyllables,
  SHLOKA_PRESETS,
} from "../shloka-engine";
import { ShlokaAnalyzerView } from "../ShlokaAnalyzerView";

describe("shloka-engine", () => {
  it("scans syllables and assigns Laghu-Guru weights correctly", () => {
    const line = "कर्मण्येवाधिकारस्ते";
    const syllables = scanLineSyllables(line);

    expect(syllables.length).toBeGreaterThan(5);
    expect(syllables[0].text).toContain("क");
    expect(syllables.some((s) => s.weight === "G")).toBe(true);
    expect(syllables.some((s) => s.weight === "L")).toBe(true);
  });

  it("groups syllables into Pingala 8-Gana triplets", () => {
    const line = "धर्मक्षेत्रे कुरुक्षेत्रे";
    const syllables = scanLineSyllables(line);
    const ganas = groupIntoGanas(syllables);

    expect(ganas.length).toBeGreaterThan(1);
    expect(ganas[0].gana).toBeDefined();
    expect(ganas[0].pattern).toBeDefined();
  });

  it("identifies Anushtup meter for Bhagavad Gita verses", () => {
    const gita1 = `धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः।
मामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय॥`;
    const result = analyzeShloka(gita1);

    expect(result.detectedMeter).toBeDefined();
    expect(result.detectedMeter?.id).toBe("anushtup");
    expect(result.overallMetrics.totalSyllables).toBeGreaterThanOrEqual(28);
    expect(result.confidence).toBeGreaterThanOrEqual(70);
  });

  it("identifies Shardulavikridita meter for 19-syllable verses", () => {
    const saraswati = `या कुन्देन्दुतुषारहारधवला या शुभ्रवस्त्रावृता
या वीणावरदण्डमण्डितकरा या श्वेतपद्मासना।
या ब्रह्माच्युतशङ्करप्रभृतिभिर्देवैः सदा वन्दिता
सा मां पातु सरस्वती भगवती निःशेषजाड्यापहा॥`;
    const result = analyzeShloka(saraswati);

    expect(result.detectedMeter).toBeDefined();
    expect(result.detectedMeter?.id).toBe("shardulavikridita");
  });

  it("has complete database of classical and Vedic meters", () => {
    expect(CHHANDAS_DATABASE.length).toBeGreaterThanOrEqual(15);
    expect(SHLOKA_PRESETS.length).toBeGreaterThanOrEqual(5);
  });

  it("renders ShlokaAnalyzerView component without crashing", () => {
    const html = renderToString(React.createElement(ShlokaAnalyzerView));
    expect(html).toContain("पिङ्गल छन्दःशास्त्र");
    expect(html).toContain("छन्दः लक्षण श्लोक");
  });
});
