import type { Metadata } from "next";
import ToolShell from "@/app/components/ToolShell";
import ToolContent from "@/app/components/ToolContent";
import BeeijaRelatedTools from "@/app/components/BeeijaRelatedTools";
import ToolClient from "./ToolClient";

export const metadata: Metadata = {
  title: "AI Embedding Cost Comparison Calculator",

  description:
    "Compare OpenAI, Google Gemini, Mistral, Voyage AI, and custom embedding costs using document ingestion, chunk overlap, monthly refreshes, query volume, and first-year usage.",

  keywords: [
    "AI embedding cost comparison calculator",
    "embedding API cost calculator",
    "embedding model pricing comparison",
    "OpenAI embedding cost calculator",
    "Gemini embedding cost calculator",
    "Voyage AI cost calculator",
    "Mistral embedding cost calculator",
    "text embedding cost calculator",
    "RAG embedding cost",
    "vector embedding pricing",
    "semantic search cost calculator",
    "embedding cost per million tokens",
    "knowledge base embedding cost",
  ],

  alternates: {
    canonical:
      "https://beeija.com/tools/ai-embedding-cost-comparison-calculator",
  },

  openGraph: {
    title: "AI Embedding Cost Comparison Calculator",
    description:
      "Compare current paid embedding API prices across OpenAI, Google Gemini, Mistral, Voyage AI, and a custom provider.",
    url: "https://beeija.com/tools/ai-embedding-cost-comparison-calculator",
    siteName: "Beeija",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "AI Embedding Cost Comparison Calculator",
    description:
      "Estimate initial indexing, monthly refresh, query embedding, and first-year costs across current embedding models.",
  },
};

const faqs = [
  {
    question: "What usage does the embedding comparison include?",
    answer:
      "It includes the first embedding pass for the document collection, repeated tokens caused by chunk overlap, monthly content refreshes, and embeddings created for search queries.",
  },
  {
    question: "Why does chunk overlap increase embedding cost?",
    answer:
      "Overlap repeats part of the source text in neighbouring chunks. The repeated text is embedded again, so it increases the total token volume.",
  },
  {
    question: "Are free tiers included?",
    answer:
      "No. The built-in comparison uses paid list prices so providers can be compared on the same recurring basis. Free allowances, credits, promotions, and negotiated discounts may reduce the actual bill.",
  },
  {
    question: "Does a lower embedding API price always mean a lower total RAG cost?",
    answer:
      "No. Vector dimensions, storage, retrieval quality, language support, latency, batch support, and the number of chunks can affect the total system cost and usefulness.",
  },
  {
    question: "Why are Google standard and batch options separate?",
    answer:
      "Google publishes separate paid rates for standard and batch embedding requests. Choose the option that matches how the workload will be processed.",
  },
  {
    question: "Can I compare another embedding provider?",
    answer:
      "Yes. Add a custom provider and enter its current price per one million tokens.",
  },
];

export default function AiEmbeddingCostComparisonCalculatorPage() {
  return (
    <ToolShell
      category="AI Cost Calculators"
      title="AI Embedding Cost Comparison Calculator"
      description="Compare current OpenAI, Google Gemini, Mistral, Voyage AI, and custom embedding costs across initial indexing, refreshes, queries, and first-year usage."
    >
      <ToolClient />

      <div className="mt-16">
        <ToolContent
          intro={
            <p>
              Embedding cost is not limited to the first document upload.
              Content refreshes, chunk overlap, and search-query embeddings can
              create continuing usage. This calculator compares the full
              embedding lifecycle across current paid provider rates.
            </p>
          }
          sections={[
            {
              title: "Comparing the Full Embedding Lifecycle",
              content: (
                <>
                  <p>
                    Enter the number of source documents, their average token
                    size, and the overlap added during chunking. The calculator
                    estimates the initial token volume needed to create the
                    document embeddings.
                  </p>

                  <p>
                    Add the percentage of content refreshed each month, monthly
                    search queries, and average tokens in each query. The result
                    separates initial indexing cost from recurring monthly
                    embedding cost.
                  </p>

                  <p>
                    The comparison also shows a first-year total, the selected
                    model&apos;s cost, the lowest paid list-price option, and
                    the possible saving for the same workload.
                  </p>
                </>
              ),
            },
            {
              title: "Why Initial and Monthly Costs Are Different",
              content: (
                <>
                  <p>
                    Initial indexing embeds the whole knowledge base. Monthly
                    operating usage usually includes only changed documents and
                    new search queries.
                  </p>

                  <p>
                    A large existing document collection may therefore create a
                    noticeable one-time indexing cost, while a stable knowledge
                    base can have a much smaller monthly refresh cost.
                  </p>

                  <p>
                    A fast-changing product catalogue, news archive, support
                    centre, or code repository may need a higher refresh
                    percentage.
                  </p>
                </>
              ),
            },
            {
              title: "Using Chunk Overlap Carefully",
              content: (
                <>
                  <p>
                    Chunk overlap can help preserve context between neighbouring
                    passages, but every repeated token increases embedding
                    usage. A 15% overlap means the calculator adds 15% to the
                    document token volume.
                  </p>

                  <p>
                    This is a planning estimate. Real token use depends on the
                    tokenizer, document cleaning, chunking method, metadata,
                    and whether titles or summaries are embedded with each
                    chunk.
                  </p>
                </>
              ),
            },
            {
              title: "Practical Decisions This Tool Supports",
              content: (
                <ul className="list-disc space-y-2 pl-6">
                  <li>Choose an embedding API before building a RAG system.</li>
                  <li>Estimate the first document-indexing bill.</li>
                  <li>Plan monthly re-embedding and search-query costs.</li>
                  <li>Compare standard and batch embedding prices.</li>
                  <li>See the effect of chunk overlap on token usage.</li>
                  <li>Compare a public price with a private provider quote.</li>
                  <li>Estimate first-year embedding spend before scaling.</li>
                </ul>
              ),
            },
            {
              title: "Costs Not Included in This Comparison",
              content: (
                <>
                  <p>
                    The result covers embedding API usage only. Vector database
                    storage, vector reads and writes, reranking, LLM generation,
                    hosting, data transfer, monitoring, taxes, subscriptions,
                    and implementation work may add separate costs.
                  </p>

                  <p>
                    Use the RAG Cost Calculator when planning the full retrieval
                    stack rather than only the embedding layer.
                  </p>
                </>
              ),
            },
            {
              title: "Official Pricing Sources",
              content: (
                <>
                  <p>
                    Built-in paid prices were checked on June 19, 2026 against
                    official OpenAI, Google Gemini API, Mistral, and Voyage AI
                    documentation. Only current listed models used by this
                    calculator are included.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href="https://developers.openai.com/api/docs/models/text-embedding-3-small"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      OpenAI Embedding Pricing
                    </a>

                    <a
                      href="https://ai.google.dev/gemini-api/docs/pricing"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Google Gemini API Pricing
                    </a>

                    <a
                      href="https://docs.mistral.ai/models/model-cards/mistral-embed-23-12"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Mistral Embed Pricing
                    </a>

                    <a
                      href="https://docs.voyageai.com/docs/pricing"
                      target="_blank"
                      rel="noreferrer"
                      className="beeija-btn-outline"
                    >
                      Voyage AI Pricing
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
                <BeeijaRelatedTools
                  currentHref="/tools/ai-embedding-cost-comparison-calculator"
                />
              ),
            },
          ]}
        />
      </div>
    </ToolShell>
  );
}
