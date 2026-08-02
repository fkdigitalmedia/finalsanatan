// ============================================================
// Dasha Engine — Shared Calculator
// ------------------------------------------------------------
// System-agnostic. Given a timeline produced by any DashaSystem
// implementation, derives current / previous / next Mahadasha,
// current Antardasha, current Pratyantar, and progress metrics.
// ============================================================

import { periodProgress, round4 } from "./helpers";
import type {
  CurrentPeriod,
  DashaSubPeriod,
  MahadashaEntry,
  AntardashaEntry,
  NeighbourPeriod,
} from "./types";

/** Locate the timeline slot that contains `nowISO` (or null if none). */
export function findCurrentMahadashaIndex(timeline: MahadashaEntry[], nowISO: string): number {
  const now = Date.parse(nowISO);
  for (let i = 0; i < timeline.length; i++) {
    if (now >= Date.parse(timeline[i].startISO) && now < Date.parse(timeline[i].endISO)) {
      return i;
    }
  }
  return -1;
}

/** Map a sub-period (AD/PD) → CurrentPeriod snapshot with progress. */
export function toCurrentPeriod(period: DashaSubPeriod, nowISO: string): CurrentPeriod {
  const prog = periodProgress(period.startISO, period.endISO, nowISO);
  return {
    lord: period.lord,
    startISO: period.startISO,
    endISO: period.endISO,
    durationDays: prog.durationDays,
    elapsedDays: prog.elapsedDays,
    remainingDays: prog.remainingDays,
    progress: round4(prog.progress),
  };
}

export function toCurrentMahadasha(md: MahadashaEntry, nowISO: string): CurrentPeriod {
  return toCurrentPeriod(
    { lord: md.lord, startISO: md.startISO, endISO: md.endISO, durationDays: md.durationDays },
    nowISO,
  );
}

export function toNeighbour(md: MahadashaEntry | undefined): NeighbourPeriod | null {
  if (!md) return null;
  return { lord: md.lord, startISO: md.startISO, endISO: md.endISO, years: md.years };
}

export function findCurrentAntardasha(md: MahadashaEntry, nowISO: string): AntardashaEntry | null {
  const now = Date.parse(nowISO);
  return (
    md.antardashas.find((a) => now >= Date.parse(a.startISO) && now < Date.parse(a.endISO)) ?? null
  );
}

export function findCurrentPratyantar(
  ad: AntardashaEntry | null,
  nowISO: string,
): DashaSubPeriod | null {
  if (!ad?.pratyantardashas) return null;
  const now = Date.parse(nowISO);
  return (
    ad.pratyantardashas.find((p) => now >= Date.parse(p.startISO) && now < Date.parse(p.endISO)) ??
    null
  );
}

export interface ResolvedTimelinePosition {
  current: CurrentPeriod | null;
  currentAd: CurrentPeriod | null;
  currentPd: CurrentPeriod | null;
  previous: NeighbourPeriod | null;
  next: NeighbourPeriod | null;
}

/** One-shot resolver that produces every derivable "current/prev/next" slice. */
export function resolveTimelinePosition(
  timeline: MahadashaEntry[],
  nowISO: string,
): ResolvedTimelinePosition {
  const idx = findCurrentMahadashaIndex(timeline, nowISO);
  if (idx === -1) {
    return { current: null, currentAd: null, currentPd: null, previous: null, next: null };
  }
  const md = timeline[idx];
  const ad = findCurrentAntardasha(md, nowISO);
  const pd = findCurrentPratyantar(ad, nowISO);
  return {
    current: toCurrentMahadasha(md, nowISO),
    currentAd: ad ? toCurrentPeriod(ad, nowISO) : null,
    currentPd: pd ? toCurrentPeriod(pd, nowISO) : null,
    previous: toNeighbour(timeline[idx - 1]),
    next: toNeighbour(timeline[idx + 1]),
  };
}
