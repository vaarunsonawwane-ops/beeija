"use client";

import type { ReactNode } from "react";

type BeeijaAdvancedSectionProps = {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  variant?: "subtle" | "card";
  className?: string;
  contentClassName?: string;
};

export default function BeeijaAdvancedSection({
  title,
  description,
  children,
  defaultOpen = false,
  variant = "subtle",
  className = "",
  contentClassName,
}: BeeijaAdvancedSectionProps) {
  const wrapperClass =
    variant === "card"
      ? "min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
      : "rounded-lg border border-slate-200 bg-slate-50/60 p-3";
  const titleClass = variant === "card" ? "text-base" : "text-sm";
  const bodySpacing = contentClassName ?? (variant === "card" ? "mt-4" : "mt-3");

  return (
    <details open={defaultOpen} className={`${wrapperClass} group ${className}`.trim()}>
      <summary
        className={`flex cursor-pointer list-none items-center justify-between gap-3 ${titleClass} font-semibold text-slate-950 [&::-webkit-details-marker]:hidden`}
      >
        <span>{title}</span>
        <span
          aria-hidden="true"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-[var(--green)] transition group-open:rotate-180"
        >
          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
            <path
              d="m6 8 4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </summary>

      {description ? (
        <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
      ) : null}

      <div className={bodySpacing}>{children}</div>
    </details>
  );
}
