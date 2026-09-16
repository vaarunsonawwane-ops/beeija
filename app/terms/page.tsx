import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",

  description:
    "Read the terms for using Beeija cost-planning tools, estimates, comparisons, and website content.",

  alternates: {
    canonical: "https://beeija.com/terms",
  },
};

export default function TermsPage() {
  return (
    <main className="bg-white text-gray-700">
      <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
        <h1 className="text-4xl font-bold tracking-tight text-gray-950">
          Terms of Use
        </h1>

        <p className="mt-4 text-sm text-gray-500">
          Last updated: September 16, 2026
        </p>

        <div className="mt-8 space-y-10 leading-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-950">
              Using Beeija
            </h2>

            <div className="mt-4 space-y-4">
              <p>
                By accessing or using Beeija, you agree to use the website, its
                tools, and its content responsibly and for lawful purposes.
              </p>

              <p>
                Do not use Beeija in a way that interferes with the website,
                attempts to bypass access controls, distributes malicious
                material, or violates applicable law or the rights of another
                person or organization.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-950">
              Estimates, comparisons, and decisions
            </h2>

            <div className="mt-4 space-y-4">
              <p>
                Beeija tools are designed for cost planning, comparison, and
                understanding how different usage or workload assumptions can
                affect an estimate. A result is not a provider invoice, official
                quote, guaranteed bill, or promise of a final charge.
              </p>

              <p>
                Actual costs can differ because of provider pricing changes,
                region, currency, service tier, discounts, credits, free tiers,
                taxes, enterprise agreements, billing rules, usage not entered
                into the tool, or other provider-specific factors.
              </p>

              <p>
                You are responsible for reviewing important results and checking
                current provider pricing, documentation, and billing details
                before making a purchase, deployment, or other material
                decision.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-950">
              Pricing sources and external services
            </h2>

            <div className="mt-4 space-y-4">
              <p>
                Beeija may reference provider pricing pages, documentation, or
                other external services to help explain or verify an estimate.
                Those resources are maintained by their respective providers and
                may change independently of Beeija.
              </p>

              <p>
                A link to an external website does not mean Beeija controls that
                website, guarantees its accuracy, or guarantees that its content
                or pricing will remain unchanged.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-950">
              Availability and changes
            </h2>

            <p className="mt-4">
              Beeija may correct, improve, replace, suspend, or remove a tool,
              page, feature, pricing assumption, or explanation when necessary.
              The website is provided on an &quot;as is&quot; and &quot;as
              available&quot; basis, and uninterrupted or error-free availability
              is not guaranteed.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-950">
              Limitation of responsibility
            </h2>

            <p className="mt-4">
              To the extent permitted by applicable law, Beeija is not
              responsible for loss or damage arising from reliance on an
              estimate, inability to access the website, use or misuse of a tool
              result, or a decision made without appropriate independent
              verification.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-950">
              Updates to these terms
            </h2>

            <p className="mt-4">
              These terms may change as Beeija evolves. The date at the top of
              this page will be updated when the terms are revised. Continued use
              of the website after an update means the revised terms apply to
              that continued use.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-950">
              Questions
            </h2>

            <p className="mt-4">
              Questions about these terms can be sent through the{" "}
              <Link
                href="/contact"
                className="font-medium text-[var(--yellow-dark)] transition-colors duration-200"
              >
                Contact
              </Link>{" "}
              page.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
