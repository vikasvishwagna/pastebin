import express from "express";
import redis from "../config/redis.js";
import crypto from "crypto";

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

const FETCH_AND_INCREMENT_LUA = `
local data = redis.call("GET", KEYS[1])
if not data then
  return {err="NOT_FOUND"}
end

local paste = cjson.decode(data)
local now = tonumber(ARGV[1])

-- TTL check
if paste.expiresAt ~= cjson.null and now >= paste.expiresAt then
  redis.call("DEL", KEYS[1])
  return {err="EXPIRED"}
end

-- View limit check
if paste.maxViews ~= cjson.null then
  if paste.viewsUsed >= paste.maxViews then
    redis.call("DEL", KEYS[1])
    return {err="UNAVAILABLE"}
  end
  paste.viewsUsed = paste.viewsUsed + 1
end

redis.call("SET", KEYS[1], cjson.encode(paste))
return cjson.encode(paste)
`;

router.post("/", async (req, res) => {
  try {
    const { content, ttl_seconds, max_views } = req.body;

    if (!content || typeof content !== "string" || content.trim() === "") {
      return res.status(400).json({
        error: "content must be a non-empty string",
      });
    }

    if (
      ttl_seconds !== undefined &&
      (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)
    ) {
      return res.status(400).json({
        error: "ttl_seconds must be an integer >= 1",
      });
    }

    if (
      max_views !== undefined &&
      (!Number.isInteger(max_views) || max_views < 1)
    ) {
      return res.status(400).json({
        error: "max_views must be an integer >= 1",
      });
    }

    const pasteId = crypto.randomBytes(6).toString("hex");
    const key = `paste:${pasteId}`;
    const now = Date.now();

    const pasteData = {
      content,
      maxViews: max_views ?? null,
      viewsUsed: 0,
      createdAt: now,
      expiresAt:
        ttl_seconds !== undefined ? now + ttl_seconds * 1000 : null,
    };

    await redis.set(key, JSON.stringify(pasteData));

    return res.status(201).json({
      id: pasteId,
      url: `${req.protocol}://${req.get("host")}/p/${pasteId}`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const key = `paste:${req.params.id}`;
    const now = getNow(req);

    const result = await redis.eval(
      FETCH_AND_INCREMENT_LUA,
      1,
      key,
      now
    );

    if (!result) {
      return res.status(404).json({ error: "paste not found" });
    }

    const paste = JSON.parse(result);

    return res.status(200).json({
      content: paste.content,
      remaining_views:
        paste.maxViews === null
          ? null
          : paste.maxViews - paste.viewsUsed,
      expires_at: paste.expiresAt
        ? new Date(paste.expiresAt).toISOString()
        : null,
    });
  } catch (err) {
    if (err.message?.includes("NOT_FOUND")) {
      return res.status(404).json({ error: "paste not found" });
    }
    return res.status(404).json({ error: "paste unavailable" });
  }
});

export default router;
