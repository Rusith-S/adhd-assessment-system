import mongoose from "mongoose";

const TimeTableSchema = new mongoose.Schema({
  time: { type: String, required: true },  // Time in HH:MM:SS format
  timeTableNumber: { type: Number, required: true, enum: [1, 2, 3, 4, 5] }, // Time Table ID
  activityType: { type: String, required: true }, // Name of activity
  duration: { type: Number }, // Duration in minutes
  category: { type: String, enum: ["low", "medium", "high"], required: true } // Activity Category
});

const TimeTable = mongoose.model("TimeTable", TimeTableSchema);
export default TimeTable;
