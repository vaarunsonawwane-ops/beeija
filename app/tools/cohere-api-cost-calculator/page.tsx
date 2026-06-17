import type { Metadata } from "next";
import Link from "next/link";
import ToolShell from "@/app/components/ToolShell";
import ToolContent from "@/app/components/ToolContent";
import ToolClient from "./ToolClient";

export const metadata: Metadata = {
  title: "Cohere API Cost Calculator",

  description:
    "Estimate Cohere API costs for Command A, Command R+, Command R, and Command R7B using input tokens, output tokens, requests, and monthly usage.",

  keywords: [
    "Cohere API cost calculator",
    "Cohere pricing calculator",
    "Command A cost calculator",
    "Command R cost calculator",
    "Command R Plus cost calculator",
    "Command R7B cost calculator",
    "Cohere token cost calculator",
    "Cohere API pricing",
    "Cohere monthly cost calculator",
    "LLM API cost calculator",
  ],

  alternates: {
    canonical: "https://beeija.com/tools/cohere-api-cost-calculator",
  },

  openGraph: {
    title: "Cohere API Cost Calculator",
    description:
      "Estimate Cohere Command API costs from input tokens, output tokens, requests, and monthly usage.",
    url: "https://beeija.com/tools/cohere-api-cost-calculator",
    siteName: "Beeija",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Cohere API Cost Calculator",
    description:
      "Estimate Command A, Command R+, Command R, and Command R7B API costs using your own token usage.",
  },
};

const faqs = [
  {
    question: "How is Cohere API cost calculated?",
    answer:
      "The calculator multiplies total billed input and output tokens by the selected Cohere model rates. It then shows the estimated cost per request, day, month, and year.",
  },
  {
    question: "What are billed tokens in Cohere?",
    answer:
      "Cohere API responses can show both total tokens and billed tokens. Billed tokens are the tokens used for pricing, so they are the best values to use when you have real usage data.",
  },
  {
    question: "Can I compare Cohere Command models?",
    answer:
      "Yes. Keep the same request and token values, then switch between Command A, Command R+, Command R, and Command R7B.",
  },
  {
    question: "Does this calculator include Cohere Embed or Rerank?",
    answer:
      "No. This calculator is for text-generation token costs. Embed is priced by embedded tokens, while Rerank is priced by search units.",
  },
  {
    question: "Are trial API calls included?",
    answer:
      "Cohere says trial-key usage is free but limited. This calculator is mainly for planning production token costs.",
  },
  {
    question: "Can I enter my own Cohere prices?",
    answer:
      "Yes. Turn on custom pricing and enter your own input and output rates per million tokens.",
  },
];

export default function CohereApiCostCalculatorPage() {
  return (
    <ToolShell
      category="AI Cost Calculators"
      title="Cohere API Cost Calculator"
      description="Estimate Cohere Command API costs using input tokens, output tokens, requests, and monthly usage."
    >
      <ToolClient />

      <div className="mt-16">
        <ToolContent
          intro={
            <p>
              Cohere API costs can change with the model, prompt size, answer
              length, and request count. This calculator helps you test a small
              launch, a normal month, and a higher-usage case before you build.
            </p>
          }
          sections={[
            {
              title: "How the Cohere API Cost Calculator Works",
              content: (
                <>
                  <p>
                    Choose a Cohere Command model and enter the expected number
                    of requests per month. Then add the average billed input and
                    output tokens used by one request.
                  </p>

                  <p>
                    The calculator separates input and output costs and shows
                    the estimated cost per request, day, month, and year.
                  </p>

                  <p>
                    You can also turn on custom pricing when Cohere updates its
                    rates or when you use a private price.
                  </p>
                </>
              ),
            },
            {
              title: "What to Enter for a Useful Estimate",
              content: (
                <>
                  <p>
                    Use billed token values when they are available in your
                    Cohere API response. These are the tokens used for billing.
                  </p>

                  <p>
                    If you are planning before launch, include the system
                    message, prompt, chat history, retrieved text, and expected
                    answer length in your estimate.
                  </p>

                  <p>
                    Test a normal month and a busy month so you can see how the
                    cost may grow with more users and requests.
                  </p>
                </>
              ),
            },
            {
              title: "Common Ways to Use This Calculator",
              content: (
                <ul className="list-disc space-y-2 pl-6">
                  <li>Estimate the monthly cost of a Cohere chatbot.</li>
                  <li>Compare Command A, Command R+, Command R, and R7B.</li>
                  <li>Estimate cost per request, day, month, and year.</li>
                  <li>Test the effect of longer prompts and answers.</li>
                  <li>Plan a RAG or agent workload before launch.</li>
                  <li>Prepare an early Cohere API budget.</li>
                </ul>
              ),
            },
            {
              title: "Simple Cohere API Cost Example",
              content: (
                <>
                  <p>
                    Imagine a RAG assistant with 40,000 requests per month. Each
                    request uses 1,600 billed input tokens and 350 billed output
                    tokens. Enter those values and choose Command R.
                  </p>

                  <p>
                    The calculator will show separate input and output costs.
                    You can then switch to Command A, Command R+, or Command R7B
                    without changing the workload.
                  </p>
                </>
              ),
            },
            {
              title: "Pricing and Estimate Notes",
              content: (
                <>
                  <p>
                    Built-in prices were checked against Cohere&apos;s official
                    model and pricing pages on June 18, 2026. Cohere may change
                    models, prices, limits, or billing rules at any time.
                  </p>

                  <p>
                    This calculator covers text-generation token charges only.
                    Embed, Rerank, transcription, private deployment, cloud
                    platform fees, taxes, and other services may add separate
                    costs.
                  </p>

                  <p>
                    Always check the{" "}
                    <a
                      href="https://cohere.com/pricing"
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-[var(--yellow-dark)]"
                    >
                      official Cohere pricing page
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
                    href="/tools/mistral-api-cost-calculator"
                    className="beeija-btn-outline"
                  >
                    Mistral API Cost Calculator
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
