import pool from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signAuthToken, AUTH_COOKIE_NAME, AuthUserPayload } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ success: false, message: 'Username dan password wajib diisi.' }, { status: 400 });
    }

    const trimUser = String(username).trim().toLowerCase();
    const trimPass = String(password).trim();

    // Find user in database
    const [rows] = await pool.query(
      'SELECT u.*, d.nama as desa_nama FROM users u LEFT JOIN desa d ON u.desa_id = d.id WHERE u.username = ?',
      [trimUser]
    );

    const users = rows as Record<string, unknown>[];
    if (users.length === 0) {
      return NextResponse.json({ success: false, message: 'Username tidak ditemukan.' }, { status: 401 });
    }

    const user = users[0];
    const passwordHash = user.password_hash as string;

    // Verify password
    const isValid = await bcrypt.compare(trimPass, passwordHash);
    if (!isValid) {
      return NextResponse.json({ success: false, message: 'Password salah.' }, { status: 401 });
    }

    const payload: AuthUserPayload = {
      id: user.id as number,
      username: user.username as string,
      role: user.role as 'bps' | 'desa',
      desaId: (user.desa_id as number) || null,
      desaNama: (user.desa_nama as string) || null,
    };

    // Sign cryptographic JWT session token
    const token = await signAuthToken(payload);

    const userData = {
      id: payload.id,
      username: payload.username,
      role: payload.role,
      desaId: payload.desaId,
      desaNama: payload.desaNama,
    };

    const response = NextResponse.json({
      success: true,
      message: user.role === 'bps'
        ? 'Login berhasil sebagai Admin BPS.'
        : `Login berhasil sebagai Admin ${user.desa_nama || 'Desa'}.`,
      user: userData,
    });

    // Set secure HttpOnly cookie
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('POST /api/auth/login error:', error);
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}
