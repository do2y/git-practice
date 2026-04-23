import mysql from 'mysql2/promise';

declare global {
  // eslint-disable-next-line no-var
  var __dbPool: mysql.Pool | undefined;
}

const pool =
  globalThis.__dbPool ??
  mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'testuser',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_NAME || 'testdb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    dateStrings: true,
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.__dbPool = pool;
}

export default pool;
