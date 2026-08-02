// ============================================================
// Horoscope Trend Engine
// ------------------------------------------------------------
// Reusable trend classifier for any time-series of 0..100 scores.
// Consumed by weekly + monthly aggregators (and future phases).
// Pure functions, no I/O, no astronomy.
// ============================================================

export type TrendDirection = "improving" | "stable" | "mixed" | "declining";

export interface TrendResult {
  direction: TrendDirection;
  /** Absolute strength of the change on a 0..1 scale. */
  strength: number;
  /** 0..1 — how consistent the direction is across the samples. */
  confidence: number;
  /** Numeric average of the series (0..100). */
  average: number;
  /** min / max within the series. */
  min: number;
  max: number;
  /** Slope of a least-squares fit (score units per step). */
  slope: number;
  /** Standard deviation of the series. */
  volatility: number;
  samples: number;
}

/** Small guard for empty/degenerate inputs. */
const EMPTY: TrendResult = {
  direction: "stable",
  strength: 0,
  confidence: 0,
  average: 0,
  min: 0,
  max: 0,
  slope: 0,
  volatility: 0,
  samples: 0,
};

/**
 * Classify a numeric series (typically daily scores) into a trend.
 * Rules:
 *  - |slope| < SLOPE_STABLE → stable
 *  - volatility high AND slope small → mixed
 *  - slope > 0 → improving; slope < 0 → declining
 */
export function classifyTrend(series: number[]): TrendResult {
  if (!series || series.length === 0) return EMPTY;
  if (series.length === 1) {
    return { ...EMPTY, samples: 1, average: series[0], min: series[0], max: series[0] };
  }

  const n = series.length;
  const avg = series.reduce((a, b) => a + b, 0) / n;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const variance = series.reduce((a, b) => a + (b - avg) ** 2, 0) / n;
  const volatility = Math.sqrt(variance);

  // Least-squares slope with x = 0..n-1.
  let sxy = 0;
  let sxx = 0;
  const mx = (n - 1) / 2;
  for (let i = 0; i < n; i++) {
    sxy += (i - mx) * (series[i] - avg);
    sxx += (i - mx) ** 2;
  }
  const slope = sxx === 0 ? 0 : sxy / sxx;

  const SLOPE_STABLE = 0.5; // score units per step
  const HIGH_VOLATILITY = 12; // std-dev in score units

  let direction: TrendDirection;
  if (Math.abs(slope) < SLOPE_STABLE && volatility >= HIGH_VOLATILITY) direction = "mixed";
  else if (Math.abs(slope) < SLOPE_STABLE) direction = "stable";
  else if (slope > 0) direction = "improving";
  else direction = "declining";

  // Strength: normalized magnitude of slope × window length (in score units).
  const totalMove = Math.abs(slope) * (n - 1);
  const strength = Math.max(0, Math.min(1, totalMove / 30)); // 30-point move ≈ full strength

  // Confidence: fraction of consecutive deltas matching the overall direction.
  let matching = 0;
  let deltas = 0;
  for (let i = 1; i < n; i++) {
    const d = series[i] - series[i - 1];
    if (d === 0) continue;
    deltas++;
    if ((direction === "improving" && d > 0) || (direction === "declining" && d < 0)) matching++;
    if (direction === "stable" && Math.abs(d) < 3) matching++;
    if (direction === "mixed") matching++; // mixed = no directional expectation
  }
  const confidence = deltas === 0 ? 1 : Math.round((matching / deltas) * 100) / 100;

  return {
    direction,
    strength: Math.round(strength * 100) / 100,
    confidence,
    average: Math.round(avg * 10) / 10,
    min,
    max,
    slope: Math.round(slope * 100) / 100,
    volatility: Math.round(volatility * 10) / 10,
    samples: n,
  };
}

/**
 * Classify trends for multiple categories at once.
 * `seriesByCategory[category]` is an array of daily 0..100 scores.
 */
export function classifyTrendMap<K extends string>(
  seriesByCategory: Record<K, number[]>,
): Record<K, TrendResult> {
  const out = {} as Record<K, TrendResult>;
  for (const key of Object.keys(seriesByCategory) as K[]) {
    out[key] = classifyTrend(seriesByCategory[key]);
  }
  return out;
}
