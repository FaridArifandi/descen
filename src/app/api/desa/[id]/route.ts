import pool from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

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
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('GET /api/desa/[id] error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Both BPS and Desa admin can edit, but Desa admin can only edit their own desa
    const authResult = await requireAuth(request, ['bps', 'desa']);
    if ('errorResponse' in authResult) {
      return authResult.errorResponse;
    }

    const { user } = authResult;
    if (user.role === 'desa' && Number(user.desaId) !== Number(id)) {
      return NextResponse.json(
        { error: 'Forbidden: Anda hanya berhak mengubah data desa Anda sendiri.' },
        { status: 403 }
      );
    }

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
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    values.push(id);
    await pool.query(`UPDATE desa SET ${fields.join(', ')} WHERE id = ?`, values);

    const [rows] = await pool.query('SELECT * FROM desa WHERE id = ?', [id]);
    return NextResponse.json((rows as unknown[])[0]);
  } catch (error) {
    console.error('PUT /api/desa/[id] error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Only BPS admin can delete a desa
    const authResult = await requireAuth(request, ['bps']);
    if ('errorResponse' in authResult) {
      return authResult.errorResponse;
    }

    await pool.query('DELETE FROM desa WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/desa/[id] error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
