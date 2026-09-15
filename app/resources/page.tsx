import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources | Beeija",

  description:
    "Practical explanations for understanding AI and cloud pricing, cost estimates, usage assumptions, provider comparisons, and the limits of cost calculators.",

  alternates: {
    canonical: "https://beeija.com/resources",
  },

  openGraph: {
    title: "Resources | Beeija",
    description:
      "Understand the pricing, usage assumptions, billing units, and other factors behind AI and cloud cost estimates.",
    url: "https://beeija.com/resources",
    siteName: "Beeija",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Resources | Beeija",
    description:
      "Practical guidance for understanding AI and cloud costs, pricing, usage, and estimates.",
  },
};

export default function ResourcesPage() {
  return (
    <main className="bg-white text-gray-900">
      <section className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <div className="max-w-4xl">
          <p className="text-sm font-medium text-[var(--yellow-dark)]">
            Beeija Resources
          </p>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-gray-950 md:text-5xl">
            Understand the numbers behind the estimate.
          </h1>

          <div className="mt-7 max-w-4xl space-y-5 text-lg leading-relaxed text-gray-600">
            <p>
              A cost calculator can give you a number, but the useful part is
              understanding where that number comes from and what could change it.
            </p>

            <p>
              Beeija Resources explains the pricing units, usage assumptions,
              provider differences, and practical limits behind AI and cloud
              cost estimates.
            </p>

            <p>
              Use these notes alongside the calculators when you need more
              context before comparing options or planning what it may cost to
              run and scale your work.
            </p>
          </div>
        </div>

        <section className="mt-16">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-950 md:text-3xl">
              Start with the cost you are trying to understand
            </h2>

            <p className="mt-4 leading-relaxed text-gray-600">
              The details that matter are different for AI workloads and cloud
              infrastructure, so the supporting guidance should be different too.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <Link
              href="/categories/ai-cost-calculators"
              className="group rounded-2xl border border-gray-200 bg-white p-7 transition duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="text-xl font-semibold text-gray-950 transition-colors duration-200 group-hover:text-[var(--green)]">
                AI cost planning
              </h3>

              <p className="mt-4 leading-7 text-gray-600">
                Understand token pricing, cached input, output generation,
                requests, model choice, batch processing, image, voice,
                transcription, and other AI usage costs.
              </p>

              <p className="mt-6 text-sm font-medium text-[var(--yellow-dark)]">
                Explore AI cost calculators →
              </p>
            </Link>

            <Link
              href="/categories/cloud-cost-calculators"
              className="group rounded-2xl border border-gray-200 bg-white p-7 transition duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="text-xl font-semibold text-gray-950 transition-colors duration-200 group-hover:text-[var(--green)]">
                Cloud cost planning
              </h3>

              <p className="mt-4 leading-7 text-gray-600">
                Understand compute, storage, databases, Kubernetes, serverless
                workloads, load balancing, networking, and other cloud billing
                components.
              </p>

              <p className="mt-6 text-sm font-medium text-[var(--yellow-dark)]">
                Explore cloud cost calculators →
              </p>
            </Link>
          </div>
        </section>

        <section className="mt-16 border-t border-gray-200 pt-12">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-semibold text-gray-950">
              Price alone does not determine the bill
            </h2>

            <div className="mt-6 space-y-5 leading-8 text-gray-600">
              <p>
                A published rate is only one part of an estimate. The amount you
                use, the unit being billed, the provider or model you choose,
                and the way your workload behaves can all change the result.
              </p>

              <p>
                AI costs may depend on separate input and output rates, cached
                tokens, batch pricing, repeated requests, or additional services.
                Cloud costs can depend on runtime, storage class, data transfer,
                region, provisioned capacity, requests, and several services
                working together.
              </p>

              <p>
                This is why Beeija calculators try to expose the inputs that
                actually influence the estimate instead of reducing every
                decision to one price field.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-14 rounded-2xl border border-gray-200 bg-gray-50 p-7 md:p-8">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-semibold text-gray-950">
              Compare the same thing on both sides
            </h2>

            <div className="mt-5 space-y-4 leading-8 text-gray-600">
              <p>
                Provider comparisons become misleading when the billing units,
                included usage, workload assumptions, or service scope are not
                equivalent.
              </p>

              <p>
                Before treating one option as cheaper, check whether both sides
                include the same usage, capacity, features, region, processing
                mode, and other charges that matter to your case.
              </p>

              <p>
                Where a Beeija comparison tool needs an assumption, the aim is
                to make that assumption visible rather than hide it inside the
                result.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-14">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-semibold text-gray-950">
              An estimate is not the final invoice
            </h2>

            <div className="mt-6 space-y-5 leading-8 text-gray-600">
              <p>
                A calculator works from the inputs and pricing available to it.
                Your real bill can also include services you did not enter,
                taxes, discounts, credits, minimum charges, regional pricing,
                retries, changing usage, or provider pricing changes.
              </p>

              <p>
                For an important purchasing or architecture decision, use the
                estimate as a planning reference and confirm the applicable
                pricing with the provider before committing money.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-14 border-t border-gray-200 pt-10">
          <h2 className="text-xl font-semibold text-gray-950">
            Ready to work with your own numbers?
          </h2>

          <p className="mt-4 max-w-3xl leading-7 text-gray-600">
            Browse the current Beeija tools and test the usage, pricing, and
            workload assumptions that apply to your situation.
          </p>

          <Link
            href="/tools"
            className="mt-6 inline-flex rounded-xl bg-[var(--green)] px-6 py-3 text-sm font-medium !text-white transition hover:-translate-y-0.5 hover:opacity-95"
          >
            Explore Tools
          </Link>
        </section>
      </section>
    </main>
  );
}