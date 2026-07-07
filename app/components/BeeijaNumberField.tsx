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
      <span className="mb-1 block text-xs font-semibold leading-5 text-slate-800">
        {label}
      </span>

      <div
        className={`relative min-w-0 rounded-lg border border-slate-300 bg-white transition ${
          disabled
            ? "opacity-60"
            : warning
              ? "border-amber-500 focus-within:ring-1 focus-within:ring-amber-500"
              : "focus-within:border-[var(--green)] focus-within:ring-1 focus-within:ring-[var(--green)]"
        }`}
      >
        {prefix ? (
          <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-sm font-semibold text-[var(--green)]">
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
          className={`min-h-[38px] w-full min-w-0 bg-transparent py-2 text-sm text-slate-900 outline-none [appearance:textfield] placeholder:text-slate-400 disabled:cursor-not-allowed [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
            prefix ? "pl-8" : "pl-3"
          } ${suffix ? "pr-24" : "pr-3"}`}
        />

        {suffix ? (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 whitespace-nowrap text-xs font-medium text-slate-500">
            {suffix}
          </span>
        ) : null}
      </div>

      {helper || warning ? (
        <span className="mt-1 block text-xs leading-5 text-slate-500">
          {warning
            ? "Use a smaller planning value or split the workload into parts."
            : helper}
        </span>
      ) : null}
    </label>
  );
}
