// ============================================================
// Phase 24.1 — Enterprise Credit Management API Engine
// Real data from Supabase profiles + orders tables.
// Write operations (top-up, freeze, audit logs) persisted
// in localStorage keyed per user so they survive reloads.
// ============================================================

import type {
  AutoAllocationRule,
  BulkCreditActionRequest,
  CreditAnalyticsData,
  CreditAuditLogItem,
  CreditDashboardMetrics,
  CreditPackageConfig,
  ManualTopUpRequest,
  RefundCreditRequest,
  UserCreditAccount,
} from "./admin-credits-types";
import { supabase } from "@/integrations/supabase/client";

// ── LocalStorage keys (only for admin overrides / audit) ────
const OVERRIDES_KEY = "sanatan_credit_overrides_v2";   // { [userId]: Partial<UserCreditAccount> }
const PACKAGES_KEY  = "sanatan_admin_credit_packages_v1";
const LOGS_KEY      = "sanatan_admin_credit_logs_v2";
const RULES_KEY     = "sanatan_admin_credit_rules_v1";

// ── Default credit packages (not user-specific, stays in LS) ─
const INITIAL_PACKAGES: CreditPackageConfig[] = [
  { id: "pack-10",  name: "Starter Pack",     creditAmount: 10,  bonusCredits: 0,   priceCents: 19900,  currency: "INR", badgeText: "BASIC",         isPopular: false, isActive: true, displayOrder: 1 },
  { id: "pack-25",  name: "Popular Pack",      creditAmount: 25,  bonusCredits: 5,   priceCents: 39900,  currency: "INR", badgeText: "5 BONUS CREDITS", isPopular: true,  isActive: true, displayOrder: 2 },
  { id: "pack-50",  name: "Pro Pack",          creditAmount: 50,  bonusCredits: 15,  priceCents: 69900,  currency: "INR", badgeText: "BEST VALUE",    isPopular: false, isActive: true, displayOrder: 3 },
  { id: "pack-100", name: "Astrologer Pack",   creditAmount: 100, bonusCredits: 35,  priceCents: 129900, currency: "INR", badgeText: "35% EXTRA",     isPopular: false, isActive: true, displayOrder: 4 },
  { id: "pack-250", name: "Agency Pack",       creditAmount: 250, bonusCredits: 100, priceCents: 299900, currency: "INR", badgeText: "BULK DISCOUNT", isPopular: false, isActive: true, displayOrder: 5 },
];

// ── LocalStorage helpers ─────────────────────────────────────
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

