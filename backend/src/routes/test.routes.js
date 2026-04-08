import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { generateTest, getRunningTest, submitTest, getUserAllTests, getTestById } from "../controllers/test.controller.js";

const router = Router();

// POST /api/test/build
router.post("/build", verifyToken, generateTest);

// GET /api/test/on-going - get the running test for the current user
router.get("/", verifyToken, getRunningTest);

// POST /api/test/submit
router.post("/submit", verifyToken, submitTest);

// GET /api/test/history - get all tests taken by the user
router.get("/history", verifyToken, getUserAllTests);

// GET /api/test/:testId - get a specific test by ID
router.get("/:testId", verifyToken, getTestById);

export default router;
