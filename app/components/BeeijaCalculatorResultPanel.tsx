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
      className={`beeija-result-panel w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 p-6 md:p-8 ${className}`}
      style={{
        width: "100%",
        minWidth: 0,
        maxWidth: "100%",
        overflow: "hidden",
        contain: "inline-size",
      }}
    >
      <h2 className="text-2xl font-semibold text-gray-950">{title}</h2>

      {description ? (
        <p className="mt-3 leading-relaxed text-gray-600">{description}</p>
      ) : null}

      <div className="mt-7 min-w-0 max-w-full overflow-hidden rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-500">{primaryLabel}</p>

        <div
          className="beeija-result-primary mt-2 block min-w-0 max-w-full whitespace-normal text-4xl font-bold tracking-tight text-[var(--green)] tabular-nums"
          style={{
            minWidth: 0,
            maxWidth: "100%",
            whiteSpace: "normal",
            overflowWrap: "anywhere",
            wordBreak: "break-word",
          }}
        >
          {primaryValue}
        </div>

        {stats ? (
          <div
            className="beeija-result-stats mt-6 min-w-0 max-w-full overflow-hidden [&>*]:min-w-0"
            style={{ minWidth: 0, maxWidth: "100%", overflow: "hidden" }}
          >
            {stats}
          </div>
        ) : null}
      </div>

      {breakdown ? (
        <div className="mt-6 min-w-0 max-w-full overflow-x-auto [&>*]:min-w-0">
          {breakdown}
        </div>
      ) : null}

      {totals ? (
        <div
          className="beeija-result-totals mt-6 min-w-0 max-w-full border-t border-gray-200 pt-5 [&>*]:min-w-0"
          style={{
            minWidth: 0,
            maxWidth: "100%",
            overflowWrap: "anywhere",
            wordBreak: "break-word",
          }}
        >
          {totals}
        </div>
      ) : null}

      {children ? (
        <div className="mt-6 min-w-0 max-w-full overflow-x-auto [&>*]:min-w-0">
          {children}
        </div>
      ) : null}

      {noticeText || defaultNotice ? (
        <BeeijaNotice>{noticeText ?? defaultNotice}</BeeijaNotice>
      ) : null}

      <style>{`
        .beeija-result-panel,
        .beeija-result-panel * {
          box-sizing: border-box;
        }

        .beeija-result-primary,
        .beeija-result-primary *,
        .beeija-result-stats,
        .beeija-result-stats > *,
        .beeija-result-stats > * > *,
        .beeija-result-totals,
        .beeija-result-totals * {
          min-width: 0 !important;
          max-width: 100% !important;
        }

        .beeija-result-primary,
        .beeija-result-primary *,
        .beeija-result-stats p,
        .beeija-result-stats span,
        .beeija-result-stats div,
        .beeija-result-totals,
        .beeija-result-totals p,
        .beeija-result-totals span {
          white-space: normal !important;
          overflow-wrap: anywhere !important;
          word-break: break-word !important;
        }
      `}</style>
    </section>
  );
}
