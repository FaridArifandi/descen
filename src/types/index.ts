export interface Kecamatan {
  id: number;
  nama: string;
}

export interface Desa {
  id: number;
  nama: string;
  kecamatanId: number;
  tahunPembinaan: number;
  fotoCover: string;
  profilAbstrak: string;
  profilFileUrl: string;
  monografiAbstrak: string;
  monografiFileUrl: string;
  latitude: number;
  longitude: number;
}

export interface Publikasi {
  id: number;
  desaId: number;
  judul: string;
  tahun: number;
  ringkasan: string;
  coverUrl: string;
  pdfUrl: string;
}

export interface Potensi {
  id: number;
  desaId: number;
  kategori: 'ekonomi' | 'wisata' | 'investasi';
  subKategori: string;
  nama: string;
  deskripsi: string;
  fotoUrl?: string;
  videoUrl?: string;
}

export interface Infografis {
  id: number;
  desaId: number;
  judul: string;
  imageUrl: string;
  pdfUrl: string;
}

export interface DashboardStats {
  totalDesa: number;
  totalPublikasi: number;
  totalInfografis: number;
  totalPotensi: number;
}

export interface DemografiDesa {
  id?: number;
  desaId: number;
  umur0_14: number;
  umur15_29: number;
  umur30_44: number;
  umur45_59: number;
  umur60Plus: number;
}

export interface MataPencaharianItem {
  id?: number;
  desaId: number;
  nama: string;
  persentase: number;
}

