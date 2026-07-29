'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Building2, BookOpen, FileImage, TrendingUp,
  Plus, Pencil, Trash2, LogOut, ShieldCheck,
  RefreshCw, Search, ChevronDown, ChevronUp, AlertTriangle, MapPin, BarChart3
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AdminModal from '@/components/AdminModal';
import LocationPickerModal from '@/components/LocationPickerModal';
import {
  getAllDesa, createDesa, updateDesa, deleteDesa,
  getAllPublikasi, createPublikasi, updatePublikasi, deletePublikasi,
  getAllPotensi, createPotensi, updatePotensi, deletePotensi,
  getAllInfografis, createInfografis, updateInfografis, deleteInfografis,
  getKecamatanAll, resetStore,
} from '@/data/adminStore';
import {
  getDemografiByDesaId,
  saveDemografiByDesaId,
  getMataPencaharianByDesaId,
  saveMataPencaharianByDesaId,
} from '@/services/database';
import { Desa, Publikasi, Potensi, Infografis, Kecamatan, DemografiDesa, MataPencaharianItem } from '@/types';
import FileUploadInput from '@/components/FileUploadInput';

type Tab = 'desa' | 'publikasi' | 'potensi' | 'infografis';

// ---- Input field helper ----
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5 text-foreground/70">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-3 py-2.5 rounded-xl bg-card border border-card-border focus:border-primary-color focus:ring-2 focus:ring-primary-color/20 outline-none transition-all text-foreground text-sm placeholder:text-muted-text shadow-sm";
const textareaCls = inputCls + " resize-none";

