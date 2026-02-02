// routes/pastes.api.js
import express from "express";
import crypto from "crypto";
import redis from "../config/redis.js";

const router = express.Router();

// Deterministic time support
function getNow(req) {
  if (process.env.TEST_MODE === "1" && req.headers["x-test-now-ms"]) {
    return Number(req.headers["x-test-now-ms"]);
  }
  return Date.now();
}

// Create Paste
router.post("/", async (req, res) => {
  try {
    const { content, ttl_seconds, max_views } = req.body;

    if (!content || typeof content !== "string" || content.trim() === "") {
      return res.status(400).json({ error: "content must be a non-empty string" });
    }
    if (ttl_seconds !== undefined && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
      return res.status(400).json({ error: "ttl_seconds must be an integer >= 1" });
    }
    if (max_views !== undefined && (!Number.isInteger(max_views) || max_views < 1)) {
      return res.status(400).json({ error: "max_views must be an integer >= 1" });
    }

    const pasteId = crypto.randomBytes(6).toString("hex");
    const key = `paste:${pasteId}`;
    const now = Date.now();

    const pasteData = {
      content,
      maxViews: max_views ?? null,
      viewsUsed: 0,
      createdAt: now,
      expiresAt: ttl_seconds ? now + ttl_seconds * 1000 : null,
    };

    await redis.set(key, JSON.stringify(pasteData));
    if (ttl_seconds) await redis.expire(key, ttl_seconds);

    return res.status(201).json({
      id: pasteId,
      url: `${process.env.BASE_URL}/p/${pasteId}`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal server error" });
  }
});

// Fetch Paste (API)
router.get("/:id", async (req, res) => {
  try {
    const key = `paste:${req.params.id}`;
    const now = getNow(req);
    const data = await redis.get(key);

    if (!data) return res.status(404).json({ error: "paste not found" });

    const paste = JSON.parse(data);

    // TTL check
    if (paste.expiresAt !== null && now >= paste.expiresAt) {
      await redis.del(key);
      return res.status(404).json({ error: "paste expired" });
    }

    // Max views check
    if (paste.maxViews !== null && paste.viewsUsed >= paste.maxViews) {
      await redis.del(key);
      return res.status(404).json({ error: "paste unavailable" });
    }

    // Increment views if limit exists
    if (paste.maxViews !== null) {
      paste.viewsUsed += 1;
      await redis.set(key, JSON.stringify(paste));
    }

    return res.status(200).json({
      content: paste.content,
      remaining_views: paste.maxViews === null ? null : paste.maxViews - paste.viewsUsed,
      expires_at: paste.expiresAt ? new Date(paste.expiresAt).toISOString() : null,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal server error" });
  }
});

export default router;
