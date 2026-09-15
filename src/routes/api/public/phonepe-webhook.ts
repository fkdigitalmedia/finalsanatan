/**
 * PhonePe Server-to-Server Webhook endpoint.
 *
 * Receives asynchronous server notifications from PhonePe when payment state changes.
 * Validates X-VERIFY signature, decodes Base64 payload, and marks orders as paid.
 * Configure in PhonePe Developer Dashboard: <SITE_URL>/api/public/phonepe-webhook
 */
import { createFileRoute } from "@tanstack/react-router";
import { verifyPhonePeChecksum, fulfillPhonePeOrder } from "@/lib/payments/phonepe.server";

export const Route = createFileRoute("/api/public/phonepe-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const receivedXVerify = request.headers.get("x-verify") ?? "";
        const rawBody = await request.text();

        let jsonBody: { response?: string };
        try {
          jsonBody = JSON.parse(rawBody);
        } catch {
          return new Response("Invalid JSON body", { status: 400 });
        }

        const base64Response = jsonBody.response;
        if (!base64Response) {
          return new Response("Missing response field in webhook payload", { status: 400 });
        }

        // Decode payload to inspect merchantTransactionId
        let decodedPayload: {
          success: boolean;
          code: string;
          message?: string;
          data?: {
            merchantId?: string;
            merchantTransactionId?: string;
            transactionId?: string;
            amount?: number;
            state?: string;
          };
        };

        try {
          const decodedStr = Buffer.from(base64Response, "base64").toString("utf-8");
          decodedPayload = JSON.parse(decodedStr);
        } catch {
          return new Response("Failed to decode base64 payload", { status: 400 });
        }

        const merchantTxnId = decodedPayload.data?.merchantTransactionId;
        if (!merchantTxnId) {
          return new Response("Missing merchantTransactionId", { status: 400 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { loadGatewayById } = await import("@/lib/payments/gateways.server");

        // Find the matching order to fetch its gateway credentials
        const { data: order } = await supabaseAdmin
          .from("orders")
          .select("id,gateway_id,provider,status")
          .eq("provider_order_id", merchantTxnId)
          .maybeSingle();

        if (!order) {
          console.warn("[PhonePe Webhook] Order not found for txn:", merchantTxnId);
          return new Response("Order not found", { status: 200 }); // Return 200 so PhonePe doesn't retry indefinitely
        }

        const gateway = order.gateway_id ? await loadGatewayById(order.gateway_id) : null;
        const saltKey = gateway?.credentials?.salt_key;
        const saltIndex = gateway?.credentials?.salt_index || "1";

        if (!saltKey) {
          console.error("[PhonePe Webhook] Missing saltKey for gateway:", order.gateway_id);
          return new Response("Gateway credentials missing", { status: 500 });
        }

        // Verify checksum on the raw base64 string
        const isValid = verifyPhonePeChecksum(
          base64Response,
          "",
          saltKey,
          saltIndex,
          receivedXVerify,
        );

        if (!isValid) {
          console.error("[PhonePe Webhook] Invalid X-VERIFY signature for txn:", merchantTxnId);
          return new Response("Invalid signature", { status: 401 });
        }

        // If payment succeeded, fulfill order and provision entitlement
        if (
          decodedPayload.success &&
          (decodedPayload.code === "PAYMENT_SUCCESS" ||
            decodedPayload.data?.state === "COMPLETED")
        ) {
          await fulfillPhonePeOrder(
            merchantTxnId,
            decodedPayload.data?.transactionId,
            receivedXVerify,
          );
        } else if (
          decodedPayload.code === "PAYMENT_ERROR" ||
          decodedPayload.data?.state === "FAILED"
        ) {
          await supabaseAdmin
            .from("orders")
            .update({ status: "failed" })
            .eq("id", order.id);
        }

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
