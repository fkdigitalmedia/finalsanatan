// ============================================================
// Universal PDF Report Engine — Page footer
// ============================================================

import { drawTextAt } from "./components";
import { resolveVariables } from "./helpers";
import type { RenderContext } from "./types";

export function renderFooter(
  ctx: RenderContext,
  pageNumber: number,
  totalPages: number,
  isCover: boolean,
): void {
  const cfg = ctx.template.footer;
  if (!cfg?.enabled) return;
  if (isCover && !cfg.showOnCover) return;

  const y = ctx.page.height - Math.max(6, ctx.margins.bottom - cfg.height + 8);
  const left = ctx.margins.left;
  const right = ctx.page.width - ctx.margins.right;
  const size = ctx.theme.typography.baseSize - 2.5;
  const data = { ...ctx.data, page: pageNumber, pages: totalPages };

  if (cfg.rule) {
    ctx.doc.setDrawColor(ctx.theme.colors.divider);
    ctx.doc.setLineWidth(0.3);
    ctx.doc.line(left, y - 4, right, y - 4);
  }

  const l = resolveVariables(cfg.left ?? "", data);
  const c =
    resolveVariables(cfg.center ?? "", data) ||
    resolveVariables(ctx.template.branding.customFooter ?? "", data);
  const r = cfg.pageNumbers
    ? resolveVariables(cfg.pageNumberFormat || "{{page}} / {{pages}}", data)
    : resolveVariables(cfg.right ?? "", data);

  const color = ctx.theme.colors.muted;
  if (l) drawTextAt(ctx, l, left, y, { size, color });
  if (c) drawTextAt(ctx, c, ctx.page.width / 2, y, { size, color, align: "center" });
  if (r) drawTextAt(ctx, r, right, y, { size, color, align: "right" });
}
