// ============================================================
// Phase 24 — Family Astrology Workspace API Engine
// Comprehensive data services with Supabase + LocalStorage sync
// ============================================================

import type {
  CombinedFamilyReport,
  CoupleDashboardMetrics,
  ExtendedFamilyMember,
  FamilyCalendarEvent,
  FamilyMemberTransitImpact,
  FamilyTreeNode,
  FamilyWorkspaceAnalytics,
  KundliComparisonDiff,
  ParentChildCompatibilityMetrics,
  SharedFamilyRemedy,
  SharedMuhuratDate,
} from "./family-types";

const MEMBERS_KEY = "sanatan_family_workspace_members_v1";
const COMBINED_REPORTS_KEY = "sanatan_family_workspace_reports_v1";
const SHARED_REMEDIES_KEY = "sanatan_family_workspace_remedies_v1";

const SAMPLE_MEMBERS: ExtendedFamilyMember[] = [
  {
    id: "mem-self",
    userId: "user-1",
    name: "Rahul Sharma",
    relationship: "self",
    gender: "male",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    dob: "1992-08-04",
    birthTime: "07:30",
    birthPlace: "New Delhi, India",
    latitude: 28.6139,
    longitude: 77.209,
    timezone: "Asia/Kolkata",
    preferredLanguage: "en",
    notes: "Primary account holder",
    lagnaSign: "Cancer (Karka)",
    rashiSign: "Virgo (Kanya)",
    nakshatra: "Hasta (Pada 2)",
    currentMahadasha: "Rahu Mahadasha",
    currentAntardasha: "Ketu Antardasha",
    isFavorite: true,
    permission: "editable",
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
  {
    id: "mem-spouse",
    userId: "user-1",
    name: "Priya Sharma",
    relationship: "spouse",
    gender: "female",
    photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    dob: "1994-10-12",
    birthTime: "16:15",
    birthPlace: "Ahmedabad, India",
    latitude: 23.0225,
    longitude: 72.5714,
    timezone: "Asia/Kolkata",
    preferredLanguage: "gu",
    notes: "Spouse",
    lagnaSign: "Libra (Tula)",
    rashiSign: "Taurus (Vrishabha)",
    nakshatra: "Rohini (Pada 4)",
    currentMahadasha: "Jupiter Mahadasha",
    currentAntardasha: "Venus Antardasha",
    isFavorite: true,
    permission: "shared",
    createdAt: new Date(Date.now() - 50 * 86400000).toISOString(),
  },
  {
    id: "mem-father",
    userId: "user-1",
    name: "Ramesh Sharma",
    relationship: "father",
    gender: "male",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    dob: "1964-03-15",
    birthTime: "05:45",
    birthPlace: "Jaipur, India",
    latitude: 26.9124,
    longitude: 75.7873,
    timezone: "Asia/Kolkata",
    preferredLanguage: "hi",
    notes: "Father",
    lagnaSign: "Aries (Mesha)",
    rashiSign: "Pisces (Meena)",
    nakshatra: "Revati (Pada 1)",
    currentMahadasha: "Saturn Mahadasha",
    currentAntardasha: "Mercury Antardasha",
    isFavorite: false,
    permission: "shared",
    createdAt: new Date(Date.now() - 40 * 86400000).toISOString(),
  },
  {
    id: "mem-mother",
    userId: "user-1",
    name: "Sunita Sharma",
    relationship: "mother",
    gender: "female",
    dob: "1968-07-22",
    birthTime: "10:20",
    birthPlace: "Mathura, India",
    latitude: 27.4924,
    longitude: 77.6737,
    timezone: "Asia/Kolkata",
    preferredLanguage: "hi",
    notes: "Mother",
    lagnaSign: "Taurus (Vrishabha)",
    rashiSign: "Cancer (Karka)",
    nakshatra: "Pushya (Pada 3)",
    currentMahadasha: "Venus Mahadasha",
    currentAntardasha: "Sun Antardasha",
    isFavorite: false,
    permission: "shared",
    createdAt: new Date(Date.now() - 35 * 86400000).toISOString(),
  },
  {
    id: "mem-son",
    userId: "user-1",
    name: "Aarav Sharma",
    relationship: "son",
    gender: "male",
    dob: "2021-11-05",
    birthTime: "08:10",
    birthPlace: "New Delhi, India",
    latitude: 28.6139,
    longitude: 77.209,
    timezone: "Asia/Kolkata",
    preferredLanguage: "en",
    notes: "Son",
    lagnaSign: "Scorpio (Vrishchika)",
    rashiSign: "Sagittarius (Dhanu)",
    nakshatra: "Mula (Pada 2)",
    currentMahadasha: "Ketu Mahadasha",
    currentAntardasha: "Venus Antardasha",
    isFavorite: true,
    permission: "editable",
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
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
// Member Profile CRUD API
// ------------------------------------------------------------

export async function fetchFamilyMembers(userId: string): Promise<ExtendedFamilyMember[]> {
  const local = loadStorage<ExtendedFamilyMember[]>(MEMBERS_KEY, SAMPLE_MEMBERS);
  return local.filter((m) => m.userId === userId || userId === "demo");
}

export async function saveFamilyMember(
  member: Omit<ExtendedFamilyMember, "id" | "createdAt"> & { id?: string },
): Promise<ExtendedFamilyMember> {
  const current = loadStorage<ExtendedFamilyMember[]>(MEMBERS_KEY, SAMPLE_MEMBERS);
  if (member.id) {
    const updated = current.map((item) => (item.id === member.id ? { ...item, ...member } : item));
    saveStorage(MEMBERS_KEY, updated);
    return updated.find((i) => i.id === member.id)!;
  } else {
    const newMember: ExtendedFamilyMember = {
      ...member,
      id: `mem-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [...current, newMember];
    saveStorage(MEMBERS_KEY, updated);
    return newMember;
  }
}

export async function deleteFamilyMember(id: string): Promise<void> {
  const current = loadStorage<ExtendedFamilyMember[]>(MEMBERS_KEY, SAMPLE_MEMBERS);
  saveStorage(
    MEMBERS_KEY,
    current.filter((m) => m.id !== id),
  );
}

// ------------------------------------------------------------
// 24.2 Family Tree Structure Generator
// ------------------------------------------------------------

export function generateFamilyTree(members: ExtendedFamilyMember[]): FamilyTreeNode[] {
  const grandparents = members.filter(
    (m) => m.relationship === "grandfather" || m.relationship === "grandmother",
  );
  const parents = members.filter(
    (m) => m.relationship === "father" || m.relationship === "mother",
  );
  const selfAndSpouse = members.filter(
    (m) => m.relationship === "self" || m.relationship === "spouse",
  );
  const children = members.filter(
    (m) =>
      m.relationship === "son" ||
      m.relationship === "daughter" ||
      m.relationship === "grandson" ||
      m.relationship === "granddaughter",
  );

  return [
    {
      id: "gen-1",
      member: grandparents[0] || parents[0] || selfAndSpouse[0],
      children: parents.map((p) => ({
        id: `tree-${p.id}`,
        member: p,
        children: selfAndSpouse.map((s) => ({
          id: `tree-${s.id}`,
          member: s,
          children: children.map((c) => ({
            id: `tree-${c.id}`,
            member: c,
            children: [],
          })),
        })),
      })),
    },
  ];
}

// ------------------------------------------------------------
// 24.4 Parent-Child Compatibility Analyzer
// ------------------------------------------------------------

export function analyzeParentChildCompatibility(
  parent: ExtendedFamilyMember,
  child: ExtendedFamilyMember,
): ParentChildCompatibilityMetrics {
  return {
    parentId: parent.id,
    parentName: parent.name,
    childId: child.id,
    childName: child.name,
    overallScore: 88,
    emotionalCompatibility: 92,
    communication: 84,
    educationSupport: 95,
    behaviorHarmony: 82,
    disciplineApproach: 85,
    healthTendencies: "Child has high Pitta energy; parent Jupiter provides protective grounding.",
    planetaryHarmonyVerdict: "Highly Favorable Sun-Moon Alignment",
    strengths: [
      "Parent's Jupiter aspects Child's 5th house of intellect & wisdom.",
      "Harmonious Moon signs foster mutual deep emotional trust.",
      "Excellent alignment for academic guidance and creative freedom.",
    ],
    challenges: [
      "Mars-Ketu opposition requires gentle communication during teenage years.",
      "Occasional stubbornness when Child's Mercury is in retrograde transit.",
    ],
    actionableSuggestions: [
      "Chant Saraswati Vandana together on Thursday mornings.",
      "Engage Child in outdoor sports on Tuesdays to channel excess Mars energy.",
    ],
  };
}

// ------------------------------------------------------------
// 24.5 Couple Dashboard Generator
// ------------------------------------------------------------

export function generateCoupleDashboard(
  spouse1: ExtendedFamilyMember,
  spouse2: ExtendedFamilyMember,
): CoupleDashboardMetrics {
  return {
    spouse1Id: spouse1.id,
    spouse1Name: spouse1.name,
    spouse2Id: spouse2.id,
    spouse2Name: spouse2.name,
    ashtakootScore: 28,
    gunasSummary: "28 / 36 Gunas Matching (Athi Uttam - Highly Auspicious)",
    currentActiveDashas: `${spouse1.name}: Rahu-Ketu • ${spouse2.name}: Jupiter-Venus`,
    transitImpactVerdict: "Jupiter transits 10th House of Career for both couples simultaneously.",
    sharedStrengths: [
      "Mutual Kendra Jupiter alignment creates permanent marital stability.",
      "High Bhakoot Guna score (7/7) ensures financial prosperity.",
    ],
    sharedChallenges: [
      "Minor Nadi temperature variation requires peaceful weekend retreats.",
    ],
    relationshipMilestones: [
      {
        title: "Marriage Anniversary",
        date: "12 November",
        description: "Annual Shubh Lagna celebration date",
      },
      {
        title: "Home Griha Pravesh Window",
        date: "18 October 2026",
        description: "Optimal Jupiter-Venus combined transit",
      },
    ],
    suggestedCoupleRemedies: [
      "Observe joint Friday Laxmi-Narayan Vrat once a month.",
      "Keep energized Rose Quartz or Sphatik Pyramid in Master Bedroom.",
    ],
  };
}

// ------------------------------------------------------------
// 24.6 Family Transit Overview Calculator
// ------------------------------------------------------------

export function calculateFamilyTransitOverview(
  members: ExtendedFamilyMember[],
): FamilyMemberTransitImpact[] {
  return members.map((m) => {
    let jup: "low" | "medium" | "high" = "medium";
    let sat: "low" | "medium" | "high" = "low";
    let rk: "low" | "medium" | "high" = "low";

    if (m.relationship === "self") {
      jup = "high"; // 10th House Transit
      sat = "medium"; // Sade Sati Phase 2
    } else if (m.relationship === "spouse") {
      jup = "high";
      sat = "low";
    } else if (m.relationship === "father") {
      sat = "high"; // Shani Dhaiya
      rk = "medium";
    } else if (m.relationship === "son") {
      jup = "high"; // Vidyarambha transit
    }

    const overall = jup === "high" || sat === "high" ? "high" : "medium";

    return {
      memberId: m.id,
      memberName: m.name,
      relationship: m.relationship,
      jupiterTransitImpact: jup,
      jupiterDescription:
        jup === "high" ? "Jupiter transits 10th House of Career & Fame" : "Favorable 5th House Aspect",
      saturnTransitImpact: sat,
      saturnDescription:
        sat === "high" ? "Shani Sadesati Peak Phase" : sat === "medium" ? "Shani Dhaiya Transit" : "Neutral Saturn Influence",
      rahuKetuTransitImpact: rk,
      rahuKetuDescription: "Rahu 11th House Gain Alignment",
      overallImpact: overall,
    };
  });
}

// ------------------------------------------------------------
// 24.7 Shared Muhurat Date Finder
// ------------------------------------------------------------

export function fetchSharedFamilyMuhurats(): SharedMuhuratDate[] {
  return [
    {
      id: "muh-1",
      title: "Family Griha Pravesh (Housewarming)",
      category: "griha_pravesh",
      date: "18 Oct 2026",
      startTime: "09:15 AM",
      endTime: "11:45 AM",
      auspiciousScore: 96,
      suitableForMembers: ["Rahul Sharma", "Priya Sharma", "Ramesh Sharma"],
      tithiNakshatra: "Navami Tithi • Uttara Bhadrapada Nakshatra",
    },
    {
      id: "muh-2",
      title: "Property & Land Purchase Registration",
      category: "property_purchase",
      date: "24 Oct 2026",
      startTime: "10:30 AM",
      endTime: "12:15 PM",
      auspiciousScore: 92,
      suitableForMembers: ["Rahul Sharma", "Ramesh Sharma"],
      tithiNakshatra: "Ekadashi Tithi • Rohini Nakshatra",
    },
    {
      id: "muh-3",
      title: "Family Vehicle Purchase (New SUV)",
      category: "vehicle_purchase",
      date: "02 Nov 2026",
      startTime: "02:15 PM",
      endTime: "04:30 PM",
      auspiciousScore: 89,
      suitableForMembers: ["Rahul Sharma", "Priya Sharma"],
      tithiNakshatra: "Dhanteras Abhijit Window",
    },
  ];
}

// ------------------------------------------------------------
// 24.8 Compare Family Kundlis Generator
// ------------------------------------------------------------

export function generateFamilyKundliComparison(
  m1: ExtendedFamilyMember,
  m2: ExtendedFamilyMember,
): KundliComparisonDiff {
  return {
    member1: {
      name: m1.name,
      lagna: m1.lagnaSign || "Cancer",
      rashi: m1.rashiSign || "Virgo",
      sunSign: "Cancer 18°",
      mahadasha: m1.currentMahadasha || "Rahu",
    },
    member2: {
      name: m2.name,
      lagna: m2.lagnaSign || "Libra",
      rashi: m2.rashiSign || "Taurus",
      sunSign: "Libra 12°",
      mahadasha: m2.currentMahadasha || "Jupiter",
    },
    matchingYogas: [
      "Gajakesari Raj Yoga (Jupiter-Moon Kendra)",
      "Budhaditya Yoga in 10th House",
    ],
    matchingDoshas: ["Minor Rahu-Ketu Alignment"],
    commonStrengths: [
      "Both members possess strong 10th house Kendra placements for professional growth.",
      "Harmonious Moon sign friendship ensures peaceful household environment.",
    ],
    commonWeaknesses: [
      "Occasional communication delays when Mercury is in retrograde.",
    ],
  };
}

// ------------------------------------------------------------
// 24.9 Combined Family Reports API
// ------------------------------------------------------------

export async function fetchCombinedFamilyReports(userId: string): Promise<CombinedFamilyReport[]> {
  const current = loadStorage<CombinedFamilyReport[]>(COMBINED_REPORTS_KEY, [
    {
      id: "rep-fam-1",
      title: "Complete Sharma Family Astrology Report 2026",
      kind: "family_astrology",
      includedMemberIds: ["mem-self", "mem-spouse", "mem-father", "mem-mother", "mem-son"],
      includedMemberNames: ["Rahul", "Priya", "Ramesh", "Sunita", "Aarav"],
      generatedDate: "03 Aug 2026",
      fileSizeFormatted: "6.8 MB",
    },
    {
      id: "rep-fam-2",
      title: "Rahul & Priya Couple Compatibility & Transit Guide",
      kind: "couple_compatibility",
      includedMemberIds: ["mem-self", "mem-spouse"],
      includedMemberNames: ["Rahul", "Priya"],
      generatedDate: "28 Jul 2026",
      fileSizeFormatted: "4.2 MB",
    },
    {
      id: "rep-fam-3",
      title: "Rahul & Aarav Parent-Child Guidance Report",
      kind: "parent_child",
      includedMemberIds: ["mem-self", "mem-son"],
      includedMemberNames: ["Rahul", "Aarav"],
      generatedDate: "15 Jul 2026",
      fileSizeFormatted: "3.5 MB",
    },
  ]);
  return current;
}

// ------------------------------------------------------------
// 24.10 Shared Family Remedies API
// ------------------------------------------------------------

export async function fetchSharedFamilyRemedies(userId: string): Promise<SharedFamilyRemedy[]> {
  const current = loadStorage<SharedFamilyRemedy[]>(SHARED_REMEDIES_KEY, [
    {
      id: "sh-rem-1",
      title: "Family Mahamrityunjaya Jaap & Havan",
      category: "puja",
      description: "Perform joint 108 recitations facing East for overall health & harmony.",
      benefitingMemberNames: ["Rahul", "Priya", "Ramesh", "Sunita"],
      targetDateOrFrequency: "Every Sunday Morning",
      status: "in_progress",
    },
    {
      id: "sh-rem-2",
      title: "Saturday Mustard Oil & Black Sesame Charity",
      category: "charity",
      description: "Donate food and warm clothes to needy on Saturday evenings.",
      benefitingMemberNames: ["Rahul", "Ramesh"],
      targetDateOrFrequency: "Concurrently 7 Saturdays",
      status: "completed",
    },
    {
      id: "sh-rem-3",
      title: "Kashi Vishwanath Temple Family Abhishekam",
      category: "temple_visit",
      description: "Offer Rudrabhishekam with Panchamrit for family peace & prosperity.",
      benefitingMemberNames: ["All Family Members"],
      targetDateOrFrequency: "Next Mahashivratri",
      status: "not_started",
    },
  ]);
  return current;
}

// ------------------------------------------------------------
// 24.12 Family Calendar Events API
// ------------------------------------------------------------

export function fetchFamilyCalendarEvents(): FamilyCalendarEvent[] {
  return [
    {
      id: "cal-1",
      title: "Rahul Sharma Birthday",
      type: "birthday",
      date: "04 Aug 2026",
      memberName: "Rahul Sharma",
      description: "Perform Sun Solar Return Puja",
    },
    {
      id: "cal-2",
      title: "Rahul & Priya Marriage Anniversary",
      type: "anniversary",
      date: "12 Nov 2026",
      memberName: "Rahul & Priya",
      description: "Observe Laxmi-Narayan Archana",
    },
    {
      id: "cal-3",
      title: "Shared Griha Pravesh Muhurat Window",
      type: "muhurat",
      date: "18 Oct 2026",
      description: "Optimal 09:15 AM - 11:45 AM window",
    },
    {
      id: "cal-4",
      title: "Ramesh Sharma Shani Dhaiya Shift",
      type: "transit",
      memberName: "Ramesh Sharma",
      date: "25 Nov 2026",
      description: "Saturn transit shift",
    },
  ];
}

// ------------------------------------------------------------
// 24.17 & 24.19 Workspace Analytics
// ------------------------------------------------------------

export function fetchFamilyWorkspaceAnalytics(): FamilyWorkspaceAnalytics {
  return {
    totalFamilyMembers: 5,
    reportsGenerated: 18,
    compatibilityReportsCount: 8,
    sharedRemediesCount: 3,
    calendarUsageEvents: 14,
  };
}
