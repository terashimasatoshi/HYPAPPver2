import type { ReactNode } from 'react';

interface MetricDisplayProps {
  label: string;
  value: number | string;
  unit?: string;
  icon?: ReactNode;
}

export function MetricDisplay({
  label,
  value,
  unit,
  icon,
}: MetricDisplayProps) {
  return (
    <div className="card p-4 flex items-center justify-between gap-4">
      <div>
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-semibold text-gray-900">
            {value}
          </span>
          {unit && (
            <span className="text-xs text-gray-500">{unit}</span>
          )}
        </div>
      </div>
      {icon && (
        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-forest-700">
          {icon}
        </div>
      )}
    </div>
  );
}
