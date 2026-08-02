// ============================================================
// Kundli / dasha / vimshottari
// ------------------------------------------------------------
// Classical 120-year Vimshottari Mahadasha + Antardasha timeline
// starting from the balance of dasha at birth (based on the
// portion of the natal Nakshatra the Moon has yet to traverse).
// ============================================================
import type { GrahaName } from "../types";

export const DASHA_ORDER: GrahaName[] = [
  "Ketu",
  "Venus",
  "Sun",
  "Moon",
  "Mars",
  "Rahu",
  "Jupiter",
  "Saturn",
  "Mercury",
];

export const DASHA_YEARS: Record<GrahaName, number> = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17,
};

const YEAR_MS = 365.2425 * 24 * 3600 * 1000;

export interface PratyantarPeriod {
  lord: GrahaName;
  startISO: string;
  endISO: string;
}

export interface AntardashaPeriod {
  lord: GrahaName;
  startISO: string;
  endISO: string;
  pratyantardashas?: PratyantarPeriod[];
}

export interface MahadashaPeriod {
  lord: GrahaName;
  years: number;
  startISO: string;
  endISO: string;
  antardashas: AntardashaPeriod[];
}

export interface VimshottariReport {
  balanceAtBirth: {
    lord: GrahaName;
    yearsRemaining: number;
  };
  timeline: MahadashaPeriod[];
  current: {
    mahadasha: { lord: GrahaName; startISO: string; endISO: string };
    antardasha: { lord: GrahaName; startISO: string; endISO: string };
    pratyantar?: { lord: GrahaName; startISO: string; endISO: string };
  } | null;
}

/**
 * Compute full Vimshottari.
 * @param birthUtc birth instant
 * @param moonNakshatraIndex 0..26 (nakshatra Moon occupied at birth)
 * @param moonNakshatraLord ruling planet of that nakshatra
 * @param fractionElapsedInNakshatra 0..1 — how far Moon has crossed the nakshatra span
 * @param asOfUtc reference "now" instant to compute current dasha (defaults to now)
 */
export function computeVimshottari(
  birthUtc: Date,
  moonNakshatraLord: GrahaName,
  fractionElapsedInNakshatra: number,
  asOfUtc: Date = new Date(),
): VimshottariReport {
  // Balance-of-dasha: remaining fraction of the current lord's dasha at birth.
  const yearsRemaining = DASHA_YEARS[moonNakshatraLord] * (1 - fractionElapsedInNakshatra);

  const timeline: MahadashaPeriod[] = [];
  let cursor = birthUtc.getTime();

  const startIdx = DASHA_ORDER.indexOf(moonNakshatraLord);
  // First (partial) Mahadasha
  {
    const lord = moonNakshatraLord;
    const start = cursor;
    const end = start + yearsRemaining * YEAR_MS;
    timeline.push({
      lord,
      years: yearsRemaining,
      startISO: new Date(start).toISOString(),
      endISO: new Date(end).toISOString(),
      antardashas: buildAntardashas(lord, start, end),
    });
    cursor = end;
  }

  // Next 8 full Mahadashas → total 9 lords → 120 years
  for (let i = 1; i < 9; i++) {
    const lord = DASHA_ORDER[(startIdx + i) % 9];
    const start = cursor;
    const end = start + DASHA_YEARS[lord] * YEAR_MS;
    timeline.push({
      lord,
      years: DASHA_YEARS[lord],
      startISO: new Date(start).toISOString(),
      endISO: new Date(end).toISOString(),
      antardashas: buildAntardashas(lord, start, end),
    });
    cursor = end;
  }

  const nowMs = asOfUtc.getTime();
  let current: VimshottariReport["current"] = null;
  for (const md of timeline) {
    if (nowMs >= Date.parse(md.startISO) && nowMs < Date.parse(md.endISO)) {
      const ad = md.antardashas.find(
        (a) => nowMs >= Date.parse(a.startISO) && nowMs < Date.parse(a.endISO),
      );
      let pd: PratyantarPeriod | undefined;
      if (ad?.pratyantardashas) {
        pd = ad.pratyantardashas.find(
          (p) => nowMs >= Date.parse(p.startISO) && nowMs < Date.parse(p.endISO),
        );
      }
      current = {
        mahadasha: { lord: md.lord, startISO: md.startISO, endISO: md.endISO },
        antardasha: ad
          ? { lord: ad.lord, startISO: ad.startISO, endISO: ad.endISO }
          : { lord: md.lord, startISO: md.startISO, endISO: md.endISO },
        pratyantar: pd ? { lord: pd.lord, startISO: pd.startISO, endISO: pd.endISO } : undefined,
      };
      break;
    }
  }

  return {
    balanceAtBirth: { lord: moonNakshatraLord, yearsRemaining },
    timeline,
    current,
  };
}

/**
 * Antardashas within a Mahadasha: 9 sub-periods proportional to
 * (MD_years × AD_years / 120), starting from the MD's own lord.
 * For the very first (partial) MD the same proportion is scaled by
 * the actual duration of the truncated MD.
 */
function buildAntardashas(
  mdLord: GrahaName,
  mdStartMs: number,
  mdEndMs: number,
): AntardashaPeriod[] {
  const totalMs = mdEndMs - mdStartMs;
  const mdIdx = DASHA_ORDER.indexOf(mdLord);
  const list: AntardashaPeriod[] = [];
  let cursor = mdStartMs;
  const mdYearsFull = DASHA_YEARS[mdLord];
  for (let i = 0; i < 9; i++) {
    const lord = DASHA_ORDER[(mdIdx + i) % 9];
    const fullDurMs = ((mdYearsFull * DASHA_YEARS[lord]) / 120) * YEAR_MS;
    const durMs = fullDurMs * (totalMs / (mdYearsFull * YEAR_MS));
    const end = Math.min(cursor + durMs, mdEndMs);
    list.push({
      lord,
      startISO: new Date(cursor).toISOString(),
      endISO: new Date(end).toISOString(),
      pratyantardashas: buildPratyantar(lord, cursor, end),
    });
    cursor = end;
    if (cursor >= mdEndMs) break;
  }
  return list;
}

/** Pratyantar-dasha — 9 sub-sub-periods within an Antardasha, proportional to DASHA_YEARS. */
function buildPratyantar(
  adLord: GrahaName,
  adStartMs: number,
  adEndMs: number,
): PratyantarPeriod[] {
  const total = adEndMs - adStartMs;
  const startIdx = DASHA_ORDER.indexOf(adLord);
  const list: PratyantarPeriod[] = [];
  let cursor = adStartMs;
  for (let i = 0; i < 9; i++) {
    const lord = DASHA_ORDER[(startIdx + i) % 9];
    const dur = (total * DASHA_YEARS[lord]) / 120;
    const end = Math.min(cursor + dur, adEndMs);
    list.push({
      lord,
      startISO: new Date(cursor).toISOString(),
      endISO: new Date(end).toISOString(),
    });
    cursor = end;
    if (cursor >= adEndMs) break;
  }
  return list;
}
