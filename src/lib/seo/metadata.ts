// ============================================================
// Phase 14.7 — Metadata engine.
// Turns a page descriptor into title / description / keywords / robots,
// applying length discipline so nothing is truncated in the SERP.
// ============================================================

import {
  SITE_NAME,
  SITE_DESCRIPTION,
  TITLE_MAX,
  DESCRIPTION_MAX,
  MAX_KEYWORDS,
  NOINDEX_PREFIXES,
  PAGE_TYPE_DEFAULTS,
  type PageType,
} from "./constants";
import { normalizePath } from "./canonical";

export interface MetadataInput {
  type: PageType;
  path: string;
  title: string;
  description?: string;
  keywords?: string[];
  /** Skip the " — SanatanTools" suffix (used by the homepage). */
  bareTitle?: boolean;
  noindex?: boolean;
  nofollow?: boolean;
}

export interface Metadata {
  title: string;
  description: string;
  keywords: string[];
  robots: string;
  indexable: boolean;
}

/** Collapse whitespace and clamp to `max` chars on a word boundary, with an ellipsis. */
export function clamp(text: string, max: number): string {
  const clean = String(text ?? "")
    .replace(/\s+/g, " ")
    .trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const at = cut.lastIndexOf(" ");
  return `${(at > max * 0.6 ? cut.slice(0, at) : cut).replace(/[,;:.\-\s]+$/, "")}…`;
}

/** Brand-suffixed title that still fits inside Google's pixel budget. */
export function buildTitle(title: string, bare = false): string {
  const clean =
    String(title ?? "")
      .replace(/\s+/g, " ")
      .trim() || SITE_NAME;
  if (bare || clean.toLowerCase().includes(SITE_NAME.toLowerCase()))
    return clamp(clean, TITLE_MAX + 10);
  const suffix = ` — ${SITE_NAME}`;
  return `${clamp(clean, TITLE_MAX - suffix.length)}${suffix}`;
}

/** Derive keywords from the title when none were supplied. */
export function buildKeywords(input: MetadataInput): string[] {
  const explicit = (input.keywords ?? []).map((k) => k.trim().toLowerCase()).filter(Boolean);
  const derived = input.title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3);
  return [...new Set([...explicit, ...derived])].slice(0, MAX_KEYWORDS);
}

/** True when a path may never be indexed regardless of the descriptor. */
export function isBlockedPath(path: string): boolean {
  const p = normalizePath(path);
  return NOINDEX_PREFIXES.some((prefix) => p === prefix || p.startsWith(`${prefix}/`));
}

export function buildRobots(input: MetadataInput): { robots: string; indexable: boolean } {
  const typeDefault = PAGE_TYPE_DEFAULTS[input.type]?.indexable ?? true;
  const indexable = !input.noindex && typeDefault && !isBlockedPath(input.path);
  const parts = [indexable ? "index" : "noindex", input.nofollow ? "nofollow" : "follow"];
  if (indexable) parts.push("max-image-preview:large", "max-snippet:-1", "max-video-preview:-1");
  return { robots: parts.join(", "), indexable };
}

export function buildMetadata(input: MetadataInput): Metadata {
  const { robots, indexable } = buildRobots(input);
  return {
    title: buildTitle(input.title, input.bareTitle),
    description: clamp(input.description || SITE_DESCRIPTION, DESCRIPTION_MAX),
    keywords: buildKeywords(input),
    robots,
    indexable,
  };
}
