// ============================================================
// Universal PDF Report Engine — Renderer
// ------------------------------------------------------------
// Walks a template's section list and dispatches each one to a
// registered section renderer. New section types are registered
// at runtime — the renderer itself never grows a report-specific
// branch, and no layout is hardcoded here.
// ============================================================

import {
  contentWidth,
  drawBadges,
  drawDivider,
  drawHeading,
  drawKeyValues,
  drawLogo,
  drawPanel,
  drawProgressBar,
  drawScoreCards,
  drawText,
  drawTextAt,
  drawTimeline,
  ensureSpace,
  moveDown,
  newPage,
  rect,
} from "./components";
import { renderChart, type ChartStyle } from "./charts";
import { DISCLAIMER_TEXT } from "./constants";
import { lineHeightMm } from "./fonts";
import {
  evaluateCondition,
  formatValue,
  getPath,
  resolveDeep,
  resolveVariables,
  titleCase,
} from "./helpers";
import { drawImage, makeQrDataUrl } from "./images";
import {
  drawTable,
  houseTable,
  inferColumns,
  planetTable,
  strengthTable,
  type TableColumn,
  type TableRow,
} from "./tables";
import { addTocEntry, reserveTocPage } from "./toc";
import type { RenderContext, SectionRenderer, TemplateSection } from "./types";

// ---------- helpers shared by section renderers ----------
function opt<T>(section: TemplateSection, key: string, fallback: T): T {
  const value = section.options?.[key];
  return (value === undefined || value === null ? fallback : value) as T;
}

/** Read a value that may be a literal or a `{{path}}`/`source` reference. */
function bind<T>(ctx: RenderContext, section: TemplateSection, key: string, fallback: T): T {
  const raw = section.options?.[key];
  if (raw === undefined || raw === null) {
    const source = section.options?.[`${key}Source`];
    if (typeof source === "string") return (getPath(ctx.data, source) as T) ?? fallback;
    return fallback;
  }
  if (typeof raw === "string" && raw.includes("{{")) {
    const inner = raw.match(/^\{\{\s*([^{}]+?)\s*\}\}$/);
    if (inner) {
      const resolved = getPath(ctx.data, inner[1].trim());
      if (resolved !== undefined) return resolved as T;
    }
    return resolveVariables(raw, ctx.data) as unknown as T;
  }
  return raw as T;
}

function bindArray(ctx: RenderContext, section: TemplateSection, key: string): unknown[] {
  const value = bind<unknown>(ctx, section, key, []);
  return Array.isArray(value) ? value : [];
}

function text(ctx: RenderContext, value: unknown): string {
  return resolveVariables(formatValue(value), ctx.data);
}

// ---------- section registry ----------
const registry = new Map<string, SectionRenderer>();

export function registerSection(type: string, renderer: SectionRenderer): void {
  registry.set(type, renderer);
}

export function getSectionRenderer(type: string): SectionRenderer | undefined {
  return registry.get(type);
}

export function registeredSectionTypes(): string[] {
  return [...registry.keys()].sort();
}

// ---------- built-in sections ----------
registerSection("spacer", (ctx, s) => moveDown(ctx, Number(opt(s, "height", 6))));

registerSection("pagebreak", (ctx) => newPage(ctx));

registerSection("heading", (ctx, s) => {
  drawHeading(ctx, text(ctx, s.title ?? opt(s, "text", "")), Number(opt(s, "level", 2)));
});

registerSection("paragraph", (ctx, s) => {
  if (s.title) drawHeading(ctx, text(ctx, s.title), Number(opt(s, "level", 2)));
  drawText(ctx, text(ctx, bind(ctx, s, "text", "")), {
    align: opt(s, "align", "left"),
    size: opt<number | undefined>(s, "size", undefined),
    color: opt<string | undefined>(s, "color", undefined),
  });
  moveDown(ctx, 2);
});

registerSection("markdown", (ctx, s) => {
  if (s.title) drawHeading(ctx, text(ctx, s.title), Number(opt(s, "level", 2)));
  const md = text(ctx, bind(ctx, s, "text", ""));
  renderMarkdown(ctx, md);
});

registerSection("divider", (ctx) => drawDivider(ctx));

registerSection("introduction", (ctx, s) => {
  const title = text(ctx, s.title ?? "Introduction");
  drawHeading(ctx, title, 1);
  const body = text(ctx, bind(ctx, s, "text", ""));
  if (body) renderMarkdown(ctx, body);
});

