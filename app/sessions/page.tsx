'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { Client, Session } from '@/lib/types';
import { SessionCard } from '@/components/SessionCard';
import { Button } from '@/components/Button';

function formatDate(date: string): string {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${year}年${month}月${day}日`;
}

export default function SessionsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterClientId, setFilterClientId] = useState<string>('all');

  useEffect(() => {
    async function load() {
      try {
        const [cRes, sRes] = await Promise.all([
          fetch('/api/clients'),
          fetch('/api/sessions'),
        ]);
        const cData = (await cRes.json()) as Client[];
        const sData = (await sRes.json()) as Session[];
        setClients(cData);
        setSessions(
          [...sData].sort(
            (a, b) =>
              new Date(b.date).getTime() -
              new Date(a.date).getTime(),
          ),
        );
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const filteredSessions = useMemo(
    () =>
      filterClientId === 'all'
        ? sessions
        : sessions.filter(
            (s) => s.clientId === filterClientId,
          ),
    [sessions, filterClientId],
  );

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-sm font-semibold text-gray-900">
            セッション一覧
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            HRVとお客様の体感をセットで振り返ることができます。
          </p>
        </div>
        <Link href="/sessions/new">
          <Button size="sm" variant="primary">
            ＋ 新しいセッションを記録
          </Button>
        </Link>
      </div>

      <div className="card p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span>表示件数:</span>
            <span className="font-medium">
              {loading ? '—' : filteredSessions.length} 件
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-600">顧客で絞り込み:</span>
            <select
              className="rounded-md border-gray-300 text-xs shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              value={filterClientId}
              onChange={(e) => setFilterClientId(e.target.value)}
            >
              <option value="all">すべて</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2 max-h-[480px] overflow-auto pr-1">
          {loading && (
            <div className="card p-4 text-xs text-gray-500">
              読み込み中…
            </div>
          )}
          {!loading && filteredSessions.length === 0 && (
            <div className="card p-4 text-xs text-gray-500">
              まだセッションが登録されていません。
            </div>
          )}
          {!loading &&
            filteredSessions.map((s) => {
              const client = clients.find(
                (c) => c.id === s.clientId,
              );
              const delta =
                s.hrvBefore != null && s.hrvAfter != null
                  ? s.hrvAfter - s.hrvBefore
                  : undefined;
              const status =
                delta == null
                  ? 'stable'
                  : delta >= 10
                  ? 'improved'
                  : delta <= -5
                  ? 'tired'
                  : 'stable';
              return (
                <SessionCard
                  key={s.id}
                  customerName={client?.name ?? '不明な顧客'}
                  date={formatDate(s.date)}
                  menu={s.menu}
                  hrvBefore={s.hrvBefore}
                  hrvAfter={s.hrvAfter}
                  status={status}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}
