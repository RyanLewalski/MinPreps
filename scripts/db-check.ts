// Verifies that the app can reach Postgres through Prisma.
// Usage: npm run db:check
import "dotenv/config";

import { db } from "@/lib/db";

interface Row {
  version: string;
  database: string;
  user: string;
  now: Date;
}

async function main(): Promise<void> {
  const started = Date.now();
  const rows = await db.$queryRaw<Row[]>`
    SELECT version() AS version,
           current_database() AS database,
           current_user AS user,
           now() AS now
  `;
  const row = rows[0];
  if (!row) {
    throw new Error("Health check query returned no rows.");
  }

  const elapsed = Date.now() - started;
  console.warn("Database connection OK");
  console.warn(`  database : ${row.database}`);
  console.warn(`  user     : ${row.user}`);
  console.warn(`  server   : ${row.version.split(" on ")[0] ?? row.version}`);
  console.warn(`  time     : ${row.now.toISOString()}`);
  console.warn(`  latency  : ${elapsed} ms`);
}

main()
  .catch((error: unknown) => {
    console.error("Database connection FAILED");
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
