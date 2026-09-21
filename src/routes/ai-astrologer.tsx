import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/ai-astrologer")({
  beforeLoad: ({ search }) => {
    throw redirect({
      to: "/tools/$slug",
      params: { slug: "ai-astrologer" },
      search: search as any,
    });
  },
});
