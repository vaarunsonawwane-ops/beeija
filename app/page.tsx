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
      "Estimate model, token, API, image, voice, transcription, and other AI-related costs.",
    href: "/categories/ai-cost-calculators",
  },
  {
    title: "Cloud Cost Calculators",
    description:
      "Estimate compute, storage, databases, Kubernetes, load balancing, and other cloud costs.",
    href: "/categories/cloud-cost-calculators",
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
            Understand the cost of what you build.
          </h1>

          <div className="mt-8 max-w-4xl space-y-5 text-lg leading-relaxed text-gray-600">
            <p>
              Beeija gives you practical calculators for AI and cloud costs, using the usage, pricing,
              and workload numbers that actually shape the bill.
            </p>

            <p>
              Use them to compare providers, test monthly usage, and see how changes in tokens,
              storage, traffic, databases, or infrastructure affect the estimate.
            </p>

            <p>
              If Yoryantra helps you work through the technical side of building, Beeija is where you
              work through the cost side.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/tools"
              className="rounded-xl bg-[var(--green)] px-6 py-3 text-sm font-medium !text-white transition hover:-translate-y-0.5 hover:opacity-95"
            >
              Explore Calculators
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
              Explore calculators by category
            </h2>

            <p className="mt-4 leading-relaxed text-gray-600">
              Start with the area you want to estimate: AI usage or cloud infrastructure.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
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
