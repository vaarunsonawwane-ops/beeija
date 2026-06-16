import type { Metadata } from "next";
import Link from "next/link";
import ToolShell from "@/app/components/ToolShell";
import ToolContent from "@/app/components/ToolContent";
import ToolClient from "./ToolClient";

export const metadata: Metadata = {
  title: "Claude API Cost Calculator",

  description:
    "Estimate Claude API costs for Opus, Sonnet, and Haiku models using input tokens, prompt caching, output tokens, Batch API, and monthly usage.",

  keywords: [
    "Claude API cost calculator",
    "Anthropic API cost calculator",
    "Claude pricing calculator",
    "Claude token cost calculator",
    "Claude Opus cost calculator",
    "Claude Sonnet cost calculator",
    "Claude Haiku cost calculator",
    "Anthropic pricing calculator",
    "Claude prompt caching cost",
    "Claude Batch API cost",
    "LLM API cost calculator",
    "AI token pricing calculator",
  ],

  alternates: {
    canonical: "https://beeija.com/tools/claude-api-cost-calculator",
  },

  openGraph: {
    title: "Claude API Cost Calculator",
    description:
      "Estimate Claude API costs from input tokens, cache writes, cache reads, output tokens, Batch API, and monthly usage.",
    url: "https://beeija.com/tools/claude-api-cost-calculator",
    siteName: "Beeija",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Claude API Cost Calculator",
    description:
      "Estimate Claude Opus, Sonnet, and Haiku API costs using your own token usage.",
  },
};

const faqs = [
  {
    question: "How is Claude API cost calculated?",
    answer:
      "The calculator multiplies base input, cache write, cache read, and output tokens by the selected Claude model rates. It then shows the estimated cost per request, day, month, and year.",
  },
  {
    question: "What is the difference between a cache write and a cache read?",
    answer:
      "A cache write stores a prompt prefix for later use. A cache read uses that stored prompt again at a lower rate. The price depends on the selected cache duration and model.",
  },
  {
    question: "Does Claude Batch API reduce the price?",
    answer:
      "Yes. Anthropic lists a 50% discount on input and output token prices for Batch API processing. The calculator can apply that reduction to the estimate.",
  },
  {
    question: "What does US-only inference change?",
    answer:
      "For supported Claude models, US-only inference adds a 1.1 times price multiplier. Global routing uses the standard rate.",
  },
  {
    question: "Are the results exact?",
    answer:
      "No. They are planning estimates. Your final bill may change because of price updates, tool use, web search, code execution, retries, discounts, taxes, or other paid services.",
  },
  {
    question: "Can I enter my own Anthropic prices?",
    answer:
      "Yes. Turn on custom pricing and enter your own base input, cache write, cache read, and output rates per million tokens.",
  },
];

export default function ClaudeApiCostCalculatorPage() {
  return (
    <ToolShell
      category="AI Cost Calculators"
      title="Claude API Cost Calculator"
      description="Estimate Anthropic Claude API costs using input tokens, prompt caching, output tokens, Batch API, and monthly usage."
    >
      <ToolClient />

      <div className="mt-16">
        <ToolContent
          intro={
            <p>
              Claude API costs can change with the model, input size, output
              length, prompt caching, Batch API use, and inference region. This
              calculator brings those values together so you can test a small
              launch, a normal month, and a higher-usage case before you build.
            </p>
          }
          sections={[
            {
              title: "How the Claude API Cost Calculator Works",
              content: (
                <>
                  <p>
                    Choose a Claude model and enter the average token use for
                    one request. Base input, cache writes, cache reads, and
                    output tokens are calculated separately because each can
                    use a different price.
                  </p>

                  <p>
                    Enter the number of requests you expect in one month. The
                    calculator will show the cost per request, per day, per
                    month, and per year.
                  </p>

                  <p>
                    You can also test Batch API pricing, US-only inference, or
                    custom token rates.
                  </p>
                </>
              ),
            },
            {
              title: "What to Enter for a Useful Estimate",
              content: (
                <>
                  <p>
                    Use average values from a real request. Include the system
                    prompt, user message, chat history, retrieved text, and tool
                    instructions in your token estimate.
                  </p>

                  <p>
                    Only enter cache write and cache read tokens when prompt
                    caching is part of your setup. Do not count the same tokens
                    again as base input.
                  </p>

                  <p>
                    Test at least three cases: a small launch, a normal month,
                    and a busy month. This gives you a clearer view of how the
                    cost may grow.
                  </p>
                </>
              ),
            },
            {
              title: "Common Ways to Use This Calculator",
              content: (
                <ul className="list-disc space-y-2 pl-6">
                  <li>Estimate the monthly cost of a Claude chatbot.</li>
                  <li>Compare Opus, Sonnet, and Haiku for one workload.</li>
                  <li>Test the possible saving from prompt caching.</li>
                  <li>Compare Standard API and Batch API estimates.</li>
                  <li>Review the extra cost of US-only inference.</li>
                  <li>Prepare an early Anthropic API budget.</li>
                </ul>
              ),
            },
            {
              title: "Simple Claude API Cost Example",
              content: (
                <>
                  <p>
                    Imagine a support assistant with 40,000 requests per month.
                    Each request uses 900 base input tokens, 2,000 cache-read
                    tokens, and 350 output tokens.
                  </p>

                  <p>
                    Enter those values and choose Claude Sonnet. The calculator
                    will show the separate input, cache-read, and output costs.
                    You can then switch to Haiku or Opus without changing the
                    workload.
                  </p>
                </>
              ),
            },
            {
              title: "Pricing and Estimate Notes",
              content: (
                <>
                  <p>
                    Built-in model prices were checked against Anthropic's
                    official Claude API pricing documentation on June 17, 2026.
                    Anthropic may change models, prices, or billing rules at any
                    time.
                  </p>

                  <p>
                    The estimate covers token charges entered in the calculator.
                    Web search, code execution, tool use, cloud platform
                    premiums, taxes, and other services may add separate costs.
                  </p>

                  <p>
                    Always check the{" "}
                    <a
                      href="https://platform.claude.com/docs/en/about-claude/pricing"
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-[var(--yellow-dark)]"
                    >
                      official Claude API pricing page
                    </a>{" "}
                    before making a final budget or purchase decision.
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
              title: "Explore More AI Cost Tools",
              content: (
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/tools/openai-api-cost-calculator"
                    className="beeija-btn-outline"
                  >
                    OpenAI API Cost Calculator
                  </Link>

                  <Link
                    href="/categories/ai-cost-calculators"
                    className="beeija-btn-outline"
                  >
                    AI Cost Calculators
                  </Link>

                  <Link href="/tools" className="beeija-btn-outline">
                    All Tools
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
