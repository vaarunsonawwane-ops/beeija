"use client";

type BeeijaNumberFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  step?: string;
  prefix?: string;
  suffix?: string;
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
  disabled,
}: BeeijaNumberFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </span>

      <div className="relative">
        {prefix ? (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
            {prefix}
          </span>
        ) : null}

        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(event) => {
            const next = event.target.value;

            if (next === "" || /^\d*\.?\d*$/.test(next)) {
              onChange(next);
            }
          }}
          data-min={min}
          data-max={max}
          data-step={step}
          disabled={disabled}
          className={`min-h-12 w-full rounded-xl border border-gray-300 bg-white py-3 text-sm text-gray-900 outline-none transition hover:border-gray-400 focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 ${
            prefix ? "pl-8 pr-4" : suffix ? "pl-4 pr-10" : "px-4"
          }`}
        />

        {suffix ? (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
            {suffix}
          </span>
        ) : null}
      </div>
    </label>
  );
}
