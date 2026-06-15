import Link from "next/link";
import { tools } from "@/app/data/tools";
import InfoCard from "@/app/components/InfoCard";
import SectionCard from "@/app/components/SectionCard";

const apiSaasCostTools = tools.filter(
  (tool) => tool.category === "API & SaaS Cost Calculators",
);

const featuredTools = apiSaasCostTools.slice(0, 6);

export const metadata = {
  title: "API & SaaS Cost Calculators | Beeija",

  description:
    "Estimate API request costs, SaaS subscriptions, per-seat plans, usage pricing, and recurring software expenses.",

  keywords: [
    "API cost calculator",
    "SaaS cost calculator",
    "API pricing calculator",
    "per seat cost calculator",
    "usage based pricing calculator",
    "software subscription calculator"
  ],

  alternates: {
    canonical: "https://beeija.com/categories/api-saas-cost-calculators",
  },

  openGraph: {
    title: "API & SaaS Cost Calculators | Beeija",

    description:
      "Estimate API request costs, SaaS subscriptions, per-seat plans, usage pricing, and recurring software expenses.",

    url: "https://beeija.com/categories/api-saas-cost-calculators",

    siteName: "Beeija",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "API & SaaS Cost Calculators | Beeija",

    description:
      "Estimate API request costs, SaaS subscriptions, per-seat plans, usage pricing, and recurring software expenses.",
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

          <span className="text-gray-900">API & SaaS Cost Calculators</span>
        </div>

        {/* HERO */}
        <div className="max-w-3xl">
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            API and SaaS Cost Calculators for Requests, Seats, and Usage Pricing
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-gray-600">
            Estimate API request costs, SaaS subscriptions, per-seat pricing, usage-based billing, and recurring software expenses before choosing a service.
          </p>
        </div>

        {/* INTRO */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <InfoCard title="Understand Usage-Based Pricing">
            <p>Convert requests, events, seats, or billable units into a clearer monthly estimate.</p>
          </InfoCard>

          <InfoCard title="Compare Plans and Providers">
            <p>Use consistent assumptions to compare subscription tiers, included usage, and overage costs.</p>
          </InfoCard>

          <InfoCard title="Forecast Recurring Software Spend">
            <p>Estimate how team size, customer growth, or API volume may change future SaaS expenses.</p>
          </InfoCard>
        </div>

        {/* FEATURED TOOLS */}
        <section className="mt-16">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold text-gray-900">
              Popular API and SaaS Cost Calculators
            </h2>

            <p className="mt-3 leading-relaxed text-gray-600">
              Start with practical calculators for API requests, per-seat subscriptions, usage tiers, overages, and recurring SaaS spending.
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
              All API and SaaS Cost Calculators
            </h2>

            <p className="mt-3 leading-relaxed text-gray-600">
              Browse Beeija's complete API and SaaS calculator set for request-based, user-based, tiered, and recurring pricing models.
            </p>
          </div>

          {apiSaasCostTools.length > 0 ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {apiSaasCostTools.map((tool) => (
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
            Everyday API and SaaS Cost Questions These Calculators Make Easier
          </h2>

          <p className="mt-4 max-w-3xl leading-relaxed text-gray-600">
            API and SaaS pricing often combines subscriptions, included usage, seats, requests, overages, and volume tiers. These calculators help organize those variables into a practical estimate.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              "Estimate API request costs at expected monthly volume.",
              "Compare SaaS plans based on users, seats, or included usage.",
              "Calculate overage costs beyond a plan's included allowance.",
              "Estimate recurring software spend for a growing team.",
              "Compare flat-rate and usage-based pricing models.",
              "Forecast customer-facing API costs as product usage grows.",
              "Calculate annual savings from monthly versus yearly billing.",
              "Prepare a realistic software and API budget for a new product."
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
            Why API and SaaS Cost Planning Matters
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-gray-600">
            <p>Subscription and usage-based pricing can be difficult to compare when plans use different allowances, tiers, seats, or billing units.</p>

            <p>Cost calculators help normalize those differences so teams can understand the likely monthly or annual commitment before choosing a service.</p>
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
                What is an API cost calculator?
              </h3>
              <p className="mt-2 leading-relaxed text-gray-600">
                It estimates API spending from request volume, usage units, included allowances, and overage pricing.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                What is a SaaS cost calculator?
              </h3>
              <p className="mt-2 leading-relaxed text-gray-600">
                It estimates recurring software costs based on seats, plan tiers, usage, billing cycles, or add-ons.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Can I compare monthly and annual plans?
              </h3>
              <p className="mt-2 leading-relaxed text-gray-600">
                Yes. Billing-cycle calculators can show total annual cost and potential savings from yearly commitments.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Can I estimate costs as my team grows?
              </h3>
              <p className="mt-2 leading-relaxed text-gray-600">
                Yes. You can increase seats, usage, or requests to model how recurring software spending may change.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Are taxes and discounts included?
              </h3>
              <p className="mt-2 leading-relaxed text-gray-600">
                Only when a tool explicitly includes them or allows manual inputs. Final invoices may differ because of taxes, negotiated rates, and provider changes.
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
