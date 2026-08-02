// Public read for explicitly shared reports (server publishable client).
import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export interface SharedReportView {
  title: string;
  kind: string;
  language: string;
  content_md: string | null;
  created_at: string;
}

export const getSharedReport = createServerFn({ method: "GET" })
  .inputValidator((data: { token: string }) => ({ token: String(data?.token ?? "").slice(0, 64) }))
  .handler(async ({ data }): Promise<SharedReportView | null> => {
    if (!/^[a-zA-Z0-9-]{8,64}$/.test(data.token)) return null;

    const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
    const supabasePublic = createClient<Database>(process.env.SUPABASE_URL!, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`)
            h.delete("Authorization");
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });

    const { data: row } = await supabasePublic
      .from("user_reports")
      .select("title, kind, language, content_md, created_at")
      .eq("share_token", data.token)
      .eq("is_shared", true)
      .maybeSingle();

    return row ?? null;
  });
