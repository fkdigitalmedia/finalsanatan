// ============================================================
// Dasha Engine — Validators
// ============================================================

import { SUPPORTED_LANGUAGES } from "@/lib/horoscope/constants";
import { ALL_SYSTEM_KEYS, IMPLEMENTED_SYSTEMS } from "./constants";
import type { DashaInput, DashaValidationResult } from "./types";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;

export function validateDashaInput(input: DashaInput): DashaValidationResult {
  const errors: DashaValidationResult["errors"] = [];
  const push = (field: string, message: string) => errors.push({ field, message });

  if (!input || typeof input !== "object") {
    return { ok: false, errors: [{ field: "input", message: "input required" }] };
  }
  const birth = input.birth;
  if (!birth || typeof birth !== "object") {
    return { ok: false, errors: [{ field: "birth", message: "birth object required" }] };
  }

  if (!birth.date || !DATE_RE.test(birth.date)) push("birth.date", "date must be YYYY-MM-DD");
  if (!birth.time || !TIME_RE.test(birth.time)) push("birth.time", "time must be HH:mm");
  if (!birth.place || typeof birth.place !== "string" || birth.place.trim().length === 0) {
    push("birth.place", "place must be a non-empty string");
  }
  if (
    typeof birth.latitude !== "number" ||
    !Number.isFinite(birth.latitude) ||
    birth.latitude < -90 ||
    birth.latitude > 90
  )
    push("birth.latitude", "latitude must be a finite number in [-90, 90]");
  if (
    typeof birth.longitude !== "number" ||
    !Number.isFinite(birth.longitude) ||
    birth.longitude < -180 ||
    birth.longitude > 180
  )
    push("birth.longitude", "longitude must be a finite number in [-180, 180]");
  if (birth.timezone === undefined || birth.timezone === null) {
    push("birth.timezone", "timezone required");
  } else if (typeof birth.timezone === "number") {
    if (!Number.isFinite(birth.timezone) || birth.timezone < -14 || birth.timezone > 14) {
      push("birth.timezone", "numeric timezone must be in [-14, 14]");
    }
  } else if (typeof birth.timezone !== "string" || birth.timezone.length === 0) {
    push("birth.timezone", "timezone must be a string or hour offset");
  }

  if (input.currentDate !== undefined && !DATE_RE.test(input.currentDate)) {
    push("currentDate", "currentDate must be YYYY-MM-DD");
  }

  if (input.system !== undefined) {
    if (!ALL_SYSTEM_KEYS.includes(input.system)) {
      push("system", `unknown system: ${input.system}`);
    } else if (!IMPLEMENTED_SYSTEMS.includes(input.system)) {
      push("system", `system not implemented yet: ${input.system}`);
    }
  }

  const lang = input.language ?? birth.language;
  if (lang !== undefined && !(SUPPORTED_LANGUAGES as readonly string[]).includes(lang)) {
    push("language", `unsupported language: ${lang}`);
  }

  return { ok: errors.length === 0, errors };
}
