/**
 * Funnel analytics — visitor → registration → tool → PDF → premium → renewal.
 * Actors are keyed by user_id when known, otherwise session_id, so anonymous
 * traffic still enters the funnel at the top.
 */

import { DEFAULT_FUNNEL } from "./constants";
import { fetchEvents } from "./engine";
import { pctOf, round } from "./metrics";
import type { AnalyticsFilters, DateRange, FunnelStep, Sb } from "./types";

export interface FunnelDefinition {
  key: string;
  label: string;
  events: string[];
}

export interface FunnelResult {
  steps: FunnelStep[];
  totalConversionPct: number;
  biggestDropOff: { key: string; label: string; lostPct: number } | null;
}

export async function getFunnel(
  sb: Sb,
  range: DateRange,
  filters: AnalyticsFilters = {},
  definition: FunnelDefinition[] = DEFAULT_FUNNEL,
): Promise<FunnelResult> {
  const wanted = [...new Set(definition.flatMap((s) => s.events))];
  const events = await fetchEvents(sb, range, filters, { events: wanted });

  const actorsPerStep = definition.map((step) => {
    const set = new Set<string>();
    for (const e of events) {
      if (!step.events.includes(e.event_name)) continue;
      set.add(e.user_id ?? `s:${e.session_id}`);
    }
    return set;
  });

  // Enforce monotonicity: a step can never have more actors than the one above.
  const counts: number[] = [];
  for (let i = 0; i < actorsPerStep.length; i += 1) {
    const raw = actorsPerStep[i].size;
    counts.push(i === 0 ? raw : Math.min(raw, counts[i - 1]));
  }

  const first = counts[0] || 0;
  const steps: FunnelStep[] = definition.map((step, i) => {
    const users = counts[i];
    const prev = i === 0 ? users : counts[i - 1];
    return {
      key: step.key,
      label: step.label,
      users,
      stepPct: pctOf(users, prev),
      overallPct: pctOf(users, first),
      dropOff: Math.max(0, prev - users),
    };
  });

  let biggest: FunnelResult["biggestDropOff"] = null;
  for (let i = 1; i < steps.length; i += 1) {
    const lostPct = round(100 - steps[i].stepPct, 1);
    if (!biggest || lostPct > biggest.lostPct) {
      biggest = { key: steps[i].key, label: steps[i].label, lostPct };
    }
  }

  return {
    steps,
    totalConversionPct: steps.length ? steps[steps.length - 1].overallPct : 0,
    biggestDropOff: biggest,
  };
}
