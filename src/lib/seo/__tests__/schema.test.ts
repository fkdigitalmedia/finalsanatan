import { describe, it, expect } from "vitest";
import {
  abs,
  articleSchema,
  breadcrumbSchema,
  collectionPageSchema,
  faqSchema,
  graph,
  howToSchema,
  itemListSchema,
  ldJson,
  organizationSchema,
  softwareApplicationSchema,
  webPageSchema,
  websiteSchema,
  SITE_URL,
} from "../schema";

describe("seo/schema", () => {
  it("absolutises paths and preserves absolute URLs", () => {
    expect(abs("/blog")).toBe(`${SITE_URL}/blog`);
    expect(abs("blog")).toBe(`${SITE_URL}/blog`);
    expect(abs("https://x.dev/a")).toBe("https://x.dev/a");
  });

  it("emits a WebSite node with a SearchAction", () => {
    const site = websiteSchema() as Record<string, Record<string, string>>;
    expect(site["@type"]).toBe("WebSite");
    expect(site.potentialAction.target).toContain("/search?q=");
  });

  it("builds breadcrumb positions in order", () => {
    const bc = breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
    ]) as { itemListElement: { position: number; item: string }[] };
    expect(bc.itemListElement.map((i) => i.position)).toEqual([1, 2]);
    expect(bc.itemListElement[1].item).toBe(`${SITE_URL}/blog`);
  });

  it("builds FAQ, HowTo, ItemList, CollectionPage, Article and SoftwareApplication nodes", () => {
    expect(
      (faqSchema([{ question: "q", answer: "a" }]) as { mainEntity: unknown[] }).mainEntity,
    ).toHaveLength(1);
    expect(
      (howToSchema({ name: "n", steps: ["one", "two"] }) as { step: unknown[] }).step,
    ).toHaveLength(2);
    expect(
      (itemListSchema([{ name: "a", path: "/a" }]) as { numberOfItems: number }).numberOfItems,
    ).toBe(1);
    expect(
      (
        collectionPageSchema({ name: "n", description: "d", path: "/p", items: [] }) as Record<
          string,
          string
        >
      )["@type"],
    ).toBe("CollectionPage");
    expect(
      (articleSchema({ type: "BlogPosting", headline: "h", path: "/b" }) as Record<string, string>)[
        "@type"
      ],
    ).toBe("BlogPosting");
    expect(
      (
        softwareApplicationSchema({ name: "t", description: "d", path: "/tools/x" }) as Record<
          string,
          string
        >
      )["@type"],
    ).toBe("SoftwareApplication");
    expect((organizationSchema() as Record<string, string>).name).toBe("SanatanTools");
    expect(
      (webPageSchema({ name: "n", description: "d", path: "/x" }) as Record<string, string>).url,
    ).toBe(`${SITE_URL}/x`);
  });

  it("merges nodes into a single @graph and serialises for head scripts", () => {
    const g = graph(websiteSchema(), organizationSchema()) as {
      "@graph": Record<string, string>[];
    };
    expect(g["@graph"]).toHaveLength(2);
    expect(g["@graph"][0]["@context"]).toBeUndefined();

    const script = ldJson(g);
    expect(script.type).toBe("application/ld+json");
    expect(JSON.parse(script.children)["@graph"]).toHaveLength(2);
  });
});
