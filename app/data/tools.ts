export const BEEIJA_CATEGORIES = [
  "AI Cost Calculators",
  "Cloud Cost Calculators",
  "Hosting & Infrastructure Calculators",
  "API & SaaS Cost Calculators",
  "Capacity & Usage Calculators",
  "Technology Comparison Tools",
] as const;

export type BeeijaCategory = (typeof BEEIJA_CATEGORIES)[number];

export type BeeijaTool = {
  title: string;
  description: string;
  href: `/tools/${string}`;
  category: BeeijaCategory;
  keywords?: string[];
  featured?: boolean;
};

/*
  Add every Beeija tool here only after its page is created.

  This single list will be used automatically by:
  - the All Tools page
  - category pages
  - homepage tool sections
  - related-tool sections
  - sitemap generation
  - internal linking
*/

export const tools: BeeijaTool[] = [];

export function getToolsByCategory(category: BeeijaCategory) {
  return tools.filter((tool) => tool.category === category);
}

export function getFeaturedTools() {
  return tools.filter((tool) => tool.featured);
}

export function getToolByHref(href: string) {
  return tools.find((tool) => tool.href === href);
}

export function getRelatedTools(
  currentHref: string,
  category: BeeijaCategory,
  limit = 4,
) {
  return tools
    .filter(
      (tool) =>
        tool.href !== currentHref &&
        tool.category === category,
    )
    .slice(0, limit);
}
