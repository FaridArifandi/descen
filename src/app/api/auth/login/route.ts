import pool from '@/lib/db';
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return Response.json({ success: false, message: 'Username dan password wajib diisi.' }, { status: 400 });
    }

    const trimUser = username.trim().toLowerCase();
    const trimPass = password.trim();

    // Find user in database
    const [rows] = await pool.query(
      'SELECT u.*, d.nama as desa_nama FROM users u LEFT JOIN desa d ON u.desa_id = d.id WHERE u.username = ?',
      [trimUser]
    );

    const users = rows as Record<string, unknown>[];
    if (users.length === 0) {
      return Response.json({ success: false, message: 'Username tidak ditemukan.' }, { status: 401 });
    }

    const user = users[0];
    const passwordHash = user.password_hash as string;

    // Verify password
    const isValid = await bcrypt.compare(trimPass, passwordHash);
    if (!isValid) {
      return Response.json({ success: false, message: 'Password salah.' }, { status: 401 });
    }

    // Return user data (without password hash)
    const userData = {
      id: user.id,
      username: user.username as string,
      role: user.role as string,
      desaId: user.desa_id as number | null,
      desaNama: user.desa_nama as string | null,
    };

    return Response.json({
      success: true,
      message: user.role === 'bps'
        ? 'Login berhasil sebagai Admin BPS.'
        : `Login berhasil sebagai Admin ${user.desa_nama || 'Desa'}.`,
      user: userData,
    });
  } catch (error) {
    console.error('POST /api/auth/login error:', error);
    return Response.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}
