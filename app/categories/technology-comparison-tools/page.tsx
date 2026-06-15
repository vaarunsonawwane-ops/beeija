import Link from "next/link";
import { tools } from "@/app/data/tools";
import InfoCard from "@/app/components/InfoCard";
import SectionCard from "@/app/components/SectionCard";

const technologyComparisonTools = tools.filter(
  (tool) => tool.category === "Technology Comparison Tools",
);

const featuredTools = technologyComparisonTools.slice(0, 6);

export const metadata = {
  title: "Technology Comparison Tools Online | Beeija",

  description:
    "Compare cloud providers, AI models, hosting services, APIs, SaaS plans, databases, and technical options using practical comparison tools.",

  keywords: [
    "technology comparison tool",
    "cloud provider comparison",
    "AI model comparison",
    "hosting comparison",
    "SaaS comparison",
    "tech stack comparison"
  ],

  alternates: {
    canonical: "https://beeija.com/categories/technology-comparison-tools",
  },

  openGraph: {
    title: "Technology Comparison Tools Online | Beeija",

    description:
      "Compare cloud providers, AI models, hosting services, APIs, SaaS plans, databases, and technical options using practical comparison tools.",

    url: "https://beeija.com/categories/technology-comparison-tools",

    siteName: "Beeija",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Technology Comparison Tools Online | Beeija",

    description:
      "Compare cloud providers, AI models, hosting services, APIs, SaaS plans, databases, and technical options using practical comparison tools.",
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

          <span className="text-gray-900">Technology Comparison Tools</span>
        </div>

        {/* HERO */}
        <div className="max-w-3xl">
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Technology Comparison Tools for Providers, Platforms, and Technical Choices
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-gray-600">
            Compare cloud services, AI models, hosting options, APIs, SaaS plans, databases, and technical stacks using practical inputs and clear trade-offs.
          </p>
        </div>

        {/* INTRO */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <InfoCard title="Compare With the Same Assumptions">
            <p>Apply one workload or requirement set across multiple options for a fairer comparison.</p>
          </InfoCard>

          <InfoCard title="See Cost and Practical Trade-Offs">
            <p>Compare pricing alongside limits, usage models, capacity, and other decision factors.</p>
          </InfoCard>

          <InfoCard title="Choose Before You Commit">
            <p>Use structured comparisons before migration, implementation, or long-term contracts.</p>
          </InfoCard>
        </div>

        {/* FEATURED TOOLS */}
        <section className="mt-16">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold text-gray-900">
              Popular Technology Comparison Tools
            </h2>

            <p className="mt-3 leading-relaxed text-gray-600">
              Start with practical comparisons for cloud providers, AI models, hosting services, APIs, SaaS plans, and infrastructure choices.
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
              All Technology Comparison Tools
            </h2>

            <p className="mt-3 leading-relaxed text-gray-600">
              Browse Beeija's complete comparison set for providers, platforms, services, pricing models, and technical stack decisions.
            </p>
          </div>

          {technologyComparisonTools.length > 0 ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {technologyComparisonTools.map((tool) => (
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
            Everyday Technology Decisions These Comparison Tools Make Easier
          </h2>

          <p className="mt-4 max-w-3xl leading-relaxed text-gray-600">
            Technology choices often involve different pricing units, limits, features, and operational trade-offs. These tools help compare options using consistent assumptions.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              "Compare AI models for the same token workload.",
              "Compare cloud providers for compute, storage, or bandwidth.",
              "Compare hosting plans based on traffic and resource needs.",
              "Compare API providers using expected monthly requests.",
              "Compare SaaS plans by users, included usage, and overages.",
              "Compare databases or infrastructure services for a planned workload.",
              "Compare flat-rate and usage-based pricing approaches.",
              "Prepare a shortlist before deeper technical evaluation."
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
            Why Structured Technology Comparison Matters
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-gray-600">
            <p>Provider pages often present pricing and features in different formats, which makes direct comparison difficult.</p>

            <p>Structured comparison tools use common inputs and categories so the important differences are easier to understand before a technical or financial commitment.</p>
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
                What is a technology comparison tool?
              </h3>
              <p className="mt-2 leading-relaxed text-gray-600">
                It compares providers, services, platforms, or technical options using consistent inputs and decision criteria.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Can these tools recommend one provider?
              </h3>
              <p className="mt-2 leading-relaxed text-gray-600">
                They can highlight differences, but the final choice depends on your technical, operational, regional, and contractual requirements.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Do comparison tools include pricing?
              </h3>
              <p className="mt-2 leading-relaxed text-gray-600">
                Many will compare pricing, while others may also include limits, capacity, usage models, or practical trade-offs.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Are provider features always current?
              </h3>
              <p className="mt-2 leading-relaxed text-gray-600">
                Beeija will aim to use current data where practical, but official provider documentation should be checked before a final decision.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Do these tools replace a technical evaluation?
              </h3>
              <p className="mt-2 leading-relaxed text-gray-600">
                No. They support early planning and shortlisting. Security, reliability, integration, and operational testing still require deeper review.
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
          </div>
        </section>
      </section>
    </main>
  );
}
