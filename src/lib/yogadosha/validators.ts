// ============================================================
// Dosha & Yoga Detection Engine — Validators
// ============================================================

import { SUPPORTED_LANGUAGES } from "@/lib/horoscope/constants";
import type { YogaDoshaInput, YogaDoshaValidationResult } from "./types";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;

export function validateYogaDoshaInput(
  input: YogaDoshaInput,
  knownRuleIds: readonly string[] = [],
): YogaDoshaValidationResult {
  const errors: YogaDoshaValidationResult["errors"] = [];
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

  const lang = input.language ?? b.language;
  if (lang !== undefined && !(SUPPORTED_LANGUAGES as readonly string[]).includes(lang)) {
    push("language", `unsupported language: ${lang}`);
  }
  if (input.rules !== undefined) {
    if (!Array.isArray(input.rules) || input.rules.length === 0) {
      push("rules", "rules must be a non-empty array of rule ids");
    } else {
      for (const id of input.rules) {
        if (!knownRuleIds.includes(id)) push("rules", `unknown rule id: ${id}`);
      }
    }
  }
  return { ok: errors.length === 0, errors };
}

/** Structural sanity check for a rule's own output (defensive). */
export function validateRuleOutcome(
  id: string,
  outcome: unknown,
): { ok: boolean; errors: Array<{ field: string; message: string }> } {
  const errors: Array<{ field: string; message: string }> = [];
  const o = outcome as Record<string, unknown> | null;
  if (!o || typeof o !== "object") {
    return { ok: false, errors: [{ field: id, message: "rule returned no outcome" }] };
  }
  if (typeof o.detected !== "boolean")
    errors.push({ field: `${id}.detected`, message: "must be boolean" });
  if (
    typeof o.confidence !== "number" ||
    !Number.isFinite(o.confidence) ||
    o.confidence < 0 ||
    o.confidence > 100
  ) {
    errors.push({ field: `${id}.confidence`, message: "must be a finite number in [0, 100]" });
  }
  if (typeof o.ruleApplied !== "string" || o.ruleApplied.length === 0) {
    errors.push({ field: `${id}.ruleApplied`, message: "must be a non-empty string" });
  }
  if (!Array.isArray(o.planetCombination)) {
    errors.push({ field: `${id}.planetCombination`, message: "must be an array" });
  }
  if (!Array.isArray(o.affectedHouses)) {
    errors.push({ field: `${id}.affectedHouses`, message: "must be an array" });
  } else if (
    (o.affectedHouses as unknown[]).some((h) => typeof h !== "number" || h < 1 || h > 12)
  ) {
    errors.push({ field: `${id}.affectedHouses`, message: "houses must be 1..12" });
  }
  return { ok: errors.length === 0, errors };
}
