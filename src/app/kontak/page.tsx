'use client';

import React, { useState } from 'react';
import { 
  Mail, 
  MapPin, 
  Phone, 
  Send, 
  Globe, 
  MessageSquare,
  CheckCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  Building2,
  FileText
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { createPesanKontak } from '@/services/database';

export default function Kontak() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createPesanKontak({
        nama: formData.name,
        email: formData.email,
        subjek: formData.subject,
        isi: formData.message
      });
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 6000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const pejabatList = [
    {
      jabatan: 'Kepala BPS Kota Subulussalam',
      nama: 'Adi Putra',
      periode: '2025 – Sekarang',
      lhkpn: 'Tersedia di PPID'
    },
    {
      jabatan: 'Kasubbag Umum',
      nama: 'Erni Lusiani',
      periode: 'Pejabat Struktural',
      lhkpn: '-'
    },
    {
      jabatan: 'Pejabat Pembuat Komitmen (PPK)',
      nama: 'Arma Juwita',
      periode: 'Pengelola Anggaran',
      lhkpn: 'Tersedia di PPID'
    },
    {
      jabatan: 'Pejabat Pengadaan Barang & Jasa',
      nama: 'Suciarti Pertiwi',
      periode: 'Pengadaan',
      lhkpn: 'Tersedia di PPID'
    },
    {
      jabatan: 'Bendahara',
      nama: 'Supriadi Hamdani Berasa',
      periode: 'Keuangan',
      lhkpn: 'Tersedia di PPID'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-grid relative pb-20">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-glow rounded-full blur-[120px] -z-10 pointer-events-none" />
        <div className="absolute top-2/3 left-10 w-72 h-72 bg-secondary-glow rounded-full blur-[100px] -z-10 pointer-events-none" />

        {/* Hero Header */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-glow border border-primary-color/20 text-xs font-semibold text-primary-color mb-4">
            <Building2 className="w-3.5 h-3.5" />
            <span>Badan Pusat Statistik Kota Subulussalam • Satker 1175</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Hubungi <span className="bg-gradient-to-r from-primary-color to-secondary-color bg-clip-text text-transparent">BPS Kota Subulussalam</span>
          </h1>
          <p className="text-muted-text max-w-3xl mx-auto text-sm sm:text-base mt-3 leading-relaxed">
            Pusat Pelayanan Statistik Terpadu (PST) dan Pendampingan Program Desa Cinta Statistik (Desa Cantik). Kami siap melayani permohonan data, konsultasi statistik, serta keterbukaan informasi publik bagi instansi, perangkat desa, dan masyarakat luas.
          </p>
        </section>

        {/* Main Grid: Kontak & Form */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Info Cards Column (Left) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Kontak Resmi */}
              <div className="glass rounded-3xl p-6 sm:p-8 border border-card-border space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-card-border">
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary-color" />
                    <span>Saluran Layanan Resmi</span>
                  </h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                    Kode 1175
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary-glow border border-primary-color/10 shrink-0">
                      <MapPin className="w-5 h-5 text-primary-color" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">Alamat Kantor</h4>
                      <p className="text-xs sm:text-sm text-muted-text mt-1 leading-relaxed">
                        Jalan Raja Tua, Kompleks Perkantoran Walikota Subulussalam, Desa Lae Oram, Kec. Simpang Kiri, Kota Subulussalam, Aceh 24782
                      </p>
                    </div>
                  </div>

                  {/* WhatsApp Resmi */}
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary-glow border border-primary-color/10 shrink-0">
                      <Phone className="w-5 h-5 text-primary-color" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground text-sm">Layanan WhatsApp (PST)</h4>
                      <p className="text-xs sm:text-sm text-muted-text mt-1">
                        +62 851-6594-6964
                      </p>
                      <a 
                        href="https://wa.me/6285165946964" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold mt-1 transition-colors"
                      >
                        <span>Chat via WhatsApp Langsung</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary-glow border border-primary-color/10 shrink-0">
                      <Mail className="w-5 h-5 text-primary-color" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">E-mail Resmi</h4>
                      <p className="text-xs sm:text-sm text-muted-text mt-1">
                        <a 
                          href="mailto:bps1175@bps.go.id"
                          className="hover:text-primary-color transition-colors underline decoration-primary-color/40"
                        >
                          bps1175@bps.go.id
                        </a>
                      </p>
                      <span className="text-[11px] text-muted-text/80">Layanan konsultasi & permohonan data BPS 1175</span>
                    </div>
                  </div>

                  {/* Web & PPID */}
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary-glow border border-primary-color/10 shrink-0">
                      <Globe className="w-5 h-5 text-primary-color" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-foreground text-sm">Portal & Publikasi</h4>
                      <div className="text-xs sm:text-sm">
                        <a 
                          href="https://subulussalamkota.bps.go.id" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary-color hover:underline flex items-center gap-1"
                        >
                          <span>subulussalamkota.bps.go.id</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <div className="text-xs">
                        <a 
                          href="https://ppid.bps.go.id/app/konten/1175/Profil-BPS.html" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-muted-text hover:text-primary-color transition-colors flex items-center gap-1 mt-0.5"
                        >
                          <span>Portal PPID BPS Subulussalam</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Jam Operasional PST */}
              <div className="glass rounded-3xl p-6 border border-card-border space-y-4">
                <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary-color" />
                  <span>Jam Pelayanan Statistik Terpadu (PST)</span>
                </h3>
                <div className="space-y-2 text-xs text-muted-text">
                  <div className="flex justify-between py-1 border-b border-card-border/50">
                    <span>Senin – Kamis</span>
                    <span className="font-semibold text-foreground">08.00 – 15.30 WIB</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-card-border/50">
                    <span>Jumat</span>
                    <span className="font-semibold text-foreground">08.00 – 16.00 WIB</span>
                  </div>
                  <div className="flex justify-between py-1 text-muted-text/80">
                    <span>Istirahat Siang</span>
                    <span>12.00 – 13.30 WIB (Jumat: s/d 14.00)</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Form Column (Right) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="glass rounded-3xl p-6 sm:p-8 border border-card-border">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-foreground">Kirim Pesan / Pengaduan / Konsultasi</h2>
                  <p className="text-xs sm:text-sm text-muted-text mt-1">
                    Ajukan pertanyaan seputar data Desa Cantik, pembinaan statistik desa, atau permohonan informasi kepada tim BPS Kota Subulussalam.
                  </p>
                </div>
                
                {isSubmitted ? (
                  <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center flex flex-col items-center">
                    <CheckCircle className="w-14 h-14 text-emerald-400 mb-3" />
                    <h3 className="text-lg font-bold text-foreground">Pesan Berhasil Terkirim</h3>
                    <p className="text-xs sm:text-sm text-muted-text mt-2 max-w-md">
                      Terima kasih atas pesan yang Anda sampaikan. Petugas BPS Kota Subulussalam akan segera menindaklanjuti dan membalas melalui email atau WhatsApp.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground/95">Nama Lengkap *</label>
                        <input
                          type="text"
                          name="name"
                          required
                          placeholder="Masukkan nama lengkap"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-background/50 focus:border-primary-color focus:ring-1 focus:ring-primary-color outline-none text-sm transition-all duration-200"
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground/95">Alamat Email *</label>
                        <input
                          type="email"
                          name="email"
                          required
                          placeholder="contoh@email.com"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-background/50 focus:border-primary-color focus:ring-1 focus:ring-primary-color outline-none text-sm transition-all duration-200"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground/95">Subjek / Perihal *</label>
                      <input
                        type="text"
                        name="subject"
                        required
                        placeholder="Contoh: Permohonan Data Desa / Pertanyaan Pembinaan Desa Cantik"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-background/50 focus:border-primary-color focus:ring-1 focus:ring-primary-color outline-none text-sm transition-all duration-200"
                      />
                    </div>

                    {/* Message */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground/95">Isi Pesan / Rincian Kebutuhan *</label>
                      <textarea
                        name="message"
                        required
                        rows={5}
                        placeholder="Tuliskan pesan, rincian data yang dibutuhkan, atau nama desa yang bersangkutan..."
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-background/50 focus:border-primary-color focus:ring-1 focus:ring-primary-color outline-none text-sm transition-all duration-200 resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center justify-center space-x-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-color to-secondary-color text-white font-semibold hover:opacity-95 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-all duration-200 text-sm mt-4 shadow-[0_0_20px_var(--primary-glow)]"
                    >
                      {isSubmitting ? (
                        <span>Mengirimkan Pesan...</span>
                      ) : (
                        <>
                          <span>Kirim Pesan Sekarang</span>
                          <Send className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Lokasi Peta (Google Maps Embed) */}
              <div className="glass rounded-3xl p-6 border border-card-border overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary-color" />
                    <span>Lokasi Kantor BPS Kota Subulussalam</span>
                  </h3>
                  <a
                    href="https://maps.google.com/?q=Badan+Pusat+Statistik+Kota+Subulussalam"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary-color hover:underline flex items-center gap-1"
                  >
                    <span>Buka di Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="w-full h-56 rounded-2xl overflow-hidden border border-card-border bg-card-bg">
                  <iframe
                    title="Peta Kantor BPS Kota Subulussalam"
                    src="https://www.google.com/maps?q=Badan+Pusat+Statistik+Kota+Subulussalam,+Jalan+Raja+Tua,+Lae+Oram,+Simpang+Kiri,+Kota+Subulussalam&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* Section Profil Pejabat BPS Kota Subulussalam (PPID 1175) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="glass rounded-3xl p-6 sm:p-8 border border-card-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-card-border">
              <div>
                <div className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-primary-color" />
                  <h3 className="text-xl font-bold text-foreground">Struktur & Pejabat BPS Kota Subulussalam</h3>
                </div>
                <p className="text-xs sm:text-sm text-muted-text mt-1">
                  Berdasarkan Peraturan Badan Pusat Statistik Nomor 5 Tahun 2023 (Sumber: PPID BPS 1175).
                </p>
              </div>
              <a
                href="https://ppid.bps.go.id/app/konten/1175/Profil-BPS.html#pills-8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-primary-color/20 bg-primary-glow text-primary-color text-xs font-semibold hover:bg-primary-glow/80 transition-colors w-fit"
              >
                <span>Lihat Profil Lengkap di PPID</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pejabatList.map((pejabat, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 rounded-2xl border transition-all duration-200 ${
                    idx === 0 
                      ? 'bg-primary-glow/30 border-primary-color/30 sm:col-span-2 lg:col-span-1' 
                      : 'bg-card-bg/50 border-card-border hover:border-primary-color/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-medium text-muted-text uppercase tracking-wider block">
                        {pejabat.jabatan}
                      </span>
                      <h4 className="text-base font-bold text-foreground mt-0.5">
                        {pejabat.nama}
                      </h4>
                      <p className="text-xs text-muted-text/90 mt-1">
                        {pejabat.periode}
                      </p>
                    </div>
                    {idx === 0 && (
                      <span className="p-2 rounded-xl bg-primary-color/20 text-primary-color shrink-0">
                        <ShieldCheck className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Visi BPS */}
            <div className="mt-6 p-4 rounded-2xl bg-background/40 border border-card-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary-color shrink-0" />
                <span className="text-muted-text">
                  <strong className="text-foreground">Visi BPS 2025–2029:</strong> &ldquo;Lembaga yang Independen, Tepercaya, dan Berperan Aktif dalam Mendukung Perumusan Kebijakan Berbasis Data Bersama Indonesia Maju Menuju Indonesia Emas 2045&rdquo;
                </span>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
