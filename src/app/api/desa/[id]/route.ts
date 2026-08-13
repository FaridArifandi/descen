import pool from '@/lib/db';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const [rows] = await pool.query('SELECT * FROM desa WHERE id = ?', [id]);
    const data = rows as unknown[];
    if (data.length === 0) {
      return Response.json({ error: 'Not found' }, { status: 404 });
    }
    return Response.json(data[0]);
  } catch (error) {
    console.error('GET /api/desa/[id] error:', error);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}

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
      nama: 'nama',
      kecamatan_id: 'kecamatan_id',
      tahun_pembinaan: 'tahun_pembinaan',
      foto_cover: 'foto_cover',
      profil_abstrak: 'profil_abstrak',
      profil_file_url: 'profil_file_url',
      monografi_abstrak: 'monografi_abstrak',
      monografi_file_url: 'monografi_file_url',
      latitude: 'latitude',
      longitude: 'longitude',
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
    await pool.query(`UPDATE desa SET ${fields.join(', ')} WHERE id = ?`, values);

    const [rows] = await pool.query('SELECT * FROM desa WHERE id = ?', [id]);
    return Response.json((rows as unknown[])[0]);
  } catch (error) {
    console.error('PUT /api/desa/[id] error:', error);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await pool.query('DELETE FROM desa WHERE id = ?', [id]);
    return Response.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/desa/[id] error:', error);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}
