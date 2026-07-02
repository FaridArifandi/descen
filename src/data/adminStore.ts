/**
 * adminStore.ts
 * 
 * In-memory + localStorage store untuk CRUD admin (dummy, no database).
 * Semua data diinisialisasi dari mockData, lalu disimpan di localStorage.
 */

import {
  mockDesa,
  mockPublikasi,
  mockPotensi,
  mockInfografis,
  mockKecamatan,
} from '@/data/mockData';
import { Desa, Publikasi, Potensi, Infografis, Kecamatan } from '@/types';

// ---------- types ----------
export interface AdminStore {
  desa: Desa[];
  publikasi: Publikasi[];
  potensi: Potensi[];
  infografis: Infografis[];
  kecamatan: Kecamatan[];
}

const STORE_KEY = 'desacantik_admin_store';
const STORE_VERSION = 'v3'; // bump ini setiap kali mockData berubah signifikan
const VERSION_KEY = 'desacantik_store_version';

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

  // Force reset jika versi berubah
  const storedVersion = localStorage.getItem(VERSION_KEY);
  if (storedVersion !== STORE_VERSION) {
    localStorage.removeItem(STORE_KEY);
    localStorage.setItem(VERSION_KEY, STORE_VERSION);
  }

  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  // Initialize from mock
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

// ---------- Generic CRUD helpers ----------
function nextId<T extends { id: number }>(items: T[]): number {
  return items.length === 0 ? 1 : Math.max(...items.map(x => x.id)) + 1;
}

// ========== DESA ==========
export function getAllDesa(): Desa[] {
  return loadStore().desa;
}
export function createDesa(data: Omit<Desa, 'id'>): Desa {
  const store = loadStore();
  const item = { id: nextId(store.desa), ...data };
  store.desa.push(item);
  saveStore(store);
  return item;
}
export function updateDesa(id: number, data: Partial<Omit<Desa, 'id'>>): Desa | null {
  const store = loadStore();
  const idx = store.desa.findIndex(d => d.id === id);
  if (idx === -1) return null;
  store.desa[idx] = { ...store.desa[idx], ...data };
  saveStore(store);
  return store.desa[idx];
}
export function deleteDesa(id: number): boolean {
  const store = loadStore();
  const before = store.desa.length;
  store.desa = store.desa.filter(d => d.id !== id);
  // also cascade
  store.publikasi = store.publikasi.filter(p => p.desaId !== id);
  store.potensi = store.potensi.filter(p => p.desaId !== id);
  store.infografis = store.infografis.filter(p => p.desaId !== id);
  saveStore(store);
  return store.desa.length < before;
}

// ========== PUBLIKASI ==========
export function getAllPublikasi(desaId?: number): Publikasi[] {
  const store = loadStore();
  return desaId ? store.publikasi.filter(p => p.desaId === desaId) : store.publikasi;
}
export function createPublikasi(data: Omit<Publikasi, 'id'>): Publikasi {
  const store = loadStore();
  const item = { id: nextId(store.publikasi), ...data };
  store.publikasi.push(item);
  saveStore(store);
  return item;
}
export function updatePublikasi(id: number, data: Partial<Omit<Publikasi, 'id'>>): Publikasi | null {
  const store = loadStore();
  const idx = store.publikasi.findIndex(p => p.id === id);
  if (idx === -1) return null;
  store.publikasi[idx] = { ...store.publikasi[idx], ...data };
  saveStore(store);
  return store.publikasi[idx];
}
export function deletePublikasi(id: number): boolean {
  const store = loadStore();
  const before = store.publikasi.length;
  store.publikasi = store.publikasi.filter(p => p.id !== id);
  saveStore(store);
  return store.publikasi.length < before;
}

// ========== POTENSI ==========
export function getAllPotensi(desaId?: number): Potensi[] {
  const store = loadStore();
  return desaId ? store.potensi.filter(p => p.desaId === desaId) : store.potensi;
}
export function createPotensi(data: Omit<Potensi, 'id'>): Potensi {
  const store = loadStore();
  const item = { id: nextId(store.potensi), ...data };
  store.potensi.push(item);
  saveStore(store);
  return item;
}
export function updatePotensi(id: number, data: Partial<Omit<Potensi, 'id'>>): Potensi | null {
  const store = loadStore();
  const idx = store.potensi.findIndex(p => p.id === id);
  if (idx === -1) return null;
  store.potensi[idx] = { ...store.potensi[idx], ...data };
  saveStore(store);
  return store.potensi[idx];
}
export function deletePotensi(id: number): boolean {
  const store = loadStore();
  const before = store.potensi.length;
  store.potensi = store.potensi.filter(p => p.id !== id);
  saveStore(store);
  return store.potensi.length < before;
}

// ========== INFOGRAFIS ==========
export function getAllInfografis(desaId?: number): Infografis[] {
  const store = loadStore();
  return desaId ? store.infografis.filter(i => i.desaId === desaId) : store.infografis;
}
export function createInfografis(data: Omit<Infografis, 'id'>): Infografis {
  const store = loadStore();
  const item = { id: nextId(store.infografis), ...data };
  store.infografis.push(item);
  saveStore(store);
  return item;
}
export function updateInfografis(id: number, data: Partial<Omit<Infografis, 'id'>>): Infografis | null {
  const store = loadStore();
  const idx = store.infografis.findIndex(i => i.id === id);
  if (idx === -1) return null;
  store.infografis[idx] = { ...store.infografis[idx], ...data };
  saveStore(store);
  return store.infografis[idx];
}
export function deleteInfografis(id: number): boolean {
  const store = loadStore();
  const before = store.infografis.length;
  store.infografis = store.infografis.filter(i => i.id !== id);
  saveStore(store);
  return store.infografis.length < before;
}

export function getKecamatanAll(): Kecamatan[] {
  return loadStore().kecamatan;
}

export function resetStore() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORE_KEY);
  }
}
