/**
 * Festival Management System — admin UI.
 * List + tabbed editor (Basic / Dates / Puja / Vrat / Media / SEO / FAQ /
 * Related / Translations / Revisions). Uses server functions in
 * `src/lib/festivals.functions.ts` for all reads/writes.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Archive,
  CalendarClock,
  Copy,
  Eye,
  MoreHorizontal,
  Pencil,
  Plus,
  Send,
  Trash2,
  Undo2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  listFestivals,
  getFestival,
  upsertFestival,
  duplicateFestival,
  setFestivalStatus,
  deleteFestival,
  upsertFestivalTranslation,
  previewFestivalDates,
  computeFestivalDates,
  computeAllFestivalDates,
  getFestivalOccurrences,
} from "@/lib/festivals.functions";
import { FestivalAIStudio } from "@/components/admin/festivals/FestivalAIStudio";
import { FestivalTranslationsPanel } from "@/components/admin/festivals/FestivalTranslationsPanel";

const STATUSES = ["draft", "scheduled", "published", "archived"] as const;
const DATE_TYPES = ["fixed", "lunar", "solar", "dynamic"] as const;
const LANGUAGES = ["hi", "mr", "gu", "ta", "te", "kn", "bn", "ml", "pa", "or", "as"] as const;
const CATEGORIES = [
  "Major",
  "Regional",
  "Vrat",
  "Ekadashi",
  "Purnima",
  "Amavasya",
  "Sankranti",
  "Jayanti",
  "International",
  "Other",
];

const emptyRow = () => ({
  slug: "",
  name: "",
  short_description: "",
  detailed_description: "",
  history: "",
  significance: "",
  why_celebrated: "",
  mythological_story: "",
  alt_names: [] as string[],
  deities: [] as string[],
  tags: [] as string[],
  category: "Major",
  sub_category: "",
  is_featured: false,
  is_trending: false,
  is_popular: false,
  date_type: "fixed",
  fixed_month: null,
  fixed_day: null,
  lunar_rule: null,
  solar_rule: null,
  is_multi_day: false,
  duration_days: 1,
  timezone: "Asia/Kolkata",
  regional_variations: [],
  year_overrides: {},
  region_rules: [],
  puja_vidhi: "",
  preparation: "",
  samagri: [],
  mantras: [],
  aarti: "",
  bhajans: [],
  chalisa: "",
  stotra: "",
  prasad: "",
  dress_colors: {},
  vrat_rules: {},
  featured_image: "",
  gallery: [],
  videos: [],
  audio: [],
  pdfs: [],
  downloadables: [],
  seo: { title: "", description: "", canonical: "", keywords: [], og: {}, twitter: {} },
  faqs: [],
  related_articles: [],
  related_festivals: [],
  related_tools: [],
  status: "draft",
  publish_at: null,
  unpublish_at: null,
  affiliate_products: [],
  donation_cta: null,
});

export function FestivalManager() {
  const qc = useQueryClient();
  const list = useServerFn(listFestivals);
  const [filters, setFilters] = useState<{ search: string; status: string; category: string }>({
    search: "",
    status: "",
    category: "",
  });
  const [editing, setEditing] = useState<any | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["festivals", filters],
    queryFn: () => list({ data: filters }),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-semibold">Festivals</h1>
          <p className="text-sm text-muted-foreground">
            Central library of Hindu festivals, vrats and observances. Every entry becomes its own
            SEO landing page.
          </p>
        </div>
        <div className="flex gap-2">
          <RecomputeAllButton />
          <Button onClick={() => setEditing({ mode: "create", row: emptyRow() })}>
            <Plus className="mr-2 h-4 w-4" /> Add festival
          </Button>
        </div>
      </div>

      <Card className="p-3 flex gap-2 flex-wrap items-center">
        <Input
          placeholder="Search by name…"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="max-w-xs"
        />
        <Select
          value={filters.status || "all"}
          onValueChange={(v) => setFilters({ ...filters, status: v === "all" ? "" : v })}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.category || "all"}
          onValueChange={(v) => setFilters({ ...filters, category: v === "all" ? "" : v })}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="ml-auto text-xs text-muted-foreground">
          {data?.rows.length ?? 0} results
        </div>
      </Card>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Slug</th>
              <th className="px-3 py-2 text-left">Category</th>
              <th className="px-3 py-2 text-left">Date type</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Flags</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td className="px-3 py-6 text-muted-foreground" colSpan={7}>
                  Loading…
                </td>
              </tr>
            )}
            {!isLoading && (data?.rows.length ?? 0) === 0 && (
              <tr>
                <td className="px-3 py-6 text-muted-foreground" colSpan={7}>
                  No festivals yet.
                </td>
              </tr>
            )}
            {data?.rows.map((r: any) => (
              <tr key={r.id} className="border-t">
                <td className="px-3 py-2 font-medium">{r.name}</td>
                <td className="px-3 py-2 text-muted-foreground font-mono text-xs">{r.slug}</td>
                <td className="px-3 py-2">{r.category ?? "—"}</td>
                <td className="px-3 py-2 text-xs">{r.date_type}</td>
                <td className="px-3 py-2">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-3 py-2 space-x-1">
                  {r.is_featured && (
                    <Badge variant="secondary" className="text-[10px]">
                      Featured
                    </Badge>
                  )}
                  {r.is_trending && (
                    <Badge variant="secondary" className="text-[10px]">
                      Trending
                    </Badge>
                  )}
                  {r.is_popular && (
                    <Badge variant="secondary" className="text-[10px]">
                      Popular
                    </Badge>
                  )}
                </td>
                <td className="px-3 py-2 text-right">
                  <RowActions
                    row={r}
                    onEdit={() => setEditing({ mode: "edit", id: r.id })}
                    onChanged={() => qc.invalidateQueries({ queryKey: ["festivals"] })}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <FestivalEditor
          mode={editing.mode}
          initialId={editing.id}
          initialRow={editing.row}
          onClose={() => setEditing(null)}
          onSaved={() => {
            qc.invalidateQueries({ queryKey: ["festivals"] });
          }}
        />
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    published: "bg-green-500/15 text-green-600 dark:text-green-400",
    draft: "bg-muted text-muted-foreground",
    scheduled: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
    archived: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
  };
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${map[status] ?? "bg-muted"}`}
    >
      {status}
    </span>
  );
}

function RowActions({
  row,
  onEdit,
  onChanged,
}: {
  row: any;
  onEdit: () => void;
  onChanged: () => void;
}) {
  const dupFn = useServerFn(duplicateFestival);
  const statusFn = useServerFn(setFestivalStatus);
  const delFn = useServerFn(deleteFestival);

  const run = async (fn: () => Promise<any>, msg: string) => {
    try {
      await fn();
      toast.success(msg);
      onChanged();
    } catch (e: any) {
      toast.error(e.message ?? "Failed");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem onClick={onEdit}>
          <Pencil className="mr-2 h-4 w-4" /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.open(`/festivals/${row.slug}?preview=1`, "_blank")}>
          <Eye className="mr-2 h-4 w-4" /> Preview
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => run(() => dupFn({ data: { id: row.id } }), "Duplicated")}>
          <Copy className="mr-2 h-4 w-4" /> Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {row.status !== "published" && (
          <DropdownMenuItem
            onClick={() =>
              run(() => statusFn({ data: { id: row.id, status: "published" } }), "Published")
            }
          >
            <Send className="mr-2 h-4 w-4" /> Publish
          </DropdownMenuItem>
        )}
        {row.status === "published" && (
          <DropdownMenuItem
            onClick={() =>
              run(() => statusFn({ data: { id: row.id, status: "draft" } }), "Unpublished")
            }
          >
            <Undo2 className="mr-2 h-4 w-4" /> Unpublish
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={() => {
            const at = prompt("Publish at ISO datetime (e.g. 2026-11-01T09:00:00Z)");
            if (at)
              run(
                () => statusFn({ data: { id: row.id, status: "scheduled", publish_at: at } }),
                "Scheduled",
              );
          }}
        >
          <CalendarClock className="mr-2 h-4 w-4" /> Schedule
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            run(() => statusFn({ data: { id: row.id, status: "archived" } }), "Archived")
          }
        >
          <Archive className="mr-2 h-4 w-4" /> Archive
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete festival?</AlertDialogTitle>
              <AlertDialogDescription>
                This deletes {row.name} and all its translations, revisions and cached dates. Cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => run(() => delFn({ data: { id: row.id } }), "Deleted")}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ============================ EDITOR ============================

function FestivalEditor({
  mode,
  initialId,
  initialRow,
  onClose,
  onSaved,
}: {
  mode: "create" | "edit";
  initialId?: string;
  initialRow?: any;
  onClose: () => void;
  onSaved: () => void;
}) {
  const getFn = useServerFn(getFestival);
  const saveFn = useServerFn(upsertFestival);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["festival", initialId],
    queryFn: () =>
      initialId
        ? getFn({ data: { id: initialId } })
        : Promise.resolve({ row: initialRow, translations: [], revisions: [] }),
    enabled: mode === "edit",
  });

  const initial = mode === "edit" ? data?.row : initialRow;
  const [form, setForm] = useState<any>(initial ?? emptyRow());
  const [note, setNote] = useState("");

  useMemo(() => {
    if (initial) setForm(initial);
  }, [initial]);

  const save = useMutation({
    mutationFn: () => saveFn({ data: { values: form, note: note || null } }),
    onSuccess: () => {
      toast.success("Saved");
      onSaved();
      onClose();
    },
    onError: (e: any) => toast.error(e.message ?? "Save failed"),
  });

  const set = (patch: Partial<any>) => setForm({ ...form, ...patch });
  const setSeo = (patch: Partial<any>) => set({ seo: { ...(form.seo ?? {}), ...patch } });

  return (
    <Sheet open onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-3xl overflow-y-auto p-0">
        <SheetHeader className="p-4 border-b sticky top-0 bg-background z-10">
          <SheetTitle className="flex items-center justify-between gap-4">
            <span>{mode === "create" ? "Add festival" : `Edit — ${form.name || "…"}`}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => save.mutate()}
                disabled={save.isPending || !form.name || !form.slug}
              >
                {save.isPending ? "Saving…" : "Save"}
              </Button>
            </div>
          </SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="p-6 text-muted-foreground">Loading…</div>
        ) : (
          <Tabs defaultValue="basic" className="p-4">
            <TabsList className="flex flex-wrap h-auto">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="dates">Dates</TabsTrigger>
              <TabsTrigger value="puja">Puja</TabsTrigger>
              <TabsTrigger value="vrat">Vrat</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="related">Related</TabsTrigger>
              <TabsTrigger value="i18n">Translations</TabsTrigger>
              <TabsTrigger value="ai">AI Studio</TabsTrigger>
              <TabsTrigger value="revisions">Revisions</TabsTrigger>
            </TabsList>

            {/* -------- BASIC -------- */}
            <TabsContent value="basic" className="space-y-4 mt-4">
              <Row2>
                <Field label="Name" required>
                  <Input value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
                </Field>
                <Field label="Slug" required>
                  <Input
                    value={form.slug ?? ""}
                    onChange={(e) => set({ slug: e.target.value.trim() })}
                  />
                </Field>
              </Row2>
              <Field label="Alternative names (comma-separated)">
                <Input
                  value={(form.alt_names ?? []).join(", ")}
                  onChange={(e) => set({ alt_names: splitList(e.target.value) })}
                />
              </Field>
              <Field label="Short description">
                <Textarea
                  rows={2}
                  value={form.short_description ?? ""}
                  onChange={(e) => set({ short_description: e.target.value })}
                />
              </Field>
              <Field label="Detailed description">
                <Textarea
                  rows={5}
                  value={form.detailed_description ?? ""}
                  onChange={(e) => set({ detailed_description: e.target.value })}
                />
              </Field>
              <Field label="History">
                <Textarea
                  rows={4}
                  value={form.history ?? ""}
                  onChange={(e) => set({ history: e.target.value })}
                />
              </Field>
              <Field label="Significance">
                <Textarea
                  rows={3}
                  value={form.significance ?? ""}
                  onChange={(e) => set({ significance: e.target.value })}
                />
              </Field>
              <Field label="Why it is celebrated">
                <Textarea
                  rows={3}
                  value={form.why_celebrated ?? ""}
                  onChange={(e) => set({ why_celebrated: e.target.value })}
                />
              </Field>
              <Field label="Mythological story">
                <Textarea
                  rows={4}
                  value={form.mythological_story ?? ""}
                  onChange={(e) => set({ mythological_story: e.target.value })}
                />
              </Field>
              <Row2>
                <Field label="Category">
                  <Select
                    value={form.category ?? "Major"}
                    onValueChange={(v) => set({ category: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Sub category">
                  <Input
                    value={form.sub_category ?? ""}
                    onChange={(e) => set({ sub_category: e.target.value })}
                  />
                </Field>
              </Row2>
              <Row2>
                <Field label="Associated deities (comma-separated)">
                  <Input
                    value={(form.deities ?? []).join(", ")}
                    onChange={(e) => set({ deities: splitList(e.target.value) })}
                  />
                </Field>
                <Field label="Tags (comma-separated)">
                  <Input
                    value={(form.tags ?? []).join(", ")}
                    onChange={(e) => set({ tags: splitList(e.target.value) })}
                  />
                </Field>
              </Row2>
              <div className="flex flex-wrap gap-6">
                <Toggle
                  label="Featured"
                  value={!!form.is_featured}
                  onChange={(v) => set({ is_featured: v })}
                />
                <Toggle
                  label="Trending"
                  value={!!form.is_trending}
                  onChange={(v) => set({ is_trending: v })}
                />
                <Toggle
                  label="Popular"
                  value={!!form.is_popular}
                  onChange={(v) => set({ is_popular: v })}
                />
              </div>
              <Separator />
              <Row2>
                <Field label="Status">
                  <Select value={form.status ?? "draft"} onValueChange={(v) => set({ status: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Publish at (ISO, optional)">
                  <Input
                    placeholder="2026-11-01T09:00:00Z"
                    value={form.publish_at ?? ""}
                    onChange={(e) => set({ publish_at: e.target.value || null })}
                  />
                </Field>
              </Row2>
              <Field label="Change note (for revision history)">
                <Input
                  placeholder="What changed?"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </Field>
            </TabsContent>

            {/* -------- DATES -------- */}
            <TabsContent value="dates" className="space-y-4 mt-4">
              <Row2>
                <Field label="Date type">
                  <Select
                    value={form.date_type ?? "fixed"}
                    onValueChange={(v) => set({ date_type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DATE_TYPES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Timezone">
                  <Input
                    value={form.timezone ?? "Asia/Kolkata"}
                    onChange={(e) => set({ timezone: e.target.value })}
                  />
                </Field>
              </Row2>

              {form.date_type === "fixed" && (
                <Row2>
                  <Field label="Month (1–12)">
                    <Input
                      type="number"
                      min={1}
                      max={12}
                      value={form.fixed_month ?? ""}
                      onChange={(e) =>
                        set({ fixed_month: e.target.value ? Number(e.target.value) : null })
                      }
                    />
                  </Field>
                  <Field label="Day (1–31)">
                    <Input
                      type="number"
                      min={1}
                      max={31}
                      value={form.fixed_day ?? ""}
                      onChange={(e) =>
                        set({ fixed_day: e.target.value ? Number(e.target.value) : null })
                      }
                    />
                  </Field>
                </Row2>
              )}

              {form.date_type === "lunar" && (
                <JsonField
                  label="Lunar rule (tithi, paksha, lunar_month)"
                  value={form.lunar_rule}
                  onChange={(v) => set({ lunar_rule: v })}
                  placeholder='{"tithi": 15, "paksha": "shukla", "lunar_month": "Kartika"}'
                />
              )}
              {form.date_type === "solar" && (
                <JsonField
                  label="Solar rule (sankranti / nakshatra)"
                  value={form.solar_rule}
                  onChange={(v) => set({ solar_rule: v })}
                  placeholder='{"event": "sankranti", "sign": "Makara"}'
                />
              )}

              <Row2>
                <Toggle
                  label="Multi-day festival"
                  value={!!form.is_multi_day}
                  onChange={(v) => set({ is_multi_day: v })}
                />
                <Field label="Duration (days)">
                  <Input
                    type="number"
                    min={1}
                    max={60}
                    value={form.duration_days ?? 1}
                    onChange={(e) => set({ duration_days: Number(e.target.value) || 1 })}
                  />
                </Field>
              </Row2>

              <JsonField
                label="Year-specific overrides"
                value={form.year_overrides}
                onChange={(v) => set({ year_overrides: v })}
                placeholder='{"2026": {"date": "2026-11-01"}}'
              />
              <JsonField
                label="Regional variations"
                value={form.regional_variations}
                onChange={(v) => set({ regional_variations: v })}
                placeholder='[{"region": "North India", "notes": "..."}]'
              />
              <JsonField
                label="Location-based rules"
                value={form.region_rules}
                onChange={(v) => set({ region_rules: v })}
                placeholder='[{"state": "Maharashtra", "date_offset_days": 0}]'
              />
              <Separator />
              <DateEnginePanel form={form} festivalId={mode === "edit" ? form.id : undefined} />
            </TabsContent>

            {/* -------- PUJA -------- */}
            <TabsContent value="puja" className="space-y-4 mt-4">
              <Field label="Preparation">
                <Textarea
                  rows={3}
                  value={form.preparation ?? ""}
                  onChange={(e) => set({ preparation: e.target.value })}
                />
              </Field>
              <Field label="Puja Vidhi">
                <Textarea
                  rows={6}
                  value={form.puja_vidhi ?? ""}
                  onChange={(e) => set({ puja_vidhi: e.target.value })}
                />
              </Field>
              <JsonField
                label="Samagri (items list)"
                value={form.samagri}
                onChange={(v) => set({ samagri: v })}
                placeholder='[{"item": "Diya", "qty": 5}]'
              />
              <JsonField
                label="Mantras"
                value={form.mantras}
                onChange={(v) => set({ mantras: v })}
                placeholder='[{"name": "Gayatri", "sanskrit": "...", "translit": "..."}]'
              />
              <Field label="Aarti">
                <Textarea
                  rows={4}
                  value={form.aarti ?? ""}
                  onChange={(e) => set({ aarti: e.target.value })}
                />
              </Field>
              <JsonField
                label="Bhajans"
                value={form.bhajans}
                onChange={(v) => set({ bhajans: v })}
                placeholder='[{"title": "…", "audio_url": "…"}]'
              />
              <Row2>
                <Field label="Chalisa">
                  <Textarea
                    rows={4}
                    value={form.chalisa ?? ""}
                    onChange={(e) => set({ chalisa: e.target.value })}
                  />
                </Field>
                <Field label="Stotra">
                  <Textarea
                    rows={4}
                    value={form.stotra ?? ""}
                    onChange={(e) => set({ stotra: e.target.value })}
                  />
                </Field>
              </Row2>
              <Field label="Prasad">
                <Textarea
                  rows={2}
                  value={form.prasad ?? ""}
                  onChange={(e) => set({ prasad: e.target.value })}
                />
              </Field>
              <JsonField
                label="Dress & colour suggestions"
                value={form.dress_colors}
                onChange={(v) => set({ dress_colors: v })}
                placeholder='{"colors": ["Yellow","Red"], "dress": "Traditional"}'
              />
            </TabsContent>

            {/* -------- VRAT -------- */}
            <TabsContent value="vrat" className="space-y-4 mt-4">
              <JsonField
                label="Vrat rules (fasting)"
                value={form.vrat_rules}
                onChange={(v) => set({ vrat_rules: v })}
                placeholder='{"rules":"…","eligibility":"…","breaking_time":"…","food_allowed":[],"food_avoided":[],"exceptions":[]}'
                rows={12}
              />
            </TabsContent>

            {/* -------- MEDIA -------- */}
            <TabsContent value="media" className="space-y-4 mt-4">
              <Field label="Featured image URL">
                <Input
                  value={form.featured_image ?? ""}
                  onChange={(e) => set({ featured_image: e.target.value })}
                />
              </Field>
              <JsonField
                label="Gallery"
                value={form.gallery}
                onChange={(v) => set({ gallery: v })}
                placeholder='[{"url":"…","caption":"…"}]'
              />
              <JsonField
                label="Videos"
                value={form.videos}
                onChange={(v) => set({ videos: v })}
                placeholder='[{"title":"…","youtube_id":"…"}]'
              />
              <JsonField
                label="Audio"
                value={form.audio}
                onChange={(v) => set({ audio: v })}
                placeholder='[{"title":"…","url":"…"}]'
              />
              <JsonField
                label="PDFs"
                value={form.pdfs}
                onChange={(v) => set({ pdfs: v })}
                placeholder='[{"title":"…","url":"…"}]'
              />
              <JsonField
                label="Downloadables"
                value={form.downloadables}
                onChange={(v) => set({ downloadables: v })}
                placeholder='[{"title":"…","url":"…"}]'
              />
            </TabsContent>

            {/* -------- SEO -------- */}
            <TabsContent value="seo" className="space-y-4 mt-4">
              <Field label="SEO title">
                <Input
                  value={form.seo?.title ?? ""}
                  onChange={(e) => setSeo({ title: e.target.value })}
                />
              </Field>
              <Field label="Meta description">
                <Textarea
                  rows={2}
                  value={form.seo?.description ?? ""}
                  onChange={(e) => setSeo({ description: e.target.value })}
                />
              </Field>
              <Row2>
                <Field label="Canonical URL">
                  <Input
                    value={form.seo?.canonical ?? ""}
                    onChange={(e) => setSeo({ canonical: e.target.value })}
                  />
                </Field>
                <Field label="Keywords (comma-separated)">
                  <Input
                    value={(form.seo?.keywords ?? []).join(", ")}
                    onChange={(e) => setSeo({ keywords: splitList(e.target.value) })}
                  />
                </Field>
              </Row2>
              <JsonField
                label="Open Graph"
                value={form.seo?.og}
                onChange={(v) => setSeo({ og: v })}
                placeholder='{"title":"…","description":"…","image":"…"}'
              />
              <JsonField
                label="Twitter Card"
                value={form.seo?.twitter}
                onChange={(v) => setSeo({ twitter: v })}
                placeholder='{"card":"summary_large_image","title":"…"}'
              />
              <JsonField
                label="Custom JSON-LD schema"
                value={form.seo?.schema}
                onChange={(v) => setSeo({ schema: v })}
                placeholder='{"@type":"Event",…}'
              />
            </TabsContent>

            {/* -------- FAQ -------- */}
            <TabsContent value="faq" className="space-y-4 mt-4">
              <JsonField
                label="FAQs"
                value={form.faqs}
                onChange={(v) => set({ faqs: v })}
                rows={12}
                placeholder='[{"q":"When is …?","a":"…"}]'
              />
            </TabsContent>

            {/* -------- RELATED -------- */}
            <TabsContent value="related" className="space-y-4 mt-4">
              <Field label="Related festival IDs (comma-separated UUIDs)">
                <Input
                  value={(form.related_festivals ?? []).join(", ")}
                  onChange={(e) => set({ related_festivals: splitList(e.target.value) })}
                />
              </Field>
              <Field label="Related article IDs">
                <Input
                  value={(form.related_articles ?? []).join(", ")}
                  onChange={(e) => set({ related_articles: splitList(e.target.value) })}
                />
              </Field>
              <Field label="Related tools (comma-separated slugs)">
                <Input
                  value={(form.related_tools ?? []).join(", ")}
                  onChange={(e) => set({ related_tools: splitList(e.target.value) })}
                />
              </Field>
              <JsonField
                label="Affiliate products"
                value={form.affiliate_products}
                onChange={(v) => set({ affiliate_products: v })}
                placeholder='[{"title":"Puja Kit","url":"…","image":"…"}]'
              />
              <JsonField
                label="Donation CTA"
                value={form.donation_cta}
                onChange={(v) => set({ donation_cta: v })}
                placeholder='{"title":"Support the temple","url":"…"}'
              />
            </TabsContent>

            {/* -------- TRANSLATIONS -------- */}
            <TabsContent value="i18n" className="space-y-4 mt-4">
              {mode === "create" ? (
                <p className="text-sm text-muted-foreground">
                  Save the festival first to add translations.
                </p>
              ) : (
                <FestivalTranslationsPanel
                  festivalId={form.id}
                  initial={data?.translations ?? []}
                />
              )}
            </TabsContent>

            {/* -------- AI STUDIO -------- */}
            <TabsContent value="ai" className="space-y-4 mt-4">
              <FestivalAIStudio
                festivalId={mode === "create" ? undefined : form.id}
                onApplied={() => refetch?.()}
              />
            </TabsContent>

            {/* -------- REVISIONS -------- */}
            <TabsContent value="revisions" className="space-y-3 mt-4">
              {mode === "create" ? (
                <p className="text-sm text-muted-foreground">No revisions yet.</p>
              ) : (
                <div className="rounded-md border divide-y">
                  {(data?.revisions ?? []).length === 0 && (
                    <div className="p-4 text-sm text-muted-foreground">No revisions yet.</div>
                  )}
                  {(data?.revisions ?? []).map((r: any) => (
                    <div key={r.id} className="p-3 text-sm flex items-center justify-between gap-3">
                      <div>
                        <div className="font-medium">
                          v{r.version}{" "}
                          {r.change_note ? (
                            <span className="font-normal text-muted-foreground">
                              — {r.change_note}
                            </span>
                          ) : null}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(r.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </SheetContent>
    </Sheet>
  );
}

function TranslationsPanel({ festivalId, initial }: { festivalId: string; initial: any[] }) {
  const saveFn = useServerFn(upsertFestivalTranslation);
  const [lang, setLang] = useState<string>(LANGUAGES[0]);
  const existing = initial.find((t) => t.language === lang);
  const [content, setContent] = useState<string>(
    JSON.stringify(
      existing?.content ?? {
        name: "",
        short_description: "",
        detailed_description: "",
        history: "",
        seo: {},
        faqs: [],
      },
      null,
      2,
    ),
  );

  useMemo(() => {
    const e = initial.find((t) => t.language === lang);
    setContent(
      JSON.stringify(
        e?.content ?? {
          name: "",
          short_description: "",
          detailed_description: "",
          history: "",
          seo: {},
          faqs: [],
        },
        null,
        2,
      ),
    );
  }, [lang]);

  const save = async () => {
    try {
      const parsed = JSON.parse(content);
      await saveFn({
        data: { festival_id: festivalId, language: lang, content: parsed, status: "draft" },
      });
      toast.success(`${lang.toUpperCase()} translation saved`);
    } catch (e: any) {
      toast.error(e.message ?? "Invalid JSON");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Label>Language</Label>
        <Select value={lang} onValueChange={setLang}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((l) => (
              <SelectItem key={l} value={l}>
                {l.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button size="sm" onClick={save}>
          Save translation
        </Button>
      </div>
      <Textarea
        rows={16}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="font-mono text-xs"
      />
      <p className="text-xs text-muted-foreground">
        Existing translations: {initial.map((t) => t.language).join(", ") || "none"}
      </p>
    </div>
  );
}

// ============================ Small helpers ============================
function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      {children}
    </div>
  );
}
function Row2({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}
function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Switch checked={value} onCheckedChange={onChange} />
      <Label className="cursor-pointer">{label}</Label>
    </div>
  );
}
function JsonField({
  label,
  value,
  onChange,
  placeholder,
  rows = 6,
}: {
  label: string;
  value: unknown;
  onChange: (v: unknown) => void;
  placeholder?: string;
  rows?: number;
}) {
  const [text, setText] = useState<string>(value == null ? "" : JSON.stringify(value, null, 2));
  useMemo(
    () => setText(value == null ? "" : JSON.stringify(value, null, 2)),
    [JSON.stringify(value)],
  );
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Textarea
        rows={rows}
        value={text}
        placeholder={placeholder}
        className="font-mono text-xs"
        onChange={(e) => {
          setText(e.target.value);
          if (!e.target.value.trim()) {
            onChange(null);
            return;
          }
          try {
            onChange(JSON.parse(e.target.value));
          } catch {
            /* live-edit, ignore parse errors */
          }
        }}
      />
    </div>
  );
}
function splitList(v: string): string[] {
  return v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// ============================ DATE ENGINE UI ============================

function RecomputeAllButton() {
  const fn = useServerFn(computeAllFestivalDates);
  const [busy, setBusy] = useState(false);
  const run = async () => {
    setBusy(true);
    try {
      const r = await fn({ data: { startYear: new Date().getFullYear(), years: 10 } });
      toast.success(`Recomputed ${r.ok} festival${r.ok === 1 ? "" : "s"} · ${r.failed} failed`);
      if (r.failures?.length) console.warn("Festival compute failures:", r.failures);
    } catch (e: any) {
      toast.error(e.message ?? "Recompute failed");
    } finally {
      setBusy(false);
    }
  };
  return (
    <Button variant="outline" onClick={run} disabled={busy}>
      <CalendarClock className="mr-2 h-4 w-4" /> {busy ? "Computing…" : "Recompute all dates"}
    </Button>
  );
}

function DateEnginePanel({ form, festivalId }: { form: any; festivalId?: string }) {
  const previewFn = useServerFn(previewFestivalDates);
  const computeFn = useServerFn(computeFestivalDates);
  const occFn = useServerFn(getFestivalOccurrences);
  const [startYear, setStartYear] = useState<number>(new Date().getFullYear());
  const [years, setYears] = useState<number>(5);
  const [preview, setPreview] = useState<any[] | null>(null);
  const [busy, setBusy] = useState<"" | "preview" | "compute">("");

  const cached = useQuery({
    queryKey: ["festival-cache", festivalId],
    queryFn: () => occFn({ data: { id: festivalId! } }),
    enabled: !!festivalId,
  });

  const doPreview = async () => {
    setBusy("preview");
    try {
      const payload = festivalId
        ? { id: festivalId, startYear, years }
        : { row: form, startYear, years };
      const r = await previewFn({ data: payload });
      setPreview(r.results);
    } catch (e: any) {
      toast.error(e.message ?? "Preview failed");
    } finally {
      setBusy("");
    }
  };

  const doCompute = async () => {
    if (!festivalId) {
      toast.error("Save the festival first");
      return;
    }
    setBusy("compute");
    try {
      const r = await computeFn({
        data: { id: festivalId, startYear, years: Math.max(years, 10) },
      });
      toast.success(`Cached ${r.rows} year${r.rows === 1 ? "" : "s"} of dates`);
      cached.refetch();
    } catch (e: any) {
      toast.error(e.message ?? "Compute failed");
    } finally {
      setBusy("");
    }
  };

  return (
    <div className="space-y-3 rounded-lg border p-4 bg-muted/20">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <div className="font-medium text-sm">Date engine</div>
          <div className="text-xs text-muted-foreground">
            Panchang-driven resolver. Preview above uses live math; Compute persists to the public
            cache.
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-xs">From</Label>
          <Input
            type="number"
            value={startYear}
            onChange={(e) => setStartYear(Number(e.target.value) || new Date().getFullYear())}
            className="w-24 h-8"
          />
          <Label className="text-xs">for</Label>
          <Input
            type="number"
            min={1}
            max={20}
            value={years}
            onChange={(e) => setYears(Math.min(20, Math.max(1, Number(e.target.value) || 1)))}
            className="w-20 h-8"
          />
          <Label className="text-xs">years</Label>
          <Button size="sm" variant="outline" onClick={doPreview} disabled={busy !== ""}>
            {busy === "preview" ? "Previewing…" : "Preview"}
          </Button>
          <Button size="sm" onClick={doCompute} disabled={busy !== "" || !festivalId}>
            {busy === "compute" ? "Computing…" : "Compute & cache"}
          </Button>
        </div>
      </div>

      {preview && (
        <div className="rounded border bg-background">
          <div className="px-3 py-1.5 text-xs font-medium bg-muted/40">Live preview</div>
          <ul className="divide-y text-sm">
            {preview.map((r) => (
              <li key={r.year} className="px-3 py-2 flex items-start justify-between gap-3">
                <div className="font-mono text-xs w-14">{r.year}</div>
                <div className="flex-1">
                  {r.error ? (
                    <span className="text-destructive">Error: {r.error}</span>
                  ) : (
                    r.occurrences.map((o: any, i: number) => (
                      <div key={i}>
                        <span className="font-medium">{o.isoDate}</span>{" "}
                        <span className="text-muted-foreground">— {o.name}</span>
                        {o.notes?.length ? (
                          <span className="text-xs text-muted-foreground">
                            {" "}
                            · {o.notes.join("; ")}
                          </span>
                        ) : null}
                      </div>
                    ))
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {festivalId && (
        <div className="rounded border bg-background">
          <div className="px-3 py-1.5 text-xs font-medium bg-muted/40 flex items-center justify-between">
            <span>Cached upcoming dates ({cached.data?.rows.length ?? 0})</span>
            {cached.isFetching && (
              <span className="text-xs text-muted-foreground">Refreshing…</span>
            )}
          </div>
          <ul className="divide-y text-sm max-h-64 overflow-auto">
            {(cached.data?.rows ?? []).length === 0 && (
              <li className="px-3 py-2 text-muted-foreground text-xs">
                No cache yet — hit “Compute & cache”.
              </li>
            )}
            {(cached.data?.rows ?? []).map((r: any) => (
              <li key={r.year} className="px-3 py-2 flex items-start justify-between gap-3">
                <div className="font-mono text-xs w-14">{r.year}</div>
                <div className="flex-1">
                  {r.occurrences?.error ? (
                    <span className="text-destructive text-xs">Error: {r.occurrences.error}</span>
                  ) : (
                    (r.occurrences?.dates ?? []).map((o: any, i: number) => (
                      <div key={i}>
                        <span className="font-medium">{o.isoDate}</span>{" "}
                        <span className="text-muted-foreground">— {o.name}</span>
                      </div>
                    ))
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
