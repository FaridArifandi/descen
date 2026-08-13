import pool from '@/lib/db';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM kecamatan ORDER BY id ASC');
    return Response.json(rows);
  } catch (error) {
    console.error('GET /api/kecamatan error:', error);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}
