import type { ReactNode } from "react";
import BeeijaNotice from "@/app/components/BeeijaNotice";

type BeeijaCalculatorResultPanelProps = {
  title: string;
  description?: string;

  primaryLabel: string;
  primaryValue: ReactNode;

  stats?: ReactNode;
  breakdown?: ReactNode;
  totals?: ReactNode;
  children?: ReactNode;

  provider?: string;
  pricingCheckedDate?: string;
  excludedCosts?: string;
  noticeText?: ReactNode;

  className?: string;
};

export default function BeeijaCalculatorResultPanel({
  title,
  description,
  primaryLabel,
  primaryValue,
  stats,
  breakdown,
  totals,
  children,
  provider,
  pricingCheckedDate,
  excludedCosts = "taxes, discounts, retries, price changes, and other services not entered in this calculator",
  noticeText,
  className = "",
}: BeeijaCalculatorResultPanelProps) {
  const defaultNotice =
    provider && pricingCheckedDate ? (
      <>
        Calculated from the values currently shown. Default usage values are
        examples, so change them to match your expected usage. Built-in{" "}
        {provider} rates were checked on {pricingCheckedDate}. Final charges may
        include {excludedCosts}.
      </>
    ) : null;

  return (
    <section
      className={`rounded-2xl border border-gray-200 bg-gray-50 p-6 md:p-8 ${className}`}
    >
      <h2 className="text-2xl font-semibold text-gray-950">{title}</h2>

      {description ? (
        <p className="mt-3 leading-relaxed text-gray-600">{description}</p>
      ) : null}

      <div className="mt-7 rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-500">{primaryLabel}</p>

        <div className="mt-2 break-words text-4xl font-bold tracking-tight text-[var(--green)]">
          {primaryValue}
        </div>

        {stats ? <div className="mt-6">{stats}</div> : null}
      </div>

      {breakdown ? <div className="mt-6">{breakdown}</div> : null}

      {totals ? (
        <div className="mt-6 border-t border-gray-200 pt-5">{totals}</div>
      ) : null}

      {children ? <div className="mt-6">{children}</div> : null}

      {noticeText || defaultNotice ? (
        <BeeijaNotice>{noticeText ?? defaultNotice}</BeeijaNotice>
      ) : null}
    </section>
  );
}
