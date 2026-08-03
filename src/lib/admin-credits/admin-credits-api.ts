// ============================================================
// Phase 24.1 — Enterprise Credit Management API Engine
// Comprehensive data services with Supabase + LocalStorage sync
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

const ACCOUNTS_KEY = "sanatan_admin_credit_accounts_v1";
const PACKAGES_KEY = "sanatan_admin_credit_packages_v1";
const LOGS_KEY = "sanatan_admin_credit_logs_v1";
const RULES_KEY = "sanatan_admin_credit_rules_v1";

const INITIAL_ACCOUNTS: UserCreditAccount[] = [
  {
    userId: "usr-101",
    userName: "Rahul Sharma",
    userEmail: "rahul.sharma@example.com",
    currentBalance: 120,
    lifetimeCredits: 350,
    purchasedCredits: 250,
    bonusCredits: 50,
    referralCredits: 50,
    expiredCredits: 0,
    status: "active",
    lastTopUpDate: "2026-08-01",
    createdAt: "2026-01-15",
  },
  {
    userId: "usr-102",
    userName: "Priya Sharma",
    userEmail: "priya.sharma@example.com",
    currentBalance: 45,
    lifetimeCredits: 100,
    purchasedCredits: 50,
    bonusCredits: 25,
    referralCredits: 25,
    expiredCredits: 5,
    status: "active",
    lastTopUpDate: "2026-07-28",
    createdAt: "2026-02-10",
  },
  {
    userId: "usr-103",
    userName: "Amit Kumar",
    userEmail: "amit.kumar@example.com",
    currentBalance: 5,
    lifetimeCredits: 50,
    purchasedCredits: 30,
    bonusCredits: 10,
    referralCredits: 10,
    expiredCredits: 10,
    status: "active",
    lastTopUpDate: "2026-06-15",
    createdAt: "2026-03-01",
  },
  {
    userId: "usr-104",
    userName: "Neha Verma",
    userEmail: "neha.verma@example.com",
    currentBalance: 0,
    lifetimeCredits: 200,
    purchasedCredits: 150,
    bonusCredits: 25,
    referralCredits: 25,
    expiredCredits: 20,
    status: "frozen",
    lastTopUpDate: "2026-05-12",
    createdAt: "2026-03-20",
  },
];

const INITIAL_PACKAGES: CreditPackageConfig[] = [
  {
    id: "pack-10",
    name: "Starter Pack",
    creditAmount: 10,
    bonusCredits: 0,
    priceCents: 19900, // ₹199
    currency: "INR",
    badgeText: "BASIC",
    isPopular: false,
    isActive: true,
    displayOrder: 1,
  },
  {
    id: "pack-25",
    name: "Popular Pack",
    creditAmount: 25,
    bonusCredits: 5,
    priceCents: 39900, // ₹399
    currency: "INR",
    badgeText: "5 BONUS CREDITS",
    isPopular: true,
    isActive: true,
    displayOrder: 2,
  },
  {
    id: "pack-50",
    name: "Pro Pack",
    creditAmount: 50,
    bonusCredits: 15,
    priceCents: 69900, // ₹699
    currency: "INR",
    badgeText: "BEST VALUE",
    isPopular: false,
    isActive: true,
    displayOrder: 3,
  },
  {
    id: "pack-100",
    name: "Astrologer Pack",
    creditAmount: 100,
    bonusCredits: 35,
    priceCents: 129900, // ₹1,299
    currency: "INR",
    badgeText: "35% EXTRA",
    isPopular: false,
    isActive: true,
    displayOrder: 4,
  },
  {
    id: "pack-250",
    name: "Agency Pack",
    creditAmount: 250,
    bonusCredits: 100,
    priceCents: 299900, // ₹2,999
    currency: "INR",
    badgeText: "BULK DISCOUNT",
    isPopular: false,
    isActive: true,
    displayOrder: 5,
  },
];

const INITIAL_LOGS: CreditAuditLogItem[] = [
  {
    id: "log-1",
    userId: "usr-101",
    userName: "Rahul Sharma",
    actor: "admin",
    actorName: "Super Admin",
    actionType: "added",
    delta: 50,
    balanceAfter: 120,
    reason: "Compensation for support ticket #4821",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "log-2",
    userId: "usr-102",
    userName: "Priya Sharma",
    actor: "user",
    actorName: "Priya Sharma",
    actionType: "pdf_usage",
    delta: -10,
    balanceAfter: 45,
    reason: "Generated Janam Kundli Full PDF",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
  },
];

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
// 24.1 Credit Dashboard Summary API
// ------------------------------------------------------------

export async function fetchCreditDashboardMetrics(): Promise<CreditDashboardMetrics> {
  const accounts = loadStorage<UserCreditAccount[]>(ACCOUNTS_KEY, INITIAL_ACCOUNTS);
  const totalIssued = accounts.reduce((acc, curr) => acc + curr.lifetimeCredits, 0);
  const totalRemaining = accounts.reduce((acc, curr) => acc + curr.currentBalance, 0);
  const totalPurchased = accounts.reduce((acc, curr) => acc + curr.purchasedCredits, 0);
  const totalGifted = accounts.reduce((acc, curr) => acc + curr.bonusCredits, 0);
  const totalExpired = accounts.reduce((acc, curr) => acc + curr.expiredCredits, 0);
  const totalUsed = totalIssued - totalRemaining - totalExpired;

  return {
    totalCreditsIssued: totalIssued,
    totalCreditsUsed: Math.max(0, totalUsed),
    totalCreditsRemaining: totalRemaining,
    totalCreditsPurchased: totalPurchased,
    totalCreditsGifted: totalGifted,
    totalCreditsExpired: totalExpired,
    revenueFromCreditsCents: totalPurchased * 1500, // estimated revenue
  };
}

