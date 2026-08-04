// ============================================================
// Monetization & Billing API Engine
// Pure billing, plans, invoices, coupons & payment gateway configurations.
// No credit wallets, no referral systems, no family workspace.
// ============================================================

import type {
  Coupon,
  GatewayConfig,
  Invoice,
  SubscriptionPlan,
  UserSubscription,
} from "./monetization-types";
import { supabase } from "@/integrations/supabase/client";

const PLANS_KEY = "sanatan_monetization_plans_v1";
const COUPONS_KEY = "sanatan_monetization_coupons_v1";
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
      "Saved Birth Charts Workspace",
      "Standard A4 PDF Export",
      "Community Support",
    ],
    pdfLimits: 3,
    aiLimits: 10,
    storageLimitsMB: 100,
    validityDays: 30,
    isPopular: false,
    sortOrder: 1,
    visibility: "public",
    active: true,
    gstEnabled: true,
    gstPercentage: 18,
  },
  {
    id: "plan-basic",
    name: "Basic Astrology",
    slug: "basic",
    description: "Ideal for personal horoscope, Sade Sati & Ashtakoot matching.",
    monthlyPriceCents: 49900, // ₹499
    yearlyPriceCents: 499000, // ₹4,990
    lifetimePriceCents: 1299900,
    currency: "INR",
    productType: "subscription",
    features: [
      "Full Janam Kundli 40+ Pages",
      "Ashtakoot Kundli Matching",
      "Vimshottari Dasha Analysis",
      "15 High-Def PDF Downloads",
      "5 Saved Birth Charts",
    ],
    pdfLimits: 15,
    aiLimits: 100,
    storageLimitsMB: 500,
    validityDays: 30,
    isPopular: false,
    sortOrder: 2,
    visibility: "public",
    active: true,
    gstEnabled: true,
    gstPercentage: 18,
  },
  {
    id: "plan-premium",
    name: "Premium Pro",
    slug: "premium",
    description: "Complete astrology suite with AI predictions and remedies.",
    monthlyPriceCents: 99900, // ₹999
    yearlyPriceCents: 999000, // ₹9,990
    lifetimePriceCents: 2499900, // ₹24,999
    currency: "INR",
    productType: "subscription",
    features: [
      "All Premium Astrology Engines",
      "Varshphal & Annual Predictions",
      "Custom Remedy Manager & Mantras",
      "50 High-Def PDF Downloads",
      "Unlimited Saved Charts",
      "Multi-Language PDF Generation (12 Langs)",
      "Priority Email & Support",
    ],
    pdfLimits: 50,
    aiLimits: 500,
    storageLimitsMB: 2048,
    validityDays: 30,
    isPopular: true,
    sortOrder: 3,
    visibility: "public",
    active: true,
    gstEnabled: true,
    gstPercentage: 18,
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
      "Unlimited PDF Downloads",
      "Full Admin Workspace Access",
      "Custom Branding & Watermarks (Coming Soon)",
      "Dedicated Account Specialist",
    ],
    pdfLimits: -1,
    aiLimits: -1,
    storageLimitsMB: 10240,
    validityDays: 36500,
    isPopular: false,
    sortOrder: 4,
    visibility: "public",
    active: true,
    gstEnabled: true,
    gstPercentage: 18,
  },
];

// Subscription Plans
export async function fetchSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const local = loadStorage<SubscriptionPlan[]>(PLANS_KEY, []);
  if (local.length > 0) return local;
  saveStorage(PLANS_KEY, DEFAULT_PLANS);
  return DEFAULT_PLANS;
}

export async function saveSubscriptionPlan(plan: SubscriptionPlan): Promise<SubscriptionPlan> {
  const current = await fetchSubscriptionPlans();
  const exists = current.find((p) => p.id === plan.id);
  let updated: SubscriptionPlan[];
  if (exists) {
    updated = current.map((p) => (p.id === plan.id ? plan : p));
  } else {
    updated = [...current, plan];
  }
  saveStorage(PLANS_KEY, updated);
  return plan;
}

