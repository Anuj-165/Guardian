import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import { connectRedis } from "./Config/redis.js";

import hospitalRoutes from "./Routes/hospitalRoutes.js";
import bookingRoutes from "./Routes/bookingRoutes.js";
import alertRoutes from "./Routes/alertRoutes.js";
import resourceRoutes from "./Routes/resourceRoutes.js";
import volunteerRoutes from "./Routes/volunteerRoutes.js";
import authRoutes from "./Routes/authRoutes.js";
import { startCrisisMonitoring } from "./jobs/crisisJob.js";
import weatherRoutes from "./Routes/weatherRoutes.js";

const app = express();

const corsOptions = {
  origin: ["https://guardian-mub9.onrender.com", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

await connectRedis();
startCrisisMonitoring();

app.use("/api/auth", authRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/weather", weatherRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);