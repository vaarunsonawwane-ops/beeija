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
      <section className="beeija-page pb-20 md:pb-24">
        <div className="max-w-4xl">
          <Link
            href="/tools"
            className="beeija-back-link"
          >
            ← Back to Tools
          </Link>

          {category ? (
            <p className="mt-8 beeija-category-label">
              {category}
            </p>
          ) : null}

          <h1 className="beeija-tool-title">
            {title}
          </h1>

          <p className="beeija-tool-description">
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
