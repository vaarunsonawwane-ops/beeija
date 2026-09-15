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

];

export const metadata: Metadata = {
  title: "Cost Calculator Categories",

  description:
    "Browse Beeija's current calculator categories for AI and cloud cost planning.",

  alternates: {
    canonical: "https://beeija.com/categories",
  },

  openGraph: {
    title: "Cost Calculator Categories | Beeija",
    description:
      "Browse Beeija's current calculator categories for AI and cloud cost planning.",
    url: "https://beeija.com/categories",
    siteName: "Beeija",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Cost Calculator Categories | Beeija",
    description:
      "Browse Beeija's current calculator categories for AI and cloud cost planning.",
  },
};

export default function CategoriesPage() {
  return (
    <main className="bg-white">
      <section className="mx-auto max-w-7xl px-6 py-16">
        {/* HERO */}
        <div className="max-w-4xl">
			<h1 className="text-4xl font-bold tracking-tight text-gray-950 md:text-5xl md:leading-tight">
			  Explore AI and Cloud Cost Calculators
			</h1>

          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-gray-600 md:text-base">
            Choose a category to estimate costs, compare options, and work with the
            pricing and usage assumptions behind your next technical decision.
          </p>
        </div>

        {/* CATEGORY GRID */}
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {categories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
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
		
		<section className="mt-14 max-w-5xl">
		  <h2 className="text-2xl font-semibold text-gray-950">
			Where AI and cloud costs can overlap
		  </h2>

		  <div className="mt-5 space-y-4 leading-relaxed text-gray-600">
			<p>
			  AI services are often priced around models, tokens, requests, images,
			  audio, or inference. Cloud costs usually come from the infrastructure
			  around the workload, such as compute, storage, databases, bandwidth,
			  serverless usage, and networking.
			</p>

			<p>
			  The two can overlap. An AI application may use a paid model API while
			  also running its own servers, storing data, moving traffic, or using
			  cloud databases. In that case, understanding the full cost may require
			  tools from both categories.
			</p>
		  </div>
		</section>		
		
		
		

      </section>
    </main>
  );
}
