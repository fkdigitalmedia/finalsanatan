// ============================================================
// Phase 24.1 — Enterprise Credit Management Console Types
// Enterprise-grade TypeScript models for Admin Credit Console
// ============================================================

export interface CreditDashboardMetrics {
  totalCreditsIssued: number;
  totalCreditsUsed: number;
  totalCreditsRemaining: number;
  totalCreditsPurchased: number;
  totalCreditsGifted: number;
  totalCreditsExpired: number;
  revenueFromCreditsCents: number; // in paise / cents
}

export type UserCreditAccountStatus = "active" | "frozen" | "suspended";

export interface UserCreditAccount {
  userId: string;
  userName: string;
  userEmail: string;
  currentBalance: number;
  lifetimeCredits: number;
  purchasedCredits: number;
  bonusCredits: number;
  referralCredits: number;
  expiredCredits: number;
  status: UserCreditAccountStatus;
  lastTopUpDate?: string;
  createdAt: string;
}

export type TopUpReasonCategory =
  | "bonus"
  | "compensation"
  | "support_ticket"
  | "promotion"
  | "refund"
  | "admin_grant";

export interface ManualTopUpRequest {
  userId: string;
  amount: number;
  reasonCategory: TopUpReasonCategory;
  customNote: string;
  expiryDays?: number; // optional override
}

export interface CreditPackageConfig {
  id: string;
  name: string;
  creditAmount: number;
  bonusCredits: number;
  priceCents: number;
  currency: string; // e.g. INR / USD
  badgeText?: string; // e.g. "MOST POPULAR", "BEST VALUE"
  isPopular?: boolean;
  isActive: boolean;
  displayOrder: number;
}

export interface AutoAllocationRule {
  id: string;
  triggerEvent:
    | "subscription_purchased"
    | "subscription_renewed"
    | "manual_purchase"
    | "referral_bonus"
    | "coupon_applied"
    | "admin_bonus";
  creditsToGrant: number;
  expiryPolicyDays: number; // 0 = never expire
  isEnabled: boolean;
}

export type CreditExpiryPolicyDays = 0 | 30 | 90 | 180 | 365;

export interface CreditAuditLogItem {
  id: string;
  userId: string;
  userName: string;
  actor: "admin" | "system" | "user";
  actorName: string; // e.g. "Admin Superuser"
  actionType:
    | "added"
    | "removed"
    | "purchase"
    | "refund"
    | "coupon"
    | "referral"
    | "ai_usage"
    | "pdf_usage"
    | "expired"
    | "reset"
    | "frozen";
  delta: number; // positive or negative
  balanceAfter: number;
  reason: string;
  timestamp: string;
}

export interface RefundCreditRequest {
  transactionId: string;
  userId: string;
  creditsToRefund: number;
  cashAmountCents?: number;
  reason: string;
}

export interface BulkCreditActionRequest {
  targetUserIds: string[];
  action: "bulk_add" | "bulk_remove" | "bulk_expire" | "bulk_gift";
  amount: number;
  reason: string;
}

export interface CreditAnalyticsData {
  topBuyers: { userName: string; userEmail: string; totalSpentCents: number; creditsBought: number }[];
  topUsers: { userName: string; userEmail: string; creditsUsed: number }[];
  unusedCreditsRatio: number; // e.g. 34.5%
  expiredCreditsCount: number;
  revenueCents: number;
  avgUsagePerUser: number;
}
