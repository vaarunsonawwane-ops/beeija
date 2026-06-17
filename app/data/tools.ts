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

export const tools: BeeijaTool[] = [
  {
    title: "OpenAI API Cost Calculator",
    description:
      "Estimate OpenAI API costs using requests, input tokens, cached input tokens, output tokens, and model pricing.",
    href: "/tools/openai-api-cost-calculator",
    category: "AI Cost Calculators",
  },
  
  {
  title: "Claude API Cost Calculator",
  description:
    "Estimate Anthropic Claude API costs using input tokens, prompt caching, output tokens, Batch API, and monthly usage.",
  href: "/tools/claude-api-cost-calculator",
  category: "AI Cost Calculators",
  },
  
  {
  title: "Gemini API Cost Calculator",
  description:
    "Estimate Google Gemini API costs using input tokens, cached input, output tokens, Batch API, prompt size, and monthly usage.",
  href: "/tools/gemini-api-cost-calculator",
  category: "AI Cost Calculators",
  },
  
  {
  title: "DeepSeek API Cost Calculator",
  description:
    "Estimate DeepSeek V4 Flash and V4 Pro API costs using cache-hit input, cache-miss input, output tokens, requests, and monthly usage.",
  href: "/tools/deepseek-api-cost-calculator",
  category: "AI Cost Calculators",
  },
  
  
  
  
  
];

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
