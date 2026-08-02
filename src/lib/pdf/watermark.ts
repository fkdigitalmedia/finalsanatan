// ============================================================
// Universal PDF Report Engine — Watermark
// ============================================================

import { drawImage } from "./images";
import { resolveVariables } from "./helpers";
import type { RenderContext } from "./types";

/** Stamp the watermark behind the content of the current page. */
export function renderWatermark(ctx: RenderContext): void {
  const cfg = ctx.template.watermark;
  if (!cfg?.enabled) return;
  const { doc } = ctx;

  const applyAlpha = (alpha: number) => {
    if (doc.saveGraphicsState && doc.GState && doc.setGState) {
      doc.saveGraphicsState();
      doc.setGState(doc.GState({ opacity: alpha }));
      return true;
    }
    return false;
  };
  const restore = (applied: boolean) => {
    if (applied && doc.restoreGraphicsState) doc.restoreGraphicsState();
  };

  const alphaApplied = applyAlpha(Math.max(0.02, Math.min(cfg.opacity ?? 0.07, 1)));

  const image = ctx.images.watermark;
  if (image) {
    const w = ctx.page.width * (cfg.scale ?? 0.6);
    const h = w;
    drawImage(doc, image, (ctx.page.width - w) / 2, (ctx.page.height - h) / 2, w, h);
  } else if (cfg.text) {
    const text = resolveVariables(cfg.text, ctx.data);
    doc.setFont(ctx.fonts.heading, "bold");
    doc.setFontSize(Math.max(28, ctx.page.width * (cfg.scale ?? 0.6) * 0.42));
    doc.setTextColor(ctx.theme.colors.accent);
    doc.text(text, ctx.page.width / 2, ctx.page.height / 2, {
      align: "center",
      angle: cfg.angle ?? 45,
      baseline: "middle",
    });
  }

  restore(alphaApplied);
}

/** Full-page background image, drawn before anything else. */
export function renderBackground(ctx: RenderContext): void {
  const bg = ctx.images.background;
  if (!bg) return;
  drawImage(ctx.doc, bg, 0, 0, ctx.page.width, ctx.page.height);
}
