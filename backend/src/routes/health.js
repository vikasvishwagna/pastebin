import express from "express";
import redis from "../config/redis.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    await redis.ping();
    return res.status(200).json({ ok: true, redis: "connected" });
  } catch (err) {
    return res.status(500).json({ ok: false, redis: "error" });
  }
});

export default router;
