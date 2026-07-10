"use client";

import { useId, type ChangeEvent } from "react";

type BeeijaTextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helper?: string;
  placeholder?: string;
  disabled?: boolean;
};

export default function BeeijaTextField({
  label,
  value,
  onChange,
  helper,
  placeholder,
  disabled = false,
}: BeeijaTextFieldProps) {
  const inputId = useId();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <label htmlFor={inputId} className="block min-w-0">
      <span className="mb-1 block text-[11.5px] font-semibold leading-5 text-slate-800">
        {label}
      </span>

      <input
        id={inputId}
        type="text"
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={handleChange}
        className="min-h-[38px] w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13.5px] text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)] disabled:cursor-not-allowed disabled:opacity-60"
      />

      <span className="mt-1 block min-h-5 overflow-hidden text-ellipsis whitespace-nowrap text-[11.5px] leading-5 text-slate-500">
        {helper || " "}
      </span>
    </label>
  );
}
