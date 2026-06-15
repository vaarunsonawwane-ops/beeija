import Link from "next/link";
import { tools } from "@/app/data/tools";

const categoryTools = tools.filter(
  (tool) => tool.category === "AI Cost Calculators",
);

const featuredTools = categoryTools.slice(0, 6);

export const metadata = {
  title: "AI Cost Calculators | Beeija",

  description:
    "Use practical AI cost calculators to estimate token usage, model pricing, inference costs, embeddings, image generation, and recurring AI expenses.",

  alternates: {
    canonical: "https://beeija.com/categories/ai-cost-calculators",
  },
};

export default function CategoryPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-7xl px-6 py-12">
        {/* BREADCRUMB */}
        <div className="mb-10 flex items-center text-sm text-gray-500">
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
          <h1 className="text-4xl font-bold tracking-tight text-gray-950 md:text-5xl md:leading-tight">
            AI Cost Calculators for Tokens, Models, and API Usage
          </h1>

          <p className="mt-5 text-base leading-relaxed text-gray-600 md:text-lg">
            Use practical AI cost calculators to estimate token usage, model pricing, inference costs, embeddings, image generation, and recurring AI expenses.
          </p>
        </div>

        {/* INTRO CARDS */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <article className="rounded-xl border border-[#F2C94C] bg-[#F5FAF7] p-6">
            <h2 className="text-base font-semibold text-gray-950">
              Plan AI Costs Before Usage Grows
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Estimate token, request, model, image, audio, and embedding costs before moving from testing to production.
            </p>
          </article>

          <article className="rounded-xl border border-[#F2C94C] bg-[#F5FAF7] p-6">
            <h2 className="text-base font-semibold text-gray-950">
              Useful for Builders and Product Teams
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Whether you are planning a chatbot, assistant, search feature, or AI workflow, these tools help turn usage assumptions into clearer estimates.
            </p>
          </article>

          <article className="rounded-xl border border-[#F2C94C] bg-[#F5FAF7] p-6">
            <h2 className="text-base font-semibold text-gray-950">
              Compare Models Without Complex Pricing Tables
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Review similar workloads across providers and models without manually calculating every billing unit.
            </p>
          </article>
        </div>

        {/* POPULAR TOOLS */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-950">
            Popular AI Cost Calculators
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-600 md:text-base">
            Start with frequently needed tools for token usage, language-model APIs, inference, embeddings, image generation, and recurring AI workloads.
          </p>

          {featuredTools.length > 0 ? (
            <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {featuredTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group rounded-xl border border-gray-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:shadow-md"
                >
                  <h3 className="text-base font-semibold text-gray-950">
                    {tool.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-gray-600">
                    {tool.description}
                  </p>

                  <p className="mt-5 text-sm font-medium text-[var(--yellow-dark)]">
                    Open tool →
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-7 rounded-xl border border-gray-200 bg-gray-50 p-6 text-sm text-gray-600">
              Tools in this category will appear automatically as they are created.
            </p>
          )}
        </section>

        {/* ALL TOOLS */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-950">
            All AI Cost Calculators
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-600 md:text-base">
            Browse the complete AI cost tool set for model usage, tokens, requests, inference, and AI-related operating expenses.
          </p>

          {categoryTools.length > 0 ? (
            <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {categoryTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="rounded-xl border border-gray-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:shadow-md"
                >
                  <h3 className="text-base font-semibold text-gray-950">
                    {tool.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-gray-600">
                    {tool.description}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-7 rounded-xl border border-gray-200 bg-gray-50 p-6 text-sm text-gray-600">
              No tools have been published in this category yet.
            </p>
          )}
        </section>

        {/* TASKS */}
        <section className="mt-16 rounded-2xl border border-gray-200 bg-white p-7 md:p-8">
          <h2 className="text-2xl font-semibold text-gray-950">
            Small AI Cost Questions These Tools Help Simplify
          </h2>

          <p className="mt-4 max-w-4xl text-sm leading-relaxed text-gray-600 md:text-base">
            AI pricing often depends on small usage details that quietly change the final bill — token length, request volume, model choice, images, audio, and embeddings. These tools help make those everyday cost questions faster and easier to understand.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              "Estimate prompt and output token costs before launching an AI feature.",
              "Compare the same workload across different language models.",
              "Forecast monthly AI API spending from expected users and requests.",
              "Estimate embedding costs for search and retrieval systems.",
              "Calculate image-generation expenses for creative workflows.",
              "Estimate speech-to-text and text-to-speech API usage.",
              "Review how longer outputs may affect model costs.",
              "Test future AI spending at higher usage levels."
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-[#E6C66A] bg-[#FFFDF7] p-4"
              >
                <p className="text-sm leading-relaxed text-gray-700">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* WHY MATTERS */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-950">
            Why AI Cost Planning Matters
          </h2>

          <div className="mt-5 space-y-4 text-sm leading-relaxed text-gray-600 md:text-base">
          <p>AI pricing can appear simple until usage expands across tokens, models, requests, images, audio, and other billable units.</p>

          <p>Small assumptions about output length, request frequency, or model choice can change recurring costs significantly. These calculators help make those trade-offs easier to see before money is committed.</p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-950">
            Frequently Asked Questions
          </h2>

          <div className="mt-7 space-y-7">
          <div>
            <h3 className="text-sm font-semibold text-gray-950">
              What are AI cost calculators used for?
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              AI cost calculators help estimate spending for tokens, models, API requests, images, audio, embeddings, and other billable AI services.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-950">
              Are these tools useful before launching an AI product?
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Yes. They help convert expected users, requests, tokens, and output lengths into practical planning estimates.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-950">
              Can I compare different AI models?
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Yes. Comparison tools can apply similar workload assumptions across providers or models.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-950">
              Do these tools upload my data?
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Most Beeija tools will run directly in your browser. Inputs are not uploaded unless a specific tool clearly requires an external pricing or URL check.
            </p>
          </div>
          </div>
        </section>

        {/* RELATED */}
        <section className="mt-16 border-t border-gray-200 pt-10">
          <h2 className="text-2xl font-semibold text-gray-950">
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
