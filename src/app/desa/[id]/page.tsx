'use client';

import React, { useState, use, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';

const MapDesa = dynamic(() => import('@/components/MapDesa'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 rounded-xl glass flex items-center justify-center border border-card-border">
      <p className="text-xs font-semibold text-muted-text">Memuat Peta Desa...</p>
    </div>
  )
});
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  BookOpen, 
  MapPin, 
  TrendingUp, 
  FileImage, 
  Download, 
  Eye, 
  ChevronRight,
  ChevronLeft, 
  ExternalLink,
  Info,
  Maximize2,
  Share2,
  X,
  Play,
  Layers,
  Filter
} from 'lucide-react';
import { decodeDesaSlug } from '@/lib/slug';
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
  getDesaList, 
  getKecamatan, 
  getPublikasi, 
  getPotensi, 
  getInfografis,
  getDemografiByDesaId,
  getMataPencaharianByDesaId,
  getDesaListSync,
  getKecamatanSync,
  getPublikasiSync,
  getPotensiSync,
  getInfografisSync,
  getDemografiSync,
  getMataPencaharianSync
} from '@/services/database';
import { Desa, Kecamatan, Publikasi, Potensi, Infografis, DemografiDesa, MataPencaharianItem } from '@/types';

// Chart Colors
const COLORS = ['#00d2ff', '#0f62fe', '#10b981', '#f59e0b', '#8b5cf6'];

