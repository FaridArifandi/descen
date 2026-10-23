/**
 * scripts/seed.js
 *
 * Mengisi data awal ke database (kecamatan, desa, publikasi, potensi,
 * infografis, demografi, mata_pencaharian, pendidikan, users).
 *
 * Gunakan INSERT ... ON DUPLICATE KEY UPDATE agar aman dijalankan berulang kali.
 * Password default semua user: pass123 (sudah di-hash bcrypt).
 *
 * Usage:
 *   node scripts/seed.js
 */

'use strict';

const fs    = require('fs');
const path  = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// ─── Baca .env manual ────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) return {};
  return Object.fromEntries(
    fs.readFileSync(envPath, 'utf-8')
      .split('\n')
      .filter(l => l.trim() && !l.startsWith('#') && l.includes('='))
      .map(l => {
        const idx = l.indexOf('=');
        return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
      })
  );
}

// ─── Data seed ───────────────────────────────────────────────────────────────

const kecamatan = [
  { id: 1, nama: 'Simpang Kiri' },
  { id: 2, nama: 'Penanggalan' },
  { id: 3, nama: 'Rundeng' },
  { id: 4, nama: 'Sultan Daulat' },
  { id: 5, nama: 'Longkib' },
];

const desa = [
  {
    id: 1, nama: 'Desa Penanggalan Barat', kecamatan_id: 2, tahun_pembinaan: 2026,
    foto_cover: 'https://picsum.photos/seed/penanggalan-barat/800/500',
    profil_abstrak: 'Desa Penanggalan Barat terletak di Kecamatan Penanggalan, Kota Subulussalam. Merupakan salah satu desa fokus pembinaan Desa Cinta Statistik (Desa Cantik) dengan pengembangan basis data statistik potensi lokal, UMKM, serta pelayanan publik berbasis data kependudukan.',
    profil_file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    monografi_abstrak: 'Monografi Desa Penanggalan Barat menyajikan gambaran kependudukan lengkap, wilayah administrasi, struktur mata pencaharian masyarakat, dan sarana prasarana desa terkini.',
    monografi_file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    latitude: 2.576100, longitude: 98.028900,
  },
  {
    id: 2, nama: 'Desa Lae Bersih', kecamatan_id: 1, tahun_pembinaan: 2026,
    foto_cover: 'https://picsum.photos/seed/lae-bersih/800/500',
    profil_abstrak: 'Desa Lae Bersih terletak di kawasan Kecamatan Simpang Kiri. Pembinaan statistik difokuskan pada optimalisasi data sektor pertanian, tata kelola kependudukan, serta pemetaan potensi wilayah demi mendukung perencanaan pembangunan desa.',
    profil_file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    monografi_abstrak: 'Dokumen monografi mencakup data kepemilikan lahan pertanian, statistik tenaga kerja, fasilitas pendidikan, dan tingkat kesejahteraan masyarakat Desa Lae Bersih.',
    monografi_file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    latitude: 2.637500, longitude: 98.012500,
  },
  {
    id: 3, nama: 'Desa Sikelang', kecamatan_id: 1, tahun_pembinaan: 2026,
    foto_cover: 'https://picsum.photos/seed/sikelang/800/500',
    profil_abstrak: 'Desa Sikelang merupakan desa binaan Desa Cantik di Kecamatan Simpang Kiri dengan keunggulan sektor perkebunan dan UMKM. Fokus pembinaan statistik diarahkan pada digitalisasi data desa dan statistik ekonomi kerakyatan.',
    profil_file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    monografi_abstrak: 'Monografi Desa Sikelang memuat struktur demografi penduduk, profil usaha mikro kecil menengah, potensi komoditas lokal, serta indikator pelayanan statistik desa.',
    monografi_file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    latitude: 2.598000, longitude: 98.021000,
  },
];

