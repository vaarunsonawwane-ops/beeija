import type { ReactNode } from "react";

type BeeijaWorkloadSummaryProps = {
  children: ReactNode;
  title?: string;
  className?: string;
};

export default function BeeijaWorkloadSummary({
  children,
  title = "Shared workload summary",
  className = "",
}: BeeijaWorkloadSummaryProps) {
  return (
    <div
      className={`mt-7 rounded-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-5 py-4 ${className}`}
    >
      <p className="font-medium text-gray-900">{title}</p>
      {children}
    </div>
  );
}
