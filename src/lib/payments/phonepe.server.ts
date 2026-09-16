/**
 * PhonePe Payment Gateway Server Engine
 *
 * Supports BOTH:
 *  - V1 (legacy): Salt Key + SHA256 X-VERIFY → /pg/v1/pay
 *  - V2 (new):    OAuth Client ID/Secret → /checkout/v2/pay
 *
 * Auto-detects version from gateway credentials:
 *  - If credentials contain `client_id` → V2 mode
 *  - If credentials contain `salt_key`  → V1 mode (legacy fallback)
 *
 * Admin → Payment Gateways → PhonePe credentials:
 *  V2 fields: client_id, client_secret, client_version
 *  V1 fields: merchant_id, salt_key, salt_index
 */
import { createHash, timingSafeEqual } from "crypto";
import type { GatewayRow } from "./gateways.server";

// ── Base URLs ─────────────────────────────────────────────────────────────────

// V1 (legacy)
export const PHONEPE_PROD_URL = "https://api.phonepe.com/apis/hermes";
export const PHONEPE_UAT_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox";

// V2 (new OAuth-based)
export const PHONEPE_V2_PROD_PAY_URL = "https://api.phonepe.com/apis/pg/checkout/v2/pay";
export const PHONEPE_V2_UAT_PAY_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay";
export const PHONEPE_V2_PROD_STATUS_URL = "https://api.phonepe.com/apis/pg/checkout/v2/order";
export const PHONEPE_V2_UAT_STATUS_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/order";
export const PHONEPE_V2_PROD_TOKEN_URL = "https://api.phonepe.com/apis/identity-manager/v1/oauth/token";
export const PHONEPE_V2_UAT_TOKEN_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token";

export function getPhonePeBaseUrl(mode: "test" | "live"): string {
  return mode === "live" ? PHONEPE_PROD_URL : PHONEPE_UAT_URL;
}

function isV2Gateway(gateway: GatewayRow): boolean {
  return !!(gateway.credentials?.client_id && gateway.credentials?.client_secret);
}

// ── V1 Checksum (legacy) ──────────────────────────────────────────────────────

/**
 * Calculates PhonePe V1 X-VERIFY header:
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
 * Validates incoming PhonePe V1 X-VERIFY header using timing-safe comparison.
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

// ── V2 OAuth Token ────────────────────────────────────────────────────────────

interface V2TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

/**
 * Fetches a short-lived OAuth access token from PhonePe V2 identity API.
 * Tokens are valid for ~15–30 minutes. For production, consider caching.
 */
async function fetchPhonePeV2Token(gateway: GatewayRow): Promise<string> {
  const clientId = gateway.credentials?.client_id;
  const clientSecret = gateway.credentials?.client_secret;
  const clientVersion = gateway.credentials?.client_version || "1";

  if (!clientId || !clientSecret) {
    throw new Error(
      `PhonePe gateway "${gateway.display_name}" is missing client_id or client_secret. ` +
        "Add them in Admin → Payment Gateways → PhonePe credentials.",
    );
  }

  const tokenUrl =
    gateway.mode === "live" ? PHONEPE_V2_PROD_TOKEN_URL : PHONEPE_V2_UAT_TOKEN_URL;

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    client_version: clientVersion,
    grant_type: "client_credentials",
  });

  const res = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  const text = await res.text();
  let json: V2TokenResponse;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`PhonePe V2 token endpoint returned invalid JSON [${res.status}]: ${text}`);
  }

  if (!res.ok || !json.access_token) {
    throw new Error(`PhonePe V2 token error [${res.status}]: ${text}`);
  }

  return json.access_token;
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface InitiatePhonePePaymentParams {
  gateway: GatewayRow;
  orderId: string;
  amountCents: number; // in paise
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

// ── V2 Payment Initiation ─────────────────────────────────────────────────────

async function initiatePhonePePaymentV2(
  params: InitiatePhonePePaymentParams,
): Promise<InitiatePhonePePaymentResult> {
  const { gateway, orderId, amountCents, siteUrl } = params;

  const accessToken = await fetchPhonePeV2Token(gateway);

  const payUrl =
    gateway.mode === "live" ? PHONEPE_V2_PROD_PAY_URL : PHONEPE_V2_UAT_PAY_URL;

  // merchantOrderId: max 63 chars, alphanumeric + _ -
  const merchantOrderId = orderId.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 63);

  const payload = {
    merchantOrderId,
    amount: amountCents,
    expireAfter: 1200, // 20 minutes
    paymentFlow: {
      type: "PG_CHECKOUT",
      merchantUrls: {
        redirectUrl: `${siteUrl}/api/payments/phonepe/callback?orderId=${encodeURIComponent(orderId)}`,
      },
    },
  };

  const res = await fetch(payUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `O-Bearer ${accessToken}`,
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  let json: { orderId?: string; redirectUrl?: string; state?: string; message?: string; error?: string };
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`PhonePe V2 pay endpoint returned invalid JSON [${res.status}]: ${text}`);
  }

  if (!res.ok) {
    console.error("[PhonePe V2] Pay initiation failed:", json);
    throw new Error(
      `PhonePe error: ${json.message || json.error || res.statusText || "Payment initiation failed"}`,
    );
  }

  const checkoutUrl = json.redirectUrl;
  if (!checkoutUrl) {
    throw new Error("PhonePe V2 redirect URL missing from payment response");
  }

  return {
    checkoutUrl,
    merchantTransactionId: orderId,
  };
}

