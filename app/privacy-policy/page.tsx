import Link from "next/link";

export const metadata = {
  title: "Privacy Policy",

  description:
    "Learn how Beeija handles tool inputs, analytics, advertising, cookies, technical request data, and third-party services.",

  alternates: {
    canonical: "https://beeija.com/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-white text-gray-700">
      <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
        <h1 className="text-4xl font-bold tracking-tight text-gray-950">
          Privacy Policy
        </h1>

        <p className="mt-4 text-sm text-gray-500">
          Last updated: September 16, 2026
        </p>

        <div className="mt-8 space-y-10 leading-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-950">
              How Beeija approaches privacy
            </h2>

            <div className="mt-4 space-y-4">
              <p>
                Beeija is designed around limited data collection and
                browser-based processing wherever practical.
              </p>

              <p>
                Most Beeija calculator inputs are processed directly in your
                browser and are not intentionally sent to Beeija for calculation
                or storage.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-950">
              Analytics
            </h2>

            <div className="mt-4 space-y-4">
              <p>
                Beeija uses Google Analytics to understand general website usage,
                such as page visits, device or browser information, and how
                visitors move through the website. This helps identify problems,
                improve the website, and understand which parts of Beeija are
                useful.
              </p>

              <p>
                Google Analytics may use cookies or similar identifiers and may
                process technical information according to Google&apos;s own
                policies and the consent choices available to you.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-950">
              Advertising, cookies, and similar technologies
            </h2>

            <div className="mt-4 space-y-4">
              <p>
                Beeija may display a limited number of advertisements to help
                support hosting, maintenance, and continued improvement of the
                website.
              </p>

              <p>
                When Google advertising services are present, Google and its
                partners may place or read cookies, use web beacons, process IP
                addresses, or use other identifiers for purposes such as ad
                delivery, measurement, fraud prevention, frequency controls, and
                ad personalization where permitted.
              </p>

              <p>
                Third-party vendors, including Google, may use cookies to serve
                ads based on your prior visits to Beeija or other websites.
                Google&apos;s advertising cookies may allow Google and its partners
                to show ads based on visits to Beeija and other sites on the
                Internet. You can manage or opt out of personalized advertising
                through{" "}
                <a
                  href="https://adssettings.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[var(--yellow-dark)] transition-colors duration-200"
                >
                  Google Ads Settings
                </a>
                . Where consent is required, advertising or analytics behavior
                may also depend on the choices you make through the consent
                controls available on the site.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-950">
              Hosting and technical request data
            </h2>

            <div className="mt-4 space-y-4">
              <p>
                Like most websites, Beeija&apos;s hosting and security
                infrastructure may process technical request information such as
                IP address, requested URL, browser or device details, timestamps,
                and diagnostic or security signals needed to deliver and protect
                the website.
              </p>

              <p>
                Calculator inputs processed only inside your browser are
                different from this ordinary website request data. A
                browser-local calculation does not need to send its input to
                Beeija merely to perform that calculation.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-950">
              External links and third-party services
            </h2>

            <div className="mt-4 space-y-4">
              <p>
                Beeija may link to provider pricing pages, documentation, and
                other external websites. Those services operate under their own
                privacy policies and practices, which are separate from Beeija.
              </p>

              <p>
                Beeija does not sell or rent your personal information. Service
                providers such as Google may process limited technical or usage
                information when analytics, advertising, hosting, security, or
                similar website services are used.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-950">
              Google&apos;s use of data
            </h2>

            <p className="mt-4">
              Google explains how information is handled when websites use
              services such as Google Analytics and Google advertising in{" "}
              <a
                href="https://policies.google.com/technologies/partner-sites?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[var(--yellow-dark)] transition-colors duration-200"
              >
                How Google uses information from sites or apps that use its
                services ↗
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-950">
              Changes to this policy
            </h2>

            <p className="mt-4">
              This policy may be updated when Beeija&apos;s tools, service
              providers, analytics, advertising, or privacy practices change. The
              date at the top of this page will be updated when the policy is
              revised.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-950">
              Privacy questions
            </h2>

            <p className="mt-4">
              If you have a question about this policy or Beeija&apos;s privacy
              practices, you can contact us through the{" "}
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
