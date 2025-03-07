import redis from "../utils/redis";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "POST":
      const { message } = req.body;
      if (!message)
        return res.status(400).json({ error: "Message is required" });

      const messageId = uuidv4();
      await redis.setex(`message:${messageId}`, 86400, message); // Expires in 24h

      res.status(201).json({ url: `/message/${messageId}` });
      break;

    case "GET":
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: "Message ID is required" });

      const storedMessage = await redis.get(`message:${id}`);
      if (!storedMessage)
        return res.status(404).json({ error: "Message not found or expired" });

      await redis.del(`message:${id}`); // Delete after reading
      res.status(200).json({ message: storedMessage });
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
