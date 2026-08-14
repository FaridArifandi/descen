import pool from '@/lib/db';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const [rows] = await pool.query('SELECT * FROM desa ORDER BY id ASC');
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      },
    });
  } catch (error) {
    console.error('GET /api/desa error:', error);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nama, kecamatan_id, tahun_pembinaan, foto_cover, profil_abstrak, profil_file_url, monografi_abstrak, monografi_file_url, latitude, longitude } = body;

    const [result] = await pool.query(
      `INSERT INTO desa (nama, kecamatan_id, tahun_pembinaan, foto_cover, profil_abstrak, profil_file_url, monografi_abstrak, monografi_file_url, latitude, longitude)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nama, kecamatan_id, tahun_pembinaan || 2026, foto_cover || '', profil_abstrak || '', profil_file_url || '#', monografi_abstrak || '', monografi_file_url || '#', latitude || 0, longitude || 0]
    );

    const insertId = (result as { insertId: number }).insertId;
    const [rows] = await pool.query('SELECT * FROM desa WHERE id = ?', [insertId]);
    return Response.json((rows as unknown[])[0], { status: 201 });
  } catch (error) {
    console.error('POST /api/desa error:', error);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}