registerSection("summary", (ctx, s) => {
  const title = text(ctx, s.title ?? "Summary");
  drawHeading(ctx, title, 1);
  const body = text(ctx, bind(ctx, s, "text", "{{summary}}"));
  if (body) renderMarkdown(ctx, body);
});

registerSection("keyvalue", (ctx, s) => {
  if (s.title) drawHeading(ctx, text(ctx, s.title), 2);
  const raw = bindArray(ctx, s, "items");
  const pairs = raw.length
    ? raw.map((item) => {
        const o = item as Record<string, unknown>;
        return { label: text(ctx, o.label ?? o.key), value: text(ctx, o.value) };
      })
    : Object.entries(bind<Record<string, unknown>>(ctx, s, "object", {}) ?? {}).map(([k, v]) => ({
        label: titleCase(k),
        value: formatValue(v),
      }));
  drawKeyValues(
    ctx,
    pairs.filter((p) => p.label),
    Number(opt(s, "columns", 2)),
  );
});

registerSection("table", (ctx, s) => {
  if (s.title) drawHeading(ctx, text(ctx, s.title), 2);
  const rows = bindArray(ctx, s, "rows") as TableRow[];
  if (!rows.length) return;
  const columns = (opt<TableColumn[]>(s, "columns", []) ?? []).length
    ? opt<TableColumn[]>(s, "columns", [])
    : inferColumns(rows);
  drawTable(ctx, {
    columns,
    rows,
    zebra: opt(s, "zebra", true),
    compact: opt(s, "compact", false),
    caption: s.options?.caption ? text(ctx, s.options.caption) : undefined,
  });
});

registerSection("planet-table", (ctx, s) => {
  if (s.title) drawHeading(ctx, text(ctx, s.title), 2);
  const planets = bindArray(ctx, s, "planets") as Parameters<typeof planetTable>[0];
  if (!planets.length) return;
  drawTable(ctx, { ...planetTable(planets), compact: opt(s, "compact", true) });
});

registerSection("house-table", (ctx, s) => {
  if (s.title) drawHeading(ctx, text(ctx, s.title), 2);
  const houses = bindArray(ctx, s, "houses") as Parameters<typeof houseTable>[0];
  if (!houses.length) return;
  drawTable(ctx, { ...houseTable(houses), compact: true });
});

registerSection("planet-strength-table", (ctx, s) => {
  if (s.title) drawHeading(ctx, text(ctx, s.title), 2);
  const rows = bindArray(ctx, s, "entries") as Parameters<typeof strengthTable>[0];
  if (!rows.length) return;
  drawTable(ctx, { ...strengthTable(rows), compact: true });
});

const chartSection: SectionRenderer = (ctx, s) => {
  if (s.title) drawHeading(ctx, text(ctx, s.title), 2);
  const chart = bind<unknown>(ctx, s, "chart", undefined);
  renderChart(ctx, chart as never, {
    style: opt<ChartStyle>(s, "style", "north"),
    size: opt<number | undefined>(s, "size", undefined),
    align: opt(s, "align", "center"),
    caption: s.options?.caption ? text(ctx, s.options.caption) : undefined,
    subCaption: s.options?.subCaption ? text(ctx, s.options.subCaption) : undefined,
  });
};
registerSection("chart", chartSection);
registerSection("wheel-chart", (ctx, s) =>
  chartSection(ctx, { ...s, options: { style: "wheel", ...(s.options ?? {}) } }),
);

registerSection("timeline", (ctx, s) => {
  if (s.title) drawHeading(ctx, text(ctx, s.title), 2);
  const items = bindArray(ctx, s, "items")
    .map((raw) => {
      const o = raw as Record<string, unknown>;
      return {
        label: text(ctx, o.label ?? o.title ?? o.lord ?? o.planet),
        from: text(ctx, o.from ?? o.start ?? o.startDate),
        to: text(ctx, o.to ?? o.end ?? o.endDate),
        detail: text(ctx, o.detail ?? o.note ?? o.description),
      };
    })
    .filter((i) => i.label);
  drawTimeline(ctx, items);
});

registerSection("dasha-timeline", (ctx, s) =>
  registry.get("timeline")!(ctx, { ...s, title: s.title ?? "Dasha Timeline" }),
);

registerSection("transit-timeline", (ctx, s) =>
  registry.get("timeline")!(ctx, { ...s, title: s.title ?? "Transit Timeline" }),
);

