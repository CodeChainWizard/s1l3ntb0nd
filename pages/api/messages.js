export default async function handler(req, res) {
  const BACKEND_URL = "http://192.168.29.138:5000/api/messages";

  if (req.method === "POST") {
    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      });

      const data = await response.json();
      res.status(response.status).json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to connect to backend : " + error });
    }
  } else if (req.method === "GET") {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "Message ID is required" });

    try {
      const response = await fetch(`${BACKEND_URL}?id=${id}`);
      const data = await response.json();
      res.status(response.status).json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to connect to backend : "+ error });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}

// import redis from "../utils/redis";
// import { v4 as uuidv4 } from "uuid";

// // 192.168.29.138:5000/api/messages
// export default async function handler(req, res) {
//   const { method } = req;

//   switch (method) {
//     case "POST":
//       const { message } = req.body;
//       if (!message)
//         return res.status(400).json({ error: "Message is required" });

//       const messageId = uuidv4();
//       await redis.setex(`message:${messageId}`, 86400, message); // Expires in 24h

//       res.status(201).json({ url: `/message/${messageId}` });
//       break;

//     case "GET":
//       const { id } = req.query;
//       if (!id) return res.status(400).json({ error: "Message ID is required" });

//       const storedMessage = await redis.get(`message:${id}`);
//       if (!storedMessage)
//         return res.status(404).json({ error: "Message not found or expired" });

//       await redis.del(`message:${id}`);
//       res.status(200).json({ message: storedMessage });
//       break;

//     default:
//       res.setHeader("Allow", ["GET", "POST"]);
//       res.status(405).end(`Method ${method} Not Allowed`);
//   }
// }
