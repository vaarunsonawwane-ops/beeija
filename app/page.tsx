import Link from "next/link";

export const metadata = {
  title: "Beeija | Practical AI, Cloud & Cost Planning Tools",

  description:
    "Simple browser-based tools to estimate AI and cloud costs, compare technical options, and plan infrastructure without unnecessary complexity.",

  alternates: {
    canonical: "https://beeija.com",
  },

  openGraph: {
    title: "Beeija | Practical AI, Cloud & Cost Planning Tools",

    description:
      "Simple browser-based tools to estimate AI and cloud costs, compare technical options, and plan infrastructure without unnecessary complexity.",

    url: "https://beeija.com",

    siteName: "Beeija",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Beeija | Practical AI, Cloud & Cost Planning Tools",

    description:
      "Simple browser-based tools to estimate AI and cloud costs, compare technical options, and plan infrastructure without unnecessary complexity.",
  },
};

const categories = [
  {
    title: "AI Cost Tools",
    description:
      "Estimate token usage, model pricing, API spending, inference expenses, and other practical AI-related costs.",
    href: "/categories/ai-cost-tools",
  },
  {
    title: "Cloud Cost Tools",
    description:
      "Estimate compute, storage, bandwidth, database, hosting, and everyday cloud infrastructure costs.",
    href: "/categories/cloud-cost-tools",
  },
  {
    title: "Infrastructure Tools",
    description:
      "Plan servers, containers, capacity, traffic, scaling, and infrastructure requirements before deployment.",
    href: "/categories/infrastructure-tools",
  },
  {
    title: "Stack Comparison Tools",
    description:
      "Compare technical options using practical inputs, clear trade-offs, and understandable cost differences.",
    href: "/categories/stack-comparison-tools",
  },
  {
    title: "Usage & Growth Tools",
    description:
      "Estimate how users, requests, storage, traffic, and growth assumptions may affect future costs.",
    href: "/categories/usage-growth-tools",
  },
  {
    title: "Pricing & Budget Tools",
    description:
      "Break down recurring expenses, compare pricing structures, and prepare more realistic technical budgets.",
    href: "/categories/pricing-budget-tools",
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

          <h1 className="mt-8 text-4xl font-semibold tracking-tight text-gray-950 md:text-6xl md:leading-tight">
            Practical tools for better technical decisions — clear, useful,
            and easy to understand.
          </h1>

          <div className="mt-8 max-w-4xl space-y-5 text-lg leading-relaxed text-gray-600">
            <p>
              Beeija is a growing collection of browser-based tools created to
              help you estimate costs, compare options, and plan technical
              decisions with greater clarity.
            </p>

            <p>
              Whether you are working through AI usage, cloud infrastructure,
              hosting, storage, traffic, scaling, or a complete technical stack,
              each tool is designed to turn uncertain inputs into practical
              estimates.
            </p>

            <p>
              When you are planning something new, you should be able to
              understand the likely cost, compare realistic choices, and move
              forward without unnecessary complexity.
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
              Explore by category
            </h2>

            <p className="mt-4 leading-relaxed text-gray-600">
              Find tools based on what you are planning — AI costs, cloud
              infrastructure, stack comparisons, usage, growth, pricing,
              budgeting, and more.
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
              Beeija was created because technical pricing and planning often
              make early decisions feel harder than they need to be.
            </p>

            <p>
              Sometimes you simply need to estimate a monthly cost, compare two
              options, test a growth assumption, or understand whether an idea
              is practical before investing more time and money.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
