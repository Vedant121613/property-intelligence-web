import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load server/.env explicitly if present
dotenv.config({ path: resolve(__dirname, '.env') });

const isProduction = process.env.NODE_ENV === 'production';

// Support DATABASE_URL or individual PG variables
const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('sslmode=require') || process.env.PGSSL === 'true'
        ? { rejectUnauthorized: false }
        : false,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    }
  : {
      host: process.env.PGHOST || 'localhost',
      port: parseInt(process.env.PGPORT || '5432', 10),
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || 'postgres',
      database: process.env.PGDATABASE || 'pureframe_db',
      ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    };

const pool = new Pool(poolConfig);

// Pool Events
pool.on('error', (err) => {
  console.error('[DB] ❌ Unexpected error on idle PostgreSQL client:', err.message);
});

// Automatic Database Schema Migration on Startup
export async function initializeDatabase(retries = 5, delayMs = 3000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`[DB] 🔄 Attempting database initialization (attempt ${attempt}/${retries})...`);
      const client = await pool.connect();
      try {
        const sqlPath = resolve(__dirname, 'init-db.sql');
        if (fs.existsSync(sqlPath)) {
          const sql = fs.readFileSync(sqlPath, 'utf8');
          await client.query(sql);
          console.log('[DB] ✅ Database schema & single user (user@123) successfully verified & initialized.');
        } else {
          console.warn(`[DB] ⚠ init-db.sql not found at ${sqlPath}. Skipping schema init.`);
        }
        return true;
      } finally {
        client.release();
      }
    } catch (err) {
      console.warn(`[DB] ⚠ Database connection/migration attempt ${attempt} failed: ${err.message}`);
      if (attempt < retries) {
        console.log(`[DB] ⏳ Retrying in ${delayMs / 1000} seconds...`);
        await new Promise((res) => setTimeout(res, delayMs));
      } else {
        console.error('[DB] ❌ All database initialization attempts failed. Server will continue in fallback mode.');
      }
    }
  }
  return false;
}

// Trigger initial migration asynchronously on module load
initializeDatabase();

// Query Helper with Logging
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    if (duration > 1000) {
      console.warn(`[DB] ⚠ Slow query (${duration}ms): ${text.substring(0, 80)}...`);
    }
    return result;
  } catch (err) {
    console.error(`[DB] ❌ Query error after ${Date.now() - start}ms`);
    console.error(`[DB]    Query: ${text.substring(0, 120)}`);
    console.error(`[DB]    Error: ${err.message}`);
    throw err;
  }
};

export default pool;
