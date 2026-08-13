import pool from '@/lib/db';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nama, email, subjek, isi } = body;

    if (!nama || !email || !isi) {
      return Response.json({ error: 'nama, email, dan isi wajib diisi' }, { status: 400 });
    }

    await pool.query(
      `INSERT INTO pesan_kontak (nama, email, subjek, isi) VALUES (?, ?, ?, ?)`,
      [nama, email, subjek || '', isi]
    );

    return Response.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('POST /api/kontak error:', error);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}
