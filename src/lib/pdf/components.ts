// ============================================================
// Universal PDF Report Engine — Drawing primitives
// ------------------------------------------------------------
// Every visual atom used by section components lives here:
// text, headings, boxes, rules, badges, progress bars, score
// cards, timelines and decorative borders. Nothing here knows
// about a specific report.
// ============================================================

import { headingSize, lineHeightMm } from "./fonts";
import { clamp, tint } from "./helpers";
import { drawImage } from "./images";
import type { DocLike, RenderContext } from "./types";

// ---------- page flow ----------
export function contentWidth(ctx: RenderContext): number {
  return ctx.page.width - ctx.margins.left - ctx.margins.right;
}

export function remaining(ctx: RenderContext): number {
  return ctx.contentBottom - ctx.cursorY;
}

/** Add a page and reset the cursor. Header/footer are stamped later. */
export function newPage(ctx: RenderContext): void {
  ctx.doc.addPage();
  ctx.cursorY = ctx.contentTop;
}

/** Ensure `needed` mm of vertical space, breaking the page when short. */
export function ensureSpace(ctx: RenderContext, needed: number): void {
  if (remaining(ctx) < needed) newPage(ctx);
}

export function moveDown(ctx: RenderContext, mm: number): void {
  ctx.cursorY += mm;
}

// ---------- text ----------
export interface TextStyle {
  size?: number;
  color?: string;
  font?: string;
  style?: "normal" | "bold" | "italic";
  align?: "left" | "center" | "right";
  lineHeight?: number;
  letterSpacing?: number;
  maxWidth?: number;
}

export function applyStyle(ctx: RenderContext, s: TextStyle = {}): number {
  const size = s.size ?? ctx.theme.typography.baseSize;
  ctx.doc.setFont(s.font ?? ctx.fonts.body, s.style ?? "normal");
  ctx.doc.setFontSize(size);
  ctx.doc.setTextColor(s.color ?? ctx.theme.colors.ink);
  return size;
}

function alignX(ctx: RenderContext, align: TextStyle["align"], width: number): number {
  if (align === "center") return ctx.margins.left + width / 2;
  if (align === "right") return ctx.margins.left + width;
  return ctx.margins.left;
}

/** Draw wrapped text at the cursor, paginating as needed. Returns height used. */
export function drawText(ctx: RenderContext, text: string, s: TextStyle = {}): number {
  const value = (text ?? "").toString();
  if (!value.trim()) return 0;
  const size = applyStyle(ctx, s);
  const width = s.maxWidth ?? contentWidth(ctx);
  const lh = lineHeightMm(size, s.lineHeight ?? ctx.theme.typography.lineHeight);
  const lines = wrapLines(ctx.doc, value, width);
  const x = alignX(ctx, s.align, width);

  let used = 0;
  for (const line of lines) {
    ensureSpace(ctx, lh);
    applyStyle(ctx, s);
    ctx.doc.text(line, x, ctx.cursorY + lh * 0.75, { align: s.align ?? "left" });
    ctx.cursorY += lh;
    used += lh;
  }
  return used;
}

export function wrapLines(doc: DocLike, text: string, width: number): string[] {
  const paragraphs = String(text).split("\n");
  const out: string[] = [];
  for (const p of paragraphs) {
    if (!p.trim()) {
      out.push("");
      continue;
    }
    try {
      out.push(...doc.splitTextToSize(p, width));
    } catch {
      out.push(p);
    }
  }
  return out;
}

/** Text at an absolute position (headers, footers, table cells). */
export function drawTextAt(
  ctx: RenderContext,
  text: string,
  x: number,
  y: number,
  s: TextStyle = {},
): void {
  if (!text) return;
  applyStyle(ctx, s);
  ctx.doc.text(String(text), x, y, { align: s.align ?? "left" });
}

