// ============================================================
// Phase 14.5 — User Dashboard & Astrology Workspace
// Shared types for the personal workspace.
// Nothing here is hardcoded to a single report or module:
// report kinds, relationships and periods are open string
// unions so future modules plug in without a schema change.
// ============================================================

import type { Database } from "@/integrations/supabase/types";

export type UserKundli = Database["public"]["Tables"]["user_kundlis"]["Row"];
export type UserKundliInsert = Database["public"]["Tables"]["user_kundlis"]["Insert"];
export type FamilyMember = Database["public"]["Tables"]["family_members"]["Row"];
export type FamilyMemberInsert = Database["public"]["Tables"]["family_members"]["Insert"];
export type HoroscopeHistoryRow = Database["public"]["Tables"]["horoscope_history"]["Row"];
export type UserReport = Database["public"]["Tables"]["user_reports"]["Row"];
export type ReportDownload = Database["public"]["Tables"]["report_downloads"]["Row"];
export type UserDevice = Database["public"]["Tables"]["user_devices"]["Row"];
export type ActivityLogRow = Database["public"]["Tables"]["user_activity_log"]["Row"];

/** Open union — new modules may register any kind. */
export type ReportKind =
  | "janam-kundli"
  | "kundli-matching"
  | "career"
  | "business"
  | "marriage"
  | "muhurat"
  | "numerology"
  | "vastu"
  | "varshphal"
  | "horoscope"
  | "gochar"
  | "dasha"
  | "festival"
  | (string & {});

export const REPORT_KINDS: { value: ReportKind; label: string }[] = [
  { value: "janam-kundli", label: "Janam Kundli" },
  { value: "kundli-matching", label: "Kundli Matching" },
  { value: "career", label: "Career" },
  { value: "business", label: "Business" },
  { value: "marriage", label: "Marriage" },
  { value: "muhurat", label: "Muhurat" },
  { value: "numerology", label: "Numerology" },
  { value: "vastu", label: "Vastu" },
  { value: "varshphal", label: "Varshphal" },
  { value: "horoscope", label: "Horoscope" },
  { value: "gochar", label: "Gochar" },
  { value: "dasha", label: "Dasha" },
  { value: "festival", label: "Festival" },
];

export type HoroscopePeriod =
  "daily" | "weekly" | "monthly" | "yearly" | "personalized" | (string & {});

export const HOROSCOPE_PERIODS: HoroscopePeriod[] = [
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "personalized",
];

export const RELATIONSHIPS = [
  "self",
  "father",
  "mother",
  "spouse",
  "son",
  "daughter",
  "brother",
  "sister",
  "friend",
  "other",
] as const;
export type Relationship = (typeof RELATIONSHIPS)[number] | (string & {});

export interface Page<T> {
  rows: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ListQuery {
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface WorkspaceAnalytics {
  reports: number;
  downloads: number;
  horoscopeViews: number;
  savedCharts: number;
  familyMembers: number;
  aiUsage: number;
}

export interface GlobalSearchHit {
  id: string;
  type: "kundli" | "family" | "report" | "download" | "horoscope";
  title: string;
  subtitle?: string;
  href: string;
}
