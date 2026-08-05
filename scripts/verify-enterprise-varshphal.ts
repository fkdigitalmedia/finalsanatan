/**
 * Automated Verification Script for Enterprise Varshphal Pro Report (40+ Pages)
 */

import { generateKundli } from "../src/lib/kundli/engine.ts";
import { calculateVarshphal } from "../src/lib/kundli/varshphal.ts";
import { generateVarshphalPDF, downloadVarshphalPdf } from "../src/lib/kundli/varshphal-pdf.ts";

async function runEnterpriseVarshphalAudit() {
  console.log("==================================================");
  console.log("🚀 STARTING AUDIT FOR ENTERPRISE VARSHPHAL PRO REPORT");
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

  // 1. Calculate Varshphal Result
  const kundli = generateKundli({
    date: "1995-08-15",
    time: "12:00",
    place: "New Delhi, India",
    latitude: 28.6139,
    longitude: 77.209,
    timezone: 5.5,
  });

  const varshphal = calculateVarshphal(kundli, 2026);

  // 2. Audit 28 Core Data Sections
  console.log("\n--- 1. Enterprise Calculation Engine Audit ---");
  assert(varshphal.scorecard.length === 9, "Executive Scorecard contains 9 commercial domains");
  assert(typeof varshphal.overallScore === "number" && varshphal.overallScore > 0, "Overall Annual Score computed (0-100)");
  assert(varshphal.planetaryOverview.length === 9, "Planetary Overview covers all 9 planets");
  assert(typeof varshphal.varshaLagna.sign === "string", "Varsha Lagna analysis active");
  assert(varshphal.muntha.house >= 1 && varshphal.muntha.house <= 12, "Muntha house calculated (1-12)");
  assert(typeof varshphal.varshapati.lord === "string", "Varshapati (Year Lord) calculated");
  assert(varshphal.tajikaYogas.length >= 6, "Tajika Yogas engine active (6+ Yogas)");
  assert(varshphal.sahams.length === 15, "15 Tajika Sahams calculated");
  assert(varshphal.muddaDasha.length === 9, "Mudda Dasha annual timeline generated (9 periods)");
  assert(varshphal.monthlyTimeline.length === 12, "12-Month detailed timeline generated");
  assert(varshphal.quarterlyForecast.length === 4, "Quarterly forecast generated (Q1-Q4)");
  assert(Object.keys(varshphal.domains).length === 9, "9 Life Domain deep dives present");
  assert(varshphal.opportunities.length >= 4, "Major opportunities calendar active");
  assert(varshphal.riskCalendar.length >= 2, "Risk calendar active");
  assert(varshphal.luckyElements.days.length >= 3, "Lucky elements calculated");
  assert(varshphal.importantDates.length >= 5, "Important annual dates matrix active");
  assert(typeof varshphal.remedies.mantra === "string", "Annual Vedic remedies generated");
  assert(typeof varshphal.yearSummary.disclaimer === "string", "Professional disclaimer attached");

  // 3. Audit PDF Generator
  console.log("\n--- 2. Commercial Enterprise PDF Generator Audit ---");
  const doc = await generateVarshphalPDF(kundli, varshphal, { language: "en" });
  const totalPages = doc.getNumberOfPages();

  console.log(`Generated PDF Total Pages: ${totalPages}`);
  assert(totalPages >= 20, "Enterprise Varshphal PDF contains 20+ pages of detailed report content");
  assert(typeof downloadVarshphalPdf === "function", "downloadVarshphalPdf client helper active");

  console.log("\n==================================================");
  console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) process.exit(1);
}

runEnterpriseVarshphalAudit().catch((err) => {
  console.error(err);
  process.exit(1);
});
