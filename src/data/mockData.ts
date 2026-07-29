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
    nama: 'Desa Suka Maju',
    kecamatanId: 1,
    tahunPembinaan: 2025,
    fotoCover: 'https://picsum.photos/seed/village1/800/500',
    profilAbstrak: 'Desa Suka Maju terletak di pusat Kecamatan Simpang Kiri. Memiliki perkembangan ekonomi yang pesat dengan fokus pembinaan pada tata kelola data statistik UMKM dan kependudukan. Desa ini menjadi pionir desa digital di Kota Subulussalam.',
    profilFileUrl: '#',
    monografiAbstrak: 'Monografi Desa Suka Maju mencakup profil demografis lengkap, dengan jumlah penduduk mencapai 3.420 jiwa, laju pertumbuhan penduduk 1.2% per tahun, dan komposisi mata pencaharian didominasi sektor jasa dan perdagangan.',
    monografiFileUrl: '#',
    latitude: 2.6288,
    longitude: 98.0062
  },
  {
    id: 2,
    nama: 'Desa Lae Saga',
    kecamatanId: 1,
    tahunPembinaan: 2026,
    fotoCover: 'https://picsum.photos/seed/rice-field/800/500',
    profilAbstrak: 'Desa Lae Saga merupakan desa pertanian subur dengan pembinaan statistik terfokus pada produksi pangan, pemetaan lahan produktif, serta penyusunan basis data petani untuk distribusi pupuk subsidi tepat sasaran.',
    profilFileUrl: '#',
    monografiAbstrak: 'Dokumen monografi menyajikan data kepemilikan lahan tani, rasio penggunaan teknologi pertanian mekanis, dan proyeksi hasil panen padi sawah serta jagung untuk tahun 2026.',
    monografiFileUrl: '#',
    latitude: 2.6450,
    longitude: 97.9850
  },
  {
    id: 3,
    nama: 'Desa Rundeng',
    kecamatanId: 3,
    tahunPembinaan: 2025,
    fotoCover: 'https://picsum.photos/seed/river-village/800/500',
    profilAbstrak: 'Desa Rundeng memiliki warisan budaya yang kaya di tepian sungai. Pembinaan statistik berpusat pada pendataan industri kreatif lokal, kerajinan tangan tradisional, serta pemetaan potensi pariwisata bantaran sungai.',
    profilFileUrl: '#',
    monografiAbstrak: 'Monografi mencatat komposisi usia produktif, tingkat partisipasi sekolah, dan tingkat pendapatan rumah tangga pengerajin anyaman tradisional di Kecamatan Rundeng.',
    monografiFileUrl: '#',
    latitude: 2.5930,
    longitude: 97.8920
  },
  {
    id: 4,
    nama: 'Desa Penanggalan',
    kecamatanId: 2,
    tahunPembinaan: 2024,
    fotoCover: 'https://picsum.photos/seed/waterfall/800/500',
    profilAbstrak: 'Desa Penanggalan terkenal dengan potensi wisatanya yang memukau, termasuk air terjun. Pembinaan difokuskan pada statistik kunjungan wisatawan, analisis multiplier effect ekonomi pariwisata terhadap masyarakat lokal.',
    profilFileUrl: '#',
    monografiAbstrak: 'Menampilkan data statistik akomodasi lokal, serapan tenaga kerja sektor jasa pariwisata, dan kontribusi retribusi wisata terhadap pendapatan asli desa (PADes).',
    monografiFileUrl: '#',
    latitude: 2.5850,
    longitude: 98.0420
  },
  {
    id: 5,
    nama: 'Desa Singkersing',
    kecamatanId: 4,
    tahunPembinaan: 2026,
    fotoCover: 'https://picsum.photos/seed/palm-plantation/800/500',
    profilAbstrak: 'Desa Singkersing berfokus pada sektor perkebunan kelapa sawit skala rakyat. Pembinaan statistik diarahkan pada produktivitas lahan sawit, pendataan kepemilikan sertifikasi ISPO mandiri, dan statistik kesejahteraan pekebun.',
    profilFileUrl: '#',
    monografiAbstrak: 'Berisi data spasial sebaran perkebunan rakyat, rasio ketergantungan tengkulak, dan profil kelompok tani hutan (KTH) yang aktif mengelola potensi non-kayu.',
    monografiFileUrl: '#',
    latitude: 2.4580,
    longitude: 97.8420
  }
];

