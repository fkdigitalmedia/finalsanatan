// ============================================================
// Workspace data access layer.
// Thin, typed wrappers over the Data API — no business logic,
// no calculations. Every query is user-scoped by RLS.
// ============================================================

import { supabase } from "@/integrations/supabase/client";
import type {
  ActivityLogRow,
  FamilyMember,
  FamilyMemberInsert,
  GlobalSearchHit,
  HoroscopeHistoryRow,
  ListQuery,
  Page,
  ReportDownload,
  UserDevice,
  UserKundli,
  UserKundliInsert,
  UserReport,
  WorkspaceAnalytics,
} from "./types";

export const DEFAULT_PAGE_SIZE = 12;

function range(page = 1, pageSize = DEFAULT_PAGE_SIZE) {
  const from = Math.max(0, (page - 1) * pageSize);
  return { from, to: from + pageSize - 1 };
}

export function toPage<T>(
  rows: T[] | null,
  count: number | null,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
): Page<T> {
  const list = rows ?? [];
  const total = count ?? list.length;
  return { rows: list, total, page, pageSize, hasMore: page * pageSize < total };
}

/** Escapes PostgREST `or`/`ilike` wildcards in free-text search. */
export function sanitizeSearch(term?: string): string {
  return (term ?? "")
    .replace(/[%,()*]/g, " ")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 80);
}

// ---------------------------------------------------------------- kundlis

export interface KundliQuery extends ListQuery {
  archived?: boolean;
  favoritesOnly?: boolean;
}

export async function listKundlis(userId: string, q: KundliQuery = {}): Promise<Page<UserKundli>> {
  const { page = 1, pageSize = DEFAULT_PAGE_SIZE } = q;
  const { from, to } = range(page, pageSize);
  let req = supabase
    .from("user_kundlis")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .eq("is_archived", q.archived ?? false);
  if (q.favoritesOnly) req = req.eq("is_favorite", true);
  const term = sanitizeSearch(q.search);
  if (term) req = req.or(`name.ilike.%${term}%,place_name.ilike.%${term}%`);
  const { data, count, error } = await req
    .order("created_at", { ascending: false })
    .range(from, to);
  if (error) throw error;
  return toPage(data, count, page, pageSize);
}