// ---------- headings ----------
export function drawHeading(ctx: RenderContext, text: string, level = 2): number {
  if (!text) return 0;
  const { typography, colors } = ctx.theme;
  const size = headingSize(typography.baseSize, typography.scale, level);
  const gapTop = level <= 2 ? 4 : 3;
  const lh = lineHeightMm(size, 1.25);
  ensureSpace(ctx, lh + gapTop + 4);
  ctx.cursorY += gapTop;

  if (level <= 2 && ctx.theme.decoration.sectionBackground) {
    const w = contentWidth(ctx);
    ctx.doc.setFillColor(tint(colors.primary, 0.9));
    rect(ctx.doc, ctx.margins.left, ctx.cursorY, w, lh + 3, "F", ctx.theme.decoration.cornerRadius);
  }

  applyStyle(ctx, {
    size,
    color: level <= 2 ? colors.primary : colors.secondary,
    font: ctx.fonts.heading,
    style: "bold",
  });
  const padding = level <= 2 && ctx.theme.decoration.sectionBackground ? 3 : 0;
  ctx.doc.text(text, ctx.margins.left + padding, ctx.cursorY + lh * 0.8);
  ctx.cursorY += lh + (padding ? 5 : 2);
  return lh;
}

// ---------- shapes ----------
export function rect(
  doc: DocLike,
  x: number,
  y: number,
  w: number,
  h: number,
  style: "F" | "S" | "FD" = "F",
  radius = 0,
): void {
  if (radius > 0 && doc.roundedRect) doc.roundedRect(x, y, w, h, radius, radius, style);
  else doc.rect(x, y, w, h, style);
}

export function drawRule(ctx: RenderContext, color?: string, width = 0.3): void {
  ctx.doc.setDrawColor(color ?? ctx.theme.colors.divider);
  ctx.doc.setLineWidth(width);
  ctx.doc.line(ctx.margins.left, ctx.cursorY, ctx.page.width - ctx.margins.right, ctx.cursorY);
  ctx.cursorY += 2;
}

/** Ornamental divider — a rule with a diamond in the middle. */
export function drawOrnament(ctx: RenderContext): void {
  const { colors } = ctx.theme;
  const cx = ctx.page.width / 2;
  const y = ctx.cursorY;
  ctx.doc.setDrawColor(colors.divider);
  ctx.doc.setLineWidth(0.3);
  ctx.doc.line(ctx.margins.left, y, cx - 6, y);
  ctx.doc.line(cx + 6, y, ctx.page.width - ctx.margins.right, y);
  ctx.doc.setFillColor(colors.accent);
  if (ctx.doc.circle) ctx.doc.circle(cx, y, 1.4, "F");
  else rect(ctx.doc, cx - 1.2, y - 1.2, 2.4, 2.4, "F");
  ctx.cursorY += 3;
}

export function drawDivider(ctx: RenderContext): void {
  ctx.cursorY += 2;
  if (ctx.theme.decoration.dividerStyle === "none") {
    ctx.cursorY += 2;
    return;
  }
  if (ctx.theme.decoration.dividerStyle === "ornament") drawOrnament(ctx);
  else drawRule(ctx);
  ctx.cursorY += 2;
}

/** Decorative page border used by luxury/temple/premium themes. */
export function drawPageBorder(ctx: RenderContext): void {
  if (!ctx.theme.decoration.decorativeBorder) return;
  const { doc, theme } = ctx;
  const inset = 6;
  doc.setDrawColor(theme.colors.accent);
  doc.setLineWidth(theme.decoration.borderWidth);
  rect(doc, inset, inset, ctx.page.width - inset * 2, ctx.page.height - inset * 2, "S", 0);
  doc.setLineWidth(0.2);
  rect(
    doc,
    inset + 1.6,
    inset + 1.6,
    ctx.page.width - (inset + 1.6) * 2,
    ctx.page.height - (inset + 1.6) * 2,
    "S",
    0,
  );
}

// ---------- panels ----------
export interface PanelOptions {
  fill?: string;
  border?: string;
  padding?: number;
  radius?: number;
}

/** Render `body` inside a coloured panel. Height is measured first. */
export function drawPanel(
  ctx: RenderContext,
  height: number,
  render: (innerX: number, innerY: number, innerW: number) => void,
  opts: PanelOptions = {},
): void {
  const pad = opts.padding ?? 4;
  const w = contentWidth(ctx);
  ensureSpace(ctx, height + pad * 2);
  const y = ctx.cursorY;
  ctx.doc.setFillColor(opts.fill ?? ctx.theme.colors.surface);
  ctx.doc.setDrawColor(opts.border ?? ctx.theme.colors.divider);
  ctx.doc.setLineWidth(0.3);
  rect(
    ctx.doc,
    ctx.margins.left,
    y,
    w,
    height + pad * 2,
    opts.border ? "FD" : "F",
    opts.radius ?? ctx.theme.decoration.cornerRadius,
  );
  render(ctx.margins.left + pad, y + pad, w - pad * 2);
  ctx.cursorY = y + height + pad * 2 + 3;
}

