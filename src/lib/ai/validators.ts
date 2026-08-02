// ============================================================
// AI Interpretation Engine — Validators
// ------------------------------------------------------------
// Guards the boundary: only structured, JSON-safe engine output
// may reach a provider. The AI never receives free-form text
// that could be mistaken for a calculation instruction.
// ============================================================

import { MAX_DATA_BYTES, REPORT_DEPTHS, REPORT_KINDS, SUPPORTED_LANGUAGES } from "./constants";
import type {
  InterpretationInput,
  InterpretationLanguage,
  ReportDepth,
  ReportKind,
  ValidationIssue,
  ValidationResult,
} from "./types";

export function isReportKind(value: unknown): value is ReportKind {
  return typeof value === "string" && (REPORT_KINDS as string[]).includes(value);
}

export function isReportDepth(value: unknown): value is ReportDepth {
  return typeof value === "string" && (REPORT_DEPTHS as string[]).includes(value);
}

export function isLanguage(value: unknown): value is InterpretationLanguage {
  return typeof value === "string" && (SUPPORTED_LANGUAGES as string[]).includes(value);
}

/** True when the value tree is plain JSON (no functions, cycles, NaN). */
export function isJsonSafe(value: unknown, seen = new Set<unknown>()): boolean {
  if (value === null) return true;
  const t = typeof value;
  if (t === "string" || t === "boolean") return true;
  if (t === "number") return Number.isFinite(value as number);
  if (t !== "object") return false;
  if (seen.has(value)) return false;
  seen.add(value);
  if (Array.isArray(value)) return value.every((v) => isJsonSafe(v, seen));
  return Object.values(value as Record<string, unknown>).every((v) => isJsonSafe(v, seen));
}

/** Validate an interpretation request without throwing. */
export function validateInput(input: unknown): ValidationResult {
  const issues: ValidationIssue[] = [];
  const push = (path: string, message: string) => issues.push({ path, message });

  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { valid: false, issues: [{ path: "input", message: "Input must be an object." }] };
  }
  const i = input as Partial<InterpretationInput>;

  if (!isReportKind(i.report)) push("report", `Unsupported report kind: ${String(i.report)}`);
  if (i.depth !== undefined && !isReportDepth(i.depth))
    push("depth", `Unsupported depth: ${String(i.depth)}`);
  if (i.language !== undefined && !isLanguage(i.language))
    push("language", `Unsupported language: ${String(i.language)}`);

  if (!i.data || typeof i.data !== "object" || Array.isArray(i.data)) {
    push("data", "Engine data must be a JSON object produced by a calculation engine.");
  } else if (Object.keys(i.data).length === 0) {
    push("data", "Engine data is empty — the AI layer must never calculate anything itself.");
  } else if (!isJsonSafe(i.data)) {
    push("data", "Engine data must be JSON-safe (no functions, cycles, NaN or Infinity).");
  } else {
    const bytes = JSON.stringify(i.data).length;
    if (bytes > MAX_DATA_BYTES) {
      push(
        "data",
        `Engine data is ${bytes} bytes, above the ${MAX_DATA_BYTES} byte limit. Send a trimmed projection.`,
      );
    }
  }

  if (i.confidence !== undefined) {
    if (
      typeof i.confidence !== "number" ||
      !Number.isFinite(i.confidence) ||
      i.confidence < 0 ||
      i.confidence > 100
    ) {
      push("confidence", "Confidence must be a number between 0 and 100.");
    }
  }

  if (i.context !== undefined) {
    if (!i.context || typeof i.context !== "object" || Array.isArray(i.context)) {
      push("context", "Context must be a flat object of strings, numbers or booleans.");
    } else {
      for (const [k, v] of Object.entries(i.context)) {
        if (!["string", "number", "boolean"].includes(typeof v)) {
          push(`context.${k}`, "Context values must be primitives.");
        }
      }
    }
  }

  return { valid: issues.length === 0, issues };
}

/** Throwing variant used by the engine entry point. */
export function assertValidInput(input: unknown): asserts input is InterpretationInput {
  const result = validateInput(input);
  if (!result.valid) {
    throw new Error(
      `Invalid interpretation input:\n- ${result.issues.map((x) => `${x.path}: ${x.message}`).join("\n- ")}`,
    );
  }
}

/** Defensive check on whatever a provider returned. */
export function validateProviderOutput(text: unknown): ValidationResult {
  const issues: ValidationIssue[] = [];
  if (typeof text !== "string") {
    issues.push({ path: "text", message: "Provider returned a non-string response." });
  } else if (text.trim().length < 20) {
    issues.push({
      path: "text",
      message: "Provider response was empty or too short to be a report.",
    });
  }
  return { valid: issues.length === 0, issues };
}
