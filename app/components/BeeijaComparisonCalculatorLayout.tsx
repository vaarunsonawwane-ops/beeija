import type { ReactNode } from "react";

type BeeijaComparisonCalculatorLayoutProps = {
  children: ReactNode;
};

type BeeijaComparisonColumnProps = {
  children: ReactNode;
  className?: string;
};

export default function BeeijaComparisonCalculatorLayout({
  children,
}: BeeijaComparisonCalculatorLayoutProps) {
  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      {children}
    </div>
  );
}

export function BeeijaComparisonInputPanel({
  children,
  className = "",
}: BeeijaComparisonColumnProps) {
  return (
    <section
      className={`min-w-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8 ${className}`}
    >
      {children}
    </section>
  );
}

export function BeeijaComparisonResultColumn({
  children,
  className = "",
}: BeeijaComparisonColumnProps) {
  return (
    <div className={`min-w-0 overflow-hidden ${className}`}>
      {children}
    </div>
  );
}
