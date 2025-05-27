import ChildTimeTable from "../models/ChildTimeTable.js";
import TimeTable from "../models/TimeTable.js";

// Generate and assign a timetable to a child
// Generate and assign a timetable to a child
export const generateChildTimetable = async (req, res) => {
  try {
    const { childId, category } = req.body;

    // Validate input
    if (!childId || !category) {
      return res
        .status(400)
        .json({ error: "Child ID and category are required" });
    }

    // Fetch available timetable numbers for the given category
    const availableTimeTables = await TimeTable.distinct("timeTableNumber", {
      category,
    });
    if (availableTimeTables.length === 0) {
      return res
        .status(404)
        .json({ error: "No available timetables for this category" });
    }

    // Randomly select a timetable number
    const randomIndex = Math.floor(Math.random() * availableTimeTables.length);
    const selectedTimeTableNumber = availableTimeTables[randomIndex];

    // Fetch all slots for the selected timetable number and category
    const timetableSlots = await TimeTable.find({
      category,
      timeTableNumber: selectedTimeTableNumber,
    });

    // Map the slots to the child's timetable details
    const timetableDetails = timetableSlots.map((slot) => ({
      timeTableSlot: slot._id,
      completed: false,
    }));

    // Create and save the child's timetable
    const childTimetable = new ChildTimeTable({
      childId,
      timetableDetails,
    });

    await childTimetable.save();

    // Populate timeTableSlot details before sending response
    const populatedChildTimetable = await ChildTimeTable.findById(
      childTimetable._id
    ).populate({
      path: "timetableDetails.timeTableSlot",
      model: "TimeTable",
    });

    res.status(201).json({
      message: "Timetable generated successfully",
      data: populatedChildTimetable,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get timetable entries by child ID
export const getTimetableByChildId = async (req, res) => {
  try {
    const { childId } = req.params;

    // Validate input
    if (!childId) {
      return res.status(400).json({ error: "Child ID is required" });
    }

    // Fetch the child's timetable and populate the slot details
    const childTimetable = await ChildTimeTable.findOne({ childId }).populate({
      path: "timetableDetails.timeTableSlot",
      model: "TimeTable",
    });

    if (!childTimetable) {
      return res
        .status(404)
        .json({ error: "Timetable not found for this child" });
    }

    res.status(200).json(childTimetable);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update completion status of a timetable entry
export const updateTimetableCompletionStatus = async (req, res) => {
  try {
    const { childId, slotId } = req.params;
    const { completed } = req.body;

    // Validate input
    if (typeof completed !== "boolean") {
      return res
        .status(400)
        .json({ error: "Completed status must be a boolean" });
    }

    // Update the completion status of the specific slot
    const childTimetable = await ChildTimeTable.findOneAndUpdate(
      { childId, "timetableDetails._id": slotId },
      { $set: { "timetableDetails.$.completed": completed } },
      { new: true }
    ).populate({
      path: "timetableDetails.timeTableSlot",
      model: "TimeTable",
    });

    if (!childTimetable) {
      return res
        .status(404)
        .json({ error: "Timetable slot not found for this child" });
    }

    res.status(200).json({
      message: "Timetable slot updated successfully",
      data: childTimetable,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get timetable history for a child
export const getChildTimetableHistory = async (req, res) => {
  try {
    const { childId } = req.params;

    // Get timetables grouped by creation time
    const history = await ChildTimeTable.find({ childId })
      .sort({ createdAt: -1 }) // Show latest first
      .populate("timetableDetails.timeTableSlot");

    if (!history.length) {
      return res
        .status(404)
        .json({ message: "No timetables found for this child." });
    }

    res.status(200).json({ data: history });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update completion status of a specific activity in the timetable
export const updateActivityCompletion = async (req, res) => {
  try {
    const { timetableId } = req.params;
    const { completed } = req.body;

    const updatedTimetable = await ChildTimeTable.findOneAndUpdate(
      { "timetableDetails._id": timetableId },
      { $set: { "timetableDetails.$.completed": completed } },
      { new: true }
    ).populate("timetableDetails.timeTableSlot");

    if (!updatedTimetable) {
      return res.status(404).json({ message: "Timetable entry not found." });
    }

    res.status(200).json({
      message: "Activity updated successfully",
      data: updatedTimetable,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLatestTimetables = async (req, res) => {
  try {
    const { childId } = req.params;

    const latestTimetables = await ChildTimeTable.find({ childId })
      .sort({ createdAt: -1 })
      .populate("timetableDetails.timeTableSlot");

    // if (!latestTimetables.length) {
    //   return res.status(404).json({ message: "No timetables found for this child." });
    // }

    res.status(200).json(latestTimetables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Complete a week and optionally generate a new one
export const completeWeek = async (req, res) => {
  try {
    const { childId } = req.params;
    const { completedTimetableId } = req.body;

    // 1. Mark all activities in the specified timetable as completed and set weekCompleted to true
    const updatedTimetable = await ChildTimeTable.findByIdAndUpdate(
      completedTimetableId,
      {
        $set: {
          "timetableDetails.$[].completed": true,
          weekCompleted: true,
        },
      },
      { new: true }
    ).populate("timetableDetails.timeTableSlot");

    if (!updatedTimetable) {
      return res.status(404).json({ message: "Timetable not found." });
    }

    res.status(200).json({
      message: "Week marked as complete.",
      data: updatedTimetable,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
