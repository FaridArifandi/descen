'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Grid, 
  List, 
  ArrowRight, 
  Filter, 
  RefreshCw,
  Building
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getDesaList, getKecamatan } from '@/services/database';
import { Desa, Kecamatan } from '@/types';

export default function DaftarDesa() {
  const [desaList, setDesaList] = useState<Desa[]>([]);
  const [kecamatanList, setKecamatanList] = useState<Kecamatan[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

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

  // Get unique years of pembinaan for filtering
  const years = useMemo(() => {
    const allYears = desaList.map(d => d.tahunPembinaan.toString());
    return ['all', ...Array.from(new Set(allYears)).sort()];
  }, [desaList]);

  // Filter logic
  const filteredDesa = useMemo(() => {
    return desaList.filter(desa => {
      const matchSearch = desa.nama.toLowerCase().includes(searchQuery.toLowerCase());
      const matchKecamatan = selectedKecamatan === 'all' || desa.kecamatanId.toString() === selectedKecamatan;
      const matchYear = selectedYear === 'all' || desa.tahunPembinaan.toString() === selectedYear;
      return matchSearch && matchKecamatan && matchYear;
    });
  }, [desaList, searchQuery, selectedKecamatan, selectedYear]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedKecamatan('all');
    setSelectedYear('all');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-grid relative pb-20">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-glow rounded-full blur-[100px] -z-10 pointer-events-none" />

        {/* Page Title */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
          <div className="border-b border-card-border pb-6">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Daftar <span className="text-primary-color">Desa Cantik</span>
            </h1>
            <p className="text-muted-text mt-2 text-sm sm:text-base">
              Menampilkan seluruh desa peserta program Desa Cinta Statistik Kota Subulussalam yang sedang dan telah dibina.
            </p>
          </div>
        </section>

        {/* Search & Filter Toolbar */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="glass rounded-2xl p-4 border border-card-border flex flex-col lg:flex-row gap-4 items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
            
            {/* Search Input */}
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-text" />
              <input
                type="text"
                placeholder="Cari nama desa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-card-border bg-background/50 focus:border-primary-color focus:ring-1 focus:ring-primary-color outline-none transition-all duration-200"
              />
            </div>

            {/* Filters Dropdown */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              
              {/* Filter Kecamatan */}
              <div className="flex items-center space-x-1.5 shrink-0 bg-background/50 border border-card-border rounded-xl px-3 py-2 text-sm">
                <Filter className="w-4 h-4 text-primary-color" />
                <select
                  value={selectedKecamatan}
                  onChange={(e) => setSelectedKecamatan(e.target.value)}
                  className="bg-transparent border-none outline-none pr-4 text-foreground font-medium cursor-pointer"
                >
                  <option value="all" className="bg-background text-foreground">Semua Kecamatan</option>
                  {kecamatanList.map(k => (
                    <option key={k.id} value={k.id.toString()} className="bg-background text-foreground">
                      {k.nama}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Tahun */}
              <div className="flex items-center space-x-1.5 shrink-0 bg-background/50 border border-card-border rounded-xl px-3 py-2 text-sm">
                <Building className="w-4 h-4 text-primary-color" />
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="bg-transparent border-none outline-none pr-4 text-foreground font-medium cursor-pointer"
                >
                  <option value="all" className="bg-background text-foreground">Semua Tahun</option>
                  {years.filter(y => y !== 'all').map(year => (
                    <option key={year} value={year} className="bg-background text-foreground">
                      Binaan {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reset Button */}
              {(searchQuery || selectedKecamatan !== 'all' || selectedYear !== 'all') && (
                <button
                  onClick={handleResetFilters}
                  className="p-2 rounded-xl text-muted-text hover:text-primary-color hover:bg-foreground/5 transition-all duration-200"
                  title="Reset Filter"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              )}

              {/* Separator */}
              <div className="hidden sm:block h-8 w-px bg-card-border mx-1" />

              {/* View Toggle */}
              <div className="flex items-center bg-background/50 border border-card-border rounded-xl p-1 shrink-0 ml-auto sm:ml-0">
                <button
                  onClick={() => setViewMode('card')}
                  className={`p-1.5 rounded-lg transition-all duration-200 ${
                    viewMode === 'card' 
                      ? 'bg-primary-color text-white' 
                      : 'text-muted-text hover:text-foreground'
                  }`}
                  title="Card View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-lg transition-all duration-200 ${
                    viewMode === 'table' 
                      ? 'bg-primary-color text-white' 
                      : 'text-muted-text hover:text-foreground'
                  }`}
                  title="Table View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </section>

        {/* Villages List Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {filteredDesa.length === 0 ? (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-3xl p-16 text-center border border-card-border"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-primary-glow border border-primary-color/20 flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-primary-color" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Tidak Ada Hasil Ditemukan</h3>
              <p className="text-sm text-muted-text max-w-sm mx-auto mt-2 leading-relaxed">
                Kata kunci atau filter yang Anda pilih tidak cocok dengan desa binaan manapun. Coba ubah pencarian atau reset filter.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-6 px-5 py-2.5 rounded-xl bg-primary-color text-white text-sm font-semibold hover:opacity-90 transition-all duration-200"
              >
                Reset Semua Filter
              </button>
            </motion.div>
          ) : viewMode === 'card' ? (
            /* Card Grid View */
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence>
                {filteredDesa.map(desa => (
                  <motion.div
                    key={desa.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="group flex flex-col rounded-2xl glass overflow-hidden border border-card-border hover:border-primary-color/40 hover:shadow-[0_8px_32px_rgba(0,210,255,0.05)] transition-all duration-300"
                  >
                    <div className="relative h-48 w-full overflow-hidden bg-foreground/5">
                      <Image
                        src={desa.fotoCover}
                        alt={desa.nama}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-w-768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      
                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex space-x-2">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase bg-background/80 border border-card-border backdrop-blur-sm text-primary-color">
                          {getKecamatanName(desa.kecamatanId)}
                        </span>
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase bg-primary-color/90 text-white backdrop-blur-sm">
                          Binaan {desa.tahunPembinaan}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold group-hover:text-primary-color transition-colors">
                          {desa.nama}
                        </h3>
                        <p className="text-sm text-muted-text mt-3 line-clamp-3 leading-relaxed">
                          {desa.profilAbstrak}
                        </p>
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-card-border flex items-center justify-between">
                        <Link
                          href={`/desa/${desa.id}`}
                          className="inline-flex items-center space-x-1.5 text-sm font-semibold text-primary-color group-hover:translate-x-1 transition-transform"
                        >
                          <span>Lihat Detail & Data</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            /* Table List View */
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl overflow-hidden border border-card-border shadow-md"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-card-border bg-foreground/5 text-sm font-bold text-foreground">
                      <th className="p-4 w-16 text-center">No</th>
                      <th className="p-4">Nama Desa</th>
                      <th className="p-4">Kecamatan</th>
                      <th className="p-4">Tahun Pembinaan</th>
                      <th className="p-4 text-center">Detail Data</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-card-border/50 text-sm">
                    {filteredDesa.map((desa, idx) => (
                      <tr 
                        key={desa.id} 
                        className="hover:bg-foreground/5 transition-colors group"
                      >
                        <td className="p-4 text-center font-semibold text-muted-text">{idx + 1}</td>
                        <td className="p-4 font-bold text-foreground group-hover:text-primary-color transition-colors">
                          {desa.nama}
                        </td>
                        <td className="p-4 text-foreground/80">{getKecamatanName(desa.kecamatanId)}</td>
                        <td className="p-4 font-medium text-foreground/80">Tahun {desa.tahunPembinaan}</td>
                        <td className="p-4 text-center">
                          <Link
                            href={`/desa/${desa.id}`}
                            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary-glow border border-primary-color/20 text-primary-color text-xs font-semibold hover:bg-primary-color hover:text-white transition-all duration-200"
                          >
                            <span>Buka Data</span>
                            <ArrowRight className="w-3.5 h-3.5 ml-1" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
