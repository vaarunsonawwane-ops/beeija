import Link from "next/link";
import { tools } from "@/app/data/tools";

const categoryTools = tools.filter(
  (tool) => tool.category === "Capacity & Usage Calculators",
);

const featuredTools = categoryTools.slice(0, 6);

export const metadata = {
  title: "Capacity & Usage Calculators | Beeija",

  description:
    "Use practical capacity and usage calculators to estimate users, requests, traffic, bandwidth, storage, throughput, and future growth.",

  alternates: {
    canonical: "https://beeija.com/categories/capacity-usage-calculators",
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

          <span className="text-gray-900">Capacity & Usage Calculators</span>
        </div>

        {/* HERO */}
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-950 md:text-5xl md:leading-tight">
            Capacity and Usage Calculators for Traffic, Requests, and Storage
          </h1>

          <p className="mt-5 text-base leading-relaxed text-gray-600 md:text-lg">
            Use practical capacity and usage calculators to estimate users, requests, traffic, bandwidth, storage, throughput, and future growth.
          </p>
        </div>

        {/* INTRO CARDS */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <article className="rounded-xl border border-[#E6C66A] bg-[#FFFDF7] p-6">
            <h2 className="text-base font-semibold text-gray-950">
              Turn Growth Assumptions Into Clearer Numbers
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Estimate users, requests, traffic, storage, and throughput before usage reaches production scale.
            </p>
          </article>

          <article className="rounded-xl border border-[#E6C66A] bg-[#FFFDF7] p-6">
            <h2 className="text-base font-semibold text-gray-950">
              Useful for Product, Cloud, and Infrastructure Planning
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              These tools provide practical inputs for cloud, AI, API, hosting, and infrastructure cost calculations.
            </p>
          </article>

          <article className="rounded-xl border border-[#E6C66A] bg-[#FFFDF7] p-6">
            <h2 className="text-base font-semibold text-gray-950">
              Quick Checks Before Limits Are Reached
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Review future capacity needs before quotas, plan allowances, or infrastructure resources become insufficient.
            </p>
          </article>
        </div>

        {/* POPULAR TOOLS */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-950">
            Popular Capacity and Usage Calculators
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-600 md:text-base">
            Start with frequently needed tools for users, requests, traffic, storage, bandwidth, throughput, and growth assumptions.
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
            All Capacity and Usage Calculators
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-600 md:text-base">
            Browse the complete capacity and usage tool set for websites, applications, APIs, storage, and infrastructure planning.
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
            Small Capacity Questions These Tools Help Simplify
          </h2>

          <p className="mt-4 max-w-4xl text-sm leading-relaxed text-gray-600 md:text-base">
            Technical costs are usually driven by usage. These tools help convert users, traffic, requests, storage, and growth assumptions into practical planning numbers.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              "Estimate monthly requests from daily active users.",
              "Calculate bandwidth from visitors and page size.",
              "Forecast storage growth from files, logs, or backups.",
              "Estimate concurrent users from total traffic.",
              "Calculate API request volume from product usage.",
              "Estimate throughput for events or data processing.",
              "Model future capacity at different growth rates.",
              "Prepare usage inputs for cost calculators."
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
            Why Capacity and Usage Planning Matters
          </h2>

          <div className="mt-5 space-y-4 text-sm leading-relaxed text-gray-600 md:text-base">
          <p>Without realistic estimates of users, traffic, requests, storage, or throughput, pricing comparisons can become misleading.</p>

          <p>Capacity calculators provide the practical inputs needed for better cloud, AI, hosting, API, and infrastructure decisions.</p>
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
              What are capacity calculators used for?
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              They estimate how much traffic, storage, throughput, compute, or other resources may be required.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-950">
              What are usage calculators used for?
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              They convert activity such as users, requests, sessions, files, or events into monthly totals.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-950">
              Can these tools forecast growth?
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Yes. Many calculations can include growth rates or higher future usage scenarios.
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
