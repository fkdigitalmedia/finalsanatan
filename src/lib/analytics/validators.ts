/**
 * Input validation + normalisation for every analytics query.
 * Prevents unbounded scans and SQL-shaped injection via filter values.
 */

import { z } from "zod";
import type { AnalyticsFilters, DateRange, Granularity, QueryInput, RangeInput } from "./types";

const isoDate = z.string().min(4).max(40);

export const filtersSchema = z.object({
  country: z.string().max(8).nullable().optional(),
  lang: z.string().max(10).nullable().optional(),
  device: z.string().max(20).nullable().optional(),
  userType: z.string().max(20).nullable().optional(),
  planSlug: z.string().max(80).nullable().optional(),
  tool: z.string().max(120).nullable().optional(),
  aiProvider: z.string().max(80).nullable().optional(),
});

export const rangeSchema = z.object({
  from: isoDate.optional(),
  to: isoDate.optional(),
  days: z.number().optional(),
});

export const querySchema = rangeSchema.extend({
  filters: filtersSchema.optional(),
  granularity: z.string().max(10).optional(),
});

export function parseQuery(raw: unknown): QueryInput {
  const parsed = querySchema.safeParse(raw ?? {});
  const v = parsed.success ? parsed.data : {};
  const gran = (["hour", "day", "week", "month"] as const).includes(v.granularity as Granularity)
    ? (v.granularity as Granularity)
    : undefined;
  return {
    from: v.from,
    to: v.to,
    days: v.days,
    filters: (v.filters ?? {}) as AnalyticsFilters,
    granularity: gran,
  };
}

/** Clamp and materialise a date range. Defaults to the trailing 30 days. */
export function resolveRange(input: RangeInput = {}): DateRange {
  const to = input.to ? new Date(input.to) : new Date();
  const safeTo = Number.isNaN(to.getTime()) ? new Date() : to;
  const days = Math.max(1, Math.min(730, Math.round(input.days ?? 30)));
  const parsedFrom = input.from ? new Date(input.from) : null;
  const from =
    parsedFrom && !Number.isNaN(parsedFrom.getTime())
      ? parsedFrom
      : new Date(safeTo.getTime() - days * 86_400_000);
  const realDays = Math.max(1, Math.round((safeTo.getTime() - from.getTime()) / 86_400_000));
  return { from, to: safeTo, days: realDays };
}

/** Previous, equally long comparison window. */
export function previousRange(range: DateRange): DateRange {
  const span = range.to.getTime() - range.from.getTime();
  return { from: new Date(range.from.getTime() - span), to: range.from, days: range.days };
}

/** Auto-pick granularity from the window length. */
export function autoGranularity(range: DateRange, requested?: Granularity): Granularity {
  if (requested) return requested;
  if (range.days <= 2) return "hour";
  if (range.days <= 92) return "day";
  if (range.days <= 400) return "week";
  return "month";
}

/** Strip anything unexpected from user-supplied filters. */
export function sanitizeFilters(filters: AnalyticsFilters = {}): AnalyticsFilters {
  const clean = (v?: string | null) => {
    if (!v) return null;
    const s = String(v).trim().slice(0, 120);
    return s && s.toLowerCase() !== "all" ? s : null;
  };
  return {
    country: clean(filters.country),
    lang: clean(filters.lang),
    device: clean(filters.device),
    userType: clean(filters.userType),
    planSlug: clean(filters.planSlug),
    tool: clean(filters.tool),
    aiProvider: clean(filters.aiProvider),
  };
}
