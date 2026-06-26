import type { Metadata } from "next";
import Link from "next/link";
import ToolShell from "@/app/components/ToolShell";
import ToolContent from "@/app/components/ToolContent";
import ToolClient from "./ToolClient";

export const metadata: Metadata = {
  title: "AI Reranking Cost Calculator",
  description:
    "Compare Voyage AI and Pinecone reranking costs, estimate downstream LLM token savings, calculate net monthly impact, and test custom reranker pricing.",
  keywords: [
    "AI reranking cost calculator",
    "reranker cost calculator",
    "RAG reranking cost",
    "Voyage rerank cost calculator",
    "Pinecone rerank cost calculator",
    "Cohere rerank cost calculator",
    "rerank API pricing comparison",
    "RAG LLM token savings calculator",
    "reranking ROI calculator",
    "RAG cost optimization",
    "rerank cost per query",
    "rerank 2.5 pricing calculator",
    "pinecone rerank pricing",
  ],
  alternates: {
    canonical: "https://beeija.com/tools/ai-reranking-cost-calculator",
  },
  openGraph: {
    title: "AI Reranking Cost Calculator",
    description:
      "Compare current reranking prices and estimate whether reduced LLM context cost can offset the reranker bill.",
    url: "https://beeija.com/tools/ai-reranking-cost-calculator",
    siteName: "Beeija",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Reranking Cost Calculator",
    description:
      "Estimate reranking cost, downstream context savings, net monthly impact, and cost per query.",
  },
};

const faqs = [
  {
    question: "Why do Voyage AI and Pinecone use different billing calculations?",
    answer:
      "Voyage AI prices its current reranker endpoint by processed tokens. Pinecone prices its hosted reranking models by requests. The calculator applies the correct billing method to each option before comparing monthly cost.",
  },
  {
    question: "How are Voyage reranker tokens calculated?",
    answer:
      "Voyage defines processed tokens as query tokens multiplied by the number of documents, plus the tokens in all documents. The calculator applies that formula to every billable reranking request.",
  },
  {
    question: "Why does the tool estimate LLM input savings?",
    answer:
      "Reranking can reduce the number of retrieved documents sent to the language model. Fewer context documents can lower LLM input-token usage, although actual savings depend on the final prompt and workflow.",
  },
  {
    question: "Does a positive net saving mean the reranker is automatically the best choice?",
    answer:
      "No. The estimate covers reranker cost and downstream LLM input-token savings. Retrieval quality, latency, relevance, conversion, support, limits, and engineering work also matter.",
  },
  {
    question: "Why are free allowances excluded?",
    answer:
      "Free allowances can differ by plan and may not continue at production scale. The built-in comparison uses recurring paid list prices so the options are compared consistently.",
  },
  {
    question: "Can I compare Cohere direct pricing or another provider?",
    answer:
      "Yes. Enable custom pricing and enter the current rate and billing unit from the provider's official page or your account quote.",
  },
];

