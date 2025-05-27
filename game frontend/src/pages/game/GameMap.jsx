import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import background from "./../../assets/public/background.png";
import story1day1 from "./../../assets/story/story1/day1.png";
import story1day2 from "./../../assets/story/story1/day2.png";
import story1day3 from "./../../assets/story/story1/day3.png";
import story1day4 from "./../../assets/story/story1/day4.png";
import story1day5 from "./../../assets/story/story1/day5.png";
import story1day6 from "./../../assets/story/story1/day6.png";
import story1day7 from "./../../assets/story/story1/day7.png";
import story2day1 from "./../../assets/story/story2/day1.png";
import story2day2 from "./../../assets/story/story2/day2.png";
import story2day3 from "./../../assets/story/story2/day3.png";
import story2day4 from "./../../assets/story/story2/day4.png";
import story2day5 from "./../../assets/story/story2/day5.png";
import story2day6 from "./../../assets/story/story2/day6.png";
import story2day7 from "./../../assets/story/story2/day7.png";
import story3day1 from "./../../assets/story/story3/day1.png";
import story3day2 from "./../../assets/story/story3/day2.png";
import story3day3 from "./../../assets/story/story3/day3.png";
import story3day4 from "./../../assets/story/story3/day4.png";
import story3day5 from "./../../assets/story/story3/day5.png";
import story3day6 from "./../../assets/story/story3/day6.png";
import story3day7 from "./../../assets/story/story3/day7.png";

// Mapping of game names to image sets
const gameImagesMapping = {
  story1Images: [story1day1, story1day2, story1day3, story1day4, story1day5, story1day6, story1day7],
  story2Images: [story2day1, story2day2, story2day3, story2day4, story2day5, story2day6, story2day7],
  story3Images: [story3day1, story3day2, story3day3, story3day4, story3day5, story3day6, story3day7],
};

// Text descriptions for each day
const textDescriptions = [
  "Welcome to Day 1! Solve this puzzle to begin your adventure.",
  "Day 2 - Keep going! Challenge yourself with this next puzzle.",
  "Day 3 - You're getting better! Solve this one to move ahead.",
  "Day 4 - Another fun challenge! Stay focused and complete it.",
  "Day 5 - Great job! Let's see how fast you can finish this puzzle.",
  "Day 6 - Almost there! This puzzle is trickier than before.",
  "Day 7 - Final puzzle! Complete it to finish the game!",
];

const GameMap = () => {
  const [mappingKey, setMappingKey] = useState("story1Images");
  const [loading, setLoading] = useState(true);
  const [puzzleRecords, setPuzzleRecords] = useState([]); // Track completed days
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch game info from API and set mapping key based on game name.
  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchGameInfo = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}game/puzzle-records/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const gameName = response.data.gameName || "";
        const records = response.data.puzzleRecords || [];

        setPuzzleRecords(records);

        if (gameName.toLowerCase().includes("story 1")) {
          setMappingKey("story1Images");
        } else if (gameName.toLowerCase().includes("story 2")) {
          setMappingKey("story2Images");
        } else if (gameName.toLowerCase().includes("story 3")) {
          setMappingKey("story3Images");
        } else {
          setMappingKey("story1Images");
        }

        // If all 7 days are completed, navigate to final page
        if (records.length >= 7) {
          navigate(`/emotion-final/${id}`);
        }
      } catch (error) {
        console.error("Error fetching game info:", error);
        setMappingKey("story1Images");
      } finally {
        setLoading(false);
      }
    };

    fetchGameInfo();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div>Loading...</div>
      </div>
    );
  }

  // Determine which day is the next available puzzle
  const currentDay = puzzleRecords.length; // Day 1 starts at index 0
  const images = gameImagesMapping[mappingKey] || gameImagesMapping.story1Images;
  const firstRow = images.slice(0, 4);
  const secondRow = images.slice(4);

  // Click handler for enabled days
  const handleClick = (dayIndex) => {
    if (dayIndex === currentDay) {
      const selectedImage = images[dayIndex];
      const selectedText = textDescriptions[dayIndex] || "Solve the puzzle!";
      navigate(`/play-game/${id}`, {
        state: { image: selectedImage, text: selectedText },
      });
    }
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center p-10"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full max-w-5xl">
        {/* First Row: 4 boxes */}
        <div className="flex justify-center mb-6 gap-6">
          {firstRow.map((img, index) => {
            const isClickable = index === currentDay;
            const isCompleted = index < currentDay;
            return (
              <div
                key={index}
                onClick={() => handleClick(index)}
                className={`w-60 h-60 rounded-lg shadow-xl flex flex-col items-center justify-center cursor-pointer transition-transform ${
                  isClickable ? "hover:scale-110" : "cursor-not-allowed"
                } ${isCompleted ? "" : "opacity-50 grayscale"}`}
              >
                <img
                  src={img}
                  alt={`Day ${index + 1}`}
                  className={`w-48 h-48 object-cover rounded-full border ${
                    isClickable ? "border-white" : "border-gray-400"
                  } mb-2`}
                />
                <div className={`font-bold ${isClickable ? "text-white" : "text-gray-400"}`}>
                  {`Day ${index + 1}`}
                </div>
              </div>
            );
          })}
        </div>

        {/* Second Row: 3 boxes, centered */}
        <div className="flex justify-center mb-6 gap-6">
          {secondRow.map((img, index) => {
            const dayIndex = index + 4;
            const isClickable = dayIndex === currentDay;
            const isCompleted = dayIndex < currentDay;
            return (
              <div
                key={index + 4}
                onClick={() => handleClick(dayIndex)}
                className={`w-60 h-60 rounded-lg shadow-xl flex flex-col items-center justify-center cursor-pointer transition-transform ${
                  isClickable ? "hover:scale-110" : "cursor-not-allowed"
                } ${isCompleted ? "" : "opacity-50 grayscale"}`}
              >
                <img
                  src={img}
                  alt={`Day ${dayIndex + 1}`}
                  className={`w-48 h-48 object-cover rounded-full border ${
                    isClickable ? "border-white" : "border-gray-400"
                  } mb-2`}
                />
                <div className={`font-bold ${isClickable ? "text-white" : "text-gray-400"}`}>
                  {`Day ${dayIndex + 1}`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GameMap;
