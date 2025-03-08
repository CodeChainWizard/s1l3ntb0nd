import { createClient } from "redis";

const redis = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PASS,
});

redis.on("connect", () => console.log("✅ Redis Connected"));
redis.on("error", (err) => console.error("❌ Redis Error:", err));

(async () => {
  try {
    await redis.connect();
  } catch (err) {
    console.error("❌ Redis Connection Failed:", err);
  }
})();

export default redis;
