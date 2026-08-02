/**
 * AI Studio panel — one-click enrichment of empty festival fields via Lovable AI.
 * Shown inside the Festival editor sheet.
 */
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Sparkles, Wand2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  generateFestivalContent,
  applyGeneratedFestivalContent,
} from "@/lib/festivals-ai.functions";

const FIELDS: { key: string; label: string }[] = [
  { key: "short_description", label: "Short description" },
  { key: "detailed_description", label: "Detailed description" },
  { key: "significance", label: "Significance" },
  { key: "why_celebrated", label: "Why celebrated" },
  { key: "history", label: "History" },
  { key: "mythological_story", label: "Mythological story" },
  { key: "puja_vidhi", label: "Puja Vidhi" },
  { key: "preparation", label: "Preparation" },
  { key: "prasad", label: "Prasad" },
  { key: "aarti", label: "Aarti" },
  { key: "chalisa", label: "Chalisa" },
  { key: "stotra", label: "Stotra" },
  { key: "samagri", label: "Samagri list" },
  { key: "mantras", label: "Mantras" },
  { key: "regional_variations", label: "Regional variations" },
  { key: "faqs", label: "FAQs" },
  { key: "seo", label: "SEO meta" },
];

interface Props {
  festivalId?: string;
  onApplied?: () => void;
}

export function FestivalAIStudio({ festivalId, onApplied }: Props) {
  const genFn = useServerFn(generateFestivalContent);
  const applyFn = useServerFn(applyGeneratedFestivalContent);
  const [selected, setSelected] = useState<string[]>(FIELDS.map((f) => f.key));
  const [overwrite, setOverwrite] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [busy, setBusy] = useState<"" | "gen" | "apply">("");
  const [preview, setPreview] = useState<Record<string, any> | null>(null);

  const toggle = (k: string) =>
    setSelected((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));
  const setAll = (v: boolean) => setSelected(v ? FIELDS.map((f) => f.key) : []);

  if (!festivalId) {
    return (
      <p className="text-sm text-muted-foreground">Save the festival first to use AI Studio.</p>
    );
  }

  const generate = async () => {
    if (selected.length === 0) {
      toast.error("Pick at least one field");
      return;
    }
    setBusy("gen");
    try {
      const r = await genFn({
        data: { id: festivalId, fields: selected, overwrite, instructions },
      });
      setPreview(r.generated as Record<string, any>);
      const count = Object.keys(r.generated).length;
      if (count === 0) toast.info(r.note ?? "Nothing to generate");
      else toast.success(`Generated ${count} field${count === 1 ? "" : "s"}`);
    } catch (e: any) {
      toast.error(e?.message ?? "AI generation failed");
    } finally {
      setBusy("");
    }
  };

  const apply = async () => {
    if (!preview) return;
    setBusy("apply");
    try {
      await applyFn({ data: { id: festivalId, patch: preview } });
      toast.success("Applied to festival");
      setPreview(null);
      onApplied?.();
    } catch (e: any) {
      toast.error(e?.message ?? "Apply failed");
    } finally {
      setBusy("");
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-medium text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> AI Content Studio
            </div>
            <div className="text-xs text-muted-foreground">
              Generate authoritative Sanatan-style content for empty fields using Lovable AI.
              Sanskrit terms are preserved.
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="ovw" checked={overwrite} onCheckedChange={setOverwrite} />
            <Label htmlFor="ovw" className="cursor-pointer text-xs">
              Overwrite existing
            </Label>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <button className="underline text-muted-foreground" onClick={() => setAll(true)}>
            Select all
          </button>
          <button className="underline text-muted-foreground" onClick={() => setAll(false)}>
            Clear
          </button>
          <span className="text-muted-foreground">{selected.length} selected</span>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          {FIELDS.map((f) => (
            <label key={f.key} className="flex items-center gap-2 text-sm">
              <Checkbox checked={selected.includes(f.key)} onCheckedChange={() => toggle(f.key)} />
              <span>{f.label}</span>
            </label>
          ))}
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Editor instructions (optional)</Label>
          <Textarea
            rows={2}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="e.g. Emphasize Shaiva tradition; keep suitable for South Indian readers."
          />
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" onClick={generate} disabled={busy !== ""}>
            <Wand2 className="mr-2 h-4 w-4" />
            {busy === "gen" ? "Generating…" : "Generate with AI"}
          </Button>
          {preview && (
            <Button size="sm" variant="default" onClick={apply} disabled={busy !== ""}>
              {busy === "apply" ? "Applying…" : `Apply ${Object.keys(preview).length} field(s)`}
            </Button>
          )}
        </div>
      </Card>

      {preview && (
        <Card className="p-4 space-y-2">
          <div className="text-sm font-medium">Preview</div>
          <Separator />
          <div className="space-y-2 max-h-80 overflow-auto text-xs">
            {Object.entries(preview).map(([k, v]) => (
              <div key={k}>
                <div className="font-medium text-muted-foreground uppercase text-[10px] tracking-wide">
                  {k}
                </div>
                <pre className="whitespace-pre-wrap font-mono bg-muted/40 p-2 rounded">
                  {typeof v === "string" ? v : JSON.stringify(v, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