// ===== DESA FORM =====
function DesaForm({
  initial, kecamatan, onSave, onCancel,
}: {
  initial?: Partial<Desa>;
  kecamatan: Kecamatan[];
  onSave: (data: Omit<Desa, 'id'>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    nama: initial?.nama || '',
    kecamatanId: initial?.kecamatanId || kecamatan[0]?.id || 1,
    tahunPembinaan: initial?.tahunPembinaan || new Date().getFullYear(),
    fotoCover: initial?.fotoCover || '',
    profilAbstrak: initial?.profilAbstrak || '',
    profilFileUrl: initial?.profilFileUrl || '#',
    monografiAbstrak: initial?.monografiAbstrak || '',
    monografiFileUrl: initial?.monografiFileUrl || '#',
    latitude: initial?.latitude || 0,
    longitude: initial?.longitude || 0,
  });
  const [isMapPickerOpen, setIsMapPickerOpen] = useState(false);
  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="space-y-4">
      <Field label="Nama Desa" required>
        <input className={inputCls} value={form.nama} onChange={e => set('nama', e.target.value)} placeholder="Desa Contoh" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Kecamatan" required>
          <select className={inputCls} value={form.kecamatanId} onChange={e => set('kecamatanId', Number(e.target.value))}>
            {kecamatan.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
          </select>
        </Field>
        <Field label="Tahun Pembinaan" required>
          <input type="number" className={inputCls} value={form.tahunPembinaan} onChange={e => set('tahunPembinaan', Number(e.target.value))} />
        </Field>
      </div>
      <FileUploadInput
        label="Foto Cover Desa"
        value={form.fotoCover}
        onChange={(url) => set('fotoCover', url)}
        accept="image"
        bucket="media_desa"
        placeholder="Upload berkas foto cover desa atau masukan URL https://..."
      />
      <Field label="Abstrak Profil" required>
        <textarea className={textareaCls} rows={3} value={form.profilAbstrak} onChange={e => set('profilAbstrak', e.target.value)} />
      </Field>
      <Field label="Abstrak Monografi">
        <textarea className={textareaCls} rows={3} value={form.monografiAbstrak} onChange={e => set('monografiAbstrak', e.target.value)} />
      </Field>
      
      {/* Coordinate Picker Section */}
      <div className="p-3.5 rounded-2xl bg-foreground/[0.02] border border-card-border space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-primary-color" />
            Titik Lokasi Koordinat (Peta)
          </label>
          <button
            type="button"
            onClick={() => setIsMapPickerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-color/10 border border-primary-color/30 text-primary-color text-xs font-semibold hover:bg-primary-color hover:text-white transition-all"
          >
            <MapPin className="w-3.5 h-3.5" />
            Pilih di Peta
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Latitude">
            <input type="number" step="any" className={inputCls} value={form.latitude} onChange={e => set('latitude', Number(e.target.value))} />
          </Field>
          <Field label="Longitude">
            <input type="number" step="any" className={inputCls} value={form.longitude} onChange={e => set('longitude', Number(e.target.value))} />
          </Field>
        </div>
      </div>

      <LocationPickerModal
        isOpen={isMapPickerOpen}
        onClose={() => setIsMapPickerOpen(false)}
        initialLat={form.latitude}
        initialLng={form.longitude}
        onConfirm={(lat, lng) => {
          setForm(f => ({ ...f, latitude: lat, longitude: lng }));
        }}
      />

      <div className="flex gap-3 pt-2">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-card-border text-sm font-semibold hover:bg-foreground/5 transition-colors">Batal</button>
        <button
          onClick={() => onSave(form)}
          className="flex-1 py-2.5 rounded-xl bg-primary-color text-white text-sm font-semibold hover:opacity-90 transition-all shadow-[0_0_15px_var(--primary-glow)]"
        >Simpan</button>
      </div>
    </div>
  );
}

// ===== STATISTIK DESA FORM =====
function BpsDesaStatistikForm({ desaId, desaNama, onSaved, onCancel }: { desaId: number; desaNama: string; onSaved: () => void; onCancel: () => void }) {
  const [demografi, setDemografi] = useState<DemografiDesa>({
    desaId,
    umur0_14: 0,
    umur15_29: 0,
    umur30_44: 0,
    umur45_59: 0,
    umur60Plus: 0,
  });
  const [mataPencaharian, setMataPencaharian] = useState<MataPencaharianItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [demo, mp] = await Promise.all([
        getDemografiByDesaId(desaId),
        getMataPencaharianByDesaId(desaId),
      ]);
      setDemografi(demo);
      setMataPencaharian(mp);
      setLoading(false);
    }
    loadData();
  }, [desaId]);

  const handleSave = async () => {
    await Promise.all([
      saveDemografiByDesaId(desaId, demografi),
      saveMataPencaharianByDesaId(desaId, mataPencaharian),
    ]);
    onSaved();
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm font-semibold text-muted-text">Memuat Data Statistik...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-card-border pb-3">
        <h3 className="font-bold text-sm text-foreground">Statistik Kependudukan: <span className="text-primary-color">{desaNama}</span></h3>
        <p className="text-xs text-muted-text mt-0.5">Kelola angka demografi dan persentase mata pencaharian desa ini.</p>
      </div>

      {/* Section 1: Demografi */}
      <div className="space-y-3">
        <h4 className="font-bold text-xs uppercase tracking-wider text-primary-color">1. Kelompok Umur (Jumlah Jiwa)</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Field label="0 - 14 Thn">
            <input type="number" className={inputCls} value={demografi.umur0_14} onChange={e => setDemografi({ ...demografi, umur0_14: Number(e.target.value) })} />
          </Field>
          <Field label="15 - 29 Thn">
            <input type="number" className={inputCls} value={demografi.umur15_29} onChange={e => setDemografi({ ...demografi, umur15_29: Number(e.target.value) })} />
          </Field>
          <Field label="30 - 44 Thn">
            <input type="number" className={inputCls} value={demografi.umur30_44} onChange={e => setDemografi({ ...demografi, umur30_44: Number(e.target.value) })} />
          </Field>
          <Field label="45 - 59 Thn">
            <input type="number" className={inputCls} value={demografi.umur45_59} onChange={e => setDemografi({ ...demografi, umur45_59: Number(e.target.value) })} />
          </Field>
          <Field label="60+ Thn">
            <input type="number" className={inputCls} value={demografi.umur60Plus} onChange={e => setDemografi({ ...demografi, umur60Plus: Number(e.target.value) })} />
          </Field>
        </div>
      </div>

      {/* Section 2: Mata Pencaharian */}
      <div className="space-y-3 pt-3 border-t border-card-border">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-xs uppercase tracking-wider text-primary-color">2. Mata Pencaharian (%)</h4>
          <button
            type="button"
            onClick={() => setMataPencaharian([...mataPencaharian, { desaId, nama: '', persentase: 0 }])}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary-glow text-primary-color text-xs font-bold hover:bg-primary-color hover:text-white transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Pekerjaan</span>
          </button>
        </div>

        <div className="space-y-2.5 max-h-60 overflow-y-auto no-scrollbar pr-1">
          {mataPencaharian.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                className={inputCls}
                placeholder="Nama Pekerjaan..."
                value={item.nama}
                onChange={e => {
                  const next = [...mataPencaharian];
                  next[idx].nama = e.target.value;
                  setMataPencaharian(next);
                }}
              />
              <div className="w-28 flex items-center gap-1">
                <input
                  type="number"
                  step="any"
                  className={inputCls}
                  value={item.persentase}
                  onChange={e => {
                    const next = [...mataPencaharian];
                    next[idx].persentase = Number(e.target.value);
                    setMataPencaharian(next);
                  }}
                />
                <span className="text-xs font-bold text-muted-text">%</span>
              </div>
              <button
                type="button"
                onClick={() => setMataPencaharian(mataPencaharian.filter((_, i) => i !== idx))}
                className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {mataPencaharian.length === 0 && (
            <p className="text-xs text-muted-text text-center py-2">Belum ada data mata pencaharian.</p>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-2 border-t border-card-border">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-card-border text-sm font-semibold hover:bg-foreground/5 transition-colors">Batal</button>
        <button
          onClick={handleSave}
          className="flex-1 py-2.5 rounded-xl bg-primary-color text-white text-sm font-semibold hover:opacity-90 transition-all shadow-[0_0_15px_var(--primary-glow)]"
        >Simpan Statistik</button>
      </div>
    </div>
  );
}

// ===== PUBLIKASI FORM =====
function PublikasiForm({
  initial, desa, onSave, onCancel,
}: {
  initial?: Partial<Publikasi>;
  desa: Desa[];
  onSave: (data: Omit<Publikasi, 'id'>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    desaId: initial?.desaId || desa[0]?.id || 1,
    judul: initial?.judul || '',
    tahun: initial?.tahun || new Date().getFullYear(),
    ringkasan: initial?.ringkasan || '',
    coverUrl: initial?.coverUrl || '',
    pdfUrl: initial?.pdfUrl || '#',
  });
  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Desa" required>
          <select className={inputCls} value={form.desaId} onChange={e => set('desaId', Number(e.target.value))}>
            {desa.map(d => <option key={d.id} value={d.id}>{d.nama}</option>)}
          </select>
        </Field>
        <Field label="Tahun" required>
          <input type="number" className={inputCls} value={form.tahun} onChange={e => set('tahun', Number(e.target.value))} />
        </Field>
      </div>
      <Field label="Judul Publikasi" required>
        <input className={inputCls} value={form.judul} onChange={e => set('judul', e.target.value)} placeholder="Nama Desa Dalam Angka 2026" />
      </Field>
      <Field label="Ringkasan">
        <textarea className={textareaCls} rows={3} value={form.ringkasan} onChange={e => set('ringkasan', e.target.value)} />
      </Field>
      <FileUploadInput
        label="Cover Buku Publikasi"
        value={form.coverUrl}
        onChange={(url) => set('coverUrl', url)}
        accept="image"
        bucket="media_desa"
        placeholder="Upload berkas foto cover atau masukan URL https://..."
      />
      <FileUploadInput
        label="Dokumen PDF Publikasi"
        value={form.pdfUrl}
        onChange={(url) => set('pdfUrl', url)}
        accept="pdf"
        bucket="publikasi_pdf"
        placeholder="Upload berkas PDF atau masukan URL https://..."
      />
      <div className="flex gap-3 pt-2">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-card-border text-sm font-semibold hover:bg-foreground/5 transition-colors">Batal</button>
        <button onClick={() => onSave(form)} className="flex-1 py-2.5 rounded-xl bg-primary-color text-white text-sm font-semibold hover:opacity-90 transition-all shadow-[0_0_15px_var(--primary-glow)]">Simpan</button>
      </div>
    </div>
  );
}

// ===== POTENSI FORM =====
function PotensiForm({
  initial, desa, onSave, onCancel,
}: {
  initial?: Partial<Potensi>;
  desa: Desa[];
  onSave: (data: Omit<Potensi, 'id'>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    desaId: initial?.desaId || desa[0]?.id || 1,
    kategori: initial?.kategori || 'ekonomi' as 'ekonomi' | 'wisata' | 'investasi',
    subKategori: initial?.subKategori || '',
    nama: initial?.nama || '',
    deskripsi: initial?.deskripsi || '',
    fotoUrl: initial?.fotoUrl || '',
    videoUrl: initial?.videoUrl || '',
  });
  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Desa" required>
          <select className={inputCls} value={form.desaId} onChange={e => set('desaId', Number(e.target.value))}>
            {desa.map(d => <option key={d.id} value={d.id}>{d.nama}</option>)}
          </select>
        </Field>
        <Field label="Kategori" required>
          <select className={inputCls} value={form.kategori} onChange={e => set('kategori', e.target.value as 'ekonomi' | 'wisata' | 'investasi')}>
            <option value="ekonomi">Ekonomi</option>
            <option value="wisata">Wisata</option>
            <option value="investasi">Investasi</option>
          </select>
        </Field>
      </div>
      <Field label="Sub Kategori" required>
        <input className={inputCls} value={form.subKategori} onChange={e => set('subKategori', e.target.value)} placeholder="UMKM, Pertanian, dll." />
      </Field>
      <Field label="Nama Potensi" required>
        <input className={inputCls} value={form.nama} onChange={e => set('nama', e.target.value)} placeholder="Nama potensi / destinasi" />
      </Field>
      <Field label="Deskripsi">
        <textarea className={textareaCls} rows={3} value={form.deskripsi} onChange={e => set('deskripsi', e.target.value)} />
      </Field>
      <Field label="URL Foto">
        <input className={inputCls} value={form.fotoUrl} onChange={e => set('fotoUrl', e.target.value)} placeholder="https://..." />
      </Field>
      <Field label="URL Video (opsional)">
        <input className={inputCls} value={form.videoUrl} onChange={e => set('videoUrl', e.target.value)} placeholder="https://..." />
      </Field>
      <div className="flex gap-3 pt-2">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-card-border text-sm font-semibold hover:bg-foreground/5 transition-colors">Batal</button>
        <button onClick={() => onSave(form)} className="flex-1 py-2.5 rounded-xl bg-primary-color text-white text-sm font-semibold hover:opacity-90 transition-all shadow-[0_0_15px_var(--primary-glow)]">Simpan</button>
      </div>
    </div>
  );
}

