import type { ReactNode } from "react";

type InfoCardProps = {
  title: string;
  children: ReactNode;
  eyebrow?: string;
  className?: string;
};

export default function InfoCard({
  title,
  children,
  eyebrow,
  className = "",
}: InfoCardProps) {
  return (
    <article
      className={`rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ${className}`}
    >
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--yellow-dark)]">
          {eyebrow}
        </p>
      ) : null}

      <h3 className="mt-2 text-lg font-semibold text-gray-950">
        {title}
      </h3>

      <div className="mt-3 text-sm leading-relaxed text-gray-600">
        {children}
      </div>
    </article>
  );
}
