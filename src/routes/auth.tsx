import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/brand/Logo";
import { toast } from "sonner";
import { Loader2, Apple } from "lucide-react";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { fetchGoogleUserInfo } from "@/lib/google-auth";

const searchSchema = z.object({ redirect: z.string().optional() });

export const Route = createFileRoute("/auth")({
  ssr: false,
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Sign in — SanatanTools" },
      {
        name: "description",
        content:
          "Sign in to save mantras, tools, favorites and track your daily practice on SanatanTools.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { user, signInWithGoogle } = useAuth();
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Handle Google OAuth access token returned in URL hash (#access_token=...)
    if (typeof window !== "undefined" && window.location.hash.includes("access_token=")) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get("access_token");
      if (accessToken) {
        setLoading(true);
        fetchGoogleUserInfo(accessToken)
          .then((profile) => {
            signInWithGoogle(profile);
            toast.success(`Welcome, ${profile.name || profile.email}`);
            if (window.opener && window.opener !== window) {
              try {
                window.opener.postMessage(
                  { type: "GOOGLE_AUTH_SUCCESS", profile },
                  window.location.origin,
                );
              } catch (e) {}
              window.close();
              return;
            }
            const target =
              redirect && redirect !== "/auth" && redirect !== "/" ? redirect : "/dashboard";
            navigate({ to: target as never });
          })
          .catch((err) => {
            console.error("Failed to complete Google Sign-in:", err);
            toast.error("Google authentication failed");
          })
          .finally(() => setLoading(false));
      }
    } else if (user) {
      const target = redirect && redirect !== "/auth" && redirect !== "/" ? redirect : "/dashboard";
      navigate({ to: target as never });
    }
  }, [user, redirect, navigate, signInWithGoogle]);

  const oauth = (provider: "google" | "apple", label: string) => async () => {
    setLoading(true);
    const r = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: window.location.origin + "/auth",
    });
    if (r.error) {
      toast.error(r.error.message || `${label} sign-in failed`);
      setLoading(false);
    }
  };

  const google = oauth("google", "Google");
  const apple = oauth("apple", "Apple");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + "/auth",
            data: { display_name: name || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Account created — check your inbox to confirm");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + "/reset-password",
        });
        if (error) throw error;
        toast.success("Password reset email sent");
        setMode("signin");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex bg-gradient-brand text-primary-foreground p-12 flex-col justify-between">
        <Link to="/" className="text-primary-foreground">
          <Logo size="lg" />
        </Link>
        <div>
          <h2 className="font-display text-4xl font-semibold leading-tight">
            Your daily Sanatan companion.
          </h2>
          <p className="mt-4 text-primary-foreground/80 max-w-md">
            Save mantras, bookmark tools, keep a jaap streak and get personal panchang — all in one
            calm, ad-light space.
          </p>
          <ul className="mt-8 space-y-2 text-primary-foreground/90 text-sm">
            <li>• 100+ tools synced across devices</li>
            <li>• Personal jaap counters and streaks</li>
            <li>• Save mantras, shloks, festivals & temples</li>
            <li>• Daily reminders (optional)</li>
          </ul>
        </div>
        <p className="text-xs text-primary-foreground/60">© SanatanTools — built with reverence.</p>
      </div>

      <div className="flex items-center justify-center p-6 md:p-12 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-6">
            <Logo size="md" />
          </div>
          <h1 className="font-display text-3xl font-semibold">
            {mode === "signin"
              ? "Welcome back"
              : mode === "signup"
                ? "Create your account"
                : "Reset password"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "signup"
              ? "Free forever. No spam."
              : mode === "forgot"
                ? "We'll email you a reset link."
                : "Sign in to continue."}
          </p>

          {mode !== "forgot" && (
            <>
              <GoogleSignInButton
                onSuccess={() => navigate({ to: (redirect as never) ?? "/dashboard" })}
              />
              <Button
                type="button"
                variant="outline"
                className="w-full mt-3 gap-2 h-11"
                onClick={apple}
                disabled={loading}
              >
                <AppleIcon /> Continue with Apple
              </Button>
              <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex-1 h-px bg-border" /> or with email{" "}
                <div className="flex-1 h-px bg-border" />
              </div>
            </>
          )}

          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="mt-1.5"
                />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1.5"
              />
            </div>
            {mode !== "forgot" && (
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {mode === "signin" && (
                    <button
                      type="button"
                      className="text-xs text-accent hover:underline"
                      onClick={() => setMode("forgot")}
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="mt-1.5"
                />
              </div>
            )}
            <Button type="submit" className="w-full h-11 shadow-glow" disabled={loading}>
              {loading && <Loader2 className="size-4 animate-spin mr-2" />}
              {mode === "signin"
                ? "Sign in"
                : mode === "signup"
                  ? "Create account"
                  : "Send reset link"}
            </Button>
          </form>

          <p className="mt-6 text-sm text-muted-foreground text-center">
            {mode === "signin" ? (
              <>
                New here?{" "}
                <button
                  className="text-accent font-medium hover:underline"
                  onClick={() => setMode("signup")}
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  className="text-accent font-medium hover:underline"
                  onClick={() => setMode("signin")}
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.5 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h5.9c-.3 1.4-1 2.6-2.2 3.4v2.8h3.6c2.1-1.9 3.2-4.8 3.2-8.2z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.9 0 5.4-1 7.2-2.6l-3.6-2.8c-1 .7-2.3 1.1-3.6 1.1-2.8 0-5.1-1.9-6-4.4H2.3v2.8C4.1 20.7 7.8 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M6 14.3c-.2-.7-.3-1.4-.3-2.3s.1-1.6.3-2.3V6.9H2.3C1.5 8.5 1 10.2 1 12s.5 3.5 1.3 5.1L6 14.3z"
      />
      <path
        fill="#EA4335"
        d="M12 5.4c1.6 0 3 .5 4.1 1.6l3.1-3.1C17.4 2.1 14.9 1 12 1 7.8 1 4.1 3.3 2.3 6.9L6 9.7c.9-2.5 3.2-4.3 6-4.3z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.36 12.72c.02-2.2 1.8-3.26 1.88-3.31-1.02-1.5-2.62-1.7-3.19-1.72-1.36-.14-2.65.8-3.34.8-.69 0-1.75-.78-2.87-.76-1.48.02-2.84.86-3.6 2.18-1.53 2.66-.39 6.6 1.11 8.76.73 1.06 1.6 2.25 2.75 2.2 1.1-.04 1.52-.71 2.85-.71 1.33 0 1.7.71 2.87.69 1.19-.02 1.94-1.08 2.66-2.14.84-1.23 1.19-2.42 1.21-2.48-.03-.01-2.32-.89-2.33-3.51zM14.2 6.2c.6-.74 1.01-1.75.9-2.77-.87.04-1.93.58-2.56 1.31-.56.65-1.06 1.7-.93 2.7.98.08 1.98-.5 2.59-1.24z" />
    </svg>
  );
}
