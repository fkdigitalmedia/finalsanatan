import { useState, type ReactNode } from "react";
import { FormattedMarkdown } from "@/components/ui/FormattedMarkdown";
import { Sparkles, Loader2, AlertTriangle, Copy, Check } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { AiMode } from "@/lib/ai-modes";
import { useTranslation } from "@/i18n/I18nProvider";

export interface AIRunnerProps {
  mode: AiMode;
  /** Build the {input} record sent to the server. Return null to block submit. */
  getInput: () => Record<string, string> | null;
  /** Form UI rendered above the submit button. */
  children: ReactNode;
  submitLabel?: string;
  /** Optional example prompts users can click to populate the form. */
  examples?: { label: string; apply: () => void }[];
  /** Optional custom disabled state. */
  disabled?: boolean;
}

export function AIRunner({
  mode,
  getInput,
  children,
  submitLabel,
  examples,
  disabled,
}: AIRunnerProps) {
  const { t } = useTranslation();
  const resolvedSubmitLabel = submitLabel ?? t("premium_tools.shared.ask_ai");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const submit = async () => {
    setError(null);
    const input = getInput();
    if (!input) {
      setError(t("premium_tools.shared.fill_required_fields"));
      return;
    }
    setLoading(true);
    setResponse(null);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, input }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        text?: string;
        error?: string;
      };
      if (!res.ok) {
        if (res.status === 429) {
          setError(t("premium_tools.shared.rate_limited"));
        } else if (res.status === 402) {
          setError(t("premium_tools.shared.credits_exhausted"));
        } else {
          setError(data.error || t("premium_tools.shared.ai_request_failed"));
        }
        return;
      }
      setResponse(data.text ?? "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  };

  const onCopy = async () => {
    if (!response) return;
    try {
      await navigator.clipboard.writeText(response);
      setCopied(true);
      toast.success(t("premium_tools.shared.copied_to_clipboard"));
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error(t("premium_tools.shared.copy_failed"));
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/60">
        <CardContent className="p-5 md:p-6 space-y-4">
          {children}

          {examples && examples.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-xs text-muted-foreground self-center mr-1">
                {t("premium_tools.shared.try_label")}
              </span>
              {examples.map((ex) => (
                <button
                  key={ex.label}
                  type="button"
                  onClick={ex.apply}
                  className="text-xs px-3 py-1 rounded-full border border-border/60 hover:bg-primary-soft/40 transition-colors"
                >
                  {ex.label}
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button onClick={submit} disabled={loading || disabled} className="min-w-40">
              {loading ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  {t("premium_tools.shared.thinking")}
                </>
              ) : (
                <>
                  <Sparkles className="size-4 mr-2" />
                  {resolvedSubmitLabel}
                </>
              )}
            </Button>
            <span className="text-xs text-muted-foreground">
              {t("premium_tools.shared.ai_disclaimer")}
            </span>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="p-4 flex items-start gap-3 text-sm">
            <AlertTriangle className="size-4 text-destructive shrink-0 mt-0.5" />
            <span>{error}</span>
          </CardContent>
        </Card>
      )}

      {response && (
        <Card className="border-border/60">
          <CardContent className="p-5 md:p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Sparkles className="size-4 text-primary" />
                {t("premium_tools.shared.ai_response")}
              </div>
              <Button variant="ghost" size="sm" onClick={onCopy}>
                {copied ? (
                  <>
                    <Check className="size-4 mr-2" /> {t("premium_tools.shared.copied")}
                  </>
                ) : (
                  <>
                    <Copy className="size-4 mr-2" /> {t("premium_tools.shared.copy")}
                  </>
                )}
              </Button>
            </div>
            <FormattedMarkdown content={response} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
