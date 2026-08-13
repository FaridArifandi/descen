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

// ── DEMOGRAFI (DUSUN & SEBARAN LAKI-LAKI/PEREMPUAN) ──
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

    const dusunData = data.dusun_data ? (typeof data.dusun_data === 'string' ? JSON.parse(data.dusun_data) : data.dusun_data) : undefined;

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
    const { data: dbRes, error } = await supabase
      .from('demografi')
      .upsert({
        desa_id: desaId,
        dusun_data: data.dusunData,
      }, { onConflict: 'desa_id' })
      .select()
      .single();

    if (!error && dbRes) {
      const parsedDusun = dbRes.dusun_data ? (typeof dbRes.dusun_data === 'string' ? JSON.parse(dbRes.dusun_data) : dbRes.dusun_data) : data.dusunData;
      return {
        id: dbRes.id,
        desaId: dbRes.desa_id,
        dusunData: parsedDusun,
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

