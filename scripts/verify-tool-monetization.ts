/**
 * Automated Verification Test Suite for Dynamic Tool Monetization Engine
 */

import {
  DEFAULT_TOOL_MONETIZATION_CONFIG,
  evaluateToolAccess,
  type ToolMonetizationItem,
} from "../src/lib/monetization/tool-access.ts";

function runTests() {
  console.log("==================================================");
  console.log("🚀 STARTING TOOL MONETIZATION ENGINE VERIFICATION");
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

  // 1. Verify Default Config Matrix contains all 10+ core reports
  console.log("\n--- 1. Default Config Matrix Completeness ---");
  const slugs = Object.keys(DEFAULT_TOOL_MONETIZATION_CONFIG);
  assert(slugs.includes("janam-kundli-basic"), "Default config includes Basic Janam Kundli");
  assert(slugs.includes("kundli-pro"), "Default config includes Pro Janam Kundli");
  assert(slugs.includes("varshphal"), "Default config includes Varshphal");
  assert(slugs.includes("kundli-matching"), "Default config includes Kundli Matching");
  assert(slugs.includes("career-report"), "Default config includes Career Report");
  assert(slugs.includes("marriage-report"), "Default config includes Marriage Report");
  assert(slugs.includes("business-report"), "Default config includes Business Report");
  assert(slugs.includes("health-report"), "Default config includes Health Report");
  assert(slugs.includes("foreign-settlement"), "Default config includes Foreign Settlement");

  // 2. Test Access Evaluation - Free Tool
  console.log("\n--- 2. Free Tool Access Evaluation ---");
  const freeTool = DEFAULT_TOOL_MONETIZATION_CONFIG["janam-kundli-basic"];
  const freeResult = evaluateToolAccess(freeTool, []);
  assert(freeResult.isAccessible === true, "Free tool is accessible to anonymous user");
  assert(freeResult.isFree === true, "Free tool is identified as free");
  assert(freeResult.status === "live", "Free tool status is live");

  // 3. Test Access Evaluation - Premium Tool without entitlement
  console.log("\n--- 3. Premium Tool Access (Unsubscribed User) ---");
  const proTool = DEFAULT_TOOL_MONETIZATION_CONFIG["kundli-pro"];
  const unsubResult = evaluateToolAccess(proTool, []);
  assert(unsubResult.isAccessible === false, "Premium tool blocked for unsubscribed user");
  assert(unsubResult.isOneTimeBuyable === true, "One-time purchase option available");

  // 4. Test Access Evaluation - Premium Tool with entitlement
  console.log("\n--- 4. Premium Tool Access (Subscribed User) ---");
  const subResult = evaluateToolAccess(proTool, ["premium_access"]);
  assert(subResult.isAccessible === true, "Premium tool accessible for subscribed user");

  // 5. Test Access Evaluation - Free Teaser Preview
  console.log("\n--- 5. Free Teaser Preview Evaluation ---");
  const numTool = DEFAULT_TOOL_MONETIZATION_CONFIG["numerology"];
  const numResult = evaluateToolAccess(numTool, []);
  assert(numResult.isAccessible === true, "Free teaser preview is accessible");
  assert(numResult.isTrial === true, "Trial flag is active");

  // 6. Test Access Evaluation - Hidden & Disabled Tools
  console.log("\n--- 6. Hidden & Disabled Tools ---");
  const hiddenItem: ToolMonetizationItem = {
    ...proTool,
    accessType: "hidden",
    enabled: true,
  };
  const hiddenResult = evaluateToolAccess(hiddenItem, ["premium_access"]);
  assert(hiddenResult.isAccessible === false, "Hidden tool blocked even for premium user");
  assert(hiddenResult.status === "hidden", "Status evaluated as hidden");

  const disabledItem: ToolMonetizationItem = {
    ...proTool,
    accessType: "premium",
    enabled: false,
  };
  const disabledResult = evaluateToolAccess(disabledItem, ["premium_access"]);
  assert(disabledResult.isAccessible === false, "Disabled tool blocked");

  console.log("\n==================================================");
  console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) process.exit(1);
}

runTests();
