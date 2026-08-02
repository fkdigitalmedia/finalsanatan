// ============================================================
// Dasha Engine — Vimshottari System Adapter
// ------------------------------------------------------------
// Wraps the existing kundli/dasha/vimshottari implementation and
// exposes it through the pluggable DashaSystem interface. All
// classical math stays in the kundli module — this file only
// adapts shapes.
// ============================================================

import { NAKSHATRA_LORDS } from "@/lib/kundli/strength";
import {
  computeVimshottari,
  DASHA_YEARS,
  type MahadashaPeriod,
} from "@/lib/kundli/dasha/vimshottari";
import type { GrahaName } from "@/lib/kundli/types";
import { DAY_MS, YEAR_MS } from "./constants";
import { daysBetween } from "./helpers";
import type {
  AntardashaEntry,
  DashaSystem,
  DashaSystemComputation,
  DashaSystemContext,
  MahadashaEntry,
} from "./types";

function toAntardasha(a: MahadashaPeriod["antardashas"][number]): AntardashaEntry {
  return {
    lord: a.lord,
    startISO: a.startISO,
    endISO: a.endISO,
    durationDays: daysBetween(a.startISO, a.endISO),
    pratyantardashas: a.pratyantardashas?.map((p) => ({
      lord: p.lord,
      startISO: p.startISO,
      endISO: p.endISO,
      durationDays: daysBetween(p.startISO, p.endISO),
    })),
  };
}

function toMahadasha(md: MahadashaPeriod): MahadashaEntry {
  return {
    lord: md.lord,
    startISO: md.startISO,
    endISO: md.endISO,
    years: md.years,
    durationDays: daysBetween(md.startISO, md.endISO),
    antardashas: md.antardashas.map(toAntardasha),
  };
}

export const VimshottariSystem: DashaSystem = {
  key: "vimshottari",
  totalYears: 120,
  compute({ natal, birthUtc }: DashaSystemContext): DashaSystemComputation {
    // Re-derive the Moon's fractional position inside its nakshatra
    // from natal chart data so we never re-run astronomy.
    const moon = natal.d1.planets.find((p) => p.graha === "Moon");
    if (!moon) throw new Error("natal chart missing Moon graha");
    const nakSpan = 360 / 27;
    const idx = Math.floor(moon.longitudeSidereal / nakSpan);
    const within = moon.longitudeSidereal - idx * nakSpan;
    const fractionElapsed = within / nakSpan;
    const lord = NAKSHATRA_LORDS[idx] as GrahaName;

    const report = computeVimshottari(birthUtc, lord, fractionElapsed, birthUtc);
    const timeline = report.timeline.map(toMahadasha);
    const yearsRemaining = report.balanceAtBirth.yearsRemaining;

    return {
      balanceAtBirth: {
        lord,
        yearsRemaining: Math.round(yearsRemaining * 10_000) / 10_000,
        daysRemaining: Math.round(((yearsRemaining * YEAR_MS) / DAY_MS) * 100) / 100,
      },
      timeline,
    };
  },
};

// Re-export DASHA_YEARS for consumers who need the classical table.
export { DASHA_YEARS };
