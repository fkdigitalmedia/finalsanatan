import { put, del, list, type PutBlobResult } from "@vercel/blob";

// ============================================================
// Vercel Blob Storage Integration for Reports & Assets
// Enables direct cloud storage saving of generated PDF/HTML reports,
// charts, user avatars, and application assets.
// ============================================================

export interface BlobUploadResult {
  url: string;
  downloadUrl: string;
  pathname: string;
  contentType: string;
}

/**
 * Upload a report file (HTML string, PDF Blob, or Buffer) to Vercel Blob storage.
 *
 * @param filename - e.g. "health-analysis-arjun-sharma.html" or "career-report-2026.pdf"
 * @param content - File body: string, Blob, File, or Buffer
 * @param options - Optional contentType and folder path (defaults to "reports")
 */
export async function uploadReportToBlob(
  filename: string,
  content: string | Blob | ArrayBuffer,
  options: { contentType?: string; folder?: string } = {},
): Promise<BlobUploadResult> {
  const folder = options.folder || "reports";
  const cleanName = filename.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
  const pathname = `${folder}/${cleanName}`;

  const contentType =
    options.contentType ||
    (filename.endsWith(".pdf")
      ? "application/pdf"
      : filename.endsWith(".json")
      ? "application/json"
      : "text/html;charset=utf-8");

  try {
    const blobResult: PutBlobResult = await put(pathname, content, {
      access: "public",
      contentType,
      addRandomSuffix: true,
    });

    return {
      url: blobResult.url,
      downloadUrl: blobResult.downloadUrl,
      pathname: blobResult.pathname,
      contentType: blobResult.contentType || contentType,
    };
  } catch (error) {
    console.error("Vercel Blob upload error:", error);
    throw new Error(`Blob upload failed: ${(error as Error).message}`);
  }
}

/**
 * Delete a report or file from Vercel Blob storage by its URL.
 */
export async function deleteReportFromBlob(url: string): Promise<void> {
  if (!url || !url.includes("blob.vercel-storage.com")) return;
  try {
    await del(url);
  } catch (error) {
    console.warn("Vercel Blob delete warning:", error);
  }
}

/**
 * List files stored in Vercel Blob under a prefix (folder).
 */
export async function listReportBlobs(prefix = "reports/") {
  try {
    const { blobs } = await list({ prefix });
    return blobs;
  } catch (error) {
    console.error("Vercel Blob list error:", error);
    return [];
  }
}
