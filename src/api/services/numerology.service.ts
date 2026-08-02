// ============================================================
// Service — Numerology & Vastu
// ============================================================

import { nameNumerology, lifePathNumber } from "@/lib/library-data";
import { analyzeVastu, type VastuInput } from "@/lib/vastu";

export function numerology(input: { name: string; dob: string }) {
  const name = nameNumerology(input.name);
  const lifePath = lifePathNumber(input.dob);
  return {
    name: input.name,
    dob: input.dob,
    nameNumber: name.number,
    nameMeaning: name.meaning,
    lifePathNumber: lifePath,
    computedAt: new Date().toISOString(),
  };
}

export function vastu(input: VastuInput) {
  return analyzeVastu(input);
}
