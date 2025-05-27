const util = require("util");
const { spawn } = require("child_process");
const GameSession = require("../models/gamesession.model");
const AWS = require("aws-sdk");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "us-east-1",
});

// Multer setup for video uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = "uploads/";
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max per video
}).single("video");

// Convert upload function to return a promise
const uploadPromise = util.promisify(upload);

/**
 * Extracts the first 10 frames from the input video and combines them into a short MP4 video.
 * @param {string} inputPath - Path to the uploaded video.
 * @returns {Promise<string>} - Resolves with the path to the generated MP4 thumbnail video.
 */
const extractThumbnailFrom10Frames = (inputPath) => {
  return new Promise((resolve, reject) => {
    // Define a pattern for the extracted frames
    const framesPattern = inputPath + "_frame_%03d.png"; // e.g., "uploads/12345-abc.mp4_frame_%03d.png"
    const outputPath = inputPath + "_thumbnail.mp4";

    // Step 1: Extract the first 60 frames as PNG images.
    // This command uses the video filter "select=lt(n\,60)" to pick frames with frame number less than 10.
    const ffmpegExtract = spawn("ffmpeg", [
      "-i",
      inputPath,
      "-vf",
      "select=lt(n\\,60)",
      "-vsync",
      "0",
      framesPattern,
    ]);

    ffmpegExtract.on("error", (error) => {
      reject(error);
    });

    ffmpegExtract.on("close", (code) => {
      if (code !== 0) {
        return reject(
          new Error("FFmpeg frame extraction exited with code " + code)
        );
      }
      // Step 2: Combine the extracted frames into a video.
      // Here we use a framerate of 10 fps so the resulting video will be approximately 1 second long.
      const ffmpegCombine = spawn("ffmpeg", [
        "-framerate",
        "10",
        "-i",
        framesPattern,
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        outputPath,
      ]);

      ffmpegCombine.on("error", (error) => {
        reject(error);
      });

      ffmpegCombine.on("close", (code2) => {
        if (code2 !== 0) {
          return reject(
            new Error(
              "FFmpeg image-to-video conversion exited with code " + code2
            )
          );
        }
        // Step 3: Clean up the temporary frame images.
        const dir = path.dirname(inputPath);
        const base = path.basename(inputPath) + "_frame_";
        fs.readdir(dir, (err, files) => {
          if (!err) {
            files.forEach((file) => {
              if (file.startsWith(base) && file.endsWith(".png")) {
                fs.unlinkSync(path.join(dir, file));
              }
            });
          }
          resolve(outputPath);
        });
      });
    });
  });
};

// Function to upload a file to S3
const uploadToS3 = async (file, userId) => {
  const fileStream = fs.createReadStream(file.path);
  const fileName = `${Date.now()}-${path.basename(file.path)}`;
  const s3Key = `videos/${userId}/${fileName}`;

  const params = {
    Bucket: "rp-projects-public",
    Key: s3Key,
    Body: fileStream,
    ContentType: file.mimetype,
  };

  console.log(`[S3 Upload] Uploading file: ${fileName} for user: ${userId}`);

  try {
    const data = await s3.upload(params).promise();
    fs.unlinkSync(file.path); // Remove local file after upload
    console.log(`[S3 Upload] Successfully uploaded: ${data.Location}`);
    return data.Location;
  } catch (error) {
    console.error(`[S3 Upload] Error uploading file: ${error.message}`);
    throw error;
  }
};

