'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  BookOpen, 
  Target, 
  Users, 
  CheckCircle2, 
  Database, 
  TrendingUp 
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TentangDesaCantik() {
  const objectives = [
    {
      icon: <Target className="w-6 h-6 text-primary-color" />,
      title: 'Meningkatkan Literasi Statistik',
      desc: 'Membina perangkat desa agar memiliki pemahaman dasar statistik guna menghindari kesalahan pengumpulan data di lapangan.'
    },
    {
      icon: <BookOpen className="w-6 h-6 text-primary-color" />,
      title: 'Standardisasi Basis Data Desa',
      desc: 'Menyusun data monografi dan potensi desa menggunakan kaidah penulisan serta metadata standar yang diakui secara nasional.'
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-primary-color" />,
      title: 'Perencanaan Pembangunan Tepat Sasaran',
      desc: 'Menyediakan basis data mikro sektoral yang valid bagi Pemerintah Kota Subulussalam untuk menentukan kebijakan pembangunan.'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-grid relative pb-20">
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-primary-glow rounded-full blur-[100px] -z-10 pointer-events-none" />

        {/* Header Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Tentang <span className="text-primary-color">Desa Cantik</span>
            </h1>
            <p className="text-muted-text max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              Mengenal lebih dalam Program Desa Cinta Statistik (Desa Cantik) Kota Subulussalam sebagai fondasi data pembangunan daerah.
            </p>
          </motion.div>
        </section>

        {/* Content Section 1: Definition */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass rounded-3xl p-8 sm:p-10 border border-card-border space-y-6"
          >
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Award className="w-6 h-6 text-primary-color" />
              <span>Apa itu Desa Cantik?</span>
            </h2>
            <div className="text-muted-text text-sm sm:text-base leading-relaxed space-y-4">
              <p>
                <strong>Desa Cinta Statistik (Desa Cantik)</strong> merupakan program percepatan (quick wins) Badan Pusat Statistik (BPS) Republik Indonesia yang menyasar peningkatan kompetensi pengelolaan statistik di tingkat terkecil, yaitu desa/kelurahan.
              </p>
              <p>
                Melalui program ini, aparat desa dibina secara intensif oleh instruktur/pembina dari BPS Kota Subulussalam untuk mengumpulkan, mengolah, menyajikan, dan memanfaatkan data statistik secara mandiri. Desa tidak lagi sekadar menjadi objek pengumpul data, melainkan subjek aktif yang memanfaatkan data untuk merancang program pembangunan sendiri.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Content Section 2: Objectives Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Fokus Utama Pembinaan
            </h2>
            <p className="text-muted-text text-sm mt-2">
              Tiga pilar tujuan program Desa Cantik di Kota Subulussalam.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {objectives.map((obj, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 + 0.2 }}
                className="glass rounded-2xl p-6 border border-card-border hover:shadow-[0_0_20px_rgba(0,210,255,0.05)] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="p-3 rounded-xl bg-primary-glow border border-primary-color/10 w-fit mb-4">
                    {obj.icon}
                  </div>
                  <h3 className="text-lg font-bold text-foreground leading-snug">
                    {obj.title}
                  </h3>
                  <p className="text-sm text-muted-text mt-3 leading-relaxed">
                    {obj.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Content Section 3: Activities */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass rounded-3xl p-8 sm:p-10 border border-card-border space-y-6"
          >
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Users className="w-6 h-6 text-primary-color" />
              <span>Tahapan Kegiatan Pembinaan</span>
            </h2>
            <ul className="space-y-4 text-sm sm:text-base text-muted-text">
              {[
                'Identifikasi kebutuhan data spesifik masing-masing desa binaan.',
                'Sosialisasi pentingnya literasi data kepada aparat desa dan tokoh masyarakat.',
                'Pelatihan teknis pengumpulan data lapangan menggunakan kuesioner digital.',
                'Pembinaan penyusunan kompilasi data monografi dan potensi unggulan desa.',
                'Pendampingan penerbitan buku tahunan "Desa Dalam Angka" terstandarisasi.',
                'Visualisasi infografis menarik guna diseminasi publik lewat portal ini.'
              ].map((step, index) => (
                <li key={index} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-primary-color shrink-0 mt-0.5" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