export async function deleteSubscriptionPlan(planId: string): Promise<void> {
  const current = await fetchSubscriptionPlans();
  saveStorage(
    PLANS_KEY,
    current.filter((p) => p.id !== planId),
  );
}

// Payment Gateways
export async function fetchGatewayConfigs(): Promise<GatewayConfig[]> {
  const defaults: GatewayConfig[] = [
    { id: "gw-razorpay", provider: "razorpay", enabled: true, testMode: true, keyId: "rzp_test_sanatan123" },
    { id: "gw-lemonsqueezy", provider: "lemonsqueezy", enabled: true, testMode: true, storeId: "store_sanatan_456" },
  ];
  return loadStorage<GatewayConfig[]>(GATEWAYS_KEY, defaults);
}

export async function saveGatewayConfig(config: GatewayConfig): Promise<GatewayConfig> {
  const current = await fetchGatewayConfigs();
  const updated = current.map((g) => (g.id === config.id ? config : g));
  saveStorage(GATEWAYS_KEY, updated);
  return config;
}

// Coupons
export async function fetchCoupons(): Promise<Coupon[]> {
  const defaults: Coupon[] = [
    { id: "c-SANATAN20", code: "SANATAN20", discountType: "percentage", discountValue: 20, maxUses: 500, usedCount: 42, expiresAt: "2026-12-31", active: true },
    { id: "c-FESTIVAL500", code: "FESTIVAL500", discountType: "fixed", discountValue: 50000, maxUses: 200, usedCount: 18, expiresAt: "2026-12-31", active: true },
  ];
  return loadStorage<Coupon[]>(COUPONS_KEY, defaults);
}

export async function saveCoupon(coupon: Coupon): Promise<Coupon> {
  const current = await fetchCoupons();
  const exists = current.find((c) => c.id === coupon.id);
  const updated = exists ? current.map((c) => (c.id === coupon.id ? coupon : c)) : [coupon, ...current];
  saveStorage(COUPONS_KEY, updated);
  return coupon;
}

export async function validateCoupon(code: string): Promise<Coupon | null> {
  const coupons = await fetchCoupons();
  const found = coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.active);
  if (!found) return null;
  if (found.usedCount >= found.maxUses) return null;
  return found;
}

// Invoices & Subscriptions
export async function fetchUserInvoices(userId: string): Promise<Invoice[]> {
  const current = loadStorage<Invoice[]>(INVOICES_KEY, []);
  return current.filter((i) => i.userId === userId || userId === "demo");
}

export async function createInvoice(inv: Omit<Invoice, "id" | "invoiceNumber" | "createdAt">): Promise<Invoice> {
  const current = loadStorage<Invoice[]>(INVOICES_KEY, []);
  const count = current.length + 1001;
  const newInvoice: Invoice = {
    ...inv,
    id: `inv-${Date.now()}`,
    invoiceNumber: `INV-2026-${count}`,
    createdAt: new Date().toISOString(),
  };
  saveStorage(INVOICES_KEY, [newInvoice, ...current]);

  // Try writing to orders table in Supabase
  try {
    await supabase.from("orders").insert({
      user_id: inv.userId,
      customer_email: inv.userEmail,
      customer_name: inv.userName,
      amount_cents: inv.totalCents,
      currency: inv.currency,
      status: "completed",
    });
  } catch (e) {
    console.error("Order insertion fallback:", e);
  }

  return newInvoice;
}

export async function fetchUserSubscription(userId: string): Promise<UserSubscription | null> {
  const current = loadStorage<UserSubscription[]>(SUBSCRIPTIONS_KEY, []);
  return current.find((s) => s.userId === userId) || null;
}

export async function updateUserSubscription(sub: UserSubscription): Promise<UserSubscription> {
  const current = loadStorage<UserSubscription[]>(SUBSCRIPTIONS_KEY, []);
  const filtered = current.filter((s) => s.userId !== sub.userId);
  saveStorage(SUBSCRIPTIONS_KEY, [sub, ...filtered]);
  return sub;
}