// ===== INFOGRAFIS FORM =====
function InfografisForm({
  initial, desa, onSave, onCancel,
}: {
  initial?: Partial<Infografis>;
  desa: Desa[];
  onSave: (data: Omit<Infografis, 'id'>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    desaId: initial?.desaId || desa[0]?.id || 1,
    judul: initial?.judul || '',
    imageUrl: initial?.imageUrl || '',
    pdfUrl: initial?.pdfUrl || '#',
  });
  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div className="space-y-4">
      <Field label="Desa" required>
        <select className={inputCls} value={form.desaId} onChange={e => set('desaId', Number(e.target.value))}>
          {desa.map(d => <option key={d.id} value={d.id}>{d.nama}</option>)}
        </select>
      </Field>
      <Field label="Judul Infografis" required>
        <input className={inputCls} value={form.judul} onChange={e => set('judul', e.target.value)} placeholder="Infografis Demografi ..." />
      </Field>
      <Field label="URL Gambar" required>
        <input className={inputCls} value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} placeholder="https://..." />
      </Field>
      <Field label="URL PDF">
        <input className={inputCls} value={form.pdfUrl} onChange={e => set('pdfUrl', e.target.value)} placeholder="https://..." />
      </Field>
      <div className="flex gap-3 pt-2">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-card-border text-sm font-semibold hover:bg-foreground/5 transition-colors">Batal</button>
        <button onClick={() => onSave(form)} className="flex-1 py-2.5 rounded-xl bg-primary-color text-white text-sm font-semibold hover:opacity-90 transition-all shadow-[0_0_15px_var(--primary-glow)]">Simpan</button>
      </div>
    </div>
  );
}

