// ============================================================
// Phase 14.7 — SEO quality checker.
// Scores a page 0–100 across title, description, headings, images,
// links, keyword usage, readability, schema and content depth.
// Powers the SEO Audit tab in the admin panel.
// ============================================================

import {
  TITLE_MIN,
  TITLE_MAX,
  DESCRIPTION_MIN,
  DESCRIPTION_MAX,
  MIN_WORD_COUNT,
} from "./constants";
import { validateSchema, validateMetadata, type ValidationIssue } from "./validator";
import type { Json } from "./schema";

export interface PageSample {
  path: string;
  title?: string;
  description?: string;
  canonical?: string;
  /** Plain text or markdown body of the page. */
  content?: string;
  headings?: { level: number; text: string }[];
  images?: { src: string; alt?: string }[];
  internalLinks?: string[];
  externalLinks?: string[];
  schema?: Json;
  targetKeyword?: string;
}

export interface QualityCheck {
  id: string;
  label: string;
  status: "pass" | "warn" | "fail";
  detail: string;
  /** Weight in the final score. */
  weight: number;
}

export interface QualityReport {
  path: string;
  score: number;
  grade: "A" | "B" | "C" | "D";
  checks: QualityCheck[];
  issues: ValidationIssue[];
}

const words = (text = "") =>
  text
    .replace(/[#*_>`\[\]()]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
const sentences = (text = "") => text.split(/[.!?]+\s/).filter((s) => s.trim().length > 2);
const syllables = (word: string) =>
  Math.max(1, (word.toLowerCase().match(/[aeiouy]+/g) ?? []).length);

/** Flesch reading ease (higher = easier; 60+ is comfortable for the web). */
export function readingEase(text: string): number {
  const w = words(text);
  const s = sentences(text);
  if (!w.length || !s.length) return 0;
  const asl = w.length / s.length;
  const asw = w.reduce((n, x) => n + syllables(x), 0) / w.length;
  return Math.round((206.835 - 1.015 * asl - 84.6 * asw) * 10) / 10;
}

/** Percentage of body words that are the target keyword phrase. */
export function keywordDensity(text: string, keyword?: string): number {
  if (!keyword) return 0;
  const w = words(text.toLowerCase());
  if (!w.length) return 0;
  const k = keyword.toLowerCase().trim();
  const hits = k.includes(" ")
    ? (text.toLowerCase().match(new RegExp(k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) ?? [])
        .length
    : w.filter((x) => x === k).length;
  return Math.round((hits / w.length) * 1000) / 10;
}

export function analyzePage(page: PageSample): QualityReport {
  const checks: QualityCheck[] = [];
  const add = (c: QualityCheck) => checks.push(c);

  // Title
  const title = page.title ?? "";
  add({
    id: "title",
    label: "Title length",
    weight: 12,
    status: !title
      ? "fail"
      : title.length > TITLE_MAX + 10 || title.length < TITLE_MIN
        ? "warn"
        : "pass",
    detail: title
      ? `${title.length} characters (ideal ${TITLE_MIN}–${TITLE_MAX}).`
      : "No title tag.",
  });

  // Description
  const desc = page.description ?? "";
  add({
    id: "description",
    label: "Meta description",
    weight: 12,
    status: !desc
      ? "fail"
      : desc.length > DESCRIPTION_MAX || desc.length < DESCRIPTION_MIN
        ? "warn"
        : "pass",
    detail: desc
      ? `${desc.length} characters (ideal ${DESCRIPTION_MIN}–${DESCRIPTION_MAX}).`
      : "No meta description.",
  });

  // Canonical
  add({
    id: "canonical",
    label: "Canonical URL",
    weight: 8,
    status: page.canonical && /^https?:\/\//.test(page.canonical) ? "pass" : "fail",
    detail: page.canonical ? page.canonical : "Missing or relative canonical.",
  });

  // Headings
  const headings = page.headings ?? [];
  const h1s = headings.filter((h) => h.level === 1);
  add({
    id: "h1",
    label: "Single H1",
    weight: 10,
    status: h1s.length === 1 ? "pass" : h1s.length === 0 ? "fail" : "warn",
    detail: `${h1s.length} H1 heading(s) found.`,
  });

  let skipped = false;
  let prev = 1;
  for (const h of headings.filter((x) => x.level > 1)) {
    if (h.level - prev > 1) skipped = true;
    prev = h.level;
  }
  add({
    id: "heading-structure",
    label: "Heading hierarchy",
    weight: 6,
    status: headings.length < 2 ? "warn" : skipped ? "warn" : "pass",
    detail: skipped
      ? "A heading level is skipped (e.g. H2 → H4)."
      : `${headings.length} headings, correctly nested.`,
  });

  // Images
  const images = page.images ?? [];
  const missingAlt = images.filter((i) => !i.alt?.trim());
  add({
    id: "image-alt",
    label: "Image alt text",
    weight: 8,
    status: !images.length ? "warn" : missingAlt.length ? "fail" : "pass",
    detail: !images.length
      ? "No images on the page."
      : missingAlt.length
        ? `${missingAlt.length} of ${images.length} images have no alt text.`
        : `All ${images.length} images have alt text.`,
  });

  // Links
  const internal = page.internalLinks ?? [];
  add({
    id: "internal-links",
    label: "Internal links",
    weight: 10,
    status: internal.length >= 3 ? "pass" : internal.length ? "warn" : "fail",
    detail: `${internal.length} internal links (aim for 3+).`,
  });
  add({
    id: "external-links",
    label: "External links",
    weight: 4,
    status: (page.externalLinks ?? []).length ? "pass" : "warn",
    detail: `${(page.externalLinks ?? []).length} outbound links.`,
  });

  // Content depth
  const wordCount = words(page.content ?? "").length;
  add({
    id: "content-depth",
    label: "Content depth",
    weight: 12,
    status:
      wordCount >= MIN_WORD_COUNT ? "pass" : wordCount >= MIN_WORD_COUNT / 2 ? "warn" : "fail",
    detail: `${wordCount} words (thin below ${MIN_WORD_COUNT}).`,
  });

  // Keyword usage
  const density = keywordDensity(page.content ?? "", page.targetKeyword);
  add({
    id: "keyword",
    label: "Keyword usage",
    weight: 8,
    status: !page.targetKeyword ? "warn" : density >= 0.5 && density <= 2.5 ? "pass" : "warn",
    detail: page.targetKeyword
      ? `"${page.targetKeyword}" density ${density}% (ideal 0.5–2.5%).`
      : "No target keyword set for this page.",
  });

  // Readability
  const ease = readingEase(page.content ?? "");
  add({
    id: "readability",
    label: "Readability",
    weight: 5,
    status: ease >= 55 ? "pass" : ease >= 35 ? "warn" : "fail",
    detail: `Flesch reading ease ${ease} (60+ reads easily).`,
  });

  // Schema
  const schemaIssues = page.schema ? validateSchema(page.schema) : [];
  add({
    id: "schema",
    label: "Structured data",
    weight: 5,
    status: !page.schema
      ? "fail"
      : schemaIssues.some((i) => i.level === "error")
        ? "fail"
        : schemaIssues.length
          ? "warn"
          : "pass",
    detail: !page.schema
      ? "No JSON-LD on the page."
      : schemaIssues.length
        ? `${schemaIssues.length} schema issue(s).`
        : "Valid JSON-LD.",
  });

  const totalWeight = checks.reduce((n, c) => n + c.weight, 0);
  const earned = checks.reduce(
    (n, c) => n + c.weight * (c.status === "pass" ? 1 : c.status === "warn" ? 0.5 : 0),
    0,
  );
  const score = Math.round((earned / totalWeight) * 100);

  return {
    path: page.path,
    score,
    grade: score >= 85 ? "A" : score >= 70 ? "B" : score >= 50 ? "C" : "D",
    checks,
    issues: [
      ...validateMetadata({
        title: page.title,
        description: page.description,
        canonical: page.canonical,
      }),
      ...schemaIssues,
    ],
  };
}

/** Roll several page reports into one site-level summary. */
export function auditSummary(reports: QualityReport[]) {
  if (!reports.length) return { pages: 0, average: 0, failing: 0, worst: [] as QualityReport[] };
  const average = Math.round(reports.reduce((n, r) => n + r.score, 0) / reports.length);
  return {
    pages: reports.length,
    average,
    failing: reports.filter((r) => r.score < 70).length,
    worst: [...reports].sort((a, b) => a.score - b.score).slice(0, 10),
  };
}
