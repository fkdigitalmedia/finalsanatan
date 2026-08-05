/**
 * Admin Subscription Assignment & Manual Plan Management Server Functions
 *
 * Provides dynamic server functions for manual plan assignment, extensions,
 * upgrades, downgrades, lifetime VIP conversions, suspensions, cancellations,
 * audit logging, and instant user notifications.
 */

import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type {
  AdminSubscriptionAssignInput,
  BulkSubscriptionInput,
  SubscriptionPlanKey,
} from "@/lib/monetization/monetization-types";

// ---------- HELPERS ----------

export async function assertStaff(ctx: { supabase: any; userId: string }) {
  const { data, error } = await ctx.supabase.rpc("is_staff", { _user_id: ctx.userId });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: Staff role required");
}

export async function isSuperAdmin(ctx: { supabase: any; userId: string }): Promise<boolean> {
  const { data } = await ctx.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", ctx.userId)
    .eq("role", "super_admin")
    .maybeSingle();
  return !!data;
}

export const PLAN_LABELS: Record<SubscriptionPlanKey, string> = {
  free: "Free Plan",
  basic: "Basic Plan",
  premium_pro: "Premium Pro Plan",
  lifetime_vip: "Lifetime VIP Plan",
};

export const REASON_LABELS: Record<string, string> = {
  manual_upgrade: "Manual Upgrade",
  customer_support: "Customer Support",
  promotion: "Promotion",
  influencer: "Influencer",
  refund_compensation: "Refund Compensation",
  testing: "Testing",
  internal_staff: "Internal Staff",
  contest_winner: "Contest Winner",
  custom: "Custom",
};

export function calculateExpiry(
  preset: string,
  startDateIso: string,
  customExpiryIso?: string,
): { expiryIso: string | null; durationDays: number | null; isLifetime: boolean } {
  if (preset === "lifetime") {
    return { expiryIso: null, durationDays: null, isLifetime: true };
  }
  if (preset === "custom" && customExpiryIso) {
    const start = new Date(startDateIso).getTime();
    const end = new Date(customExpiryIso).getTime();
    const days = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
    return { expiryIso: customExpiryIso, durationDays: days, isLifetime: false };
  }

  const start = new Date(startDateIso);
  let days = 30;
  switch (preset) {
    case "7d":
      days = 7;
      break;
    case "15d":
      days = 15;
      break;
    case "30d":
      days = 30;
      break;
    case "60d":
      days = 60;
      break;
    case "90d":
      days = 90;
      break;
    case "180d":
      days = 180;
      break;
    case "365d":
      days = 365;
      break;
    default:
      days = 30;
  }

  const expiry = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);
  return { expiryIso: expiry.toISOString(), durationDays: days, isLifetime: false };
}

// ---------- PAYLOAD UNWRAPPER HELPER ----------

export function unwrapPayload<T = any>(raw: any): T {
  if (!raw) return raw;
  let current = raw;

  if (typeof current === "string") {
    if (current.startsWith("{") || current.startsWith("[")) {
      try {
        current = JSON.parse(current);
      } catch (e) {
        return current as any;
      }
    } else {
      return current as any;
    }
  }

  for (let i = 0; i < 3; i++) {
    if (!current || typeof current !== "object") break;

    if (current["data[userId]"]) {
      return { userId: current["data[userId]"] } as any;
    }

    if ("data" in current && current.data) {
      if (current.userId || current.userIds) break;
      let d = current.data;
      if (typeof d === "string" && (d.startsWith("{") || d.startsWith("["))) {
        try {
          d = JSON.parse(d);
        } catch (e) {
          // ignore
        }
      }
      if (d && typeof d === "object") {
        current = d;
      } else {
        break;
      }
    } else {
      break;
    }
  }
  return current;
}

// ---------- CORE LOGIC EXPORTS ----------

