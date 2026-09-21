import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export interface AiAstrologerUsageResult {
  userId: string;
  isPro: boolean;
  usedCount: number;
  limit: number | null;
  remaining: number;
}

const PRO_ENTITLEMENT_KEYS = [
  "lifetime",
  "lifetime_vip",
  "lifetime_access",
  "lifetime-pass",
  "lifetime_moksha_pass",
  "admin",
  "all_tools",
  "premium_access",
  "premium",
  "pro",
  "pro-monthly",
  "pro-yearly",
  "premium_pro",
  "sadhak-pro",
  "kundli_premium_report",
];

/** Fetch the current question usage and Pro/Premium status for AI Astrologer. */
export const getAiAstrologerUsage = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AiAstrologerUsageResult> => {
    const userId = context.userId;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let isPro = false;

    // 1. Staff / admin check
    try {
      const { data: isStaff } = await supabaseAdmin.rpc("is_staff", { _user_id: userId });
      if (isStaff) isPro = true;
    } catch (err) {
      console.warn("[getAiAstrologerUsage] is_staff check error:", err);
    }

    // 2. User entitlements check
    if (!isPro) {
      try {
        const { data: entitlements } = await supabaseAdmin
          .from("user_entitlements")
          .select("entitlement_key,active,expires_at")
          .eq("user_id", userId)
          .eq("active", true);

        const nowIso = new Date().toISOString();
        for (const r of entitlements ?? []) {
          if (!r.expires_at || r.expires_at > nowIso) {
            if (PRO_ENTITLEMENT_KEYS.includes(r.entitlement_key.toLowerCase())) {
              isPro = true;
              break;
            }
          }
        }
      } catch (err) {
        console.warn("[getAiAstrologerUsage] entitlements check error:", err);
      }
    }

    // 3. Paid orders fallback check
    if (!isPro) {
      try {
        const { data: paidOrders } = await supabaseAdmin
          .from("orders")
          .select("id,plan_id,status,created_at,product_type")
          .eq("user_id", userId)
          .eq("status", "paid");

        if (paidOrders && paidOrders.length > 0) {
          for (const order of paidOrders) {
            if (!order.plan_id) continue;
            const { data: plan } = await supabaseAdmin
              .from("subscription_plans")
              .select("name,slug,interval,product_type,entitlement_key")
              .eq("id", order.plan_id)
              .maybeSingle();

            if (!plan) continue;
            const planSlug = (plan.slug || "").toLowerCase();
            const planName = (plan.name || "").toLowerCase();
            const isLifetime =
              planSlug.includes("lifetime") ||
              planName.includes("lifetime") ||
              (plan.interval === "one_time" && plan.product_type !== "one_time");
            const isSub =
              plan.product_type === "subscription" ||
              plan.interval === "month" ||
              plan.interval === "year";

            if (
              isLifetime ||
              isSub ||
              planSlug.includes("pro") ||
              planName.includes("pro") ||
              planSlug.includes("premium")
            ) {
              isPro = true;
              break;
            }
          }
        }
      } catch (err) {
        console.warn("[getAiAstrologerUsage] paid orders check error:", err);
      }
    }

    // 4. Count successful AI Astrologer usages in ai_usage_logs
    let usedCount = 0;
    try {
      const { count } = await supabaseAdmin
        .from("ai_usage_logs")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("feature_key", "tool:ai-astrologer")
        .eq("success", true);

      usedCount = count ?? 0;
    } catch (err) {
      console.warn("[getAiAstrologerUsage] ai_usage_logs count error:", err);
    }

    return {
      userId,
      isPro,
      usedCount,
      limit: isPro ? null : 3,
      remaining: isPro ? 999999 : Math.max(0, 3 - usedCount),
    };
  });
