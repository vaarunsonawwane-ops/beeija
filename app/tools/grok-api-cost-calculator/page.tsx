import type { Metadata } from "next";
import Link from "next/link";
import ToolShell from "@/app/components/ToolShell";
import ToolContent from "@/app/components/ToolContent";
import ToolClient from "./ToolClient";

export const metadata: Metadata = {
  title: "Grok API Cost Calculator",

  description:
    "Estimate xAI Grok API costs using requests, input tokens, cached input tokens, output tokens, and monthly usage.",

  keywords: [
    "Grok API cost calculator",
    "xAI API cost calculator",
    "Grok pricing calculator",
    "Grok token cost calculator",
    "Grok 4.3 cost calculator",
    "Grok API pricing",
    "xAI pricing calculator",
    "Grok cached token cost",
    "Grok monthly cost calculator",
    "LLM API cost calculator",
  ],

  alternates: {
    canonical: "https://beeija.com/tools/grok-api-cost-calculator",
  },

  openGraph: {
    title: "Grok API Cost Calculator",
    description:
      "Estimate xAI Grok API costs from input tokens, cached input, output tokens, requests, and monthly usage.",
    url: "https://beeija.com/tools/grok-api-cost-calculator",
    siteName: "Beeija",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Grok API Cost Calculator",
    description:
      "Estimate Grok API token costs using your own request and token usage.",
  },
};

const faqs = [
  {
    question: "How is Grok API cost calculated?",
    answer:
      "The calculator multiplies uncached input, cached input, and output tokens by the selected xAI model rates. It then shows the estimated cost per request, day, month, and year.",
  },
  {
    question: "What are cached input tokens?",
    answer:
      "Cached input tokens are repeated input tokens that qualify for a lower cached-token rate. The real amount depends on how your prompts and API requests are structured.",
  },
  {
    question: "Can I compare Grok models?",
    answer:
      "Yes. Keep the same request and token values, then switch models to compare their estimated costs.",
  },
  {
    question: "Does this calculator include tool charges?",
    answer:
      "No. It estimates text token costs only. Agent tools, web search, voice, images, video, storage, and other services may have separate charges.",
  },
  {
    question: "Are the results exact?",
    answer:
      "No. They are planning estimates. Your final bill may change because of price updates, retries, taxes, discounts, tool use, or other paid services.",
  },
  {
    question: "Can I enter my own xAI prices?",
    answer:
      "Yes. Turn on custom pricing and enter your own input, cached input, and output rates per million tokens.",
  },
];

export default function GrokApiCostCalculatorPage() {
  return (
    <ToolShell
      category="AI Cost Calculators"
      title="Grok API Cost Calculator"
      description="Estimate xAI Grok API costs using requests, input tokens, cached input tokens, output tokens, and monthly usage."
    >
      <ToolClient />

      <div className="mt-16">
        <ToolContent
          intro={
            <p>
              Grok API costs can change with the model, prompt size, answer
              length, request count, and cached input use. This calculator helps
              you test a small launch, a normal month, and a higher-usage case
              before you build.
            </p>
          }
          sections={[
            {
              title: "How the Grok API Cost Calculator Works",
              content: (
                <>
                  <p>
                    Choose an xAI model and enter the expected requests per
                    month. Then add the average input and output tokens used by
                    one request.
                  </p>

                  <p>
                    You can also enter the share of input tokens that may use
                    cached pricing. The calculator separates uncached input,
                    cached input, and output costs.
                  </p>

                  <p>
                    The result shows the estimated cost per request, day, month,
                    and year.
                  </p>
                </>
              ),
            },
            {
              title: "What to Enter for a Useful Estimate",
              content: (
                <>
                  <p>
                    Include the system message, prompt, chat history, retrieved
                    text, and other content sent to the model in your input
                    estimate.
                  </p>

                  <p>
                    Use the average answer length you expect in real use. Longer
                    outputs can increase the monthly cost.
                  </p>

                  <p>
                    Test a normal case and a busy case so you can see how the
                    cost may change as usage grows.
                  </p>
                </>
              ),
            },
            {
              title: "Common Ways to Use This Calculator",
              content: (
                <ul className="list-disc space-y-2 pl-6">
                  <li>Estimate the monthly cost of a Grok chatbot.</li>
                  <li>Compare Grok models using the same workload.</li>
                  <li>Test the possible saving from cached input.</li>
                  <li>Estimate cost per request, day, month, and year.</li>
                  <li>Review the effect of longer prompts and answers.</li>
                  <li>Prepare an early xAI API budget.</li>
                </ul>
              ),
            },
            {
              title: "Simple Grok API Cost Example",
              content: (
                <>
                  <p>
                    Imagine an AI assistant with 70,000 requests per month. Each
                    request uses 1,200 input tokens and 350 output tokens. If
                    20% of the input may use cached pricing, enter those values
                    and choose a Grok model.
                  </p>

                  <p>
                    The calculator will show the separate input, cached input,
                    and output costs. You can then switch models without
                    changing the workload.
                  </p>
                </>
              ),
            },
            {
              title: "Pricing and Estimate Notes",
              content: (
                <>
                  <p>
                    Built-in prices were checked against xAI's official model
                    and pricing pages on June 18, 2026. xAI may change models,
                    prices, limits, or billing rules at any time.
                  </p>

                  <p>
                    Built-in text rates are for standard-context requests up to 200K tokens. This calculator covers text token charges only. Agent tools,
                    voice, images, video, storage, taxes, and other services may
                    add separate costs.
                  </p>

                  <p>
                    Always check the{" "}
                    <a
                      href="https://docs.x.ai/developers/pricing"
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-[var(--yellow-dark)]"
                    >
                      official xAI pricing page
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
                    href="/tools/claude-api-cost-calculator"
                    className="beeija-btn-outline"
                  >
                    Claude API Cost Calculator
                  </Link>

                  <Link
                    href="/tools/gemini-api-cost-calculator"
                    className="beeija-btn-outline"
                  >
                    Gemini API Cost Calculator
                  </Link>

                  <Link
                    href="/tools/deepseek-api-cost-calculator"
                    className="beeija-btn-outline"
                  >
                    DeepSeek API Cost Calculator
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
