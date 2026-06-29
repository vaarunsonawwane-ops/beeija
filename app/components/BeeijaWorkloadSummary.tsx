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
      className={`beeija-workload-summary mt-7 min-w-0 max-w-full overflow-hidden rounded-xl border-l-4 border-[#F2C94C] bg-[#F5FAF7] px-5 py-4 ${className}`}
    >
      <p className="min-w-0 max-w-full font-medium text-gray-900">
        {title}
      </p>

      <div className="min-w-0 max-w-full">
        {children}
      </div>

      <style>{`
        .beeija-workload-summary,
        .beeija-workload-summary * {
          box-sizing: border-box;
          min-width: 0;
          max-width: 100%;
        }

        .beeija-workload-summary p,
        .beeija-workload-summary span,
        .beeija-workload-summary strong,
        .beeija-workload-summary small,
        .beeija-workload-summary dt,
        .beeija-workload-summary dd,
        .beeija-workload-summary li {
          white-space: normal !important;
          overflow-wrap: anywhere !important;
          word-break: break-word !important;
        }
      `}</style>
    </div>
  );
}
