/**
 * Generic payment server functions — dispatch to the correct provider
 * based on the `payment_gateways` row selected by the caller (or the
 * default active gateway). Credentials are read from the DB, never env.
 *
 * Currently wired providers: razorpay. Other providers (stripe, paypal,
 * cashfree, phonepe, paytm) are staged — admin can save credentials but
 * order creation throws a clear "not yet wired" error until each is
 * implemented in a follow-up.
 */
import { createServerFn } from "@tanstack/react-start";
import { createHmac, timingSafeEqual } from "crypto";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type PlanRow = {
  id: string;
  name: string;
  slug: string;
  price_cents: number;
  currency: string;
  product_type: "subscription" | "one_time";
  active: boolean;
  download_url: string | null;
  entitlement_key: string | null;
};

async function fetchPlan(planId: string): Promise<PlanRow> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("subscription_plans")
    .select("id,name,slug,price_cents,currency,product_type,active,download_url,entitlement_key")
    .eq("id", planId)
    .maybeSingle();
  if (error || !data) throw new Error("Plan not found");
  if (!data.active) throw new Error("Plan not available");
  return data as PlanRow;
}

/** Public list of active gateways — used by the pricing page to render
 *  a provider picker. Only exposes safe metadata (no credentials). */
export const listPublicGateways = createServerFn({ method: "GET" }).handler(async () => {
  const { createClient } = await import("@supabase/supabase-js");
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  const supa = createClient(process.env.SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
  const { data, error } = await supa
    .from("public_payment_gateways")
    .select(
      "id,provider,display_name,mode,is_default,sort_order,public_config,supported_currencies",
    )
    .order("is_default", { ascending: false })
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
});

/**
 * Create a checkout order via the selected gateway (or the default one).
 * Returns provider-agnostic + provider-specific fields the frontend needs
 * to open the checkout modal / redirect.
 */
export const createPaymentOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: {
      planId: string;
      gatewayId?: string;
      customer?: { name?: string; email?: string; phone?: string };
    }) => input,
  )
  .handler(async ({ data, context }) => {
    const { loadGatewayById, loadDefaultGateway, requireCredential } =
      await import("@/lib/payments/gateways.server");

    const gateway = data.gatewayId
      ? await loadGatewayById(data.gatewayId)
      : await loadDefaultGateway();
    if (!gateway || !gateway.active) {
      throw new Error("No active payment gateway is configured. Ask an admin to enable one.");
    }

    const plan = await fetchPlan(data.planId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // ─── Razorpay ─────────────────────────────────────────────────
    if (gateway.provider === "razorpay") {
      const keyId = requireCredential(gateway, "key_id");
      const keySecret = requireCredential(gateway, "key_secret");
      const receipt = `plan_${plan.slug}_${Date.now()}`.slice(0, 40);
      const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
      const res = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Basic ${auth}` },
        body: JSON.stringify({
          amount: plan.price_cents,
          currency: plan.currency || "INR",
          receipt,
          notes: { plan_id: plan.id, plan_slug: plan.slug, product_type: plan.product_type },
        }),
      });
      if (!res.ok) {
        const body = await res.text();
        console.error("Razorpay order failed", res.status, body);
        throw new Error(`Razorpay order failed [${res.status}]: ${body}`);
      }
      const order = (await res.json()) as { id: string; amount: number; currency: string };

      await supabaseAdmin.from("orders").insert({
        user_id: context.userId,
        plan_id: plan.id,
        provider: "razorpay",
        gateway_id: gateway.id,
        provider_order_id: order.id,
        amount_cents: plan.price_cents,
        currency: plan.currency || "INR",
        status: "created",
        product_type: plan.product_type,
        customer_email: data.customer?.email ?? null,
        customer_name: data.customer?.name ?? null,
        customer_phone: data.customer?.phone ?? null,
      });

      return {
        provider: "razorpay" as const,
        gatewayId: gateway.id,
        keyId,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        planName: plan.name,
      };
    }

    // ─── Lemon Squeezy (global / USD) ─────────────────────────────
    if (gateway.provider === "lemonsqueezy") {
      const apiKey = requireCredential(gateway, "api_key");
      const storeId = requireCredential(gateway, "store_id");

      // Look up variant id: stored on the plan row (provider_price_id)
      const { data: planFull } = await supabaseAdmin
        .from("subscription_plans")
        .select("provider_price_id")
        .eq("id", plan.id)
        .maybeSingle();
      const variantId = planFull?.provider_price_id;
      if (!variantId) {
        throw new Error(
          `Plan "${plan.name}" has no Lemon Squeezy variant id. Set it in Admin → Monetization (Provider price ID).`,
        );
      }

      // Record order first so the webhook can find it via custom_data.order_id
      const { data: orderRow, error: orderErr } = await supabaseAdmin
        .from("orders")
        .insert({
          user_id: context.userId,
          plan_id: plan.id,
          provider: "lemonsqueezy",
          gateway_id: gateway.id,
          amount_cents: plan.price_cents,
          currency: plan.currency || "USD",
          status: "created",
          product_type: plan.product_type,
          customer_email: data.customer?.email ?? null,
          customer_name: data.customer?.name ?? null,
          customer_phone: data.customer?.phone ?? null,
        })
        .select("id")
        .single();
      if (orderErr || !orderRow) throw new Error("Failed to record order");

      const res = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
        method: "POST",
        headers: {
          Accept: "application/vnd.api+json",
          "Content-Type": "application/vnd.api+json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          data: {
            type: "checkouts",
            attributes: {
              checkout_data: {
                email: data.customer?.email ?? undefined,
                name: data.customer?.name ?? undefined,
                custom: { order_id: orderRow.id, user_id: context.userId, plan_id: plan.id },
              },
              product_options: { name: plan.name },
            },
            relationships: {
              store: { data: { type: "stores", id: String(storeId) } },
              variant: { data: { type: "variants", id: String(variantId) } },
            },
          },
        }),
      });
      if (!res.ok) {
        const body = await res.text();
        console.error("Lemon Squeezy checkout failed", res.status, body);
        throw new Error(`Lemon Squeezy checkout failed [${res.status}]`);
      }
      const json = (await res.json()) as {
        data: { id: string; attributes: { url: string } };
      };

      await supabaseAdmin
        .from("orders")
        .update({ provider_order_id: json.data.id })
        .eq("id", orderRow.id);

      return {
        provider: "lemonsqueezy" as const,
        gatewayId: gateway.id,
        checkoutUrl: json.data.attributes.url,
        planName: plan.name,
      };
    }

    // ─── Other providers — staged, not yet wired ──────────────────
    throw new Error(
      `Provider "${gateway.provider}" is saved but not yet wired for checkout. Please choose Razorpay or Lemon Squeezy.`,
    );
  });

/**
 * Verify payment signature. Signature format is provider-specific — we
 * look up the gateway on the order row we recorded during create.
 */
export const verifyPayment = createServerFn({ method: "POST" })
  .inputValidator(
    (input: {
      provider: "razorpay";
      // Razorpay checkout returns these keys after success
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }) => input,
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Look up the order + its gateway (credentials live there, not env)
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("id,user_id,plan_id,product_type,gateway_id,provider")
      .eq("provider_order_id", data.razorpay_order_id)
      .maybeSingle();
    if (!order) throw new Error("Order not found");

    if (data.provider === "razorpay") {
      const { loadGatewayById, requireCredential } = await import("@/lib/payments/gateways.server");
      // Fall back to the default gateway if the order didn't record one
      const gateway = order.gateway_id ? await loadGatewayById(order.gateway_id) : null;
      if (!gateway) throw new Error("Gateway config missing for this order");
      const keySecret = requireCredential(gateway, "key_secret");

      const expected = createHmac("sha256", keySecret)
        .update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`)
        .digest("hex");
      const sig = Buffer.from(data.razorpay_signature);
      const exp = Buffer.from(expected);
      if (sig.length !== exp.length || !timingSafeEqual(sig, exp)) {
        throw new Error("Invalid payment signature");
      }
    }

    await supabaseAdmin
      .from("orders")
      .update({
        status: "paid",
        provider_payment_id: data.razorpay_payment_id,
        provider_signature: data.razorpay_signature,
      })
      .eq("id", order.id);

    if (order.user_id && order.plan_id) {
      const { data: plan } = await supabaseAdmin
        .from("subscription_plans")
        .select("entitlement_key,download_url,product_type")
        .eq("id", order.plan_id)
        .maybeSingle();
      if (plan?.entitlement_key) {
        await supabaseAdmin.from("user_entitlements").upsert(
          {
            user_id: order.user_id,
            entitlement_key: plan.entitlement_key,
            plan_id: order.plan_id,
            order_id: order.id,
            source: plan.product_type,
            active: true,
          },
          { onConflict: "user_id,entitlement_key" },
        );
      }
    }

    let downloadUrl: string | null = null;
    if (order.plan_id) {
      const { data: plan } = await supabaseAdmin
        .from("subscription_plans")
        .select("download_url")
        .eq("id", order.plan_id)
        .maybeSingle();
      downloadUrl = plan?.download_url ?? null;
    }

    return { ok: true, downloadUrl };
  });

/** Return the list of active entitlement keys for the signed-in user.
 *  Used by client gates (e.g. "kundli_premium_report") to show/hide
 *  premium features. Requires auth via the RLS-scoped supabase client. */
export const getMyEntitlements = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const nowIso = new Date().toISOString();
    const { data, error } = await context.supabase
      .from("user_entitlements")
      .select("entitlement_key,active,expires_at")
      .eq("user_id", context.userId)
      .eq("active", true);
    if (error) throw new Error(error.message);
    const keys = (data ?? [])
      .filter((r) => !r.expires_at || r.expires_at > nowIso)
      .map((r) => r.entitlement_key);
    return { entitlements: keys };
  });
