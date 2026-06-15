import Link from "next/link";
import { tools } from "@/app/data/tools";

const categoryTools = tools.filter(
  (tool) => tool.category === "Hosting & Infrastructure Calculators",
);

const featuredTools = categoryTools.slice(0, 6);

export const metadata = {
  title: "Hosting & Infrastructure Calculators | Beeija",

  description:
    "Use practical hosting and infrastructure calculators to estimate servers, bandwidth, storage, traffic, containers, and scaling requirements.",

  alternates: {
    canonical: "https://beeija.com/categories/hosting-infrastructure-calculators",
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

          <span className="text-gray-900">Hosting & Infrastructure Calculators</span>
        </div>

        {/* HERO */}
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-950 md:text-5xl md:leading-tight">
            Hosting and Infrastructure Calculators for Servers and Scaling
          </h1>

          <p className="mt-5 text-base leading-relaxed text-gray-600 md:text-lg">
            Use practical hosting and infrastructure calculators to estimate servers, bandwidth, storage, traffic, containers, and scaling requirements.
          </p>
        </div>

        {/* INTRO CARDS */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <article className="rounded-xl border border-[#F2C94C] bg-[#F5FAF7] p-6">
            <h2 className="text-base font-semibold text-gray-950">
              Plan Infrastructure Before Traffic Grows
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Estimate hosting, server, bandwidth, storage, and capacity needs before a website or application reaches production.
            </p>
          </article>

          <article className="rounded-xl border border-[#F2C94C] bg-[#F5FAF7] p-6">
            <h2 className="text-base font-semibold text-gray-950">
              Useful for Developers and Site Owners
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Whether you are planning a website, API, application, or container workload, these tools help translate requirements into clearer estimates.
            </p>
          </article>

          <article className="rounded-xl border border-[#F2C94C] bg-[#F5FAF7] p-6">
            <h2 className="text-base font-semibold text-gray-950">
              Quick Checks Without Complex Architecture Planning
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Review traffic, resources, and capacity assumptions without starting with a large infrastructure model.
            </p>
          </article>
        </div>

        {/* POPULAR TOOLS */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-950">
            Popular Hosting and Infrastructure Calculators
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-600 md:text-base">
            Start with frequently needed tools for servers, bandwidth, storage, traffic, containers, hosting plans, and scaling.
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
            All Hosting and Infrastructure Calculators
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-600 md:text-base">
            Browse the complete hosting and infrastructure tool set for websites, applications, APIs, containers, and deployment planning.
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
            Small Infrastructure Questions These Tools Help Simplify
          </h2>

          <p className="mt-4 max-w-4xl text-sm leading-relaxed text-gray-600 md:text-base">
            Infrastructure planning often depends on small details that affect capacity and cost — visitors, page size, requests, storage, concurrency, and growth. These tools help make those everyday checks easier to manage.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              "Estimate hosting costs for a website or application.",
              "Calculate bandwidth from visitors and page size.",
              "Estimate server capacity for concurrent users.",
              "Plan storage for files, logs, backups, or databases.",
              "Compare VPS, dedicated, and managed hosting options.",
              "Estimate container or Kubernetes resource needs.",
              "Review scaling requirements as traffic grows.",
              "Prepare development, staging, and production budgets."
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
            Why Infrastructure Planning Matters
          </h2>

          <div className="mt-5 space-y-4 text-sm leading-relaxed text-gray-600 md:text-base">
          <p>Infrastructure decisions affect performance, reliability, and recurring cost. Choosing resources without clear assumptions often leads to over-provisioning or avoidable bottlenecks.</p>

          <p>Simple calculators can make capacity and cost trade-offs easier to understand before deployment.</p>
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
              What are hosting and infrastructure calculators used for?
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              They help estimate servers, storage, traffic, bandwidth, containers, capacity, and recurring hosting costs.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-950">
              Can I use these tools for a new website?
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Yes. They are useful for estimating traffic, bandwidth, storage, and hosting requirements before launch.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-950">
              Do these tools support scaling estimates?
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Yes. Capacity tools can model growth in users, traffic, requests, or storage.
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
