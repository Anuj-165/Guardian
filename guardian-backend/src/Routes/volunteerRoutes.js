import express from "express";
import { registerVolunteer, getMyVolunteerProfile } from "../Controllers/volunteerController.js";
import { protect } from "../Middleware/authMiddleware.js"; 

const router = express.Router();


router.use(protect);


router.post("/register", registerVolunteer);


router.get("/me", getMyVolunteerProfile);

export default router;