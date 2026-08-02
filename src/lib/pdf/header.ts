// ============================================================
// Universal PDF Report Engine — Page header
// ============================================================

import { applyStyle, drawLogo, drawTextAt } from "./components";
import { resolveVariables } from "./helpers";
import type { RenderContext } from "./types";

/** Stamp the configured header onto the current page. */
export function renderHeader(ctx: RenderContext, pageNumber: number, isCover: boolean): void {
  const cfg = ctx.template.header;
  if (!cfg?.enabled) return;
  if (isCover && !cfg.showOnCover) return;

  const y = Math.max(6, ctx.margins.top - cfg.height + 4);
  const left = ctx.margins.left;
  const right = ctx.page.width - ctx.margins.right;
  const size = ctx.theme.typography.baseSize - 2;
  const data = { ...ctx.data, page: pageNumber };

  let textLeft = left;
  if (cfg.showLogo && ctx.images.logo) {
    const h = 7;
    if (drawLogo(ctx, left, y - 2, h * 2.6, h)) textLeft = left + h * 2.6 + 3;
  }

  applyStyle(ctx, { size, color: ctx.theme.colors.muted });
  const l = resolveVariables(cfg.left ?? "", data);
  const c = resolveVariables(cfg.center ?? "", data);
  const r = resolveVariables(cfg.right ?? "", data);

  if (l) drawTextAt(ctx, l, textLeft, y + 3, { size, color: ctx.theme.colors.muted });
  if (c)
    drawTextAt(ctx, c, ctx.page.width / 2, y + 3, {
      size,
      color: ctx.theme.colors.muted,
      align: "center",
    });
  if (r) drawTextAt(ctx, r, right, y + 3, { size, color: ctx.theme.colors.muted, align: "right" });

  if (cfg.rule) {
    ctx.doc.setDrawColor(ctx.theme.colors.divider);
    ctx.doc.setLineWidth(0.3);
    ctx.doc.line(left, y + 5.5, right, y + 5.5);
  }
}
