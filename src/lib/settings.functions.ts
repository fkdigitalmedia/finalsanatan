import { createServerFn } from "@tanstack/react-start";

export function parseBoolSetting(val: unknown): boolean {
  if (val === true || val === "true" || val === 1 || val === "1") return true;
  if (!val) return false;
  if (typeof val === "object") {
    const f = (val as Record<string, unknown>).free_full_report;
    if (f === true || f === "true" || f === 1 || f === "1") return true;
  }
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (parsed === true || parsed === "true" || parsed === 1 || parsed === "1") return true;
      if (parsed && typeof parsed === "object") {
        const f = parsed.free_full_report;
        if (f === true || f === "true" || f === 1 || f === "1") return true;
      }
    } catch {
      /* ignore invalid json */
    }
  }
  return false;
}

export const getKundliReportSetting = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("site_settings")
      .select("value")
      .eq("key", "kundli.report")
      .maybeSingle();

    if (error || !data) return { free_full_report: false };
    return { free_full_report: parseBoolSetting(data.value) };
  } catch {
    return { free_full_report: false };
  }
});

export const getToolMonetizationSetting = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("site_settings")
      .select("value")
      .eq("key", "tool_monetization_config")
      .maybeSingle();

    if (error || !data || !data.value) return { config: null };
    return { config: data.value };
  } catch {
    return { config: null };
  }
});
