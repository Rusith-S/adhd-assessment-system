import express from 'express';
import {
  addTimeTableEntry,
  getAllTimeTableEntries,
  getTimeTableByCategory,
  getTimeTableByNumber,
} from '../controllers/timeTableController.js';

const router = express.Router();

// Route to add a new timetable entry
router.post('/add', addTimeTableEntry);

// Route to get all timetable entries
router.get('/all', getAllTimeTableEntries);

// Route to get timetable entries by category (low, medium, high)
router.get('/category/:category', getTimeTableByCategory);

// Route to get timetable entries by timetable number (1, 2, 3, 4, 5)
router.get('/number/:timeTableNumber', getTimeTableByNumber);

export default router;
