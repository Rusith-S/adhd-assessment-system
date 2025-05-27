import InputData from "../models/PredictionResponse.js";
import QuestionnaireResponse from "../models/QuestionnaireResponse.js";

// Get Inattentive Score history for a child
export const getInattentiveScoreHistory = async (req, res) => {
  try {
    const { childId } = req.params;

    const scoreHistory = await InputData.find({ childId })
      .sort({ createdAt: 1 }) // Sort by date in ascending order
      .select("createdAt input.inattentiveScore -_id"); // Only get the required fields

    res.status(200).json(scoreHistory);
  } catch (error) {
    res.status(500).json({ error: "Error fetching inattentive score history." });
  }
};

// Get Hyperactive-Impulsive Score history for a child
export const getHyperactiveImpulsiveScoreHistory = async (req, res) => {
  try {
    const { childId } = req.params;

    const scoreHistory = await InputData.find({ childId })
      .sort({ createdAt: 1 })
      .select("createdAt input.hyperactiveImpulsiveScore -_id");

    res.status(200).json(scoreHistory);
  } catch (error) {
    res.status(500).json({ error: "Error fetching hyperactive-impulsive score history." });
  }
};

// Get Combined Score history for a child
export const getCombinedScoreHistory = async (req, res) => {
  try {
    const { childId } = req.params;

    const scoreHistory = await InputData.find({ childId })
      .sort({ createdAt: 1 })
      .select("createdAt input.combinedScore -_id");

    res.status(200).json(scoreHistory);
  } catch (error) {
    res.status(500).json({ error: "Error fetching combined score history." });
  }
};
