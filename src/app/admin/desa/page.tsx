'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  BookOpen, FileImage, TrendingUp,
  Plus, Pencil, Trash2, LogOut, Building2,
  Search, AlertTriangle, Info, MapPin, BarChart3
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AdminModal from '@/components/AdminModal';
import LocationPickerModal from '@/components/LocationPickerModal';
import {
  getAllPublikasi, createPublikasi, updatePublikasi, deletePublikasi,
  getAllPotensi, createPotensi, updatePotensi, deletePotensi,
  getAllInfografis, createInfografis, updateInfografis, deleteInfografis,
  getAllDesa, updateDesa, getKecamatanAll,
} from '@/data/adminStore';
import {
  getDemografiByDesaId,
  saveDemografiByDesaId,
  getMataPencaharianByDesaId,
  saveMataPencaharianByDesaId,
} from '@/services/database';
import { Desa, Publikasi, Potensi, Infografis, Kecamatan, DemografiDesa, DemografiDusun, MataPencaharianItem } from '@/types';

import FileUploadInput from '@/components/FileUploadInput';

type Tab = 'profil' | 'statistik' | 'publikasi' | 'potensi' | 'infografis';

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

// ===== PROFIL & LOKASI DESA FORM =====
function DesaProfilForm({
  desa,
  kecamatanList,
  onSave,
}: {
  desa: Desa;
  kecamatanList: Kecamatan[];
  onSave: (data: Partial<Desa>) => void;
}) {
  const [form, setForm] = useState({
    nama: desa.nama || '',
    kecamatanId: desa.kecamatanId || kecamatanList[0]?.id || 1,
    tahunPembinaan: desa.tahunPembinaan || new Date().getFullYear(),
    fotoCover: desa.fotoCover || '',
    profilAbstrak: desa.profilAbstrak || '',
    profilFileUrl: desa.profilFileUrl || '#',
    monografiAbstrak: desa.monografiAbstrak || '',
    monografiFileUrl: desa.monografiFileUrl || '#',
    latitude: desa.latitude || 0,
    longitude: desa.longitude || 0,
  });
  const [isMapPickerOpen, setIsMapPickerOpen] = useState(false);
  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="glass rounded-2xl border border-card-border p-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-card-border">
        <div>
          <h2 className="text-base font-bold text-foreground">Edit Profil & Data {form.nama || desa.nama}</h2>
          <p className="text-xs text-muted-text">Kelola seluruh data desa Anda mulai dari nama, kecamatan, foto cover, dokumen PDF profil/monografi, hingga lokasi peta.</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Identitas Desa */}
        <Field label="Nama Desa" required>
          <input
            className={inputCls}
            value={form.nama}
            onChange={(e) => set('nama', e.target.value)}
            placeholder="Nama Desa"
          />
        </Field>

        <Field label="Kecamatan" required>
          <select
            className={inputCls}
            value={form.kecamatanId}
            onChange={(e) => set('kecamatanId', Number(e.target.value))}
          >
            {kecamatanList.map((k) => (
              <option key={k.id} value={k.id}>
                {k.nama}
              </option>
            ))}
          </select>
        </Field>

        {/* Media Cover */}
        <FileUploadInput
          label="Foto Cover Desa"
          value={form.fotoCover}
          onChange={(url) => set('fotoCover', url)}
          accept="image"
          bucket="media_desa"
          placeholder="Upload foto cover desa atau masukan URL https://..."
        />

        {/* Profil & PDF */}
        <div className="space-y-3 pt-2">
          <Field label="Abstrak Profil Desa" required>
            <textarea
              className={textareaCls}
              rows={4}
              value={form.profilAbstrak}
              onChange={(e) => set('profilAbstrak', e.target.value)}
              placeholder="Jelaskan ringkasan gambaran umum profil desa..."
            />
          </Field>
          <FileUploadInput
            label="Dokumen PDF Buku Profil Desa"
            value={form.profilFileUrl}
            onChange={(url) => set('profilFileUrl', url)}
            accept="pdf"
            bucket="publikasi_pdf"
            placeholder="Upload file PDF profil desa atau masukan URL https://..."
          />
        </div>

        {/* Monografi & PDF */}
        <div className="space-y-3 pt-2">
          <Field label="Abstrak Monografi Desa">
            <textarea
              className={textareaCls}
              rows={3}
              value={form.monografiAbstrak}
              onChange={(e) => set('monografiAbstrak', e.target.value)}
              placeholder="Ringkasan data monografi desa..."
            />
          </Field>
          <FileUploadInput
            label="Dokumen PDF Monografi Desa"
            value={form.monografiFileUrl}
            onChange={(url) => set('monografiFileUrl', url)}
            accept="pdf"
            bucket="publikasi_pdf"
            placeholder="Upload file PDF monografi desa atau masukan URL https://..."
          />
        </div>

        {/* Titik Lokasi Peta */}
        <div className="p-4 rounded-2xl bg-primary-glow/30 border border-primary-color/20 space-y-3 pt-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-primary-color" />
                Titik Lokasi Koordinat (Peta Interaktif)
              </label>
              <p className="text-xs text-muted-text mt-0.5">
                Pilih atau cari lokasi desa di peta seperti menggunakan aplikasi Grab / Gmaps.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsMapPickerOpen(true)}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-primary-color text-white text-xs font-semibold hover:opacity-90 transition-all shadow-[0_0_15px_var(--primary-glow)] shrink-0"
            >
              <MapPin className="w-4 h-4" />
              Pilih / Ubah di Peta
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <Field label="Latitude">
              <input
                type="number"
                step="any"
                className={inputCls}
                value={form.latitude}
                onChange={(e) => set('latitude', Number(e.target.value))}
              />
            </Field>
            <Field label="Longitude">
              <input
                type="number"
                step="any"
                className={inputCls}
                value={form.longitude}
                onChange={(e) => set('longitude', Number(e.target.value))}
              />
            </Field>
          </div>
        </div>
      </div>

      <LocationPickerModal
        isOpen={isMapPickerOpen}
        onClose={() => setIsMapPickerOpen(false)}
        initialLat={form.latitude}
        initialLng={form.longitude}
        onConfirm={(lat, lng) => {
          setForm((f) => ({ ...f, latitude: lat, longitude: lng }));
        }}
      />

      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={() => onSave(form)}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary-color text-white text-sm font-semibold hover:opacity-90 transition-all shadow-[0_0_15px_var(--primary-glow)]"
        >
          Simpan Seluruh Data Desa
        </button>
      </div>
    </div>
  );
}

