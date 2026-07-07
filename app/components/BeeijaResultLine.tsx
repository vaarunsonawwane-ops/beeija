import type { ReactNode } from "react";

type BeeijaResultLineProps = {
  label: ReactNode;
  value: ReactNode;
  muted?: boolean;
  className?: string;
};

export default function BeeijaResultLine({
  label,
  value,
  muted = false,
  className = "",
}: BeeijaResultLineProps) {
  return (
    <div
      className={`grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-3 rounded-lg bg-white px-3 py-2 ${className}`}
    >
      <span
        className={`min-w-0 text-base leading-6 ${
          muted ? "text-gray-500" : "text-gray-700"
        }`}
      >
        {label}
      </span>
      <span className="max-w-[9rem] truncate text-right text-base font-semibold tabular-nums text-gray-950 sm:max-w-[12rem]">
        {value}
      </span>
    </div>
  );
}
