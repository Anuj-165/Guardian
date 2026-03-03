import express from "express";
import { getWeather } from "../Controllers/alertController.js";
import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();


router.get("/", protect, getWeather);

export default router;