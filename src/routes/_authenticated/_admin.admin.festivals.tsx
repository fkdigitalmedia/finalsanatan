import { createFileRoute } from "@tanstack/react-router";
import { FestivalManager } from "@/components/admin/festivals/FestivalManager";

export const Route = createFileRoute("/_authenticated/_admin/admin/festivals")({
  component: FestivalManager,
  head: () => ({ meta: [{ title: "Admin — Festivals" }, { name: "robots", content: "noindex" }] }),
});
