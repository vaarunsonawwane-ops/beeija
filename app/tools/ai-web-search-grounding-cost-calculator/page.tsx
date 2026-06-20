import type { Metadata } from "next";
import Link from "next/link";
import ToolShell from "@/app/components/ToolShell";
import ToolContent from "@/app/components/ToolContent";
import ToolClient from "./ToolClient";

export const metadata: Metadata = {
  title: "AI Web Search Grounding Cost Calculator",
  description:
    "Compare OpenAI, Claude, Google Gemini, and custom web search grounding costs using search frequency, queries per prompt, retrieved context, model tokens, free allowances, and retries.",
  keywords: [
    "AI web search cost calculator",
    "web grounding cost calculator",
    "OpenAI web search cost calculator",
    "Claude web search cost calculator",
    "Gemini grounding cost calculator",
    "AI search API pricing comparison",
    "LLM web search cost",
    "grounded AI response cost",
    "web search tool cost calculator",
    "AI research agent cost",
    "search augmented generation cost",
    "AI grounding pricing",
    "web search token cost",
  ],
  alternates: {
    canonical:
      "https://beeija.com/tools/ai-web-search-grounding-cost-calculator",
  },
  openGraph: {
    title: "AI Web Search Grounding Cost Calculator",
    description:
      "Compare current OpenAI, Claude, and Gemini web search pricing with model tokens, retrieved context, retries, and free allowances.",
    url: "https://beeija.com/tools/ai-web-search-grounding-cost-calculator",
    siteName: "Beeija",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Web Search Grounding Cost Calculator",
    description:
      "Estimate search-tool fees, model-token cost, cost per grounded prompt, and first-year spend.",
  },
};

const faqs = [
  {
    question: "What is a grounded AI response?",
    answer:
      "A grounded response uses current information retrieved from web search rather than relying only on the model's existing knowledge. The provider may charge for search calls, model tokens, or both.",
  },
  {
    question: "Why can one prompt create more than one search query?",
    answer:
      "A model may issue several searches to answer one request, especially for comparisons, research, or multi-part questions. Google and Anthropic both note that a single model turn can perform multiple searches.",
  },
  {
    question: "Why are retrieved web tokens billed differently?",
    answer:
      "OpenAI currently says search-content tokens are free, and Gemini says retrieved grounding context is not charged as input tokens. Anthropic bills web-search result content at the normal model input-token rate.",
  },
  {
    question: "How is the Gemini free allowance handled?",
    answer:
      "The built-in Gemini 3.1 Flash-Lite option applies the current 5,000 grounded-prompt monthly allowance shared across Gemini 3. Searches from prompts beyond that allowance are billed using the average searches per grounded prompt.",
  },
  {
    question: "Is the lowest-cost provider automatically the best choice?",
    answer:
      "No. This compares cost for representative current models. Search quality, model quality, citations, latency, regional availability, limits, safety, and product fit also matter.",
  },
  {
    question: "Can I compare another model or search provider?",
    answer:
      "Yes. Add a custom option with its current model input and output prices, search price, free allowance, and whether retrieved search content is billed as model input.",
  },
];

