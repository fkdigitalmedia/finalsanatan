import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/templates/CategoryPage";
import { getCategory } from "@/config/categories";

import { seoHead } from "@/lib/seo/engine";

const cat = getCategory("panchang")!;

export const Route = createFileRoute("/panchang")({
  head: () =>
    seoHead({
      type: "category",
      path: "/panchang",
      slug: "panchang",
      title: `${cat.title} — SanatanTools`,
      description: cat.description,
      category: "panchang",
    }),
  component: () => <CategoryPage category={cat} />,
});
