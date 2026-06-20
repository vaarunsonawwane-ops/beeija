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
  
  {
  title: "AI Reranking Cost Calculator",
  description:
    "Compare Voyage AI and Pinecone reranking costs, estimate downstream LLM token savings, and calculate the net monthly impact.",
  href: "/tools/ai-reranking-cost-calculator",
  category: "AI Cost Calculators",
  },
  
  {
  title: "AI Prompt Caching Savings Calculator",
  description:
    "Estimate prompt caching savings across OpenAI, Claude, Google Gemini, and custom pricing using reusable tokens, cache hit rate, writes, storage, and monthly requests.",
  href: "/tools/ai-prompt-caching-savings-calculator",
  category: "AI Cost Calculators",
  },
  
  {
  title: "AI Batch API Savings Calculator",
  description:
    "Estimate standard versus batch AI processing costs across OpenAI, Claude, Gemini, Mistral, and custom pricing, including repeat processing, setup, and break-even savings.",
  href: "/tools/ai-batch-api-savings-calculator",
  category: "AI Cost Calculators",
  },
  
  {
  title: "AI Agent Workflow Cost Calculator",
  description:
    "Estimate multi-step AI agent costs across planner and worker models, context growth, retries, paid tools, memory, human review, infrastructure, and product margin.",
  href: "/tools/ai-agent-workflow-cost-calculator",
  category: "AI Cost Calculators",
  },

  {
  title: "AI Fine-Tuning Cost Calculator",
  description:
    "Estimate dataset, training, evaluation, retraining, tuned-model inference, hosting, payback, break-even usage, and first-year fine-tuning costs.",
  href: "/tools/ai-fine-tuning-cost-calculator",
  category: "AI Cost Calculators",
  }, 

  {
  title: "AI Model Routing Savings Calculator",
  description:
    "Compare an all-premium AI workflow with a low-cost and premium model routing strategy, including pass rate, fallback, retries, gateway fees, setup, and break-even savings.",
  href: "/tools/ai-model-routing-savings-calculator",
  category: "AI Cost Calculators",
  },
  
  {
  title: "AI Evaluation Cost Calculator",
  description:
    "Estimate candidate-model inference, model-grader calls, repeated evaluation runs, selective human review, platform costs, setup, and first-year evaluation spend.",
  href: "/tools/ai-evaluation-cost-calculator",
  category: "AI Cost Calculators",
  },
  
  {
  title: "AI Guardrail Cost Calculator",
  description:
    "Estimate input and output safety checks, policy-model grading, regeneration, human review, platform fees, setup, break-even blocking, and total guarded AI cost.",
  href: "/tools/ai-guardrail-cost-calculator",
  category: "AI Cost Calculators",
  },
  
  {
  title: "AI Web Search Grounding Cost Calculator",
  description:
    "Compare current OpenAI, Claude, Google Gemini, and custom web search grounding costs across search calls, model tokens, retrieved context, retries, and free allowances.",
  href: "/tools/ai-web-search-grounding-cost-calculator",
  category: "AI Cost Calculators",
  },
  
  
  {
  title: "AI Document Processing Cost Calculator",
  description:
    "Estimate OCR, extraction, vision, LLM validation, retries, human review, setup, break-even volume, and first-year document automation costs.",
  href: "/tools/ai-document-processing-cost-calculator",
  category: "AI Cost Calculators",
  },
  
  {
  title: "AI Coding Agent Cost Calculator",
  description:
    "Estimate planning, coding, repair, review, CI, human approval, setup, cost per successful task, manual savings, payback, and break-even volume.",
  href: "/tools/ai-coding-agent-cost-calculator",
  category: "AI Cost Calculators",
  },
  
  {
  title: "AI Customer Support Automation Cost Calculator",
  description:
    "Estimate AI-handled support conversations, ticket deflection, model and retrieval spend, escalations, QA review, setup, savings, payback, and break-even automation share.",
  href: "/tools/ai-customer-support-automation-cost-calculator",
  category: "AI Cost Calculators",
  },
  
  {
  title: "AI Translation and Localization Cost Calculator",
  description:
    "Estimate translation-model tokens, terminology lookup, QA, retries, human post-editing, setup, savings, payback, and break-even multilingual content volume.",
  href: "/tools/ai-translation-localization-cost-calculator",
  category: "AI Cost Calculators",
  },
  
  {
  title: "AI Synthetic Data Generation Cost Calculator",
  description:
    "Estimate generation, validation, deduplication, human review, rejected candidates, setup, accepted-record cost, savings, payback, and break-even dataset volume.",
  href: "/tools/ai-synthetic-data-generation-cost-calculator",
  category: "AI Cost Calculators",
  },
  
  {
  title: "AI Context Window Cost Calculator",
  description:
    "Compare full conversation history with summarized context using token growth, cached prefixes, summary overhead, context limits, overflow turns, monthly cost, and savings.",
  href: "/tools/ai-context-window-cost-calculator",
  category: "AI Cost Calculators",
  },
  
  
  {
  title: "AI Meeting Assistant Cost Calculator",
  description:
    "Estimate transcription, diarization, summaries, action items, storage, integrations, human review, setup, savings, payback, and break-even meeting volume.",
  href: "/tools/ai-meeting-assistant-cost-calculator",
  category: "AI Cost Calculators",
  },
  
  {
  title: "AI GPU Inference Cost Calculator",
  description:
    "Estimate GPUs per replica, throughput-based GPU hours, batching, utilization, idle capacity, self-hosted cost, managed API comparison, payback, and break-even volume.",
  href: "/tools/ai-gpu-inference-cost-calculator",
  category: "AI Cost Calculators",
  },
  
  {
  title: "Cloud VM Cost Comparison Calculator",
  description:
    "Compare AWS EC2, Azure Virtual Machines, Google Compute Engine, or custom VM plans using runtime, commitments, Spot usage, storage, bandwidth, IPs, load balancers, and first-year cost.",
  href: "/tools/cloud-vm-cost-comparison-calculator",
  category: "Cloud Cost Calculators",
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
