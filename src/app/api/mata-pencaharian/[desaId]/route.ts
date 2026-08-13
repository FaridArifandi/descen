import pool from '@/lib/db';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ desaId: string }> }
) {
  const { desaId } = await params;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM mata_pencaharian WHERE desa_id = ? ORDER BY id ASC',
      [desaId]
    );
    return Response.json(rows);
  } catch (error) {
    console.error('GET /api/mata-pencaharian/[desaId] error:', error);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ desaId: string }> }
) {
  const { desaId } = await params;
  try {
    const body = await request.json();
    const items: { nama: string; persentase: number }[] = body.items || [];

    // Delete existing then insert new
    await pool.query('DELETE FROM mata_pencaharian WHERE desa_id = ?', [desaId]);

    if (items.length > 0) {
      const values = items.map(it => [desaId, it.nama, it.persentase]);
      await pool.query(
        'INSERT INTO mata_pencaharian (desa_id, nama, persentase) VALUES ?',
        [values]
      );
    }

    const [rows] = await pool.query(
      'SELECT * FROM mata_pencaharian WHERE desa_id = ? ORDER BY id ASC',
      [desaId]
    );
    return Response.json(rows);
  } catch (error) {
    console.error('PUT /api/mata-pencaharian/[desaId] error:', error);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}