// ---------- badges ----------
export function drawBadges(
  ctx: RenderContext,
  badges: { label: string; tone?: "primary" | "success" | "warning" | "danger" | "muted" }[],
): void {
  const toneColor: Record<string, string> = {
    primary: ctx.theme.colors.primary,
    success: ctx.theme.colors.success,
    warning: ctx.theme.colors.warning,
    danger: ctx.theme.colors.danger,
    muted: ctx.theme.colors.muted,
  };
  const h = 6.5;
  let x = ctx.margins.left;
  ensureSpace(ctx, h + 3);
  for (const badge of badges) {
    const label = String(badge.label ?? "");
    if (!label) continue;
    applyStyle(ctx, { size: ctx.theme.typography.baseSize - 1.5 });
    const w = Math.max(14, ctx.doc.getTextWidth(label) + 7);
    if (x + w > ctx.page.width - ctx.margins.right) {
      x = ctx.margins.left;
      ctx.cursorY += h + 2;
      ensureSpace(ctx, h + 3);
    }
    const color = toneColor[badge.tone ?? "primary"] ?? ctx.theme.colors.primary;
    ctx.doc.setFillColor(tint(color, 0.85));
    ctx.doc.setDrawColor(tint(color, 0.5));
    ctx.doc.setLineWidth(0.2);
    rect(ctx.doc, x, ctx.cursorY, w, h, "FD", 2);
    drawTextAt(ctx, label, x + w / 2, ctx.cursorY + h * 0.68, {
      size: ctx.theme.typography.baseSize - 1.5,
      color,
      align: "center",
      style: "bold",
    });
    x += w + 3;
  }
  ctx.cursorY += h + 4;
}

// ---------- progress bars ----------
export function drawProgressBar(
  ctx: RenderContext,
  label: string,
  value: number,
  max = 100,
  color?: string,
): void {
  const w = contentWidth(ctx);
  const barH = 4;
  const labelSize = ctx.theme.typography.baseSize - 0.5;
  ensureSpace(ctx, barH + 8);
  const pct = clamp(max ? value / max : 0, 0, 1);
  const tone = color ?? ctx.theme.colors.secondary;

  drawTextAt(ctx, label, ctx.margins.left, ctx.cursorY + 3, {
    size: labelSize,
    color: ctx.theme.colors.ink,
  });
  drawTextAt(
    ctx,
    `${Math.round(value)}${max === 100 ? "%" : `/${max}`}`,
    ctx.margins.left + w,
    ctx.cursorY + 3,
    { size: labelSize, color: ctx.theme.colors.muted, align: "right" },
  );

  const barY = ctx.cursorY + 5;
  ctx.doc.setFillColor(tint(tone, 0.86));
  rect(ctx.doc, ctx.margins.left, barY, w, barH, "F", barH / 2);
  ctx.doc.setFillColor(tone);
  if (pct > 0) rect(ctx.doc, ctx.margins.left, barY, Math.max(1.5, w * pct), barH, "F", barH / 2);
  ctx.cursorY = barY + barH + 4;
}

// ---------- score cards ----------
export function drawScoreCards(
  ctx: RenderContext,
  cards: { label: string; value: string | number; caption?: string }[],
  columns = 3,
): void {
  if (!cards.length) return;
  const gap = 4;
  const cols = Math.max(1, Math.min(columns, cards.length));
  const w = (contentWidth(ctx) - gap * (cols - 1)) / cols;
  const h = 20;

  for (let i = 0; i < cards.length; i += cols) {
    const row = cards.slice(i, i + cols);
    ensureSpace(ctx, h + gap);
    row.forEach((card, j) => {
      const x = ctx.margins.left + j * (w + gap);
      ctx.doc.setFillColor(ctx.theme.colors.surface);
      ctx.doc.setDrawColor(ctx.theme.colors.divider);
      ctx.doc.setLineWidth(0.3);
      rect(ctx.doc, x, ctx.cursorY, w, h, "FD", ctx.theme.decoration.cornerRadius);
      drawTextAt(ctx, String(card.label ?? ""), x + w / 2, ctx.cursorY + 6, {
        size: ctx.theme.typography.baseSize - 2,
        color: ctx.theme.colors.muted,
        align: "center",
      });
      drawTextAt(ctx, String(card.value ?? ""), x + w / 2, ctx.cursorY + 13.5, {
        size: ctx.theme.typography.baseSize + 4,
        color: ctx.theme.colors.primary,
        align: "center",
        style: "bold",
        font: ctx.fonts.heading,
      });
      if (card.caption) {
        drawTextAt(ctx, String(card.caption), x + w / 2, ctx.cursorY + 18, {
          size: ctx.theme.typography.baseSize - 2.5,
          color: ctx.theme.colors.muted,
          align: "center",
        });
      }
    });
    ctx.cursorY += h + gap;
  }
  ctx.cursorY += 1;
}

