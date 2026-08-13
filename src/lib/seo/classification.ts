// ============================================================
// Phase 14.7 — Central SEO Route Classification System
// Enforces consistent classification across metadata, robots,
// sitemap, canonicals and redirect logic.
// ============================================================

export type SeoRouteClassification =
  | "INDEXABLE_PUBLIC"
  | "NOINDEX_PRIVATE"
  | "REDIRECT_PERMANENT"
  | "REDIRECT_TEMPORARY"
  | "ERROR_404"
  | "ERROR_410";

/** Explicit private/user-facing route prefixes that MUST remain noindex */
export const PRIVATE_ROUTE_PREFIXES = [
  "/auth",
  "/reset-password",
  "/dashboard",
  "/bookmarks",
  "/favorites",
  "/history",
  "/notifications",
  "/profile",
  "/settings",
  "/saved-mantras",
  "/my-kundlis",
  "/family",
  "/downloads",
  "/horoscope-history",
  "/billing",
  "/reports",
  "/admin",
  "/api",
  "/search",
  "/lovable",
];

/** Permanent legacy or alias path mappings (301/308) */
export const KNOWN_PERMANENT_REDIRECTS: Record<string, string> = {
  "/legal/terms-conditions": "/legal/terms-and-conditions",
  "/tools/kundli-generator": "/kundli",
  "/articles": "/blog",
};

/** Intentionally deprecated/removed URLs returning 410 (Gone) */
export const GONE_URLS = new Set<string>([
  "/articles/deprecated-astrology-widget-v1",
  "/blog/old-test-post-2024",
]);

/**
 * Classifies any given URL path into its canonical SEO status.
 */
export function classifyRoute(path: string): SeoRouteClassification {
  const cleanPath = `/${path.replace(/^\/+|\/+$/g, "")}`.toLowerCase();
  const base = cleanPath.split("?")[0];

  // 1. Permanent redirect mapping
  if (KNOWN_PERMANENT_REDIRECTS[base]) {
    return "REDIRECT_PERMANENT";
  }

  // 2. Explicit 410 Gone
  if (GONE_URLS.has(base)) {
    return "ERROR_410";
  }

  // 3. Private / user-facing routes -> NOINDEX_PRIVATE
  for (const prefix of PRIVATE_ROUTE_PREFIXES) {
    if (base === prefix || base.startsWith(`${prefix}/`)) {
      return "NOINDEX_PRIVATE";
    }
  }

  // 4. Public SEO Pages
  return "INDEXABLE_PUBLIC";
}

/**
 * Returns the robots meta string for a route classification.
 */
export function getRobotsDirective(path: string): string {
  const classification = classifyRoute(path);
  if (classification === "NOINDEX_PRIVATE" || classification === "ERROR_404" || classification === "ERROR_410") {
    return "noindex, nofollow";
  }
  return "index, follow";
}

/**
 * Determines whether a URL is eligible for inclusion in the sitemap.
 */
export function isSitemapEligible(path: string): boolean {
  return classifyRoute(path) === "INDEXABLE_PUBLIC";
}