const listSummary: SectionRenderer = (ctx, s) => {
  if (s.title) drawHeading(ctx, text(ctx, s.title), 2);
  const items = bindArray(ctx, s, "items");
  if (!items.length) {
    drawText(ctx, text(ctx, opt(s, "emptyText", "None detected.")), {
      color: ctx.theme.colors.muted,
    });
    return;
  }
  for (const raw of items) {
    const o = raw as Record<string, unknown>;
    const name = text(ctx, o.name ?? o.label ?? o.title ?? o.key);
    const desc = text(ctx, o.description ?? o.summary ?? o.effect ?? o.detail);
    const strength = o.strength ?? o.severity ?? o.confidence;
    const size = ctx.theme.typography.baseSize;
    const lines = desc ? ctx.doc.splitTextToSize(desc, contentWidth(ctx) - 10) : [];
    const height = 6 + lines.length * lineHeightMm(size - 0.5, 1.3);
    drawPanel(ctx, height, (x, y, w) => {
      drawTextAt(ctx, name, x, y + 4, { size, style: "bold", color: ctx.theme.colors.primary });
      if (strength !== undefined && strength !== null) {
        drawTextAt(ctx, formatValue(strength), x + w, y + 4, {
          size: size - 1.5,
          color: ctx.theme.colors.muted,
          align: "right",
        });
      }
      lines.forEach((line, i) => {
        drawTextAt(ctx, line, x, y + 9 + i * lineHeightMm(size - 0.5, 1.3), {
          size: size - 0.5,
          color: ctx.theme.colors.ink,
        });
      });
    });
  }
};
registerSection("dosha-summary", (ctx, s) =>
  listSummary(ctx, { ...s, title: s.title ?? "Dosha Summary" }),
);
registerSection("yoga-summary", (ctx, s) =>
  listSummary(ctx, { ...s, title: s.title ?? "Yoga Summary" }),
);
registerSection("recommendations", (ctx, s) => {
  if (s.title) drawHeading(ctx, text(ctx, s.title), 2);
  const items = bindArray(ctx, s, "items");
  const size = ctx.theme.typography.baseSize;
  for (const raw of items) {
    const o = typeof raw === "object" && raw ? (raw as Record<string, unknown>) : { label: raw };
    const label = text(ctx, o.label ?? o.title ?? o.name ?? o.remedy ?? raw);
    const detail = text(ctx, o.detail ?? o.description ?? o.how);
    if (!label) continue;
    ensureSpace(ctx, 8);
    ctx.doc.setFillColor(ctx.theme.colors.accent);
    if (ctx.doc.circle) ctx.doc.circle(ctx.margins.left + 1.4, ctx.cursorY + 2.6, 1.1, "F");
    drawTextAt(ctx, label, ctx.margins.left + 5, ctx.cursorY + 3.8, { size, style: "bold" });
    ctx.cursorY += 5.5;
    if (detail) {
      drawText(ctx, detail, {
        size: size - 1,
        color: ctx.theme.colors.muted,
        maxWidth: contentWidth(ctx) - 5,
      });
    }
    ctx.cursorY += 1.5;
  }
  moveDown(ctx, 2);
});

registerSection("festival-calendar", (ctx, s) => {
  if (s.title) drawHeading(ctx, text(ctx, s.title), 2);
  const items = bindArray(ctx, s, "items").map((raw) => {
    const o = raw as Record<string, unknown>;
    return {
      date: text(ctx, o.date ?? o.gregorianDate ?? o.startDate),
      name: text(ctx, o.name ?? o.title ?? o.festival),
      tithi: text(ctx, o.tithi ?? o.detail ?? o.note),
      region: text(ctx, o.region ?? o.category),
    };
  });
  if (!items.length) return;
  drawTable(ctx, {
    columns: [
      { key: "date", label: "Date", width: 1 },
      { key: "name", label: "Festival", width: 1.8 },
      { key: "tithi", label: "Tithi / Detail", width: 1.6 },
      { key: "region", label: "Region", width: 1 },
    ],
    rows: items,
    compact: true,
  });
});

