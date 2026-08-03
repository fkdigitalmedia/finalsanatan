// ============================================================
// Phase 23 — Astrology CRM & User Dashboard Types
// Enterprise-grade TypeScript models for Astrology CRM
// ============================================================

export type SupportedLanguage =
  | "en" // English
  | "hi" // Hindi
  | "mr" // Marathi
  | "gu" // Gujarati
  | "ta" // Tamil
  | "te" // Telugu
  | "kn" // Kannada
  | "ml" // Malayalam
  | "pa" // Punjabi
  | "bn"; // Bengali

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "hi", name: "Hindi", nativeName: "हिंदी", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳" },
];

export type RemedyCategory =
  | "mantra"
  | "donation"
  | "temple_visit"
  | "gemstone"
  | "fasting"
  | "puja";

export type RemedyPriority = "high" | "medium" | "low";
export type RemedyStatus = "not_started" | "in_progress" | "completed";

export interface SavedRemedy {
  id: string;
  userId: string;
  title: string;
  category: RemedyCategory;
  planetOrDosha?: string;
  description: string;
  priority: RemedyPriority;
  status: RemedyStatus;
  notes?: string;
  targetDays?: number;
  completedDays?: number;
  createdAt: string;
  completedAt?: string;
}

export interface ReportVersion {
  id: string;
  reportId: string;
  versionNumber: string; // e.g. "v1.0", "v1.1", "v2.0"
  generatedDate: string;
  engineVersion: string; // e.g. "SanatanAstro Engine 4.2"
  changesDescription: string;
  fileSizeFormatted: string;
  downloadUrl?: string;
  isCurrent: boolean;
}

export type FavoriteItemType =
  | "report"
  | "yoga"
  | "remedy"
  | "prediction"
  | "muhurat";

export interface FavoriteItem {
  id: string;
  userId: string;
  itemType: FavoriteItemType;
  title: string;
  subtitle?: string;
  itemData?: Record<string, unknown>;
  createdAt: string;
}

export type ActivityType =
  | "report_generated"
  | "prediction_updated"
  | "remedy_added"
  | "remedy_completed"
  | "favorite_added"
  | "language_changed"
  | "download_history"
  | "profile_updated";

export interface ActivityItem {
  id: string;
  userId: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface CRMNotification {
  id: string;
  userId: string;
  type:
    | "dasha_change"
    | "transit_change"
    | "saved_muhurat"
    | "report_ready"
    | "subscription_expiry"
    | "credits_low";
  title: string;
  message: string;
  read: boolean;
  severity: "info" | "warning" | "urgent";
  createdAt: string;
}

export type ChartStyle = "north_indian" | "south_indian" | "east_indian";

export interface UserAstrologyProfile {
  id: string;
  userId?: string;
  photoUrl?: string;
  name: string;
  dob: string; // YYYY-MM-DD
  birthTime: string; // HH:mm
  birthPlace: string;
  latitude: number;
  longitude: number;
  timezone: string;
  preferredLanguage: SupportedLanguage;
  preferredChartStyle: ChartStyle;
  currentSubscription?: string;
  creditsRemaining?: number;
  notificationPreferences: {
    emailAlerts: boolean;
    dashaChangeAlerts: boolean;
    transitChangeAlerts: boolean;
    muhuratReminders: boolean;
  };
}

export interface SecurityAuditLog {
  id: string;
  userId: string;
  action: string;
  ipAddress: string;
  userAgent: string;
  status: "success" | "blocked" | "flagged";
  timestamp: string;
}

export interface AdminCRMUser {
  id: string;
  email: string;
  name: string;
  joinedAt: string;
  plan: "Free" | "Pro" | "Premium" | "Enterprise";
  credits: number;
  totalReports: number;
  totalDownloads: number;
  lastActive: string;
  preferredLanguage: SupportedLanguage;
  revenueGenerated: number; // in INR
}

export interface AnalyticsMetrics {
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  reportsGeneratedCount: number;
  downloadsCount: number;
  favoritesCount: number;
  subscriptionConversionRate: number; // percentage e.g. 8.4
  averageReportGenSeconds: number; // e.g. 1.8
  storageUsedMB: number; // e.g. 412
  languageUsageBreakdown: Record<SupportedLanguage, number>;
  popularReports: { name: string; count: number }[];
  mostUsedRemedies: { category: string; count: number }[];
}

export interface PDFStoragePolicy {
  namingScheme: string; // e.g. "Kundli_[Name]_[Lang]_[Version].pdf"
  compressionEnabled: boolean;
  retentionDays: number; // e.g. 365
  autoCleanupEnabled: boolean;
  totalFilesCount: number;
  totalStorageBytes: number;
}

export interface ReportComparisonData {
  report1: {
    id: string;
    title: string;
    date: string;
    planets: Array<{ planet: string; sign: string; house: number; degrees: string }>;
    mahadasha: string;
    antardasha: string;
    transitVerdict: string;
    transitScore: number;
    predictionsCount: number;
    remediesCount: number;
  };
  report2: {
    id: string;
    title: string;
    date: string;
    planets: Array<{ planet: string; sign: string; house: number; degrees: string }>;
    mahadasha: string;
    antardasha: string;
    transitVerdict: string;
    transitScore: number;
    predictionsCount: number;
    remediesCount: number;
  };
}
