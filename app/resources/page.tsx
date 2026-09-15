import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources | Beeija",

  description:
    "Practical guidance for understanding AI and cloud pricing, usage assumptions, provider comparisons, billing units, and the limits of cost estimates.",

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

const estimateFactors = [
  {
    title: "Usage volume",
    text: "Requests, tokens, runtime, storage, traffic, users, or transactions can change the estimate more than the headline unit price.",
  },
  {
    title: "Billing unit",
    text: "A price per million tokens, GB-month, vCPU-hour, request, minute, or seat cannot be compared until the units are brought onto the same basis.",
  },
  {
    title: "Provider or service choice",
    text: "Two services that solve a similar problem may price different parts of the workload separately or include different features in the base rate.",
  },
  {
    title: "Workload behaviour",
    text: "Caching, retries, idle capacity, burst traffic, output length, batch processing, and utilization can move the real cost away from a simple average.",
  },
  {
    title: "Location and service tier",
    text: "Cloud regions, storage classes, support levels, model variants, and processing modes can carry different rates or limits.",
  },
  {
    title: "Charges outside the main rate",
    text: "Data transfer, requests, backups, monitoring, taxes, support, minimum charges, and connected services may sit outside the number you first notice.",
  },
];

export default function ResourcesPage() {
  return (
    <main className="bg-white text-gray-900">
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <nav
          aria-label="Breadcrumb"
          className="mb-12 flex items-center text-sm text-gray-500"
        >
          <Link
            href="/"
            className="transition-colors duration-200 hover:!text-[var(--yellow-dark)]"
          >
            Home
          </Link>

          <span className="mx-2">/</span>

          <span className="text-gray-700">Resources</span>
        </nav>

        <div className="max-w-5xl">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-950 md:text-5xl md:leading-tight">
            Understand the numbers behind the estimate.
          </h1>

          <div className="mt-7 max-w-5xl space-y-5 text-lg leading-relaxed text-gray-600">
            <p>
              A cost estimate can give you a number, but the useful part is
              understanding where that number comes from and what could change
              it.
            </p>

            <p>
              Beeija Resources explains the pricing units, usage assumptions,
              provider differences, and practical limits behind AI and cloud
              cost estimates.
            </p>

            <p>
              Use these notes alongside the tools when you need more context
              before comparing options or planning what it may cost to run and
              scale your work.
            </p>
          </div>
        </div>

        <section className="mt-16">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-950 md:text-3xl">
              Start with the cost you are trying to understand
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              AI workloads and cloud infrastructure are billed in different
              ways. The useful inputs, common mistakes, and comparison points
              are different too.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <Link
              href="/categories/ai-cost-calculators"
              className="group rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="text-xl font-semibold text-gray-950 transition-colors duration-200 group-hover:text-[var(--green)]">
                AI cost planning
              </h3>

              <p className="mt-4 leading-7 text-gray-600">
                Work through token pricing, cached input, generated output,
                requests, model choice, batch processing, image generation,
                voice, transcription, and other AI usage costs.
              </p>

              <p className="mt-6 text-sm font-medium text-[var(--yellow-dark)]">
                Explore AI cost calculators →
              </p>
            </Link>

            <Link
              href="/categories/cloud-cost-calculators"
              className="group rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="text-xl font-semibold text-gray-950 transition-colors duration-200 group-hover:text-[var(--green)]">
                Cloud cost planning
              </h3>

              <p className="mt-4 leading-7 text-gray-600">
                Work through compute, storage, databases, Kubernetes,
                serverless workloads, load balancing, networking, and the
                other billing components that can sit around a cloud service.
              </p>

              <p className="mt-6 text-sm font-medium text-[var(--yellow-dark)]">
                Explore cloud cost calculators →
              </p>
            </Link>
          </div>
        </section>

        <section className="mt-16 border-t border-gray-200 pt-12">
          <div className="max-w-5xl">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-950 md:text-3xl">
              What usually changes an estimate most
            </h2>

            <p className="mt-4 max-w-3xl leading-7 text-gray-600">
              The cheapest-looking unit price does not always produce the
              lowest monthly bill. Before comparing results, check the parts of
              the workload that actually drive usage.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {estimateFactors.map((factor) => (
              <div
                key={factor.title}
                className="rounded-2xl border border-gray-200 bg-white p-6"
              >
                <h3 className="text-lg font-semibold text-gray-950">
                  {factor.title}
                </h3>

                <p className="mt-3 leading-7 text-gray-600">{factor.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <div className="max-w-5xl">
            <h2 className="text-2xl font-semibold text-gray-950">
              A published price is not the same as a monthly bill
            </h2>

            <div className="mt-6 space-y-5 leading-8 text-gray-600">
              <p>
                Provider pricing pages usually publish rates for individual
                units: a token, request, minute, GB, instance, vCPU, database,
                or another measurable part of the service. Your bill is the
                result of those units being used together over time.
              </p>

              <p>
                For example, a model with a lower input-token rate may still
                cost more for your workload if it produces substantially more
                output, receives more repeated requests, or needs an additional
                service around it. A cloud database price may look small until
                storage, backups, network transfer, replicas, and provisioned
                capacity are included.
              </p>

              <p>
                The practical question is therefore not only “What is the
                price?” but “Which billable units will my workload actually
                consume, and how often?”
              </p>
            </div>
          </div>
        </section>

        <section className="mt-14 rounded-2xl border border-gray-200 bg-gray-50 p-7 md:p-8">
          <div className="max-w-5xl">
            <h2 className="text-2xl font-semibold text-gray-950">
              Compare the same thing on both sides
            </h2>

            <div className="mt-5 space-y-4 leading-8 text-gray-600">
              <p>
                Provider comparisons become misleading when the billing units,
                included usage, service scope, or workload assumptions are not
                equivalent.
              </p>

              <p>
                Before treating one option as cheaper, check whether both sides
                include the same amount of work: the same request volume,
                tokens, runtime, storage, traffic, region, processing mode,
                redundancy, and any connected services that matter to your
                case.
              </p>

              <p>
                If one provider includes something that another charges for
                separately, put that difference into the comparison instead of
                comparing only the headline rates.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-14">
          <div className="max-w-5xl">
            <h2 className="text-2xl font-semibold text-gray-950">
              Use a range when the workload is still uncertain
            </h2>

            <div className="mt-6 space-y-5 leading-8 text-gray-600">
              <p>
                Early-stage planning rarely gives you one perfectly known
                usage number. A more useful approach is to test a low, expected,
                and high case rather than treating the first estimate as a
                promise.
              </p>

              <p>
                If a workload may receive 100,000 requests in one month and
                500,000 after growth, calculate both. If output length, cache
                hit rate, storage growth, or utilization is uncertain, change
                those assumptions and see how much the result moves.
              </p>

              <p>
                The assumptions that move the estimate the most deserve the
                most attention. Small differences in a minor unit rate may
                matter less than a large change in usage volume or architecture.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-14 border-t border-gray-200 pt-12">
          <div className="max-w-5xl">
            <h2 className="text-2xl font-semibold text-gray-950">
              An estimate is not the final invoice
            </h2>

            <div className="mt-6 space-y-5 leading-8 text-gray-600">
              <p>
                A tool can only calculate from the inputs and pricing available
                to it. Your real bill may also include services you did not
                enter, taxes, credits, discounts, commitments, minimum charges,
                regional differences, retries, changing usage, or pricing
                updates made by the provider.
              </p>

              <p>
                For an important purchasing or architecture decision, use the
                estimate as a planning reference and confirm the current rates,
                conditions, and billing rules with the provider before
                committing money.
              </p>

              <p>
                When the provider offers its own pricing documentation or
                calculator, that is also worth checking for account-specific,
                regional, contractual, or service details that a general
                planning tool cannot know.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-14 rounded-2xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] p-7 md:p-8">
          <div className="max-w-5xl">
            <h2 className="text-2xl font-semibold text-gray-950">
              How Beeija approaches the calculation
            </h2>

            <p className="mt-5 leading-8 text-gray-600">
              Pricing sources, checked dates, assumptions, formulas, custom
              rates, testing, and the limits of an estimate are part of the
              trust behind a cost-planning tool. The methodology should be as
              understandable as the result itself.
            </p>

            <Link
              href="/how-beeija-tools-are-built"
              className="mt-5 inline-flex text-sm font-medium text-[var(--yellow-dark)] transition-colors duration-200 hover:text-[var(--green)]"
            >
              How Beeija Tools Are Built →
            </Link>
          </div>
        </section>

        <section className="mt-14 border-t border-gray-200 pt-10">
          <h2 className="text-xl font-semibold text-gray-950">
            Ready to work with your own numbers?
          </h2>

          <p className="mt-4 max-w-3xl leading-7 text-gray-600">
            Browse the current Beeija tools and test the pricing, usage, and
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
