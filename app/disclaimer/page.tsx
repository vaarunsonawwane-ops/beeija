import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer",

  description:
    "Read the disclaimer for Beeija cost estimates, comparisons, pricing information, and planning tools.",

  alternates: {
    canonical: "https://beeija.com/disclaimer",
  },
};

export default function DisclaimerPage() {
  return (
    <main className="bg-white text-gray-700">
      <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
        <h1 className="text-4xl font-bold tracking-tight text-gray-950">
          Disclaimer
        </h1>

        <p className="mt-4 text-sm text-gray-500">
          Last updated: September 16, 2026
        </p>

        <div className="mt-8 space-y-10 leading-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-950">
              What Beeija provides
            </h2>

            <p className="mt-4">
              Beeija provides cost-planning calculators, comparisons, and
              supporting explanations to help you understand how different
              pricing and usage assumptions can affect an estimate.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-950">
              An estimate is not a final bill
            </h2>

            <div className="mt-4 space-y-4">
              <p>
                A Beeija result is an estimate for planning and comparison. It is
                not a provider invoice, official quotation, guaranteed charge,
                or promise of what you will ultimately pay.
              </p>

              <p>
                Actual costs can differ because of provider pricing changes,
                region, currency, service tier, discounts, credits, free tiers,
                taxes, enterprise agreements, billing rules, usage not included
                in the calculation, or other provider-specific factors.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-950">
              Pricing accuracy and verification
            </h2>

            <div className="mt-4 space-y-4">
              <p>
                Beeija is reviewed and improved with the aim of keeping pricing
                inputs, formulas, assumptions, and explanations useful and
                current. Pricing and billing structures can change, however, and
                completeness or error-free results cannot be guaranteed for every
                provider, plan, region, or use case.
              </p>

              <p>
                Before making a purchase, deployment, budget, or other material
                decision, verify important figures against the provider&apos;s
                current pricing page, documentation, billing terms, and the
                conditions that apply to your account.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-950">
              Assumptions and custom inputs
            </h2>

            <p className="mt-4">
              Many estimates depend on the values and assumptions entered into a
              tool. If your workload, usage pattern, pricing agreement, included
              allowance, or provider rate differs from the assumptions shown,
              the resulting estimate can differ from your real cost.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-950">
              Informational use
            </h2>

            <p className="mt-4">
              Beeija is intended to support cost planning and technical
              decision-making. Its tools and content are not financial, legal,
              tax, accounting, or procurement advice, and they do not replace
              professional advice where that is appropriate for your situation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-950">
              External pricing and references
            </h2>

            <p className="mt-4">
              Beeija may link to provider pricing pages, documentation, or other
              third-party resources to help you verify or understand an estimate.
              Those resources are maintained by their respective providers.
              Beeija does not control them and cannot guarantee their continued
              availability, accuracy, or unchanged content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-950">
              Responsibility for use
            </h2>

            <p className="mt-4">
              You are responsible for how you use Beeija and its outputs. To the
              extent permitted by applicable law, Beeija is not responsible for
              loss or damage resulting from reliance on an unverified estimate,
              incorrect assumptions or inputs, provider pricing changes, or use
              outside a tool&apos;s stated purpose.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
