import mongoose from "mongoose";

const InputDataSchema = new mongoose.Schema({
    childId: { type: mongoose.Schema.Types.ObjectId, ref: "Child", required: true }, // ✅ Added childId field
    input: { type: Object, required: true },
    mlResponse: { type: Object, required: true },
    createdAt: { type: Date, default: Date.now },
});

const InputData = mongoose.model("PredictionResponse", InputDataSchema);
export default InputData;

