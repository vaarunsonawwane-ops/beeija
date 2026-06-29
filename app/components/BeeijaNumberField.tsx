"use client";

import {
  useId,
  type ChangeEvent,
  type ReactNode,
} from "react";

type BeeijaNumberFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  step?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  disabled?: boolean;
};

export default function BeeijaNumberField({
  label,
  value,
  onChange,
  min,
  max,
  step,
  prefix,
  suffix,
  disabled = false,
}: BeeijaNumberFieldProps) {
  const inputId = useId();

  return (
    <label htmlFor={inputId} className="block min-w-0">
      <span className="mb-2 block text-sm font-medium leading-6 text-gray-800">
        {label}
      </span>

      <div
        className={`flex min-h-[52px] min-w-0 items-stretch overflow-hidden rounded-xl border border-gray-300 bg-white transition ${
          disabled
            ? "opacity-60"
            : "focus-within:border-[var(--green)] focus-within:ring-1 focus-within:ring-[var(--green)]"
        }`}
      >
        {prefix ? (
          <span className="flex shrink-0 items-center border-r border-gray-200 px-3 text-sm font-semibold text-[var(--green)]">
            {prefix}
          </span>
        ) : null}

        <input
          id={inputId}
          type="number"
          inputMode="decimal"
          value={value}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          onChange={(
            event: ChangeEvent<HTMLInputElement>,
          ) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-gray-900 outline-none [appearance:textfield] disabled:cursor-not-allowed [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />

        {suffix ? (
          <span className="flex shrink-0 items-center whitespace-nowrap border-l border-gray-200 px-3 text-sm font-semibold text-[var(--yellow-dark)]">
            {suffix}
          </span>
        ) : null}
      </div>
    </label>
  );
}
