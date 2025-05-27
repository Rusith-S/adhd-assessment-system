import TimeTable from "../models/TimeTable.js";

// Add a new timetable entry
export const addTimeTableEntry = async (req, res) => {
  try {
    const { time, timeTableNumber, activityType, duration, category } = req.body;

    if (!time || !timeTableNumber || !activityType || !duration || !category) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newEntry = new TimeTable({ time, timeTableNumber, activityType, duration, category });
    await newEntry.save();

    res.status(201).json({ message: "TimeTable entry added successfully", data: newEntry });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all timetable entries
export const getAllTimeTableEntries = async (req, res) => {
  try {
    const entries = await TimeTable.find();
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get timetable entries by category (low, medium, high)
export const getTimeTableByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const entries = await TimeTable.find({ category });
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get timetable entries by timetable number (1, 2, 3, 4, 5)
export const getTimeTableByNumber = async (req, res) => {
  try {
    const { timeTableNumber } = req.params;
    const entries = await TimeTable.find({ timeTableNumber });
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
