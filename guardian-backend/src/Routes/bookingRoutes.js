import express from "express";
import { getUserBookings, createBooking } from "../Controllers/bookingController.js";
import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();


router.get("/my-bookings", protect, getUserBookings);
router.post("/create", protect, createBooking);

export default router;