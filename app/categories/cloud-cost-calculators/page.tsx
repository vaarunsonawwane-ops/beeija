import Link from "next/link";
import type { Metadata } from "next";
import { tools } from "@/app/data/tools";

const categoryTools = tools.filter(
  (tool) => tool.category === "Cloud Cost Calculators",
);

const featuredTools = categoryTools.slice(0, 6);

export const metadata: Metadata = {
  title: "Cloud Cost Calculators for Compute, Storage & Bandwidth",

  description:
    "Estimate cloud compute, storage, bandwidth, database, serverless, and monthly infrastructure costs with simple planning calculators.",

  keywords: [
    "cloud cost calculator",
    "cloud pricing calculator",
    "AWS cost calculator",
    "Azure cost calculator",
    "Google Cloud cost calculator",
    "cloud compute cost calculator",
    "cloud storage cost calculator",
    "cloud bandwidth cost calculator",
    "cloud database cost calculator",
    "serverless cost calculator",
    "cloud infrastructure cost calculator",
    "monthly cloud cost calculator",
    "cloud cost estimator",
    "cloud spending calculator",
    "cloud migration cost calculator",
  ],

  alternates: {
    canonical: "https://beeija.com/categories/cloud-cost-calculators",
  },

  openGraph: {
    title: "Cloud Cost Calculators for Compute, Storage & Bandwidth",

    description:
      "Estimate cloud compute, storage, bandwidth, database, serverless, and monthly infrastructure costs before deployment.",

    url: "https://beeija.com/categories/cloud-cost-calculators",

    siteName: "Beeija",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Cloud Cost Calculators for Compute, Storage & Bandwidth",

    description:
      "Use simple calculators to estimate compute, storage, bandwidth, database, serverless, and other cloud costs.",
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

          <span className="text-gray-900">Cloud Cost Calculators</span>
        </div>

        {/* HERO */}
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-950 md:text-5xl md:leading-tight">
            Cloud Cost Calculators for Compute, Storage, and Bandwidth
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-gray-600">
            Estimate compute, storage, bandwidth, databases, serverless usage,
            and other cloud costs before you deploy or scale a workload.
          </p>
        </div>

        {/* INTRO CARDS */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <article className="rounded-r-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-6 py-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Estimate Cloud Spending Before Deployment
            </h2>

            <p className="mt-3 text-base leading-relaxed text-gray-600">
              Test compute hours, storage size, bandwidth, databases, and other
              billing units before creating production resources.
            </p>
          </article>

          <article className="rounded-r-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-6 py-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Useful for Small and Large Workloads
            </h2>

            <p className="mt-3 text-base leading-relaxed text-gray-600">
              Plan costs for websites, apps, APIs, databases, data systems, and
              growing platforms using your own workload numbers.
            </p>
          </article>

          <article className="rounded-r-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-6 py-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Compare Providers and Configurations
            </h2>

            <p className="mt-3 text-base leading-relaxed text-gray-600">
              Compare similar workloads across providers, regions, instance
              sizes, storage plans, and pricing options.
            </p>
          </article>
        </div>

        {/* FEATURED TOOLS */}
        <section className="mt-16">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold text-gray-950">
              Popular Cloud Cost Calculators
            </h2>

            <p className="mt-3 text-gray-600 leading-relaxed">
              Start with tools for compute, storage, bandwidth, databases,
              serverless requests, and monthly cloud planning.
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
              All Cloud Cost Calculators
            </h2>

            <p className="mt-3 text-gray-600 leading-relaxed">
              Browse every cloud cost tool for compute, storage, bandwidth,
              databases, serverless usage, and other recurring services.
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
            Small Cloud Cost Questions These Tools Help Simplify
          </h2>

          <p className="mt-4 max-w-3xl text-gray-600 leading-relaxed">
            Cloud pricing can change with instance hours, storage size, request
            count, bandwidth, regions, and database usage. These tools help you
            test those numbers before you spend money.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              "Estimate virtual machine costs for a planned workload.",
              "Calculate object storage and retrieval costs.",
              "Estimate bandwidth and data transfer charges.",
              "Compare serverless usage at different request volumes.",
              "Forecast managed database spending.",
              "Compare on-demand and committed pricing options.",
              "Estimate costs for development, staging, and production.",
              "Test future cloud spending as traffic grows.",
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
            Why Cloud Cost Planning Matters
          </h2>

          <div className="mt-5 max-w-4xl space-y-4 text-gray-600 leading-relaxed">
            <p>
              Cloud services are flexible, but the same flexibility can make
              the final bill difficult to predict. Compute, storage, bandwidth,
              databases, requests, regions, and extra services may all be billed
              in different ways.
            </p>

            <p>
              A useful estimate starts with a real workload. You may need to
              know how many hours a server will run, how much data will be
              stored, how much traffic will leave the cloud, and how many
              requests the system may handle.
            </p>

            <p>
              Small changes in instance size, storage class, region, or traffic
              can change the monthly bill. Beeija calculators help you test a
              small setup, a normal month, and a busy month before choosing a
              provider or architecture.
            </p>

            <p>
              Cost is only one part of the decision. Speed, reliability,
              security, support, data location, and service limits may also
              matter. Always check the latest official provider pricing before
              making a final budget or purchase decision.
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
                What is a cloud cost calculator?
              </h3>

              <p className="mt-2 text-gray-600 leading-relaxed">
                A cloud cost calculator estimates spending for compute,
                storage, bandwidth, databases, serverless functions, and other
                cloud services.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                How do I estimate monthly cloud costs?
              </h3>

              <p className="mt-2 text-gray-600 leading-relaxed">
                Start with the resources you need, expected usage, region, and
                billing period. Then add compute, storage, data transfer,
                database, and request costs for a normal month.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Can I compare cloud providers?
              </h3>

              <p className="mt-2 text-gray-600 leading-relaxed">
                Yes. Use the same workload and usage numbers across providers
                to compare possible costs more fairly.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Why can data transfer make cloud costs higher?
              </h3>

              <p className="mt-2 text-gray-600 leading-relaxed">
                Many providers charge for data leaving the cloud or moving
                between regions and services. High traffic can make these
                charges a large part of the final bill.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Are cloud cost estimates exact?
              </h3>

              <p className="mt-2 text-gray-600 leading-relaxed">
                No. They are planning estimates. The final bill may change
                because of updated prices, discounts, taxes, extra services, or
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
