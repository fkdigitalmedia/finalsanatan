// ============================================================
// Universal PDF Report Engine — Validators
// ============================================================

import { MAX_DATA_BYTES, MAX_SECTIONS, PAPER_SIZES } from "./constants";
import type { PdfTemplate, ValidationIssue, ValidationResult } from "./types";

function ok(issues: ValidationIssue[]): ValidationResult {
  return { valid: issues.length === 0, issues };
}

export function validateTemplate(template: unknown): ValidationResult {
  const issues: ValidationIssue[] = [];
  const t = template as PdfTemplate;

  if (!t || typeof t !== "object") {
    return ok([{ path: "template", message: "Template must be an object." }]);
  }
  if (!t.report || typeof t.report !== "string") {
    issues.push({ path: "report", message: "report is required." });
  }
  if (!t.name || typeof t.name !== "string") {
    issues.push({ path: "name", message: "name is required." });
  }
  if (t.status && !["draft", "published", "archived"].includes(t.status)) {
    issues.push({ path: "status", message: `Unknown status "${t.status}".` });
  }

  const paper = t.paper;
  if (!paper) {
    issues.push({ path: "paper", message: "paper config is required." });
  } else {
    if (paper.size !== "custom" && !PAPER_SIZES[paper.size]) {
      issues.push({ path: "paper.size", message: `Unsupported paper size "${paper.size}".` });
    }
    if (paper.size === "custom" && (!paper.width || !paper.height)) {
      issues.push({ path: "paper", message: "Custom paper needs width and height in mm." });
    }
    if (paper.orientation !== "portrait" && paper.orientation !== "landscape") {
      issues.push({
        path: "paper.orientation",
        message: "orientation must be portrait or landscape.",
      });
    }
    const m = paper.margins;
    if (!m) issues.push({ path: "paper.margins", message: "margins are required." });
    else {
      for (const side of ["top", "right", "bottom", "left"] as const) {
        const v = m[side];
        if (typeof v !== "number" || v < 0 || v > 60) {
          issues.push({ path: `paper.margins.${side}`, message: "Margin must be 0-60 mm." });
        }
      }
    }
  }

  if (!Array.isArray(t.sections)) {
    issues.push({ path: "sections", message: "sections must be an array." });
  } else {
    if (t.sections.length === 0) {
      issues.push({ path: "sections", message: "Template needs at least one section." });
    }
    if (t.sections.length > MAX_SECTIONS) {
      issues.push({ path: "sections", message: `Too many sections (max ${MAX_SECTIONS}).` });
    }
    const seen = new Set<string>();
    t.sections.forEach((s, i) => {
      if (!s || typeof s !== "object") {
        issues.push({ path: `sections[${i}]`, message: "Section must be an object." });
        return;
      }
      if (!s.type) issues.push({ path: `sections[${i}].type`, message: "type is required." });
      if (s.id) {
        if (seen.has(s.id)) {
          issues.push({ path: `sections[${i}].id`, message: `Duplicate section id "${s.id}".` });
        }
        seen.add(s.id);
      }
    });
  }

  if (t.watermark?.enabled) {
    const o = t.watermark.opacity;
    if (typeof o !== "number" || o < 0 || o > 1) {
      issues.push({ path: "watermark.opacity", message: "opacity must be between 0 and 1." });
    }
  }

  return ok(issues);
}

export function assertValidTemplate(template: unknown): asserts template is PdfTemplate {
  const result = validateTemplate(template);
  if (!result.valid) {
    throw new Error(
      `Invalid PDF template: ${result.issues.map((i) => `${i.path}: ${i.message}`).join("; ")}`,
    );
  }
}

export function validateData(data: unknown): ValidationResult {
  const issues: ValidationIssue[] = [];
  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    return ok([{ path: "data", message: "data must be a plain object." }]);
  }
  let serialized = "";
  try {
    serialized = JSON.stringify(data);
  } catch {
    return ok([{ path: "data", message: "data must be JSON-serialisable (no cycles)." }]);
  }
  if (serialized.length > MAX_DATA_BYTES) {
    issues.push({ path: "data", message: `data exceeds ${MAX_DATA_BYTES} bytes.` });
  }
  return ok(issues);
}

export function assertValidData(data: unknown): void {
  const result = validateData(data);
  if (!result.valid) {
    throw new Error(`Invalid PDF data context: ${result.issues.map((i) => i.message).join("; ")}`);
  }
}
