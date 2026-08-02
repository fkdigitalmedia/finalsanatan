// ============================================================
// Phase 14.7 — server-only reader for admin-editable SEO settings.
// Values live in site_settings under `seo.*` keys and are cached for a
// few minutes so crawler traffic never hammers the database.
// ============================================================

import { cached } from "./cache";

/** Read one `seo.*` setting from site_settings. Returns null when unset. */
export async function readSeoSetting<T>(key: string, ttlMs = 5 * 60 * 1000): Promise<T | null> {
  return cached<T | null>(`setting:${key}`, ttlMs, async () => {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data, error } = await supabaseAdmin
        .from("site_settings")
        .select("value")
        .eq("key", key)
        .maybeSingle();
      if (error || !data) return null;
      return (data.value ?? null) as T | null;
    } catch {
      return null;
    }
  });
}
