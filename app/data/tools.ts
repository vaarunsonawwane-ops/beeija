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
  
  {
  title: "Grok API Cost Calculator",
  description:
    "Estimate xAI Grok API costs using requests, input tokens, cached input tokens, output tokens, and monthly usage.",
  href: "/tools/grok-api-cost-calculator",
  category: "AI Cost Calculators",
  },
  
  {
  title: "Mistral API Cost Calculator",
  description:
    "Estimate Mistral API costs using input tokens, output tokens, Batch API, requests, and monthly usage.",
  href: "/tools/mistral-api-cost-calculator",
  category: "AI Cost Calculators",
  },
  
  {
  title: "Perplexity API Cost Calculator",
  description:
    "Estimate Perplexity Sonar API costs using tokens, search context fees, Deep Research usage, requests, and monthly volume.",
  href: "/tools/perplexity-api-cost-calculator",
  category: "AI Cost Calculators",
  },
  
  {
  title: "Cohere API Cost Calculator",
  description:
    "Estimate Cohere Command API costs using input tokens, output tokens, requests, and monthly usage.",
  href: "/tools/cohere-api-cost-calculator",
  category: "AI Cost Calculators",
  },
  
  {
  title: "AI Token Cost Calculator",
  description:
    "Estimate AI API costs using input tokens, cached input tokens, output tokens, requests, and your own pricing.",
  href: "/tools/ai-token-cost-calculator",
  category: "AI Cost Calculators",
  },
  
  
  {
  title: "AI Image Generation Cost Calculator",
  description:
    "Estimate AI image generation costs using price per image, monthly requests, retries, and other fixed costs.",
  href: "/tools/ai-image-generation-cost-calculator",
  category: "AI Cost Calculators",
  },
  
  {
  title: "AI Voice Agent Cost Calculator",
  description:
    "Estimate the full cost of an AI voice agent using current rates you enter for speech-to-text, LLM, text-to-speech, telephony, platform, recording, setup, and fixed costs.",
  href: "/tools/ai-voice-agent-cost-calculator",
  category: "AI Cost Calculators",
  },
  
  
  {
  title: "AI Transcription Cost Comparison Calculator",
  description:
    "Compare OpenAI, Deepgram, AssemblyAI, Google Cloud, and custom speech-to-text costs using monthly audio hours and processing mode.",
  href: "/tools/ai-transcription-cost-comparison-calculator",
  category: "AI Cost Calculators",
  },
  
  {
  title: "AI Video Generation Cost Comparison Calculator",
  description:
    "Compare current Google Veo 3.1 and Runway API video generation costs using clip duration, usable output, repeated attempts, budget, and custom pricing.",
  href: "/tools/ai-video-generation-cost-comparison-calculator",
  category: "AI Cost Calculators",
  },
  
  {
  title: "RAG Cost Calculator",
  description:
    "Estimate retrieval-augmented generation costs across chunking, embeddings, vector storage, reads, writes, reranking, LLM usage, refreshes, and setup.",
  href: "/tools/rag-cost-calculator",
  category: "AI Cost Calculators",
  },
  
  {
  title: "AI Embedding Cost Comparison Calculator",
  description:
    "Compare current OpenAI, Google Gemini, Mistral, Voyage AI, and custom embedding costs across indexing, refreshes, queries, and first-year usage.",
  href: "/tools/ai-embedding-cost-comparison-calculator",
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
