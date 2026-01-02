import pool from "../../db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { content, ttl_seconds, max_views } = req.body;

  if (!content) {
    return res.status(400).json({ error: "content required" });
  }

  const expiresAt = ttl_seconds
    ? new Date(Date.now() + ttl_seconds * 1000)
    : null;

  const id = crypto.randomUUID().slice(0, 8);

  await pool.query(
    `INSERT INTO pastes (id, content, expires_at, max_views)
     VALUES ($1, $2, $3, $4)`,
    [id, content, expiresAt, max_views ?? null]
  );

  res.status(201).json({
    id,
    url: `${req.headers.origin}/p/${id}`,
  });
}
