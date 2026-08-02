import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { DashboardShell } from "@/components/user/DashboardShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Plus, Trash2, Minus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/saved-mantras")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Saved Mantras — SanatanTools" }, { name: "robots", content: "noindex" }],
  }),
  component: SavedMantrasPage,
});

function SavedMantrasPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({
    title: "",
    text: "",
    transliteration: "",
    meaning: "",
    target_count: 108,
  });

  const { data } = useQuery({
    queryKey: ["saved_mantras", user?.id],
    enabled: !!user,
    queryFn: async () =>
      (
        await supabase
          .from("saved_mantras")
          .select("*")
          .eq("user_id", user!.id)
          .order("created_at", { ascending: false })
      ).data ?? [],
  });

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("saved_mantras").insert({ user_id: user!.id, ...f });
      if (error) throw error;
    },
    onSuccess: () => {
      setOpen(false);
      setF({ title: "", text: "", transliteration: "", meaning: "", target_count: 108 });
      qc.invalidateQueries({ queryKey: ["saved_mantras"] });
      toast.success("Mantra saved");
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const update = useMutation({
    mutationFn: async ({ id, current_count }: { id: string; current_count: number }) => {
      const { error } = await supabase.from("saved_mantras").update({ current_count }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["saved_mantras"] }),
  });
  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("saved_mantras").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["saved_mantras"] }),
  });

  return (
    <DashboardShell title="Saved Mantras" description="Your personal mantras with jaap targets.">
      <div className="flex justify-end mb-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="size-4" /> Add mantra
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New mantra</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Title</Label>
                <Input
                  value={f.title}
                  onChange={(e) => setF({ ...f, title: e.target.value })}
                  placeholder="Gayatri Mantra"
                />
              </div>
              <div>
                <Label>Text (Devanagari)</Label>
                <Textarea
                  value={f.text}
                  onChange={(e) => setF({ ...f, text: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label>Transliteration</Label>
                <Input
                  value={f.transliteration}
                  onChange={(e) => setF({ ...f, transliteration: e.target.value })}
                />
              </div>
              <div>
                <Label>Meaning</Label>
                <Textarea
                  value={f.meaning}
                  onChange={(e) => setF({ ...f, meaning: e.target.value })}
                  rows={2}
                />
              </div>
              <div>
                <Label>Target count</Label>
                <Input
                  type="number"
                  value={f.target_count}
                  onChange={(e) => setF({ ...f, target_count: parseInt(e.target.value || "108") })}
                />
              </div>
              <Button
                onClick={() => create.mutate()}
                disabled={!f.title || create.isPending}
                className="w-full"
              >
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {data && data.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {data.map((m) => {
            const target = m.target_count ?? 108;
            const pct = Math.min(100, ((m.current_count ?? 0) / target) * 100);
            return (
              <Card key={m.id} className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-semibold truncate">{m.title}</h3>
                    {m.transliteration && (
                      <p className="text-xs text-muted-foreground truncate">{m.transliteration}</p>
                    )}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => del.mutate(m.id)}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>
                {m.text && (
                  <p className="mt-3 font-sanskrit text-lg leading-relaxed whitespace-pre-wrap">
                    {m.text}
                  </p>
                )}
                {m.meaning && <p className="mt-2 text-sm text-muted-foreground">{m.meaning}</p>}
                <div className="mt-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-display font-semibold">
                      {m.current_count}
                      <span className="text-sm text-muted-foreground"> / {target}</span>
                    </span>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          update.mutate({
                            id: m.id,
                            current_count: Math.max(0, (m.current_count ?? 0) - 1),
                          })
                        }
                      >
                        <Minus className="size-4" />
                      </Button>
                      <Button
                        size="icon"
                        onClick={() =>
                          update.mutate({ id: m.id, current_count: (m.current_count ?? 0) + 1 })
                        }
                      >
                        <Plus className="size-4" />
                      </Button>
                    </div>
                  </div>
                  <Progress value={pct} className="mt-2" />
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border bg-secondary/40 p-10 text-center">
          <p className="text-sm text-muted-foreground">No saved mantras yet.</p>
        </div>
      )}
    </DashboardShell>
  );
}
