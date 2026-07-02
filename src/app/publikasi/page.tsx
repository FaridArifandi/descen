'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  BookOpen, Search, FileDown, ExternalLink,
  RefreshCw, Filter, ArrowRight, ChevronDown
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { mockPublikasi, mockDesa } from '@/data/mockData';

export default function PublikasiPage() {
  const [search, setSearch] = useState('');
  const [filterDesa, setFilterDesa] = useState('all');
  const [filterTahun, setFilterTahun] = useState('all');

  const getDesaNama = (desaId: number) =>
    mockDesa.find(d => d.id === desaId)?.nama || '-';

  const tahunList = useMemo(() => {
    const years = [...new Set(mockPublikasi.map(p => p.tahun))].sort((a, b) => b - a);
    return years;
  }, []);

  const filtered = useMemo(() => {
    return mockPublikasi.filter(p => {
      const matchSearch =
        p.judul.toLowerCase().includes(search.toLowerCase()) ||
        getDesaNama(p.desaId).toLowerCase().includes(search.toLowerCase());
      const matchDesa = filterDesa === 'all' || p.desaId.toString() === filterDesa;
      const matchTahun = filterTahun === 'all' || p.tahun.toString() === filterTahun;
      return matchSearch && matchDesa && matchTahun;
    });
  }, [search, filterDesa, filterTahun]);

  const handleReset = () => {
    setSearch('');
    setFilterDesa('all');
    setFilterTahun('all');
  };

  const hasFilter = search || filterDesa !== 'all' || filterTahun !== 'all';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' as const } }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-grid relative overflow-hidden pb-20">
        {/* Background glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-glow rounded-full blur-[100px] -z-10 pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-glow-color/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

        {/* Header Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary-color/20 bg-primary-glow text-primary-color text-xs font-semibold tracking-wider uppercase">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Dokumen Desa Dalam Angka</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Publikasi{' '}
              <span className="bg-gradient-to-r from-primary-color via-secondary-color to-accent-color bg-clip-text text-transparent">
                Desa
              </span>
            </h1>
            <p className="text-muted-text text-sm sm:text-base max-w-2xl">
              Kumpulan buku Desa Dalam Angka dari seluruh desa binaan Desa Cantik Kota Subulussalam.
              Unduh atau lihat langsung dokumen statistik desa.
            </p>
          </motion.div>
        </section>

        {/* Filter Bar */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari judul atau nama desa..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-background/80 border border-card-border focus:border-primary-color focus:ring-2 focus:ring-primary-color/20 outline-none text-sm text-foreground placeholder:text-muted-text transition-all glass"
              />
            </div>

            {/* Filter Desa */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text pointer-events-none" />
              <select
                value={filterDesa}
                onChange={e => setFilterDesa(e.target.value)}
                className="pl-9 pr-8 py-2.5 rounded-xl glass border border-card-border focus:border-primary-color outline-none text-sm text-foreground bg-background/80 appearance-none cursor-pointer min-w-[160px] transition-all"
              >
                <option value="all">Semua Desa</option>
                {mockDesa.map(d => (
                  <option key={d.id} value={d.id.toString()}>{d.nama}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-text pointer-events-none" />
            </div>

            {/* Filter Tahun */}
            <div className="relative">
              <select
                value={filterTahun}
                onChange={e => setFilterTahun(e.target.value)}
                className="px-4 py-2.5 rounded-xl glass border border-card-border focus:border-primary-color outline-none text-sm text-foreground bg-background/80 appearance-none cursor-pointer min-w-[120px] pr-8 transition-all"
              >
                <option value="all">Semua Tahun</option>
                {tahunList.map(t => (
                  <option key={t} value={t.toString()}>{t}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-text pointer-events-none" />
            </div>

            {/* Reset */}
            {hasFilter && (
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-card-border text-sm text-muted-text hover:text-foreground hover:border-primary-color/40 glass transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Reset
              </button>
            )}
          </div>

          {/* Count */}
          <p className="text-xs text-muted-text mt-3">
            Menampilkan <span className="font-bold text-foreground">{filtered.length}</span> dari{' '}
            <span className="font-bold text-foreground">{mockPublikasi.length}</span> publikasi
          </p>
        </section>

        {/* Publikasi Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-12 h-12 text-muted-text mx-auto mb-4 opacity-40" />
              <p className="text-muted-text font-medium">Tidak ada publikasi yang sesuai filter.</p>
              <button onClick={handleReset} className="mt-4 text-primary-color text-sm hover:underline">
                Reset filter
              </button>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filtered.map(pub => {
                const desaNama = getDesaNama(pub.desaId);
                return (
                  <motion.div
                    key={pub.id}
                    variants={itemVariants}
                    className="group flex flex-col glass rounded-2xl border border-card-border overflow-hidden hover:border-primary-color/40 hover:shadow-[0_0_25px_rgba(0,210,255,0.08)] transition-all duration-300"
                  >
                    {/* Cover Image */}
                    <div className="relative h-48 w-full overflow-hidden bg-foreground/5 shrink-0">
                      <Image
                        src={pub.coverUrl}
                        alt={pub.judul}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      {/* Tahun badge */}
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase bg-primary-color/90 text-white">
                        {pub.tahun}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col p-5 gap-3">
                      {/* Nama desa */}
                      <Link
                        href={`/desa/${pub.desaId}`}
                        className="text-[11px] font-bold uppercase tracking-wider text-primary-color hover:underline"
                      >
                        {desaNama}
                      </Link>

                      {/* Judul */}
                      <h2 className="text-sm font-bold text-foreground leading-snug line-clamp-2">
                        {pub.judul}
                      </h2>

                      {/* Ringkasan */}
                      <p className="text-xs text-muted-text line-clamp-3 flex-1">
                        {pub.ringkasan}
                      </p>

                      {/* Action buttons */}
                      <div className="flex gap-2 pt-1 border-t border-card-border mt-auto">
                        <a
                          href={pub.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary-color text-white text-xs font-semibold hover:opacity-90 transition-all shadow-[0_0_12px_var(--primary-glow)]"
                        >
                          <FileDown className="w-3.5 h-3.5" />
                          Unduh PDF
                        </a>
                        <Link
                          href={`/desa/${pub.desaId}?tab=publikasi`}
                          className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl border border-card-border text-xs text-muted-text hover:text-foreground hover:border-primary-color/30 transition-all"
                          title="Lihat di halaman desa"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
