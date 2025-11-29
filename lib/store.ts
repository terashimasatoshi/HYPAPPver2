import type { Client, Session } from './types';
import { mockClients, mockSessions } from './mockData';

// 簡易インメモリストア（開発用）
// VercelのServerless環境ではリクエストごとに初期化される点に注意してください。
let clients: Client[] = [...mockClients];
let sessions: Session[] = [...mockSessions];

export function getClients(): Client[] {
  return clients;
}

export function getSessions(): Session[] {
  return sessions;
}

export function addSession(session: Session): Session {
  sessions = [...sessions, session];
  return session;
}
