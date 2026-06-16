import Link from "next/link";
import type { Metadata } from "next";
import { tools } from "@/app/data/tools";

const categoryTools = tools.filter(
  (tool) => tool.category === "Capacity & Usage Calculators",
);

const featuredTools = categoryTools.slice(0, 6);

export const metadata: Metadata = {
  title: "Capacity & Usage Calculators for Traffic, Storage & Growth",

  description:
    "Estimate users, requests, traffic, bandwidth, storage growth, workload, and future capacity with simple planning calculators.",

  keywords: [
    "capacity planning calculator",
    "usage calculator",
    "traffic calculator",
    "website traffic calculator",
    "request volume calculator",
    "bandwidth usage calculator",
    "storage growth calculator",
    "user growth calculator",
    "server capacity calculator",
    "API usage calculator",
    "monthly usage calculator",
    "workload calculator",
    "resource capacity calculator",
    "scaling calculator",
    "infrastructure capacity planning",
  ],

  alternates: {
    canonical: "https://beeija.com/categories/capacity-usage-calculators",
  },

  openGraph: {
    title: "Capacity & Usage Calculators for Traffic, Storage & Growth",

    description:
      "Estimate users, requests, traffic, bandwidth, storage growth, workload, and future capacity before you scale.",

    url: "https://beeija.com/categories/capacity-usage-calculators",

    siteName: "Beeija",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Capacity & Usage Calculators for Traffic, Storage & Growth",

    description:
      "Use simple calculators to estimate users, requests, traffic, bandwidth, storage, workload, and future capacity.",
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

          <span className="text-gray-900">Capacity & Usage Calculators</span>
        </div>

        {/* HERO */}
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-950 md:text-5xl md:leading-tight">
            Capacity and Usage Calculators for Traffic, Storage, and Growth
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-gray-600">
            Estimate users, requests, traffic, bandwidth, storage growth,
            workload, and future capacity before you scale a website,
            application, API, or online service.
          </p>
        </div>

        {/* INTRO CARDS */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <article className="rounded-r-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-6 py-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Plan for Growth Before It Arrives
            </h2>

            <p className="mt-3 text-base leading-relaxed text-gray-600">
              Estimate users, requests, traffic, storage, and workload before
              growth puts pressure on your system.
            </p>
          </article>

          <article className="rounded-r-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-6 py-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Useful for Real Product Workloads
            </h2>

            <p className="mt-3 text-base leading-relaxed text-gray-600">
              Plan capacity for websites, apps, APIs, databases, file storage,
              media, background jobs, and other growing services.
            </p>
          </article>

          <article className="rounded-r-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-6 py-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Test Normal and Busy Usage
            </h2>

            <p className="mt-3 text-base leading-relaxed text-gray-600">
              Compare normal use, peak traffic, and future growth to see where
              limits may appear and when more capacity may be needed.
            </p>
          </article>
        </div>

        {/* FEATURED TOOLS */}
        <section className="mt-16">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold text-gray-950">
              Popular Capacity and Usage Calculators
            </h2>

            <p className="mt-3 text-gray-600 leading-relaxed">
              Start with tools for users, requests, traffic, bandwidth, storage,
              workload, and future capacity planning.
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
              All Capacity and Usage Calculators
            </h2>

            <p className="mt-3 text-gray-600 leading-relaxed">
              Browse every capacity and usage tool for users, requests, traffic,
              storage, bandwidth, workload, growth, and scaling.
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
            Small Capacity Questions These Tools Help Simplify
          </h2>

          <p className="mt-4 max-w-3xl text-gray-600 leading-relaxed">
            Capacity needs can change with users, requests, page views, file
            size, storage growth, traffic peaks, and future demand. These tools
            help you test those numbers before limits are reached.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              "Estimate monthly requests from users and actions.",
              "Calculate traffic and bandwidth from page views or downloads.",
              "Forecast storage growth for files, media, logs, or backups.",
              "Estimate active users and peak concurrent users.",
              "Plan API capacity at different request volumes.",
              "Test server or database needs as usage grows.",
              "Compare normal traffic with busy periods.",
              "Estimate when more capacity may be needed.",
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
            Why Capacity and Usage Planning Matters
          </h2>

          <div className="mt-5 max-w-4xl space-y-4 text-gray-600 leading-relaxed">
            <p>
              A system can work well at low usage and still fail when users,
              requests, storage, or traffic grow. Capacity planning helps you
              see where pressure may appear before it affects customers.
            </p>

            <p>
              A useful estimate starts with real numbers. You may need to know
              expected users, actions per user, requests per action, page size,
              stored data, traffic peaks, and monthly growth.
            </p>

            <p>
              Small changes in user activity, file size, request volume, or
              growth rate can change the amount of capacity you need. Beeija
              calculators help you test a small launch, a normal month, and a
              busy month before making scaling decisions.
            </p>

            <p>
              Capacity is only one part of the decision. Speed, uptime,
              reliability, security, cost, and provider limits may also matter.
              Use these estimates as a planning guide and check real usage as
              your product grows.
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
                What is a capacity planning calculator?
              </h3>

              <p className="mt-2 text-gray-600 leading-relaxed">
                A capacity planning calculator estimates the resources needed
                for users, requests, traffic, storage, bandwidth, and future
                growth.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                How do I estimate monthly usage?
              </h3>

              <p className="mt-2 text-gray-600 leading-relaxed">
                Start with the number of users, actions per user, requests per
                action, data size, and days of use. Then test normal and busy
                months.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                How can I estimate future storage needs?
              </h3>

              <p className="mt-2 text-gray-600 leading-relaxed">
                Use current storage, new data added each day or month, growth
                rate, backups, and retention period to estimate future storage.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                What is peak capacity?
              </h3>

              <p className="mt-2 text-gray-600 leading-relaxed">
                Peak capacity is the amount of traffic, users, requests, or work
                a system may need to handle during its busiest period.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Are capacity estimates exact?
              </h3>

              <p className="mt-2 text-gray-600 leading-relaxed">
                No. They are planning estimates. Real needs may change because
                of user behaviour, caching, software, traffic peaks, provider
                limits, or actual growth.
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
