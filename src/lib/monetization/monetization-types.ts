// ============================================================
// Phase 24 — Premium Subscription & Billing Models
// Comprehensive TypeScript interfaces for Enterprise Billing
// ============================================================

export type PlanBillingCycle = "monthly" | "yearly" | "lifetime";

export type ProductType = "subscription" | "one_time";

export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  description: string;
  monthlyPriceCents: number; // e.g. 99900 = ₹999 or $9.99
  yearlyPriceCents: number;  // e.g. 799900
  lifetimePriceCents: number; // e.g. 1999900
  currency: string; // e.g. "INR" | "USD"
  productType: ProductType;
  features: string[];
  pdfLimits: number; // e.g. 50 PDFs/mo (-1 for unlimited)
  aiLimits: number;  // e.g. 500 AI requests/mo (-1 for unlimited)
  storageLimitsMB: number; // e.g. 5120 MB
  validityDays: number; // 30, 365, 36500
  isPopular: boolean;
  sortOrder: number;
  visibility: "public" | "private" | "custom";
  active: boolean;
  gstEnabled?: boolean; // Dynamic GST Toggle per Plan (default true)
  gstPercentage?: number; // Dynamic GST Tax % per Plan (default 18)
}

export type GatewayProvider = "razorpay" | "lemonsqueezy" | "stripe" | "paypal" | "wise";

export interface GatewayConfig {
  id: string;
  provider: GatewayProvider;
  displayName: string;
  mode: "sandbox" | "production";
  enabled: boolean;
  isDefault: boolean;
  webhookSecret?: string;
  apiKey?: string;
  keyId?: string; // for Razorpay
  keySecret?: string;
  currencyMapping: Record<string, string>; // e.g. INR -> Razorpay, USD -> LemonSqueezy
  taxPercentage: number; // e.g. 18 for GST
}

export type CouponDiscountType = "percentage" | "fixed_amount" | "free_report";

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: CouponDiscountType;
  discountValue: number; // 20 for 20%, 50000 for ₹500
  expiryDate?: string;
  maxUsageTotal: number; // e.g. 500 total uses
  currentUsageCount: number;
  maxUsagePerUser: number; // e.g. 1
  minPurchaseCents: number; // min order value
  applicablePlanSlugs: string[]; // empty for all
  active: boolean;
  createdAt: string;
}

export interface CouponUsageLog {
  id: string;
  couponId: string;
  code: string;
  userId: string;
  orderId: string;
  discountAppliedCents: number;
  usedAt: string;
}

export interface ReferralAccount {
  id: string;
  userId: string;
  referralCode: string;
  referralLink: string;
  totalInvitedCount: number;
  successfulReferralsCount: number;
  totalCashRewardsEarnedCents: number;
  leaderboardRank?: number;
  createdAt: string;
}

export interface ReferralRewardRule {
  id: string;
  referrerCashBonusCents: number; // e.g. ₹100
  minPurchaseRequired: boolean;
  active: boolean;
}

export type SubscriptionStatus =
  | "active"
  | "past_due"
  | "canceled"
  | "paused"
  | "expired"
  | "grace_period";

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  planSlug: string;
  planName: string;
  status: SubscriptionStatus;
  billingCycle: PlanBillingCycle;
  gatewayProvider: GatewayProvider;
  gatewaySubscriptionId?: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  canceledAt?: string;
  pausedAt?: string;
  gracePeriodEndsAt?: string;
  createdAt: string;
}

export interface LineItem {
  id: string;
  name: string;
  quantity: number;
  unitPriceCents: number;
  totalPriceCents: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. "INV-2026-08041"
  userId: string;
  userName: string;
  userEmail: string;
  userGstin?: string;
  companyName?: string;
  billingAddress?: string;
  planName: string;
  lineItems: LineItem[];
  subtotalCents: number;
  taxCents: number; // GST 18%
  discountCents: number;
  totalCents: number;
  currency: string;
  paymentMethod: string;
  gatewayTransactionId?: string;
  status: "paid" | "pending" | "refunded" | "failed";
  pdfDownloadUrl?: string;
  issuedAt: string;
  paidAt?: string;
}

export interface RevenueAnalyticsMetrics {
  mrrCents: number; // Monthly Recurring Revenue
  arrCents: number; // Annual Recurring Revenue
  lifetimeRevenueCents: number;
  arpuCents: number; // Average Revenue Per User
  conversionRate: number; // % e.g. 9.4
  refundRate: number;     // % e.g. 0.4
  activeSubscriptionsCount: number;
  planDistribution: Record<string, number>;
  topCustomers: { name: string; email: string; revenueCents: number }[];
  monthlyRevenueChart: { month: string; revenueCents: number }[];
}

export interface WebhookAuditLog {
  id: string;
  gateway: GatewayProvider;
  eventId: string;
  eventType: string;
  status: "verified" | "failed_signature" | "processed" | "duplicate_ignored";
  ipAddress: string;
  payloadSummary: string;
  receivedAt: string;
}
