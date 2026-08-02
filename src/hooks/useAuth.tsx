import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User, Provider } from "@supabase/supabase-js";
import { useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  provider?: string;
  role?: "admin" | "user";
  last_login?: string;
  created_at?: string;
  updated_at?: string;
}

type AuthCtx = {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithOAuth: (provider: Provider, redirectTo?: string) => Promise<{ error: Error | null }>;
  signInWithPassword: (credentials: {
    email: string;
    password: string;
  }) => Promise<{ error: Error | null }>;
  signUp: (params: {
    email: string;
    password: string;
    name?: string;
  }) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  signInWithOAuth: async () => ({ error: null }),
  signInWithPassword: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const qc = useQueryClient();

  const syncUserProfile = async (authUser: User) => {
    try {
      const now = new Date().toISOString();
      const meta = authUser.user_metadata || {};
      const provider = authUser.app_metadata?.provider || "email";

      const name =
        meta.display_name ||
        meta.full_name ||
        meta.name ||
        authUser.email?.split("@")[0] ||
        "Sanatan User";

      const profileData = {
        id: authUser.id,
        email: authUser.email,
        display_name: name,
        full_name: name,
        avatar_url: meta.avatar_url || meta.picture || null,
        provider,
        last_login: now,
        updated_at: now,
      };

      // Upsert into Supabase database profiles table
      const { data, error } = await (supabase as any)
        .from("profiles")
        .upsert(profileData, { onConflict: "id" })
        .select()
        .single();

      if (!error && data) {
        setProfile(data as UserProfile);
      } else {
        setProfile({
          id: authUser.id,
          email: authUser.email,
          full_name: profileData.full_name,
          avatar_url: profileData.avatar_url,
          provider,
          role: authUser.email?.includes("admin") ? "admin" : "user",
          last_login: now,
        });
      }
    } catch (e) {
      console.error("Error syncing user profile:", e);
    }
  };

  useEffect(() => {
    // Restore session automatically
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        syncUserProfile(s.user);
      }
      setLoading(false);
    });

    // Handle authentication state changes & auto-refresh
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        syncUserProfile(s.user);
      } else {
        setProfile(null);
      }

      if (
        event === "SIGNED_IN" ||
        event === "SIGNED_OUT" ||
        event === "USER_UPDATED" ||
        event === "TOKEN_REFRESHED"
      ) {
        router.invalidate();
        if (event === "SIGNED_OUT") {
          qc.clear();
        } else {
          qc.invalidateQueries();
        }
      }
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, [router, qc]);

  const signInWithOAuth = async (provider: Provider, redirectTo?: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const redirectUrl = redirectTo || `${origin}/auth`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          prompt: "select_account",
        },
      },
    });

    return { error: error as Error | null };
  };

  const signInWithPassword = async (credentials: { email: string; password: string }) => {
    const { error } = await supabase.auth.signInWithPassword(credentials);
    return { error: error as Error | null };
  };

  const signUp = async (params: { email: string; password: string; name?: string }) => {
    const { error } = await supabase.auth.signUp({
      email: params.email,
      password: params.password,
      options: {
        data: {
          full_name: params.name,
        },
      },
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    setSession(null);
    setUser(null);
    setProfile(null);
    await supabase.auth.signOut();
    router.invalidate();
  };

  return (
    <Ctx.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signInWithOAuth,
        signInWithPassword,
        signUp,
        signOut,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  return useContext(Ctx);
}
