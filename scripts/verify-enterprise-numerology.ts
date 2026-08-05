/**
 * Automated Verification Test Suite for Enterprise Numerology Pro Report
 */

import { calculateNumerology } from "../src/lib/numerology/engine.ts";
import { generateNumerologyPDF, downloadNumerologyPdf } from "../src/lib/numerology/pdf.ts";

async function runEnterpriseNumerologyAudit() {
  console.log("==================================================");
  console.log("🚀 STARTING AUDIT FOR ENTERPRISE NUMEROLOGY PRO REPORT");
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

  // 1. Calculate Numerology Report
  const result = calculateNumerology("SANATAN USER", "1995-08-15", {
    mobile: "9876543210",
    vehicle: "DL01AB1234",
    house: "108",
    businessName: "SANATAN TOOLS",
  });

  // 2. Audit Core Sections
  console.log("\n--- 1. Calculation Engine Audit (30 Sections) ---");
  assert(result.scorecard.length === 9, "Executive Scorecard covers 9 life domains");
  assert(result.overallScore > 0 && result.overallScore <= 100, "Overall Scorecard computed (0-100)");
  assert(result.lifePath.number >= 1 && result.lifePath.number <= 33, "Life Path Number computed");
  assert(result.destiny.number >= 1 && result.destiny.number <= 33, "Destiny Number computed");
  assert(result.soulUrge.number >= 1, "Soul Urge Number computed");
  assert(result.personality.number >= 1, "Personality Number computed");
  assert(result.birthday.number >= 1, "Birthday Number computed");
  assert(result.maturity.number >= 1, "Maturity Number computed");
  assert(result.attitude.number >= 1, "Attitude Number computed");
  assert(result.balance.number >= 1, "Balance Number computed");
  assert(result.hiddenPassion.number >= 1, "Hidden Passion Number computed");
  assert(Array.isArray(result.karmicLessons), "Karmic Lesson numbers calculated");

  assert(result.pinnacles.length === 4, "4 Pinnacle Cycles calculated");
  assert(result.challenges.length === 4, "4 Challenge Cycles calculated");

  assert(result.personalYear.number >= 1, "Personal Year analysis active");
  assert(result.personalMonth.number >= 1, "Personal Month forecast active");
  assert(result.personalDay.number >= 1, "Personal Day prediction active");
  assert(result.monthlyTimeline.length === 12, "12-Month Annual Timeline generated");

  assert(typeof result.career.summary === "string", "Career Analysis present");
  assert(typeof result.finance.summary === "string", "Finance Analysis present");
  assert(typeof result.marriage.summary === "string", "Marriage Analysis present");
  assert(typeof result.health.summary === "string", "Health Tendencies present");

  assert(result.mobileAnalysis.sumNumber > 0, "Mobile Number Analysis active");
  assert(result.vehicleAnalysis.sumNumber > 0, "Vehicle Number Analysis active");
  assert(result.houseAnalysis.sumNumber > 0, "House Number Analysis active");
  assert(result.businessAnalysis.sumNumber > 0, "Business Name Analysis active");
  assert(result.compatibility.length === 9, "Compatibility Matrix calculated (1-9)");

  assert(result.luckyElements.numbers.length > 0, "Lucky numbers calculated");
  assert(typeof result.remedies.gemstone === "string", "Personalized remedies generated");
  assert(typeof result.summary.disclaimer === "string", "Professional disclaimer attached");

  // 3. Audit PDF Generator
  console.log("\n--- 2. Commercial Enterprise PDF Generator Audit ---");
  const doc = await generateNumerologyPDF(result, { language: "en" });
  const totalPages = doc.getNumberOfPages();

  console.log(`Generated PDF Total Pages: ${totalPages}`);
  assert(totalPages >= 15, "Enterprise Numerology PDF contains 15+ pages of detailed report content");
  assert(typeof downloadNumerologyPdf === "function", "downloadNumerologyPdf helper active");

  console.log("\n==================================================");
  console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) process.exit(1);
}

runEnterpriseNumerologyAudit().catch((err) => {
  console.error(err);
  process.exit(1);
});
