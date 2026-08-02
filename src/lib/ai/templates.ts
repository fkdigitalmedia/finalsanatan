// ============================================================
// AI Interpretation Engine — Markdown templates
// ------------------------------------------------------------
// Section skeletons per report + depth. Templates describe the
// SHAPE of the output; prompts.ts describes the BEHAVIOUR.
// ============================================================

import { DEPTH_STYLE, DISCLAIMERS, LOW_CONFIDENCE_NOTE } from "./constants";
import type { InterpretationLanguage, PromptTemplate, ReportDepth } from "./types";

/**
 * Depth-aware section list. "summary" collapses to the first two
 * sections, beginner/detailed use the full list, professional adds
 * a technical appendix.
 */
export function sectionsForDepth(template: PromptTemplate, depth: ReportDepth): string[] {
  const all = template.sections;
  if (depth === "summary") return all.slice(0, Math.min(2, all.length));
  if (depth === "professional") return [...all, "Technical Notes"];
  return all;
}

/** The Markdown skeleton the model must fill in. */
export function buildSkeleton(template: PromptTemplate, depth: ReportDepth): string {
  const heading = `# ${template.label}`;
  const body = sectionsForDepth(template, depth)
    .map((s) => `## ${s}\n<content>`)
    .join("\n\n");
  return `${heading}\n\n${body}`;
}

/** Style + length guidance for a given depth. */
export function styleFor(template: PromptTemplate, depth: ReportDepth): string {
  const budget = template.wordBudget?.[depth];
  const base = DEPTH_STYLE[depth];
  return budget ? `${base} Target about ${budget} words.` : base;
}

/** Footer: optional low-confidence caveat + localized disclaimer. */
export function buildFooter(language: InterpretationLanguage, lowConfidence: boolean): string {
  const parts: string[] = [];
  if (lowConfidence) parts.push(LOW_CONFIDENCE_NOTE);
  parts.push(DISCLAIMERS[language] ?? DISCLAIMERS.en);
  return parts.join("\n\n");
}
