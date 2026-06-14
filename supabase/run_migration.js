import pg from 'pg';
import fs from 'fs';
import path from 'url';
import fileSystem from 'fs';
import pathModule from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = pathModule.dirname(__filename);

// Read .env.local to find SUPABASE_DB_URL
const envPath = pathModule.join(__dirname, '..', '.env.local');
let connectionString = process.env.SUPABASE_DB_URL;

if (!connectionString && fileSystem.existsSync(envPath)) {
  const envContent = fileSystem.readFileSync(envPath, 'utf8');
  const match = envContent.match(/^SUPABASE_DB_URL=(.+)$/m);
  if (match) {
    connectionString = match[1].trim();
  }
}

if (!connectionString) {
  console.error("Error: SUPABASE_DB_URL not found in environment or .env.local");
  process.exit(1);
}

const sqlPath = pathModule.join(__dirname, 'migrations', '20260614000000_lawyer_verification_flow.sql');

const run = async () => {
  const client = new pg.Client({ connectionString });
  await client.connect();
  console.log("Connected to Supabase PostgreSQL database.");
  const sql = fileSystem.readFileSync(sqlPath, 'utf8');
  console.log("Executing SQL migration script...");
  await client.query(sql);
  console.log("Migration script executed successfully!");
  await client.end();
};

run().catch(err => {
  console.error("Error executing migration:", err);
  process.exit(1);
});
