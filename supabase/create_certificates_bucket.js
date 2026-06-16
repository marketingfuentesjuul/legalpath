import pg from 'pg';
import fs from 'fs';
import pathModule from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = pathModule.dirname(__filename);

// Read .env.local to find SUPABASE_DB_URL
const envPath = pathModule.join(__dirname, '..', '.env.local');
let connectionString = process.env.SUPABASE_DB_URL;

if (!connectionString && fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/^SUPABASE_DB_URL=(.+)$/m);
  if (match) {
    connectionString = match[1].trim();
  }
}

if (!connectionString) {
  console.error("Error: SUPABASE_DB_URL not found in environment or .env.local");
  process.exit(1);
}

const run = async () => {
  const client = new pg.Client({ connectionString });
  await client.connect();
  console.log("Connected to Supabase PostgreSQL database.");

  const sql = `
    -- Create certificates bucket
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('certificates', 'certificates', true)
    ON CONFLICT (id) DO UPDATE SET public = true;

    -- Create policies for SELECT and INSERT access on certificates bucket
    DO $$
    BEGIN
        -- Public SELECT access for certificates
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'objects' 
            AND schemaname = 'storage' 
            AND policyname = 'Public Access to Certificates'
        ) THEN
            CREATE POLICY "Public Access to Certificates" ON storage.objects 
            FOR SELECT 
            USING (bucket_id = 'certificates');
        END IF;

        -- INSERT access for certificates uploads
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'objects' 
            AND schemaname = 'storage' 
            AND policyname = 'Allow Certificates Uploads'
        ) THEN
            CREATE POLICY "Allow Certificates Uploads" ON storage.objects 
            FOR INSERT 
            WITH CHECK (bucket_id = 'certificates');
        END IF;

        -- UPDATE access for certificates
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'objects' 
            AND schemaname = 'storage' 
            AND policyname = 'Allow Certificates Updates'
        ) THEN
            CREATE POLICY "Allow Certificates Updates" ON storage.objects 
            FOR UPDATE 
            USING (bucket_id = 'certificates');
        END IF;

        -- DELETE access for certificates
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'objects' 
            AND schemaname = 'storage' 
            AND policyname = 'Allow Certificates Deletes'
        ) THEN
            CREATE POLICY "Allow Certificates Deletes" ON storage.objects 
            FOR DELETE 
            USING (bucket_id = 'certificates');
        END IF;
    END
    $$;
  `;

  console.log("Executing SQL script to create 'certificates' storage bucket and policies...");
  await client.query(sql);
  console.log("Successfully created certificates bucket and storage policies!");
  await client.end();
};

run().catch(err => {
  console.error("Error executing database operations:", err);
  process.exit(1);
});
