// Production security headers for HTML / SSR responses.
//
// The API layer sets its own strict headers (src/api/middleware/pipeline.ts).
// This module covers everything the browser renders.

export interface SecurityHeaderOptions {
  /** Enable HSTS. Only meaningful over https. */
  hsts?: boolean;
  /** Report-only CSP — useful while tuning. */
  reportOnly?: boolean;
}

/** Hosts the app legitimately talks to from the browser. */
const CONNECT_SRC = [
  "'self'",
  "https://*.supabase.co",
  "wss://*.supabase.co",
  "https://photon.komoot.io",
  "https://nominatim.openstreetmap.org",
  "https://*.lovable.app",
  "https://*.lovable.dev",
  "https://api.razorpay.com",
  "https://*.lemonsqueezy.com",
  "https://www.google-analytics.com",
  "https://*.clarity.ms",
];

const SCRIPT_SRC = [
  "'self'",
  "'unsafe-inline'", // SSR hydration + inline JSON-LD
  "'unsafe-eval'", // required by some chart/pdf deps in dev
  "https://checkout.razorpay.com",
  "https://*.lemonsqueezy.com",
  "https://www.googletagmanager.com",
  "https://www.clarity.ms",
];

const FRAME_SRC = [
  "'self'",
  "https://api.razorpay.com",
  "https://*.razorpay.com",
  "https://*.lemonsqueezy.com",
  "https://www.google.com",
  "https://www.openstreetmap.org",
];

export function buildContentSecurityPolicy(): string {
  return [
    "default-src 'self'",
    `script-src ${SCRIPT_SRC.join(" ")}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "media-src 'self' data: blob: https:",
    `connect-src ${CONNECT_SRC.join(" ")}`,
    `frame-src ${FRAME_SRC.join(" ")}`,
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self' https://*.lovable.app https://*.lovable.dev https://lovable.dev",
    "upgrade-insecure-requests",
  ].join("; ");
}

export const PERMISSIONS_POLICY = [
  "accelerometer=()",
  "autoplay=()",
  "camera=()",
  "display-capture=()",
  "encrypted-media=()",
  "geolocation=(self)",
  "gyroscope=()",
  "magnetometer=()",
  "microphone=()",
  "payment=(self)",
  "usb=()",
  "interest-cohort=()",
].join(", ");

export function buildSecurityHeaders(opts: SecurityHeaderOptions = {}): Record<string, string> {
  const headers: Record<string, string> = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": PERMISSIONS_POLICY,
    "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    "X-Permitted-Cross-Domain-Policies": "none",
    "X-DNS-Prefetch-Control": "off",
  };

  headers[opts.reportOnly ? "Content-Security-Policy-Report-Only" : "Content-Security-Policy"] =
    buildContentSecurityPolicy();

  if (opts.hsts !== false) {
    headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains; preload";
  }
  return headers;
}

/** Preview/editor hosts that legitimately embed the app in an iframe. */
const EMBEDDABLE_HOST = /(^|\.)lovable\.(app|dev)$/i;

/** Apply headers to a Response without clobbering handler-set values. */
export function applySecurityHeaders(response: Response, url?: string): Response {
  let secure = true;
  let embeddable = false;
  try {
    if (url) {
      const parsed = new URL(url);
      secure = parsed.protocol === "https:";
      embeddable = EMBEDDABLE_HOST.test(parsed.hostname) || parsed.hostname === "localhost";
    }
  } catch {
    /* keep defaults */
  }

  const headers = buildSecurityHeaders({ hsts: secure });
  // Legacy X-Frame-Options cannot express an allowlist; on preview hosts we
  // rely on the CSP `frame-ancestors` directive instead.
  if (embeddable) delete headers["X-Frame-Options"];

  for (const [key, value] of Object.entries(headers)) {
    if (!response.headers.has(key)) response.headers.set(key, value);
  }
  return response;
}
