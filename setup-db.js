// setup-db.js
// One-time script to create all tables in TiDB Cloud
// Run once: node setup-db.js

require('dotenv').config();
const mysql = require('mysql2/promise');
const fs    = require('fs');
const path  = require('path');

async function setupDatabase() {
  console.log('');
  console.log('================================================');
  console.log('  MediBook -- TiDB Cloud Database Setup');
  console.log('================================================');
  console.log('');

  let connection;

  try {
    console.log('[1/4] Connecting to TiDB Cloud...');
    connection = await mysql.createConnection({
      host:     process.env.DB_HOST,
      port:     parseInt(process.env.DB_PORT) || 4000,
      user:     process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true,
      },
    });
    console.log('[1/4] Connected to TiDB Cloud successfully');

    // Create the database and select it
    console.log('[2/4] Creating database hospital_db...');
    await connection.execute('CREATE DATABASE IF NOT EXISTS hospital_db');
    await connection.execute('USE hospital_db');
    console.log('[2/4] Database hospital_db is ready');

    // Read the SQL file
    console.log('[3/4] Reading schema.sql...');
    const schemaPath = path.join(__dirname, '..', 'Database', 'schema.sql');
    const raw = fs.readFileSync(schemaPath, 'utf8');

    // Remove single-line comments, then remove blank lines
    const cleaned = raw
      .split('\n')
      .filter(line => !line.trim().startsWith('--'))
      .join('\n');

    // Split on semicolons and clean up each statement
    const statements = cleaned
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 10); // skip tiny/empty fragments

    console.log(`[3/4] Parsed ${statements.length} SQL statements`);

    // Execute each statement
    console.log('[4/4] Executing statements...');
    let ok = 0;
    let skipped = 0;

    for (const stmt of statements) {
      // Skip USE / CREATE DATABASE — we already did that
      if (/^(USE |CREATE DATABASE)/i.test(stmt)) {
        skipped++;
        continue;
      }
      try {
        await connection.execute(stmt);
        // Print short summary of what was created
        const match = stmt.match(/CREATE TABLE\s+(?:IF NOT EXISTS\s+)?(\w+)/i)
                   || stmt.match(/CREATE INDEX\s+(\w+)/i)
                   || stmt.match(/INSERT INTO\s+(\w+)/i);
        if (match) console.log(`  + ${match[0].substring(0, 60)}`);
        ok++;
      } catch (err) {
        if (err.code === 'ER_TABLE_EXISTS_ERROR' || err.code === 'ER_DUP_ENTRY') {
          skipped++;
        } else {
          console.warn(`  Warning [${err.code}]: ${err.message.substring(0, 80)}`);
        }
      }
    }

    console.log(`[4/4] Done -- ${ok} executed, ${skipped} skipped`);

    // Verify tables
    console.log('');
    console.log('Tables created in hospital_db:');
    const [tables] = await connection.execute('SHOW TABLES');
    tables.forEach(t => console.log('  - ' + Object.values(t)[0]));

    // Quick row count check
    console.log('');
    console.log('Seed data check:');
    const checks = ['departments', 'doctors', 'patients', 'appointments'];
    for (const table of checks) {
      const [[row]] = await connection.execute(`SELECT COUNT(*) as c FROM ${table}`);
      console.log(`  ${table}: ${row.c} rows`);
    }

    console.log('');
    console.log('================================================');
    console.log('  Setup complete! Now run: npm run dev');
    console.log('================================================');
    console.log('');

  } catch (err) {
    console.error('');
    console.error('Setup failed:', err.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

setupDatabase();
