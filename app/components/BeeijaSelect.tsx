import type { SelectHTMLAttributes } from "react";

type BeeijaSelectOption = {
  label: string;
  value: string;
};

type BeeijaSelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "children"
> & {
  label?: string;
  options: BeeijaSelectOption[];
  placeholder?: string;
};

export default function BeeijaSelect({
  label,
  options,
  placeholder,
  id,
  className = "",
  ...props
}: BeeijaSelectProps) {
  const selectId = id ?? props.name;

  return (
    <label className="block">
      {label ? (
        <span className="mb-2 block text-sm font-medium text-gray-800">
          {label}
        </span>
      ) : null}

      <div className="relative">
        <select
          id={selectId}
          className={`min-h-12 w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 pr-11 text-sm text-gray-900 outline-none transition focus:border-[var(--green)] focus:ring-4 focus:ring-[var(--green)]/10 ${className}`}
          {...props}
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}

          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--green)]"
        >
          <path
            d="m6 8 4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </label>
  );
}
