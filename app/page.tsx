import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Beeija | AI, Cloud & Technology Cost Calculators",
  },

  description:
    "Use simple calculators to estimate AI, cloud, hosting, infrastructure, API, SaaS, capacity, and technology costs before you build.",

  keywords: [
    "AI cost calculator",
    "cloud cost calculator",
    "hosting cost calculator",
    "infrastructure cost calculator",
    "API cost calculator",
    "SaaS cost calculator",
    "capacity planning calculator",
    "usage cost calculator",
    "technology comparison tools",
    "technical cost planning",
  ],

  alternates: {
    canonical: "https://beeija.com",
  },

  openGraph: {
    title: "Beeija | AI, Cloud & Technology Cost Calculators",

    description:
      "Estimate AI, cloud, hosting, infrastructure, API, SaaS, capacity, and technology costs before you build.",

    url: "https://beeija.com",

    siteName: "Beeija",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Beeija | AI, Cloud & Technology Cost Calculators",

    description:
      "Simple cost calculators and comparison tools for AI, cloud, hosting, APIs, SaaS, capacity, and technology planning.",
  },
};

const categories = [
  {
    title: "AI Cost Calculators",
    description:
      "Estimate token use, model pricing, API cost, and other common AI expenses.",
    href: "/categories/ai-cost-calculators",
  },
  {
    title: "Cloud Cost Calculators",
    description:
      "Estimate compute, storage, bandwidth, database, and other cloud costs before you deploy.",
    href: "/categories/cloud-cost-calculators",
  },
  {
    title: "Hosting & Infrastructure Calculators",
    description:
      "Plan hosting, servers, containers, traffic, storage, scaling, and other infrastructure needs.",
    href: "/categories/hosting-infrastructure-calculators",
  },
  {
    title: "API & SaaS Cost Calculators",
    description:
      "Estimate API and software costs using requests, users, usage limits, and price plans.",
    href: "/categories/api-saas-cost-calculators",
  },
  {
    title: "Capacity & Usage Calculators",
    description:
      "See how users, requests, storage, traffic, workload, and growth may affect future costs.",
    href: "/categories/capacity-usage-calculators",
  },
  {
    title: "Technology Comparison Tools",
    description:
      "Compare technical options using clear inputs, simple trade-offs, and cost differences.",
    href: "/categories/technology-comparison-tools",
  },
];

export default function HomePage() {
  return (
    <main className="bg-white text-gray-900">
      <section className="mx-auto max-w-7xl px-6 pb-20 pt-4 md:pb-24 md:pt-8">
        <div className="max-w-4xl">
          <p className="text-sm font-medium text-[var(--yellow-dark)]">
            ✦ Built for you
          </p>

          <h1 className="mt-8 text-4xl font-semibold tracking-tight text-gray-950 md:text-5xl md:leading-tight">
            Simple cost calculators for better AI, cloud, and technology
            decisions.
          </h1>

          <div className="mt-8 max-w-4xl space-y-5 text-lg leading-relaxed text-gray-600">
            <p>
              Beeija is a growing collection of simple calculators and
              comparison tools that help you estimate costs, compare options,
              and plan technical work with more clarity.
            </p>

            <p>
              You can use Beeija to plan AI usage, cloud services, hosting,
              APIs, SaaS tools, storage, traffic, capacity, and technology
              choices.
            </p>

            <p>
              Before you spend time or money, you should be able to test your
              numbers, understand the likely cost, and compare your options.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/tools"
              className="rounded-xl bg-[var(--green)] px-6 py-3 text-sm font-medium !text-white transition hover:-translate-y-0.5 hover:opacity-95"
            >
              Explore Tools
            </Link>

            <Link
              href="/categories"
              className="rounded-xl border border-[var(--green)] bg-white px-6 py-3 text-sm font-medium text-[var(--green)] transition hover:-translate-y-0.5 hover:bg-green-50"
            >
              Browse Categories
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-100 bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight text-gray-950">
              Explore cost and planning tools by category
            </h2>

            <p className="mt-4 leading-relaxed text-gray-600">
              Choose the area you want to plan for: AI, cloud, hosting,
              infrastructure, APIs, SaaS, capacity, usage, or technology
              comparison.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.href}
                href={category.href}
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-900 transition-colors duration-200 group-hover:text-[var(--green)]">
                  {category.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  {category.description}
                </p>

                <p className="mt-5 text-sm font-medium text-[var(--yellow-dark)]">
                  Explore category →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-4xl">
          <h2 className="text-3xl font-semibold tracking-tight text-gray-950">
            Why Beeija
          </h2>

          <div className="mt-6 space-y-5 leading-relaxed text-gray-600">
            <p>
              Technical pricing is often spread across many pages, price
              levels, and billing units. Beeija brings the main inputs together
              so you can test a real case before making a decision.
            </p>

            <p>
              You may only need to estimate a monthly cost, compare two
              services, check a growth plan, or see whether an idea fits your
              budget.
            </p>

            <p>
              Beeija helps you before and while you plan a technical project.
              When you need useful developer tools during the building stage,
              you can also visit{" "}
              <a
                href="https://yoryantra.com"
                className="font-medium text-[var(--yellow-dark)] transition-colors duration-200"
              >
                Yoryantra
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
