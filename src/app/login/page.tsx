'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, LogIn, ShieldCheck, Building2, AlertCircle, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { mockDesa } from '@/data/mockData';
import Link from 'next/link';

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Redirect kalau sudah login
  useEffect(() => {
    if (user) {
      if (user.role === 'bps') router.replace('/admin/bps');
      else router.replace('/admin/desa');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const result = await login(username, password);
    setIsLoading(false);
    if (!result.success) {
      setError(result.message);
    }
    // jika sukses, useEffect di atas akan handle redirect
  };

  // Buat daftar hint username desa
  function buildDesaUsername(nama: string): string {
    const stripped = nama.toLowerCase().replace(/^desa\s+/i, '').replace(/[^a-z0-9]/g, '');
    return 'desa_' + stripped;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-grid relative overflow-hidden px-4">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-glow rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-glow-color/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header Card */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-glow border border-primary-color/30 mb-4">
            <ShieldCheck className="w-8 h-8 text-primary-color" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Portal <span className="text-primary-color">Admin</span>
          </h1>
          <p className="text-muted-text text-sm mt-2">
            Desa Cantik · BPS Kota Subulussalam
          </p>
        </div>

        {/* Login Card */}
        <div className="glass rounded-2xl border border-card-border p-8 shadow-[0_0_40px_rgba(0,210,255,0.06)]">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-semibold mb-2 text-foreground/80">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin / desa_namadesa"
                required
                className="w-full px-4 py-3 rounded-xl bg-background border border-card-border focus:border-primary-color focus:ring-2 focus:ring-primary-color/20 outline-none transition-all text-foreground placeholder:text-muted-text text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold mb-2 text-foreground/80">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-background border border-card-border focus:border-primary-color focus:ring-2 focus:ring-primary-color/20 outline-none transition-all text-foreground placeholder:text-muted-text text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-text hover:text-foreground transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary-color text-white font-semibold text-sm shadow-[0_0_20px_var(--primary-glow)] hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              {isLoading ? 'Memverifikasi...' : 'Masuk'}
            </button>
          </form>

          {/* Hint box */}
          <div className="mt-6 border-t border-card-border pt-5">
            <button
              onClick={() => setShowHint(v => !v)}
              className="flex items-center gap-2 text-xs text-muted-text hover:text-foreground transition-colors w-full"
            >
              <span className="font-semibold">Daftar akses login</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showHint ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 space-y-2">
                    {/* BPS */}
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-color/5 border border-primary-color/15">
                      <ShieldCheck className="w-3.5 h-3.5 text-primary-color shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-primary-color">Admin BPS</p>
                        <p className="text-[11px] text-muted-text font-mono">admin / pass123</p>
                      </div>
                    </div>
                    {/* Desa list */}
                    <p className="text-[11px] text-muted-text font-semibold mt-2 px-1">Admin Desa (semua password: pass123)</p>
                    {mockDesa.map(d => (
                      <div key={d.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-foreground/3 border border-card-border">
                        <Building2 className="w-3.5 h-3.5 text-muted-text shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate">{d.nama}</p>
                          <p className="text-[11px] text-muted-text font-mono">{buildDesaUsername(d.nama)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Back link */}
        <p className="text-center mt-6 text-xs text-muted-text">
          <Link href="/" className="hover:text-primary-color transition-colors">
            ← Kembali ke halaman utama
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
