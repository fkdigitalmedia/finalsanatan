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
      GET: async () => {
        return new Response(
          JSON.stringify({
            status: "active",
            service: "phonepe-webhook",
            endpoint: "/api/public/phonepe-webhook",
            message: "PhonePe S2S Webhook listener is live and operational.",
            timestamp: new Date().toISOString(),
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      },
      POST: async ({ request }) => {
        const receivedXVerify =
          request.headers.get("x-verify") ||
          request.headers.get("X-VERIFY") ||
          "";

        const rawBody = await request.text();
        const contentType = request.headers.get("content-type") || "";

        let base64Response = "";

        // Parse JSON or urlencoded payload
        if (rawBody) {
          try {
            const jsonBody = JSON.parse(rawBody);
            base64Response = jsonBody.response || "";
          } catch {
            // Try urlencoded parse if rawBody contains response=
            if (rawBody.includes("response=")) {
              const params = new URLSearchParams(rawBody);
              base64Response = params.get("response") || "";
            }
          }
        }

        if (!base64Response) {
          // If PhonePe sends direct JSON test ping or handshake during webhook creation:
          try {
            const parsed = JSON.parse(rawBody);
            return new Response(
              JSON.stringify({ success: true, message: "Webhook test ping acknowledged", received: parsed }),
              { status: 200, headers: { "Content-Type": "application/json" } },
            );
          } catch {
            return new Response(
              JSON.stringify({ success: false, message: "Missing response field in webhook payload" }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }
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
          return new Response(
            JSON.stringify({ success: false, message: "Failed to decode base64 payload" }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }

        const merchantTxnId = decodedPayload.data?.merchantTransactionId;
        if (!merchantTxnId) {
          // If PhonePe sends a test base64 payload during registration without a live transaction:
          return new Response(
            JSON.stringify({ success: true, message: "Test webhook acknowledged successfully" }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          );
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { loadGatewayById } = await import("@/lib/payments/gateways.server");
        type GatewayRow = import("@/lib/payments/gateways.server").GatewayRow;

        // Find matching order if available
        const { data: order } = await supabaseAdmin
          .from("orders")
          .select("id,gateway_id,provider,status")
          .eq("provider_order_id", merchantTxnId)
          .maybeSingle();

        // Load gateway from order or fallback to active PhonePe gateway
        let gateway: GatewayRow | null = order?.gateway_id
          ? await loadGatewayById(order.gateway_id)
          : null;

        if (!gateway) {
          const { data: activeGw } = await supabaseAdmin
            .from("payment_gateways")
            .select("*")
            .eq("provider", "phonepe")
            .eq("active", true)
            .order("is_default", { ascending: false })
            .limit(1)
            .maybeSingle();
          gateway = (activeGw as unknown as GatewayRow) ?? null;
        }

        const saltKey = gateway?.credentials?.salt_key;
        const saltIndex = gateway?.credentials?.salt_index || "1";

        // If credentials are configured, verify checksum on the raw base64 string
        if (saltKey && receivedXVerify) {
          const isValid = verifyPhonePeChecksum(
            base64Response,
            "",
            saltKey,
            saltIndex,
            receivedXVerify,
          );

          if (!isValid) {
            console.error("[PhonePe Webhook] Invalid X-VERIFY signature for txn:", merchantTxnId);
            return new Response(
              JSON.stringify({ success: false, message: "Invalid X-VERIFY signature" }),
              { status: 401, headers: { "Content-Type": "application/json" } },
            );
          }
        }

        // If order was not found (e.g. PhonePe test notification ping), acknowledge 200
        if (!order) {
          console.warn("[PhonePe Webhook] Order not found for txn:", merchantTxnId);
          return new Response(
            JSON.stringify({ success: true, message: "Webhook acknowledged (order not found or test event)" }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          );
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
