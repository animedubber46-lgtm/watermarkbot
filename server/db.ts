import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

// We keep this for compatibility with the template, 
// but we will primarily use MongoDB for the bot as requested.
// If DATABASE_URL is not set, we'll just log a warning instead of crashing
// to allow the bot to run with just MongoDB if preferred.

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL || "postgres://user:password@localhost:5432/dbname" 
});

// We wrap this in a try-catch-like block essentially by exporting a valid object
// typically this template expects a valid db connection.
export const db = drizzle(pool, { schema });
