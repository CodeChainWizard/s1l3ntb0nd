// import { createClient } from "redis";
import { Redis } from "@upstash/redis";

if (
  !process.env.UPSTASH_REDIS_REST_URL ||
  !process.env.UPSTASH_REDIS_REST_TOKEN
) {
  throw new Error("❌ Missing Upstash Redis environment variables");
}

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default redis;

// const redis = createClient({
//   socket: {
//     host: process.env.REDIS_HOST,
//     port: Number(process.env.REDIS_PORT),
//   },
//   username: process.env.REDIS_USER,
//   password: process.env.REDIS_PASS,
// });

// redis.on("connect", () => console.log("✅ Redis Connected"));
// redis.on("error", (err) => console.error("❌ Redis Error:", err));

// (async () => {
//   try {
//     await redis.connect();
//   } catch (err) {
//     console.error("❌ Redis Connection Failed:", err);
//   }
// })();

// export default redis;
