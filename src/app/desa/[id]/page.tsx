'use client';

import React, { useState, use, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  BookOpen, 
  MapPin, 
  TrendingUp, 
  FileImage, 
  Download, 
  Eye, 
  ChevronRight, 
  ExternalLink,
  Info,
  Maximize2,
  Share2,
  X,
  Play,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  mockDesa, 
  mockKecamatan, 
  mockPublikasi, 
  mockPotensi, 
  mockInfografis 
} from '@/data/mockData';

// Chart Colors
const COLORS = ['#00d2ff', '#0f62fe', '#10b981', '#f59e0b', '#8b5cf6'];

export default function DesaDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = parseInt(resolvedParams.id);
  
  const [activeTab, setActiveTab] = useState<'publikasi' | 'profil' | 'potensi' | 'infografis'>('publikasi');
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [selectedInfographic, setSelectedInfographic] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  // Find Village data
  const desa = useMemo(() => {
    return mockDesa.find(d => d.id === id);
  }, [id]);

  const kecamatanName = useMemo(() => {
    if (!desa) return '';
    return mockKecamatan.find(k => k.id === desa.kecamatanId)?.nama || '';
  }, [desa]);

  // Filter items for this village
  const publikasi = useMemo(() => mockPublikasi.filter(p => p.desaId === id), [id]);
  const potensi = useMemo(() => mockPotensi.filter(p => p.desaId === id), [id]);
  const infografis = useMemo(() => mockInfografis.filter(i => i.desaId === id), [id]);

  // Chart Data (Mock data representing demographics & economy for this village)
  const demographicData = [
    { name: '0-14 Tahun', Jumlah: 480 },
    { name: '15-29 Tahun', Jumlah: 920 },
    { name: '30-44 Tahun', Jumlah: 850 },
    { name: '45-59 Tahun', Jumlah: 670 },
    { name: '60+ Tahun', Jumlah: 500 }
  ];

  const occupationData = [
    { name: 'Petani', value: 45 },
    { name: 'Pedagang', value: 20 },
    { name: 'PNS/TNI/Polri', value: 10 },
    { name: 'Pekerja Jasa', value: 15 },
    { name: 'Lainnya', value: 10 }
  ];

  if (!desa) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center py-20 bg-grid">
          <div className="glass rounded-2xl p-8 max-w-md text-center border border-card-border">
            <h2 className="text-2xl font-bold text-foreground">Desa Tidak Ditemukan</h2>
            <p className="text-muted-text mt-2">Data desa yang Anda minta tidak terdaftar di sistem kami.</p>
            <Link 
              href="/daftar-desa"
              className="mt-6 inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-primary-color text-white text-sm font-semibold hover:opacity-90 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Daftar Desa</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 pb-20">
        {/* Banner Section */}
        <section className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
          <Image
            src={desa.fotoCover}
            alt={desa.nama}
            fill
            priority
            className="object-cover opacity-60"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          
          <div className="absolute bottom-6 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link 
              href="/daftar-desa"
              className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-primary-color bg-background/80 border border-card-border px-3 py-1.5 rounded-lg backdrop-blur-sm mb-4 hover:bg-background transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Daftar Desa</span>
            </Link>
            
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-md text-xs font-bold uppercase bg-primary-color text-white">
                Kec. {kecamatanName}
              </span>
              <span className="px-3 py-1 rounded-md text-xs font-bold uppercase bg-background/80 border border-card-border text-foreground">
                Tahun Binaan {desa.tahunPembinaan}
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-3">
              {desa.nama}
            </h1>
            
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-text mt-2">
              <MapPin className="w-4 h-4 text-primary-color shrink-0" />
              <span>Koordinat: {desa.latitude}, {desa.longitude}</span>
            </div>
          </div>
        </section>

        {/* Tab Switcher */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="flex flex-wrap gap-2 border-b border-card-border pb-3 no-scrollbar overflow-x-auto">
            {[
              { id: 'publikasi', label: 'Publikasi Desa', icon: <BookOpen className="w-4 h-4" /> },
              { id: 'profil', label: 'Profil & Monografi', icon: <Info className="w-4 h-4" /> },
              { id: 'potensi', label: 'Potensi Unggulan', icon: <TrendingUp className="w-4 h-4" /> },
              { id: 'infografis', label: 'Galeri Infografis', icon: <FileImage className="w-4 h-4" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-primary-color text-white shadow-[0_0_15px_var(--primary-glow)]'
                    : 'text-muted-text hover:text-foreground hover:bg-foreground/5'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Tab Contents */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              
              {/* TAB 1: PUBLIKASI */}
              {activeTab === 'publikasi' && (
                <div className="space-y-8">
                  {publikasi.length === 0 ? (
                    <div className="glass rounded-2xl p-10 text-center border border-card-border">
                      <BookOpen className="w-10 h-10 text-muted-text mx-auto mb-3" />
                      <p className="text-muted-text">Belum ada berkas publikasi yang diunggah untuk desa ini.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {publikasi.map(pub => (
                        <div 
                          key={pub.id}
                          className="glass rounded-2xl p-6 border border-card-border flex flex-col sm:flex-row gap-6 hover:shadow-[0_0_20px_rgba(0,210,255,0.05)] transition-all duration-300"
                        >
                          <div className="relative w-full sm:w-36 h-48 bg-foreground/5 rounded-xl overflow-hidden shrink-0 border border-card-border">
                            <Image
                              src={pub.coverUrl}
                              alt={pub.judul}
                              fill
                              className="object-cover"
                              sizes="(max-w-768px) 100vw, 150px"
                            />
                            <div className="absolute top-2 right-2 px-2 py-0.5 bg-primary-color text-[10px] font-extrabold rounded-md text-white">
                              {pub.tahun}
                            </div>
                          </div>
                          
                          <div className="flex flex-col justify-between flex-1">
                            <div>
                              <h3 className="text-xl font-bold text-foreground leading-snug">
                                {pub.judul}
                              </h3>
                              <p className="text-sm text-muted-text mt-3 leading-relaxed line-clamp-3">
                                {pub.ringkasan}
                              </p>
                            </div>
                            
                            <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-card-border/50">
                              <button
                                onClick={() => setSelectedPdf(pub.pdfUrl)}
                                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-primary-glow border border-primary-color/20 text-primary-color text-xs font-semibold hover:bg-primary-color hover:text-white transition-all duration-200"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Lihat Online</span>
                              </button>
                              <a
                                href={pub.pdfUrl}
                                download
                                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground text-xs font-semibold border border-card-border transition-all duration-200"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Unduh PDF</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: PROFIL & MONOGRAFI */}
              {activeTab === 'profil' && (
                <div className="space-y-8">
                  {/* Descriptions Card */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Profil Desa */}
                    <div className="glass rounded-2xl p-6 border border-card-border flex flex-col justify-between">
                      <div>
                        <div className="flex items-center space-x-2 text-primary-color mb-3">
                          <Info className="w-5 h-5" />
                          <h3 className="font-bold text-lg">Profil Desa</h3>
                        </div>
                        <p className="text-sm text-muted-text leading-relaxed">
                          {desa.profilAbstrak}
                        </p>
                      </div>
                      <div className="mt-6 pt-4 border-t border-card-border flex">
                        <a 
                          href={desa.profilFileUrl}
                          className="inline-flex items-center space-x-1.5 text-xs font-bold text-primary-color hover:underline"
                        >
                          <Download className="w-4 h-4" />
                          <span>Unduh Profil Desa (Lengkap)</span>
                        </a>
                      </div>
                    </div>

                    {/* Monografi Desa */}
                    <div className="glass rounded-2xl p-6 border border-card-border flex flex-col justify-between">
                      <div>
                        <div className="flex items-center space-x-2 text-primary-color mb-3">
                          <Layers className="w-5 h-5" />
                          <h3 className="font-bold text-lg">Monografi Desa</h3>
                        </div>
                        <p className="text-sm text-muted-text leading-relaxed">
                          {desa.monografiAbstrak}
                        </p>
                      </div>
                      <div className="mt-6 pt-4 border-t border-card-border flex">
                        <a 
                          href={desa.monografiFileUrl}
                          className="inline-flex items-center space-x-1.5 text-xs font-bold text-primary-color hover:underline"
                        >
                          <Download className="w-4 h-4" />
                          <span>Unduh Monografi Desa (Lengkap)</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Visualizations (Recharts Charts) */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Chart 1: Demographics */}
                    <div className="glass rounded-2xl p-6 border border-card-border">
                      <h4 className="font-bold text-foreground mb-6 text-sm sm:text-base uppercase tracking-wider">
                        Komposisi Demografi Penduduk (Kelompok Umur)
                      </h4>
                      <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={demographicData}>
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip 
                              contentStyle={{ 
                                background: 'rgba(10, 20, 42, 0.9)', 
                                borderColor: 'rgba(0, 210, 255, 0.3)',
                                borderRadius: '8px',
                                color: '#f1f5f9'
                              }} 
                            />
                            <Bar dataKey="Jumlah" fill="#00d2ff" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Chart 2: Occupation */}
                    <div className="glass rounded-2xl p-6 border border-card-border">
                      <h4 className="font-bold text-foreground mb-6 text-sm sm:text-base uppercase tracking-wider">
                        Distribusi Mata Pencaharian (%)
                      </h4>
                      <div className="h-80 w-full flex flex-col justify-center">
                        <ResponsiveContainer width="100%" height="90%">
                          <PieChart>
                            <Pie
                              data={occupationData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {occupationData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip 
                              formatter={(value) => `${value}%`}
                              contentStyle={{ 
                                background: 'rgba(10, 20, 42, 0.9)', 
                                borderColor: 'rgba(0, 210, 255, 0.3)',
                                borderRadius: '8px',
                                color: '#f1f5f9'
                              }} 
                            />
                            <Legend 
                              verticalAlign="bottom" 
                              height={36} 
                              iconType="circle"
                              wrapperStyle={{ fontSize: '11px', color: '#f1f5f9' }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: POTENSI DESA */}
              {activeTab === 'potensi' && (
                <div className="space-y-8">
                  {potensi.length === 0 ? (
                    <div className="glass rounded-2xl p-10 text-center border border-card-border">
                      <TrendingUp className="w-10 h-10 text-muted-text mx-auto mb-3" />
                      <p className="text-muted-text">Belum ada data potensi unggulan yang diunggah untuk desa ini.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Potentials List */}
                      <div className="space-y-6">
                        {potensi.map(pot => (
                          <div 
                            key={pot.id}
                            className="glass rounded-2xl p-6 border border-card-border flex gap-4 hover:shadow-[0_0_20px_rgba(0,210,255,0.05)] transition-all duration-300"
                          >
                            <div className="flex flex-col justify-between flex-1">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-primary-glow text-primary-color border border-primary-color/10">
                                    {pot.kategori}
                                  </span>
                                  <span className="text-xs text-muted-text font-semibold">
                                    {pot.subKategori}
                                  </span>
                                </div>
                                <h3 className="text-lg font-bold text-foreground mt-2">
                                  {pot.nama}
                                </h3>
                                <p className="text-sm text-muted-text mt-2 leading-relaxed">
                                  {pot.deskripsi}
                                </p>
                              </div>
                              
                              {/* Media trigger links */}
                              {pot.videoUrl && (
                                <button
                                  onClick={() => setActiveVideo(pot.videoUrl || null)}
                                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-primary-color mt-4 hover:underline"
                                >
                                  <Play className="w-3.5 h-3.5 fill-current" />
                                  <span>Putar Video Potensi</span>
                                </button>
                              )}
                            </div>

                            {pot.fotoUrl && (
                              <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-foreground/5 rounded-xl overflow-hidden shrink-0 border border-card-border">
                                <Image
                                  src={pot.fotoUrl}
                                  alt={pot.nama}
                                  fill
                                  className="object-cover"
                                  sizes="(max-w-768px) 100vw, 120px"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Map Widget (Futuristic Mock Map) */}
                      <div className="glass rounded-2xl p-6 border border-card-border flex flex-col justify-between h-full min-h-[400px]">
                        <div>
                          <div className="flex items-center space-x-2 text-primary-color mb-3">
                            <MapPin className="w-5 h-5" />
                            <h3 className="font-bold text-lg">Peta Lokasi & Koordinat</h3>
                          </div>
                          <p className="text-sm text-muted-text leading-relaxed">
                            Lokasi geografis desa Cantik {desa.nama} di Kota Subulussalam. Gunakan tombol link eksternal untuk rute langsung via Google Maps.
                          </p>
                        </div>

                        {/* Interactive Styled Map Box */}
                        <div className="relative h-64 bg-slate-950 rounded-xl overflow-hidden border border-card-border/60 flex items-center justify-center my-4 bg-grid">
                          <div className="absolute inset-0 bg-primary-glow/10 pointer-events-none" />
                          
                          {/* Pulsing Dot */}
                          <div className="relative z-10 flex flex-col items-center">
                            <div className="w-4 h-4 bg-primary-color rounded-full animate-ping absolute" />
                            <div className="w-4 h-4 bg-primary-color rounded-full border-2 border-white relative" />
                            <span className="mt-2 text-xs font-bold bg-background/90 text-foreground px-2 py-1 rounded-md border border-card-border backdrop-blur-sm">
                              {desa.nama}
                            </span>
                          </div>
                          
                          {/* Mock Coordinate overlay */}
                          <div className="absolute bottom-2 left-2 bg-slate-900/90 border border-card-border/60 rounded px-2.5 py-1 text-[10px] font-mono text-primary-color">
                            LAT: {desa.latitude} | LNG: {desa.longitude}
                          </div>
                        </div>

                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${desa.latitude},${desa.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center space-x-2 w-full py-3 rounded-xl bg-primary-color text-white font-semibold hover:opacity-90 transition-all duration-200 text-sm"
                        >
                          <span>Buka di Google Maps</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: INFOGRAFIS DESA */}
              {activeTab === 'infografis' && (
                <div className="space-y-8">
                  {infografis.length === 0 ? (
                    <div className="glass rounded-2xl p-10 text-center border border-card-border">
                      <FileImage className="w-10 h-10 text-muted-text mx-auto mb-3" />
                      <p className="text-muted-text">Belum ada infografis statistik yang diunggah untuk desa ini.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {infografis.map(info => (
                        <div 
                          key={info.id}
                          className="group glass rounded-2xl overflow-hidden border border-card-border hover:border-primary-color/40 hover:shadow-[0_8px_32px_rgba(0,210,255,0.05)] transition-all duration-300 flex flex-col justify-between"
                        >
                          <div className="relative h-60 w-full bg-slate-900 overflow-hidden">
                            <Image
                              src={info.imageUrl}
                              alt={info.judul}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              sizes="(max-w-768px) 100vw, 33vw"
                            />
                            
                            {/* Hover Actions overlay */}
                            <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                              <button
                                onClick={() => setSelectedInfographic(info.imageUrl)}
                                className="p-3 rounded-full bg-primary-color text-white hover:scale-110 active:scale-95 transition-transform"
                                title="Zoom Infografis"
                              >
                                <Maximize2 className="w-5 h-5" />
                              </button>
                              <a
                                href={info.imageUrl}
                                download
                                className="p-3 rounded-full bg-slate-800 text-white border border-card-border hover:scale-110 active:scale-95 transition-transform"
                                title="Unduh Gambar"
                              >
                                <Download className="w-5 h-5" />
                              </a>
                            </div>
                          </div>
                          
                          <div className="p-5 border-t border-card-border">
                            <h4 className="font-bold text-sm text-foreground line-clamp-2 leading-relaxed">
                              {info.judul}
                            </h4>
                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-card-border/50 text-xs text-muted-text">
                              <button className="hover:text-primary-color flex items-center space-x-1">
                                <Share2 className="w-3.5 h-3.5" />
                                <span>Bagikan</span>
                              </button>
                              <a 
                                href={info.pdfUrl} 
                                download
                                className="hover:text-primary-color font-semibold uppercase tracking-wider"
                              >
                                PDF Version
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </section>
      </main>

      {/* PDF VIEWER MODAL */}
      {selectedPdf && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative glass w-full max-w-4xl h-[85vh] rounded-3xl overflow-hidden border border-card-border flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-card-border">
              <span className="font-bold text-foreground text-sm sm:text-base">Pratinjau Publikasi Online</span>
              <button 
                onClick={() => setSelectedPdf(null)}
                className="p-1.5 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 bg-slate-900 relative">
              <iframe
                src={selectedPdf}
                className="w-full h-full border-none"
                title="PDF Viewer"
              />
            </div>
          </div>
        </div>
      )}

      {/* INFOGRAPHIC LIGHTBOX MODAL */}
      {selectedInfographic && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setSelectedInfographic(null)}>
          <div className="relative max-w-4xl max-h-[85vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedInfographic(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white transition-all border border-card-border"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative w-[90vw] max-w-3xl h-[70vh]">
              <Image
                src={selectedInfographic}
                alt="Zoomed Infographic"
                fill
                className="object-contain"
                sizes="90vw"
              />
            </div>
          </div>
        </div>
      )}

      {/* VIDEO PLAYER MODAL */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setActiveVideo(null)}>
          <div className="relative w-full max-w-3xl rounded-3xl overflow-hidden border border-card-border glass flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-card-border">
              <span className="font-bold text-foreground">Pemutaran Video Potensi Desa</span>
              <button 
                onClick={() => setActiveVideo(null)}
                className="p-1.5 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video bg-black">
              <video
                src={activeVideo}
                controls
                autoPlay
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
