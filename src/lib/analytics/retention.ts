/**
 * Retention analytics — N-day retention over signup cohorts.
 */

import { RETENTION_WINDOWS } from "./constants";
import { fetchEvents } from "./engine";
import { pctOf } from "./metrics";
import type { AnalyticsFilters, DateRange, RetentionSummary, Sb } from "./types";

export interface RetentionResult {
  cohortSize: number;
  windows: RetentionSummary[];
  /** Daily curve: share of the cohort still active on day N. */
  curve: { day: number; pct: number }[];
}

export async function getRetention(
  sb: Sb,
  range: DateRange,
  filters: AnalyticsFilters = {},
  windows: readonly number[] = RETENTION_WINDOWS,
): Promise<RetentionResult> {
  const { data: profiles } = await sb
    .from("profiles")
    .select("id,created_at")
    .gte("created_at", range.from.toISOString())
    .lt("created_at", range.to.toISOString())
    .limit(20_000);

  const cohort = profiles ?? [];
  if (!cohort.length) {
    return {
      cohortSize: 0,
      windows: windows.map((w) => ({ windowDays: w, retained: 0, cohortSize: 0, pct: 0 })),
      curve: [],
    };
  }

  const maxWindow = Math.max(...windows);
  const events = await fetchEvents(
    sb,
    {
      from: range.from,
      to: new Date(Math.min(Date.now(), range.to.getTime() + maxWindow * 86_400_000)),
      days: range.days,
    },
    filters,
  );

  const start = new Map(cohort.map((p) => [p.id, new Date(p.created_at).getTime()]));
  /** userId → set of day offsets with activity */
  const activity = new Map<string, Set<number>>();
  for (const e of events) {
    if (!e.user_id) continue;
    const s = start.get(e.user_id);
    if (s === undefined) continue;
    const offset = Math.floor((new Date(e.created_at).getTime() - s) / 86_400_000);
    if (offset < 0) continue;
    const set = activity.get(e.user_id) ?? new Set<number>();
    set.add(offset);
    activity.set(e.user_id, set);
  }

  const retainedAt = (windowDays: number) => {
    let n = 0;
    for (const set of activity.values()) {
      for (const day of set) {
        if (day >= windowDays) {
          n += 1;
          break;
        }
      }
    }
    return n;
  };

  const curveDays = [0, 1, 2, 3, 5, 7, 14, 21, 30, 45, 60, 90, 180, 365].filter(
    (d) => d <= maxWindow,
  );
  const curve = curveDays.map((day) => ({ day, pct: pctOf(retainedAt(day), cohort.length) }));

  return {
    cohortSize: cohort.length,
    windows: windows.map((w) => {
      const retained = retainedAt(w);
      return {
        windowDays: w,
        retained,
        cohortSize: cohort.length,
        pct: pctOf(retained, cohort.length),
      };
    }),
    curve,
  };
}
