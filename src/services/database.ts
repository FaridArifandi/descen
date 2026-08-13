/**
 * database.ts
 *
 * Service layer — fetches data from Next.js API Routes (backed by MySQL).
 * Replaces the previous Supabase client-side SDK approach.
 *
 * - Read functions: fetch from /api/... with localStorage cache fallback
 * - Write functions: POST/PUT/DELETE to /api/... with local store sync
 */

import { Kecamatan, Desa, Publikasi, Potensi, Infografis, DemografiDesa, MataPencaharianItem } from '@/types';
import { mockKecamatan, mockDesa, mockPublikasi, mockPotensi, mockInfografis, mockDemografi, mockMataPencaharian } from '@/data/mockData';
import {
  getAllDesa,
  getAllPublikasi,
  getAllPotensi,
  getAllInfografis,
  getKecamatanAll,
  getDemografiLocal,
  saveDemografiLocal,
  getMataPencaharianLocal,
  saveMataPencaharianLocal,
} from '@/data/adminStore';

// ── TIMEOUT HELPER ──
function withTimeout<T>(promise: Promise<T>, ms = 5000): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Network timeout')), ms);
    promise.then(
      res => { clearTimeout(timer); resolve(res); },
      err => { clearTimeout(timer); reject(err); }
    );
  });
}

// ── FAST SYNCHRONOUS GETTERS (0ms Instant Cache) ──
export function getKecamatanSync(): Kecamatan[] {
  const local = getKecamatanAll();
  return local && local.length > 0 ? local : mockKecamatan;
}

export function getDesaListSync(): Desa[] {
  return getAllDesa();
}

export function getPublikasiSync(): Publikasi[] {
  return getAllPublikasi();
}

export function getPotensiSync(): Potensi[] {
  return getAllPotensi();
}

export function getInfografisSync(): Infografis[] {
  return getAllInfografis();
}

export function getDemografiSync(desaId: number): DemografiDesa {
  return getDemografiLocal(desaId);
}

export function getMataPencaharianSync(desaId: number): MataPencaharianItem[] {
  return getMataPencaharianLocal(desaId);
}

