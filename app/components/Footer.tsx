import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="text-lg font-semibold text-gray-950 transition-colors duration-200 hover:!text-[var(--yellow-dark)]"
            >
              Beeija
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-gray-600">
              Practical tools for AI, cloud, infrastructure, and technical cost
              planning.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-gray-950">Tools</h2>

            <div className="mt-4 flex flex-col gap-3 text-sm">
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
          </div>

          <div>
            <h2 className="text-sm font-semibold text-gray-950">Company</h2>

            <div className="mt-4 flex flex-col gap-3 text-sm">
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
          </div>

          <div>
            <h2 className="text-sm font-semibold text-gray-950">Legal</h2>

            <div className="mt-4 flex flex-col gap-3 text-sm">
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

        <div className="mt-10 flex flex-col gap-3 border-t border-gray-200 pt-6 text-sm md:flex-row md:items-center md:justify-between">
          <p className="text-gray-500">
            © {new Date().getFullYear()} Beeija. All rights reserved.
          </p>

          <p className="font-medium text-[var(--yellow-dark)]">
            Built with Gratitude 🙏
          </p>
        </div>
      </div>
    </footer>
  );
}
