// ============================================================
// Universal PDF Report Engine — Template Manager
// ------------------------------------------------------------
// In-memory registry of templates + themes. Ships a starter
// template for every known report so the engine works out of
// the box, but every one of them can be replaced or extended
// from the Admin Panel without touching this file.
// ============================================================

import { BUILT_IN_THEME_MAP } from "./constants";
import { normalizeTemplate, structuredCloneSafe, titleCase } from "./helpers";
import { buildDefaultTemplate } from "./default-templates";
import { assertValidTemplate } from "./validators";
import type { PdfReportType, PdfTemplate, PdfTheme, ThemeName } from "./types";

const templates = new Map<string, PdfTemplate>();
const customThemes = new Map<string, PdfTheme>();

// ---------- themes ----------
export function registerTheme(theme: PdfTheme): void {
  customThemes.set(String(theme.name), theme);
}

export function getTheme(name: ThemeName): PdfTheme | undefined {
  return customThemes.get(String(name)) ?? BUILT_IN_THEME_MAP[String(name)];
}

export function listThemes(): PdfTheme[] {
  return [...Object.values(BUILT_IN_THEME_MAP), ...customThemes.values()];
}

export function customThemeMap(): Record<string, PdfTheme> {
  return Object.fromEntries(customThemes.entries());
}

export function removeTheme(name: ThemeName): boolean {
  return customThemes.delete(String(name));
}

// ---------- templates ----------
export function registerTemplate(input: Partial<PdfTemplate> & { report: string }): PdfTemplate {
  const template = normalizeTemplate(input);
  assertValidTemplate(template);
  templates.set(template.id, template);
  return template;
}

export function getTemplate(id: string): PdfTemplate | undefined {
  const found = templates.get(id);
  return found ? structuredCloneSafe(found) : undefined;
}

export function listTemplates(report?: PdfReportType): PdfTemplate[] {
  const all = [...templates.values()];
  return report ? all.filter((t) => t.report === report) : all;
}

export function deleteTemplate(id: string): boolean {
  return templates.delete(id);
}

export function duplicateTemplate(id: string, name?: string): PdfTemplate | undefined {
  const source = templates.get(id);
  if (!source) return undefined;
  const copy = structuredCloneSafe(source);
  copy.id = `${source.id}_copy_${Date.now().toString(36)}`;
  copy.name = name ?? `${source.name} (copy)`;
  copy.status = "draft";
  copy.version = 1;
  templates.set(copy.id, copy);
  return copy;
}

export function setTemplateStatus(
  id: string,
  status: PdfTemplate["status"],
): PdfTemplate | undefined {
  const t = templates.get(id);
  if (!t) return undefined;
  t.status = status;
  t.version += 1;
  return structuredCloneSafe(t);
}

/**
 * Resolve the template to use for a report. Preference order:
 *   explicit id → published template for the report → built-in default.
 * The built-in default is generated, not hardcoded layout: it is a
 * normal template object that admins can duplicate and edit.
 */
export function resolveTemplateFor(report: PdfReportType, templateId?: string): PdfTemplate {
  if (templateId) {
    const byId = getTemplate(templateId);
    if (byId) return byId;
  }
  const published = listTemplates(report).find((t) => t.status === "published");
  if (published) return structuredCloneSafe(published);
  return ensureDefaultTemplate(report);
}

export function ensureDefaultTemplate(report: PdfReportType): PdfTemplate {
  const id = `default-${report}`;
  const existing = templates.get(id);
  if (existing) return structuredCloneSafe(existing);
  const template = normalizeTemplate({
    ...buildDefaultTemplate(report),
    id,
    name: `${titleCase(String(report))} — Default`,
    status: "published",
  });
  templates.set(id, template);
  return structuredCloneSafe(template);
}

export function clearTemplates(): void {
  templates.clear();
}

export function templateCount(): number {
  return templates.size;
}
