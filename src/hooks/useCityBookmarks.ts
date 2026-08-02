import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { LatLon } from "@/lib/panchang";

const LOCAL_KEY = "st.city.bookmarks.v1";

export interface CityBookmark {
  id?: string;
  label: string;
  lat: number;
  lon: number;
  tz: string;
}

function readLocal(): CityBookmark[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
  } catch {
    return [];
  }
}
function writeLocal(list: CityBookmark[]) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

export function useCityBookmarks() {
  const { user } = useAuth();
  const [items, setItems] = useState<CityBookmark[]>([]);

  const refresh = useCallback(async () => {
    if (!user) {
      setItems(readLocal());
      return;
    }
    const { data } = await supabase
      .from("favorites")
      .select("id, item_id, title, metadata")
      .eq("user_id", user.id)
      .eq("item_type", "city")
      .order("created_at", { ascending: false });
    const list: CityBookmark[] = (data ?? []).map((r: any) => ({
      id: r.id,
      label: r.title || r.item_id,
      lat: r.metadata?.lat ?? 0,
      lon: r.metadata?.lon ?? 0,
      tz: r.metadata?.tz ?? "UTC",
    }));
    setItems(list);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isBookmarked = useCallback(
    (loc: LatLon) => items.some((i) => i.label === loc.label),
    [items],
  );

  const add = useCallback(
    async (loc: LatLon) => {
      if (!user) {
        const next = [
          { label: loc.label, lat: loc.lat, lon: loc.lon, tz: loc.tz },
          ...readLocal().filter((x) => x.label !== loc.label),
        ];
        writeLocal(next);
        setItems(next);
        return;
      }
      const item_id = `${loc.lat.toFixed(4)},${loc.lon.toFixed(4)}`;
      await supabase.from("favorites").insert({
        user_id: user.id,
        item_type: "city",
        item_id,
        title: loc.label,
        metadata: { lat: loc.lat, lon: loc.lon, tz: loc.tz },
      });
      refresh();
    },
    [user, refresh],
  );

  const remove = useCallback(
    async (label: string) => {
      if (!user) {
        const next = readLocal().filter((x) => x.label !== label);
        writeLocal(next);
        setItems(next);
        return;
      }
      await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("item_type", "city")
        .eq("title", label);
      refresh();
    },
    [user, refresh],
  );

  const toggle = useCallback(
    async (loc: LatLon) => {
      if (isBookmarked(loc)) await remove(loc.label);
      else await add(loc);
    },
    [isBookmarked, add, remove],
  );

  return { items, isBookmarked, toggle, add, remove, refresh };
}
