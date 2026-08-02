import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  fetchGoogleUserInfo,
  loadGoogleGsiScript,
  decodeGoogleCredential,
  type GoogleProfile,
} from "@/lib/google-auth";

function GoogleGIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export function GoogleSignInButton({
  onSuccess,
  className = "w-full mt-4 gap-3 h-11 border-border font-medium",
}: {
  onSuccess?: () => void;
  className?: string;
}) {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Pre-load Google GIS script
    loadGoogleGsiScript();
  }, []);

  const handleGoogleLoginSuccess = (profile: GoogleProfile) => {
    signInWithGoogle(profile);
    toast.success(`Welcome, ${profile.name || profile.email}`);
    if (onSuccess) onSuccess();
  };

  const handleClick = async () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      toast.error("Please configure VITE_GOOGLE_CLIENT_ID in your .env file");
      return;
    }

    setLoading(true);

    try {
      const loaded = await loadGoogleGsiScript();
      if (!loaded || typeof window === "undefined") {
        toast.error("Google Sign-In SDK could not be loaded");
        setLoading(false);
        return;
      }

      const google = (window as any).google;

      // Method 1: Official Google OAuth2 Token Popup
      if (google?.accounts?.oauth2?.initTokenClient) {
        const tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: "openid email profile",
          callback: async (tokenResponse: any) => {
            if (tokenResponse.error) {
              toast.error(`Google login failed: ${tokenResponse.error}`);
              setLoading(false);
              return;
            }

            if (tokenResponse.access_token) {
              try {
                const profile = await fetchGoogleUserInfo(tokenResponse.access_token);
                handleGoogleLoginSuccess(profile);
              } catch (err) {
                toast.error("Failed to fetch Google profile info");
              } finally {
                setLoading(false);
              }
            }
          },
        });

        tokenClient.requestAccessToken({ prompt: "select_account" });
      }
      // Method 2: Official Google ID Credential Callback
      else if (google?.accounts?.id) {
        google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: any) => {
            setLoading(false);
            if (response.credential) {
              const profile = decodeGoogleCredential(response.credential);
              handleGoogleLoginSuccess(profile);
            }
          },
        });

        google.accounts.id.prompt();
      } else {
        toast.error("Google accounts SDK unavailable");
        setLoading(false);
      }
    } catch (err) {
      console.error("Google Sign-in error:", err);
      toast.error("Error launching Google Login Popup");
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className={className}
      onClick={handleClick}
      disabled={loading}
    >
      <GoogleGIcon className="size-5" />
      {loading ? "Connecting to Google..." : "Continue with Google"}
    </Button>
  );
}
