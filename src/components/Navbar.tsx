'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, Menu, X, BarChart3, Database } from 'lucide-react';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Tentang Desa Cantik', href: '/tentang' },
    { name: 'Daftar Desa', href: '/daftar-desa' },
    { name: 'Kontak', href: '/kontak' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-card-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary-color to-secondary-color shadow-[0_0_15px_rgba(0,210,255,0.3)]">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-primary-color to-secondary-color bg-clip-text text-transparent">
                  DESA CANTIK
                </span>
                <p className="text-[10px] text-muted-text font-semibold uppercase tracking-widest -mt-1">
                  Kota Subulussalam
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive(link.href)
                      ? 'text-primary-color bg-primary-glow border border-primary-color/20'
                      : 'text-foreground/80 hover:text-primary-color hover:bg-foreground/5'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Separator */}
            <div className="h-6 w-px bg-card-border" />

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground/80 hover:text-primary-color transition-all duration-200"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 animate-pulse" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Mobile Menu & Theme Button */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-foreground/5 text-foreground/85 transition-all duration-200"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-foreground hover:bg-foreground/5 transition-all duration-200"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass border-b border-card-border py-4 px-2 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                isActive(link.href)
                  ? 'text-primary-color bg-primary-glow border-l-4 border-primary-color'
                  : 'text-foreground/80 hover:text-primary-color hover:bg-foreground/5'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
