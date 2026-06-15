import Link from "next/link";
import { tools } from "@/app/data/tools";
import InfoCard from "@/app/components/InfoCard";
import SectionCard from "@/app/components/SectionCard";

const aiCostTools = tools.filter(
  (tool) => tool.category === "AI Cost Calculators",
);

const featuredTools = aiCostTools.slice(0, 6);

export const metadata = {
  title: "AI Cost Calculators Online | Beeija",

  description:
    "Use practical AI cost calculators for tokens, LLM APIs, inference, embeddings, image generation, speech, and model usage planning.",

  keywords: [
    "AI cost calculator",
    "LLM cost calculator",
    "token cost calculator",
    "AI API pricing calculator",
    "inference cost calculator",
    "model cost comparison"
  ],

  alternates: {
    canonical: "https://beeija.com/categories/ai-cost-calculators",
  },

  openGraph: {
    title: "AI Cost Calculators Online | Beeija",

    description:
      "Use practical AI cost calculators for tokens, LLM APIs, inference, embeddings, image generation, speech, and model usage planning.",

    url: "https://beeija.com/categories/ai-cost-calculators",

    siteName: "Beeija",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "AI Cost Calculators Online | Beeija",

    description:
      "Use practical AI cost calculators for tokens, LLM APIs, inference, embeddings, image generation, speech, and model usage planning.",
  },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-7xl px-6 py-16">
        {/* BREADCRUMB */}
        <div className="mb-8 flex items-center text-sm text-gray-500">
          <Link
            href="/"
            className="transition-colors duration-200 hover:!text-[var(--yellow-dark)]"
          >
            Home
          </Link>

          <span className="mx-2">/</span>

          <Link
            href="/categories"
            className="transition-colors duration-200 hover:!text-[var(--yellow-dark)]"
          >
            Categories
          </Link>

          <span className="mx-2">/</span>

          <span className="text-gray-900">AI Cost Calculators</span>
        </div>

        {/* HERO */}
        <div className="max-w-3xl">
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            AI Cost Calculators for Tokens, Models, APIs, and Inference
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-gray-600">
            Estimate token usage, model pricing, API spending, inference costs, and recurring AI expenses before launching or scaling an AI-powered product.
          </p>
        </div>

        {/* INTRO */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <InfoCard title="Plan Model Usage Before Launch">
            <p>Estimate how prompts, outputs, requests, and expected users may affect monthly AI spending.</p>
          </InfoCard>

          <InfoCard title="Compare AI Providers More Clearly">
            <p>Use consistent inputs to compare model pricing and understand how provider choices change your cost.</p>
          </InfoCard>

          <InfoCard title="Prepare for Growth Without Guesswork">
            <p>Test higher request volumes, longer outputs, and changing usage patterns before your product scales.</p>
          </InfoCard>
        </div>

        {/* FEATURED TOOLS */}
        <section className="mt-16">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold text-gray-900">
              Popular AI Cost Calculators
            </h2>

            <p className="mt-3 leading-relaxed text-gray-600">
              Start with frequently needed calculators for token usage, language-model APIs, embeddings, image generation, and recurring AI workloads.
            </p>
          </div>

          {featuredTools.length > 0 ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {featuredTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[var(--yellow-dark)]">
                    {tool.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-gray-600">
                    {tool.description}
                  </p>

                  <span className="mt-5 inline-flex text-sm font-semibold text-[var(--yellow-dark)]">
                    Open tool →
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-6 text-gray-600">
              Tools in this category will appear automatically as they are
              created.
            </p>
          )}
        </section>

        {/* ALL TOOLS */}
        <section className="mt-16">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold text-gray-900">
              All AI Cost Calculators
            </h2>

            <p className="mt-3 leading-relaxed text-gray-600">
              Browse the complete set of Beeija calculators for model usage, tokens, requests, inference, and AI-related operating costs.
            </p>
          </div>

          {aiCostTools.length > 0 ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {aiCostTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
                >
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[var(--yellow-dark)]">
                    {tool.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-gray-600">
                    {tool.description}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-6 text-gray-600">
              No tools have been published in this category yet.
            </p>
          )}
        </section>

        {/* USE CASES */}
        <SectionCard>
          <h2 className="text-2xl font-semibold text-gray-900">
            Everyday AI Cost Questions These Calculators Make Easier
          </h2>

          <p className="mt-4 max-w-3xl leading-relaxed text-gray-600">
            AI pricing often depends on tokens, requests, model types, output length, image generation, audio processing, or batch usage. These calculators help turn those variables into practical estimates.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              "Estimate monthly LLM API costs before launching a chatbot or assistant.",
              "Compare the same workload across different AI model providers.",
              "Calculate prompt-token and output-token expenses separately.",
              "Estimate embedding costs for search, retrieval, or recommendation systems.",
              "Forecast image-generation costs for creative or product workflows.",
              "Estimate speech-to-text and text-to-speech API usage.",
              "Test how user growth may affect recurring AI spending.",
              "Prepare cost assumptions for prototypes, pilots, and production workloads."
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <p className="text-sm leading-relaxed text-gray-700">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* WHY MATTERS */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-900">
            Why AI Cost Planning Matters
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-gray-600">
            <p>AI pricing can look simple until usage grows across tokens, requests, models, images, audio, and other billable units.</p>

            <p>Small assumptions about output length, request frequency, or model choice can change monthly costs significantly. Cost calculators make those trade-offs easier to see before money is committed.</p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-900">
            Frequently Asked Questions
          </h2>

          <div className="mt-6 space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900">
                What is an AI cost calculator used for?
              </h3>
              <p className="mt-2 leading-relaxed text-gray-600">
                It helps estimate the cost of using AI models, APIs, tokens, images, audio, embeddings, and other billable AI services.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Can I compare multiple AI models?
              </h3>
              <p className="mt-2 leading-relaxed text-gray-600">
                Yes. Comparison calculators can use the same workload assumptions across providers or models so differences are easier to understand.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Are the calculations exact?
              </h3>
              <p className="mt-2 leading-relaxed text-gray-600">
                They are planning estimates based on the prices and usage assumptions provided. Actual bills may vary because of discounts, regional pricing, cached tokens, batch rates, or provider changes.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Can these tools help with monthly budgeting?
              </h3>
              <p className="mt-2 leading-relaxed text-gray-600">
                Yes. You can combine expected users, requests, tokens, or other usage units to estimate recurring monthly spending.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Do these tools replace official provider pricing pages?
              </h3>
              <p className="mt-2 leading-relaxed text-gray-600">
                No. They simplify planning and comparison. Official provider documentation remains the final source for current pricing and billing rules.
              </p>
            </div>
          </div>
        </section>

        {/* RELATED CATEGORIES */}
        <section className="mt-16 border-t border-gray-200 pt-10">
          <h2 className="text-2xl font-semibold text-gray-900">
            Related Tool Categories
          </h2>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/categories/cloud-cost-calculators"
              className="beeija-btn-outline"
            >
              Cloud Cost Calculators
            </Link>

            <Link
              href="/categories/hosting-infrastructure-calculators"
              className="beeija-btn-outline"
            >
              Hosting & Infrastructure Calculators
            </Link>

            <Link
              href="/categories/api-saas-cost-calculators"
              className="beeija-btn-outline"
            >
              API & SaaS Cost Calculators
            </Link>

            <Link
              href="/categories/capacity-usage-calculators"
              className="beeija-btn-outline"
            >
              Capacity & Usage Calculators
            </Link>

            <Link
              href="/categories/technology-comparison-tools"
              className="beeija-btn-outline"
            >
              Technology Comparison Tools
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
