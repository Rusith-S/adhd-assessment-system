const express = require("express");
const router = express.Router();
const gamesessionController = require("../controllers/gamesession.controller");
const authenticateUser = require("../middleware/authMiddleware");

// Create new game session initial state
router.post("/create", authenticateUser, gamesessionController.createGameSession);

// Get initial emotion 
router.get("/initial-emotions", authenticateUser, gamesessionController.getUserInitialEmotions);

// Update a game session
router.put("/:id", authenticateUser, gamesessionController.updateGameSession);

// Get puzzleRecords for a specific game session
router.get("/puzzle-records/:id", authenticateUser, gamesessionController.getGameSessionDetails);

//  Update puzzle records
router.put("/puzzle-records/:id", authenticateUser, gamesessionController.updatePuzzleRecords);

// Get emotion after suggestion activity
router.put("/gaming-emotions/:id", authenticateUser, gamesessionController.getWithingGameEmotion);

// Get final emotion level
router.put("/final-emotions/:id", authenticateUser, gamesessionController.getFinalEmotion);

// Delete a game session
router.delete("/:id", authenticateUser, gamesessionController.deleteGameSession);

module.exports = router;

