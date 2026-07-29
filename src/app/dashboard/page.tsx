'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Building2,
  BookOpen,
  FileImage,
  TrendingUp,
  MapPin,
  ArrowRight,
  PieChart as PieIcon,
  Award
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
import {
  getDesaList,
  getKecamatan,
  getPublikasi,
  getPotensi,
  getInfografis,
  getDashboardStatsFromDb,
  getDesaListSync,
  getKecamatanSync,
  getPublikasiSync,
  getPotensiSync,
  getInfografisSync
} from '@/services/database';
import { Desa, Kecamatan, Publikasi, Potensi, Infografis } from '@/types';
import { encodeDesaSlug } from '@/lib/slug';

import { getAllDesa, getAllPublikasi, getAllPotensi, getAllInfografis, getKecamatanAll } from '@/data/adminStore';
import { mockDesa, mockKecamatan, mockPublikasi, mockPotensi, mockInfografis } from '@/data/mockData';

const COLORS = ['#00d2ff', '#0f62fe', '#10b981', '#f59e0b', '#8b5cf6'];

export default function DashboardPage() {
  const [desaList, setDesaList] = useState<Desa[]>(() => getDesaListSync());
  const [kecamatanList, setKecamatanList] = useState<Kecamatan[]>(() => getKecamatanSync());
  const [publikasiList, setPublikasiList] = useState<Publikasi[]>(() => getPublikasiSync());
  const [potensiList, setPotensiList] = useState<Potensi[]>(() => getPotensiSync());
  const [infografisList, setInfografisList] = useState<Infografis[]>(() => getInfografisSync());
  const [stats, setStats] = useState({
    totalDesa: desaList.length,
    totalPublikasi: publikasiList.length,
    totalInfografis: infografisList.length,
    totalPotensi: potensiList.length
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [d, k, pub, pot, info] = await Promise.all([
          getDesaList(),
          getKecamatan(),
          getPublikasi(),
          getPotensi(),
          getInfografis()
        ]);
        const desa = d && d.length > 0 ? d : (getAllDesa().length > 0 ? getAllDesa() : mockDesa);
        const kec = k && k.length > 0 ? k : (getKecamatanAll().length > 0 ? getKecamatanAll() : mockKecamatan);
        const publikasi = pub && pub.length > 0 ? pub : (getAllPublikasi().length > 0 ? getAllPublikasi() : mockPublikasi);
        const potensi = pot && pot.length > 0 ? pot : (getAllPotensi().length > 0 ? getAllPotensi() : mockPotensi);
        const infografis = info && info.length > 0 ? info : (getAllInfografis().length > 0 ? getAllInfografis() : mockInfografis);

        setDesaList(desa);
        setKecamatanList(kec);
        setPublikasiList(publikasi);
        setPotensiList(potensi);
        setInfografisList(infografis);
        setStats({
          totalDesa: desa.length,
          totalPublikasi: publikasi.length,
          totalInfografis: infografis.length,
          totalPotensi: potensi.length
        });
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        const desa = getAllDesa().length > 0 ? getAllDesa() : mockDesa;
        const kec = getKecamatanAll().length > 0 ? getKecamatanAll() : mockKecamatan;
        const publikasi = getAllPublikasi().length > 0 ? getAllPublikasi() : mockPublikasi;
        const potensi = getAllPotensi().length > 0 ? getAllPotensi() : mockPotensi;
        const infografis = getAllInfografis().length > 0 ? getAllInfografis() : mockInfografis;

        setDesaList(desa);
        setKecamatanList(kec);
        setPublikasiList(publikasi);
        setPotensiList(potensi);
        setInfografisList(infografis);
        setStats({
          totalDesa: desa.length,
          totalPublikasi: publikasi.length,
          totalInfografis: infografis.length,
          totalPotensi: potensi.length
        });
      }
    }
    loadData();
  }, []);

  // Breakdown desa per kecamatan
  const desaPerKecamatanData = kecamatanList.map(kec => {
    const count = desaList.filter(d => d.kecamatanId === kec.id).length;
    return { name: kec.nama, Jumlah: count };
  });

  // Breakdown potensi per kategori
  const potensiCategoryData = [
    { name: 'Ekonomi & UMKM', value: potensiList.filter(p => p.kategori === 'ekonomi').length },
    { name: 'Wisata & Alam', value: potensiList.filter(p => p.kategori === 'wisata').length },
    { name: 'Investasi & Produk', value: potensiList.filter(p => p.kategori === 'investasi').length }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-grid relative pb-20">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary-glow rounded-full blur-[100px] -z-10 pointer-events-none" />

        {/* Header Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
          <div className="border-b border-card-border pb-6">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Dashboard Statistik <span className="text-primary-color">Lintas Desa</span>
            </h1>
            <p className="text-muted-text mt-2 text-sm sm:text-base">
              Ringkasan komprehensif indikator pembangunan statistik seluruh desa binaan Desa Cantik di Kota Subulussalam.
            </p>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { label: 'Total Desa Binaan', val: stats.totalDesa, sub: 'Di 5 Kecamatan', icon: <Building2 className="w-5 h-5 text-primary-color" /> },
              { label: 'Publikasi Terbit', val: stats.totalPublikasi, sub: 'Desa Dalam Angka', icon: <BookOpen className="w-5 h-5 text-primary-color" /> },
              { label: 'Galeri Infografis', val: stats.totalInfografis, sub: 'Media Diseminasi', icon: <FileImage className="w-5 h-5 text-primary-color" /> },
              { label: 'Data Potensi', val: stats.totalPotensi, sub: 'Ekonomi & Wisata', icon: <TrendingUp className="w-5 h-5 text-primary-color" /> },
            ].map((st, i) => (
              <div key={i} className="glass rounded-2xl p-5 border border-card-border">
                <div className="p-2 rounded-xl bg-primary-glow border border-primary-color/10 w-fit mb-3">
                  {st.icon}
                </div>
                <h3 className="text-3xl font-extrabold text-foreground">{st.val}</h3>
                <p className="text-sm font-semibold text-foreground/90 mt-1">{st.label}</p>
                <p className="text-xs text-muted-text mt-0.5">{st.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Visualizations Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Chart 1: Desa per Kecamatan */}
            <div className="glass rounded-2xl p-6 border border-card-border">
              <h3 className="font-bold text-foreground mb-6 text-base uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary-color" />
                <span>Jumlah Desa Binaan per Kecamatan</span>
              </h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={desaPerKecamatanData}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'var(--card)', 
                        borderColor: 'var(--card-border)',
                        borderRadius: '12px',
                        color: 'var(--foreground)',
                        boxShadow: 'var(--glass-shadow)'
                      }} 
                    />
                    <Bar dataKey="Jumlah" fill="#00d2ff" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Potensi Distribution */}
            <div className="glass rounded-2xl p-6 border border-card-border">
              <h3 className="font-bold text-foreground mb-6 text-base uppercase tracking-wider flex items-center gap-2">
                <PieIcon className="w-5 h-5 text-primary-color" />
                <span>Proporsi Kategori Potensi Desa</span>
              </h3>
              <div className="h-72 w-full flex flex-col justify-center">
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie
                      data={potensiCategoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {potensiCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
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
        </section>

        {/* Matrix Table Completeness */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="glass rounded-2xl border border-card-border overflow-hidden p-6">
            <h3 className="font-bold text-foreground mb-4 text-lg flex items-center gap-2">
              <Award className="w-5 h-5 text-primary-color" />
              <span>Matriks Kelengkapan Diseminasi Data per Desa</span>
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-card-border bg-foreground/5 font-bold text-foreground">
                    <th className="p-3">Nama Desa</th>
                    <th className="p-3">Kecamatan</th>
                    <th className="p-3 text-center">Tahun Binaan</th>
                    <th className="p-3 text-center">Publikasi</th>
                    <th className="p-3 text-center">Potensi</th>
                    <th className="p-3 text-center">Infografis</th>
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border/50">
                  {desaList.map(desa => {
                    const pubCount = publikasiList.filter(p => p.desaId === desa.id).length;
                    const potCount = potensiList.filter(p => p.desaId === desa.id).length;
                    const infCount = infografisList.filter(i => i.desaId === desa.id).length;
                    const kecName = kecamatanList.find(k => k.id === desa.kecamatanId)?.nama || '-';

                    return (
                      <tr key={desa.id} className="hover:bg-foreground/5 transition-colors">
                        <td className="p-3 font-bold text-foreground">{desa.nama}</td>
                        <td className="p-3 text-muted-text">{kecName}</td>
                        <td className="p-3 text-center font-medium">{desa.tahunPembinaan}</td>
                        <td className="p-3 text-center">
                          <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 font-bold">
                            {pubCount} Doc
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold">
                            {potCount} Item
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 font-bold">
                            {infCount} Gambar
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <Link
                            href={`/desa/${encodeDesaSlug(desa.id, desa.nama)}`}
                            className="inline-flex items-center space-x-1 text-primary-color font-bold hover:underline"
                          >
                            <span>Buka</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
