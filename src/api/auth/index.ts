// ============================================================
// Universal API Layer — Roles & authentication
// ------------------------------------------------------------
// Resolves the caller from the Authorization bearer token using
// the managed Supabase auth, then upgrades the role from the
// user_roles table and premium entitlements.
// ============================================================

import { unauthorized, forbidden } from "../errors";

export const ROLES = ["guest", "user", "premium", "admin", "super_admin"] as const;
export type ApiRole = (typeof ROLES)[number];

/** Higher number wins. Used for `minRole` checks. */
export const ROLE_RANK: Record<ApiRole, number> = {
  guest: 0,
  user: 1,
  premium: 2,
  admin: 3,
  super_admin: 4,
};

export interface AuthContext {
  role: ApiRole;
  userId: string | null;
  email: string | null;
  isAuthenticated: boolean;
  /** Every role row found for this user. */
  roles: string[];
  /** Stable identity for rate limiting: user id or hashed client ip. */
  subject: string;
}

export const GUEST: AuthContext = {
  role: "guest",
  userId: null,
  email: null,
  isAuthenticated: false,
  roles: [],
  subject: "guest",
};

function clientIp(request: Request): string {
  const h = request.headers;
  return (
    h.get("cf-connecting-ip") ??
    h.get("x-real-ip") ??
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

export function guestFor(request: Request): AuthContext {
  return { ...GUEST, subject: `ip:${clientIp(request)}` };
}

function bearer(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (!header || !header.startsWith("Bearer ")) return null;
  const token = header.slice(7).trim();
  if (!token || token.split(".").length !== 3) return null;
  return token;
}

/**
 * Resolve the caller. Never throws for anonymous callers — guests are a
 * first-class role. Throws only when a token is present but invalid.
 */
export async function resolveAuth(request: Request): Promise<AuthContext> {
  const token = bearer(request);
  if (!token) return guestFor(request);

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return guestFor(request);

  const { createUserClient } = await import("./supabase.server");
  const supabase = createUserClient(url, key, token);

  const { data, error } = await supabase.auth.getClaims(token);
  const sub = data?.claims?.sub as string | undefined;
  if (error || !sub) throw unauthorized("Invalid or expired access token.");

  const email = (data?.claims?.email as string | undefined) ?? null;

  let roles: string[] = [];
  try {
    const { data: rows } = await supabase.from("user_roles").select("role").eq("user_id", sub);
    roles = (rows ?? []).map((r: { role: string }) => String(r.role));
  } catch {
    roles = [];
  }

  let premium = false;
  try {
    const { data: ent } = await supabase
      .from("user_entitlements")
      .select("id")
      .eq("user_id", sub)
      .limit(1);
    premium = Boolean(ent?.length);
  } catch {
    premium = false;
  }

  const role: ApiRole = roles.includes("super_admin")
    ? "super_admin"
    : roles.some((r) => ["admin", "editor", "content_manager", "moderator"].includes(r))
      ? "admin"
      : premium || roles.includes("premium")
        ? "premium"
        : "user";

  return {
    role,
    userId: sub,
    email,
    isAuthenticated: true,
    roles,
    subject: `user:${sub}`,
  };
}

export function hasMinRole(auth: AuthContext, minRole: ApiRole): boolean {
  return ROLE_RANK[auth.role] >= ROLE_RANK[minRole];
}

export function assertRole(auth: AuthContext, minRole: ApiRole): void {
  if (hasMinRole(auth, minRole)) return;
  if (!auth.isAuthenticated) throw unauthorized();
  throw forbidden(`This endpoint requires the "${minRole}" role or higher.`);
}
