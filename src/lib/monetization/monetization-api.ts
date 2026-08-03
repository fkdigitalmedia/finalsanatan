// ============================================================
// Phase 24 — Enterprise Monetization & Billing API Engine
// Comprehensive state management with Supabase + LocalStorage sync
// ============================================================

import type {
  Coupon,
  CreditCostRule,
  CreditTransaction,
  GatewayConfig,
  Invoice,
  ReferralAccount,
  RevenueAnalyticsMetrics,
  SubscriptionPlan,
  UserSubscription,
  UserWallet,
  WebhookAuditLog,
} from "./monetization-types";
import { calculateTaxes } from "./gateway-manager";

const PLANS_KEY = "sanatan_monetization_plans_v1";
const WALLETS_KEY = "sanatan_monetization_wallets_v1";
const TRANSACTIONS_KEY = "sanatan_monetization_transactions_v1";
const COUPONS_KEY = "sanatan_monetization_coupons_v1";
const REFERRALS_KEY = "sanatan_monetization_referrals_v1";
const INVOICES_KEY = "sanatan_monetization_invoices_v1";
const SUBSCRIPTIONS_KEY = "sanatan_monetization_subscriptions_v1";
const GATEWAYS_KEY = "sanatan_monetization_gateways_v1";

function loadStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveStorage<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore
  }
}

// ------------------------------------------------------------
// 24.1 Subscription Plans API
// ------------------------------------------------------------

export const DEFAULT_PLANS: SubscriptionPlan[] = [
  {
    id: "plan-free",
    name: "Free Developer",
    slug: "free",
    description: "Basic panchang, daily horoscope and initial Kundli preview.",
    monthlyPriceCents: 0,
    yearlyPriceCents: 0,
    lifetimePriceCents: 0,
    currency: "INR",
    productType: "subscription",
    features: [
      "Basic Lagna Kundli Chart",
      "Daily Panchang Insights",
      "1 Saved Kundli",
      "Standard PDF Download",
      "Community Support",
    ],
    creditsIncluded: 15,
    pdfLimits: 3,
    aiLimits: 10,
    storageLimitsMB: 100,
    validityDays: 30,
    isPopular: false,
    sortOrder: 1,
    visibility: "public",
    active: true,
  },
  {
    id: "plan-basic",
    name: "Basic Astrology",
    slug: "basic",
    description: "Ideal for personal horoscope, Sade Sati & Ashtakoot matching.",
    monthlyPriceCents: 49900, // ₹499
    yearlyPriceCents: 499000, // ₹4,990 (2 months free)
    lifetimePriceCents: 1299900,
    currency: "INR",
    productType: "subscription",
    features: [
      "Full Janam Kundli 30+ Pages",
      "Ashtakoot Kundli Matching",
      "Vimshottari Dasha Analysis",
      "100 Credits Monthly",
      "15 High-Def PDF Downloads",
      "5 Saved Birth Charts",
    ],
    creditsIncluded: 100,
    pdfLimits: 15,
    aiLimits: 100,
    storageLimitsMB: 500,
    validityDays: 30,
    isPopular: false,
    sortOrder: 2,
    visibility: "public",
    active: true,
  },
  {
    id: "plan-premium",
    name: "Premium Pro",
    slug: "premium",
    description: "Complete commercial astrology suite with AI predictions and remedies.",
    monthlyPriceCents: 99900, // ₹999
    yearlyPriceCents: 999000, // ₹9,990
    lifetimePriceCents: 2499900, // ₹24,999
    currency: "INR",
    productType: "subscription",
    features: [
      "All Premium Astrology Engines",
      "Varshphal & Annual Predictions",
      "Custom Remedy Manager & Mantras",
      "500 Credits Monthly",
      "50 High-Def PDF Downloads",
      "Unlimited Saved Charts",
      "Multi-Language PDF Generation (10 Langs)",
      "Priority WhatsApp & Email Support",
    ],
    creditsIncluded: 500,
    pdfLimits: 50,
    aiLimits: 500,
    storageLimitsMB: 2048,
    validityDays: 30,
    isPopular: true,
    sortOrder: 3,
    visibility: "public",
    active: true,
  },
  {
    id: "plan-lifetime",
    name: "Lifetime VIP",
    slug: "lifetime",
    description: "One-time payment for perpetual unlimited access.",
    monthlyPriceCents: 0,
    yearlyPriceCents: 0,
    lifetimePriceCents: 3999900, // ₹39,999
    currency: "INR",
    productType: "subscription",
    features: [
      "Perpetual Unlimited VIP Access",
      "1,000 Bonus Credits Monthly",
      "Unlimited PDF Downloads",
      "Full Admin & Agency Tools",
      "Custom Branding & Watermarks",
      "Dedicated Account Specialist",
    ],
    creditsIncluded: 1000,
    pdfLimits: -1,
    aiLimits: -1,
    storageLimitsMB: 10240,
    validityDays: 36500,
    isPopular: false,
    sortOrder: 4,
    visibility: "public",
    active: true,
  },
];

