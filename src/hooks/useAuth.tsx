import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GoogleProfile } from "@/lib/google-auth";

export interface CustomAuthUser {
  id: string;
  email: string;
  user_metadata?: {
    display_name?: string;
    full_name?: string;
    avatar_url?: string;
    [key: string]: any;
  };
  app_metadata?: {
    provider?: string;
    [key: string]: any;
  };
}

type AuthCtx = {
  user: CustomAuthUser | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: (profile: GoogleProfile) => void;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx>({
  user: null,
  session: null,
  loading: true,
  signInWithGoogle: () => {},
  signOut: async () => {},
});

const GOOGLE_USER_KEY = "sanatan_google_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [googleUser, setGoogleUser] = useState<CustomAuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const qc = useQueryClient();

  useEffect(() => {
    // Check direct Google user session in localStorage
    try {
      const stored = localStorage.getItem(GOOGLE_USER_KEY);
      if (stored) {
        setGoogleUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error reading stored Google session:", e);
    }

    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        router.invalidate();
        if (event !== "SIGNED_OUT") qc.invalidateQueries();
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, [router, qc]);

  const signInWithGoogle = (profile: GoogleProfile) => {
    const formattedUser: CustomAuthUser = {
      id: profile.sub || `google_${Date.now()}`,
      email: profile.email,
      user_metadata: {
        display_name: profile.name || profile.email.split("@")[0],
        full_name: profile.name,
        avatar_url: profile.picture,
      },
      app_metadata: {
        provider: "google",
      },
    };

    try {
      localStorage.setItem(GOOGLE_USER_KEY, JSON.stringify(formattedUser));
    } catch (e) {
      console.error("Failed to save Google user session:", e);
    }

    setGoogleUser(formattedUser);
    router.invalidate();
    qc.invalidateQueries();
  };

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    try {
      localStorage.removeItem(GOOGLE_USER_KEY);
    } catch (e) {}
    setGoogleUser(null);
    await supabase.auth.signOut();
    router.invalidate();
  };

  // Determine active user (Supabase or direct Google session)
  const activeUser: CustomAuthUser | null =
    googleUser || (session?.user ? (session.user as unknown as CustomAuthUser) : null);

  return (
    <Ctx.Provider value={{ user: activeUser, session, loading, signInWithGoogle, signOut }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  return useContext(Ctx);
}
