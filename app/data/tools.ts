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
    keywords: [
      "api",
      "tokens",
      "model-pricing",
      "managed-api",
      "llm-inference",
    ],
  },
  
  {
  title: "Claude API Cost Calculator",
  description:
    "Estimate Anthropic Claude API costs using input tokens, prompt caching, output tokens, Batch API, and monthly usage.",
  href: "/tools/claude-api-cost-calculator",
  category: "AI Cost Calculators",
  keywords: [
    "api",
    "tokens",
    "prompt-caching",
    "batch-api",
    "managed-api",
    "llm-inference",
  ],
  },
  
  {
  title: "Gemini API Cost Calculator",
  description:
    "Estimate Google Gemini API costs using input tokens, cached input, output tokens, Batch API, prompt size, and monthly usage.",
  href: "/tools/gemini-api-cost-calculator",
  category: "AI Cost Calculators",
  keywords: [
    "api",
    "tokens",
    "prompt-caching",
    "batch-api",
    "managed-api",
    "llm-inference",
  ],
  },
  
  {
  title: "DeepSeek API Cost Calculator",
  description:
    "Estimate DeepSeek V4 Flash and V4 Pro API costs using cache-hit input, cache-miss input, output tokens, requests, and monthly usage.",
  href: "/tools/deepseek-api-cost-calculator",
  category: "AI Cost Calculators",
  keywords: [
    "api",
    "tokens",
    "prompt-caching",
    "managed-api",
    "llm-inference",
  ],
  },
  
  {
  title: "Grok API Cost Calculator",
  description:
    "Estimate xAI Grok API costs using requests, input tokens, cached input tokens, output tokens, and monthly usage.",
  href: "/tools/grok-api-cost-calculator",
  category: "AI Cost Calculators",
  keywords: [
    "api",
    "tokens",
    "prompt-caching",
    "managed-api",
    "llm-inference",
  ],
  },
  
  {
  title: "Mistral API Cost Calculator",
  description:
    "Estimate Mistral API costs using input tokens, output tokens, Batch API, requests, and monthly usage.",
  href: "/tools/mistral-api-cost-calculator",
  category: "AI Cost Calculators",
  keywords: [
    "api",
    "tokens",
    "batch-api",
    "managed-api",
    "llm-inference",
  ],
  },
  
  {
  title: "Perplexity API Cost Calculator",
  description:
    "Estimate Perplexity Sonar API costs using tokens, search context fees, Deep Research usage, requests, and monthly volume.",
  href: "/tools/perplexity-api-cost-calculator",
  category: "AI Cost Calculators",
  keywords: [
    "api",
    "tokens",
    "web-search",
    "grounding",
    "managed-api",
    "llm-inference",
  ],
  },
  
  {
  title: "Cohere API Cost Calculator",
  description:
    "Estimate Cohere Command API costs using input tokens, output tokens, requests, and monthly usage.",
  href: "/tools/cohere-api-cost-calculator",
  category: "AI Cost Calculators",
  keywords: [
    "api",
    "tokens",
    "reranking",
    "embeddings",
    "managed-api",
    "llm-inference",
  ],
  },
  
  {
  title: "AI Token Cost Calculator",
  description:
    "Estimate AI API costs using input tokens, cached input tokens, output tokens, requests, and your own pricing.",
  href: "/tools/ai-token-cost-calculator",
  category: "AI Cost Calculators",
  keywords: [
    "tokens",
    "model-pricing",
    "managed-api",
    "llm-inference",
    "baseline-model-cost",
  ],
  },
  
  
  {
  title: "AI Image Generation Cost Calculator",
  description:
    "Estimate AI image generation costs using price per image, monthly requests, retries, and other fixed costs.",
  href: "/tools/ai-image-generation-cost-calculator",
  category: "AI Cost Calculators",
  keywords: [
    "image-generation",
    "media-generation",
    "api",
    "managed-api",
  ],
  },
  
  {
  title: "AI Voice Agent Cost Calculator",
  description:
    "Estimate the full cost of an AI voice agent using current rates you enter for speech-to-text, LLM, text-to-speech, telephony, platform, recording, setup, and fixed costs.",
  href: "/tools/ai-voice-agent-cost-calculator",
  category: "AI Cost Calculators",
  keywords: [
    "voice-agent",
    "speech",
    "transcription",
    "agent-automation",
    "api",
  ],
  },
  
  
  {
  title: "AI Transcription Cost Comparison Calculator",
  description:
    "Compare OpenAI, Deepgram, AssemblyAI, Google Cloud, and custom speech-to-text costs using monthly audio hours and processing mode.",
  href: "/tools/ai-transcription-cost-comparison-calculator",
  category: "AI Cost Calculators",
  keywords: [
    "transcription",
    "speech",
    "audio",
    "api",
    "managed-api",
  ],
  },
  
  {
  title: "AI Video Generation Cost Comparison Calculator",
  description:
    "Compare current Google Veo 3.1 and Runway API video generation costs using clip duration, usable output, repeated attempts, budget, and custom pricing.",
  href: "/tools/ai-video-generation-cost-comparison-calculator",
  category: "AI Cost Calculators",
  keywords: [
    "video-generation",
    "media-generation",
    "api",
    "managed-api",
  ],
  },
  
  {
  title: "RAG Cost Calculator",
  description:
    "Estimate retrieval-augmented generation costs across chunking, embeddings, vector storage, reads, writes, reranking, LLM usage, refreshes, and setup.",
  href: "/tools/rag-cost-calculator",
  category: "AI Cost Calculators",
  keywords: [
    "rag",
    "retrieval",
    "embeddings",
    "reranking",
    "tokens",
    "llm-inference",
  ],
  },
  
  {
  title: "AI Embedding Cost Comparison Calculator",
  description:
    "Compare current OpenAI, Google Gemini, Mistral, Voyage AI, and custom embedding costs across indexing, refreshes, queries, and first-year usage.",
  href: "/tools/ai-embedding-cost-comparison-calculator",
  category: "AI Cost Calculators",
  keywords: [
    "embeddings",
    "rag",
    "retrieval",
    "vector-search",
    "api",
  ],
  },
  
  {
  title: "AI Reranking Cost Calculator",
  description:
    "Compare Voyage AI and Pinecone reranking costs, estimate downstream LLM token savings, and calculate the net monthly impact.",
  href: "/tools/ai-reranking-cost-calculator",
  category: "AI Cost Calculators",
  keywords: [
    "reranking",
    "rag",
    "retrieval",
    "llm-optimization",
    "tokens",
  ],
  },
  
  {
  title: "AI Prompt Caching Savings Calculator",
  description:
    "Estimate prompt caching savings across OpenAI, Claude, Google Gemini, and custom pricing using reusable tokens, cache hit rate, writes, storage, and monthly requests.",
  href: "/tools/ai-prompt-caching-savings-calculator",
  category: "AI Cost Calculators",
  keywords: [
    "prompt-caching",
    "tokens",
    "llm-optimization",
    "context",
    "api",
  ],
  },
  
  {
  title: "AI Batch API Savings Calculator",
  description:
    "Estimate standard versus batch AI processing costs across OpenAI, Claude, Gemini, Mistral, and custom pricing, including repeat processing, setup, and break-even savings.",
  href: "/tools/ai-batch-api-savings-calculator",
  category: "AI Cost Calculators",
  keywords: [
    "batch-api",
    "tokens",
    "llm-optimization",
    "api",
  ],
  },
  
  {
  title: "AI Agent Workflow Cost Calculator",
  description:
    "Estimate multi-step AI agent costs across planner and worker models, context growth, retries, paid tools, memory, human review, infrastructure, and product margin.",
  href: "/tools/ai-agent-workflow-cost-calculator",
  category: "AI Cost Calculators",
  keywords: [
    "agent-automation",
    "workflow",
    "tokens",
    "llm-inference",
    "human-review",
  ],
  },

  {
  title: "AI Fine-Tuning Cost Calculator",
  description:
    "Estimate dataset, training, evaluation, retraining, tuned-model inference, hosting, payback, break-even usage, and first-year fine-tuning costs.",
  href: "/tools/ai-fine-tuning-cost-calculator",
  category: "AI Cost Calculators",
  keywords: [
    "fine-tuning",
    "training",
    "synthetic-data",
    "evaluation",
    "gpu-inference",
    "llm-inference",
    "model-hosting",
  ],
  }, 

  {
  title: "AI Model Routing Savings Calculator",
  description:
    "Compare an all-premium AI workflow with a low-cost and premium model routing strategy, including pass rate, fallback, retries, gateway fees, setup, and break-even savings.",
  href: "/tools/ai-model-routing-savings-calculator",
  category: "AI Cost Calculators",
  keywords: [
    "model-routing",
    "llm-optimization",
    "tokens",
    "llm-inference",
    "api",
  ],
  },
  
  {
  title: "AI Evaluation Cost Calculator",
  description:
    "Estimate candidate-model inference, model-grader calls, repeated evaluation runs, selective human review, platform costs, setup, and first-year evaluation spend.",
  href: "/tools/ai-evaluation-cost-calculator",
  category: "AI Cost Calculators",
  keywords: [
    "evaluation",
    "fine-tuning",
    "guardrails",
    "human-review",
    "llm-inference",
  ],
  },
  
  {
  title: "AI Guardrail Cost Calculator",
  description:
    "Estimate input and output safety checks, policy-model grading, regeneration, human review, platform fees, setup, break-even blocking, and total guarded AI cost.",
  href: "/tools/ai-guardrail-cost-calculator",
  category: "AI Cost Calculators",
  keywords: [
    "guardrails",
    "evaluation",
    "safety",
    "human-review",
    "llm-inference",
  ],
  },
  
  {
  title: "AI Web Search Grounding Cost Calculator",
  description:
    "Compare current OpenAI, Claude, Google Gemini, and custom web search grounding costs across search calls, model tokens, retrieved context, retries, and free allowances.",
  href: "/tools/ai-web-search-grounding-cost-calculator",
  category: "AI Cost Calculators",
  keywords: [
    "web-search",
    "grounding",
    "rag",
    "retrieval",
    "tokens",
    "api",
  ],
  },
  
  
  {
  title: "AI Document Processing Cost Calculator",
  description:
    "Estimate OCR, extraction, vision, LLM validation, retries, human review, setup, break-even volume, and first-year document automation costs.",
  href: "/tools/ai-document-processing-cost-calculator",
  category: "AI Cost Calculators",
  keywords: [
    "document-processing",
    "ocr",
    "vision",
    "agent-automation",
    "human-review",
    "llm-inference",
  ],
  },
  
  {
  title: "AI Coding Agent Cost Calculator",
  description:
    "Estimate planning, coding, repair, review, CI, human approval, setup, cost per successful task, manual savings, payback, and break-even volume.",
  href: "/tools/ai-coding-agent-cost-calculator",
  category: "AI Cost Calculators",
  keywords: [
    "coding-agent",
    "agent-automation",
    "workflow",
    "tokens",
    "llm-inference",
  ],
  },
  
  {
  title: "AI Customer Support Automation Cost Calculator",
  description:
    "Estimate AI-handled support conversations, ticket deflection, model and retrieval spend, escalations, QA review, setup, savings, payback, and break-even automation share.",
  href: "/tools/ai-customer-support-automation-cost-calculator",
  category: "AI Cost Calculators",
  keywords: [
    "customer-support",
    "agent-automation",
    "rag",
    "voice-agent",
    "human-review",
    "llm-inference",
  ],
  },
  
  {
  title: "AI Translation and Localization Cost Calculator",
  description:
    "Estimate translation-model tokens, terminology lookup, QA, retries, human post-editing, setup, savings, payback, and break-even multilingual content volume.",
  href: "/tools/ai-translation-localization-cost-calculator",
  category: "AI Cost Calculators",
  keywords: [
    "translation",
    "localization",
    "agent-automation",
    "tokens",
    "human-review",
    "llm-inference",
  ],
  },
  
  {
  title: "AI Synthetic Data Generation Cost Calculator",
  description:
    "Estimate generation, validation, deduplication, human review, rejected candidates, setup, accepted-record cost, savings, payback, and break-even dataset volume.",
  href: "/tools/ai-synthetic-data-generation-cost-calculator",
  category: "AI Cost Calculators",
  keywords: [
    "synthetic-data",
    "training",
    "fine-tuning",
    "evaluation",
    "human-review",
    "llm-inference",
  ],
  },
  
  {
  title: "AI Context Window Cost Calculator",
  description:
    "Compare full conversation history with summarized context using token growth, cached prefixes, summary overhead, context limits, overflow turns, monthly cost, and savings.",
  href: "/tools/ai-context-window-cost-calculator",
  category: "AI Cost Calculators",
  keywords: [
    "context-window",
    "prompt-caching",
    "tokens",
    "llm-optimization",
    "llm-inference",
    "context",
  ],
  },
  
  
  {
  title: "AI Meeting Assistant Cost Calculator",
  description:
    "Estimate transcription, diarization, summaries, action items, storage, integrations, human review, setup, savings, payback, and break-even meeting volume.",
  href: "/tools/ai-meeting-assistant-cost-calculator",
  category: "AI Cost Calculators",
  keywords: [
    "meeting-assistant",
    "transcription",
    "speech",
    "agent-automation",
    "human-review",
    "llm-inference",
  ],
  },
  
  {
  title: "AI GPU Inference Cost Calculator",
  description:
    "Estimate GPUs per replica, throughput-based GPU hours, batching, utilization, idle capacity, self-hosted cost, managed API comparison, payback, and break-even volume.",
  href: "/tools/ai-gpu-inference-cost-calculator",
  category: "AI Cost Calculators",
  keywords: [
    "gpu-inference",
    "self-hosting",
    "llm-inference",
    "llm-optimization",
    "tokens",
    "context",
    "training",
    "capacity",
    "baseline-model-cost",
  ],
  },
  
  {
  title: "Cloud VM Cost Comparison Calculator",
  description:
    "Compare AWS EC2, Azure Virtual Machines, Google Compute Engine, or custom VM plans using runtime, commitments, Spot usage, storage, bandwidth, IPs, load balancers, and first-year cost.",
  href: "/tools/cloud-vm-cost-comparison-calculator",
  category: "Cloud Cost Calculators",
  },
  
  {
  title: "Cloud Object Storage Cost Comparison Calculator",
  description:
    "Compare Amazon S3, Azure Blob Storage, Google Cloud Storage, or custom object storage plans using storage tiers, requests, retrievals, egress, lifecycle transitions, replication, and migration cost.",
  href: "/tools/cloud-object-storage-cost-comparison-calculator",
  category: "Cloud Cost Calculators",
  },
  
  {
  title: "Cloud PostgreSQL Cost Comparison Calculator",
  description:
    "Compare Amazon RDS for PostgreSQL, Azure Database for PostgreSQL Flexible Server, and Google Cloud SQL using compute, HA, replicas, storage, IOPS, backups, transfer, support, and migration cost.",
  href: "/tools/cloud-postgresql-cost-comparison-calculator",
  category: "Cloud Cost Calculators",
  },

  {
  title: "Cloud MySQL Cost Comparison Calculator",
  description:
    "Compare Amazon RDS for MySQL, Azure Database for MySQL Flexible Server, and Google Cloud SQL using compute, HA, replicas, storage, IOPS, backups, transfer, extended support, and migration cost.",
  href: "/tools/cloud-mysql-cost-comparison-calculator",
  category: "Cloud Cost Calculators",
  },  
  
  {
  title: "Cloud Redis Cost Comparison Calculator",
  description:
    "Compare Amazon ElastiCache, Azure Managed Redis, and Google Cloud Memorystore using node, serverless, memory, request, backup, transfer, support, and migration costs.",
  href: "/tools/cloud-redis-cost-comparison-calculator",
  category: "Cloud Cost Calculators",
  },

  {
  title: "Cloud SQL Server Cost Comparison Calculator",
  description:
    "Compare Amazon RDS for SQL Server, Azure SQL Managed Instance, and Google Cloud SQL using compute, licensing, HA, storage, IOPS, backups, transfer, discounts, and migration cost.",
  href: "/tools/cloud-sql-server-cost-comparison-calculator",
  category: "Cloud Cost Calculators",
  },

  {
  title: "Cloud Kubernetes Cost Comparison Calculator",
  description:
    "Compare Amazon EKS, Azure Kubernetes Service, and Google Kubernetes Engine using cluster fees, worker or pod compute, storage, load balancers, NAT, transfer, logging, backups, discounts, and migration cost.",
  href: "/tools/cloud-kubernetes-cost-comparison-calculator",
  category: "Cloud Cost Calculators",
  },

  {
  title: "Cloud Serverless Functions Cost Comparison Calculator",
  description:
    "Compare AWS Lambda, Azure Functions, and Google Cloud Run functions using requests, execution time, memory, vCPU, warm capacity, storage, transfer, logging, discounts, and migration cost.",
  href: "/tools/cloud-serverless-functions-cost-comparison-calculator",
  category: "Cloud Cost Calculators",
  },



  
  
  
  
  
  
  
];