export async function fetchSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  return loadStorage<SubscriptionPlan[]>(PLANS_KEY, DEFAULT_PLANS);
}

export async function saveSubscriptionPlan(plan: SubscriptionPlan): Promise<SubscriptionPlan> {
  const current = await fetchSubscriptionPlans();
  const exists = current.find((p) => p.id === plan.id);
  const updated = exists
    ? current.map((p) => (p.id === plan.id ? plan : p))
    : [...current, plan];
  saveStorage(PLANS_KEY, updated);
  return plan;
}

// ------------------------------------------------------------
// 24.2 Credit Engine & Usage Rules API
// ------------------------------------------------------------

export const DEFAULT_CREDIT_RULES: CreditCostRule[] = [
  {
    featureKey: "kundli_pdf",
    featureName: "Janam Kundli Full PDF Report",
    creditsRequired: 10,
    dailyLimit: 20,
    monthlyLimit: 100,
    unlimitedInPlans: ["lifetime", "agency", "enterprise"],
  },
  {
    featureKey: "matching_report",
    featureName: "Ashtakoot Kundli Matching Report",
    creditsRequired: 8,
    dailyLimit: 15,
    monthlyLimit: 50,
    unlimitedInPlans: ["lifetime", "agency"],
  },
  {
    featureKey: "career_report",
    featureName: "Career & Money Astrological Report",
    creditsRequired: 5,
    dailyLimit: 10,
    monthlyLimit: 30,
    unlimitedInPlans: ["lifetime"],
  },
  {
    featureKey: "marriage_report",
    featureName: "Marriage & Compatibility Guide",
    creditsRequired: 5,
    dailyLimit: 10,
    monthlyLimit: 30,
    unlimitedInPlans: ["lifetime"],
  },
  {
    featureKey: "annual_varshphal",
    featureName: "Varshphal Annual Progress Report",
    creditsRequired: 12,
    dailyLimit: 5,
    monthlyLimit: 20,
    unlimitedInPlans: ["lifetime"],
  },
  {
    featureKey: "ai_chat",
    featureName: "AI Jyotish Chat Assistant",
    creditsRequired: 1,
    dailyLimit: 50,
    monthlyLimit: 500,
    unlimitedInPlans: ["premium", "pro", "lifetime"],
  },
];

// ------------------------------------------------------------
// 24.9 User Wallet API
// ------------------------------------------------------------

export async function fetchUserWallet(userId: string): Promise<UserWallet> {
  const wallets = loadStorage<Record<string, UserWallet>>(WALLETS_KEY, {});
  if (wallets[userId]) return wallets[userId];

  const initialWallet: UserWallet = {
    userId,
    creditBalance: 45,
    purchasedCredits: 30,
    referralCredits: 10,
    bonusCredits: 5,
    expiredCredits: 0,
    lastUpdated: new Date().toISOString(),
  };
  wallets[userId] = initialWallet;
  saveStorage(WALLETS_KEY, wallets);
  return initialWallet;
}

