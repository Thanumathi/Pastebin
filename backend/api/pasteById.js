import pool from "../db.js";

export default async function handler(req, res) {
  const { id } = req.query;

  const result = await pool.query(
    `SELECT * FROM pastes WHERE id = $1`,
    [id]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: "not found" });
  }

  const paste = result.rows[0];

  if (paste.expires_at && new Date() > paste.expires_at) {
    return res.status(404).json({ error: "expired" });
  }

  if (paste.max_views && paste.view_count >= paste.max_views) {
    return res.status(404).json({ error: "view limit exceeded" });
  }

  await pool.query(
    `UPDATE pastes SET view_count = view_count + 1 WHERE id = $1`,
    [id]
  );

  res.json({ content: paste.content });
}
