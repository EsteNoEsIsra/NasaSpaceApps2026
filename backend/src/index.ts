import 'dotenv/config';
import app from './app';
import { seedDatabase } from './db/seed';

const PORT = process.env.PORT ?? 3000;

async function start() {
  try {
    await seedDatabase();
    console.log('  21-day astronaut baseline & telemetry seeded');
  } catch (err) {
    console.warn('  Seed skipped (run `npx drizzle-kit push` if tables do not exist yet):', err);
  }

  app.listen(PORT, () => {
    console.log(`  Server running on http://localhost:${PORT}`);
  });
}

start();