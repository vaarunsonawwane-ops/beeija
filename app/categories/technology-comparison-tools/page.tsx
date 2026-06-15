import Link from "next/link";
import { tools } from "@/app/data/tools";

const categoryTools = tools.filter(
  (tool) => tool.category === "Technology Comparison Tools",
);

const featuredTools = categoryTools.slice(0, 6);

export const metadata = {
  title: "Technology Comparison Tools | Beeija",

  description:
    "Use practical technology comparison tools to compare cloud services, AI models, hosting options, APIs, SaaS plans, databases, and technical choices.",

  alternates: {
    canonical: "https://beeija.com/categories/technology-comparison-tools",
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

          <span className="text-gray-900">Technology Comparison Tools</span>
        </div>

        {/* HERO */}
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-950 md:text-5xl md:leading-tight">
            Technology Comparison Tools for Providers and Platforms
          </h1>

          <p className="mt-5 text-base leading-relaxed text-gray-600 md:text-lg">
            Use practical technology comparison tools to compare cloud services, AI models, hosting options, APIs, SaaS plans, databases, and technical choices.
          </p>
        </div>

        {/* INTRO CARDS */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <article className="rounded-r-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-6 py-5">
            <h2 className="text-base font-semibold text-gray-950">
              Compare With the Same Assumptions
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Apply one workload or requirement set across multiple providers, platforms, or services.
            </p>
          </article>

          <article className="rounded-r-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-6 py-5">
            <h2 className="text-base font-semibold text-gray-950">
              Useful for Early Technical Decisions
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              These tools help teams shortlist practical options before deeper implementation, migration, or contract decisions.
            </p>
          </article>

          <article className="rounded-r-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-6 py-5">
            <h2 className="text-base font-semibold text-gray-950">
              Quick Comparisons Without Complex Research
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Review pricing, limits, usage models, and trade-offs without starting from several disconnected provider pages.
            </p>
          </article>
        </div>

        {/* POPULAR TOOLS */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-950">
            Popular Technology Comparison Tools
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-600 md:text-base">
            Start with frequently needed comparisons for cloud providers, AI models, hosting services, APIs, SaaS plans, and infrastructure choices.
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
            All Technology Comparison Tools
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-600 md:text-base">
            Browse the complete comparison tool set for providers, platforms, services, pricing models, and technical stack decisions.
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
            Small Technology Decisions These Tools Help Simplify
          </h2>

          <p className="mt-4 max-w-4xl text-sm leading-relaxed text-gray-600 md:text-base">
            Technology choices often involve different pricing units, limits, features, and operational trade-offs. These tools help compare options using consistent assumptions.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              "Compare AI models for the same token workload.",
              "Compare cloud providers for compute or storage.",
              "Compare hosting plans by traffic and resources.",
              "Compare API providers using expected requests.",
              "Compare SaaS plans by users and included usage.",
              "Compare databases for a planned workload.",
              "Compare flat-rate and usage-based pricing.",
              "Prepare a shortlist before deeper evaluation."
            ].map((item) => (
              <div
                key={item}
                className="border-l-4 border-[#F2C94C] bg-white px-4 py-3"
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
            Why Structured Technology Comparison Matters
          </h2>

          <div className="mt-5 space-y-4 text-sm leading-relaxed text-gray-600 md:text-base">
          <p>Provider pages often present pricing and features in different formats, which makes direct comparison difficult.</p>

          <p>Structured comparison tools use common inputs and categories so the important differences are easier to understand before a technical or financial commitment.</p>
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
              What are technology comparison tools used for?
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              They compare providers, services, platforms, or technical options using consistent inputs and decision criteria.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-950">
              Can these tools recommend one provider?
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              They can highlight differences, but the final choice depends on technical, operational, regional, and contractual needs.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-950">
              Do comparison tools include pricing?
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Many do, while others may also include limits, usage models, capacity, and practical trade-offs.
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
