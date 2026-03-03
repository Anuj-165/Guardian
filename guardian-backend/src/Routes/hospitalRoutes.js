import express from "express";
import {
  getHospitals,
  createHospital,
  updateHospital,
  deleteHospital
} from "../Controllers/hospitalController.js";
import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getHospitals);
router.post("/", protect, createHospital);
router.put("/:id", protect, updateHospital);
router.delete("/:id", protect, deleteHospital);

export default router;