// ---------- timeline ----------
export interface TimelineItem {
  label: string;
  from?: string;
  to?: string;
  detail?: string;
  tone?: string;
}

export function drawTimeline(ctx: RenderContext, items: TimelineItem[]): void {
  if (!items.length) return;
  const x = ctx.margins.left + 3;
  const rowH = 11;
  for (const item of items) {
    ensureSpace(ctx, rowH + 2);
    const y = ctx.cursorY;
    ctx.doc.setDrawColor(ctx.theme.colors.divider);
    ctx.doc.setLineWidth(0.4);
    ctx.doc.line(x, y, x, y + rowH);
    ctx.doc.setFillColor(item.tone ?? ctx.theme.colors.accent);
    if (ctx.doc.circle) ctx.doc.circle(x, y + 3.2, 1.5, "F");
    else rect(ctx.doc, x - 1.3, y + 1.9, 2.6, 2.6, "F");

    drawTextAt(ctx, item.label, x + 5, y + 4, {
      size: ctx.theme.typography.baseSize,
      style: "bold",
      color: ctx.theme.colors.ink,
    });
    const range = [item.from, item.to].filter(Boolean).join("  →  ");
    if (range) {
      drawTextAt(ctx, range, ctx.page.width - ctx.margins.right, y + 4, {
        size: ctx.theme.typography.baseSize - 1.5,
        color: ctx.theme.colors.muted,
        align: "right",
      });
    }
    if (item.detail) {
      drawTextAt(ctx, item.detail, x + 5, y + 8.6, {
        size: ctx.theme.typography.baseSize - 1.5,
        color: ctx.theme.colors.muted,
      });
    }
    ctx.cursorY += rowH;
  }
  ctx.cursorY += 3;
}

// ---------- key/value grid ----------
export function drawKeyValues(
  ctx: RenderContext,
  pairs: { label: string; value: string }[],
  columns = 2,
): void {
  if (!pairs.length) return;
  const cols = Math.max(1, columns);
  const gap = 5;
  const colW = (contentWidth(ctx) - gap * (cols - 1)) / cols;
  const rowH = 7;

  for (let i = 0; i < pairs.length; i += cols) {
    const row = pairs.slice(i, i + cols);
    ensureSpace(ctx, rowH);
    row.forEach((pair, j) => {
      const x = ctx.margins.left + j * (colW + gap);
      drawTextAt(ctx, `${pair.label}`, x, ctx.cursorY + 4.6, {
        size: ctx.theme.typography.baseSize - 1,
        color: ctx.theme.colors.muted,
      });
      drawTextAt(ctx, `${pair.value}`, x + colW, ctx.cursorY + 4.6, {
        size: ctx.theme.typography.baseSize,
        color: ctx.theme.colors.ink,
        style: "bold",
        align: "right",
      });
      ctx.doc.setDrawColor(ctx.theme.colors.divider);
      ctx.doc.setLineWidth(0.15);
      ctx.doc.line(x, ctx.cursorY + rowH - 1, x + colW, ctx.cursorY + rowH - 1);
    });
    ctx.cursorY += rowH;
  }
  ctx.cursorY += 3;
}

// ---------- logo ----------
export function drawLogo(
  ctx: RenderContext,
  x: number,
  y: number,
  w: number,
  h: number,
  align: "left" | "center" | "right" = "left",
): boolean {
  const logo = ctx.images.logo;
  if (!logo) return false;
  const dx = align === "center" ? x - w / 2 : align === "right" ? x - w : x;
  drawImage(ctx.doc, logo, dx, y, w, h);
  return true;
}
