import { createClient } from "redis";

const redis = createClient({
  socket: {
    host: "redis-19440.c283.us-east-1-4.ec2.redns.redis-cloud.com",
    port: 19440,
  },
  username: "default",
  password: "Ajb3Mh8mPkiMCz6zmwnJPGYw8lHc79oX",
});

redis.on("connect", () => console.log("✅ Redis Connected"));
redis.on("error", (err) => console.error("❌ Redis Error:", err));

await redis.connect();

export default redis;
