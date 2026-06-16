import Link from "next/link";
import type { Metadata } from "next";
import { tools } from "@/app/data/tools";

const categoryTools = tools.filter(
  (tool) => tool.category === "Technology Comparison Tools",
);

const featuredTools = categoryTools.slice(0, 6);

export const metadata: Metadata = {
  title: "Technology Comparison Tools for Cloud, AI & Software",

  description:
    "Compare cloud providers, AI models, hosting plans, APIs, SaaS products, databases, and other technology choices with simple comparison tools.",

  keywords: [
    "technology comparison tools",
    "cloud provider comparison",
    "AI model comparison",
    "hosting comparison tool",
    "API pricing comparison",
    "SaaS comparison calculator",
    "database comparison tool",
    "software comparison tool",
    "platform comparison tool",
    "cloud service comparison",
    "technology cost comparison",
    "infrastructure comparison tool",
    "provider comparison calculator",
    "technical stack comparison",
    "technology decision tools",
  ],

  alternates: {
    canonical: "https://beeija.com/categories/technology-comparison-tools",
  },

  openGraph: {
    title: "Technology Comparison Tools for Cloud, AI & Software",

    description:
      "Compare providers, platforms, services, pricing models, and technical options before you choose.",

    url: "https://beeija.com/categories/technology-comparison-tools",

    siteName: "Beeija",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Technology Comparison Tools for Cloud, AI & Software",

    description:
      "Use simple comparison tools for cloud, AI, hosting, APIs, SaaS, databases, and other technology choices.",
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

          <span className="text-gray-900">Technology Comparison Tools</span>
        </div>

        {/* HERO */}
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-950 md:text-5xl md:leading-tight">
            Technology Comparison Tools for Cloud, AI, Hosting, and Software
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-gray-600">
            Compare cloud providers, AI models, hosting plans, APIs, SaaS
            products, databases, and other technology choices using the same
            inputs.
          </p>
        </div>

        {/* INTRO CARDS */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <article className="rounded-r-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-6 py-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Compare With the Same Inputs
            </h2>

            <p className="mt-3 text-base leading-relaxed text-gray-600">
              Use one workload, budget, or requirement set across providers and
              platforms for a fairer comparison.
            </p>
          </article>

          <article className="rounded-r-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-6 py-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Useful Before You Choose a Platform
            </h2>

            <p className="mt-3 text-base leading-relaxed text-gray-600">
              Shortlist practical options before deeper testing, migration,
              implementation, or contract decisions.
            </p>
          </article>

          <article className="rounded-r-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-6 py-5">
            <h2 className="text-lg font-semibold text-gray-900">
              See Cost and Trade-Offs More Clearly
            </h2>

            <p className="mt-3 text-base leading-relaxed text-gray-600">
              Review pricing, limits, features, usage rules, and possible
              trade-offs without opening many provider pages.
            </p>
          </article>
        </div>

        {/* FEATURED TOOLS */}
        <section className="mt-16">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold text-gray-950">
              Popular Technology Comparison Tools
            </h2>

            <p className="mt-3 text-gray-600 leading-relaxed">
              Start with comparisons for cloud providers, AI models, hosting,
              APIs, SaaS plans, databases, and infrastructure choices.
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
                  <h3 className="text-lg font-semibold text-gray-900 transition-colors duration-200 group-hover:text-[var(--green)]">
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
              All Technology Comparison Tools
            </h2>

            <p className="mt-3 text-gray-600 leading-relaxed">
              Browse every comparison tool for providers, platforms, services,
              pricing models, and technical stack decisions.
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
            Small Technology Decisions These Tools Help Simplify
          </h2>

          <p className="mt-4 max-w-3xl text-gray-600 leading-relaxed">
            Technology choices often use different pricing units, limits,
            features, and rules. These tools help you compare options with the
            same assumptions.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              "Compare AI models for the same token workload.",
              "Compare cloud providers for compute, storage, or bandwidth.",
              "Compare hosting plans by traffic, storage, and server resources.",
              "Compare API providers using expected request volume.",
              "Compare SaaS plans by users, limits, and included usage.",
              "Compare databases for a planned workload and growth level.",
              "Compare flat-rate, tiered, and usage-based pricing.",
              "Prepare a shortlist before deeper technical testing.",
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
            Why Technology Comparison Matters
          </h2>

          <div className="mt-5 max-w-4xl space-y-4 text-gray-600 leading-relaxed">
            <p>
              Providers often present prices, features, and limits in different
              ways. That makes a direct comparison harder than it first appears.
            </p>

            <p>
              A useful comparison starts with the same workload, budget, region,
              users, traffic, or other needs. Without the same inputs, one option
              may look cheaper even when it is not a fair match.
            </p>

            <p>
              Small differences in included usage, support, overages, regions,
              performance, or contract terms can change the final choice.
              Beeija comparison tools help you review those differences before
              you spend time or money.
            </p>

            <p>
              Cost is only one part of the decision. Reliability, security,
              support, data location, ease of use, and future limits may also
              matter. Always check the latest official provider details before
              making a final choice.
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
                What are technology comparison tools?
              </h3>

              <p className="mt-2 text-gray-600 leading-relaxed">
                Technology comparison tools compare providers, platforms,
                services, or products using the same inputs and decision points.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Can these tools tell me which provider is best?
              </h3>

              <p className="mt-2 text-gray-600 leading-relaxed">
                They can show key differences, but the best choice depends on
                your budget, workload, region, support needs, security, and
                long-term plans.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Do comparison tools include pricing?
              </h3>

              <p className="mt-2 text-gray-600 leading-relaxed">
                Many tools include pricing. Some may also compare limits,
                usage rules, capacity, features, and practical trade-offs.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                How do I make a fair technology comparison?
              </h3>

              <p className="mt-2 text-gray-600 leading-relaxed">
                Use the same workload, users, requests, storage, traffic,
                region, support level, and billing period for every option.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Are comparison results exact?
              </h3>

              <p className="mt-2 text-gray-600 leading-relaxed">
                No. They are planning results. Prices, limits, discounts,
                taxes, contracts, and service details may change.
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
              href="/categories/ai-cost-calculators"
              className="beeija-btn-outline"
            >
              AI Cost Calculators
            </Link>

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
          </div>
        </section>
      </section>
    </main>
  );
}
