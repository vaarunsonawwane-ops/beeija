import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  { label: "Tools", href: "/tools" },
  { label: "Categories", href: "/categories" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
  { label: "Sitemap", href: "/sitemap-page" },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <Link
              href="/"
              aria-label="Beeija home"
              className="inline-flex items-center"
            >
              <Image
                src="/logo.png"
                alt="Beeija"
                width={160}
                height={48}
                className="h-9 w-auto object-contain"
              />
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-gray-600">
              Practical tools for estimating AI, cloud, infrastructure, and
              technical costs before you build.
            </p>
          </div>

          <nav
            className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-4"
            aria-label="Footer navigation"
          >
            {footerLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-medium text-gray-700 transition-colors duration-200 hover:text-[var(--green)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-gray-100 pt-6 text-sm md:flex-row md:items-center md:justify-between">
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
