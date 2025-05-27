import mongoose from "mongoose";

const PredictionSchema = new mongoose.Schema({
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Child",
    required: true,
  },
  requestData: { type: Object, required: true },
  responseData: { type: Object, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Prediction = mongoose.model("Prediction", PredictionSchema);

export default Prediction; // ✅ Ensure the correct export for ES modules
