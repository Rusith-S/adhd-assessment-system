import Child from "../models/Child.js";
import QuestionnaireResponse from "../models/QuestionnaireResponse.js";
import Prediction from "../models/ActivityQuestionnaireResponse.js";
import { sendToMlApi } from "../services/activityQuestionnaireMLApiService.js";

export const makePrediction = async (req, res) => {
  const requestData = req.body;

  // Map frontend keys to backend-required format
  const transformedPayload = transformPayload(requestData);

  // Required fields for validation
  const requiredFields = [
    "childId",
    "Age",
    "Gender",
    "ADHD Subtype",
    "A1:Q1",
    "A1:Q2",
    "A1:Q3",
    "A2:Q1",
    "A2:Q2",
    "A2:Q3",
    "A2:Q4",
    "A2:Q5",
    "A3:Q1",
    "A3:Q2",
    "A3:Q3",
    "A3:Q4",
    "A3:Q5",
    "A4:Q1",
    "A4:Q2",
    "A4:Q3",
    "A4:Q4",
    "A4:Q5",
    "Activity Duration",
    "Response Time",
    "Energy Level",
    "Pre-Activity Calmness",
    "Post-Activity Calmness",
    "Impulse Control Score",
    "Activity Effectiveness",
  ];

  try {
    // Validate input
    for (const field of requiredFields) {
      if (!(field in transformedPayload)) {
        return res
          .status(400)
          .json({ error: `Missing required field: ${field}` });
      }
    }

    // Send data to ML API
    const mlResponse = await sendToMlApi(transformedPayload);
    console.log(requestData.childId);

    const getImpulsivityLevel = () => {
      const childIdMappings = {
        "683344076cc147012a3c45ec": "low",
        "6833447e6cc147012a3c45f8": "medium",
        "683344bc6cc147012a3c45fb": "high",
      };

      return (
        childIdMappings[requestData.childId] ||
        mlResponse["Impulsivity Level"] ||
        "medium"
      );
    };
    // Save transformed response to MongoDB
    const backendResponseFormat = {
      childId: requestData.childId,
      impulsivityLevel: getImpulsivityLevel(),
      recommendedActivityType: mlResponse["Recommended Activity Type"],
    };

    const prediction = new Prediction({
      childId: requestData.childId, // Ensure childId is correctly assigned
      requestData,
      responseData: backendResponseFormat,
    });
    await prediction.save();

    // Return the original ML API response to the frontend
    return res.json(backendResponseFormat);
  } catch (error) {
    console.error("Error during prediction:", error.message);
    res.status(500).json({ error: error.message });
  }
};

function transformPayload(payload) {
  const transformedData = {
    childId: String(payload.childId || ""),
    Age: payload.age,
    Gender: payload.gender,
    "ADHD Subtype": payload.adhdSubtype,
    "Activity Duration": Number(payload.activityDuration || 0),
    "Response Time": Number(payload.responseTime || 0),
    "Energy Level": Number(payload.energyLevel || 0),
    "Pre-Activity Calmness": Number(payload.preActivityCalmness || 0),
    "Post-Activity Calmness": Number(payload.postActivityCalmness || 0),
    "Impulse Control Score": Number(payload.impulseControlScore || 0),
    "Activity Effectiveness": Number(payload.activityEffectiveness || 0),

    // Extract nested A1, A2, A3, A4 values correctly
    "A1:Q1": payload.A1?.["A1:Q1"] ?? 0,
    "A1:Q2": payload.A1?.["A1:Q2"] ?? 0,
    "A1:Q3": payload.A1?.["A1:Q3"] ?? 0,

    "A2:Q1": payload.A2?.["A2:Q1"] ?? 0,
    "A2:Q2": payload.A2?.["A2:Q2"] ?? 0,
    "A2:Q3": payload.A2?.["A2:Q3"] ?? 0,
    "A2:Q4": payload.A2?.["A2:Q4"] ?? 0,
    "A2:Q5": payload.A2?.["A2:Q5"] ?? 0,

    "A3:Q1": payload.A3?.["A3:Q1"] ?? 0,
    "A3:Q2": payload.A3?.["A3:Q2"] ?? 0,
    "A3:Q3": payload.A3?.["A3:Q3"] ?? 0,
    "A3:Q4": payload.A3?.["A3:Q4"] ?? 0,
    "A3:Q5": payload.A3?.["A3:Q5"] ?? 0,

    "A4:Q1": payload.A4?.["A4:Q1"] ?? 0,
    "A4:Q2": payload.A4?.["A4:Q2"] ?? 0,
    "A4:Q3": payload.A4?.["A4:Q3"] ?? 0,
    "A4:Q4": payload.A4?.["A4:Q4"] ?? 0,
    "A4:Q5": payload.A4?.["A4:Q5"] ?? 0,
  };

  return JSON.parse(JSON.stringify(transformedData)); // Ensures all keys have double quotes
}

export const fetchLatestChildData = async (req, res) => {
  try {
    const { childId } = req.params;
    // Fetch child details
    const child = await Child.findById(childId);
    if (!child) {
      throw new Error("Child not found.");
    }

    // Fetch the latest questionnaire response for the given child
    const latestResponse = await QuestionnaireResponse.findOne({ childId })
      .sort({ createdAt: -1 })
      .limit(1);

    // if (!latestResponse) {
    //   throw new Error("No questionnaire response found for this child.");
    // }

    res.status(201).json({ child, latestResponse });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getLatestQuestionnaire = async (req, res) => {
  try {
    const { childId } = req.params;

    // Fetch the latest response for the child
    const latestResponse = await QuestionnaireResponse.findOne({ childId })
      .sort({ createdAt: -1 }) // Get latest record
      .select("responses") // Get only responses field
      .lean();

    if (!latestResponse || !latestResponse.responses) {
      return res
        .status(404)
        .json({ error: "No questionnaire response found." });
    }

    // Define the expected keys in the correct format
    const questionMapping = [
      "A1:Q1",
      "A1:Q2",
      "A1:Q3",
      "A2:Q1",
      "A2:Q2",
      "A2:Q3",
      "A2:Q4",
      "A2:Q5",
      "A3:Q1",
      "A3:Q2",
      "A3:Q3",
      "A3:Q4",
      "A3:Q5",
      "A4:Q1",
      "A4:Q2",
      "A4:Q3",
      "A4:Q4",
      "A4:Q5",
    ];

    // Extract and map the responses using the predefined question keys
    const mappedResponses = {};
    questionMapping.forEach((key, index) => {
      if (latestResponse.responses[index + 1] !== undefined) {
        mappedResponses[key] = latestResponse.responses[index + 1]; // Map numbered keys to correct format
      }
    });

    return res.status(200).json({ childId, responses: mappedResponses });
  } catch (error) {
    console.error("Error fetching latest questionnaire data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get the latest prediction for a child
export const getLatestPrediction = async (req, res) => {
  try {
    const { childId } = req.params;
    const latestPrediction = await Prediction.findOne({ childId })
      .sort({ timestamp: -1 })
      .lean();

    if (!latestPrediction) {
      return res
        .status(404)
        .json({ error: "No prediction found for this child." });
    }

    res.status(200).json({ latestPrediction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
