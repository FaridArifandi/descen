import pool from '@/lib/db';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const desaId = request.nextUrl.searchParams.get('desa_id');
    let query = 'SELECT * FROM potensi';
    const params: unknown[] = [];

    if (desaId) {
      query += ' WHERE desa_id = ?';
      params.push(desaId);
    }
    query += ' ORDER BY id ASC';

    const [rows] = await pool.query(query, params);
    return Response.json(rows);
  } catch (error) {
    console.error('GET /api/potensi error:', error);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { desa_id, kategori, sub_kategori, judul, deskripsi, foto_url, video_url } = body;

    const [result] = await pool.query(
      `INSERT INTO potensi (desa_id, kategori, sub_kategori, judul, deskripsi, foto_url, video_url) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [desa_id, kategori || 'ekonomi', sub_kategori || '', judul, deskripsi || '', foto_url || '', video_url || null]
    );

    const insertId = (result as { insertId: number }).insertId;
    const [rows] = await pool.query('SELECT * FROM potensi WHERE id = ?', [insertId]);
    return Response.json((rows as unknown[])[0], { status: 201 });
  } catch (error) {
    console.error('POST /api/potensi error:', error);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}