// ── V1 Payment Initiation (legacy) ────────────────────────────────────────────

async function initiatePhonePePaymentV1(
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

  const merchantUserId = (userId || "GUEST").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 36);
  const cleanPhone = customer?.phone?.replace(/\D/g, "").slice(-10);

  const payload = {
    merchantId,
    merchantTransactionId: orderId,
    merchantUserId,
    amount: amountCents,
    redirectUrl: `${siteUrl}/api/payments/phonepe/callback?orderId=${encodeURIComponent(orderId)}`,
    redirectMode: "POST",
    callbackUrl: `${siteUrl}/api/public/phonepe-webhook`,
    mobileNumber: cleanPhone && cleanPhone.length === 10 ? cleanPhone : undefined,
    paymentInstrument: { type: "PAY_PAGE" },
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
        redirectInfo?: { url: string; method: string };
      };
    };
  };

  try {
    json = JSON.parse(resText);
  } catch {
    console.error("[PhonePe V1] Failed to parse response:", resText);
    throw new Error(`PhonePe gateway returned invalid response [${response.status}]`);
  }

  if (!response.ok || !json.success) {
    console.error("[PhonePe V1] Order initiation failed:", json);
    throw new Error(`PhonePe error: ${json.message || json.code || "Payment initiation failed"}`);
  }

  const checkoutUrl = json.data?.instrumentResponse?.redirectInfo?.url;
  if (!checkoutUrl) {
    throw new Error("PhonePe redirect URL missing from payment response");
  }

  return { checkoutUrl, merchantTransactionId: orderId };
}

// ── Public: Auto-detecting initiator ─────────────────────────────────────────

/**
 * Initiates a PhonePe payment. Auto-detects V1 vs V2 from gateway credentials.
 *  - V2: gateway has client_id + client_secret
 *  - V1: gateway has merchant_id + salt_key (legacy)
 */
export async function initiatePhonePePayment(
  params: InitiatePhonePePaymentParams,
): Promise<InitiatePhonePePaymentResult> {
  if (isV2Gateway(params.gateway)) {
    console.log("[PhonePe] Using V2 (OAuth) API");
    return initiatePhonePePaymentV2(params);
  }
  console.log("[PhonePe] Using V1 (Salt Key) API");
  return initiatePhonePePaymentV1(params);
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
 * Query PhonePe transaction status. Auto-detects V1 vs V2.
 */
export async function checkPhonePeStatus(
  gateway: GatewayRow,
  merchantTransactionId: string,
): Promise<PhonePeStatusResult> {
  if (isV2Gateway(gateway)) {
    return checkPhonePeStatusV2(gateway, merchantTransactionId);
  }
  return checkPhonePeStatusV1(gateway, merchantTransactionId);
}

async function checkPhonePeStatusV2(
  gateway: GatewayRow,
  merchantOrderId: string,
): Promise<PhonePeStatusResult> {
  const accessToken = await fetchPhonePeV2Token(gateway);
  const baseUrl =
    gateway.mode === "live" ? PHONEPE_V2_PROD_STATUS_URL : PHONEPE_V2_UAT_STATUS_URL;

  // Sanitize orderId same as initiation
  const sanitized = merchantOrderId.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 63);

  const res = await fetch(`${baseUrl}/${sanitized}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `O-Bearer ${accessToken}`,
    },
  });

  const text = await res.text();
  let json: { state?: string; orderId?: string; amount?: number; message?: string; paymentDetails?: Array<{ transactionId?: string }> };
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`PhonePe V2 status check returned invalid JSON [${res.status}]: ${text}`);
  }

  const state =
    json.state === "COMPLETED"
      ? "COMPLETED"
      : json.state === "PENDING" || json.state === "CREATED"
        ? "PENDING"
        : "FAILED";

  return {
    success: state === "COMPLETED",
    code: json.state ?? "UNKNOWN",
    state,
    transactionId: json.paymentDetails?.[0]?.transactionId,
    amount: json.amount,
    message: json.message,
    raw: json,
  };
}

async function checkPhonePeStatusV1(
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
    data?: { merchantId: string; merchantTransactionId: string; transactionId: string; amount: number; state: string; responseCode: string };
  };

  try {
    json = JSON.parse(resText);
  } catch {
    throw new Error(`PhonePe V1 status check returned invalid response [${response.status}]`);
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
