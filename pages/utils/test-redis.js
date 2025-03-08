import dynamic from "next/dynamic";

// Dynamically import Redis, disabling SSR
const redisClient = dynamic(() => import("../../lib/redis"), { ssr: false });

export default async function handler(req, res) {
  try {
    const redis = await redisClient;
    await redis.set("test", "Hello from Redis");
    const value = await redis.get("test");

    res.status(200).json({ message: value });
  } catch (error) {
    res.status(500).json({ error: "Redis error", details: error.message });
  }
}
