import redis from "../../utils/redis";

export default async function handler(req, res) {
  try {
    await redis.set("test-key", "Hello Redis!");
    const value = await redis.get("test-key");

    res.status(200).json({ message: "🔹 Stored Value:", value });
  } catch (error) {
    res
      .status(500)
      .json({ error: "❌ Redis Test Error", details: error.message });
  }
}
