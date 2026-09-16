import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",

  description:
    "Contact Beeija about calculator issues, outdated pricing, unclear assumptions, suggestions, or general feedback.",

  alternates: {
    canonical: "https://beeija.com/contact",
  },
};

export default function ContactPage() {
  return (
    <main className="bg-white text-gray-700">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
        <h1 className="text-4xl font-bold tracking-tight text-gray-950">
          Contact Beeija
        </h1>

        <div className="mt-8 space-y-5 text-lg leading-relaxed text-gray-600">
          <p>
            If a calculator behaves unexpectedly, a price looks outdated, an
            assumption is unclear, or you have a practical suggestion for
            Beeija, you can contact me directly.
          </p>

          <p>
            Useful reports help me check whether the calculator, its pricing
            inputs, its assumptions, or its explanation need to be corrected.
          </p>
        </div>

        <section className="mt-10 border-l-4 border-[#F2C94C] bg-[#F5FAF7] p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-gray-950">
            Contact details
          </h2>

          <p className="mt-5 text-gray-700">Varoun Sonawane</p>

          <a
            href="mailto:contactbeeija@gmail.com"
            className="mt-2 inline-block break-all font-medium text-[var(--green)] underline-offset-4 hover:underline"
          >
            contactbeeija@gmail.com
          </a>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-950">
            Reporting a calculator or pricing issue
          </h2>

          <div className="mt-4 space-y-4 leading-8">
            <p>
              Please include the calculator name, what you entered, what you
              expected to see, what actually happened, and the provider, region,
              plan, or pricing page if the issue is related to a rate or billing
              assumption.
            </p>

            <p>
              If you are reporting outdated pricing, a link to the
              provider&apos;s current pricing or documentation page is especially
              helpful.
            </p>

            <p>
              Please do not email passwords, API keys, account credentials,
              invoices containing sensitive information, or other secrets.
              Replace sensitive values with safe examples before sending a
              report.
            </p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-950">
            About the project
          </h2>

          <p className="mt-4 leading-8">
            For the story behind Beeija, visit the{" "}
            <Link
              href="/about"
              className="font-medium text-[var(--green)] underline-offset-4 hover:underline"
            >
              About page
            </Link>
            . You can also read{" "}
            <Link
              href="/how-beeija-tools-are-built"
              className="font-medium text-[var(--green)] underline-offset-4 hover:underline"
            >
              how Beeija tools are built and reviewed
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
