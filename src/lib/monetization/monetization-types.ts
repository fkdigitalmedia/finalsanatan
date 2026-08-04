// ============================================================
// Phase 24.2 Enterprise Subscription & Billing Module Types
// Pure subscription management: Plans, Gateways, Invoices, Webhooks.
// Strictly no credits, no wallets, no CRM, no family workspace.
// ============================================================

export type PaymentGatewayProvider = "razorpay" | "lemonsqueezy" | "stripe";
export type PaymentStatus = "paid" | "pending" | "failed" | "refunded" | "cancelled";
export type SubscriptionStatus = "active" | "canceled" | "expired" | "past_due" | "pending_downgrade";

export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  description: string;
  monthlyPriceCents: number;
  yearlyPriceCents: number;
  lifetimePriceCents: number;
  currency: string;
  productType: "subscription" | "one_time";
  features: string[];
  pdfLimits: number; // -1 for unlimited
  aiLimits: number; // -1 for unlimited
  storageLimitsMB: number;
  validityDays: number;
  isPopular: boolean;
  sortOrder: number;
  visibility: "public" | "private" | "archived";
  active: boolean;
  gstEnabled?: boolean;
  gstPercentage?: number;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  status: SubscriptionStatus;
  billingCycle: "monthly" | "yearly" | "lifetime";
  amountPaidCents: number;
  currency: string;
  startDate: string;
  endDate: string;
  gateway: PaymentGatewayProvider;
  gatewaySubscriptionId?: string;
  autoRenew: boolean;
  createdAt: string;
  cancelAtPeriodEnd?: boolean;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  planName: string;
  subtotalCents: number;
  discountCents: number;
  gstTaxCents: number;
  totalCents: number;
  currency: string;
  status: PaymentStatus;
  gateway: PaymentGatewayProvider;
  transactionId: string;
  createdAt: string;
  pdfDownloadUrl?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number; // percentage e.g. 20 or fixed amount in cents
  maxUses: number;
  usedCount: number;
  expiresAt: string;
  active: boolean;
}

export interface GatewayConfig {
  id: string;
  provider: PaymentGatewayProvider;
  enabled: boolean;
  testMode: boolean;
  keyId?: string;
  keySecret?: string;
  webhookSecret?: string;
  storeId?: string;
}

export interface WebhookLog {
  id: string;
  provider: PaymentGatewayProvider;
  event: string;
  status: "success" | "failed" | "ignored";
  signatureVerified: boolean;
  payloadSummary: string;
  createdAt: string;
}
