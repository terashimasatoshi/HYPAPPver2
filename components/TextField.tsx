'use client';

interface TextFieldProps {
  label: string;
  value: string;
  type?: string;
  placeholder?: string;
  helperText?: string;
  min?: number;
  max?: number;
  onChange: (value: string) => void;
}

export function TextField({
  label,
  value,
  type = 'text',
  placeholder,
  helperText,
  min,
  max,
  onChange,
}: TextFieldProps) {
  return (
    <label className="block text-sm">
      <span className="text-xs text-gray-700">{label}</span>
      <input
        type={type}
        value={value}
        min={min}
        max={max}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded-lg border-gray-300 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500 bg-white"
      />
      {helperText && (
        <p className="mt-1 text-[11px] text-gray-500">
          {helperText}
        </p>
      )}
    </label>
  );
}
