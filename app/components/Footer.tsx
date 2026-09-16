import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white mt-12">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10">
          <div className="max-w-sm">
            <h2 className="text-lg font-bold text-gray-900">
              Beeija
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Practical tools for AI, cloud, infrastructure, usage, and technology cost planning.
            </p>
          </div>

          <div className="flex flex-wrap gap-10 text-sm">
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-gray-900">
                Explore
              </p>

              <Link
                href="/tools"
                className="text-gray-700 hover:!text-[var(--yellow-dark)] transition-colors duration-200"
              >
                Tools
              </Link>

              <Link
                href="/categories"
                className="text-gray-700 hover:!text-[var(--yellow-dark)] transition-colors duration-200"
              >
                Categories
              </Link>

              <Link
                href="/resources"
                className="text-gray-700 hover:!text-[var(--yellow-dark)] transition-colors duration-200"
              >
                Resources
              </Link>
			  
			 <Link
			  href="/sitemap"
			  className="text-gray-700 hover:!text-[var(--yellow-dark)] transition-colors duration-200"
			 >
			  Sitemap
			 </Link>			  
			  
			  
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-semibold text-gray-900">
                Beeija
              </p>

              <Link
                href="/about"
                className="text-gray-700 hover:!text-[var(--yellow-dark)] transition-colors duration-200"
              >
                About
              </Link>

              <Link
                href="/how-beeija-tools-are-built"
                className="text-gray-700 hover:!text-[var(--yellow-dark)] transition-colors duration-200"
              >
                How Tools Are Built
              </Link>

              <Link
                href="/contact"
                className="text-gray-700 hover:!text-[var(--yellow-dark)] transition-colors duration-200"
              >
                Contact
              </Link>

              <a
                href="https://yoryantra.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:!text-[var(--yellow-dark)] transition-colors duration-200"
              >
                Yoryantra — Developer Tools
              </a>
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-semibold text-gray-900">
                Legal
              </p>

              <Link
                href="/privacy-policy"
                className="text-gray-700 hover:!text-[var(--yellow-dark)] transition-colors duration-200"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms"
                className="text-gray-700 hover:!text-[var(--yellow-dark)] transition-colors duration-200"
              >
                Terms
              </Link>

              <Link
                href="/disclaimer"
                className="text-gray-700 hover:!text-[var(--yellow-dark)] transition-colors duration-200"
              >
                Disclaimer
              </Link>

            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-8 pt-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-sm text-gray-500">
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