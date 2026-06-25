"use client";

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
      className={`beeija-result-panel w-full min-w-0 max-w-full overflow-hidden overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 p-6 md:p-8 ${className}`}
    >
      <h2 className="min-w-0 break-words text-2xl font-semibold text-gray-950">
        {title}
      </h2>

      {description ? (
        <p className="mt-3 min-w-0 break-words leading-relaxed text-gray-600">
          {description}
        </p>
      ) : null}

      <div className="mt-7 min-w-0 max-w-full overflow-hidden rounded-2xl bg-white p-6 shadow-sm">
        <p className="min-w-0 break-words text-sm font-medium text-gray-500">
          {primaryLabel}
        </p>

        <div
          data-beeija-result-primary
          className="beeija-result-primary mt-2 min-w-0 max-w-full whitespace-normal font-bold tracking-tight text-[var(--green)] tabular-nums"
        >
          {primaryValue}
        </div>

        {stats ? (
          <div
            data-beeija-result-stats
            className="beeija-result-stats mt-6 min-w-0 max-w-full overflow-hidden"
          >
            {stats}
          </div>
        ) : null}
      </div>

      {breakdown ? (
        <div className="beeija-result-breakdown mt-6 min-w-0 max-w-full overflow-x-auto">
          {breakdown}
        </div>
      ) : null}

      {totals ? (
        <div
          data-beeija-result-totals
          className="beeija-result-totals mt-6 min-w-0 max-w-full border-t border-gray-200 pt-5"
        >
          {totals}
        </div>
      ) : null}

      {children ? (
        <div className="mt-6 min-w-0 max-w-full overflow-x-auto">
          {children}
        </div>
      ) : null}

      {noticeText || defaultNotice ? (
        <BeeijaNotice>{noticeText ?? defaultNotice}</BeeijaNotice>
      ) : null}

      <style>{`
        .beeija-result-panel {
          container-type: inline-size;
          inline-size: 100%;
          min-inline-size: 0;
          max-inline-size: 100%;
          contain: inline-size;
        }

        .beeija-result-panel,
        .beeija-result-panel * {
          box-sizing: border-box;
        }

        .beeija-result-primary {
          font-size: clamp(1.75rem, 5cqi, 2.25rem);
          line-height: 1.16;
        }

        .beeija-result-primary,
        .beeija-result-primary *,
        .beeija-result-stats,
        .beeija-result-stats *,
        .beeija-result-totals,
        .beeija-result-totals * {
          min-width: 0 !important;
          max-width: 100% !important;
          white-space: normal !important;
          overflow-wrap: anywhere !important;
          word-break: break-word !important;
        }

        .beeija-result-stats > * {
          display: grid !important;
          grid-template-columns: minmax(0, 1fr) !important;
          gap: 1rem !important;
          width: 100% !important;
          min-width: 0 !important;
          max-width: 100% !important;
        }

        .beeija-result-stats > * > * {
          width: 100% !important;
          min-width: 0 !important;
          max-width: 100% !important;
          overflow: hidden !important;
          border-top: 1px solid #e5e7eb;
          padding-top: 0.875rem;
        }

        .beeija-result-stats > * > *:first-child {
          border-top: 0;
          padding-top: 0;
        }

        .beeija-result-stats p,
        .beeija-result-stats span,
        .beeija-result-stats div {
          white-space: normal !important;
          overflow-wrap: anywhere !important;
          word-break: break-word !important;
        }

        .beeija-result-breakdown table {
          width: max-content;
          min-width: 100%;
        }


        /*
         * Stabilise every calculator that places the shared result panel in a
         * two-column grid. Long result values must never change column widths.
         */
        @media (min-width: 1024px) {
          .grid:has(> .beeija-result-panel),
          .grid:has(> * > .beeija-result-panel) {
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) !important;
            align-items: start !important;
          }

          .grid:has(> .beeija-result-panel) > *,
          .grid:has(> * > .beeija-result-panel) > * {
            min-width: 0 !important;
            max-width: 100% !important;
          }

          .grid:has(> .beeija-result-panel) > .beeija-result-panel,
          .grid:has(> * > .beeija-result-panel) > *:has(> .beeija-result-panel) {
            width: 100% !important;
            min-width: 0 !important;
            max-width: 100% !important;
            overflow: hidden !important;
          }
        }

      `}</style>
    </section>
  );
}
