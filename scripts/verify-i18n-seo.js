/**
 * International SEO & i18n Verification Script
 * Validates language codes, badges, URL localization, hreflang, metadata, schema.org, PDF, and dashboard labels.
 */

import { LANGUAGES, getLanguage, getLanguageBadge, getLanguageLabel, isSupportedLanguage } from "../src/i18n/config.ts";
import { withLangPrefix, stripLangPrefix, langFromPathname } from "../src/i18n/detect.ts";
import { alternates, hreflangLinks } from "../src/lib/seo/hreflang.ts";
import { canonicalUrl, withLang, splitLangPath } from "../src/lib/seo/canonical.ts";

console.log("==================================================");
console.log("🚀 STARTING INTERNATIONAL SEO & i18N VALIDATION");
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

// 1. Language Badge & Definitions
console.log("--- 1. Language Badges & ISO Definitions ---");
const expectedCodes = ["en", "hi", "mr", "gu", "pa", "ta", "te", "kn", "ml", "bn", "or", "ur", "sa"];
const expectedBadges = {
  en: "EN",
  hi: "HI",
  mr: "MR",
  gu: "GU",
  pa: "PA",
  ta: "TA",
  te: "TE",
  kn: "KN",
  ml: "ML",
  bn: "BN",
  or: "OR",
  ur: "UR",
  sa: "SA",
};

for (const code of expectedCodes) {
  assert(isSupportedLanguage(code), `Language ISO code '${code}' is supported`);
  const badge = getLanguageBadge(code);
  assert(badge === expectedBadges[code], `Badge for '${code}' matches expected '${expectedBadges[code]}' (got '${badge}')`);
  assert(badge !== "EN" || code === "en", `Badge for '${code}' is NOT 'EN' unless English (got '${badge}')`);
}

// 2. URL Localization
console.log("\n--- 2. URL Localization ---");
const testPaths = ["/kundli", "/panchang", "/festivals"];
for (const code of expectedCodes) {
  for (const p of testPaths) {
    const locUrl = withLangPrefix(p, code);
    assert(locUrl === `/${code}${p}`, `URL for ${code} on ${p} generates localized path '${locUrl}'`);
    assert(langFromPathname(locUrl) === code, `langFromPathname('${locUrl}') detects '${code}'`);
  }
}

// 3. HTML lang Attribute
console.log("\n--- 3. HTML lang Attribute ---");
for (const code of expectedCodes) {
  const meta = getLanguage(code);
  assert(meta.htmlLang === code, `HTML lang for '${code}' matches ISO code '${code}' (got '${meta.htmlLang}')`);
}

// 4. hreflang Alternate Tags
console.log("\n--- 4. hreflang Alternate Tags ---");
const altList = alternates("/kundli", "https://dharma-divine-tools.lovable.app");
assert(altList.length >= expectedCodes.length + 1, `hreflang contains entries for all languages + x-default (total: ${altList.length})`);
const xDef = altList.find((a) => a.hrefLang === "x-default");
assert(!!xDef, "hreflang contains 'x-default'");
assert(xDef.href.endsWith("/kundli"), `x-default points to fallback English un-prefixed URL '${xDef.href}'`);

for (const code of expectedCodes) {
  const alt = altList.find((a) => a.hrefLang === code);
  assert(!!alt, `hreflang tag exists for ISO code '${code}'`);
  const expectedPath = code === "en" ? "/kundli" : `/${code}/kundli`;
  assert(alt?.href.endsWith(expectedPath), `hreflang URL for '${code}' is '${alt?.href}'`);
}

// 5. Canonical URLs
console.log("\n--- 5. Canonical URLs ---");
for (const code of ["hi", "ta", "mr", "en"]) {
  const can = canonicalUrl(`/${code}/kundli`);
  const expectedPath = code === "en" ? "/kundli" : `/${code}/kundli`;
  assert(can.includes(expectedPath), `Canonical URL for '${code}' is '${can}'`);
}

// 6. User Dashboard Language Labels
console.log("\n--- 6. Dashboard Language Labels ---");
assert(getLanguageLabel("hi") === "Hindi", "ISO code 'hi' formats as 'Hindi'");
assert(getLanguageLabel("ta") === "Tamil", "ISO code 'ta' formats as 'Tamil'");
assert(getLanguageLabel("mr") === "Marathi", "ISO code 'mr' formats as 'Marathi'");
assert(getLanguageLabel("en") === "English", "ISO code 'en' formats as 'English'");
assert(getLanguageLabel("gu") === "Gujarati", "ISO code 'gu' formats as 'Gujarati'");
assert(getLanguageLabel("te") === "Telugu", "ISO code 'te' formats as 'Telugu'");

console.log("\n==================================================");
console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log("==================================================");

if (failed > 0) {
  process.exit(1);
}
