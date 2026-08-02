/**
 * Server-only helpers to load payment gateway configuration + credentials
 * from the `payment_gateways` table. Credentials are stored in a JSONB
 * column and are ONLY accessible via supabaseAdmin (RLS blocks reads for
 * non-admins). Never import this from client-reachable module scope —
 * always dynamic-import inside a server-fn handler.
 */
import type { Json } from "@/integrations/supabase/types";

export type GatewayProvider =
  "razorpay" | "stripe" | "paypal" | "cashfree" | "phonepe" | "paytm" | "lemonsqueezy" | "custom";

export interface GatewayRow {
  id: string;
  provider: GatewayProvider;
  display_name: string;
  mode: "test" | "live";
  active: boolean;
  is_default: boolean;
  sort_order: number;
  credentials: Record<string, string>;
  public_config: Json;
  supported_currencies: string[];
}

/** Load a gateway row by id (admin credentials included). */
export async function loadGatewayById(id: string): Promise<GatewayRow | null> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("payment_gateways")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as unknown as GatewayRow) ?? null;
}

/** Load the default active gateway (fallback when caller doesn't pass one). */
export async function loadDefaultGateway(): Promise<GatewayRow | null> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("payment_gateways")
    .select("*")
    .eq("active", true)
    .order("is_default", { ascending: false })
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle();
  return (data as unknown as GatewayRow) ?? null;
}

/** Read a required credential and throw a clear error if missing. */
export function requireCredential(gw: GatewayRow, key: string): string {
  const v = gw.credentials?.[key];
  if (!v || typeof v !== "string") {
    throw new Error(
      `Gateway "${gw.display_name}" is missing credential "${key}". Add it in Admin → Payment Gateways.`,
    );
  }
  return v;
}
