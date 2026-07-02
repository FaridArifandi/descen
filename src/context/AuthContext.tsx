'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockDesa } from '@/data/mockData';

export type UserRole = 'bps' | 'desa';

export interface AuthUser {
  username: string;
  role: UserRole;
  desaId?: number;   // only for desa role
  desaNama?: string; // only for desa role
}

interface AuthContextType {
  user: AuthUser | null;
  login: (username: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ---- Dummy credentials (no database) ----
// BPS admin: username = "admin", password = "pass123"
// Desa admin: username = "desa_<namadesa>", password = "pass123"
// e.g. desa_sukamaju, desa_laesaga, desa_rundeng, desa_penanggalan, desa_singkersing

function buildDesaUsername(nama: string): string {
  // Strip leading 'desa' word, e.g. 'Desa Suka Maju' -> 'sukamaju'
  const stripped = nama.toLowerCase().replace(/^desa\s+/i, '').replace(/[^a-z0-9]/g, '');
  return 'desa_' + stripped;
}

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

  const login = (username: string, password: string): { success: boolean; message: string } => {
    const trimUser = username.trim().toLowerCase();
    const trimPass = password.trim();

    if (trimPass !== 'pass123') {
      return { success: false, message: 'Password salah.' };
    }

    // BPS admin
    if (trimUser === 'admin') {
      const authUser: AuthUser = { username: 'admin', role: 'bps' };
      setUser(authUser);
      localStorage.setItem('desacantik_user', JSON.stringify(authUser));
      return { success: true, message: 'Login berhasil sebagai Admin BPS.' };
    }

    // Desa admin
    if (trimUser.startsWith('desa_')) {
      const matched = mockDesa.find(d => buildDesaUsername(d.nama) === trimUser);
      if (matched) {
        const authUser: AuthUser = {
          username: trimUser,
          role: 'desa',
          desaId: matched.id,
          desaNama: matched.nama,
        };
        setUser(authUser);
        localStorage.setItem('desacantik_user', JSON.stringify(authUser));
        return { success: true, message: `Login berhasil sebagai Admin ${matched.nama}.` };
      }
      return { success: false, message: 'Username desa tidak ditemukan.' };
    }

    return { success: false, message: 'Username tidak dikenali.' };
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
