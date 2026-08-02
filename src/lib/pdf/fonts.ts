// ============================================================
// Universal PDF Report Engine — Fonts
// ------------------------------------------------------------
// Lazy-loads Noto script fonts on demand (never at import time)
// and reuses the existing Kundli PDF font pipeline so Indic and
// Unicode text renders identically across every report.
// ============================================================

import type { DocLike, PdfLanguage } from "./types";

/** Language → font family registered inside the PDF. */
export const SCRIPT_FONTS: Record<string, string> = {
  en: "helvetica",
  hi: "NotoDevanagari",
  mr: "NotoDevanagari",
  gu: "NotoGujarati",
  bn: "NotoBengali",
  as: "NotoBengali",
  ta: "NotoTamil",
  te: "NotoTelugu",
  kn: "NotoKannada",
  ml: "NotoMalayalam",
  pa: "NotoGurmukhi",
  or: "NotoOriya",
};

/** Scripts that need OpenType shaping (canvas rasterisation path). */
export const COMPLEX_SCRIPT_LANGS = new Set([
  "hi",
  "mr",
  "gu",
  "bn",
  "as",
  "ta",
  "te",
  "kn",
  "ml",
  "pa",
  "or",
]);

/** Right-to-left languages — reserved for future Urdu/Arabic support. */
export const RTL_LANGS = new Set(["ur", "ar", "fa", "he"]);

export function isRtl(language: PdfLanguage): boolean {
  return RTL_LANGS.has(String(language));
}

export function fontForLanguage(language: PdfLanguage): string {
  return SCRIPT_FONTS[String(language)] ?? "helvetica";
}

const loaded = new Set<string>();

/**
 * Ensure the document can render the given language. Delegates to the
 * proven Kundli font loader in the browser; a no-op on the server and
 * in tests, where the fallback family is returned.
 */
export async function ensureFont(doc: DocLike, language: PdfLanguage): Promise<string> {
  const lang = String(language);
  if (lang === "en" || typeof window === "undefined") return "helvetica";
  try {
    const [{ ensurePdfFont }, { installComplexTextShaper }] = await Promise.all([
      import("@/lib/kundli/pdf-i18n"),
      import("@/lib/kundli/pdf-complex-text"),
    ]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const family = await ensurePdfFont(doc as any, lang as any);
    if (!loaded.has(lang)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await installComplexTextShaper(doc as any, lang as any);
      loaded.add(lang);
    }
    return family || "helvetica";
  } catch {
    return "helvetica";
  }
}

export function resetFontCache(): void {
  loaded.clear();
}

/** Font size for a heading level, derived from the theme scale. */
export function headingSize(base: number, scale: number, level: number): number {
  const steps = [2.4, 1.7, 1.35, 1.15, 1.05, 1];
  return Math.round(base * scale * (steps[Math.min(level, steps.length) - 1] ?? 1) * 10) / 10;
}

/** Line height in mm for a pt font size. */
export function lineHeightMm(fontSizePt: number, multiple: number): number {
  return fontSizePt * 0.3528 * multiple;
}