// ── Helper: map MySQL row → frontend type ──
function mapDesa(d: Record<string, unknown>): Desa {
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

function mapPublikasi(p: Record<string, unknown>): Publikasi {
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

function mapPotensi(pt: Record<string, unknown>): Potensi {
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

function mapInfografis(ig: Record<string, unknown>): Infografis {
  return {
    id: ig.id as number,
    desaId: (ig.desa_id as number) || 0,
    judul: (ig.judul as string) || '',
    imageUrl: (ig.gambar_url as string) || '',
    pdfUrl: '#',
  };
}

function mapMataPencaharian(item: Record<string, unknown>): MataPencaharianItem {
  return {
    id: item.id as number,
    desaId: (item.desa_id as number) || 0,
    nama: (item.nama as string) || '',
    persentase: Number(item.persentase) || 0,
  };
}

// ── KECAMATAN ──
export async function getKecamatan(): Promise<Kecamatan[]> {
  try {
    const res = await withTimeout(fetch('/api/kecamatan'));
    if (!res.ok) return getKecamatanSync();
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return getKecamatanSync();
    return data.map((item: Record<string, unknown>) => ({
      id: item.id as number,
      nama: item.nama as string,
    }));
  } catch {
    return getKecamatanSync();
  }
}

// ── DESA ──
export async function getDesaList(): Promise<Desa[]> {
  try {
    const res = await withTimeout(fetch('/api/desa'));
    if (!res.ok) return getDesaListSync();
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return getDesaListSync();
    return data.map(mapDesa);
  } catch {
    return getDesaListSync();
  }
}

export async function createDesa(desaData: Omit<Desa, 'id'>): Promise<Desa | null> {
  try {
    const res = await fetch('/api/desa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nama: desaData.nama,
        kecamatan_id: desaData.kecamatanId,
        tahun_pembinaan: desaData.tahunPembinaan,
        foto_cover: desaData.fotoCover,
        profil_abstrak: desaData.profilAbstrak,
        profil_file_url: desaData.profilFileUrl,
        monografi_abstrak: desaData.monografiAbstrak,
        monografi_file_url: desaData.monografiFileUrl,
        latitude: desaData.latitude,
        longitude: desaData.longitude,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return mapDesa(data);
  } catch {
    return null;
  }
}

export async function updateDesa(id: number, desaData: Partial<Desa>): Promise<boolean> {
  try {
    const payload: Record<string, unknown> = {};
    if (desaData.nama !== undefined) payload.nama = desaData.nama;
    if (desaData.kecamatanId !== undefined) payload.kecamatan_id = desaData.kecamatanId;
    if (desaData.tahunPembinaan !== undefined) payload.tahun_pembinaan = desaData.tahunPembinaan;
    if (desaData.fotoCover !== undefined) payload.foto_cover = desaData.fotoCover;
    if (desaData.profilAbstrak !== undefined) payload.profil_abstrak = desaData.profilAbstrak;
    if (desaData.profilFileUrl !== undefined) payload.profil_file_url = desaData.profilFileUrl;
    if (desaData.monografiAbstrak !== undefined) payload.monografi_abstrak = desaData.monografiAbstrak;
    if (desaData.monografiFileUrl !== undefined) payload.monografi_file_url = desaData.monografiFileUrl;
    if (desaData.latitude !== undefined) payload.latitude = desaData.latitude;
    if (desaData.longitude !== undefined) payload.longitude = desaData.longitude;

    const res = await fetch(`/api/desa/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function deleteDesa(id: number): Promise<boolean> {
  try {
    const res = await fetch(`/api/desa/${id}`, { method: 'DELETE' });
    return res.ok;
  } catch {
    return false;
  }
}

// ── PUBLIKASI ──
export async function getPublikasi(): Promise<Publikasi[]> {
  try {
    const res = await withTimeout(fetch('/api/publikasi'));
    if (!res.ok) return getPublikasiSync();
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return getPublikasiSync();
    return data.map(mapPublikasi);
  } catch {
    return getPublikasiSync();
  }
}

// ── POTENSI ──
export async function getPotensi(): Promise<Potensi[]> {
  try {
    const res = await withTimeout(fetch('/api/potensi'));
    if (!res.ok) return getPotensiSync();
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return getPotensiSync();
    return data.map(mapPotensi);
  } catch {
    return getPotensiSync();
  }
}

// ── INFOGRAFIS ──
export async function getInfografis(): Promise<Infografis[]> {
  try {
    const res = await withTimeout(fetch('/api/infografis'));
    if (!res.ok) return getInfografisSync();
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return getInfografisSync();
    return data.map(mapInfografis);
  } catch {
    return getInfografisSync();
  }
}

// ── DEMOGRAFI (DUSUN & SEBARAN LAKI-LAKI/PEREMPUAN) ──
export async function getDemografiByDesaId(desaId: number): Promise<DemografiDesa> {
  try {
    const res = await withTimeout(fetch(`/api/demografi/${desaId}`));
    if (!res.ok) return getDemografiSync(desaId);
    const data = await res.json();

    let dusunData = data.dusun_data;
    if (typeof dusunData === 'string') {
      dusunData = JSON.parse(dusunData);
    }

    if (dusunData && Array.isArray(dusunData) && dusunData.length > 0) {
      return {
        id: data.id,
        desaId: data.desa_id,
        dusunData,
      };
    }

    return getDemografiSync(desaId);
  } catch {
    return getDemografiSync(desaId);
  }
}

export async function saveDemografiByDesaId(desaId: number, data: Omit<DemografiDesa, 'desaId'>): Promise<DemografiDesa> {
  saveDemografiLocal(desaId, data);
  try {
    const res = await fetch(`/api/demografi/${desaId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dusun_data: data.dusunData }),
    });

    if (res.ok) {
      const dbRes = await res.json();
      let parsedDusun = dbRes.dusun_data;
      if (typeof parsedDusun === 'string') parsedDusun = JSON.parse(parsedDusun);
      return {
        id: dbRes.id,
        desaId: dbRes.desa_id,
        dusunData: parsedDusun,
      };
    }
  } catch (err) {
    console.warn('MySQL save demografi fallback:', err);
  }
  return { desaId, ...data };
}

// ── MATA PENCAHARIAN ──
export async function getMataPencaharianByDesaId(desaId: number): Promise<MataPencaharianItem[]> {
  try {
    const res = await withTimeout(fetch(`/api/mata-pencaharian/${desaId}`));
    if (!res.ok) return getMataPencaharianSync(desaId);
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return getMataPencaharianSync(desaId);
    return data.map(mapMataPencaharian);
  } catch {
    return getMataPencaharianSync(desaId);
  }
}

export async function saveMataPencaharianByDesaId(desaId: number, items: MataPencaharianItem[]): Promise<MataPencaharianItem[]> {
  saveMataPencaharianLocal(desaId, items);
  try {
    await fetch(`/api/mata-pencaharian/${desaId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: items.map(it => ({ nama: it.nama, persentase: it.persentase })) }),
    });
  } catch (err) {
    console.warn('MySQL save mata pencaharian fallback:', err);
  }
  return items;
}

// ── DASHBOARD & HELPER STATS ──
export async function getDashboardStatsFromDb() {
  const [desa, publikasi, infografis, potensi] = await Promise.all([
    getDesaList(),
    getPublikasi(),
    getInfografis(),
    getPotensi()
  ]);
  return {
    totalDesa: desa.length,
    totalPublikasi: publikasi.length,
    totalInfografis: infografis.length,
    totalPotensi: potensi.length
  };
}

export async function getDesaById(id: number): Promise<Desa | undefined> {
  const desaList = await getDesaList();
  return desaList.find(d => d.id === id);
}

// ── PESAN KONTAK ──
export async function createPesanKontak(pesan: {
  nama: string;
  email: string;
  subjek: string;
  isi: string;
}): Promise<boolean> {
  try {
    const res = await fetch('/api/kontak', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pesan),
    });
    return res.ok;
  } catch {
    return false;
  }
}
