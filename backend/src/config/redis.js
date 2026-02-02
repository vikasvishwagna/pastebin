import "dotenv/config";
import { Redis } from "@upstash/redis";

console.log("Redis URL:", process.env.UPSTASH_REDIS_REST_URL ? "FOUND" : "MISSING");
console.log("Redis TOKEN:", process.env.UPSTASH_REDIS_REST_TOKEN ? "FOUND" : "MISSING");

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default redis;
