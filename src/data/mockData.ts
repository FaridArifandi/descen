import { Kecamatan, Desa, Publikasi, Potensi, Infografis, DemografiDesa, MataPencaharianItem } from '@/types';

export const mockKecamatan: Kecamatan[] = [
  { id: 1, nama: 'Simpang Kiri' },
  { id: 2, nama: 'Penanggalan' },
  { id: 3, nama: 'Rundeng' },
  { id: 4, nama: 'Sultan Daulat' },
  { id: 5, nama: 'Longkib' }
];

// Menggunakan picsum.photos sebagai image host yang stabil dan reliable
// Format: https://picsum.photos/seed/<keyword>/800/500
export const mockDesa: Desa[] = [
  {
    id: 1,
    nama: 'Desa Penanggalan Barat',
    kecamatanId: 2,
    tahunPembinaan: 2026,
    fotoCover: 'https://picsum.photos/seed/penanggalan-barat/800/500',
    profilAbstrak: 'Desa Penanggalan Barat terletak di Kecamatan Penanggalan, Kota Subulussalam. Merupakan salah satu desa fokus pembinaan Desa Cinta Statistik (Desa Cantik) dengan pengembangan basis data statistik potensi lokal, UMKM, serta pelayanan publik berbasis data kependudukan.',
    profilFileUrl: '#',
    monografiAbstrak: 'Monografi Desa Penanggalan Barat menyajikan gambaran kependudukan lengkap, wilayah administrasi, struktur mata pencaharian masyarakat, dan sarana prasarana desa terkini.',
    monografiFileUrl: '#',
    latitude: 2.5761,
    longitude: 98.0289
  },
  {
    id: 2,
    nama: 'Desa Lae Bersih',
    kecamatanId: 1,
    tahunPembinaan: 2026,
    fotoCover: 'https://picsum.photos/seed/lae-bersih/800/500',
    profilAbstrak: 'Desa Lae Bersih terletak di kawasan Kecamatan Simpang Kiri. Pembinaan statistik difokuskan pada optimalisasi data sektor pertanian, tata kelola kependudukan, serta pemetaan potensi wilayah demi mendukung perencanaan pembangunan desa.',
    profilFileUrl: '#',
    monografiAbstrak: 'Dokumen monografi mencakup data kepemilikan lahan pertanian, statistik tenaga kerja, fasilitas pendidikan, dan tingkat kesejahteraan masyarakat Desa Lae Bersih.',
    monografiFileUrl: '#',
    latitude: 2.6375,
    longitude: 98.0125
  },
  {
    id: 3,
    nama: 'Desa Sikelang',
    kecamatanId: 1,
    tahunPembinaan: 2026,
    fotoCover: 'https://picsum.photos/seed/sikelang/800/500',
    profilAbstrak: 'Desa Sikelang merupakan desa binaan Desa Cantik di Kecamatan Simpang Kiri dengan keunggulan sektor perkebunan dan UMKM. Fokus pembinaan statistik diarahkan pada digitalisasi data desa dan statistik ekonomi kerakyatan.',
    profilFileUrl: '#',
    monografiAbstrak: 'Monografi Desa Sikelang memuat struktur demografi penduduk, profil usaha mikro kecil menengah, potensi komoditas lokal, serta indikator pelayanan statistik desa.',
    monografiFileUrl: '#',
    latitude: 2.5980,
    longitude: 98.0210
  }
];

