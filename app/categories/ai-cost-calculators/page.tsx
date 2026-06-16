import Link from "next/link";
import type { Metadata } from "next";
import { tools } from "@/app/data/tools";

const categoryTools = tools.filter(
  (tool) => tool.category === "AI Cost Calculators",
);

const featuredTools = categoryTools.slice(0, 6);

export const metadata: Metadata = {
  title: "AI Cost Calculators for Tokens, Models & APIs | Beeija",

  description:
    "Estimate AI token costs, model pricing, API usage, embeddings, image generation, audio, and monthly AI spending with simple planning calculators.",

  keywords: [
    "AI cost calculator",
    "AI token cost calculator",
    "AI API cost calculator",
    "LLM cost calculator",
    "OpenAI API cost calculator",
    "AI model pricing calculator",
    "AI inference cost calculator",
    "embedding cost calculator",
    "AI image generation cost calculator",
    "speech to text cost calculator",
    "text to speech cost calculator",
    "monthly AI cost calculator",
    "AI pricing calculator",
    "AI usage cost estimator",
    "generative AI cost calculator",
  ],

  alternates: {
    canonical: "https://beeija.com/categories/ai-cost-calculators",
  },

  openGraph: {
    title: "AI Cost Calculators for Tokens, Models & APIs | Beeija",

    description:
      "Estimate token use, model prices, API requests, embeddings, images, audio, and monthly AI costs before you build.",

    url: "https://beeija.com/categories/ai-cost-calculators",

    siteName: "Beeija",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "AI Cost Calculators for Tokens, Models & APIs | Beeija",

    description:
      "Use simple calculators to estimate AI token, model, API, image, audio, and embedding costs.",
  },
};

export default function CategoryPage() {
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
          <h1 className="text-4xl font-bold tracking-tight text-gray-950 md:text-5xl md:leading-tight">
            AI Cost Calculators for Tokens, Models, APIs, Images, and Audio
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-gray-600">
            Estimate the cost of AI models, token use, API requests, embeddings,
            image generation, speech, and other AI services before you build or
            scale a product.
          </p>
        </div>

        {/* INTRO CARDS */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <article className="rounded-r-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-6 py-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Plan AI Costs Before Usage Grows
            </h2>

            <p className="mt-3 text-base leading-relaxed text-gray-600">
              Test token volume, request count, model choice, and other billing
              units before a small AI feature becomes a large monthly cost.
            </p>
          </article>

          <article className="rounded-r-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-6 py-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Useful for Real AI Products
            </h2>

            <p className="mt-3 text-base leading-relaxed text-gray-600">
              Plan costs for chatbots, assistants, search tools, support tools,
              image features, voice tools, and other AI-based products.
            </p>
          </article>

          <article className="rounded-r-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-6 py-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Compare Models and Providers
            </h2>

            <p className="mt-3 text-base leading-relaxed text-gray-600">
              Use the same workload to compare model prices, provider rates, and
              possible monthly costs without reading long pricing tables.
            </p>
          </article>
        </div>

        {/* FEATURED TOOLS */}
        <section className="mt-16">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold text-gray-950">
              Popular AI Cost Calculators
            </h2>

            <p className="mt-3 text-gray-600 leading-relaxed">
              Start with tools for token cost, AI APIs, model use, inference,
              embeddings, images, audio, and monthly workload planning.
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
                  <h3 className="text-base font-semibold text-gray-950 transition-colors duration-200 group-hover:text-[var(--green)]">
                    {tool.title}
                  </h3>

                  <p className="mt-3 text-base leading-relaxed text-gray-600">
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
              Tools in this category will appear automatically as they are
              created.
            </p>
          )}
        </section>

        {/* ALL TOOLS */}
        <section className="mt-16">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold text-gray-950">
              All AI Cost Calculators
            </h2>

            <p className="mt-3 text-gray-600 leading-relaxed">
              Browse every AI cost tool for tokens, models, requests, inference,
              embeddings, images, audio, and other running costs.
            </p>
          </div>

          {categoryTools.length > 0 ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {categoryTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
                >
                  <h3 className="text-lg font-semibold text-gray-900">
                    {tool.title}
                  </h3>

                  <p className="mt-3 text-base leading-relaxed text-gray-600">
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

        {/* USE CASES */}
        <section className="mt-16 rounded-2xl border border-gray-200 bg-white p-7 md:p-8">
          <h2 className="text-2xl font-semibold text-gray-950">
            Small AI Cost Questions These Tools Help Simplify
          </h2>

          <p className="mt-4 max-w-3xl text-gray-600 leading-relaxed">
            AI pricing can change with token length, model choice, request
            volume, images, audio, embeddings, and other billing units. These
            tools help you test those numbers before you spend money.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              "Estimate input and output token costs before launching an AI feature.",
              "Compare the same workload across different AI models.",
              "Estimate monthly AI API spending from users and requests.",
              "Calculate embedding costs for search and RAG systems.",
              "Estimate image generation costs for content and design work.",
              "Estimate speech-to-text and text-to-speech API costs.",
              "See how longer answers may increase model costs.",
              "Test future AI spending at higher usage levels.",
            ].map((item) => (
              <div
                key={item}
                className="border-l-4 border-[#F2C94C] bg-white px-4 py-3"
              >
                <p className="text-base leading-relaxed text-gray-700">
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

          <div className="mt-5 max-w-4xl space-y-4 text-gray-600 leading-relaxed">
            <p>
              AI pricing may look simple at first, but the final cost can depend
              on input tokens, output tokens, request count, model choice,
              images, audio, embeddings, and other billing units.
            </p>

            <p>
              A useful estimate starts with a real workload. You may need to
              know how many users will use the feature, how many requests each
              user may send, how long the prompts may be, and how much output
              the model may return.
            </p>

            <p>
              Small changes in answer length, request count, or user growth can
              change the monthly bill. Beeija calculators help you test a small
              launch, a normal month, and a busy month before choosing a model
              or provider.
            </p>

            <p>
              Cost is only one part of the decision. Quality, speed, context
              size, reliability, privacy, and provider limits may also matter.
              Always check the latest official provider pricing before making a
              final budget or purchase decision.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-950">
            Frequently Asked Questions
          </h2>

          <div className="mt-6 space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900">
                What is an AI cost calculator?
              </h3>

              <p className="mt-2 text-gray-600 leading-relaxed">
                An AI cost calculator estimates spending for tokens, models,
                API requests, images, audio, embeddings, and other paid AI
                services.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                How do I estimate AI API costs?
              </h3>

              <p className="mt-2 text-gray-600 leading-relaxed">
                Start with the model price, number of requests, and average
                input and output tokens. A calculator can then show the cost per
                request, day, month, or user.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Can I compare AI model prices?
              </h3>

              <p className="mt-2 text-gray-600 leading-relaxed">
                Yes. Use the same request and token numbers across different
                models to compare possible costs for one workload.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Do embeddings, images, and audio add extra costs?
              </h3>

              <p className="mt-2 text-gray-600 leading-relaxed">
                Yes. Embeddings may be priced by text volume. Images may be
                priced by size, quality, or model. Audio may be priced by
                minutes, characters, tokens, or requests.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Are AI cost estimates exact?
              </h3>

              <p className="mt-2 text-gray-600 leading-relaxed">
                No. They are planning estimates. The final bill may change
                because of updated prices, discounts, taxes, retries, extra
                services, or actual usage.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Do these tools upload my data?
              </h3>

              <p className="mt-2 text-gray-600 leading-relaxed">
                Most Beeija tools run in your browser. Your inputs are not
                uploaded unless a tool clearly says that it needs an external
                price or URL check.
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
