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

export type SubscriptionPlanKey = "free" | "basic" | "premium_pro" | "lifetime_vip";

export type SubscriptionDurationPreset =
  | "7d"
  | "15d"
  | "30d"
  | "60d"
  | "90d"
  | "180d"
  | "365d"
  | "custom"
  | "lifetime";

export type AdminSubscriptionStatus =
  | "active"
  | "expired"
  | "cancelled"
  | "suspended"
  | "trial"
  | "pending";

export type SubscriptionReasonCode =
  | "manual_upgrade"
  | "customer_support"
  | "promotion"
  | "influencer"
  | "refund_compensation"
  | "testing"
  | "internal_staff"
  | "contest_winner"
  | "custom";

export interface AdminSubscriptionAssignInput {
  userId: string;
  planKey: SubscriptionPlanKey;
  status: AdminSubscriptionStatus;
  durationPreset: SubscriptionDurationPreset;
  customStartDate?: string;
  customExpiryDate?: string;
  isLifetime?: boolean;
  reasonCode: SubscriptionReasonCode;
  reasonNotes?: string;
  assignmentMethod?: "manual" | "payment" | "coupon" | "system";
  actionType?: "assign" | "extend" | "reduce" | "upgrade" | "downgrade" | "convert_lifetime" | "suspend" | "cancel";
}

export interface SubscriptionAuditLog {
  id: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  oldPlan: string;
  newPlan: string;
  actionType: string;
  status: string;
  startDate: string;
  expiryDate: string | null;
  durationDays: number | null;
  reason: string;
  assignedByUserId: string;
  assignedByName: string;
  timestamp: string;
  ipAddress?: string;
}

export interface BulkSubscriptionInput {
  userIds: string[];
  action: "assign" | "extend" | "suspend" | "expire";
  planKey?: SubscriptionPlanKey;
  extendDays?: number;
  reasonCode: SubscriptionReasonCode;
  reasonNotes?: string;
}

