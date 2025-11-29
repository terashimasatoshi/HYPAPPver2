interface SessionCardProps {
  customerName: string;
  date: string;
  menu: string;
  hrvBefore?: number;
  hrvAfter?: number;
  status?: 'improved' | 'stable' | 'tired';
  onClick?: () => void;
}

function statusLabel(status?: 'improved' | 'stable' | 'tired'): string {
  switch (status) {
    case 'improved':
      return 'HRVアップ';
    case 'tired':
      return '要ケア';
    default:
      return 'データ少';
  }
}

function statusClass(status?: 'improved' | 'stable' | 'tired'): string {
  switch (status) {
    case 'improved':
      return 'bg-emerald-50 text-forest-700';
    case 'tired':
      return 'bg-rose-50 text-rose-700';
    default:
      return 'bg-gray-50 text-gray-500';
  }
}

export function SessionCard({
  customerName,
  date,
  menu,
  hrvBefore,
  hrvAfter,
  status,
  onClick,
}: SessionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left card px-4 py-3 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-1">
        <div>
          <p className="text-sm font-medium text-gray-900">
            {customerName}
          </p>
          <p className="text-xs text-gray-500">
            {date} / {menu}
          </p>
        </div>
        <span
          className={`inline-flex items-center justify-center text-[11px] px-2 py-0.5 rounded-full ${statusClass(
            status,
          )}`}
        >
          {statusLabel(status)}
        </span>
      </div>
      <p className="text-[11px] text-gray-500 mt-1">
        HRV{' '}
        {hrvBefore != null && hrvAfter != null
          ? `${hrvBefore} → ${hrvAfter} ms`
          : '—'}
      </p>
    </button>
  );
}
