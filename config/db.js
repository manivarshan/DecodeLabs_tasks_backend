// config/db.js
// TiDB Cloud database connection using mysql2 connection pool
// TiDB Cloud is MySQL-compatible and requires SSL (TLSv1.2+)

const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host:               process.env.DB_HOST,
  port:               parseInt(process.env.DB_PORT) || 4000,
  user:               process.env.DB_USER,
  password:           process.env.DB_PASSWORD,
  database:           process.env.DB_NAME,
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true,
  },
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  connectTimeout:     20000,
});

// Promisified pool — enables async/await throughout the application
const db = pool.promise();

// Test connection on startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error('[DB] TiDB Cloud connection failed:', err.message);
    return;
  }
  console.log('[DB] TiDB Cloud connected successfully');
  console.log(`[DB] Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
  connection.release();
});

module.exports = db;
