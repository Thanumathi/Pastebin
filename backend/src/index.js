import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();

const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
function nowMs(req) {
  if (process.env.TEST_MODE === "1") {
    const headerTime = req.header("x-test-now-ms");
    if (headerTime) {
      return Number(headerTime);
    }
  }
  return Date.now();
}
const PORT = process.env.PORT || 3000;

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

function getNow(req) {
  if (process.env.TEST_MODE === "1" && req.headers["x-test-now-ms"]) {
    return new Date(Number(req.headers["x-test-now-ms"]));
  }
  return new Date();
}


  //HEALTH CHECK
 
app.get("/api/healthz", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false });
  }
});

app.post("/api/pastes", async (req, res) => {
  const { content, ttl_seconds, max_views } = req.body;

  let expiresAt = null;

if (ttl_seconds) {
  expiresAt = new Date(Date.now() + ttl_seconds * 1000);
}


  if (!content || typeof content !== "string" || content.trim() === "") {
    return res.status(400).json({ error: "content is required" });
  }

  if (ttl_seconds !== undefined && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
    return res.status(400).json({ error: "ttl_seconds must be >= 1" });
  }

  if (max_views !== undefined && (!Number.isInteger(max_views) || max_views < 1)) {
    return res.status(400).json({ error: "max_views must be >= 1" });
  }

  const id = generateId();


  try {
    await pool.query(
      `INSERT INTO pastes (id, content, expires_at, max_views)
       VALUES ($1, $2, $3, $4)`,
      [id, content, expiresAt, max_views ?? null]
    );

    res.status(201).json({
      id,
      url: `${req.protocol}://${req.get("host")}/p/${id}`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal server error" });
  }
});


app.get("/api/pastes/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM pastes WHERE id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "paste not found" });
    }

    const paste = result.rows[0];
    const currentTime = nowMs(req);

    // TTL check
    if (paste.expires_at && new Date(paste.expires_at).getTime() <= currentTime) {
      return res.status(404).json({ error: "paste expired" });
    }

    // View limit check
    if (paste.max_views !== null && paste.view_count >= paste.max_views) {
      return res.status(404).json({ error: "Paste not found" });
    }

    // Increment view count
    await pool.query(
      `UPDATE pastes SET view_count = view_count + 1 WHERE id = $1`,
      [id]
    );

    const remainingViews =
      paste.max_views === null
        ? null
        : Math.max(paste.max_views - (paste.view_count + 1), 0);

    res.status(200).json({
      content: paste.content,
      remaining_views: remainingViews,
      expires_at: paste.expires_at
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal server error" });
  }
});


function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

app.get("/p/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM pastes WHERE id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Not found");
    }

    const paste = result.rows[0];
    const currentTime = nowMs(req);

    // TTL check
    if (paste.expires_at && new Date(paste.expires_at).getTime() <= currentTime) {
      return res.status(404).send("Expired");
    }
const now = getNow(req);

if (paste.expires_at && now > paste.expires_at) {
  return res.status(404).json({ error: "Paste not found" });
}

    // View limit check
    if (paste.max_views !== null && paste.view_count >= paste.max_views) {
      return res.status(404).send("Paste Not found");
    }

    // Increment view count
    await pool.query(
      `UPDATE pastes SET view_count = view_count + 1 WHERE id = $1`,
      [id]
    );

    const safeContent = escapeHtml(paste.content);

    res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Paste ${id}</title>
          <meta charset="utf-8" />
          <style>
            body { font-family: monospace; padding: 20px; background: #f9f9f9; }
            pre { background: #fff; padding: 15px; border-radius: 6px; }
          </style>
        </head>
        <body>
          <h2>Paste</h2>
          <pre>${safeContent}</pre>
        </body>
      </html>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
