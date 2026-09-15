const mysql = require('mysql2/promise');

async function migrate() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'descan_user',
    password: process.env.DB_PASSWORD || 'descansubul1175',
    database: process.env.DB_NAME || 'descan_descan',
  });

  try {
    console.log('Running migration for `pendidikan` table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`pendidikan\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`desa_id\` INT NOT NULL UNIQUE,
        \`data\` JSON,
        FOREIGN KEY (\`desa_id\`) REFERENCES \`desa\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✓ Table `pendidikan` created / verified.');

    const defaultData1 = JSON.stringify([
      { tingkat: 'Tidak/belum tamat SD', lakiLaki: 0, perempuan: 0 },
      { tingkat: 'SD / MI', lakiLaki: 0, perempuan: 0 },
      { tingkat: 'SMP / MTs', lakiLaki: 0, perempuan: 0 },
      { tingkat: 'SMA / SMK / MA', lakiLaki: 5, perempuan: 1 },
      { tingkat: 'Diploma I / II / III', lakiLaki: 0, perempuan: 1 },
      { tingkat: 'S1 / Diploma IV', lakiLaki: 1, perempuan: 4 },
      { tingkat: 'S2 / S3 / Profesi', lakiLaki: 0, perempuan: 1 },
    ]);

    const defaultData2 = JSON.stringify([
      { tingkat: 'Tidak/belum tamat SD', lakiLaki: 0, perempuan: 0 },
      { tingkat: 'SD / MI', lakiLaki: 0, perempuan: 0 },
      { tingkat: 'SMP / MTs', lakiLaki: 0, perempuan: 0 },
      { tingkat: 'SMA / SMK / MA', lakiLaki: 4, perempuan: 2 },
      { tingkat: 'Diploma I / II / III', lakiLaki: 1, perempuan: 1 },
      { tingkat: 'S1 / Diploma IV', lakiLaki: 2, perempuan: 3 },
      { tingkat: 'S2 / S3 / Profesi', lakiLaki: 0, perempuan: 0 },
    ]);

    const defaultData3 = JSON.stringify([
      { tingkat: 'Tidak/belum tamat SD', lakiLaki: 0, perempuan: 0 },
      { tingkat: 'SD / MI', lakiLaki: 0, perempuan: 0 },
      { tingkat: 'SMP / MTs', lakiLaki: 0, perempuan: 0 },
      { tingkat: 'SMA / SMK / MA', lakiLaki: 6, perempuan: 2 },
      { tingkat: 'Diploma I / II / III', lakiLaki: 0, perempuan: 2 },
      { tingkat: 'S1 / Diploma IV', lakiLaki: 3, perempuan: 4 },
      { tingkat: 'S2 / S3 / Profesi', lakiLaki: 1, perempuan: 0 },
    ]);

    await pool.query(
      `INSERT INTO \`pendidikan\` (\`desa_id\`, \`data\`) VALUES (1, ?), (2, ?), (3, ?)
       ON DUPLICATE KEY UPDATE \`data\` = VALUES(\`data\`)`,
      [defaultData1, defaultData2, defaultData3]
    );
    console.log('✓ Initial data for `pendidikan` seeded successfully!');

    const [rows] = await pool.query('SELECT * FROM `pendidikan`');
    console.log('Current rows in `pendidikan`:', rows.length);
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    await pool.end();
  }
}

migrate();
