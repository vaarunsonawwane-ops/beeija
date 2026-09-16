export const metadata = {
  title: "Privacy Policy",

  description:
    "Learn how Beeija handles tool inputs, analytics, advertising, cookies, and third-party services.",

  alternates: {
    canonical: "https://beeija.com/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="mb-6 text-4xl font-bold">Privacy Policy</h1>

      <p className="mb-8 text-sm text-gray-500">
        Last updated: September 16, 2026
      </p>

      <div className="space-y-6 leading-8 text-gray-700">
        <p>
          Beeija is designed around limited data collection and browser-based
          processing wherever practical.
        </p>

        <h2 className="text-2xl font-semibold text-gray-950">
          Tool inputs
        </h2>

        <p>
          Most Beeija calculator inputs are processed directly in your browser
          and are not intentionally sent to Beeija for calculation or storage.
        </p>

        <h2 className="text-2xl font-semibold text-gray-950">
          Analytics
        </h2>

        <p>
          Beeija uses Google Analytics to understand general website usage, such
          as page visits, device or browser information, and how visitors move
          through the website. This helps us identify problems and understand
          which parts of Beeija are useful.
        </p>

        <h2 className="text-2xl font-semibold text-gray-950">
          Advertising, cookies, and similar technologies
        </h2>

        <p>
          Beeija may display a limited number of advertisements to help support
          the website. Third-party vendors, including Google, may place or read
          cookies in your browser or use web beacons, IP addresses, and similar
          identifiers as part of serving and measuring advertisements.
        </p>

        <p>
          Google and its partners may use advertising cookies to show ads based
          on visits to Beeija or other websites. You can manage or opt out of
          personalized advertising through{" "}
          <a
            href="https://adssettings.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[var(--yellow-dark)] transition-colors duration-200"
          >
            Google Ads Settings
          </a>
          .
        </p>

        <h2 className="text-2xl font-semibold text-gray-950">
          Third-party services and external links
        </h2>

        <p>
          Beeija does not sell or rent your personal information. Service
          providers such as Google may process limited technical or usage
          information when analytics, advertising, or similar website services
          are used.
        </p>

        <p>
          Beeija may link to provider pricing pages, documentation, or other
          external websites. Those websites operate under their own privacy
          policies and practices, which are separate from Beeija.
        </p>

        <h2 className="text-2xl font-semibold text-gray-950">
          Contact
        </h2>

        <p>
          If you have a question about privacy or how Beeija handles website
          data, you can contact us through the Contact page.
        </p>
      </div>
    </div>
  );
}
