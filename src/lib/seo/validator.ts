// ============================================================
// Phase 14.7 — Schema & metadata validator.
// Catches the mistakes Google Search Console reports days later:
// missing required schema properties, relative URLs, malformed dates,
// duplicate canonicals, over-long tags.
// ============================================================

import { TITLE_MAX, DESCRIPTION_MAX, TITLE_MIN, DESCRIPTION_MIN } from "./constants";
import type { Json } from "./schema";

export interface ValidationIssue {
  level: "error" | "warning";
  field: string;
  message: string;
}

/** Required properties per schema.org type that Google enforces for rich results. */
const REQUIRED: Record<string, string[]> = {
  Article: ["headline", "author"],
  BlogPosting: ["headline", "author"],
  Product: ["name", "offers"],
  Offer: ["price", "priceCurrency"],
  Event: ["name", "startDate", "location"],
  FAQPage: ["mainEntity"],
  HowTo: ["name", "step"],
  BreadcrumbList: ["itemListElement"],
  Person: ["name"],
  Organization: ["name", "url"],
  WebSite: ["name", "url"],
  Review: ["itemReviewed", "reviewRating", "author"],
  AggregateRating: ["ratingValue", "reviewCount"],
  SoftwareApplication: ["name", "applicationCategory"],
  ItemList: ["itemListElement"],
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}(T[\d:.+\-Z]+)?$/;

function nodesOf(payload: Json): Json[] {
  const graphNodes = (payload as { "@graph"?: Json[] })["@graph"];
  return Array.isArray(graphNodes) ? graphNodes : [payload];
}

/** Validate a JSON-LD payload (single node or @graph). */
export function validateSchema(payload: Json): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const nodes = nodesOf(payload);

  if (!nodes.length) {
    issues.push({ level: "error", field: "@graph", message: "Schema payload is empty." });
    return issues;
  }

  nodes.forEach((node, i) => {
    const type = String((node as Record<string, unknown>)["@type"] ?? "");
    const where = `${type || "node"}[${i}]`;

    if (!type) {
      issues.push({ level: "error", field: where, message: "Node has no @type." });
      return;
    }

    for (const key of REQUIRED[type] ?? []) {
      const value = (node as Record<string, unknown>)[key];
      if (value === undefined || value === null || value === "") {
        issues.push({
          level: "error",
          field: `${where}.${key}`,
          message: `Missing required property "${key}".`,
        });
      }
    }

    for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
      if (typeof value !== "string") continue;
      if (
        (key === "url" || key === "image" || key === "mainEntityOfPage") &&
        value.startsWith("/")
      ) {
        issues.push({ level: "error", field: `${where}.${key}`, message: "URL must be absolute." });
      }
      if (/^date(Published|Modified)$|^(start|end)Date$/.test(key) && !ISO_DATE.test(value)) {
        issues.push({
          level: "warning",
          field: `${where}.${key}`,
          message: `"${value}" is not an ISO 8601 date.`,
        });
      }
    }
  });

  return issues;
}

export interface MetaLike {
  title?: string;
  description?: string;
  canonical?: string;
  robots?: string;
}

export function validateMetadata(meta: MetaLike): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const title = meta.title ?? "";
  const description = meta.description ?? "";

  if (!title) issues.push({ level: "error", field: "title", message: "Title is missing." });
  else if (title.length > TITLE_MAX + 10)
    issues.push({
      level: "warning",
      field: "title",
      message: `Title is ${title.length} chars — likely truncated.`,
    });
  else if (title.length < TITLE_MIN)
    issues.push({
      level: "warning",
      field: "title",
      message: `Title is only ${title.length} chars.`,
    });

  if (!description)
    issues.push({ level: "error", field: "description", message: "Meta description is missing." });
  else if (description.length > DESCRIPTION_MAX)
    issues.push({
      level: "warning",
      field: "description",
      message: `Description is ${description.length} chars.`,
    });
  else if (description.length < DESCRIPTION_MIN)
    issues.push({
      level: "warning",
      field: "description",
      message: `Description is only ${description.length} chars.`,
    });

  if (!meta.canonical)
    issues.push({ level: "error", field: "canonical", message: "Canonical URL is missing." });
  else if (!/^https?:\/\//.test(meta.canonical))
    issues.push({ level: "error", field: "canonical", message: "Canonical must be absolute." });

  return issues;
}

/** Find pages sharing a title, description or canonical. */
export function findDuplicates(
  pages: { path: string; title?: string; description?: string; canonical?: string }[],
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const check = (field: "title" | "description" | "canonical") => {
    const seen = new Map<string, string[]>();
    for (const p of pages) {
      const v = (p[field] ?? "").trim().toLowerCase();
      if (!v) continue;
      seen.set(v, [...(seen.get(v) ?? []), p.path]);
    }
    for (const [value, paths] of seen) {
      if (paths.length > 1) {
        issues.push({
          level: field === "canonical" ? "error" : "warning",
          field,
          message: `Duplicate ${field} on ${paths.length} pages (${paths.slice(0, 3).join(", ")}${paths.length > 3 ? "…" : ""}): "${value.slice(0, 60)}"`,
        });
      }
    }
  };
  check("title");
  check("description");
  check("canonical");
  return issues;
}

export function summarize(issues: ValidationIssue[]) {
  return {
    errors: issues.filter((i) => i.level === "error").length,
    warnings: issues.filter((i) => i.level === "warning").length,
    valid: issues.every((i) => i.level !== "error"),
  };
}
