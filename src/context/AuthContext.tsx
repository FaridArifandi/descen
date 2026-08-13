'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'bps' | 'desa';

export interface AuthUser {
  username: string;
  role: UserRole;
  desaId?: number;   // only for desa role
  desaNama?: string; // only for desa role
}

interface AuthContextType {
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ---- Login via MySQL API (/api/auth/login) ----
// BPS admin: username = "admin"
// Desa admin: username = "desa_<namadesa>"
// Password diverifikasi via bcrypt di server

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage
    try {
      const stored = localStorage.getItem('desacantik_user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    setIsLoading(false);
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
          username: data.user.username,
          role: data.user.role as UserRole,
          desaId: data.user.desaId || undefined,
          desaNama: data.user.desaNama || undefined,
        };
        setUser(authUser);
        localStorage.setItem('desacantik_user', JSON.stringify(authUser));
        return { success: true, message: data.message };
      }

      return { success: false, message: data.message || 'Login gagal.' };
    } catch {
      return { success: false, message: 'Tidak dapat terhubung ke server.' };
    }
  };

  const logout = () => {
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