export async function executeGetUserSubscriptionDetails(
  ctx: { supabase: any; userId: string },
  rawTargetUserId: any,
) {
  await assertStaff(ctx);

  const payload = unwrapPayload(rawTargetUserId);
  const targetUserId = typeof payload === "string" ? payload : payload?.userId;
  if (!targetUserId) throw new Error("Missing required field: userId");

  const [entRes, profileRes, auditRes] = await Promise.all([
    ctx.supabase
      .from("user_entitlements")
      .select("*")
      .eq("user_id", targetUserId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    ctx.supabase
      .from("profiles")
      .select("id, display_name, full_name, email")
      .eq("id", targetUserId)
      .maybeSingle(),
    ctx.supabase
      .from("audit_logs")
      .select("*")
      .eq("resource_type", "user_subscription")
      .eq("resource_id", targetUserId)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const ent = entRes.data;
  const profile = profileRes.data;
  const auditLogs = auditRes.data ?? [];

  let remainingDays: number | null = null;
  let isLifetime = false;
  let status = ent?.active ? "Active" : "Expired";

  if (ent) {
    if (!ent.expires_at) {
      isLifetime = true;
      remainingDays = null;
    } else {
      const now = new Date().getTime();
      const exp = new Date(ent.expires_at).getTime();
      remainingDays = Math.max(0, Math.ceil((exp - now) / (1000 * 60 * 60 * 24)));
      if (remainingDays === 0) status = "Expired";
    }
  }

  return {
    userId: targetUserId,
    userName: profile?.display_name || profile?.full_name || profile?.email || "User",
    userEmail: profile?.email || "",
    entitlement: ent,
    currentPlanKey: ent?.entitlement_key || "free",
    currentPlanLabel: PLAN_LABELS[(ent?.entitlement_key as SubscriptionPlanKey) || "free"] || "Free Plan",
    status,
    startDate: ent?.created_at || null,
    expiryDate: ent?.expires_at || null,
    remainingDays,
    isLifetime,
    assignedBy: ent?.assigned_by || "System",
    assignmentMethod: ent?.assignment_method || "Payment",
    reason: ent?.reason || "Default",
    lastUpdated: ent?.updated_at || ent?.created_at || null,
    auditHistory: auditLogs.map((a: any) => ({
      id: a.id,
      action: a.action,
      timestamp: a.created_at,
      actorUserId: a.actor_user_id,
      meta: a.meta ?? {},
    })),
  };
}

export async function executeAssignUserSubscription(
  ctx: { supabase: any; userId: string },
  rawInput: AdminSubscriptionAssignInput,
) {
  await assertStaff(ctx);

  const input: AdminSubscriptionAssignInput = unwrapPayload(rawInput);

  if (!input || !input.userId) {
    throw new Error("Missing required field: userId");
  }

  const planKey = input.planKey || "free";
  const durationPreset = input.durationPreset || "30d";
  const status = input.status || "active";
  const reasonCode = input.reasonCode || "manual_upgrade";
  const superAdmin = await isSuperAdmin(ctx);

  // SECURITY CHECK: Super Admin required for Lifetime VIP or Custom Expiry override
  if ((planKey === "lifetime_vip" || durationPreset === "lifetime" || input.isLifetime) && !superAdmin) {
    throw new Error("Forbidden: Super Admin role required to assign Lifetime VIP plan.");
  }
  if (input.actionType === "cancel" && !superAdmin) {
    throw new Error("Forbidden: Super Admin role required to delete or revoke subscription.");
  }

  const startDate = input.customStartDate || new Date().toISOString();
  const { expiryIso, durationDays, isLifetime } = calculateExpiry(
    durationPreset,
    startDate,
    input.customExpiryDate,
  );

  const isActive = status === "active" || status === "trial";
  const reasonText = input.reasonNotes
    ? `${REASON_LABELS[reasonCode] || reasonCode}: ${input.reasonNotes}`
    : REASON_LABELS[reasonCode] || reasonCode;

  // 1. Fetch Admin Name
  const { data: adminProfile } = await ctx.supabase
    .from("profiles")
    .select("display_name, full_name, email")
    .eq("id", ctx.userId)
    .maybeSingle();

  const adminName = adminProfile?.display_name || adminProfile?.full_name || adminProfile?.email || "Admin";

  // 2. Fetch User Profile
  const { data: userProfile } = await ctx.supabase
    .from("profiles")
    .select("display_name, email")
    .eq("id", input.userId)
    .maybeSingle();

  const userName = userProfile?.display_name || userProfile?.email || input.userId;

  // 3. Upsert user_entitlements
  const payload = {
    user_id: input.userId,
    entitlement_key: planKey === "free" ? "basic_access" : "premium_access",
    active: isActive,
    expires_at: isLifetime ? null : expiryIso,
    updated_at: new Date().toISOString(),
  };

  const { error: entError } = await ctx.supabase
    .from("user_entitlements")
    .upsert(payload, { onConflict: "user_id,entitlement_key" });

  if (entError) {
    await ctx.supabase
      .from("user_entitlements")
      .update({
        active: isActive,
        expires_at: isLifetime ? null : expiryIso,
      })
      .eq("user_id", input.userId);
  }

  // 4. Audit Log
  const actionName = input.actionType || "assign";
  await ctx.supabase.from("audit_logs").insert({
    actor_user_id: ctx.userId,
    action: `subscription_${actionName}`,
    resource_type: "user_subscription",
    resource_id: input.userId,
    meta: {
      targetUserId: input.userId,
      targetUserName: userName,
      planKey,
      planLabel: PLAN_LABELS[planKey],
      status,
      durationPreset,
      durationDays,
      isLifetime,
      startDate,
      expiryDate: expiryIso,
      reasonCode,
      reasonText,
      adminUserId: ctx.userId,
      adminName,
      timestamp: new Date().toISOString(),
    },
  });

  // 5. In-App User Notification
  let notifTitle = "Subscription Updated";
  let notifMsg = `Your ${PLAN_LABELS[planKey]} has been activated by our team.`;

  if (input.actionType === "extend") {
    notifTitle = "Subscription Extended";
    notifMsg = `Your subscription has been extended by ${durationDays || "additional"} days.`;
  } else if (planKey === "lifetime_vip" || isLifetime) {
    notifTitle = "Lifetime VIP Activated";
    notifMsg = "Congratulations! Your account has been upgraded to Lifetime VIP access.";
  } else if (status === "suspended") {
    notifTitle = "Subscription Suspended";
    notifMsg = "Your subscription status has been changed to suspended. Contact support for assistance.";
  }

  await ctx.supabase.from("notifications").insert({
    user_id: input.userId,
    title: notifTitle,
    message: notifMsg,
    kind: "system",
    read: false,
    created_at: new Date().toISOString(),
  });

  return {
    success: true,
    userId: input.userId,
    planKey,
    planLabel: PLAN_LABELS[planKey],
    status,
    expiryDate: expiryIso,
    isLifetime,
    message: `Subscription successfully updated to ${PLAN_LABELS[planKey]}.`,
  };
}

export async function executeBulkManageSubscriptions(
  ctx: { supabase: any; userId: string },
  rawInput: BulkSubscriptionInput,
) {
  await assertStaff(ctx);

  const input: BulkSubscriptionInput = unwrapPayload(rawInput);

  if (!input.userIds || input.userIds.length === 0) {
    throw new Error("No users selected for bulk action");
  }

  let successCount = 0;
  const errors: string[] = [];

  for (const targetUid of input.userIds) {
    try {
      if (input.action === "assign" && input.planKey) {
        await executeAssignUserSubscription(ctx, {
          userId: targetUid,
          planKey: input.planKey,
          status: "active",
          durationPreset: "30d",
          reasonCode: input.reasonCode,
          reasonNotes: input.reasonNotes,
          actionType: "assign",
        });
      } else if (input.action === "extend") {
        await executeAssignUserSubscription(ctx, {
          userId: targetUid,
          planKey: "premium_pro",
          status: "active",
          durationPreset: input.extendDays === 365 ? "365d" : "90d",
          reasonCode: input.reasonCode,
          reasonNotes: input.reasonNotes,
          actionType: "extend",
        });
      } else if (input.action === "suspend") {
        await executeAssignUserSubscription(ctx, {
          userId: targetUid,
          planKey: "free",
          status: "suspended",
          durationPreset: "7d",
          reasonCode: input.reasonCode,
          reasonNotes: input.reasonNotes,
          actionType: "suspend",
        });
      } else if (input.action === "expire") {
        await executeAssignUserSubscription(ctx, {
          userId: targetUid,
          planKey: "free",
          status: "expired",
          durationPreset: "7d",
          reasonCode: input.reasonCode,
          reasonNotes: input.reasonNotes,
          actionType: "cancel",
        });
      }
      successCount++;
    } catch (err) {
      errors.push(`User ${targetUid}: ${(err as Error).message}`);
    }
  }

  return {
    success: true,
    processed: successCount,
    total: input.userIds.length,
    errors,
  };
}

export async function executeGetSubscriptionAuditLogs(ctx: { supabase: any; userId: string }) {
  await assertStaff(ctx);

  const { data } = await ctx.supabase
    .from("audit_logs")
    .select("*")
    .eq("resource_type", "user_subscription")
    .order("created_at", { ascending: false })
    .limit(50);

  return (data ?? []).map((a: any) => ({
    id: a.id,
    userId: a.resource_id,
    action: a.action,
    timestamp: a.created_at,
    actorUserId: a.actor_user_id,
    meta: a.meta ?? {},
  }));
}

// ---------- TANSTACK SERVER FUNCTIONS ----------

/** Fetch a user's subscription details, current active entitlement, and audit log history. */
export const getUserSubscriptionDetails = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const payload = unwrapPayload(raw);
    const userId = typeof payload === "string" ? payload : payload?.userId;
    if (!userId) throw new Error("Missing required field: userId");
    return { userId };
  })
  .handler(async ({ data, context }) => {
    const payload = unwrapPayload(data);
    const userId = typeof payload === "string" ? payload : payload?.userId;
    return executeGetUserSubscriptionDetails(context as any, userId);
  });

/** Assign, extend, upgrade, downgrade, suspend, or cancel a user's subscription. */
export const assignUserSubscription = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const input: AdminSubscriptionAssignInput = unwrapPayload(raw);
    if (!input?.userId) throw new Error("Missing required field: userId");
    return input;
  })
  .handler(async ({ data, context }) => {
    const input: AdminSubscriptionAssignInput = unwrapPayload(data);
    return executeAssignUserSubscription(context as any, input);
  });

/** Perform bulk subscription operations across multiple users. */
export const bulkManageSubscriptions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const input: BulkSubscriptionInput = unwrapPayload(raw);
    if (!input?.userIds) throw new Error("Missing required field: userIds");
    return input;
  })
  .handler(async ({ data, context }) => {
    const input: BulkSubscriptionInput = unwrapPayload(data);
    return executeBulkManageSubscriptions(context as any, input);
  });

/** Fetch subscription audit logs system-wide. */
export const getSubscriptionAuditLogs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    return executeGetSubscriptionAuditLogs(context as any);
  });