registerSection("scorecards", (ctx, s) => {
  if (s.title) drawHeading(ctx, text(ctx, s.title), 2);
  const cards = bindArray(ctx, s, "items")
    .map((raw) => {
      const o = raw as Record<string, unknown>;
      return {
        label: text(ctx, o.label ?? o.name ?? o.key),
        value: text(ctx, o.value ?? o.score),
        caption: text(ctx, o.caption ?? o.note),
      };
    })
    .filter((c) => c.label || c.value);
  drawScoreCards(ctx, cards, Number(opt(s, "columns", 3)));
});

registerSection("progress-bars", (ctx, s) => {
  if (s.title) drawHeading(ctx, text(ctx, s.title), 2);
  const max = Number(opt(s, "max", 100));
  for (const raw of bindArray(ctx, s, "items")) {
    const o = raw as Record<string, unknown>;
    const label = text(ctx, o.label ?? o.name ?? o.key);
    const value = Number(o.value ?? o.score ?? 0);
    if (!label) continue;
    drawProgressBar(ctx, label, value, Number(o.max ?? max));
  }
  moveDown(ctx, 2);
});

registerSection("badges", (ctx, s) => {
  if (s.title) drawHeading(ctx, text(ctx, s.title), 2);
  const badges = bindArray(ctx, s, "items")
    .map((raw) => {
      if (typeof raw === "string") return { label: text(ctx, raw) };
      const o = raw as Record<string, unknown>;
      return {
        label: text(ctx, o.label ?? o.name),
        tone: (o.tone as "primary") ?? "primary",
      };
    })
    .filter((b) => b.label);
  drawBadges(ctx, badges);
});

registerSection("image", (ctx, s) => {
  if (s.title) drawHeading(ctx, text(ctx, s.title), 2);
  const key = String(opt(s, "imageKey", ""));
  const data = key ? ctx.images[key] : ctx.images[s.id];
  if (!data) return;
  const w = Number(opt(s, "width", contentWidth(ctx)));
  const h = Number(opt(s, "height", 60));
  ensureSpace(ctx, h + 4);
  const align = opt<"left" | "center" | "right">(s, "align", "center");
  const x =
    align === "center"
      ? ctx.margins.left + (contentWidth(ctx) - w) / 2
      : align === "right"
        ? ctx.page.width - ctx.margins.right - w
        : ctx.margins.left;
  drawImage(ctx.doc, data, x, ctx.cursorY, w, h);
  ctx.cursorY += h + 4;
});

registerSection("qrcode", (ctx, s) => {
  const data = ctx.images.qr;
  if (!data) return;
  const size = Number(opt(s, "size", ctx.template.qr.size || 24));
  ensureSpace(ctx, size + 8);
  const x = ctx.page.width - ctx.margins.right - size;
  drawImage(ctx.doc, data, x, ctx.cursorY, size, size);
  const caption = text(ctx, s.options?.caption ?? ctx.template.qr.caption ?? "");
  if (caption) {
    drawTextAt(ctx, caption, x + size / 2, ctx.cursorY + size + 4, {
      size: ctx.theme.typography.baseSize - 2.5,
      color: ctx.theme.colors.muted,
      align: "center",
    });
  }
  ctx.cursorY += size + 8;
});

registerSection("signature", (ctx, s) => {
  const cfg = ctx.template.signature;
  if (!cfg?.enabled) return;
  const w = 60;
  ensureSpace(ctx, 26);
  const x = ctx.page.width - ctx.margins.right - w;
  if (ctx.images.signature) drawImage(ctx.doc, ctx.images.signature, x, ctx.cursorY, w, 14);
  ctx.doc.setDrawColor(ctx.theme.colors.divider);
  ctx.doc.setLineWidth(0.3);
  ctx.doc.line(x, ctx.cursorY + 15, x + w, ctx.cursorY + 15);
  drawTextAt(ctx, text(ctx, cfg.name ?? ""), x + w, ctx.cursorY + 19, {
    size: ctx.theme.typography.baseSize - 1,
    align: "right",
    style: "bold",
  });
  drawTextAt(ctx, text(ctx, cfg.title ?? ""), x + w, ctx.cursorY + 23, {
    size: ctx.theme.typography.baseSize - 2,
    align: "right",
    color: ctx.theme.colors.muted,
  });
  ctx.cursorY += 28;
  if (cfg.note)
    drawText(ctx, text(ctx, cfg.note), {
      size: ctx.theme.typography.baseSize - 2,
      color: ctx.theme.colors.muted,
    });
  void s;
});