// Endpoint: Create a game session by uploading a video, extracting first 10 frames,
exports.createGameSession = async (req, res) => {
  try {
    console.log("[Request] Starting video upload process...");
    // Handle file upload via Multer
    await uploadPromise(req, res);

    if (!req.file) {
      console.warn("[Request] No video file provided.");
      return res.status(400).json({ error: "No video file provided" });
    }

    // Get the user ID from the token (populated by your authentication middleware)
    const userId = req.user.id;
    console.log(`[Request] User ID: ${userId} uploading video...`);

    // Extract the first 10 frames and combine them into an MP4 thumbnail.
    console.log(
      "[Conversion] Extracting first 10 frames and converting to MP4 thumbnail..."
    );
    const mp4ThumbnailPath = await extractThumbnailFrom10Frames(req.file.path);
    console.log(`[Conversion] Thumbnail created: ${mp4ThumbnailPath}`);

    // Prepare a file object with the generated MP4 thumbnail details
    const fileForS3 = {
      path: mp4ThumbnailPath,
      mimetype: "video/mp4",
    };

    // Upload the MP4 thumbnail to S3 and get its URL
    const videoUrl = await uploadToS3(fileForS3, userId);

    // Call the external emotion detection API using the thumbnail's URL.
    console.log(`[Emotion API] Sending request for video: ${videoUrl}`);
    const apiResponse = await axios.post(
      `${process.env.FLASH_BACKEND}/game-emotion-project/emotion_detection`,
      { s3_link: videoUrl }
    );
    console.log(
      `[Emotion API] Response received: ${JSON.stringify(apiResponse.data)}`
    );

    // Extract emotion analysis from the API response.
    const emotionAnalysis = apiResponse.data.emotion_analysis;

    // Create a new GameSession record with initialEmotion data
    const newGameSession = new GameSession({
      user: userId,
      initialEmotion: {
        emotionDetectionVideo: videoUrl,
        emotionAnalysis: emotionAnalysis,
      },
    });

    const savedSession = await newGameSession.save();
    console.log(
      `[Database] Saved game session record with ID: ${savedSession._id}`
    );

    return res.status(201).json({
      message: "Game session created successfully.",
      gameSession: savedSession,
    });
  } catch (error) {
    console.error(`[Error] Process failed: ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get user initial emotion levels
exports.getUserInitialEmotions = async (req, res) => {
  try {
    // Get the authenticated user's ID
    const userId = req.user.id;
    console.log(
      `[Request] Retrieving initial emotion details for user: ${userId}`
    );

    // Query GameSession documents for the user, returning initialEmotion, finalEmotion, gameName, planType, _id, and createdAt fields
    const sessions = await GameSession.find({ user: userId }).select(
      "initialEmotion finalEmotion gameName planType _id createdAt"
    );

    if (!sessions || sessions.length === 0) {
      console.log(`[Info] No game sessions found for user: ${userId}`);
      return res.status(200).json({ initialEmotions: [] });
    }

    return res.status(200).json({ initialEmotions: sessions });
  } catch (error) {
    console.error(
      `[Error] Retrieving initial emotion details: ${error.message}`
    );
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update game session
exports.updateGameSession = async (req, res) => {
  try {
    const sessionId = req.params.id;
    const userId = req.user.id;
    const updateData = req.body;

    // Find the game session by id and user
    let gameSession = await GameSession.findOne({
      _id: sessionId,
      user: userId,
    });
    if (!gameSession) {
      return res.status(404).json({ error: "Game session not found." });
    }

    // Destructure puzzleRecords from updateData and separate other updates.
    const { puzzleRecords, ...otherUpdates } = updateData;

    // Update other fields if provided
    Object.keys(otherUpdates).forEach((key) => {
      gameSession[key] = otherUpdates[key];
    });

    // If puzzleRecords is provided and is an array, append each record
    if (puzzleRecords && Array.isArray(puzzleRecords)) {
      puzzleRecords.forEach((record) => {
        gameSession.puzzleRecords.push(record);
      });
    }

    const updatedSession = await gameSession.save();

    return res.status(200).json({
      message: "Game session updated successfully.",
      gameSession: updatedSession,
    });
  } catch (error) {
    console.error(`[Error] Update failed: ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get records By game session
exports.getGameSessionDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const sessionId = req.params.id;

    // Find the game session for the user and include all relevant details
    const gameSession = await GameSession.findOne({
      _id: sessionId,
      user: userId,
    }).select(
      "puzzleRecords planType gameName initialEmotion withingGameEmotion finalEmotion createdAt"
    );

    if (!gameSession) {
      return res.status(404).json({ message: "Game session not found." });
    }

    return res.status(200).json({
      puzzleRecords: gameSession.puzzleRecords,
      planType: gameSession.planType,
      gameName: gameSession.gameName,
      initialEmotion: gameSession.initialEmotion,
      withingGameEmotion: gameSession.withingGameEmotion,
      finalEmotion: gameSession.finalEmotion,
      createdAt: gameSession.createdAt,
    });
  } catch (error) {
    console.error(`[Error] Retrieving session details: ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Save game records
exports.updatePuzzleRecords = async (req, res) => {
  try {
    const userId = req.user.id;
    const sessionId = req.params.id;
    const newRecords = req.body.puzzleRecords;

    if (!Array.isArray(newRecords)) {
      return res.status(400).json({ error: "puzzleRecords must be an array." });
    }

    // Find the game session document for the authenticated user
    let gameSession = await GameSession.findOne({
      _id: sessionId,
      user: userId,
    });
    if (!gameSession) {
      return res.status(404).json({ error: "Game session not found." });
    }

    // Append new records without removing existing ones
    gameSession.puzzleRecords = [...gameSession.puzzleRecords, ...newRecords];

    // Save the updated game session
    const updatedSession = await gameSession.save();

    return res.status(200).json({
      message: "Puzzle records updated successfully.",
      puzzleRecords: updatedSession.puzzleRecords,
    });
  } catch (error) {
    console.error("Error updating puzzle records:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get emotion after suggestion activity with first 10 frames extraction and conversion.
exports.getWithingGameEmotion = async (req, res) => {
  try {
    console.log(
      "[Request] Starting video upload process for withingGameEmotion..."
    );
    // Handle the file upload via Multer
    await uploadPromise(req, res);

    if (!req.file) {
      console.warn("[Request] No video file provided.");
      return res.status(400).json({ error: "No video file provided" });
    }

    // Get the user ID and session ID from the request
    const userId = req.user.id;
    const sessionId = req.params.id; // Game session ID from the request
    console.log(`[Request] User ID: ${userId}, Session ID: ${sessionId}`);

    // Extract the first 10 frames and combine them into an MP4 thumbnail.
    console.log(
      "[Conversion] Extracting first 10 frames and converting to MP4 thumbnail..."
    );
    const mp4ThumbnailPath = await extractThumbnailFrom10Frames(req.file.path);
    console.log(`[Conversion] Thumbnail created: ${mp4ThumbnailPath}`);

    // Prepare a file object with the generated MP4 thumbnail details.
    const fileForS3 = {
      path: mp4ThumbnailPath,
      mimetype: "video/mp4",
    };

    // Upload the MP4 thumbnail to S3 and get its URL.
    const videoUrl = await uploadToS3(fileForS3, userId);

    // Call the external emotion detection API using the thumbnail's URL.
    console.log(`[Emotion API] Sending request for video: ${videoUrl}`);
    const apiResponse = await axios.post(
      `${process.env.FLASH_BACKEND}/game-emotion-project/emotion_detection`,
      { s3_link: videoUrl }
    );
    console.log(
      `[Emotion API] Response received: ${JSON.stringify(apiResponse.data)}`
    );
    const emotionAnalysis = apiResponse.data.emotion_analysis;

    // Find the existing game session for the user.
    let gameSession = await GameSession.findOne({
      _id: sessionId,
      user: userId,
    });
    if (!gameSession) {
      return res.status(404).json({ error: "Game session not found." });
    }

    // Append the new emotion detection data to the withingGameEmotion array.
    gameSession.withingGameEmotion.push({
      emotionDetectionVideo: videoUrl,
      emotionAnalysis: emotionAnalysis,
      timestamp: new Date(), // Store the timestamp of detection.
    });

    // Save the updated game session.
    const updatedSession = await gameSession.save();
    console.log(
      `[Database] Updated withingGameEmotion in session ID: ${sessionId}`
    );

    return res.status(200).json({
      message: "Emotion detection added successfully.",
      withingGameEmotion: updatedSession.withingGameEmotion,
    });
  } catch (error) {
    console.error(`[Error] Process failed: ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get final emotion after suggestion activity using first 10 frames extraction
exports.getFinalEmotion = async (req, res) => {
  try {
    console.log("[Request] Starting final emotion video upload process...");

    // Handle the file upload via Multer
    await uploadPromise(req, res);
    if (!req.file) {
      console.warn("[Request] No video file provided.");
      return res.status(400).json({ error: "No video file provided" });
    }

    // Get user and session IDs
    const userId = req.user.id;
    const sessionId = req.params.id;
    console.log(
      `[Request] User ID: ${userId}, Session ID: ${sessionId} uploading final video...`
    );

    // Extract the first 10 frames and convert them into an MP4 thumbnail video.
    console.log(
      "[Conversion] Extracting first 10 frames and converting to MP4 thumbnail..."
    );
    const mp4ThumbnailPath = await extractThumbnailFrom10Frames(req.file.path);
    console.log(`[Conversion] Thumbnail created: ${mp4ThumbnailPath}`);

    // Prepare file object for S3 upload
    const fileForS3 = {
      path: mp4ThumbnailPath,
      mimetype: "video/mp4",
    };

    // Upload the MP4 thumbnail video to S3 and get its URL.
    const videoUrl = await uploadToS3(fileForS3, userId);

    // Call the external emotion detection API using the video URL.
    console.log(`[Emotion API] Sending request for final video: ${videoUrl}`);
    const apiResponse = await axios.post(
      `${process.env.FLASH_BACKEND}/game-emotion-project/emotion_detection`,
      { s3_link: videoUrl }
    );
    console.log(
      `[Emotion API] Response received: ${JSON.stringify(apiResponse.data)}`
    );
    const emotionAnalysis = apiResponse.data.emotion_analysis;

    // Find the existing game session for the user.
    let gameSession = await GameSession.findOne({
      _id: sessionId,
      user: userId,
    });
    if (!gameSession) {
      console.warn(`[Error] Game session not found for ID: ${sessionId}`);
      return res.status(404).json({ error: "Game session not found." });
    }

    // Update finalEmotion field.
    gameSession.finalEmotion = {
      emotionDetectionVideo: videoUrl,
      emotionAnalysis: emotionAnalysis,
    };

    // Save the updated game session.
    const updatedSession = await gameSession.save();
    console.log(
      `[Database] Final emotion saved successfully for session ID: ${sessionId}`
    );

    return res.status(200).json({
      message: "Final emotion recorded successfully.",
      finalEmotion: updatedSession.finalEmotion,
    });
  } catch (error) {
    console.error(`[Error] Processing final emotion: ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete game session
exports.deleteGameSession = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedSession = await GameSession.findByIdAndDelete(id);
    if (!deletedSession) {
      return res.status(404).json({ message: "Game session not found" });
    }
    res.json({ message: "Game session deleted successfully" });
  } catch (error) {
    console.error("Error deleting game session:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