// ── Fetch real user credit accounts from Supabase ────────────
export async function fetchUserCreditAccounts(): Promise<UserCreditAccount[]> {
  const userMap = new Map<string, { id: string; name: string; email: string; createdAt: string; updatedAt: string }>();

  // 1. Fetch from profiles
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url, created_at, updated_at")
    .order("created_at", { ascending: false });

  (profiles ?? []).forEach((p) => {
    if (!p.id) return;
    userMap.set(p.id, {
      id: p.id,
      name: p.display_name || "User",
      email: "",
      createdAt: p.created_at || new Date().toISOString(),
      updatedAt: p.updated_at || p.created_at || new Date().toISOString(),
    });
  });

  // 2. Fetch from user_kundlis (for users who saved charts but may lack a profile row)
  const { data: kundliUsers } = await supabase
    .from("user_kundlis")
    .select("user_id, name, created_at");

  (kundliUsers ?? []).forEach((k) => {
    if (!k.user_id) return;
    const existing = userMap.get(k.user_id);
    if (existing) {
      if ((existing.name === "User" || !existing.name) && k.name) {
        existing.name = k.name;
      }
    } else {
      userMap.set(k.user_id, {
        id: k.user_id,
        name: k.name || `User (${k.user_id.slice(0, 6)})`,
        email: "",
        createdAt: k.created_at || new Date().toISOString(),
        updatedAt: k.created_at || new Date().toISOString(),
      });
    }
  });

  // 3. Fetch from orders (for paying users)
  const { data: orderUsers } = await supabase
    .from("orders")
    .select("user_id, customer_name, customer_email, created_at");

  (orderUsers ?? []).forEach((o) => {
    if (!o.user_id) return;
    const existing = userMap.get(o.user_id);
    if (existing) {
      if ((existing.name === "User" || !existing.name) && o.customer_name) {
        existing.name = o.customer_name;
      }
      if (!existing.email && o.customer_email) {
        existing.email = o.customer_email;
      }
    } else {
      userMap.set(o.user_id, {
        id: o.user_id,
        name: o.customer_name || o.customer_email?.split("@")[0] || `User (${o.user_id.slice(0, 6)})`,
        email: o.customer_email || "",
        createdAt: o.created_at || new Date().toISOString(),
        updatedAt: o.created_at || new Date().toISOString(),
      });
    }
  });

  // 4. Fetch from user_roles
  const { data: roleUsers } = await supabase
    .from("user_roles")
    .select("user_id, created_at");

  (roleUsers ?? []).forEach((r) => {
    if (!r.user_id || userMap.has(r.user_id)) return;
    userMap.set(r.user_id, {
      id: r.user_id,
      name: `Staff/User (${r.user_id.slice(0, 6)})`,
      email: "",
      createdAt: r.created_at || new Date().toISOString(),
      updatedAt: r.created_at || new Date().toISOString(),
    });
  });

  // 5. Fetch from user_entitlements
  const { data: entitlementUsers } = await supabase
    .from("user_entitlements")
    .select("user_id, created_at");

  (entitlementUsers ?? []).forEach((e) => {
    if (!e.user_id || userMap.has(e.user_id)) return;
    userMap.set(e.user_id, {
      id: e.user_id,
      name: `Member (${e.user_id.slice(0, 6)})`,
      email: "",
      createdAt: e.created_at || new Date().toISOString(),
      updatedAt: e.created_at || new Date().toISOString(),
    });
  });

  const allUsers = Array.from(userMap.values());
  if (allUsers.length === 0) return [];

  const userIds = allUsers.map((u) => u.id);

  // Fetch paid orders
  const { data: orders } = await supabase
    .from("orders")
    .select("user_id, amount_cents")
    .in("user_id", userIds)
    .eq("status", "paid");

  // Fetch kundli usage
  const { data: kundliRows } = await supabase
    .from("user_kundlis")
    .select("user_id")
    .in("user_id", userIds);

  // Fetch downloads usage
  const { data: downloadRows } = await supabase
    .from("report_downloads")
    .select("user_id")
    .in("user_id", userIds);

  const overrides = loadStorage<Record<string, Partial<UserCreditAccount>>>(OVERRIDES_KEY, {});

  const orderMap: Record<string, number> = {};
  (orders ?? []).forEach((o) => {
    if (o.user_id) orderMap[o.user_id] = (orderMap[o.user_id] ?? 0) + (o.amount_cents ?? 0);
  });

  const kundliMap: Record<string, number> = {};
  (kundliRows ?? []).forEach((r) => {
    kundliMap[r.user_id] = (kundliMap[r.user_id] ?? 0) + 1;
  });

  const downloadMap: Record<string, number> = {};
  (downloadRows ?? []).forEach((r) => {
    downloadMap[r.user_id] = (downloadMap[r.user_id] ?? 0) + 1;
  });

  return allUsers.map((u) => {
    const totalSpentCents = orderMap[u.id] ?? 0;
    const kundliCount    = kundliMap[u.id] ?? 0;
    const downloadCount  = downloadMap[u.id] ?? 0;

    const purchasedCredits = Math.round(totalSpentCents / 10000) * 10;
    const creditsUsed      = kundliCount * 2 + downloadCount * 5;
    const lifetimeCredits  = Math.max(purchasedCredits + 100, 100);
    const currentBalance   = Math.max(0, lifetimeCredits - creditsUsed);

    const base: UserCreditAccount = {
      userId:           u.id,
      userName:         u.name,
      userEmail:        u.email,
      currentBalance,
      lifetimeCredits,
      purchasedCredits,
      bonusCredits:     100,
      referralCredits:  0,
      expiredCredits:   0,
      status:           "active",
      lastTopUpDate:    u.updatedAt.split("T")[0] ?? u.createdAt.split("T")[0],
      createdAt:        u.createdAt.split("T")[0] ?? "",
    };

    const ov = overrides[u.id] ?? {};
    return { ...base, ...ov };
  });
}

// ── Update account status (freeze/unfreeze) ──────────────────
export async function updateUserAccountStatus(
  userId: string,
  status: "active" | "frozen" | "suspended",
): Promise<UserCreditAccount> {
  const overrides = loadStorage<Record<string, Partial<UserCreditAccount>>>(OVERRIDES_KEY, {});
  overrides[userId] = { ...overrides[userId], status };
  saveStorage(OVERRIDES_KEY, overrides);

  // Re-fetch to get the merged account
  const all = await fetchUserCreditAccounts();
  const user = all.find((u) => u.userId === userId);
  if (!user) throw new Error("User not found");

  await addAuditLog({
    userId,
    userName: user.userName,
    actor: "admin",
    actorName: "Super Admin",
    actionType: status === "frozen" ? "frozen" : "reset",
    delta: 0,
    balanceAfter: user.currentBalance,
    reason: `User account status changed to ${status}`,
  });

  return user;
}

