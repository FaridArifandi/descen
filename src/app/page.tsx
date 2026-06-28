'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Building2, 
  BookOpen, 
  FileImage, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle,
  FileDown
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { mockDesa, mockKecamatan, getDashboardStats } from '@/data/mockData';

export default function Home() {
  const stats = getDashboardStats();
  const previewDesa = mockDesa.slice(0, 3); // Get first 3 for homepage preview

  const getKecamatanName = (id: number) => {
    return mockKecamatan.find(k => k.id === id)?.nama || '';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  } as const;

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' as const }
    }
  } as const;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-grid relative overflow-hidden pb-20">
        {/* Glow Effects in Background */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-glow rounded-full blur-[100px] -z-10 pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-glow-color/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 sm:pt-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-primary-color/20 bg-primary-glow text-primary-color text-xs font-semibold tracking-wider uppercase">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Program Resmi BPS Kota Subulussalam</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
              Diseminasi Hasil Pembinaan <br />
              <span className="bg-gradient-to-r from-primary-color via-secondary-color to-accent-color bg-clip-text text-transparent drop-shadow-sm">
                Desa Cantik
              </span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-base sm:text-xl text-muted-text leading-relaxed">
              Portal data statistik desa binaan (Desa Cinta Statistik) di wilayah Kota Subulussalam.
              Menyajikan visualisasi potensi ekonomi, wisata, infografis, dan publikasi Desa Dalam Angka.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link 
                href="/daftar-desa"
                className="flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-primary-color text-white font-medium shadow-[0_0_20px_var(--primary-glow)] hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <span>Lihat Daftar Desa</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/daftar-desa?tab=publikasi"
                className="flex items-center justify-center space-x-2 px-6 py-3 rounded-xl glass hover:bg-foreground/5 text-foreground font-medium border-card-border hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <FileDown className="w-4 h-4 text-primary-color" />
                <span>Unduh Publikasi</span>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Statistik Ringkas Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {[
              { 
                icon: <Building2 className="w-6 h-6 text-primary-color" />, 
                value: stats.totalDesa, 
                label: 'Desa Binaan', 
                desc: 'Tersebar di 5 Kecamatan' 
              },
              { 
                icon: <BookOpen className="w-6 h-6 text-primary-color" />, 
                value: stats.totalPublikasi, 
                label: 'Publikasi Angka', 
                desc: 'Dokumen Desa Dalam Angka' 
              },
              { 
                icon: <FileImage className="w-6 h-6 text-primary-color" />, 
                value: stats.totalInfografis, 
                label: 'Galeri Infografis', 
                desc: 'Data Statistik Visual' 
              },
              { 
                icon: <TrendingUp className="w-6 h-6 text-primary-color" />, 
                value: stats.totalPotensi, 
                label: 'Potensi Desa', 
                desc: 'Ekonomi, Wisata & Investasi' 
              }
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="glass rounded-2xl p-5 border border-card-border flex flex-col justify-between hover:shadow-[0_0_20px_rgba(0,210,255,0.1)] transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-primary-glow border border-primary-color/10">
                    {stat.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                    {stat.value}
                  </h3>
                  <p className="text-sm font-semibold text-foreground/90 mt-1">
                    {stat.label}
                  </p>
                  <p className="text-xs text-muted-text mt-0.5">
                    {stat.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Preview Daftar Desa Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">
                Desa Binaan <span className="text-primary-color">Unggulan</span>
              </h2>
              <p className="text-muted-text mt-2 text-sm sm:text-base">
                Jelajahi profil, publikasi, potensi, dan galeri infografis desa-desa Cantik di Subulussalam.
              </p>
            </div>
            <Link 
              href="/daftar-desa"
              className="inline-flex items-center space-x-1 text-sm font-semibold text-primary-color hover:underline mt-4 md:mt-0"
            >
              <span>Lihat semua desa</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {previewDesa.map((desa, idx) => (
              <motion.div
                key={desa.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group flex flex-col rounded-2xl glass overflow-hidden border border-card-border hover:border-primary-color/40 transition-all duration-300"
              >
                {/* Photo Header */}
                <div className="relative h-48 w-full overflow-hidden bg-foreground/5">
                  <Image
                    src={desa.fotoCover}
                    alt={desa.nama}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-w-768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  
                  {/* Kecamatan & Tahun Badge */}
                  <div className="absolute top-4 left-4 flex space-x-2">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase bg-background/80 border border-card-border backdrop-blur-sm text-primary-color">
                      {getKecamatanName(desa.kecamatanId)}
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase bg-primary-color/90 text-white backdrop-blur-sm">
                      Binaan {desa.tahunPembinaan}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold group-hover:text-primary-color transition-colors">
                      {desa.nama}
                    </h3>
                    <p className="text-sm text-muted-text mt-3 line-clamp-3">
                      {desa.profilAbstrak}
                    </p>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-card-border flex items-center justify-between">
                    <Link
                      href={`/desa/${desa.id}`}
                      className="inline-flex items-center space-x-1.5 text-sm font-semibold text-primary-color group-hover:translate-x-1 transition-transform"
                    >
                      <span>Lihat Detail</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
