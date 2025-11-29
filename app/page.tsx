'use client';

import { useEffect, useState } from 'react';
import type { Client, Session } from '@/lib/types';
import { MetricDisplay } from '@/components/MetricDisplay';
import { SessionCard } from '@/components/SessionCard';
import { CustomerCard } from '@/components/CustomerCard';
import { Activity, HeartPulse, Users } from 'lucide-react';

function formatDateLabel(date: string): string {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${month}月${day}日`;
}

export default function DashboardPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

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

  const totalClients = clients.length;
  const totalSessions = sessions.length;
  const recentSessions = sessions.slice(0, 5);

  const hrvChanges = sessions
    .filter(
      (s) => s.hrvBefore != null && s.hrvAfter != null,
    )
    .map((s) => (s.hrvAfter! - s.hrvBefore!) as number);
  const avgChange =
    hrvChanges.length > 0
      ? Math.round(
          (hrvChanges.reduce((a, b) => a + b, 0) /
            hrvChanges.length) *
            10,
        ) / 10
      : 0;

  const lastSession =
    sessions.length > 0 ? sessions[0] : undefined;
  const lastClient = lastSession
    ? clients.find((c) => c.id === lastSession.clientId)
    : undefined;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricDisplay
          label="登録顧客数"
          value={loading ? '—' : totalClients}
          icon={<Users className="w-4 h-4" />}
        />
        <MetricDisplay
          label="記録済みセッション数"
          value={loading ? '—' : totalSessions}
          icon={<Activity className="w-4 h-4" />}
        />
        <MetricDisplay
          label="HRVの平均変化量"
          value={
            loading
              ? '—'
              : hrvChanges.length > 0
              ? `${avgChange > 0 ? '+' : ''}${avgChange}`
              : 'データ少'
          }
          unit={loading || hrvChanges.length === 0 ? '' : 'ms'}
          icon={<HeartPulse className="w-4 h-4" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">
              直近のセッション
            </h2>
            <span className="text-[11px] text-gray-500">
              最新5件を表示
            </span>
          </div>
          <div className="space-y-3">
            {loading && (
              <div className="card p-4 text-xs text-gray-500">
                読み込み中…
              </div>
            )}
            {!loading && recentSessions.length === 0 && (
              <div className="card p-4 text-xs text-gray-500">
                まだセッションデータがありません。
              </div>
            )}
            {!loading &&
              recentSessions.map((s) => {
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
                    customerName={
                      client?.name ?? '不明な顧客'
                    }
                    date={formatDateLabel(s.date)}
                    menu={s.menu}
                    hrvBefore={s.hrvBefore}
                    hrvAfter={s.hrvAfter}
                    status={status}
                  />
                );
              })}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-900">
            最近来店されたお客様
          </h2>
          <div className="space-y-3">
            {loading && (
              <div className="card p-4 text-xs text-gray-500">
                読み込み中…
              </div>
            )}
            {!loading &&
              clients.length > 0 &&
              clients.map((c) => {
                const lastVisitSession = sessions.find(
                  (s) => s.clientId === c.id,
                );
                const label = lastVisitSession
                  ? formatDateLabel(lastVisitSession.date)
                  : '';
                return (
                  <CustomerCard
                    key={c.id}
                    name={c.name}
                    age={c.ageLabel}
                    lastVisit={label}
                    visitCount={c.visitCount}
                  />
                );
              })}
            {!loading && clients.length === 0 && (
              <div className="card p-4 text-xs text-gray-500">
                顧客データがまだ登録されていません。
              </div>
            )}
          </div>

          {lastSession && lastClient && (
            <div className="card p-4 mt-2 text-[11px] text-gray-600 space-y-2">
              <p className="font-semibold text-xs text-gray-800">
                前回施術のハイライト
              </p>
              <p>
                {lastClient.name}（{lastClient.ageLabel}） /
                {formatDateLabel(lastSession.date)} /{' '}
                {lastSession.menu}
              </p>
              {lastSession.hrvBefore != null &&
                lastSession.hrvAfter != null && (
                  <p>
                    HRV: {lastSession.hrvBefore} →{' '}
                    {lastSession.hrvAfter} ms
                  </p>
                )}
              <p>
                主な悩み:
                {lastSession.pre.mainConcern ?? '—'}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
