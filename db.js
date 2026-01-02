import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();


const { Pool } = pkg;
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
await db.query(
  `INSERT INTO pastes (id, content, expires_at, max_views, view_count)
   VALUES ($1, $2, $3, $4, 0)`,
  [id, content, expiresAt, max_views ?? null]
);
