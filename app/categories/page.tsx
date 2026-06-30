import Link from "next/link";
import type { Metadata } from "next";

const categories = [
  {
    title: "AI Cost Calculators",
    description:
      "Estimate token use, model prices, AI API costs, inference costs, and monthly AI spending.",
    href: "/categories/ai-cost-calculators",
  },
  {
    title: "Cloud Cost Calculators",
    description:
      "Estimate compute, storage, bandwidth, database, serverless, and other cloud costs.",
    href: "/categories/cloud-cost-calculators",
  },
  {
    title: "Hosting & Infrastructure Calculators",
    description:
      "Plan hosting, servers, containers, traffic, scaling, and infrastructure needs.",
    href: "/categories/hosting-infrastructure-calculators",
  },
  {
    title: "API & SaaS Cost Calculators",
    description:
      "Estimate API requests, subscriptions, users, price levels, overages, and monthly SaaS costs.",
    href: "/categories/api-saas-cost-calculators",
  },
  {
    title: "Capacity & Usage Calculators",
    description:
      "Estimate users, requests, traffic, bandwidth, storage growth, workload, and future capacity.",
    href: "/categories/capacity-usage-calculators",
  },
  {
    title: "Technology Comparison Tools",
    description:
      "Compare providers, platforms, services, and technical options using clear inputs.",
    href: "/categories/technology-comparison-tools",
  },
];

export const metadata: Metadata = {
  title: "Cost Calculator Categories",

  description:
    "Browse AI, cloud, hosting, infrastructure, API, SaaS, capacity, usage, and technology comparison calculator categories on Beeija.",

  keywords: [
    "AI cost calculator categories",
    "cloud cost calculator categories",
    "hosting cost calculators",
    "infrastructure cost calculators",
    "API cost calculators",
    "SaaS cost calculators",
    "capacity planning calculators",
    "usage calculators",
    "technology comparison tools",
  ],

  alternates: {
    canonical: "https://beeija.com/categories",
  },

  openGraph: {
    title: "Cost Calculator Categories | Beeija",

    description:
      "Browse AI, cloud, hosting, infrastructure, API, SaaS, capacity, usage, and technology comparison tools.",

    url: "https://beeija.com/categories",

    siteName: "Beeija",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Cost Calculator Categories | Beeija",

    description:
      "Explore simple cost calculators and comparison tools for AI, cloud, hosting, APIs, SaaS, capacity, and technology planning.",
  },
};

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-7xl px-6 py-16">
        {/* HERO */}
        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-950 md:text-5xl md:leading-tight">
            Explore Cost Calculators for AI, Cloud, Hosting, APIs, and
            Technology
          </h1>

          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-gray-600 md:text-base">
            Choose a category to estimate costs, compare options, and plan your
            next technical decision with clear and simple tools.
          </p>
        </div>

        {/* CATEGORY GRID */}
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="group rounded-xl border border-gray-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <h2 className="text-base font-semibold text-gray-950">
                {category.title}
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                {category.description}
              </p>

              <p className="mt-5 text-sm font-medium text-[var(--yellow-dark)]">
                Explore category →
              </p>
            </Link>
          ))}
        </div>

        {/* WHY CATEGORIES */}
        <section className="mt-14 rounded-2xl border border-gray-200 bg-white p-7 md:p-8">
          <h2 className="text-xl font-semibold text-gray-950">
            Why Beeija Uses Clear Categories
          </h2>

          <div className="mt-5 space-y-4 text-sm leading-7 text-gray-600 md:text-base">
            <p>
              When you plan AI use, cloud services, hosting, APIs, SaaS, or
              future capacity, you may need more than one calculator.
            </p>

            <p>
              Clear categories make related tools easier to find. You can stay
              in one area instead of moving through unrelated pages.
            </p>

            <p>
              Beeija keeps every tool in the right place so you can find what
              you need faster.
            </p>
          </div>
        </section>

        {/* POPULAR TOOL AREAS */}
        <section className="mt-12 border-t border-gray-200 pt-8">
          <h2 className="text-xl font-semibold text-gray-950">
            Popular Tool Areas
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
