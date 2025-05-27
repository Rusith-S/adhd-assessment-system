import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ActivityEmotions = () => {
  const { id } = useParams();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmotionRecords();
  }, []);

  const fetchEmotionRecords = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}game/puzzle-records/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const gameSession = response.data || {};
      const emotions = gameSession.withingGameEmotion || [];

      // Sort emotions in **descending order** (latest first)
      emotions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setRecords(emotions);
    } catch (error) {
      console.error("Error fetching records:", error);
      setRecords([]);
    }
    setLoading(false);
  };

  // Handle emotion click (only the latest one is clickable)
  const handleCardClick = (record, isLatest) => {
    if (!isLatest) return; // Only allow clicking the latest record

    // Extract emotion analysis
    const emotions = record.emotionAnalysis;
    let maxKey = "";
    let maxValue = -Infinity;

    // Determine the dominant emotion
    Object.entries(emotions).forEach(([key, value]) => {
      if (value > maxValue) {
        maxValue = value;
        maxKey = key;
      }
    });

    // Set route based on dominant emotion
    let route = `/game-selection/${id}`;
    if (maxKey === "happy") {
      route = `/game-selection/${id}`;
    } else if (maxKey === "sad") {
      route = `/suggestion-sad/${id}`;
    } else if (maxKey === "fear") {
      route = `/suggestion-fear/${id}`;
    } else if (maxKey === "surprise") {
      route = `/suggestion-surprise/${id}`;
    } else if (maxKey === "neutral") {
      route = `/game-selection/${id}`;
    }

    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        🎭 Activity Emotion Records
      </h1>
      {loading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
        </div>
      ) : records.length === 0 ? (
        <p className="text-center text-gray-600">
          No emotion analysis records found.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.map((record, index) => {
            const isLatest = index === 0; // Latest record (first in sorted array)

            return (
              <div
                key={index}
                className={`relative bg-white shadow-lg rounded-lg p-6 border cursor-pointer transition-transform hover:scale-105 ${
                  isLatest ? "hover:shadow-xl" : "opacity-50 grayscale"
                }`}
                onClick={() => handleCardClick(record, isLatest)}
              >
                {/* Video Preview */}
                <video
                  className="w-full h-40 border rounded-md"
                  controls
                  src={record.emotionDetectionVideo}
                >
                  Your browser does not support the video tag.
                </video>

                {/* Emotion Data */}
                <h2 className="text-lg font-semibold text-gray-700 mt-4">
                  🎥 Emotional Analysis
                </h2>
                <ul className="mt-2 text-gray-600">
                  {Object.entries(record.emotionAnalysis).map(
                    ([emotion, value]) => (
                      <li key={emotion} className="text-sm font-medium">
                        🌀 {emotion.charAt(0).toUpperCase() + emotion.slice(1)}:{" "}
                        {value.toFixed(2)}%
                      </li>
                    )
                  )}
                </ul>

                {/* Latest Label */}
                {isLatest && (
                  <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                    Latest
                  </span>
                )}

                {/* Message for Older Records */}
                {!isLatest && (
                  <div className="text-xs text-red-500 mt-2 text-center">
                    You can only select the latest record.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActivityEmotions;
