import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

config({ path: ".env", quiet: true });
config({ path: ".env.local", override: true, quiet: true });

async function main() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required to run migrations.");
  }

  const db = drizzle(databaseUrl);
  await migrate(db, { migrationsFolder: "drizzle" });
  console.log("[ok] Database migrations applied.");
}

main().catch((error) => {
  console.error("[error] Migration failed.");
  console.error(error);
  process.exit(1);
});
