import pool from '@/lib/db';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ desaId: string }> }
) {
  const { desaId } = await params;
  try {
    const [rows] = await pool.query('SELECT * FROM demografi WHERE desa_id = ?', [desaId]);
    const data = rows as Record<string, unknown>[];

    if (data.length === 0) {
      return Response.json({ desa_id: Number(desaId), dusun_data: [] });
    }

    const row = data[0];
    // MySQL JSON column returns parsed object or string depending on driver
    let dusunData = row.dusun_data;
    if (typeof dusunData === 'string') {
      dusunData = JSON.parse(dusunData);
    }

    return Response.json({
      id: row.id,
      desa_id: row.desa_id,
      dusun_data: dusunData || [],
    });
  } catch (error) {
    console.error('GET /api/demografi/[desaId] error:', error);
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
    const dusunData = JSON.stringify(body.dusun_data || []);

    // Upsert: insert or update on desa_id conflict
    await pool.query(
      `INSERT INTO demografi (desa_id, dusun_data) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE dusun_data = VALUES(dusun_data)`,
      [desaId, dusunData]
    );

    const [rows] = await pool.query('SELECT * FROM demografi WHERE desa_id = ?', [desaId]);
    const row = (rows as Record<string, unknown>[])[0];

    let parsedDusun = row.dusun_data;
    if (typeof parsedDusun === 'string') {
      parsedDusun = JSON.parse(parsedDusun);
    }

    return Response.json({
      id: row.id,
      desa_id: row.desa_id,
      dusun_data: parsedDusun || [],
    });
  } catch (error) {
    console.error('PUT /api/demografi/[desaId] error:', error);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}
