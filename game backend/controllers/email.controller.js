const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const QuickChart = require("quickchart-js");
const GameSession = require("../models/gamesession.model");
const EmailRecord = require("../models/email.model");

/**
 * Generate a URL for a bar chart image using QuickChart based on puzzleRecords data.
 * @param {Array} puzzleRecords - Array of puzzle record objects.
 * @returns {string} - URL for the generated chart image.
 */
function generatePuzzleChartUrl(puzzleRecords) {
  const labels = puzzleRecords.map((_, index) => `Puzzle ${index + 1}`);
  const moveCounts = puzzleRecords.map((record) => record.moveCount);
  const completionTimes = puzzleRecords.map((record) => record.completionTime);
  const mouseMovementTimes = puzzleRecords.map(
    (record) => record.mouseMovementTime
  );

  const qc = new QuickChart();
  qc.setConfig({
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Move Count",
          data: moveCounts,
          backgroundColor: "rgba(136, 132, 216, 0.6)",
        },
        {
          label: "Completion Time (sec)",
          data: completionTimes,
          backgroundColor: "rgba(255, 115, 0, 0.6)",
        },
        {
          label: "Mouse Movement Time (sec)",
          data: mouseMovementTimes,
          backgroundColor: "rgba(0, 204, 102, 0.6)",
        },
      ],
    },
    options: {
      plugins: { legend: { position: "top" } },
      scales: {
        x: { title: { display: true, text: "Puzzle #" } },
        y: { title: { display: true, text: "Value" } },
      },
    },
  });
  qc.setWidth(600);
  qc.setHeight(400);
  return qc.getUrl();
}

/**
 * Generate a URL for a bar chart image comparing initial and final emotion levels.
 * @param {Object} gameSession - The game session object.
 * @returns {string} - URL for the generated emotion chart.
 */
function generateEmotionChartUrlForSession(gameSession) {
  const initialAnalysis = gameSession.initialEmotion
    ? Object.fromEntries(gameSession.initialEmotion.emotionAnalysis)
    : {};
  const finalAnalysis = gameSession.finalEmotion
    ? Object.fromEntries(gameSession.finalEmotion.emotionAnalysis)
    : {};
  const keys = Array.from(
    new Set([...Object.keys(initialAnalysis), ...Object.keys(finalAnalysis)])
  );
  const initialValues = keys.map((k) => initialAnalysis[k] || 0);
  const finalValues = keys.map((k) => finalAnalysis[k] || 0);

  const qc = new QuickChart();
  qc.setConfig({
    type: "bar",
    data: {
      labels: keys.map((k) => k.charAt(0).toUpperCase() + k.slice(1)),
      datasets: [
        {
          label: "Initial Emotion",
          data: initialValues,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
        },
        {
          label: "Final Emotion",
          data: finalValues,
          backgroundColor: "rgba(255, 99, 132, 0.6)",
        },
      ],
    },
    options: {
      plugins: { legend: { position: "top" } },
      scales: {
        x: { title: { display: true, text: "Emotion" } },
        y: { title: { display: true, text: "Percentage" } },
      },
    },
  });
  qc.setWidth(600);
  qc.setHeight(400);
  return qc.getUrl();
}

