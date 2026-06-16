import type { Metadata } from "next";
import Link from "next/link";
import ToolShell from "@/app/components/ToolShell";
import ToolContent from "@/app/components/ToolContent";
import ToolClient from "./ToolClient";

export const metadata: Metadata = {
  title: "OpenAI API Cost Calculator",

  description:
    "Estimate OpenAI API costs for GPT models using input tokens, cached input tokens, output tokens, requests, and monthly usage.",

  keywords: [
    "OpenAI API cost calculator",
    "OpenAI pricing calculator",
    "GPT API cost calculator",
    "GPT token cost calculator",
    "OpenAI token calculator",
    "OpenAI API pricing",
    "GPT-5.5 cost calculator",
    "GPT-5.4 cost calculator",
    "OpenAI monthly cost calculator",
    "LLM API cost calculator",
    "AI token pricing calculator",
    "cached token cost calculator",
  ],

  alternates: {
    canonical: "https://beeija.com/tools/openai-api-cost-calculator",
  },

  openGraph: {
    title: "OpenAI API Cost Calculator",
    description:
      "Estimate monthly OpenAI API costs from requests, input tokens, cached input, output tokens, and model pricing.",
    url: "https://beeija.com/tools/openai-api-cost-calculator",
    siteName: "Beeija",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "OpenAI API Cost Calculator",
    description:
      "Estimate OpenAI API token costs for GPT models using your own usage numbers.",
  },
};

const faqs = [
  {
    question: "How is OpenAI API cost calculated?",
    answer:
      "The calculator multiplies your total input, cached input, and output tokens by the selected model rates. It then adds the three amounts to show the estimated cost per request, day, and month.",
  },
  {
    question: "What is the difference between input and output tokens?",
    answer:
      "Input tokens are the prompt, system message, chat history, and other text sent to the model. Output tokens are the text returned by the model. The two token types may have different prices.",
  },
  {
    question: "What are cached input tokens?",
    answer:
      "Cached input tokens are repeated input tokens that qualify for a lower cached-input rate. The real amount depends on your API setup and whether the provider accepts the input for caching.",
  },
  {
    question: "Does ChatGPT Plus include OpenAI API usage?",
    answer:
      "No. ChatGPT plans and OpenAI API usage are billed separately. This calculator is for API usage, not a ChatGPT subscription.",
  },
  {
    question: "Are the calculator results exact?",
    answer:
      "No. The results are planning estimates. Your final bill may change because of price updates, retries, tool calls, images, audio, web search, storage, taxes, discounts, or other paid services.",
  },
  {
    question: "Can I enter my own OpenAI prices?",
    answer:
      "Yes. Turn on custom pricing and enter your own input, cached input, and output rates. This is useful when prices change or when you have a special rate.",
  },
];

export default function OpenAIApiCostCalculatorPage() {
  return (
    <ToolShell
      category="AI Cost Calculators"
      title="OpenAI API Cost Calculator"
      description="Estimate OpenAI API costs using requests, input tokens, cached input, output tokens, and current or custom model prices."
    >
      <ToolClient />

      <div className="mt-16">
        <ToolContent
          intro={
            <>
              <p>
                OpenAI API costs can change with the model, prompt size, answer
                length, number of requests, and cached input use. This
                calculator brings those values together so you can test a small
                launch, a normal month, and a higher-usage case before you
                build.
              </p>
            </>
          }
          sections={[
            {
              title: "How the OpenAI API Cost Calculator Works",
              content: (
                <>
                  <p>
                    Choose a model, enter the number of API requests, and add
                    the average input and output tokens used by each request.
                    You can also enter the share of input tokens that may use
                    cached pricing.
                  </p>

                  <p>
                    The calculator estimates uncached input cost, cached input
                    cost, and output cost separately. It then shows the total
                    cost per request, per day, and per month.
                  </p>

                  <p>
                    The built-in rates are planning defaults. You can turn on
                    custom pricing and replace them with the latest official
                    rates or your own agreed price.
                  </p>
                </>
              ),
            },
            {
              title: "What to Enter for a Useful Estimate",
              content: (
                <>
                  <p>
                    Start with the average request, not the smallest possible
                    request. Include the system message, prompt, chat history,
                    retrieved text, and tool instructions in the input-token
                    estimate.
                  </p>

                  <p>
                    For output, use the average answer length you expect in real
                    use. A support chatbot, coding assistant, report generator,
                    and short classification task can have very different
                    output sizes.
                  </p>

                  <p>
                    It is useful to calculate at least three cases: a small
                    launch, a normal month, and a busy month. This shows how
                    quickly the cost may change as users and requests grow.
                  </p>
                </>
              ),
            },
            {
              title: "Common Ways to Use This Calculator",
              content: (
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    Estimate the monthly cost of an AI chatbot or assistant.
                  </li>
                  <li>
                    Compare GPT models using the same token workload.
                  </li>
                  <li>
                    Test how longer prompts or answers may change the bill.
                  </li>
                  <li>
                    Estimate cost per user, request, day, and month.
                  </li>
                  <li>
                    Check the possible saving from cached input or Batch API
                    use.
                  </li>
                  <li>
                    Prepare an early AI budget before development begins.
                  </li>
                </ul>
              ),
            },
            {
              title: "Simple OpenAI API Cost Example",
              content: (
                <>
                  <p>
                    Imagine an AI feature that receives 50,000 requests per
                    month. Each request uses about 1,000 input tokens and 300
                    output tokens. If 20% of the input can use cached pricing,
                    enter those values and choose the model you want to test.
                  </p>

                  <p>
                    The result will show the separate input, cached input, and
                    output costs. You can then choose another model without
                    changing the workload to compare the price more fairly.
                  </p>
                </>
              ),
            },
            {
              title: "Pricing and Estimate Notes",
              content: (
                <>
                  <p>
                    Built-in model prices were checked against the official
                    OpenAI API pricing page on June 16, 2026. OpenAI may change
                    models, prices, billing rules, or service tiers at any time.
                  </p>

                  <p>
                    Batch API pricing is shown as an estimated 50% reduction on
                    token charges. Other services such as web search, images,
                    audio, containers, storage, and third-party infrastructure
                    are not included in the token estimate.
                  </p>

                  <p>
                    Always check the{" "}
                    <a
                      href="https://openai.com/api/pricing/"
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-[var(--yellow-dark)]"
                    >
                      official OpenAI API pricing page
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