export const BEEIJA_CATEGORY_HREFS: Record<
  BeeijaCategory,
  `/categories/${string}`
> = {
  "AI Cost Calculators": "/categories/ai-cost-calculators",
  "Cloud Cost Calculators": "/categories/cloud-cost-calculators",
  "Hosting & Infrastructure Calculators":
    "/categories/hosting-infrastructure-calculators",
  "API & SaaS Cost Calculators":
    "/categories/api-saas-cost-calculators",
  "Capacity & Usage Calculators":
    "/categories/capacity-usage-calculators",
  "Technology Comparison Tools":
    "/categories/technology-comparison-tools",
};

const RELATED_KEYWORD_WEIGHTS: Record<string, number> = {
  api: 4,
  tokens: 6,
  "llm-inference": 6,
  "managed-api": 7,
  "model-pricing": 8,
  "human-review": 8,
  "agent-automation": 10,
  evaluation: 12,
  retrieval: 12,
  rag: 12,
  capacity: 12,
  training: 14,
  context: 14,
  "baseline-model-cost": 16,
  "llm-optimization": 16,
  "prompt-caching": 18,
  "batch-api": 18,
  "model-routing": 18,
  "self-hosting": 20,
  "fine-tuning": 20,
  "gpu-inference": 24,
};

const RELATED_TEXT_STOP_WORDS = new Set([
  "about",
  "across",
  "after",
  "all",
  "and",
  "before",
  "calculator",
  "calculators",
  "calculate",
  "compare",
  "comparison",
  "cost",
  "costs",
  "current",
  "custom",
  "estimate",
  "estimated",
  "first",
  "for",
  "from",
  "full",
  "including",
  "monthly",
  "other",
  "per",
  "plan",
  "planning",
  "price",
  "prices",
  "pricing",
  "the",
  "tool",
  "tools",
  "total",
  "using",
  "with",
  "year",
  "your",
]);

