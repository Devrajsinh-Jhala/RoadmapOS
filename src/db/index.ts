import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";

export const db = process.env.DATABASE_URL
  ? drizzle(process.env.DATABASE_URL, { schema })
  : null;

export type Db = NonNullable<typeof db>;
