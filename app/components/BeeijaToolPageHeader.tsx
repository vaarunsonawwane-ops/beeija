import Link from "next/link";
import type { ReactNode } from "react";

type BeeijaToolPageHeaderProps = {
  title: string;
  description: ReactNode;
  category: string;
  pricingCheckedDate?: string;
  pricingNote?: ReactNode;
  showBreadcrumb?: boolean;
};

export default function BeeijaToolPageHeader({
  title,
  description,
  category,
  pricingCheckedDate,
  pricingNote,
  showBreadcrumb = false,
}: BeeijaToolPageHeaderProps) {
  return (
    <>
      {showBreadcrumb ? (
        <nav className="beeija-breadcrumb" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[var(--green)]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/tools" className="hover:text-[var(--green)]">
            Tools
          </Link>
        </nav>
      ) : null}

      <div className="mb-8">
        <Link href="/tools" className="beeija-back-link">
          ← Back to Tools
        </Link>
      </div>

      <section className="mb-10 max-w-4xl">
        <p className="beeija-category-label">{category}</p>
        <h1 className="beeija-tool-title">{title}</h1>
        <div className="beeija-tool-description">{description}</div>

        {pricingCheckedDate || pricingNote ? (
          <div className="beeija-pricing-note">
            {pricingCheckedDate ? (
              <>
                Pricing model checked: <strong>{pricingCheckedDate}</strong>.{" "}
              </>
            ) : null}
            {pricingNote}
          </div>
        ) : null}
      </section>
    </>
  );
}
