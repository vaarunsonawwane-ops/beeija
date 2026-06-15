import Link from "next/link";
import { tools } from "@/app/data/tools";
import InfoCard from "@/app/components/InfoCard";
import SectionCard from "@/app/components/SectionCard";

const cloudCostTools = tools.filter(
  (tool) => tool.category === "Cloud Cost Calculators",
);

const featuredTools = cloudCostTools.slice(0, 6);

export const metadata = {
  title: "Cloud Cost Calculators Online | Beeija",

  description:
    "Estimate cloud compute, storage, bandwidth, database, serverless, and infrastructure costs with practical cloud cost calculators.",

  keywords: [
    "cloud cost calculator",
    "AWS cost calculator",
    "Azure cost calculator",
    "Google Cloud cost calculator",
    "cloud storage calculator",
    "bandwidth cost calculator"
  ],

  alternates: {
    canonical: "https://beeija.com/categories/cloud-cost-calculators",
  },

  openGraph: {
    title: "Cloud Cost Calculators Online | Beeija",

    description:
      "Estimate cloud compute, storage, bandwidth, database, serverless, and infrastructure costs with practical cloud cost calculators.",

    url: "https://beeija.com/categories/cloud-cost-calculators",

    siteName: "Beeija",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Cloud Cost Calculators Online | Beeija",

    description:
      "Estimate cloud compute, storage, bandwidth, database, serverless, and infrastructure costs with practical cloud cost calculators.",
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

          <span className="text-gray-900">Cloud Cost Calculators</span>
        </div>

        {/* HERO */}
        <div className="max-w-3xl">
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Cloud Cost Calculators for Compute, Storage, Databases, and Bandwidth
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-gray-600">
            Estimate cloud costs for compute, storage, databases, serverless functions, bandwidth, and other services before choosing or scaling an architecture.
          </p>
        </div>

        {/* INTRO */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <InfoCard title="Estimate Before Provisioning">
            <p>Work through expected compute, storage, bandwidth, and database usage before creating cloud resources.</p>
          </InfoCard>

          <InfoCard title="Compare Cloud Options">
            <p>Use the same workload assumptions across providers or service types to understand cost differences.</p>
          </InfoCard>

          <InfoCard title="Forecast Monthly Growth">
            <p>Model how traffic, storage, requests, and scaling may affect future cloud bills.</p>
          </InfoCard>
        </div>

        {/* FEATURED TOOLS */}
        <section className="mt-16">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold text-gray-900">
              Popular Cloud Cost Calculators
            </h2>

            <p className="mt-3 leading-relaxed text-gray-600">
              Start with common calculators for compute, storage, databases, bandwidth, serverless usage, and recurring cloud expenses.
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
              All Cloud Cost Calculators
            </h2>

            <p className="mt-3 leading-relaxed text-gray-600">
              Browse Beeija's complete cloud cost calculator set for infrastructure planning, provider comparisons, and recurring service estimates.
            </p>
          </div>

          {cloudCostTools.length > 0 ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {cloudCostTools.map((tool) => (
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
            Everyday Cloud Cost Questions These Calculators Make Easier
          </h2>

          <p className="mt-4 max-w-3xl leading-relaxed text-gray-600">
            Cloud bills often combine several services and usage units. These calculators help break down the cost of compute, storage, traffic, databases, requests, and scaling.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              "Estimate virtual machine or compute costs for a planned workload.",
              "Compare object storage costs across providers and usage patterns.",
              "Calculate bandwidth and data-transfer expenses.",
              "Estimate serverless request and execution costs.",
              "Forecast managed database spending before deployment.",
              "Compare reserved, committed, or on-demand pricing assumptions.",
              "Estimate costs for development, staging, and production environments.",
              "Test how usage growth may affect a monthly cloud budget."
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
            Why Cloud Cost Planning Matters
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-gray-600">
            <p>Cloud pricing is flexible, but the same flexibility can make costs difficult to predict across multiple services and billing units.</p>

            <p>Estimating costs before deployment helps teams compare architectures, avoid obvious overspending, and understand which usage assumptions matter most.</p>
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
                What is a cloud cost calculator?
              </h3>
              <p className="mt-2 leading-relaxed text-gray-600">
                It estimates spending for cloud services such as compute, storage, databases, bandwidth, serverless functions, and managed infrastructure.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Can I compare AWS, Azure, and Google Cloud?
              </h3>
              <p className="mt-2 leading-relaxed text-gray-600">
                Where a comparison tool is available, you can apply similar workload assumptions to multiple providers for a clearer cost comparison.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Are regional prices included?
              </h3>
              <p className="mt-2 leading-relaxed text-gray-600">
                Some tools may support regional prices or manual overrides. Always check the selected region and verify final numbers against official pricing.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Can I estimate future cloud growth?
              </h3>
              <p className="mt-2 leading-relaxed text-gray-600">
                Yes. Capacity and usage inputs can be increased to model how traffic, storage, or requests may affect future costs.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Will these estimates match my final invoice?
              </h3>
              <p className="mt-2 leading-relaxed text-gray-600">
                They are planning estimates. Discounts, taxes, commitments, support plans, and provider-specific billing rules can change actual invoices.
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
