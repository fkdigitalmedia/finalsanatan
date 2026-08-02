// ============================================================
// Horoscope Engine — Validators
// ------------------------------------------------------------
// Pure input validation. No astronomy, no I/O.
// ============================================================

import { HOROSCOPE_TYPES, RASHI_KEYS, SUPPORTED_LANGUAGES } from "./constants";
import type { HoroscopeInput, ValidationResult } from "./types";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;

/**
 * Validate a HoroscopeInput.
 * - Non-personalized types require `rashi`.
 * - Personalized type requires date + time + lat + lon + timezone.
 */
export function validateHoroscopeInput(input: HoroscopeInput): ValidationResult {
  const errors: ValidationResult["errors"] = [];
  const push = (field: string, message: string) => errors.push({ field, message });

  if (!input || typeof input !== "object") {
    return { ok: false, errors: [{ field: "input", message: "input must be an object" }] };
  }

  if (!HOROSCOPE_TYPES.includes(input.type)) {
    push("type", `type must be one of ${HOROSCOPE_TYPES.join(", ")}`);
  }

  if (input.date !== undefined && !DATE_RE.test(input.date)) {
    push("date", "date must be YYYY-MM-DD");
  }
  if (input.time !== undefined && !TIME_RE.test(input.time)) {
    push("time", "time must be HH:mm (24h)");
  }
  if (input.place !== undefined && (typeof input.place !== "string" || input.place.length > 200)) {
    push("place", "place must be a string ≤ 200 chars");
  }
  if (input.latitude !== undefined && (input.latitude < -90 || input.latitude > 90)) {
    push("latitude", "latitude must be between -90 and 90");
  }
  if (input.longitude !== undefined && (input.longitude < -180 || input.longitude > 180)) {
    push("longitude", "longitude must be between -180 and 180");
  }
  if (input.timezone !== undefined) {
    const tz = input.timezone;
    const okTz =
      (typeof tz === "string" && tz.length > 0 && tz.length <= 64) ||
      (typeof tz === "number" && tz >= -14 && tz <= 14);
    if (!okTz) push("timezone", "timezone must be an IANA name or offset hours (-14..14)");
  }
  if (
    input.language !== undefined &&
    !SUPPORTED_LANGUAGES.includes(input.language as (typeof SUPPORTED_LANGUAGES)[number])
  ) {
    push("language", `language must be one of ${SUPPORTED_LANGUAGES.join(", ")}`);
  }
  if (input.rashi !== undefined && !RASHI_KEYS.includes(input.rashi)) {
    push("rashi", `rashi must be one of ${RASHI_KEYS.join(", ")}`);
  }

  if (input.type === "personalized") {
    for (const f of ["date", "time", "latitude", "longitude", "timezone"] as const) {
      if (input[f] === undefined) push(f, `${f} is required for personalized horoscope`);
    }
  } else if (HOROSCOPE_TYPES.includes(input.type) && !input.rashi) {
    push("rashi", "rashi is required for non-personalized horoscope");
  }

  return { ok: errors.length === 0, errors };
}
