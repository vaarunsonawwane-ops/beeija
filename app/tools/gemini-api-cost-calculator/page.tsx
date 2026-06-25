import type { Metadata } from "next";
import Link from "next/link";
import ToolShell from "@/app/components/ToolShell";
import ToolContent from "@/app/components/ToolContent";
import ToolClient from "./ToolClient";

export const metadata: Metadata = {
  title: "Gemini API Cost Calculator",

  description:
    "Estimate Google Gemini API costs for current Pro, Flash, and Flash-Lite models using input tokens, cached input, output tokens, Batch API, and monthly usage.",

  keywords: [
    "Gemini API cost calculator",
    "Google Gemini pricing calculator",
    "Gemini token cost calculator",
    "Gemini 3.1 Pro cost calculator",
    "Gemini 3.5 Flash cost calculator",
    "Gemini 3.1 Flash-Lite cost calculator",
    "Gemini 2.5 Pro cost calculator",
    "Gemini 2.5 Flash cost calculator",
    "Gemini Flash-Lite cost calculator",
    "Google AI API cost calculator",
    "Gemini API pricing",
    "Gemini context caching cost",
    "Gemini Batch API cost",
    "LLM API cost calculator",
    "AI token pricing calculator",
  ],

  alternates: {
    canonical: "https://beeija.com/tools/gemini-api-cost-calculator",
  },

  openGraph: {
    title: "Gemini API Cost Calculator",
    description:
      "Estimate Gemini API costs from input tokens, cached input, output tokens, Batch API, and monthly usage.",
    url: "https://beeija.com/tools/gemini-api-cost-calculator",
    siteName: "Beeija",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Gemini API Cost Calculator",
    description:
      "Estimate current Google Gemini Pro, Flash, and Flash-Lite API costs using your own token usage.",
  },
};

const faqs = [
  {
    question: "How is Gemini API cost calculated?",
    answer:
      "The calculator multiplies input, cached input, and output tokens by the selected Gemini model rates. It then shows the estimated cost per request, day, month, and year.",
  },
  {
    question: "What are cached input tokens in Gemini?",
    answer:
      "Cached input tokens are tokens reused from stored context. They can use a lower token rate, but context cache storage may create a separate hourly charge that is not included in this calculator.",
  },
  {
    question: "Why do some Gemini Pro models have two price levels?",
    answer:
      "Gemini 3.1 Pro Preview and Gemini 2.5 Pro use one rate for prompts up to 200,000 tokens and a higher rate for prompts above 200,000 tokens. Choose the matching prompt size in the calculator.",
  },
  {
    question: "Does Gemini Batch API cost less?",
    answer:
      "Yes. Google lists lower Batch API token rates for supported Gemini models. The calculator uses the official Batch rates for the selected model.",
  },
  {
    question: "Are thinking tokens included in the output price?",
    answer:
      "Yes. Google's pricing page states that output pricing includes thinking tokens for these Gemini models.",
  },
  {
    question: "Are the results exact?",
    answer:
      "No. They are planning estimates. Your final bill may change because of price updates, grounding, cache storage, images, audio, tools, taxes, discounts, or other services.",
  },
];

export default function GeminiApiCostCalculatorPage() {
  return (
    <ToolShell
      category="AI Cost Calculators"
      title="Gemini API Cost Calculator"
      description="Estimate Google Gemini API costs using input tokens, cached input, output tokens, Batch API, prompt size, and monthly usage."
    >
      <ToolClient />

      <div className="mt-16">
        <ToolContent
          intro={
            <p>
              Gemini API costs can change with the model, prompt size, output
              length, cached input, and pricing mode. This calculator brings
              those values together so you can test a small launch, a normal
              month, and a higher-usage case before you build.
            </p>
          }
          sections={[
            {
              title: "How the Gemini API Cost Calculator Works",
              content: (
                <>
                  <p>
                    Choose a Gemini model and enter the average input and output
                    tokens used by one request. You can also enter the share of
                    input tokens that may use cached pricing.
                  </p>

                  <p>
                    Enter the number of requests expected in one month. The
                    calculator shows uncached input cost, cached input cost,
                    output cost, and the total cost per request, day, month, and
                    year.
                  </p>

                  <p>
                    For Gemini Pro models with long-context tiers, select whether the prompt is up to
                    200,000 tokens or above 200,000 tokens because the official
                    token rates are different.
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
                    message, prompt, chat history, retrieved text, image or
                    document tokens, and other content sent to the model.
                  </p>

                  <p>
                    For output, include the answer and any thinking tokens that
                    are billed as output. Longer answers and larger thinking
                    budgets can increase the final cost.
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
                  <li>Estimate the monthly cost of a Gemini chatbot.</li>
                  <li>Compare current Gemini Pro, Flash, and Flash-Lite models.</li>
                  <li>Test the possible saving from cached input.</li>
                  <li>Compare Standard and Batch API pricing.</li>
                  <li>Review the effect of prompts above 200,000 tokens.</li>
                  <li>Prepare an early Google AI API budget.</li>
                </ul>
              ),
            },
            {
              title: "Simple Gemini API Cost Example",
              content: (
                <>
                  <p>
                    Imagine an AI assistant with 60,000 requests per month. Each
                    request uses 1,200 input tokens and 400 output tokens. If
                    25% of the input may use cached pricing, enter those values
                    and choose Gemini 3.5 Flash.
                  </p>

                  <p>
                    The result shows the separate input, cached input, and
                    output costs. You can then switch to Gemini 3.1 Pro Preview or
                    Gemini 3.1 Flash-Lite without changing the workload.
                  </p>
                </>
              ),
            },
            {
              title: "Pricing and Estimate Notes",
              content: (
                <>
                  <p>
                    Built-in prices were checked against Google's official
                    Gemini Developer API pricing page on June 19, 2026. Google
                    may change models, prices, limits, or billing rules at any
                    time.
                  </p>

                  <p>
                    This calculator covers the token charges entered above.
                    Context cache storage, Google Search grounding, Google Maps
                    grounding, images, audio, video, taxes, and other services
                    may add separate costs.
                  </p>

                  <p>
                    Always check the{" "}
                    <a
                      href="https://ai.google.dev/gemini-api/docs/pricing"
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-[var(--yellow-dark)]"
                    >
                      official Gemini API pricing page
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
              title: "Explore Related AI Cost Tools",
              content: (
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/tools/openai-api-cost-calculator"
                    className="beeija-btn-outline"
                  >
                    OpenAI API Cost Calculator
                  </Link>

                  <Link
                    href="/tools/claude-api-cost-calculator"
                    className="beeija-btn-outline"
                  >
                    Claude API Cost Calculator
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
                    href="/tools/ai-batch-api-savings-calculator"
                    className="beeija-btn-outline"
                  >
                    AI Batch API Savings Calculator
                  </Link>

                  <Link
                    href="/tools/ai-model-routing-savings-calculator"
                    className="beeija-btn-outline"
                  >
                    AI Model Routing Savings Calculator
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
