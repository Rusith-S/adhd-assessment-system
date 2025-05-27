const mongoose = require("mongoose");

// Define EmotionSchema for emotion details
const EmotionSchema = new mongoose.Schema(
  {
    emotionDetectionVideo: {
      type: String,
      required: true,
    },
    emotionAnalysis: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { _id: false }
);

// Define PuzzleRecordSchema for each puzzle record (if needed)
const PuzzleRecordSchema = new mongoose.Schema(
  {
    puzzleId: {
      type: Number,
      required: true,
    },
    puzzleType: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    moveCount: {
      type: Number,
      required: true,
    },
    completionTime: {
      type: Number,
      required: true,
    },
    mouseMovementTime: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

// GameSession schema: only user and initialEmotion are required.
const GameSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  gameName: {
    type: String,
    default: null,
  },
  initialEmotion: {
    type: EmotionSchema,
    required: true,
  },
  withingGameEmotion: {
    type: [EmotionSchema],
    default: [],
  },
  finalEmotion: {
    type: EmotionSchema,
    default: null,
  },
  planType: {
    type: String,
    enum: ["7 Days", "14 Days", "21 Days"],
    default: null,
  },
  puzzleRecords: {
    type: [PuzzleRecordSchema],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("GameSession", GameSessionSchema);
