'use client';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  value: string;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  onChange: (value: string) => void;
}

export function Select({
  label,
  value,
  options,
  placeholder,
  required,
  onChange,
}: SelectProps) {
  return (
    <label className="block text-sm">
      <span className="text-xs text-gray-700">
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </span>
      <select
        className="mt-1 block w-full rounded-lg border-gray-300 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500 bg-white"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