registerSection("disclaimer", (ctx, s) => {
  const body = text(
    ctx,
    bind(ctx, s, "text", DISCLAIMER_TEXT[String(ctx.language)] ?? DISCLAIMER_TEXT.en),
  );
  const title = text(ctx, s.title ?? "Disclaimer");
  const size = ctx.theme.typography.baseSize - 1;
  const lines = ctx.doc.splitTextToSize(body, contentWidth(ctx) - 8);
  const height = 6 + lines.length * lineHeightMm(size, 1.35);
  drawPanel(
    ctx,
    height,
    (x, y, w) => {
      drawTextAt(ctx, title, x, y + 4, {
        size: size + 1,
        style: "bold",
        color: ctx.theme.colors.primary,
      });
      lines.forEach((line, i) => {
        drawTextAt(ctx, line, x, y + 9.5 + i * lineHeightMm(size, 1.35), {
          size,
          color: ctx.theme.colors.muted,
          maxWidth: w,
        });
      });
    },
    { fill: ctx.theme.colors.surface, border: ctx.theme.colors.divider },
  );
});

registerSection("appendix", (ctx, s) => {
  drawHeading(ctx, text(ctx, s.title ?? "Appendix"), 1);
  const entries = bindArray(ctx, s, "items");
  for (const raw of entries) {
    const o = raw as Record<string, unknown>;
    drawHeading(ctx, text(ctx, o.title ?? o.label), 3);
    renderMarkdown(ctx, text(ctx, o.text ?? o.body ?? o.value));
  }
});

registerSection("toc", (ctx, s) => {
  // The page is reserved here and filled after the full pass.
  ctx.toc.length = 0;
  reserveTocPage(ctx);
  void s;
});

registerSection("cover", (ctx, s) => {
  const { theme, template } = ctx;
  const pageW = ctx.page.width;
  const pageH = ctx.page.height;

  // background band
  ctx.doc.setFillColor(theme.colors.surface);
  rect(ctx.doc, 0, 0, pageW, pageH * 0.42, "F", 0);
  ctx.doc.setFillColor(theme.colors.primary);
  rect(ctx.doc, 0, pageH * 0.42 - 1.6, pageW, 1.6, "F", 0);

  let y = pageH * 0.1;
  if (ctx.images.logo) {
    const h = Number(opt(s, "logoHeight", 18));
    drawLogo(ctx, pageW / 2, y - h / 2, h * 2.6, h, "center");
    y += h;
  } else {
    drawTextAt(ctx, template.branding.company, pageW / 2, y, {
      size: theme.typography.baseSize + 6,
      style: "bold",
      color: theme.colors.primary,
      align: "center",
      font: ctx.fonts.heading,
    });
    y += 8;
  }

  const title = text(ctx, s.title ?? opt(s, "title", "{{reportTitle}}"));
  const subtitle = text(ctx, opt(s, "subtitle", ""));
  y = pageH * 0.28;
  drawTextAt(ctx, title, pageW / 2, y, {
    size: theme.typography.baseSize * theme.typography.scale * 2.4,
    style: "bold",
    color: theme.colors.primary,
    align: "center",
    font: ctx.fonts.heading,
  });
  if (subtitle) {
    y += 9;
    drawTextAt(ctx, subtitle, pageW / 2, y, {
      size: theme.typography.baseSize + 1,
      color: theme.colors.muted,
      align: "center",
    });
  }

  // details panel
  const details = bindArray(ctx, s, "details")
    .map((raw) => {
      const o = raw as Record<string, unknown>;
      return { label: text(ctx, o.label), value: text(ctx, o.value) };
    })
    .filter((d) => d.label && d.value);

  ctx.cursorY = pageH * 0.5;
  if (details.length) {
    drawKeyValues(ctx, details, Number(opt(s, "columns", 2)));
  }

  const intro = text(ctx, bind(ctx, s, "intro", ""));
  if (intro) {
    ctx.cursorY += 4;
    drawText(ctx, intro, {
      size: theme.typography.baseSize,
      color: theme.colors.muted,
      align: "center",
    });
  }

  // qr
  if (ctx.images.qr && template.qr.enabled && template.qr.position.startsWith("cover")) {
    const size = template.qr.size || 24;
    const x =
      template.qr.position === "cover-bottom-left"
        ? ctx.margins.left
        : pageW - ctx.margins.right - size;
    const qy = pageH - ctx.margins.bottom - size - 10;
    drawImage(ctx.doc, ctx.images.qr, x, qy, size, size);
    if (template.qr.caption) {
      drawTextAt(ctx, text(ctx, template.qr.caption), x + size / 2, qy + size + 4, {
        size: theme.typography.baseSize - 3,
        color: theme.colors.muted,
        align: "center",
      });
    }
  }

  // brand strip
  drawTextAt(ctx, template.branding.website, pageW / 2, pageH - ctx.margins.bottom, {
    size: theme.typography.baseSize - 1,
    color: theme.colors.secondary,
    align: "center",
  });

  if (opt(s, "breakAfter", true)) newPage(ctx);
});

