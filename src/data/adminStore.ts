/**
 * adminStore.ts
 * 
 * Local store + Supabase real-time sync.
 * Menyimpan ke local state & menyinkronkan langsung ke database Supabase.
 */

import {
  mockDesa,
  mockPublikasi,
  mockPotensi,
  mockInfografis,
  mockKecamatan,
  mockDemografi,
  mockMataPencaharian,
} from '@/data/mockData';
import { Desa, Publikasi, Potensi, Infografis, Kecamatan, DemografiDesa, MataPencaharianItem } from '@/types';
import { supabase } from '@/lib/supabase';

export interface AdminStore {
  desa: Desa[];
  publikasi: Publikasi[];
  potensi: Potensi[];
  infografis: Infografis[];
  kecamatan: Kecamatan[];
  demografi?: Record<number, DemografiDesa>;
  mataPencaharian?: Record<number, MataPencaharianItem[]>;
}

const STORE_KEY = 'desacantik_admin_store_v5';

function loadStore(): AdminStore {
  if (typeof window === 'undefined') {
    return {
      desa: mockDesa,
      publikasi: mockPublikasi,
      potensi: mockPotensi,
      infografis: mockInfografis,
      kecamatan: mockKecamatan,
    };
  }

  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const store = JSON.parse(raw);
      const hasDesa = Array.isArray(store.desa) && store.desa.length > 0;
      const hasPub = Array.isArray(store.publikasi) && store.publikasi.length > 0;
      const hasPot = Array.isArray(store.potensi) && store.potensi.length > 0;
      const hasInf = Array.isArray(store.infografis) && store.infografis.length > 0;

      if (hasDesa || hasPub || hasPot || hasInf) {
        return {
          desa: hasDesa ? store.desa : mockDesa,
          publikasi: hasPub ? store.publikasi : mockPublikasi,
          potensi: hasPub ? store.potensi : mockPotensi,
          infografis: hasInf ? store.infografis : mockInfografis,
          kecamatan: Array.isArray(store.kecamatan) && store.kecamatan.length > 0 ? store.kecamatan : mockKecamatan,
        };
      }
    }
  } catch {
    // ignore
  }

  const initial: AdminStore = {
    desa: mockDesa,
    publikasi: mockPublikasi,
    potensi: mockPotensi,
    infografis: mockInfografis,
    kecamatan: mockKecamatan,
  };
  localStorage.setItem(STORE_KEY, JSON.stringify(initial));
  return initial;
}

function saveStore(store: AdminStore) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  }
}

function nextId<T extends { id: number }>(items: T[]): number {
  return items.length === 0 ? 1 : Math.max(...items.map(x => x.id)) + 1;
}

// ── Sync awal dari Supabase ke localStorage ──
export async function syncFromSupabase() {
  try {
    const { data: dbDesa } = await supabase.from('desa').select('*').order('id', { ascending: true });
    if (dbDesa && dbDesa.length > 0) {
      const store = loadStore();
      store.desa = dbDesa.map(d => ({
        id: d.id,
        nama: d.nama,
        kecamatanId: d.kecamatan_id,
        tahunPembinaan: d.tahun_pembinaan,
        fotoCover: d.foto_cover || '',
        profilAbstrak: d.profil_abstrak || '',
        profilFileUrl: d.profil_file_url || '#',
        monografiAbstrak: d.monografi_abstrak || '',
        monografiFileUrl: d.monografi_file_url || '#',
        latitude: Number(d.latitude) || 0,
        longitude: Number(d.longitude) || 0,
      }));
      saveStore(store);
    }
  } catch {
    // fallback ke localStorage jika offline
  }
}

// Trigger async sync di background
if (typeof window !== 'undefined') {
  syncFromSupabase();
}

// ========== DESA ==========
export function getAllDesa(): Desa[] {
  return loadStore().desa;
}

export function createDesa(data: Omit<Desa, 'id'>): Desa {
  const store = loadStore();
  const newId = nextId(store.desa);
  const item: Desa = { id: newId, ...data };
  store.desa.push(item);
  saveStore(store);

  // Kirim ke Supabase secara asynchronous
  supabase.from('desa').insert([{
    id: newId,
    nama: data.nama,
    kecamatan_id: data.kecamatanId,
    tahun_pembinaan: data.tahunPembinaan,
    foto_cover: data.fotoCover,
    profil_abstrak: data.profilAbstrak,
    profil_file_url: data.profilFileUrl,
    monografi_abstrak: data.monografiAbstrak,
    monografi_file_url: data.monografiFileUrl,
    latitude: data.latitude,
    longitude: data.longitude,
  }]).then(({ error }) => {
    if (error) console.error('Error inserting to Supabase:', error);
  });

  return item;
}

