'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'bps' | 'desa';

export interface AuthUser {
  id?: number;
  username: string;
  role: UserRole;
  desaId?: number;   // only for desa role
  desaNama?: string; // only for desa role
}

interface AuthContextType {
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Validate real server session on mount
  useEffect(() => {
    let isMounted = true;
    async function checkSession() {
      try {
        const res = await fetch('/api/auth/me', {
          method: 'GET',
          cache: 'no-store',
        });
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user && isMounted) {
            setUser({
              id: data.user.id,
              username: data.user.username,
              role: data.user.role as UserRole,
              desaId: data.user.desaId || undefined,
              desaNama: data.user.desaNama || undefined,
            });
            setIsLoading(false);
            return;
          }
        }
      } catch {
        // network or server error
      }

      if (isMounted) {
        setUser(null);
        localStorage.removeItem('desacantik_user');
        setIsLoading(false);
      }
    }

    checkSession();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success && data.user) {
        const authUser: AuthUser = {
          id: data.user.id,
          username: data.user.username,
          role: data.user.role as UserRole,
          desaId: data.user.desaId || undefined,
          desaNama: data.user.desaNama || undefined,
        };
        setUser(authUser);
        return { success: true, message: data.message };
      }

      return { success: false, message: data.message || 'Login gagal.' };
    } catch {
      return { success: false, message: 'Tidak dapat terhubung ke server.' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    setUser(null);
    localStorage.removeItem('desacantik_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
