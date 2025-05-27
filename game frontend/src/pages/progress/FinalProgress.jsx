import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { ResponsiveContainer, Tooltip, Legend, BarChart, Bar } from "recharts";
import axios from "axios";
import SendEmailModal from "../../components/emailmodal/SendEmailModal";

const FinalProgress = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}game/puzzle-records/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserData(null);
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

  if (!userData) {
    return <p className="text-center text-gray-600">No data available</p>;
  }

  const {
    puzzleRecords,
    planType,
    gameName,
    initialEmotion,
    withingGameEmotion,
    finalEmotion,
  } = userData;

  // Process emotion data for the line chart
  const emotionData = [
    { label: "Initial", ...initialEmotion.emotionAnalysis },
    ...withingGameEmotion.map((emotion, index) => ({
      label: `Game ${index + 1}`,
      ...emotion.emotionAnalysis,
    })),
    { label: "Final", ...finalEmotion.emotionAnalysis },
  ];

  // Process puzzle records for the bar chart
  const puzzleData = puzzleRecords.map((record, index) => ({
    name: `Day ${index + 1}`,
    moveCount: record.moveCount,
    completionTime: record.completionTime,
    mouseMovementTime: record.mouseMovementTime,
  }));

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        📊 User Progress Dashboard
      </h1>

      {/* Game Details */}
      <div className="flex justify-between bg-white p-6 rounded-lg shadow-lg mb-8">
        <div className="">
          <h2 className="text-xl font-semibold text-gray-700">
            🕹️ Game Details
          </h2>
          <p className="text-gray-600">
            <strong>Game Name:</strong> {gameName}
          </p>
          <p className="text-gray-600">
            <strong>Plan Type:</strong> {planType}
          </p>
        </div>
        <div className="flex justify-center items-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700 transition"
          >
            Send Report To Doctor
          </button>
        </div>
      </div>

      {/* Emotion Videos & Data */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Initial Emotion */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700">
            🎥 Initial Emotion
          </h2>
          <video controls className="w-full rounded-lg mt-4">
            <source
              src={initialEmotion.emotionDetectionVideo}
              type="video/mp4"
            />
          </video>
          <ul className="mt-4 text-gray-600">
            {Object.entries(initialEmotion.emotionAnalysis).map(
              ([key, value]) => (
                <li
                  key={key}
                  className="text-sm font-medium"
                >{`🌀 ${key}: ${value.toFixed(2)}%`}</li>
              )
            )}
          </ul>
        </div>

        {/* In-Game Emotions */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700">
            🎮 In-Activity Emotions
          </h2>
          {withingGameEmotion.length === 0 ? (
            <p className="text-gray-500">No in-game emotions recorded.</p>
          ) : (
            withingGameEmotion.map((emotion, index) => (
              <div key={index} className="mb-6">
                <video controls className="w-full rounded-lg mt-4">
                  <source
                    src={emotion.emotionDetectionVideo}
                    type="video/mp4"
                  />
                </video>
                <ul className="mt-4 text-gray-600">
                  {Object.entries(emotion.emotionAnalysis).map(
                    ([key, value]) => (
                      <li
                        key={key}
                        className="text-sm font-medium"
                      >{`🌀 ${key}: ${value.toFixed(2)}%`}</li>
                    )
                  )}
                </ul>
              </div>
            ))
          )}
        </div>

        {/* Final Emotion */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700">
            🏁 Final Emotion
          </h2>
          <video controls className="w-full rounded-lg mt-4">
            <source src={finalEmotion.emotionDetectionVideo} type="video/mp4" />
          </video>
          <ul className="mt-4 text-gray-600">
            {Object.entries(finalEmotion.emotionAnalysis).map(
              ([key, value]) => (
                <li
                  key={key}
                  className="text-sm font-medium"
                >{`🌀 ${key}: ${value.toFixed(2)}%`}</li>
              )
            )}
          </ul>
        </div>
      </div>

      {/* Emotion Chart */}
      <div className="bg-white p-6 rounded-lg shadow-lg mt-8">
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
            <Line type="monotone" dataKey="happy" stroke="#ffcc00" />
            <Line type="monotone" dataKey="neutral" stroke="#8884d8" />
            <Line type="monotone" dataKey="surprise" stroke="#ff7300" />
            <Line type="monotone" dataKey="fear" stroke="#ff0000" />
            <Line type="monotone" dataKey="sad" stroke="#0033cc" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Puzzle Chart */}
      {puzzleData.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-lg mt-8">
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

      {/* Render Send Email Modal */}
      <SendEmailModal
        gameSessionId={id}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default FinalProgress;
