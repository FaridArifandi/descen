import pool from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const authResult = await requireAuth(request, ['bps', 'desa']);
    if ('errorResponse' in authResult) {
      return authResult.errorResponse;
    }

    const { user } = authResult;

    // Check existing record
    const [existing] = await pool.query('SELECT * FROM infografis WHERE id = ?', [id]);
    const items = existing as Record<string, unknown>[];
    if (items.length === 0) {
      return NextResponse.json({ error: 'Infografis tidak ditemukan' }, { status: 404 });
    }

    if (user.role === 'desa' && Number(items[0].desa_id) !== Number(user.desaId)) {
      return NextResponse.json(
        { error: 'Forbidden: Anda tidak berhak mengubah infografis desa lain.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const fields: string[] = [];
    const values: unknown[] = [];

    const allowedFields: Record<string, string> = {
      desa_id: 'desa_id',
      judul: 'judul',
      gambar_url: 'gambar_url',
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
    await pool.query(`UPDATE infografis SET ${fields.join(', ')} WHERE id = ?`, values);

    const [rows] = await pool.query('SELECT * FROM infografis WHERE id = ?', [id]);
    return NextResponse.json((rows as unknown[])[0]);
  } catch (error) {
    console.error('PUT /api/infografis/[id] error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const authResult = await requireAuth(request, ['bps', 'desa']);
    if ('errorResponse' in authResult) {
      return authResult.errorResponse;
    }

    const { user } = authResult;

    // Check existing record
    const [existing] = await pool.query('SELECT * FROM infografis WHERE id = ?', [id]);
    const items = existing as Record<string, unknown>[];
    if (items.length === 0) {
      return NextResponse.json({ error: 'Infografis tidak ditemukan' }, { status: 404 });
    }

    if (user.role === 'desa' && Number(items[0].desa_id) !== Number(user.desaId)) {
      return NextResponse.json(
        { error: 'Forbidden: Anda tidak berhak menghapus infografis desa lain.' },
        { status: 403 }
      );
    }

    await pool.query('DELETE FROM infografis WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/infografis/[id] error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