// ===== STATISTIK & GRAFIK FORM (DEMOGRAFI & MATA PENCAHARIAN) =====
function DesaStatistikForm({ desaId, onSaved }: { desaId: number; onSaved: () => void }) {
  const [demografi, setDemografi] = useState<DemografiDesa>({
    desaId,
    dusunData: []
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
      const initialDusun = demo?.dusunData && demo.dusunData.length > 0
        ? demo.dusunData
        : [
            { dusun: 'Dusun Pemancar', lakiLaki: 397, perempuan: 395 },
            { dusun: 'Dusun Silak', lakiLaki: 387, perempuan: 341 },
            { dusun: 'Dusun Gapa', lakiLaki: 150, perempuan: 181 },
            { dusun: 'Dusun Nurul Iman', lakiLaki: 160, perempuan: 182 }
          ];
      setDemografi({ ...demo, dusunData: initialDusun });
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

  const handleAddDusun = () => {
    const updated = [...(demografi.dusunData || []), { dusun: '', lakiLaki: 0, perempuan: 0 }];
    setDemografi({ ...demografi, dusunData: updated });
  };

  const handleUpdateDusun = (index: number, key: keyof DemografiDusun, value: string | number) => {
    const updated = [...(demografi.dusunData || [])];
    updated[index] = { ...updated[index], [key]: value };
    setDemografi({ ...demografi, dusunData: updated });
  };

  const handleDeleteDusun = (index: number) => {
    const updated = (demografi.dusunData || []).filter((_, i) => i !== index);
    setDemografi({ ...demografi, dusunData: updated });
  };

  const totalLaki = (demografi.dusunData || []).reduce((acc, item) => acc + (Number(item.lakiLaki) || 0), 0);
  const totalPerempuan = (demografi.dusunData || []).reduce((acc, item) => acc + (Number(item.perempuan) || 0), 0);
  const grandTotal = totalLaki + totalPerempuan;

  if (loading) {
    return (
      <div className="glass rounded-2xl p-8 text-center border border-card-border">
        <p className="text-sm font-semibold text-muted-text">Memuat Data Statistik...</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl border border-card-border p-6 space-y-8">
      {/* Header */}
      <div className="border-b border-card-border pb-4">
        <h2 className="text-lg font-extrabold text-foreground flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary-color" />
          <span>Kelola Data Grafik Demografi & Mata Pencaharian</span>
        </h2>
        <p className="text-xs text-muted-text mt-1">
          Data ini akan langsung memperbarui Bar Chart Demografi per Dusun & Pie Chart Distribusi Pekerjaan pada halaman detail desa publik.
        </p>
      </div>

      {/* Section 1: Demografi per Dusun (Sebaran Jenis Kelamin) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-foreground uppercase tracking-wider text-primary-color">
            1. Demografi Penduduk per Dusun (Laki-Laki & Perempuan)
          </h3>
          <button
            type="button"
            onClick={handleAddDusun}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-glow border border-primary-color/30 text-primary-color text-xs font-bold hover:bg-primary-color hover:text-white transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Dusun</span>
          </button>
        </div>

        <div className="space-y-3">
          {(demografi.dusunData || []).map((item, idx) => (
            <div key={idx} className="flex flex-wrap sm:flex-nowrap items-center gap-3 p-3 rounded-xl bg-card border border-card-border">
              <div className="flex-1 min-w-[180px]">
                <label className="block text-[10px] uppercase font-bold text-muted-text mb-1">Nama Dusun</label>
                <input
                  type="text"
                  placeholder="Contoh: Dusun Pemancar"
                  className={inputCls}
                  value={item.dusun}
                  onChange={e => handleUpdateDusun(idx, 'dusun', e.target.value)}
                />
              </div>
              <div className="w-28">
                <label className="block text-[10px] uppercase font-bold text-cyan-400 mb-1">Laki-laki</label>
                <input
                  type="number"
                  className={inputCls}
                  value={item.lakiLaki}
                  onChange={e => handleUpdateDusun(idx, 'lakiLaki', Number(e.target.value))}
                />
              </div>
              <div className="w-28">
                <label className="block text-[10px] uppercase font-bold text-pink-400 mb-1">Perempuan</label>
                <input
                  type="number"
                  className={inputCls}
                  value={item.perempuan}
                  onChange={e => handleUpdateDusun(idx, 'perempuan', Number(e.target.value))}
                />
              </div>
              <div className="w-28 pt-4 text-xs font-extrabold text-foreground">
                <span className="text-[10px] uppercase font-bold text-muted-text block">Total</span>
                {(Number(item.lakiLaki || 0) + Number(item.perempuan || 0)).toLocaleString('id-ID')} Jiwa
              </div>
              <button
                type="button"
                onClick={() => handleDeleteDusun(idx)}
                className="mt-4 p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                title="Hapus Dusun"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Total calculation bar */}
        <div className="p-3.5 rounded-xl bg-primary-glow border border-primary-color/20 flex flex-wrap items-center justify-between gap-4 text-xs font-bold">
          <span className="text-foreground">Total Keseluruhan Desa:</span>
          <div className="flex items-center gap-4">
            <span className="text-cyan-400">Laki-laki: {totalLaki.toLocaleString('id-ID')}</span>
            <span className="text-pink-400">Perempuan: {totalPerempuan.toLocaleString('id-ID')}</span>
            <span className="text-primary-color bg-background px-2.5 py-1 rounded-md border border-card-border">Total Penduduk: {grandTotal.toLocaleString('id-ID')} Jiwa</span>
          </div>
        </div>
      </div>

      {/* Section 2: Mata Pencaharian */}
      <div className="space-y-4 pt-4 border-t border-card-border">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-foreground uppercase tracking-wider text-primary-color">
            2. Distribusi Mata Pencaharian (%)
          </h3>
          <button
            type="button"
            onClick={() => setMataPencaharian([...mataPencaharian, { desaId, nama: '', persentase: 0 }])}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-glow border border-primary-color/30 text-primary-color text-xs font-bold hover:bg-primary-color hover:text-white transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Jenis Pekerjaan</span>
          </button>
        </div>

        <div className="space-y-3">
          {mataPencaharian.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 glass p-3 rounded-xl border border-card-border">
              <div className="flex-1">
                <input
                  className={inputCls}
                  placeholder="Contoh: Petani, Pedagang, PNS..."
                  value={item.nama}
                  onChange={e => {
                    const next = [...mataPencaharian];
                    next[idx].nama = e.target.value;
                    setMataPencaharian(next);
                  }}
                />
              </div>
              <div className="w-32 flex items-center gap-1">
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
                className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                title="Hapus"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {mataPencaharian.length === 0 && (
            <p className="text-xs text-muted-text text-center py-4">Belum ada kategori pekerjaan. Klik "Tambah Jenis Pekerjaan" di atas.</p>
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="pt-4 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary-color text-white text-sm font-semibold hover:opacity-90 transition-all shadow-[0_0_15px_var(--primary-glow)]"
        >
          Simpan Data Grafik Statistik
        </button>
      </div>
    </div>
  );
}

// ===== PUBLIKASI FORM =====
function PublikasiForm({ initial, desaId, onSave, onCancel }: { initial?: Partial<Publikasi>; desaId: number; onSave: (d: Omit<Publikasi, 'id'>) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    desaId,
    judul: initial?.judul || '',
    tahun: initial?.tahun || new Date().getFullYear(),
    ringkasan: initial?.ringkasan || '',
    coverUrl: initial?.coverUrl || '',
    pdfUrl: initial?.pdfUrl || '#',
  });
  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <Field label="Judul Publikasi" required>
            <input className={inputCls} value={form.judul} onChange={e => set('judul', e.target.value)} placeholder="Nama Desa Dalam Angka 2026" />
          </Field>
        </div>
        <Field label="Tahun" required>
          <input type="number" className={inputCls} value={form.tahun} onChange={e => set('tahun', Number(e.target.value))} />
        </Field>
      </div>
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
function PotensiForm({ initial, desaId, onSave, onCancel }: { initial?: Partial<Potensi>; desaId: number; onSave: (d: Omit<Potensi, 'id'>) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    desaId,
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
        <Field label="Kategori" required>
          <select className={inputCls} value={form.kategori} onChange={e => set('kategori', e.target.value)}>
            <option value="ekonomi">Ekonomi</option>
            <option value="wisata">Wisata</option>
            <option value="investasi">Investasi</option>
          </select>
        </Field>
        <Field label="Sub Kategori" required>
          <input className={inputCls} value={form.subKategori} onChange={e => set('subKategori', e.target.value)} placeholder="UMKM, Pertanian..." />
        </Field>
      </div>
      <Field label="Nama Potensi" required>
        <input className={inputCls} value={form.nama} onChange={e => set('nama', e.target.value)} placeholder="Nama potensi / destinasi" />
      </Field>
      <Field label="Deskripsi">
        <textarea className={textareaCls} rows={3} value={form.deskripsi} onChange={e => set('deskripsi', e.target.value)} />
      </Field>

      <FileUploadInput
        label="Foto Potensi / Produk"
        value={form.fotoUrl}
        onChange={(url) => set('fotoUrl', url)}
        accept="image"
        bucket="media_desa"
        placeholder="Upload foto potensi atau masukan URL https://..."
      />

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
function InfografisForm({ initial, desaId, onSave, onCancel }: { initial?: Partial<Infografis>; desaId: number; onSave: (d: Omit<Infografis, 'id'>) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    desaId,
    judul: initial?.judul || '',
    imageUrl: initial?.imageUrl || '',
    pdfUrl: initial?.pdfUrl || '#',
  });
  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div className="space-y-4">
      <Field label="Judul Infografis" required>
        <input className={inputCls} value={form.judul} onChange={e => set('judul', e.target.value)} placeholder="Infografis Demografi ..." />
      </Field>

      <FileUploadInput
        label="Gambar Infografis"
        value={form.imageUrl}
        onChange={(url) => set('imageUrl', url)}
        accept="image"
        bucket="media_desa"
        placeholder="Upload file gambar infografis atau masukan URL https://..."
        required
      />

      <FileUploadInput
        label="Dokumen PDF Infografis (opsional)"
        value={form.pdfUrl}
        onChange={(url) => set('pdfUrl', url)}
        accept="pdf"
        bucket="publikasi_pdf"
        placeholder="Upload file PDF atau masukan URL https://..."
      />

      <div className="flex gap-3 pt-2">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-card-border text-sm font-semibold hover:bg-foreground/5 transition-colors">Batal</button>
        <button onClick={() => onSave(form)} className="flex-1 py-2.5 rounded-xl bg-primary-color text-white text-sm font-semibold hover:opacity-90 transition-all shadow-[0_0_15px_var(--primary-glow)]">Simpan</button>
      </div>
    </div>
  );
}

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

export default function AdminDesaPage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>('profil');
  const [search, setSearch] = useState('');
  const [desaInfo, setDesaInfo] = useState<Desa | null>(null);
  const [publikasi, setPublikasi] = useState<Publikasi[]>([]);
  const [potensi, setPotensi] = useState<Potensi[]>([]);
  const [infografis, setInfografis] = useState<Infografis[]>([]);
  const [kecamatanList, setKecamatanList] = useState<Kecamatan[]>([]);

  const [modal, setModal] = useState<null | { type: string; item?: unknown }>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const refresh = useCallback((desaId: number) => {
    const allDesa = getAllDesa();
    const d = allDesa.find(x => x.id === desaId) || null;
    setDesaInfo(d);
    setPublikasi(getAllPublikasi(desaId));
    setPotensi(getAllPotensi(desaId));
    setInfografis(getAllInfografis(desaId));
    setKecamatanList(getKecamatanAll());
  }, []);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'desa')) {
      router.replace('/login');
    } else if (user?.desaId) {
      refresh(user.desaId);
    }
  }, [user, isLoading, router, refresh]);

  if (isLoading || !user || !desaInfo) return null;

  const desaId = user.desaId!;
  const q = search.toLowerCase();
  const filteredPub = publikasi.filter(p => p.judul.toLowerCase().includes(q));
  const filteredPotensi = potensi.filter(p => p.nama.toLowerCase().includes(q));
  const filteredInfografis = infografis.filter(i => i.judul.toLowerCase().includes(q));

  const tabs: { key: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { key: 'profil', label: 'Profil & Data Desa', icon: <MapPin className="w-4 h-4" /> },
    { key: 'statistik', label: 'Statistik & Grafik', icon: <BarChart3 className="w-4 h-4" /> },
    { key: 'publikasi', label: 'Publikasi Desa', icon: <BookOpen className="w-4 h-4" />, count: publikasi.length },
    { key: 'potensi', label: 'Potensi', icon: <TrendingUp className="w-4 h-4" />, count: potensi.length },
    { key: 'infografis', label: 'Infografis', icon: <FileImage className="w-4 h-4" />, count: infografis.length },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-grid">
      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl bg-primary-color text-white text-sm font-semibold shadow-lg"
        >
          {toast}
        </motion.div>
      )}

      {/* Header */}
      <header className="glass border-b border-card-border px-4 sm:px-8 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary-glow border border-primary-color/20">
            <Building2 className="w-5 h-5 text-primary-color" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm sm:text-base">{desaInfo.nama}</h1>
            <p className="text-xs text-muted-text">Admin Desa · Desa Cantik</p>
          </div>
        </div>
        <button
          onClick={() => { logout(); router.replace('/login'); }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-muted-text hover:text-foreground hover:bg-foreground/5 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Keluar</span>
        </button>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Info Card */}
        <div className="glass rounded-2xl border border-primary-color/20 p-4 flex items-start gap-3 bg-primary-glow">
          <Info className="w-4 h-4 text-primary-color mt-0.5 shrink-0" />
          <p className="text-xs text-foreground/80">
            Anda login sebagai admin <span className="font-bold text-primary-color">{desaInfo.nama}</span>.
            Anda dapat mengedit seluruh data desa Anda sendiri (Nama, Foto, Peta, Grafik Demografi & Mata Pencaharian, serta Publikasi, Potensi, & Infografis).
          </p>
        </div>

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
              {t.count !== undefined && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === t.key ? 'bg-white/20' : 'bg-foreground/10'}`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content: PROFIL & DATA DESA */}
        {activeTab === 'profil' && (
          <DesaProfilForm
            desa={desaInfo}
            kecamatanList={kecamatanList}
            onSave={(updatedData) => {
              updateDesa(desaInfo.id, updatedData);
              refresh(desaId);
              showToast('Data & Profil desa berhasil diperbarui!');
            }}
          />
        )}

        {/* Tab Content: STATISTIK & GRAFIK */}
        {activeTab === 'statistik' && (
          <DesaStatistikForm
            desaId={desaId}
            onSaved={() => {
              showToast('Data grafik demografi & mata pencaharian berhasil disimpan!');
            }}
          />
        )}

        {/* Search + Add Bar for other tabs */}
        {activeTab !== 'profil' && activeTab !== 'statistik' && (
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
        )}

        {/* Tables */}
        {activeTab !== 'profil' && activeTab !== 'statistik' && (
          <div className="glass rounded-2xl border border-card-border overflow-hidden">
            {/* PUBLIKASI */}
            {activeTab === 'publikasi' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-card-border text-left text-xs text-muted-text uppercase tracking-wider">
                      <th className="px-4 py-3">Judul Publikasi</th>
                      <th className="px-4 py-3">Tahun</th>
                      <th className="px-4 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPub.map((p, i) => (
                      <tr key={p.id} className={`border-b border-card-border hover:bg-foreground/3 transition-colors ${i % 2 ? 'bg-foreground/[0.02]' : ''}`}>
                        <td className="px-4 py-3 font-semibold max-w-sm truncate">{p.judul}</td>
                        <td className="px-4 py-3 text-muted-text">{p.tahun}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex gap-2">
                            <button onClick={() => setModal({ type: 'edit_publikasi', item: p })} className="p-1.5 rounded-lg text-primary-color hover:bg-primary-color/10 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                            <button onClick={() => setModal({ type: 'delete_publikasi', item: p })} className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredPub.length === 0 && <tr><td colSpan={3} className="px-4 py-8 text-center text-muted-text text-sm">Belum ada publikasi untuk desa ini.</td></tr>}
                  </tbody>
                </table>
              </div>
            )}

            {/* POTENSI */}
            {activeTab === 'potensi' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-card-border text-left text-xs text-muted-text uppercase tracking-wider">
                      <th className="px-4 py-3">Nama Potensi</th>
                      <th className="px-4 py-3">Kategori</th>
                      <th className="px-4 py-3">Sub Kategori</th>
                      <th className="px-4 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPotensi.map((p, i) => (
                      <tr key={p.id} className={`border-b border-card-border hover:bg-foreground/3 transition-colors ${i % 2 ? 'bg-foreground/[0.02]' : ''}`}>
                        <td className="px-4 py-3 font-semibold">{p.nama}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            p.kategori === 'ekonomi' ? 'bg-emerald-500/15 text-emerald-400'
                            : p.kategori === 'wisata' ? 'bg-blue-500/15 text-blue-400'
                            : 'bg-amber-500/15 text-amber-400'
                          }`}>{p.kategori}</span>
                        </td>
                        <td className="px-4 py-3 text-muted-text text-xs">{p.subKategori}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex gap-2">
                            <button onClick={() => setModal({ type: 'edit_potensi', item: p })} className="p-1.5 rounded-lg text-primary-color hover:bg-primary-color/10 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                            <button onClick={() => setModal({ type: 'delete_potensi', item: p })} className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredPotensi.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-text text-sm">Belum ada potensi untuk desa ini.</td></tr>}
                  </tbody>
                </table>
              </div>
            )}

            {/* INFOGRAFIS */}
            {activeTab === 'infografis' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-card-border text-left text-xs text-muted-text uppercase tracking-wider">
                      <th className="px-4 py-3">Judul Infografis</th>
                      <th className="px-4 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInfografis.map((inf, i) => (
                      <tr key={inf.id} className={`border-b border-card-border hover:bg-foreground/3 transition-colors ${i % 2 ? 'bg-foreground/[0.02]' : ''}`}>
                        <td className="px-4 py-3 font-semibold max-w-sm truncate">{inf.judul}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex gap-2">
                            <button onClick={() => setModal({ type: 'edit_infografis', item: inf })} className="p-1.5 rounded-lg text-primary-color hover:bg-primary-color/10 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                            <button onClick={() => setModal({ type: 'delete_infografis', item: inf })} className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredInfografis.length === 0 && <tr><td colSpan={2} className="px-4 py-8 text-center text-muted-text text-sm">Belum ada infografis untuk desa ini.</td></tr>}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ---- MODALS ---- */}
      <AdminModal
        isOpen={modal?.type === 'add_publikasi' || modal?.type === 'edit_publikasi'}
        onClose={() => setModal(null)}
        title={modal?.type === 'edit_publikasi' ? 'Edit Publikasi' : 'Tambah Publikasi'}
        size="lg"
      >
        <PublikasiForm
          desaId={desaId}
          initial={modal?.type === 'edit_publikasi' ? (modal.item as Publikasi) : undefined}
          onSave={(data) => {
            if (modal?.type === 'edit_publikasi') updatePublikasi((modal.item as Publikasi).id, data);
            else createPublikasi(data);
            refresh(desaId);
            setModal(null);
            showToast('Publikasi berhasil disimpan.');
          }}
          onCancel={() => setModal(null)}
        />
      </AdminModal>

      <AdminModal isOpen={modal?.type === 'delete_publikasi'} onClose={() => setModal(null)} title="Konfirmasi Hapus" size="sm">
        <ConfirmDelete
          name={(modal?.item as Publikasi)?.judul || ''}
          onConfirm={() => { deletePublikasi((modal?.item as Publikasi).id); refresh(desaId); setModal(null); showToast('Publikasi dihapus.'); }}
          onCancel={() => setModal(null)}
        />
      </AdminModal>

      <AdminModal
        isOpen={modal?.type === 'add_potensi' || modal?.type === 'edit_potensi'}
        onClose={() => setModal(null)}
        title={modal?.type === 'edit_potensi' ? 'Edit Potensi' : 'Tambah Potensi'}
        size="lg"
      >
        <PotensiForm
          desaId={desaId}
          initial={modal?.type === 'edit_potensi' ? (modal.item as Potensi) : undefined}
          onSave={(data) => {
            if (modal?.type === 'edit_potensi') updatePotensi((modal.item as Potensi).id, data);
            else createPotensi(data);
            refresh(desaId);
            setModal(null);
            showToast('Potensi berhasil disimpan.');
          }}
          onCancel={() => setModal(null)}
        />
      </AdminModal>

      <AdminModal isOpen={modal?.type === 'delete_potensi'} onClose={() => setModal(null)} title="Konfirmasi Hapus" size="sm">
        <ConfirmDelete
          name={(modal?.item as Potensi)?.nama || ''}
          onConfirm={() => { deletePotensi((modal?.item as Potensi).id); refresh(desaId); setModal(null); showToast('Potensi dihapus.'); }}
          onCancel={() => setModal(null)}
        />
      </AdminModal>

      <AdminModal
        isOpen={modal?.type === 'add_infografis' || modal?.type === 'edit_infografis'}
        onClose={() => setModal(null)}
        title={modal?.type === 'edit_infografis' ? 'Edit Infografis' : 'Tambah Infografis'}
        size="md"
      >
        <InfografisForm
          desaId={desaId}
          initial={modal?.type === 'edit_infografis' ? (modal.item as Infografis) : undefined}
          onSave={(data) => {
            if (modal?.type === 'edit_infografis') updateInfografis((modal.item as Infografis).id, data);
            else createInfografis(data);
            refresh(desaId);
            setModal(null);
            showToast('Infografis berhasil disimpan.');
          }}
          onCancel={() => setModal(null)}
        />
      </AdminModal>

      <AdminModal isOpen={modal?.type === 'delete_infografis'} onClose={() => setModal(null)} title="Konfirmasi Hapus" size="sm">
        <ConfirmDelete
          name={(modal?.item as Infografis)?.judul || ''}
          onConfirm={() => { deleteInfografis((modal?.item as Infografis).id); refresh(desaId); setModal(null); showToast('Infografis dihapus.'); }}
          onCancel={() => setModal(null)}
        />
      </AdminModal>
    </div>
  );
}
