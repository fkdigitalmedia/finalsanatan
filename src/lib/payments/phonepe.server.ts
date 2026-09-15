/**
 * PhonePe Payment Gateway Server Engine (Standard Pay Page / Hermes API).
 *
 * Implements:
 * - Payment initiation (/pg/v1/pay)
 * - Status check (/pg/v1/status/{merchantId}/{merchantTransactionId})
 * - SHA256 Checksum generation and verification (X-VERIFY)
 * - Server-to-server webhook verification
 * - Order fulfillment & entitlement provisioning
 */
import { createHash, timingSafeEqual } from "crypto";
import type { GatewayRow } from "./gateways.server";

export const PHONEPE_PROD_URL = "https://api.phonepe.com/apis/hermes";
export const PHONEPE_UAT_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox";

export function getPhonePeBaseUrl(mode: "test" | "live"): string {
  return mode === "live" ? PHONEPE_PROD_URL : PHONEPE_UAT_URL;
}

/**
 * Calculates PhonePe X-VERIFY header:
 * SHA256(data + endpoint + saltKey) + "###" + saltIndex
 */
export function calculatePhonePeChecksum(
  data: string,
  endpoint: string,
  saltKey: string,
  saltIndex: string | number,
): string {
  const toHash = `${data}${endpoint}${saltKey}`;
  const hash = createHash("sha256").update(toHash).digest("hex");
  return `${hash}###${saltIndex}`;
}

/**
 * Validates incoming PhonePe X-VERIFY header using timing-safe comparison.
 */
export function verifyPhonePeChecksum(
  data: string,
  endpoint: string,
  saltKey: string,
  saltIndex: string | number,
  receivedXVerify: string,
): boolean {
  if (!receivedXVerify) return false;
  const expected = calculatePhonePeChecksum(data, endpoint, saltKey, saltIndex);
  const bufExpected = Buffer.from(expected);
  const bufReceived = Buffer.from(receivedXVerify);
  if (bufExpected.length !== bufReceived.length) return false;
  return timingSafeEqual(bufExpected, bufReceived);
}

export interface InitiatePhonePePaymentParams {
  gateway: GatewayRow;
  orderId: string;
  amountCents: number; // in paise / cents
  userId: string;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  siteUrl: string;
}

export interface InitiatePhonePePaymentResult {
  checkoutUrl: string;
  merchantTransactionId: string;
}

/**
 * Initiates standard checkout payment request with PhonePe (/pg/v1/pay).
 */
export async function initiatePhonePePayment(
  params: InitiatePhonePePaymentParams,
): Promise<InitiatePhonePePaymentResult> {
  const { gateway, orderId, amountCents, userId, customer, siteUrl } = params;

  const merchantId = gateway.credentials?.merchant_id;
  const saltKey = gateway.credentials?.salt_key;
  const saltIndex = gateway.credentials?.salt_index || "1";

  if (!merchantId || !saltKey) {
    throw new Error(
      `PhonePe gateway "${gateway.display_name}" is missing merchant_id or salt_key. Configure it in Admin → Payment Gateways.`,
    );
  }

  const baseUrl = getPhonePeBaseUrl(gateway.mode);
  const endpoint = "/pg/v1/pay";

  // Sanitize user id to alphanumeric + hyphen/underscore (max 36 chars)
  const merchantUserId = (userId || "GUEST").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 36);

  // Phone number (10 digits) if available
  const cleanPhone = customer?.phone?.replace(/\D/g, "").slice(-10);

  const payload = {
    merchantId,
    merchantTransactionId: orderId,
    merchantUserId,
    amount: amountCents, // Amount in paise
    redirectUrl: `${siteUrl}/api/payments/phonepe/callback?orderId=${encodeURIComponent(orderId)}`,
    redirectMode: "POST",
    callbackUrl: `${siteUrl}/api/public/phonepe-webhook`,
    mobileNumber: cleanPhone && cleanPhone.length === 10 ? cleanPhone : undefined,
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };

  const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");
  const checksum = calculatePhonePeChecksum(base64Payload, endpoint, saltKey, saltIndex);

  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
      Accept: "application/json",
    },
    body: JSON.stringify({ request: base64Payload }),
  });

  const resText = await response.text();
  let json: {
    success: boolean;
    code: string;
    message: string;
    data?: {
      merchantId: string;
      merchantTransactionId: string;
      instrumentResponse?: {
        type: string;
        redirectInfo?: {
          url: string;
          method: string;
        };
      };
    };
  };

  try {
    json = JSON.parse(resText);
  } catch {
    console.error("[PhonePe] Failed to parse response:", resText);
    throw new Error(`PhonePe gateway returned invalid response [${response.status}]`);
  }

  if (!response.ok || !json.success) {
    console.error("[PhonePe] Order initiation failed:", json);
    throw new Error(`PhonePe error: ${json.message || json.code || "Payment initiation failed"}`);
  }

  const checkoutUrl = json.data?.instrumentResponse?.redirectInfo?.url;
  if (!checkoutUrl) {
    throw new Error("PhonePe redirect URL missing from payment response");
  }

  return {
    checkoutUrl,
    merchantTransactionId: orderId,
  };
}

