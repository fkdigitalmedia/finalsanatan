// ============================================================
// Sade Sati & Dhaiya Engine — Calculator
// ------------------------------------------------------------
// Pure derivation from Saturn's occupancy timeline + natal Moon.
// ============================================================

import { DAY_MS, DHAIYA_META, PHASE_INTENSITY_BASE, PHASE_META, PHASE_ORDER } from "./constants";
import { clamp, humanizeDays, norm12, round, statusOf } from "./helpers";
import type {
  DhaiyaPeriod,
  DhaiyaStatus,
  SadeSatiCycle,
  SadeSatiPhase,
  SadeSatiStatus,
  SaturnOccupancy,
} from "./types";

/** Build every Sade Sati cycle (12th → 1st → 2nd from Moon) in range. */
export function buildCycles(
  occupancies: SaturnOccupancy[],
  moonRashiIndex: number,
  nowISO: string,
): SadeSatiCycle[] {
  const cycles: SadeSatiCycle[] = [];
  const want = PHASE_ORDER.map((k) => norm12(moonRashiIndex + PHASE_META[k].offset));

  for (let i = 0; i + 2 < occupancies.length; i++) {
    const trio = [occupancies[i], occupancies[i + 1], occupancies[i + 2]];
    if (!trio.every((o, idx) => o.rashiIndex === want[idx])) continue;

    const phases: SadeSatiPhase[] = trio.map((o, idx) => {
      const key = PHASE_ORDER[idx];
      const meta = PHASE_META[key];
      return {
        key,
        houseFromMoon: meta.houseFromMoon,
        label: meta.label,
        rashiIndex: o.rashiIndex,
        rashi: o.rashi,
        startISO: o.startISO,
        endISO: o.endISO,
        durationDays: o.durationDays,
        intensity: meta.intensity,
        status: statusOf(o.startISO, o.endISO, nowISO),
        description: meta.description,
      };
    });

    const startISO = phases[0].startISO;
    const endISO = phases[2].endISO;
    cycles.push({
      startISO,
      endISO,
      durationDays: round((Date.parse(endISO) - Date.parse(startISO)) / DAY_MS, 2),
      phases,
      status: statusOf(startISO, endISO, nowISO),
    });
  }
  return cycles;
}

export function pickCycle(
  cycles: SadeSatiCycle[],
  status: "past" | "active" | "upcoming",
): SadeSatiCycle | null {
  const list = cycles.filter((c) => c.status === status);
  if (list.length === 0) return null;
  return status === "past" ? list[list.length - 1] : list[0];
}

export function buildSadeSatiStatus(current: SadeSatiCycle | null, nowISO: string): SadeSatiStatus {
  if (!current) {
    return {
      active: false,
      currentPhase: null,
      startISO: null,
      endISO: null,
      elapsedDays: 0,
      remainingDays: 0,
      remaining: null,
      progress: 0,
      intensityScore: 0,
    };
  }
  const now = Date.parse(nowISO);
  const start = Date.parse(current.startISO);
  const end = Date.parse(current.endISO);
  const elapsed = (now - start) / DAY_MS;
  const remaining = (end - now) / DAY_MS;
  const phase = current.phases.find((p) => p.status === "active") ?? null;
  const total = (end - start) / DAY_MS;

  let intensity = 0;
  if (phase) {
    const pStart = Date.parse(phase.startISO);
    const pEnd = Date.parse(phase.endISO);
    const pProgress = clamp((now - pStart) / Math.max(1, pEnd - pStart), 0, 1);
    // Peak of each phase sits mid-way; taper ±10 points across the phase.
    const bell = 1 - Math.abs(pProgress - 0.5) * 2;
    intensity = clamp(PHASE_INTENSITY_BASE[phase.key] - 10 + bell * 10, 0, 100);
  }

  return {
    active: true,
    currentPhase: phase,
    startISO: current.startISO,
    endISO: current.endISO,
    elapsedDays: round(elapsed, 2),
    remainingDays: round(remaining, 2),
    remaining: humanizeDays(remaining),
    progress: round(clamp(elapsed / Math.max(1, total), 0, 1), 4),
    intensityScore: round(intensity),
  };
}

/** Kantaka (4th) and Ashtama (8th) Shani stays — the two Dhaiyas. */
export function buildDhaiyaPeriods(
  occupancies: SaturnOccupancy[],
  moonRashiIndex: number,
  nowISO: string,
): DhaiyaPeriod[] {
  const map = new Map<number, { kind: "kantaka" | "ashtama"; label: string; house: 4 | 8 }>();
  (Object.keys(DHAIYA_META) as Array<keyof typeof DHAIYA_META>).forEach((kind) => {
    const meta = DHAIYA_META[kind];
    map.set(norm12(moonRashiIndex + meta.offset), {
      kind,
      label: meta.label,
      house: meta.houseFromMoon,
    });
  });

  return occupancies
    .filter((o) => map.has(o.rashiIndex))
    .map((o) => {
      const meta = map.get(o.rashiIndex)!;
      return {
        kind: meta.kind,
        label: meta.label,
        houseFromMoon: meta.house,
        rashiIndex: o.rashiIndex,
        rashi: o.rashi,
        startISO: o.startISO,
        endISO: o.endISO,
        durationDays: o.durationDays,
        status: statusOf(o.startISO, o.endISO, nowISO),
      };
    });
}

export function buildDhaiyaStatus(periods: DhaiyaPeriod[], nowISO: string): DhaiyaStatus {
  const now = Date.parse(nowISO);
  const current = periods.find((p) => p.status === "active") ?? null;
  const upcoming = periods.filter((p) => p.status === "upcoming");
  const past = periods.filter((p) => p.status === "past");

  if (!current) {
    return {
      active: false,
      current: null,
      remainingDays: 0,
      remaining: null,
      progress: 0,
      next: upcoming[0] ?? null,
      previous: past[past.length - 1] ?? null,
    };
  }
  const start = Date.parse(current.startISO);
  const end = Date.parse(current.endISO);
  const remaining = (end - now) / DAY_MS;
  return {
    active: true,
    current,
    remainingDays: round(remaining, 2),
    remaining: humanizeDays(remaining),
    progress: round(clamp((now - start) / Math.max(1, end - start), 0, 1), 4),
    next: upcoming[0] ?? null,
    previous: past[past.length - 1] ?? null,
  };
}