export async function getKundli(id: string): Promise<UserKundli | null> {
  const { data, error } = await supabase
    .from("user_kundlis")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function saveKundli(input: UserKundliInsert): Promise<UserKundli> {
  const { data, error } = await supabase.from("user_kundlis").upsert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateKundli(id: string, patch: Partial<UserKundliInsert>): Promise<void> {
  const { error } = await supabase.from("user_kundlis").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteKundli(id: string): Promise<void> {
  const { error } = await supabase.from("user_kundlis").delete().eq("id", id);
  if (error) throw error;
}

export function duplicatePayload(row: UserKundli): UserKundliInsert {
  const { id: _id, created_at: _c, updated_at: _u, ...rest } = row;
  return { ...rest, name: `${row.name} (copy)`, is_favorite: false };
}

export async function duplicateKundli(row: UserKundli): Promise<UserKundli> {
  return saveKundli(duplicatePayload(row));
}

// ---------------------------------------------------------------- family

export async function listFamily(userId: string, q: ListQuery = {}): Promise<Page<FamilyMember>> {
  const { page = 1, pageSize = DEFAULT_PAGE_SIZE } = q;
  const { from, to } = range(page, pageSize);
  let req = supabase.from("family_members").select("*", { count: "exact" }).eq("user_id", userId);
  const term = sanitizeSearch(q.search);
  if (term) req = req.or(`name.ilike.%${term}%,relationship.ilike.%${term}%`);
  const { data, count, error } = await req
    .order("created_at", { ascending: false })
    .range(from, to);
  if (error) throw error;
  return toPage(data, count, page, pageSize);
}

export async function saveFamilyMember(input: FamilyMemberInsert): Promise<FamilyMember> {
  const { data, error } = await supabase.from("family_members").upsert(input).select().single();
  if (error) throw error;
  return data;
}

export async function deleteFamilyMember(id: string): Promise<void> {
  const { error } = await supabase.from("family_members").delete().eq("id", id);
  if (error) throw error;
}

// ---------------------------------------------------------------- horoscope history

export interface HoroscopeQuery extends ListQuery {
  period?: string;
}

export async function listHoroscopeHistory(
  userId: string,
  q: HoroscopeQuery = {},
): Promise<Page<HoroscopeHistoryRow>> {
  const { page = 1, pageSize = DEFAULT_PAGE_SIZE } = q;
  const { from, to } = range(page, pageSize);
  let req = supabase
    .from("horoscope_history")
    .select("*", { count: "exact" })
    .eq("user_id", userId);
  if (q.period && q.period !== "all") req = req.eq("period", q.period);
  const term = sanitizeSearch(q.search);
  if (term) req = req.or(`summary.ilike.%${term}%,sign.ilike.%${term}%`);
  const { data, count, error } = await req
    .order("created_at", { ascending: false })
    .range(from, to);
  if (error) throw error;
  return toPage(data, count, page, pageSize);
}

export async function saveHoroscopeEntry(row: {
  user_id: string;
  period: string;
  sign?: string | null;
  language?: string;
  summary?: string | null;
  data?: Record<string, unknown>;
  kundli_id?: string | null;
}): Promise<void> {
  const { error } = await supabase.from("horoscope_history").insert({
    ...row,
    data: (row.data ?? {}) as never,
  });
  if (error) throw error;
}

export async function deleteHoroscopeEntry(id: string): Promise<void> {
  const { error } = await supabase.from("horoscope_history").delete().eq("id", id);
  if (error) throw error;
}

// ---------------------------------------------------------------- reports

export interface ReportQuery extends ListQuery {
  kind?: string;
  favoritesOnly?: boolean;
}

export async function listReports(userId: string, q: ReportQuery = {}): Promise<Page<UserReport>> {
  const { page = 1, pageSize = DEFAULT_PAGE_SIZE } = q;
  const { from, to } = range(page, pageSize);
  let req = supabase.from("user_reports").select("*", { count: "exact" }).eq("user_id", userId);
  if (q.kind && q.kind !== "all") {
    // Map UI filter kinds if needed
    const kMap: Record<string, string[]> = {
      "janam-kundli": ["janam-kundli", "kundli"],
      "varshphal": ["varshphal", "annual"],
      "kundli-matching": ["kundli-matching", "matching"],
      "numerology": ["numerology"],
      "muhurat": ["muhurat"],
    };
    const targetKinds = kMap[q.kind] || [q.kind];
    if (targetKinds.length === 1) {
      req = req.eq("kind", targetKinds[0]);
    } else {
      req = req.in("kind", targetKinds);
    }
  }
  if (q.favoritesOnly) req = req.eq("is_favorite", true);
  const term = sanitizeSearch(q.search);
  if (term) req = req.ilike("title", `%${term}%`);

  if (q.sortBy === "oldest") {
    req = req.order("created_at", { ascending: true });
  } else if (q.sortBy === "title_asc") {
    req = req.order("title", { ascending: true });
  } else {
    req = req.order("created_at", { ascending: false });
  }

  const { data, count, error } = await req.range(from, to);
  if (error) throw error;
  return toPage(data, count, page, pageSize);
}

export async function saveReport(row: {
  user_id: string;
  kind: string;
  title: string;
  language?: string;
  content_md?: string | null;
  data?: Record<string, unknown>;
  kundli_id?: string | null;
  family_member_id?: string | null;
}): Promise<UserReport> {
  const { data, error } = await supabase
    .from("user_reports")
    .insert({ ...row, data: (row.data ?? {}) as never })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateReport(id: string, patch: Partial<UserReport>): Promise<void> {
  const { error } = await supabase.from("user_reports").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteReport(id: string): Promise<void> {
  const { error } = await supabase.from("user_reports").delete().eq("id", id);
  if (error) throw error;
}

export function makeShareToken(): string {
  const bytes = new Uint8Array(16);
  (globalThis.crypto ?? ({} as Crypto)).getRandomValues?.(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function setReportShared(
  id: string,
  shared: boolean,
  existingToken?: string | null,
): Promise<string | null> {
  const token = shared ? existingToken || makeShareToken() : (existingToken ?? null);
  await updateReport(id, { is_shared: shared, share_token: token });
  return shared ? token : null;
}

// ---------------------------------------------------------------- downloads

export async function listDownloads(
  userId: string,
  q: DownloadQuery = {},
): Promise<Page<ReportDownload>> {
  const { page = 1, pageSize = DEFAULT_PAGE_SIZE } = q;
  const { from, to } = range(page, pageSize);
  let req = supabase.from("report_downloads").select("*", { count: "exact" }).eq("user_id", userId);

  // Timeframe filter
  if (q.timeframe && q.timeframe !== "all") {
    const now = new Date();
    if (q.timeframe === "today") {
      now.setHours(0, 0, 0, 0);
      req = req.gte("created_at", now.toISOString());
    } else if (q.timeframe === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      req = req.gte("created_at", weekAgo.toISOString());
    } else if (q.timeframe === "month") {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      req = req.gte("created_at", monthAgo.toISOString());
    }
  }

  const term = sanitizeSearch(q.search);
  if (term) req = req.ilike("filename", `%${term}%`);

  if (q.sortBy === "oldest") {
    req = req.order("created_at", { ascending: true });
  } else {
    req = req.order("created_at", { ascending: false });
  }

  const { data, count, error } = await req.range(from, to);
  if (error) throw error;
  return toPage(data, count, page, pageSize);
}

export async function logDownload(row: {
  user_id: string;
  filename: string;
  language?: string;
  report_id?: string | null;
  pdf_report_id?: string | null;
}): Promise<void> {
  await supabase.from("report_downloads").insert(row);
}

// ---------------------------------------------------------------- devices + activity

export function describeDevice(ua = ""): { label: string; platform: string } {
  const platform = /android/i.test(ua)
    ? "Android"
    : /iphone|ipad|ipod/i.test(ua)
      ? "iOS"
      : /mac os/i.test(ua)
        ? "macOS"
        : /windows/i.test(ua)
          ? "Windows"
          : /linux/i.test(ua)
            ? "Linux"
            : "Unknown";
  const browser = /edg\//i.test(ua)
    ? "Edge"
    : /chrome|crios/i.test(ua)
      ? "Chrome"
      : /firefox|fxios/i.test(ua)
        ? "Firefox"
        : /safari/i.test(ua)
          ? "Safari"
          : "Browser";
  return { label: `${browser} on ${platform}`, platform };
}

export async function registerDevice(userId: string, ua = ""): Promise<void> {
  const { label, platform } = describeDevice(ua);
  await supabase.from("user_devices").upsert(
    {
      user_id: userId,
      device_label: label,
      platform,
      user_agent: ua.slice(0, 400),
      last_seen_at: new Date().toISOString(),
    },
    { onConflict: "user_id,device_label,platform" },
  );
}

export async function listDevices(userId: string): Promise<UserDevice[]> {
  const { data } = await supabase
    .from("user_devices")
    .select("*")
    .eq("user_id", userId)
    .order("last_seen_at", { ascending: false });
  return data ?? [];
}

export async function removeDevice(id: string): Promise<void> {
  await supabase.from("user_devices").delete().eq("id", id);
}

export async function logActivity(
  userId: string,
  action: string,
  resourceType = "dashboard",
  resourceId?: string,
): Promise<void> {
  await supabase.from("user_activity_log").insert({
    user_id: userId,
    action,
    resource_type: resourceType,
    resource_id: resourceId ?? null,
  });
}

export async function listActivity(userId: string, limit = 20): Promise<ActivityLogRow[]> {
  const { data } = await supabase
    .from("user_activity_log")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

// ---------------------------------------------------------------- analytics + search

async function countOf(
  table:
    | "user_reports"
    | "report_downloads"
    | "horoscope_history"
    | "user_kundlis"
    | "family_members"
    | "pdf_reports",
  userId: string,
) {
  const { count } = await supabase
    .from(table)
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);
  return count ?? 0;
}

export async function getAnalytics(userId: string): Promise<WorkspaceAnalytics> {
  const [reports, downloads, horoscopeViews, savedCharts, familyMembers, aiUsage] =
    await Promise.all([
      countOf("user_reports", userId),
      countOf("report_downloads", userId),
      countOf("horoscope_history", userId),
      countOf("user_kundlis", userId),
      countOf("family_members", userId),
      supabase
        .from("ai_usage_logs")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .then(
          (r) => r.count ?? 0,
          () => 0,
        ),
    ]);
  return { reports, downloads, horoscopeViews, savedCharts, familyMembers, aiUsage };
}

export async function globalSearch(
  userId: string,
  term: string,
  limit = 5,
): Promise<GlobalSearchHit[]> {
  const q = sanitizeSearch(term);
  if (q.length < 2) return [];
  const [k, f, r, d, h] = await Promise.all([
    listKundlis(userId, { search: q, pageSize: limit }),
    listFamily(userId, { search: q, pageSize: limit }),
    listReports(userId, { search: q, pageSize: limit }),
    listDownloads(userId, { search: q, pageSize: limit }),
    listHoroscopeHistory(userId, { search: q, pageSize: limit }),
  ]);
  return [
    ...k.rows.map((x): GlobalSearchHit => ({
      id: x.id,
      type: "kundli",
      title: x.name,
      subtitle: x.place_name,
      href: "/my-kundlis",
    })),
    ...f.rows.map((x): GlobalSearchHit => ({
      id: x.id,
      type: "family",
      title: x.name,
      subtitle: x.relationship,
      href: "/family",
    })),
    ...r.rows.map((x): GlobalSearchHit => ({
      id: x.id,
      type: "report",
      title: x.title,
      subtitle: x.kind,
      href: "/reports",
    })),
    ...d.rows.map((x): GlobalSearchHit => ({
      id: x.id,
      type: "download",
      title: x.filename,
      subtitle: x.language,
      href: "/downloads",
    })),
    ...h.rows.map((x): GlobalSearchHit => ({
      id: x.id,
      type: "horoscope",
      title: x.summary ?? `${x.period} horoscope`,
      subtitle: x.period,
      href: "/horoscope-history",
    })),
  ];
}
