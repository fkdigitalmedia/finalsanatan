/**
 * useToolI18n — read localised tool metadata and shell content.
 *
 * Wraps `useTranslation()` so pages, cards and shells never hardcode
 * per-tool text. English falls through when a translation is missing.
 */

import { useMemo } from "react";
import type { FAQItem } from "@/components/ui-kit/FAQList";
import { useTranslation } from "./I18nProvider";
import {
  PANCHANG_TOPIC,
  TOOL_I18N,
  type ToolEntry,
  getLocalizedToolEntry,
} from "./tool-translations";
import type { Tool } from "@/config/tools";

/** Localised title / description / intro for a tool. */
export function useLocalizedToolEntry(slug: string): ToolEntry {
  const { lang } = useTranslation();
  return useMemo(() => getLocalizedToolEntry(slug, lang), [slug, lang]);
}

/** Same helper as a hook applied to an already-loaded `Tool`. */
export function useLocalizedTool(tool: Tool): {
  title: string;
  description: string;
  intro?: string;
} {
  const entry = useLocalizedToolEntry(tool.slug);
  return {
    title: entry.title || tool.title,
    description: entry.description || tool.description,
    intro: entry.intro,
  };
}

/** Resolve the shared how-to steps (per-tool overrides not yet defined). */
export function useLocalizedHowToUse(_slug: string): string[] {
  const { raw } = useTranslation();
  return raw<string[]>("tool_shell.how_generic") ?? [];
}

/** Resolve the shared benefits list. */
export function useLocalizedBenefits(_slug: string): string[] {
  const { raw } = useTranslation();
  return raw<string[]>("tool_shell.benefits_generic") ?? [];
}

/**
 * Resolve the FAQ list for a tool.
 * Panchang tools get the templated 4-question set with a topic substitution;
 * everything else gets the shared generic 3-question set.
 */
export function useLocalizedFaqs(slug: string): FAQItem[] {
  const { raw, t } = useTranslation();
  return useMemo(() => {
    const topicKey = PANCHANG_TOPIC[slug];
    if (topicKey) {
      const items = raw<FAQItem[]>("tool_shell.faqs_panchang") ?? [];
      const topic = t(`tool_shell.panchang_topics.${topicKey}`);
      return items.map((it) => ({
        q: it.q.replace("{topic}", topic),
        a: it.a.replace("{topic}", topic),
      }));
    }
    return raw<FAQItem[]>("tool_shell.faqs_generic") ?? [];
  }, [slug, raw, t]);
}

/**
 * Return a searchable haystack for a tool in the active language
 * (title + description + tags + category). Used by the tools hub search.
 */
export function localizedSearchableText(tool: Tool, lang: string, categoryLabel: string): string {
  const entry = getLocalizedToolEntry(tool.slug, lang);
  return [
    entry.title,
    entry.description,
    tool.title,
    tool.description,
    categoryLabel,
    tool.category,
    ...tool.tags,
  ]
    .join(" ")
    .toLowerCase();
}

export { TOOL_I18N };
