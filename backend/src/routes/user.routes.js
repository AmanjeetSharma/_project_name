import { getProfile } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

// GET USER PROFILE
router.get("/profile", verifyToken, getProfile);

export default router;