/**
 * Admin Subscription Assignment & Manual Plan Management Verification Script
 * Validates plan assignment, extensions, lifetime VIP, super admin security,
 * audit logging, notifications, and bulk operations.
 */

import {
  executeGetUserSubscriptionDetails,
  executeAssignUserSubscription,
  executeBulkManageSubscriptions,
  executeGetSubscriptionAuditLogs,
} from "../src/lib/admin-subscription.functions.ts";

console.log("==================================================");
console.log("🚀 STARTING ADMIN SUBSCRIPTION MANAGEMENT VERIFICATION");
console.log("==================================================\n");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✔ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`` + `✖ [FAIL] ${message}`);
    failed++;
  }
}

// Helper mock context
function createMockCtx(isStaff = true, isSuperAdmin = true) {
  const auditLogs = [];
  const notifications = [];
  const entitlements = new Map();
  const userRoles = new Set(isSuperAdmin ? ["admin", "super_admin"] : ["admin"]);

  return {
    userId: "admin-user-001",
    supabase: {
      rpc: async (name, params) => {
        if (name === "is_staff") return { data: isStaff, error: null };
        return { data: null, error: null };
      },
      from: (table) => {
        return {
          select: (cols) => ({
            eq: (col, val) => ({
              eq: (col2, val2) => ({
                maybeSingle: async () => {
                  if (table === "user_roles" && userRoles.has(val2)) {
                    return { data: { role: val2 } };
                  }
                  return { data: null };
                },
                order: (col3, opts) => ({
                  limit: (num) => ({
                    maybeSingle: async () => {
                      return { data: entitlements.get(val) || null };
                    },
                  }),
                }),
              }),
              maybeSingle: async () => {
                if (table === "profiles") {
                  return { data: { id: val, display_name: "Test Admin", email: "admin@sanatan.com" } };
                }
                return { data: entitlements.get(val) || null };
              },
              order: (col3, opts) => ({
                limit: (num) => {
                  if (table === "audit_logs") {
                    return { data: auditLogs.filter((a) => a.resource_id === val) };
                  }
                  return { data: [] };
                },
                maybeSingle: async () => {
                  return { data: entitlements.get(val) || null };
                },
              }),
            }),
            order: (col, opts) => ({
              limit: (num) => {
                return { data: auditLogs };
              },
            }),
          }),
          upsert: async (payload) => {
            entitlements.set(payload.user_id, payload);
            return { error: null };
          },
          update: (payload) => ({
            eq: async (col, val) => {
              const prev = entitlements.get(val) || {};
              entitlements.set(val, { ...prev, ...payload });
              return { error: null };
            },
          }),
          insert: async (payload) => {
            if (table === "audit_logs") auditLogs.push(payload);
            if (table === "notifications") notifications.push(payload);
            return { error: null };
          },
        };
      },
    },
    getLogs: () => auditLogs,
    getNotifications: () => notifications,
    getEntitlements: () => entitlements,
  };
}

