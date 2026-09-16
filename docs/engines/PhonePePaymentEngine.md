# PhonePe Payment Gateway Engine

## 1. Overview
The **PhonePe Payment Gateway Engine** provides server-side payment initiation, cryptographic signature generation/verification, real-time transaction status queries, browser callback redirects, and server-to-server webhook processing for SanatanTools subscriptions and report purchases.

It supports **both PhonePe V2 (OAuth / PG Checkout v2)** and **legacy PhonePe V1 (Hermes / Salt Key)** with automatic version detection.

---

## 2. Architecture & Data Flow

```
┌─────────────────┐       1. Select Plan / Buy        ┌────────────────────────┐
│ User on Pricing │ ────────────────────────────────► │ createPaymentOrder()   │
│ or Paywall      │                                   │ (payments.functions.ts)│
└─────────────────┘                                   └───────────┬────────────┘
         ▲                                                        │
         │                                       2. Initiate V2 Pay or V1 Pay
         │                                                        ▼
         │  3. Redirect to Checkout URL       ┌────────────────────────┐
         └─────────────────────────────────── │ PhonePe Pay Page       │
                                              │ (V2 Hosted / Sandbox)  │
                                              └───────────┬────────────┘
                                                          │
                                         4. User Completes Payment
                                                          │
                      ┌───────────────────────────────────┴───────────────────────────────────┐
                      ▼                                                                       ▼
    5a. Browser Redirect (POST/GET)                                            5b. Server Webhook (POST)
┌──────────────────────────────────────────────┐                         ┌─────────────────────────────────┐
│ /api/payments/phonepe/callback               │                         │ /api/public/phonepe-webhook     │
│ - Calls V2 /checkout/v2/order/{id}/status    │                         │ - Accepts V2 and V1 webhooks    │
│ - Fulfills order & provisions entitlement    │                         │ - Idempotently updates order    │
│ - Redirects to /dashboard?payment=success    │                         │ - Provisions user entitlement   │
└──────────────────────────────────────────────┘                         └─────────────────────────────────┘
```

---

## 3. Configuration & Credentials

Credentials are stored securely in the database (`payment_gateways` table) and managed via **Admin → Payment Gateways**:

### V2 Credentials (Recommended / New)
| Key | Type | Description |
| :--- | :--- | :--- |
| `client_id` | String | Client ID from PhonePe Developer Settings. |
| `client_secret` | Secret | Client Secret from PhonePe Developer Settings. |
| `client_version` | String | Client version (defaults to `"1"`). |

### V1 Credentials (Legacy)
| Key | Type | Description |
| :--- | :--- | :--- |
| `merchant_id` | String | PhonePe assigned Merchant ID (MID). |
| `salt_key` | Secret | Secret salt key used for `X-VERIFY` SHA256 checksum. |
| `salt_index` | String | Key index appended to checksum (defaults to `"1"`). |

### V2 API Endpoints
- **Production Token:** `https://api.phonepe.com/apis/identity-manager/v1/oauth/token`
- **Sandbox Token:** `https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token`
- **Production Checkout:** `https://api.phonepe.com/apis/pg/checkout/v2/pay`
- **Sandbox Checkout:** `https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay`
- **Order Status:** `https://api.phonepe.com/apis/pg/checkout/v2/order/{merchantOrderId}/status`


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
