const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function main() {
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:u3NR7MyI6BA6ML0R@db.rcuoznqhdzqmkgzrkzmw.supabase.co:5432/postgres';
  console.log('Connecting to Supabase PostgreSQL at:', connectionString.replace(/:[^:@]+@/, ':****@'));

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    await client.connect();
    console.log('Connected successfully to Supabase DB!');

    const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Applying supabase/schema.sql...');
    await client.query(sql);
    console.log('Schema applied successfully!');

    // Test query
    const res = await client.query('SELECT count(*) FROM campuses;');
    console.log(`Verified campuses count in Supabase: ${res.rows[0].count}`);

    const resListings = await client.query('SELECT count(*) FROM categories;');
    console.log(`Verified categories count in Supabase: ${resListings.rows[0].count}`);

    await client.end();
    process.exit(0);
  } catch (err) {
    console.error('Error applying schema to Supabase:', err.message);
    if (client) await client.end().catch(() => {});
    process.exit(1);
  }
}

main();
