import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import path from 'path';
import healthRouter from './routes/health.routes';
import { seedDatabase } from './db/seed';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/health', healthRouter);

app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'HERA NASA Space Apps Backend' });
});

async function start() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://nasa:nasa_secret@db:5432/hackathon',
  });
  const db = drizzle(pool);

  try {
    console.log('⏳ Checking and running database migrations on startup...');
    await migrate(db, { migrationsFolder: path.join(__dirname, '../drizzle') });
    console.log('✅ Database schema verified/migrated successfully.');

    await seedDatabase();
    console.log('🌱 Database seeded with Artemis IV baseline.');
  } catch (err) {
    console.error('❌ Startup migration/seed error:', err);
  }

  app.listen(port, () => {
    console.log(`🚀 HERA Server running on http://localhost:${port}`);
  });
}

start();