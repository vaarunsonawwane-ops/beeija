import Link from "next/link";
import type { Metadata } from "next";
import { tools } from "@/app/data/tools";

const categoryTools = tools.filter(
  (tool) => tool.category === "API & SaaS Cost Calculators",
);

const featuredTools = categoryTools.slice(0, 6);

export const metadata: Metadata = {
  title: "API & SaaS Cost Calculators for Requests, Seats & Plans",

  description:
    "Estimate API request costs, SaaS subscriptions, seats, usage tiers, overages, and monthly software spending with simple planning calculators.",

  keywords: [
    "API cost calculator",
    "SaaS cost calculator",
    "API pricing calculator",
    "API request cost calculator",
    "SaaS pricing calculator",
    "subscription cost calculator",
    "software cost calculator",
    "per user pricing calculator",
    "seat based pricing calculator",
    "usage based pricing calculator",
    "API overage calculator",
    "SaaS overage calculator",
    "monthly software cost calculator",
    "annual subscription calculator",
    "SaaS plan comparison calculator",
  ],

  alternates: {
    canonical: "https://beeija.com/categories/api-saas-cost-calculators",
  },

  openGraph: {
    title: "API & SaaS Cost Calculators for Requests, Seats & Plans",

    description:
      "Estimate API requests, SaaS subscriptions, users, usage tiers, overages, and monthly software costs before you choose a plan.",

    url: "https://beeija.com/categories/api-saas-cost-calculators",

    siteName: "Beeija",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "API & SaaS Cost Calculators for Requests, Seats & Plans",

    description:
      "Use simple calculators to estimate API usage, SaaS subscriptions, seats, overages, and recurring software costs.",
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

          <span className="text-gray-900">API & SaaS Cost Calculators</span>
        </div>

        {/* HERO */}
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-950 md:text-5xl md:leading-tight">
            API and SaaS Cost Calculators for Requests, Seats, and Plans
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-gray-600">
            Estimate API requests, SaaS subscriptions, users, usage tiers,
            overages, and recurring software costs before you choose a plan or
            scale a product.
          </p>
        </div>

        {/* INTRO CARDS */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <article className="rounded-r-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-6 py-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Understand Usage-Based Pricing
            </h2>

            <p className="mt-3 text-base leading-relaxed text-gray-600">
              Estimate requests, seats, included usage, overages, add-ons, and
              billing cycles before choosing a service.
            </p>
          </article>

          <article className="rounded-r-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-6 py-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Useful for Teams and Product Builders
            </h2>

            <p className="mt-3 text-base leading-relaxed text-gray-600">
              Plan software and API costs for internal tools, customer-facing
              products, automation, support systems, and growing teams.
            </p>
          </article>

          <article className="rounded-r-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-6 py-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Compare Plans More Clearly
            </h2>

            <p className="mt-3 text-base leading-relaxed text-gray-600">
              Compare flat-rate, per-user, tiered, and usage-based plans with
              the same inputs instead of reading many pricing pages.
            </p>
          </article>
        </div>

        {/* FEATURED TOOLS */}
        <section className="mt-16">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold text-gray-950">
              Popular API and SaaS Cost Calculators
            </h2>

            <p className="mt-3 text-gray-600 leading-relaxed">
              Start with tools for API requests, subscriptions, seats, usage
              tiers, overages, and recurring software spending.
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
              All API and SaaS Cost Calculators
            </h2>

            <p className="mt-3 text-gray-600 leading-relaxed">
              Browse every API and SaaS cost tool for request-based, user-based,
              tiered, overage, and recurring pricing models.
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
            Small API and SaaS Cost Questions These Tools Help Simplify
          </h2>

          <p className="mt-4 max-w-3xl text-gray-600 leading-relaxed">
            API and SaaS pricing can change with requests, seats, usage tiers,
            included limits, billing cycles, and overages. These tools help you
            test those numbers before you commit.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              "Estimate API request costs at expected monthly volume.",
              "Compare SaaS plans by users, seats, and included usage.",
              "Calculate overage costs beyond plan limits.",
              "Estimate recurring software spending for a growing team.",
              "Compare flat-rate and usage-based pricing.",
              "Forecast customer-facing API costs as usage grows.",
              "Compare monthly and annual billing options.",
              "Prepare a realistic API and software budget.",
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
            Why API and SaaS Cost Planning Matters
          </h2>

          <div className="mt-5 max-w-4xl space-y-4 text-gray-600 leading-relaxed">
            <p>
              API and SaaS prices can be difficult to compare because providers
              use different request limits, seat rules, usage tiers, add-ons,
              and billing cycles.
            </p>

            <p>
              A useful estimate starts with real usage. You may need to know how
              many users will need access, how many requests the product may
              send, which plan limits apply, and how much overage may occur.
            </p>

            <p>
              Small changes in users, requests, add-ons, or included usage can
              change the monthly bill. Beeija calculators help you test a small
              team, a normal month, and a higher-growth case before choosing a
              plan.
            </p>

            <p>
              Cost is only one part of the decision. Reliability, support,
              limits, security, data rules, and ease of cancellation may also
              matter. Always check the latest official provider pricing before
              making a final purchase decision.
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
                What is an API cost calculator?
              </h3>

              <p className="mt-2 text-gray-600 leading-relaxed">
                An API cost calculator estimates spending from request volume,
                usage units, included limits, and overage pricing.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                What is a SaaS cost calculator?
              </h3>

              <p className="mt-2 text-gray-600 leading-relaxed">
                A SaaS cost calculator estimates recurring software costs from
                seats, plans, billing cycles, usage, add-ons, and overages.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                How do I estimate monthly API costs?
              </h3>

              <p className="mt-2 text-gray-600 leading-relaxed">
                Start with expected requests, price per request or usage unit,
                included allowance, and any overage rate. Then test a normal
                month and a higher-usage month.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Can I compare monthly and annual SaaS plans?
              </h3>

              <p className="mt-2 text-gray-600 leading-relaxed">
                Yes. A calculator can show the full annual cost, monthly
                equivalent, discount, and possible savings.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Are API and SaaS cost estimates exact?
              </h3>

              <p className="mt-2 text-gray-600 leading-relaxed">
                No. They are planning estimates. The final bill may change
                because of updated prices, taxes, discounts, extra services, or
                actual usage.
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
