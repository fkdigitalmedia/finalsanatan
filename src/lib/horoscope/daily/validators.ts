// ============================================================
// Daily Horoscope Engine — Validators
// ------------------------------------------------------------
// Pure input validation. No astronomy, no I/O.
// ============================================================

import { RASHI_KEYS, SUPPORTED_LANGUAGES } from "../constants";
import type { DailyHoroscopeInput, DailyValidationResult } from "./types";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function validateDailyInput(input: DailyHoroscopeInput): DailyValidationResult {
  const errors: DailyValidationResult["errors"] = [];
  const push = (field: string, message: string) => errors.push({ field, message });

  if (!input || typeof input !== "object") {
    return { ok: false, errors: [{ field: "input", message: "input must be an object" }] };
  }

  if (input.date !== undefined && !DATE_RE.test(input.date)) {
    push("date", "date must be YYYY-MM-DD");
  }
  if (!input.rashi || !RASHI_KEYS.includes(input.rashi)) {
    push("rashi", `rashi must be one of ${RASHI_KEYS.join(", ")}`);
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
  if (input.latitude !== undefined && (input.latitude < -90 || input.latitude > 90)) {
    push("latitude", "latitude must be between -90 and 90");
  }
  if (input.longitude !== undefined && (input.longitude < -180 || input.longitude > 180)) {
    push("longitude", "longitude must be between -180 and 180");
  }

  return { ok: errors.length === 0, errors };
}
