import pool from '@/lib/db';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const fields: string[] = [];
    const values: unknown[] = [];

    const allowedFields: Record<string, string> = {
      desa_id: 'desa_id',
      kategori: 'kategori',
      sub_kategori: 'sub_kategori',
      judul: 'judul',
      deskripsi: 'deskripsi',
      foto_url: 'foto_url',
      video_url: 'video_url',
    };

    for (const [key, col] of Object.entries(allowedFields)) {
      if (body[key] !== undefined) {
        fields.push(`${col} = ?`);
        values.push(body[key]);
      }
    }

    if (fields.length === 0) {
      return Response.json({ error: 'No fields to update' }, { status: 400 });
    }

    values.push(id);
    await pool.query(`UPDATE potensi SET ${fields.join(', ')} WHERE id = ?`, values);

    const [rows] = await pool.query('SELECT * FROM potensi WHERE id = ?', [id]);
    return Response.json((rows as unknown[])[0]);
  } catch (error) {
    console.error('PUT /api/potensi/[id] error:', error);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await pool.query('DELETE FROM potensi WHERE id = ?', [id]);
    return Response.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/potensi/[id] error:', error);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}
