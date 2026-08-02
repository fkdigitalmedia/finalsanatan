/**
 * Google Identity Services (GIS) direct OAuth & JWT decoder helper
 */

export interface GoogleProfile {
  sub: string;
  email: string;
  name: string;
  picture?: string;
  email_verified?: boolean;
}

export function decodeGoogleCredential(credential: string): GoogleProfile {
  try {
    const base64Url = credential.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error("Failed to decode Google ID Token:", err);
    throw new Error("Invalid Google token format");
  }
}

let scriptLoadingPromise: Promise<boolean> | null = null;

export function loadGoogleGsiScript(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if ((window as any).google?.accounts?.id) return Promise.resolve(true);

  if (scriptLoadingPromise) return scriptLoadingPromise;

  scriptLoadingPromise = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });

  return scriptLoadingPromise;
}

export function initializeGoogleOneTap(
  clientId: string,
  onSuccess: (profile: GoogleProfile) => void,
) {
  loadGoogleGsiScript().then((loaded) => {
    if (!loaded) return;
    const google = (window as any).google;
    if (!google?.accounts?.id) return;

    google.accounts.id.initialize({
      client_id: clientId,
      callback: (response: any) => {
        if (response.credential) {
          const profile = decodeGoogleCredential(response.credential);
          onSuccess(profile);
        }
      },
    });

    google.accounts.id.prompt();
  });
}