const publikasi = [
  { id: 1, desa_id: 1, judul: 'Desa Penanggalan Barat Dalam Angka 2026', tahun: 2026, ringkasan: 'Buku Publikasi Desa Penanggalan Barat Dalam Angka 2026 menyajikan statistik kependudukan, fasilitas pendidikan, kesehatan, serta perkembangan ekonomi desa sepanjang tahun pembinaan.', cover_url: 'https://picsum.photos/seed/book-cover-pb1/400/560', pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { id: 2, desa_id: 1, judul: 'Desa Penanggalan Barat Dalam Angka 2025', tahun: 2025, ringkasan: 'Publikasi edisi 2025 yang memuat data dasar geografi desa, iklim, struktur aparatur desa, serta statistik sarana prasarana fisik desa.', cover_url: 'https://picsum.photos/seed/book-cover-pb2/400/560', pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { id: 3, desa_id: 2, judul: 'Desa Lae Bersih Dalam Angka 2026', tahun: 2026, ringkasan: 'Publikasi komprehensif hasil pembinaan Desa Cantik tahun 2026, menitikberatkan pada data pertanian, pola tanam, dan produktivitas komoditas pangan.', cover_url: 'https://picsum.photos/seed/book-cover-lb1/400/560', pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { id: 4, desa_id: 2, judul: 'Desa Lae Bersih Dalam Angka 2025', tahun: 2025, ringkasan: 'Buku statistik tahunan Desa Lae Bersih mencakup demografi penduduk, fasilitas sosial, dan gambaran umum mata pencaharian warga.', cover_url: 'https://picsum.photos/seed/book-cover-lb2/400/560', pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { id: 5, desa_id: 3, judul: 'Desa Sikelang Dalam Angka 2026', tahun: 2026, ringkasan: 'Publikasi data berkala Desa Sikelang tahun 2026. Menampilkan statistik perkebunan rakyat, UMKM desa, dan hasil pendataan kependudukan.', cover_url: 'https://picsum.photos/seed/book-cover-sk1/400/560', pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { id: 6, desa_id: 3, judul: 'Desa Sikelang Dalam Angka 2025', tahun: 2025, ringkasan: 'Publikasi edisi 2025 yang berisi profil statistik wilayah, indikator ekonomi desa, serta sarana prasarana umum.', cover_url: 'https://picsum.photos/seed/book-cover-sk2/400/560', pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
];

const potensi = [
  { id: 1, desa_id: 1, kategori: 'ekonomi',    sub_kategori: 'UMKM',              judul: 'Sentra Kerajinan & Olahan Kuliner Lokal',   deskripsi: 'Desa Penanggalan Barat memiliki sentra UMKM kuliner khas dan kerajinan tangan yang menyerap tenaga kerja produktif di lingkungan desa.',              foto_url: 'https://picsum.photos/seed/craft-market-pb/800/600' },
  { id: 2, desa_id: 1, kategori: 'wisata',     sub_kategori: 'Wisata Alam & Budaya', judul: 'Kawasan Wisata Alam Penanggalan Barat',  deskripsi: 'Potensi lanskap alam dan budaya lokal yang asri, menawarkan wisata panorama alam dan kegiatan kemasyarakatan.',                                       foto_url: 'https://picsum.photos/seed/nature-pb/800/600'         },
  { id: 3, desa_id: 2, kategori: 'ekonomi',    sub_kategori: 'Pertanian',          judul: 'Sentra Pertanian Pangan & Hortikultura',    deskripsi: 'Kawasan pertanian subur yang memproduksi komoditas tanaman pangan dan sayuran segar dengan sistem pengelolaan kelompok tani.',                    foto_url: 'https://picsum.photos/seed/rice-paddy-lb/800/600'    },
  { id: 4, desa_id: 2, kategori: 'investasi',  sub_kategori: 'Produk Unggulan',    judul: 'Pengolahan Minyak Nilam & Hasil Tani',      deskripsi: 'Penyulingan minyak nilam rakyat dan unit usaha pengolahan hasil panen unggulan Desa Lae Bersih.',                                                    foto_url: 'https://picsum.photos/seed/essential-oil-lb/800/600' },
  { id: 5, desa_id: 3, kategori: 'ekonomi',    sub_kategori: 'Perkebunan',         judul: 'Kawasan Perkebunan Rakyat Sikelang',        deskripsi: 'Sentra perkebunan kelapa sawit dan komoditas perkebunan rakyat yang menjadi penopang utama ekonomi masyarakat Sikelang.',                          foto_url: 'https://picsum.photos/seed/palm-plantation-sk/800/600' },
  { id: 6, desa_id: 3, kategori: 'investasi',  sub_kategori: 'Produk Unggulan',    judul: 'Sentra Industri Kecil & Perdagangan Desa', deskripsi: 'Pengembangan unit usaha perdagangan dan industri skala rumah tangga di sepanjang jalur utama Desa Sikelang.',                                        foto_url: 'https://picsum.photos/seed/trade-sk/800/600'         },
];

const infografis = [
  { id: 1, desa_id: 1, judul: 'Infografis Demografi Penduduk Penanggalan Barat 2026', gambar_url: 'https://picsum.photos/seed/infografis-pb1/800/600' },
  { id: 2, desa_id: 1, judul: 'Infografis Sebaran UMKM Penanggalan Barat',            gambar_url: 'https://picsum.photos/seed/infografis-pb2/800/600' },
  { id: 3, desa_id: 2, judul: 'Infografis Demografi & Pertanian Lae Bersih 2026',     gambar_url: 'https://picsum.photos/seed/infografis-lb1/800/600' },
  { id: 4, desa_id: 2, judul: 'Infografis Sarana & Prasarana Desa Lae Bersih',        gambar_url: 'https://picsum.photos/seed/infografis-lb2/800/600' },
  { id: 5, desa_id: 3, judul: 'Infografis Statistik Kependudukan Desa Sikelang 2026', gambar_url: 'https://picsum.photos/seed/infografis-sk1/800/600' },
  { id: 6, desa_id: 3, judul: 'Infografis Potensi Perkebunan & UMKM Sikelang',        gambar_url: 'https://picsum.photos/seed/infografis-sk2/800/600' },
];

// demografi — JSON per desa
const demografi = [
  {
    desa_id: 1,
    dusun_data: [
      { dusun: 'Dusun Pemancar',   lakiLaki: 397, perempuan: 395 },
      { dusun: 'Dusun Silak',      lakiLaki: 387, perempuan: 341 },
      { dusun: 'Dusun Gapa',       lakiLaki: 150, perempuan: 181 },
      { dusun: 'Dusun Nurul Iman', lakiLaki: 160, perempuan: 182 },
    ],
  },
  {
    desa_id: 2,
    dusun_data: [
      { dusun: 'Dusun Lae Bersih I',  lakiLaki: 410, perempuan: 390 },
      { dusun: 'Dusun Lae Bersih II', lakiLaki: 350, perempuan: 360 },
      { dusun: 'Dusun Sukajaya',      lakiLaki: 280, perempuan: 295 },
    ],
  },
  {
    desa_id: 3,
    dusun_data: [
      { dusun: 'Dusun Sikelang Indah', lakiLaki: 450, perempuan: 430 },
      { dusun: 'Dusun Makmur',         lakiLaki: 380, perempuan: 370 },
      { dusun: 'Dusun Sejahtera',      lakiLaki: 320, perempuan: 340 },
    ],
  },
];

// mata_pencaharian — baris per item
const mataPencaharian = [
  { desa_id: 1, nama: 'Petani & Perkebunan', persentase: 40.00 },
  { desa_id: 1, nama: 'Pedagang / UMKM',     persentase: 25.00 },
  { desa_id: 1, nama: 'PNS/TNI/Polri',       persentase: 10.00 },
  { desa_id: 1, nama: 'Pekerja Jasa',         persentase: 15.00 },
  { desa_id: 1, nama: 'Lainnya',              persentase: 10.00 },
  { desa_id: 2, nama: 'Petani Pangan',        persentase: 55.00 },
  { desa_id: 2, nama: 'Pedagang',             persentase: 20.00 },
  { desa_id: 2, nama: 'PNS/TNI/Polri',       persentase: 10.00 },
  { desa_id: 2, nama: 'Pekerja Jasa',         persentase: 10.00 },
  { desa_id: 2, nama: 'Lainnya',              persentase:  5.00 },
  { desa_id: 3, nama: 'Pekebun Sawit & Petani', persentase: 50.00 },
  { desa_id: 3, nama: 'Pedagang / UMKM',     persentase: 20.00 },
  { desa_id: 3, nama: 'PNS/TNI/Polri',       persentase: 10.00 },
  { desa_id: 3, nama: 'Pekerja Jasa',         persentase: 12.00 },
  { desa_id: 3, nama: 'Lainnya',              persentase:  8.00 },
];

// pendidikan — JSON per desa
const TINGKAT = [
  'Tidak/belum tamat SD',
  'SD / MI',
  'SMP / MTs',
  'SMA / SMK / MA',
  'Diploma I / II / III',
  'S1 / Diploma IV',
  'S2 / S3 / Profesi',
];

const pendidikan = [
  {
    desa_id: 1,
    data: [
      { tingkat: TINGKAT[0], lakiLaki: 0, perempuan: 0 },
      { tingkat: TINGKAT[1], lakiLaki: 0, perempuan: 0 },
      { tingkat: TINGKAT[2], lakiLaki: 0, perempuan: 0 },
      { tingkat: TINGKAT[3], lakiLaki: 5, perempuan: 1 },
      { tingkat: TINGKAT[4], lakiLaki: 0, perempuan: 1 },
      { tingkat: TINGKAT[5], lakiLaki: 1, perempuan: 4 },
      { tingkat: TINGKAT[6], lakiLaki: 0, perempuan: 1 },
    ],
  },
  {
    desa_id: 2,
    data: [
      { tingkat: TINGKAT[0], lakiLaki: 0, perempuan: 0 },
      { tingkat: TINGKAT[1], lakiLaki: 0, perempuan: 0 },
      { tingkat: TINGKAT[2], lakiLaki: 0, perempuan: 0 },
      { tingkat: TINGKAT[3], lakiLaki: 4, perempuan: 2 },
      { tingkat: TINGKAT[4], lakiLaki: 1, perempuan: 1 },
      { tingkat: TINGKAT[5], lakiLaki: 2, perempuan: 3 },
      { tingkat: TINGKAT[6], lakiLaki: 0, perempuan: 0 },
    ],
  },
  {
    desa_id: 3,
    data: [
      { tingkat: TINGKAT[0], lakiLaki: 0, perempuan: 0 },
      { tingkat: TINGKAT[1], lakiLaki: 0, perempuan: 0 },
      { tingkat: TINGKAT[2], lakiLaki: 0, perempuan: 0 },
      { tingkat: TINGKAT[3], lakiLaki: 6, perempuan: 2 },
      { tingkat: TINGKAT[4], lakiLaki: 0, perempuan: 2 },
      { tingkat: TINGKAT[5], lakiLaki: 3, perempuan: 4 },
      { tingkat: TINGKAT[6], lakiLaki: 1, perempuan: 0 },
    ],
  },
];

/**
 * Users default template
 * Password akan di-hash secara dinamis menggunakan bcrypt.
 * Bisa disesuaikan via ADMIN_PASSWORD atau DESA_PASSWORD di .env.
 */
const defaultUsers = [
  // role bps (super admin)
  { username: 'admin',                role: 'bps',  desa_id: null },
  // role desa
  { username: 'desa_penanggalanbarat', role: 'desa', desa_id: 1 },
  { username: 'desa_laebersih',        role: 'desa', desa_id: 2 },
  { username: 'desa_sikelang',         role: 'desa', desa_id: 3 },
];

// ─── Helper: upsert via INSERT … ON DUPLICATE KEY UPDATE ─────────────────────
async function upsert(conn, table, rows, cols) {
  if (!rows.length) return;
  const placeholders = rows.map(() => `(${cols.map(() => '?').join(', ')})`).join(', ');
  const values       = rows.flatMap(r => cols.map(c => r[c] !== undefined ? r[c] : null));
  const updateCols   = cols.filter(c => c !== 'id').map(c => `\`${c}\` = VALUES(\`${c}\`)`).join(', ');
  await conn.query(
    `INSERT INTO \`${table}\` (${cols.map(c => `\`${c}\``).join(', ')}) VALUES ${placeholders}
     ON DUPLICATE KEY UPDATE ${updateCols}`,
    values
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const env = loadEnv();

  const config = {
    host:     env.DB_HOST     || 'localhost',
    user:     env.DB_USER     || 'root',
    password: env.DB_PASSWORD ?? '',
    database: env.DB_NAME     || 'descan_descan',
  };

  console.log(`\n🔗 Menghubungkan ke ${config.database}@${config.host}...`);
  const conn = await mysql.createConnection({ ...config, multipleStatements: false });

  // Nonaktifkan FK sementara agar urutan insert tidak masalah
  await conn.query('SET FOREIGN_KEY_CHECKS = 0;');

  console.log('🌱 Mengisi data kecamatan...');
  await upsert(conn, 'kecamatan', kecamatan, ['id', 'nama']);

  console.log('🌱 Mengisi data desa...');
  await upsert(conn, 'desa', desa, [
    'id', 'nama', 'kecamatan_id', 'tahun_pembinaan',
    'foto_cover', 'profil_abstrak', 'profil_file_url',
    'monografi_abstrak', 'monografi_file_url',
    'latitude', 'longitude',
  ]);

  console.log('🌱 Mengisi data publikasi...');
  await upsert(conn, 'publikasi', publikasi, ['id', 'desa_id', 'judul', 'tahun', 'ringkasan', 'cover_url', 'pdf_url']);

  console.log('🌱 Mengisi data potensi...');
  await upsert(conn, 'potensi', potensi, ['id', 'desa_id', 'kategori', 'sub_kategori', 'judul', 'deskripsi', 'foto_url']);

  console.log('🌱 Mengisi data infografis...');
  await upsert(conn, 'infografis', infografis, ['id', 'desa_id', 'judul', 'gambar_url']);

  console.log('🌱 Mengisi data demografi...');
  for (const d of demografi) {
    await conn.query(
      `INSERT INTO \`demografi\` (\`desa_id\`, \`dusun_data\`) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE \`dusun_data\` = VALUES(\`dusun_data\`)`,
      [d.desa_id, JSON.stringify(d.dusun_data)]
    );
  }

  console.log('🌱 Mengisi data mata pencaharian...');
  // Hapus dulu agar tidak duplikasi (tidak ada natural PK untuk row ini)
  await conn.query(`DELETE FROM \`mata_pencaharian\``);
  for (const mp of mataPencaharian) {
    await conn.query(
      `INSERT INTO \`mata_pencaharian\` (\`desa_id\`, \`nama\`, \`persentase\`) VALUES (?, ?, ?)`,
      [mp.desa_id, mp.nama, mp.persentase]
    );
  }

  console.log('🌱 Mengisi data pendidikan...');
  for (const p of pendidikan) {
    await conn.query(
      `INSERT INTO \`pendidikan\` (\`desa_id\`, \`data\`) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE \`data\` = VALUES(\`data\`)`,
      [p.desa_id, JSON.stringify(p.data)]
    );
  }

  console.log('🌱 Mengisi data users...');
  const resetPasswords = process.argv.includes('--reset-passwords');
  const adminPass = env.ADMIN_PASSWORD || 'pass123';
  const desaPass  = env.DESA_PASSWORD || 'pass123';

  for (const u of defaultUsers) {
    const rawPass = u.role === 'bps' ? adminPass : desaPass;

    const [existing] = await conn.query('SELECT id, password_hash FROM users WHERE username = ?', [u.username]);
    const exists = Array.isArray(existing) && existing.length > 0;

    if (exists && !resetPasswords) {
      await conn.query(
        'UPDATE users SET role = ?, desa_id = ? WHERE username = ?',
        [u.role, u.desa_id, u.username]
      );
    } else {
      const hash = await bcrypt.hash(rawPass, 10);
      await conn.query(
        `INSERT INTO \`users\` (\`username\`, \`password_hash\`, \`role\`, \`desa_id\`) VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE \`password_hash\` = VALUES(\`password_hash\`), \`role\` = VALUES(\`role\`), \`desa_id\` = VALUES(\`desa_id\`)`,
        [u.username, hash, u.role, u.desa_id]
      );
    }
  }

  await conn.query('SET FOREIGN_KEY_CHECKS = 1;');
  await conn.end();

  console.log('\n✅ Selesai! Ringkasan akun terdaftar:\n');
  console.table(defaultUsers.map(u => ({ username: u.username, role: u.role, desa_id: u.desa_id ?? '-' })));
  console.log('');
}

main().catch(err => {
  console.error('\n❌ Seed gagal:', err.message);
  process.exit(1);
});
