import mongoose from "mongoose";
import TimeTable from "./TimeTable.js";

const ChildTimeTableSchema = new mongoose.Schema(
  {
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Child",
      required: true,
    },
    timetableDetails: [
      {
        timeTableSlot: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "TimeTable",
          required: true,
        },
        completed: { type: Boolean, default: false },
      },
    ],
    weekCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ChildTimeTable = mongoose.model("ChildTimeTable", ChildTimeTableSchema);
export default ChildTimeTable;
