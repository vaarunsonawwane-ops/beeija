import Link from "next/link";
import { tools } from "@/app/data/tools";
import InfoCard from "@/app/components/InfoCard";
import SectionCard from "@/app/components/SectionCard";

const hostingInfrastructureTools = tools.filter(
  (tool) => tool.category === "Hosting & Infrastructure Calculators",
);

const featuredTools = hostingInfrastructureTools.slice(0, 6);

export const metadata = {
  title: "Hosting & Infrastructure Calculators | Beeija",

  description:
    "Use hosting and infrastructure calculators for servers, traffic, bandwidth, containers, storage, scaling, and deployment planning.",

  keywords: [
    "hosting cost calculator",
    "server cost calculator",
    "infrastructure calculator",
    "bandwidth calculator",
    "container cost calculator",
    "website hosting calculator"
  ],

  alternates: {
    canonical: "https://beeija.com/categories/hosting-infrastructure-calculators",
  },

  openGraph: {
    title: "Hosting & Infrastructure Calculators | Beeija",

    description:
      "Use hosting and infrastructure calculators for servers, traffic, bandwidth, containers, storage, scaling, and deployment planning.",

    url: "https://beeija.com/categories/hosting-infrastructure-calculators",

    siteName: "Beeija",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Hosting & Infrastructure Calculators | Beeija",

    description:
      "Use hosting and infrastructure calculators for servers, traffic, bandwidth, containers, storage, scaling, and deployment planning.",
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

          <span className="text-gray-900">Hosting & Infrastructure Calculators</span>
        </div>

        {/* HERO */}
        <div className="max-w-3xl">
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Hosting and Infrastructure Calculators for Servers, Traffic, and Scaling
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-gray-600">
            Plan hosting, servers, containers, bandwidth, traffic, storage, and infrastructure requirements before deploying or scaling a website or application.
          </p>
        </div>

        {/* INTRO */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <InfoCard title="Plan the Right Capacity">
            <p>Estimate servers, traffic, storage, and bandwidth needs before choosing a hosting setup.</p>
          </InfoCard>

          <InfoCard title="Avoid Over- or Under-Provisioning">
            <p>Compare realistic capacity assumptions so the infrastructure is neither wasteful nor too limited.</p>
          </InfoCard>

          <InfoCard title="Prepare for Scaling">
            <p>Model expected growth in users, requests, traffic, and data before infrastructure requirements increase.</p>
          </InfoCard>
        </div>

        {/* FEATURED TOOLS */}
        <section className="mt-16">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold text-gray-900">
              Popular Hosting and Infrastructure Calculators
            </h2>

            <p className="mt-3 leading-relaxed text-gray-600">
              Start with useful calculators for hosting plans, server capacity, traffic, bandwidth, storage, containers, and scaling requirements.
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
              All Hosting and Infrastructure Calculators
            </h2>

            <p className="mt-3 leading-relaxed text-gray-600">
              Browse Beeija's complete infrastructure calculator set for websites, applications, APIs, containers, and deployment planning.
            </p>
          </div>

          {hostingInfrastructureTools.length > 0 ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {hostingInfrastructureTools.map((tool) => (
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
            Everyday Hosting and Infrastructure Tasks These Calculators Make Easier
          </h2>

          <p className="mt-4 max-w-3xl leading-relaxed text-gray-600">
            Infrastructure planning involves capacity, traffic, storage, compute, bandwidth, redundancy, and growth. These tools help translate those requirements into practical sizing and cost estimates.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              "Estimate hosting costs for a website, application, or API.",
              "Calculate expected bandwidth from traffic and page size.",
              "Estimate server capacity for concurrent users or requests.",
              "Plan storage requirements for files, backups, logs, or databases.",
              "Compare VPS, dedicated, container, and managed hosting options.",
              "Estimate container or Kubernetes resource requirements.",
              "Forecast infrastructure needs as traffic grows.",
              "Prepare development, staging, and production environment budgets."
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
            Why Infrastructure Planning Matters
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-gray-600">
            <p>Infrastructure decisions affect performance, reliability, and recurring cost. Choosing resources without clear assumptions often leads to over-provisioning or avoidable bottlenecks.</p>

            <p>Simple calculators can make capacity and cost trade-offs visible before a deployment becomes difficult or expensive to change.</p>
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
                What are hosting and infrastructure calculators used for?
              </h3>
              <p className="mt-2 leading-relaxed text-gray-600">
                They help estimate servers, storage, traffic, bandwidth, containers, capacity, and recurring hosting costs.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Can I use them for a new website?
              </h3>
              <p className="mt-2 leading-relaxed text-gray-600">
                Yes. They are useful for estimating traffic, bandwidth, storage, and hosting requirements before launch.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Do they support application scaling?
              </h3>
              <p className="mt-2 leading-relaxed text-gray-600">
                Capacity tools can model growth in users, requests, or traffic to help estimate future infrastructure needs.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Are these calculators only for cloud hosting?
              </h3>
              <p className="mt-2 leading-relaxed text-gray-600">
                No. They can also support VPS, dedicated servers, managed hosting, containers, and hybrid infrastructure planning.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Do they replace performance testing?
              </h3>
              <p className="mt-2 leading-relaxed text-gray-600">
                No. They provide early estimates. Real load testing and monitoring are still needed before production decisions.
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