export default function AiWebSearchGroundingCostCalculatorPage() {
  return (
    <ToolShell
      category="AI Cost Calculators"
      title="AI Web Search Grounding Cost Calculator"
      description="Compare current OpenAI, Claude, Google Gemini, and custom web search grounding costs across search calls, model tokens, retrieved context, retries, and free allowances."
    >
      <ToolClient />

      <div className="mt-16">
        <ToolContent
          intro={
            <p>
              Web-grounded AI has two cost layers: the model response and the
              search work used to retrieve current information. A single prompt
              can also trigger several searches, while providers treat retrieved
              context and free allowances differently.
            </p>
          }
          sections={[
            {
              title: "Comparing the Complete Grounded-Response Cost",
              content: (
                <>
                  <p>
                    Enter monthly prompts, the share that requires current web
                    information, average searches per grounded prompt, input
                    tokens, retrieved web tokens, output tokens, and retry
                    overhead.
                  </p>

                  <p>
                    The calculator applies each provider&apos;s current search
                    fee and token treatment. Results include search-tool spend,
                    model-token spend, total monthly cost, cost per grounded
                    prompt, and first-year cost.
                  </p>

                  <p>
                    The comparison uses one representative current model per
                    provider so it can produce an immediate estimate. It is a
                    cost comparison, not a claim that the models provide equal
                    quality.
                  </p>
                </>
              ),
            },
            {
              title: "How the Provider Billing Rules Differ",
              content: (
                <>
                  <p>
                    OpenAI currently charges $10 per 1,000 web-search calls.
                    Search-content tokens are free, while normal prompt and
                    output tokens use the selected model rates.
                  </p>

                  <p>
                    Anthropic currently charges $10 per 1,000 searches in
                    addition to normal model tokens. Retrieved search results
                    that enter Claude&apos;s context are billed as input tokens.
                  </p>

                  <p>
                    Gemini 3 currently includes 5,000 grounded prompts per month
                    across the Gemini 3 family, then charges $14 per 1,000 search
                    queries. One prompt may create several queries. Retrieved
                    grounding context is not charged as input tokens.
                  </p>
                </>
              ),
            },
            {
              title: "Estimating Searches per Grounded Prompt",
              content: (
                <>
                  <p>
                    A simple current-fact lookup may need one search. A research
                    question, comparison, shopping task, or multi-step agent may
                    use several.
                  </p>

                  <p>
                    Use API usage data when available. For early planning, test a
                    representative sample and record the average search count,
                    retry rate, retrieved context size, and response size.
                  </p>

                  <p>
                    Search-trigger rate should reflect only prompts that actually
                    need the web. Routing every request through search can add
                    unnecessary cost and latency.
                  </p>
                </>
              ),
            },
            {
              title: "Built-In Models and Prices",
              content: (
                <>
                  <p>
                    The built-in comparison uses OpenAI GPT-5.4 mini, Anthropic
                    Claude Sonnet 4.6, and Google Gemini 3.1 Flash-Lite Standard.
                    Model and search-tool prices were checked on June 20, 2026
                    against official provider documentation.
                  </p>

                  <p>
                    Regional processing, data-residency premiums, batch or
                    priority modes, negotiated discounts, and other model tiers
                    are not automatically included. Use the custom option when a
                    different model or account price is more relevant.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href="https://openai.com/api/pricing/"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      OpenAI API Pricing
                    </a>

                    <a
                      href="https://platform.claude.com/docs/en/about-claude/pricing"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Claude API Pricing
                    </a>

                    <a
                      href="https://ai.google.dev/gemini-api/docs/pricing"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Gemini API Pricing
                    </a>
                  </div>
                </>
              ),
            },
            {
              title: "Practical Decisions This Tool Supports",
              content: (
                <ul className="list-disc space-y-2 pl-6">
                  <li>Estimate web-grounded AI cost before launch.</li>
                  <li>Compare search-call and model-token pricing together.</li>
                  <li>See the cost effect of several searches per prompt.</li>
                  <li>Measure the value of limiting search to selected requests.</li>
                  <li>Include retrieved-context tokens where the provider bills them.</li>
                  <li>Compare public pricing with another model or private quote.</li>
                  <li>Calculate cost per grounded prompt and first-year spend.</li>
                  <li>Check the selected option against a monthly budget.</li>
                </ul>
              ),
            },
            {
              title: "Costs and Limits Outside the Estimate",
              content: (
                <>
                  <p>
                    The result does not automatically include caching, agent
                    loops beyond the entered retry rate, citation processing,
                    storage, data transfer, orchestration, observability, taxes,
                    regional premiums, or private discounts.
                  </p>

                  <p>
                    Search quality and model quality are not priced in. Review
                    citation accuracy, freshness, latency, coverage, and answer
                    usefulness before choosing a provider only from the lowest
                    calculated total.
                  </p>
                </>
              ),
            },
            {
              title: "Frequently Asked Questions",
              content: (
                <div className="space-y-6">
                  {faqs.map((faq) => (
                    <div key={faq.question}>
                      <h3 className="font-semibold text-gray-900">
                        {faq.question}
                      </h3>
                      <p className="mt-2">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              ),
            },
            {
              title: "Explore Related AI Cost Tools",
              content: (
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/tools/ai-agent-workflow-cost-calculator"
                    className="beeija-btn-outline"
                  >
                    AI Agent Workflow Cost Calculator
                  </Link>

                  <Link
                    href="/tools/ai-model-routing-savings-calculator"
                    className="beeija-btn-outline"
                  >
                    AI Model Routing Savings Calculator
                  </Link>

                  <Link
                    href="/tools/ai-token-cost-calculator"
                    className="beeija-btn-outline"
                  >
                    AI Token Cost Calculator
                  </Link>

                  <Link
                    href="/tools/ai-prompt-caching-savings-calculator"
                    className="beeija-btn-outline"
                  >
                    AI Prompt Caching Savings Calculator
                  </Link>

                  <Link
                    href="/tools/rag-cost-calculator"
                    className="beeija-btn-outline"
                  >
                    RAG Cost Calculator
                  </Link>

                  <Link
                    href="/tools/perplexity-api-cost-calculator"
                    className="beeija-btn-outline"
                  >
                    Perplexity API Cost Calculator
                  </Link>

                  <Link
                    href="/categories/ai-cost-calculators"
                    className="beeija-btn-outline"
                  >
                    AI Cost Calculators
                  </Link>
                </div>
              ),
            },
          ]}
        />
      </div>
    </ToolShell>
  );
}
