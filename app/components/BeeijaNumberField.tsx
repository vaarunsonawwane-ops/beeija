"use client";

import {
  useId,
  type ChangeEvent,
  type ReactNode,
} from "react";
import {
  BEEIJA_MAX_INPUT_LENGTH,
  cleanBeeijaDecimalInput,
  hasBeeijaInputWarning,
} from "@/app/components/BeeijaFormat";

type BeeijaNumberFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  step?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  helper?: ReactNode;
  sanitizeDecimal?: boolean;
  maxLength?: number;
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
  helper,
  sanitizeDecimal = false,
  maxLength = BEEIJA_MAX_INPUT_LENGTH,
  disabled = false,
}: BeeijaNumberFieldProps) {
  const inputId = useId();
  const warning = sanitizeDecimal && hasBeeijaInputWarning(value);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = sanitizeDecimal
      ? cleanBeeijaDecimalInput(event.target.value)
      : event.target.value;

    onChange(nextValue);
  };

  return (
    <label htmlFor={inputId} className="block min-w-0">
      <span className="mb-2 block text-sm font-medium leading-6 text-gray-800">
        {label}
      </span>

      <div
        className={`flex min-h-[52px] min-w-0 items-stretch overflow-hidden rounded-xl border border-gray-300 bg-white transition ${
          disabled
            ? "opacity-60"
            : warning
              ? "border-amber-500 focus-within:ring-1 focus-within:ring-amber-500"
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
          type={sanitizeDecimal ? "text" : "number"}
          inputMode="decimal"
          value={value}
          min={min}
          max={max}
          step={step}
          maxLength={sanitizeDecimal ? maxLength : undefined}
          disabled={disabled}
          onChange={handleChange}
          className="min-w-0 flex-1 bg-transparent px-3 py-3 text-base text-gray-900 outline-none [appearance:textfield] disabled:cursor-not-allowed [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />

        {suffix ? (
          <span className="flex shrink-0 items-center whitespace-nowrap border-l border-gray-200 px-3 text-sm font-semibold text-[var(--yellow-dark)]">
            {suffix}
          </span>
        ) : null}
      </div>

      {helper || warning ? (
        <span className="mt-1 block text-xs leading-5 text-gray-500">
          {warning
            ? "Use a smaller planning value or split the workload into parts."
            : helper}
        </span>
      ) : null}
    </label>
  );
}
