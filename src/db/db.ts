import pg from "pg";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

const { Pool } = pg;

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const db = drizzle({ client: pool });
