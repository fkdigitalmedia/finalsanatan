import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/templates/CategoryPage";
import { getCategory } from "@/config/categories";

import { seoHead } from "@/lib/seo/engine";

const cat = getCategory("ai")!;

export const Route = createFileRoute("/ai")({
  head: () =>
    seoHead({
      type: "category",
      path: "/ai",
      slug: "ai",
      title: `${cat.title} — SanatanTools`,
      description: cat.description,
      category: "ai",
    }),
  component: () => <CategoryPage category={cat} />,
});
