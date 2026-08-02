// ============================================================
// Transit Engine — Validators
// ------------------------------------------------------------
// Pure input validation. No astronomy, no I/O.
// ============================================================

import { TRANSIT_PLANET_NAMES } from "./constants";
import type { TransitInput, TransitValidationResult } from "./types";

const DATE_RE = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2})?(\.\d+)?(Z|[+-]\d{2}:?\d{2})?)?$/;

/**
 * Validate a TransitInput. All fields are optional — the engine falls
 * back to `now` + `DEFAULT_TRANSIT_LOCATION` when omitted.
 */
export function validateTransitInput(input: TransitInput = {}): TransitValidationResult {
  const errors: TransitValidationResult["errors"] = [];
  const push = (field: string, message: string) => errors.push({ field, message });

  if (input.date !== undefined) {
    if (typeof input.date !== "string" || !DATE_RE.test(input.date)) {
      push("date", "date must be YYYY-MM-DD or a valid ISO string");
    } else if (isNaN(+new Date(input.date))) {
      push("date", "date could not be parsed");
    }
  }

  const loc = input.location;
  if (loc) {
    if (loc.latitude !== undefined && (loc.latitude < -90 || loc.latitude > 90)) {
      push("location.latitude", "latitude must be between -90 and 90");
    }
    if (loc.longitude !== undefined && (loc.longitude < -180 || loc.longitude > 180)) {
      push("location.longitude", "longitude must be between -180 and 180");
    }
    if (loc.timezone !== undefined) {
      const tz = loc.timezone;
      const ok =
        (typeof tz === "string" && tz.length > 0 && tz.length <= 64) ||
        (typeof tz === "number" && tz >= -14 && tz <= 14);
      if (!ok) push("location.timezone", "timezone must be an IANA name or offset hours (-14..14)");
    }
  }

  if (
    input.language !== undefined &&
    (typeof input.language !== "string" || input.language.length > 16)
  ) {
    push("language", "language must be a short string");
  }

  if (input.planets) {
    if (!Array.isArray(input.planets) || input.planets.length === 0) {
      push("planets", "planets must be a non-empty array");
    } else {
      for (const p of input.planets) {
        if (!TRANSIT_PLANET_NAMES.includes(p)) {
          push("planets", `unknown planet: ${p}`);
        }
      }
    }
  }

  return { ok: errors.length === 0, errors };
}
