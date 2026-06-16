import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* TOP SECTION */}
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row">
          {/* BRAND */}
          <div className="max-w-sm">
            <h2 className="text-lg font-bold text-gray-900">
              Beeija
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Practical tools for AI, cloud, infrastructure, and technical cost
              planning.
            </p>
          </div>

          {/* LINKS */}
          <div className="flex flex-wrap gap-10 text-sm">
            {/* TOOLS */}
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-gray-900">
                Tools
              </p>

              <Link
                href="/tools"
                className="text-gray-700 transition-colors duration-200 hover:!text-[var(--yellow-dark)]"
              >
                All Tools
              </Link>

              <Link
                href="/categories"
                className="text-gray-700 transition-colors duration-200 hover:!text-[var(--yellow-dark)]"
              >
                Categories
              </Link>
            </div>

            {/* COMPANY */}
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-gray-900">
                Company
              </p>

              <Link
                href="/about"
                className="text-gray-700 transition-colors duration-200 hover:!text-[var(--yellow-dark)]"
              >
                About
              </Link>

              <Link
                href="/contact"
                className="text-gray-700 transition-colors duration-200 hover:!text-[var(--yellow-dark)]"
              >
                Contact
              </Link>
            </div>

            {/* LEGAL */}
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-gray-900">
                Legal
              </p>

              <Link
                href="/privacy-policy"
                className="text-gray-700 transition-colors duration-200 hover:!text-[var(--yellow-dark)]"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms"
                className="text-gray-700 transition-colors duration-200 hover:!text-[var(--yellow-dark)]"
              >
                Terms
              </Link>

              <Link
                href="/disclaimer"
                className="text-gray-700 transition-colors duration-200 hover:!text-[var(--yellow-dark)]"
              >
                Disclaimer
              </Link>

              <Link
                href="/sitemap"
                className="text-gray-700 transition-colors duration-200 hover:!text-[var(--yellow-dark)]"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-8 flex flex-col items-start justify-between gap-2 border-t border-gray-100 pt-5 text-sm text-gray-500 md:flex-row md:items-center">
          <p>
            © {new Date().getFullYear()} Beeija. All rights reserved.
          </p>

          <p className="text-sm font-medium text-[var(--yellow-dark)]">
            Built with Gratitude 🙏
          </p>
        </div>
      </div>
    </footer>
  );
}
