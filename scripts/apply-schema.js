const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function main() {
  const host = 'aws-0-ap-southeast-1.pooler.supabase.com';
  const defaultConnectionString = `postgresql://postgres.rcuoznqhdzqmkgzrkzmw:u3NR7MyI6BA6ML0R@${host}:5432/postgres`;
  const connectionString = process.env.DATABASE_URL || defaultConnectionString;
  console.log('Connecting to Supabase PostgreSQL at:', connectionString.replace(/:[^:@]+@/, ':****@'));

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });

  try {
    await client.connect();
    console.log('Connected successfully to Supabase DB!');

    const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Applying schema.sql to Supabase...');
    await client.query(sql);
    console.log('Schema applied successfully!');

    // Test query campuses
    const resCampuses = await client.query('SELECT count(*) FROM campuses;');
    console.log(`Campuses seeded: ${resCampuses.rows[0].count}`);

    // Test query categories
    const resCategories = await client.query('SELECT count(*) FROM categories;');
    console.log(`Categories seeded: ${resCategories.rows[0].count}`);

    // Test query exchange spots
    const resSpots = await client.query('SELECT count(*) FROM campus_exchange_spots;');
    console.log(`Safe Exchange spots seeded: ${resSpots.rows[0].count}`);

    await client.end();
    console.log('Database setup 100% complete!');
    process.exit(0);
  } catch (err) {
    console.error('Error applying schema to Supabase:', err.message);
    if (client) await client.end().catch(() => {});
    process.exit(1);
  }
}

main();