// ── Dashboard metrics ────────────────────────────────────────
export async function fetchCreditDashboardMetrics(): Promise<CreditDashboardMetrics> {
  const accounts = await fetchUserCreditAccounts();
  const totalIssued    = accounts.reduce((acc, curr) => acc + curr.lifetimeCredits, 0);
  const totalRemaining = accounts.reduce((acc, curr) => acc + curr.currentBalance, 0);
  const totalPurchased = accounts.reduce((acc, curr) => acc + curr.purchasedCredits, 0);
  const totalGifted    = accounts.reduce((acc, curr) => acc + curr.bonusCredits, 0);
  const totalExpired   = accounts.reduce((acc, curr) => acc + curr.expiredCredits, 0);
  const totalUsed      = Math.max(0, totalIssued - totalRemaining - totalExpired);

  // Revenue from actual paid orders
  const { data: orders } = await supabase
    .from("orders")
    .select("amount_cents")
    .eq("status", "paid");
  const revenueCents = (orders ?? []).reduce((s, o) => s + (o.amount_cents ?? 0), 0);

  return {
    totalCreditsIssued:    totalIssued,
    totalCreditsUsed:      totalUsed,
    totalCreditsRemaining: totalRemaining,
    totalCreditsPurchased: totalPurchased,
    totalCreditsGifted:    totalGifted,
    totalCreditsExpired:   totalExpired,
    revenueFromCreditsCents: revenueCents,
  };
}

// ── Manual Top-up (persisted in overrides & synced to user wallet) ─────────
export async function performManualTopUp(req: ManualTopUpRequest): Promise<UserCreditAccount> {
  const all    = await fetchUserCreditAccounts();
  const target = all.find((a) => a.userId === req.userId);
  if (!target) throw new Error("User account not found");

  const overrides = loadStorage<Record<string, Partial<UserCreditAccount>>>(OVERRIDES_KEY, {});
  const prev = overrides[req.userId] ?? {};

  const newBalance  = Math.max(0, (prev.currentBalance  ?? target.currentBalance)  + req.amount);
  const newLifetime = req.amount > 0 ? (prev.lifetimeCredits ?? target.lifetimeCredits) + req.amount : (prev.lifetimeCredits ?? target.lifetimeCredits);
  const newBonus    = req.amount > 0 ? (prev.bonusCredits    ?? target.bonusCredits)    + req.amount : (prev.bonusCredits    ?? target.bonusCredits);

  overrides[req.userId] = {
    ...prev,
    currentBalance:  newBalance,
    lifetimeCredits: newLifetime,
    bonusCredits:    newBonus,
    lastTopUpDate:   new Date().toISOString().split("T")[0],
  };
  saveStorage(OVERRIDES_KEY, overrides);

  // Sync with user monetization wallet & transaction history
  const WALLETS_KEY = "sanatan_monetization_wallets_v1";
  const TRANSACTIONS_KEY = "sanatan_monetization_transactions_v1";

  const wallets = loadStorage<Record<string, any>>(WALLETS_KEY, {});
  wallets[req.userId] = {
    userId: req.userId,
    creditBalance: newBalance,
    purchasedCredits: target.purchasedCredits,
    referralCredits: target.referralCredits,
    bonusCredits: newBonus,
    expiredCredits: target.expiredCredits,
    lastUpdated: new Date().toISOString(),
  };
  saveStorage(WALLETS_KEY, wallets);

  const transactions = loadStorage<any[]>(TRANSACTIONS_KEY, []);
  transactions.unshift({
    id: `tx-${Date.now()}`,
    userId: req.userId,
    type: req.amount >= 0 ? "admin_grant" : "usage_deduction",
    amount: req.amount,
    balanceAfter: newBalance,
    description: `Admin Credit Adjustment [${req.reasonCategory.toUpperCase()}]: ${req.customNote}`,
    createdAt: new Date().toISOString(),
  });
  saveStorage(TRANSACTIONS_KEY, transactions);

  await addAuditLog({
    userId: req.userId,
    userName: target.userName,
    actor: "admin",
    actorName: "Super Admin",
    actionType: req.amount >= 0 ? "added" : "removed",
    delta: req.amount,
    balanceAfter: newBalance,
    reason: `Manual top-up [${req.reasonCategory.toUpperCase()}]: ${req.customNote}`,
  });

  return { ...target, ...overrides[req.userId] } as UserCreditAccount;
}