exports.sendFinalProgressEmail = async (req, res) => {
  try {
    const { gameSessionId, email } = req.body;
    if (!gameSessionId || !email) {
      return res
        .status(400)
        .json({ error: "Game session ID and email are required." });
    }

    // Retrieve the game session details
    const gameSession = await GameSession.findById(gameSessionId);
    if (!gameSession) {
      return res.status(404).json({ error: "Game session not found." });
    }

    // Generate PDF report using PDFKit
    const doc = new PDFDocument({ margin: 50 });
    const pdfDir = path.join(__dirname, "../pdfs");
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }
    const pdfPath = path.join(pdfDir, `${gameSessionId}-${Date.now()}.pdf`);
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    // --- Page 1: Game Details, Emotion Tables, Puzzle Performance Table ---
    doc.fontSize(22).text("Final Progress Report", { align: "center" });
    doc.moveDown();

    // Game Details Table
    doc.fontSize(16).text("Game Details", { underline: true });
    doc.moveDown(0.5);
    doc.font("Courier").fontSize(12);
    doc.text(`Game Name: ${gameSession.gameName || "N/A"}`);
    doc.text(`Plan Type: ${gameSession.planType || "N/A"}`);
    doc.text(
      `Session Started: ${new Date(gameSession.createdAt).toLocaleString()}`
    );
    doc.moveDown();

    // Initial Emotion Table
    if (gameSession.initialEmotion) {
      doc.fontSize(16).text("Initial Emotion", { underline: true });
      doc.moveDown(0.5);
      doc.font("Courier").fontSize(12);
      doc.text("Emotion         Percentage");
      doc.text("-----------------------------");
      const initialAnalysis = Object.fromEntries(
        gameSession.initialEmotion.emotionAnalysis
      );
      for (const [key, value] of Object.entries(initialAnalysis)) {
        doc.text(`${key.padEnd(15)} ${value.toFixed(2)}%`);
      }
      doc.moveDown();
    }

    // Final Emotion Table
    if (gameSession.finalEmotion) {
      doc.fontSize(16).text("Final Emotion", { underline: true });
      doc.moveDown(0.5);
      doc.font("Courier").fontSize(12);
      doc.text("Emotion         Percentage");
      doc.text("-----------------------------");
      const finalAnalysis = Object.fromEntries(
        gameSession.finalEmotion.emotionAnalysis
      );
      for (const [key, value] of Object.entries(finalAnalysis)) {
        doc.text(`${key.padEnd(15)} ${value.toFixed(2)}%`);
      }
      doc.moveDown();
    }

    // Puzzle Performance Table
    doc.fontSize(16).text("Puzzle Performance", { underline: true });
    doc.moveDown(0.5);
    doc.font("Courier").fontSize(12);
    doc.text("Puzzle #   Type     Moves   Completion(sec)   MouseMove(sec)");
    doc.text("---------------------------------------------------------------");
    if (gameSession.puzzleRecords && gameSession.puzzleRecords.length > 0) {
      gameSession.puzzleRecords.forEach((record, index) => {
        const puzzleNum = (index + 1).toString().padEnd(10);
        const type = record.puzzleType.padEnd(8);
        const moves = record.moveCount.toString().padEnd(8);
        const compTime = record.completionTime.toFixed(2).padEnd(18);
        const mouseTime = record.mouseMovementTime.toFixed(2);
        doc.text(`${puzzleNum} ${type} ${moves} ${compTime} ${mouseTime}`);
      });
    } else {
      doc.text("No puzzle records available.");
    }
    doc.moveDown();

    // --- Page 2: Puzzle Performance Chart ---
    doc.addPage();
    doc.fontSize(22).text("Puzzle Performance Chart", { align: "center" });
    doc.moveDown();
    if (gameSession.puzzleRecords && gameSession.puzzleRecords.length > 0) {
      const chartUrl = generatePuzzleChartUrl(gameSession.puzzleRecords);
      const chartResponse = await axios.get(chartUrl, {
        responseType: "arraybuffer",
      });
      const chartBuffer = Buffer.from(chartResponse.data, "binary");
      doc
        .fontSize(16)
        .text("Puzzle Performance", { underline: true, align: "center" });
      doc.moveDown(0.5);
      doc.image(chartBuffer, { width: 500, align: "center" });
      doc.moveDown();
    } else {
      doc
        .fontSize(16)
        .text("No puzzle performance data available.", { align: "center" });
    }

    // --- Page 3: Emotion Levels Chart ---
    doc.addPage();
    doc.fontSize(22).text("Emotion Levels Comparison", { align: "center" });
    doc.moveDown();
    if (gameSession.initialEmotion || gameSession.finalEmotion) {
      const emotionChartUrl = generateEmotionChartUrlForSession(gameSession);
      const emotionChartResponse = await axios.get(emotionChartUrl, {
        responseType: "arraybuffer",
      });
      const emotionChartBuffer = Buffer.from(
        emotionChartResponse.data,
        "binary"
      );
      doc
        .fontSize(16)
        .text("Emotion Levels", { underline: true, align: "center" });
      doc.moveDown(0.5);
      doc.image(emotionChartBuffer, { width: 500, align: "center" });
      doc.moveDown();
    } else {
      doc
        .fontSize(16)
        .text("No emotion data available for charting.", { align: "center" });
    }

    doc.end();

    await new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_ACCOUNT,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_ACCOUNT,
      to: email,
      subject: "Final Progress Report",
      text: "Please find attached your final progress report.",
      attachments: [
        {
          filename: `${gameSessionId}.pdf`,
          path: pdfPath,
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);

    // Save email record in DB
    const emailRecord = new EmailRecord({
      email,
      gameSession: gameSessionId,
      pdfUrl: pdfPath, // Optionally, update with a public URL later
      status: "sent",
    });
    await emailRecord.save();

    // Optionally remove the local PDF file
    fs.unlinkSync(pdfPath);

    return res.status(200).json({
      message: "Email sent successfully.",
      emailRecord,
    });
  } catch (error) {
    console.error("Error in sendFinalProgressEmail:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
