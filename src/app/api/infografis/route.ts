import pool from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const desaId = request.nextUrl.searchParams.get('desa_id');
    let query = 'SELECT * FROM infografis';
    const params: unknown[] = [];

    if (desaId) {
      query += ' WHERE desa_id = ?';
      params.push(desaId);
    }
    query += ' ORDER BY id ASC';

    const [rows] = await pool.query(query, params);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('GET /api/infografis error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request, ['bps', 'desa']);
    if ('errorResponse' in authResult) {
      return authResult.errorResponse;
    }

    const { user } = authResult;
    const body = await request.json();
    const { desa_id, judul, gambar_url } = body;

    // Check ownership for desa role
    if (user.role === 'desa' && Number(user.desaId) !== Number(desa_id)) {
      return NextResponse.json(
        { error: 'Forbidden: Anda hanya berhak menambahkan infografis untuk desa Anda.' },
        { status: 403 }
      );
    }

    const [result] = await pool.query(
      `INSERT INTO infografis (desa_id, judul, gambar_url) VALUES (?, ?, ?)`,
      [desa_id, judul, gambar_url || '']
    );

    const insertId = (result as { insertId: number }).insertId;
    const [rows] = await pool.query('SELECT * FROM infografis WHERE id = ?', [insertId]);
    return NextResponse.json((rows as unknown[])[0], { status: 201 });
  } catch (error) {
    console.error('POST /api/infografis error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
