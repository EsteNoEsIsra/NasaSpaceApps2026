import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://nasa:nasa_secret@db:5432/hackathon',
});

async function main() {
  const db = drizzle(pool);
  console.log('⏳ Running migrations...');

  try {
    // Apunta directamente a la carpeta drizzle en la raíz del contenedor (/app/drizzle)
    await migrate(db, { migrationsFolder: path.join(__dirname, '../../drizzle') });
    console.log('✅ Migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();