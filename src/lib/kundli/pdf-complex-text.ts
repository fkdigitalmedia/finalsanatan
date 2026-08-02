// ============================================================
// Complex-script text rendering for jsPDF
// ------------------------------------------------------------
// jsPDF embeds TTFs but does NOT run OpenType shaping (GSUB/GPOS),
// so Devanagari / Bengali / Tamil / Telugu / Malayalam / etc. render
// with matras in the wrong order, missing conjuncts, and broken
// clusters. To fix Hindi (and every other Indic script) we let the
// browser shape the text on an offscreen canvas (which uses HarfBuzz
// under the hood) and embed that rasterized image into the PDF.
//
// The public entry point patches `doc.text` for complex-script langs.
// Latin fallbacks and pure-ASCII strings keep using vector text so
// file size stays small and English labels stay crisp.
// ============================================================
import type { jsPDF } from "jspdf";
import type { PdfLang } from "./pdf-i18n";

// Script Unicode ranges that jsPDF cannot shape correctly
const COMPLEX_RANGE =
  /[\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F]/;

const COMPLEX_LANGS: Record<PdfLang, string | null> = {
  en: null,
  hi: "Noto Sans Devanagari",
  mr: "Noto Sans Devanagari",
  gu: "Noto Sans Gujarati",
  bn: "Noto Sans Bengali",
  as: "Noto Sans Bengali",
  ta: "Noto Sans Tamil",
  te: "Noto Sans Telugu",
  kn: "Noto Sans Kannada",
  ml: "Noto Sans Malayalam",
  pa: "Noto Sans Gurmukhi",
  or: "Noto Sans Oriya",
};

// Google Fonts CSS2 URL — served with CORS + proper webfont subset.
const CSS_URLS: Record<string, string> = {
  "Noto Sans Devanagari":
    "https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;700&display=swap",
  "Noto Sans Gujarati":
    "https://fonts.googleapis.com/css2?family=Noto+Sans+Gujarati:wght@400;700&display=swap",
  "Noto Sans Bengali":
    "https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;700&display=swap",
  "Noto Sans Tamil":
    "https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;700&display=swap",
  "Noto Sans Telugu":
    "https://fonts.googleapis.com/css2?family=Noto+Sans+Telugu:wght@400;700&display=swap",
  "Noto Sans Kannada":
    "https://fonts.googleapis.com/css2?family=Noto+Sans+Kannada:wght@400;700&display=swap",
  "Noto Sans Malayalam":
    "https://fonts.googleapis.com/css2?family=Noto+Sans+Malayalam:wght@400;700&display=swap",
  "Noto Sans Gurmukhi":
    "https://fonts.googleapis.com/css2?family=Noto+Sans+Gurmukhi:wght@400;700&display=swap",
  "Noto Sans Oriya":
    "https://fonts.googleapis.com/css2?family=Noto+Sans+Oriya:wght@400;700&display=swap",
};

const loadedFamilies = new Set<string>();