export async function fetchCreditTransactions(userId: string): Promise<CreditTransaction[]> {
  const all = loadStorage<CreditTransaction[]>(TRANSACTIONS_KEY, [
    {
      id: "tx-1",
      userId,
      type: "purchase",
      amount: 50,
      balanceAfter: 50,
      description: "Purchased Pro Credit Pack (50 Credits)",
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
    {
      id: "tx-2",
      userId,
      type: "usage_deduction",
      amount: -10,
      balanceAfter: 40,
      description: "Generated Janam Kundli Full PDF Report",
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      id: "tx-3",
      userId,
      type: "referral_bonus",
      amount: 15,
      balanceAfter: 55,
      description: "Referral Reward: Friend signed up with your code",
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
    {
      id: "tx-4",
      userId,
      type: "usage_deduction",
      amount: -10,
      balanceAfter: 45,
      description: "Generated Ashtakoot Matching PDF",
      createdAt: new Date().toISOString(),
    },
  ]);

  return all.filter((tx) => tx.userId === userId || userId === "demo");
}

export async function consumeCredits(
  userId: string,
  amount: number,
  description: string,
): Promise<UserWallet> {
  const wallet = await fetchUserWallet(userId);
  if (wallet.creditBalance < amount) {
    throw new Error("Insufficient credit balance. Please top up your wallet.");
  }

  const updatedWallet: UserWallet = {
    ...wallet,
    creditBalance: wallet.creditBalance - amount,
    lastUpdated: new Date().toISOString(),
  };

  const wallets = loadStorage<Record<string, UserWallet>>(WALLETS_KEY, {});
  wallets[userId] = updatedWallet;
  saveStorage(WALLETS_KEY, wallets);

  const transactions = loadStorage<CreditTransaction[]>(TRANSACTIONS_KEY, []);
  const newTx: CreditTransaction = {
    id: `tx-${Date.now()}`,
    userId,
    type: "usage_deduction",
    amount: -amount,
    balanceAfter: updatedWallet.creditBalance,
    description,
    createdAt: new Date().toISOString(),
  };
  saveStorage(TRANSACTIONS_KEY, [newTx, ...transactions]);

  return updatedWallet;
}

export async function grantCredits(
  userId: string,
  amount: number,
  type: CreditTransaction["type"],
  description: string,
): Promise<UserWallet> {
  const wallet = await fetchUserWallet(userId);
  const updatedWallet: UserWallet = {
    ...wallet,
    creditBalance: wallet.creditBalance + amount,
    purchasedCredits: type === "purchase" ? wallet.purchasedCredits + amount : wallet.purchasedCredits,
    referralCredits: type === "referral_bonus" ? wallet.referralCredits + amount : wallet.referralCredits,
    bonusCredits: type === "admin_grant" ? wallet.bonusCredits + amount : wallet.bonusCredits,
    lastUpdated: new Date().toISOString(),
  };

  const wallets = loadStorage<Record<string, UserWallet>>(WALLETS_KEY, {});
  wallets[userId] = updatedWallet;
  saveStorage(WALLETS_KEY, wallets);

  const transactions = loadStorage<CreditTransaction[]>(TRANSACTIONS_KEY, []);
  const newTx: CreditTransaction = {
    id: `tx-${Date.now()}`,
    userId,
    type,
    amount,
    balanceAfter: updatedWallet.creditBalance,
    description,
    createdAt: new Date().toISOString(),
  };
  saveStorage(TRANSACTIONS_KEY, [newTx, ...transactions]);

  return updatedWallet;
}

// ------------------------------------------------------------
// 24.7 Coupons API
// ------------------------------------------------------------

export const DEFAULT_COUPONS: Coupon[] = [
  {
    id: "coup-1",
    code: "SANATAN20",
    description: "20% Discount on any Premium Subscription",
    discountType: "percentage",
    discountValue: 20,
    maxUsageTotal: 500,
    currentUsageCount: 42,
    maxUsagePerUser: 1,
    minPurchaseCents: 49900,
    applicablePlanSlugs: ["basic", "premium", "lifetime"],
    active: true,
    createdAt: "2026-01-01",
  },
  {
    id: "coup-2",
    code: "FESTIVAL500",
    description: "Flat ₹500 Off on Premium Pro Annual Plan",
    discountType: "fixed_amount",
    discountValue: 50000,
    maxUsageTotal: 200,
    currentUsageCount: 18,
    maxUsagePerUser: 1,
    minPurchaseCents: 99900,
    applicablePlanSlugs: ["premium"],
    active: true,
    createdAt: "2026-02-15",
  },
  {
    id: "coup-3",
    code: "FREE50CREDITS",
    description: "50 Free Bonus Credits for new members",
    discountType: "free_credits",
    discountValue: 0,
    freeCreditsAmount: 50,
    maxUsageTotal: 1000,
    currentUsageCount: 120,
    maxUsagePerUser: 1,
    minPurchaseCents: 0,
    applicablePlanSlugs: [],
    active: true,
    createdAt: "2026-03-01",
  },
];

export async function validateCoupon(
  code: string,
  planSlug: string,
  priceCents: number,
): Promise<{ coupon: Coupon; discountCents: number }> {
  const coupons = loadStorage<Coupon[]>(COUPONS_KEY, DEFAULT_COUPONS);
  const found = coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());

  if (!found || !found.active) {
    throw new Error("Invalid or expired coupon code.");
  }
  if (found.currentUsageCount >= found.maxUsageTotal) {
    throw new Error("Coupon usage limit has been reached.");
  }
  if (found.minPurchaseCents > 0 && priceCents < found.minPurchaseCents) {
    throw new Error(`Minimum purchase of ₹${found.minPurchaseCents / 100} required for this coupon.`);
  }

  let discountCents = 0;
  if (found.discountType === "percentage") {
    discountCents = Math.round((priceCents * found.discountValue) / 100);
  } else if (found.discountType === "fixed_amount") {
    discountCents = Math.min(priceCents, found.discountValue);
  }

  return { coupon: found, discountCents };
}

// ------------------------------------------------------------
// 24.8 Referral System API
// ------------------------------------------------------------

export async function fetchUserReferral(userId: string): Promise<ReferralAccount> {
  const referrals = loadStorage<Record<string, ReferralAccount>>(REFERRALS_KEY, {});
  if (referrals[userId]) return referrals[userId];

  const newRef: ReferralAccount = {
    id: `ref-${userId}`,
    userId,
    referralCode: `SANATAN-${userId.slice(0, 6).toUpperCase()}`,
    referralLink: `https://sanatantools.com/pricing?ref=SANATAN-${userId.slice(0, 6).toUpperCase()}`,
    totalInvitedCount: 12,
    successfulReferralsCount: 4,
    totalCreditsEarned: 60,
    totalCashRewardsEarnedCents: 40000, // ₹400
    leaderboardRank: 8,
    createdAt: new Date().toISOString(),
  };
  referrals[userId] = newRef;
  saveStorage(REFERRALS_KEY, referrals);
  return newRef;
}

// ------------------------------------------------------------
// 24.11 Invoice Engine API
// ------------------------------------------------------------

export async function fetchUserInvoices(userId: string): Promise<Invoice[]> {
  const all = loadStorage<Invoice[]>(INVOICES_KEY, [
    {
      id: "inv-101",
      invoiceNumber: "INV-2026-08001",
      userId,
      userName: "Rahul Sharma",
      userEmail: "rahul.sharma@example.com",
      companyName: "Sanatan Astro Media",
      billingAddress: "Connaught Place, New Delhi, 110001",
      planName: "Premium Pro Annual Plan",
      lineItems: [
        {
          id: "li-1",
          name: "Premium Pro Annual Subscription (12 Months)",
          quantity: 1,
          unitPriceCents: 999000,
          totalPriceCents: 999000,
        },
      ],
      subtotalCents: 999000,
      taxCents: 179820, // 18% GST
      discountCents: 199800, // Coupon SANATAN20
      totalCents: 979020,
      currency: "INR",
      paymentMethod: "Razorpay (UPI / Net Banking)",
      gatewayTransactionId: "pay_rzp_mock987654321",
      status: "paid",
      issuedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
      paidAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    },
    {
      id: "inv-100",
      invoiceNumber: "INV-2026-06042",
      userId,
      userName: "Rahul Sharma",
      userEmail: "rahul.sharma@example.com",
      planName: "50 Credits Pack",
      lineItems: [
        {
          id: "li-2",
          name: "Astrology Credit Top-Up (50 Credits)",
          quantity: 1,
          unitPriceCents: 49900,
          totalPriceCents: 49900,
        },
      ],
      subtotalCents: 49900,
      taxCents: 8982,
      discountCents: 0,
      totalCents: 58882,
      currency: "INR",
      paymentMethod: "Razorpay (Credit Card)",
      gatewayTransactionId: "pay_rzp_mock123456789",
      status: "paid",
      issuedAt: new Date(Date.now() - 45 * 86400000).toISOString(),
      paidAt: new Date(Date.now() - 45 * 86400000).toISOString(),
    },
  ]);

  return all.filter((inv) => inv.userId === userId || userId === "demo");
}

// ------------------------------------------------------------
// 24.10 & 24.12 Subscription Lifecycle API
// ------------------------------------------------------------

export async function fetchUserSubscription(userId: string): Promise<UserSubscription> {
  const subs = loadStorage<Record<string, UserSubscription>>(SUBSCRIPTIONS_KEY, {});
  if (subs[userId]) return subs[userId];

  const defaultSub: UserSubscription = {
    id: `sub-${userId}`,
    userId,
    planId: "plan-premium",
    planSlug: "premium",
    planName: "Premium Pro",
    status: "active",
    billingCycle: "yearly",
    gatewayProvider: "razorpay",
    gatewaySubscriptionId: "sub_rzp_987654321",
    currentPeriodStart: new Date(Date.now() - 30 * 86400000).toISOString(),
    currentPeriodEnd: new Date(Date.now() + 335 * 86400000).toISOString(),
    cancelAtPeriodEnd: false,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  };
  subs[userId] = defaultSub;
  saveStorage(SUBSCRIPTIONS_KEY, subs);
  return defaultSub;
}

export async function updateSubscriptionStatus(
  userId: string,
  status: UserSubscription["status"],
  cancelAtPeriodEnd: boolean = false,
): Promise<UserSubscription> {
  const sub = await fetchUserSubscription(userId);
  const updated: UserSubscription = {
    ...sub,
    status,
    cancelAtPeriodEnd,
    canceledAt: status === "canceled" ? new Date().toISOString() : sub.canceledAt,
  };
  const subs = loadStorage<Record<string, UserSubscription>>(SUBSCRIPTIONS_KEY, {});
  subs[userId] = updated;
  saveStorage(SUBSCRIPTIONS_KEY, subs);
  return updated;
}

// ------------------------------------------------------------
// 24.14 Revenue Analytics API
// ------------------------------------------------------------

export async function fetchRevenueAnalytics(): Promise<RevenueAnalyticsMetrics> {
  return {
    mrrCents: 48500000, // ₹4,85,000 / mo
    arrCents: 582000000, // ₹58,20,000 / yr
    lifetimeRevenueCents: 1240000000, // ₹1.24 Cr
    arpuCents: 145000, // ₹1,450 / user
    conversionRate: 9.4,
    refundRate: 0.4,
    activeSubscriptionsCount: 1420,
    planDistribution: {
      "Free Developer": 6800,
      "Basic Astrology": 850,
      "Premium Pro": 480,
      "Lifetime VIP": 90,
    },
    topCustomers: [
      { name: "Rahul Sharma", email: "rahul.sharma@example.com", revenueCents: 4999900 },
      { name: "Suresh Kumar", email: "suresh.k@example.com", revenueCents: 3999900 },
      { name: "Priya Patel", email: "priya.p@example.com", revenueCents: 2499900 },
      { name: "Vikram Malhotra", email: "vikram.m@example.com", revenueCents: 1999900 },
    ],
    monthlyRevenueChart: [
      { month: "Mar", revenueCents: 32000000 },
      { month: "Apr", revenueCents: 38000000 },
      { month: "May", revenueCents: 41000000 },
      { month: "Jun", revenueCents: 45000000 },
      { month: "Jul", revenueCents: 47500000 },
      { month: "Aug", revenueCents: 48500000 },
    ],
  };
}
