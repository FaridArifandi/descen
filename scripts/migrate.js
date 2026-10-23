/**
 * scripts/migrate.js
 *
 * Membuat database (jika belum ada) dan semua skema tabel.
 * Aman dijalankan berulang kali — tabel yang sudah ada TIDAK akan di-drop
 * kecuali di mode --fresh.
 *
 * Usage:
 *   node scripts/migrate.js          ← buat tabel jika belum ada
 *   node scripts/migrate.js --fresh  ← drop & buat ulang semua tabel
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// ─── Baca .env manual (tidak perlu dotenv) ───────────────────────────────────
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

// ─── Skema tabel ─────────────────────────────────────────────────────────────
function buildSchema(fresh) {
  const drop   = (t) => `DROP TABLE IF EXISTS \`${t}\`;`;
  const header = `SET NAMES utf8mb4; SET FOREIGN_KEY_CHECKS = 0;`;
  const footer = `SET FOREIGN_KEY_CHECKS = 1;`;

  const tables = [
    // 1. kecamatan
    {
      name: 'kecamatan',
      ddl: `CREATE TABLE IF NOT EXISTS \`kecamatan\` (
        \`id\`   INT AUTO_INCREMENT PRIMARY KEY,
        \`nama\` VARCHAR(255) NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
    },
    // 2. desa
    {
      name: 'desa',
      ddl: `CREATE TABLE IF NOT EXISTS \`desa\` (
        \`id\`                 INT AUTO_INCREMENT PRIMARY KEY,
        \`nama\`               VARCHAR(255) NOT NULL,
        \`kecamatan_id\`       INT NOT NULL,
        \`tahun_pembinaan\`    INT DEFAULT 2026,
        \`foto_cover\`         TEXT,
        \`profil_abstrak\`     TEXT,
        \`profil_file_url\`    TEXT,
        \`monografi_abstrak\`  TEXT,
        \`monografi_file_url\` TEXT,
        \`latitude\`           DECIMAL(10,6) DEFAULT 0.000000,
        \`longitude\`          DECIMAL(10,6) DEFAULT 0.000000,
        FOREIGN KEY (\`kecamatan_id\`) REFERENCES \`kecamatan\`(\`id\`) ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
    },
    // 3. publikasi
    {
      name: 'publikasi',
      ddl: `CREATE TABLE IF NOT EXISTS \`publikasi\` (
        \`id\`         INT AUTO_INCREMENT PRIMARY KEY,
        \`desa_id\`    INT NOT NULL,
        \`judul\`      VARCHAR(500) NOT NULL,
        \`tahun\`      INT NOT NULL,
        \`ringkasan\`  TEXT,
        \`cover_url\`  TEXT,
        \`pdf_url\`    TEXT,
        FOREIGN KEY (\`desa_id\`) REFERENCES \`desa\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
    },
    // 4. potensi
    {
      name: 'potensi',
      ddl: `CREATE TABLE IF NOT EXISTS \`potensi\` (
        \`id\`           INT AUTO_INCREMENT PRIMARY KEY,
        \`desa_id\`      INT NOT NULL,
        \`kategori\`     ENUM('ekonomi','wisata','investasi') DEFAULT 'ekonomi',
        \`sub_kategori\` VARCHAR(255),
        \`judul\`        VARCHAR(500) NOT NULL,
        \`deskripsi\`    TEXT,
        \`foto_url\`     TEXT,
        \`video_url\`    TEXT,
        FOREIGN KEY (\`desa_id\`) REFERENCES \`desa\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
    },
    // 5. infografis
    {
      name: 'infografis',
      ddl: `CREATE TABLE IF NOT EXISTS \`infografis\` (
        \`id\`         INT AUTO_INCREMENT PRIMARY KEY,
        \`desa_id\`    INT NOT NULL,
        \`judul\`      VARCHAR(500) NOT NULL,
        \`gambar_url\` TEXT,
        FOREIGN KEY (\`desa_id\`) REFERENCES \`desa\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
    },
    // 6. demografi
    {
      name: 'demografi',
      ddl: `CREATE TABLE IF NOT EXISTS \`demografi\` (
        \`id\`          INT AUTO_INCREMENT PRIMARY KEY,
        \`desa_id\`     INT NOT NULL UNIQUE,
        \`dusun_data\`  JSON,
        FOREIGN KEY (\`desa_id\`) REFERENCES \`desa\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
    },
    // 7. mata_pencaharian
    {
      name: 'mata_pencaharian',
      ddl: `CREATE TABLE IF NOT EXISTS \`mata_pencaharian\` (
        \`id\`          INT AUTO_INCREMENT PRIMARY KEY,
        \`desa_id\`     INT NOT NULL,
        \`nama\`        VARCHAR(255) NOT NULL,
        \`persentase\`  DECIMAL(5,2) DEFAULT 0.00,
        FOREIGN KEY (\`desa_id\`) REFERENCES \`desa\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
    },
    // 8. pendidikan
    {
      name: 'pendidikan',
      ddl: `CREATE TABLE IF NOT EXISTS \`pendidikan\` (
        \`id\`       INT AUTO_INCREMENT PRIMARY KEY,
        \`desa_id\`  INT NOT NULL UNIQUE,
        \`data\`     JSON,
        FOREIGN KEY (\`desa_id\`) REFERENCES \`desa\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
    },
    // 9. pesan_kontak
    {
      name: 'pesan_kontak',
      ddl: `CREATE TABLE IF NOT EXISTS \`pesan_kontak\` (
        \`id\`         INT AUTO_INCREMENT PRIMARY KEY,
        \`nama\`       VARCHAR(255) NOT NULL,
        \`email\`      VARCHAR(255) NOT NULL,
        \`subjek\`     VARCHAR(500),
        \`isi\`        TEXT,
        \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
    },
    // 10. users
    {
      name: 'users',
      ddl: `CREATE TABLE IF NOT EXISTS \`users\` (
        \`id\`            INT AUTO_INCREMENT PRIMARY KEY,
        \`username\`      VARCHAR(100) UNIQUE NOT NULL,
        \`password_hash\` VARCHAR(255) NOT NULL,
        \`role\`          ENUM('bps','desa') DEFAULT 'desa',
        \`desa_id\`       INT NULL,
        \`created_at\`    DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (\`desa_id\`) REFERENCES \`desa\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
    },
  ];

  const parts = [header];

  if (fresh) {
    // Drop dalam urutan terbalik agar FK tidak error
    [...tables].reverse().forEach(t => parts.push(drop(t.name)));
  }

  tables.forEach(t => parts.push(t.ddl));
  parts.push(footer);

  return parts.join('\n\n');
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const fresh = process.argv.includes('--fresh');
  const env   = loadEnv();

  const config = {
    host:     env.DB_HOST     || 'localhost',
    user:     env.DB_USER     || 'root',
    password: env.DB_PASSWORD ?? '',
    database: env.DB_NAME     || 'descan_descan',
  };

  console.log(`\n🔗 Menghubungkan ke MySQL ${config.host} (db: ${config.database})...`);

  // Pastikan database ada terlebih dahulu
  const server = await mysql.createConnection({ host: config.host, user: config.user, password: config.password });
  await server.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
  await server.end();

  const conn = await mysql.createConnection({ ...config, multipleStatements: true });

  if (fresh) {
    console.log('⚠️  Mode --fresh: semua tabel akan di-DROP dan dibuat ulang.\n');
  }

  console.log('📋 Menjalankan skema tabel...');
  await conn.query(buildSchema(fresh));

  // Tampilkan hasil
  const [tables] = await conn.query('SHOW TABLES;');
  console.log('\n✅ Tabel yang tersedia di database:');
  tables.forEach(t => console.log(`   • ${Object.values(t)[0]}`));

  await conn.end();
  console.log('\n🎉 Migrasi selesai!\n');
}

main().catch(err => {
  console.error('\n❌ Migrasi gagal:', err.message);
  process.exit(1);
});
