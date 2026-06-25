"use client";

import {
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";
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

  const panelRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    let calculatorGrid: HTMLElement | null = panel.parentElement;

    while (
      calculatorGrid &&
      window.getComputedStyle(calculatorGrid).display !== "grid"
    ) {
      calculatorGrid = calculatorGrid.parentElement;
    }

    const findDirectGridChild = (
      element: HTMLElement,
      grid: HTMLElement,
    ) => {
      let current = element;

      while (current.parentElement && current.parentElement !== grid) {
        current = current.parentElement;
      }

      return current;
    };

    const applyStableCalculatorColumns = () => {
      if (!calculatorGrid || calculatorGrid.children.length < 2) return;

      const gridWidth = calculatorGrid.getBoundingClientRect().width;
      const resultColumn = findDirectGridChild(panel, calculatorGrid);
      const inputColumn = calculatorGrid.firstElementChild;

      calculatorGrid.style.setProperty("width", "100%", "important");
      calculatorGrid.style.setProperty("min-width", "0", "important");
      calculatorGrid.style.setProperty("max-width", "100%", "important");

      if (gridWidth >= 900) {
        calculatorGrid.style.setProperty(
          "grid-template-columns",
          "minmax(18rem, 0.9fr) minmax(0, 1.1fr)",
          "important",
        );
      } else {
        calculatorGrid.style.setProperty(
          "grid-template-columns",
          "minmax(0, 1fr)",
          "important",
        );
      }

      if (inputColumn instanceof HTMLElement) {
        inputColumn.style.setProperty("min-width", "0", "important");
        inputColumn.style.setProperty("max-width", "100%", "important");
      }

      resultColumn.style.setProperty("width", "100%", "important");
      resultColumn.style.setProperty("min-width", "0", "important");
      resultColumn.style.setProperty("max-width", "100%", "important");
      resultColumn.style.setProperty("overflow", "hidden", "important");
    };

    applyStableCalculatorColumns();

    const layoutObserver =
      typeof ResizeObserver !== "undefined" && calculatorGrid
        ? new ResizeObserver(applyStableCalculatorColumns)
        : null;

    if (calculatorGrid && layoutObserver) {
      layoutObserver.observe(calculatorGrid);
    }

    const forceFullValueWrapping = (container: HTMLElement | null) => {
      if (!container) return;

      container.style.setProperty("min-width", "0", "important");
      container.style.setProperty("max-width", "100%", "important");
      container.style.setProperty("white-space", "normal", "important");
      container.style.setProperty("overflow-wrap", "anywhere", "important");
      container.style.setProperty("word-break", "break-all", "important");

      container.querySelectorAll<HTMLElement>("*").forEach((element) => {
        element.style.setProperty("min-width", "0", "important");
        element.style.setProperty("max-width", "100%", "important");
        element.style.setProperty("white-space", "normal", "important");
        element.style.setProperty("overflow-wrap", "anywhere", "important");
        element.style.setProperty("word-break", "break-all", "important");
      });
    };

    const primary = panel.querySelector<HTMLElement>(
      "[data-beeija-result-primary]",
    );
    const stats = panel.querySelector<HTMLElement>(
      "[data-beeija-result-stats]",
    );
    const totals = panel.querySelector<HTMLElement>(
      "[data-beeija-result-totals]",
    );

    forceFullValueWrapping(primary);
    forceFullValueWrapping(stats);
    forceFullValueWrapping(totals);

    const suppliedStatsGrid = stats?.firstElementChild;

    if (suppliedStatsGrid instanceof HTMLElement) {
      suppliedStatsGrid.style.setProperty("display", "grid", "important");
      suppliedStatsGrid.style.setProperty(
        "grid-template-columns",
        "minmax(0, 1fr)",
        "important",
      );
      suppliedStatsGrid.style.setProperty("gap", "1rem", "important");
      suppliedStatsGrid.style.setProperty("width", "100%", "important");
      suppliedStatsGrid.style.setProperty("min-width", "0", "important");
      suppliedStatsGrid.style.setProperty("max-width", "100%", "important");

      Array.from(suppliedStatsGrid.children).forEach((child) => {
        if (!(child instanceof HTMLElement)) return;

        child.style.setProperty("display", "block", "important");
        child.style.setProperty("width", "100%", "important");
        child.style.setProperty("min-width", "0", "important");
        child.style.setProperty("max-width", "100%", "important");
        child.style.setProperty("overflow", "hidden", "important");
        child.style.setProperty(
          "padding-bottom",
          "0.75rem",
          "important",
        );
      });
    }

    return () => {
      layoutObserver?.disconnect();
    };
  }, [primaryValue, stats, totals]);

  return (
    <section
      ref={panelRef}
      className={`beeija-result-panel w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 p-6 md:p-8 ${className}`}
      style={{
        width: "100%",
        minWidth: 0,
        maxWidth: "100%",
        overflow: "hidden",
        contain: "inline-size layout paint",
      }}
    >
      <h2 className="text-2xl font-semibold text-gray-950">{title}</h2>

      {description ? (
        <p className="mt-3 leading-relaxed text-gray-600">{description}</p>
      ) : null}

      <div className="mt-7 min-w-0 max-w-full overflow-hidden rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-500">{primaryLabel}</p>

        <div
          data-beeija-result-primary
          className="beeija-result-primary mt-2 block min-w-0 max-w-full whitespace-normal text-4xl font-bold tracking-tight text-[var(--green)] tabular-nums"
          style={{
            minWidth: 0,
            maxWidth: "100%",
            whiteSpace: "normal",
            overflowWrap: "anywhere",
            wordBreak: "break-all",
          }}
        >
          {primaryValue}
        </div>

        {stats ? (
          <div
            data-beeija-result-stats
            className="beeija-result-stats mt-6 min-w-0 max-w-full overflow-hidden [&>*]:min-w-0"
            style={{
              minWidth: 0,
              maxWidth: "100%",
              overflowX: "hidden",
              overflowY: "visible",
            }}
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
          data-beeija-result-totals
          className="beeija-result-totals mt-6 min-w-0 max-w-full border-t border-gray-200 pt-5 [&>*]:min-w-0"
          style={{
            minWidth: 0,
            maxWidth: "100%",
            overflowWrap: "anywhere",
            wordBreak: "break-all",
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
        .beeija-result-stats *,
        .beeija-result-totals,
        .beeija-result-totals * {
          min-width: 0 !important;
          max-width: 100% !important;
        }

        .beeija-result-primary,
        .beeija-result-primary *,
        .beeija-result-stats *,
        .beeija-result-totals,
        .beeija-result-totals * {
          white-space: normal !important;
          overflow-wrap: anywhere !important;
          word-break: break-all !important;
        }

        .beeija-result-stats > * {
          width: 100% !important;
          min-width: 0 !important;
          max-width: 100% !important;
        }

        .beeija-result-stats [class*="grid"] {
          min-width: 0 !important;
          max-width: 100% !important;
        }
      `}</style>
    </section>
  );
}
