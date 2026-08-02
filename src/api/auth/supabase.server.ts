// Server-only Supabase client factory for API-layer auth.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function isOpaqueKey(value: string): boolean {
  return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}

/** Publishable client acting as the bearer's user (RLS applies). */
export function createUserClient(url: string, key: string, token: string) {
  return createClient<Database>(url, key, {
    global: {
      headers: { Authorization: `Bearer ${token}` },
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (isOpaqueKey(key) && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        if (!headers.get("Authorization")) headers.set("Authorization", `Bearer ${token}`);
        return fetch(input, { ...init, headers });
      },
    },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
