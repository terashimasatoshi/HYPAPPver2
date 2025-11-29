'use client';

interface TextAreaProps {
  label: string;
  value: string;
  rows?: number;
  placeholder?: string;
  onChange: (value: string) => void;
}

export function TextArea({
  label,
  value,
  rows = 3,
  placeholder,
  onChange,
}: TextAreaProps) {
  return (
    <label className="block text-sm">
      <span className="text-xs text-gray-700">{label}</span>
      <textarea
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded-lg border-gray-300 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500 bg-white resize-none"
      />
    </label>
  );
}
