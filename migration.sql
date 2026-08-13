-- ============================================
-- MIGRATION: Desa Cantik → MySQL (cPanel)
-- Domain: https://descan-subul1175.my.id/
-- Jalankan di phpMyAdmin pada database target
-- ============================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ──────────────────────────────────────────────
-- 1. Tabel Kecamatan
-- ──────────────────────────────────────────────
DROP TABLE IF EXISTS `kecamatan`;
CREATE TABLE `kecamatan` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nama` VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `kecamatan` (`id`, `nama`) VALUES
  (1, 'Simpang Kiri'),
  (2, 'Penanggalan'),
  (3, 'Rundeng'),
  (4, 'Sultan Daulat'),
  (5, 'Longkib');

-- ──────────────────────────────────────────────
-- 2. Tabel Desa
-- ──────────────────────────────────────────────
DROP TABLE IF EXISTS `desa`;
CREATE TABLE `desa` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nama` VARCHAR(255) NOT NULL,
  `kecamatan_id` INT NOT NULL,
  `tahun_pembinaan` INT DEFAULT 2026,
  `foto_cover` TEXT,
  `profil_abstrak` TEXT,
  `profil_file_url` TEXT,
  `monografi_abstrak` TEXT,
  `monografi_file_url` TEXT,
  `latitude` DECIMAL(10, 6) DEFAULT 0.000000,
  `longitude` DECIMAL(10, 6) DEFAULT 0.000000,
  FOREIGN KEY (`kecamatan_id`) REFERENCES `kecamatan`(`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `desa` (`id`, `nama`, `kecamatan_id`, `tahun_pembinaan`, `foto_cover`, `profil_abstrak`, `profil_file_url`, `monografi_abstrak`, `monografi_file_url`, `latitude`, `longitude`) VALUES
(1, 'Desa Penanggalan Barat', 2, 2026,
  'https://picsum.photos/seed/penanggalan-barat/800/500',
  'Desa Penanggalan Barat terletak di Kecamatan Penanggalan, Kota Subulussalam. Merupakan salah satu desa fokus pembinaan Desa Cinta Statistik (Desa Cantik) dengan pengembangan basis data statistik potensi lokal, UMKM, serta pelayanan publik berbasis data kependudukan.',
  'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  'Monografi Desa Penanggalan Barat menyajikan gambaran kependudukan lengkap, wilayah administrasi, struktur mata pencaharian masyarakat, dan sarana prasarana desa terkini.',
  'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  2.576100, 98.028900),
(2, 'Desa Lae Bersih', 1, 2026,
  'https://picsum.photos/seed/lae-bersih/800/500',
  'Desa Lae Bersih terletak di kawasan Kecamatan Simpang Kiri. Pembinaan statistik difokuskan pada optimalisasi data sektor pertanian, tata kelola kependudukan, serta pemetaan potensi wilayah demi mendukung perencanaan pembangunan desa.',
  'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  'Dokumen monografi mencakup data kepemilikan lahan pertanian, statistik tenaga kerja, fasilitas pendidikan, dan tingkat kesejahteraan masyarakat Desa Lae Bersih.',
  'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  2.637500, 98.012500),
(3, 'Desa Sikelang', 1, 2026,
  'https://picsum.photos/seed/sikelang/800/500',
  'Desa Sikelang merupakan desa binaan Desa Cantik di Kecamatan Simpang Kiri dengan keunggulan sektor perkebunan dan UMKM. Fokus pembinaan statistik diarahkan pada digitalisasi data desa dan statistik ekonomi kerakyatan.',
  'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  'Monografi Desa Sikelang memuat struktur demografi penduduk, profil usaha mikro kecil menengah, potensi komoditas lokal, serta indikator pelayanan statistik desa.',
  'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  2.598000, 98.021000);

-- ──────────────────────────────────────────────
-- 3. Tabel Publikasi
-- ──────────────────────────────────────────────
DROP TABLE IF EXISTS `publikasi`;
CREATE TABLE `publikasi` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `desa_id` INT NOT NULL,
  `judul` VARCHAR(500) NOT NULL,
  `tahun` INT NOT NULL,
  `ringkasan` TEXT,
  `cover_url` TEXT,
  `pdf_url` TEXT,
  FOREIGN KEY (`desa_id`) REFERENCES `desa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `publikasi` (`id`, `desa_id`, `judul`, `tahun`, `ringkasan`, `cover_url`, `pdf_url`) VALUES
(1, 1, 'Desa Penanggalan Barat Dalam Angka 2026', 2026, 'Buku Publikasi Desa Penanggalan Barat Dalam Angka 2026 menyajikan statistik kependudukan, fasilitas pendidikan, kesehatan, serta perkembangan ekonomi desa sepanjang tahun pembinaan.', 'https://picsum.photos/seed/book-cover-pb1/400/560', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'),
(2, 1, 'Desa Penanggalan Barat Dalam Angka 2025', 2025, 'Publikasi edisi 2025 yang memuat data dasar geografi desa, iklim, struktur aparatur desa, serta statistik sarana prasarana fisik desa.', 'https://picsum.photos/seed/book-cover-pb2/400/560', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'),
(3, 2, 'Desa Lae Bersih Dalam Angka 2026', 2026, 'Publikasi komprehensif hasil pembinaan Desa Cantik tahun 2026, menitikberatkan pada data pertanian, pola tanam, dan produktivitas komoditas pangan.', 'https://picsum.photos/seed/book-cover-lb1/400/560', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'),
(4, 2, 'Desa Lae Bersih Dalam Angka 2025', 2025, 'Buku statistik tahunan Desa Lae Bersih mencakup demografi penduduk, fasilitas sosial, dan gambaran umum mata pencaharian warga.', 'https://picsum.photos/seed/book-cover-lb2/400/560', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'),
(5, 3, 'Desa Sikelang Dalam Angka 2026', 2026, 'Publikasi data berkala Desa Sikelang tahun 2026. Menampilkan statistik perkebunan rakyat, UMKM desa, dan hasil pendataan kependudukan.', 'https://picsum.photos/seed/book-cover-sk1/400/560', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'),
(6, 3, 'Desa Sikelang Dalam Angka 2025', 2025, 'Publikasi edisi 2025 yang berisi profil statistik wilayah, indikator ekonomi desa, serta sarana prasarana umum.', 'https://picsum.photos/seed/book-cover-sk2/400/560', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');

-- ──────────────────────────────────────────────
-- 4. Tabel Potensi
-- ──────────────────────────────────────────────
DROP TABLE IF EXISTS `potensi`;
CREATE TABLE `potensi` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `desa_id` INT NOT NULL,
  `kategori` ENUM('ekonomi', 'wisata', 'investasi') DEFAULT 'ekonomi',
  `sub_kategori` VARCHAR(255),
  `judul` VARCHAR(500) NOT NULL,
  `deskripsi` TEXT,
  `foto_url` TEXT,
  `video_url` TEXT,
  FOREIGN KEY (`desa_id`) REFERENCES `desa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `potensi` (`id`, `desa_id`, `kategori`, `sub_kategori`, `judul`, `deskripsi`, `foto_url`) VALUES
(1, 1, 'ekonomi', 'UMKM', 'Sentra Kerajinan & Olahan Kuliner Lokal', 'Desa Penanggalan Barat memiliki sentra UMKM kuliner khas dan kerajinan tangan yang menyerap tenaga kerja produktif di lingkungan desa.', 'https://picsum.photos/seed/craft-market-pb/800/600'),
(2, 1, 'wisata', 'Wisata Alam & Budaya', 'Kawasan Wisata Alam Penanggalan Barat', 'Potensi lanskap alam dan budaya lokal yang asri, menawarkan wisata panorama alam dan kegiatan kemasyarakatan.', 'https://picsum.photos/seed/nature-pb/800/600'),
(3, 2, 'ekonomi', 'Pertanian', 'Sentra Pertanian Pangan & Hortikultura', 'Kawasan pertanian subur yang memproduksi komoditas tanaman pangan dan sayuran segar dengan sistem pengelolaan kelompok tani.', 'https://picsum.photos/seed/rice-paddy-lb/800/600'),
(4, 2, 'investasi', 'Produk Unggulan', 'Pengolahan Minyak Nilam & Hasil Tani', 'Penyulingan minyak nilam rakyat dan unit usaha pengolahan hasil panen unggulan Desa Lae Bersih.', 'https://picsum.photos/seed/essential-oil-lb/800/600'),
(5, 3, 'ekonomi', 'Perkebunan', 'Kawasan Perkebunan Rakyat Sikelang', 'Sentra perkebunan kelapa sawit dan komoditas perkebunan rakyat yang menjadi penopang utama ekonomi masyarakat Sikelang.', 'https://picsum.photos/seed/palm-plantation-sk/800/600'),
(6, 3, 'investasi', 'Produk Unggulan', 'Sentra Industri Kecil & Perdagangan Desa', 'Pengembangan unit usaha perdagangan dan industri skala rumah tangga di sepanjang jalur utama Desa Sikelang.', 'https://picsum.photos/seed/trade-sk/800/600');

-- ──────────────────────────────────────────────
-- 5. Tabel Infografis
-- ──────────────────────────────────────────────
DROP TABLE IF EXISTS `infografis`;
CREATE TABLE `infografis` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `desa_id` INT NOT NULL,
  `judul` VARCHAR(500) NOT NULL,
  `gambar_url` TEXT,
  FOREIGN KEY (`desa_id`) REFERENCES `desa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `infografis` (`id`, `desa_id`, `judul`, `gambar_url`) VALUES
(1, 1, 'Infografis Demografi Penduduk Penanggalan Barat 2026', 'https://picsum.photos/seed/infografis-pb1/800/600'),
(2, 1, 'Infografis Sebaran UMKM Penanggalan Barat', 'https://picsum.photos/seed/infografis-pb2/800/600'),
(3, 2, 'Infografis Demografi & Pertanian Lae Bersih 2026', 'https://picsum.photos/seed/infografis-lb1/800/600'),
(4, 2, 'Infografis Sarana & Prasarana Desa Lae Bersih', 'https://picsum.photos/seed/infografis-lb2/800/600'),
(5, 3, 'Infografis Statistik Kependudukan Desa Sikelang 2026', 'https://picsum.photos/seed/infografis-sk1/800/600'),
(6, 3, 'Infografis Potensi Perkebunan & UMKM Sikelang', 'https://picsum.photos/seed/infografis-sk2/800/600');

-- ──────────────────────────────────────────────
-- 6. Tabel Demografi (dusun_data disimpan sebagai JSON)
-- ──────────────────────────────────────────────
DROP TABLE IF EXISTS `demografi`;
CREATE TABLE `demografi` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `desa_id` INT NOT NULL UNIQUE,
  `dusun_data` JSON,
  FOREIGN KEY (`desa_id`) REFERENCES `desa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `demografi` (`desa_id`, `dusun_data`) VALUES
(1, '[{"dusun":"Dusun Pemancar","lakiLaki":397,"perempuan":395},{"dusun":"Dusun Silak","lakiLaki":387,"perempuan":341},{"dusun":"Dusun Gapa","lakiLaki":150,"perempuan":181},{"dusun":"Dusun Nurul Iman","lakiLaki":160,"perempuan":182}]'),
(2, '[{"dusun":"Dusun Lae Bersih I","lakiLaki":410,"perempuan":390},{"dusun":"Dusun Lae Bersih II","lakiLaki":350,"perempuan":360},{"dusun":"Dusun Sukajaya","lakiLaki":280,"perempuan":295}]'),
(3, '[{"dusun":"Dusun Sikelang Indah","lakiLaki":450,"perempuan":430},{"dusun":"Dusun Makmur","lakiLaki":380,"perempuan":370},{"dusun":"Dusun Sejahtera","lakiLaki":320,"perempuan":340}]');

-- ──────────────────────────────────────────────
-- 7. Tabel Mata Pencaharian
-- ──────────────────────────────────────────────
DROP TABLE IF EXISTS `mata_pencaharian`;
CREATE TABLE `mata_pencaharian` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `desa_id` INT NOT NULL,
  `nama` VARCHAR(255) NOT NULL,
  `persentase` DECIMAL(5, 2) DEFAULT 0.00,
  FOREIGN KEY (`desa_id`) REFERENCES `desa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `mata_pencaharian` (`desa_id`, `nama`, `persentase`) VALUES
(1, 'Petani & Perkebunan', 40.00),
(1, 'Pedagang / UMKM', 25.00),
(1, 'PNS/TNI/Polri', 10.00),
(1, 'Pekerja Jasa', 15.00),
(1, 'Lainnya', 10.00),
(2, 'Petani Pangan', 55.00),
(2, 'Pedagang', 20.00),
(2, 'PNS/TNI/Polri', 10.00),
(2, 'Pekerja Jasa', 10.00),
(2, 'Lainnya', 5.00),
(3, 'Pekebun Sawit & Petani', 50.00),
(3, 'Pedagang / UMKM', 20.00),
(3, 'PNS/TNI/Polri', 10.00),
(3, 'Pekerja Jasa', 12.00),
(3, 'Lainnya', 8.00);

-- ──────────────────────────────────────────────
-- 8. Tabel Pesan Kontak
-- ──────────────────────────────────────────────
DROP TABLE IF EXISTS `pesan_kontak`;
CREATE TABLE `pesan_kontak` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nama` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `subjek` VARCHAR(500),
  `isi` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────
-- 9. Tabel Users (Auth dari database)
-- ──────────────────────────────────────────────
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(100) UNIQUE NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('bps', 'desa') DEFAULT 'desa',
  `desa_id` INT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`desa_id`) REFERENCES `desa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Default users (password: pass123, hashed with bcrypt)
INSERT INTO `users` (`username`, `password_hash`, `role`, `desa_id`) VALUES
('admin', '$2b$10$rw7eDvVPFASpao03fU27w.BPJg2xs3c/KiadRDRdlMdwnRUWqNdJS', 'bps', NULL),
('desa_penanggalanbarat', '$2b$10$3rUjIwKuJxroKxJQXGTHourzXrad/zkhdsWJ0KkLaKhptHZ6Esi7G', 'desa', 1),
('desa_penangalanbarat', '$2b$10$3rUjIwKuJxroKxJQXGTHourzXrad/zkhdsWJ0KkLaKhptHZ6Esi7G', 'desa', 1),
('desa_laebersih', '$2b$10$hsbS/svpSQwsmxbJk6ezO.5LD6LgijtqEMyVqtAe3vwSi.Dj.JWwu', 'desa', 2),
('desa_sikelang', '$2b$10$aAetpoqjC5DUQ4arnM3qF.dtTmy2cQYH3JZgKLmz/CBrfvgbFebLK', 'desa', 3);

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- SELESAI! Setelah menjalankan SQL ini:
-- 1. Jalankan seed_passwords.js untuk hash password
-- 2. Atau update manual via phpMyAdmin
-- ============================================