// ===== CONFIRM DELETE =====
function ConfirmDelete({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="text-center space-y-4">
      <div className="flex justify-center">
        <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 text-red-400" />
        </div>
      </div>
      <div>
        <p className="text-sm text-foreground/80">Apakah Anda yakin ingin menghapus</p>
        <p className="font-bold text-foreground mt-1 text-sm">"{name}"?</p>
        <p className="text-xs text-muted-text mt-2">Tindakan ini tidak dapat dibatalkan.</p>
      </div>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-card-border text-sm font-semibold hover:bg-foreground/5 transition-colors">Batal</button>
        <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all">Hapus</button>
      </div>
    </div>
  );
}

// ===== MAIN BPS ADMIN PAGE =====
export default function AdminBpsPage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>('desa');
  const [search, setSearch] = useState('');
  const [desa, setDesa] = useState<Desa[]>([]);
  const [publikasi, setPublikasi] = useState<Publikasi[]>([]);
  const [potensi, setPotensi] = useState<Potensi[]>([]);
  const [infografis, setInfografis] = useState<Infografis[]>([]);
  const [kecamatan, setKecamatan] = useState<Kecamatan[]>([]);

  const [modal, setModal] = useState<null | { type: string; item?: unknown }>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const refresh = useCallback(() => {
    setDesa(getAllDesa());
    setPublikasi(getAllPublikasi());
    setPotensi(getAllPotensi());
    setInfografis(getAllInfografis());
    setKecamatan(getKecamatanAll());
  }, []);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'bps')) {
      router.replace('/login');
    } else if (user) {
      refresh();
    }
  }, [user, isLoading, router, refresh]);

  if (isLoading || !user) return null;

  const getDesaNama = (id: number) => desa.find(d => d.id === id)?.nama || '-';

  // filter
  const q = search.toLowerCase();
  const filteredDesa = desa.filter(d => d.nama.toLowerCase().includes(q));
  const filteredPub = publikasi.filter(p => p.judul.toLowerCase().includes(q) || getDesaNama(p.desaId).toLowerCase().includes(q));
  const filteredPotensi = potensi.filter(p => p.nama.toLowerCase().includes(q) || getDesaNama(p.desaId).toLowerCase().includes(q));
  const filteredInfografis = infografis.filter(i => i.judul.toLowerCase().includes(q) || getDesaNama(i.desaId).toLowerCase().includes(q));

  const tabs: { key: Tab; label: string; icon: React.ReactNode; count: number }[] = [
    { key: 'desa', label: 'Desa', icon: <Building2 className="w-4 h-4" />, count: desa.length },
    { key: 'publikasi', label: 'Publikasi Desa', icon: <BookOpen className="w-4 h-4" />, count: publikasi.length },
    { key: 'potensi', label: 'Potensi', icon: <TrendingUp className="w-4 h-4" />, count: potensi.length },
    { key: 'infografis', label: 'Infografis', icon: <FileImage className="w-4 h-4" />, count: infografis.length },
  ];

  const handleReset = () => {
    resetStore();
    refresh();
    showToast('Data berhasil direset ke data awal.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-grid">
      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl bg-primary-color text-white text-sm font-semibold shadow-lg"
        >
          {toast}
        </motion.div>
      )}

      {/* Header */}
      <header className="glass border-b border-card-border px-4 sm:px-8 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary-glow border border-primary-color/20">
            <ShieldCheck className="w-5 h-5 text-primary-color" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm sm:text-base">Admin BPS</h1>
            <p className="text-xs text-muted-text">BPS Kota Subulussalam — Desa Cantik</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            title="Reset ke data awal"
            className="p-2 rounded-xl text-muted-text hover:text-foreground hover:bg-foreground/5 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => { logout(); router.replace('/login'); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-muted-text hover:text-foreground hover:bg-foreground/5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => { setActiveTab(t.key); setSearch(''); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === t.key
                  ? 'bg-primary-color text-white shadow-[0_0_15px_var(--primary-glow)]'
                  : 'glass border border-card-border text-muted-text hover:text-foreground hover:border-primary-color/30'
              }`}
            >
              {t.icon}
              {t.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === t.key ? 'bg-white/20' : 'bg-foreground/10'}`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search + Add bar */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari data..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-background border border-card-border focus:border-primary-color focus:ring-2 focus:ring-primary-color/20 outline-none text-sm text-foreground placeholder:text-muted-text transition-all"
            />
          </div>
          <button
            onClick={() => setModal({ type: `add_${activeTab}` })}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-color text-white text-sm font-semibold hover:opacity-90 transition-all shadow-[0_0_15px_var(--primary-glow)] whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Tambah
          </button>
        </div>

        {/* Table */}
        <div className="glass rounded-2xl border border-card-border overflow-hidden">
          {/* DESA TABLE */}
          {activeTab === 'desa' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-card-border text-left text-xs text-muted-text uppercase tracking-wider">
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Nama Desa</th>
                    <th className="px-4 py-3">Kecamatan</th>
                    <th className="px-4 py-3">Th. Pembinaan</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDesa.map((d, i) => (
                    <tr key={d.id} className={`border-b border-card-border hover:bg-foreground/3 transition-colors ${i % 2 === 0 ? '' : 'bg-foreground/[0.02]'}`}>
                      <td className="px-4 py-3 text-muted-text font-mono text-xs">{d.id}</td>
                      <td className="px-4 py-3 font-semibold">{d.nama}</td>
                      <td className="px-4 py-3 text-muted-text">{kecamatan.find(k => k.id === d.kecamatanId)?.nama || '-'}</td>
                      <td className="px-4 py-3 text-muted-text">{d.tahunPembinaan}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex gap-2">
                          <button onClick={() => setModal({ type: 'stat_desa', item: d })} title="Kelola Grafik Demografi & Mata Pencaharian" className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors"><BarChart3 className="w-3.5 h-3.5" /></button>
                          <button onClick={() => setModal({ type: 'edit_desa', item: d })} title="Edit Profil Desa" className="p-1.5 rounded-lg text-primary-color hover:bg-primary-color/10 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                          <button onClick={() => setModal({ type: 'delete_desa', item: d })} title="Hapus Desa" className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredDesa.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-text text-sm">Tidak ada data ditemukan.</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {/* PUBLIKASI TABLE */}
          {activeTab === 'publikasi' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-card-border text-left text-xs text-muted-text uppercase tracking-wider">
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Desa</th>
                    <th className="px-4 py-3">Judul</th>
                    <th className="px-4 py-3">Tahun</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPub.map((p, i) => (
                    <tr key={p.id} className={`border-b border-card-border hover:bg-foreground/3 transition-colors ${i % 2 === 0 ? '' : 'bg-foreground/[0.02]'}`}>
                      <td className="px-4 py-3 text-muted-text font-mono text-xs">{p.id}</td>
                      <td className="px-4 py-3 text-muted-text text-xs">{getDesaNama(p.desaId)}</td>
                      <td className="px-4 py-3 font-semibold max-w-xs truncate">{p.judul}</td>
                      <td className="px-4 py-3 text-muted-text">{p.tahun}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex gap-2">
                          <button onClick={() => setModal({ type: 'edit_publikasi', item: p })} className="p-1.5 rounded-lg text-primary-color hover:bg-primary-color/10 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                          <button onClick={() => setModal({ type: 'delete_publikasi', item: p })} className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredPub.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-text text-sm">Tidak ada data ditemukan.</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {/* POTENSI TABLE */}
          {activeTab === 'potensi' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-card-border text-left text-xs text-muted-text uppercase tracking-wider">
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Desa</th>
                    <th className="px-4 py-3">Nama Potensi</th>
                    <th className="px-4 py-3">Kategori</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPotensi.map((p, i) => (
                    <tr key={p.id} className={`border-b border-card-border hover:bg-foreground/3 transition-colors ${i % 2 === 0 ? '' : 'bg-foreground/[0.02]'}`}>
                      <td className="px-4 py-3 text-muted-text font-mono text-xs">{p.id}</td>
                      <td className="px-4 py-3 text-muted-text text-xs">{getDesaNama(p.desaId)}</td>
                      <td className="px-4 py-3 font-semibold">{p.nama}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          p.kategori === 'ekonomi' ? 'bg-emerald-500/15 text-emerald-400'
                          : p.kategori === 'wisata' ? 'bg-blue-500/15 text-blue-400'
                          : 'bg-amber-500/15 text-amber-400'
                        }`}>{p.kategori}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex gap-2">
                          <button onClick={() => setModal({ type: 'edit_potensi', item: p })} className="p-1.5 rounded-lg text-primary-color hover:bg-primary-color/10 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                          <button onClick={() => setModal({ type: 'delete_potensi', item: p })} className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredPotensi.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-text text-sm">Tidak ada data ditemukan.</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {/* INFOGRAFIS TABLE */}
          {activeTab === 'infografis' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-card-border text-left text-xs text-muted-text uppercase tracking-wider">
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Desa</th>
                    <th className="px-4 py-3">Judul Infografis</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInfografis.map((inf, i) => (
                    <tr key={inf.id} className={`border-b border-card-border hover:bg-foreground/3 transition-colors ${i % 2 === 0 ? '' : 'bg-foreground/[0.02]'}`}>
                      <td className="px-4 py-3 text-muted-text font-mono text-xs">{inf.id}</td>
                      <td className="px-4 py-3 text-muted-text text-xs">{getDesaNama(inf.desaId)}</td>
                      <td className="px-4 py-3 font-semibold max-w-sm truncate">{inf.judul}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex gap-2">
                          <button onClick={() => setModal({ type: 'edit_infografis', item: inf })} className="p-1.5 rounded-lg text-primary-color hover:bg-primary-color/10 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                          <button onClick={() => setModal({ type: 'delete_infografis', item: inf })} className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredInfografis.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-text text-sm">Tidak ada data ditemukan.</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* ---- MODALS ---- */}
      {/* ADD/EDIT DESA */}
      <AdminModal
        isOpen={modal?.type === 'add_desa' || modal?.type === 'edit_desa'}
        onClose={() => setModal(null)}
        title={modal?.type === 'edit_desa' ? 'Edit Desa' : 'Tambah Desa Baru'}
        size="lg"
      >
        <DesaForm
          initial={modal?.type === 'edit_desa' ? (modal.item as Desa) : undefined}
          kecamatan={kecamatan}
          onSave={(data) => {
            if (modal?.type === 'edit_desa') updateDesa((modal.item as Desa).id, data);
            else createDesa(data);
            refresh();
            setModal(null);
            showToast('Data desa berhasil disimpan.');
          }}
          onCancel={() => setModal(null)}
        />
      </AdminModal>

      {/* DELETE DESA */}
      <AdminModal isOpen={modal?.type === 'delete_desa'} onClose={() => setModal(null)} title="Konfirmasi Hapus" size="sm">
        <ConfirmDelete
          name={(modal?.item as Desa)?.nama || ''}
          onConfirm={() => { deleteDesa((modal?.item as Desa).id); refresh(); setModal(null); showToast('Desa berhasil dihapus.'); }}
          onCancel={() => setModal(null)}
        />
      </AdminModal>

      {/* ADD/EDIT PUBLIKASI */}
      <AdminModal
        isOpen={modal?.type === 'add_publikasi' || modal?.type === 'edit_publikasi'}
        onClose={() => setModal(null)}
        title={modal?.type === 'edit_publikasi' ? 'Edit Publikasi' : 'Tambah Publikasi Desa'}
        size="lg"
      >
        <PublikasiForm
          initial={modal?.type === 'edit_publikasi' ? (modal.item as Publikasi) : undefined}
          desa={desa}
          onSave={(data) => {
            if (modal?.type === 'edit_publikasi') updatePublikasi((modal.item as Publikasi).id, data);
            else createPublikasi(data);
            refresh();
            setModal(null);
            showToast('Publikasi berhasil disimpan.');
          }}
          onCancel={() => setModal(null)}
        />
      </AdminModal>

      {/* DELETE PUBLIKASI */}
      <AdminModal isOpen={modal?.type === 'delete_publikasi'} onClose={() => setModal(null)} title="Konfirmasi Hapus" size="sm">
        <ConfirmDelete
          name={(modal?.item as Publikasi)?.judul || ''}
          onConfirm={() => { deletePublikasi((modal?.item as Publikasi).id); refresh(); setModal(null); showToast('Publikasi berhasil dihapus.'); }}
          onCancel={() => setModal(null)}
        />
      </AdminModal>

      {/* ADD/EDIT POTENSI */}
      <AdminModal
        isOpen={modal?.type === 'add_potensi' || modal?.type === 'edit_potensi'}
        onClose={() => setModal(null)}
        title={modal?.type === 'edit_potensi' ? 'Edit Potensi' : 'Tambah Potensi Desa'}
        size="lg"
      >
        <PotensiForm
          initial={modal?.type === 'edit_potensi' ? (modal.item as Potensi) : undefined}
          desa={desa}
          onSave={(data) => {
            if (modal?.type === 'edit_potensi') updatePotensi((modal.item as Potensi).id, data);
            else createPotensi(data);
            refresh();
            setModal(null);
            showToast('Potensi berhasil disimpan.');
          }}
          onCancel={() => setModal(null)}
        />
      </AdminModal>

      {/* DELETE POTENSI */}
      <AdminModal isOpen={modal?.type === 'delete_potensi'} onClose={() => setModal(null)} title="Konfirmasi Hapus" size="sm">
        <ConfirmDelete
          name={(modal?.item as Potensi)?.nama || ''}
          onConfirm={() => { deletePotensi((modal?.item as Potensi).id); refresh(); setModal(null); showToast('Potensi berhasil dihapus.'); }}
          onCancel={() => setModal(null)}
        />
      </AdminModal>

      {/* ADD/EDIT INFOGRAFIS */}
      <AdminModal
        isOpen={modal?.type === 'add_infografis' || modal?.type === 'edit_infografis'}
        onClose={() => setModal(null)}
        title={modal?.type === 'edit_infografis' ? 'Edit Infografis' : 'Tambah Infografis'}
        size="md"
      >
        <InfografisForm
          initial={modal?.type === 'edit_infografis' ? (modal.item as Infografis) : undefined}
          desa={desa}
          onSave={(data) => {
            if (modal?.type === 'edit_infografis') updateInfografis((modal.item as Infografis).id, data);
            else createInfografis(data);
            refresh();
            setModal(null);
            showToast('Infografis berhasil disimpan.');
          }}
          onCancel={() => setModal(null)}
        />
      </AdminModal>

      {/* DELETE INFOGRAFIS */}
      <AdminModal isOpen={modal?.type === 'delete_infografis'} onClose={() => setModal(null)} title="Konfirmasi Hapus" size="sm">
        <ConfirmDelete
          name={(modal?.item as Infografis)?.judul || ''}
          onConfirm={() => { deleteInfografis((modal?.item as Infografis).id); refresh(); setModal(null); showToast('Infografis berhasil dihapus.'); }}
          onCancel={() => setModal(null)}
        />
      </AdminModal>

      {/* EDIT STATISTIK DESA */}
      <AdminModal
        isOpen={modal?.type === 'stat_desa'}
        onClose={() => setModal(null)}
        title={`Grafik Statistik: ${(modal?.item as Desa)?.nama || ''}`}
        size="lg"
      >
        {modal?.type === 'stat_desa' && modal.item ? (
          <BpsDesaStatistikForm
            desaId={(modal.item as Desa).id}
            desaNama={(modal.item as Desa).nama}
            onSaved={() => {
              setModal(null);
              showToast('Data statistik demografi & mata pencaharian berhasil disimpan.');
            }}
            onCancel={() => setModal(null)}
          />
        ) : null}
      </AdminModal>
    </div>
  );
}
