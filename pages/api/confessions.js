import redis from "../../lib/redis";

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      const confessions = await redis.lrange("confessions", 0, -1);
      res.status(200).json(confessions.map(JSON.parse));
      break;

    case "POST":
      const { message } = req.body;
      if (!message)
        return res.status(400).json({ error: "Message is required" });

      const confession = { id: Date.now(), message };
      await redis.lpush("confessions", JSON.stringify(confession));
      res.status(201).json(confession);
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
