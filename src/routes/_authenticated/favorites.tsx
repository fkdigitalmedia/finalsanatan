import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { DashboardShell } from "@/components/user/DashboardShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Heart } from "lucide-react";
import { SanatanLoaderInline } from "@/components/ui-kit/SanatanLoader";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/favorites")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Favorites — SanatanTools" }, { name: "robots", content: "noindex" }],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["favorites", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });
  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("favorites").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["favorites"] });
      toast.success("Removed");
    },
  });

  return (
    <DashboardShell
      title="Favorites"
      description="Festivals, mantras, shloks and temples you love."
    >
      {isLoading ? (
        <SanatanLoaderInline label="Aapke favorites load ho rahe hain…" />
      ) : data && data.length ? (
        <div className="grid sm:grid-cols-2 gap-3">
          {data.map((f) => (
            <Card key={f.id} className="p-4 flex items-center gap-3">
              <div className="size-9 rounded-lg bg-primary-soft grid place-items-center text-accent shrink-0">
                <Heart className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">{f.title ?? f.item_id}</p>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  {f.item_type}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => del.mutate(f.id)}
                aria-label="Remove"
              >
                <Trash2 className="size-4" />
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border bg-secondary/40 p-10 text-center">
          <p className="text-sm text-muted-foreground">No favorites yet.</p>
          <Link to="/festivals">
            <Button variant="outline" className="mt-4">
              Explore festivals
            </Button>
          </Link>
        </div>
      )}
    </DashboardShell>
  );
}