const RELATED_TEXT_ALIASES: Record<string, string> = {
  agents: "agent",
  apis: "api",
  calls: "call",
  documents: "document",
  embeddings: "embedding",
  evaluations: "evaluation",
  gpus: "gpu",
  hours: "hour",
  images: "image",
  meetings: "meeting",
  models: "model",
  prompts: "prompt",
  replicas: "replica",
  requests: "request",
  reviews: "review",
  savings: "saving",
  searches: "search",
  servers: "server",
  tokens: "token",
  translations: "translation",
  videos: "video",
  workflows: "workflow",
};

function normalizeRelatedKeyword(keyword: string) {
  return keyword.trim().toLowerCase();
}

function getRelatedKeywordSet(tool: BeeijaTool) {
  return new Set(
    (tool.keywords ?? [])
      .map(normalizeRelatedKeyword)
      .filter(Boolean),
  );
}

function getRelatedTextTokenSet(tool: BeeijaTool) {
  return new Set(
    [tool.title, tool.description]
      .join(" ")
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, " ")
      .split(/\s+/)
      .map(
        (token) =>
          RELATED_TEXT_ALIASES[token] ?? token,
      )
      .filter(
        (token) =>
          token.length >= 3 &&
          !RELATED_TEXT_STOP_WORDS.has(token),
      ),
  );
}

