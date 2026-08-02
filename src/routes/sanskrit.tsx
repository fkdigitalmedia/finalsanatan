import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/templates/CategoryPage";
import { getCategory } from "@/config/categories";

const cat = getCategory("sanskrit")!;

export const Route = createFileRoute("/sanskrit")({
  head: () => ({
    meta: [
      { title: `${cat.title} — SanatanTools` },
      { name: "description", content: cat.description },
      { property: "og:title", content: `${cat.title} — SanatanTools` },
      { property: "og:description", content: cat.description },
      { property: "og:url", content: "/sanskrit" },
    ],
    links: [{ rel: "canonical", href: "/sanskrit" }],
  }),
  component: () => <CategoryPage category={cat} />,
});
