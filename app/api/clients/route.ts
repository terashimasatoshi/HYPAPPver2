import { NextResponse } from 'next/server';
import type { Client } from '@/lib/types';
import { getClients } from '@/lib/store';

export async function GET() {
  const clients = getClients();
  return NextResponse.json<Client[]>(clients);
}
