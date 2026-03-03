import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

export const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) return new Error("Redis reconnection failed");
      return Math.min(retries * 100, 3000); // Wait longer between retries
    }
  }
});

redisClient.on("error", (err) => {
  
  if (err.message !== "Socket closed unexpectedly") {
    console.error("Redis Error:", err.message);
  }
});

export const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log("✅ Redis Connected (Upstash)");
    }
  } catch (err) {
    console.error("❌ Redis Connection Error:", err.message);
  }
};