export const mockPublikasi: Publikasi[] = [
  {
    id: 1,
    desaId: 1,
    judul: 'Desa Penanggalan Barat Dalam Angka 2026',
    tahun: 2026,
    ringkasan: 'Buku Publikasi Desa Penanggalan Barat Dalam Angka 2026 menyajikan statistik kependudukan, fasilitas pendidikan, kesehatan, serta perkembangan ekonomi desa sepanjang tahun pembinaan.',
    coverUrl: 'https://picsum.photos/seed/book-cover-pb1/400/560',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
  {
    id: 2,
    desaId: 1,
    judul: 'Desa Penanggalan Barat Dalam Angka 2025',
    tahun: 2025,
    ringkasan: 'Publikasi edisi 2025 yang memuat data dasar geografi desa, iklim, struktur aparatur desa, serta statistik sarana prasarana fisik desa.',
    coverUrl: 'https://picsum.photos/seed/book-cover-pb2/400/560',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
  {
    id: 3,
    desaId: 2,
    judul: 'Desa Lae Bersih Dalam Angka 2026',
    tahun: 2026,
    ringkasan: 'Publikasi komprehensif hasil pembinaan Desa Cantik tahun 2026, menitikberatkan pada data pertanian, pola tanam, dan produktivitas komoditas pangan.',
    coverUrl: 'https://picsum.photos/seed/book-cover-lb1/400/560',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
  {
    id: 4,
    desaId: 2,
    judul: 'Desa Lae Bersih Dalam Angka 2025',
    tahun: 2025,
    ringkasan: 'Buku statistik tahunan Desa Lae Bersih mencakup demografi penduduk, fasilitas sosial, dan gambaran umum mata pencaharian warga.',
    coverUrl: 'https://picsum.photos/seed/book-cover-lb2/400/560',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
  {
    id: 5,
    desaId: 3,
    judul: 'Desa Sikelang Dalam Angka 2026',
    tahun: 2026,
    ringkasan: 'Publikasi data berkala Desa Sikelang tahun 2026. Menampilkan statistik perkebunan rakyat, UMKM desa, dan hasil pendataan kependudukan.',
    coverUrl: 'https://picsum.photos/seed/book-cover-sk1/400/560',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
  {
    id: 6,
    desaId: 3,
    judul: 'Desa Sikelang Dalam Angka 2025',
    tahun: 2025,
    ringkasan: 'Publikasi edisi 2025 yang berisi profil statistik wilayah, indikator ekonomi desa, serta sarana prasarana umum.',
    coverUrl: 'https://picsum.photos/seed/book-cover-sk2/400/560',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  }
];

export const mockPotensi: Potensi[] = [
  // Desa Penanggalan Barat
  {
    id: 1,
    desaId: 1,
    kategori: 'ekonomi',
    subKategori: 'UMKM',
    nama: 'Sentra Kerajinan & Olahan Kuliner Lokal',
    deskripsi: 'Desa Penanggalan Barat memiliki sentra UMKM kuliner khas dan kerajinan tangan yang menyerap tenaga kerja produktif di lingkungan desa.',
    fotoUrl: 'https://picsum.photos/seed/craft-market-pb/800/600'
  },
  {
    id: 2,
    desaId: 1,
    kategori: 'wisata',
    subKategori: 'Wisata Alam & Budaya',
    nama: 'Kawasan Wisata Alam Penanggalan Barat',
    deskripsi: 'Potensi lanskap alam dan budaya lokal yang asri, menawarkan wisata panorama alam dan kegiatan kemasyarakatan.',
    fotoUrl: 'https://picsum.photos/seed/nature-pb/800/600'
  },
  // Desa Lae Bersih
  {
    id: 3,
    desaId: 2,
    kategori: 'ekonomi',
    subKategori: 'Pertanian',
    nama: 'Sentra Pertanian Pangan & Hortikultura',
    deskripsi: 'Kawasan pertanian subur yang memproduksi komoditas tanaman pangan dan sayuran segar dengan sistem pengelolaan kelompok tani.',
    fotoUrl: 'https://picsum.photos/seed/rice-paddy-lb/800/600'
  },
  {
    id: 4,
    desaId: 2,
    kategori: 'investasi',
    subKategori: 'Produk Unggulan',
    nama: 'Pengolahan Minyak Nilam & Hasil Tani',
    deskripsi: 'Penyulingan minyak nilam rakyat dan unit usaha pengolahan hasil panen unggulan Desa Lae Bersih.',
    fotoUrl: 'https://picsum.photos/seed/essential-oil-lb/800/600'
  },
  // Desa Sikelang
  {
    id: 5,
    desaId: 3,
    kategori: 'ekonomi',
    subKategori: 'Perkebunan',
    nama: 'Kawasan Perkebunan Rakyat Sikelang',
    deskripsi: 'Sentra perkebunan kelapa sawit dan komoditas perkebunan rakyat yang menjadi penopang utama ekonomi masyarakat Sikelang.',
    fotoUrl: 'https://picsum.photos/seed/palm-plantation-sk/800/600'
  },
  {
    id: 6,
    desaId: 3,
    kategori: 'investasi',
    subKategori: 'Produk Unggulan',
    nama: 'Sentra Industri Kecil & Perdagangan Desa',
    deskripsi: 'Pengembangan unit usaha perdagangan dan industri skala rumah tangga di sepanjang jalur utama Desa Sikelang.',
    fotoUrl: 'https://picsum.photos/seed/trade-sk/800/600'
  }
];

export const mockInfografis: Infografis[] = [
  {
    id: 1,
    desaId: 1,
    judul: 'Infografis Demografi Penduduk Penanggalan Barat 2026',
    imageUrl: 'https://picsum.photos/seed/infografis-pb1/800/600',
    pdfUrl: '#'
  },
  {
    id: 2,
    desaId: 1,
    judul: 'Infografis Sebaran UMKM Penanggalan Barat',
    imageUrl: 'https://picsum.photos/seed/infografis-pb2/800/600',
    pdfUrl: '#'
  },
  {
    id: 3,
    desaId: 2,
    judul: 'Infografis Demografi & Pertanian Lae Bersih 2026',
    imageUrl: 'https://picsum.photos/seed/infografis-lb1/800/600',
    pdfUrl: '#'
  },
  {
    id: 4,
    desaId: 2,
    judul: 'Infografis Sarana & Prasarana Desa Lae Bersih',
    imageUrl: 'https://picsum.photos/seed/infografis-lb2/800/600',
    pdfUrl: '#'
  },
  {
    id: 5,
    desaId: 3,
    judul: 'Infografis Statistik Kependudukan Desa Sikelang 2026',
    imageUrl: 'https://picsum.photos/seed/infografis-sk1/800/600',
    pdfUrl: '#'
  },
  {
    id: 6,
    desaId: 3,
    judul: 'Infografis Potensi Perkebunan & UMKM Sikelang',
    imageUrl: 'https://picsum.photos/seed/infografis-sk2/800/600',
    pdfUrl: '#'
  }
];

// Helper to get dashboard counts
export const getDashboardStats = () => {
  return {
    totalDesa: mockDesa.length,
    totalPublikasi: mockPublikasi.length,
    totalInfografis: mockInfografis.length,
    totalPotensi: mockPotensi.length
  };
};

export const mockDemografi: Record<number, DemografiDesa> = {
  1: {
    desaId: 1,
    dusunData: [
      { dusun: 'Dusun Pemancar', lakiLaki: 397, perempuan: 395 },
      { dusun: 'Dusun Silak', lakiLaki: 387, perempuan: 341 },
      { dusun: 'Dusun Gapa', lakiLaki: 150, perempuan: 181 },
      { dusun: 'Dusun Nurul Iman', lakiLaki: 160, perempuan: 182 }
    ]
  },
  2: {
    desaId: 2,
    dusunData: [
      { dusun: 'Dusun Lae Bersih I', lakiLaki: 410, perempuan: 390 },
      { dusun: 'Dusun Lae Bersih II', lakiLaki: 350, perempuan: 360 },
      { dusun: 'Dusun Sukajaya', lakiLaki: 280, perempuan: 295 }
    ]
  },
  3: {
    desaId: 3,
    dusunData: [
      { dusun: 'Dusun Sikelang Indah', lakiLaki: 450, perempuan: 430 },
      { dusun: 'Dusun Makmur', lakiLaki: 380, perempuan: 370 },
      { dusun: 'Dusun Sejahtera', lakiLaki: 320, perempuan: 340 }
    ]
  },
};

export const mockMataPencaharian: Record<number, MataPencaharianItem[]> = {
  1: [
    { desaId: 1, nama: 'Petani & Perkebunan', persentase: 40 },
    { desaId: 1, nama: 'Pedagang / UMKM', persentase: 25 },
    { desaId: 1, nama: 'PNS/TNI/Polri', persentase: 10 },
    { desaId: 1, nama: 'Pekerja Jasa', persentase: 15 },
    { desaId: 1, nama: 'Lainnya', persentase: 10 },
  ],
  2: [
    { desaId: 2, nama: 'Petani Pangan', persentase: 55 },
    { desaId: 2, nama: 'Pedagang', persentase: 20 },
    { desaId: 2, nama: 'PNS/TNI/Polri', persentase: 10 },
    { desaId: 2, nama: 'Pekerja Jasa', persentase: 10 },
    { desaId: 2, nama: 'Lainnya', persentase: 5 },
  ],
  3: [
    { desaId: 3, nama: 'Pekebun Sawit & Petani', persentase: 50 },
    { desaId: 3, nama: 'Pedagang / UMKM', persentase: 20 },
    { desaId: 3, nama: 'PNS/TNI/Polri', persentase: 10 },
    { desaId: 3, nama: 'Pekerja Jasa', persentase: 12 },
    { desaId: 3, nama: 'Lainnya', persentase: 8 },
  ]
};


