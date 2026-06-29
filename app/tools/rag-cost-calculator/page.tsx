import type { Metadata } from "next";
import ToolShell from "@/app/components/ToolShell";
import ToolContent from "@/app/components/ToolContent";
import BeeijaRelatedTools from "@/app/components/BeeijaRelatedTools";
import ToolClient from "./ToolClient";

export const metadata: Metadata = {
  title: "RAG Cost Calculator",

  description:
    "Estimate the full cost of a retrieval-augmented generation system using document chunking, embeddings, vector storage, reads, writes, reranking, LLM tokens, refreshes, and setup costs.",

  keywords: [
    "RAG cost calculator",
    "retrieval augmented generation cost calculator",
    "AI RAG pricing calculator",
    "vector database cost calculator",
    "embedding cost calculator",
    "RAG infrastructure cost",
    "RAG cost per query",
    "LLM RAG cost calculator",
    "Pinecone cost calculator",
    "vector storage calculator",
    "RAG unit economics",
    "RAG monthly cost",
    "knowledge base AI cost calculator",
  ],

  alternates: {
    canonical: "https://beeija.com/tools/rag-cost-calculator",
  },

  openGraph: {
    title: "RAG Cost Calculator",
    description:
      "Calculate RAG setup cost, monthly operating cost, vector storage, retrieval, reranking, embeddings, and LLM cost per query.",
    url: "https://beeija.com/tools/rag-cost-calculator",
    siteName: "Beeija",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "RAG Cost Calculator",
    description:
      "Estimate complete retrieval-augmented generation costs from ingestion to each user query.",
  },
};

const faqs = [
  {
    question: "What costs should a RAG estimate include?",
    answer:
      "A complete estimate can include initial embeddings, vector writes, storage, monthly re-embedding, database reads, reranking, LLM input and output tokens, fixed platform fees, and one-time setup work.",
  },
  {
    question: "Why does chunk overlap increase cost?",
    answer:
      "Overlap repeats part of the source text across neighbouring chunks. This can improve continuity, but it also increases embedding tokens, vector count, storage, and refresh work.",
  },
  {
    question: "How is vector storage estimated?",
    answer:
      "The calculator uses vector count, vector dimensions, bytes per dimension, metadata bytes, and an index-overhead percentage. The result is an estimate because providers may compress or replicate data differently.",
  },
  {
    question: "What should I enter for vector read units per query?",
    answer:
      "Use the billable read or query units defined by your vector database. If the provider charges one query operation for each request, enter 1. If billing depends on scanned data or capacity units, convert your expected workload into the provider's billable units.",
  },
  {
    question: "Why are the price fields blank?",
    answer:
      "RAG stacks can combine many providers, plans, regions, and private quotes. Blank fields prevent example prices from looking like verified live prices. Enter the current official rates for the exact services you plan to use.",
  },
  {
    question: "Does the cost per query include setup cost?",
    answer:
      "The displayed operating cost per query excludes one-time setup. The monthly planning cost separately adds the setup amount spread across the selected amortization period.",
  },
];

export default function RagCostCalculatorPage() {
  return (
    <ToolShell
      category="AI Cost Calculators"
      title="RAG Cost Calculator"
      description="Estimate the complete cost of a retrieval-augmented generation system across chunking, embeddings, vector storage, retrieval, reranking, LLM usage, refreshes, and setup."
    >
      <ToolClient />

      <div className="mt-16">
        <ToolContent
          intro={
            <p>
              A RAG system has more cost layers than the final LLM response.
              Documents must be chunked and embedded, vectors must be stored and
              queried, content may need reranking, and the retrieved context
              increases the tokens sent to the language model.
            </p>
          }
          sections={[
            {
              title: "Planning the Full RAG Cost Before Building",
              content: (
                <>
                  <p>
                    Start with the size of the knowledge base, average document
                    length, chunk size, overlap, embedding dimensions, and
                    storage format. The calculator estimates the number of
                    chunks, initial embedding tokens, vector count, and storage
                    required.
                  </p>

                  <p>
                    Then add monthly queries, retrieval depth, context tokens,
                    LLM output, content refreshes, and current provider prices.
                    The result separates initial setup cost from the continuing
                    monthly operating cost.
                  </p>

                  <p>
                    This makes it easier to compare a managed RAG stack with a
                    custom combination of embedding, vector database, reranking,
                    and LLM providers.
                  </p>
                </>
              ),
            },
            {
              title: "How Chunking Changes Cost",
              content: (
                <>
                  <p>
                    Smaller chunks can increase the number of vectors in the
                    database. Larger overlap repeats more source text between
                    chunks. Both choices can increase initial embedding cost,
                    storage, write operations, and monthly refresh cost.
                  </p>

                  <p>
                    Retrieval depth also matters. A larger top-k value can send
                    more context into the language model and may increase
                    reranking work. The best setting is not always the largest
                    one; it should balance answer quality, latency, and cost.
                  </p>
                </>
              ),
            },
            {
              title: "Using Current Provider Prices",
              content: (
                <>
                  <p>
                    All monetary fields are blank by design. Enter the current
                    official rate for the exact embedding model, vector
                    database, reranker, and language model you plan to use.
                  </p>

                  <p>
                    Vector databases may charge by storage, reads, writes,
                    capacity, serverless units, replicas, or a fixed plan.
                    Convert those charges into the matching fields and place
                    any remaining subscription amount under fixed monthly
                    costs.
                  </p>

                  <p>
                    Blank price fields are treated as zero, so the calculator
                    can also model a stack that does not use every cost layer.
                  </p>
                </>
              ),
            },
            {
              title: "Practical Decisions This Tool Supports",
              content: (
                <ul className="list-disc space-y-2 pl-6">
                  <li>Estimate RAG setup cost before development.</li>
                  <li>Calculate vector count and approximate storage.</li>
                  <li>Compare different chunk sizes and overlap settings.</li>
                  <li>See how top-k retrieval changes LLM input cost.</li>
                  <li>Plan monthly document refresh and reindexing cost.</li>
                  <li>Calculate operating cost per query and per 1,000 queries.</li>
                  <li>Compare a managed platform with a custom RAG stack.</li>
                  <li>Check whether the planned system fits a monthly budget.</li>
                </ul>
              ),
            },
            {
              title: "Understanding the Result",
              content: (
                <>
                  <p>
                    Initial setup includes the first embedding pass, initial
                    vector writes, and any other one-time implementation cost
                    entered. Monthly operating cost includes refresh embeddings,
                    refresh writes, vector storage, reads, reranking, LLM usage,
                    and fixed monthly fees.
                  </p>

                  <p>
                    Monthly planning cost adds an amortized share of the initial
                    setup cost. First-year total keeps setup separate and adds
                    twelve months of operating cost.
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
                  currentHref="/tools/rag-cost-calculator"
                />
              ),
            },
          ]}
        />
      </div>
    </ToolShell>
  );
}
