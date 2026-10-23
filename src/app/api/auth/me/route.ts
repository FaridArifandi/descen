import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        desaId: user.desaId,
        desaNama: user.desaNama,
      },
    });
  } catch (error) {
    console.error('GET /api/auth/me error:', error);
    return NextResponse.json({ authenticated: false, user: null }, { status: 500 });
  }
}
