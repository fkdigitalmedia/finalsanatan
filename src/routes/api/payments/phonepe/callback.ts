/**
 * PhonePe browser return callback endpoint.
 *
 * Handles redirection back to SanatanTools after user completes or cancels
 * payment on PhonePe's hosted pay page. Supports both POST and GET redirects.
 */
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/payments/phonepe/callback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        return handlePhonePeCallback(request);
      },
      POST: async ({ request }) => {
        return handlePhonePeCallback(request);
      },
    },
  },
});

async function handlePhonePeCallback(request: Request): Promise<Response> {
  const url = new URL(request.url);
  let orderId = url.searchParams.get("orderId");

  // If orderId is not in query params, inspect form-data/json body
  if (!orderId && request.method === "POST") {
    try {
      const contentType = request.headers.get("content-type") || "";
      if (contentType.includes("application/x-www-form-urlencoded")) {
        const formData = await request.formData();
        orderId =
          (formData.get("transactionId") as string) ||
          (formData.get("merchantTransactionId") as string) ||
          null;
      } else if (contentType.includes("application/json")) {
        const json = await request.json();
        orderId = json.transactionId || json.merchantTransactionId || null;
      }
    } catch {
      // Body may be empty or unparseable, continue
    }
  }

  if (!orderId) {
    console.error("[PhonePe Callback] Missing orderId in request");
    return Response.redirect(new URL("/pricing?payment=error", url.origin).toString(), 303);
  }

  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { loadGatewayById } = await import("@/lib/payments/gateways.server");
    const { checkPhonePeStatus, fulfillPhonePeOrder } =
      await import("@/lib/payments/phonepe.server");

    // Retrieve order
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("id,status,gateway_id,provider")
      .eq("provider_order_id", orderId)
      .maybeSingle();

    if (!order) {
      console.error("[PhonePe Callback] Order not found:", orderId);
      return Response.redirect(new URL("/pricing?payment=not_found", url.origin).toString(), 303);
    }

    // If order is already paid, redirect straight to dashboard
    if (order.status === "paid") {
      return Response.redirect(
        new URL(`/dashboard?payment=success&orderId=${orderId}`, url.origin).toString(),
        303,
      );
    }

    const gateway = order.gateway_id ? await loadGatewayById(order.gateway_id) : null;
    if (!gateway) {
      console.error("[PhonePe Callback] Gateway config not found for order:", order.id);
      return Response.redirect(new URL("/pricing?payment=error", url.origin).toString(), 303);
    }

    // Verify payment status with PhonePe
    const statusResult = await checkPhonePeStatus(gateway, orderId);

    if (statusResult.success && statusResult.state === "COMPLETED") {
      const fulfillment = await fulfillPhonePeOrder(orderId, statusResult.transactionId);
      const targetUrl = fulfillment.downloadUrl
        ? fulfillment.downloadUrl
        : `/dashboard?payment=success&orderId=${orderId}`;

      return Response.redirect(new URL(targetUrl, url.origin).toString(), 303);
    }

    // Payment failed or pending
    if (statusResult.state === "FAILED") {
      await supabaseAdmin
        .from("orders")
        .update({ status: "failed" })
        .eq("id", order.id);

      return Response.redirect(
        new URL(`/pricing?payment=failed&orderId=${orderId}`, url.origin).toString(),
        303,
      );
    }

    // Still pending
    return Response.redirect(
      new URL(`/dashboard?payment=pending&orderId=${orderId}`, url.origin).toString(),
      303,
    );
  } catch (err) {
    console.error("[PhonePe Callback] Error processing callback:", err);
    return Response.redirect(new URL("/pricing?payment=error", url.origin).toString(), 303);
  }
}
