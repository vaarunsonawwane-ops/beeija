import Link from "next/link";

const categories = [
  {
    title: "AI Cost Calculators",
    description:
      "Estimate token usage, model pricing, AI API spending, inference costs, and recurring AI expenses.",
    href: "/categories/ai-cost-calculators",
  },
  {
    title: "Cloud Cost Calculators",
    description:
      "Estimate compute, storage, bandwidth, database, serverless, and everyday cloud costs.",
    href: "/categories/cloud-cost-calculators",
  },
  {
    title: "Hosting & Infrastructure Calculators",
    description:
      "Plan hosting, servers, containers, traffic, scaling, and infrastructure requirements.",
    href: "/categories/hosting-infrastructure-calculators",
  },
  {
    title: "API & SaaS Cost Calculators",
    description:
      "Estimate API requests, subscriptions, seats, usage tiers, overages, and recurring SaaS expenses.",
    href: "/categories/api-saas-cost-calculators",
  },
  {
    title: "Capacity & Usage Calculators",
    description:
      "Estimate users, requests, traffic, bandwidth, storage growth, throughput, and future capacity.",
    href: "/categories/capacity-usage-calculators",
  },
  {
    title: "Technology Comparison Tools",
    description:
      "Compare providers, platforms, services, and technical options using practical inputs.",
    href: "/categories/technology-comparison-tools",
  },
];

export const metadata = {
  title: "Tool Categories | Beeija",

  description:
    "Browse focused Beeija categories for AI costs, cloud pricing, hosting, infrastructure, APIs, SaaS, capacity, usage, and technology comparisons.",

  alternates: {
    canonical: "https://beeija.com/categories",
  },

  openGraph: {
    title: "Tool Categories | Beeija",

    description:
      "Browse focused Beeija categories for AI costs, cloud pricing, hosting, infrastructure, APIs, SaaS, capacity, usage, and technology comparisons.",

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

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-7xl px-6 py-16">
        {/* HERO */}
        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-950 md:text-5xl md:leading-tight">
            Explore Cost Categories Across AI, Cloud, Hosting, APIs, and
            Technology
          </h1>

          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-gray-600 md:text-base">
            Browse focused tool categories for AI costs, cloud pricing,
            hosting, infrastructure, APIs, SaaS, capacity, usage, and
            technology comparisons.
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
            Why Beeija Uses Focused Categories
          </h2>

          <div className="mt-5 space-y-4 text-sm leading-7 text-gray-600 md:text-base">
            <p>
              When you are planning AI usage, cloud infrastructure, hosting,
              APIs, SaaS, or future capacity, you usually need several related
              calculators and comparison tools rather than one isolated page.
            </p>

            <p>
              Keeping tools grouped into focused categories makes them easier
              to find. Instead of moving through unrelated pages, you can
              quickly browse tools that naturally belong together.
            </p>

            <p>
              Beeija is organized to help you find the right planning tool
              faster, without turning the site into a random collection of
              calculators.
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
