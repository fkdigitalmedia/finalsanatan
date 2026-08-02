// ============================================================
// Sade Sati & Dhaiya Engine — Validators
// ============================================================

import { SUPPORTED_LANGUAGES } from "@/lib/horoscope/constants";
import type { SadeSatiInput, SadeSatiValidationResult } from "./types";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;

export function validateSadeSatiInput(input: SadeSatiInput): SadeSatiValidationResult {
  const errors: SadeSatiValidationResult["errors"] = [];
  const push = (field: string, message: string) => errors.push({ field, message });

  if (!input || typeof input !== "object") {
    return { ok: false, errors: [{ field: "input", message: "input required" }] };
  }
  const b = input.birth;
  if (!b || typeof b !== "object") {
    return { ok: false, errors: [{ field: "birth", message: "birth object required" }] };
  }
  if (!b.date || !DATE_RE.test(b.date)) push("birth.date", "date must be YYYY-MM-DD");
  if (!b.time || !TIME_RE.test(b.time)) push("birth.time", "time must be HH:mm");
  if (typeof b.place !== "string" || b.place.trim().length === 0) {
    push("birth.place", "place must be a non-empty string");
  }
  if (
    typeof b.latitude !== "number" ||
    !Number.isFinite(b.latitude) ||
    b.latitude < -90 ||
    b.latitude > 90
  ) {
    push("birth.latitude", "latitude must be a finite number in [-90, 90]");
  }
  if (
    typeof b.longitude !== "number" ||
    !Number.isFinite(b.longitude) ||
    b.longitude < -180 ||
    b.longitude > 180
  ) {
    push("birth.longitude", "longitude must be a finite number in [-180, 180]");
  }
  if (b.timezone === undefined || b.timezone === null) {
    push("birth.timezone", "timezone required");
  } else if (typeof b.timezone === "number") {
    if (!Number.isFinite(b.timezone) || b.timezone < -14 || b.timezone > 14) {
      push("birth.timezone", "numeric timezone must be in [-14, 14]");
    }
  } else if (typeof b.timezone !== "string" || b.timezone.length === 0) {
    push("birth.timezone", "timezone must be a string or hour offset");
  }

  if (input.currentDate !== undefined && !DATE_RE.test(input.currentDate)) {
    push("currentDate", "currentDate must be YYYY-MM-DD");
  }
  const lang = input.language ?? b.language;
  if (lang !== undefined && !(SUPPORTED_LANGUAGES as readonly string[]).includes(lang)) {
    push("language", `unsupported language: ${lang}`);
  }
  if (input.windowYears !== undefined) {
    if (!Number.isFinite(input.windowYears) || input.windowYears < 10 || input.windowYears > 120) {
      push("windowYears", "windowYears must be a finite number in [10, 120]");
    }
  }
  return { ok: errors.length === 0, errors };
}
