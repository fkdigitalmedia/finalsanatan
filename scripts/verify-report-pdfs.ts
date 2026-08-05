/**
 * Automated Verification Script for Dedicated Report PDF Generators
 */

import { generateKundli } from "../src/lib/kundli/engine.ts";
import { calculateVarshphal } from "../src/lib/kundli/varshphal.ts";
import { generateVarshphalPDF, downloadVarshphalPdf } from "../src/lib/kundli/varshphal-pdf.ts";
import {
  generateJanamKundliPDF,
  generateMatchingPDF,
  generateNumerologyPDF,
  generateMuhuratPDF,
  generateCareerPDF,
  generateMarriagePDF,
  generateBusinessPDF,
  generateHealthPDF,
  generateForeignPDF,
} from "../src/lib/pdf/report-generators.ts";

async function runAudit() {
  console.log("==================================================");
  console.log("🚀 STARTING AUDIT OF ALL DEDICATED REPORT PDF GENERATORS");
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

  // Sample Kundli & Varshphal Calculation
  const kundli = generateKundli({
    date: "1995-08-15",
    time: "12:00",
    place: "New Delhi, India",
    latitude: 28.6139,
    longitude: 77.209,
    timezone: 5.5,
  });

  const varshphal = calculateVarshphal(kundli, 2026);

  // 1. Audit Varshphal Dedicated Generator
  console.log("\n--- 1. Varshphal Dedicated PDF Generator ---");
  const doc = await generateVarshphalPDF(kundli, varshphal, { language: "en" });
  assert(doc !== null && typeof doc.save === "function", "generateVarshphalPDF produced valid jsPDF instance");
  assert(typeof downloadVarshphalPdf === "function", "downloadVarshphalPdf export exists");

  // 2. Audit All 10 Report PDF Generators
  console.log("\n--- 2. Dedicated PDF Generators Suite Audit ---");
  assert(typeof generateJanamKundliPDF === "function", "Janam Kundli → generateJanamKundliPDF() exists");
  assert(typeof generateMatchingPDF === "function", "Kundli Matching → generateMatchingPDF() exists");
  assert(typeof generateNumerologyPDF === "function", "Numerology → generateNumerologyPDF() exists");
  assert(typeof generateMuhuratPDF === "function", "Muhurat → generateMuhuratPDF() exists");
  assert(typeof generateCareerPDF === "function", "Career Analysis → generateCareerPDF() exists");
  assert(typeof generateMarriagePDF === "function", "Marriage Analysis → generateMarriagePDF() exists");
  assert(typeof generateBusinessPDF === "function", "Business Analysis → generateBusinessPDF() exists");
  assert(typeof generateHealthPDF === "function", "Health Analysis → generateHealthPDF() exists");
  assert(typeof generateForeignPDF === "function", "Foreign Settlement → generateForeignPDF() exists");

  console.log("\n==================================================");
  console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) process.exit(1);
}

runAudit().catch((err) => {
  console.error(err);
  process.exit(1);
});