export function updateDesa(id: number, data: Partial<Omit<Desa, 'id'>>): Desa | null {
  const store = loadStore();
  const idx = store.desa.findIndex(d => d.id === id);
  if (idx === -1) return null;
  store.desa[idx] = { ...store.desa[idx], ...data };
  saveStore(store);

  // Sync update ke Supabase
  const payload: Record<string, unknown> = {};
  if (data.nama !== undefined) payload.nama = data.nama;
  if (data.kecamatanId !== undefined) payload.kecamatan_id = data.kecamatanId;
  if (data.tahunPembinaan !== undefined) payload.tahun_pembinaan = data.tahunPembinaan;
  if (data.fotoCover !== undefined) payload.foto_cover = data.fotoCover;
  if (data.profilAbstrak !== undefined) payload.profil_abstrak = data.profilAbstrak;
  if (data.monografiAbstrak !== undefined) payload.monografi_abstrak = data.monografiAbstrak;
  if (data.latitude !== undefined) payload.latitude = data.latitude;
  if (data.longitude !== undefined) payload.longitude = data.longitude;

  supabase.from('desa').update(payload).eq('id', id).then(({ error }) => {
    if (error) console.error('Error updating to Supabase:', error);
  });

  return store.desa[idx];
}

export function deleteDesa(id: number): boolean {
  const store = loadStore();
  const before = store.desa.length;
  store.desa = store.desa.filter(d => d.id !== id);
  store.publikasi = store.publikasi.filter(p => p.desaId !== id);
  store.potensi = store.potensi.filter(p => p.desaId !== id);
  store.infografis = store.infografis.filter(i => i.desaId !== id);
  saveStore(store);

  // Sync delete ke Supabase
  supabase.from('desa').delete().eq('id', id).then(({ error }) => {
    if (error) console.error('Error deleting from Supabase:', error);
  });

  return store.desa.length < before;
}

// ========== PUBLIKASI ==========
export function getAllPublikasi(desaId?: number): Publikasi[] {
  const store = loadStore();
  return desaId ? store.publikasi.filter(p => p.desaId === desaId) : store.publikasi;
}

export function createPublikasi(data: Omit<Publikasi, 'id'>): Publikasi {
  const store = loadStore();
  const newId = nextId(store.publikasi);
  const item = { id: newId, ...data };
  store.publikasi.push(item);
  saveStore(store);

  supabase.from('publikasi').insert([{
    id: newId,
    desa_id: data.desaId,
    judul: data.judul,
    tahun: data.tahun,
    ringkasan: data.ringkasan,
    cover_url: data.coverUrl,
    pdf_url: data.pdfUrl,
  }]).then(({ error }) => {
    if (error) console.error('Error inserting publikasi to Supabase:', error);
  });

  return item;
}

export function updatePublikasi(id: number, data: Partial<Omit<Publikasi, 'id'>>): Publikasi | null {
  const store = loadStore();
  const idx = store.publikasi.findIndex(p => p.id === id);
  if (idx === -1) return null;
  store.publikasi[idx] = { ...store.publikasi[idx], ...data };
  saveStore(store);

  supabase.from('publikasi').update({
    judul: data.judul,
    tahun: data.tahun,
    ringkasan: data.ringkasan,
    cover_url: data.coverUrl,
    pdf_url: data.pdfUrl,
  }).eq('id', id).then(({ error }) => {
    if (error) console.error('Error updating publikasi to Supabase:', error);
  });

  return store.publikasi[idx];
}

export function deletePublikasi(id: number): boolean {
  const store = loadStore();
  const before = store.publikasi.length;
  store.publikasi = store.publikasi.filter(p => p.id !== id);
  saveStore(store);

  supabase.from('publikasi').delete().eq('id', id).then(({ error }) => {
    if (error) console.error('Error deleting publikasi from Supabase:', error);
  });

  return store.publikasi.length < before;
}

// ========== POTENSI ==========
export function getAllPotensi(desaId?: number): Potensi[] {
  const store = loadStore();
  return desaId ? store.potensi.filter(p => p.desaId === desaId) : store.potensi;
}

export function createPotensi(data: Omit<Potensi, 'id'>): Potensi {
  const store = loadStore();
  const newId = nextId(store.potensi);
  const item = { id: newId, ...data };
  store.potensi.push(item);
  saveStore(store);

  supabase.from('potensi').insert([{
    id: newId,
    desa_id: data.desaId,
    judul: data.nama,
    deskripsi: data.deskripsi,
    foto_url: data.fotoUrl,
    kategori: data.kategori,
  }]).then(({ error }) => {
    if (error) console.error('Error inserting potensi to Supabase:', error);
  });

  return item;
}

export function updatePotensi(id: number, data: Partial<Omit<Potensi, 'id'>>): Potensi | null {
  const store = loadStore();
  const idx = store.potensi.findIndex(p => p.id === id);
  if (idx === -1) return null;
  store.potensi[idx] = { ...store.potensi[idx], ...data };
  saveStore(store);

  supabase.from('potensi').update({
    judul: data.nama,
    deskripsi: data.deskripsi,
    foto_url: data.fotoUrl,
    kategori: data.kategori,
  }).eq('id', id).then(({ error }) => {
    if (error) console.error('Error updating potensi to Supabase:', error);
  });

  return store.potensi[idx];
}

