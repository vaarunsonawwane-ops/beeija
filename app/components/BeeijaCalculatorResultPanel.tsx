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

function setImportant(
  element: HTMLElement,
  property: string,
  value: string,
) {
  element.style.setProperty(property, value, "important");
}

function findNearestGrid(element: HTMLElement) {
  let current: HTMLElement | null = element.parentElement;

  while (current) {
    if (window.getComputedStyle(current).display === "grid") {
      return current;
    }

    current = current.parentElement;
  }

  return null;
}

function findDirectGridChild(element: HTMLElement, grid: HTMLElement) {
  let current = element;

  while (current.parentElement && current.parentElement !== grid) {
    current = current.parentElement;
  }

  return current;
}

function forceCompleteNumberWrapping(container: HTMLElement | null) {
  if (!container) return;

  const elements = [
    container,
    ...Array.from(container.querySelectorAll<HTMLElement>("*")),
  ];

  elements.forEach((element) => {
    setImportant(element, "min-width", "0");
    setImportant(element, "max-width", "100%");
    setImportant(element, "white-space", "normal");
    setImportant(element, "overflow-wrap", "anywhere");
    setImportant(element, "word-break", "break-word");
  });
}

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
  const panelRef = useRef<HTMLElement>(null);

  const defaultNotice =
    provider && pricingCheckedDate ? (
      <>
        Calculated from the values currently shown. Default usage values are
        examples, so change them to match your expected usage. Built-in{" "}
        {provider} rates were checked on {pricingCheckedDate}. Final charges may
        include {excludedCosts}.
      </>
    ) : null;

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const calculatorGrid = findNearestGrid(panel);
    const resultGridChild = calculatorGrid
      ? findDirectGridChild(panel, calculatorGrid)
      : null;
    const inputGridChild = calculatorGrid?.firstElementChild;

    const primaryContainer = panel.querySelector<HTMLElement>(
      "[data-beeija-result-primary]",
    );
    const statsContainer = panel.querySelector<HTMLElement>(
      "[data-beeija-result-stats]",
    );
    const totalsContainer = panel.querySelector<HTMLElement>(
      "[data-beeija-result-totals]",
    );

    const applyLayout = () => {
      setImportant(panel, "width", "100%");
      setImportant(panel, "min-width", "0");
      setImportant(panel, "max-width", "100%");
      setImportant(panel, "overflow", "hidden");

      if (calculatorGrid && resultGridChild) {
        const gridWidth = calculatorGrid.getBoundingClientRect().width;

        setImportant(calculatorGrid, "width", "100%");
        setImportant(calculatorGrid, "min-width", "0");
        setImportant(calculatorGrid, "max-width", "100%");

        if (gridWidth >= 900) {
          setImportant(
            calculatorGrid,
            "grid-template-columns",
            "minmax(20rem, 0.95fr) minmax(0, 1.35fr)",
          );
        } else {
          setImportant(
            calculatorGrid,
            "grid-template-columns",
            "minmax(0, 1fr)",
          );
        }

        if (inputGridChild instanceof HTMLElement) {
          setImportant(inputGridChild, "width", "100%");
          setImportant(inputGridChild, "min-width", "0");
          setImportant(inputGridChild, "max-width", "100%");
        }

        setImportant(resultGridChild, "width", "100%");
        setImportant(resultGridChild, "min-width", "0");
        setImportant(resultGridChild, "max-width", "100%");
        setImportant(resultGridChild, "overflow", "hidden");
      }

      forceCompleteNumberWrapping(primaryContainer);
      forceCompleteNumberWrapping(statsContainer);
      forceCompleteNumberWrapping(totalsContainer);

      const suppliedStatsGrid = statsContainer?.firstElementChild;

      if (suppliedStatsGrid instanceof HTMLElement) {
        const panelWidth = statsContainer?.getBoundingClientRect().width ?? 0;
        const statItems = Array.from(suppliedStatsGrid.children).filter(
          (child): child is HTMLElement => child instanceof HTMLElement,
        );

        const longestValueLength = statItems.reduce((longest, item) => {
          const valueElement = item.lastElementChild;
          const text = valueElement?.textContent?.replace(/\s/g, "") ?? "";
          return Math.max(longest, text.length);
        }, 0);

        let columns = 3;

        if (longestValueLength > 22 || panelWidth < 520) {
          columns = 1;
        } else if (longestValueLength > 14 || panelWidth < 700) {
          columns = 2;
        }

        setImportant(suppliedStatsGrid, "display", "grid");
        setImportant(
          suppliedStatsGrid,
          "grid-template-columns",
          `repeat(${columns}, minmax(0, 1fr))`,
        );
        setImportant(suppliedStatsGrid, "gap", "1rem");
        setImportant(suppliedStatsGrid, "width", "100%");
        setImportant(suppliedStatsGrid, "min-width", "0");
        setImportant(suppliedStatsGrid, "max-width", "100%");

        statItems.forEach((item) => {
          setImportant(item, "width", "100%");
          setImportant(item, "min-width", "0");
          setImportant(item, "max-width", "100%");
          setImportant(item, "overflow", "hidden");

          item.querySelectorAll<HTMLElement>("*").forEach((element) => {
            setImportant(element, "min-width", "0");
            setImportant(element, "max-width", "100%");
            setImportant(element, "white-space", "normal");
            setImportant(element, "overflow-wrap", "anywhere");
            setImportant(element, "word-break", "break-word");
          });
        });
      }
    };

    applyLayout();

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(applyLayout)
        : null;

    if (resizeObserver) {
      resizeObserver.observe(panel);

      if (calculatorGrid) {
        resizeObserver.observe(calculatorGrid);
      }
    }

    const mutationObserver = new MutationObserver(applyLayout);
    mutationObserver.observe(panel, {
      subtree: true,
      childList: true,
      characterData: true,
    });

    return () => {
      resizeObserver?.disconnect();
      mutationObserver.disconnect();
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
          className="mt-2 block min-w-0 max-w-full whitespace-normal text-4xl font-bold tracking-tight text-[var(--green)] tabular-nums"
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
            data-beeija-result-stats
            className="mt-6 min-w-0 max-w-full overflow-hidden"
            style={{ minWidth: 0, maxWidth: "100%", overflow: "hidden" }}
          >
            {stats}
          </div>
        ) : null}
      </div>

      {breakdown ? (
        <div className="mt-6 min-w-0 max-w-full overflow-x-auto">
          {breakdown}
        </div>
      ) : null}

      {totals ? (
        <div
          data-beeija-result-totals
          className="mt-6 min-w-0 max-w-full border-t border-gray-200 pt-5"
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
        <div className="mt-6 min-w-0 max-w-full overflow-x-auto">
          {children}
        </div>
      ) : null}

      {noticeText || defaultNotice ? (
        <BeeijaNotice>{noticeText ?? defaultNotice}</BeeijaNotice>
      ) : null}
    </section>
  );
}