export interface PhonePeStatusResult {
  success: boolean;
  code: string;
  state: "COMPLETED" | "FAILED" | "PENDING";
  transactionId?: string;
  amount?: number;
  message?: string;
  raw: unknown;
}

/**
 * Query PhonePe transaction status (/pg/v1/status/{merchantId}/{merchantTransactionId}).
 */
export async function checkPhonePeStatus(
  gateway: GatewayRow,
  merchantTransactionId: string,
): Promise<PhonePeStatusResult> {
  const merchantId = gateway.credentials?.merchant_id;
  const saltKey = gateway.credentials?.salt_key;
  const saltIndex = gateway.credentials?.salt_index || "1";

  if (!merchantId || !saltKey) {
    throw new Error("PhonePe gateway credentials incomplete");
  }

  const baseUrl = getPhonePeBaseUrl(gateway.mode);
  const endpoint = `/pg/v1/status/${merchantId}/${merchantTransactionId}`;
  const checksum = calculatePhonePeChecksum("", endpoint, saltKey, saltIndex);

  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
      "X-MERCHANT-ID": merchantId,
      Accept: "application/json",
    },
  });

  const resText = await response.text();
  let json: {
    success: boolean;
    code: string;
    message: string;
    data?: {
      merchantId: string;
      merchantTransactionId: string;
      transactionId: string;
      amount: number;
      state: string;
      responseCode: string;
    };
  };

  try {
    json = JSON.parse(resText);
  } catch {
    console.error("[PhonePe] Status check parse error:", resText);
    throw new Error(`PhonePe status check returned invalid response [${response.status}]`);
  }

  const state =
    json.code === "PAYMENT_SUCCESS" || json.data?.state === "COMPLETED"
      ? "COMPLETED"
      : json.code === "PAYMENT_PENDING"
        ? "PENDING"
        : "FAILED";

  return {
    success: json.success && state === "COMPLETED",
    code: json.code,
    state,
    transactionId: json.data?.transactionId,
    amount: json.data?.amount,
    message: json.message,
    raw: json,
  };
}

/**
 * Fulfills an order in Supabase and provisions the corresponding user entitlement.
 * Idempotent: safe to run from both browser callback and webhook simultaneously.
 */
export async function fulfillPhonePeOrder(
  orderId: string,
  transactionId?: string,
  signature?: string,
): Promise<{ ok: boolean; downloadUrl: string | null }> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data: order, error: orderErr } = await supabaseAdmin
    .from("orders")
    .select("id,user_id,plan_id,status,product_type")
    .eq("provider_order_id", orderId)
    .maybeSingle();

  if (orderErr || !order) {
    throw new Error(`Order not found for transaction id: ${orderId}`);
  }

  // Update order status if not already marked paid
  if (order.status !== "paid") {
    await supabaseAdmin
      .from("orders")
      .update({
        status: "paid",
        provider_payment_id: transactionId ?? null,
        provider_signature: signature ?? null,
      })
      .eq("id", order.id);
  }

  // Provision entitlement
  if (order.user_id && order.plan_id) {
    const { data: plan } = await supabaseAdmin
      .from("subscription_plans")
      .select("entitlement_key,product_type,download_url")
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

    return { ok: true, downloadUrl: plan?.download_url ?? null };
  }

  return { ok: true, downloadUrl: null };
}
