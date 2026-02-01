import express from "express";
import redis from "../config/redis.js";

const router = express.Router();

function getNow(req) {
  if (
    process.env.TEST_MODE === "1" &&
    req.headers["x-test-now-ms"]
  ) {
    return Number(req.headers["x-test-now-ms"]);
  }
  return Date.now();
}

const escapeHtml = (str) =>
  str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const key = `paste:${id}`;

    const data = await redis.get(key);
    if (!data) {
      return res.status(404).send("Paste not found");
    }

    const paste = JSON.parse(data);
    const now = getNow(req);

    // ✅ TTL check
    if (paste.expiresAt !== null && now >= paste.expiresAt) {
      await redis.del(key);
      return res.status(404).send("Paste expired");
    }

    // ✅ View limit check
    if (paste.maxViews !== null) {
      if (paste.viewsUsed >= paste.maxViews) {
        await redis.del(key);
        return res.status(404).send("Paste unavailable");
      }

      paste.viewsUsed += 1;
      await redis.set(key, JSON.stringify(paste));
    }

    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Paste</title>
        </head>
        <body>
          <pre>${escapeHtml(paste.content)}</pre>
        </body>
      </html>
    `);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
});

export default router;
