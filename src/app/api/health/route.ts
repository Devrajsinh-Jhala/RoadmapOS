import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { isDemoMode } from "@/lib/current-user";

export const dynamic = "force-dynamic";

export async function GET() {
  let databaseReachable: boolean | null = null;

  if (db && process.env.DATABASE_URL) {
    try {
      await db.execute(sql`select 1`);
      databaseReachable = true;
    } catch {
      databaseReachable = false;
    }
  }

  const checks = {
    demoMode: isDemoMode(),
    databaseConfigured: Boolean(process.env.DATABASE_URL),
    databaseReachable,
    simpleSignInEnabled: isDemoMode() || Boolean(process.env.DATABASE_URL),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
  };

  const healthy =
    checks.demoMode ||
    (checks.databaseConfigured && checks.databaseReachable !== false);

  return NextResponse.json(
    {
      status: healthy ? "ok" : "degraded",
      checks,
    },
    { status: healthy ? 200 : 503 },
  );
}