async function ensureWebFont(family: string): Promise<void> {
  if (loadedFamilies.has(family)) return;
  const url = CSS_URLS[family];
  if (!url || typeof document === "undefined") {
    loadedFamilies.add(family);
    return;
  }
  // Inject <link rel="stylesheet"> and wait for the fonts to be usable.
  if (!document.querySelector(`link[data-webfont="${family}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    link.crossOrigin = "anonymous";
    link.setAttribute("data-webfont", family);
    document.head.appendChild(link);
  }
  try {
    // fonts.load also triggers actual download; wait for both weights.
    await Promise.all([
      (document as unknown as { fonts: FontFaceSet }).fonts.load(`400 32px "${family}"`),
      (document as unknown as { fonts: FontFaceSet }).fonts.load(`700 32px "${family}"`),
    ]);
    await (document as unknown as { fonts: FontFaceSet }).fonts.ready;
  } catch {
    /* best-effort; canvas will fall back to system font */
  }
  loadedFamilies.add(family);
}

const PX_PER_MM = 96 / 25.4; // CSS-px per mm
const OVERSAMPLE = 3; // 3x pixel density for sharp print output

interface Raster {
  dataUrl: string;
  wMm: number;
  hMm: number;
  ascentMm: number;
}

function rasterize(
  text: string,
  family: string,
  bold: boolean,
  fontSizePt: number,
  color: string,
): Raster | null {
  if (typeof document === "undefined") return null;
  const pxLogical = fontSizePt * (96 / 72);
  const pxRender = pxLogical * OVERSAMPLE;
  const canvas = document.createElement("canvas");
  const measureCtx = canvas.getContext("2d");
  if (!measureCtx) return null;
  const weight = bold ? "700" : "400";
  const fontSpec = `${weight} ${pxRender}px "${family}", "Noto Sans", system-ui, sans-serif`;
  measureCtx.font = fontSpec;
  const metrics = measureCtx.measureText(text);
  const ascent = metrics.actualBoundingBoxAscent || pxRender * 0.85;
  const descent = metrics.actualBoundingBoxDescent || pxRender * 0.3;
  const padX = Math.ceil(pxRender * 0.1);
  const padY = Math.ceil(pxRender * 0.15);
  const w = Math.max(1, Math.ceil(metrics.width) + padX * 2);
  const h = Math.max(1, Math.ceil(ascent + descent) + padY * 2);
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.font = fontSpec;
  ctx.fillStyle = color;
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.fillText(text, padX, ascent + padY);
  const scale = 1 / (OVERSAMPLE * PX_PER_MM);
  return {
    dataUrl: canvas.toDataURL("image/png"),
    wMm: w * scale,
    hMm: h * scale,
    ascentMm: (ascent + padY) * scale,
  };
}

function hexFromDocColor(doc: jsPDF): string {
  try {
    // jsPDF returns "r,g,b" (0-255) as string
    const raw = (doc as unknown as { getTextColor: () => string }).getTextColor();
    if (typeof raw === "string") {
      if (raw.startsWith("#")) return raw;
      const parts = raw.split(",").map((n) => parseInt(n.trim(), 10));
      if (parts.length === 3 && parts.every((n) => Number.isFinite(n))) {
        return "#" + parts.map((n) => n.toString(16).padStart(2, "0")).join("");
      }
    }
  } catch {
    /* fall through */
  }
  return "#1A1108";
}

/**
 * Install a `doc.text` wrapper that rasterizes any string containing
 * complex-script characters. Latin-only strings keep flowing through
 * jsPDF's native vector renderer.
 *
 * Idempotent — calling twice is a no-op.
 */
export async function installComplexTextShaper(doc: jsPDF, lang: PdfLang): Promise<void> {
  const family = COMPLEX_LANGS[lang];
  if (!family) return;
  await ensureWebFont(family);

  const holder = doc as unknown as {
    __complexShaperInstalled?: boolean;
    text: (...args: unknown[]) => jsPDF;
  };
  if (holder.__complexShaperInstalled) return;
  holder.__complexShaperInstalled = true;

  const originalText = holder.text.bind(doc);

  const patched = function patchedText(
    this: jsPDF,
    text: string | string[],
    x: number,
    y: number,
    options?: { align?: "left" | "center" | "right"; baseline?: string; maxWidth?: number },
  ) {
    // Normalize array input to per-line calls
    if (Array.isArray(text)) {
      const lineHeight = doc.getFontSize() * 0.352778 * 1.15; // pt→mm × leading
      text.forEach((line, i) => {
        patched.call(this, line, x, y + i * lineHeight, options);
      });
      return this;
    }
    if (typeof text !== "string" || !COMPLEX_RANGE.test(text)) {
      return originalText(text, x, y, options);
    }
    const fontSizePt = doc.getFontSize();
    let bold = false;
    try {
      const cur = (doc as unknown as { getFont: () => { fontStyle?: string } }).getFont();
      bold = /bold/i.test(cur.fontStyle ?? "");
    } catch {
      /* ignore */
    }
    const color = hexFromDocColor(doc);
    const raster = rasterize(text, family, bold, fontSizePt, color);
    if (!raster) return originalText(text, x, y, options);

    // Align mimicking jsPDF semantics
    let drawX = x;
    const align = options?.align ?? "left";
    if (align === "center") drawX = x - raster.wMm / 2;
    else if (align === "right") drawX = x - raster.wMm;

    // jsPDF's baseline defaults to alphabetic; y is baseline position.
    const drawY = y - raster.ascentMm;

    try {
      doc.addImage(raster.dataUrl, "PNG", drawX, drawY, raster.wMm, raster.hMm, undefined, "FAST");
    } catch {
      return originalText(text, x, y, options);
    }
    return this;
  };

  holder.text = patched as unknown as typeof holder.text;
}
