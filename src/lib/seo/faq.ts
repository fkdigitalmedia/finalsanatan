// ============================================================
// Phase 14.7 — FAQ engine.
// Every page type can answer questions; this module derives a sensible
// FAQ set from the registries so FAQPage schema is never hand-written.
// ============================================================

import { SITE_FAQ_GROUPS } from "@/config/faqs";
import { TOOLS } from "@/config/tools";
import { CATEGORIES } from "@/config/categories";
import { SITE_NAME } from "./constants";
import type { PageType } from "./constants";

export interface Faq {
  question: string;
  answer: string;
}

const GLOBAL_FAQS: Faq[] = SITE_FAQ_GROUPS.flatMap((g) => g.items);

function toolFaqs(slug: string): Faq[] {
  const tool = TOOLS.find((t) => t.slug === slug);
  if (!tool) return [];
  const category = CATEGORIES.find((c) => c.slug === tool.category);
  return [
    {
      question: `What does the ${tool.title} tool do?`,
      answer: tool.description,
    },
    {
      question: `Is ${tool.title} free to use on ${SITE_NAME}?`,
      answer: `Yes — ${tool.title} is free to use. Only long-form premium PDF reports require a subscription; every calculation shown on the page itself is free and needs no signup.`,
    },
    {
      question: `How accurate is ${tool.title}?`,
      answer: `${tool.title} runs on the same Swiss-ephemeris-grade calculation engine used across ${SITE_NAME}, with the Lahiri ayanamsa, your exact coordinates and IANA timezone — so results match professional Vedic software.`,
    },
    ...(category
      ? [
          {
            question: `What else is available under ${category.title}?`,
            answer: `${category.description} You can browse every ${category.title} tool from the /${category.slug} category page.`,
          },
        ]
      : []),
  ];
}

function categoryFaqs(slug: string): Faq[] {
  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) return [];
  const count = TOOLS.filter((t) => t.category === slug).length;
  return [
    { question: `What is included in ${category.title}?`, answer: category.description },
    {
      question: `How many ${category.title} tools are there?`,
      answer: `${count} ${category.title} tools are live right now, and new ones are added every month.`,
    },
  ];
}

export interface FaqContext {
  type: PageType;
  slug?: string;
  /** Page-specific FAQs that always win over derived ones. */
  extra?: Faq[];
}

/** De-duplicated FAQ list for a page (page-specific first, then derived, then global). */
export function faqsFor(ctx: FaqContext, limit = 6): Faq[] {
  const derived =
    ctx.type === "tool" && ctx.slug
      ? toolFaqs(ctx.slug)
      : ctx.type === "category" && ctx.slug
        ? categoryFaqs(ctx.slug)
        : [];

  const seen = new Set<string>();
  const out: Faq[] = [];
  for (const f of [...(ctx.extra ?? []), ...derived, ...GLOBAL_FAQS]) {
    const key = f.question.trim().toLowerCase();
    if (!f.question || !f.answer || seen.has(key)) continue;
    seen.add(key);
    out.push(f);
    if (out.length >= limit) break;
  }
  return out;
}

export { GLOBAL_FAQS };
