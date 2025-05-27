import express from "express";
import {
  makePrediction,
  fetchLatestChildData,
  getLatestQuestionnaire,
  getLatestPrediction,
} from "../controllers/activityQuestionnaireController.js";

const router = express.Router();

// Prediction route
router.post("/predict", makePrediction);

// Route to fetch basic details of a child and latest questionnaire response
router.get("/basicdetails/:childId", fetchLatestChildData);

router.get("/latest/:childId", getLatestQuestionnaire);

router.get("/latest-prediction/:childId", getLatestPrediction);

export default router;
