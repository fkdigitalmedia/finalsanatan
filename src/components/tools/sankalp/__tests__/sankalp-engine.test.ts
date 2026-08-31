import { describe, expect, it } from "vitest";
import { DEFAULT_LOCATION } from "@/lib/panchang";
import {
  COMMON_GOTRAS,
  generateVedicSankalp,
  PURPOSE_PRESETS,
  type SankalpInput,
} from "../sankalp-engine";

describe("sankalp-engine", () => {
  const baseInput: SankalpInput = {
    date: new Date("2026-08-31T10:00:00Z"),
    location: DEFAULT_LOCATION,
    name: "राहुल शर्मा",
    gotra: "Bharadwaja",
    familyMode: "self",
    purposePreset: "ganesh-puja",
    sankalpType: "maha",
  };

  it("generates Maha-Sankalpa with complete Desha-Kala-Patra tokens", () => {
    const result = generateVedicSankalp(baseInput);

    expect(result.sanskrit).toContain("ॐ विष्णुर्विष्णुर्विष्णुः");
    expect(result.sanskrit).toContain("जम्बूद्वीपे");
    expect(result.sanskrit).toContain("भारतवर्षे");
    expect(result.sanskrit).toContain("Bharadwaja");
    expect(result.sanskrit).toContain("राहुल शर्मा");
    expect(result.hindiTranslation).toContain("महासंकल्प का सम्पूर्ण भावार्थ");
    expect(result.englishTranslation).toContain("Supreme Divine");
    expect(result.vidhiSteps.length).toBeGreaterThanOrEqual(4);
  });

  it("supports Laghu-Sankalpa format", () => {
    const result = generateVedicSankalp({
      ...baseInput,
      sankalpType: "laghu",
    });

    expect(result.sanskrit).toContain("॥ श्री गणेशाय नमः ॥");
    expect(result.sanskrit).toContain("ॐ तत्सत्");
    expect(result.sanskrit).toContain("यथाशक्ति");
  });

  it("supports Daan/Charity and Vrat Parana Sankalpas", () => {
    const daanRes = generateVedicSankalp({
      ...baseInput,
      sankalpType: "daan",
    });
    expect(daanRes.sanskrit).toContain("संप्रददे न मम");

    const paranaRes = generateVedicSankalp({
      ...baseInput,
      sankalpType: "parana",
    });
    expect(paranaRes.sanskrit).toContain("व्रत पारण संकल्प");
  });

  it("handles with-spouse (sapatneek) and full family modes", () => {
    const spouseRes = generateVedicSankalp({
      ...baseInput,
      familyMode: "spouse",
      spouseName: "प्रिया देवी",
    });
    expect(spouseRes.sanskrit).toContain("सपत्नीकोऽहम्");
    expect(spouseRes.sanskrit).toContain("प्रिया देवी");

    const familyRes = generateVedicSankalp({
      ...baseInput,
      familyMode: "family",
    });
    expect(familyRes.sanskrit).toContain("सभार्यापुत्रपौत्र");
  });

  it("has valid presets and gotra registries", () => {
    expect(COMMON_GOTRAS.length).toBeGreaterThanOrEqual(15);
    expect(PURPOSE_PRESETS.length).toBeGreaterThanOrEqual(10);
  });
});
