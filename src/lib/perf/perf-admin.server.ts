// Server-only helpers for the performance admin surface.

import { cache, clearAllCaches, type CacheNamespace } from "@/lib/cache";

export async function assertStaffContext(ctx: { supabase: any; userId: string }): Promise<void> {
  const { data, error } = await ctx.supabase.rpc("is_staff", { _user_id: ctx.userId });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: staff role required");
}

/** Flush one namespace or every cache. Returns what was cleared. */
export async function clearPerformanceCaches(namespace?: string): Promise<{ cleared: string }> {
  if (namespace) {
    await cache(namespace as CacheNamespace).clear();
    return { cleared: namespace };
  }
  await clearAllCaches();
  return { cleared: "all" };
}
