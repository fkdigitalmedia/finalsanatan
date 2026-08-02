// ============================================================
// Gochar Engine — Constants
// ============================================================

export const GOCHAR_ENGINE_VERSION = "0.1.0-gochar";
export const GOCHAR_DATA_SOURCE = "sanatan-tools/transit+kundli+dasha";

/** ± window around an ingress that counts as a sensitive period. */
export const SIGN_CHANGE_WINDOW_DAYS = 3;

/** ± window around retrograde onset/end (approximation). */
export const RETROGRADE_WINDOW_DAYS = 5;

/** Sun-relative arc (deg) inside which a planet is treated as combust. */
export const COMBUSTION_ARC_DEG: Record<string, number> = {
  Mercury: 12,
  Venus: 10,
  Mars: 17,
  Jupiter: 11,
  Saturn: 15,
};

/** Thresholds mapping influenceScore → verdict. */
export const VERDICT_THRESHOLDS = {
  positive: 62, // >= 62 → positive
  sensitive: 42, // < 42 → sensitive; between = neutral
} as const;

/** Baseline influence when we have no gochara data at all. */
export const NEUTRAL_INFLUENCE = 50;
