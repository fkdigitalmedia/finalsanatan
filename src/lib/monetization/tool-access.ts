/**
 * Dynamic Tool Monetization & Access Control Engine
 * ------------------------------------------------------------
 * Centralized registry and hook for dynamic tool access types,
 * pricing, trial availability, display order, badges, and gating rules.
 */

import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { getMyEntitlements } from "@/lib/payments.functions";

export type ToolAccessType =
  | "free"
  | "premium"
  | "one_time"
  | "premium_and_one_time"
  | "free_preview"
  | "hidden"
  | "coming_soon";

export interface ToolMonetizationItem {
  slug: string;
  name: string;
  category: string;
  accessType: ToolAccessType;
  oneTimePriceCents: number; // e.g. 49900 for ₹499
  includedPlans: string[]; // e.g. ["basic_access", "premium_access", "lifetime_vip"]
  trialAvailable: boolean;
  enabled: boolean;
  displayOrder: number;
  featuredBadge: boolean;
  popularBadge: boolean;
  description?: string;
}

export type ToolMonetizationConfig = Record<string, ToolMonetizationItem>;

export const DEFAULT_TOOL_MONETIZATION_CONFIG: ToolMonetizationConfig = {
  "janam-kundli-basic": {
    slug: "janam-kundli-basic",
    name: "Basic Janam Kundli",
    category: "kundli",
    accessType: "free",
    oneTimePriceCents: 0,
    includedPlans: ["basic_access", "premium_access", "lifetime_vip"],
    trialAvailable: false,
    enabled: true,
    displayOrder: 1,
    featuredBadge: true,
    popularBadge: true,
    description: "Free basic birth chart, rashi, and nakshatra calculations.",
  },
  "kundli-pro": {
    slug: "kundli-pro",
    name: "Pro Janam Kundli Report",
    category: "kundli",
    accessType: "premium_and_one_time",
    oneTimePriceCents: 49900,
    includedPlans: ["premium_access", "kundli_premium_report", "lifetime_vip"],
    trialAvailable: true,
    enabled: true,
    displayOrder: 2,
    featuredBadge: true,
    popularBadge: true,
    description: "Full 22+ page print-ready PDF Kundli with AI interpretations.",
  },
  varshphal: {
    slug: "varshphal",
    name: "Varshphal (Annual Return)",
    category: "kundli",
    accessType: "premium_and_one_time",
    oneTimePriceCents: 39900,
    includedPlans: ["premium_access", "kundli_premium_report", "lifetime_vip"],
    trialAvailable: true,
    enabled: true,
    displayOrder: 3,
    featuredBadge: true,
    popularBadge: false,
    description: "Solar return annual horoscope, Muntha analysis, Tajika Sahams & 12-month predictions.",
  },
  "kundli-matching": {
    slug: "kundli-matching",
    name: "Kundli Matching (Gun Milan Pro)",
    category: "kundli",
    accessType: "premium_and_one_time",
    oneTimePriceCents: 29900,
    includedPlans: ["premium_access", "kundli_premium_report", "lifetime_vip"],
    trialAvailable: true,
    enabled: true,
    displayOrder: 4,
    featuredBadge: true,
    popularBadge: true,
    description: "36 Gun Milan, Manglik Dosha compatibility, and marriage timing analysis.",
  },
  numerology: {
    slug: "numerology",
    name: "Numerology Report",
    category: "numerology",
    accessType: "free_preview",
    oneTimePriceCents: 19900,
    includedPlans: ["premium_access", "lifetime_vip"],
    trialAvailable: true,
    enabled: true,
    displayOrder: 5,
    featuredBadge: false,
    popularBadge: true,
    description: "Life Path, Destiny, Expressive numbers, and yearly numerology breakdown.",
  },
  "muhurat-finder": {
    slug: "muhurat-finder",
    name: "Muhurat Finder",
    category: "panchang",
    accessType: "free_preview",
    oneTimePriceCents: 19900,
    includedPlans: ["premium_access", "lifetime_vip"],
    trialAvailable: true,
    enabled: true,
    displayOrder: 6,
    featuredBadge: false,
    popularBadge: false,
    description: "Auspicious timing finder for marriage, business, vehicle, and house warming.",
  },
  "career-report": {
    slug: "career-report",
    name: "Career Analysis Report",
    category: "reports",
    accessType: "premium_and_one_time",
    oneTimePriceCents: 49900,
    includedPlans: ["premium_access", "lifetime_vip"],
    trialAvailable: false,
    enabled: true,
    displayOrder: 7,
    featuredBadge: true,
    popularBadge: false,
    description: "Detailed D10 Dasamsa career breakdown, job/business timing, and wealth indicators.",
  },
  "marriage-report": {
    slug: "marriage-report",
    name: "Marriage Analysis Report",
    category: "reports",
    accessType: "premium_and_one_time",
    oneTimePriceCents: 49900,
    includedPlans: ["premium_access", "lifetime_vip"],
    trialAvailable: false,
    enabled: true,
    displayOrder: 8,
    featuredBadge: true,
    popularBadge: false,
    description: "Spouse nature, marriage timing, Navamsa D9 analysis, and marital harmony.",
  },
  "business-report": {
    slug: "business-report",
    name: "Business Analysis Report",
    category: "reports",
    accessType: "premium_and_one_time",
    oneTimePriceCents: 49900,
    includedPlans: ["premium_access", "lifetime_vip"],
    trialAvailable: false,
    enabled: true,
    displayOrder: 9,
    featuredBadge: false,
    popularBadge: false,
    description: "Partnership, trade success, venture timing, and wealth expansion analysis.",
  },
  "health-report": {
    slug: "health-report",
    name: "Health Analysis Report",
    category: "reports",
    accessType: "premium_and_one_time",
    oneTimePriceCents: 49900,
    includedPlans: ["premium_access", "lifetime_vip"],
    trialAvailable: false,
    enabled: true,
    displayOrder: 10,
    featuredBadge: false,
    popularBadge: false,
    description: "Medical astrology, D6/D8 vulnerability analysis, and Ayurvedic remedies.",
  },
  "foreign-settlement": {
    slug: "foreign-settlement",
    name: "Foreign Settlement Report",
    category: "reports",
    accessType: "premium_and_one_time",
    oneTimePriceCents: 49900,
    includedPlans: ["premium_access", "lifetime_vip"],
    trialAvailable: false,
    enabled: true,
    displayOrder: 11,
    featuredBadge: false,
    popularBadge: false,
    description: "Visa, higher studies abroad, foreign travel, and overseas relocation timing.",
  },
};

