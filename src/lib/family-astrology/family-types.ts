// ============================================================
// Phase 24 — Family Astrology Workspace Types
// Enterprise-grade TypeScript models for Family Astrology
// ============================================================

export type FamilyRelationship =
  | "self"
  | "spouse"
  | "father"
  | "mother"
  | "son"
  | "daughter"
  | "brother"
  | "sister"
  | "grandfather"
  | "grandmother"
  | "grandson"
  | "granddaughter"
  | "other_relative";

export const FAMILY_RELATIONSHIP_LABELS: Record<FamilyRelationship, string> = {
  self: "Self",
  spouse: "Spouse (Husband / Wife)",
  father: "Father",
  mother: "Mother",
  son: "Son",
  daughter: "Daughter",
  brother: "Brother",
  sister: "Sister",
  grandfather: "Grandfather",
  grandmother: "Grandmother",
  grandson: "Grandson",
  granddaughter: "Granddaughter",
  other_relative: "Other Relative",
};

export interface ExtendedFamilyMember {
  id: string;
  userId: string;
  name: string;
  relationship: FamilyRelationship;
  gender: "male" | "female" | "other";
  photoUrl?: string;
  dob: string; // YYYY-MM-DD
  birthTime: string; // HH:mm
  birthPlace: string;
  latitude: number;
  longitude: number;
  timezone: string;
  preferredLanguage: string;
  notes?: string;
  lagnaSign?: string;
  rashiSign?: string;
  nakshatra?: string;
  currentMahadasha?: string;
  currentAntardasha?: string;
  isFavorite?: boolean;
  permission: "private" | "shared" | "read_only" | "editable";
  createdAt: string;
}

export interface FamilyTreeNode {
  id: string;
  member: ExtendedFamilyMember;
  children: FamilyTreeNode[];
  parentId?: string;
}

export interface ParentChildCompatibilityMetrics {
  parentId: string;
  parentName: string;
  childId: string;
  childName: string;
  overallScore: number; // 0-100
  emotionalCompatibility: number; // 0-100
  communication: number;
  educationSupport: number;
  behaviorHarmony: number;
  disciplineApproach: number;
  healthTendencies: string;
  planetaryHarmonyVerdict: string;
  strengths: string[];
  challenges: string[];
  actionableSuggestions: string[];
}

export interface CoupleDashboardMetrics {
  spouse1Id: string;
  spouse1Name: string;
  spouse2Id: string;
  spouse2Name: string;
  ashtakootScore: number; // e.g. 28 / 36
  gunasSummary: string;
  currentActiveDashas: string;
  transitImpactVerdict: string;
  sharedStrengths: string[];
  sharedChallenges: string[];
  relationshipMilestones: { title: string; date: string; description: string }[];
  suggestedCoupleRemedies: string[];
}

export type TransitImpactLevel = "low" | "medium" | "high";

export interface FamilyMemberTransitImpact {
  memberId: string;
  memberName: string;
  relationship: FamilyRelationship;
  jupiterTransitImpact: TransitImpactLevel;
  jupiterDescription: string;
  saturnTransitImpact: TransitImpactLevel;
  saturnDescription: string; // e.g. Sade Sati Phase 2
  rahuKetuTransitImpact: TransitImpactLevel;
  rahuKetuDescription: string;
  overallImpact: TransitImpactLevel;
}

export type FamilyEventCategory =
  | "marriage"
  | "griha_pravesh"
  | "property_purchase"
  | "vehicle_purchase"
  | "business_start"
  | "travel"
  | "puja"
  | "family_event";

export interface SharedMuhuratDate {
  id: string;
  title: string;
  category: FamilyEventCategory;
  date: string;
  startTime: string;
  endTime: string;
  auspiciousScore: number; // 0-100
  suitableForMembers: string[]; // member names
  tithiNakshatra: string;
}

export interface KundliComparisonDiff {
  member1: { name: string; lagna: string; rashi: string; sunSign: string; mahadasha: string };
  member2: { name: string; lagna: string; rashi: string; sunSign: string; mahadasha: string };
  matchingYogas: string[];
  matchingDoshas: string[];
  commonStrengths: string[];
  commonWeaknesses: string[];
}

export type CombinedReportKind =
  | "family_astrology"
  | "couple_compatibility"
  | "parent_child"
  | "multi_member"
  | "family_transit";

export interface CombinedFamilyReport {
  id: string;
  title: string;
  kind: CombinedReportKind;
  includedMemberIds: string[];
  includedMemberNames: string[];
  generatedDate: string;
  fileSizeFormatted: string;
  pdfDownloadUrl?: string;
}

export interface SharedFamilyRemedy {
  id: string;
  title: string;
  category: "mantra" | "temple_visit" | "charity" | "fasting" | "puja";
  description: string;
  benefitingMemberNames: string[];
  targetDateOrFrequency: string;
  status: "not_started" | "in_progress" | "completed";
}

export interface FamilyCalendarEvent {
  id: string;
  title: string;
  type: "birthday" | "anniversary" | "muhurat" | "transit" | "dasha_change";
  date: string;
  memberName?: string;
  description: string;
}

export interface FamilyWorkspaceAnalytics {
  totalFamilyMembers: number;
  reportsGenerated: number;
  compatibilityReportsCount: number;
  sharedRemediesCount: number;
  calendarUsageEvents: number;
}
