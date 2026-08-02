// ============================================================
// Phase 14.7 — Breadcrumb engine.
// Derives a trail from any path using the tool/category registries,
// so a new tool or festival gets breadcrumbs with zero extra code.
// ============================================================

import { TOOLS } from "@/config/tools";
import { CATEGORIES } from "@/config/categories";
import { normalizePath, splitLangPath } from "./canonical";
import { SITE_NAME } from "./constants";

export interface Crumb {
  name: string;
  path: string;
}

/** Human label for a path segment when nothing better is known. */
function titleize(segment: string): string {
  return segment
    .split("-")
    .map((w) => (w.length <= 2 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}

const SECTION_LABELS: Record<string, string> = {
  tools: "Tools",
  festivals: "Festivals",
  blog: "Blog",
  legal: "Legal",
  temples: "Temples",
  astrology: "Astrology",
  panchang: "Panchang",
  nakshatra: "Nakshatras",
  yoga: "Yogas",
  dosha: "Doshas",
  muhurat: "Muhurat",
  numerology: "Numerology",
  vastu: "Vastu",
  "daily-horoscope": "Daily Horoscope",
  "weekly-horoscope": "Weekly Horoscope",
  "monthly-horoscope": "Monthly Horoscope",
  "yearly-horoscope": "Yearly Horoscope",
};

/** Best-known label for a full path (registry first, then heuristics). */
export function labelForPath(path: string): string {
  const p = normalizePath(path);
  const segs = p.split("/").filter(Boolean);
  const last = segs[segs.length - 1] ?? "";
  if (!last) return SITE_NAME;

  if (segs[0] === "tools" && segs.length === 2) {
    const tool = TOOLS.find((t) => t.slug === last);
    if (tool) return tool.title;
  }
  const category = CATEGORIES.find((c) => c.slug === last);
  if (category && segs.length === 1) return category.title;

  return SECTION_LABELS[last] ?? titleize(last);
}

/**
 * Build the breadcrumb trail for a path.
 * `overrides` lets a route replace the label of the final crumb (e.g. an
 * article title that is not derivable from the slug).
 */
export function breadcrumbsFor(path: string, overrides: { leaf?: string } = {}): Crumb[] {
  const { path: bare } = splitLangPath(path);
  const segs = bare.split("/").filter(Boolean);
  const crumbs: Crumb[] = [{ name: "Home", path: "/" }];

  let acc = "";
  segs.forEach((seg, i) => {
    acc += `/${seg}`;
    const isLeaf = i === segs.length - 1;
    crumbs.push({
      name: isLeaf && overrides.leaf ? overrides.leaf : (SECTION_LABELS[seg] ?? labelForPath(acc)),
      path: acc,
    });
  });

  return crumbs;
}
