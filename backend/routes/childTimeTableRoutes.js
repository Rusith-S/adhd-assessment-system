import express from "express";
import {
  generateChildTimetable,
  getTimetableByChildId,
  updateTimetableCompletionStatus,
  getChildTimetableHistory,
  updateActivityCompletion,
  getLatestTimetables,
  completeWeek,
} from "../controllers/childTimeTableController.js";

const router = express.Router();

// Route to generate and assign a timetable to a child
router.post("/generate", generateChildTimetable);

// Route to get timetable entries by child ID
router.get("/:childId", getTimetableByChildId);

// Route to update completion status of a timetable entry
router.put("/:childId/slot/:slotId", updateTimetableCompletionStatus);

// Route to get all timetables for a child
router.get("/history/:childId", getChildTimetableHistory);

// Route to update an activity's completion status
router.put("/update-completion/:timetableId", updateActivityCompletion);

router.get("/latest/:childId", getLatestTimetables);

router.post("/complete-week/:childId", completeWeek);

export default router;