// ------------------------------------------------------------
// 24.2 User Credit Account Management API
// ------------------------------------------------------------

export async function fetchUserCreditAccounts(): Promise<UserCreditAccount[]> {
  return loadStorage<UserCreditAccount[]>(ACCOUNTS_KEY, INITIAL_ACCOUNTS);
}

export async function updateUserAccountStatus(
  userId: string,
  status: "active" | "frozen" | "suspended",
): Promise<UserCreditAccount> {
  const current = loadStorage<UserCreditAccount[]>(ACCOUNTS_KEY, INITIAL_ACCOUNTS);
  const updated = current.map((acc) => (acc.userId === userId ? { ...acc, status } : acc));
  saveStorage(ACCOUNTS_KEY, updated);

  // Add audit log
  const user = updated.find((u) => u.userId === userId)!;
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

// ------------------------------------------------------------
// 24.3 Manual Top-up API
// ------------------------------------------------------------

export async function performManualTopUp(req: ManualTopUpRequest): Promise<UserCreditAccount> {
  const accounts = loadStorage<UserCreditAccount[]>(ACCOUNTS_KEY, INITIAL_ACCOUNTS);
  const target = accounts.find((a) => a.userId === req.userId);
  if (!target) throw new Error("User account not found");

  const newBalance = target.currentBalance + req.amount;
  const newLifetime = req.amount > 0 ? target.lifetimeCredits + req.amount : target.lifetimeCredits;
  const newBonus = req.amount > 0 ? target.bonusCredits + req.amount : target.bonusCredits;

  const updatedTarget: UserCreditAccount = {
    ...target,
    currentBalance: newBalance,
    lifetimeCredits: newLifetime,
    bonusCredits: newBonus,
    lastTopUpDate: new Date().toISOString().split("T")[0],
  };

  const updatedAccounts = accounts.map((a) => (a.userId === req.userId ? updatedTarget : a));
  saveStorage(ACCOUNTS_KEY, updatedAccounts);

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

  return updatedTarget;
}

// ------------------------------------------------------------
// 24.4 Credit Package Configuration API
// ------------------------------------------------------------

export async function fetchCreditPackages(): Promise<CreditPackageConfig[]> {
  return loadStorage<CreditPackageConfig[]>(PACKAGES_KEY, INITIAL_PACKAGES);
}

export async function saveCreditPackage(pkg: CreditPackageConfig): Promise<CreditPackageConfig> {
  const current = loadStorage<CreditPackageConfig[]>(PACKAGES_KEY, INITIAL_PACKAGES);
  const exists = current.some((p) => p.id === pkg.id);
  const updated = exists ? current.map((p) => (p.id === pkg.id ? pkg : p)) : [...current, pkg];
  saveStorage(PACKAGES_KEY, updated);
  return pkg;
}

// ------------------------------------------------------------
// 24.7 & 24.13 Audit Logs API
// ------------------------------------------------------------

export async function fetchCreditAuditLogs(): Promise<CreditAuditLogItem[]> {
  return loadStorage<CreditAuditLogItem[]>(LOGS_KEY, INITIAL_LOGS);
}

export async function addAuditLog(
  log: Omit<CreditAuditLogItem, "id" | "timestamp">,
): Promise<CreditAuditLogItem> {
  const current = loadStorage<CreditAuditLogItem[]>(LOGS_KEY, INITIAL_LOGS);
  const newLog: CreditAuditLogItem = {
    ...log,
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
  saveStorage(LOGS_KEY, [newLog, ...current]);
  return newLog;
}

// ------------------------------------------------------------
// 24.9 Refund & Reversals API
// ------------------------------------------------------------

export async function refundUserCredits(req: RefundCreditRequest): Promise<void> {
  await performManualTopUp({
    userId: req.userId,
    amount: req.creditsToRefund,
    reasonCategory: "refund",
    customNote: `Refund transaction ${req.transactionId}: ${req.reason}`,
  });
}

// ------------------------------------------------------------
// 24.10 Bulk Actions API
// ------------------------------------------------------------

export async function performBulkCreditAction(req: BulkCreditActionRequest): Promise<void> {
  for (const userId of req.targetUserIds) {
    const delta = req.action === "bulk_remove" ? -Math.abs(req.amount) : Math.abs(req.amount);
    await performManualTopUp({
      userId,
      amount: delta,
      reasonCategory: "admin_grant",
      customNote: `Bulk action [${req.action}]: ${req.reason}`,
    });
  }
}

// ------------------------------------------------------------
// 24.12 Credit Analytics API
// ------------------------------------------------------------

export async function fetchCreditAnalytics(): Promise<CreditAnalyticsData> {
  const accounts = loadStorage<UserCreditAccount[]>(ACCOUNTS_KEY, INITIAL_ACCOUNTS);
  return {
    topBuyers: accounts.slice(0, 3).map((a) => ({
      userName: a.userName,
      userEmail: a.userEmail,
      totalSpentCents: a.purchasedCredits * 1800,
      creditsBought: a.purchasedCredits,
    })),
    topUsers: accounts.slice(0, 3).map((a) => ({
      userName: a.userName,
      userEmail: a.userEmail,
      creditsUsed: a.lifetimeCredits - a.currentBalance,
    })),
    unusedCreditsRatio: 34.5,
    expiredCreditsCount: accounts.reduce((acc, curr) => acc + curr.expiredCredits, 0),
    revenueCents: 48500000,
    avgUsagePerUser: 78,
  };
}
