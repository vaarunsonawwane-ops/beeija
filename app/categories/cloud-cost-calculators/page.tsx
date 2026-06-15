import Link from "next/link";
import { tools } from "@/app/data/tools";

const categoryTools = tools.filter(
  (tool) => tool.category === "Cloud Cost Calculators",
);

const featuredTools = categoryTools.slice(0, 6);

export const metadata = {
  title: "Cloud Cost Calculators | Beeija",

  description:
    "Use practical cloud cost calculators to estimate compute, storage, bandwidth, databases, serverless usage, and recurring cloud expenses.",

  alternates: {
    canonical: "https://beeija.com/categories/cloud-cost-calculators",
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

          <span className="text-gray-900">Cloud Cost Calculators</span>
        </div>

        {/* HERO */}
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-950 md:text-5xl md:leading-tight">
            Cloud Cost Calculators for Compute, Storage, and Bandwidth
          </h1>

          <p className="mt-5 text-base leading-relaxed text-gray-600 md:text-lg">
            Use practical cloud cost calculators to estimate compute, storage, bandwidth, databases, serverless usage, and recurring cloud expenses.
          </p>
        </div>

        {/* INTRO CARDS */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <article className="rounded-xl border border-[#F2C94C] bg-[#F5FAF7] p-6">
            <h2 className="text-base font-semibold text-gray-950">
              Estimate Cloud Spending Before Deployment
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Work through compute, storage, bandwidth, database, and request assumptions before creating production resources.
            </p>
          </article>

          <article className="rounded-xl border border-[#F2C94C] bg-[#F5FAF7] p-6">
            <h2 className="text-base font-semibold text-gray-950">
              Useful for Developers and Infrastructure Teams
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Whether you are planning a small application or a growing platform, these tools help turn cloud usage into clearer monthly estimates.
            </p>
          </article>

          <article className="rounded-xl border border-[#F2C94C] bg-[#F5FAF7] p-6">
            <h2 className="text-base font-semibold text-gray-950">
              Quick Comparisons Without Complex Pricing Pages
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Compare services, configurations, and providers without manually combining every pricing unit.
            </p>
          </article>
        </div>

        {/* POPULAR TOOLS */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-950">
            Popular Cloud Cost Calculators
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-600 md:text-base">
            Start with frequently needed tools for compute, storage, databases, bandwidth, serverless requests, and recurring cloud costs.
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
            All Cloud Cost Calculators
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-600 md:text-base">
            Browse the complete cloud cost tool set for infrastructure planning, provider comparisons, and recurring service estimates.
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
            Small Cloud Cost Questions These Tools Help Simplify
          </h2>

          <p className="mt-4 max-w-4xl text-sm leading-relaxed text-gray-600 md:text-base">
            Cloud pricing is often shaped by several small details — instance hours, storage size, requests, bandwidth, regions, and database usage. These tools help make those everyday calculations easier to manage.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              "Estimate virtual machine costs for a planned workload.",
              "Calculate object storage and retrieval expenses.",
              "Estimate bandwidth and data-transfer costs.",
              "Compare serverless usage at different request volumes.",
              "Forecast managed database spending.",
              "Compare on-demand and committed pricing assumptions.",
              "Estimate costs for development, staging, and production.",
              "Review future cloud spending as traffic grows."
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-[#F2C94C] bg-[#F5FAF7] p-4"
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
            Why Cloud Cost Planning Matters
          </h2>

          <div className="mt-5 space-y-4 text-sm leading-relaxed text-gray-600 md:text-base">
          <p>Cloud services are flexible, but the same flexibility can make costs difficult to understand across multiple services and billing units.</p>

          <p>Estimating costs before deployment helps teams compare architectures, avoid obvious overspending, and understand which usage assumptions affect the final bill.</p>
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
              What are cloud cost calculators used for?
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Cloud cost calculators help estimate spending for compute, storage, databases, bandwidth, serverless functions, and related cloud services.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-950">
              Can I compare cloud providers?
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Yes. Comparison tools can use similar workload assumptions across multiple providers.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-950">
              Are regional prices included?
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Some tools may support regions or manual price inputs. Official provider documentation should be checked before a final decision.
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
