import type { Client, Session } from './types';
import { mockClients, mockSessions } from './mockData';

// 簡易インメモリストア（開発用）
// Vercel の Serverless 環境ではリクエストごとに初期化される点に注意してください。
let clients: Client[] = [...mockClients];
let sessions: Session[] = [...mockSessions];

export function getClients(): Client[] {
  return clients;
}

export function getSessions(): Session[] {
  return sessions;
}

/**
 * 新規顧客を追加する
 * - name / ageLabel は必須
 * - gender / firstVisitDate / customerNumber は任意
 */
export function addClient(input: {
  name: string;
  ageLabel: string;
  gender?: string;
  firstVisitDate?: string;
  customerNumber?: string;
}): Client {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  const firstVisitDate = input.firstVisitDate ?? today;

  const client: Client = {
    id: `c-${now.getTime()}`,
    name: input.name,
    ageLabel: input.ageLabel,
    gender: input.gender,
    firstVisitDate,
    // 最終来店日は、最初は初回来店日と同じにしておく
    lastVisit: firstVisitDate,
    // セッション追加前なので 0 回からスタート
    visitCount: 0,
    customerNumber: input.customerNumber,
  };

  // 先頭に追加（新しい順で見たい想定）
  clients = [client, ...clients];

  return client;
}

/**
 * セッションを追加する
 * - sessions に追加
 * - 同じ clientId を持つ Client の lastVisit / visitCount も更新
 */
export function addSession(session: Session): Session {
  sessions = [...sessions, session];

  clients = clients.map((c) =>
    c.id === session.clientId
      ? {
          ...c,
          lastVisit: session.date,
          visitCount: c.visitCount + 1,
        }
      : c,
  );

  return session;
}
