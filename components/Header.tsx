'use client';

import { usePathname } from 'next/navigation';

function getPageTitle(pathname: string): string {
  if (pathname === '/') return 'ダッシュボード';
  if (pathname.startsWith('/customers')) return '顧客一覧';
  if (pathname.startsWith('/sessions')) return 'セッション';
  if (pathname.startsWith('/settings')) return '設定';
  return '';
}

export function Header() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-gray-200 bg-white">
      <div>
        <h1 className="text-base font-semibold text-gray-900">
          {title}
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          HRVと施術の記録から、お客様の変化を見える化します。
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end">
          <span className="text-xs text-gray-500">担当</span>
          <span className="text-sm font-medium text-gray-800">
            山田 花子
          </span>
        </div>
        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-xs text-forest-700">
          Y
        </div>
      </div>
    </header>
  );
}
