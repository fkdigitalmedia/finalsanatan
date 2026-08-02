// ============================================================
// Kundli / strength / ashtakvarga
// ------------------------------------------------------------
// Classical Parashara BAV (Bhinnashtakavarga) tables for the
// seven planets plus Lagna as contributors, giving benefic points
// (bindus) to each of the 12 signs. SAV = sum across all seven
// planetary BAVs.
//
// Each entry gives the benefic-house numbers (1..12) counted
// forward from the contributor's own sign.
// ============================================================
import type { GrahaName, KundliChart } from "@/lib/kundli/types";

type Source = GrahaName | "Lagna";
type Recipient = "Sun" | "Moon" | "Mars" | "Mercury" | "Jupiter" | "Venus" | "Saturn";

const BAV_TABLES: Record<Recipient, Record<Source, number[]>> = {
  Sun: {
    Sun: [1, 2, 4, 7, 8, 9, 10, 11],
    Moon: [3, 6, 10, 11],
    Mars: [1, 2, 4, 7, 8, 10, 11],
    Mercury: [3, 5, 6, 9, 10, 11, 12],
    Jupiter: [5, 6, 9, 11],
    Venus: [6, 7, 12],
    Saturn: [1, 2, 4, 7, 8, 9, 10, 11],
    Lagna: [3, 4, 6, 10, 11, 12],
    Rahu: [],
    Ketu: [],
  },
  Moon: {
    Sun: [3, 6, 7, 8, 10, 11],
    Moon: [1, 3, 6, 7, 10, 11],
    Mars: [2, 3, 5, 6, 9, 10, 11],
    Mercury: [1, 3, 4, 5, 7, 8, 10, 11],
    Jupiter: [1, 4, 7, 8, 10, 11, 12],
    Venus: [3, 4, 5, 7, 9, 10, 11],
    Saturn: [3, 5, 6, 11],
    Lagna: [3, 6, 10, 11],
    Rahu: [],
    Ketu: [],
  },
  Mars: {
    Sun: [3, 5, 6, 10, 11],
    Moon: [3, 6, 11],
    Mars: [1, 2, 4, 7, 8, 10, 11],
    Mercury: [3, 5, 6, 11],
    Jupiter: [6, 10, 11, 12],
    Venus: [6, 8, 11, 12],
    Saturn: [1, 4, 7, 8, 9, 10, 11],
    Lagna: [1, 3, 6, 10, 11],
    Rahu: [],
    Ketu: [],
  },
  Mercury: {
    Sun: [5, 6, 9, 11, 12],
    Moon: [2, 4, 6, 8, 10, 11],
    Mars: [1, 2, 4, 7, 8, 9, 10, 11],
    Mercury: [1, 3, 5, 6, 9, 10, 11, 12],
    Jupiter: [6, 8, 11, 12],
    Venus: [1, 2, 3, 4, 5, 8, 9, 11],
    Saturn: [1, 2, 4, 7, 8, 9, 10, 11],
    Lagna: [1, 2, 4, 6, 8, 10, 11],
    Rahu: [],
    Ketu: [],
  },
  Jupiter: {
    Sun: [1, 2, 3, 4, 7, 8, 9, 10, 11],
    Moon: [2, 5, 7, 9, 11],
    Mars: [1, 2, 4, 7, 8, 10, 11],
    Mercury: [1, 2, 4, 5, 6, 9, 10, 11],
    Jupiter: [1, 2, 3, 4, 7, 8, 10, 11],
    Venus: [2, 5, 6, 9, 10, 11],
    Saturn: [3, 5, 6, 12],
    Lagna: [1, 2, 4, 5, 6, 7, 9, 10, 11],
    Rahu: [],
    Ketu: [],
  },
  Venus: {
    Sun: [8, 11, 12],
    Moon: [1, 2, 3, 4, 5, 8, 9, 11, 12],
    Mars: [3, 4, 6, 9, 11, 12],
    Mercury: [3, 5, 6, 9, 11],
    Jupiter: [5, 8, 9, 10, 11],
    Venus: [1, 2, 3, 4, 5, 8, 9, 10, 11],
    Saturn: [3, 4, 5, 8, 9, 10, 11],
    Lagna: [1, 2, 3, 4, 5, 8, 9, 11],
    Rahu: [],
    Ketu: [],
  },
  Saturn: {
    Sun: [1, 2, 4, 7, 8, 10, 11],
    Moon: [3, 6, 11],
    Mars: [3, 5, 6, 10, 11, 12],
    Mercury: [6, 8, 9, 10, 11, 12],
    Jupiter: [5, 6, 11, 12],
    Venus: [6, 11, 12],
    Saturn: [3, 5, 6, 11],
    Lagna: [1, 3, 4, 6, 10, 11],
    Rahu: [],
    Ketu: [],
  },
};

const RECIPIENTS: Recipient[] = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
const CONTRIBUTORS: Source[] = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
  "Lagna",
];

export interface BhinnaEntry {
  graha: Recipient;
  /** benefic points per sign, index 0 = Mesha .. 11 = Meena */
  bindusBySign: number[];
  total: number;
}

export interface AshtakvargaReport {
  bhinna: BhinnaEntry[];
  /** Sarvashtakavarga — sum across all 7 planets, per sign */
  sarva: number[];
  sarvaTotal: number;
}

export function computeAshtakvarga(chart: KundliChart): AshtakvargaReport {
  const positions: Record<Source, number> = {} as Record<Source, number>;
  chart.planets.forEach((p) => (positions[p.graha as Source] = p.rashiIndex));
  positions.Lagna = chart.ascendant.rashiIndex;

  const bhinna: BhinnaEntry[] = RECIPIENTS.map((recip) => {
    const bindusBySign = new Array(12).fill(0);
    for (const src of CONTRIBUTORS) {
      const srcRashi = positions[src];
      if (srcRashi === undefined) continue;
      const beneficHouses = BAV_TABLES[recip][src];
      for (const h of beneficHouses) {
        // count h houses forward from src (h=1 means src's own sign)
        const targetSign = (srcRashi + h - 1) % 12;
        bindusBySign[targetSign] += 1;
      }
    }
    return {
      graha: recip,
      bindusBySign,
      total: bindusBySign.reduce((a, b) => a + b, 0),
    };
  });

  const sarva = new Array(12).fill(0);
  for (const b of bhinna) b.bindusBySign.forEach((v, i) => (sarva[i] += v));
  return {
    bhinna,
    sarva,
    sarvaTotal: sarva.reduce((a, b) => a + b, 0),
  };
}
