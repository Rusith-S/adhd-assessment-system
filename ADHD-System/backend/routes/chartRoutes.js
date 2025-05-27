import express from "express";
import {
  getInattentiveScoreHistory,
  getHyperactiveImpulsiveScoreHistory,
  getCombinedScoreHistory,
} from "../controllers/chartController.js";

const router = express.Router();

// Routes to fetch line chart data
router.get("/inattentive/:childId", getInattentiveScoreHistory);
router.get("/hyperactive/:childId", getHyperactiveImpulsiveScoreHistory);
router.get("/combined/:childId", getCombinedScoreHistory);

export default router;
