import type { Metadata } from "next";
import Link from "next/link";
import ToolShell from "@/app/components/ToolShell";
import ToolContent from "@/app/components/ToolContent";
import ToolClient from "./ToolClient";

export const metadata: Metadata = {
  title: "DeepSeek API Cost Calculator",
  description:
    "Estimate DeepSeek API costs for V4 Flash and V4 Pro using cache-hit input, cache-miss input, output tokens, requests, and monthly usage.",
  keywords: [
    "DeepSeek API cost calculator",
    "DeepSeek pricing calculator",
    "DeepSeek token cost calculator",
    "DeepSeek V4 cost calculator",
    "DeepSeek V4 Flash cost calculator",
    "DeepSeek V4 Pro cost calculator",
    "DeepSeek cache hit pricing",
    "DeepSeek cache miss pricing",
    "DeepSeek monthly cost calculator",
    "LLM API cost calculator",
  ],
  alternates: {
    canonical: "https://beeija.com/tools/deepseek-api-cost-calculator",
  },
  openGraph: {
    title: "DeepSeek API Cost Calculator",
    description:
      "Estimate DeepSeek V4 Flash and V4 Pro API costs from cache-hit input, cache-miss input, output tokens, and monthly usage.",
    url: "https://beeija.com/tools/deepseek-api-cost-calculator",
    siteName: "Beeija",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DeepSeek API Cost Calculator",
    description:
      "Estimate DeepSeek API token costs using your own requests, cache use, and output size.",
  },
};

const faqs = [
  {
    question: "How is DeepSeek API cost calculated?",
    answer:
      "The calculator multiplies cache-miss input, cache-hit input, and output tokens by the selected DeepSeek model rates. It then shows the estimated cost per request, day, month, and year.",
  },
  {
    question: "What is the difference between cache-hit and cache-miss input?",
    answer:
      "Cache-hit input matches a stored prompt prefix and uses a lower rate. Cache-miss input does not match the cache and uses the normal input rate.",
  },
  {
    question: "Is DeepSeek context caching automatic?",
    answer:
      "DeepSeek says its disk-based context cache is enabled by default. Cache hits are still best effort and are not guaranteed for every request.",
  },
  {
    question: "Can I compare DeepSeek V4 Flash and V4 Pro?",
    answer:
      "Yes. Keep the same request and token values, then switch models to compare their estimated costs.",
  },
  {
    question: "Are the results exact?",
    answer:
      "No. They are planning estimates. Your final bill may change because of price updates, real cache-hit rates, retries, taxes, discounts, or other services.",
  },
  {
    question: "Can I enter my own DeepSeek prices?",
    answer:
      "Yes. Turn on custom pricing and enter your own cache-hit input, cache-miss input, and output rates per million tokens.",
  },
];

export default function DeepSeekApiCostCalculatorPage() {
  return (
    <ToolShell
      category="AI Cost Calculators"
      title="DeepSeek API Cost Calculator"
      description="Estimate DeepSeek V4 Flash and V4 Pro API costs using cache-hit input, cache-miss input, output tokens, requests, and monthly usage."
    >
      <ToolClient />

      <div className="mt-16">
        <ToolContent
          intro={
            <p>
              DeepSeek API costs can change with the model, input size, output
              length, request count, and cache-hit rate. This calculator brings
              those values together so you can test a small launch, a normal
              month, and a higher-usage case before you build.
            </p>
          }
          sections={[
            {
              title: "How the DeepSeek API Cost Calculator Works",
              content: (
                <>
                  <p>
                    Choose DeepSeek V4 Flash or V4 Pro. Enter the expected
                    number of requests, average input tokens, average output
                    tokens, and the share of input tokens that may be cache
                    hits.
                  </p>
                  <p>
                    The calculator separates cache-hit input, cache-miss input,
                    and output costs. It then shows the estimated cost per
                    request, day, month, and year.
                  </p>
                  <p>
                    You can also turn on custom pricing when DeepSeek updates
                    its rates or when you want to test a private rate.
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
                    message, prompt, chat history, retrieved text, and other
                    content sent to the model.
                  </p>
                  <p>
                    For the cache-hit percentage, use a careful estimate. A
                    repeated system prompt or shared document prefix may improve
                    cache use, but DeepSeek does not guarantee a hit for every
                    repeated request.
                  </p>
                  <p>
                    Test at least three cases: a small launch, a normal month,
                    and a busy month.
                  </p>
                </>
              ),
            },
            {
              title: "Common Ways to Use This Calculator",
              content: (
                <ul className="list-disc space-y-2 pl-6">
                  <li>Estimate the monthly cost of a DeepSeek chatbot.</li>
                  <li>Compare DeepSeek V4 Flash and V4 Pro.</li>
                  <li>Test the possible saving from context caching.</li>
                  <li>Estimate cost per request, day, month, and year.</li>
                  <li>Review the effect of longer prompts or answers.</li>
                  <li>Prepare an early DeepSeek API budget.</li>
                </ul>
              ),
            },
            {
              title: "Simple DeepSeek API Cost Example",
              content: (
                <>
                  <p>
                    Imagine an AI assistant with 80,000 requests per month. Each
                    request uses 1,500 input tokens and 450 output tokens. If
                    30% of the input may be a cache hit, enter those values and
                    choose DeepSeek V4 Flash.
                  </p>
                  <p>
                    You can then switch to V4 Pro without changing the workload.
                  </p>
                </>
              ),
            },
            {
              title: "Pricing and Estimate Notes",
              content: (
                <>
                  <p>
                    Built-in prices were checked against DeepSeek's official
                    API pricing page on June 17, 2026.
                  </p>
                  <p>
                    Context caching is enabled by default, but cache hits are
                    best effort. Real cache use may differ from the percentage
                    entered here.
                  </p>
                  <p>
                    Always check the{" "}
                    <a
                      href="https://api-docs.deepseek.com/quick_start/pricing"
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-[var(--yellow-dark)]"
                    >
                      official DeepSeek API pricing page
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
