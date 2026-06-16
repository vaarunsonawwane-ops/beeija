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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selected = options.find((option) => option.value === value);

  const chooseOption = (nextValue: string) => {
    if (disabled) return;

    onChange({
      target: {
        value: nextValue,
        name: name ?? "",
      },
      currentTarget: {
        value: nextValue,
        name: name ?? "",
      },
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
        onClick={() => setOpen((current) => !current)}
        className="relative w-full rounded-xl border border-gray-300 bg-white p-4 pr-10 text-left text-sm text-gray-900 outline-none transition focus:border-transparent focus:ring-2 focus:ring-[var(--green)] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
      >
        {selected?.label || "Select option"}

        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
          ▾
        </span>
      </button>

      {open ? (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {options.map((option) => {
            const active = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => chooseOption(option.value)}
                className={`block w-full px-4 py-3 text-left text-sm transition ${
                  active
                    ? "bg-[#E8F2EC] font-medium text-[var(--green)]"
                    : "bg-white text-gray-900 hover:bg-[#F5FAF7]"
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
