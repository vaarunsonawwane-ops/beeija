import Link from "next/link";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* BREADCRUMB */}
      <div className="mb-8 flex items-center text-sm text-gray-500">
        <Link
          href="/"
          className="transition-colors duration-200 hover:!text-[var(--yellow-dark)]"
        >
          Home
        </Link>

        <span className="mx-2">/</span>

        <Link
          href="/tools"
          className="transition-colors duration-200 hover:!text-[var(--yellow-dark)]"
        >
          Tools
        </Link>
      </div>

      {children}
    </div>
  );
}
