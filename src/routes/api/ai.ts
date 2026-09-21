import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { AI_MODES, isAiMode } from "@/lib/ai-modes";

const BodySchema = z.object({
  mode: z.string().min(1),
  input: z.record(z.string(), z.string()).default({}),
});

export const Route = createFileRoute("/api/ai")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        const parsed = BodySchema.safeParse(payload);
        if (!parsed.success) {
          return Response.json({ error: "Invalid request shape" }, { status: 400 });
        }

        const { mode, input } = parsed.data;
        if (!isAiMode(mode)) {
          return Response.json({ error: `Unknown AI mode: ${mode}` }, { status: 400 });
        }

        const cfg = AI_MODES[mode];
        const prompt = cfg.buildPrompt(input);
        if (!prompt.trim()) {
          return Response.json({ error: "Please provide input." }, { status: 400 });
        }

        // Optional authentication check for quota & entitlements
        let userId: string | null = null;
        let isPro = false;

        const authHeader = request.headers.get("authorization");
        if (authHeader && authHeader.startsWith("Bearer ")) {
          const token = authHeader.slice(7).trim();
          if (token) {
            try {
              const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
              const {
                data: { user },
              } = await supabaseAdmin.auth.getUser(token);
              if (user) {
                userId = user.id;

                // 1. Staff / admin auto-grant
                try {
                  const { data: isStaff } = await supabaseAdmin.rpc("is_staff", {
                    _user_id: user.id,
                  });
                  if (isStaff) isPro = true;
                } catch {}

                // 2. User entitlements check
                if (!isPro) {
                  const { data: entitlements } = await supabaseAdmin
                    .from("user_entitlements")
                    .select("entitlement_key,active,expires_at")
                    .eq("user_id", user.id)
                    .eq("active", true);

                  const nowIso = new Date().toISOString();
                  const proKeys = [
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

                  for (const r of entitlements ?? []) {
                    if (!r.expires_at || r.expires_at > nowIso) {
                      if (proKeys.includes(r.entitlement_key.toLowerCase())) {
                        isPro = true;
                        break;
                      }
                    }
                  }
                }

                // 3. Paid orders fallback check
                if (!isPro) {
                  const { data: paidOrders } = await supabaseAdmin
                    .from("orders")
                    .select("id,plan_id,status,created_at,product_type")
                    .eq("user_id", user.id)
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
                }
              }
            } catch (authErr) {
              console.warn("[api/ai] Auth check failed:", authErr);
            }
          }
        }

        // Quota enforcement for AI Astrologer:
        // Free users (guest or free logged-in users) get max 3 questions.
        // Pro / Premium / Lifetime account users get unlimited questions.
        if (mode === "ai-astrologer") {
          const clientQuestionsUsed = Number(request.headers.get("x-questions-used") || "0");

          if (!isPro) {
            let serverUsageCount = 0;
            if (userId) {
              try {
                const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
                const { count } = await supabaseAdmin
                  .from("ai_usage_logs")
                  .select("id", { count: "exact", head: true })
                  .eq("user_id", userId)
                  .eq("feature_key", "tool:ai-astrologer")
                  .eq("success", true);
                serverUsageCount = count ?? 0;
              } catch {}
            }

            const totalUsed = Math.max(serverUsageCount, clientQuestionsUsed);
            if (totalUsed >= 3) {
              return Response.json(
                {
                  error:
                    "मुफ़्त सवालों की सीमा (3 सवाल) समाप्त हो चुकी है। AI ज्योतिषी से असीमित सवाल पूछने के लिए Pro या Premium में अपग्रेड करें। (Free limit of 3 questions reached. Upgrade to Pro for unlimited questions.)",
                  limitReached: true,
                  used: totalUsed,
                  limit: 3,
                },
                { status: 402 },
              );
            }
          }
        }

        try {
          const { callAi } = await import("@/lib/ai-router.server");
          const result = await callAi({
            feature: `tool:${mode}`,
            system: cfg.system,
            prompt,
            userId,
          });
          return Response.json({
            text: result.text,
            provider: result.provider,
            model: result.model,
            isPro,
            limit: isPro ? null : 3,
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : "AI request failed";
          const status = /rate limit|429/i.test(message)
            ? 429
            : /402|credit|payment/i.test(message)
              ? 402
              : /no enabled ai providers/i.test(message)
                ? 503
                : 500;
          return Response.json({ error: message }, { status });
        }
      },
    },
  },
});
