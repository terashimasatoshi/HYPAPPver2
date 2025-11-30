// app/api/clients/route.ts
import { NextResponse } from 'next/server';
import type { Client } from '@/lib/types';
import { getClients, addClient } from '@/lib/store';

/**
 * GET /api/clients
 * 顧客一覧を返す
 */
export async function GET() {
  const clients = getClients();
  return NextResponse.json<Client[]>(clients);
}

/**
 * POST /api/clients
 * 新規顧客を追加する
 *
 * 期待するJSON:
 * {
 *   "name": "田中さん",
 *   "ageLabel": "40代",
 *   "gender": "女性",
 *   "firstVisitDate": "2025-01-18",
 *   "customerNumber": "0001"
 * }
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body || typeof body !== 'object') {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 },
    );
  }

  const name = body.name as string | undefined;
  const ageLabel = body.ageLabel as string | undefined;
  const gender = body.gender as string | undefined;
  const firstVisitDate = body.firstVisitDate as string | undefined;
  const customerNumber = body.customerNumber as string | undefined;

  if (!name || !ageLabel) {
    return NextResponse.json(
      { error: 'name と ageLabel は必須です。' },
      { status: 400 },
    );
  }

  const client: Client = addClient({
    name,
    ageLabel,
    gender,
    firstVisitDate,
    customerNumber,
  });

  return NextResponse.json<Client>(client, { status: 201 });
}
