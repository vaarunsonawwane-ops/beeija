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
      className={`beeija-feature-card shadow-sm ${className}`}
    >
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--yellow-dark)]">
          {eyebrow}
        </p>
      ) : null}

      <h3 className="mt-2 beeija-feature-card-title">
        {title}
      </h3>

      <div className="beeija-feature-card-copy">
        {children}
      </div>
    </article>
  );
}
