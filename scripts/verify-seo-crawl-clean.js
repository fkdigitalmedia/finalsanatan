/**
 * Technical SEO Crawl Cleanup — Complete Verification Script
 * Validates route classification, 307 elimination, canonical URLs,
 * sitemap eligibility, host canonicalization, 404/410 handling, and noindex policies.
 */

import fs from "node:fs";
import path from "node:path";
import { classifyRoute, getRobotsDirective, isSitemapEligible } from "../src/lib/seo/classification.ts";
import { canonicalUrl, withLang, splitLangPath } from "../src/lib/seo/canonical.ts";
import { alternates } from "../src/lib/seo/hreflang.ts";
import { SITE_URL } from "../src/lib/seo/constants.ts";

console.log("==================================================");
console.log("🚀 SANATANTOOLS — TECHNICAL SEO CLEANUP VERIFICATION");
console.log("==================================================\n");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✔ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`✖ [FAIL] ${message}`);
    failed++;
  }
}

// 1. Central Route Classification System
console.log("--- 1. Central SEO Route Classification ---");
assert(classifyRoute("/tools") === "INDEXABLE_PUBLIC", "/tools is INDEXABLE_PUBLIC");
assert(classifyRoute("/blog/kundli-guide") === "INDEXABLE_PUBLIC", "/blog/kundli-guide is INDEXABLE_PUBLIC");
assert(classifyRoute("/yearly-horoscope/aries") === "INDEXABLE_PUBLIC", "/yearly-horoscope/aries is INDEXABLE_PUBLIC");

assert(classifyRoute("/auth") === "NOINDEX_PRIVATE", "/auth is NOINDEX_PRIVATE");
assert(classifyRoute("/dashboard") === "NOINDEX_PRIVATE", "/dashboard is NOINDEX_PRIVATE");
assert(classifyRoute("/admin/seo") === "NOINDEX_PRIVATE", "/admin/seo is NOINDEX_PRIVATE");
assert(classifyRoute("/api/panchang") === "NOINDEX_PRIVATE", "/api/panchang is NOINDEX_PRIVATE");

assert(classifyRoute("/legal/terms-conditions") === "REDIRECT_PERMANENT", "/legal/terms-conditions is REDIRECT_PERMANENT");
assert(classifyRoute("/tools/kundli-generator") === "REDIRECT_PERMANENT", "/tools/kundli-generator is REDIRECT_PERMANENT");

// 2. Robots Directives
console.log("\n--- 2. Robots Meta Directives ---");
assert(getRobotsDirective("/tools") === "index, follow", "Public route has index, follow directive");
assert(getRobotsDirective("/auth") === "noindex, nofollow", "Private auth route has noindex, nofollow directive");
assert(getRobotsDirective("/dashboard") === "noindex, nofollow", "Private dashboard route has noindex, nofollow directive");
assert(getRobotsDirective("/settings") === "noindex, nofollow", "Private settings route has noindex, nofollow directive");

// 3. Self-Canonical Engine & Default Language URL Normalization
console.log("\n--- 3. Self-Canonical Engine & English Normalization ---");
const toolCan = canonicalUrl("/tools");
assert(toolCan === "https://sanatantools.com/tools", `Canonical for /tools is '${toolCan}' (no /en/ prefix)`);

const ariesCan = canonicalUrl("/yearly-horoscope/aries");
assert(ariesCan === "https://sanatantools.com/yearly-horoscope/aries", `Canonical for /yearly-horoscope/aries is '${ariesCan}'`);

const hiToolCan = canonicalUrl("/hi/tools");
assert(hiToolCan === "https://sanatantools.com/hi/tools", `Canonical for /hi/tools is '${hiToolCan}'`);

const bareLang = withLang("/tools", "en");
assert(bareLang === "/tools", `withLang('/tools', 'en') outputs '${bareLang}' without prefix`);

// 4. Sitemap Eligibility
console.log("\n--- 4. Sitemap Eligibility ---");
assert(isSitemapEligible("/tools") === true, "/tools is sitemap eligible");
assert(isSitemapEligible("/blog/janam-kundli") === true, "/blog/janam-kundli is sitemap eligible");
assert(isSitemapEligible("/auth") === false, "/auth excluded from sitemap");
assert(isSitemapEligible("/dashboard") === false, "/dashboard excluded from sitemap");
assert(isSitemapEligible("/admin") === false, "/admin excluded from sitemap");
assert(isSitemapEligible("/legal/terms-conditions") === false, "Redirecting URL excluded from sitemap");

// 5. Asset Remediation (404 Fixes)
console.log("\n--- 5. Static Asset Verification ---");
const assetPath = path.join(process.cwd(), "public", "blog", "kundli-guide.jpg");
assert(fs.existsSync(assetPath), "public/blog/kundli-guide.jpg exists (HTTP 200 asset)");

// 6. Router & Middleware Configuration Checks
console.log("\n--- 6. Router & Middleware Verification ---");
const routerContent = fs.readFileSync(path.join(process.cwd(), "src", "router.tsx"), "utf8");
assert(routerContent.includes('trailingSlash: "never"'), "router.tsx specifies trailingSlash: 'never'");

const startContent = fs.readFileSync(path.join(process.cwd(), "src", "start.ts"), "utf8");
assert(!startContent.includes("hostCanonicalizationMiddleware"), "start.ts excludes hostCanonicalizationMiddleware to prevent ERR_TOO_MANY_REDIRECTS reverse-proxy loops");

const articlesIndexContent = fs.readFileSync(path.join(process.cwd(), "src", "routes", "articles.index.tsx"), "utf8");
assert(articlesIndexContent.includes("statusCode: 301"), "articles.index.tsx uses statusCode: 301");

const articlesSlugContent = fs.readFileSync(path.join(process.cwd(), "src", "routes", "articles.$slug.tsx"), "utf8");
assert(articlesSlugContent.includes("statusCode: 301"), "articles.$slug.tsx uses statusCode: 301");

const legalSlugContent = fs.readFileSync(path.join(process.cwd(), "src", "routes", "legal.$slug.tsx"), "utf8");
assert(legalSlugContent.includes("terms-conditions"), "legal.$slug.tsx includes terms-conditions 301 redirect");

console.log("\n==================================================");
console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log("==================================================");

if (failed > 0) {
  process.exit(1);
}
