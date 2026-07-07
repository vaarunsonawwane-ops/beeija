"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type SelectHTMLAttributes,
} from "react";

type Option = {
  label: string;
  value: string;
};

type BeeijaSelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "children"
> & {
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  label?: string;
};

export default function BeeijaSelect({
  value,
  onChange,
  options,
  label,
  name,
  disabled,
}: BeeijaSelectProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((option) => option.value === value);

  const chooseOption = (nextValue: string) => {
    if (disabled) return;

    onChange({
      target: { value: nextValue, name: name ?? "" },
      currentTarget: { value: nextValue, name: name ?? "" },
    } as ChangeEvent<HTMLSelectElement>);

    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      {label ? (
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {label}
        </label>
      ) : null}

      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={`relative flex min-h-12 w-full items-center justify-between rounded-xl border bg-white px-4 py-3 text-left text-base text-gray-900 outline-none transition disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 ${
          open
            ? "border-[var(--green)] ring-1 ring-[var(--green)]"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <span>{selected?.label || "Select option"}</span>

        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          className={`h-4 w-4 shrink-0 text-[var(--green)] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          <path
            d="m6 8 4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open ? (
        <div
          role="listbox"
          className="absolute z-50 mt-1.5 w-full overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
        >
          {options.map((option) => {
            const active = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => chooseOption(option.value)}
                className={`block w-full px-4 py-2.5 text-left text-base transition ${
                  active
                    ? "bg-[#F5FAF7] font-medium text-[var(--green)]"
                    : "bg-white text-gray-900 hover:bg-[#FFFBEA]"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
