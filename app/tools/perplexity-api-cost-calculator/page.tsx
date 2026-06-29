import type { Metadata } from "next";
import ToolShell from "@/app/components/ToolShell";
import ToolContent from "@/app/components/ToolContent";
import BeeijaRelatedTools from "@/app/components/BeeijaRelatedTools";
import ToolClient from "./ToolClient";

export const metadata: Metadata = {
  title: "Perplexity API Cost Calculator",

  description:
    "Estimate Perplexity Sonar API costs using model tokens, search context fees, Deep Research usage, requests, and monthly volume.",

  keywords: [
    "Perplexity API cost calculator",
    "Sonar API cost calculator",
    "Perplexity pricing calculator",
    "Sonar Pro cost calculator",
    "Sonar Reasoning Pro cost calculator",
    "Sonar Deep Research cost calculator",
    "Perplexity token cost calculator",
    "Perplexity API pricing",
    "AI search API cost calculator",
    "LLM API cost calculator",
  ],

  alternates: {
    canonical: "https://beeija.com/tools/perplexity-api-cost-calculator",
  },

  openGraph: {
    title: "Perplexity API Cost Calculator",
    description:
      "Estimate Sonar API costs from tokens, search context fees, Deep Research usage, requests, and monthly volume.",
    url: "https://beeija.com/tools/perplexity-api-cost-calculator",
    siteName: "Beeija",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Perplexity API Cost Calculator",
    description:
      "Estimate Perplexity Sonar API costs using your own token and request usage.",
  },
};

const faqs = [
  {
    question: "How is Perplexity Sonar API cost calculated?",
    answer:
      "For Sonar, Sonar Pro, and Sonar Reasoning Pro, the total combines token cost with a request fee based on search context size. Sonar Deep Research also includes citation, search-query, and reasoning-token charges.",
  },
  {
    question: "What is the search context fee?",
    answer:
      "The search context fee is charged per 1,000 requests. Low, medium, and high context sizes use different rates because they retrieve different amounts of web information.",
  },
  {
    question: "Does Sonar Deep Research use the same pricing?",
    answer:
      "No. Sonar Deep Research has input, output, citation, search-query, and reasoning-token charges. It does not use the same low, medium, or high request-fee table.",
  },
  {
    question: "Can I compare Perplexity models?",
    answer:
      "Yes. Keep the same request and token values, then switch models to compare estimated monthly costs.",
  },
  {
    question: "Are the results exact?",
    answer:
      "No. They are planning estimates. Your final bill may change because of price updates, different search behaviour, extra tools, taxes, discounts, or usage not entered here.",
  },
  {
    question: "Can I enter my own Perplexity prices?",
    answer:
      "Yes. Turn on custom pricing and enter your own token rates and request fees.",
  },
];

export default function PerplexityApiCostCalculatorPage() {
  return (
    <ToolShell
      category="AI Cost Calculators"
      title="Perplexity API Cost Calculator"
      description="Estimate Perplexity Sonar API costs using tokens, search context fees, Deep Research usage, requests, and monthly volume."
    >
      <ToolClient />

      <div className="mt-16">
        <ToolContent
          intro={
            <p>
              Perplexity API costs can include both token charges and search
              request fees. This calculator helps you estimate Sonar, Sonar Pro,
              Sonar Reasoning Pro, and Sonar Deep Research costs before you
              build or scale an AI search feature.
            </p>
          }
          sections={[
            {
              title: "How the Perplexity API Cost Calculator Works",
              content: (
                <>
                  <p>
                    Choose a Sonar model and enter the expected number of
                    requests per month. Then add the average input and output
                    tokens used by one request.
                  </p>

                  <p>
                    For Sonar, Sonar Pro, and Sonar Reasoning Pro, choose a low,
                    medium, or high search context size. The calculator adds the
                    matching request fee to the token cost.
                  </p>

                  <p>
                    For Sonar Deep Research, enter citation tokens, reasoning
                    tokens, and search queries because those items have separate
                    prices.
                  </p>
                </>
              ),
            },
            {
              title: "What to Enter for a Useful Estimate",
              content: (
                <>
                  <p>
                    Use average values from real requests. Include the system
                    prompt, user question, chat history, and any other input
                    sent to the model.
                  </p>

                  <p>
                    Use a realistic output length. Research answers with many
                    citations may be much longer than short search summaries.
                  </p>

                  <p>
                    Test a normal month and a busy month. Search depth, answer
                    length, and request volume can all change the final cost.
                  </p>
                </>
              ),
            },
            {
              title: "Common Ways to Use This Calculator",
              content: (
                <ul className="list-disc space-y-2 pl-6">
                  <li>Estimate the monthly cost of an AI search feature.</li>
                  <li>Compare Sonar, Sonar Pro, and Sonar Reasoning Pro.</li>
                  <li>Test low, medium, and high search context fees.</li>
                  <li>Estimate Sonar Deep Research usage.</li>
                  <li>Calculate cost per request, day, month, and year.</li>
                  <li>Prepare an early Perplexity API budget.</li>
                </ul>
              ),
            },
            {
              title: "Simple Perplexity API Cost Example",
              content: (
                <>
                  <p>
                    Imagine a search assistant with 25,000 requests per month.
                    Each request uses 900 input tokens and 500 output tokens.
                    Choose Sonar Pro and a medium search context size.
                  </p>

                  <p>
                    The calculator will show token cost, request-fee cost, and
                    the total monthly estimate. You can then switch to Sonar or
                    Sonar Reasoning Pro without changing the workload.
                  </p>
                </>
              ),
            },
            {
              title: "Pricing and Estimate Notes",
              content: (
                <>
                  <p>
                    Built-in prices were checked against Perplexity's official
                    API pricing page on June 18, 2026. Perplexity may change
                    models, prices, limits, or billing rules at any time.
                  </p>

                  <p>
                    Agent API tools, Search API calls, embeddings, sandbox
                    sessions, and other services may have separate charges.
                  </p>

                  <p>
                    Always check the{" "}
                    <a
                      href="https://docs.perplexity.ai/docs/getting-started/pricing"
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-[var(--yellow-dark)]"
                    >
                      official Perplexity API pricing page
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
                <BeeijaRelatedTools
                  currentHref="/tools/perplexity-api-cost-calculator"
                />
              ),
            },
          ]}
        />
      </div>
    </ToolShell>
  );
}
