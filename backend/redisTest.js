import redis from "./src/config/redis.js";

async function testRedis() {
  try {
    // simple set and get
    await redis.set("test-key", "hello");
    const val = await redis.get("test-key");
    console.log("Redis GET result:", val);
  } catch (err) {
    console.error("Redis error:", err);
  }
}

testRedis();
