/**
 * seed_passwords.js
 * 
 * Script untuk men-generate bcrypt hash untuk user default.
 * Jalankan: node seed_passwords.js
 * 
 * Setelah mendapat hash, update tabel `users` di phpMyAdmin:
 * UPDATE users SET password_hash = '<hash>' WHERE username = '<username>';
 */

const bcrypt = require('bcryptjs');

const users = [
  { username: 'admin', password: 'pass123' },
  { username: 'desa_penangalanbarat', password: 'pass123' },
  { username: 'desa_laebersih', password: 'pass123' },
  { username: 'desa_sikelang', password: 'pass123' },
];

async function generateHashes() {
  console.log('=== Bcrypt Password Hashes ===\n');
  console.log('Salin SQL berikut ke phpMyAdmin:\n');
  
  for (const user of users) {
    const hash = await bcrypt.hash(user.password, 10);
    console.log(`UPDATE users SET password_hash = '${hash}' WHERE username = '${user.username}';`);
  }
  
  console.log('\n=== Selesai ===');
  console.log('Jalankan SQL di atas di phpMyAdmin setelah menjalankan migration.sql');
}

generateHashes();
