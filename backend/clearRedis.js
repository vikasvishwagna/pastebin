import "dotenv/config"; 
import redis from "./src/config/redis.js";

const clearRedis = async () => {
  try {
    await redis.flushall();
    console.log("All Redis keys cleared");
    process.exit(0);
  } catch (err) {
    console.error("Error clearing Redis:", err);
    process.exit(1);
  }
};

clearRedis();
