import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export function useIsBookmarked(toolSlug: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["bookmark", toolSlug, user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("bookmarks")
        .select("id")
        .eq("user_id", user!.id)
        .eq("tool_slug", toolSlug)
        .maybeSingle();
      return !!data;
    },
  });
}

export function useToggleBookmark() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ slug, title, on }: { slug: string; title: string; on: boolean }) => {
      if (!user) throw new Error("Sign in to bookmark tools.");
      if (on) {
        const { error } = await supabase
          .from("bookmarks")
          .insert({ user_id: user.id, tool_slug: slug, tool_title: title });
        if (error && error.code !== "23505") throw error;
      } else {
        const { error } = await supabase
          .from("bookmarks")
          .delete()
          .eq("user_id", user.id)
          .eq("tool_slug", slug);
        if (error) throw error;
      }
    },
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ["bookmark", v.slug] });
      qc.invalidateQueries({ queryKey: ["bookmarks"] });
      toast.success(v.on ? "Bookmarked" : "Removed bookmark");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useIsFavorite(itemType: string, itemId: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["favorite", itemType, itemId, user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user!.id)
        .eq("item_type", itemType)
        .eq("item_id", itemId)
        .maybeSingle();
      return !!data;
    },
  });
}

export function useToggleFavorite() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (v: {
      itemType: string;
      itemId: string;
      title: string;
      on: boolean;
      metadata?: Record<string, string | number | boolean | null>;
    }) => {
      if (!user) throw new Error("Sign in to save favorites.");
      if (v.on) {
        const { error } = await supabase.from("favorites").insert({
          user_id: user.id,
          item_type: v.itemType,
          item_id: v.itemId,
          title: v.title,
          metadata: (v.metadata ?? {}) as never,
        });
        if (error && error.code !== "23505") throw error;
      } else {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("item_type", v.itemType)
          .eq("item_id", v.itemId);
        if (error) throw error;
      }
    },
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ["favorite", v.itemType, v.itemId] });
      qc.invalidateQueries({ queryKey: ["favorites"] });
      toast.success(v.on ? "Added to favorites" : "Removed from favorites");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