export interface ToolAccessCheckResult {
  tool: ToolMonetizationItem;
  isAccessible: boolean;
  isFree: boolean;
  isOneTimeBuyable: boolean;
  isTrial: boolean;
  status: "live" | "hidden" | "coming_soon";
  badge: "Featured" | "Popular" | "Pro" | null;
  reason?: string;
}

export function evaluateToolAccess(
  item: ToolMonetizationItem,
  userEntitlements: string[] = [],
): ToolAccessCheckResult {
  if (!item.enabled || item.accessType === "hidden") {
    return {
      tool: item,
      isAccessible: false,
      isFree: false,
      isOneTimeBuyable: false,
      isTrial: false,
      status: "hidden",
      badge: null,
      reason: "This tool is currently disabled or hidden by admin.",
    };
  }

  if (item.accessType === "coming_soon") {
    return {
      tool: item,
      isAccessible: false,
      isFree: false,
      isOneTimeBuyable: false,
      isTrial: false,
      status: "coming_soon",
      badge: null,
      reason: "This tool is coming soon.",
    };
  }

  const badge = item.featuredBadge
    ? "Featured"
    : item.popularBadge
      ? "Popular"
      : item.accessType !== "free"
        ? "Pro"
        : null;

  if (item.accessType === "free") {
    return {
      tool: item,
      isAccessible: true,
      isFree: true,
      isOneTimeBuyable: false,
      isTrial: false,
      status: "live",
      badge,
    };
  }

  const hasEntitlement = userEntitlements.some((e) => item.includedPlans.includes(e));

  if (hasEntitlement) {
    return {
      tool: item,
      isAccessible: true,
      isFree: false,
      isOneTimeBuyable: false,
      isTrial: false,
      status: "live",
      badge,
    };
  }

  if (item.accessType === "free_preview") {
    return {
      tool: item,
      isAccessible: true, // free teaser preview accessible
      isFree: false,
      isOneTimeBuyable: true,
      isTrial: item.trialAvailable,
      status: "live",
      badge,
      reason: "Free preview available. Upgrade for full report.",
    };
  }

  return {
    tool: item,
    isAccessible: false,
    isFree: false,
    isOneTimeBuyable:
      item.accessType === "one_time" || item.accessType === "premium_and_one_time",
    isTrial: item.trialAvailable,
    status: "live",
    badge,
    reason: "Premium plan or one-time purchase required.",
  };
}

/** React hook to query live dynamic monetization config and user access for a tool. */
export function useToolAccess(toolSlug: string) {
  const { user } = useAuth();
  const fetchEntitlements = useServerFn(getMyEntitlements);

  const entitlementsQuery = useQuery({
    queryKey: ["my-entitlements", user?.id ?? "anon"],
    queryFn: () => fetchEntitlements(),
    enabled: !!user,
    staleTime: 60_000,
  });

  const configQuery = useQuery({
    queryKey: ["site_settings", "tool_monetization_config"],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "tool_monetization_config")
        .maybeSingle();

      if (!data?.value || typeof data.value !== "object") {
        return DEFAULT_TOOL_MONETIZATION_CONFIG;
      }
      return { ...DEFAULT_TOOL_MONETIZATION_CONFIG, ...(data.value as unknown as ToolMonetizationConfig) };
    },
    staleTime: 15_000,
  });

  const userEntitlements = entitlementsQuery.data?.entitlements ?? [];
  const fullConfig = configQuery.data ?? DEFAULT_TOOL_MONETIZATION_CONFIG;
  const toolItem = fullConfig[toolSlug] ?? {
    ...DEFAULT_TOOL_MONETIZATION_CONFIG["kundli-pro"],
    slug: toolSlug,
    name: toolSlug,
  };

  const access = evaluateToolAccess(toolItem, userEntitlements);

  return {
    ...access,
    isLoading: configQuery.isLoading || entitlementsQuery.isLoading,
    fullConfig,
  };
}
