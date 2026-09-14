import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Beeija | AI & Technology Cost Planning Tools",
  },

  description:
    "Practical tools for estimating AI, cloud, infrastructure, API, SaaS, capacity, and technology costs, comparing options, and testing usage or workload assumptions.",

  alternates: {
    canonical: "https://beeija.com",
  },

  openGraph: {
    title: "Beeija | AI & Technology Cost Planning Tools",
    description:
      "Estimate AI and technology costs, compare providers and options, and test how usage, workload, and scaling assumptions affect the result.",
    url: "https://beeija.com",
    siteName: "Beeija",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Beeija | AI & Technology Cost Planning Tools",
    description:
      "Estimate AI and technology costs, compare options, and test usage, workload, and scaling assumptions.",
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
              Beeija gives you practical tools for estimating costs, comparing options,
              and understanding the numbers behind AI, cloud, infrastructure, usage,
			  and other technology decisions.
            </p>

            <p>
              Use them to test pricing, workloads, traffic, storage, capacity, provider,
              choices, and other factors that can affect what running and scaling may cost.
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
				Building a technical product involves more than getting the code and
				configuration right. At some point, you also need to understand what
				running it may cost.
			  </p>

			  <p>
				<a
				  href="https://yoryantra.com"
				  target="_blank"
				  rel="noopener noreferrer"
				  className="font-medium text-[var(--yellow-dark)] transition-colors duration-200"
				>
				  Yoryantra
				</a>{" "}
				helps with the technical side of building. Beeija continues that journey
				by helping you estimate AI and cloud costs, compare options, and test
				different usage or workload assumptions.
			  </p>

			  <p>
				The idea is simple: build with a clearer understanding of the technical
				work, then understand the cost that may come with running and scaling it.
			  </p>
			</div>
		  </div>
		</section>
    </main>
  );
}
