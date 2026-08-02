/**
 * Google Identity Services (GIS) Official OAuth & JWT helper
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
    if (!base64Url) throw new Error("Invalid JWT token format");
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    const data = JSON.parse(jsonPayload);
    return {
      sub: data.sub || data.id,
      email: data.email,
      name: data.name || data.given_name || data.email?.split("@")[0] || "Google User",
      picture: data.picture,
      email_verified: data.email_verified ?? true,
    };
  } catch (err) {
    console.error("Failed to decode Google ID Token:", err);
    throw new Error("Invalid Google token format");
  }
}

export async function fetchGoogleUserInfo(accessToken: string): Promise<GoogleProfile> {
  try {
    const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (res.ok) {
      const data = await res.json();
      return {
        sub: data.sub,
        email: data.email,
        name: data.name || data.email.split("@")[0],
        picture: data.picture,
        email_verified: data.email_verified,
      };
    }
  } catch (e) {}

  // Fallback endpoint with query param
  const res2 = await fetch(
    `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`,
  );
  if (!res2.ok) {
    throw new Error("Failed to fetch Google user profile");
  }
  const data2 = await res2.json();
  return {
    sub: data2.id || data2.sub,
    email: data2.email,
    name: data2.name || data2.email?.split("@")[0],
    picture: data2.picture,
    email_verified: data2.verified_email ?? true,
  };
}

export async function parseGoogleAuthResponse(hashOrParams: string): Promise<GoogleProfile> {
  const cleanHash = hashOrParams.startsWith("#") ? hashOrParams.substring(1) : hashOrParams;
  const params = new URLSearchParams(cleanHash);
  const idToken = params.get("id_token");
  const accessToken = params.get("access_token");

  // 1. Prefer decoding id_token directly (JWT - 0 network delay / 0 CORS issues)
  if (idToken) {
    try {
      return decodeGoogleCredential(idToken);
    } catch (e) {
      console.warn("Failed to decode id_token from hash, attempting userinfo fetch...", e);
    }
  }

  // 2. Fetch UserInfo using access_token
  if (accessToken) {
    return await fetchGoogleUserInfo(accessToken);
  }

  throw new Error("No Google access_token or id_token found in response");
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
