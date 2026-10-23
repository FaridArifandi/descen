import { SignJWT, jwtVerify } from 'jose';
import { NextRequest } from 'next/server';

export const AUTH_COOKIE_NAME = 'desacantik_auth_token';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'super_secret_desacantik_subulussalam_2026_jwt_token_key_fallback'
);

export interface AuthUserPayload {
  id: number;
  username: string;
  role: 'bps' | 'desa';
  desaId?: number | null;
  desaNama?: string | null;
}

/**
 * Sign a new JWT session token (valid for 7 days)
 */
export async function signAuthToken(payload: AuthUserPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET_KEY);
}

/**
 * Verify and decode JWT session token
 */
export async function verifyAuthToken(token: string): Promise<AuthUserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as unknown as AuthUserPayload;
  } catch {
    return null;
  }
}

/**
 * Extract and verify authenticated user from NextRequest (Cookie or Authorization Bearer)
 */
export async function getAuthenticatedUser(request: NextRequest): Promise<AuthUserPayload | null> {
  // 1. Try Cookie
  const cookieToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (cookieToken) {
    const user = await verifyAuthToken(cookieToken);
    if (user) return user;
  }

  // 2. Try Authorization Header (Bearer token)
  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const bearerToken = authHeader.substring(7).trim();
    const user = await verifyAuthToken(bearerToken);
    if (user) return user;
  }

  return null;
}

/**
 * Helper to ensure user is logged in with allowed roles
 */
export async function requireAuth(
  request: NextRequest,
  allowedRoles?: ('bps' | 'desa')[]
): Promise<{ user: AuthUserPayload } | { errorResponse: Response }> {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return {
      errorResponse: Response.json(
        { error: 'Unauthorized: Sesi tidak valid atau telah berakhir.' },
        { status: 401 }
      ),
    };
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return {
      errorResponse: Response.json(
        { error: 'Forbidden: Anda tidak memiliki hak akses untuk tindakan ini.' },
        { status: 403 }
      ),
    };
  }

  return { user };
}
