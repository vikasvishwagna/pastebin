// routes/pastes.view.js
import express from "express";
import redis from "../config/redis.js";

const router = express.Router();

// Deterministic time
function getNow(req) {
  if (process.env.TEST_MODE === "1" && req.headers["x-test-now-ms"]) {
    return Number(req.headers["x-test-now-ms"]);
  }
  return Date.now();
}

// HTML view
router.get("/:id", async (req, res) => {
  try {
    const key = `paste:${req.params.id}`;
    const now = getNow(req);
    const data = await redis.get(key);

    if (!data) return res.status(404).send("Paste not found");

    const paste = JSON.parse(data);

    if (paste.expiresAt !== null && now >= paste.expiresAt) {
      await redis.del(key);
      return res.status(404).send("Paste expired");
    }

    if (paste.maxViews !== null && paste.viewsUsed >= paste.maxViews) {
      await redis.del(key);
      return res.status(404).send("Paste unavailable");
    }

    if (paste.maxViews !== null) {
      paste.viewsUsed += 1;
      await redis.set(key, JSON.stringify(paste));
    }

    // Simple HTML escaping
    const contentEscaped = paste.content
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8"/>
        <title>Paste ${req.params.id}</title>
      </head>
      <body>
        <pre>${contentEscaped}</pre>
      </body>
      </html>
    `);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
});

export default router;
