import { supabase } from '@/lib/supabase';
import { Kecamatan, Desa, Publikasi, Potensi, Infografis } from '@/types';
import { mockKecamatan, mockDesa, mockPublikasi, mockPotensi, mockInfografis } from '@/data/mockData';

// ── KECAMATAN ──
export async function getKecamatan(): Promise<Kecamatan[]> {
  try {
    const { data, error } = await supabase.from('kecamatan').select('*').order('id', { ascending: true });
    if (error || !data || data.length === 0) return mockKecamatan;
    return data.map(item => ({
      id: item.id,
      nama: item.nama,
    }));
  } catch {
    return mockKecamatan;
  }
}

// ── DESA ──
export async function getDesaList(): Promise<Desa[]> {
  try {
    const { data, error } = await supabase.from('desa').select('*').order('id', { ascending: true });
    if (error || !data || data.length === 0) return mockDesa;
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
    return mockDesa;
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
    const { data, error } = await supabase.from('publikasi').select('*').order('id', { ascending: true });
    if (error || !data || data.length === 0) return mockPublikasi;
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
    return mockPublikasi;
  }
}

// ── POTENSI ──
export async function getPotensi(): Promise<Potensi[]> {
  try {
    const { data, error } = await supabase.from('potensi').select('*').order('id', { ascending: true });
    if (error || !data || data.length === 0) return mockPotensi;
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
    return mockPotensi;
  }
}

// ── INFOGRAFIS ──
export async function getInfografis(): Promise<Infografis[]> {
  try {
    const { data, error } = await supabase.from('infografis').select('*').order('id', { ascending: true });
    if (error || !data || data.length === 0) return mockInfografis;
    return data.map(ig => ({
      id: ig.id,
      desaId: ig.desa_id,
      judul: ig.judul,
      imageUrl: ig.gambar_url || '',
      pdfUrl: '#',
    }));
  } catch {
    return mockInfografis;
  }
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

