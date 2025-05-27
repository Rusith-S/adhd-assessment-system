import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const InitialEmotions = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmotionRecords();
  }, []);

  const fetchEmotionRecords = async () => {
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
        `${import.meta.env.VITE_API_BASE_URL}game/initial-emotions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Expecting response.data.initialEmotions as an array of records
      const recordsData = response.data.initialEmotions || [];
      setRecords(recordsData);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch records. Try again later.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (id, e) => {
    e.stopPropagation(); // Prevent triggering card click
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire(
        "Error",
        "Authentication token not found. Please log in.",
        "error"
      );
      return;
    }
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this session?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (confirmResult.isConfirmed) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}game/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Remove the deleted record from state
        setRecords(records.filter((record) => record._id !== id));
        Swal.fire("Deleted!", "The session has been deleted.", "success");
      } catch (error) {
        Swal.fire(
          "Error",
          "Failed to delete the session. Try again later.",
          "error"
        );
      }
    }
  };

  const handleCardClick = (record) => {
    // Only proceed if finalEmotion is null
    if (record.finalEmotion !== null) return;

    const emotions = record.initialEmotion.emotionAnalysis;
    let maxKey = "";
    let maxValue = -Infinity;
    Object.entries(emotions).forEach(([key, value]) => {
      if (value > maxValue) {
        maxValue = value;
        maxKey = key;
      }
    });

    if (maxKey === "neutral" || maxKey === "happy") {
      // Check additional conditions for neutral
      if (record.gameName && record.planType) {
        navigate(`/game-map/${record._id}`);
      } else {
        navigate(`/game-selection/${record._id}`);
      }
    } else if (maxKey === "sad") {
      // Navigate to a page dedicated for sessions with a sad dominant emotion
      navigate(`/suggestion-sad/${record._id}`);
    } else if (maxKey === "fear") {
      // Navigate to a page dedicated for sessions with a fear dominant emotion
      navigate(`/suggestion-fear/${record._id}`);
    } else if (maxKey === "surprise") {
      // Navigate to a page dedicated for sessions with a surprise dominant emotion
      navigate(`/suggestion-surprise/${record._id}`);
    } else {
      // Fallback navigation for any other emotion
      navigate(`/game-selection/${record._id}`);
    }
  };

  const handleViewProgress = (record, e) => {
    e.stopPropagation();
    navigate(`/final-progress/${record._id}`);
  };

  const handleViewDailyProgress = (record, e) => {
    e.stopPropagation();
    navigate(`/daily-progress/${record._id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        🎭 Emotion Analysis Records
      </h1>
      {loading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        </div>
      ) : records.length === 0 ? (
        <p className="text-center text-gray-600">
          No emotion analysis records found.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.map((record) => {
            // Determine dominant emotion from initialEmotion.emotionAnalysis
            let maxKey = "";
            let maxValue = -Infinity;
            Object.entries(record.initialEmotion.emotionAnalysis).forEach(
              ([key, value]) => {
                if (value > maxValue) {
                  maxValue = value;
                  maxKey = key;
                }
              }
            );
            return (
              <div
                key={record._id}
                className="relative flex flex-col justify-between bg-white shadow-lg rounded-lg p-4 border hover:shadow-xl cursor-pointer"
              >
                <div className="flex flex-col">
                  {/* Video Preview */}
                  <video controls className="h-60 rounded-lg mb-4">
                    <source
                      src={record.initialEmotion.emotionDetectionVideo}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                  {/* Session Start Date/Time */}
                  <p className="text-sm text-gray-500 mb-2">
                    📅 {new Date(record.createdAt).toLocaleString()}
                  </p>
                  {/* Initial Emotion Analysis */}
                  <h2 className="text-lg font-semibold text-gray-700">
                    🎥 Initial Emotion Analysis
                  </h2>
                  {Object.keys(record.initialEmotion.emotionAnalysis).length ===
                  0 ? (
                    <p className="text-blue-600">No data available.</p>
                  ) : (
                    <ul className="mt-2 text-gray-600">
                      {Object.entries(
                        record.initialEmotion.emotionAnalysis
                      ).map(([emotion, value]) => (
                        <li key={emotion} className="flex justify-between">
                          <span className="capitalize">{emotion}:</span>
                          <span className="font-semibold">
                            {value.toFixed(2)}%
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {/* Buttons / Message */}
                <div className="flex flex-col gap-2 mt-4">
                  {record.finalEmotion !== null ? (
                    <button
                      onClick={(e) => handleViewProgress(record, e)}
                      className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                    >
                      View Final Progress
                    </button>
                  ) : (
                    (() => {
                      // For sessions with no finalEmotion, show Start Game if dominant is happy or neutral,
                      // otherwise show a warning message.
                      if (maxKey === "happy" || maxKey === "neutral") {
                        return (
                          <button
                            onClick={
                              record.finalEmotion === null
                                ? () => handleCardClick(record)
                                : undefined
                            }
                            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
                          >
                            Start Game
                          </button>
                        );
                      } else {
                        return (
                          <div>
                            <p className="text-red-600 text-sm font-medium">
                              Your child is not in a good emotional state to
                              play the game. Please follow the suggested
                              activities to help your child become neutral or
                              happy.
                            </p>
                            <button
                              onClick={
                                record.finalEmotion === null
                                  ? () => handleCardClick(record)
                                  : undefined
                              }
                              className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
                            >
                              Start Activities
                            </button>
                          </div>
                        );
                      }
                    })()
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => handleViewDailyProgress(record, e)}
                      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                      View Daily Progress
                    </button>
                    {/* Delete Icon */}

                    <button
                      onClick={(e) => handleDeleteSession(record._id, e)}
                      className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
                    >
                      Delete Record
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InitialEmotions;