// ---------- lightweight markdown ----------
export function renderMarkdown(ctx: RenderContext, markdown: string): void {
  if (!markdown) return;
  const lines = String(markdown).split("\n");
  const size = ctx.theme.typography.baseSize;

  for (const rawLine of lines) {
    const line = rawLine.replace(/\*\*(.+?)\*\*/g, "$1").replace(/__(.+?)__/g, "$1");
    const trimmed = line.trim();
    if (!trimmed) {
      moveDown(ctx, 2);
      continue;
    }

    const heading = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      drawHeading(ctx, heading[2], heading[1].length);
      continue;
    }

    if (/^(-{3,}|\*{3,})$/.test(trimmed)) {
      drawDivider(ctx);
      continue;
    }

    const bullet = trimmed.match(/^[-*•]\s+(.*)$/);
    if (bullet) {
      ensureSpace(ctx, 6);
      ctx.doc.setFillColor(ctx.theme.colors.accent);
      if (ctx.doc.circle) ctx.doc.circle(ctx.margins.left + 1.3, ctx.cursorY + 2.4, 0.9, "F");
      drawText(ctx, bullet[1], { size, maxWidth: contentWidth(ctx) - 6 });
      continue;
    }

    const numbered = trimmed.match(/^(\d+)[.)]\s+(.*)$/);
    if (numbered) {
      drawText(ctx, `${numbered[1]}.  ${numbered[2]}`, { size, maxWidth: contentWidth(ctx) - 4 });
      continue;
    }

    if (trimmed.startsWith(">")) {
      drawText(ctx, trimmed.replace(/^>\s?/, ""), { size, color: ctx.theme.colors.muted });
      continue;
    }

    drawText(ctx, trimmed, { size });
  }
  moveDown(ctx, 2);
}

// ---------- section dispatch ----------
export async function renderSection(ctx: RenderContext, section: TemplateSection): Promise<void> {
  if (section.enabled === false) return;
  if (!evaluateCondition(section.visibleWhen, ctx.data)) return;

  const renderer = registry.get(String(section.type));
  if (!renderer) return;

  if (section.newPage && ctx.doc.getNumberOfPages() > 0 && ctx.cursorY > ctx.contentTop) {
    newPage(ctx);
  }

  const resolved: TemplateSection = {
    ...section,
    title: section.title ? resolveVariables(section.title, ctx.data) : section.title,
    options: resolveOptionStrings(section.options, ctx),
  };

  if (section.inToc && resolved.title && String(section.type) !== "toc") {
    addTocEntry(
      ctx,
      resolved.title,
      ctx.doc.getNumberOfPages(),
      Number(opt(section, "tocLevel", 1)),
    );
  }

  await renderer(ctx, resolved);
  ctx.sectionsRendered++;
}

/** Resolve {{vars}} inside string options while leaving bound data refs intact. */
function resolveOptionStrings(
  options: Record<string, unknown> | undefined,
  ctx: RenderContext,
): Record<string, unknown> | undefined {
  if (!options) return options;
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(options)) {
    if (typeof value === "string" && value.includes("{{")) {
      const inner = value.match(/^\{\{\s*([^{}]+?)\s*\}\}$/);
      out[key] = inner
        ? (getPath(ctx.data, inner[1].trim()) ?? "")
        : resolveVariables(value, ctx.data);
    } else {
      out[key] = value;
    }
  }
  return out;
}

/** Prepare any dynamic images a template needs before rendering. */
export async function prepareQr(ctx: RenderContext): Promise<void> {
  const cfg = ctx.template.qr;
  if (!cfg?.enabled) return;
  const value = resolveVariables(cfg.value ?? "", ctx.data);
  if (!value) return;
  const dataUrl = await makeQrDataUrl(value);
  if (dataUrl) ctx.images.qr = dataUrl;
}

export { resolveDeep };
