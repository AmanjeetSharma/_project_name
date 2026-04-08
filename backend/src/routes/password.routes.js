import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { changePassword, forgotPassword, resetPassword } from "../controllers/password.controller.js";

const router = Router();

// CHANGE PASSWORD
router.post("/change-password", verifyToken, changePassword);
    
// FORGOT PASSWORD
router.post("/forgot-password", forgotPassword);

// RESET PASSWORD
router.post("/reset-password", resetPassword);


export default router;