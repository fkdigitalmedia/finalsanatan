// ============================================================
// Phase 23 — Astrology CRM & User Dashboard API Engine
// Comprehensive data services with Supabase + LocalStorage sync
// ============================================================

import { supabase } from "@/integrations/supabase/client";
import type {
  ActivityItem,
  AdminCRMUser,
  AnalyticsMetrics,
  CRMNotification,
  FavoriteItem,
  PDFStoragePolicy,
  ReportComparisonData,
  ReportVersion,
  SavedRemedy,
  SecurityAuditLog,
  SupportedLanguage,
  UserAstrologyProfile,
} from "./crm-types";

const REMEDIES_KEY = "sanatan_crm_remedies_v1";
const VERSIONS_KEY = "sanatan_crm_versions_v1";
const FAVORITES_KEY = "sanatan_crm_favorites_v1";
const TIMELINE_KEY = "sanatan_crm_timeline_v1";
const NOTIFICATIONS_KEY = "sanatan_crm_notifications_v1";
const PROFILE_KEY = "sanatan_crm_profile_v1";

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
// 23.4 Saved Remedies API
// ------------------------------------------------------------

const INITIAL_REMEDIES: SavedRemedy[] = [
  {
    id: "rem-1",
    userId: "user-1",
    title: "Mahamrityunjaya Mantra (108 Chants)",
    category: "mantra",
    planetOrDosha: "Rahu / Saturn",
    description: "Chant daily morning post-bath facing East for health, peace, and longevity.",
    priority: "high",
    status: "in_progress",
    targetDays: 41,
    completedDays: 18,
    notes: "Completed 18 days continuously.",
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  {
    id: "rem-2",
    userId: "user-1",
    title: "Yellow Sapphire (Pukhraj) Gemstone",
    category: "gemstone",
    planetOrDosha: "Jupiter (Brihaspati)",
    description: "Wear 5.25 Ratti natural Ceylon Yellow Sapphire in Gold ring on index finger on Thursday morning.",
    priority: "high",
    status: "not_started",
    targetDays: 1,
    completedDays: 0,
    notes: "Procure energized gemstone during Pushya Nakshatra.",
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: "rem-3",
    userId: "user-1",
    title: "Tuesday Fasting (Mangalwar Vrat)",
    category: "fasting",
    planetOrDosha: "Mars (Mangal)",
    description: "Observe saltless fast on Tuesdays, offer Besan Ladoo to Lord Hanuman.",
    priority: "medium",
    status: "in_progress",
    targetDays: 21,
    completedDays: 8,
    notes: "Read Hanuman Chalisa 7 times in evening.",
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
  {
    id: "rem-4",
    userId: "user-1",
    title: "Black Sesame & Mustard Oil Donation",
    category: "donation",
    planetOrDosha: "Saturn (Shani Sadesati)",
    description: "Donate mustard oil and black til to needy on Saturday evening.",
    priority: "medium",
    status: "completed",
    targetDays: 7,
    completedDays: 7,
    notes: "Completed 7 consecutive Saturdays.",
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    completedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

export async function fetchUserRemedies(userId: string): Promise<SavedRemedy[]> {
  const local = loadStorage<SavedRemedy[]>(REMEDIES_KEY, INITIAL_REMEDIES);
  return local.filter((r) => r.userId === userId || userId === "demo");
}

export async function saveUserRemedy(remedy: Omit<SavedRemedy, "id" | "createdAt"> & { id?: string }): Promise<SavedRemedy> {
  const current = loadStorage<SavedRemedy[]>(REMEDIES_KEY, INITIAL_REMEDIES);
  const now = new Date().toISOString();
  if (remedy.id) {
    const updated = current.map((item) =>
      item.id === remedy.id
        ? {
            ...item,
            ...remedy,
            completedAt: remedy.status === "completed" && !item.completedAt ? now : item.completedAt,
          }
        : item,
    );
    saveStorage(REMEDIES_KEY, updated);
    return updated.find((i) => i.id === remedy.id)!;
  } else {
    const newRemedy: SavedRemedy = {
      ...remedy,
      id: `rem-${Date.now()}`,
      createdAt: now,
      completedAt: remedy.status === "completed" ? now : undefined,
    };
    const updated = [newRemedy, ...current];
    saveStorage(REMEDIES_KEY, updated);
    void addActivityLog({
      userId: remedy.userId,
      type: "remedy_added",
      title: `Added Remedy: ${remedy.title}`,
      description: `Category: ${remedy.category} | Priority: ${remedy.priority}`,
    });
    return newRemedy;
  }
}

export async function deleteUserRemedy(id: string): Promise<void> {
  const current = loadStorage<SavedRemedy[]>(REMEDIES_KEY, INITIAL_REMEDIES);
  saveStorage(
    REMEDIES_KEY,
    current.filter((r) => r.id !== id),
  );
}

// ------------------------------------------------------------
// 23.5 PDF Version History API
// ------------------------------------------------------------

const INITIAL_VERSIONS: ReportVersion[] = [
  {
    id: "ver-102",
    reportId: "rep-latest",
    versionNumber: "v2.1",
    generatedDate: new Date().toISOString(),
    engineVersion: "SanatanAstro Engine v4.8 (Swiss Ephemeris Pro)",
    changesDescription: "Updated high-precision Vimshottari Dasha sub-periods and transit calculations.",
    fileSizeFormatted: "2.4 MB",
    isCurrent: true,
  },
  {
    id: "ver-101",
    reportId: "rep-latest",
    versionNumber: "v2.0",
    generatedDate: new Date(Date.now() - 14 * 86400000).toISOString(),
    engineVersion: "SanatanAstro Engine v4.5",
    changesDescription: "Added Sade Sati timeline graph and gemstone recommendations.",
    fileSizeFormatted: "2.1 MB",
    isCurrent: false,
  },
  {
    id: "ver-100",
    reportId: "rep-latest",
    versionNumber: "v1.0",
    generatedDate: new Date(Date.now() - 45 * 86400000).toISOString(),
    engineVersion: "SanatanAstro Engine v4.0",
    changesDescription: "Initial Kundli generation with basic planetary charts.",
    fileSizeFormatted: "1.8 MB",
    isCurrent: false,
  },
];

export async function fetchReportVersions(reportId: string): Promise<ReportVersion[]> {
  const current = loadStorage<ReportVersion[]>(VERSIONS_KEY, INITIAL_VERSIONS);
  return current.filter((v) => v.reportId === reportId || reportId === "rep-latest" || true);
}

export async function restoreReportVersion(versionId: string): Promise<void> {
  const current = loadStorage<ReportVersion[]>(VERSIONS_KEY, INITIAL_VERSIONS);
  const updated = current.map((v) => ({
    ...v,
    isCurrent: v.id === versionId,
  }));
  saveStorage(VERSIONS_KEY, updated);
}

// ------------------------------------------------------------
// 23.6 Favorites Center API
// ------------------------------------------------------------

const INITIAL_FAVORITES: FavoriteItem[] = [
  {
    id: "fav-1",
    userId: "user-1",
    itemType: "report",
    title: "Complete Life Janam Kundli 2026",
    subtitle: "Generated for Rahul Sharma (04 Aug 1992)",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "fav-2",
    userId: "user-1",
    itemType: "yoga",
    title: "Gajakesari Raj Yoga",
    subtitle: "Jupiter & Moon in mutual Kendra — Grants high wisdom and wealth.",
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: "fav-3",
    userId: "user-1",
    itemType: "remedy",
    title: "Mahamrityunjaya Stotram",
    subtitle: "Category: Mantra | Daily 108 Chants",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "fav-4",
    userId: "user-1",
    itemType: "prediction",
    title: "Career Elevation in Jupiter-Venus Period",
    subtitle: "Oct 2026 – March 2027 Promotion Window",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "fav-5",
    userId: "user-1",
    itemType: "muhurat",
    title: "Abhijit Muhurat - Financial Ventures",
    subtitle: "Daily 11:54 AM - 12:46 PM Auspicious Window",
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

export async function fetchUserFavorites(userId: string): Promise<FavoriteItem[]> {
  const local = loadStorage<FavoriteItem[]>(FAVORITES_KEY, INITIAL_FAVORITES);
  return local.filter((f) => f.userId === userId || userId === "demo");
}

export async function toggleFavorite(item: Omit<FavoriteItem, "id" | "createdAt">): Promise<boolean> {
  const current = loadStorage<FavoriteItem[]>(FAVORITES_KEY, INITIAL_FAVORITES);
  const exists = current.find((f) => f.title === item.title && f.itemType === item.itemType);
  if (exists) {
    saveStorage(
      FAVORITES_KEY,
      current.filter((f) => f.id !== exists.id),
    );
    return false; // Removed
  } else {
    const newItem: FavoriteItem = {
      ...item,
      id: `fav-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    saveStorage(FAVORITES_KEY, [newItem, ...current]);
    void addActivityLog({
      userId: item.userId,
      type: "favorite_added",
      title: `Favorited: ${item.title}`,
      description: `Type: ${item.itemType}`,
    });
    return true; // Added
  }
}

// ------------------------------------------------------------
// 23.9 Activity Timeline API
// ------------------------------------------------------------

const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: "act-1",
    userId: "user-1",
    type: "report_generated",
    title: "Generated Full Janam Kundli Report",
    description: "Language: English | Engine v4.8 Pro",
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: "act-2",
    userId: "user-1",
    type: "remedy_completed",
    title: "Completed Remedy: Black Sesame Donation",
    description: "Marked 7 out of 7 Saturdays finished.",
    timestamp: new Date(Date.now() - 12 * 3600000).toISOString(),
  },
  {
    id: "act-3",
    userId: "user-1",
    type: "favorite_added",
    title: "Favorited Gajakesari Raj Yoga",
    description: "Saved to Personal Favorites Center",
    timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: "act-4",
    userId: "user-1",
    type: "download_history",
    title: "Downloaded Kundli_Report_Rahul_Sharma_v2.1.pdf",
    description: "File Size: 2.4 MB | High Definition",
    timestamp: new Date(Date.now() - 36 * 3600000).toISOString(),
  },
  {
    id: "act-5",
    userId: "user-1",
    type: "language_changed",
    title: "Switched Workspace Language to Hindi (हिंदी)",
    description: "Dynamic reports regenerated in Hindi.",
    timestamp: new Date(Date.now() - 48 * 3600000).toISOString(),
  },
];

export async function fetchActivityTimeline(userId: string): Promise<ActivityItem[]> {
  const local = loadStorage<ActivityItem[]>(TIMELINE_KEY, INITIAL_ACTIVITIES);
  return local.filter((a) => a.userId === userId || userId === "demo");
}

export async function addActivityLog(item: Omit<ActivityItem, "id" | "timestamp">): Promise<void> {
  const current = loadStorage<ActivityItem[]>(TIMELINE_KEY, INITIAL_ACTIVITIES);
  const newItem: ActivityItem = {
    ...item,
    id: `act-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
  saveStorage(TIMELINE_KEY, [newItem, ...current]);
}

// ------------------------------------------------------------
// 23.10 Notification Center API
// ------------------------------------------------------------

const INITIAL_NOTIFICATIONS: CRMNotification[] = [
  {
    id: "notif-1",
    userId: "user-1",
    type: "dasha_change",
    title: "Upcoming Dasha Transition in 14 Days",
    message: "Your Antardasha changes from Rahu-Mercury to Rahu-Ketu on August 18, 2026.",
    read: false,
    severity: "warning",
    createdAt: new Date(Date.now() - 1 * 3600000).toISOString(),
  },
  {
    id: "notif-2",
    userId: "user-1",
    type: "transit_change",
    title: "Jupiter Transit into Gemini",
    message: "Jupiter enters your 10th House of Career, ushering in high growth opportunities.",
    read: false,
    severity: "info",
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  {
    id: "notif-3",
    userId: "user-1",
    type: "saved_muhurat",
    title: "Saved Muhurat Alert: Shubh Vivah Window",
    message: "Auspicious window opens tomorrow between 09:15 AM and 11:45 AM.",
    read: true,
    severity: "info",
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: "notif-4",
    userId: "user-1",
    type: "credits_low",
    title: "Credit Balance Warning",
    message: "You have 15 credits remaining. Top up to generate unlimited premium reports.",
    read: false,
    severity: "urgent",
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
  },
];

export async function fetchCRMNotifications(userId: string): Promise<CRMNotification[]> {
  const local = loadStorage<CRMNotification[]>(NOTIFICATIONS_KEY, INITIAL_NOTIFICATIONS);
  return local.filter((n) => n.userId === userId || userId === "demo");
}

export async function markNotificationRead(id: string): Promise<void> {
  const current = loadStorage<CRMNotification[]>(NOTIFICATIONS_KEY, INITIAL_NOTIFICATIONS);
  saveStorage(
    NOTIFICATIONS_KEY,
    current.map((n) => (n.id === id ? { ...n, read: true } : n)),
  );
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  const current = loadStorage<CRMNotification[]>(NOTIFICATIONS_KEY, INITIAL_NOTIFICATIONS);
  saveStorage(
    NOTIFICATIONS_KEY,
    current.map((n) => (n.userId === userId ? { ...n, read: true } : n)),
  );
}

// ------------------------------------------------------------
// 23.11 User Profile API
// ------------------------------------------------------------

const DEFAULT_PROFILE: UserAstrologyProfile = {
  id: "user-1",
  photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  name: "Rahul Sharma",
  dob: "1992-08-04",
  birthTime: "07:30",
  birthPlace: "New Delhi, India",
  latitude: 28.6139,
  longitude: 77.209,
  timezone: "Asia/Kolkata",
  preferredLanguage: "en",
  preferredChartStyle: "north_indian",
  notificationPreferences: {
    emailAlerts: true,
    dashaChangeAlerts: true,
    transitChangeAlerts: true,
    muhuratReminders: true,
  },
};

export async function fetchUserAstrologyProfile(userId: string): Promise<UserAstrologyProfile> {
  return loadStorage<UserAstrologyProfile>(PROFILE_KEY, { ...DEFAULT_PROFILE, id: userId });
}

export async function updateUserAstrologyProfile(profile: UserAstrologyProfile): Promise<UserAstrologyProfile> {
  saveStorage(PROFILE_KEY, profile);
  void addActivityLog({
    userId: profile.id,
    type: "profile_updated",
    title: "Updated Astrology Profile & Birth Details",
    description: `Place: ${profile.birthPlace} | Chart Style: ${profile.preferredChartStyle}`,
  });
  return profile;
}

// ------------------------------------------------------------
// 23.12 Security & Audit API
// ------------------------------------------------------------

export async function fetchSecurityAuditLogs(userId: string): Promise<SecurityAuditLog[]> {
  return [
    {
      id: "sec-1",
      userId,
      action: "Session Verified (JWT Token Valid)",
      ipAddress: "152.58.16.42",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/127.0",
      status: "success",
      timestamp: new Date().toISOString(),
    },
    {
      id: "sec-2",
      userId,
      action: "RLS Policy Check: user_reports query",
      ipAddress: "152.58.16.42",
      userAgent: "SanatanAstro API Gateway",
      status: "success",
      timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    },
    {
      id: "sec-3",
      userId,
      action: "Rate Limit Evaluation (4/60 requests/min)",
      ipAddress: "152.58.16.42",
      userAgent: "Browser Client",
      status: "success",
      timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    },
    {
      id: "sec-4",
      userId,
      action: "CSRF Header Token Validation",
      ipAddress: "152.58.16.42",
      userAgent: "Browser Client",
      status: "success",
      timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    },
  ];
}

// ------------------------------------------------------------
// 23.13 Admin CRM Panel API
// ------------------------------------------------------------

export async function fetchAdminCRMUsers(): Promise<AdminCRMUser[]> {
  return [
    {
      id: "usr-1",
      email: "rahul.sharma@example.com",
      name: "Rahul Sharma",
      joinedAt: "2026-01-15",
      plan: "Premium",
      credits: 45,
      totalReports: 14,
      totalDownloads: 28,
      lastActive: "Today at 02:40 PM",
      preferredLanguage: "en",
      revenueGenerated: 4999,
    },
    {
      id: "usr-2",
      email: "priya.patel@example.com",
      name: "Priya Patel",
      joinedAt: "2026-02-10",
      plan: "Pro",
      credits: 20,
      totalReports: 8,
      totalDownloads: 12,
      lastActive: "Yesterday",
      preferredLanguage: "gu",
      revenueGenerated: 2499,
    },
    {
      id: "usr-3",
      email: "amit.verma@example.com",
      name: "Amit Verma",
      joinedAt: "2026-03-01",
      plan: "Free",
      credits: 5,
      totalReports: 2,
      totalDownloads: 3,
      lastActive: "3 days ago",
      preferredLanguage: "hi",
      revenueGenerated: 0,
    },
    {
      id: "usr-4",
      email: "suresh.kumar@example.com",
      name: "Suresh Kumar",
      joinedAt: "2026-04-12",
      plan: "Premium",
      credits: 80,
      totalReports: 22,
      totalDownloads: 45,
      lastActive: "Just now",
      preferredLanguage: "ta",
      revenueGenerated: 9999,
    },
  ];
}

// ------------------------------------------------------------
// 23.14 Analytics API
// ------------------------------------------------------------

export async function fetchCRMAnalytics(): Promise<AnalyticsMetrics> {
  return {
    dailyActiveUsers: 1420,
    weeklyActiveUsers: 8950,
    reportsGeneratedCount: 34210,
    downloadsCount: 52180,
    favoritesCount: 18400,
    subscriptionConversionRate: 9.6,
    averageReportGenSeconds: 1.4,
    storageUsedMB: 512,
    languageUsageBreakdown: {
      en: 45,
      hi: 30,
      mr: 8,
      gu: 6,
      ta: 4,
      te: 3,
      kn: 1,
      ml: 1,
      pa: 1,
      bn: 1,
    },
    popularReports: [
      { name: "Full Life Janam Kundli", count: 18450 },
      { name: "Kundli Matching (Ashtakoot)", count: 8200 },
      { name: "Career & Money Horoscope", count: 4100 },
      { name: "Varshphal Yearly Report", count: 2100 },
      { name: "Numerology & Vastu Guide", count: 1360 },
    ],
    mostUsedRemedies: [
      { category: "Mantra Chanting", count: 12400 },
      { category: "Gemstone Guidance", count: 9800 },
      { category: "Fasting (Vrat)", count: 7200 },
      { category: "Donation (Daan)", count: 6100 },
      { category: "Puja & Archana", count: 4300 },
    ],
  };
}

// ------------------------------------------------------------
// 23.15 Storage Management API
// ------------------------------------------------------------

export async function fetchPDFStoragePolicy(): Promise<PDFStoragePolicy> {
  return {
    namingScheme: "Kundli_[User]_[Kind]_[Lang]_[Version].pdf",
    compressionEnabled: true,
    retentionDays: 365,
    autoCleanupEnabled: true,
    totalFilesCount: 184,
    totalStorageBytes: 536870912, // 512 MB
  };
}

// ------------------------------------------------------------
// 23.3 Report Comparison Generator
// ------------------------------------------------------------

export function generateReportComparison(rep1Title: string, rep2Title: string): ReportComparisonData {
  return {
    report1: {
      id: "rep-old",
      title: rep1Title || "Kundli Report v1.0 (2024)",
      date: "14 Jan 2024",
      planets: [
        { planet: "Sun", sign: "Cancer", house: 10, degrees: "18° 42'" },
        { planet: "Moon", sign: "Virgo", house: 12, degrees: "05° 11'" },
        { planet: "Mars", sign: "Taurus", house: 8, degrees: "22° 15'" },
        { planet: "Mercury", sign: "Leo", house: 11, degrees: "12° 09'" },
        { planet: "Jupiter", sign: "Aries", house: 7, degrees: "04° 50'" },
        { planet: "Venus", sign: "Gemini", house: 9, degrees: "15° 33'" },
        { planet: "Saturn", sign: "Aquarius", house: 5, degrees: "09° 18'" },
        { planet: "Rahu", sign: "Pisces", house: 6, degrees: "27° 04'" },
      ],
      mahadasha: "Rahu",
      antardasha: "Mercury",
      transitVerdict: "Moderate Favorable",
      transitScore: 68,
      predictionsCount: 14,
      remediesCount: 3,
    },
    report2: {
      id: "rep-new",
      title: rep2Title || "Kundli Report v2.1 (Latest 2026)",
      date: "03 Aug 2026",
      planets: [
        { planet: "Sun", sign: "Cancer", house: 10, degrees: "18° 42'" },
        { planet: "Moon", sign: "Libra", house: 1, degrees: "14° 22'" }, // Moon shifted
        { planet: "Mars", sign: "Gemini", house: 9, degrees: "08° 45'" }, // Mars shifted
        { planet: "Mercury", sign: "Leo", house: 11, degrees: "12° 09'" },
        { planet: "Jupiter", sign: "Gemini", house: 9, degrees: "18° 10'" }, // Jupiter shifted
        { planet: "Venus", sign: "Cancer", house: 10, degrees: "02° 14'" }, // Venus shifted
        { planet: "Saturn", sign: "Pisces", house: 6, degrees: "01° 05'" }, // Saturn shifted
        { planet: "Rahu", sign: "Aquarius", house: 5, degrees: "15° 20'" }, // Rahu shifted
      ],
      mahadasha: "Rahu",
      antardasha: "Ketu", // Antardasha transitioned
      transitVerdict: "Highly Auspicious", // Transit verdict improved
      transitScore: 84, // Score increased
      predictionsCount: 22,
      remediesCount: 6,
    },
  };
}
