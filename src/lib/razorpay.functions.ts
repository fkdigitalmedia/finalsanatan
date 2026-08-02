/**
 * Razorpay server functions — create an order (Razorpay Orders API) and
 * verify the payment signature after checkout. Both use RAZORPAY_KEY_ID +
 * RAZORPAY_KEY_SECRET from environment. Frontend uses checkout.js with the
 * returned order id.
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

export const createRazorpayOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: { planId: string; customer?: { name?: string; email?: string; phone?: string } }) =>
      input,
  )
  .handler(async ({ data, context }) => {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      throw new Error("Razorpay is not configured yet. Please contact support.");
    }
    const plan = await fetchPlan(data.planId);

    // Razorpay Orders API — amount in the smallest currency unit (paise for INR)
    const receipt = `plan_${plan.slug}_${Date.now()}`.slice(0, 40);
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: plan.price_cents, // price_cents already stored as smallest unit
        currency: plan.currency || "INR",
        receipt,
        notes: {
          plan_id: plan.id,
          plan_slug: plan.slug,
          product_type: plan.product_type,
        },
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error("Razorpay order failed", res.status, body);
      throw new Error(`Razorpay order failed [${res.status}]`);
    }
    const order = (await res.json()) as { id: string; amount: number; currency: string };

    // Record local order
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    await supabaseAdmin.from("orders").insert({
      user_id: context.userId,
      plan_id: plan.id,
      provider: "razorpay",
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
      keyId,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      planName: plan.name,
    };
  });

export const verifyRazorpayPayment = createServerFn({ method: "POST" })
  .inputValidator(
    (input: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }) => input,
  )
  .handler(async ({ data }) => {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) throw new Error("Razorpay is not configured");

    const expected = createHmac("sha256", keySecret)
      .update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`)
      .digest("hex");
    const sig = Buffer.from(data.razorpay_signature);
    const exp = Buffer.from(expected);
    if (sig.length !== exp.length || !timingSafeEqual(sig, exp)) {
      throw new Error("Invalid payment signature");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Find local order
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("id,user_id,plan_id,product_type")
      .eq("provider_order_id", data.razorpay_order_id)
      .maybeSingle();

    if (order) {
      await supabaseAdmin
        .from("orders")
        .update({
          status: "paid",
          provider_payment_id: data.razorpay_payment_id,
          provider_signature: data.razorpay_signature,
        })
        .eq("id", order.id);

      // Grant entitlement if plan defines one and user is logged in
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
    }

    // Return download url (if any) so frontend can redirect
    let downloadUrl: string | null = null;
    if (order?.plan_id) {
      const { data: plan } = await supabaseAdmin
        .from("subscription_plans")
        .select("download_url")
        .eq("id", order.plan_id)
        .maybeSingle();
      downloadUrl = plan?.download_url ?? null;
    }

    return { ok: true, downloadUrl };
  });

export const listPublicPlans = createServerFn({ method: "GET" }).handler(async () => {
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
    .from("subscription_plans")
    .select(
      "id,name,slug,description,price_cents,currency,interval,product_type,features,cta_label,featured,sort_order,download_url,provider_price_id",
    )
    .eq("active", true)
    .order("sort_order", { ascending: true })
    .order("price_cents", { ascending: true });
  if (error) throw error;
  return data ?? [];
});
