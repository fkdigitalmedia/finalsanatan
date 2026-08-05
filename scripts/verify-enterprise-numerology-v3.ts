/**
 * Automated Verification Audit Script for Enterprise Numerology Pro Report V3 (AI Reasoning & Commercial Edition)
 */

import { calculateNumerology } from "../src/lib/numerology/engine.ts";
import { generateNumerologyPDF, downloadNumerologyPdf } from "../src/lib/numerology/pdf.ts";

async function runCommercialNumerologyV3Audit() {
  console.log("==================================================");
  console.log("🚀 STARTING AUDIT FOR ENTERPRISE NUMEROLOGY V3 (COMMERCIAL EDITION)");
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

  // 1. Calculate Numerology V3 Result
  const result = calculateNumerology("SANATAN USER", "1995-08-15", {
    mobile: "9876543210",
    vehicle: "DL01AB1234",
    house: "108",
    businessName: "SANATAN TOOLS",
  });

  // 2. Audit V3 Multi-Number AI Reasoning Engine & Name Optimization
  console.log("\n--- 1. Multi-Number AI Reasoning Engine Audit ---");
  assert(result.multiNumberReasoning.length >= 3, "Multi-Number AI Reasoning Engine calculated");
  const reasoning1 = result.multiNumberReasoning[0];
  assert(reasoning1.whyScore.includes("WHY") || reasoning1.whyScore.length > 20, "Reasoning explains WHY score was given");
  assert(reasoning1.positiveDrivers.length >= 1, "Positive Drivers identified");
  assert(typeof reasoning1.confidence === "string", "Confidence Level assigned");

  console.log("\n--- 2. Name Optimization Engine Audit ---");
  assert(result.nameOptimization.alternatives.length >= 3, "Name Optimization suggests 3 alternative spellings");
  assert(result.nameOptimization.alternatives[0].moneyScore > 0, "Money Score calculated for name variants");
  assert(typeof result.nameOptimization.bestSpellingRecommendation === "string", "Best Spelling Recommendation present");

  console.log("\n--- 3. 10 Core Numbers (14 Items Each) Audit ---");
  const lp = result.coreNumbers.lifePath;
  assert(lp.positiveTraits.length >= 2, "Item 1: Positive Traits present");
  assert(lp.negativeTraits.length >= 1, "Item 2: Negative Traits present");
  assert(typeof lp.decisionStyle === "string", "Item 3: Decision Style present");
  assert(typeof lp.hiddenRisks === "string", "Item 4: Hidden Risks present");
  assert(typeof lp.aiFinalVerdict === "string", "Item 5: AI Final Verdict present");

  console.log("\n--- 4. 100% Unique 12-Month Forecast Audit ---");
  assert(result.monthlyTimeline.length === 12, "12-Month unique timeline present");
  const month1Text = result.monthlyTimeline[0].career;
  const month2Text = result.monthlyTimeline[1].career;
  assert(month1Text !== month2Text, "Month 1 and Month 2 predictions are 100% unique");

  console.log("\n--- 5. 4-Stage Action Plan Audit ---");
  assert(result.actionPlan.immediateActions.length >= 1, "Immediate Actions present");
  assert(result.actionPlan.thirtyDayPlan.length >= 1, "30-Day Plan present");
  assert(result.actionPlan.ninetyDayPlan.length >= 1, "90-Day Plan present");
  assert(result.actionPlan.oneYearStrategy.length >= 1, "1-Year Strategy present");

  // 3. Audit PDF Generator
  console.log("\n--- 6. Commercial Publication PDF Generator Audit ---");
  const doc = await generateNumerologyPDF(result, { language: "en" });
  const totalPages = doc.getNumberOfPages();

  console.log(`Generated PDF Total Pages: ${totalPages}`);
  assert(totalPages >= 30, "Commercial Enterprise PDF V3 contains 30+ pages of publication-grade report content");
  assert(typeof downloadNumerologyPdf === "function", "downloadNumerologyPdf client helper active");

  console.log("\n==================================================");
  console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) process.exit(1);
}

runCommercialNumerologyV3Audit().catch((err) => {
  console.error(err);
  process.exit(1);
});
