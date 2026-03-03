import express from "express";
import { getAlerts ,createAlert} from "../Controllers/alertController.js";
import { protect } from "../Middleware/authMiddleware.js";
const router = express.Router();


router.get("/", getAlerts);
router.post("/", protect, createAlert);

export default router;