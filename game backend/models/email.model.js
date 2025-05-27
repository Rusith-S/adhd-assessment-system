const mongoose = require("mongoose");

const EmailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  gameSession: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GameSession",
    required: true,
  },
  pdfUrl: {
    type: String,
    default: null,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["sent", "failed"],
    default: "sent",
  },
});

module.exports = mongoose.model("EmailRecord", EmailSchema);
