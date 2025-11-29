'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Client, Session } from '@/lib/types';
import { CustomerCard } from '@/components/CustomerCard';
import { SessionCard } from '@/components/SessionCard';
import { TextField } from '@/components/TextField';

function formatDate(date: string): string {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${year}年${month}月${day}日`;
}

export default function CustomersPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [keyword, setKeyword] = useState('');

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
        setSelectedClientId(cData[0]?.id ?? '');
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const filteredClients = useMemo(() => {
    const kw = keyword.trim();
    if (!kw) return clients;
    return clients.filter((c) =>
      c.name.toLowerCase().includes(kw.toLowerCase()),
    );
  }, [clients, keyword]);

  const selectedClient = clients.find(
    (c) => c.id === selectedClientId,
  );

  const clientSessions = useMemo(
    () =>
      sessions.filter((s) => s.clientId === selectedClientId),
    [sessions, selectedClientId],
  );

  return (
    <div className="p-4 md:p-6 h-full flex flex-col gap-4 md:gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,2fr] gap-4 md:gap-6 flex-1">
        <section className="flex flex-col gap-3">
          <div className="card p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-gray-900">
                顧客一覧
              </h2>
              <span className="text-[11px] text-gray-500">
                {clients.length}名
              </span>
            </div>
            <TextField
              label="名前で検索"
              value={keyword}
              onChange={setKeyword}
              placeholder="例: 田中"
            />
          </div>

          <div className="space-y-2 overflow-auto pr-1">
            {loading && (
              <div className="card p-4 text-xs text-gray-500">
                読み込み中…
              </div>
            )}
            {!loading && filteredClients.length === 0 && (
              <div className="card p-4 text-xs text-gray-500">
                該当する顧客が見つかりませんでした。
              </div>
            )}
            {!loading &&
              filteredClients.map((c) => (
                <CustomerCard
                  key={c.id}
                  name={c.name}
                  age={c.ageLabel}
                  lastVisit={
                    sessions.find(
                      (s) => s.clientId === c.id,
                    )?.date
                      ? formatDate(
                          sessions.find(
                            (s) => s.clientId === c.id,
                          )!.date,
                        )
                      : ''
                  }
                  visitCount={c.visitCount}
                  onClick={() => setSelectedClientId(c.id)}
                />
              ))}
          </div>
        </section>

        <section className="card p-4 md:p-6 flex flex-col gap-4">
          {!selectedClient && (
            <p className="text-xs text-gray-500">
              左の一覧からお客様を選択してください。
            </p>
          )}
          {selectedClient && (
            <>
              <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedClient.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedClient.ageLabel} / 来店
                    {selectedClient.visitCount}回
                  </p>
                </div>
                {clientSessions[0] && (
                  <div className="text-right text-[11px] text-gray-500">
                    <p>
                      最新来店:{' '}
                      {formatDate(clientSessions[0].date)}
                    </p>
                    {clientSessions[0].hrvBefore != null &&
                      clientSessions[0].hrvAfter != null && (
                        <p>
                          HRV:{' '}
                          {clientSessions[0].hrvBefore} →{' '}
                          {clientSessions[0].hrvAfter} ms
                        </p>
                      )}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-gray-700">
                  セッション履歴
                </h3>
                <div className="space-y-2 max-h-[260px] overflow-auto pr-1">
                  {clientSessions.length === 0 && (
                    <p className="text-[11px] text-gray-500">
                      まだセッションが登録されていません。
                    </p>
                  )}
                  {clientSessions.map((s) => {
                    const delta =
                      s.hrvBefore != null &&
                      s.hrvAfter != null
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
                        customerName={selectedClient.name}
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

              {clientSessions[0] && (
                <div className="border-t border-gray-100 pt-4 mt-2 space-y-2 text-[11px] text-gray-600">
                  <h3 className="text-xs font-semibold text-gray-800">
                    最新セッションのメモ
                  </h3>
                  <p>
                    主な悩み:
                    {clientSessions[0].pre.mainConcern ?? '—'}
                  </p>
                  <p>
                    施術後コメント:
                    {clientSessions[0].post.comment ?? '—'}
                  </p>
                  <p>
                    次回来店までのアクション:
                    {clientSessions[0].post.actionNote ?? '—'}
                  </p>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
