import type { Metadata } from "next";
import Link from "next/link";
import ToolShell from "@/app/components/ToolShell";
import ToolContent from "@/app/components/ToolContent";
import ToolClient from "./ToolClient";

export const metadata: Metadata = {
  title: "AI Prompt Caching Savings Calculator",
  description:
    "Estimate prompt caching savings across OpenAI, Claude, Google Gemini, and custom pricing using reusable tokens, cache hit rate, cache writes, storage, and monthly requests.",
  keywords: [
    "AI prompt caching savings calculator",
    "prompt cache cost calculator",
    "OpenAI cached input calculator",
    "Claude prompt caching calculator",
    "Gemini context caching calculator",
    "LLM cache hit rate calculator",
    "prompt caching ROI",
    "cached token cost calculator",
    "AI API cost optimization",
    "LLM cost savings calculator",
    "context caching cost",
    "prompt cache break even calculator",
  ],
  alternates: {
    canonical:
      "https://beeija.com/tools/ai-prompt-caching-savings-calculator",
  },
  openGraph: {
    title: "AI Prompt Caching Savings Calculator",
    description:
      "Calculate monthly and yearly savings from reusable prompt prefixes across current OpenAI, Claude, and Gemini pricing.",
    url: "https://beeija.com/tools/ai-prompt-caching-savings-calculator",
    siteName: "Beeija",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Prompt Caching Savings Calculator",
    description:
      "Estimate cached-input cost, cache writes, storage, break-even hit rate, and total LLM savings.",
  },
};

const faqs = [
  {
    question: "What is a prompt cache hit?",
    answer:
      "A cache hit happens when a request reuses a matching prompt prefix that the provider can serve at its cached-input or cache-read rate.",
  },
  {
    question: "Why do Claude cache writes cost more than normal input?",
    answer:
      "Anthropic charges a premium when reusable content is first written to cache. Later cache reads cost a small fraction of the base input rate. The calculator applies the current 5-minute or 1-hour write rate selected.",
  },
  {
    question: "Why does Gemini add a storage charge?",
    answer:
      "Gemini explicit context caching bills cached-token reads and also charges for how many tokens are stored and how long each cache object remains active.",
  },
  {
    question: "Does OpenAI charge a separate cache storage fee?",
    answer:
      "No separate storage fee is included in OpenAI's automatic prompt caching pricing. Cache misses use the normal input rate and cache hits use the listed cached-input rate.",
  },
  {
    question: "Does a high cache hit rate always reduce the bill?",
    answer:
      "Usually, but write premiums, cache storage, short cache lifetimes, changing prompt prefixes, and low reuse can reduce or remove the saving. The calculator shows the break-even hit rate for the entered workload.",
  },
  {
    question: "Can I model Mistral or another provider?",
    answer:
      "Yes. Enable custom pricing and enter the provider's current base input, cache-read, cache-write, output, and storage rates. Mistral currently bills cached tokens at 10% of the normal input rate.",
  },
];

