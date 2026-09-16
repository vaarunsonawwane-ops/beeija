import Link from "next/link";
import type { Metadata } from "next";

import ToolCard from "@/app/components/ToolCard";
import { tools } from "@/app/data/tools";

const categoryTools = tools.filter(
  (tool) => tool.category === "AI Cost Calculators",
);

export const metadata: Metadata = {
  title: "AI Cost Calculators",

  description:
    "Browse Beeija tools for AI API pricing, tokens, caching, embeddings, RAG, agents, media generation, evaluation, fine-tuning, and GPU inference.",

  alternates: {
    canonical: "https://beeija.com/categories/ai-cost-calculators",
  },

  openGraph: {
    title: "AI Cost Calculators | Beeija",
    description:
      "Explore Beeija tools for estimating and comparing AI model, API, retrieval, agent, media, evaluation, training, and inference costs.",
    url: "https://beeija.com/categories/ai-cost-calculators",
    siteName: "Beeija",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "AI Cost Calculators | Beeija",
    description:
      "Explore Beeija tools for estimating and comparing AI model, API, retrieval, agent, media, evaluation, training, and inference costs.",
  },
};

export default function CategoryPage() {
  return (
    <main className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex flex-wrap items-center text-sm text-gray-500"
        >
          <Link
            href="/"
            className="transition-colors duration-200 hover:text-[var(--green)]"
          >
            Home
          </Link>

          <span className="mx-2" aria-hidden="true">
            /
          </span>

          <Link
            href="/categories"
            className="transition-colors duration-200 hover:text-[var(--green)]"
          >
            Categories
          </Link>

          <span className="mx-2" aria-hidden="true">
            /
          </span>

          <span className="text-gray-900">AI Cost Calculators</span>
        </nav>

        <header className="max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-950 md:text-5xl md:leading-tight">
            AI Cost Calculators
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-gray-600">
            Estimate and compare costs across model APIs, token usage, caching,
            RAG, agents, media generation, evaluation, fine-tuning, and
            self-hosted inference.
          </p>
        </header>

        <section className="mt-14">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-semibold text-gray-950">
              AI pricing is not one number
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              Different AI workloads are billed in different ways. A useful
              estimate starts by matching the calculator to the part of the
              system that actually creates the cost.
            </p>
          </div>

          <div className="mt-8 grid gap-x-10 gap-y-8 md:grid-cols-2">
            <article>
              <h3 className="text-lg font-semibold text-gray-950">
                Model APIs and token usage
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Text-model costs can depend on input tokens, cached input,
                output tokens, request volume, model choice, and whether a
                provider offers a separate batch rate.
              </p>
            </article>

            <article>
              <h3 className="text-lg font-semibold text-gray-950">
                Retrieval and agent workflows
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                RAG and agent systems can add embeddings, vector storage,
                retrieval, reranking, web search, repeated model calls, retries,
                tools, memory, and human review to the base model cost.
              </p>
            </article>

            <article>
              <h3 className="text-lg font-semibold text-gray-950">
                Images, video, and speech
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Media workloads may be priced by image, clip duration, audio
                time, characters, requests, processing mode, or another
                provider-specific unit. Retries and unusable output can matter
                as much as the headline rate.
              </p>
            </article>

            <article>
              <h3 className="text-lg font-semibold text-gray-950">
                Training and self-hosted inference
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Fine-tuning and self-hosted inference introduce a different set
                of costs: training runs, evaluation, retraining, GPU capacity,
                utilization, idle time, storage, setup, and ongoing inference.
              </p>
            </article>
          </div>
        </section>

        <section className="mt-16">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-semibold text-gray-950">
              Browse AI tools
            </h2>

            <p className="mt-3 leading-relaxed text-gray-600">
              Choose the tool that matches the workload or cost question you
              are trying to understand. Each page explains the assumptions and
              limits that matter for that calculation.
            </p>
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {categoryTools.map((tool) => (
              <ToolCard
                key={tool.href}
                name={tool.title}
                description={tool.description}
                href={tool.href}
              />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-semibold text-gray-950">
              Compare the same workload, not just the headline rate
            </h2>

            <div className="mt-5 space-y-4 leading-8 text-gray-600">
              <p>
                A lower published rate does not automatically mean a lower
                monthly cost. Compare providers or models using the same request
                volume, token mix, media volume, retry assumptions, and other
                workload inputs.
              </p>

              <p>
                Caching, batch processing, free allowances, repeated attempts,
                search calls, human review, and infrastructure can materially
                change the result. If one estimate includes those costs and
                another does not, the totals are not directly comparable.
              </p>

              <p>
                Cost is also only one part of an AI decision. Quality, latency,
                context limits, reliability, privacy requirements, provider
                limits, and operational effort can matter just as much as the
                calculated amount.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-16 border-l-4 border-[#F2C94C] bg-[#F5FAF7] p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-gray-950">
            How Beeija approaches AI cost estimates
          </h2>

          <div className="mt-4 max-w-5xl space-y-4 leading-8 text-gray-600">
            <p>
              A Beeija result is a planning estimate, not a provider invoice.
              Provider pricing, regions, service tiers, discounts, free
              allowances, taxes, custom agreements, and actual usage can change
              the final amount.
            </p>

            <p>
              When provider rates are built into a tool, the goal is to make the
              pricing source, checked date, assumptions, and editable inputs
              clear enough that you can understand what is driving the result.
            </p>
          </div>

          <Link
            href="/how-beeija-tools-are-built"
            className="mt-6 inline-flex font-medium text-[var(--green)] transition-colors duration-200 hover:underline"
          >
            How Beeija Tools Are Built →
          </Link>
        </section>

        <section className="mt-16 border-t border-gray-200 pt-10">
          <h2 className="text-2xl font-semibold text-gray-950">
            Related category
          </h2>

          <p className="mt-3 max-w-3xl leading-relaxed text-gray-600">
            AI workloads often depend on compute, storage, databases,
            networking, or serverless infrastructure. Use the cloud category
            when those costs need to be planned separately.
          </p>

          <Link
            href="/categories/cloud-cost-calculators"
            className="beeija-btn-outline mt-6 inline-flex"
          >
            Cloud Cost Calculators
          </Link>
        </section>
      </div>
    </main>
  );
}
