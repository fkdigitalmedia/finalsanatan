// ============================================================
// Service — Kundli, Dasha, Gochar, Sade Sati, Dosha/Yoga
// ------------------------------------------------------------
// Thin adapters. Every number comes from the existing engines.
// ============================================================

import { generateKundli } from "@/lib/kundli";
import type { BirthInput } from "@/lib/kundli/types";
import { generateDasha } from "@/lib/dasha";
import type { DashaInput } from "@/lib/dasha/types";
import { generateGochar } from "@/lib/gochar";
import type { GocharInput } from "@/lib/gochar/types";
import { generateSadeSati } from "@/lib/sadesati";
import { detectYogasAndDoshas } from "@/lib/yogadosha";
import type { YogaDoshaInput } from "@/lib/yogadosha/types";
import { generateTransitSnapshot } from "@/lib/transit";

export function kundli(birth: BirthInput) {
  return generateKundli(birth);
}

/** Compact chart payload for list/summary screens. */
export function kundliSummary(birth: BirthInput) {
  const k = generateKundli(birth);
  return {
    computedAt: k.computedAt,
    time: k.time,
    moonSign: k.moonSign,
    sunSign: k.sunSign,
    ascendant: k.d1.ascendant,
    birthNakshatra: k.birthNakshatra,
    planets: k.d1.planets.map((p) => ({
      graha: p.graha,
      rashi: p.rashi,
      house: p.house,
      degreesInRashi: p.degreesInRashi,
      nakshatra: p.nakshatra,
      pada: p.pada,
      retrograde: p.retrograde,
      dignity: p.dignity,
    })),
    yogas: k.yogas ?? [],
    doshas: k.doshas ?? [],
    birthPanchang: k.birthPanchang,
    avakahada: k.avakahada,
  };
}

export function charts(birth: BirthInput, wanted?: string[]) {
  const k = generateKundli(birth) as unknown as Record<string, unknown>;
  const keys = wanted?.length
    ? wanted
    : [
        "d1",
        "d9",
        "d3",
        "d7",
        "d10",
        "d12",
        "d16",
        "d20",
        "d24",
        "d27",
        "d30",
        "d40",
        "d45",
        "d60",
      ];
  const out: Record<string, unknown> = {};
  for (const key of keys) if (k[key]) out[key] = k[key];
  return out;
}

export function dasha(input: DashaInput) {
  return generateDasha(input);
}

export function gochar(input: GocharInput) {
  return generateGochar(input);
}

export function sadeSati(input: { birth: BirthInput; currentDate?: string; language?: string }) {
  return generateSadeSati(input as Parameters<typeof generateSadeSati>[0]);
}

export function yogaDosha(input: YogaDoshaInput) {
  return detectYogasAndDoshas(input);
}

export function transitSnapshot(date?: string) {
  return generateTransitSnapshot(date ? { date } : undefined);
}
