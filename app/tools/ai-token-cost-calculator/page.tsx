import type { Metadata } from "next";
import ToolShell from "@/app/components/ToolShell";
import ToolContent from "@/app/components/ToolContent";
import BeeijaRelatedTools from "@/app/components/BeeijaRelatedTools";
import ToolClient from "./ToolClient";

export const metadata: Metadata = {
  title: "AI Token Cost Calculator",

  description:
    "Estimate AI token costs using input tokens, cached input tokens, output tokens, request volume, and your own price per million tokens.",

  keywords: [
    "AI token cost calculator",
    "token cost calculator",
    "LLM token cost calculator",
    "AI API cost calculator",
    "input output token calculator",
    "cached token cost calculator",
    "AI pricing calculator",
    "token usage calculator",
    "monthly AI cost calculator",
    "cost per request calculator",
  ],

  alternates: {
    canonical: "https://beeija.com/tools/ai-token-cost-calculator",
  },

  openGraph: {
    title: "AI Token Cost Calculator",
    description:
      "Estimate AI API costs from input tokens, cached input, output tokens, requests, and custom prices.",
    url: "https://beeija.com/tools/ai-token-cost-calculator",
    siteName: "Beeija",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "AI Token Cost Calculator",
    description:
      "Estimate AI token costs using your own request volume and token prices.",
  },
};

const faqs = [
  {
    question: "How is AI token cost calculated?",
    answer:
      "The calculator multiplies uncached input, cached input, and output tokens by the prices you enter. It then shows the estimated cost per request, day, month, and year.",
  },
  {
    question: "What is the difference between input and output tokens?",
    answer:
      "Input tokens are sent to the model. Output tokens are returned by the model. Providers may charge different rates for each.",
  },
  {
    question: "What are cached input tokens?",
    answer:
      "Cached input tokens are repeated prompt tokens that may qualify for a lower price. Not every provider or request supports cached pricing.",
  },
  {
    question: "Can I use this for any AI provider?",
    answer:
      "Yes. Enter the provider's price per million input, cached input, and output tokens.",
  },
  {
    question: "Are the results exact?",
    answer:
      "No. They are planning estimates. Your final bill may change because of retries, tools, images, audio, taxes, discounts, or other services.",
  },
  {
    question: "Can I compare two models?",
    answer:
      "Yes. Calculate one model, note the result, then enter the second model's prices while keeping the same workload.",
  },
];

export default function AiTokenCostCalculatorPage() {
  return (
    <ToolShell
      category="AI Cost Calculators"
      title="AI Token Cost Calculator"
      description="Estimate AI API costs using requests, input tokens, cached input tokens, output tokens, and your own pricing."
    >
      <ToolClient />

      <div className="mt-16">
        <ToolContent
          intro={
            <p>
              AI token prices are often shown per one million tokens, while your
              real workload may use thousands of requests each month. This
              calculator turns those values into a simple cost estimate.
            </p>
          }
          sections={[
            {
              title: "How the AI Token Cost Calculator Works",
              content: (
                <>
                  <p>
                    Enter your expected requests per month and the average input
                    and output tokens used by one request.
                  </p>

                  <p>
                    Add the provider's input, cached-input, and output prices per
                    one million tokens. The calculator then separates each cost
                    and shows the total.
                  </p>

                  <p>
                    You can also enter the share of input tokens that may use
                    cached pricing.
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
                    text, tool instructions, and other text sent to the model in
                    your input estimate.
                  </p>

                  <p>
                    Use the average answer length expected in real use. A short
                    classification task and a long report can have very
                    different output costs.
                  </p>

                  <p>
                    Test a small launch, a normal month, and a busy month to see
                    how the cost may change as usage grows.
                  </p>
                </>
              ),
            },
            {
              title: "Common Ways to Use This Calculator",
              content: (
                <ul className="list-disc space-y-2 pl-6">
                  <li>Estimate the monthly cost of an AI chatbot.</li>
                  <li>Calculate cost per request or per user.</li>
                  <li>Compare two models with the same workload.</li>
                  <li>Test the possible saving from cached input.</li>
                  <li>Review the effect of longer prompts and answers.</li>
                  <li>Prepare an early AI API budget.</li>
                </ul>
              ),
            },
            {
              title: "Simple AI Token Cost Example",
              content: (
                <>
                  <p>
                    Imagine an AI feature with 100,000 requests per month. Each
                    request uses 1,000 input tokens and 300 output tokens. The
                    provider charges $1 per million input tokens and $5 per
                    million output tokens.
                  </p>

                  <p>
                    Enter those values to see the estimated input, output, and
                    monthly cost. You can then replace the prices with another
                    model's rates for comparison.
                  </p>
                </>
              ),
            },
            {
              title: "Pricing and Estimate Notes",
              content: (
                <>
                  <p>
                    This calculator does not store provider prices. You enter
                    the rates you want to test, so it can be used with any AI
                    model or provider.
                  </p>

                  <p>
                    Check the latest official pricing page before making a
                    final budget. Some providers also charge for tools, images,
                    audio, storage, web search, or other services.
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
                <BeeijaRelatedTools
                  currentHref="/tools/ai-token-cost-calculator"
                />
              ),
            },
          ]}
        />
      </div>
    </ToolShell>
  );
}