export function deletePotensi(id: number): boolean {
  const store = loadStore();
  const before = store.potensi.length;
  store.potensi = store.potensi.filter(p => p.id !== id);
  saveStore(store);

  supabase.from('potensi').delete().eq('id', id).then(({ error }) => {
    if (error) console.error('Error deleting potensi from Supabase:', error);
  });

  return store.potensi.length < before;
}

// ========== INFOGRAFIS ==========
export function getAllInfografis(desaId?: number): Infografis[] {
  const store = loadStore();
  return desaId ? store.infografis.filter(i => i.desaId === desaId) : store.infografis;
}

export function createInfografis(data: Omit<Infografis, 'id'>): Infografis {
  const store = loadStore();
  const newId = nextId(store.infografis);
  const item = { id: newId, ...data };
  store.infografis.push(item);
  saveStore(store);

  supabase.from('infografis').insert([{
    id: newId,
    desa_id: data.desaId,
    judul: data.judul,
    gambar_url: data.imageUrl,
  }]).then(({ error }) => {
    if (error) console.error('Error inserting infografis to Supabase:', error);
  });

  return item;
}

export function updateInfografis(id: number, data: Partial<Omit<Infografis, 'id'>>): Infografis | null {
  const store = loadStore();
  const idx = store.infografis.findIndex(i => i.id === id);
  if (idx === -1) return null;
  store.infografis[idx] = { ...store.infografis[idx], ...data };
  saveStore(store);

  supabase.from('infografis').update({
    judul: data.judul,
    gambar_url: data.imageUrl,
  }).eq('id', id).then(({ error }) => {
    if (error) console.error('Error updating infografis to Supabase:', error);
  });

  return store.infografis[idx];
}

export function deleteInfografis(id: number): boolean {
  const store = loadStore();
  const before = store.infografis.length;
  store.infografis = store.infografis.filter(i => i.id !== id);
  saveStore(store);

  supabase.from('infografis').delete().eq('id', id).then(({ error }) => {
    if (error) console.error('Error deleting infografis from Supabase:', error);
  });

  return store.infografis.length < before;
}

export function getKecamatanAll(): Kecamatan[] {
  return loadStore().kecamatan;
}

// ========== DEMOGRAFI ==========
export function getDemografiLocal(desaId: number): DemografiDesa {
  const store = loadStore();
  if (store.demografi && store.demografi[desaId]) {
    return store.demografi[desaId];
  }
  return mockDemografi[desaId] || {
    desaId,
    umur0_14: 400,
    umur15_29: 800,
    umur30_44: 750,
    umur45_59: 600,
    umur60Plus: 450,
  };
}

export function saveDemografiLocal(desaId: number, data: Omit<DemografiDesa, 'desaId'>): DemografiDesa {
  const store = loadStore();
  if (!store.demografi) store.demografi = { ...mockDemografi };
  const updatedItem: DemografiDesa = { desaId, ...data };
  store.demografi[desaId] = updatedItem;
  saveStore(store);

  // Sync to Supabase
  supabase.from('demografi').upsert({
    desa_id: desaId,
    umur_0_14: data.umur0_14,
    umur_15_29: data.umur15_29,
    umur_30_44: data.umur30_44,
    umur_45_59: data.umur45_59,
    umur_60_plus: data.umur60Plus,
  }, { onConflict: 'desa_id' }).then(({ error }) => {
    if (error) console.error('Error saving demografi to Supabase:', error);
  });

  return updatedItem;
}

// ========== MATA PENCAHARIAN ==========
export function getMataPencaharianLocal(desaId: number): MataPencaharianItem[] {
  const store = loadStore();
  if (store.mataPencaharian && store.mataPencaharian[desaId]) {
    return store.mataPencaharian[desaId];
  }
  return mockMataPencaharian[desaId] || [
    { desaId, nama: 'Petani', persentase: 45 },
    { desaId, nama: 'Pedagang', persentase: 20 },
    { desaId, nama: 'PNS/TNI/Polri', persentase: 10 },
    { desaId, nama: 'Pekerja Jasa', persentase: 15 },
    { desaId, nama: 'Lainnya', persentase: 10 },
  ];
}

export function saveMataPencaharianLocal(desaId: number, items: MataPencaharianItem[]): MataPencaharianItem[] {
  const store = loadStore();
  if (!store.mataPencaharian) store.mataPencaharian = { ...mockMataPencaharian };
  store.mataPencaharian[desaId] = items;
  saveStore(store);

  // Sync to Supabase: first delete existing, then insert new items
  supabase.from('mata_pencaharian').delete().eq('desa_id', desaId).then(({ error: delErr }) => {
    if (!delErr && items.length > 0) {
      const payload = items.map(it => ({
        desa_id: desaId,
        nama: it.nama,
        persentase: it.persentase,
      }));
      supabase.from('mata_pencaharian').insert(payload).then(({ error: insErr }) => {
        if (insErr) console.error('Error inserting mata_pencaharian to Supabase:', insErr);
      });
    }
  });

  return items;
}

export function resetStore() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORE_KEY);
  }
}
