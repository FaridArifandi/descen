'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  BookOpen, FileImage, TrendingUp,
  Plus, Pencil, Trash2, LogOut, Building2,
  Search, AlertTriangle, Info
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AdminModal from '@/components/AdminModal';
import {
  getAllPublikasi, createPublikasi, updatePublikasi, deletePublikasi,
  getAllPotensi, createPotensi, updatePotensi, deletePotensi,
  getAllInfografis, createInfografis, updateInfografis, deleteInfografis,
  getAllDesa,
} from '@/data/adminStore';
import { Desa, Publikasi, Potensi, Infografis } from '@/types';

type Tab = 'publikasi' | 'potensi' | 'infografis';

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

const inputCls = "w-full px-3 py-2.5 rounded-xl bg-background border border-card-border focus:border-primary-color focus:ring-2 focus:ring-primary-color/20 outline-none transition-all text-foreground text-sm placeholder:text-muted-text";
const textareaCls = inputCls + " resize-none";

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
      <Field label="URL Cover Buku">
        <input className={inputCls} value={form.coverUrl} onChange={e => set('coverUrl', e.target.value)} placeholder="https://..." />
      </Field>
      <Field label="URL File PDF">
        <input className={inputCls} value={form.pdfUrl} onChange={e => set('pdfUrl', e.target.value)} placeholder="https://..." />
      </Field>
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

  const [activeTab, setActiveTab] = useState<Tab>('publikasi');
  const [search, setSearch] = useState('');
  const [desaInfo, setDesaInfo] = useState<Desa | null>(null);
  const [publikasi, setPublikasi] = useState<Publikasi[]>([]);
  const [potensi, setPotensi] = useState<Potensi[]>([]);
  const [infografis, setInfografis] = useState<Infografis[]>([]);
  const [modal, setModal] = useState<null | { type: string; item?: unknown }>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const refresh = useCallback((desaId: number) => {
    setPublikasi(getAllPublikasi(desaId));
    setPotensi(getAllPotensi(desaId));
    setInfografis(getAllInfografis(desaId));
  }, []);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'desa')) {
      router.replace('/login');
    } else if (user?.desaId) {
      const allDesa = getAllDesa();
      const d = allDesa.find(x => x.id === user.desaId) || null;
      setDesaInfo(d);
      refresh(user.desaId);
    }
  }, [user, isLoading, router, refresh]);

  if (isLoading || !user || !desaInfo) return null;

  const desaId = user.desaId!;
  const q = search.toLowerCase();
  const filteredPub = publikasi.filter(p => p.judul.toLowerCase().includes(q));
  const filteredPotensi = potensi.filter(p => p.nama.toLowerCase().includes(q));
  const filteredInfografis = infografis.filter(i => i.judul.toLowerCase().includes(q));

  const tabs: { key: Tab; label: string; icon: React.ReactNode; count: number }[] = [
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
            Anda hanya dapat mengelola konten desa Anda sendiri (Publikasi, Potensi, dan Infografis).
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
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === t.key ? 'bg-white/20' : 'bg-foreground/10'}`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search + Add */}
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
