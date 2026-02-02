// routes/health.js
import express from "express";
import redis from "../config/redis.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // quick test to see if Redis is reachable
    await redis.get("healthcheck");
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false });
  }
});

export default router;
