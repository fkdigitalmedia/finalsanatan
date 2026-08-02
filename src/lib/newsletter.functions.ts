// ============================================================
// Newsletter subscribe — public server function
// ============================================================

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SubscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
  source: z.string().max(64).optional(),
});

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .inputValidator((data) => SubscribeSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("newsletter_subscribers").upsert(
      {
        email: data.email,
        source: data.source ?? "kundli-landing",
        status: "active",
        confirmed_at: new Date().toISOString(),
      },
      { onConflict: "email" },
    );
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
