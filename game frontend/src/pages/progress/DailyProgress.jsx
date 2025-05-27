import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { XAxis, YAxis, Tooltip, Legend, BarChart, Bar } from "recharts";
import { ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";
import axios from "axios";
import Swal from "sweetalert2";

const DailyProgress = () => {
  const { id } = useParams();
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessionData();
  }, [id]);

  const fetchSessionData = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire(
        "Error",
        "Authentication token not found. Please log in.",
        "error"
      );
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}game/puzzle-records/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSessionData(response.data);
    } catch (error) {
      console.error("Error fetching session data:", error);
      Swal.fire(
        "Error",
        "Failed to fetch session data. Try again later.",
        "error"
      );
      setSessionData(null);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full"></div>
      </div>
    );
  }

  if (!sessionData) {
    return <p className="text-center text-gray-600">No data available</p>;
  }

  // Destructure session data
  const {
    puzzleRecords,
    planType,
    gameName,
    initialEmotion,
    withingGameEmotion,
    finalEmotion,
    createdAt,
  } = sessionData;

  // Fallback values for game details
  const displayGameName = gameName ? gameName : "N/A";
  const displayPlanType = planType ? planType : "N/A";

  // Process emotion data for the line chart
  const emotionData = [];
  if (initialEmotion && initialEmotion.emotionAnalysis) {
    emotionData.push({ label: "Initial", ...initialEmotion.emotionAnalysis });
  }
  if (withingGameEmotion && withingGameEmotion.length > 0) {
    withingGameEmotion.forEach((item, index) => {
      emotionData.push({
        label: `In-Game ${index + 1}`,
        ...item.emotionAnalysis,
      });
    });
  }
  if (finalEmotion && finalEmotion.emotionAnalysis) {
    emotionData.push({ label: "Final", ...finalEmotion.emotionAnalysis });
  }

  // Process puzzle records for the bar chart
  const puzzleData =
    puzzleRecords && puzzleRecords.length > 0
      ? puzzleRecords.map((record, index) => ({
          name: `Day ${index + 1}`,
          moveCount: record.moveCount,
          completionTime: record.completionTime,
          mouseMovementTime: record.mouseMovementTime,
        }))
      : [];

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        📊 Daily Progress Dashboard
      </h1>

      {/* Game Details */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-semibold text-gray-700">Game Details</h2>
        <p className="text-gray-600">
          <strong>Game Name:</strong> {displayGameName}
        </p>
        <p className="text-gray-600">
          <strong>Plan Type:</strong> {displayPlanType}
        </p>
        <p className="text-gray-600">
          <strong>Session Started:</strong>{" "}
          {new Date(createdAt).toLocaleString()}
        </p>
        {(!gameName || !planType) && (
          <p className="text-gray-500 mt-2">
            Defaulting to initial emotion data as game details are incomplete.
          </p>
        )}
      </div>

      {/* Puzzle Records */}
      {!puzzleRecords || puzzleRecords.length === 0 ? (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg mb-8 text-center">
          You have not started the game yet.
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            🧩 Puzzle Performance
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={puzzleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="moveCount" fill="#8884d8" />
              <Bar dataKey="completionTime" fill="#ff7300" />
              <Bar dataKey="mouseMovementTime" fill="#00cc66" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Emotion Chart */}
      {emotionData.length > 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            📈 Emotion Change Over Time
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={emotionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              {["happy", "neutral", "surprise", "fear", "sad"].map((key) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={
                    key === "happy"
                      ? "#ffcc00"
                      : key === "neutral"
                      ? "#8884d8"
                      : key === "surprise"
                      ? "#ff7300"
                      : key === "fear"
                      ? "#ff0000"
                      : "#0033cc"
                  }
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Emotion Data Unavailable
          </h2>
          <p className="text-gray-600">
            No emotion data is available at this time.
          </p>
        </div>
      )}
    </div>
  );
};

export default DailyProgress;
