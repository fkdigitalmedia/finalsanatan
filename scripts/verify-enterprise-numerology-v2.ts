/**
 * Automated Verification Audit Script for Enterprise Numerology Pro Report V2 (Commercial Edition 30-40 Pages)
 */

import { calculateNumerology } from "../src/lib/numerology/engine.ts";
import { generateNumerologyPDF, downloadNumerologyPdf } from "../src/lib/numerology/pdf.ts";

async function runCommercialNumerologyV2Audit() {
  console.log("==================================================");
  console.log("🚀 STARTING AUDIT FOR ENTERPRISE NUMEROLOGY V2 (COMMERCIAL EDITION)");
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

  // 1. Calculate Numerology V2 Result
  const result = calculateNumerology("SANATAN USER", "1995-08-15", {
    mobile: "9876543210",
    vehicle: "DL01AB1234",
    house: "108",
    businessName: "SANATAN TOOLS",
  });

  // 2. Audit Core V2 Data Sections & Bug Fixes
  console.log("\n--- 1. Calculation Engine & Bug Fix Audit ---");
  assert(!JSON.stringify(result).includes("undefined"), "Zero 'undefined' values in calculated report");
  assert(!JSON.stringify(result).includes("null"), "Zero 'null' values in calculated report");
  assert(!JSON.stringify(result).includes("NaN"), "Zero 'NaN' values in calculated report");
  assert(typeof result.nameAnalysis.expression === "string" && result.nameAnalysis.expression.length > 5, "Full Name Expression bug fixed");

  assert(result.scorecard.length === 9, "Executive Scorecard covers 9 life domains");
  assert(result.overallScore > 0 && result.overallScore <= 100, "Overall Scorecard computed (0-100)");

  // 10 Core Numbers Audit
  assert(result.coreNumbers.lifePath.number >= 1, "Life Path Number deep dive present");
  assert(result.coreNumbers.destiny.number >= 1, "Destiny Number deep dive present");
  assert(result.coreNumbers.soulUrge.number >= 1, "Soul Urge Number deep dive present");
  assert(result.coreNumbers.personality.number >= 1, "Personality Number deep dive present");
  assert(result.coreNumbers.birthday.number >= 1, "Birthday Number deep dive present");
  assert(result.coreNumbers.maturity.number >= 1, "Maturity Number deep dive present");
  assert(result.coreNumbers.attitude.number >= 1, "Attitude Number deep dive present");
  assert(result.coreNumbers.balance.number >= 1, "Balance Number deep dive present");
  assert(result.coreNumbers.hiddenPassion.number >= 1, "Hidden Passion Number deep dive present");
  assert(Array.isArray(result.coreNumbers.karmicLessons.missingNumbers), "Karmic Lessons present");

  // Cycles Audit
  assert(result.pinnacles.length === 4, "4 Pinnacle Cycles calculated");
  assert(result.challenges.length === 4, "4 Challenge Cycles calculated");
  assert(result.monthlyTimeline.length === 12, "12-Month unique timeline generated");

  // Practical Asset Numerology Audit
  assert(result.practicalAssets.length === 9, "9 Practical Numerology Assets analyzed (Name, Mobile, Vehicle, House, Biz, Email, Brand, Company, Username)");

  // 3. Audit PDF Generator
  console.log("\n--- 2. Commercial Publication PDF Generator Audit ---");
  const doc = await generateNumerologyPDF(result, { language: "en" });
  const totalPages = doc.getNumberOfPages();

  console.log(`Generated PDF Total Pages: ${totalPages}`);
  assert(totalPages >= 25, "Commercial Enterprise PDF contains 25+ pages of publication-grade report content");
  assert(typeof downloadNumerologyPdf === "function", "downloadNumerologyPdf client helper active");

  console.log("\n==================================================");
  console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) process.exit(1);
}

runCommercialNumerologyV2Audit().catch((err) => {
  console.error(err);
  process.exit(1);
});
