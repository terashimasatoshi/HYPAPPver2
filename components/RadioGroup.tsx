'use client';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  label: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
}

export function RadioGroup({
  label,
  options,
  value,
  onChange,
}: RadioGroupProps) {
  return (
    <fieldset className="text-sm">
      <legend className="text-xs text-gray-700 mb-1">
        {label}
      </legend>
      <div className="space-y-1">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-2 text-xs text-gray-700"
          >
            <input
              type="radio"
              className="h-3 w-3 text-emerald-600 border-gray-300 focus:ring-emerald-500"
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
