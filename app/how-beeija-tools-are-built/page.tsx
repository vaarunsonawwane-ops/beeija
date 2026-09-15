import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Beeija Tools Are Built",

  description:
    "See how Beeija handles pricing sources, billing units, assumptions, formulas, editable rates, testing, and the limits of cost estimates.",

  alternates: {
    canonical: "https://beeija.com/how-beeija-tools-are-built",
  },

  openGraph: {
    title: "How Beeija Tools Are Built | Beeija",
    description:
      "How Beeija approaches pricing sources, assumptions, calculations, testing, and the limits of technology cost estimates.",
    url: "https://beeija.com/how-beeija-tools-are-built",
    siteName: "Beeija",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "How Beeija Tools Are Built | Beeija",
    description:
      "How Beeija approaches pricing sources, assumptions, calculations, testing, and cost-estimate limitations.",
  },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
          <Link
            href="/"
            className="transition-colors hover:text-[var(--green)]"
          >
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">How Beeija Tools Are Built</span>
        </nav>

        <div className="mt-8 max-w-5xl">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-950 md:text-5xl md:leading-tight">
            How Beeija Tools Are Built
          </h1>

          <div className="mt-7 max-w-5xl space-y-5 text-lg leading-relaxed text-gray-600">
            <p>
              A cost estimate is useful only when you can understand where its
              numbers came from and what assumptions sit behind them.
            </p>

            <p>
              Beeija tools are built to make those parts visible. Pricing
              sources, billing units, editable rates, workload assumptions,
              calculation details, and practical limitations are treated as
              part of the tool rather than hidden behind the final number.
            </p>
          </div>
        </div>

        <section className="mt-14 max-w-5xl">
          <h2 className="text-2xl font-semibold text-gray-950">
            Pricing starts with the source
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-gray-600">
            <p>
              When a tool depends on provider pricing, Beeija should use the
              provider&apos;s own pricing information wherever practical rather
              than relying on remembered rates or an unexplained third-party
              number.
            </p>

            <p>
              Pricing pages can change, so relevant tools should also show when
              their built-in rates were checked. That date is not a promise
              that a price will stay unchanged. It tells you when the pricing
              used by the tool was last reviewed.
            </p>
          </div>
        </section>

        <section className="mt-14 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-950">
              Billing units matter
            </h2>

            <p className="mt-4 leading-relaxed text-gray-600">
              A price per million tokens, request, hour, gigabyte, operation,
              user, or capacity unit cannot be treated as the same kind of
              number. Each tool should calculate against the billing unit that
              actually applies to that service.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-950">
              Assumptions should be visible
            </h2>

            <p className="mt-4 leading-relaxed text-gray-600">
              Estimates often depend on workload assumptions such as request
              volume, token mix, runtime, storage growth, traffic, retries,
              caching, utilization, or fixed monthly charges. Beeija should
              expose the assumptions that materially change the result.
            </p>
          </div>
        </section>

        <section className="mt-14 max-w-5xl">
          <h2 className="text-2xl font-semibold text-gray-950">
            Provider prices should not become permanent constants
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-gray-600">
            <p>
              Prices can differ by provider, model, service, region, plan,
              account, or purchasing arrangement. A fixed built-in number can
              therefore become misleading even when it was correct when the
              tool was created.
            </p>

            <p>
              Where changing rates materially affect the estimate, Beeija tools
              should allow you to review or replace the relevant price instead
              of forcing an old value into the calculation.
            </p>
          </div>
        </section>

        <section className="mt-14 rounded-none border-l-4 border-l-[#F2C94C] bg-[#F5FAF7] p-6 md:p-7">
          <h2 className="text-xl font-semibold text-gray-950">
            The formula should be understandable
          </h2>

          <p className="mt-4 max-w-4xl leading-relaxed text-gray-700">
            Beeija should not turn a set of inputs into one unexplained total.
            When the calculation is more than simple arithmetic, the tool
            should make the important components, units, subtotals, or
            assumptions understandable enough for you to check whether the
            estimate matches the scenario you intended to model.
          </p>
        </section>

        <section className="mt-14 max-w-5xl">
          <h2 className="text-2xl font-semibold text-gray-950">
            Calculations are tested against the decisions the tool is meant to support
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-gray-600">
            <p>
              A calculator can be mathematically correct and still be
              practically misleading if the wrong inputs are combined. Beeija
              tools are reviewed around the real pricing structure and workload
              shape they are intended to represent.
            </p>

            <p>
              Testing should include normal values, zero values, large values,
              optional costs, unit conversions, and combinations that could
              produce confusing or unrealistic results.
            </p>
          </div>
        </section>

        <section className="mt-14 max-w-5xl">
          <h2 className="text-2xl font-semibold text-gray-950">
            An estimate is not the final invoice
          </h2>

          <div className="mt-5 space-y-4 leading-relaxed text-gray-600">
            <p>
              A provider bill can include factors that a planning tool cannot
              fully know in advance: negotiated discounts, taxes, free tiers,
              credits, regional differences, tiered pricing, rounding,
              minimums, bundled usage, or charges created elsewhere in the
              architecture.
            </p>

            <p>
              Beeija is therefore designed for planning and comparison. Before
              making a purchase or deployment decision, current provider
              pricing and the provider&apos;s own billing or pricing tools
              should still be checked when the exact amount matters.
            </p>
          </div>
        </section>

        <section className="mt-14 max-w-5xl">
          <h2 className="text-2xl font-semibold text-gray-950">
            Pricing changes are part of maintenance
          </h2>

          <p className="mt-5 leading-relaxed text-gray-600">
            Cost tools need maintenance after they are published. When a
            provider changes a rate, billing unit, model, plan, or pricing
            structure, the relevant Beeija tool may also need to change. The
            goal is not to freeze a pricing snapshot forever, but to keep the
            calculation understandable and straightforward to update.
          </p>
        </section>

        <section className="mt-16 border-t border-gray-200 pt-10">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-semibold text-gray-950">
              Understand the context, then work with your own numbers
            </h2>

            <p className="mt-4 leading-relaxed text-gray-600">
              The Resources section explains the cost concepts that sit around
              the estimates. The tools let you apply those ideas to your own
              usage, workload, and pricing assumptions.
            </p>

            <div className="mt-7 flex flex-wrap gap-4">
              <Link
                href="/resources"
                className="rounded-xl border border-[var(--green)] bg-white px-5 py-3 text-sm font-medium text-[var(--green)] transition hover:-translate-y-0.5 hover:bg-green-50"
              >
                Explore Resources
              </Link>

              <Link
                href="/tools"
                className="rounded-xl bg-[var(--green)] px-5 py-3 text-sm font-medium !text-white transition hover:-translate-y-0.5 hover:opacity-95"
              >
                Explore Tools
              </Link>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
