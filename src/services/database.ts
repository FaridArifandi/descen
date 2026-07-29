import { supabase } from '@/lib/supabase';
import { Kecamatan, Desa, Publikasi, Potensi, Infografis, DemografiDesa, MataPencaharianItem } from '@/types';
import { mockKecamatan, mockDesa, mockPublikasi, mockPotensi, mockInfografis } from '@/data/mockData';
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
function withTimeout<T>(promise: PromiseLike<T>, ms = 2000): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Network timeout')), ms);
    Promise.resolve(promise).then(
      res => { clearTimeout(timer); resolve(res); },
      err => { clearTimeout(timer); reject(err); }
    );
  });
}

// ── FAST SYNCHRONOUS GETTERS (0ms Instant Cache) ──
export function getKecamatanSync(): Kecamatan[] {
  const local = getKecamatanAll();
  return local.length > 0 ? local : mockKecamatan;
}

export function getDesaListSync(): Desa[] {
  const local = getAllDesa();
  return local.length > 0 ? local : mockDesa;
}

export function getPublikasiSync(): Publikasi[] {
  const local = getAllPublikasi();
  return local.length > 0 ? local : mockPublikasi;
}

export function getPotensiSync(): Potensi[] {
  const local = getAllPotensi();
  return local.length > 0 ? local : mockPotensi;
}

export function getInfografisSync(): Infografis[] {
  const local = getAllInfografis();
  return local.length > 0 ? local : mockInfografis;
}

export function getDemografiSync(desaId: number): DemografiDesa {
  return getDemografiLocal(desaId);
}

export function getMataPencaharianSync(desaId: number): MataPencaharianItem[] {
  return getMataPencaharianLocal(desaId);
}

// ── KECAMATAN ──
export async function getKecamatan(): Promise<Kecamatan[]> {
  try {
    const res = await withTimeout(supabase.from('kecamatan').select('*').order('id', { ascending: true }));
    const { data, error } = res;
    if (error || !data || data.length === 0) {
      return getKecamatanSync();
    }
    return data.map(item => ({
      id: item.id,
      nama: item.nama,
    }));
  } catch {
    return getKecamatanSync();
  }
}

