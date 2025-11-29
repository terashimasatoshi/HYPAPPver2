'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Users, ListChecks, Settings } from 'lucide-react';

const navItems = [
  { href: '/', label: 'ダッシュボード', icon: Activity },
  { href: '/customers', label: '顧客一覧', icon: Users },
  { href: '/sessions', label: 'セッション', icon: ListChecks },
  { href: '/settings', label: '設定', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-gray-200 bg-white">
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <span className="text-sm font-semibold text-forest-700">
          森の日々 HRVレポート
        </span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-emerald-50 text-forest-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
