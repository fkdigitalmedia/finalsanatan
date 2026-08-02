/**
 * Phase 14.7 — video sitemap.
 * Reads `seo.videos` from site_settings so the admin can register videos
 * without a deploy; emits a valid empty sitemap when none are configured.
 */
import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { originFromRequest, renderUrlset, xmlResponse, type SitemapEntry } from "@/lib/seo/sitemap";
import { readSeoSetting } from "@/lib/seo/settings.server";

interface VideoRow {
  path: string;
  title: string;
  description: string;
  thumbnail: string;
  contentUrl?: string;
  playerUrl?: string;
}

export const Route = createFileRoute("/sitemap-video.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = originFromRequest(request);
        const videos = (await readSeoSetting<VideoRow[]>("seo.videos")) ?? [];
        const entries: SitemapEntry[] = videos.map((v) => ({
          path: v.path,
          alternates: false,
          video: {
            thumbnail: v.thumbnail,
            title: v.title,
            description: v.description,
            contentUrl: v.contentUrl,
            playerUrl: v.playerUrl,
          },
        }));
        return xmlResponse(renderUrlset(entries, { origin, multilingual: false }));
      },
    },
  },
});
