/**
 * KundliAiPanel — Sprint 4
 * ------------------------------------------------------------
 * Premium AI-narrated interpretation of a computed KundliResult.
 *
 * Free users see the first 2 sections as a teaser and an unlock
 * CTA. Premium (entitlement: `kundli_premium_report`) users can
 * expand every section and export the narratives into the PDF.
 */
import { useCallback, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { Sparkles, Lock, ChevronDown, ChevronUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SanatanLoader } from "@/components/ui-kit/SanatanLoader";
import {
  interpretKundliSection,
  KUNDLI_SECTIONS,
  SECTION_TITLES,
  type KundliSection,
} from "@/lib/kundli/interpret.functions";
import type { KundliResult } from "@/lib/kundli/types";
import type { PdfLang } from "@/lib/kundli/pdf-i18n";
import { useTranslation } from "@/i18n/I18nProvider";

type Birth = {
  date: string;
  time: string;
  place: string;
  latitude: number;
  longitude: number;
  timezone: string | number;
};

interface Props {
  birth: Birth;
  result: KundliResult;
  language: PdfLang;
  isPremium: boolean;
  /** Called with all fetched narratives so the parent can bundle
   *  them into the premium PDF export. */
  onNarrativesChange?: (
    narratives: Array<{ section: KundliSection; title: string; text: string }>,
  ) => void;
}

const FREE_PREVIEW: KundliSection[] = ["lagna", "moonSign"];

export function KundliAiPanel({
  birth,
  result: _result,
  language,
  isPremium,
  onNarrativesChange,
}: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [cache, setCache] = useState<
    Record<string, { text: string; loading: boolean; error?: string }>
  >({});
  const call = useServerFn(interpretKundliSection);

  const emit = useCallback(
    (next: typeof cache) => {
      if (!onNarrativesChange) return;
      const list = KUNDLI_SECTIONS.filter((s) => next[s]?.text).map((s) => ({
        section: s,
        title: SECTION_TITLES[s],
        text: next[s]!.text,
      }));
      onNarrativesChange(list);
    },
    [onNarrativesChange],
  );

  const toggle = async (section: KundliSection) => {
    const gated = !isPremium && !FREE_PREVIEW.includes(section);
    if (gated) return;
    setOpen((o) => ({ ...o, [section]: !o[section] }));
    if (cache[section]?.text || cache[section]?.loading) return;
    setCache((c) => {
      const next = { ...c, [section]: { text: "", loading: true } };
      return next;
    });
    try {
      const res = await call({
        data: { birth: { ...birth, language }, section, language },
      });
      setCache((c) => {
        const next = { ...c, [section]: { text: res.text, loading: false } };
        emit(next);
        return next;
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : t("kundli.aiPanel.could_not_generate");
      setCache((c) => ({ ...c, [section]: { text: "", loading: false, error: message } }));
    }
  };

  return (
    <section className="mt-10 rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            <h3 className="font-display text-xl md:text-2xl font-semibold">
              {t("kundli.aiPanel.title")}
            </h3>
            {isPremium ? (
              <Badge className="bg-primary/15 text-primary border border-primary/30">
                {t("kundli.aiPanel.premium_badge")}
              </Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground">
                {t("kundli.aiPanel.free_preview_badge")}
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
            {t("kundli.aiPanel.subtitle")}
          </p>
        </div>
        {!isPremium && (
          <Button asChild size="lg" className="shadow-md">
            <Link to="/pricing">
              <Lock className="mr-2 size-4" /> {t("kundli.aiPanel.unlock_full_report")}
            </Link>
          </Button>
        )}
      </div>

      <div className="mt-6 divide-y divide-border">
        {KUNDLI_SECTIONS.map((section) => {
          const gated = !isPremium && !FREE_PREVIEW.includes(section);
          const isOpen = !!open[section];
          const entry = cache[section];
          return (
            <div key={section} className="py-3">
              <button
                type="button"
                onClick={() => toggle(section)}
                disabled={gated}
                className="flex w-full items-center justify-between gap-3 text-left disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span className="flex items-center gap-2 font-medium">
                  {gated && <Lock className="size-3.5 text-muted-foreground" />}
                  {SECTION_TITLES[section]}
                </span>
                {gated ? (
                  <span className="text-xs text-muted-foreground">
                    {t("kundli.aiPanel.premium_only")}
                  </span>
                ) : isOpen ? (
                  <ChevronUp className="size-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="size-4 text-muted-foreground" />
                )}
              </button>

              {isOpen && !gated && (
                <div className="mt-3 rounded-lg bg-background/60 p-4">
                  {entry?.loading && (
                    <SanatanLoader
                      title={t("kundli.aiPanel.loading_title")}
                      subtitle={t("kundli.aiPanel.loading_subtitle")}
                      tips={[
                        t("kundli.aiPanel.loading_tips.0"),
                        t("kundli.aiPanel.loading_tips.1"),
                        t("kundli.aiPanel.loading_tips.2"),
                        t("kundli.aiPanel.loading_tips.3"),
                      ]}
                    />
                  )}
                  {entry?.error && (
                    <p className="text-sm text-destructive">
                      {entry.error} —{" "}
                      <button type="button" onClick={() => toggle(section)} className="underline">
                        {t("kundli.aiPanel.retry")}
                      </button>
                    </p>
                  )}
                  {entry?.text && (
                    <div className="prose prose-sm max-w-none whitespace-pre-wrap leading-relaxed text-foreground/90">
                      {entry.text}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-xs text-muted-foreground italic">{t("kundli.aiPanel.disclaimer")}</p>
    </section>
  );
}
