/**
 * Verification Script for Career & Business Report Access & PDF Generation
 */

import { generateKundli } from "../src/lib/kundli/engine.ts";
import { generateCareerPDF, downloadCareerPdf } from "../src/lib/pdf/report-generators.ts";

async function runCareerReportAudit() {
  console.log("==================================================");
  console.log("🚀 STARTING AUDIT FOR CAREER & BUSINESS REPORT ACCESS");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`✔ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
      failed++;
    }
  }

  // 1. Generate Birth Chart Data
  const kundli = generateKundli({
    date: "1995-08-15",
    time: "12:00",
    place: "New Delhi, India",
    latitude: 28.6139,
    longitude: 77.209,
    timezone: 5.5,
  });

  // 2. Audit Career PDF Generation
  console.log("\n--- 1. Career & Business PDF Generator Audit ---");
  const pdfRes = await generateCareerPDF(kundli as unknown as Record<string, unknown>, { language: "en" });
  assert(!!pdfRes && typeof pdfRes.dataUrl === "string", "generateCareerPDF generates valid RenderResult");
  assert(typeof downloadCareerPdf === "function", "downloadCareerPdf helper active");

  const pageCount = pdfRes.pages;
  console.log(`Career Report PDF Total Pages: ${pageCount}`);
  assert(pageCount >= 3, "Career PDF contains detailed multi-page report output");

  console.log("\n==================================================");
  console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) process.exit(1);
}

runCareerReportAudit().catch((err) => {
  console.error(err);
  process.exit(1);
});
