import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* LOGO */}
        <Link href="/" className="flex shrink-0 items-center">
          <img
            src="/logo.png"
            alt="Beeija"
            className="h-9 w-auto md:h-10"
          />
        </Link>

        {/* NAVIGATION */}
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <Link
            href="/"
            className="text-gray-700 transition-colors duration-200 hover:!text-[var(--yellow-dark)]"
          >
            Home
          </Link>

          <Link
            href="/tools"
            className="text-gray-700 transition-colors duration-200 hover:!text-[var(--yellow-dark)]"
          >
            Tools
          </Link>

          <Link
            href="/categories"
            className="text-gray-700 transition-colors duration-200 hover:!text-[var(--yellow-dark)]"
          >
            Categories
          </Link>

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
        </nav>
      </div>
    </header>
  );
}
