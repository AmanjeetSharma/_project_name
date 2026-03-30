import express from "express";
import {
    getColleges,
    getCollegeById,
    addCollege,
    updateCollege,
    deleteCollege,
} from "../controllers/college.controller.js";

const router = express.Router();

// get all colleges with pagination and filters
router.get("/", getColleges);

// get single college by ID
router.get("/:id", getCollegeById);

// add new college
router.post("/", addCollege);

// update college
router.put("/:id", updateCollege);

// delete college
router.delete("/:id", deleteCollege);

export default router;