export default function AiPromptCachingSavingsCalculatorPage() {
  return (
    <ToolShell
      category="AI Cost Calculators"
      title="AI Prompt Caching Savings Calculator"
      description="Estimate monthly and yearly savings from reusable prompt prefixes across OpenAI, Claude, Google Gemini, and custom caching prices."
    >
      <ToolClient />

      <div className="mt-16">
        <ToolContent
          intro={
            <p>
              Long system prompts, tool definitions, examples, documents, and
              conversation history can be sent repeatedly. Prompt caching can
              lower the cost of those reusable tokens, but each provider uses a
              different combination of cache reads, writes, and storage.
            </p>
          }
          sections={[
            {
              title: "Calculating the Cost With and Without Caching",
              content: (
                <>
                  <p>
                    Enter monthly requests, reusable prefix tokens, dynamic
                    input tokens, output tokens, and the expected cache hit rate.
                    The calculator first estimates the cost when every input
                    token is billed at the normal rate.
                  </p>
                  <p>
                    It then applies the selected provider&apos;s cache-read,
                    cache-write, and storage rules. The result shows monthly
                    savings, annual savings, cost per request, savings
                    percentage, and the approximate break-even cache hit rate.
                  </p>
                </>
              ),
            },
            {
              title: "How Provider Caching Models Differ",
              content: (
                <>
                  <p>
                    OpenAI uses automatic prompt caching. Requests with matching
                    prefixes can receive the listed cached-input price, while
                    cache misses use the normal input rate.
                  </p>
                  <p>
                    Claude charges a higher price when reusable tokens are
                    written to a 5-minute or 1-hour cache, followed by a lower
                    cache-read price when the prefix is reused.
                  </p>
                  <p>
                    Gemini explicit context caching charges a reduced rate when
                    cached tokens are used and adds storage cost based on cached
                    token volume and time-to-live.
                  </p>
                </>
              ),
            },
            {
              title: "Choosing a Realistic Cache Hit Rate",
              content: (
                <>
                  <p>
                    Use production usage data when available. A stable system
                    prompt shared across many requests can have a high hit rate.
                    Frequently changing instructions, user-specific content, or
                    uneven traffic can lower it.
                  </p>
                  <p>
                    Cache eligibility and minimum token thresholds vary by
                    provider and model. The calculator assumes the reusable
                    prefix is eligible and structurally identical when a hit is
                    entered.
                  </p>
                </>
              ),
            },
            {
              title: "Practical Decisions This Tool Supports",
              content: (
                <ul className="list-disc space-y-2 pl-6">
                  <li>Estimate whether prompt caching is worth implementing.</li>
                  <li>Compare 5-minute and 1-hour Claude cache economics.</li>
                  <li>Model Gemini cache storage and refresh frequency.</li>
                  <li>Estimate savings from long system and tool prompts.</li>
                  <li>Find the approximate cache hit rate needed to break even.</li>
                  <li>Compare current public pricing with a private quote.</li>
                  <li>Plan monthly and yearly LLM cost optimization.</li>
                </ul>
              ),
            },
            {
              title: "Costs and Limits Not Included",
              content: (
                <>
                  <p>
                    The estimate does not include batch discounts, data
                    residency premiums, priority or fast processing, tool-call
                    charges, taxes, negotiated discounts, latency value, or
                    engineering work.
                  </p>
                  <p>
                    Cache hits are not guaranteed for every automatic caching
                    system. Prompt structure, token thresholds, retention,
                    routing, request timing, and provider rules can affect real
                    results.
                  </p>
                </>
              ),
            },
            {
              title: "Official Pricing Sources",
              content: (
                <>
                  <p>
                    Built-in prices were checked on June 20, 2026 against the
                    official OpenAI, Anthropic, and Google Gemini API pricing
                    documentation. Mistral&apos;s official documentation was
                    also checked for its 10% cached-input rule.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href="https://openai.com/api/pricing/"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      OpenAI Pricing
                    </a>
                    <a
                      href="https://platform.claude.com/docs/en/build-with-claude/prompt-caching"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Claude Prompt Caching
                    </a>
                    <a
                      href="https://ai.google.dev/gemini-api/docs/pricing"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Gemini API Pricing
                    </a>
                    <a
                      href="https://docs.mistral.ai/studio-api/conversations/advanced/prompt-caching"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Mistral Prompt Caching
                    </a>
                  </div>
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
                  <Link href="/tools/ai-token-cost-calculator" className="beeija-btn-outline">
                    AI Token Cost Calculator
                  </Link>
                  <Link href="/tools/openai-api-cost-calculator" className="beeija-btn-outline">
                    OpenAI API Cost Calculator
                  </Link>
                  <Link href="/tools/claude-api-cost-calculator" className="beeija-btn-outline">
                    Claude API Cost Calculator
                  </Link>
                  <Link href="/tools/gemini-api-cost-calculator" className="beeija-btn-outline">
                    Gemini API Cost Calculator
                  </Link>
                  <Link href="/tools/rag-cost-calculator" className="beeija-btn-outline">
                    RAG Cost Calculator
                  </Link>
                  <Link href="/tools/ai-voice-agent-cost-calculator" className="beeija-btn-outline">
                    AI Voice Agent Cost Calculator
                  </Link>
                  <Link href="/categories/ai-cost-calculators" className="beeija-btn-outline">
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
