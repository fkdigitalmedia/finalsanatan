/**
 * Lemon Squeezy webhook — verifies HMAC-SHA256 signature over raw body
 * using the gateway's `webhook_secret`, then marks the matching order as
 * paid and grants the entitlement. Configure the endpoint in Lemon
 * Squeezy dashboard: <site>/api/public/lemonsqueezy-webhook, and paste
 * the same secret into Admin → Payment Gateways → Lemon Squeezy.
 */
import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";

export const Route = createFileRoute("/api/public/lemonsqueezy-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const signature = request.headers.get("x-signature") ?? "";
        const raw = await request.text();

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        // Find the active LS gateway to get its webhook secret
        const { data: gw } = await supabaseAdmin
          .from("payment_gateways")
          .select("id,credentials")
          .eq("provider", "lemonsqueezy")
          .eq("active", true)
          .order("is_default", { ascending: false })
          .limit(1)
          .maybeSingle();
        const secret = (gw?.credentials as Record<string, string> | null)?.webhook_secret;
        if (!secret) return new Response("Webhook secret missing", { status: 500 });

        const expected = createHmac("sha256", secret).update(raw).digest("hex");
        try {
          const a = Buffer.from(signature, "hex");
          const b = Buffer.from(expected, "hex");
          if (a.length !== b.length || !timingSafeEqual(a, b)) {
            return new Response("Invalid signature", { status: 401 });
          }
        } catch {
          return new Response("Invalid signature", { status: 401 });
        }

        const payload = JSON.parse(raw) as {
          meta: {
            event_name: string;
            custom_data?: { order_id?: string; user_id?: string; plan_id?: string };
          };
          data: { id: string; attributes: Record<string, unknown> };
        };

        const event = payload.meta?.event_name ?? "";
        const orderId = payload.meta?.custom_data?.order_id;
        if (!orderId) return new Response("Missing order_id", { status: 200 });

        if (
          event === "order_created" ||
          event === "subscription_created" ||
          event === "subscription_payment_success"
        ) {
          await supabaseAdmin
            .from("orders")
            .update({
              status: "paid",
              provider_payment_id: String(payload.data.id),
            })
            .eq("id", orderId);

          const { data: order } = await supabaseAdmin
            .from("orders")
            .select("user_id,plan_id")
            .eq("id", orderId)
            .maybeSingle();

          if (order?.user_id && order.plan_id) {
            const { data: plan } = await supabaseAdmin
              .from("subscription_plans")
              .select("entitlement_key,product_type")
              .eq("id", order.plan_id)
              .maybeSingle();
            if (plan?.entitlement_key) {
              await supabaseAdmin.from("user_entitlements").upsert(
                {
                  user_id: order.user_id,
                  entitlement_key: plan.entitlement_key,
                  plan_id: order.plan_id,
                  order_id: orderId,
                  source: plan.product_type,
                  active: true,
                },
                { onConflict: "user_id,entitlement_key" },
              );
            }
          }
        }

        return new Response("ok", { status: 200 });
      },
    },
  },
});
