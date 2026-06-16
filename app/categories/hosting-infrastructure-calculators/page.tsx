import Link from "next/link";
import type { Metadata } from "next";
import { tools } from "@/app/data/tools";

const categoryTools = tools.filter(
  (tool) => tool.category === "Hosting & Infrastructure Calculators",
);

const featuredTools = categoryTools.slice(0, 6);

export const metadata: Metadata = {
  title: "Hosting & Infrastructure Calculators for Servers & Scaling",

  description:
    "Estimate hosting costs, server needs, bandwidth, storage, traffic, containers, and scaling with simple infrastructure planning calculators.",

  keywords: [
    "hosting cost calculator",
    "web hosting cost calculator",
    "server cost calculator",
    "infrastructure cost calculator",
    "VPS cost calculator",
    "dedicated server cost calculator",
    "bandwidth calculator",
    "website bandwidth calculator",
    "server capacity calculator",
    "storage cost calculator",
    "container cost calculator",
    "Kubernetes cost calculator",
    "hosting requirements calculator",
    "website traffic calculator",
    "infrastructure planning tools",
  ],

  alternates: {
    canonical:
      "https://beeija.com/categories/hosting-infrastructure-calculators",
  },

  openGraph: {
    title: "Hosting & Infrastructure Calculators for Servers & Scaling",

    description:
      "Estimate hosting costs, server needs, bandwidth, storage, traffic, containers, and scaling before deployment.",

    url: "https://beeija.com/categories/hosting-infrastructure-calculators",

    siteName: "Beeija",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Hosting & Infrastructure Calculators for Servers & Scaling",

    description:
      "Use simple calculators to plan hosting, servers, bandwidth, storage, traffic, containers, and scaling.",
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

          <span className="text-gray-900">
            Hosting & Infrastructure Calculators
          </span>
        </div>

        {/* HERO */}
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-950 md:text-5xl md:leading-tight">
            Hosting and Infrastructure Calculators for Servers, Traffic, and
            Scaling
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-gray-600">
            Estimate hosting costs, server needs, bandwidth, storage, traffic,
            containers, and scaling before you launch or grow a website,
            application, or API.
          </p>
        </div>

        {/* INTRO CARDS */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <article className="rounded-r-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-6 py-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Plan Infrastructure Before Traffic Grows
            </h2>

            <p className="mt-3 text-base leading-relaxed text-gray-600">
              Estimate servers, bandwidth, storage, requests, and capacity
              before a small project becomes harder or more costly to manage.
            </p>
          </article>

          <article className="rounded-r-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-6 py-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Useful for Websites, Apps, and APIs
            </h2>

            <p className="mt-3 text-base leading-relaxed text-gray-600">
              Plan hosting for websites, online stores, APIs, SaaS products,
              containers, databases, and other technical workloads.
            </p>
          </article>

          <article className="rounded-r-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-6 py-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Compare Hosting and Server Options
            </h2>

            <p className="mt-3 text-base leading-relaxed text-gray-600">
              Compare shared hosting, VPS, dedicated servers, managed plans,
              containers, and other choices using the same workload.
            </p>
          </article>
        </div>

        {/* FEATURED TOOLS */}
        <section className="mt-16">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold text-gray-950">
              Popular Hosting and Infrastructure Calculators
            </h2>

            <p className="mt-3 text-gray-600 leading-relaxed">
              Start with tools for hosting cost, server capacity, bandwidth,
              storage, traffic, containers, and scaling.
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
              All Hosting and Infrastructure Calculators
            </h2>

            <p className="mt-3 text-gray-600 leading-relaxed">
              Browse every hosting and infrastructure tool for servers, traffic,
              bandwidth, storage, containers, capacity, and deployment planning.
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
            Small Infrastructure Questions These Tools Help Simplify
          </h2>

          <p className="mt-4 max-w-3xl text-gray-600 leading-relaxed">
            Hosting needs can change with visitors, page size, requests,
            storage, traffic peaks, and future growth. These tools help you test
            those numbers before you choose a plan or server.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              "Estimate hosting costs for a website, store, application, or API.",
              "Calculate monthly bandwidth from visitors and page size.",
              "Estimate server capacity for users, requests, or traffic peaks.",
              "Plan storage for files, logs, backups, media, or databases.",
              "Compare shared hosting, VPS, dedicated, and managed plans.",
              "Estimate container or Kubernetes resource needs.",
              "Review scaling needs as traffic and usage grow.",
              "Plan separate budgets for development, staging, and production.",
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
            Why Hosting and Infrastructure Planning Matters
          </h2>

          <div className="mt-5 max-w-4xl space-y-4 text-gray-600 leading-relaxed">
            <p>
              Hosting and infrastructure decisions affect speed, reliability,
              security, and monthly cost. A plan that is too small may slow down
              or fail during busy periods, while a plan that is too large may
              waste money every month.
            </p>

            <p>
              A useful estimate starts with real numbers. You may need to know
              expected visitors, page size, requests, stored data, traffic
              peaks, backups, and how quickly the project may grow.
            </p>

            <p>
              Small changes in bandwidth, storage, server size, or traffic can
              change the final cost. Beeija calculators help you test a small
              launch, a normal month, and a busy month before choosing a hosting
              plan or infrastructure setup.
            </p>

            <p>
              Cost is only one part of the decision. Uptime, support, security,
              backups, data location, and ease of scaling may also matter.
              Always check the latest official provider details before making a
              final purchase decision.
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
                What is a hosting cost calculator?
              </h3>

              <p className="mt-2 text-gray-600 leading-relaxed">
                A hosting cost calculator estimates spending for servers,
                storage, bandwidth, traffic, backups, databases, and other
                infrastructure needs.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                How do I estimate hosting needs for a new website?
              </h3>

              <p className="mt-2 text-gray-600 leading-relaxed">
                Start with expected visitors, page size, monthly traffic,
                storage, software needs, and possible traffic peaks. Then test a
                small launch and a higher-growth case.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Can I compare shared hosting, VPS, and dedicated servers?
              </h3>

              <p className="mt-2 text-gray-600 leading-relaxed">
                Yes. Use the same traffic, storage, performance, and support
                needs to compare the possible cost and limits of each option.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                How is website bandwidth estimated?
              </h3>

              <p className="mt-2 text-gray-600 leading-relaxed">
                A simple estimate uses page size, page views, downloads, media,
                and other data sent to visitors during the month.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Are hosting and infrastructure estimates exact?
              </h3>

              <p className="mt-2 text-gray-600 leading-relaxed">
                No. They are planning estimates. The final need may change
                because of traffic peaks, caching, software, backups, provider
                limits, taxes, or actual usage.
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
