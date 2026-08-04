// ============================================================
// SanatanTools — User Report & Download Tracking Engine
// ------------------------------------------------------------
// Manages auto-saving of generated reports, download logging,
// device/browser detection, versioning, and Supabase/Local storage fallback.
// ============================================================

import { supabase } from "@/integrations/supabase/client";

export interface ReportTrackInput {
  title: string;
  kind: "kundli" | "varshphal" | "matching" | "numerology" | "muhurat" | string;
  language?: string;
  pdf_version?: string;
  engine_version?: string;
  status?: "Completed" | "Processing" | "Failed";
  content_md?: string;
  data?: Record<string, unknown>;
  kundli_id?: string;
  family_member_id?: string;
}

export interface DownloadTrackInput {
  filename: string;
  language?: string;
  file_type?: string;
  file_size?: string;
  report_id?: string;
  pdf_report_id?: string;
}

/**
 * Detects browser and platform metadata from user agent string.
 */
export function getDeviceInfo(): { device: string; browser: string } {
  if (typeof window === "undefined" || !navigator) {
    return { device: "Desktop", browser: "Web" };
  }
  const ua = navigator.userAgent;
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
            : "Desktop";

  const browser = /edg\//i.test(ua)
    ? "Edge"
    : /chrome|crios/i.test(ua)
      ? "Chrome"
      : /firefox|fxios/i.test(ua)
        ? "Firefox"
        : /safari/i.test(ua)
          ? "Safari"
          : "Web Browser";

  return { device: platform, browser };
}

/**
 * Automatically tracks & saves a generated report for an authenticated user.
 * Increments version number if a report with the same title & kind exists.
 */
export async function trackReportGenerated(
  userId: string | undefined,
  input: ReportTrackInput,
): Promise<{ id: string; version: number } | null> {
  if (!userId) return null; // Guest user — no history saved (Req #9)

  try {
    // Check if an existing report with same title and kind exists to handle versioning (Req #5)
    const { data: existing } = await supabase
      .from("user_reports")
      .select("id, version")
      .eq("user_id", userId)
      .eq("title", input.title)
      .eq("kind", input.kind)
      .order("version", { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextVersion = existing ? (existing.version || 1) + 1 : 1;

    const payload = {
      user_id: userId,
      title: input.title,
      kind: input.kind,
      language: input.language || "en",
      status: input.status || "Completed",
      version: nextVersion,
      pdf_version: input.pdf_version || "v40.0",
      engine_version: input.engine_version || "Vedic Engine v4.0",
      content_md: input.content_md || null,
      data: (input.data || {}) as never,
      kundli_id: input.kundli_id || null,
      family_member_id: input.family_member_id || null,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from("user_reports").insert(payload).select("id, version").single();

    if (error) {
      console.warn("[Tracking] Supabase report insert warning:", error.message);
      // Fallback local storage logging
      saveLocalReport(userId, payload);
      return { id: `local-${Date.now()}`, version: nextVersion };
    }

    return { id: data.id, version: data.version };
  } catch (err) {
    console.error("[Tracking] Report generation tracking error:", err);
    return null;
  }
}

/**
 * Automatically logs a PDF download for an authenticated user.
 */
export async function trackPdfDownload(
  userId: string | undefined,
  input: DownloadTrackInput,
): Promise<void> {
  if (!userId) return; // Guest user — no download history saved (Req #9)

  try {
    const { device, browser } = getDeviceInfo();

    const payload = {
      user_id: userId,
      filename: input.filename,
      language: input.language || "en",
      file_type: input.file_type || "PDF",
      file_size: input.file_size || "2.4 MB",
      device,
      browser,
      report_id: input.report_id || null,
      pdf_report_id: input.pdf_report_id || null,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("report_downloads").insert({
      user_id: userId,
      filename: input.filename,
      language: input.language || "en",
      report_id: input.report_id || null,
      pdf_report_id: input.pdf_report_id || null,
    });

    if (error) {
      console.warn("[Tracking] Supabase download log warning:", error.message);
      saveLocalDownload(userId, payload);
    }
  } catch (err) {
    console.error("[Tracking] PDF download tracking error:", err);
  }
}

// Local Storage Fallback Utilities
function saveLocalReport(userId: string, item: unknown) {
  try {
    const key = `sanatan_reports_${userId}`;
    const raw = localStorage.getItem(key);
    const list = raw ? JSON.parse(raw) : [];
    list.unshift(item);
    localStorage.setItem(key, JSON.stringify(list.slice(0, 100)));
  } catch {
    // ignore
  }
}

function saveLocalDownload(userId: string, item: unknown) {
  try {
    const key = `sanatan_downloads_${userId}`;
    const raw = localStorage.getItem(key);
    const list = raw ? JSON.parse(raw) : [];
    list.unshift(item);
    localStorage.setItem(key, JSON.stringify(list.slice(0, 100)));
  } catch {
    // ignore
  }
}