// ── Credit Packages ──────────────────────────────────────────
export async function fetchCreditPackages(): Promise<CreditPackageConfig[]> {
  return loadStorage<CreditPackageConfig[]>(PACKAGES_KEY, INITIAL_PACKAGES);
}

export async function saveCreditPackage(pkg: CreditPackageConfig): Promise<CreditPackageConfig> {
  const current = loadStorage<CreditPackageConfig[]>(PACKAGES_KEY, INITIAL_PACKAGES);
  const exists  = current.some((p) => p.id === pkg.id);
  const updated = exists ? current.map((p) => (p.id === pkg.id ? pkg : p)) : [...current, pkg];
  saveStorage(PACKAGES_KEY, updated);
  return pkg;
}

// ── Audit Logs ───────────────────────────────────────────────
export async function fetchCreditAuditLogs(): Promise<CreditAuditLogItem[]> {
  return loadStorage<CreditAuditLogItem[]>(LOGS_KEY, []);
}

export async function addAuditLog(
  log: Omit<CreditAuditLogItem, "id" | "timestamp">,
): Promise<CreditAuditLogItem> {
  const current = loadStorage<CreditAuditLogItem[]>(LOGS_KEY, []);
  const newLog: CreditAuditLogItem = {
    ...log,
    id:        `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
  saveStorage(LOGS_KEY, [newLog, ...current]);
  return newLog;
}

// ── Refunds ──────────────────────────────────────────────────
export async function refundUserCredits(req: RefundCreditRequest): Promise<void> {
  await performManualTopUp({
    userId:         req.userId,
    amount:         req.creditsToRefund,
    reasonCategory: "refund",
    customNote:     `Refund transaction ${req.transactionId}: ${req.reason}`,
  });
}

// ── Bulk Actions ─────────────────────────────────────────────
export async function performBulkCreditAction(req: BulkCreditActionRequest): Promise<void> {
  for (const userId of req.targetUserIds) {
    const delta = req.action === "bulk_remove" ? -Math.abs(req.amount) : Math.abs(req.amount);
    await performManualTopUp({
      userId,
      amount:         delta,
      reasonCategory: "admin_grant",
      customNote:     `Bulk action [${req.action}]: ${req.reason}`,
    });
  }
}

// ── Credit Analytics ─────────────────────────────────────────
export async function fetchCreditAnalytics(): Promise<CreditAnalyticsData> {
  const accounts = await fetchUserCreditAccounts();

  // Top buyers by purchased credits
  const topBuyers = [...accounts]
    .sort((a, b) => b.purchasedCredits - a.purchasedCredits)
    .slice(0, 5)
    .map((a) => ({
      userName:       a.userName,
      userEmail:      a.userEmail,
      totalSpentCents: a.purchasedCredits * 1800,
      creditsBought:  a.purchasedCredits,
    }));

  // Top users by credits consumed
  const topUsers = [...accounts]
    .sort((a, b) => (b.lifetimeCredits - b.currentBalance) - (a.lifetimeCredits - a.currentBalance))
    .slice(0, 5)
    .map((a) => ({
      userName:    a.userName,
      userEmail:   a.userEmail,
      creditsUsed: Math.max(0, a.lifetimeCredits - a.currentBalance),
    }));

  const totalIssued    = accounts.reduce((s, a) => s + a.lifetimeCredits, 0);
  const totalRemaining = accounts.reduce((s, a) => s + a.currentBalance, 0);
  const unusedRatio    = totalIssued > 0 ? Math.round((totalRemaining / totalIssued) * 100) : 0;
  const expiredTotal   = accounts.reduce((s, a) => s + a.expiredCredits, 0);

  const { data: orders } = await supabase.from("orders").select("amount_cents").eq("status", "paid");
  const revenueCents = (orders ?? []).reduce((s, o) => s + (o.amount_cents ?? 0), 0);

  const avgUsage = accounts.length > 0
    ? Math.round(accounts.reduce((s, a) => s + Math.max(0, a.lifetimeCredits - a.currentBalance), 0) / accounts.length)
    : 0;

  return {
    topBuyers,
    topUsers,
    unusedCreditsRatio: unusedRatio,
    expiredCreditsCount: expiredTotal,
    revenueCents,
    avgUsagePerUser: avgUsage,
  };
}
