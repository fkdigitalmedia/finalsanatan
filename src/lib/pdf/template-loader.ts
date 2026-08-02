// ============================================================
// Universal PDF Report Engine — Template Loader
// ------------------------------------------------------------
// Loads templates from the backend (admin-managed rows) with an
// in-memory TTL cache, and falls back to the built-in defaults
// when the backend has nothing published for a report.
// ============================================================

import { buildCacheKey, templateCache } from "./cache";
import { normalizeTemplate } from "./helpers";
import {
  ensureDefaultTemplate,
  registerTemplate,
  registerTheme,
  resolveTemplateFor,
} from "./template-manager";
import { validateTemplate } from "./validators";
import type { PdfReportType, PdfTemplate, PdfTheme } from "./types";

export interface TemplateSource {
  id: string;
  /** Fetch one template by id. */
  fetchById?(id: string): Promise<Partial<PdfTemplate> | null>;
  /** Fetch the published template for a report. */
  fetchForReport?(report: PdfReportType): Promise<Partial<PdfTemplate> | null>;
  /** Fetch admin-defined custom themes. */
  fetchThemes?(): Promise<PdfTheme[]>;
}

let source: TemplateSource | null = null;

export function setTemplateSource(next: TemplateSource | null): void {
  source = next;
  templateCache.clear();
}

export function getTemplateSource(): TemplateSource | null {
  return source;
}

/** Pull admin themes into the manager (safe to call repeatedly). */
export async function syncThemes(): Promise<number> {
  if (!source?.fetchThemes) return 0;
  try {
    const themes = await source.fetchThemes();
    themes.forEach(registerTheme);
    return themes.length;
  } catch {
    return 0;
  }
}

/**
 * Resolve the template for a report:
 *   cache → remote source → local registry → generated default.
 * Never throws: a broken remote template degrades to the default.
 */
export async function loadTemplate(
  report: PdfReportType,
  templateId?: string,
  bypassCache = false,
): Promise<PdfTemplate> {
  const key = buildCacheKey({
    scope: "template",
    report,
    templateId,
    source: source?.id ?? "local",
  });
  if (!bypassCache) {
    const hit = templateCache.get(key) as PdfTemplate | null;
    if (hit) return hit;
  }

  let remote: Partial<PdfTemplate> | null = null;
  try {
    if (templateId && source?.fetchById) remote = await source.fetchById(templateId);
    if (!remote && source?.fetchForReport) remote = await source.fetchForReport(report);
  } catch {
    remote = null;
  }

  let template: PdfTemplate;
  if (remote) {
    const candidate = normalizeTemplate({ ...remote, report: String(remote.report ?? report) });
    template = validateTemplate(candidate).valid ? candidate : ensureDefaultTemplate(report);
  } else {
    template = resolveTemplateFor(report, templateId);
  }

  templateCache.set(key, template);
  return template;
}

/** Register a template locally (used by admin previews and tests). */
export function loadInlineTemplate(input: Partial<PdfTemplate> & { report: string }): PdfTemplate {
  return registerTemplate(input);
}

export function invalidateTemplates(): void {
  templateCache.clear();
}
