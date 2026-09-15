# PhonePe Payment Gateway Engine

## 1. Overview
The **PhonePe Payment Gateway Engine** provides server-side payment initiation, cryptographic signature generation/verification, real-time transaction status queries, browser callback redirects, and server-to-server webhook processing for SanatanTools subscriptions and report purchases.

It integrates with the **PhonePe Standard Checkout (Pay Page / Hermes API)** supporting UPI, Credit/Debit Cards, Net Banking, and PhonePe Wallets.

---

## 2. Architecture & Data Flow

```
┌─────────────────┐       1. Select Plan / Buy        ┌────────────────────────┐
│ User on Pricing │ ────────────────────────────────► │ createPaymentOrder()   │
│ or Paywall      │                                   │ (payments.functions.ts)│
└─────────────────┘                                   └───────────┬────────────┘
         ▲                                                        │
         │                                       2. Initiate /pg/v1/pay
         │                                                        ▼
         │  3. Redirect to Checkout URL       ┌────────────────────────┐
         └─────────────────────────────────── │ PhonePe Pay Page       │
                                              │ (Hermes / PG-Sandbox)  │
                                              └───────────┬────────────┘
                                                          │
                                         4. User Completes Payment
                                                          │
                      ┌───────────────────────────────────┴───────────────────────────────────┐
                      ▼                                                                       ▼
    5a. Browser Redirect (POST/GET)                                            5b. Server Webhook (POST)
┌──────────────────────────────────────────────┐                         ┌─────────────────────────────────┐
│ /api/payments/phonepe/callback               │                         │ /api/public/phonepe-webhook     │
│ - Calls /pg/v1/status check API              │                         │ - Verifies X-VERIFY signature   │
│ - Fulfills order & provisions entitlement    │                         │ - Idempotently updates order    │
│ - Redirects to /dashboard?payment=success    │                         │ - Provisions user entitlement   │
└──────────────────────────────────────────────┘                         └─────────────────────────────────┘
```

---

## 3. Configuration & Credentials

Credentials are stored securely in the database (`payment_gateways` table) and managed via **Admin → Payment Gateways**:

| Key | Type | Description |
| :--- | :--- | :--- |
| `merchant_id` | String | PhonePe assigned Merchant ID (MID). |
| `salt_key` | Secret | Secret salt key used for generating the `X-VERIFY` SHA256 checksum. |
| `salt_index` | String | Key index appended to checksum (defaults to `"1"`). |
| `mode` | `"test" \| "live"` | Toggles between UAT Sandbox and Production APIs. |

### API Base URLs
- **Production (`mode: "live"`)**: `https://api.phonepe.com/apis/hermes`
- **Sandbox (`mode: "test"`)**: `https://api-preprod.phonepe.com/apis/pg-sandbox`

### Default Sandbox Credentials
- **Merchant ID**: `PGTESTPAYUAT86`
- **Salt Key**: `96434309-7796-489d-8924-ab56988a6076`
- **Salt Index**: `1`

---

## 4. Cryptographic Checksum (`X-VERIFY`) Logic

PhonePe requires an `X-VERIFY` header on all API calls and webhooks.

### Payment Initiation
$$\text{X-VERIFY} = \text{SHA256}(\text{base64Payload} + \text{"/pg/v1/pay"} + \text{saltKey}) + \text{"###"} + \text{saltIndex}$$

### Status Verification
$$\text{X-VERIFY} = \text{SHA256}(\text{"/pg/v1/status/"} + \text{merchantId} + \text{"/"} + \text{transactionId} + \text{saltKey}) + \text{"###"} + \text{saltIndex}$$

### Webhook Verification
$$\text{X-VERIFY} = \text{SHA256}(\text{base64Response} + \text{saltKey}) + \text{"###"} + \text{saltIndex}$$

Comparisons use `crypto.timingSafeEqual` to prevent timing attacks.

---

## 5. Endpoints & Routes

1. **`createPaymentOrder` (`src/lib/payments.functions.ts`)**:
   - Accepts `planId`, `gatewayId`, and customer metadata.
   - Creates a pending order record in `orders` table.
   - Calls PhonePe `/pg/v1/pay` and returns `{ provider: "phonepe", checkoutUrl, orderId }`.

2. **`verifyPayment` (`src/lib/payments.functions.ts`)**:
   - Supports programmatic verification via `order_id` by calling PhonePe status API.

3. **Browser Callback Route (`/api/payments/phonepe/callback`)**:
   - Receives user redirect after payment completion on PhonePe.
   - Queries PhonePe `/pg/v1/status` API to confirm payment authenticity.
   - Fulfills order, grants entitlement in `user_entitlements`, and redirects to `/dashboard?payment=success` (or download URL).

4. **Server Webhook Route (`/api/public/phonepe-webhook`)**:
   - Receives server-to-server JSON payload: `{ "response": "<base64>" }`.
   - Verifies `X-VERIFY` header against the order's salt key.
   - Idempotently updates order status and grants user entitlement.

---

## 6. TypeScript Interfaces

```typescript
export interface InitiatePhonePePaymentParams {
  gateway: GatewayRow;
  orderId: string;
  amountCents: number;
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

export interface PhonePeStatusResult {
  success: boolean;
  code: string;
  state: "COMPLETED" | "FAILED" | "PENDING";
  transactionId?: string;
  amount?: number;
  message?: string;
  raw: unknown;
}
```

---

## 7. Testing & Verification

Run the test suite:
```bash
npx vitest run src/lib/payments/__tests__/phonepe.test.ts
```

All 4 unit tests covering URL selection, checksum generation, verification, and tamper detection pass with 100% assertion coverage.
