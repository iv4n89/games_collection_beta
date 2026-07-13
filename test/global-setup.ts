import { execFileSync } from "node:child_process";
import { Client } from "pg";
import { ADMIN_DATABASE_URL, TEST_DATABASE_URL } from "./db-url";

const TEST_DB_NAME = "gamecolector_test";

// Crea la base de datos de test si no existe y aplica las migraciones antes de
// correr la suite. Se ejecuta una vez por invocación de Vitest.
export default async function setup() {
  await ensureTestDatabase();
  execFileSync("npx", ["prisma", "migrate", "deploy"], {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: TEST_DATABASE_URL },
  });
}

async function ensureTestDatabase() {
  const client = new Client({ connectionString: ADMIN_DATABASE_URL });
  await client.connect();
  const existing = await client.query(
    "SELECT 1 FROM pg_database WHERE datname = $1",
    [TEST_DB_NAME],
  );
  if (existing.rowCount === 0) {
    await client.query(`CREATE DATABASE ${TEST_DB_NAME}`);
  }
  await client.end();
}