export default function DesaDetail({ params }: { params?: Promise<{ id: string }> }) {
  const urlParams = useParams();
  const rawIdParam = (typeof urlParams?.id === 'string' ? urlParams.id : Array.isArray(urlParams?.id) ? urlParams.id[0] : '') || '';
  const initialDesaList = getDesaListSync();
  const initialId = decodeDesaSlug(rawIdParam, initialDesaList);
  
  const [activeTab, setActiveTab] = useState<'publikasi' | 'profil' | 'potensi' | 'peta' | 'infografis'>('publikasi');
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [selectedInfographic, setSelectedInfographic] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  // Database Data States - Instant Synchronous Initialization (0ms Latency)
  const [desaList, setDesaList] = useState<Desa[]>(initialDesaList);
  const [kecamatanList, setKecamatanList] = useState<Kecamatan[]>(() => getKecamatanSync());
  const [publikasiList, setPublikasiList] = useState<Publikasi[]>(() => getPublikasiSync());
  const [potensiList, setPotensiList] = useState<Potensi[]>(() => getPotensiSync());
  const [infografisList, setInfografisList] = useState<Infografis[]>(() => getInfografisSync());
  const [demografiData, setDemografiData] = useState<DemografiDesa | null>(() => getDemografiSync(initialId));
  const [mataPencaharianData, setMataPencaharianData] = useState<MataPencaharianItem[]>(() => getMataPencaharianSync(initialId));

  // Filter year state for Publikasi tab
  const [filterTahunPublikasi, setFilterTahunPublikasi] = useState<string>('all');
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  // Filter & Pagination for Potensi tab (PDF Scalability)
  const [potensiFilter, setPotensiFilter] = useState<string>('all');
  const [potensiPage, setPotensiPage] = useState<number>(1);
  const POTENSI_PER_PAGE = 4;

  useEffect(() => {
    async function loadAllData() {
      const [d, k, pub, pot, info] = await Promise.all([
        getDesaList(),
        getKecamatan(),
        getPublikasi(),
        getPotensi(),
        getInfografis()
      ]);
      setDesaList(d);
      setKecamatanList(k);
      setPublikasiList(pub);
      setPotensiList(pot);
      setInfografisList(info);
    }
    loadAllData();
  }, []);

  // Decode ID from obfuscated slug or numeric param
  const id = useMemo(() => {
    return decodeDesaSlug(rawIdParam, desaList);
  }, [rawIdParam, desaList]);

  useEffect(() => {
    if (id) {
      async function loadDesaStats() {
        const [demo, mp] = await Promise.all([
          getDemografiByDesaId(id),
          getMataPencaharianByDesaId(id)
        ]);
        setDemografiData(demo);
        setMataPencaharianData(mp);
      }
      loadDesaStats();
    }
  }, [id]);

  // Find Village data
  const desa = useMemo(() => {
    return desaList.find(d => d.id === id);
  }, [desaList, id]);

  const kecamatanName = useMemo(() => {
    if (!desa) return '';
    return kecamatanList.find(k => k.id === desa.kecamatanId)?.nama || '';
  }, [desa, kecamatanList]);

  // Filter items for this village
  const rawPublikasi = useMemo(() => publikasiList.filter(p => p.desaId === id), [publikasiList, id]);
  
  // Available years for filter dropdown
  const publikasiYears = useMemo(() => {
    const years = Array.from(new Set(rawPublikasi.map(p => p.tahun.toString()))).sort().reverse();
    return ['all', ...years];
  }, [rawPublikasi]);

  // Filtered publikasi by year
  const publikasi = useMemo(() => {
    if (filterTahunPublikasi === 'all') return rawPublikasi;
    return rawPublikasi.filter(p => p.tahun.toString() === filterTahunPublikasi);
  }, [rawPublikasi, filterTahunPublikasi]);

  const rawPotensi = useMemo(() => potensiList.filter(p => p.desaId === id), [potensiList, id]);
  
  const filteredPotensi = useMemo(() => {
    if (potensiFilter === 'all') return rawPotensi;
    return rawPotensi.filter(p => p.kategori === potensiFilter);
  }, [rawPotensi, potensiFilter]);

  const totalPotensiPages = Math.ceil(filteredPotensi.length / POTENSI_PER_PAGE) || 1;

  const paginatedPotensi = useMemo(() => {
    const start = (potensiPage - 1) * POTENSI_PER_PAGE;
    return filteredPotensi.slice(start, start + POTENSI_PER_PAGE);
  }, [filteredPotensi, potensiPage]);

  const infografis = useMemo(() => infografisList.filter(i => i.desaId === id), [infografisList, id]);

  const handleDownloadPdf = (fileUrl: string | undefined, defaultFilename: string) => {
    if (!fileUrl || fileUrl === '#' || fileUrl.trim() === '') {
      alert('Dokumen PDF belum diunggah untuk desa ini.');
      return;
    }

    if (fileUrl.startsWith('data:')) {
      try {
        const arr = fileUrl.split(',');
        const mimeMatch = arr[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : 'application/pdf';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], { type: mime });
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = defaultFilename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      } catch (err) {
        console.error('Error downloading base64 PDF:', err);
        alert('Gagal mengunduh berkas PDF.');
      }
    } else {
      const a = document.createElement('a');
      a.href = fileUrl;
      a.download = defaultFilename;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleViewPdf = (fileUrl: string | undefined, defaultFilename: string = 'dokumen.pdf') => {
    if (!fileUrl || fileUrl === '#' || fileUrl.trim() === '') {
      alert('Dokumen PDF belum diunggah untuk desa ini.');
      return;
    }

    if (fileUrl.startsWith('data:')) {
      try {
        const arr = fileUrl.split(',');
        const mimeMatch = arr[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : 'application/pdf';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], { type: mime });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
      } catch (err) {
        console.error('Error viewing base64 PDF:', err);
        handleDownloadPdf(fileUrl, defaultFilename);
      }
    } else {
      window.open(fileUrl, '_blank');
    }
  };

  // Web share function
  const handleShareInfografis = async (title: string, imageUrl: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Infografis Statistik: ${title}`,
          url: window.location.href,
        });
      } catch {
        // Share cancelled or failed
      }
    } else {
      // Fallback copy link to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 3000);
      } catch {
        // Fallback copy failed
      }
    }
  };

  // Dynamic Chart Data per Village (Sebaran Dusun & Jenis Kelamin)
  const demographicData = useMemo(() => {
    if (demografiData && demografiData.dusunData && demografiData.dusunData.length > 0) {
      return demografiData.dusunData.map(item => ({
        dusun: item.dusun,
        'Laki-laki': item.lakiLaki,
        Perempuan: item.perempuan,
        Total: item.lakiLaki + item.perempuan
      }));
    }
    if (id === 1) { // Desa Penanggalan Barat
      return [
        { dusun: 'Dusun Pemancar', 'Laki-laki': 397, Perempuan: 395, Total: 792 },
        { dusun: 'Dusun Silak', 'Laki-laki': 387, Perempuan: 341, Total: 728 },
        { dusun: 'Dusun Gapa', 'Laki-laki': 150, Perempuan: 181, Total: 331 },
        { dusun: 'Dusun Nurul Iman', 'Laki-laki': 160, Perempuan: 182, Total: 342 }
      ];
    }
    return [
      { dusun: 'Dusun I', 'Laki-laki': 350, Perempuan: 340, Total: 690 },
      { dusun: 'Dusun II', 'Laki-laki': 280, Perempuan: 290, Total: 570 }
    ];
  }, [id, demografiData]);

  const demographicTotal = useMemo(() => {
    const totalLaki = demographicData.reduce((sum, item) => sum + item['Laki-laki'], 0);
    const totalPerempuan = demographicData.reduce((sum, item) => sum + item.Perempuan, 0);
    return {
      lakiLaki: totalLaki,
      perempuan: totalPerempuan,
      totalPenduduk: totalLaki + totalPerempuan
    };
  }, [demographicData]);

  const occupationData = useMemo(() => {
    if (mataPencaharianData && mataPencaharianData.length > 0) {
      return mataPencaharianData.map(mp => ({
        name: mp.nama,
        value: mp.persentase
      }));
    }
    if (id === 1) { // Penanggalan Barat
      return [{ name: 'Petani & Perkebunan', value: 40 }, { name: 'Pedagang / UMKM', value: 25 }, { name: 'PNS/TNI/Polri', value: 10 }, { name: 'Pekerja Jasa', value: 15 }, { name: 'Lainnya', value: 10 }];
    } else if (id === 2) { // Lae Bersih
      return [{ name: 'Petani Pangan', value: 55 }, { name: 'Pedagang', value: 20 }, { name: 'PNS/TNI/Polri', value: 10 }, { name: 'Pekerja Jasa', value: 10 }, { name: 'Lainnya', value: 5 }];
    } else if (id === 3) { // Sikelang
      return [{ name: 'Pekebun Sawit & Petani', value: 50 }, { name: 'Pedagang / UMKM', value: 20 }, { name: 'PNS/TNI/Polri', value: 10 }, { name: 'Pekerja Jasa', value: 12 }, { name: 'Lainnya', value: 8 }];
    }
    return [{ name: 'Petani', value: 45 }, { name: 'Pedagang', value: 20 }, { name: 'PNS/TNI/Polri', value: 10 }, { name: 'Pekerja Jasa', value: 15 }, { name: 'Lainnya', value: 10 }];
  }, [id, mataPencaharianData]);

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
            src={desa.fotoCover || 'https://picsum.photos/seed/desa-cover/800/500'}
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
              { id: 'peta', label: 'Peta Lokasi', icon: <MapPin className="w-4 h-4" /> },
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
                <div className="space-y-6">
                  {/* Filter Tahun Publikasi (PDF Requirement) */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass rounded-2xl p-4 border border-card-border">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-5 h-5 text-primary-color" />
                      <span className="font-bold text-foreground text-sm">Publikasi Desa Dalam Angka</span>
                      <span className="text-xs text-muted-text font-semibold">({publikasi.length} Dokumen)</span>
                    </div>
                    {publikasiYears.length > 2 && (
                      <div className="flex items-center space-x-2 text-xs w-full sm:w-auto">
                        <span className="text-muted-text font-semibold shrink-0">Filter Tahun:</span>
                        <select
                          value={filterTahunPublikasi}
                          onChange={e => setFilterTahunPublikasi(e.target.value)}
                          className="px-3 py-1.5 rounded-lg glass border border-card-border outline-none text-foreground font-semibold bg-background cursor-pointer text-xs"
                        >
                          <option value="all">Semua Tahun</option>
                          {publikasiYears.filter(y => y !== 'all').map(year => (
                            <option key={year} value={year}>Tahun {year}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {publikasi.length === 0 ? (
                    <div className="glass rounded-2xl p-10 text-center border border-card-border">
                      <BookOpen className="w-10 h-10 text-muted-text mx-auto mb-3" />
                      <p className="text-muted-text">Belum ada berkas publikasi yang diunggah untuk kriteria ini.</p>
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
                                onClick={() => handleViewPdf(pub.pdfUrl, `${pub.judul}.pdf`)}
                                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-primary-glow border border-primary-color/20 text-primary-color text-xs font-semibold hover:bg-primary-color hover:text-white transition-all duration-200"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Buka / Lihat PDF</span>
                              </button>
                              <button
                                onClick={() => handleDownloadPdf(pub.pdfUrl, `${pub.judul}.pdf`)}
                                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground text-xs font-semibold border border-card-border transition-all duration-200"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Unduh PDF</span>
                              </button>
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
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2 text-primary-color">
                            <Info className="w-5 h-5" />
                            <h3 className="font-bold text-lg">Profil Desa</h3>
                          </div>
                          {(!desa.profilFileUrl || desa.profilFileUrl === '#') && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-muted/20 text-muted-text">
                              PDF Belum Diunggah
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-text leading-relaxed">
                          {desa.profilAbstrak}
                        </p>
                      </div>
                      <div className="mt-6 pt-4 border-t border-card-border flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => handleViewPdf(desa.profilFileUrl)}
                          className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-primary-glow border border-primary-color/20 text-primary-color text-xs font-semibold hover:bg-primary-color hover:text-white transition-all duration-200"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Lihat PDF Online</span>
                        </button>
                        <button
                          onClick={() => handleDownloadPdf(desa.profilFileUrl, `Profil_${desa.nama}.pdf`)}
                          className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground text-xs font-semibold border border-card-border transition-all duration-200"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Unduh PDF</span>
                        </button>
                      </div>
                    </div>

                    {/* Monografi Desa */}
                    <div className="glass rounded-2xl p-6 border border-card-border flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2 text-primary-color">
                            <Layers className="w-5 h-5" />
                            <h3 className="font-bold text-lg">Monografi Desa</h3>
                          </div>
                          {(!desa.monografiFileUrl || desa.monografiFileUrl === '#') && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-muted/20 text-muted-text">
                              PDF Belum Diunggah
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-text leading-relaxed">
                          {desa.monografiAbstrak}
                        </p>
                      </div>
                      <div className="mt-6 pt-4 border-t border-card-border flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => handleViewPdf(desa.monografiFileUrl)}
                          className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-primary-glow border border-primary-color/20 text-primary-color text-xs font-semibold hover:bg-primary-color hover:text-white transition-all duration-200"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Lihat PDF Online</span>
                        </button>
                        <button
                          onClick={() => handleDownloadPdf(desa.monografiFileUrl, `Monografi_${desa.nama}.pdf`)}
                          className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground text-xs font-semibold border border-card-border transition-all duration-200"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Unduh PDF</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Visualizations (Recharts Charts) */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Chart 1: Demographics */}
                    <div className="glass rounded-2xl p-6 border border-card-border flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-foreground text-sm sm:text-base uppercase tracking-wider">
                            Demografi Penduduk per Dusun (Sebaran Laki-Laki & Perempuan)
                          </h4>
                        </div>
                        <div className="h-72 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={demographicData}>
                              <XAxis dataKey="dusun" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                              <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                              <Tooltip 
                                contentStyle={{ 
                                  background: 'var(--card)', 
                                  borderColor: 'var(--card-border)',
                                  borderRadius: '12px',
                                  color: 'var(--foreground)',
                                  boxShadow: 'var(--glass-shadow)'
                                }} 
                              />
                              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', color: 'var(--foreground)' }} />
                              <Bar dataKey="Laki-laki" fill="#00d2ff" radius={[4, 4, 0, 0]} />
                              <Bar dataKey="Perempuan" fill="#ec4899" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Table Summary per Dusun */}
                        <div className="mt-4 border-t border-card-border pt-3 overflow-x-auto">
                          <table className="w-full text-xs text-left">
                            <thead>
                              <tr className="border-b border-card-border text-muted-text font-bold uppercase tracking-wider">
                                <th className="pb-2">Dusun</th>
                                <th className="pb-2 text-right">Laki-laki</th>
                                <th className="pb-2 text-right">Perempuan</th>
                                <th className="pb-2 text-right">Total</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-card-border/40">
                              {demographicData.map((d, idx) => (
                                <tr key={idx} className="hover:bg-muted/10 transition-colors">
                                  <td className="py-1.5 font-semibold text-foreground">{d.dusun}</td>
                                  <td className="py-1.5 text-right font-medium text-cyan-400">{d['Laki-laki'].toLocaleString('id-ID')}</td>
                                  <td className="py-1.5 text-right font-medium text-pink-400">{d.Perempuan.toLocaleString('id-ID')}</td>
                                  <td className="py-1.5 text-right font-bold text-foreground">{d.Total.toLocaleString('id-ID')}</td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr className="border-t border-card-border text-foreground font-extrabold bg-muted/20">
                                <td className="py-2 px-1">Jumlah Total</td>
                                <td className="py-2 text-right text-cyan-400">{demographicTotal.lakiLaki.toLocaleString('id-ID')}</td>
                                <td className="py-2 text-right text-pink-400">{demographicTotal.perempuan.toLocaleString('id-ID')}</td>
                                <td className="py-2 text-right text-primary-color">{demographicTotal.totalPenduduk.toLocaleString('id-ID')}</td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
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
                                background: 'var(--card)', 
                                borderColor: 'var(--card-border)',
                                borderRadius: '12px',
                                color: 'var(--foreground)',
                                boxShadow: 'var(--glass-shadow)'
                              }} 
                            />
                            <Legend 
                              verticalAlign="bottom" 
                              height={36} 
                              iconType="circle"
                              wrapperStyle={{ fontSize: '11px', color: 'var(--foreground)' }}
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
                <div className="space-y-6">
                  {/* Category Filter & Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass rounded-2xl p-4 border border-card-border">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-primary-color" />
                      <span className="font-bold text-foreground text-sm">Potensi & Komoditas Unggulan</span>
                      <span className="text-xs text-muted-text font-semibold">({filteredPotensi.length} Data)</span>
                    </div>

                    {/* Category Filter Tabs */}
                    <div className="flex items-center space-x-1.5 overflow-x-auto text-xs w-full sm:w-auto">
                      {[
                        { id: 'all', label: 'Semua Kategori' },
                        { id: 'ekonomi', label: 'Ekonomi & UMKM' },
                        { id: 'wisata', label: 'Wisata' },
                        { id: 'investasi', label: 'Investasi' },
                      ].map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setPotensiFilter(cat.id);
                            setPotensiPage(1);
                          }}
                          className={`px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 ${
                            potensiFilter === cat.id
                              ? 'bg-primary-color text-white'
                              : 'glass text-muted-text hover:text-foreground'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {filteredPotensi.length === 0 ? (
                    <div className="glass rounded-2xl p-10 text-center border border-card-border">
                      <TrendingUp className="w-10 h-10 text-muted-text mx-auto mb-3" />
                      <p className="text-muted-text">Belum ada data potensi unggulan untuk kriteria ini.</p>
                    </div>
                  ) : (
                    <>
                      {/* Grid of Cards (2 cols) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {paginatedPotensi.map(pot => (
                          <div 
                            key={pot.id}
                            className="glass rounded-2xl p-6 border border-card-border flex flex-col sm:flex-row gap-5 hover:border-primary-color/40 hover:shadow-[0_8px_30px_rgba(0,210,255,0.08)] transition-all duration-300 justify-between"
                          >
                            <div className="flex flex-col justify-between flex-1">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-primary-glow text-primary-color border border-primary-color/20">
                                    {pot.kategori}
                                  </span>
                                  {pot.subKategori && (
                                    <span className="text-xs text-muted-text font-semibold">
                                      {pot.subKategori}
                                    </span>
                                  )}
                                </div>
                                <h3 className="text-lg font-extrabold text-foreground mt-2.5">
                                  {pot.nama}
                                </h3>
                                <p className="text-xs sm:text-sm text-muted-text mt-2 leading-relaxed line-clamp-4">
                                  {pot.deskripsi}
                                </p>
                              </div>
                              
                              {/* Video Trigger */}
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
                              <div className="relative w-full sm:w-36 h-36 bg-foreground/5 rounded-xl overflow-hidden shrink-0 border border-card-border">
                                <Image
                                  src={pot.fotoUrl}
                                  alt={pot.nama}
                                  fill
                                  className="object-cover"
                                  sizes="150px"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Pagination Controls (Shown when totalPages > 1) */}
                      {totalPotensiPages > 1 && (
                        <div className="flex items-center justify-between pt-4 border-t border-card-border">
                          <p className="text-xs text-muted-text font-semibold">
                            Halaman <span className="font-bold text-foreground">{potensiPage}</span> dari <span className="font-bold text-foreground">{totalPotensiPages}</span>
                          </p>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setPotensiPage(prev => Math.max(prev - 1, 1))}
                              disabled={potensiPage === 1}
                              className="p-2 rounded-xl glass border border-card-border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-glow hover:text-primary-color text-foreground transition-all"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setPotensiPage(prev => Math.min(prev + 1, totalPotensiPages))}
                              disabled={potensiPage === totalPotensiPages}
                              className="p-2 rounded-xl glass border border-card-border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-glow hover:text-primary-color text-foreground transition-all"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* TAB 4: PETA LOKASI DESA (Dedicated Tab) */}
              {activeTab === 'peta' && (
                <div className="space-y-6">
                  <div className="glass rounded-2xl p-6 border border-card-border space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-card-border pb-4">
                      <div>
                        <h3 className="font-extrabold text-xl text-foreground flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-primary-color" />
                          <span>Peta Lokasi Geografis {desa.nama}</span>
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-text mt-1">
                          Kecamatan {kecamatanName} • Koordinat: {desa.latitude}, {desa.longitude}
                        </p>
                      </div>

                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${desa.latitude},${desa.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-primary-color text-white font-bold text-xs hover:opacity-90 transition-all shadow-md shrink-0"
                      >
                        <span>Buka di Google Maps</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>

                    {/* Dedicated Leaflet Map Container */}
                    <MapDesa
                      desaList={[desa]}
                      kecamatanList={kecamatanList}
                      center={[desa.latitude || 2.6288, desa.longitude || 98.0062]}
                      zoom={14}
                      height="460px"
                    />
                  </div>
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
                              <button 
                                onClick={() => handleShareInfografis(info.judul, info.imageUrl)}
                                className="hover:text-primary-color flex items-center space-x-1 transition-colors"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                                <span>{copiedShare ? 'Tersalin!' : 'Bagikan'}</span>
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
              <span className="font-bold text-foreground text-sm sm:text-base">Pratinjau Dokumen PDF Online</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDownloadPdf(selectedPdf, 'dokumen-desa.pdf')}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-primary-glow border border-primary-color/30 text-primary-color text-xs font-bold hover:bg-primary-color hover:text-white transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh PDF</span>
                </button>
                <button 
                  onClick={() => setSelectedPdf(null)}
                  className="p-1.5 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
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