export default function AiRerankingCostCalculatorPage() {
  return (
    <ToolShell
      category="AI Cost Calculators"
      title="AI Reranking Cost Calculator"
      description="Compare current Voyage AI and Pinecone reranking costs, then estimate downstream LLM context savings and the net monthly impact."
    >
      <ToolClient />

      <div className="mt-16">
        <ToolContent
          intro={
            <p>
              Reranking adds another paid step to a RAG or search pipeline, but
              it can also reduce the amount of retrieved context sent to the
              language model. This calculator compares the reranker bill and
              the possible LLM input-token saving in one place.
            </p>
          }
          sections={[
            {
              title: "Comparing Reranking Costs Across Billing Models",
              content: (
                <>
                  <p>
                    Enter monthly searches, candidate documents, average query
                    length, average document length, and retry overhead. The
                    calculator converts the same workload into each
                    provider&apos;s official billing unit.
                  </p>

                  <p>
                    Voyage AI is calculated from processed tokens. Pinecone
                    hosted rerankers are calculated from billable requests. A
                    custom option supports either per-token or per-request
                    pricing.
                  </p>

                  <p>
                    Results include monthly cost, cost per successful query,
                    cost per 1,000 queries, annual cost, and a ranked comparison.
                  </p>
                </>
              ),
            },
            {
              title: "Estimating Downstream LLM Token Savings",
              content: (
                <>
                  <p>
                    Set how many candidate documents are retrieved and how many
                    documents remain after reranking. The difference estimates
                    the context tokens removed before the LLM request.
                  </p>

                  <p>
                    Enter the current LLM input price per one million tokens to
                    estimate the monthly input-token saving. The tool subtracts
                    the selected reranker cost to show a net monthly impact.
                  </p>

                  <p>
                    The estimate assumes one final LLM request per successful
                    search. Multi-step agents, repeated prompts, caching, and
                    provider-specific token rules can change the real result.
                  </p>
                </>
              ),
            },
            {
              title: "Choosing Candidate and Final Document Counts",
              content: (
                <>
                  <p>
                    Candidate documents are the initial search results sent to
                    the reranker. Final documents are the highest-ranked results
                    passed into the LLM prompt.
                  </p>

                  <p>
                    A larger candidate set can improve the chance of finding
                    relevant information, but it increases token-based reranker
                    usage. Sending fewer final documents can reduce LLM context
                    cost, but removing too much context may reduce answer
                    quality.
                  </p>
                </>
              ),
            },
            {
              title: "Practical Decisions This Tool Supports",
              content: (
                <ul className="list-disc space-y-2 pl-6">
                  <li>Compare token-based and request-based reranker pricing.</li>
                  <li>Estimate reranking cost per query and per 1,000 queries.</li>
                  <li>See how candidate-document depth changes the bill.</li>
                  <li>Estimate LLM context tokens removed by reranking.</li>
                  <li>Check whether token savings can offset reranker cost.</li>
                  <li>Compare a public list price with a private provider quote.</li>
                  <li>Plan annual reranking spend before production scale.</li>
                </ul>
              ),
            },
            {
              title: "Built-In Providers and Pricing",
              content: (
                <>
                  <p>
                    The built-in comparison includes current Voyage AI
                    rerank-2.5 and rerank-2.5-lite token prices, plus Pinecone
                    hosted bge-reranker-v2-m3, pinecone-rerank-v0, and
                    cohere-rerank-v3.5 request prices.
                  </p>

                  <p>
                    Direct Cohere pay-as-you-go pricing is not hardcoded because
                    the current public pricing page defines a search unit but
                    does not expose a clear direct production amount in the
                    page content used for this check. Cohere direct pricing can
                    still be entered through the custom option.
                  </p>

                  <p>
                    Prices were checked on June 20, 2026. Free monthly
                    allowances and promotional credits are not deducted.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href="https://docs.voyageai.com/docs/pricing"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Voyage AI Pricing
                    </a>

                    <a
                      href="https://www.pinecone.io/pricing/"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Pinecone Pricing
                    </a>

                    <a
                      href="https://cohere.com/pricing"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Cohere Pricing
                    </a>
                  </div>
                </>
              ),
            },
            {
              title: "Costs and Benefits Not Included",
              content: (
                <>
                  <p>
                    The result does not automatically include embeddings,
                    vector storage, vector reads, LLM output tokens, caching,
                    hosting, observability, engineering work, taxes, support,
                    latency, or the business value of better retrieval quality.
                  </p>

                  <p>
                    Use the RAG Cost Calculator for the wider retrieval stack
                    and the AI Embedding Cost Comparison Calculator for document
                    and query embedding costs.
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
                    href="/tools/rag-cost-calculator"
                    className="beeija-btn-outline"
                  >
                    RAG Cost Calculator
                  </Link>

                  <Link
                    href="/tools/ai-embedding-cost-comparison-calculator"
                    className="beeija-btn-outline"
                  >
                    AI Embedding Cost Comparison
                  </Link>

                  <Link
                    href="/tools/cohere-api-cost-calculator"
                    className="beeija-btn-outline"
                  >
                    Cohere API Cost Calculator
                  </Link>

                  <Link
                    href="/tools/ai-token-cost-calculator"
                    className="beeija-btn-outline"
                  >
                    AI Token Cost Calculator
                  </Link>

                  <Link
                    href="/tools/openai-api-cost-calculator"
                    className="beeija-btn-outline"
                  >
                    OpenAI API Cost Calculator
                  </Link>

                  <Link
                    href="/tools/gemini-api-cost-calculator"
                    className="beeija-btn-outline"
                  >
                    Gemini API Cost Calculator
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
