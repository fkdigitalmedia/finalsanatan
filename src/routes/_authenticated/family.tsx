import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Star, StarOff } from "lucide-react";
import { DashboardShell } from "@/components/user/DashboardShell";
import { EmptyState, Pager, SkeletonGrid } from "@/components/user/WorkspaceUI";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PhotonPlacePicker } from "@/components/tools/PhotonPlacePicker";
import { useAuth } from "@/hooks/useAuth";
import { useFamily, useWorkspaceMutation } from "@/lib/workspace/hooks";
import * as api from "@/lib/workspace/api";
import { RELATIONSHIPS, type FamilyMember } from "@/lib/workspace/types";
import type { LatLon } from "@/lib/panchang";

export const Route = createFileRoute("/_authenticated/family")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Family — SanatanTools" }, { name: "robots", content: "noindex" }],
  }),
  component: FamilyPage,
});

const emptyForm = () => ({
  name: "",
  relationship: "father",
  gender: "male",
  photo_url: "",
  birth_date: "",
  birth_time: "12:00",
  notes: "",
  loc: { lat: 28.6139, lon: 77.209, label: "New Delhi, India", tz: "Asia/Kolkata" } as LatLon,
});

function FamilyPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState<ReturnType<typeof emptyForm> | null>(null);
  const [editId, setEditId] = useState<string | undefined>();

  const query = useMemo(() => ({ search, page }), [search, page]);
  const { data, isLoading } = useFamily(query);

  const save = useWorkspaceMutation((v: ReturnType<typeof emptyForm>) =>
    api.saveFamilyMember({
      ...(editId ? { id: editId } : {}),
      user_id: user!.id,
      name: v.name.trim(),
      relationship: v.relationship,
      gender: v.gender,
      photo_url: v.photo_url || null,
      birth_date: v.birth_date || null,
      birth_time: v.birth_time || null,
      place_name: v.loc.label,
      latitude: v.loc.lat,
      longitude: v.loc.lon,
      timezone: v.loc.tz,
      notes: v.notes || null,
    }),
  );
  const mutate = useWorkspaceMutation(async (fn: () => Promise<unknown>) => fn());

  const edit = (m: FamilyMember) => {
    setEditId(m.id);
    setForm({
      name: m.name,
      relationship: m.relationship,
      gender: m.gender,
      photo_url: m.photo_url ?? "",
      birth_date: m.birth_date ?? "",
      birth_time: String(m.birth_time ?? "12:00").slice(0, 5),
      notes: m.notes ?? "",
      loc: {
        lat: m.latitude ?? 28.6139,
        lon: m.longitude ?? 77.209,
        label: m.place_name ?? "",
        tz: m.timezone,
      },
    });
  };

  return (
    <DashboardShell
      title="Family"
      description="Unlimited profiles for family and friends — birth details, notes, reports and horoscope history."
      actions={
        <Button
          onClick={() => {
            setEditId(undefined);
            setForm(emptyForm());
          }}
        >
          <Plus className="size-4" /> Add profile
        </Button>
      }
    >
      {form && (
        <Card className="mb-6 p-6">
          <form
            className="grid md:grid-cols-2 gap-4"
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                await save.mutateAsync(form);
                toast.success(editId ? "Profile updated" : "Profile added");
                setForm(null);
                setEditId(undefined);
              } catch (err) {
                toast.error((err as Error).message);
              }
            }}
          >
            <div>
              <Label htmlFor="f-name">Name</Label>
              <Input
                id="f-name"
                value={form.name}
                required
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="f-rel">Relationship</Label>
              <select
                id="f-rel"
                value={form.relationship}
                onChange={(e) => setForm({ ...form, relationship: e.target.value })}
                className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm capitalize"
              >
                {RELATIONSHIPS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="f-dob">Date of birth</Label>
              <Input
                id="f-dob"
                type="date"
                value={form.birth_date}
                onChange={(e) => setForm({ ...form, birth_date: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="f-tob">Time of birth</Label>
              <Input
                id="f-tob"
                type="time"
                value={form.birth_time}
                onChange={(e) => setForm({ ...form, birth_time: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div className="md:col-span-2">
              <PhotonPlacePicker
                value={form.loc}
                onChange={(loc) => setForm({ ...form, loc })}
                id="family-place"
              />
            </div>
            <div>
              <Label htmlFor="f-photo">Photo URL</Label>
              <Input
                id="f-photo"
                value={form.photo_url}
                onChange={(e) => setForm({ ...form, photo_url: e.target.value })}
                placeholder="https://…"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="f-gender">Gender</Label>
              <select
                id="f-gender"
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="f-notes">Notes</Label>
              <Textarea
                id="f-notes"
                rows={2}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <Button type="submit" disabled={save.isPending}>
                {save.isPending ? "Saving…" : "Save profile"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setForm(null);
                  setEditId(undefined);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        placeholder="Filter by name or relationship"
        className="mb-4 max-w-xs"
        aria-label="Filter family"
      />

      {isLoading ? (
        <SkeletonGrid />
      ) : !data?.rows.length ? (
        <EmptyState
          title="No family profiles yet"
          hint="Add parents, spouse, children or friends to keep their charts and reports together."
        />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {data.rows.map((m) => (
            <Card key={m.id} className="p-5 flex gap-4">
              {m.photo_url ? (
                <img
                  src={m.photo_url}
                  alt={`${m.name} profile photo`}
                  loading="lazy"
                  className="size-14 rounded-full object-cover"
                />
              ) : (
                <div className="size-14 shrink-0 rounded-full bg-gradient-brand grid place-items-center text-primary-foreground font-display text-lg">
                  {m.name[0]?.toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{m.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{m.relationship}</p>
                  </div>
                  <button
                    aria-label="Toggle favourite"
                    className="text-accent"
                    onClick={() =>
                      mutate.mutate(() =>
                        api.saveFamilyMember({
                          id: m.id,
                          user_id: m.user_id,
                          name: m.name,
                          relationship: m.relationship,
                          is_favorite: !m.is_favorite,
                        }),
                      )
                    }
                  >
                    {m.is_favorite ? (
                      <Star className="size-4 fill-current" />
                    ) : (
                      <StarOff className="size-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {m.birth_date
                    ? `${m.birth_date} · ${String(m.birth_time ?? "").slice(0, 5)}`
                    : "Birth details pending"}
                </p>
                {m.notes && (
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{m.notes}</p>
                )}
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => edit(m)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    aria-label={`Delete ${m.name}`}
                    onClick={async () => {
                      await mutate.mutateAsync(() => api.deleteFamilyMember(m.id));
                      toast.success("Profile removed");
                    }}
                  >
                    <Trash2 className="size-3.5 text-destructive" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Pager
        page={page}
        pageSize={data?.pageSize ?? 12}
        total={data?.total ?? 0}
        onPage={setPage}
      />
    </DashboardShell>
  );
}
