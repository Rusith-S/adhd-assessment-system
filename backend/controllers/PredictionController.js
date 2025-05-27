import InputData from "../models/PredictionResponse.js";
import { callMLApi } from "../services/PredictionMLApiService.js";
import Child from "../models/Child.js";
import QuestionnaireResponse from "../models/QuestionnaireResponse.js";

// Handles input, calls ML API, and saves data to MongoDB
export const processMLRequest = async (req, res) => {
    try {
        const inputData = req.body;

        // Validate input
        if (!inputData || Object.keys(inputData).length === 0) {
            return res.status(400).json({ error: "Invalid input data" });
        }

        // Transform frontend data to match ML API format
        const transformedPayload = transformPayload(inputData);

        // Call the ML model API
        const mlResponse = await callMLApi(transformedPayload);

        // Ensure required fields exist in response
        if (!mlResponse || typeof mlResponse !== "object") {
            return res.status(500).json({ error: "Invalid response from ML API" });
        }

        // Save transformed response to MongoDB
        const backendResponseFormat = {
          preventionMechanism: mlResponse["Prevention Mechanism"],
          futureChallenge: mlResponse["Future Challenge"],
        };

        // Save input and response to MongoDB
        const newEntry = new InputData({
            childId: inputData.childId,
            input: inputData,
            mlResponse: mlResponse,
        });
        await newEntry.save();

        // Return the ML model response
        return res.status(200).json({
            message: "Data processed successfully",
            backendResponseFormat,
        });
    } catch (error) {
        console.error("Error processing ML request:", error.message);
        return res.status(500).json({ error: "Failed to process request" });
    }
};

// Transform frontend payload to ML API expected format
function transformPayload(payload) {
    return {
        "Age": payload.age,
        "Gender": payload.gender,
        "subtype": payload.adhdSubtype,
        "inattentiveScore": payload.inattentiveScore || 0,
        "hyperactiveImpulsiveScore": payload.hyperactiveImpulsiveScore || 0,
        "combinedScore": payload.combinedScore || 0,
        "impulsivityLevel": payload.impulsivityLevel || "Unknown",
        "Academic Grade": payload.academicGrade,
        "Attendance Rate (%)": payload.attendanceRate,
        "Current Strategy": payload.currentStrategy,
        "Effectiveness Score (1-10)": payload.effectivenessScore,
        "Teacher Feedback": payload.teacherFeedback
    };
}


// Get Child details along with latest Prediction and Questionnaire Response
export const getChildDetailsWithPredictionsAndResponses = async (req, res) => {
    try {
        const { childId } = req.params;

        // Fetch child details
        const child = await Child.findById(childId).select("name age gender");
        if (!child) {
            return res.status(404).json({ error: "Child not found" });
        }

        // Fetch latest prediction
        const latestPrediction = await InputData.findOne({ childId })
            .sort({ timestamp: -1 }) // Get latest record
            .select("mlResponse timestamp")
            .lean();

        // Fetch latest questionnaire response
        const latestResponse = await QuestionnaireResponse.findOne({ childId })
            .sort({ createdAt: -1 }) // Get latest record
            .select("responses inattentiveScore hyperactiveImpulsiveScore combinedScore subtype createdAt")
            .lean();

        // Return response
        return res.status(200).json({
            child,
            latestPrediction: latestPrediction || null,
            latestResponse: latestResponse || null,
        });
    } catch (error) {
        console.error("Error fetching child details:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Get the latest prediction for a child by childId
export const getLatestPrediction = async (req, res) => {
    try {
        const { childId } = req.params;

        // Fetch the latest prediction for the given childId
        const latestPrediction = await InputData.findOne({ childId })
            .sort({ createdAt: -1 })
            .lean();

        if (!latestPrediction) {
            return res.status(404).json({ error: "No prediction found for this child." });
        }

        // Return the latest prediction
        return res.status(200).json({
            childId,
            latestPrediction
        });
    } catch (error) {
        console.error("Error fetching latest prediction:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};