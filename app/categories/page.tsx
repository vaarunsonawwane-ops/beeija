import Link from "next/link";
import {
  BEEIJA_CATEGORIES,
  getToolsByCategory,
  type BeeijaCategory,
} from "@/app/data/tools";
import SectionCard from "@/app/components/SectionCard";

const categoryDetails: Record<
  BeeijaCategory,
  {
    description: string;
    href: string;
  }
> = {
  "AI Cost Calculators": {
    description:
      "Estimate token usage, model pricing, API spending, inference expenses, and recurring AI costs.",
    href: "/categories/ai-cost-calculators",
  },

  "Cloud Cost Calculators": {
    description:
      "Estimate compute, storage, bandwidth, database, serverless, and everyday cloud costs.",
    href: "/categories/cloud-cost-calculators",
  },

  "Hosting & Infrastructure Calculators": {
    description:
      "Plan hosting, servers, containers, traffic, scaling, and infrastructure requirements.",
    href: "/categories/hosting-infrastructure-calculators",
  },

  "API & SaaS Cost Calculators": {
    description:
      "Estimate API requests, subscriptions, usage-based pricing, and recurring SaaS expenses.",
    href: "/categories/api-saas-cost-calculators",
  },

  "Capacity & Usage Calculators": {
    description:
      "Estimate users, requests, storage, bandwidth, growth, and future capacity requirements.",
    href: "/categories/capacity-usage-calculators",
  },

  "Technology Comparison Tools": {
    description:
      "Compare providers, platforms, services, and technical options using practical inputs.",
    href: "/categories/technology-comparison-tools",
  },
};

export const metadata = {
  title: "Tool Categories | Beeija",

  description:
    "Browse organized categories of AI cost, cloud pricing, hosting, infrastructure, API, SaaS, capacity, usage, and technology comparison tools.",

  alternates: {
    canonical: "https://beeija.com/categories",
  },

  openGraph: {
    title: "Tool Categories | Beeija",

    description:
      "Browse organized categories of AI cost, cloud pricing, hosting, infrastructure, API, SaaS, capacity, usage, and technology comparison tools.",

    url: "https://beeija.com/categories",

    siteName: "Beeija",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Tool Categories | Beeija",

    description:
      "Explore AI cost, cloud, hosting, infrastructure, API, SaaS, capacity, usage, and technology comparison categories.",
  },
};

export default function Page() {
  const categories = BEEIJA_CATEGORIES.map((title) => ({
    title,
    description: categoryDetails[title].description,
    href: categoryDetails[title].href,
    count: getToolsByCategory(title).length,
  }));

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-7xl px-6 py-16">
        {/* HERO */}
        <div className="max-w-4xl">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-950 md:text-6xl md:leading-tight">
            Explore AI, Cloud, Infrastructure, and Technology Cost Categories
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-gray-600">
            Browse focused categories for AI costs, cloud pricing, hosting,
            infrastructure, APIs, SaaS, capacity, usage, and technology
            comparisons.
          </p>
        </div>

        {/* CATEGORY GRID */}
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <h2 className="text-lg font-semibold text-gray-900 group-hover:text-[var(--yellow-dark)]">
                {category.title}
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-gray-600">
                {category.description}
              </p>

              <div className="mt-6 flex items-center justify-between gap-4">
                <span className="inline-flex text-sm font-semibold text-[var(--yellow-dark)]">
                  Explore category →
                </span>

                <span className="text-xs text-gray-500">
                  {category.count} {category.count === 1 ? "tool" : "tools"}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* WHY CATEGORIES */}
        <SectionCard>
          <h2 className="text-2xl font-semibold text-gray-900">
            Why Beeija Uses Focused Categories
          </h2>

          <div className="mt-5 space-y-5 leading-relaxed text-gray-600">
            <p>
              Technical cost planning often involves several connected
              decisions — estimating AI usage, comparing cloud services,
              planning infrastructure, checking API pricing, and preparing for
              future capacity.
            </p>

            <p>
              Keeping these tools grouped into focused categories makes them
              easier to find. Instead of moving through unrelated pages, you
              can browse calculators and comparison tools that naturally belong
              together.
            </p>

            <p>
              Beeija is organized to help you move from an early idea to a more
              informed decision without becoming a random collection of
              calculators.
            </p>
          </div>
        </SectionCard>

        {/* RELATED */}
        <section className="mt-16 border-t border-gray-200 pt-10">
          <h2 className="text-2xl font-semibold text-gray-900">
            Browse All Tool Areas
          </h2>

          <div className="mt-5 flex flex-wrap gap-3">
            {categories.map((category) => (
              <Link
                key={category.href}
                href={category.href}
                className="beeija-btn-outline"
              >
                {category.title}
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