// ── DESA ──
export async function getDesaList(): Promise<Desa[]> {
  try {
    const res = await withTimeout(supabase.from('desa').select('*').order('id', { ascending: true }));
    const { data, error } = res;
    if (error || !data || data.length === 0) {
      return getDesaListSync();
    }
    return data.map(d => ({
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
  } catch {
    return getDesaListSync();
  }
}

export async function createDesa(desaData: Omit<Desa, 'id'>): Promise<Desa | null> {
  const { data, error } = await supabase.from('desa').insert([{
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
  }]).select().single();

  if (error || !data) return null;

  return {
    id: data.id,
    nama: data.nama,
    kecamatanId: data.kecamatan_id,
    tahunPembinaan: data.tahun_pembinaan,
    fotoCover: data.foto_cover || '',
    profilAbstrak: data.profil_abstrak || '',
    profilFileUrl: data.profil_file_url || '#',
    monografiAbstrak: data.monografi_abstrak || '',
    monografiFileUrl: data.monografi_file_url || '#',
    latitude: Number(data.latitude) || 0,
    longitude: Number(data.longitude) || 0,
  };
}

export async function updateDesa(id: number, desaData: Partial<Desa>): Promise<boolean> {
  const updatePayload: Record<string, unknown> = {};
  if (desaData.nama !== undefined) updatePayload.nama = desaData.nama;
  if (desaData.kecamatanId !== undefined) updatePayload.kecamatan_id = desaData.kecamatanId;
  if (desaData.tahunPembinaan !== undefined) updatePayload.tahun_pembinaan = desaData.tahunPembinaan;
  if (desaData.fotoCover !== undefined) updatePayload.foto_cover = desaData.fotoCover;
  if (desaData.profilAbstrak !== undefined) updatePayload.profil_abstrak = desaData.profilAbstrak;
  if (desaData.profilFileUrl !== undefined) updatePayload.profil_file_url = desaData.profilFileUrl;
  if (desaData.monografiAbstrak !== undefined) updatePayload.monografi_abstrak = desaData.monografiAbstrak;
  if (desaData.monografiFileUrl !== undefined) updatePayload.monografi_file_url = desaData.monografiFileUrl;
  if (desaData.latitude !== undefined) updatePayload.latitude = desaData.latitude;
  if (desaData.longitude !== undefined) updatePayload.longitude = desaData.longitude;

  const { error } = await supabase.from('desa').update(updatePayload).eq('id', id);
  return !error;
}

export async function deleteDesa(id: number): Promise<boolean> {
  const { error } = await supabase.from('desa').delete().eq('id', id);
  return !error;
}

// ── PUBLIKASI ──
export async function getPublikasi(): Promise<Publikasi[]> {
  try {
    const res = await withTimeout(supabase.from('publikasi').select('*').order('id', { ascending: true }));
    const { data, error } = res;
    if (error || !data || data.length === 0) {
      return getPublikasiSync();
    }
    return data.map(p => ({
      id: p.id,
      desaId: p.desa_id,
      judul: p.judul,
      tahun: p.tahun,
      ringkasan: p.ringkasan || '',
      coverUrl: p.cover_url || '',
      pdfUrl: p.pdf_url || '#',
    }));
  } catch {
    return getPublikasiSync();
  }
}

// ── POTENSI ──
export async function getPotensi(): Promise<Potensi[]> {
  try {
    const res = await withTimeout(supabase.from('potensi').select('*').order('id', { ascending: true }));
    const { data, error } = res;
    if (error || !data || data.length === 0) {
      return getPotensiSync();
    }
    return data.map(pt => ({
      id: pt.id,
      desaId: pt.desa_id,
      kategori: pt.kategori || 'ekonomi',
      subKategori: '',
      nama: pt.judul,
      deskripsi: pt.deskripsi || '',
      fotoUrl: pt.foto_url || '',
    }));
  } catch {
    return getPotensiSync();
  }
}

// ── INFOGRAFIS ──
export async function getInfografis(): Promise<Infografis[]> {
  try {
    const res = await withTimeout(supabase.from('infografis').select('*').order('id', { ascending: true }));
    const { data, error } = res;
    if (error || !data || data.length === 0) {
      return getInfografisSync();
    }
    return data.map(ig => ({
      id: ig.id,
      desaId: ig.desa_id,
      judul: ig.judul,
      imageUrl: ig.gambar_url || '',
      pdfUrl: '#',
    }));
  } catch {
    return getInfografisSync();
  }
}

// ── DEMOGRAFI (KELOMPOK UMUR) ──
export async function getDemografiByDesaId(desaId: number): Promise<DemografiDesa> {
  try {
    const res = await withTimeout(
      supabase
        .from('demografi')
        .select('*')
        .eq('desa_id', desaId)
        .single()
    );
    const { data, error } = res;

    if (error || !data) return getDemografiSync(desaId);

    return {
      id: data.id,
      desaId: data.desa_id,
      umur0_14: Number(data.umur_0_14) || 0,
      umur15_29: Number(data.umur_15_29) || 0,
      umur30_44: Number(data.umur_30_44) || 0,
      umur45_59: Number(data.umur_45_59) || 0,
      umur60Plus: Number(data.umur_60_plus) || 0,
    };
  } catch {
    return getDemografiSync(desaId);
  }
}

export async function saveDemografiByDesaId(desaId: number, data: Omit<DemografiDesa, 'desaId'>): Promise<DemografiDesa> {
  saveDemografiLocal(desaId, data);
  try {
    const { data: dbRes, error } = await supabase
      .from('demografi')
      .upsert({
        desa_id: desaId,
        umur_0_14: data.umur0_14,
        umur_15_29: data.umur15_29,
        umur_30_44: data.umur30_44,
        umur_45_59: data.umur45_59,
        umur_60_plus: data.umur60Plus,
      }, { onConflict: 'desa_id' })
      .select()
      .single();

    if (!error && dbRes) {
      return {
        id: dbRes.id,
        desaId: dbRes.desa_id,
        umur0_14: Number(dbRes.umur_0_14) || 0,
        umur15_29: Number(dbRes.umur_15_29) || 0,
        umur30_44: Number(dbRes.umur_30_44) || 0,
        umur45_59: Number(dbRes.umur_45_59) || 0,
        umur60Plus: Number(dbRes.umur_60_plus) || 0,
      };
    }
  } catch (err) {
    console.warn('Supabase save demografi fallback:', err);
  }
  return { desaId, ...data };
}

// ── MATA PENCAHARIAN ──
export async function getMataPencaharianByDesaId(desaId: number): Promise<MataPencaharianItem[]> {
  try {
    const res = await withTimeout(
      supabase
        .from('mata_pencaharian')
        .select('*')
        .eq('desa_id', desaId)
        .order('id', { ascending: true })
    );
    const { data, error } = res;

    if (error || !data || data.length === 0) return getMataPencaharianSync(desaId);

    return data.map(item => ({
      id: item.id,
      desaId: item.desa_id,
      nama: item.nama,
      persentase: Number(item.persentase) || 0,
    }));
  } catch {
    return getMataPencaharianSync(desaId);
  }
}

export async function saveMataPencaharianByDesaId(desaId: number, items: MataPencaharianItem[]): Promise<MataPencaharianItem[]> {
  saveMataPencaharianLocal(desaId, items);
  try {
    await supabase.from('mata_pencaharian').delete().eq('desa_id', desaId);
    if (items.length > 0) {
      const payload = items.map(it => ({
        desa_id: desaId,
        nama: it.nama,
        persentase: it.persentase,
      }));
      await supabase.from('mata_pencaharian').insert(payload);
    }
  } catch (err) {
    console.warn('Supabase save mata pencaharian fallback:', err);
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
    const { error } = await supabase.from('pesan_kontak').insert([{
      nama: pesan.nama,
      email: pesan.email,
      subjek: pesan.subjek,
      isi: pesan.isi,
      created_at: new Date().toISOString()
    }]);
    return !error;
  } catch {
    return false;
  }
}

