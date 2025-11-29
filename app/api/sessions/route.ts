import { NextResponse } from 'next/server';
import type { Session } from '@/lib/types';
import { getSessions, addSession } from '@/lib/store';

export async function GET() {
  const sessions = getSessions();
  return NextResponse.json<Session[]>(sessions);
}

export async function POST(request: Request) {
  const body = (await request.json()) as Session;
  const created = addSession(body);
  return NextResponse.json<Session>(created, { status: 201 });
}
