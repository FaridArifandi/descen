/**
 * adminStore.ts
 * 
 * Local store + MySQL API sync.
 * Menyimpan ke local state & menyinkronkan ke MySQL via API Routes.
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

export interface AdminStore {
  desa: Desa[];
  publikasi: Publikasi[];
  potensi: Potensi[];
  infografis: Infografis[];
  kecamatan: Kecamatan[];
  demografi?: Record<number, DemografiDesa>;
  mataPencaharian?: Record<number, MataPencaharianItem[]>;
}

const STORE_KEY = 'desacantik_admin_store_v6';

function loadStore(): AdminStore {
  if (typeof window === 'undefined') {
    return {
      desa: mockDesa,
      publikasi: mockPublikasi,
      potensi: mockPotensi,
      infografis: mockInfografis,
      kecamatan: mockKecamatan,
      demografi: mockDemografi,
      mataPencaharian: mockMataPencaharian,
    };
  }

  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const store = JSON.parse(raw);
      return {
        desa: Array.isArray(store.desa) ? store.desa : mockDesa,
        publikasi: Array.isArray(store.publikasi) ? store.publikasi : mockPublikasi,
        potensi: Array.isArray(store.potensi) ? store.potensi : mockPotensi,
        infografis: Array.isArray(store.infografis) ? store.infografis : mockInfografis,
        kecamatan: Array.isArray(store.kecamatan) && store.kecamatan.length > 0 ? store.kecamatan : mockKecamatan,
        demografi: store.demografi || mockDemografi,
        mataPencaharian: store.mataPencaharian || mockMataPencaharian,
      };
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
    demografi: mockDemografi,
    mataPencaharian: mockMataPencaharian,
  };
  localStorage.setItem(STORE_KEY, JSON.stringify(initial));
  return initial;
}

export function saveStore(store: AdminStore) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  }
}

function nextId<T extends { id: number }>(items: T[]): number {
  return items.length === 0 ? 1 : Math.max(...items.map(x => x.id)) + 1;
}

// ── Helpers: map MySQL rows → frontend types ──
function mapDesaFromApi(d: Record<string, unknown>): Desa {
  return {
    id: d.id as number,
    nama: d.nama as string,
    kecamatanId: (d.kecamatan_id as number) || 0,
    tahunPembinaan: (d.tahun_pembinaan as number) || 2026,
    fotoCover: (d.foto_cover as string) || '',
    profilAbstrak: (d.profil_abstrak as string) || '',
    profilFileUrl: (d.profil_file_url as string) || '#',
    monografiAbstrak: (d.monografi_abstrak as string) || '',
    monografiFileUrl: (d.monografi_file_url as string) || '#',
    latitude: Number(d.latitude) || 0,
    longitude: Number(d.longitude) || 0,
  };
}

function mapPublikasiFromApi(p: Record<string, unknown>): Publikasi {
  return {
    id: p.id as number,
    desaId: (p.desa_id as number) || 0,
    judul: (p.judul as string) || '',
    tahun: (p.tahun as number) || 0,
    ringkasan: (p.ringkasan as string) || '',
    coverUrl: (p.cover_url as string) || '',
    pdfUrl: (p.pdf_url as string) || '#',
  };
}

function mapPotensiFromApi(pt: Record<string, unknown>): Potensi {
  return {
    id: pt.id as number,
    desaId: (pt.desa_id as number) || 0,
    kategori: (pt.kategori as 'ekonomi' | 'wisata' | 'investasi') || 'ekonomi',
    subKategori: (pt.sub_kategori as string) || '',
    nama: (pt.judul as string) || '',
    deskripsi: (pt.deskripsi as string) || '',
    fotoUrl: (pt.foto_url as string) || '',
  };
}

function mapInfografisFromApi(ig: Record<string, unknown>): Infografis {
  return {
    id: ig.id as number,
    desaId: (ig.desa_id as number) || 0,
    judul: (ig.judul as string) || '',
    imageUrl: (ig.gambar_url as string) || '',
    pdfUrl: '#',
  };
}

// ── Sync awal dari MySQL API ke localStorage ──
export async function syncFromSupabase() {
  try {
    const [desaRes, pubRes, potRes, infoRes] = await Promise.all([
      fetch('/api/desa').catch(() => null),
      fetch('/api/publikasi').catch(() => null),
      fetch('/api/potensi').catch(() => null),
      fetch('/api/infografis').catch(() => null),
    ]);

    const store = loadStore();
    let updated = false;

    if (desaRes && desaRes.ok) {
      const dbDesa = await desaRes.json();
      if (Array.isArray(dbDesa) && dbDesa.length > 0) {
        store.desa = dbDesa.map(mapDesaFromApi);
        updated = true;
      }
    }

    if (pubRes && pubRes.ok) {
      const dbPub = await pubRes.json();
      if (Array.isArray(dbPub) && dbPub.length > 0) {
        store.publikasi = dbPub.map(mapPublikasiFromApi);
        updated = true;
      }
    }

    if (potRes && potRes.ok) {
      const dbPot = await potRes.json();
      if (Array.isArray(dbPot) && dbPot.length > 0) {
        store.potensi = dbPot.map(mapPotensiFromApi);
        updated = true;
      }
    }

    if (infoRes && infoRes.ok) {
      const dbInfo = await infoRes.json();
      if (Array.isArray(dbInfo) && dbInfo.length > 0) {
        store.infografis = dbInfo.map(mapInfografisFromApi);
        updated = true;
      }
    }

    if (updated) {
      saveStore(store);
    }
  } catch {
    // fallback ke localStorage jika offline
  }
}

// Trigger async sync di background saat inisialisasi browser
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

  // Sync ke MySQL via API
  fetch('/api/desa', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
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
    }),
  }).catch(err => console.error('Error syncing desa to MySQL:', err));

  return item;
}

export function updateDesa(id: number, data: Partial<Omit<Desa, 'id'>>): Desa | null {
  const store = loadStore();
  const idx = store.desa.findIndex(d => d.id === id);
  if (idx === -1) return null;
  store.desa[idx] = { ...store.desa[idx], ...data };
  saveStore(store);

  // Sync update ke MySQL
  const payload: Record<string, unknown> = {};
  if (data.nama !== undefined) payload.nama = data.nama;
  if (data.kecamatanId !== undefined) payload.kecamatan_id = data.kecamatanId;
  if (data.tahunPembinaan !== undefined) payload.tahun_pembinaan = data.tahunPembinaan;
  if (data.fotoCover !== undefined) payload.foto_cover = data.fotoCover;
  if (data.profilAbstrak !== undefined) payload.profil_abstrak = data.profilAbstrak;
  if (data.profilFileUrl !== undefined) payload.profil_file_url = data.profilFileUrl;
  if (data.monografiAbstrak !== undefined) payload.monografi_abstrak = data.monografiAbstrak;
  if (data.monografiFileUrl !== undefined) payload.monografi_file_url = data.monografiFileUrl;
  if (data.latitude !== undefined) payload.latitude = data.latitude;
  if (data.longitude !== undefined) payload.longitude = data.longitude;

  fetch(`/api/desa/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(err => console.error('Error updating desa in MySQL:', err));

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

  // Sync delete ke MySQL
  fetch(`/api/desa/${id}`, { method: 'DELETE' })
    .catch(err => console.error('Error deleting desa from MySQL:', err));

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

  fetch('/api/publikasi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      desa_id: data.desaId,
      judul: data.judul,
      tahun: data.tahun,
      ringkasan: data.ringkasan,
      cover_url: data.coverUrl,
      pdf_url: data.pdfUrl,
    }),
  }).catch(err => console.error('Error inserting publikasi to MySQL:', err));

  return item;
}

export function updatePublikasi(id: number, data: Partial<Omit<Publikasi, 'id'>>): Publikasi | null {
  const store = loadStore();
  const idx = store.publikasi.findIndex(p => p.id === id);
  if (idx === -1) return null;
  store.publikasi[idx] = { ...store.publikasi[idx], ...data };
  saveStore(store);

  fetch(`/api/publikasi/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      judul: data.judul,
      tahun: data.tahun,
      ringkasan: data.ringkasan,
      cover_url: data.coverUrl,
      pdf_url: data.pdfUrl,
    }),
  }).catch(err => console.error('Error updating publikasi in MySQL:', err));

  return store.publikasi[idx];
}

export function deletePublikasi(id: number): boolean {
  const store = loadStore();
  const before = store.publikasi.length;
  store.publikasi = store.publikasi.filter(p => p.id !== id);
  saveStore(store);

  fetch(`/api/publikasi/${id}`, { method: 'DELETE' })
    .catch(err => console.error('Error deleting publikasi from MySQL:', err));

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

  fetch('/api/potensi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      desa_id: data.desaId,
      judul: data.nama,
      deskripsi: data.deskripsi,
      foto_url: data.fotoUrl,
      kategori: data.kategori,
      sub_kategori: data.subKategori,
    }),
  }).catch(err => console.error('Error inserting potensi to MySQL:', err));

  return item;
}

export function updatePotensi(id: number, data: Partial<Omit<Potensi, 'id'>>): Potensi | null {
  const store = loadStore();
  const idx = store.potensi.findIndex(p => p.id === id);
  if (idx === -1) return null;
  store.potensi[idx] = { ...store.potensi[idx], ...data };
  saveStore(store);

  fetch(`/api/potensi/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      judul: data.nama,
      deskripsi: data.deskripsi,
      foto_url: data.fotoUrl,
      kategori: data.kategori,
      sub_kategori: data.subKategori,
    }),
  }).catch(err => console.error('Error updating potensi in MySQL:', err));

  return store.potensi[idx];
}

export function deletePotensi(id: number): boolean {
  const store = loadStore();
  const before = store.potensi.length;
  store.potensi = store.potensi.filter(p => p.id !== id);
  saveStore(store);

  fetch(`/api/potensi/${id}`, { method: 'DELETE' })
    .catch(err => console.error('Error deleting potensi from MySQL:', err));

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

  fetch('/api/infografis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      desa_id: data.desaId,
      judul: data.judul,
      gambar_url: data.imageUrl,
    }),
  }).catch(err => console.error('Error inserting infografis to MySQL:', err));

  return item;
}

export function updateInfografis(id: number, data: Partial<Omit<Infografis, 'id'>>): Infografis | null {
  const store = loadStore();
  const idx = store.infografis.findIndex(i => i.id === id);
  if (idx === -1) return null;
  store.infografis[idx] = { ...store.infografis[idx], ...data };
  saveStore(store);

  fetch(`/api/infografis/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      judul: data.judul,
      gambar_url: data.imageUrl,
    }),
  }).catch(err => console.error('Error updating infografis in MySQL:', err));

  return store.infografis[idx];
}

export function deleteInfografis(id: number): boolean {
  const store = loadStore();
  const before = store.infografis.length;
  store.infografis = store.infografis.filter(i => i.id !== id);
  saveStore(store);

  fetch(`/api/infografis/${id}`, { method: 'DELETE' })
    .catch(err => console.error('Error deleting infografis from MySQL:', err));

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
    dusunData: [
      { dusun: 'Dusun I', lakiLaki: 350, perempuan: 340 },
      { dusun: 'Dusun II', lakiLaki: 280, perempuan: 290 }
    ]
  };
}

export function saveDemografiLocal(desaId: number, data: Omit<DemografiDesa, 'desaId'>): DemografiDesa {
  const store = loadStore();
  if (!store.demografi) store.demografi = { ...mockDemografi };
  const updatedItem: DemografiDesa = { desaId, ...data };
  store.demografi[desaId] = updatedItem;
  saveStore(store);

  // Sync to MySQL via API
  fetch(`/api/demografi/${desaId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dusun_data: data.dusunData }),
  }).catch(err => console.error('Error saving demografi to MySQL:', err));

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

  // Sync to MySQL via API
  fetch(`/api/mata-pencaharian/${desaId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: items.map(it => ({ nama: it.nama, persentase: it.persentase })),
    }),
  }).catch(err => console.error('Error saving mata_pencaharian to MySQL:', err));

  return items;
}

export function resetStore() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORE_KEY);
  }
}
