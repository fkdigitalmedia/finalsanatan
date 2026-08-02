// Performance dashboard — server functions (staff only).
// Thin wrapper: every helper lives in `snapshot.server.ts` / `perf-admin.server.ts`
// so the server-fn splitter cannot strip a runtime sibling.

import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertStaffContext, clearPerformanceCaches } from "./perf-admin.server";
import { buildPerformanceSnapshot, type PerformanceSnapshot } from "./snapshot.server";

export const getPerformanceSnapshot = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<PerformanceSnapshot> => {
    await assertStaffContext(context as { supabase: any; userId: string });
    return buildPerformanceSnapshot((context as { supabase: any }).supabase);
  });

export const flushPerformanceCaches = createServerFn({ method: "POST" })
  .inputValidator((input: { namespace?: string } | undefined) => input ?? {})
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    await assertStaffContext(context as { supabase: any; userId: string });
    return clearPerformanceCaches(data.namespace);
  });
