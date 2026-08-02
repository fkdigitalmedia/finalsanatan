// ============================================================
// Universal PDF Report Engine — Images
// ------------------------------------------------------------
// Loads logos, watermarks, backgrounds and signatures once per
// render, converts them to data URLs, downsamples according to
// the export DPI, and never throws on a broken URL.
// ============================================================

import type { DocLike, ExportConfig } from "./types";

const memo = new Map<string, string | null>();

export function isDataUrl(url: string): boolean {
  return typeof url === "string" && url.startsWith("data:");
}

export function imageFormat(dataUrl: string): "PNG" | "JPEG" | "WEBP" {
  if (dataUrl.startsWith("data:image/jpeg") || dataUrl.startsWith("data:image/jpg")) return "JPEG";
  if (dataUrl.startsWith("data:image/webp")) return "WEBP";
  return "PNG";
}

/** Fetch any URL into a data URL. Returns null when unavailable. */
export async function loadImage(url: string | undefined): Promise<string | null> {
  if (!url) return null;
  if (isDataUrl(url)) return url;
  if (memo.has(url)) return memo.get(url) ?? null;
  if (typeof fetch === "undefined") return null;
  try {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) throw new Error(String(res.status));
    const blob = await res.blob();
    const dataUrl = await blobToDataUrl(blob);
    memo.set(url, dataUrl);
    return dataUrl;
  } catch {
    memo.set(url, null);
    return null;
  }
}

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof FileReader === "undefined") {
      reject(new Error("FileReader unavailable"));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

/** Load several named images in parallel; failures resolve to absent keys. */
export async function loadImageSet(
  urls: Record<string, string | undefined>,
): Promise<Record<string, string>> {
  const entries = await Promise.all(
    Object.entries(urls).map(async ([key, url]) => [key, await loadImage(url)] as const),
  );
  const out: Record<string, string> = {};
  for (const [key, value] of entries) if (value) out[key] = value;
  return out;
}

/** Optimise a data URL for the target export quality (browser only). */
export async function optimizeImage(
  dataUrl: string,
  cfg: ExportConfig,
  maxWidthMm: number,
): Promise<string> {
  if (typeof document === "undefined" || cfg.quality === "print" || cfg.quality === "high") {
    return dataUrl;
  }
  try {
    const img = await decodeImage(dataUrl);
    const maxPx = Math.ceil((maxWidthMm / 25.4) * cfg.imageDpi);
    if (img.width <= maxPx) return dataUrl;
    const ratio = maxPx / img.width;
    const canvas = document.createElement("canvas");
    canvas.width = maxPx;
    canvas.height = Math.round(img.height * ratio);
    const ctx = canvas.getContext("2d");
    if (!ctx) return dataUrl;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", cfg.quality === "compressed" ? 0.72 : 0.88);
  } catch {
    return dataUrl;
  }
}

export function decodeImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image decode failed"));
    img.src = dataUrl;
  });
}

/** Aspect-fit a source image into a box, returning the drawn rect. */
export function fitBox(
  srcW: number,
  srcH: number,
  boxW: number,
  boxH: number,
  align: "left" | "center" | "right" = "left",
  x = 0,
  y = 0,
): { x: number; y: number; w: number; h: number } {
  const ratio = Math.min(boxW / (srcW || 1), boxH / (srcH || 1));
  const w = (srcW || boxW) * ratio;
  const h = (srcH || boxH) * ratio;
  const dx = align === "center" ? x + (boxW - w) / 2 : align === "right" ? x + boxW - w : x;
  return { x: dx, y: y + (boxH - h) / 2, w, h };
}

/** Draw an image, silently skipping when unsupported. */
export function drawImage(
  doc: DocLike,
  dataUrl: string,
  x: number,
  y: number,
  w: number,
  h: number,
): void {
  if (!doc.addImage) return;
  try {
    doc.addImage(dataUrl, imageFormat(dataUrl), x, y, w, h, undefined, "FAST");
  } catch {
    /* a broken image must never break a report */
  }
}

export function clearImageCache(): void {
  memo.clear();
}

/** Render a QR code to a data URL (browser only). */
export async function makeQrDataUrl(value: string, sizePx = 512): Promise<string | null> {
  if (!value) return null;
  try {
    const QRCode = (await import("qrcode")).default;
    return await QRCode.toDataURL(value, { width: sizePx, margin: 1 });
  } catch {
    return null;
  }
}
