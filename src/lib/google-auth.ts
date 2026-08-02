/**
 * Google Identity Services (GIS) Official OAuth Popup Helper
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

export async function fetchGoogleUserInfo(accessToken: string): Promise<GoogleProfile> {
  const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch Google user profile");
  }
  const data = await res.json();
  return {
    sub: data.sub,
    email: data.email,
    name: data.name || data.email.split("@")[0],
    picture: data.picture,
    email_verified: data.email_verified,
  };
}

let scriptLoadingPromise: Promise<boolean> | null = null;

export function loadGoogleGsiScript(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if ((window as any).google?.accounts?.oauth2 || (window as any).google?.accounts?.id) {
    return Promise.resolve(true);
  }

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