export const mockPublikasi: Publikasi[] = [
  {
    id: 1,
    desaId: 1,
    judul: 'Desa Suka Maju Dalam Angka 2025',
    tahun: 2025,
    ringkasan: 'Buku Publikasi Desa Suka Maju Dalam Angka 2025 menyajikan statistik kependudukan, fasilitas pendidikan, fasilitas kesehatan, dan perkembangan ekonomi desa sepanjang tahun 2024.',
    coverUrl: 'https://picsum.photos/seed/book-cover-1/400/560',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
  {
    id: 2,
    desaId: 1,
    judul: 'Desa Suka Maju Dalam Angka 2024',
    tahun: 2024,
    ringkasan: 'Publikasi edisi 2024 yang memuat data dasar geografi desa, iklim, struktur aparatur desa, serta statistik sarana prasarana fisik desa.',
    coverUrl: 'https://picsum.photos/seed/book-cover-2/400/560',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
  {
    id: 3,
    desaId: 2,
    judul: 'Desa Lae Saga Dalam Angka 2026',
    tahun: 2026,
    ringkasan: 'Publikasi komprehensif pertama hasil pembinaan Desa Cantik tahun 2026, menitikberatkan pada data kepemilikan alsintan, pola tanam, dan produktivitas komoditas hortikultura.',
    coverUrl: 'https://picsum.photos/seed/book-cover-3/400/560',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
  {
    id: 4,
    desaId: 3,
    judul: 'Desa Rundeng Dalam Angka 2025',
    tahun: 2025,
    ringkasan: 'Publikasi yang mencakup statistik perekonomian rakyat, pelestarian kebudayaan lokal, sarana transportasi air, serta data industri rumah tangga.',
    coverUrl: 'https://picsum.photos/seed/book-cover-4/400/560',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
  {
    id: 5,
    desaId: 4,
    judul: 'Desa Penanggalan Dalam Angka 2024',
    tahun: 2024,
    ringkasan: 'Publikasi data berkala desa wisata Penanggalan. Menampilkan statistik kunjungan wisatawan lokal dan mancanegara serta profil usaha homestay.',
    coverUrl: 'https://picsum.photos/seed/book-cover-5/400/560',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  }
];

export const mockPotensi: Potensi[] = [
  // Desa Suka Maju
  {
    id: 1,
    desaId: 1,
    kategori: 'ekonomi',
    subKategori: 'UMKM',
    nama: 'Sentra Kerajinan Emas & Bordir',
    deskripsi: 'Suka Maju memiliki sentra UMKM pembuatan perhiasan perak/emas dan bordir pakaian adat yang menyerap lebih dari 120 tenaga kerja wanita setempat.',
    fotoUrl: 'https://picsum.photos/seed/craft-market/800/600'
  },
  {
    id: 2,
    desaId: 1,
    kategori: 'investasi',
    subKategori: 'Produk Unggulan',
    nama: 'Minyak Nilam Subulussalam',
    deskripsi: 'Pengolahan dan penyulingan minyak nilam rakyat dengan kadar patchouli alcohol di atas 30%, sangat diminati industri parfum global.',
    fotoUrl: 'https://picsum.photos/seed/essential-oil/800/600'
  },
  // Desa Lae Saga
  {
    id: 3,
    desaId: 2,
    kategori: 'ekonomi',
    subKategori: 'Pertanian',
    nama: 'Sentra Padi Organik Varietas Unggul',
    deskripsi: 'Lahan sawah seluas 150 hektar yang dikelola secara organik dengan sistem irigasi teknis terpadu, menghasilkan beras premium lokal.',
    fotoUrl: 'https://picsum.photos/seed/rice-paddy/800/600'
  },
  // Desa Rundeng
  {
    id: 4,
    desaId: 3,
    kategori: 'wisata',
    subKategori: 'Wisata Budaya',
    nama: 'Susur Sungai & Festival Perahu Tradisional',
    deskripsi: 'Menyajikan atraksi menyusuri sungai bersejarah dengan perahu tradisional serta festival tahunan balap perahu hias yang menarik ribuan pelancong.',
    fotoUrl: 'https://picsum.photos/seed/river-boat/800/600'
  },
  // Desa Penanggalan
  {
    id: 5,
    desaId: 4,
    kategori: 'wisata',
    subKategori: 'Wisata Alam',
    nama: 'Air Terjun SKPC & Kolam Pemandian Alam',
    deskripsi: 'Destinasi wisata unggulan berupa air terjun bertingkat yang dikelilingi hutan hujan tropis alami, lengkap dengan fasilitas trekking dan gazebo santai.',
    fotoUrl: 'https://picsum.photos/seed/waterfall-nature/800/600',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
  }
];

export const mockInfografis: Infografis[] = [
  {
    id: 1,
    desaId: 1,
    judul: 'Infografis Demografi Penduduk Suka Maju 2025',
    imageUrl: 'https://picsum.photos/seed/infografis-1/800/600',
    pdfUrl: '#'
  },
  {
    id: 2,
    desaId: 1,
    judul: 'Infografis Sebaran UMKM Suka Maju',
    imageUrl: 'https://picsum.photos/seed/infografis-2/800/600',
    pdfUrl: '#'
  },
  {
    id: 3,
    desaId: 2,
    judul: 'Infografis Produktivitas Pangan Lae Saga 2026',
    imageUrl: 'https://picsum.photos/seed/infografis-3/800/600',
    pdfUrl: '#'
  },
  {
    id: 4,
    desaId: 4,
    judul: 'Statistik Kunjungan Wisata Air Terjun Penanggalan',
    imageUrl: 'https://picsum.photos/seed/infografis-4/800/600',
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
  1: { desaId: 1, umur0_14: 420, umur15_29: 850, umur30_44: 780, umur45_59: 620, umur60Plus: 460 },
  2: { desaId: 2, umur0_14: 510, umur15_29: 920, umur30_44: 810, umur45_59: 590, umur60Plus: 410 },
  3: { desaId: 3, umur0_14: 380, umur15_29: 760, umur30_44: 690, umur45_59: 540, umur60Plus: 390 },
  4: { desaId: 4, umur0_14: 440, umur15_29: 890, umur30_44: 750, umur45_59: 610, umur60Plus: 430 },
  5: { desaId: 5, umur0_14: 490, umur15_29: 940, umur30_44: 830, umur45_59: 670, umur60Plus: 480 },
};

export const mockMataPencaharian: Record<number, MataPencaharianItem[]> = {
  1: [
    { desaId: 1, nama: 'Petani', persentase: 45 },
    { desaId: 1, nama: 'Pedagang', persentase: 20 },
    { desaId: 1, nama: 'PNS/TNI/Polri', persentase: 10 },
    { desaId: 1, nama: 'Pekerja Jasa', persentase: 15 },
    { desaId: 1, nama: 'Lainnya', persentase: 10 },
  ],
  2: [
    { desaId: 2, nama: 'Petani Pangan', persentase: 65 },
    { desaId: 2, nama: 'Pedagang', persentase: 15 },
    { desaId: 2, nama: 'PNS/TNI/Polri', persentase: 5 },
    { desaId: 2, nama: 'Pekerja Jasa', persentase: 10 },
    { desaId: 2, nama: 'Lainnya', persentase: 5 },
  ],
  3: [
    { desaId: 3, nama: 'Petani', persentase: 35 },
    { desaId: 3, nama: 'Pengerajin/Pedagang', persentase: 35 },
    { desaId: 3, nama: 'PNS/TNI/Polri', persentase: 10 },
    { desaId: 3, nama: 'Pekerja Jasa', persentase: 12 },
    { desaId: 3, nama: 'Lainnya', persentase: 8 },
  ],
  4: [
    { desaId: 4, nama: 'Petani', persentase: 25 },
    { desaId: 4, nama: 'Pedagang', persentase: 30 },
    { desaId: 4, nama: 'PNS/TNI/Polri', persentase: 10 },
    { desaId: 4, nama: 'Jasa Pariwisata', persentase: 30 },
    { desaId: 4, nama: 'Lainnya', persentase: 5 },
  ],
  5: [
    { desaId: 5, nama: 'Pekebun Sawit', persentase: 70 },
    { desaId: 5, nama: 'Pedagang', persentase: 10 },
    { desaId: 5, nama: 'PNS/TNI/Polri', persentase: 5 },
    { desaId: 5, nama: 'Pekerja Jasa', persentase: 10 },
    { desaId: 5, nama: 'Lainnya', persentase: 5 },
  ]
};

