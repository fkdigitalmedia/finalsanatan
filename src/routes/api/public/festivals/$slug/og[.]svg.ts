/**
 * Auto-generated branded OG image for a festival, returned as SVG.
 * Saffron / Maroon / Gold palette matching site theme.
 * Most social crawlers (Facebook, LinkedIn, Slack, WhatsApp, Discord) accept SVG.
 * Twitter falls back to summary card without image if SVG isn't accepted — acceptable trade-off.
 */
import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getPublicFestivalBySlug } from "@/lib/festivals-public.functions";

function esc(v: string) {
  return v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
function wrap(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > maxChars) {
      if (cur) lines.push(cur);
      cur = w;
      if (lines.length >= maxLines) break;
    } else {
      cur = (cur + " " + w).trim();
    }
  }
  if (cur && lines.length < maxLines) lines.push(cur);
  if (lines.length > maxLines) lines.length = maxLines;
  return lines;
}

export const Route = createFileRoute("/api/public/festivals/$slug/og.svg")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const res = await getPublicFestivalBySlug({ data: { slug: params.slug } });
        if (!res.row) return new Response("Not found", { status: 404 });
        const row: any = res.row;

        const name = row.name ?? "Festival";
        const tagline = row.short_description ?? row.description ?? "";
        const category = (row.category ?? "Hindu Festival").toString().toUpperCase();
        const deities = (row.deities ?? []).slice(0, 3).join(" · ");

        const nameLines = wrap(name, 22, 2);
        const tagLines = wrap(tagline, 60, 2);

        const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#3B0A0A"/>
      <stop offset="0.55" stop-color="#7C1D1D"/>
      <stop offset="1" stop-color="#B8570F"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.85" cy="0.15" r="0.7">
      <stop offset="0" stop-color="#F5B841" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#F5B841" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="gold" x1="0" x2="1">
      <stop offset="0" stop-color="#F5B841"/>
      <stop offset="1" stop-color="#F59E0B"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>

  <!-- decorative mandala arcs -->
  <g opacity="0.15" stroke="#F5B841" fill="none" stroke-width="1.2">
    <circle cx="1050" cy="120" r="180"/>
    <circle cx="1050" cy="120" r="230"/>
    <circle cx="1050" cy="120" r="280"/>
  </g>

  <!-- top brand row -->
  <g transform="translate(80,80)">
    <rect x="0" y="0" width="46" height="46" rx="12" fill="url(#gold)"/>
    <text x="60" y="30" font-family="Georgia, serif" font-size="24" font-weight="700" fill="#FFFDF7">SanatanTools</text>
    <text x="60" y="52" font-family="system-ui, sans-serif" font-size="14" fill="#F5B841" letter-spacing="3">${esc(category)}</text>
  </g>

  <!-- Title -->
  <g transform="translate(80,240)" fill="#FFFDF7" font-family="Georgia, serif">
    ${nameLines
      .map((l, i) => `<text x="0" y="${i * 92}" font-size="88" font-weight="700">${esc(l)}</text>`)
      .join("\n    ")}
  </g>

  <!-- Tagline -->
  <g transform="translate(80,${260 + nameLines.length * 92})" fill="#F5EED7" font-family="system-ui, sans-serif">
    ${tagLines
      .map((l, i) => `<text x="0" y="${i * 34}" font-size="26" opacity="0.9">${esc(l)}</text>`)
      .join("\n    ")}
  </g>

  <!-- Deity badge -->
  ${
    deities
      ? `<g transform="translate(80,540)">
          <rect x="0" y="0" width="${Math.min(deities.length * 15 + 40, 700)}" height="42" rx="21" fill="#F5B841" opacity="0.15" stroke="#F5B841" stroke-opacity="0.5"/>
          <text x="24" y="28" font-family="system-ui, sans-serif" font-size="18" fill="#F5B841" font-weight="600">✦ ${esc(deities)}</text>
        </g>`
      : ""
  }

  <!-- URL -->
  <text x="1120" y="590" text-anchor="end" font-family="system-ui, sans-serif" font-size="20" fill="#F5B841" opacity="0.7">sanatantools.com/festivals/${esc(params.slug)}</text>
</svg>`;

        return new Response(svg, {
          headers: {
            "Content-Type": "image/svg+xml; charset=utf-8",
            "Cache-Control": "public, max-age=86400, s-maxage=86400",
          },
        });
      },
    },
  },
});
