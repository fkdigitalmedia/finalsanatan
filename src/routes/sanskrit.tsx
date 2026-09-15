import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/templates/CategoryPage";
import { getCategory } from "@/config/categories";

import { seoHead } from "@/lib/seo/engine";

const cat = getCategory("sanskrit")!;

export const Route = createFileRoute("/sanskrit")({
  head: () =>
    seoHead({
      type: "category",
      path: "/sanskrit",
      slug: "sanskrit",
      title: `${cat.title} — SanatanTools`,
      description: cat.description,
      category: "sanskrit",
    }),
  component: () => <CategoryPage category={cat} />,
});
