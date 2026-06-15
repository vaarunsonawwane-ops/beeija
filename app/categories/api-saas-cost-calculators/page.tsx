import Link from "next/link";
import { tools } from "@/app/data/tools";

const categoryTools = tools.filter(
  (tool) => tool.category === "API & SaaS Cost Calculators",
);

const featuredTools = categoryTools.slice(0, 6);

export const metadata = {
  title: "API & SaaS Cost Calculators | Beeija",

  description:
    "Use practical API and SaaS cost calculators to estimate requests, subscriptions, seats, usage tiers, overages, and recurring software expenses.",

  alternates: {
    canonical: "https://beeija.com/categories/api-saas-cost-calculators",
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

          <span className="text-gray-900">API & SaaS Cost Calculators</span>
        </div>

        {/* HERO */}
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-950 md:text-5xl md:leading-tight">
            API and SaaS Cost Calculators for Requests and Subscriptions
          </h1>

          <p className="mt-5 text-base leading-relaxed text-gray-600 md:text-lg">
            Use practical API and SaaS cost calculators to estimate requests, subscriptions, seats, usage tiers, overages, and recurring software expenses.
          </p>
        </div>

        {/* INTRO CARDS */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <article className="rounded-r-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-6 py-5">
            <h2 className="text-base font-semibold text-gray-950">
              Understand Usage-Based Pricing Before You Commit
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Estimate request volume, included usage, seats, overages, and recurring charges before choosing a plan.
            </p>
          </article>

          <article className="rounded-r-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-6 py-5">
            <h2 className="text-base font-semibold text-gray-950">
              Useful for Teams and Product Builders
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Whether you are planning internal software or a customer-facing product, these tools help turn usage assumptions into clearer costs.
            </p>
          </article>

          <article className="rounded-r-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-6 py-5">
            <h2 className="text-base font-semibold text-gray-950">
              Quick Comparisons Without Complex Pricing Tables
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Compare plans and providers using consistent inputs instead of manually reviewing each pricing page.
            </p>
          </article>
        </div>

        {/* POPULAR TOOLS */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-950">
            Popular API and SaaS Cost Calculators
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-600 md:text-base">
            Start with frequently needed tools for API requests, subscriptions, seats, usage tiers, overages, and recurring software spending.
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
            All API and SaaS Cost Calculators
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-600 md:text-base">
            Browse the complete API and SaaS cost tool set for request-based, user-based, tiered, and recurring pricing models.
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
            Small API and SaaS Cost Questions These Tools Help Simplify
          </h2>

          <p className="mt-4 max-w-4xl text-sm leading-relaxed text-gray-600 md:text-base">
            API and SaaS pricing often depends on requests, seats, usage tiers, allowances, billing cycles, and overages. These tools help make those everyday cost questions easier to understand.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              "Estimate API request costs at expected monthly volume.",
              "Compare SaaS plans by users, seats, and included usage.",
              "Calculate overage costs beyond plan allowances.",
              "Estimate recurring software spending for a growing team.",
              "Compare flat-rate and usage-based pricing.",
              "Forecast customer-facing API costs as usage grows.",
              "Calculate monthly versus annual plan differences.",
              "Prepare a realistic software and API budget."
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
            Why API and SaaS Cost Planning Matters
          </h2>

          <div className="mt-5 space-y-4 text-sm leading-relaxed text-gray-600 md:text-base">
          <p>Subscription and usage-based pricing can be difficult to compare when providers use different allowances, tiers, seats, or billing units.</p>

          <p>Cost calculators help normalize those differences so teams can understand the likely monthly or annual commitment before choosing a service.</p>
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
              What are API cost calculators used for?
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              They estimate API spending from request volume, usage units, included allowances, and overage pricing.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-950">
              What are SaaS cost calculators used for?
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              They estimate recurring software costs based on seats, plans, billing cycles, usage, and add-ons.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-950">
              Can I compare monthly and annual plans?
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Yes. Billing tools can show total annual cost and potential savings.
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
