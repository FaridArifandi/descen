import pool from '@/lib/db';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ desaId: string }> }
) {
  const { desaId } = await params;
  try {
    const [rows] = await pool.query('SELECT * FROM pendidikan WHERE desa_id = ?', [desaId]);
    const data = rows as Record<string, unknown>[];

    if (data.length === 0) {
      return Response.json({ desa_id: Number(desaId), data: [] });
    }

    const row = data[0];
    let items = row.data;
    if (typeof items === 'string') {
      items = JSON.parse(items);
    }

    return Response.json({
      id: row.id,
      desa_id: row.desa_id,
      data: items || [],
    });
  } catch (error) {
    console.error('GET /api/pendidikan/[desaId] error:', error);
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
    const items = JSON.stringify(body.data || []);

    // Upsert: insert or update on desa_id conflict
    await pool.query(
      `INSERT INTO pendidikan (desa_id, data) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE data = VALUES(data)`,
      [desaId, items]
    );

    const [rows] = await pool.query('SELECT * FROM pendidikan WHERE desa_id = ?', [desaId]);
    const row = (rows as Record<string, unknown>[])[0];

    let parsed = row.data;
    if (typeof parsed === 'string') {
      parsed = JSON.parse(parsed);
    }

    return Response.json({
      id: row.id,
      desa_id: row.desa_id,
      data: parsed || [],
    });
  } catch (error) {
    console.error('PUT /api/pendidikan/[desaId] error:', error);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}
