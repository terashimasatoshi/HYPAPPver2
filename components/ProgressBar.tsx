interface ProgressBarProps {
  label?: string;
  value: number;
  max: number;
}

export function ProgressBar({ label, value, max }: ProgressBarProps) {
  const ratio = Math.max(0, Math.min(value / max, 1));
  const percent = Math.round(ratio * 100);

  return (
    <div>
      {label && (
        <p className="text-[11px] text-gray-600 mb-1">{label}</p>
      )}
      <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full transition-[width]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
