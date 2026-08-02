/**
 * Public reads for the temples directory.
 * Uses Supabase publishable key with the "Public reads published temples" RLS policy.
 */
import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export type PublicTemple = {
  id: string;
  slug: string;
  name: string;
  state: string | null;
  city: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  history: string | null;
  photos: string[] | null;
};

export const listPublicTemples = createServerFn({ method: "GET" }).handler(
  async (): Promise<PublicTemple[]> => {
    const sb = publicClient();
    const { data, error } = await sb
      .from("admin_temples")
      .select("id, slug, name, state, city, address, lat, lng, history, photos")
      .eq("published", true)
      .order("name", { ascending: true })
      .limit(1000);
    if (error) throw new Error(error.message);
    return (data ?? []) as PublicTemple[];
  },
);