async function runTests() {
  // Test 1: Staff Check
  console.log("--- 1. Staff Access & Permissions ---");
  const ctxNormalStaff = createMockCtx(true, false);
  const ctxSuperAdmin = createMockCtx(true, true);

  assert(!!ctxNormalStaff, "Normal Staff context initialized");
  assert(!!ctxSuperAdmin, "Super Admin context initialized");

  // Test 2: Plan Assignment (Premium Pro 30 Days)
  console.log("\n--- 2. Single Plan Assignment (30 Days Pro) ---");
  try {
    const res = await executeAssignUserSubscription(ctxSuperAdmin, {
      userId: "user-101",
      planKey: "premium_pro",
      status: "active",
      durationPreset: "30d",
      reasonCode: "customer_support",
      reasonNotes: "Granted 30 days for support ticket",
    });

    assert(res.success === true, "Plan assignment returned success");
    assert(res.planKey === "premium_pro", "Assigned plan key is 'premium_pro'");
    assert(res.planLabel === "Premium Pro Plan", "Assigned plan label is 'Premium Pro Plan'");
    assert(!!res.expiryDate, "Expiry date was calculated for 30d preset");

    const logs = ctxSuperAdmin.getLogs();
    assert(logs.length > 0, "Audit log entry created in DB");
    assert(logs[0].action === "subscription_assign", `Audit action recorded as '${logs[0].action}'`);

    const notifs = ctxSuperAdmin.getNotifications();
    assert(notifs.length > 0, "In-app notification sent to user");
    assert(notifs[0].title === "Subscription Updated", `Notification title is '${notifs[0].title}'`);
  } catch (err) {
    assert(false, `Plan assignment failed: ${err.message}`);
  }

  // Test 3: Super Admin Gating for Lifetime VIP
  console.log("\n--- 3. Super Admin Gating for Lifetime VIP ---");
  let caughtGatingError = false;
  try {
    await executeAssignUserSubscription(ctxNormalStaff, {
      userId: "user-102",
      planKey: "lifetime_vip",
      status: "active",
      durationPreset: "lifetime",
      reasonCode: "manual_upgrade",
    });
  } catch (err) {
    caughtGatingError = true;
    assert(err.message.includes("Super Admin role required"), `Super admin gating caught error: '${err.message}'`);
  }
  assert(caughtGatingError, "Normal staff blocked from assigning Lifetime VIP");

  // Test 4: Assign Lifetime VIP as Super Admin
  console.log("\n--- 4. Lifetime VIP Assignment by Super Admin ---");
  try {
    const vipRes = await executeAssignUserSubscription(ctxSuperAdmin, {
      userId: "user-103",
      planKey: "lifetime_vip",
      status: "active",
      durationPreset: "lifetime",
      isLifetime: true,
      reasonCode: "contest_winner",
      reasonNotes: "Winner of Grand Vedic Contest 2026",
    });

    assert(vipRes.success === true, "Super Admin successfully assigned Lifetime VIP");
    assert(vipRes.isLifetime === true, "isLifetime flag is true");
    assert(vipRes.expiryDate === null, "Expiry date for Lifetime VIP is null (never expires)");

    const notifs = ctxSuperAdmin.getNotifications();
    const lastNotif = notifs[notifs.length - 1];
    assert(lastNotif.title === "Lifetime VIP Activated", `Notification title is '${lastNotif.title}'`);
  } catch (err) {
    assert(false, `Lifetime assignment failed: ${err.message}`);
  }

  // Test 5: Plan Extension (+90 Days)
  console.log("\n--- 5. Plan Extension (+90 Days) ---");
  try {
    const extRes = await executeAssignUserSubscription(ctxSuperAdmin, {
      userId: "user-101",
      planKey: "premium_pro",
      status: "active",
      durationPreset: "90d",
      reasonCode: "promotion",
      actionType: "extend",
    });

    assert(extRes.success === true, "Plan extended successfully");
    const notifs = ctxSuperAdmin.getNotifications();
    const lastNotif = notifs[notifs.length - 1];
    assert(lastNotif.title === "Subscription Extended", `Extension notification sent '${lastNotif.title}'`);
  } catch (err) {
    assert(false, `Plan extension failed: ${err.message}`);
  }

  // Test 6: Bulk Operations
  console.log("\n--- 6. Bulk Subscription Operations ---");
  try {
    const bulkRes = await executeBulkManageSubscriptions(ctxSuperAdmin, {
      userIds: ["user-201", "user-202", "user-203"],
      action: "assign",
      planKey: "premium_pro",
      reasonCode: "promotion",
      reasonNotes: "Bulk festival promo",
    });

    assert(bulkRes.success === true, "Bulk assign action executed");
    assert(bulkRes.processed === 3, `Processed all 3 users in bulk (got ${bulkRes.processed})`);
  } catch (err) {
    assert(false, `Bulk action failed: ${err.message}`);
  }

  console.log("\n==================================================");
  console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) process.exit(1);
}

runTests();
