import express from 'express';
import { processMLRequest, getChildDetailsWithPredictionsAndResponses, getLatestPrediction } from '../controllers/PredictionController.js'

const router = express.Router();

// Prediction route
router.post("/predict", processMLRequest);

router.get("/details/:childId", getChildDetailsWithPredictionsAndResponses);

// Route to get latest prediction by childId
router.get("/latest/:childId", getLatestPrediction);

export default router;