function scoreRelatedTool(
  currentTool: BeeijaTool,
  candidate: BeeijaTool,
) {
  const currentKeywords = getRelatedKeywordSet(currentTool);
  const candidateKeywords = getRelatedKeywordSet(candidate);

  const currentTextTokens = getRelatedTextTokenSet(currentTool);
  const candidateTextTokens = getRelatedTextTokenSet(candidate);

  let score = 0;

  currentKeywords.forEach((keyword) => {
    if (candidateKeywords.has(keyword)) {
      score +=
        RELATED_KEYWORD_WEIGHTS[keyword] ?? 10;
    }
  });

  currentTextTokens.forEach((token) => {
    if (candidateTextTokens.has(token)) {
      score += 1;
    }
  });

  return score;
}

export function getToolsByCategory(category: BeeijaCategory) {
  return tools.filter((tool) => tool.category === category);
}

export function getFeaturedTools() {
  return tools.filter((tool) => tool.featured);
}

export function getToolByHref(href: string) {
  return tools.find((tool) => tool.href === href);
}

export function getCategoryHref(category: BeeijaCategory) {
  return BEEIJA_CATEGORY_HREFS[category];
}

export function getRelatedTools(
  currentHref: string,
  category: BeeijaCategory,
  limit = 6,
) {
  const safeLimit = Math.max(0, Math.floor(limit));
  const currentTool = getToolByHref(currentHref);

  return tools
    .map((tool, index) => ({
      tool,
      index,
      score:
        currentTool && currentTool.category === category
          ? scoreRelatedTool(currentTool, tool)
          : 0,
    }))
    .filter(
      ({ tool }) =>
        tool.href !== currentHref &&
        tool.category === category,
    )
    .sort(
      (left, right) =>
        right.score - left.score ||
        left.index - right.index,
    )
    .slice(0, safeLimit)
    .map(({ tool }) => tool);
}
