import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/templates/CategoryPage";
import { getCategory } from "@/config/categories";

import { seoHead } from "@/lib/seo/engine";

const cat = getCategory("learning")!;

export const Route = createFileRoute("/learning")({
  head: () =>
    seoHead({
      type: "category",
      path: "/learning",
      slug: "learning",
      title: `${cat.title} — SanatanTools`,
      description: cat.description,
      category: "learning",
    }),
  component: () => <CategoryPage category={cat} />,
});
