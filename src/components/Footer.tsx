import React from 'react';
import Link from 'next/link';
import { BarChart3, Mail, MapPin, Phone, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full mt-auto glass border-t border-card-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary-color to-secondary-color shadow-[0_0_10px_rgba(0,210,255,0.2)]">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-md tracking-wider bg-gradient-to-r from-primary-color to-secondary-color bg-clip-text text-transparent">
                DESA CANTIK
              </span>
            </div>
            <p className="text-sm text-muted-text max-w-xs leading-relaxed">
              Program Desa Cinta Statistik (Desa Cantik) Kota Subulussalam bertujuan meningkatkan literasi dan tata kelola statistik di tingkat desa untuk pembangunan yang lebih presisi.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground tracking-wider uppercase text-sm">
              Navigasi Cepat
            </h3>
            <ul className="space-y-2 text-sm text-muted-text">
              <li>
                <Link href="/" className="hover:text-primary-color transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="hover:text-primary-color transition-colors">
                  Tentang Desa Cantik
                </Link>
              </li>
              <li>
                <Link href="/daftar-desa" className="hover:text-primary-color transition-colors">
                  Daftar Desa
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="hover:text-primary-color transition-colors">
                  Kontak BPS
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground tracking-wider uppercase text-sm">
              Hubungi Kami
            </h3>
            <ul className="space-y-2 text-sm text-muted-text">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-primary-color shrink-0 mt-0.5" />
                <span>BPS Kota Subulussalam, Aceh, Indonesia</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-primary-color shrink-0" />
                <span>(0654) 123456</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-primary-color shrink-0" />
                <span>bps1119@bps.go.id</span>
              </li>
              <li className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-primary-color shrink-0" />
                <a 
                  href="https://subulussalamkota.bps.go.id" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-primary-color transition-colors"
                >
                  subulussalamkota.bps.go.id
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-card-border mt-8 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-muted-text space-y-4 md:space-y-0">
          <p>
            &copy; {new Date().getFullYear()} BPS Kota Subulussalam & Pemko Subulussalam. All Rights Reserved.
          </p>
          <div className="flex space-x-4">
            <span>Website Diseminasi Hasil Pembinaan</span>
            <span>•</span>
            <span>Desa Cinta Statistik 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
