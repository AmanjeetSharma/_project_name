import express from "express";
import {
    getColleges,
    getCollegeById,
    addCollege,
    updateCollege,
    deleteCollege,
    getFilters,
    getCollegeSuggestion,
} from "../controllers/college.controller.js";

const router = express.Router();

// get all colleges with pagination
router.get("/", getColleges);

// get filter options
router.get("/filters", getFilters);

// get single college by ID
router.get("/:id", getCollegeById);

// add new college
router.post("/", addCollege);

// update college
router.put("/:id", updateCollege);

// delete college
router.delete("/:id", deleteCollege);

// get college suggestions based on test results and state
router.post("/college-suggestion", getCollegeSuggestion);


export default router;