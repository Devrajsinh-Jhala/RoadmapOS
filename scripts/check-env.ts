import { config } from "dotenv";

config({ path: ".env", quiet: true });
config({ path: ".env.local", override: true, quiet: true });

const errors: string[] = [];
const warnings: string[] = [];

function value(name: string) {
  const raw = process.env[name];
  return raw && raw.trim().length > 0 ? raw.trim() : "";
}

function isPlaceholder(raw: string) {
  return /USER:PASSWORD|replace-with|your-|example/i.test(raw);
}

const demoMode = value("ROADMAPOS_DEMO_MODE") === "true";
const databaseUrl = value("DATABASE_URL");
const geminiKey = value("GEMINI_API_KEY");

if (demoMode) {
  warnings.push("ROADMAPOS_DEMO_MODE is not false. The app will use demo fallback behavior.");
} else {
  if (!databaseUrl || isPlaceholder(databaseUrl)) {
    errors.push("DATABASE_URL is required for real deployment.");
  }
}

if (!geminiKey) {
  warnings.push("GEMINI_API_KEY is missing. Roadmap and research flows will use deterministic fallbacks.");
}

for (const warning of warnings) {
  console.warn(`[warn] ${warning}`);
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`[error] ${error}`);
  }
  process.exit(1);
}

console.log("[ok] Environment check passed.");
