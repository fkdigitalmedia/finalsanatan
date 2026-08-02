/**
 * Translations panel — per-language cards with AI translate, publish/draft,
 * inline JSON editor, bulk "translate all missing".
 */
import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Globe2, Languages, Sparkles, Check, Trash2, Save, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  SUPPORTED_LANGUAGES,
  translateFestival,
  translateFestivalAllLanguages,
  setTranslationStatus,
  deleteFestivalTranslation,
} from "@/lib/festivals-ai.functions";
import { upsertFestivalTranslation, getFestival } from "@/lib/festivals.functions";

const LANG_LABEL: Record<string, string> = {
  hi: "हिन्दी Hindi",
  mr: "मराठी Marathi",
  gu: "ગુજરાતી Gujarati",
  ta: "தமிழ் Tamil",
  te: "తెలుగు Telugu",
  kn: "ಕನ್ನಡ Kannada",
  bn: "বাংলা Bengali",
  ml: "മലയാളം Malayalam",
  pa: "ਪੰਜਾਬੀ Punjabi",
  or: "ଓଡ଼ିଆ Odia",
  as: "অসমীয়া Assamese",
};

interface Props {
  festivalId: string;
  initial: any[];
}

export function FestivalTranslationsPanel({ festivalId, initial }: Props) {
  const qc = useQueryClient();
  const getFn = useServerFn(getFestival);
  const trFn = useServerFn(translateFestival);
  const trAllFn = useServerFn(translateFestivalAllLanguages);
  const statusFn = useServerFn(setTranslationStatus);
  const delFn = useServerFn(deleteFestivalTranslation);
  const saveFn = useServerFn(upsertFestivalTranslation);

  const detail = useQuery({
    queryKey: ["festival", festivalId, "translations-fresh"],
    queryFn: () => getFn({ data: { id: festivalId } }),
    initialData: { row: null, translations: initial, revisions: [] } as any,
  });

  const translations: any[] = detail.data?.translations ?? [];
  const byLang = useMemo(
    () => Object.fromEntries(translations.map((t) => [t.language, t])),
    [translations],
  );

  const [publishAfter, setPublishAfter] = useState(false);
  const [busyLang, setBusyLang] = useState<string | null>(null);
  const [busyAll, setBusyAll] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");

  const refresh = () =>
    qc.invalidateQueries({ queryKey: ["festival", festivalId, "translations-fresh"] });

  const translateOne = async (lang: string) => {
    setBusyLang(lang);
    try {
      await trFn({ data: { id: festivalId, language: lang, publish: publishAfter } });
      toast.success(`${LANG_LABEL[lang]} translated`);
      refresh();
    } catch (e: any) {
      toast.error(e?.message ?? "Translation failed");
    } finally {
      setBusyLang(null);
    }
  };

  const translateAll = async () => {
    setBusyAll(true);
    try {
      const r = await trAllFn({
        data: { id: festivalId, publish: publishAfter, onlyMissing: true },
      });
      toast.success(`Translated ${r.ok}/${r.ok + r.failed} languages`);
      if (r.failed) console.warn("Translation failures:", r.results);
      refresh();
    } catch (e: any) {
      toast.error(e?.message ?? "Bulk translation failed");
    } finally {
      setBusyAll(false);
    }
  };

  const togglePublish = async (t: any) => {
    try {
      await statusFn({
        data: {
          festival_id: festivalId,
          language: t.language,
          status: t.status === "published" ? "draft" : "published",
        },
      });
      toast.success(t.status === "published" ? "Unpublished" : "Published");
      refresh();
    } catch (e: any) {
      toast.error(e?.message ?? "Failed");
    }
  };

  const remove = async (lang: string) => {
    if (!confirm(`Delete ${LANG_LABEL[lang]} translation?`)) return;
    try {
      await delFn({ data: { festival_id: festivalId, language: lang } });
      toast.success("Deleted");
      refresh();
    } catch (e: any) {
      toast.error(e?.message ?? "Failed");
    }
  };

  const startEdit = (lang: string) => {
    const t = byLang[lang];
    setEditing(lang);
    setEditText(JSON.stringify(t?.content ?? {}, null, 2));
  };

  const saveEdit = async () => {
    if (!editing) return;
    try {
      const parsed = JSON.parse(editText);
      const cur = byLang[editing];
      await saveFn({
        data: {
          festival_id: festivalId,
          language: editing,
          content: parsed,
          status: cur?.status ?? "draft",
        },
      });
      toast.success("Saved");
      setEditing(null);
      refresh();
    } catch (e: any) {
      toast.error(e?.message ?? "Invalid JSON");
    }
  };

  const missing = SUPPORTED_LANGUAGES.filter((l) => !byLang[l]);
  const done = SUPPORTED_LANGUAGES.filter((l) => byLang[l]);

  return (
    <div className="space-y-4">
      <Card className="p-4 flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="text-sm font-medium flex items-center gap-2">
            <Globe2 className="h-4 w-4 text-primary" /> Multilingual coverage
          </div>
          <div className="text-xs text-muted-foreground">
            {done.length} / {SUPPORTED_LANGUAGES.length} languages · {missing.length} missing
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch id="pub-after" checked={publishAfter} onCheckedChange={setPublishAfter} />
            <Label htmlFor="pub-after" className="text-xs cursor-pointer">
              Publish after translate
            </Label>
          </div>
          <Button size="sm" onClick={translateAll} disabled={busyAll || missing.length === 0}>
            <Sparkles className="mr-2 h-4 w-4" />
            {busyAll ? "Translating…" : `Translate ${missing.length || "all"} missing`}
          </Button>
        </div>
      </Card>

      <div className="grid gap-2 sm:grid-cols-2">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const t = byLang[lang];
          const isEditing = editing === lang;
          return (
            <Card key={lang} className="p-3 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-medium">{LANG_LABEL[lang]}</div>
                  {t ? (
                    <Badge
                      variant={t.status === "published" ? "default" : "secondary"}
                      className="text-[10px] mt-1"
                    >
                      {t.status}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] mt-1">
                      Missing
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => translateOne(lang)}
                    disabled={busyLang === lang}
                  >
                    <Languages className="h-3.5 w-3.5 mr-1" />
                    {busyLang === lang ? "…" : t ? "Retranslate" : "Translate"}
                  </Button>
                  {t && (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => startEdit(lang)}
                        title="Edit JSON"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => togglePublish(t)}
                        title="Toggle publish"
                      >
                        <Check
                          className={`h-3.5 w-3.5 ${t.status === "published" ? "text-primary" : "text-muted-foreground"}`}
                        />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => remove(lang)} title="Delete">
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
              {t && !isEditing && (
                <div className="text-xs text-muted-foreground line-clamp-2">
                  {typeof t.content?.short_description === "string"
                    ? t.content.short_description
                    : t.content?.name}
                </div>
              )}
              {isEditing && (
                <div className="space-y-2">
                  <Textarea
                    rows={10}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="font-mono text-xs"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={saveEdit}>
                      <Save className="h-3.5 w-3.5 mr-1" /> Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditing(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
      <Separator />
      <p className="text-xs text-muted-foreground">
        Translations are stored in <code>festival_translations</code>. Public festival pages
        auto-load a language via <code>?lang=hi</code> and merge over the English base.
      </p>
    </div>
  );
}
