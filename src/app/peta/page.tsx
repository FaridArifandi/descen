'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Building, Search, RefreshCw } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getDesaList, getKecamatan } from '@/services/database';
import { Desa, Kecamatan } from '@/types';

// Dynamic import MapDesa to disable SSR for Leaflet
const MapDesa = dynamic(() => import('@/components/MapDesa'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[550px] rounded-2xl glass flex flex-col items-center justify-center border border-card-border">
      <div className="w-10 h-10 border-4 border-primary-color border-t-transparent rounded-full animate-spin mb-3" />
      <p className="text-sm font-semibold text-muted-text">Memuat Peta Interaktif...</p>
    </div>
  )
});

export default function PetaPage() {
  const [desaList, setDesaList] = useState<Desa[]>([]);
  const [kecamatanList, setKecamatanList] = useState<Kecamatan[]>([]);
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadData() {
      const [d, k] = await Promise.all([getDesaList(), getKecamatan()]);
      setDesaList(d);
      setKecamatanList(k);
    }
    loadData();
  }, []);

  const getKecamatanName = (id: number) => {
    return kecamatanList.find(k => k.id === id)?.nama || '';
  };

  const filteredDesa = desaList.filter(desa => {
    const matchSearch = desa.nama.toLowerCase().includes(searchQuery.toLowerCase());
    const matchKecamatan = selectedKecamatan === 'all' || desa.kecamatanId.toString() === selectedKecamatan;
    return matchSearch && matchKecamatan;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-grid relative pb-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-glow rounded-full blur-[100px] -z-10 pointer-events-none" />

        {/* Page Title */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
          <div className="border-b border-card-border pb-6">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Peta Interaktif <span className="text-primary-color">Desa Cantik</span>
            </h1>
            <p className="text-muted-text mt-2 text-sm sm:text-base">
              Peta sebaran lokasi seluruh desa peserta program Desa Cinta Statistik di Kota Subulussalam. Klik marker untuk melihat info singkat dan statistik desa.
            </p>
          </div>
        </section>

        {/* Map & List Layout */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Interactive Map Column */}
            <div className="lg:col-span-8 space-y-4">
              <MapDesa
                desaList={filteredDesa}
                kecamatanList={kecamatanList}
                height="550px"
              />
            </div>

            {/* Sidebar Desa Filter & Quick Links */}
            <div className="lg:col-span-4 flex flex-col h-[550px] glass rounded-2xl border border-card-border p-5">
              <div className="space-y-3 pb-4 border-b border-card-border">
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary-color" />
                  <span>Daftar Lokasi Desa ({filteredDesa.length})</span>
                </h3>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text" />
                  <input
                    type="text"
                    placeholder="Cari desa..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-background/80 border border-card-border text-xs focus:border-primary-color outline-none"
                  />
                </div>

                {/* Kecamatan Select Filter */}
                <select
                  value={selectedKecamatan}
                  onChange={e => setSelectedKecamatan(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-background/80 border border-card-border text-xs focus:border-primary-color outline-none font-medium"
                >
                  <option value="all">Semua Kecamatan</option>
                  {kecamatanList.map(k => (
                    <option key={k.id} value={k.id.toString()}>{k.nama}</option>
                  ))}
                </select>
              </div>

              {/* Scrollable list */}
              <div className="flex-1 overflow-y-auto space-y-2 mt-4 pr-1">
                {filteredDesa.length === 0 ? (
                  <p className="text-xs text-muted-text text-center py-8">Desa tidak ditemukan.</p>
                ) : (
                  filteredDesa.map(desa => (
                    <div
                      key={desa.id}
                      className="p-3 rounded-xl border border-card-border/60 hover:border-primary-color/50 bg-background/40 hover:bg-foreground/5 transition-all duration-200 flex items-center justify-between group"
                    >
                      <div>
                        <h4 className="font-bold text-xs text-foreground group-hover:text-primary-color transition-colors">
                          {desa.nama}
                        </h4>
                        <p className="text-[10px] text-muted-text mt-0.5">
                          Kec. {getKecamatanName(desa.kecamatanId)} • Binaan {desa.tahunPembinaan}
                        </p>
                      </div>
                      <Link
                        href={`/desa/${desa.id}`}
                        className="p-1.5 rounded-lg bg-primary-glow border border-primary-color/20 text-primary-color hover:bg-primary-color hover:text-white transition-all"
                        title="Lihat Detail"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
