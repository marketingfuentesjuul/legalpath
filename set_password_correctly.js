import pg from 'pg';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const envPath = './.env.local';
let connectionString;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/^SUPABASE_DB_URL=(.+)$/m);
  if (match) {
    connectionString = match[1].trim(); // Keep the original db.wheslluscfpfqyuzywgy.supabase.co host
  }
}

if (!connectionString) {
  console.error("Error: SUPABASE_DB_URL not found");
  process.exit(1);
}

const run = async () => {
  const password = 'AdminPassword123!';
  // Generate bcrypt hash using 10 rounds (GoTrue default)
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  console.log("Generated bcrypt hash:", hash);

  const client = new pg.Client({ connectionString });
  await client.connect();
  console.log("Connected to DB successfully.");

  const res = await client.query(
    "UPDATE auth.users SET encrypted_password = $1 WHERE email = 'gabrielmezaroo@gmail.com' RETURNING id, email, encrypted_password",
    [hash]
  );
  console.log("Updated user in DB:", res.rows);

  await client.end();
};

run().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
