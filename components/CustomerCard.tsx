interface CustomerCardProps {
  name: string;
  age: string;
  lastVisit: string;
  visitCount: number;
  onClick?: () => void;
}

export function CustomerCard({
  name,
  age,
  lastVisit,
  visitCount,
  onClick,
}: CustomerCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left card px-4 py-3 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-1">
        <div>
          <p className="text-sm font-medium text-gray-900">{name}</p>
          <p className="text-xs text-gray-500">{age}</p>
        </div>
        <span className="inline-flex items-center justify-center text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-forest-700">
          来店 {visitCount} 回
        </span>
      </div>
      <p className="text-[11px] text-gray-500">
        最終来店日: {lastVisit || '—'}
      </p>
    </button>
  );
}
