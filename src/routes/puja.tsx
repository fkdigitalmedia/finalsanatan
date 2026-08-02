import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/templates/CategoryPage";
import { getCategory } from "@/config/categories";

const cat = getCategory("puja")!;

export const Route = createFileRoute("/puja")({
  head: () => ({
    meta: [
      { title: `${cat.title} — SanatanTools` },
      { name: "description", content: cat.description },
      { property: "og:title", content: `${cat.title} — SanatanTools` },
      { property: "og:description", content: cat.description },
      { property: "og:url", content: "/puja" },
    ],
    links: [{ rel: "canonical", href: "/puja" }],
  }),
  component: () => <CategoryPage category={cat} />,
});
