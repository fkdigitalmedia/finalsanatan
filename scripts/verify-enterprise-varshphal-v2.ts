/**
 * Automated Verification Audit Script for Enterprise Varshphal Pro Report V2 (Commercial Edition 35-45 Pages)
 */

import { generateKundli } from "../src/lib/kundli/engine.ts";
import { calculateVarshphal } from "../src/lib/kundli/varshphal.ts";
import { generateVarshphalPDF, downloadVarshphalPdf } from "../src/lib/kundli/varshphal-pdf.ts";

async function runCommercialVarshphalV2Audit() {
  console.log("==================================================");
  console.log("🚀 STARTING AUDIT FOR ENTERPRISE VARSHPHAL V2 (COMMERCIAL EDITION)");
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

  // 1. Calculate Varshphal V2 Result
  const kundli = generateKundli({
    date: "1995-08-15",
    time: "12:00",
    place: "New Delhi, India",
    latitude: 28.6139,
    longitude: 77.209,
    timezone: 5.5,
  });

  const varshphal = calculateVarshphal(kundli, 2026);

  // 2. Audit Core V2 Data Sections
  console.log("\n--- 1. Calculation & Structure Audit ---");
  assert(varshphal.opportunityIndex === 88, "Annual Opportunity Index calculated (88%)");
  assert(varshphal.riskIndex === 24, "Annual Risk Index calculated (24%)");
  assert(varshphal.scorecard.length === 9, "Annual Dashboard Scorecard has 9 life domain scores");

  // 12-Month Structured Cards Audit
  assert(varshphal.monthlyTimeline.length === 12, "12-Month structured timeline active");
  const month1 = varshphal.monthlyTimeline[0];
  assert(Array.isArray(month1.careerBullets) && month1.careerBullets.length >= 2, "Monthly card contains Career bullet points");
  assert(Array.isArray(month1.financeBullets) && month1.financeBullets.length >= 2, "Monthly card contains Finance bullet points");
  assert(typeof month1.opportunityScore === "number" && month1.opportunityScore > 0, "Monthly card has Opportunity Score");
  assert(typeof month1.riskScore === "number" && month1.riskScore > 0, "Monthly card has Risk Score");
  assert(typeof month1.suggestedRemedy === "string", "Monthly card has Suggested Remedy");

  // 12-Item Life Domain Deep Dives Audit
  const domainsCount = Object.keys(varshphal.domains).length;
  assert(domainsCount === 9, "9 Life Domain deep dives calculated (Career, Finance, Marriage, Health, Business, Education, Foreign, Property, Spiritual)");

  const careerDomain = varshphal.domains.career;
  assert(typeof careerDomain.executiveSummary === "string", "Item 1: Executive Summary present");
  assert(typeof careerDomain.strengthScore === "number", "Item 2: Overall Strength Score present");
  assert(typeof careerDomain.astrologicalEvidence.munthaRole === "string", "Item 3: Astrological Evidence present");
  assert(careerDomain.positiveIndicators.length >= 2, "Item 4: Positive Indicators present");
  assert(careerDomain.challenges.length >= 1, "Item 5: Challenges present");
  assert(careerDomain.importantTimePeriods.length >= 2, "Item 6: Important Time Periods present");
  assert(careerDomain.riskFactors.length >= 1, "Item 7: Risk Factors present");
  assert(careerDomain.opportunityWindows.length >= 1, "Item 8: Opportunity Windows present");
  assert(typeof careerDomain.aiInterpretation.cause === "string", "Item 9: AI Interpretation present");
  assert(careerDomain.actionPlan.length >= 2, "Item 10: Action Plan present");
  assert(careerDomain.recommendedRemedies.length >= 1, "Item 11: Recommended Remedies present");
  assert(typeof careerDomain.finalSummary === "string", "Item 12: Final Summary present");

  // 11-Category Important Dates Matrix Audit
  assert(varshphal.importantDateMatrix.length === 11, "11-Category Important Dates Matrix calculated");
  assert(Array.isArray(varshphal.comprehensiveRemedies.colours), "10-Point Comprehensive Remedies present");

  // 3. Audit PDF Generator
  console.log("\n--- 2. Commercial Publication PDF Generator Audit ---");
  const doc = await generateVarshphalPDF(kundli, varshphal, { language: "en" });
  const totalPages = doc.getNumberOfPages();

  console.log(`Generated PDF Total Pages: ${totalPages}`);
  assert(totalPages >= 30, "Commercial Enterprise PDF contains 30+ pages of publication-grade report content");
  assert(typeof downloadVarshphalPdf === "function", "downloadVarshphalPdf client helper active");

  console.log("\n==================================================");
  console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) process.exit(1);
}

runCommercialVarshphalV2Audit().catch((err) => {
  console.error(err);
  process.exit(1);
});
