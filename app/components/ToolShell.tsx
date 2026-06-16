import type { ReactNode } from "react";
import Link from "next/link";

type ToolShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  category?: string;
  actions?: ReactNode;
};

export default function ToolShell({
  title,
  description,
  children,
  category,
  actions,
}: ToolShellProps) {
  return (
    <main className="bg-white text-gray-900">
      <section className="mx-auto max-w-7xl px-6 pb-20 pt-8 md:pb-24 md:pt-12">
        <div className="max-w-4xl">
          <Link
            href="/tools"
            className="inline-flex text-sm text-gray-600 transition-colors duration-200 hover:!text-[var(--yellow-dark)]"
          >
            ← Back to Tools
          </Link>

          {category ? (
            <p className="mt-8 text-sm font-medium uppercase tracking-[0.14em] text-[var(--yellow-dark)]">
              {category}
            </p>
          ) : null}

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-gray-950 md:text-6xl md:leading-tight">
            {title}
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-gray-600">
            {description}
          </p>

          {actions ? (
            <div className="mt-8 flex flex-wrap gap-4">
              {actions}
            </div>
          ) : null}
        </div>

        <div className="mt-12">{children}</div>
      </section>
    </main>
  );
}
