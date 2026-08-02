// ============================================================
// AI Interpretation Engine — Markdown formatter
// ------------------------------------------------------------
// Providers return "mostly Markdown". This module makes it
// clean, predictable and safe before it reaches the UI or PDF.
// ============================================================

import { buildFooter } from "./templates";
import type { InterpretationLanguage, InterpretationSection } from "./types";

/** Strip a wrapping ```markdown fence if the model added one. */
export function stripCodeFence(text: string): string {
  const trimmed = text.trim();
  const match = trimmed.match(/^```(?:markdown|md)?\s*\n([\s\S]*?)\n?```$/);
  return match ? match[1].trim() : trimmed;
}

/** Remove chat filler the model sometimes prepends. */
export function stripPreamble(text: string): string {
  return text.replace(/^(sure|certainly|of course|here(?:'s| is)[^\n]*|okay)[^\n]*\n+/i, "");
}

/** Normalise whitespace, heading spacing and bullet characters. */
export function normalizeMarkdown(text: string): string {
  let out = stripPreamble(stripCodeFence(text));
  out = out.replace(/\r\n/g, "\n");
  out = out.replace(/[ \t]+$/gm, "");
  out = out.replace(/^\s*[•·▪]\s+/gm, "- ");
  out = out.replace(/^(#{1,6})([^#\s])/gm, "$1 $2");
  out = out.replace(/\n(#{1,6} )/g, "\n\n$1");
  out = out.replace(/\n{3,}/g, "\n\n");
  return out.trim();
}

/** Guarantee a single H1 at the top. */
export function ensureTitle(markdown: string, title: string): string {
  if (/^#\s+\S/.test(markdown)) return markdown;
  return `# ${title}\n\n${markdown}`;
}

/** Split Markdown into H2 sections (content before the first H2 is "Overview"). */
export function extractSections(markdown: string): InterpretationSection[] {
  const lines = markdown.split("\n");
  const sections: InterpretationSection[] = [];
  let heading: string | null = null;
  let buffer: string[] = [];

  const flush = () => {
    const body = buffer.join("\n").trim();
    if (heading !== null || body) {
      sections.push({ heading: heading ?? "Overview", body });
    }
    buffer = [];
  };

  for (const line of lines) {
    const h2 = line.match(/^##\s+(.*)$/);
    if (h2) {
      flush();
      heading = h2[1].trim();
      continue;
    }
    if (/^#\s+/.test(line) && heading === null && !buffer.join("").trim()) continue;
    buffer.push(line);
  }
  flush();
  return sections.filter((s) => s.heading !== "Overview" || s.body.length > 0);
}

export function wordCount(markdown: string): number {
  return markdown
    .replace(/[#*_>`-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

export interface FormatOptions {
  title: string;
  language: InterpretationLanguage;
  lowConfidence: boolean;
}

/** Full pipeline: normalise → title → footer. */
export function formatReport(
  raw: string,
  opts: FormatOptions,
): {
  markdown: string;
  sections: InterpretationSection[];
  wordCount: number;
} {
  let markdown = ensureTitle(normalizeMarkdown(raw), opts.title);
  const footer = buildFooter(opts.language, opts.lowConfidence);
  if (!markdown.includes(footer)) markdown = `${markdown}\n\n---\n\n${footer}`;
  return {
    markdown,
    sections: extractSections(markdown),
    wordCount: wordCount(markdown),
  };
}
